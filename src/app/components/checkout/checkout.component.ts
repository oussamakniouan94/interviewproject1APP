import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../entities/product';
import { Order } from '../../entities/order';
import { loadStripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  stripePromise = loadStripe(environment.stripeKey);
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
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  async ngOnInit(): Promise<void> {
    this.items = this.cartService.getItems();
    this.order.items = this.items;
    this.order.total = this.items.reduce((acc, item) => acc + item.price, 0);

    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
      this.order.items = this.items;
      this.order.total = this.items.reduce((acc, item) => acc + item.price, 0);
      localStorage.removeItem('cartItems');
    } else {
      this.items = this.cartService.getItems();
      this.order.items = this.items;
      this.order.total = this.items.reduce((acc, item) => acc + item.price, 0);
    }

    this.handleTokenFromUrl();

    try {
      const stripe = await this.stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe.');

      this.elements = stripe.elements();
      if (!this.elements) throw new Error('Failed to create Elements.');

      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });

      this.cardElement.mount('#card-element');
    } catch (error) {
      console.error('Error initializing Stripe Elements:', error);
    }
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
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    this.authService.loginWithGoogle();
  }

  async onSubmit(): Promise<void> {
    if (!this.isLoggedIn) {
      this.authService.loginWithGoogle();
      return;
    }

    const token = this.authService.getToken();
    if (token) {
      try {
        const stripe = await this.stripePromise;
        console.log("stripe", stripe)
        console.log("this.elements", this.elements)
        console.log("this.cardElement", this.cardElement)
        if (!stripe || !this.elements || !this.cardElement) throw new Error('Stripe.js or elements failed to load.');

        const response = await this.http.post<{ clientSecret?: string }>(environment.baseUrl + '/payment-intent', {
          amount: this.order.total * 100,
        }).toPromise();

        const clientSecret = response?.clientSecret;

        if (!clientSecret) {
          throw new Error('Failed to get client secret from backend.');
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: this.order.shipping_name,
            },
          },
        });

        if (error) {
          console.error('Payment failed:', error.message);
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
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
      } catch (error) {
        console.error('Payment or order creation failed', error);
      }
    } else {
      console.error('User is not logged in');
    }
  }

}
