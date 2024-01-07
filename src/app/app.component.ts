import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Ana Sayfa', url: '/home', icon: 'home' },
    { title: 'Profil', url: '/profile', icon: 'person' },

  ];
  constructor() {}
}
