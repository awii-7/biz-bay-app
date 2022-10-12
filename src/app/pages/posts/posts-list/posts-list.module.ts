import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostsListPageRoutingModule } from './posts-list-routing.module';

import { PostsListPage } from './posts-list.page';
import { TabsPage } from '../../tabs/tabs.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostsListPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [PostsListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class PostsListPageModule {}
