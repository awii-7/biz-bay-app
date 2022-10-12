import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersListsPageRoutingModule } from './orders-lists-routing.module';

import { OrdersListsPage } from './orders-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersListsPageRoutingModule
  ],
  declarations: [OrdersListsPage]
})
export class OrdersListsPageModule {}
