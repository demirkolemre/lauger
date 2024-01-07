import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { AlertController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/user';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage  {
  public userProfile: UserProfile;
  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private alertCtrl: AlertController,
    private navctrl: NavController,

  ) {}



  ionViewWillEnter() {
    this.profileService.getUserProfile().then(profile$ => {
      profile$.subscribe(userProfile => {
        this.userProfile = userProfile;
        console.log(    this.profileService.useridsi
          );

      });
    });
  }

  async logOut(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'İsminiz',
      cssClass: 'custom-alert',
      inputs: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'İsminiz',
          value: this.userProfile.name
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateName(data.name);
          }
        }
      ]
    });
    return await alert.present();
  }
  async updateSurname(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Soyisminiz',
      cssClass: 'custom-alert',
      inputs: [
        {
          type: 'text',
          name: 'surname',
          placeholder: 'Soyisminiz',
          value: this.userProfile.surname
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateName(data.surname);
          }
        }
      ]
    });
    return await alert.present();
  }
  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' }
      ],
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
          }
        }
      ]
    });
    return await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' }
      ],
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    return await alert.present();
  }


  homegit(){
    this.navctrl.navigateRoot("home");
  }

  rutin(){
    this.navctrl.navigateRoot("tab2");

  }
  rutingit() {
    this.navctrl.navigateRoot('rutins');
  }

}
