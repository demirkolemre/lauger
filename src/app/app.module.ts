import { Injectable, NgModule } from '@angular/core';
import { BrowserModule , HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import {CardComponent} from './components/card/card.component';
import { DeviceditComponent } from './components/devicedit/devicedit.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent,CardComponent,DeviceditComponent],

  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,
   AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers:[{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ,  AngularFireAuthGuard,AngularFireModule],

  bootstrap: [AppComponent],
})
export class AppModule {}
