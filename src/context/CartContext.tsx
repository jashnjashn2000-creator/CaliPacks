"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { lineTotalGbp } from "@/lib/product";
import { resolveSellable } from "@/lib/sellable";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "calipacks-cart-v2";

function minQty(product: Product, quantity: number) {
  const live = resolveSellable(product.id) ?? product;
  return Math.max(live.minOrder || 1, quantity);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: minQty(action.product, i.quantity + action.quantity) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { product: action.product, quantity: minQty(action.product, action.quantity) },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY": {
      const current = state.items.find((i) => i.product.id === action.productId);
      if (!current) return state;
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: minQty(i.product, action.quantity) }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        const items = parsed
          .filter((item) => item?.product?.id && item?.product?.image)
          .map((item) => ({
            ...item,
            quantity: minQty(item.product, item.quantity || 1),
          }));
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  // Overlay live catalogue prices and postage so the basket matches the worker.
  const items = state.items.flatMap((item) => {
    const product = resolveSellable(item.product.id);
    if (!product || product.hidden) return [];
    return [{ ...item, product }];
  });
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + lineTotalGbp(i.product, i.quantity), 0);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    ready: hydrated,
    addItem: (product, quantity = product.minOrder || 1) => {
      if (product.hidden || !resolveSellable(product.id)) return;
      dispatch({ type: "ADD_ITEM", product, quantity });
    },
    removeItem: (productId) =>
      dispatch({ type: "REMOVE_ITEM", productId }),
    updateQuantity: (productId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
