import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private static PRODUCTS_URL = "http://localhost:8080/products";

  products: Product[];
  productsObservable: Observable<Product[]>;
  productsObserver: Subscriber<Product[]>;

  constructor(private http: HttpClient) {
    this.productsObservable = new Observable((observer) => {
      this.productsObserver = observer;
    });
  }

  getAllProducts(): Observable<Product[]> {
    if (!this.products) {
      this.http.get<Product[]>(ProductsService.PRODUCTS_URL).subscribe(
        (products) => {
          this.products = products;

          this.productsObserver.next(this.products);
        }
      );
    }

    return this.productsObservable;
  }

  createProduct(product: Product): void {
    this.http.post<string>(ProductsService.PRODUCTS_URL, product).subscribe(
      (id) => {
        product.id = id;
        this.products.push(product);
        this.productsObserver.next(this.products);
      }
    );
  }

  updateProduct(product: Product): void {
    this.http.put<void>(ProductsService.PRODUCTS_URL + '/' + product.id, product).subscribe();
  }

  deleteProduct(productId: string): void {
    this.http.delete<void>(ProductsService.PRODUCTS_URL  + '/' + productId).subscribe();
  }
}