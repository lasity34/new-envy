import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

interface SyncedCartItem {
  id: number;
  quantity: number;
  product_id: number;
  product_name: string;
  price: string;
  imageurl: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'ADJUST_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  adjustQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearLocalCart: () => void;
  mergeAnonymousCartWithUserCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
    case 'ADJUST_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode; user: User | null }> = ({ children, user }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    const savedItems = localStorage.getItem('cartItems');
    return { items: savedItems ? JSON.parse(savedItems) : [] };
  });

  const fetchCartFromServer = useCallback(async () => {
    if (user) {
      try {
        const response = await axios.get<SyncedCartItem[]>(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const cartItems: CartItem[] = response.data.map(item => ({
          id: item.product_id.toString(),
          name: item.product_name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          imageUrl: item.imageurl,
          stock: item.stock
        }));
        dispatch({ type: 'SET_ITEMS', payload: cartItems });
      } catch (error) {
        console.error('CartContext - Failed to fetch cart from server:', error);
      }
    }
  }, [user]);

  const mergeAnonymousCartWithUserCart = useCallback(async () => {
    if (user) {
      const anonymousCartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (anonymousCartItems.length > 0) {
        try {
         
          const response = await axios.post<SyncedCartItem[]>(
            `${process.env.REACT_APP_API_URL}/api/cart/merge`,
            { items: anonymousCartItems },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
        
  
          const mergedItems: CartItem[] = response.data.map(item => ({
            id: item.product_id.toString(),
            name: item.product_name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            imageUrl: item.imageurl,
            stock: item.stock
          }));
  
          dispatch({ type: 'SET_ITEMS', payload: mergedItems });
          localStorage.removeItem('cartItems'); // Clear anonymous cart after merging
        } catch (error) {
          console.error('CartContext - Failed to merge carts:', error);
        }
      } else {
        await fetchCartFromServer();
      }
    }
  }, [user, fetchCartFromServer]);
  
  useEffect(() => {
    if (user) {
      const anonymousCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (anonymousCartItems.length > 0) {
        mergeAnonymousCartWithUserCart();
      } else {
        fetchCartFromServer();
      }
    } else {
      const savedItems = localStorage.getItem('cartItems');
      if (savedItems) {
        dispatch({ type: 'SET_ITEMS', payload: JSON.parse(savedItems) });
      }
    }
  }, [user, mergeAnonymousCartWithUserCart, fetchCartFromServer]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = useCallback(async (item: CartItem) => {
    console.log('CartContext - Adding item to cart:', item);
    dispatch({ type: 'ADD_ITEM', payload: item });
    localStorage.setItem('cartItems', JSON.stringify([...state.items, item]));
    if (user) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
          id: item.id,
          quantity: item.quantity
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('CartContext - Failed to add item to cart:', error);
        dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
        localStorage.setItem('cartItems', JSON.stringify(state.items.filter(i => i.id !== item.id)));
      }
    }
  }, [user, state.items]);

  const removeFromCart = useCallback(async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    localStorage.setItem('cartItems', JSON.stringify(state.items.filter(item => item.id !== id)));
    if (user) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        const item = state.items.find(item => item.id === id);
        if (item) {
          dispatch({ type: 'ADD_ITEM', payload: item });
          localStorage.setItem('cartItems', JSON.stringify([...state.items, item]));
        }
      }
    }
  }, [user, state.items]);
  
  const adjustQuantity = useCallback(async (id: string, quantity: number) => {
    dispatch({ type: 'ADJUST_QUANTITY', payload: { id, quantity } });
    localStorage.setItem('cartItems', JSON.stringify(state.items.map(item => 
      item.id === id ? { ...item, quantity } : item
    )));
    if (user) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, { quantity }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('Failed to adjust quantity:', error);
        const item = state.items.find(item => item.id === id);
        if (item) {
          dispatch({ type: 'ADJUST_QUANTITY', payload: { id, quantity: item.quantity } });
          localStorage.setItem('cartItems', JSON.stringify(state.items));
        }
      }
    }
  }, [user, state.items]);

  const clearLocalCart = useCallback(() => {
    console.log('CartContext - Clearing local cart');
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cartItems');
  }, []);
  
  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('CartContext - Failed to clear cart:', error);
        }
      }
    }
    localStorage.removeItem('cartItems');
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch,
      addToCart, 
      removeFromCart, 
      adjustQuantity, 
      clearCart,
      clearLocalCart,
      mergeAnonymousCartWithUserCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};