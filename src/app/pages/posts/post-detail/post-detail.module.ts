import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailPageRoutingModule } from './post-detail-routing.module';

import { PostDetailPage } from './post-detail.page';
import { TabsPage } from '../../tabs/tabs.page';
import { SendPorposalComponent } from 'src/app/components/send-porposal/send-porposal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDetailPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [PostDetailPage,
  SendPorposalComponent
  
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class PostDetailPageModule {}
