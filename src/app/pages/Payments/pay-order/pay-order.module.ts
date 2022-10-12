import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayOrderPageRoutingModule } from './pay-order-routing.module';

import { PayOrderPage } from './pay-order.page';
import { AddCardComponent } from 'src/app/components/add-card/add-card.component';
import { ThankYouComponent } from '../thank-you/thank-you.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayOrderPageRoutingModule
  ],
  declarations: [PayOrderPage,AddCardComponent,ThankYouComponent]
})
export class PayOrderPageModule {}
