import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-till',
  templateUrl: './till.component.html',
  styleUrls: ['./till.component.css']
})
export class TillComponent implements OnInit {

  productsMatrix = new Array<Product[]>();
  cart = new Map<Product, number>();
  twoForThreeSelection = new Array<Product>();
  halfPriceSelection = new Map<Product, number>();
  totalSum = 0;
  selectedProduct: Product;
  dealForm: FormGroup;
  dealControl = new FormControl('none');

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.dealForm = new FormGroup({
      dealControl: this.dealControl
    });

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

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.dealControl.setValue('none');
  }

  addToCart(): void {
    this.addToMap(this.cart, this.selectedProduct);
    
    if (this.dealControl.value === "twoForThree") {
      this.twoForThreeSelection.push(this.selectedProduct);
    } else if (this.dealControl.value === "halfPrice") {
      this.addToMap(this.halfPriceSelection, this.selectedProduct);
    }

    this.calculateTotalSum();
  }
  
  removeFromTwoForThreeSelection(productIndex: number, product: Product): void {
    this.twoForThreeSelection = this.twoForThreeSelection.filter((product, index) => {
      return productIndex !== index;
    });

    this.removeFromMap(this.cart, product);

    this.calculateTotalSum();
  } 

  removeFromCart(product: Product): void {
    this.removeFromMap(this.cart, product);
    this.removeFromMap(this.halfPriceSelection, product);

    this.calculateTotalSum();
  }

  clearCart(): void {
    this.cart.clear();
    this.halfPriceSelection.clear();
    this.twoForThreeSelection = [];
    this.totalSum = 0;
  }

  private addToMap(map: Map<Product, number>, product: Product): void {
    if (map.has(product)) {
      map.set(product, map.get(product) + 1);
    } else {
      map.set(product, 1);
    }
  }

  private removeFromMap(map: Map<Product, number>, product: Product): void {

    let productCount = map.get(product);

    if (productCount > 1) {
      map.set(product, productCount - 1);
    } else {
      map.delete(product);
    }
  }

  private calculateTotalSum(): void {

    let cheapestTwoForThreeSelectionPrice = 0;
    if (this.twoForThreeSelection.length > 2) {
      cheapestTwoForThreeSelectionPrice = this.twoForThreeSelection[0].price;
      for (let i = 1; i < 3; i++) {
        if (cheapestTwoForThreeSelectionPrice > this.twoForThreeSelection[i].price) {
          cheapestTwoForThreeSelectionPrice = this.twoForThreeSelection[i].price;
        }
      }
    }

    let halfPriceDiscount = 0;
    this.halfPriceSelection.forEach((productCount, product) => {
      halfPriceDiscount += product.price * Math.floor(productCount / 2);
    });

    let cartSum = 0;
    this.cart.forEach((productCount, product) => {
      cartSum += product.price * productCount;
    });

    this.totalSum = cartSum - cheapestTwoForThreeSelectionPrice - halfPriceDiscount;
  }
}
