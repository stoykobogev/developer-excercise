import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { Subscription } from 'rxjs';
import { ProductEdit } from 'src/app/models/product-edit.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products = new Array<ProductEdit>();
  productsSubscription: Subscription;
  selectedProduct: ProductEdit;
  newProduct: Product;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.productsSubscription = this.productsService.getAllProducts().subscribe(
      (products) => {
        this.products = products.map<ProductEdit>((product) => new ProductEdit(product));
        console.log(this.products)
      }
    );
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  showProductEdit(product: ProductEdit) {
    this.hideCreateProduct();

    if (this.selectedProduct) {
      this.selectedProduct.isEditing = false;
    }

    this.selectedProduct = product;
    this.selectedProduct.isEditing = true;
  }

  hideProductEdit() {
    if (this.selectedProduct) {
      this.selectedProduct.isEditing = false;
    }
    
    this.selectedProduct = null;
  }

  showCreateProduct() {
    this.hideProductEdit();
    this.newProduct = new Product();
  }

  hideCreateProduct() {
    this.newProduct = null;
  }

  saveProduct() {
    this.productsService.createProduct(this.newProduct);
    this.hideCreateProduct();
  }

  updateProduct() {
    this.productsService.updateProduct(this.selectedProduct);
    this.hideProductEdit();
  }

  deleteProduct(productId: string) {
    this.productsService.deleteProduct(productId);
  }
}
