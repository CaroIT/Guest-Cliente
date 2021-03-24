import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ArchivoSubir } from './ArchivoSubir';
//import   "rxjs/add/operator/map";
//import { Observable } from 'rxjs/Observable';
// import { Credenciales } from '../usuario/usuario';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class CargaArchivoCartaProvider {
  
  selectedProduct: ArchivoSubir = new ArchivoSubir();  
  db = firebase.firestore();
  imagenes: ArchivoSubir[] = [];
  //lastKey: string = null;  
  //private cartaList: Observable<ArchivoSubir>;
  //private cartaList = this.afDB.list<ArchivoSubir>('bebidas');  

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase, 
              public afs: AngularFirestore ) {
            // this.cargar_ultimo_key()
      //     .subscribe(()=>this.cargar_imagenes());

  }
// private cargar_ultimo_key(){
//   return this.afDB.list('/bebidas', ref=> ref.orderByKey().limitToLast(1))
//             .valueChanges()
//             .map( (bebida:any) => {
//               this.lastKey = bebida[0].key;
//               this.imagenes.push( bebida[0]);
//             });
//}
// cargar_imagenes(){
//   return new Promise ((resolve, reject)=>{
//     this.afDB.list('/bebidas',
//       ref=> ref.limitToLast(8)
//                 .orderByKey()
//                 .endAt(this.lastKey)
//               ).valueChanges()
//                .subscribe((bebidas:any)=>{
//                  bebidas.pop();
//               if( bebidas.length == 0){
//                 console.log('Ya no hay más registros');
//                 resolve(false);
//                 return;
//               }
//               this.lastKey = bebidas[0].key;
//               for( let i = bebidas.length-1; i>=0; i--){
//                 let bebida = bebidas[i];
//                 this.imagenes.push(bebida);
//               }
//               resolve(true);
//             });
//   });
// }
cargar_imagen_firebase( archivo:ArchivoSubir  ){

  let promesa = new Promise( (resolve, reject)=>{
    this.mostrar_toast('Cargando..');

    let storeRef = firebase.storage().ref();
    let nombreArchivo:string = new Date().valueOf().toString();

    let uploadTask: firebase.storage.UploadTask =
   storeRef.child(`bebidas/${ nombreArchivo }.jpg`)
   .putString( archivo.img, 'base64', { contentType: 'image/jpeg' } );
        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{},//saber el % cuantos se han subido
          ( error )=>{
          //manejo
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          this.mostrar_toast(JSON.stringify(error));
          reject();
        },
        ()=>{
          // TODO BIEN!
          console.log('Archivo subido');
          this.mostrar_toast('Imagen cargada correctamente');
          // let url = uploadTask.snapshot.downloadURL;
          // this.crear_post( archivo.titulo, url, nombreArchivo );
          // resolve();
            uploadTask.snapshot.ref.getDownloadURL().then(( url )=>{
            console.log('nombreArchivo', nombreArchivo);
            console.log('url', url);
            console.log('file.titulo', archivo.titulo);
            this.crear_post(archivo.titulo,
                            archivo.categoria,
                            archivo.precio,
                            archivo.nota,                            
                            url, nombreArchivo,
                            archivo.uidSucursal,);
            resolve();
});
        }
        )
  });
  return promesa;
}

private crear_post( titulo:string,
                    categoria: string,
                    precio: string,
                    nota: string,
                    url: string,
                    nombreArchivo:string,
                    uidSucursal: string,
                    ){
  let bebida: ArchivoSubir = {
    img:url,
    titulo: titulo,
    categoria: categoria,
    precio: precio,
    nota: nota,
    key: nombreArchivo,
    uidSucursal: uidSucursal
  };
  console.log( JSON.stringify(bebida));
  //this.afDB.list('/evento').push(evento);
  this.afs.collection('cartas').add(bebida).then( ref => {
    console.log('id', ref.id);
    const cartaUid = ref.id;
    this.afs.collection('cartas').doc(cartaUid).update({
      uid: cartaUid
    });
  })
  // this.afDB.object(`bebidas/${ nombreArchivo }`).update(bebida);
  this.imagenes.push( bebida );
  this.mostrar_toast('Evento grabado a BD');
}

deleteCarta(key: string, img: string, uid)
{
var storeRef = firebase.storage().ref();
var desertRef = storeRef.child(`bebidas/${ img }.jpg`);
console.log(img);

// Delete the file
desertRef.delete().then(function() {
  this.mostrar_toast('Finally');
}).catch(function(error) {
  // Uh-oh, an error occurred!
});
// this.afDB.database.ref('bebidas/'+key).remove();   
var promise = new Promise((resolve, reject) => {
  console.log('data delete uid', uid);
  this.db 
    .collection("cartas")
    .doc(uid)
    .delete()
    .then(() => {
      resolve(true);
    })
    .catch(err => {
      reject(err);
    });
});
return promise;     
}
updateCarta(data, uid)
  {
      var promise = new Promise((resolve, reject) => {
        console.log('data uid', uid);
        this.db 
          .collection("cartas")
          .doc(uid)
          .update(data)
          .then(() => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      });
      return promise; 
    // console.log(data.KEY);
    // this.afDB.database.ref('bebidas/'+data.KEY).update(data);
  }
  
mostrar_toast( mensaje: string  ){

  const toast = this.toastCtrl.create({
     message: mensaje,
     duration: 3000
   }).present();
 }
//  public getEvento(id){
//     return this.afDB.object('bebidas/'+id);
//  }
 // Edicion de imagen 
cargar_imagen_firebase_carta( archivo:CartaSubir, uid){

  let promesa = new Promise( (resolve, reject)=>{
    this.mostrar_toast('Cargando..');

    let storeRef = firebase.storage().ref();
    let img:string = new Date().valueOf().toString();

    let uploadTask: firebase.storage.UploadTask =
   storeRef.child(`bebidas/${ img }.jpg`)
   .putString( archivo.img, 'base64', { contentType: 'image/jpeg' } );
        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{},//saber el % cuantos se han subido
          ( error )=>{
          //manejo
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          this.mostrar_toast(JSON.stringify(error));
          reject();
        },
        ()=>{
          // TODO BIEN!
          console.log('Archivo subido');
          this.mostrar_toast('Imagen cargada correctamente');
          // let url = uploadTask.snapshot.downloadURL;
          // this.crear_post( archivo.titulo, url, nombreArchivo );
          // resolve();
            uploadTask.snapshot.ref.getDownloadURL().then( urlImage => {
                this.crear_post_edev(archivo.key, urlImage, uid);
                this.mostrar_toast('URL'+ urlImage);
            }).catch((error) => {
                console.log(error);

            });
            resolve();

        }
        )
  });
  return promesa;
}
public crear_post_edev(key, url:string, uid){
  let carta: CartaSubir = {
      key: key,
      img: url
  };
  console.log(JSON.stringify(carta));
  var promise = new Promise((resolve, reject) => {
    console.log('data key', key);
    console.log('data uid', uid);
    this.db 
      .collection("cartas")
      .doc(uid)
      .update(carta)
      .then(() => {
        resolve(true);
        this.mostrar_toast('Imagen actualizada');
      })
      .catch(err => {
        reject(err);
      });
  });
  return promise;
  // this.afDB.object(`bebidas/`+key).update(carta);
  // this.imagenes.push(sucursal);
}
 
}
export class CartaSubir {
  titulo?: string;
  categoria?: string;
  precio?: string;
  nota?: string;
  img?: string;
  key?: string;
}





