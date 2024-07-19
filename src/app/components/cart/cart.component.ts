import { Component, OnInit } from '@angular/core';
import { Product } from '../../entities/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: Product[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotalPrice();
  }

  removeItem(product: Product) {
    this.cartService.removeItem(product);
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotalPrice();
  }

  clearCart() {
    this.cartService.clearCart();
    this.items = [];
    this.total = 0;
  }
}
