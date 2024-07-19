import { Product } from './product';

export interface Order {
    _id?: string;
    items: Product[];
    total: number;
    shipping_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
}
