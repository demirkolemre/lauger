import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,

} from '@angular/fire/firestore';
import { ProfileService } from 'src/app/services/profile.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  @ViewChild(IonContent) content: IonContent;

  messages:any ;
  newMsg = '';
  id: string;
  to: string;
  from: string;
  adi: string;
  odaid: string;
  public:string = null;
  priv:string = null;
  mes = [];


  mesajkutusucevap: String = "hidden";
  mesajkutusuilk: string = "hidden";
  ipveri:any = {
    public:"0",
    priv:"0",
    tarih:"0"
  };
  constructor(
    private chatService: ChatService,
    private database: AngularFirestore,
    private profileService: ProfileService,
    private realbd: AngularFireDatabase,
    private storage:Storage,
    private loadingCtrl: LoadingController,

    private router: Router,
    private routers: ActivatedRoute,

  ) { }



  async ionViewWillEnter() {
    this.profileService.getUserProfile();
    this.storage.create();

    this.messages = undefined;
    this.mes = [];
    var durum = 0;


    this.routers.queryParams.subscribe(params => {
     console.log(params);

      this.id = params.data;
      this.to = params.toid;
      this.from = params.fromid;
      this.public =params.public;
      this.priv=params.priv;
      this.almesaj();
    });



  }

  ionViewWillLeave() {
    this.mes = [];
    this.messages = undefined;
    this.id = "";
    this.to = "";
    this.from = "";
    this.adi = "";
    this.odaid = "";
  }
  async almesaj(){
    this.messages = [];
  const loading = await this.loadingCtrl.create({
    message: 'Mesajlar alınıyor',
    mode: 'ios',

  });
  loading.present();

 this.chatService.getChatMessages(this.to, this.from, this.id, this.adi);


setTimeout(() => {
  console.log(this.chatService.mss.msg);
  const jsonArray = Object.keys(this.chatService.mss).map(key => this.chatService.mss[key]);
  console.log(jsonArray);
  this.messages = jsonArray;

  loading.dismiss();

}, 1500);
setTimeout(() => {
  loading.dismiss();
}, 2000);

}

  sendMessage() {

   // console.log(this.newMsg, this.to, this.from, this.id);

    //console.log(this.newMsg,this.to,this.from,this.id);

    this.chatService.addChatMessage(this.newMsg, this.to, this.from, this.id,this.priv,this.public).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
    this.almesaj();
  }

   ionViewDidEnter(){
    this.realbd.object("/sohbetler/"+this.id ).valueChanges().subscribe((r) => {
      console.log("degisim algilandı");
      console.log(r);
      this.ipveri = r;
      if(this.ipveri == null){
        console.log("ilkkez girildi ");
        this.ipveri = {
          public:this.public,
          priv:this.priv,
          tarih:"0"
        };
      }else{
        console.log(this.ipveri);

        this.storage.get(this.id).then(r => {
          console.log(r);

        });
      }

    },

    (error) => {
      console.log("hata vaaar");
      console.log(error);

    });
/*
    this.database.collection("kullanicilar").doc(this.profileService.useridsi).update({
      isOnline:true
    }).then(r => {
      console.log("user is online brom");

    });*/
  }



  signOut() {
    this.mes = [];
    this.messages = null;
    this.router.navigateByUrl("/home");

    /*
    this.database.collection("kullanicilar").doc(this.profileService.useridsi).update({
      isOnline:false
    }).then(r => {
      console.log("user is offliness brom");
      this.router.navigateByUrl("/home");
    })*/

  }

}
