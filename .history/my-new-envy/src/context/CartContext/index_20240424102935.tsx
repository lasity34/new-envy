import React, { createContext, useContext, useReducer } from 'react';
import { CartState, CartAction, CartItem } from '../types';

// Define the context type explicitly
interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
}

// Initial state for the cart
const initialState: CartState = {
    items: [],
};

// Create the context with initial undefined value requiring checks or a fallback
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer function to update the state based on the action
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item),
                };
            }
            return { items: [...state.items, { ...action.payload, quantity: 1 }] };
        case 'REMOVE_ITEM':
            return { items: state.items.filter(item => item.id !== action.payload.id) };
        case 'ADJUST_QUANTITY':
            return {
                items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item),
            };
        default:
            return state;
    }
}

// Provider component that wraps children with the CartContext provider
export const CartProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context safely
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
