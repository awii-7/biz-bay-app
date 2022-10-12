import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProposalDetailPage } from './proposal-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProposalDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProposalDetailPageRoutingModule {}
