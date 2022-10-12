import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EWalletPageRoutingModule } from './e-wallet-routing.module';

import { EWalletPage } from './e-wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EWalletPageRoutingModule
  ],
  declarations: [EWalletPage]
})
export class EWalletPageModule {}
