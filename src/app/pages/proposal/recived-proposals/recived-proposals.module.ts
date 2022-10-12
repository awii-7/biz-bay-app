import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecivedProposalsPageRoutingModule } from './recived-proposals-routing.module';

import { RecivedProposalsPage } from './recived-proposals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecivedProposalsPageRoutingModule,
  ],
  declarations: [RecivedProposalsPage]
})
export class RecivedProposalsPageModule {}
