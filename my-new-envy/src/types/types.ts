// src/types.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    description: string;
}

export interface ProductCardProps {
    product: Product;
}

// Cart

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    imageUrl: string;
}

export interface SyncCartItem {
    product_id: string;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
}

export type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: { id: string } }
    | { type: 'ADJUST_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'LOAD_CART'; payload: CartItem[] }
    | { type: 'SET_ITEMS'; payload: CartItem[] }
    | { type: 'CLEAR_CART' };
