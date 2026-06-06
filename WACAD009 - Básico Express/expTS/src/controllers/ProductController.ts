import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Product } from '../interfaces/Product.js';

const FILE_PATH = path.join(
  process.cwd(),
  'src',
  'data',
  'products.json',
);

export default class ProductController {
  private static getProducts(): Product[] {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  }

  private static saveProducts(products: Product[]): void {
    fs.writeFileSync(
      FILE_PATH,
      JSON.stringify(products, null, 2),
    );
  }

  static list(req: Request, res: Response): void {
    const products = ProductController.getProducts();

    res.render('products/list', {
      products,
    });
  }

  static createForm(req: Request, res: Response): void {
    res.render('products/create');
  }

  static create(req: Request, res: Response): void {
    const products = ProductController.getProducts();

    const product: Product = {
      id: Date.now(),
      name: req.body.name,
      price: Number(req.body.price),
    };

    products.push(product);

    ProductController.saveProducts(products);

    res.redirect('/products');
  }

  static editForm(req: Request, res: Response): void {
    const products = ProductController.getProducts();

    const product = products.find(
      (p) => p.id === Number(req.params.id),
    );

    res.render('products/edit', {
      product,
    });
  }

  static update(req: Request, res: Response): void {
    const products = ProductController.getProducts();

    const index = products.findIndex(
      (p) => p.id === Number(req.params.id),
    );

    products[index].name = req.body.name;
    products[index].price = Number(req.body.price);

    ProductController.saveProducts(products);

    res.redirect('/products');
  }

  static delete(req: Request, res: Response): void {
    const products = ProductController.getProducts();

    const updated = products.filter(
      (p) => p.id !== Number(req.params.id),
    );

    ProductController.saveProducts(updated);

    res.redirect('/products');
  }
}