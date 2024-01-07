import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesajlarPageRoutingModule } from './mesajlar-routing.module';

import { MesajlarPage } from './mesajlar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesajlarPageRoutingModule
  ],
  declarations: [MesajlarPage]
})
export class MesajlarPageModule {}
