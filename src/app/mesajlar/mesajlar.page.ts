import { Component, ElementRef, ViewChild } from '@angular/core';
import { switchMap, map, filter } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
} from '@angular/fire/firestore';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProfileService } from '../services/profile.service';
import { from, Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: string;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Component({
  selector: 'app-mesajlar',
  templateUrl: './mesajlar.page.html',
  styleUrls: ['./mesajlar.page.scss'],
})
export class MesajlarPage {
  gonderilen: string = 'hidden';
  mesajlarim: string = '';

  benimolanlar = [];
  onunkiler = [];

  veriler = [];
  veri = [];
  benimkiler = [];
  userid: string;
  messages: Observable<Message[]>;
  konusmalar = [];
  aradiklarim = [];
  arananidler = [];
  secilen: string = 'mesajlarim';
  a = {};
  b = {};

  onunlist = [];
  benimlist = [];

  onunolanlar = [];
  benimolan =[];
  public loaded = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private profilservice: ProfileService,
    private navctrl: NavController,
    private routers: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  close() {
    this.router.navigateByUrl('/home');
  }

  /*
  async ionViewDidEnter() {
    this.aradiklarim = [];
    var aa = [];
    this.firestore.collectionGroup("kargolar").valueChanges().subscribe(at => {
      console.log(at);
      var a = [];
      a = at;
      for (let i = 0; i < at.length; i++) {
        if (a[i].kullanici_id == this.userid) {
          this.firestore.collection("mesajlar").doc(a[i].id).collection("msj").valueChanges().subscribe(ayr => {
            this.firestore.collection("kullanicilar").doc(ayr[0].from).valueChanges().subscribe(ana => {
              var b = {
                data :ana,
                adi: a[i],
              }
              this.arananidler.push(ayr);
              this.aradiklarim.push(b);
            });
          });
        }
      }
    });
  }*/

  async ionViewWillEnter() {


    this.konusmalar = [];
    this.routers.queryParams.subscribe((params) => {
      // console.log(params);
      this.benimkiler = params.data;
      this.userid = params.userid;
    });

    this.profilservice.getUserProfile();
    this.benimolanlar = [];
    this.onunkiler = [];




    this.firestore
      .collectionGroup('kargolar')
      .valueChanges()
      .subscribe((ana: any) => {
        for (let index = 0; index < ana.length; index++) {
          this.firestore
            .collection('mesajlar')
            .doc(ana[index].id)
            .collection('msj')
            .valueChanges()
            .subscribe((ebe: any) => {
              for (let i = 0; i < ebe.length; i++) {
                //    console.log(ebe[i].msg + " ===" + ana[index].kullanici_id);

                if (ana[index].kullanici_id == this.profilservice.useridsi) {
                  if (
                    ebe[i].to == this.profilservice.useridsi &&
                    ana[index].kullanici_id == this.profilservice.useridsi
                  ) {
                    var a = {
                      data: ana[index],
                      user: ebe[i],
                    };
                    this.benimolan.push(a);
                    this.benimlist.push(ana[index].kargo_adi);
                  } else {
                  }
                }

                if (
                  ebe[i].to == ana[index].kullanici_id &&
                  ana[index].kullanici_id != this.profilservice.useridsi
                ) {
                  var b = {
                    data: ana[index],
                    user: ebe[i],
                  };
                  this.onunolanlar.push(b);
                  this.onunlist.push(ana[index].kargo_adi);
                }

              }
            });
        }
        setTimeout(() => {
          this.filtrele();

        }, 500);
      });
  }

  filtrele() {
    const filitre = this.onunlist.filter((item, index) => {
      // Eğer mevcut öğenin indeksi aynı ise, yeni diziye dön.
      return this.onunlist.indexOf(item) === index;
    });
    this.onunkiler = filitre;

    const filitrebenim = this.benimlist.filter((itemm, indexx) => {
      // Eğer mevcut öğenin indeksi aynı ise, yeni diziye dön.
      return this.benimlist.indexOf(itemm) === indexx;
    });
    this.benimolanlar = filitrebenim;
    this.loaded = true;
  }

  tipsec(data) {
    this.secilen = data.detail.value;

    if (this.secilen == 'gönderilen') {
      this.gonderilen = '';
      this.mesajlarim = 'hidden';
      console.log(this.onunkiler);
    } else if (this.secilen == 'mesajlarim') {
      this.mesajlarim = '';
      this.gonderilen = 'hidden';
      console.log(this.benimolanlar);
    }
    console.log(this.secilen);
  }



async bulbakim(item){
  const loading = await this.loadingCtrl.create({
    message: 'gidiliyor',
    mode:'ios',
  });
  loading.present();
  if (this.secilen == 'gönderilen') {
    for (let index = 0; index < this.onunolanlar.length; index++) {
        if(this.onunolanlar[index].data.kargo_adi == this.onunkiler[item]){
          let navigationExtras: NavigationExtras = {
            queryParams: {
              toid: this.onunolanlar[index].user.from,
              fromid: this.onunolanlar[index].user.to,
              data: this.onunolanlar[index].data,
              durum: 2,
              id: this.onunolanlar[index].data.id,
            },
          };
          this.navctrl.navigateRoot('chat', navigationExtras);
          loading.dismiss();

        }
    }
  }
  else if (this.secilen == 'mesajlarim') {
    for (let i = 0; i < this.benimolan.length; i++) {
      if(this.benimolan[i].data.kargo_adi == this.benimolanlar[item]){

         let navigationExtras: NavigationExtras = {
          queryParams: {
            toid: this.benimolan[i].user.from,
            fromid: this.benimolan[i].user.to,
            data: this.benimolan[i].data,
          },
        };
        this.navctrl.navigateRoot('chat', navigationExtras);
        loading.dismiss();
      }
  }
  }
}


  ionViewWillLeave(){
    this.loaded = false;
    this.benimlist = [];
    this.benimolanlar = [];
    this.onunkiler = [];
    this.onunlist = [];
  }
}
