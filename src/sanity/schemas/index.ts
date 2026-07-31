import { type SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./caseStudy";
import homeHero from "./homeHero";
import { post } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [caseStudy, homeHero, post];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
