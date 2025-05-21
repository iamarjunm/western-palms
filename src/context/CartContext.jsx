// context/CartContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // addToCart still needs the initial stock from product page for initial validation
  const addToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.variantId === productToAdd.variantId);

      const quantityToAdd = productToAdd.quantity && productToAdd.quantity > 0 ? productToAdd.quantity : 1;

      if (existingItemIndex > -1) {
        const existingItem = prevCart[existingItemIndex];
        const newQuantity = existingItem.quantity + quantityToAdd;

        // Use the stock that came with productToAdd for initial add/increment check
        if (newQuantity > productToAdd.stock) {
          alert(`Cannot add more. Only ${productToAdd.stock} of "${productToAdd.title}" available.`);
          return prevCart;
        }

        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantityToAdd > productToAdd.stock) {
          alert(`Cannot add ${quantityToAdd}. Only ${productToAdd.stock} of "${productToAdd.title}" available.`);
          return prevCart;
        }
        // When adding new, store the initial stock and product ID
        return [...prevCart, { ...productToAdd, quantity: quantityToAdd, stock: productToAdd.stock, productId: productToAdd.id }];
      }
    });
  };

  const removeFromCart = (variantId) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantId !== variantId));
  };

  // Modified updateQuantity to accept 'fetchedStock'
  const updateQuantity = (variantId, newQuantity, fetchedStock) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.variantId === variantId) {
          const itemActualStock = fetchedStock !== undefined ? fetchedStock : item.stock; // Use fetchedStock if available, otherwise original item.stock

          const safeQuantity = Math.max(0, newQuantity); // Ensure not negative

          if (safeQuantity > itemActualStock) {
            alert(`Cannot set quantity to ${safeQuantity}. Only ${itemActualStock} of "${item.title}" available.`);
            // Return item with quantity clamped to itemActualStock, but don't remove if 0
            return { ...item, quantity: itemActualStock };
          }

          return { ...item, quantity: safeQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove item if quantity becomes 0
    });
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};