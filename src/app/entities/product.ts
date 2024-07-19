export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: 'manual_car' | 'automatic_car' | 'truck' | 'motorcycle' | 'quad';
    image: string;
    duration: number;
}