export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopImage | null;
}

export interface ProductOption {
  name: string;
  optionValues: { name: string }[];
}

/** Lean shape for the /shop grid. */
export interface ProductCard {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: ShopImage | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
}

/** Full shape for /shop/[handle]. */
export interface Product extends ProductCard {
  descriptionHtml: string;
  description: string;
  options: ProductOption[];
  images: { nodes: ShopImage[] };
  variants: { nodes: ProductVariant[] };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: ShopImage | null;
    selectedOptions: SelectedOption[];
    product: { handle: string; title: string };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: { nodes: CartLine[] };
}
