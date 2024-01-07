import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemosPage } from './demos.page';

const routes: Routes = [
  {
    path: '',
    component: DemosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemosPageRoutingModule {}
