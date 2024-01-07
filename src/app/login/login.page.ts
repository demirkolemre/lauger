import { Component, OnInit, ViewChild } from '@angular/core';
import { UserCredential } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { ProfileService } from '../services/profile.service';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent) loginForm: AuthFormComponent;
  public loading: HTMLIonLoadingElement;
  constructor(
    private authService: AuthService,
     private router: Router,
     private profilservice:ProfileService,
     public loadingCtrl: LoadingController,
     private menu:MenuController,
     private storage:Storage
     ) { }

  async ngOnInit() {

  }

  async loginUser(credentials: UserCredential): Promise<void> {
    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.login(
        credentials.email,
        credentials.password
      );
      this.authService.userId = userCredential.user.uid;
      await this.loginForm.hideLoading();

            this.router.navigateByUrl('/home');

    } catch (error) {
      await this.loginForm.hideLoading();
      this.loginForm.handleError(error);
    }
  }





  async ionViewWillEnter(){
    this.storage.create();




    this.storage.get("slidershow").then(data => {
      console.log(data);


    }).catch(err => {
      console.log(err);

    });


    this.menu.enable(false);
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    this.profilservice.getUserProfile().then(profile$ => {
      profile$
          this.router.navigateByUrl('/home');
        console.log("gidiliyor ");
        this.loading.dismiss();

    }).catch(r => {
      this.loading.dismiss();
    });


  }



  sifre(){
    this.router.navigateByUrl("reset-password");
  }

  register(){
    this.router.navigateByUrl("register");
  }
}
