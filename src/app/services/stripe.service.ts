import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: any;

  constructor(private http: HttpClient) {
    this.initializeStripe();
  }

  async initializeStripe() {
    this.stripe = await loadStripe('your-stripe-publishable-key');
  }

  createPaymentIntent(amount: number) {
    return this.http.post<any>(environment.baseUrl + 'payment', { amount });
  }

  async handleCardPayment(cardElement: any, clientSecret: string) {
    return await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
  }
}
