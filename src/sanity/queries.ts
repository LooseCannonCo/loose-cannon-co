import { groq } from "next-sanity";

/**
 * GROQ queries for fetching content from Sanity. Add queries here as the
 * content model grows. Example:
 *
 *   export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc)`;
 */
export const placeholderQuery = groq`*[_type == "sanity.imageAsset"][0...0]`;
