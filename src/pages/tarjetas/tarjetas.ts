import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgregarTarjetaPage } from "../../pages/agregar-tarjeta/agregar-tarjeta";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";

@IonicPage()
@Component({
  selector: 'page-tarjetas',
  templateUrl: 'tarjetas.html',
})
export class TarjetasPage {

  misTarjetas: any;
  uid: any;
  misTarjetasRegistradas: any;
  tarjetas: any;
  tarjetaActiva: any;
  //tarjetaAnterior: any;
  numTarjetas: any;
  idReservacion: any;
  seccion: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public afs: AngularFirestore,
              public usuarioProv: UsuarioProvider){
          //rescibir parametro de detalle-recervacion para checar tarjetas
          this.idReservacion = this.navParams.get("idReservacion");
          this.seccion = this.navParams.get("seccion");
          //sacar el id del usuario del local storage
          console.log("Id Reservacion en tarjetas: ", this.idReservacion);
          this.uid = localStorage.getItem('uid');
          console.log('id sesion',this.uid);
          //this.tarjetaAnterior = localStorage.getItem('TarjetaId');
          //console.log('tarjeta anterior',this.tarjetaAnterior);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarjetasPage');
    this.getAllTarjetas();
  }

  //obtener todas las tarjetas del usuario
  getAllTarjetas() {
    //console.log('miuser',this.uid);
    this.usuarioProv.getTarjetasUser(this.uid).subscribe(tarjeta => {
      this.misTarjetas = tarjeta;
      this.numTarjetas=this.misTarjetas.length;
      console.log('misTarjetas',this.numTarjetas);
      //this.tarjetaAnterior = localStorage.getItem('TarjetaId');
      //console.log('misTarjetas',this.misTarjetas);
    });
  }

  //ir a la pantalla para registrar una tarjeta nueva
  agregarTarjeta(){
      this.navCtrl.setRoot(AgregarTarjetaPage);
  }

  //cambiar el estatus de la tarjeta a Eliminada
  eliminarTarjeta(idTarjeta){
  this.usuarioProv.updateTarjetaEliminar(idTarjeta).then((respuesta: any) => {
      console.log('eliminada');
    });
  }

  //volver al detalle
//  volverDetalle(){
  //  this.navCtrl.setRoot(ReservacionDetallePage,{idReservacion:this.idReservacion});
  //}

  //  NousarTarjetas(){
    //  this.usuarioProv.getTarjetasRegistradas(this.uid).subscribe(info => {
      //  this.misTarjetasRegistradas = info;
        //console.log('mis tarjetas',this.misTarjetasRegistradas.length);
        //this.tarjetaActiva=info[0].idTarjeta;
      //  console.log('tarjeta activa',this.tarjetaActiva);
      //  if(this.misTarjetasRegistradas.length == 0){
        //  console.log('no ejecutar');
               //this.afs.collection("tarjetas").doc(this.tarjetaActiva).update({//
              //  "estatus": 'INACTIVA'
            //  });
        // }
      //   if(this.misTarjetasRegistradas.length == 1){
      //     console.log('ejecutar');
      //          this.tarjetaActiva=info[0].idTarjeta;
      //          this.afs.collection("tarjetas").doc(this.tarjetaActiva).update({//
      //           "estatus": 'INACTIVA'
      //         });
      //    }
      //});

      //this.usuarioProv.getTarjetasRegistradas(this.uid).subscribe(tarjeta2 => {
      //  this.misTarjetasRegistradas = tarjeta2;
      //  console.log('misTarjetasRegistradas',this.misTarjetasRegistradas);
        //this.misTarjetasRegistradas.forEach(dataT => {
        //  console.log('tarjetas activa',tarjeta2[0].idTarjeta);
        //     const tarjetaDesactivar=tarjeta2[0].idTarjeta;
        //    this.usuarioProv.updateTarjetaVolverInactiva(tarjetaDesactivar).then((respuesta: any) => {
        //       console.log('desactivada');
        //    });
          //});
          //});
      //this.usuarioProv.updateTarjetaVolverInactiva(idTarjeta).then((respuesta: any) => {
      //      console.log('desactivada');
      //  });
        //this.navCtrl.setRoot(TarjetasPage);
  //  }
  //cambiar el estatus de la tarjeta a ACTIVA
  //usarTarjetaActivar(idTarjeta){

  //   this.afs.collection('tarjetas', ref => ref.where('idUsuario', '==', this.uid).where('estatus', '==', 'ACTIVA')).valueChanges().subscribe(data => {
    //   this.tarjetas = data;
  //     console.log('mis tarjetas activas',  this.tarjetas.length);
    //   if(this.tarjetas.length==0){
    //     this.usuarioProv.updateTarjetaActiva(idTarjeta).then((respuesta: any) => {
    //          console.log(" Tarjeta Activada");
    //     });
    //   }
    //   if(this.tarjetas.length!=0){
      //   alert('solo puede haber una tarjeta activa');
    //   }
     //});

    //this.usuarioProv.getTarjetasRegistradas(this.uid).subscribe(tarjeta2 => {
    //  this.misTarjetasRegistradas = tarjeta2;
    //  console.log('misTarjetasRegistradas',this.misTarjetasRegistradas);
    //  console.log('misTarjetasRegistradas total',this.misTarjetasRegistradas.length);
    //    if(this.misTarjetasRegistradas.length==0){
      //      console.log('activar solicitada');
      //
      //  }
     //});
    //cambiar el estatus a activa cuando el usuario decide usar la tarjeta
     //this.usuarioProv.updateTarjetaActiva(idTarjeta).then((respuesta: any) => {;
    //   if (respuesta.success == true) {
      //    console.log("Success: ", respuesta.success);
      // }
     //});

    //obtener las tajetas de la base
  //this.usuarioProv.getTarjetasRegistradas(this.uid).subscribe(tarjeta2 => {
    //this.misTarjetasRegistradas = tarjeta2;
    //console.log('misTarjetasRegistradas',this.misTarjetasRegistradas);
    //this.misTarjetasRegistradas.forEach(dataT => {
    //   //if(dataT.idTarjeta==idTarjeta){
    //    console.log('tarjetas',dataT.idTarjeta);
    //     this.afs.collection("tarjetas").doc(dataT.idTarjeta).update({
    //      "estatus": 'INACTIVA'
    //    });
        //this.usuarioProv.updateTarjetaActiva(dataT.idTarjeta).then((respuesta: any) => {
        //      console.log("Respuesta activada: ", respuesta);
        //   });
        //}
        //if(dataT.idTarjeta!=idTarjeta){//
        //  console.log('desactivar esta',dataT.idTarjeta);
         //console.log('tarjetas dela base',dataT.idTarjeta);
          // this.afs.collection("tarjetas").doc(dataT.idTarjeta).update({
          //  "estatus": 'INACTIVA'
          //});
           //this.getAllTarjetas();
         //}
    // });
  // });
       //console.log('tarjeta anterior',this.tarjetaAnterior.length);
       //console.log('tarjeta nueva',idTarjeta);

          //cambiar estatus de tarjeta que antes estaba activa por la nueva que va a seleccionar el usuario
        //  this.usuarioProv.updateTarjetaVolverInactiva(this.tarjetaAnterior).then((respuesta: any) => {
        //      console.log("Respuesta: ", respuesta);
          //     if (respuesta.success == true) {
        //        console.log("Success: ", respuesta.success);
          //    }
        //   });

        //this.navCtrl.push(AgregarTarjetaPage);
  //}

}
