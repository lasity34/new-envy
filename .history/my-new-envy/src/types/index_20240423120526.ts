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

