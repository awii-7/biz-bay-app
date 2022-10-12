import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyproposalPageRoutingModule } from './myproposal-routing.module';

import { MyproposalPage } from './myproposal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyproposalPageRoutingModule
  ],
  declarations: [MyproposalPage]
})
export class MyproposalPageModule {}
