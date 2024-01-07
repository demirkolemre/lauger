import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {
  AlertController,
  IonDatetime,
  ItemReorderEventDetail,
  NavController,
  PickerController,
} from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { UserProfile } from 'src/app/models/user';
import { ModalController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { CardComponent } from '../components/card/card.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PluginListenerHandle } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  networklistener: PluginListenerHandle;
  status: boolean;

  public loaded = false;
  durum: string = 'time';
  benimkiler = [];
  aradiklarim = [];
  cihazlar = [];
  hotkeys = [];
  cokaradiklarim = [];
  isToastOpen = false;

  toogledata: boolean = true;
  kontrolde: boolean = false;
  kullanicilar = [];

  userview: string = 'hidden';
  mesajview: string = '';
  profilim: any;
  benimolanlar = [];

  ipAddress: string;
  port: number;
  privip: string = null;
  publicip: string = null;
emaili:string = "";
  constructor(
    private storageangular: AngularFireStorage,
    private database: AngularFirestore,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private realbd: AngularFireDatabase,
    private activerouter: ActivatedRoute,
    private navctrl: NavController,
    private alertctrl: AlertController,
    private pickerCtrl: PickerController,
    private router: Router,
    private profileService: ProfileService,
    public modalController: ModalController,
    private chatservice: ChatService,
    private toastController: ToastController,
    private http: HttpClient
  ) {}
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }
  async openModaldetay(detay) {
    console.log(detay);

    const modal = await this.modalController.create({
      component: CardComponent,

      componentProps: { data: detay, durum: 1 },
    });
    modal.present();

    await modal.onWillDismiss();
  }
  ayargit() {
    this.navctrl.navigateRoot('profile');
  }
  rutingit() {
    this.navctrl.navigateRoot('rutins');
  }
  tab2git() {
    this.navctrl.navigateRoot('tab2');
  }

  savet() {
    var sh1 = {
      from: 'emirhncann@gmail.com',
      to: 'demirkolemre@gmail.com',
      tarih: 'Dec 22, 2024',
      id: 'B2kLeXllZYb6nlCmWd6n',
      msg: {
        tnojtHr8f4NyaARHxjdP: {
          from: 'emirhncann@gmail.com',
          to: 'demirkolemre@gmail.com',
          tarih: 'Dec 22, 2022',
          msg: 'denbenme',
        },
      },
    };

    var sh2 = {
      from: 'emirhncann@gmail.com',
      to: 'test@gmail.com',
      tarih: 'Dec 22, 2023',
      id: 'zlIweDVHT0Ll2wAwr6kz',
      msg: {
        '0Dkvo4M3GGmImsoOIFGy': {
          from: 'emirhncann@gmail.com',
          to: 'test@gmail.com',
          tarih: 'Dec 22, 2023',
          msg: 'denbenme',
        },
      },
    };

    var b = ['B2kLeXllZYb6nlCmWd6n', 'zlIweDVHT0Ll2wAwr6kz'];

    this.storage.set('B2kLeXllZYb6nlCmWd6n', sh1);
    this.storage.set('zlIweDVHT0Ll2wAwr6kz', sh2);
    this.storage.set('konusmalar', b);
  }

  async makeApiRequest() {}
  getIpAndPort() {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((error) => console.error('Offer set error:', error));

    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        // console.log(event.candidate.address);
        this.privip = event.candidate.address;
      }
    };
  }

  showdata() {
    var konusma = [];

    this.storage
      .get('konusmalar')
      .then((data) => {
        console.log(data);

        // data'nın null veya undefined olup olmadığını kontrol etmek önemlidir
        if (data) {
          // Eğer data bir dizi değilse, uygun kontrolü yapın.
          if (Array.isArray(data)) {
            data.forEach((key) => {
              this.storage.get(key).then((ver) => {
                console.log(ver);

                if (ver) {
                  // key'yi id olarak kullanarak a veya b objesine ekle
                  const id = key;

                  if (ver.to === this.profilim.email) {
                    var a = {
                      id: key, // veya sadece id: key
                      show: ver.from,
                      data: ver,
                    };
                    konusma.push(a);
                  } else {
                    var b = {
                      id: key, // veya sadece id: key
                      show: ver.to,
                      data: ver,
                    };
                    konusma.push(b);
                  }
                }
              });
            });
          } else {
            // data bir dizi değilse, uygun işlemleri yapın.
            console.log('Konusmalar dizisi değil.');
          }
          this.benimolanlar = konusma;
          console.log(this.benimolanlar);
          if (konusma.length == 0) {
            var emailim = "";
            this.profileService.getUserProfile().then(r => {
              console.log(r);
              console.log(this.profileService.useridsi);
              this.database.collection("kullanicilar/").doc(this.profileService.useridsi).get().subscribe((r:any) => {
                console.log(r._delegate._document.data.value.mapValue.fields.email.stringValue);
                emailim =r._delegate._document.data.value.mapValue.fields.email.stringValue;
                console.log('boş veriler');
                this.benimolanlar = [];

                var datalar = [];
                this.realbd.database
                  .ref('sohbetler/')
                  .once('value')
                  .then((snapshot) => {
                    const data = snapshot.val();
                    const keys = Object.keys(data);
                    console.log(keys);
                    console.log(data);
                    datalar = data;

                    const jsonArray = Object.keys(data).map((key) => ({
                      id: key,
                      ...data[key],
                    }));
                    console.log(jsonArray);
                    console.log(emailim);

                    for (let index = 0; index < jsonArray.length; index++) {
                      console.log(jsonArray[index]);
                      if(jsonArray[index].from == emailim){
                        var a = {
                          id: jsonArray[index].id, // veya sadece id: key
                        show: jsonArray[index].to,
                        data: jsonArray[index],
                        }
                        console.log(a);
                        this.benimolanlar.push(a);
                      }
                      if(jsonArray[index].to == emailim){
                        var a = {
                          id: jsonArray[index].id, // veya sadece id: key
                        show: jsonArray[index].from,
                        data: jsonArray[index],
                        }
                        console.log(a);
                        this.benimolanlar.push(a);
                      }
                    }
                  })
                  .catch((error) => {
                    console.error('Veri çekme hatası:', error);
                  });
              });
            });

          }
        } else if (data.length == 0) {
          console.log('Konusmalar bulunamadı.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
      message: 'Konuşmalar Alınıyor',
      mode: 'ios',
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1050);
  }
  async ionViewWillEnter() {
    this.storage.create();

    (await this.profileService.getUserProfile()).subscribe((r) => {
      this.profilim = r;
      console.log(this.profilim);

    });


    var konusma = [];

    this.storage
      .get('konusmalar')
      .then((data) => {
        console.log(data);
        // data'nın null veya undefined olup olmadığını kontrol etmek önemlidir
        if (data != null) {
          // Eğer data bir dizi değilse, uygun kontrolü yapın.
          if (Array.isArray(data)) {
            data.forEach((key) => {
              this.storage.get(key).then((ver) => {
                console.log(ver);
                this.emaili = this.profilim.email;
                if (ver) {
                  // key'yi id olarak kullanarak a veya b objesine ekle
                  const id = key;

                  if (ver.to === this.profilim.email) {
                    var a = {
                      id: key, // veya sadece id: key
                      show: ver.from,
                      data: ver,
                    };
                    konusma.push(a);
                  } else {
                    var b = {
                      id: key, // veya sadece id: key
                      show: ver.to,
                      data: ver,
                    };
                    konusma.push(b);
                  }
                }
              });
            });
          } else {
            // data bir dizi değilse, uygun işlemleri yapın.
            console.log('Konusmalar dizisi değil.');
          }
          this.benimolanlar = konusma;
          console.log(this.benimolanlar);

        } else if (data == null) {
          console.log('Konusmalar bulunamadı.');
            var emailim = "";
            this.profileService.getUserProfile().then(r => {
              console.log(r);
              console.log(this.profileService.useridsi);
              this.database.collection("kullanicilar/").doc(this.profileService.useridsi).get().subscribe((r:any) => {
                console.log(r._delegate._document.data.value.mapValue.fields.email.stringValue);
                emailim =r._delegate._document.data.value.mapValue.fields.email.stringValue;
                this.emaili = emailim;
                console.log('boş veriler');
                this.benimolanlar = [];

                var datalar = [];
                this.realbd.database
                  .ref('sohbetler/')
                  .once('value')
                  .then((snapshot) => {
                    const data = snapshot.val();
                    const keys = Object.keys(data);
                    console.log(keys);
                    console.log(data);
                    datalar = data;

                    const jsonArray = Object.keys(data).map((key) => ({
                      id: key,
                      ...data[key],
                    }));
                    console.log(jsonArray);
                    console.log(emailim);

                    for (let index = 0; index < jsonArray.length; index++) {
                      console.log(jsonArray[index]);
                      if(jsonArray[index].from == emailim){
                        var a = {
                          id: jsonArray[index].id, // veya sadece id: key
                        show: jsonArray[index].to,
                        data: jsonArray[index],
                        }
                        console.log(a);
                        this.benimolanlar.push(a);
                      }
                      if(jsonArray[index].to == emailim){
                        var a = {
                          id: jsonArray[index].id, // veya sadece id: key
                        show: jsonArray[index].from,
                        data: jsonArray[index],
                        }
                        console.log(a);
                        this.benimolanlar.push(a);
                      }
                    }
                  })
                  .catch((error) => {
                    console.error('Veri çekme hatası:', error);
                  });
              });
            });


        }
      })
      .catch((err) => {
        console.log(err);
      });


    this.database
      .collection('kullanicilar')
      .get()
      .subscribe((doc) => {
        this.kullanicilar = [];

        doc.docs.forEach((element) => {
          //console.log(element.data());
          this.kullanicilar.push(element.data());
        });
        console.log(this.kullanicilar);


        /*
        this.database
          .collection('sohbetler')
          .snapshotChanges()
          .forEach((doc: any) => {
            this.benimolanlar = [];
            // doc.data() is never undefined for query doc snapshots
            console.log(doc);
            for (let index = 0; index < doc.length; index++) {
              console.log();

              if (
                doc[index].payload.doc._delegate._document.data.value.mapValue
                  .fields.from.stringValue == this.profilim.email ||
                doc[index].payload.doc._delegate._document.data.value.mapValue
                  .fields.to.stringValue == this.profilim.email
              ) {
                if (
                  this.profilim.email ===
                  doc[index].payload.doc._delegate._document.data.value.mapValue
                    .fields.from.stringValue
                ) {
                  for (let b = 0; b < this.kullanicilar.length; b++) {
                    if (
                      doc[index].payload.doc._delegate._document.data.value
                        .mapValue.fields.to.stringValue ==
                      this.kullanicilar[b].email
                    ) {
                      var dat = {
                        user: this.kullanicilar[b],
                        name: doc[index].payload.doc._delegate._document.data
                          .value.mapValue.fields.to.stringValue,
                        id: doc[index].payload.doc.id,
                      };
                      this.benimolanlar.push(dat);
                      console.log('çikti');
                      console.log(this.benimolanlar);
                    }
                  }
                } else {
                  for (let a = 0; a < this.kullanicilar.length; a++) {
                    if (
                      doc[index].payload._delegate.doc._document.data.value
                        .mapValue.fields.from.stringValue ==
                      this.kullanicilar[a].email
                    ) {
                      var dat = {
                        user: this.kullanicilar[a],
                        name: doc[index].payload._delegate.doc._document.data
                          .value.mapValue.fields.from.stringValue,
                        id: doc[index].payload.doc.id,
                      };
                      this.benimolanlar.push(dat);
                      console.log('çikti');
                      console.log(this.benimolanlar);
                    }
                  }
                }
              }
            }
          });*/
      });


  }
  async ionViewDidLeave() {}
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Lamba açılıyor',
      duration: 3000,
      cssClass: 'custom-toast',
    });

    await toast.present();
  }
  userclick(item) {
    console.log(item);
  }
  async presentToast2() {
    const toast = await this.toastController.create({
      message: 'Lamba Kapandı',
      duration: 3000,
      cssClass: 'custom-toastt',
    });

    await toast.present();
  }
  async presentToasthata() {
    const toast = await this.toastController.create({
      message: 'Lamba Açılamadı',
      duration: 3000,
      cssClass: 'custom-toasthata',
    });

    await toast.present();
  }
  async tomesaj(mesaj) {
    const toast = await this.toastController.create({
      message: mesaj,
      duration: 3000,
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  tipsec(data) {
    if (data.detail.value == 'userview') {
      this.userview = '';
      this.mesajview = 'hidden';
    } else if (data.detail.value == 'mesajview') {
      this.mesajview = '';
      this.userview = 'hidden';
    }
    console.log(data.detail.value);
  }

  async bulbakim(item) {
    this.getIpAndPort();
    const apiUrl = 'https://api.my-ip.io/v2/ip.json';

    const loading = await this.loadingCtrl.create({
      message: 'IP alınıyor',
      mode: 'ios',
    });
    loading.present();

    console.log(item);
    var a = this.database.createId();

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        // console.log('API Yanıtı:', data.asn.network);
        this.publicip = data.asn.network;
        loading.dismiss();
        console.log('pub =' + this.publicip);
        console.log('prv = ' + this.privip);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            toid: item.email,
            fromid: this.profilim.email,
            data: a,
            public: this.publicip,
            priv: this.privip,
          },
        };

        this.navctrl.navigateForward('chat', navigationExtras);
      },
      (error) => {
        console.error('API Hatası:', error);
        loading.dismiss();
      }
    );

    /*
    const loading = await this.loadingCtrl.create({
      message: 'gidiliyor',
      mode: 'ios',
    });
    let navigationExtras: NavigationExtras = {
      queryParams: {
        toid: item.email,
        fromid: this.profilim.email,
        data: a,
      },
    };
    ////
    this.database.collection("kullanicilar").doc(this.profileService.useridsi).update({
      isOnline:false
    }).then(r => {
      console.log("user is offliness brom");

    }).catch(err => {
      console.log(err);

    });
    ///
    this.navctrl.navigateForward('chat', navigationExtras);
    loading.dismiss();
    */
  }

  async bulbakimhome(item) {
    console.log(item);

    this.getIpAndPort();
    const apiUrl = 'https://api.my-ip.io/v2/ip.json';

    const loading = await this.loadingCtrl.create({
      message: 'IP alınıyor',
      mode: 'ios',
    });
    loading.present();

    console.log(item);
    var a = item.id;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        // console.log('API Yanıtı:', data.asn.network);
        this.publicip = data.asn.network;
        loading.dismiss();
        console.log('pub =' + this.publicip);
        console.log('prv = ' + this.privip);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            toid: item.data.from,
            fromid: this.profilim.email,
            data: a,
            public: this.publicip,
            priv: this.privip,
          },
        };

        this.navctrl.navigateForward('chat', navigationExtras);
      },
      (error) => {
        console.error('API Hatası:', error);
        loading.dismiss();

        let navigationExtras: NavigationExtras = {
          queryParams: {
            toid: item.data.to,
            fromid: this.profilim.email,
            data: a,
            public: "0.0.0.0",
            priv: this.privip,
          },
        };
        this.navctrl.navigateForward('chat', navigationExtras);

      }
    );
  }
}
