// src/data.ts
import { Product } from "./types";

export const products: Product[] = [
    {
        id: 'cap-alabaster-gleam',
        name: 'Alabaster Gleam',
        imageUrl: '/images/white-cap.png',
        price: 319,
        stock: 10
    },
    {
        id: 'cap-azure-dream',
        name: 'Azure Dream',
        imageUrl: '/images/blue-cap.png',
        price: 299,
        stock: 10
    },
    {
        id: 'cap-sunlit-horizon',
        name: 'Sunlit Horizon',
        imageUrl: '/images/black-cap.png',
        price: 349,
        stock: 10
    },
  
    {
        id: 'cap-envy',
        name: 'Envy',
        imageUrl: '/images/dark-blue-cap.png',
        price: 279,
        stock: 10
    }
];
