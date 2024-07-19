import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
