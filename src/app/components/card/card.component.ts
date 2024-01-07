import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  data: any;

  constructor(

    private modalCtrl: ModalController,
    private realbd: AngularFireDatabase,
    private alertctrl: AlertController,
    private toastController: ToastController


    ) { }

  ngOnInit() {

    // Her bir s değerini başlangıçta kapalı olarak ayarla
    this.initializeSValues();
  }

  initializeSValues() {
    if (this.data && this.data.data) {
      Object.keys(this.data.data).forEach(sensorKey => {
        const sensor = this.data.data[sensorKey];
        Object.keys(sensor).forEach(sKey => {

        });
      });
    }
  }

  confirm() {
    return this.modalCtrl.dismiss("a", 'confirm');
  }


  async edit(e){
    const alert = await this.alertctrl.create({
      header: 'Yeni adı giriniz',
      buttons: [ {
        text: 'Tamam',
        handler: (alertData) => { //takes the data
            console.log(alertData.name1);
            if(alertData.name1.length > 2){
              this.updatename(e,alertData.name1);

            }

        }
    }],
      inputs: [
        {
          name: "name1",
          placeholder: "Yeni isim",
          attributes: {
            maxlength: 8,
          },
        },


      ],
    });

    await alert.present();
  }

  updatename(veri,isim){
    console.log("veri = " );
    console.log(veri);

    console.log("yenisim = " + isim);


    this.realbd.database.ref("/dev/"+this.data.key+"/node/"+veri).update(
      {
        name:isim
      }
    ).then(r => {
      this.tomesaj("İsim güncellendi");
    });
  }


  getSensorKeys() {
    if (this.data && this.data.data) {
      return Object.keys(this.data.data);
    }
    return [];
  }

  getSKeys(sensorData) {
    if (sensorData) {
      return Object.keys(sensorData).filter(key => key.startsWith('s'));
    }
    return [];
  }

  toggleChanged(sensorData, sKey) {
    console.log(`Toggle for ${sKey} changed:`, sensorData[sKey]);
    // Burada toggle durumu değiştiğinde yapılacak işlemleri gerçekleştirebilirsiniz
  }

  getSensorValues(sensorKey) {
    return this.data.data[sensorKey];
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
