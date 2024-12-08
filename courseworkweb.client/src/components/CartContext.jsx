import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (userId, productId) => {
    try {
      
      if (!userId) throw new Error("User not logged in");

      let cartResponse = await axios.get(`http://localhost:5175/api/Carts/Client/${userId}`);
      if (cartResponse.status === 404) {
        cartResponse = await axios.post(`http://localhost:5175/api/Carts/Client/${userId}`);
      }

      const cartId = cartResponse.data.id;

      const existingItem = cartItems.find((item) => item.product.id === productId);
      if (existingItem) {
        // Обновить количество, если товар уже есть
        await updateCartItem(existingItem.id, existingItem.quantity + 1);
      } else {
        const response = await axios.post(`http://localhost:5175/api/CartItems/Cart/${cartId}`, {
          cartId: cartId,
          productId: productId,
          quantity: 1,
        });
        setCartItems((prev) => [...prev, response.data]);
        console.log("Product added to cart:", response.data);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5175/api/Carts/Client/${userId}`);
      if (response.data && Array.isArray(response.data.cartItems)) {
        setCartItems(response.data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const updateCartItem = async (itemId, newQuantity) => {

    if (newQuantity <= 0) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
  
      try {
        // Отправляем запрос на сервер для удаления товара из корзины
        const response = await axios.delete(
          `http://localhost:5175/api/CartItems/${itemId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.status === 200) {
          console.log("Cart item deleted successfully.");
        }
      } catch (error) {
        console.error('Error deleting cart item:', error);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
  
      try {
        const response = await axios.put(
          `http://localhost:5175/api/CartItems/${itemId}/quantity`,
          newQuantity,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        if (response.status === 200) {
          console.log("Cart item updated successfully.");
        }    
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    }
    
  };

  const clearCart = async (cartId) => {
    setCartItems([]);
    
    try {
      const response = await axios.delete(`http://localhost:5175/api/CartItems/Cart/AllDelete/${cartId}`);

      if (response.status === 200) {
        setCartItems([]);
      console.log('All items removed from the cart.');
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, fetchCartItems, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
