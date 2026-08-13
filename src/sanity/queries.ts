import { groq } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

/**
 * GROQ queries for fetching content from Sanity. Add queries here as the
 * content model grows. Example:
 *
 *   export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc)`;
 */
export const placeholderQuery = groq`*[_type == "sanity.imageAsset"][0...0]`;

/** Blog list for /blog: published posts, newest first. The client's
 *  "published" perspective already drops drafts, so no draft filter needed. */
export const getAllPosts = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  "slug": slug.current,
  title,
  summary,
  coverImage,
  author,
  publishedAt,
  cardSize
}`;

/** Full post by slug for /blog/[slug]. Uploaded videos in the body get the
 *  file asset URL + MIME type dereferenced (same pattern as the case study
 *  heroVideo) so the page can render a <video> directly. */
export const getPostBySlug = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  coverImage,
  author,
  publishedAt,
  body[]{
    ...,
    _type == "videoEmbed" => {
      ...,
      "fileUrl": file.asset->url,
      "mimeType": file.asset->mimeType
    }
  }
}`;

/** Cover and inline body images carry an editor-written alt alongside the
 *  standard Sanity image fields urlFor() consumes. */
export type PostImage = SanityImageSource & { alt?: string };

export interface PostListItem {
  slug: string;
  title: string;
  summary?: string;
  coverImage?: PostImage;
  author?: string;
  publishedAt?: string;
  /** Editor override for the blog list card: "auto" or a fixed size key. */
  cardSize?: string;
}

export interface Post {
  _id: string;
  slug: string;
  title: string;
  summary?: string;
  coverImage?: PostImage;
  author?: string;
  publishedAt?: string;
  body?: PortableTextBlock[];
}
