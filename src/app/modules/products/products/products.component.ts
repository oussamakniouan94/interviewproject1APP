import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../entities/product';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  filters = {
    category: '',
    minPrice: null,
    maxPrice: null,
    minDuration: null,
    maxDuration: null,
  };

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data.map(product => ({
        ...product,
        image: `../../${product.image}`
      }));
      this.filteredProducts = this.products;
    });
  }

  searchProducts() {
    if (this.searchTerm) {
      this.productService.searchProducts(this.searchTerm).subscribe((data: Product[]) => {
        this.filteredProducts = data.map(product => ({
          ...product,
          image: `../../${product.image}`
        }));
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      return (!this.filters.category || product.category === this.filters.category) &&
        (this.filters.minPrice == null || product.price >= this.filters.minPrice) &&
        (this.filters.maxPrice == null || product.price <= this.filters.maxPrice) &&
        (this.filters.minDuration == null || product.duration >= this.filters.minDuration) &&
        (this.filters.maxDuration == null || product.duration <= this.filters.maxDuration);
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart.`);
  }
}
