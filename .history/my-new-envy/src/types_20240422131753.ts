// src/types.ts


export interface Product {
    id: string;
    name: string;
    price: string;
    imageUrl: string;

}


export interface ProductCardProps {
    product: Product;
}

