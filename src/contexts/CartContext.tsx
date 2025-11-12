"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products";

export interface CartItem extends Product {
  quantity: number;
  customization?: {
    type: "print" | "embroidery" | "premium";
    text?: string;
    price: number;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: CartItem["customization"]) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1, customization?: CartItem["customization"]) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization));

      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization) ? { ...item, quantity: item.quantity + quantity } : item));
      }

      return [...prevItems, { ...product, quantity, customization }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d]/g, ""));
      const customizationPrice = item.customization?.price || 0;
      return total + (price + customizationPrice) * item.quantity;
    }, 0);
  };

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
