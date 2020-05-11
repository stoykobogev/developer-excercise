import { Product } from './product.model';

export class ProductEdit extends Product {
    isEditing = false;

    constructor(product: Product) {
        super();
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
    }
}
