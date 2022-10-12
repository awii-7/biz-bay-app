import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersListsPage } from './orders-lists.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersListsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersListsPageRoutingModule {}
