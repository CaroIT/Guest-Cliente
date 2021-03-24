import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
//import firebase from 'firebase'
import * as firebase from "firebase";
import {
  ToastController,
  AlertController,
  LoadingController
} from "ionic-angular";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";


@Injectable()
export class SucursalAltaProvider {
  db = firebase.firestore();
  data: any = {};
  uid: any;
  sucursal: Credenciales = {};
  imagenes: Credenciales[] = [];
  selectedSucursalItem: Credenciales = new Credenciales();

  areasCollection: AngularFirestoreCollection;
  areas: Observable<any[]>;

  zonasCollection: AngularFirestoreCollection;
  zonas: Observable<any[]>;

  // para querys where
  sucursalDoc: AngularFirestoreCollection<any[]>;
  _sucursal: Observable<any>;
  firedata = firebase.database().ref("/sucursales");

  Sucursal: AngularFirestoreDocument<any[]>;
  _Sucursal: Observable<any>;

  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadinCtl: LoadingController,
    public afs: AngularFirestore
  ) {
    
  }
  
  newRegister(newsucursal) {
    var config = {apiKey: "AIzaSyBixlCb21nNbPSurY-Pvqu3hZB80Icl9Pk",
    authDomain: "guestreservation-8b24b.firebaseapp.com",
    databaseURL: "https://guestreservation-8b24b.firebaseio.com"};
    var secondaryApp = firebase.initializeApp(config, "Secondary");
    secondaryApp.auth().createUserWithEmailAndPassword(newsucursal.email, newsucursal.password).then((firebaseUser) => {      
      this.uid = firebaseUser.user.uid;      
      console.log("User " + this.uid + " created successfully!");         
    })
    this.register(newsucursal, this.uid);
  }

  register(newsucursal, uid) {
              this.afs
                .collection("sucursales").doc(uid)
                .set({
                  uid:uid,
                  displayName: newsucursal.sucursal,
                  contacto: newsucursal.nombrecontacto,
                  direccion: newsucursal.direccion,
                  photoURL: "../assets/imgs/icons/home.png",
                  email: newsucursal.email,
                  password: newsucursal.password,
                  status: "activo",
                  tipo: newsucursal.tipo,
                  type: 'a',
                  tel: newsucursal.telefono,
                  sucursal: true
                });
  }

  cargarSucursal(
    sucursal: string,
    contacto: string,
    direccion: string,
    imagen: string,
    email: string,
    tel: number,
    uid: string
  ) {
    this.sucursal.displayName = sucursal;
    this.sucursal.contacto = contacto;
    this.sucursal.direccion = direccion;
    this.sucursal.imagen = imagen;
    this.sucursal.email = email;
    this.sucursal.tel = tel;
    this.sucursal.uid = uid;
  }
  public getSucursal(uid) {
    // return this.afiredatabase.object("sucursales/" + uid);
    console.log("uid", uid);
    this.sucursalDoc = this.afs.collection<any>("sucursales", ref =>
      ref.where("uid", "==", uid)
    );
    this._sucursal = this.sucursalDoc.valueChanges();
    return (this._sucursal = this.sucursalDoc.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
 
  getOneSucursal(idx) {
    this.Sucursal = this.afs.doc<any>(`sucursales/${idx}`);
    return (this._Sucursal = this.Sucursal.snapshotChanges().pipe(
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

  updateProfile(data) {
    console.log(data.uid);
    this.afs
      .collection("sucursales")
      .doc(data.uid)
      .update(data);
    // this.afiredatabase.database.ref("sucursales/" + data.uid).update(data);
  }
  cargar_imagen_firebase(archivo: Credenciales) {
    let promesa = new Promise((resolve, reject) => {
      this.mostrar_toast("Cargando..");

      let storeRef = firebase.storage().ref();
      let photoURL: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(`sucursales/${photoURL}.jpg`)
        .putString(archivo.photoURL, "base64", { contentType: "image/jpeg" });
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //saber el % cuantos se han subido
        error => {
          //manejo
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          this.mostrar_toast(JSON.stringify(error));
          reject();
        },
        () => {
          // TODO BIEN!
          console.log("Archivo subido");
          this.mostrar_toast("Imagen cargada correctamente");
          // let url = uploadTask.snapshot.downloadURL;
          // this.crear_post( archivo.titulo, url, nombreArchivo );
          // resolve();
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(urlImage => {
              this.crear_post(archivo.uid, urlImage);
              this.mostrar_toast("URL" + urlImage);
            })
            .catch(error => {
              console.log(error);
            });
          resolve();
        }
      );
    });
    return promesa;
  }
  public crear_post(uid, url: string) {
    let sucursal: Credenciales = {
      uid: uid,
      photoURL: url
    };
    console.log(JSON.stringify(sucursal));
    this.afs
      .collection("sucursales")
      .doc(uid)
      .update(sucursal);
    // this.afiredatabase.object(`sucursales/`+uid).update(sucursal);
    this.imagenes.push(sucursal);
    this.mostrar_toast("Imagen actualizada");
  }

  public agregarArea(area, idSucursal) {  
      this.db
          .collection("areas")
          .add({
            uidSucursal: idSucursal,
            nombre: area            
          }).then(docRef =>{

            this.updateAreaIDX(docRef.id);
            this.alertCtrl
          .create({
            title: "Se agregó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
      })
      .catch(function(error) {
        console.error("Error adding document: ", JSON.stringify(error));
      });
  }

  updateAreaIDX(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("areas")
        .doc(idx)
        .update({
          uid: idx
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

  public agregarZona(zona, consumoMin, idArea, idSucursal) {  
    
    this.db
        .collection("zonas")
        .add({
          uidArea: idArea,
          nombre: zona,
          consumo: Number(consumoMin),
          uidSucursal: idSucursal        
        }).then(docRef =>{

          this.updateZonaIDX(docRef.id);
          this.alertCtrl
        .create({
          title: "Se agregó correctamente",
          buttons: ["Aceptar"]
        })
        .present();
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
}

updateZonaIDX(idx) {
  console.log("Esta es la dirección: ", idx);

  var promise = new Promise((resolve, reject) => {
    this.db
      .collection("zonas")
      .doc(idx)
      .update({
        uid: idx
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

  verificarConsecutivo(idSucursal, idArea, idZona, numMesas, numPersonas): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("mesas")
        .where("uidZona", "==", idZona)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            // console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            // console.log("Document data:", arr);
            var numero = arr.length;
            // console.log("Este es el tamaño del arreglo: ",numero);
            this.agregarMesa(idSucursal, idArea, idZona, numMesas, numPersonas, numero);
            
            resolve(arr);
          } else {
            var numero1 = 0;
            this.agregarMesa(idSucursal, idArea, idZona, numMesas, numPersonas, numero1);
            // console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  agregarMesa(idSucursal, idArea, idZona, numMesas, numPersonas, numero) {

    console.log("Numero recibido: ", numero);
    console.log("Sucur recibido: ", idSucursal);
    console.log("area recibido: ", idArea);
    console.log("Zona recibido: ", idZona);
    console.log("mesas recibido: ", numMesas);
    console.log("PErsonas recibido: ", numPersonas);

    for (let i = 1; i <= numMesas; i++) {
      // this.name  = this.Data.name
      // this.age= this.Data.age
      console.log("Este es el valor de I: ", i);
      this.db.collection("mesas").add({
        uidArea: idArea,
        uidZona: idZona,
        uidSucursal: idSucursal,
        mesa: numero+i,
        numPersonas: Number(numPersonas),
        estatus: "libre"
      });
    }
  }

  eliminarZona(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("zonas")
        .doc(idx)
        .delete()
        .then(() => {
          this.alertCtrl
          .create({
            title: "La zona se eliminó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
          resolve(true);
        })
        .catch(err => {
          this.alertCtrl
          .create({
            title: "Error al eliminar la zona. Intente de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
          reject(err);
        });
    });
    return promise;
  }

  eliminarArea(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("areas")
        .doc(idx)
        .delete()
        .then(() => {
          this.alertCtrl
          .create({
            title: "El área se eliminó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
          resolve(true);
        })
        .catch(err => {
          this.alertCtrl
          .create({
            title: "Error al eliminar el área. Intente de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
          reject(err);
        });
    });
    return promise;
  }

  modificarZona(zona, consumoMin, idZona) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("zonas")
        .doc(idZona)
        .update({
          nombre: zona,
          consumo: consumoMin
        })
        .then(() => {
          resolve(true);
          this.alertCtrl
          .create({
            title: "La zona se actualizó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
        })
        .catch(err => {
          reject(err);
          this.alertCtrl
          .create({
            title: "Error al actualizar la zona. Intente de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
        });
    });
    return promise;
  }

  modificarArea(area, idArea) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("areas")
        .doc(idArea)
        .update({
          nombre: area
        })
        .then(() => {
          resolve(true);
          this.alertCtrl
          .create({
            title: "El área se actualizó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
        })
        .catch(err => {
          reject(err);
          this.alertCtrl
          .create({
            title: "Error al actualizar el área. Intente de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
        });
    });
    return promise;
  }

  mostrar_toast(mensaje: string) {
    const toast = this.toastCtrl
      .create({
        message: mensaje,
        duration: 3000
      })
      .present();
  }

  getAreas(idx) {    
    this.areasCollection = this.afs.collection("areas", ref =>
      ref
        .where("uidSucursal", "==", idx)
    );
    this.areas = this.areasCollection.valueChanges();
    return (this.areas = this.areasCollection
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

  getZonas(idx) {    
    this.zonasCollection = this.afs.collection("zonas", ref =>
      ref
        .where("uidSucursal", "==", idx)
    );
    this.zonas = this.zonasCollection.valueChanges();
    return (this.zonas = this.zonasCollection
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

  getArea(idx) {
    this.Sucursal = this.afs.doc<any>(`areas/${idx}`);
    return (this._Sucursal = this.Sucursal.snapshotChanges().pipe(
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
    this.Sucursal = this.afs.doc<any>(`zonas/${idx}`);
    return (this._Sucursal = this.Sucursal.snapshotChanges().pipe(
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

  getMesas(idx) {    
    this.areasCollection = this.afs.collection("mesas", ref =>
      ref
        .where("uidZona", "==", idx).orderBy("mesa")
    );
    this.areas = this.areasCollection.valueChanges();
    return (this.areas = this.areasCollection
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

  eliminarMesa(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("mesas")
        .doc(idx)
        .delete()
        .then(() => {
          this.alertCtrl
          .create({
            title: "La mesa se eliminó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
          resolve(true);
        })
        .catch(err => {
          this.alertCtrl
          .create({
            title: "Error al eliminar la mesa. Intente de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
          reject(err);
        });
    });
    return promise;
  }

  modificarMesa(numMesa, numPersonas, idMesa) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("mesas")
        .doc(idMesa)
        .update({
          mesa: numMesa,
          numPersonas: numPersonas
        })
        .then(() => {
          resolve(true);
          this.alertCtrl
          .create({
            title: "La mesa se actualizó correctamente",
            buttons: ["Aceptar"]
          })
          .present();
        })
        .catch(err => {
          reject(err);
          this.alertCtrl
          .create({
            title: "Error al actualizar la mesa. Intente de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
        });
    });
    return promise;
  }
}



export class Credenciales{
    uid?:string;
    displayName?:string;
    contacto?:string;
    direccion?:string;
    imagen?:string;
    photoURL?: string;
    email?:string;
    tel?:number;
    tipo?: string;
    sucursal?: boolean;
    // additional
    horas?: string;
    estacionamiento?: string;
    codigoEtiqueta?: string;
    descripcion?: string;
    geolocalizacion?: string;

}
