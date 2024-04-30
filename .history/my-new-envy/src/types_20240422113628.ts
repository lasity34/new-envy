// src/types.ts


export interface Product {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}


export interface ProductCardProps {
    product: Product;
}

// export interface ProductCardProps {
//     product: Product;
// }
