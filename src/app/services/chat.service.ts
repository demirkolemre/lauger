import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@ionic/storage-angular';

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

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUser: User = null;
  roomid: string;
  from: string;
  a: any;

  userlar = [];
  kayit = [];
  anaveriler = {};

   idayol: string;
  data =[];
  public mss: any;
  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private storage:Storage,

    private realbd: AngularFireDatabase,
    private profilservice: ProfileService,
    private database: AngularFirestore) {
      this.idayol = this.database.createId();
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }


  createChat(to: string, from: string, id: string,adi:string) {
    console.log("kimdem =" + from);
    console.log("nereye =" + to);
    console.log("oda idsi =" + this.idayol);
    this.from = from;
    var d = new Date();

    if (id == undefined) {
      this.router.navigateByUrl("tab2")
    } else {
      var data =
      {
        from: from,
        to:to,
        tarih: d,
        id:id,
        adi:adi


      }


      this.anaveriler= data;
      // return this.database.collection("mesajlar").doc(id).set(data);

      console.log(this.idayol);

      this.database.collection("sohbetler").doc(this.idayol).snapshotChanges().subscribe(as => {
        console.log(as.payload.exists);
        if(as.payload.exists == false){
          this.database.collection("sohbetler").doc(this.idayol).set(data);
          console.log("ekledim patron");

        }
      })
    }


  }



  addChatMessage(msg: string, to: string, from: string, id: string, priv: string, publicip: string) {
    var idcret = this.database.createId();
    console.log(idcret);

    var d = new Date();

    var data = {
      from: from,
      msg: msg,
      tarih: d.toISOString(),
      to: to,
    };

    var dat = {
      from: from,
      tarih: d.toISOString(),
      to: to,
      public: publicip,
      priv: priv,
    };

    var store = {
      msg: {},
      from: from,
      tarih: d.toISOString(),
      to: to,
      public: publicip,
      priv: priv,
    };

    store.msg[idcret] = data; // data doğrudan msg içine eklendi

    if (id != undefined) {
      this.realbd.database.ref("/sohbetler/" + id).set(dat);

      // Bu satırda sadece msg alanını güncelliyoruz, diğer alanlara dokunmuyoruz
      this.storage.get(id).then((existingStore: any) => {
        if (existingStore) {
          existingStore.msg = { ...existingStore.msg, ...store.msg };
          this.storage.set(id, existingStore);
        } else {
          this.storage.set(id, store);
        }
      });

      return this.realbd.database.ref("/sohbetler/" + id + "/msg").update({ [idcret]: data });
    } else {
      var adi = "s";
      console.log("ID YOK MESAJ GÖNDERİLEMEDİ");
      this.createChat(to, from, id, adi);
    }
  }



/*
  getChatMessages(to: string, from: string, id: string,adi:string) {
    console.log(id);



    this.storage.create();
    let users = [];



    this.storage.get(id).then(r=>{
      if(r == null){
      var newid =  id.substr(0, 1).toUpperCase() + id.substr(1);

      this.storage.get(newid).then(ra => {
        console.log(ra.msg);

      });
      }else{
        this.storage.get(id).then(ra => {
          console.log(ra.msg);

        });
      }
    });


    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.database.collection("sohbetler").doc(id).collection("msg", ref => ref.orderBy('tarih')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map(messages => {

        // Get the real name for each user
        for (let m of messages) {
          console.log(m);

          m.fromName = this.getUserForMsg(m.from, users);
          m.fromName = m.from;
          m.myMsg = this.currentUser.email === m.from;



        }
        return messages
      })
    )
  }
*/

