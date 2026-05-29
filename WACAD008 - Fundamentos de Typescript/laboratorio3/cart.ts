import { IProduct } from "./product.interface.js";

export class Cart<T extends IProduct> {
    private _items: T[] = [];

    constructor(private onUpdateUI: () => void) {}

    get items(): T[] {
        return [...this._items];
    }

    public addItem(item: T): void {
        this._items.push(item);
        this.onUpdateUI();
    }

    public removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.onUpdateUI();
    }

    public getTotalItems(): number {
        return this._items.length;
    }

    public getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + item.price, 0);
    }
}