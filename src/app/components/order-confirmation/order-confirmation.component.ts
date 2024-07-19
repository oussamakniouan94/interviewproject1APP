import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service'; // Assume you have a service to fetch order details
import { Order } from '../../entities/order';
import { Product } from '../../entities/product';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  items: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('orderId');
      if (orderId) {
        this.orderService.getOrderById(orderId).subscribe(order => {
          this.order = order;
          this.items = this.order?.items;
        });
      } else {
        console.error('No order ID found in URL');
      }
    });
  }
}
