import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DeviceditComponent } from '../components/devicedit/devicedit.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProfileService } from '../services/profile.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-rutins',
  templateUrl: './rutins.page.html',
  styleUrls: ['./rutins.page.scss'],
})
export class RutinsPage {
  hotkeys =[];
  userid: string;
  segmentvalue: boolean;
  constructor(
    private navctrl:NavController,
    public modalController: ModalController,
    private database: AngularFirestore,
    private profileService: ProfileService,

  ) { }

  async editdev(detay) {
    console.log(detay);

    const modal = await this.modalController.create({
      component: DeviceditComponent,
      handle: true,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.25,
      cssClass:"devmodal",
      componentProps: {
        data: detay,
        durum: 1,
        profilid:this.userid
      },
    });
    modal.present();

    await modal.onWillDismiss();
  }

  homegit(){
    this.navctrl.navigateRoot("home");
  }

  tab2git(){
    this.navctrl.navigateRoot("tab2");

  }
  profilgit() {
    this.navctrl.navigateRoot('profile');
  }


  segmentchange(e){
    console.log(e.detail.value);
    if(e.detail.value == "ekle"){
      this.segmentvalue = true;
    }else if(e.detail.value == "gor"){
      this.segmentvalue = false;
    }
  }

  async ionViewWillEnter() {

    this.profileService.getUserProfile().then(r=>{
      this.userid = this.profileService.useridsi;
      this.database.collection("/kullanicilar/")
       .doc(this.profileService.useridsi)
       .collection("hotkeys")
       .snapshotChanges().subscribe(actions => {
        this.hotkeys = [];
         actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          console.log(data);
          this.hotkeys.push(data);
        });
      });

    });


   }
   deldev(dev){
    console.log(dev);
    this.database.collection("/kullanicilar/").doc(this.userid).collection("/hotkeys/").doc(dev.id).delete();
   }
}
