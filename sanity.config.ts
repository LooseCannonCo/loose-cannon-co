import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemas";

// Document types pinned as singletons: one document each, fixed id, edited in
// place (not creatable repeatedly). homeHero curates the homepage hero deck.
const SINGLETONS = [
  { type: "homeHero", title: "Homepage hero" },
] as const;
const SINGLETON_TYPES = new Set<string>(SINGLETONS.map((s) => s.type));

// Custom desk: surface each singleton as a single editable document, then list
// every other (non-singleton) document type as usual.
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map(({ type, title }) =>
        S.listItem()
          .title(title)
          .id(type)
          .child(S.document().schemaType(type).documentId(type)),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
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
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  // Belt-and-suspenders: hide the global "create new" action for singletons so
  // there can only ever be the one pinned document.
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => !SINGLETON_TYPES.has(t.templateId))
        : prev,
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : prev,
  },
});
