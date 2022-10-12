import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackOrderPageRoutingModule } from './track-order-routing.module';

import { TrackOrderPage } from './track-order.page';
import { UpdateOrderStatusComponent } from 'src/app/components/update-order-status/update-order-status.component';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackOrderPageRoutingModule,
    ReactiveFormsModule,
    StarRatingModule
  ],
  declarations: [TrackOrderPage,UpdateOrderStatusComponent]
})
export class TrackOrderPageModule {}
