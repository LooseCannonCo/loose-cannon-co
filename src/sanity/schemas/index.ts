import { type SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./caseStudy";
import homeHero from "./homeHero";

export const schemaTypes: SchemaTypeDefinition[] = [caseStudy, homeHero];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
