import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagelistPage } from './messagelist.page';

const routes: Routes = [
  {
    path: '',
    component: MessagelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagelistPageRoutingModule {}
