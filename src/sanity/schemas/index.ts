import { type SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./caseStudy";
import homeHero from "./homeHero";
import { post } from "./post";
import {
  shopifyCollection,
  shopifyProduct,
  shopifyProductVariant,
} from "./shopify";

export const schemaTypes: SchemaTypeDefinition[] = [
  caseStudy,
  homeHero,
  post,
  shopifyProduct,
  shopifyProductVariant,
  shopifyCollection,
];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
