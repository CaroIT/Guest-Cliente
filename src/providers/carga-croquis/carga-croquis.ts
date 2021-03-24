import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable()
export class CargaCroquisProvider {

  db = firebase.firestore();

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase) {
    console.log('Hello CargaCroquisProvider Provider');
  }

  cargarImagen(archivo: ArchivoSubir){

    let promesa = new Promise( (resolve, reject)=>{

      this.mostrarToast('Cargando...');

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask =
          storeRef.child(`croquis/${nombreArchivo}`)
            .putString(archivo.plano, 'base64', { contentType: 'image/jpeg' });

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ()=>{ }, //Saber el % de Mbs se han subido
        ( error ) =>{
          //Manejo de error
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          this.mostrarToast(JSON.stringify(error));
          reject();
        },
        ()=>{
          // TODO bien
          console.log("Archivo subido");
          this.mostrarToast('El croquis se agrego correctamente');

          //let url = uploadTask.snapshot.ref.getDownloadURL();

          //Inician mis pruebas

          uploadTask.snapshot.ref.getDownloadURL().then(urlImage => {
           this.actualizaImagen(archivo.key,urlImage);
            // this.mostrarToast('URL:' + urlImage);
           }).catch((error) => {
                    console.log(error);
           });
            resolve();
        }


       )

    });

    return promesa;

  }

  // private actualizaImagen(key, url: string) {

  //   let croquis: ArchivoSubir = {      
  //     plano: url
  //   };

  //   console.log(JSON.stringify(croquis));
  //   this.afDB.object('sucursales/'+key+'/arquitectura/').update(croquis);
  //   this.afDB.object('su')
  //   // this.afDB.object('users/'+this.uid+'/perfil/').update(perfil);
  //   this.mostrarToast('Imagen actualizada');

  // }

  actualizaImagen(key, url: string) {
       
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("sucursales")
        .doc(key)
        .update({
          plano: url          
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

  mostrarToast(mensaje: string){

      this.toastCtrl.create({
         message: mensaje,
         duration: 2000
       }).present();

  }

  // mostrarLoading(mensaje: string){

  //     const loader = this.loadingCtrl.create({
  //        content: mensaje,
  //        duration: 2000
  //      });
  //      loader.present();
  // }

}

interface ArchivoSubir{
  plano: string;
  key?: string;
}

