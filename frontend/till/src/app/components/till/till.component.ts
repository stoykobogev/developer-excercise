import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-till',
  templateUrl: './till.component.html',
  styleUrls: ['./till.component.css']
})
export class TillComponent implements OnInit {

  productsMatrix = new Array<Product[]>();
  cart = new Map<Product, number>();
  totalSum = 0;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.productsService.getAllProducts().subscribe(
      (products) => {

        let currentArray: Product[];
        for (let index = 0; index < products.length; index++) {
          if (index % 3 === 0) {
            currentArray = new Array<Product>()
            this.productsMatrix.push(currentArray);
          }
          
          currentArray.push(products[index]);
        }
      }
    );
  }

  addToCart(product: Product): void {
    if (this.cart.has(product)) {
      this.cart.set(product, this.cart.get(product) + 1);
    } else {
      this.cart.set(product, 1);
    }

    this.totalSum += product.price;
  }

  removeFromCart(product: Product): void {
    let productCount = this.cart.get(product);

    if (productCount < 2) {
      this.cart.delete(product);
    } else {
      this.cart.set(product, this.cart.get(product) - 1);
    }

    this.totalSum -= product.price;
  }

  calculateTotalSum(): void {

    this.totalSum = 0;
    let productsWithoutHalfPrice = new Array<Product>();

    this.cart.forEach((productCount, product) => {
      let currenProductSum = product.price * productCount;

      if (product.halfPrice) {
        currenProductSum = currenProductSum / 2;

        this.totalSum += currenProductSum;
        
      } else {
        productsWithoutHalfPrice.push(product);
      }

      
    });
  }
}
