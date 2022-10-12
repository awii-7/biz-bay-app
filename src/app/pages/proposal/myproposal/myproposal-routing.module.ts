import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyproposalPage } from './myproposal.page';

const routes: Routes = [
  {
    path: '',
    component: MyproposalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyproposalPageRoutingModule {}
