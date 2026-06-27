import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("go-girl-cart");
    return saved ? JSON.parse(saved) : [];
  });

  const saveCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("go-girl-cart", JSON.stringify(newItems));
  }, []);

  const addToCart = useCallback(
    (product: Product, size: string, color: string) => {
      const existing = items.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existing) {
        saveCart(
          items.map((item) =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        saveCart([...items, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
      }
    },
    [items, saveCart]
  );

  const removeFromCart = useCallback(
    (productId: string, size: string, color: string) => {
      saveCart(
        items.filter(
          (item) =>
            !(item.product.id === productId &&
              item.selectedSize === size &&
              item.selectedColor === color)
        )
      );
    },
    [items, saveCart]
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size, color);
        return;
      }
      saveCart(
        items.map((item) =>
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
            ? { ...item, quantity }
            : item
        )
      );
    },
    [items, saveCart, removeFromCart]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
