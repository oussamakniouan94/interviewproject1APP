# Angular E-commerce Application

This is an Angular-based e-commerce application featuring product listings, filtering, searching, cart functionalities, Google authentication, and Stripe payment integration. The application is designed to provide a smooth user experience and optimized performance.

## Features

- **Product Listing**: Display products with details.
- **Filtering**: Filter products by category, price, and duration.
- **Search**: Search products with fuzzy matching to handle misspellings.
- **Add to Cart**: Add products to the cart and view cart contents.
- **Google Login**: Authenticate users using Google login.
- **Payment**: Integrate Stripe for secure payment processing.
- **Advanced Features**: Implement advanced search, filtering, and sorting functionalities.
- **Performance Optimization**: Optimize performance with lazy loading, minimized network requests, and client-side caching.

## Services

### AuthService

Handles Google authentication and token management.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/redirect/google`;
  }

  handleGoogleCallback(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/callback/google`, { code });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  retrieveTokenFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.setToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  verifyToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-token`, { token });
  }
}
```
### CartService
Manages cart items and their interactions.
```typescript
import { Injectable } from '@angular/core';
import { Product } from '../entities/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];

  addToCart(product: Product) {
    this.items.push(product);
  }

  getItems(): Product[] {
    return this.items;
  }

  clearCart() {
    this.items = [];
  }

  removeItem(product: Product) {
    const index = this.items.indexOf(product);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getTotalPrice(): number {
    return this.items.reduce((total, product) => total + product.price, 0);
  }
}
```

## OrderService
Handles order creation and retrieval.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order } from '../entities/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.baseUrl + '/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}
```
## ProductService
Handles product retrieval and search.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../entities/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.baseUrl + '/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
```
# User Interface
Designed and developed an advanced user interface to display products, the cart, and the checkout process.

# Deployment
The Angular application is deployed on Vercel for free.

# How to run
Clone the repository:

git clone https://github.com/oussamakniouan94/interviewproject1APP.git

Install dependencies:

npm install

Run the application:

Navigate to http://localhost:4200/ in your browser.
