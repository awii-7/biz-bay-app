import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfluencerListPage } from './influencer-list.page';

const routes: Routes = [
  {
    path: '',
    component: InfluencerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfluencerListPageRoutingModule {}
