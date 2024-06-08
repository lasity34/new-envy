import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartState, CartAction, CartItem } from '../../types/types';

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    clearCart: () => void; // Add clearCart to the context type
}

interface CartProviderProps {
    children: ReactNode; // This type is for anything that can be rendered: numbers, strings, elements or an array (or fragment) containing these types.
}

const initialState: CartState = {
    items: JSON.parse(localStorage.getItem('cartItems') || '[]'), // Initialize with localStorage data if available
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
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                return { ...state, items: updatedItems };
            } else {
                // Item does not exist, add it with the payload quantity
                const updatedItems = [...state.items, { ...action.payload }];
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                return { ...state, items: updatedItems };
            }
        case 'REMOVE_ITEM':
            const filteredItems = state.items.filter(item => item.id !== action.payload.id);
            localStorage.setItem('cartItems', JSON.stringify(filteredItems));
            return {
                ...state,
                items: filteredItems
            };
        case 'ADJUST_QUANTITY':
            const adjustedItems = state.items.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, quantity: Math.max(0, action.payload.quantity) }; // Ensuring quantity does not go negative
                }
                return item;
            });
            localStorage.setItem('cartItems', JSON.stringify(adjustedItems));
            return {
                ...state,
                items: adjustedItems
            };
        case 'LOAD_CART':
            return {
                ...state,
                items: action.payload,
            };
        default:
            return state;
    }
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart items from localStorage when the component mounts
    useEffect(() => {
        const cartData = localStorage.getItem('cartItems');
        if (cartData) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(cartData) });
        }
    }, []);

    // Define the clearCart function
    const clearCart = () => {
        dispatch({ type: 'LOAD_CART', payload: [] });
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ state, dispatch, clearCart }}>
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
