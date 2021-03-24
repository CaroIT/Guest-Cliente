import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
//import firebase from 'firebase';
//import { AngularFirestore } from '@angular/fire/firestore';
//import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import * as moment from "moment";

@Injectable()
export class UsuarioProvider {
data: any = {};

usuario: Credenciales = {};

codigo: AngularFirestoreCollection<any[]>;
_codigo: Observable<any>;

tarjetas: AngularFirestoreCollection<any[]>;
_tarjetas: Observable<any>;

tarjetasRegistradas: AngularFirestoreCollection<any[]>;
_tarjetasRegistradas: Observable<any>;

usuarioID: AngularFirestoreCollection<any[]>;
_usuarioID: Observable<any>;

tarjetaPagar: AngularFirestoreCollection<any[]>;
_tarjetaPagar: Observable<any>;

tarjetaPagar2: AngularFirestoreCollection<any[]>;
_tarjetaPagar2: Observable<any>;

  constructor(
              public afDB: AngularFireDatabase,
              public afireauth: AngularFireAuth,
              public afs: AngularFirestore
            ) { }

  cargarUsuario(nombre:string,
                email:string,
                imagen:string,
                uid:string,
                phone: string,
                provider:string){
              this.usuario.nombre= nombre;
              this.usuario.email = email;
              this.usuario.imagen= imagen;
              this.usuario.uid = uid;
              this.usuario.provider = provider;
              this.usuario.phone = phone;
                }

                public getUser(uid){
                return this.afDB.object('users/'+uid);
                }

   inhabilitar(uid){
     console.log(uid);
    this.data ={
      active: false
    }
    this.afs.collection('users').doc(uid).update(this.data);
    // this.afDB.database.ref('users/'+ uid).update(this.data);
   }

   habilitar(uid){
    console.log(uid);
   this.data ={
     active: true
   }
   this.afs.collection('users').doc(uid).update(this.data);
  //  this.afDB.database.ref('users/'+ uid).update(this.data);
  }

  //Agregar el  telfono del usuario
   public agregarTelefono(idx,telefono,ciudad) {
      console.log('El user llego al provider',idx);
      console.log('El telfono llego al provider',telefono);
      console.log('La ciudad llego al provider',ciudad);
     return new Promise((resolve, reject) => {
       this.afs
         .collection("users")
         .doc(idx)
         .update({
           phoneNumber: telefono,
           ciudad: ciudad
         })
         .then(reserva => {
           console.log("Reservación actualizada: ", JSON.stringify(reserva));
           resolve({ success: true });
         })
         .catch(err => {
           reject(err);
         });
     });
   }

   public getCodigo(idx) {
            // return this.afiredatabase.object("sucursales/" + uid);
            this.codigo = this.afs.collection<any>("users", ref =>
              ref.where("uid", "==", idx)
            );
            this._codigo = this.codigo.valueChanges();
            return (this._codigo = this.codigo.snapshotChanges().pipe(
              map(changes => {
                return changes.map(action => {
                  const data = action.payload.doc.data() as any;
                  data.$key = action.payload.doc.id;
                  return data;
                });
              })
            ));
    }

    //insertar registro de tarjeta
        public agregarTarjeta(idUsuario,numTarjeta,anioExp,mesExp,cvc,numTarjeta4dijitos) {
            return new Promise((resolve, reject) => {
              this.afs
                .collection("tarjetas")
                .add({
                  idUsuario: idUsuario,
                  numTarjeta: numTarjeta,
                  numTarjeta4dijitos: numTarjeta4dijitos,
                  anioExpiracion: anioExp,
                  mesExpiracion: mesExp,
                  cvc: cvc,
                  estatus: 'ACTIVA'
                })
                .then(reserva => {
                  console.log("registro exitoso: ", reserva.id);
                  this.updateTarjetaId(reserva.id);
                  resolve({ success: true, idTarjeta: reserva.id });
                })
                .catch(err => {
                  reject(err);
                });
            });
          }
       //guardar el regstro d euna  nueva tarjeta registrada
          public updateTarjetaId(ID) {
            this.afs
              .collection("tarjetas")
              .doc(ID)
              .update({
                idTarjeta: ID
              })
              .then(() => {})
              .catch(() => {});
          }

          //obtener el ID del usuario con el numero de telefono recibido
          public getUsuarioID(idx) {
                   this.usuarioID = this.afs.collection<any>("users", ref =>
                     ref
                     .where("phoneNumber", "==", idx)
                   );
                   this._usuarioID = this.usuarioID.valueChanges();
                   return (this._usuarioID = this.usuarioID.snapshotChanges().pipe(
                     map(changes => {
                       return changes.map(action => {
                         const data = action.payload.doc.data() as any;
                         data.$key = action.payload.doc.id;
                         return data;
                       });
                     })
                   ));
            }

