import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutinsPageRoutingModule } from './rutins-routing.module';

import { RutinsPage } from './rutins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutinsPageRoutingModule
  ],
  declarations: [RutinsPage]
})
export class RutinsPageModule {}
