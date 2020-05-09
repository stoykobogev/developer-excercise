import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TillComponent } from './components/till/till.component';
import { ProductsComponent } from './components/products/products.component';


const routes: Routes = [
  { path: '', component: TillComponent },
  { path: 'products', component: ProductsComponent },
  { path: '**', component: TillComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
