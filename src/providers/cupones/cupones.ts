import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import * as firebase from 'firebase';


@Injectable()
export class CuponesProvider {

  data = {};
  datuser: AngularFirestoreCollection<any[]>;
  _datuser: Observable<any>;
  db = firebase.firestore();
  cupones: AngularFirestoreCollection<any[]>;
  _cupones: Observable<any>;
  sucursales: AngularFirestoreCollection<any[]>;
  _sucursales: Observable<any>;

  constructor(
    public afDB: AngularFireDatabase,
    public afireauth: AngularFireAuth,
    public afs: AngularFirestore) {
    console.log('Hello CuponesProvider Provider');
  }


  totalcupones() {

  }

  public getDataUser(uid) {
    console.log('uid', uid);
    return new Promise((resolve, reject) => {
      this.db.collection("users").doc(uid).get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
            resolve(null);
          } else {
            console.log("Document data:", doc.data());
            resolve(doc.data());
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
          reject(err);
        });
    });
    // return this.afDB.object('evento/'+id);
  }

  getDataSucursal(ciudad) {
    this.sucursales = this.afs.collection<any>("sucursales", ref =>
      ref.where("ciudad", "==", ciudad));
    this._sucursales = this.sucursales.valueChanges();

    return (this._sucursales = this.sucursales.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }


  public getDataCanjeo(uid) {
    this.cupones = this.afs.collection<any>("canjeo", ref =>
      ref.where("idUser", "==", uid));
    this._cupones = this.cupones.valueChanges();

    return (this._cupones = this.cupones.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }


}