            //obtener la tarjeta registrada y activa del id del usuario obtenido
            public getTarjetaPagar(idx) {
                     this.tarjetaPagar = this.afs.collection<any>("tarjetas", ref =>
                       ref
                       .where("idUsuario", "==", idx)
                       .where("estatus", "==", "ACTIVA")
                     );
                     this._tarjetaPagar = this.tarjetaPagar.valueChanges();
                     return (this._tarjetaPagar = this.tarjetaPagar.snapshotChanges().pipe(
                       map(changes => {
                         return changes.map(action => {
                           const data = action.payload.doc.data() as any;
                           data.$key = action.payload.doc.id;
                           return data;
                         });
                       })
                     ));
              }

              //obtener la tarjeta registrada y activa del id del usuario
              public getTarjetaPagar2(idx) {
                       this.tarjetaPagar2 = this.afs.collection<any>("tarjetas", ref =>
                         ref
                         .where("idUsuario", "==", idx)
                         .where("estatus", "==", "ACTIVA")
                       );
                       this._tarjetaPagar2 = this.tarjetaPagar2.valueChanges();
                       return (this._tarjetaPagar2 = this.tarjetaPagar2.snapshotChanges().pipe(
                         map(changes => {
                           return changes.map(action => {
                             const data = action.payload.doc.data() as any;
                             data.$key = action.payload.doc.id;
                             return data;
                           });
                         })
                       ));
                }

          //obtener todas las trajetas registradas del usuario
          public getTarjetasUser(idx) {
            //console.log('mi user en provider',idx);
                   // return this.afiredatabase.object("sucursales/" + uid);
                   this.tarjetas = this.afs.collection<any>("tarjetas", ref =>
                     ref
                     .where("idUsuario", "==", idx)
                     .where("estatus", "==", 'ACTIVA')
                   );
                   this._tarjetas = this.tarjetas.valueChanges();
                   return (this._tarjetas = this.tarjetas.snapshotChanges().pipe(
                     map(changes => {
                       return changes.map(action => {
                         const data = action.payload.doc.data() as any;
                         data.$key = action.payload.doc.id;
                         return data;
                       });
                     })
                   ));
            }
            //obtener todas las trajetas registradas del usuario que sean diferentes a eliminadas
            public getTarjetasRegistradas(idx) {
              console.log('mi user en provider',idx);
                     // return this.afiredatabase.object("sucursales/" + uid);
                     this.tarjetasRegistradas = this.afs.collection<any>("tarjetas", ref =>
                       ref
                       .where("idUsuario", "==", idx)
                       .where("estatus", "==", "ACTIVA")
                     );
                     this._tarjetasRegistradas = this.tarjetasRegistradas.valueChanges();
                     return (this._tarjetasRegistradas = this.tarjetasRegistradas.snapshotChanges().pipe(
                       map(changes => {
                         return changes.map(action => {
                           const data = action.payload.doc.data() as any;
                           data.$key = action.payload.doc.id;
                           return data;
                         });
                       })
                     ));
              }

            //Cambiar estatus de la tarjeta a eliminado
             public updateTarjetaEliminar(idx) {
               //eliminar definitivamente de la base la tarjeta
               var promise = new Promise((resolve, reject) => {
                 this.afs
                   .collection("tarjetas")
                   .doc(idx)
                   .delete()
                   .then(() => {
                     resolve(true);
                   })
                   .catch(err => {
                     reject(err);
                   });
               });
               return promise;
              // return new Promise((resolve, reject) => {
              //   this.afs
              //     .collection("tarjetas")
              //     .doc(idx)
              //     .update({
              //       estatus: "Eliminada"
              //     })
              //     .then(reserva => {
              //       console.log("Reservación actualizada: ", JSON.stringify(reserva));
              //       resolve({ success: true });
              //     })
              //     .catch(err => {
              //       reject(err);
              //     });
               //});
             }


             //Cambiar estatus de la tarjeta a ACTIVA
              public updateTarjetaActiva(idx) {
              //  console.log('llego a provider la tarjeta',idx);
              //  console.log('llego a provider la tarjeta anterior',tarjetaAnterior);
                return new Promise((resolve, reject) => {
                  this.afs
                    .collection("tarjetas")
                    .doc(idx)
                    .update({
                      estatus: "ACTIVA"
                    })
                    .then(reserva => {
                      console.log("tarjeta activada: ", JSON.stringify(reserva));
                      resolve({ success: true});
                    })
                    .catch(err => {
                      reject(err);
                    });
                });
              }
              //Volver inactiva cuando se cambia a otra tarjeta
               public updateTarjetaVolverInactiva(idx) {
                 return new Promise((resolve, reject) => {
                   this.afs
                     .collection("tarjetas")
                     .doc(idx)
                     .update({
                       estatus: "INACTIVA"
                     })
                     .then(reserva => {
                       console.log("Reservación actualizada: ", JSON.stringify(reserva));
                       resolve({ success: true });
                     })
                     .catch(err => {
                       reject(err);
                     });
                 });
               }


}

export interface Credenciales {
  nombre?:string;
  email?:string;
  imagen?:string;
  uid?:string;
  phone?: string;
  provider?:string;
}
