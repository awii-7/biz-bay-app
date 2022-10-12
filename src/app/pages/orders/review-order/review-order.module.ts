import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewOrderPageRoutingModule } from './review-order-routing.module';

import { ReviewOrderPage } from './review-order.page';
import { StarRatingModule } from 'ionic5-star-rating';
// import { StarRating, StarRatingModule } from 'ionic4-star-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewOrderPageRoutingModule,
    StarRatingModule
    // StarRatingModule
  ],
  declarations: [ReviewOrderPage]
})
export class ReviewOrderPageModule {}
