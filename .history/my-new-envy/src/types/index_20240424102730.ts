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

export interface CartAction {
    type: string;
    payload: CartItem;
}

