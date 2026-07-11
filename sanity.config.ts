import { useToast } from "@sanity/ui";
import { visionTool } from "@sanity/vision";
import { defineConfig, type DocumentActionComponent } from "sanity";
import {
  defineDocuments,
  defineLocations,
  presentationTool,
} from "sanity/presentation";
import { structureTool, type StructureResolver } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemas";

// Document types pinned as singletons: one document each, fixed id, edited in
// place (not creatable repeatedly). homeHero curates the homepage hero deck.
const SINGLETONS = [
  { type: "homeHero", title: "Homepage hero" },
] as const;
const SINGLETON_TYPES = new Set<string>(SINGLETONS.map((s) => s.type));

// Wraps the built-in Publish action: publish behaves exactly as normal, plus
// a toast telling the editor the live site rebuilds itself and takes a couple
// of minutes. Editors otherwise hit Publish, check the site, see no change,
// and assume it broke.
function withPublishDelayNote(
  Original: DocumentActionComponent,
): DocumentActionComponent {
  const PublishWithNote: DocumentActionComponent = (props) => {
    const toast = useToast();
    const description = Original(props);
    if (!description) return description;
    return {
      ...description,
      onHandle: () => {
        description.onHandle?.();
        toast.push({
          status: "success",
          title: "Published. The site is rebuilding.",
          description:
            "Your change goes live on its own in about 2 to 3 minutes. Refresh the site after that to see it.",
          duration: 10000,
        });
      },
    };
  };
  PublishWithNote.action = Original.action;
  return PublishWithNote;
}

// Custom desk: surface each singleton as a single editable document, then the
// case studies under a plain-language label, then any other (non-singleton,
// non-caseStudy) document types added later.
const structure: StructureResolver = (S) =>
  S.list()
    .title("Website content")
    .items([
      ...SINGLETONS.map(({ type, title }) =>
        S.listItem()
          .title(title)
          .id(type)
          .child(S.document().schemaType(type).documentId(type)),
      ),
      S.divider(),
      S.documentTypeListItem("caseStudy").title("Case studies (work pages)"),
      ...S.documentTypeListItems().filter(
        (item) =>
          !SINGLETON_TYPES.has(item.getId() ?? "") &&
          item.getId() !== "caseStudy",
      ),
    ]);

export default defineConfig({
  name: "default",
  title: "Loose Cannon Co.",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Live preview: opens the real site in an iframe (desktop/mobile toggle
    // built in), enables Next draft mode via the route below, and draws
    // click-to-edit overlays on stega-marked content.
    presentationTool({
      title: "Live preview",
      previewUrl: {
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        // URL -> document: lets Presentation open the right case study when
        // an editor navigates the preview to /work/<slug>.
        mainDocuments: defineDocuments([
          {
            route: "/work/:slug",
            filter: `_type == "caseStudy" && slug.current == $slug`,
          },
        ]),
        // Document -> URLs: the "Used on this page" banner in the editor.
        locations: {
          caseStudy: defineLocations({
            select: { client: "client", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.client || "Case study",
                  href: `/work/${doc?.slug}`,
                },
                { title: "Work index", href: "/work" },
                { title: "Homepage (if featured)", href: "/" },
              ],
            }),
          }),
          homeHero: defineLocations({
            locations: [{ title: "Homepage", href: "/" }],
          }),
        },
      },
    }),
    // Vision is a raw GROQ query console: useful for developers, confusing
    // (and risky-looking) for editors. Only mount it in local dev.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
  // Belt-and-suspenders: hide the global "create new" action for singletons so
  // there can only ever be the one pinned document.
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => !SINGLETON_TYPES.has(t.templateId))
        : prev,
    actions: (prev, { schemaType }) => {
      const base = SINGLETON_TYPES.has(schemaType)
        ? prev.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : prev;
      // Wrap Publish so editors learn the site is not instant: a Sanity
      // webhook pings a Netlify build hook on publish, and the rebuild takes
      // a couple of minutes to go live.
      return base.map((a) =>
        a.action === "publish" ? withPublishDelayNote(a) : a,
      );
    },
  },
});
