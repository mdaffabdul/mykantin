import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (item) => {
    // Generate unique ID based on itemId, spice level, toppings, and notes
    const toppingsKey = item.selectedToppings
      .map((t) => t.name)
      .sort()
      .join(",");
    const uniqueId = `${item.menuItemId}-${item.spiceLevel || "Medium"}-${toppingsKey}-${item.notes || ""}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === uniqueId);

      if (existingItemIndex > -1) {
        // Item exists, update quantity and total
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        
        // Calculate new itemTotal
        const toppingsCost = existingItem.selectedToppings.reduce((sum, t) => sum + t.price, 0);
        const singlePrice = existingItem.price + toppingsCost;
        
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          itemTotal: singlePrice * newQuantity,
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add it
        return [...prevCart, { ...item, id: uniqueId }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;

            const toppingsCost = item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
            const singlePrice = item.price + toppingsCost;

            return {
              ...item,
              quantity: newQty,
              itemTotal: singlePrice * newQty,
            };
          }
          return item;
        })
        .filter((item) => item !== null);
    });
  };

  const checkout = () => {
    if (!user) {
      return { success: false, message: "Silakan login terlebih dahulu." };
    }

    const totalCost = cart.reduce((sum, item) => sum + item.itemTotal, 0);
    const totalCostIDR = totalCost * 1000;

    if (user.balance < totalCostIDR) {
      return { success: false, message: "Saldo tidak mencukupi untuk melakukan pemesanan." };
    }

    // Award loyalty points
    const pointsEarned = Math.floor(totalCost);

    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        balance: prevUser.balance - totalCostIDR,
        points: prevUser.points + pointsEarned,
      };
    });

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: [...cart],
      total: totalCost,
      status: "Selesai",
    };

    setOrderHistory((prevHistory) => [newOrder, ...prevHistory]);
    setCart([]); // Clear cart

    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        orderHistory,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        checkout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
