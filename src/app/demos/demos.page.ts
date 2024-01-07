import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demos',
  templateUrl: './demos.page.html',
  styleUrls: ['./demos.page.scss'],
})
export class DemosPage implements OnInit {

  sayfano:number=0;
  constructor() { }

  ngOnInit() {
    this.updatebar()
  }


  bak(e){
    this.sayfano++;
    console.log(this.sayfano);
    this.updatebar();


  }

  bak2(e){
    this.sayfano--;
    console.log(this.sayfano);
    this.updatebar();
  }


  updatebar(){
    if(this.sayfano == 0){
      document.getElementById("0").setAttribute("selected","true");
    }else if(this.sayfano == 1){
      document.getElementById("1").setAttribute("selected","true");

    }else if(this.sayfano == 2){
      document.getElementById("2").setAttribute("selected","true");

    }
  }
}
