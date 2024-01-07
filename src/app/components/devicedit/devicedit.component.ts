import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-devicedit',
  templateUrl: './devicedit.component.html',
  styleUrls: ['./devicedit.component.scss'],
})
export class DeviceditComponent {
data: any;
profilid:string;
id:string;
edit:boolean = false;
cihazlar = [];
  constructor(

    private modalCtrl: ModalController,
    private realbd: AngularFireDatabase,
    private alertctrl: AlertController,
    private toastController: ToastController,
    private profilservice:ProfileService,
    private firestore: AngularFirestore,


    ) { }

  ngOnInit() {

  }

ionViewWillEnter(){
  this.cihazlar = this.data.devices;
  console.log(this.cihazlar);
  console.log(this.profilid);
console.log(this.data.id);

}

  confirm() {
    return this.modalCtrl.dismiss("a", 'confirm');
  }

  async updatedevname(dev){
    console.log(dev);
    const alert = await this.alertctrl.create({
      header: 'Yeni adı giriniz',
      buttons: [
        {
          text: 'Tamam',
          handler: (alertData) => {
            //takes the data
            console.log(alertData.name1);
            if (alertData.name1.length > 2) {
              this.firestore.collection("/kullanicilar/").doc(this.profilid).collection("/hotkeys/").doc(this.data.id).update({
                name:alertData.name1
               }).then(() => {
                  this.modalCtrl.dismiss();
               })          }
          },
        },
      ],
      inputs: [
        {
          name: 'name1',
          placeholder: dev.name,
          attributes: {
            maxlength: 8,
          },
        },
      ],
    });
    await alert.present();

  }

  async tomesaj(mesaj) {
    const toast = await this.toastController.create({
      message: mesaj,
      duration: 3000,
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
  editdev(){
    this.edit = !this.edit;
  }
  deldev(dev){
    console.log(dev);
    this.cihazlar.forEach((element,index)=>{
      if(element==dev) this.cihazlar.splice(index,1);
   });
   this.firestore.collection("/kullanicilar/").doc(this.profilid).collection("/hotkeys/").doc(this.data.id).update({
    devices:this.cihazlar
   });
   console.log(this.cihazlar);

  }
}
