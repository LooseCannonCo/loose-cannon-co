"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storefrontFetch } from "@/shopify/client";
import { isShopifyConfigured } from "@/shopify/env";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_QUERY,
} from "@/shopify/queries";
import type { Cart } from "@/shopify/types";

/* The cart lives in Shopify. The browser only remembers its id, so a visitor
 * who leaves and comes back finds their cart where they left it. Storage can
 * be blocked (private windows), so every read and write is guarded and the
 * cart still works for the session without it. */
const STORAGE_KEY = "lc-cart-id";

function readCartId(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeCartId(id: string | null) {
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: cart still works in memory */
  }
}

type MutationResult = { cart: Cart | null; userErrors: { message: string }[] };

interface CartContextValue {
  enabled: boolean;
  cart: Cart | null;
  count: number;
  busy: boolean;
  error: string | null;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Restore a returning visitor's cart. A cart that Shopify no longer knows
  // (checked out, expired) comes back null, so we forget it.
  useEffect(() => {
    if (!isShopifyConfigured) return;
    const id = readCartId();
    if (!id) return;
    storefrontFetch<{ cart: Cart | null }>(CART_QUERY, { id })
      .then(({ cart: found }) => {
        if (found && found.totalQuantity > 0) setCart(found);
        else if (!found) writeCartId(null);
      })
      .catch(() => {
        /* network hiccup: start fresh, keep the id for next visit */
      });
  }, []);

  const run = useCallback(
    async (fn: () => Promise<MutationResult>): Promise<boolean> => {
      setBusy(true);
      setError(null);
      try {
        const { cart: next, userErrors } = await fn();
        if (userErrors.length) throw new Error(userErrors[0].message);
        if (next) {
          setCart(next);
          writeCartId(next.id);
        }
        return true;
      } catch {
        setError("That didn't go through. Give it another try.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      const lines = [{ merchandiseId: variantId, quantity }];
      const ok = await run(async () => {
        if (cart) {
          const d = await storefrontFetch<{ cartLinesAdd: MutationResult }>(
            CART_LINES_ADD,
            { cartId: cart.id, lines },
          );
          return d.cartLinesAdd;
        }
        const d = await storefrontFetch<{ cartCreate: MutationResult }>(
          CART_CREATE,
          { lines },
        );
        return d.cartCreate;
      });
      // Show the cart so the visitor sees it landed. On failure, stay put:
      // the product form shows the error next to the button.
      if (ok) setIsOpen(true);
    },
    [cart, run],
  );

  const updateLine = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      await run(async () => {
        const d = await storefrontFetch<{ cartLinesUpdate: MutationResult }>(
          CART_LINES_UPDATE,
          { cartId: cart.id, lines: [{ id: lineId, quantity }] },
        );
        return d.cartLinesUpdate;
      });
    },
    [cart, run],
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      await run(async () => {
        const d = await storefrontFetch<{ cartLinesRemove: MutationResult }>(
          CART_LINES_REMOVE,
          { cartId: cart.id, lineIds: [lineId] },
        );
        return d.cartLinesRemove;
      });
    },
    [cart, run],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      enabled: isShopifyConfigured,
      cart,
      count: cart?.totalQuantity ?? 0,
      busy,
      error,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      updateLine,
      removeLine,
    }),
    [cart, busy, error, isOpen, addItem, updateLine, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}
