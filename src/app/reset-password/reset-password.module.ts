import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPage } from './reset-password.page';
import { AuthModule } from 'src/app/shared-modules/auth.module';
import { SharedComponentsModule} from 'src/app/components/shared-components.module';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AuthModule,SharedComponentsModule
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
