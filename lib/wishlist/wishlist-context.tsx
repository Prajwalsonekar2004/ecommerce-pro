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

interface WishlistContextType {
  items: Product[];
  itemCount: number;
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_STORAGE_KEY = "blackheadfashion-wishlist";

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

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

      if (!savedWishlist) {
        setIsHydrated(true);
        return;
      }

      const parsedWishlist: unknown = JSON.parse(savedWishlist);

      if (!Array.isArray(parsedWishlist)) {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        setItems([]);
        setIsHydrated(true);
        return;
      }

      const validProducts = parsedWishlist.filter(isValidProduct);

      const uniqueProducts = validProducts.filter(
        (product, index, array) =>
          array.findIndex((item) => item.id === product.id) === index,
      );

      setItems(uniqueProducts);

      if (uniqueProducts.length !== parsedWishlist.length) {
        localStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(uniqueProducts),
        );
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);

      try {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      } catch (storageError) {
        console.error(
          "Failed to clear invalid wishlist storage:",
          storageError,
        );
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
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((product) => product.id === productId);
    },
    [items],
  );

  const addToWishlist = useCallback((product: Product) => {
    if (!isValidProduct(product)) {
      console.error("Cannot add invalid product to wishlist.", product);
      return;
    }

    setItems((currentItems) => {
      const alreadyExists = currentItems.some((item) => item.id === product.id);

      if (alreadyExists) {
        return currentItems;
      }

      return [...currentItems, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((product) => product.id !== productId),
    );
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    if (!isValidProduct(product)) {
      console.error("Cannot toggle invalid product in wishlist.", product);
      return;
    }

    setItems((currentItems) => {
      const exists = currentItems.some((item) => item.id === product.id);

      if (exists) {
        return currentItems.filter((item) => item.id !== product.id);
      }

      return [...currentItems, product];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;

  const value = useMemo<WishlistContextType>(
    () => ({
      items,
      itemCount,
      isHydrated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [
      items,
      itemCount,
      isHydrated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
