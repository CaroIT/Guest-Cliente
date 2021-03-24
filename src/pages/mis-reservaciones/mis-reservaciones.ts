import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { CartaEditarPage } from "../carta-editar/carta-editar";
//import { PushNotiProvider } from '../../providers/push-noti/push-noti';
//import { UserProvider } from '../../providers/user/user';



@IonicPage()
@Component({
  selector: 'page-mis-reservaciones',
  templateUrl: 'mis-reservaciones.html',
})
export class MisReservacionesPage {
  encodText: string = '';
  encodeData: any = {};
  scannedData: any = {};
  reservaciones: any;
  clientes: any;
  uid: any;
  nombresAreas: any;
  nombresZonas: any;
  nombresSucursales: any;
  misReservaciones: any;
  idArea: any;
  idSucursal: any;
  idevento: any;
  telUser: any;
  resCompartidas: any;
  infoResevaciones: any;
  //playerID: any;
  //userID: any;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public monRes: MonitoreoReservasProvider,
              public reservaProvider: ReservacionProvider,
              public afDB: AngularFireDatabase,
              public afs: AngularFirestore
              //public _providerPushNoti: PushNotiProvider,
              //public _providerUser: UserProvider
            ) {
  //sacar el id del usuario del local storage
  this.uid = localStorage.getItem('uid');
  //consultar tabla areas
  this.afs
    .collection("areas")
    .valueChanges()
    .subscribe(data => {
      this.nombresAreas = data;
    });

    //consultar tabla zonas
    this.afs
      .collection("zonas")
      .valueChanges()
      .subscribe(data1 => {
        this.nombresZonas = data1;
      });

      //consultar tabla sucursales
      this.afs
        .collection("sucursales")
        .valueChanges()
        .subscribe(data2 => {
          this.nombresSucursales = data2;
        });
      //consultar tabla sucursales
        this.afs
          .collection("reservaciones")
          .valueChanges()
          .subscribe(data3 => {
            this.infoResevaciones = data3;
            console.log('realizo consulta');
            console.log('tabla reservaciones',this.infoResevaciones);
          });
          //this.playerID=localStorage.getItem("playerID");
          //console.log('playerID user sesion eventos',this.playerID);
          //this.userID=localStorage.getItem("uid");
          //console.log('userID user sesion eventos',this.userID);
  }

  ionViewDidLoad() {
    this.getAllReservaciones();
    this.getClientes();
    this.getTelUsuario();
    //this._providerPushNoti.init_push_noti();
    //this.guardarPlayerID();
  }
//  guardarPlayerID(){
//      console.log('playerID user sesion eventos llego',this.playerID);
//      console.log('userID user sesion eventos llego',this.userID);
//    this._providerUser.insertarIDplayer(this.userID,this.playerID).then((respuesta2: any) => {
//    console.log("Respuesta player insertado: ", respuesta2);
//    });
//  }
  //obtener todas las reservaciones de un usuario
  getAllReservaciones() {
    this.reservaProvider.getReservacionesCliente(this.uid).subscribe(reservacion => {
      this.misReservaciones = reservacion;
    });
  }

  //obtener el telefono del usuario en sesion
  getTelUsuario() {
    this.reservaProvider.getTelUser(this.uid).subscribe(tel => {
      this.telUser = tel;
        this.telUser.forEach(data => {
            console.log('tel del usuario en sesion',data.phoneNumber);
            //obtener reservaciones compartidas en las que esta el usuario
            this.reservaProvider.getReservacionCompartida(data.phoneNumber).subscribe(resCom => {
            this.resCompartidas = resCom;
              console.log("compartidas ",this.resCompartidas);
            });
        });
    });
  }

  getClientes() {
    this.monRes.getAllClientes("users").then(c =>{
          this.clientes = c;
          console.log("Estos son los clientes: ",this.clientes);
        });
  }

  verDetalle(idReservacion){
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: idReservacion
    });
  }

  verCarta(idReservacion,idSucursal,idevento){
    this.navCtrl.setRoot(CartaEditarPage, {
      idReservacion: idReservacion,
      idSucursal: idSucursal,
      idevento: idevento
    });
  }

  CancelarReservacion(idReservacion){
    this.reservaProvider
      .updateReservacioCancelado(idReservacion)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
    this.navCtrl.setRoot(MisReservacionesPage, {
      idReservacion: idReservacion
    });
  }

  aceptarCompartir(idCompartir,idReservacion){
    console.log('llego a a ceptar compartir',idReservacion);
    //Consulta para mandar el estatus aceptado
    this.reservaProvider
      .updateCompartirAceptar(idCompartir)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
      this.navCtrl.setRoot(MisReservacionesPage, {
        idReservacion: idReservacion
      });
  }

  rechazarCompartir(idCompartir,idReservacion){
    this.reservaProvider
      .updateCompartirRechazar(idCompartir)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
    this.navCtrl.setRoot(MisReservacionesPage, {
    idReservacion: idReservacion
    });
  }



}
