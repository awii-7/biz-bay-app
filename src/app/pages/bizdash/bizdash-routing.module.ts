import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BizdashPage } from './bizdash.page';

const routes: Routes = [
  {
    path: '',
    component: BizdashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BizdashPageRoutingModule {}
