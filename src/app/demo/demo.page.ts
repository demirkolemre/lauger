import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.page.html',
  styleUrls: ['./demo.page.scss'],
})
export class DemoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  bak(event){
    console.log(event.detail.checked);
    if(event.detail.checked == true){
      document.getElementById("bulb").style.color = "lightcoral";
      document.getElementById("bb").style.boxShadow = "1px 0px 19px 5px lightcoral";

    }else{
      document.getElementById("bulb").style.color = "gray";
      document.getElementById("bb").style.boxShadow = "none";

    }


  }
}
