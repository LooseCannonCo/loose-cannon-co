import { type SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./caseStudy";

export const schemaTypes: SchemaTypeDefinition[] = [caseStudy];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
