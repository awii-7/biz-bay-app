import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagelistPageRoutingModule } from './messagelist-routing.module';

import { MessagelistPage } from './messagelist.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { LongPressModule } from 'ionic-long-press';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagelistPageRoutingModule,
    Ng2SearchPipeModule,
    // LongPressModule
  ],
  declarations: [MessagelistPage]
})
export class MessagelistPageModule {}