getChatMessages(to: string, from: string, id: string, adi: string){
  console.log(id);
  let users = [];
  let mss;

 this.storage.get(id).then(async (r) => {
    if (r == null) {
      const newid = id.substr(0, 1).toUpperCase() + id.substr(1);
      const ra = await this.storage.get(newid);
      console.log(ra);

      if(ra == null){
        this.realbd.database
                  .ref('sohbetler/'+id)
                  .once('value')
                  .then((snapshot) => {

                    const data = snapshot.val();
                    const keys = Object.keys(data);
                    console.log(data);
                    mss = data.msg;
                    console.log(mss);
                    this.mss =data.msg;
                  });
      }else{
        console.log(ra.msg);
        mss = ra.msg;
        }

    } else {
      console.log(r.msg);
      mss = r.msg;
    }
    this.mss = mss;
    console.log(this.mss);

    users = await this.getUsers().toPromise();

    // Get the real name for each user
    for (let m of this.mss) {
      console.log(m);
      m.fromName = await this.getUserForMsg(m.from, users);
      m.myMsg = this.currentUser.email === m.from;
    }
    return mss;
  })

}

/*orjins
getChatMessages(to: string, from: string, id: string,adi:string) {
  console.log(from);
  console.log(to);
this.idayol = id;
  let users = [];
  return this.getUsers().pipe(
    switchMap(res => {
      users = res;
      return this.database.collection("mesajlar").doc(id).collection("msj", ref => ref.orderBy('tarih')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
    }),
    map(messages => {
      // Get the real name for each user
      for (let m of messages) {
        //console.log(m);
        m.fromName = this.getUserForMsg(m.from, users);
        m.myMsg = this.currentUser.uid === m.from;
      }
      return messages
    })
  )
}
*/



/*
getChatMessages(to: string, from: string, id: string, adi: string): Observable<Message[]> {
  return this.storage.get(id).then(r => {}).pipe(
    switchMap((r) => {
      if (r == null) {
        const newid = id.substr(0, 1).toUpperCase() + id.substr(1);
        return this.storage.get(newid);
      } else {
        return this.storage.get(id);
      }
    }),
    switchMap((ra) => {
      console.log(ra.msg); // Adjust this according to your data structure
      return this.getUsers().pipe(
        switchMap((users) => {
          return this.database
            .collection('sohbetler')
            .doc(id)
            .collection('msg', (ref) => ref.orderBy('tarih'))
            .valueChanges({ idField: 'id' }) as Observable<Message[]>;
        }),
        map((messages) => {
          // Get the real name for each user
          for (let m of messages) {
            console.log(m);

            m.fromName = this.getUserForMsg(m.from, users);
            m.myMsg = this.currentUser.email === m.from;
          }
          return messages;
        })
      );
    })
  );
}
*/
   almesaj(to: string, from: string, id: string,adi:string) {
    this.data = [];
    this.database.collection("sohbetler").doc(id).collection("msg").valueChanges().subscribe(bak => {
     console.log(this.currentUser.uid);


      for(let mes of bak){
//        mes.fromName = this.getUserForMsg(mes.from, users);

            console.log(mes);
            this.data.push(mes);
          }

    })


    console.log(this.data);
    return this.data;

    /*
          let users = [];
     return this.getUsers().pipe(
       switchMap(res => {
         users = res;
         users = [{
          uid: from,
          email: to
       }]
         return this.database.collection("mesajlar").doc(id).collection("msg").doc( "asdas",ref => ref.orderBy('tarih')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
       }),
       map(messages => {
         // Get the real name for each user
         for (let m of messages) {

           m.fromName = this.getUserForMsg(from, users);
           m.myMsg = this.currentUser.uid === m.from;
           console.log(m);

         }
         return messages
       })
     )
     */
   }



  private getUsers() {
    var a = this.database.collection('kullanicilar').valueChanges({ idField: 'uid' }) as Observable<User[]>;
   // console.log(a);

    return a;
  }

  private getUserForMsg(msgFromId, users: User[]): string {

    //console.log(msgFromId);

    for (let usr of users) {
      if (usr.uid == msgFromId) {
       console.log(usr.email);

        return usr.email;
      }
    }
    return 'Deleted';
  }

  // TODO Chat functionality
}
