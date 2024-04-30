// src/data.ts
import { Product } from "../types/types";

export const products: Product[] = [
    {
        id: 'cap-alabaster-gleam',
        name: 'Alabaster Gleam',
        imageUrl: '/images/white-cap.png',
        price: 319,
        stock: 10,
        description: 'A pristine white cap designed for the pure at heart and bold in spirit. Perfect for adding a touch of elegance to any outfit.'
    },
    {
        id: 'cap-azure-dream',
        name: 'Azure Dream',
        imageUrl: '/images/blue-cap.png',
        price: 299,
        stock: 30,
        description: 'Dive into the depths of comfort with our Azure Dream cap, featuring a rich blue hue that evokes the serene essence of the ocean.'
    },
    {
        id: 'cap-sunlit-horizon',
        name: 'Sunlit Horizon',
        imageUrl: '/images/black-cap.png',
        price: 349,
        stock: 20,
        description: 'Embrace the mystery of the night with the Sunlit Horizon cap, offering unparalleled style and comfort under the stars.'
    },
    {
        id: 'cap-envy',
        name: 'Envy',
        imageUrl: '/images/dark-blue-cap.png',
        price: 279,
        stock: 15,
        description: 'Inspire envy with this captivating dark blue cap, designed for those who dare to stand out from the crowd.'
    }
];
