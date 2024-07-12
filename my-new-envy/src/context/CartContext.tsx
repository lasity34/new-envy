import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

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
  syncLocalCartWithDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('Cart Reducer - Action:', action.type, 'Payload:', 'payload' in action ? action.payload : 'No payload');
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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { user } = useUser();

  useEffect(() => {
    const savedItems = localStorage.getItem('cartItems');
    console.log('CartContext - Loading items from localStorage:', savedItems);
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      if (parsedItems.length > 0) {
        dispatch({ type: 'SET_ITEMS', payload: parsedItems });
      }
    }
  }, []);

  useEffect(() => {
    console.log('CartContext - Saving items to localStorage:', state.items);
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('CartContext - Current token:', token ? 'exists' : 'not found');
  }, [user]);

  const fetchCartFromServer = useCallback(async () => {
    if (user) {
      try {
        console.log('CartContext - Fetching cart from server');
        const response = await axios.get<SyncedCartItem[]>(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('CartContext - Server response:', response.data);
        if (response.data.length > 0) {
          const cartItems: CartItem[] = response.data.map(item => ({
            id: item.product_id.toString(),
            name: item.product_name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            imageUrl: item.imageurl,
            stock: item.stock
          }));
          dispatch({ type: 'SET_ITEMS', payload: cartItems });
        }
      } catch (error) {
        console.error('CartContext - Failed to fetch cart from server:', error);
      }
    }
  }, [user]);

  const syncLocalCartWithDatabase = useCallback(async () => {
    if (user) {
      try {
        console.log('CartContext - Syncing local cart with database');
        const localItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
        console.log('Local items before sync:', localItems);
        
        if (localItems.length > 0) {
          // Only sync if there are local items
          const response = await axios.post<SyncedCartItem[]>(`${process.env.REACT_APP_API_URL}/api/cart/sync`, 
            { items: localItems.map(item => ({ id: item.id, quantity: item.quantity })) },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          console.log('Server response:', response.data);
  
          const payload = response.data.map(item => ({
            id: item.product_id.toString(),
            name: item.product_name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            imageUrl: item.imageurl,
            stock: item.stock
          }));
  
          console.log('Items after sync:', payload);
          if (payload.length > 0) {
            dispatch({ type: 'SET_ITEMS', payload });
          }
        } else {
          // If no local items, fetch from server
          await fetchCartFromServer();
        }
      } catch (error) {
        console.error('CartContext - Failed to sync cart with database:', error);
      }
    }
  }, [user, fetchCartFromServer]);

  const addToCart = useCallback(async (item: CartItem) => {
    console.log('CartContext - Adding item to cart:', item);
    if (user) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
          id: item.id,
          quantity: item.quantity
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        await fetchCartFromServer();
      } catch (error) {
        console.error('CartContext - Failed to add item to cart:', error);
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  }, [user, fetchCartFromServer]);

  const removeFromCart = useCallback(async (id: string) => {
    console.log('CartContext - Removing item from cart:', id);
    if (user) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        await fetchCartFromServer();
      } catch (error) {
        console.error('CartContext - Failed to remove item from cart:', error);
      }
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    }
  }, [user, fetchCartFromServer]);

  const adjustQuantity = useCallback(async (id: string, quantity: number) => {
    console.log('CartContext - Adjusting quantity:', id, quantity);
    if (user) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, { quantity }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        await fetchCartFromServer();
      } catch (error) {
        console.error('CartContext - Failed to adjust quantity:', error);
      }
    } else {
      dispatch({ type: 'ADJUST_QUANTITY', payload: { id, quantity } });
    }
  }, [user, fetchCartFromServer]);

  const clearLocalCart = useCallback(() => {
    console.log('CartContext - Clearing local cart');
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cartItems');
  }, []);

  const clearCart = useCallback(async () => {
    console.log('CartContext - Clearing cart');
    if (user) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        dispatch({ type: 'CLEAR_CART' });
      } catch (error) {
        console.error('CartContext - Failed to clear cart:', error);
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('cartItems');
    }
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
      syncLocalCartWithDatabase 
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