import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../entities/product';
import { Order } from '../../entities/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  order: Order = {
    items: [],
    total: 0,
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: ''
  };
  
  items: Product[] = [];
  
  constructor(private orderService: OrderService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.order.items = this.items;
    this.order.total = this.items.reduce((acc, item) => acc + item.price, 0);
  }

  onSubmit() {
    this.orderService.createOrder(this.order).subscribe({
      next: (response) => {
        const orderId = response._id;
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', orderId]);
      },
      error: (error) => {
        console.error('Order submission failed', error);
      }
    });
  }
}
