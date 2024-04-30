import React, { createContext, useContext, useReducer } from 'react';

// Define the context
const CartContext = createContext();

// Initial state of the cart
const initialState = {
  items: [], // This will hold items and their quantities
};

// Reducer function to handle cart updates
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if the item is already in the cart
      const exist = state.items.find(item => item.id === action.payload.id);
      if (exist) {
        // Increase the quantity
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case 'ADJUST_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    default:
      return state;
  }
}

// Context Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context in other components
export const useCart = () => useContext(CartContext);

// Ensure the file is treated as a module
export {};
