import { type SchemaTypeDefinition } from "sanity";

/**
 * Document and object schema types live here. Add definitions to the array as
 * the content model grows, e.g.:
 *
 *   import { project } from "./project";
 *   export const schemaTypes = [project];
 */
export const schemaTypes: SchemaTypeDefinition[] = [];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
