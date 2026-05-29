export interface IProduct {
    id: string;
    model: string;
    manufacturer: string;
    price: number;
    getDescription(): string;
}