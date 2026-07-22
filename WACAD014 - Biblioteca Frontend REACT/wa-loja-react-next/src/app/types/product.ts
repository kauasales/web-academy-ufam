export type Product = {
    id: string;
    name: string; 
    images: {
        name: string;
        src: string;
    }[];
        price: string;
    rebate: number;
    description: string;
    sold: string;
    user_id: string; 
}