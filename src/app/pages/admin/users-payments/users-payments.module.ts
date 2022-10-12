import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPaymentsPageRoutingModule } from './users-payments-routing.module';

import { UsersPaymentsPage } from './users-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPaymentsPageRoutingModule
  ],
  declarations: [UsersPaymentsPage]
})
export class UsersPaymentsPageModule {}
