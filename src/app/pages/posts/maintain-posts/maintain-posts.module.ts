import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintainPostsPageRoutingModule } from './maintain-posts-routing.module';

import { MaintainPostsPage } from './maintain-posts.page';
import { TagInputModule } from 'ngx-chips';
import { TabsPage } from '../../tabs/tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaintainPostsPageRoutingModule,
    TagInputModule 
    
  ],
  declarations: [MaintainPostsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class MaintainPostsPageModule {}
