import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProposalDetailPageRoutingModule } from './proposal-detail-routing.module';

import { ProposalDetailPage } from './proposal-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProposalDetailPageRoutingModule
  ],
  declarations: [ProposalDetailPage]
})
export class ProposalDetailPageModule {}
