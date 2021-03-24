import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import * as firebase from 'firebase';

@Injectable()
export class ResumenProvider {
  reservacion: AngularFirestoreDocument<any[]>;
  _reservacion: Observable<any>;
  db = firebase.firestore();

  sucursales: AngularFirestoreDocument<any[]>;
  _sucursales: Observable<any>;

  zonasRe: AngularFirestoreDocument<any[]>;
  _zonasRe: Observable<any>;

  cupon: AngularFirestoreDocument<any[]>;
  _cupon: Observable<any>;

  constructor(public af: AngularFirestore) {
    console.log("Hello ResumenProvider Provider");
  }

  gerReservacion(idx) {
    this.reservacion = this.af.doc<any>(`reservaciones/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._reservacion = this.reservacion.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }


  getCupon(uid, codigo) {
    this.cupon = this.af.doc<any>(`canjeo`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._reservacion = this.reservacion.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }


  getCupones(uid: any, codigo: any): Promise<any> {
    console.log('uid', uid)
    console.log('codigo', codigo);

    return new Promise((resolve, reject) => {
      this.db.collection("canjeo").where('codigoCupon', '==', parseInt(codigo)).where("uid", "==", uid).get().then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(function (doc) {
          var obj = JSON.parse(JSON.stringify(doc.data()));
          obj.$key = doc.id;
          console.log(obj);
          arr.push(obj);
        });

        if (arr.length > 0) {
          console.log("Document data:", arr);
          resolve(arr);
        } else {
          console.log("No such document!");
          resolve(null);
        }
      })
        .catch((error: any) => {
          reject(error);
        });
    });
  }


  // this.db.collection("canjeo")
  // .where("codigoCupon", "==", data).where("uid", "==", this.uid)




  getSucursal(idx) {
    this.sucursales = this.af.doc<any>(`sucursales/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._sucursales = this.sucursales.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }


  getZona(idx) {
    this.zonasRe = this.af.doc<any>(`zonas/${idx}`);
    return (this._zonasRe = this.zonasRe.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }


}
