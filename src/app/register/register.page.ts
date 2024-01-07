import { AuthService } from "../services/auth.service";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserCredential } from 'src/app/models/user';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage  {
  public loading: HTMLIonLoadingElement;
  public registerForm: FormGroup;
  @Input() actionButtonText: string;
  @Input() isPasswordResetPage = false;
  @Output() formSubmitted = new EventEmitter<any>();



email:any;
pass:any;
pass2:any;

name:any;
surname:any;
number:any;
password:any;
  constructor(
    private authservice:AuthService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router:Router
  ) {

    this.registerForm = this.formBuilder.group({
      email: [this.email, Validators.compose([Validators.required, Validators.email])],
      name: [this.name, Validators.compose([Validators.required, Validators.minLength(2)])],
      surname:[this.surname,Validators.compose([Validators.required, Validators.minLength(2)])],
      number:[this.number,Validators.compose([Validators.required, Validators.minLength(1)])],
      pass: [this.pass, Validators.minLength(6)],
      pass2: [this.pass2, Validators.minLength(6)]

    });
   }

  async ionViewDidEnter(){

  }


  log(){
    console.log("data");

    console.log(this.email);
    console.log(this.pass);
    console.log(this.name);
    console.log(this.surname);
    console.log(this.number);

  }
async kayitol(){

  if(this.pass == this.pass2){
    this.authservice.signup(
      this.email,
    this.pass,
    this.name,
    this.surname,
    this.number,
    ).then((res) => {
      console.log(res);
      this.router.navigateByUrl("login");

    }).catch((err) => {
      console.log(err);

    })
  }else{
    const alert = await this.alertCtrl.create({
      message: "Şifreler Eşleşmiyor",
      buttons: [{ text: 'Tamam', role: 'cancel' }]
    });
    await alert.present();
  }

}




submitCredentials(registerForm: FormGroup): void {
  if (!registerForm.valid) {
    console.log('Form is not valid yet, current value:', registerForm.value);
  } else {
    this.showLoading();
    const credentials: UserCredential = {
      email: registerForm.value.email,
      password: registerForm.value.password,
      number: null,
      name:null,
      surname:null
    };
    this.formSubmitted.emit(credentials);
  }
}

async showLoading(): Promise<void> {
  try {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();
  } catch (error) {
    this.handleError(error);
  }
}

hideLoading(): Promise<boolean> {
  return this.loading.dismiss();
}

async handleError(error): Promise<void> {
  const alert = await this.alertCtrl.create({
    message: error.message,
    buttons: [{ text: 'Ok', role: 'cancel' }]
  });
  await alert.present();
}


}
