import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class CartaProvider {
  producto: AngularFirestoreDocument<any[]>;
  _producto: Observable<any>;
  constructor(public afdb: AngularFirestore) {
    console.log("Hello CartaProvider Provider");
  }

  getProduct(idProducto) {
    this.producto = this.afdb.doc<any>(`cartas/${idProducto}`);
    return (this._producto = this.producto.snapshotChanges().pipe(
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
