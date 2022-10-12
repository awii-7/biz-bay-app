import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InflancerDashPage } from './inflancer-dash.page';

const routes: Routes = [
  {
    path: '',
    component: InflancerDashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InflancerDashPageRoutingModule {}
