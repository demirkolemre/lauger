import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesajlarPage } from './mesajlar.page';

const routes: Routes = [
  {
    path: '',
    component: MesajlarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesajlarPageRoutingModule {}
