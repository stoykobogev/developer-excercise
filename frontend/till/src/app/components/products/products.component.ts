import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { Subscription } from 'rxjs';
import { ProductEdit } from 'src/app/models/product-edit.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {

  private static PRODUCT_PRICE_REGEXP = new RegExp('^\d{1,7}(\.\d{1,2})?$');

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

    if (this.validateProduct(this.newProduct)) {
      this.productsService.createProduct(this.newProduct);
      this.hideCreateProduct();
    }
  }

  updateProduct() {

    if (this.validateProduct(this.selectedProduct)) {
      this.productsService.updateProduct(this.selectedProduct);
      this.hideProductEdit();
    }
  }

  deleteProduct(productId: string) {
    this.productsService.deleteProduct(productId);
  }

  private validateProduct(product: Product): boolean {

    if (!product.name || product.name === '') {
      alert('Product name cannot be empty');
      return false;
    } else if (product.name.length > 20) {
      alert('Product name cannot be longer than 20 characters');
      return false;
    } else if (!product.price || product.price === 0) {
      alert('Product price is empty or not a number');
      return false;
    } else if (!ProductsComponent.PRODUCT_PRICE_REGEXP.test(product.price.toString())) {
      alert('Product price has incorrect format');
      return false;
    }

    return true;
  }
}
