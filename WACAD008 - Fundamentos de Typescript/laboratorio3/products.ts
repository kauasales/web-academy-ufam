import { IProduct } from "./product.interface.js";

export class TV implements IProduct {
    constructor(
        private _id: string,
        private _model: string,
        private _resolution: string,
        private _sizeInInches: number,
        private _manufacturer: string,
        private _price: number
    ) {}

    get id() { return this._id; }
    get model() { return this._model; }
    get manufacturer() { return this._manufacturer; }
    get price() { return this._price; }
    get resolution() { return this._resolution; }
    get sizeInInches() { return this._sizeInInches; }

    getDescription(): string {
        return `TV ${this.manufacturer} ${this.model} ${this.sizeInInches}" (${this.resolution})`;
    }
}

export class CellPhone implements IProduct {
    constructor(
        private _id: string,
        private _model: string,
        private _memory: string,
        private _manufacturer: string,
        private _price: number
    ) {}

    get id() { return this._id; }
    get model() { return this._model; }
    get manufacturer() { return this._manufacturer; }
    get price() { return this._price; }
    get memory() { return this._memory; }

    getDescription(): string {
        return `Celular ${this.manufacturer} ${this.model} ${this.memory}`;
    }
}

export class Bicycle implements IProduct {
    constructor(
        private _id: string,
        private _model: string,
        private _rimSize: number,
        private _manufacturer: string,
        private _price: number
    ) {}

    get id() { return this._id; }
    get model() { return this._model; }
    get manufacturer() { return this._manufacturer; }
    get price() { return this._price; }
    get rimSize() { return this._rimSize; }

    getDescription(): string {
        return `Bicicleta ${this.manufacturer} ${this.model} (Aro ${this.rimSize})`;
    }
}