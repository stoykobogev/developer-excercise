import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private static PRODUCTS_URL = "http://localhost:8080/products";

  products: Product[];
  productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    if (!this.products) {
      this.http.get<Product[]>(ProductsService.PRODUCTS_URL).subscribe(
        (products) => {
          this.products = products;

          this.productsSubject.next(this.products);
        },
        this.errorHandler
      );
    }
    
    return this.productsSubject;
  }

  createProduct(product: Product): void {
    this.http.post(ProductsService.PRODUCTS_URL, product, { responseType: 'text' }).subscribe(
      (id) => {
        product.id = id;
        this.products.push(product);
        this.productsSubject.next(this.products);
      },
      this.errorHandler
    );
  }

  updateProduct(product: Product): void {
    this.http.put<void>(ProductsService.PRODUCTS_URL + '/' + product.id, product).subscribe(
      () => {},
      this.errorHandler
    );
  }

  deleteProduct(productId: string): void {
    this.http.delete<void>(ProductsService.PRODUCTS_URL  + '/' + productId).subscribe(
      () => {
        this.products = this.products.filter((product) => {
          return product.id !== productId;
        });
      
        this.productsSubject.next(this.products);
      },
      this.errorHandler
    );
  }

  private errorHandler(response: any): void {
    let errorResponse = response.error as ErrorResponse;
    alert('Error occured:\n\n' + errorResponse.status + ' ' + errorResponse.error + '\n\n' + errorResponse.message + '\n')
  }
}