import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecivedProposalsPage } from './recived-proposals.page';

const routes: Routes = [
  {
    path: '',
    component: RecivedProposalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecivedProposalsPageRoutingModule {}
