import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProfileService } from '../services/profile.service';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-blue',
  templateUrl: './blue.page.html',
  styleUrls: ['./blue.page.scss'],
})
export class BluePage {
  characteristic: any;
  iframeSrc: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer,
    private profile:ProfileService
    ,private loadingCtrl: LoadingController,
    private navctrl:NavController
    ) {}

  async ionViewWillEnter() {

    this.profile.getUserProfile();

    console.log(this.iframeSrc);
    console.log(this.profile.useridsi);

  }

  /*
  async blesiken() {
    console.log('clicked');

    try {
      const mobileNavigatorObject: any = window.navigator;
      const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
      const CHARACTERISTIC_UUID_TX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

      if (mobileNavigatorObject && mobileNavigatorObject.bluetooth) {
        const device = await mobileNavigatorObject.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [SERVICE_UUID],
        });

        console.log('Cihaz adı:', device.name);
        const server = await device.gatt.connect();
        console.log('Cihaza bağlanıldı:', server);
        const service = await server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID_TX);
        console.log('Karakteristik bulundu.');
        this.characteristic = characteristic;

        const notifyData = new TextEncoder().encode('wifitara');

        await this.characteristic.writeValue(notifyData);
        console.log('Veri gönderildi.');
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
    }
  }


  */


  async blesiken() {
    console.log('clicked');

    try {
      const mobileNavigatorObject: any = window.navigator;
      const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
      const CHARACTERISTIC_UUID_TX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

      if (mobileNavigatorObject && mobileNavigatorObject.bluetooth) {
        const device = await mobileNavigatorObject.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [SERVICE_UUID],
        });

        console.log('Cihaz adı:', device.name);

        const server = await device.gatt.connect();
        console.log('Cihaza bağlanıldı:', server);

        const service = await server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID_TX);
        console.log('Karakteristik bulundu.');
        this.characteristic = characteristic;

        const notifyData = new TextEncoder().encode('wifitara');

        await this.characteristic.writeValue(notifyData);
        console.log('Veri gönderildi.');
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
      // Hata durumunu daha ayrıntılı incelemek için konsol çıktısını kontrol edin.
    }
  }
  async press() {
    if (this.characteristic) {
      const notifyData = new TextEncoder().encode('wifitara');
      try {
        await this.characteristic.writeValue(notifyData);
        console.log('Veri gönderildi.');
      } catch (error) {
        console.error('Veri gönderme hatası:', error);
      }
    }
  }

  back() {
    console.log('move to back');
  }

  gec(){
    this.navctrl.navigateRoot("home");
  }

demo(e){
  console.log(e);

}

  async openIframe() {

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('http://192.168.4.1/paramsave?input=' + this.profile.useridsi);


    // Belirli bir süre sonra iframe'in adresini değiştir
    const loading = await this.loadingCtrl.create({
      message: 'Cihaza Bağlanılıyor...',
      duration: 10000,
    });

    loading.present().then(r =>  {
      setTimeout(() => {
          this.changeIframeSrc();
        console.log("işlem tamam");

        }, 3011);

    });

  }

  private changeIframeSrc() {
    // Iframe'in src'sini güvenli bir biçimde değiştirerek başka bir sayfaya yönlendirin
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('http://192.168.4.1/wifi');
  }


}
