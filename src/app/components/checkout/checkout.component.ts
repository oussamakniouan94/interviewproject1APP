import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
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
  isLoggedIn: boolean = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.order.items = this.items;
    this.order.total = this.items.reduce((acc, item) => acc + item.price, 0);

    this.handleTokenFromUrl();
  }

  handleTokenFromUrl(): void {
    const tokenFromUrl = this.route.snapshot.queryParamMap.get('token');
    if (tokenFromUrl) {
      this.authService.setToken(tokenFromUrl);
      this.isLoggedIn = true;
    } else {
      const token = this.authService.getToken();
      this.isLoggedIn = token !== null;
    }
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  onSubmit(): void {
    const token = this.authService.getToken();

    if (!this.isLoggedIn) {
      this.authService.loginWithGoogle();
    } else if (token) {
      this.authService.verifyToken(token).subscribe({
        next: () => {
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
        },
        error: (error) => {
          console.error('Token verification failed', error);
        }
      });
    }
  }
}
