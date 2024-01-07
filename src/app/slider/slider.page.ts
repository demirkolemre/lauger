import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage implements OnInit {

  constructor(
    private navctrl:NavController,
    private storage:Storage
  ) { }

  ngOnInit() {
  }

  gec(){

    this.navctrl.navigateRoot("/home");
  }

  show(e){
    console.log(e.detail.checked);
    this.storage.create();

    if(e.detail.checked == true){
      this.storage.set("slidershow",true);
    }else if(e.detail.checked == false){
      this.storage.set("slidershow",false);
    }

  }
  demo(event){
    console.log(event);

  }
}
