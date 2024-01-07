import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { AngularFireModule } from '@angular/fire';
@NgModule({
  imports: [CommonModule,
     FormsModule,
      IonicModule,
      AngularFireModule,
      ReactiveFormsModule],
  declarations: [AuthFormComponent],
  exports: [AuthFormComponent],
})
export class AuthModule {}
