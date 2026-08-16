"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Product } from "@/types/product";

type CartItem = {
  product: Product;
  size: Product["sizes"][number];
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addToCart: (
    product: Product,
    size: Product["sizes"][number],
    quantity?: number,
  ) => void;
  removeFromCart: (productId: string, size: Product["sizes"][number]) => void;
  updateQuantity: (
    productId: string,
    size: Product["sizes"][number],
    quantity: number,
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "blackheadfashion-cart";

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isValidProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  const validComparePrice =
    product.comparePrice === undefined ||
    (typeof product.comparePrice === "number" &&
      Number.isFinite(product.comparePrice) &&
      product.comparePrice >= 0);

  const validCollection =
    product.collection === undefined || typeof product.collection === "string";

  const validGender =
    product.gender === "Men" ||
    product.gender === "Women" ||
    product.gender === "Kids";

  return (
    typeof product.id === "string" &&
    product.id.length > 0 &&
    typeof product.name === "string" &&
    product.name.length > 0 &&
    typeof product.slug === "string" &&
    product.slug.length > 0 &&
    typeof product.description === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    validComparePrice &&
    typeof product.brand === "string" &&
    typeof product.category === "string" &&
    validGender &&
    validCollection &&
    isStringArray(product.sizes) &&
    isStringArray(product.colors) &&
    isStringArray(product.images) &&
    product.images.length > 0 &&
    typeof product.stock === "number" &&
    Number.isInteger(product.stock) &&
    product.stock >= 0 &&
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    product.rating >= 0 &&
    product.rating <= 5 &&
    typeof product.reviewCount === "number" &&
    Number.isInteger(product.reviewCount) &&
    product.reviewCount >= 0 &&
    typeof product.isFeatured === "boolean" &&
    typeof product.isNewArrival === "boolean" &&
    typeof product.isTrending === "boolean" &&
    typeof product.isOnSale === "boolean"
  );
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const cartItem = item as Record<string, unknown>;

  if (!isValidProduct(cartItem.product)) {
    return false;
  }

  if (
    typeof cartItem.size !== "string" ||
    !cartItem.product.sizes.includes(cartItem.size)
  ) {
    return false;
  }

  if (
    typeof cartItem.quantity !== "number" ||
    !Number.isFinite(cartItem.quantity) ||
    !Number.isInteger(cartItem.quantity) ||
    cartItem.quantity <= 0
  ) {
    return false;
  }

  return true;
}

function normalizeQuantity(quantity: number): number | null {
  if (!Number.isFinite(quantity)) {
    return null;
  }

  const normalized = Math.floor(quantity);

  if (normalized <= 0) {
    return null;
  }

  return normalized;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        setIsHydrated(true);
        return;
      }

      const parsedCart: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        localStorage.removeItem(CART_STORAGE_KEY);
        setItems([]);
        setIsHydrated(true);
        return;
      }

      const validItems = parsedCart.filter(isValidCartItem);

      setItems(validItems);

      if (validItems.length !== parsedCart.length) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);

      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (storageError) {
        console.error("Failed to clear invalid cart storage:", storageError);
      }

      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [items, isHydrated]);

  const addToCart = useCallback(
    (product: Product, size: Product["sizes"][number], quantity = 1) => {
      if (!product.sizes.includes(size)) {
        console.error("Cannot add unavailable size to cart.", {
          product: product.id,
          size,
        });
        return;
      }

      const normalizedQuantity = normalizeQuantity(quantity);

      if (normalizedQuantity === null) {
        return;
      }

      if (product.stock <= 0) {
        return;
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.size === size,
        );

        if (existingItem) {
          const nextQuantity = Math.min(
            existingItem.quantity + normalizedQuantity,
            product.stock,
          );

          return currentItems.map((item) =>
            item.product.id === product.id && item.size === size
              ? {
                  ...item,
                  product,
                  size,
                  quantity: nextQuantity,
                }
              : item,
          );
        }

        return [
          ...currentItems,
          {
            product,
            size,
            quantity: Math.min(normalizedQuantity, product.stock),
          },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (productId: string, size: Product["sizes"][number]) => {
      setItems((currentItems) =>
        currentItems.filter(
          (item) => !(item.product.id === productId && item.size === size),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: Product["sizes"][number], quantity: number) => {
      const normalizedQuantity = normalizeQuantity(quantity);

      if (normalizedQuantity === null) {
        removeFromCart(productId, size);
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) => {
          if (item.product.id !== productId || item.size !== size) {
            return item;
          }

          const maxQuantity = Math.max(item.product.stock, 1);

          return {
            ...item,
            quantity: Math.min(normalizedQuantity, maxQuantity),
          };
        }),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      itemCount,
      subtotal,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
