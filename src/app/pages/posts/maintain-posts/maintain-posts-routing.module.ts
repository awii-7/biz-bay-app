import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintainPostsPage } from './maintain-posts.page';

const routes: Routes = [
  {
    path: '',
    component: MaintainPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintainPostsPageRoutingModule {}
