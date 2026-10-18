/* Storefront API operations. Only products published to the Headless sales
 * channel come back from these queries. */

const IMAGE = /* GraphQL */ `
  fragment Img on Image {
    url
    altText
    width
    height
  }
`;

const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      ...Img
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${IMAGE}
  ${PRODUCT_CARD}
  query ShopProducts {
    products(first: 100, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;

export const PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query ShopProductHandles {
    products(first: 250) {
      nodes {
        handle
      }
    }
  }
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  ${IMAGE}
  ${PRODUCT_CARD}
  query ShopProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductCardFields
      description
      descriptionHtml
      options {
        name
        optionValues {
          name
        }
      }
      images(first: 12) {
        nodes {
          ...Img
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            ...Img
          }
        }
      }
    }
  }
`;

const CART = /* GraphQL */ `
  ${IMAGE}
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              ...Img
            }
            selectedOptions {
              name
              value
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART}
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

export const CART_CREATE = /* GraphQL */ `
  ${CART}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

export const CART_LINES_ADD = /* GraphQL */ `
  ${CART}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE = /* GraphQL */ `
  ${CART}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE = /* GraphQL */ `
  ${CART}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;
