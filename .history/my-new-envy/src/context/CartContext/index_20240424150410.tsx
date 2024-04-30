import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, CartAction } from '../../types/types';

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
}

interface CartProviderProps {
    children: ReactNode; // This type is for anything that can be rendered: numbers, strings, elements or an array (or fragment) containing these types.
}

const initialState: CartState = {
    items: [],
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
      case 'ADD_ITEM':
          const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
          if (existingItemIndex >= 0) {
              // Item exists, update the quantity
              const updatedItems = state.items.map((item, index) => {
                  if (index === existingItemIndex) {
                      return { ...item, quantity: item.quantity + action.payload.quantity };
                  }
                  return item;
              });
              return { ...state, items: updatedItems };
          } else {
              // Item does not exist, add it with the payload quantity
              return { ...state, items: [...state.items, { ...action.payload }] };
          }
      case 'REMOVE_ITEM':
          return {
              ...state,
              items: state.items.filter(item => item.id !== action.payload.id)
          };
      case 'ADJUST_QUANTITY':
          return {
              ...state,
              items: state.items.map(item => {
                  if (item.id === action.payload.id) {
                      return { ...item, quantity: Math.max(0, action.payload.quantity) }; // Ensuring quantity does not go negative
                  }
                  return item;
              })
          };
      default:
          return state;
  }
}


export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
