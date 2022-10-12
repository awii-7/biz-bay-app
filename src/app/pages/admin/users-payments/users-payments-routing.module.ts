import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPaymentsPage } from './users-payments.page';

const routes: Routes = [
  {
    path: '',
    component: UsersPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPaymentsPageRoutingModule {}
