import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfluencerListPageRoutingModule } from './influencer-list-routing.module';

import { InfluencerListPage } from './influencer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfluencerListPageRoutingModule
  ],
  declarations: [InfluencerListPage]
})
export class InfluencerListPageModule {}
