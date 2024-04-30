// src/types.ts


export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
}


export interface ProductCardProps {
    product: Product;
}

