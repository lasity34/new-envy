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
    imageUrl: string;
    stock: number;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
}

export type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: { id: string } }
    | { type: 'ADJUST_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'LOAD_CART'; payload: CartItem[] };
