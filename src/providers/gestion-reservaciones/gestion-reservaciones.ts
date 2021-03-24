import { Injectable } from '@angular/core';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument 
        } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";


@Injectable()
export class GestionReservacionesProvider {
  db = firebase.firestore();
  servicios: AngularFirestoreCollection<any[]>;
  _servicios: Observable<any>;
  usuarios: AngularFirestoreCollection<any[]>;
  _usuarios: Observable<any>;
  areas: AngularFirestoreCollection<any[]>;
  _areas: Observable<any>;
  zonas: AngularFirestoreCollection<any[]>;
  _zonas: Observable<any>;
  reservacionDoc: AngularFirestoreDocument;
  reservacion: Observable<any>;

  mesasCollection: AngularFirestoreCollection;
  mesas: Observable<any[]>;

  items: any[] = [];

  constructor(public aFS: AngularFirestore) {
  }
  
  getReservaciones(idx, fecha) {
    this.servicios = this.aFS.collection<any>("reservaciones", ref =>
      ref.where("idSucursal", "==", idx).where("fechaR_","==",fecha).orderBy("hora","asc"));
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getUsuarios() {
    this.usuarios = this.aFS.collection<any>("users", ref =>
      ref.where("type", "==", "u"));
    this._usuarios = this.usuarios.valueChanges();

    return (this._usuarios = this.usuarios.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getReservacion(idServicio: string) {
    this.reservacionDoc = this.aFS.doc(`reservaciones/${idServicio}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getArea(idArea: string) {
    this.reservacionDoc = this.aFS.doc(`areas/${idArea}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getZona(idZona: string) {
    this.reservacionDoc = this.aFS.doc(`zonas/${idZona}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getMesas(idx) {    
    this.mesasCollection = this.aFS.collection("mesas", ref =>
      ref
        .where("uidZona", "==", idx).orderBy("mesa")
    );
    this.mesas = this.mesasCollection.valueChanges();
    return (this.mesas = this.mesasCollection
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(action => {
            const data = action.payload.doc.data();
            data.id = action.payload.doc.id;
            return data;
          });
        })
      ));
  }

  // consultarMesas() {    
  //   this.mesasCollection = this.aFS.collection("mesas");
  //   this.mesas = this.mesasCollection.valueChanges();
  //   return (this.mesas = this.mesasCollection
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes => {
  //         return changes.map(action => {
  //           const data = action.payload.doc.data();
  //           data.id = action.payload.doc.id;
  //           return data;
  //         });
  //       })
  //     ));
  // }

  actualizaEstatus(idx, estatus) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("mesas")
        .doc(idx)
        .update({
          estatus: estatus
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  Cancelar() {
    let mesas = JSON.parse(localStorage.getItem('mesas'));
    if (mesas != null) {      
      this.items = JSON.parse(localStorage.getItem('mesas'));
      var contador = 1;
      for(let item of this.items){
        console.log("Contador: ", contador);                        
          this.db
            .collection("mesas")
            .doc(item)
            .update({
              estatus: "libre"
            })
            .then(() => {
              console.log("Si lo hizo para: ",item);                            
            })
            .catch(err => {
              console.log("Error no lo hizo para: ",item);                
            });      
      contador++;
      }

    }      
    localStorage.removeItem("mesas");
  }

  Aceptar(idx, mesas){  
    localStorage.removeItem("ids");
    localStorage.removeItem("mesas");
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("reservaciones")
        .doc(idx)
        .update({
          mesas: mesas
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;    
  }  
}
