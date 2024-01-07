import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/firestore'
import { AlertController, NavController } from '@ionic/angular';
import {CardComponent} from '../components/card/card.component';
import { ProfileService } from '../services/profile.service';
import { AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  aradiklarim = [];
  cihazlar = [];
  cokaradiklarim = [];
eklenen = [];
eklemeisim :string ;
  segmentvalue: boolean = false;
disablekayit ="disab";
disablezaman ="disab";

minDate: any = new Date().toISOString();
  zamanisim: any;
  zaman: string;
weekdays = ["Paz","Sal","Çar","Per","Cum","Cts","Paz"]
  constructor(
    private firestore: AngularFirestore,
    private realdb:AngularFireDatabase,
    private navctrl: NavController,
    private profilservice:ProfileService,
    private modalCtrl: ModalController,
    private toastController: ToastController

  ) { }

kayitbut(){
  this.tomesaj("İşlem Ekleniyor");

  console.log(this.eklenen);
  var id = this.firestore.createId();
    this.firestore.collection("/kullanicilar/").doc(this.profilservice.useridsi).collection("hotkeys").doc(id).set({
    name:this.eklemeisim,
      devices:this.eklenen,
      profilid:this.profilservice.useridsi
  })
  .finally(() => {
    window.location.reload();
  });
}

cihazadi(e){
  console.log(e.detail.value.length);
  if(e.detail.value.length > 2){
    this.eklemeisim  = e.detail.value;
    this.disablekayit = null;
  }
}


saatadi(a){
  if(a.detail.value.length > 2){
    this.zamanisim  = a.detail.value;
    this.disablezaman = null;
  }
}

  ionViewWillEnter(){
    console.log();
    
    this.profilservice.getUserProfile();
      this.realdb.database.ref("/dev/").get().then(r => {
        this.cihazlar = r.val();
        for (let key in this.cihazlar) {
          if (this.cihazlar[key].node != undefined) {
              this.cokaradiklarim.push({
                key: key,
                data: this.cihazlar[key].node,
                datalenght: 0,
              });
          } else {
            if (this.cihazlar[key].int == 1) {
              this.aradiklarim.push({
                data: this.cihazlar[key],
                key: key,
                value: true,
              });
            } else {
              this.aradiklarim.push({
                data: this.cihazlar[key],
                key: key,
                value: false,
              });
            }
          }
        }
      });




  }

  segmentchange(e){
    console.log(e.detail.value);
    if(e.detail.value == "tarih"){
      this.segmentvalue = true;
    }else if(e.detail.value == "coklu"){
      this.segmentvalue = false;
    }
  }

  bak(e,event){
    console.log(event.detail.checked);
    console.log(e);
    if(event.detail.checked == true){
      this.eklenen.push(e);
    }else{
      this.eklenen.splice(e.key,1);

    }


    console.log(this.eklenen);
  }
  homegit() {
    this.navctrl.navigateRoot("home");
  }
  ayargit() {
    this.navctrl.navigateRoot("profile");

  }  rutingit() {
    this.navctrl.navigateRoot("rutins");

  }




kayitzaman(){
  console.log(this.zaman);
  this.realdb.database.ref("/autonom/"+this.zaman + "/" +this.realdb.createPushId()).set({
    zaman:this.zaman,
    who:this.profilservice.useridsi,
    data:"dataaaa"
  });
}

degisimzaman(zaman){

  console.log(zaman.detail.value);
  this.zaman = zaman.detail.value.split(":")[0]+":"+zaman.detail.value.split(":")[1];
  console.log(this.zaman);

}
  async tomesaj(mesaj) {
    const toast = await this.toastController.create({
      message: mesaj,
      duration: 3000,
      cssClass: 'custom-toast',
    });

    await toast.present();
  }
}
