import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, CartState, CartAction } from '../../types/types';

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
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    items: state.items.map(item =>
                        item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                };
            }
            return { items: [...state.items, { ...action.payload, quantity: 1 }] };
        case 'REMOVE_ITEM':
            return { items: state.items.filter(item => item.id !== action.payload.id) };
        case 'ADJUST_QUANTITY':
            return {
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
                ),
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
