import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as moment from "moment";
import { ResumenProvider } from '../../providers/resumen/resumen';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { TabsPage } from '../tabs/tabs';
import { OneSignal } from '@ionic-native/onesignal';
import { ViewController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { SMS } from '@ionic-native/sms';
//import { SocialSharing } from '@ionic-native/social-sharing';
import { PropinaPage } from "../../pages/propina/propina";
import { CuponesProvider } from '../../providers/cupones/cupones';

interface Publica {
  codigoCupon: number;
  // uid:string;
}


@IonicPage()
@Component({
  selector: "page-resumen",
  templateUrl: "resumen.html"
})
export class ResumenPage {
  idSucursal: any;
  idReservacion: any;
  uidEvento: any;
  r: any = {};
  s: any = {};
  z: any = {};
  cupon: any = {};
  mes: any;
  diasN: any;
  dias: any;
  productos: any;
  total: any;
  usersCompartido: any;
  tabBarElement: any;
  myForm: FormGroup;
  codigo: any;
  cvc: any;
  cupones: any;
  coupons: any;
  resta: any;
  cuponn: any;
  uidcupon: any;
  numcupon: any;
  uid: any;
  coupon: AngularFirestoreCollection<Publica>;
  _reser: Observable<any[]>;
  reser: AngularFirestoreCollection<Publica>;
  _coupon: Observable<any[]>;
  usuarioAcceso: any = {};
  area: any;
  zona: any;
  ticket: any;
  data: any = {};
  ocultar1: Boolean = false;
  resultCompartidasFinal: any;
  uidUserSesion: any;
  miUser: any = {};
  fechaActual: any;
  totalsucursal: any = {};
  usuariosss: any = {};
  totalcupones: any;
  cuponess: any;
  cupones_acajeados: any;
  cupones_visibles: any = [];
  sucursal: any;
  ocultar2: boolean = true;
  codigoSel: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public _resumenProvider: ResumenProvider,
    public _providerReserva: ReservacionProvider,
    private oneSignal: OneSignal,
    public platform: Platform,
    public fb: FormBuilder,
    private sms: SMS,
    public cupProv: CuponesProvider,
    //private socialSharing: SocialSharing,
    public afs: AngularFirestore
  ) {
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //validas que los inputs del formulario no esten vacios
    this.myForm = this.fb.group({
      cvc: ["", [Validators.required]]
    });

    this.uid = localStorage.getItem('uid');
    console.log("este es mi uid", this.uid);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ResumenPage");
    this.loadNavParams();
    this.getReservacion();
    this.getSucursal();
    this.loadProductRes();
    this.getZona();
    this.goToUser();
    this.AllCupon();
    this.codigoSel = 0;
    // this.verificarcodigo();
    //this.ionViewWillEnter();
  }

  //funciones para ocultar las tabs
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  goToUser() {

    //sacar el id del usuario del local storage
    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en eventos', this.uidUserSesion);

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser);
      });

  }

  loadNavParams() {
    this.idSucursal = this.navParams.get("idSucursal");
    this.idReservacion = this.navParams.get("idReservacion");
    this.uidEvento = this.navParams.get("uid");
    this.area = this.navParams.get("area");
    this.zona = this.navParams.get("zona");

    console.log("zona", this.zona, "area", this.area);

  }

  getReservacion() {
    this._resumenProvider
      .gerReservacion(this.idReservacion)
      .subscribe(reservacion => {
        this.r = reservacion;
        console.log("Reserva: ", reservacion);
        const month = moment(Number(reservacion.fechaR_));
        month.locale("es");
        console.log("Mes", month.format("MMM"));
        console.log("Día", month.format("DD"));
        console.log("Día", month.format("dddd"));
        this.mes = month.format("MMM");
        this.diasN = month.format("DD");
        this.dias = month.format("dddd");
      });
  }

  getSucursal() {
    this._resumenProvider.getSucursal(this.idSucursal).subscribe(sucursal => {
      console.log("Sucursal", sucursal);
      this.s = sucursal;
    });
  }

  getZona() {
    this._resumenProvider.getZona(this.zona).subscribe(zonas => {
      console.log("Zona", zonas);
      this.z = zonas;
    })
  }

  loadProductRes() {
    this._providerReserva
      .getProductos(this.idReservacion)
      .subscribe(productos => {
        console.log("Datos Reservación: ", productos);
        this.productos = productos;
        this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
        console.log("Resusltado: ", this.total);
      });
  }

  saveReserva() {
    //let alertMesas = this.alertCtrl.create({
    //  message:
    //    "Gracias por reservar en Guest Resy te notificaremos cuando tu reservación haya sido aceptada.",
    //  buttons: [
    //    {
    //    text: "Aceptar",
    //  handler: () => {
    //    console.log("Buy clicked");
    this.notiReservaCompartida();
    this.enviarMensaje();
    //this.navCtrl.setRoot(TabsPage);
    localStorage.removeItem('reservacion');
    //}
    //}
    //]
    //});
    //alertMesas.present();
    // despues del resumen va alas propinas
    this.navCtrl.push(PropinaPage, {
      idReservacion: this.idReservacion,
    });
  }

  enviarMensaje() {
    this.afs.collection('compartidas', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data2 => {
      this.resultCompartidasFinal = data2;
      console.log('compartidasFinal', this.resultCompartidasFinal);
      //insertar el player id de cada telefono insertado
      this.resultCompartidasFinal.forEach(element2 => {
        //console.log('compartidasFinal',element2);
        console.log('este player id', element2.playerId);
        if (element2.playerId == undefined) {
          const numeroEnviar = element2.telefono;
          const numeroWhats = '+52' + numeroEnviar;
          console.log('mensaje a', numeroEnviar);
          console.log('mensaje whats a', numeroWhats);
          //this.sms.send('416123456', 'Hello world!')
          this.sms.send(numeroEnviar, 'Descarga GuestApp!  https://play.google.com/store/apps/details?id=com.guestapp.app');
          //whats app mensaje
          //this.socialSharing.shareViaWhatsAppToReceiver(numeroWhats, 'GuestResy.com!').then(() => {
          //   console.log('enviado whats');
          //  }).catch(() => {
          //     console.log(' error enviado whats');
          //});
        }
      });
    });
  }

  notiReservaCompartida() {
    this._providerReserva.getUsersCompartido(this.idReservacion).subscribe(usersCom => {
      this.usersCompartido = usersCom;
      console.log('Usuarios compartidos: ', this.usersCompartido);
      this.usersCompartido.forEach(usersCom => {
        console.log("PlayerID:", usersCom.playerId);
        if (usersCom.playerId != undefined) {
          console.log('notificacion  a', usersCom.playerId);
          if (this.platform.is("cordova")) {
            let noti = {
              app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
              include_player_ids: [usersCom.playerId],
              data: { foo: "bar" },
              contents: {
                en: "Han compartido una reservación contigo"
              }
            };
            window["plugins"].OneSignal.postNotification(
              noti,
              function (successResponse) {
                console.log(
                  "Notification Post Success:",
                  successResponse
                );
              },
              function (failedResponse: any) {
                console.log("Notification Post Failed: ", failedResponse);
              }
            );
          } else {
            console.log("Solo funciona en dispositivos");
          }
        }

      });
    });
  }

  verificarcodigo(uidsucursal, total) {
    const cvc = parseInt(this.codigoSel);
    console.log("este es el codigo", cvc);
    console.log("Uid de la sucursal", uidsucursal);
    console.log('este es el total', total);


    this.afs.collection('cupones', ref => ref.where('codigoCupon', '==', cvc)).valueChanges().subscribe(data => {
      this.cupones = data;
      // console.log("estos son mis cupones", this.cupones.numCupones);

      this.cupones.forEach(element => {

        const cupon = element.valorCupon
        const uidcupon = element.uid
        const numcupon = element.numCupones
        console.log('Datos del cupon', total, cupon, uidcupon, numcupon, 'Cantidad', this.cupones.length)

        const rest = total - cupon;
        const restacupones = numcupon - 1;

        this.resta = rest;

        console.log("esta es la resta del cupon:", rest);
        console.log("este son los datos del cupon. Codigo", cvc, " valor ", cupon, " id cupon ", uidcupon, "numero de cupon ", numcupon);
        console.log("total de numeros de cupon restantes: ", restacupones);

        this.cuponn = cupon;
        this.uidcupon = uidcupon;
        this.numcupon = numcupon;
      });

    });

    this.doToCupon(total);
    this.doToReservacion(total);
    this.doToCanjeo(total);

  }

  prueba(total, cupon, uidcupon, numcupon) {

    this.ocultar1 = !this.ocultar1;

    console.log('Datos del cupon en la funcion de prueba', total, cupon, uidcupon, numcupon);

    const rest = total - cupon;
    const cvc = parseInt(this.cvc);
    const restacupones = numcupon - 1;

    this.resta = rest;

    // this.doToReservacion(total, cupon, uidcupon, numcupon);
    // this.doToCupon(total, cupon, uidcupon, numcupon);
    // this.doToCanjeo(total, cupon, uidcupon, numcupon);

  }


  doToReservacion(total) {
    const rest = total - this.cuponn;
    const cvc = parseInt(this.codigoSel);
    const restacupones = this.numcupon - 1;

    console.log("esta es la resta del cupon:", rest);
    console.log("este son los datos del cupon. Codigo", cvc, " valor ", this.cuponn, " id cupon ", this.uidcupon, "numero de cupon ", this.numcupon);
    console.log("total de numeros de cupon restantes: ", restacupones);
    console.log("Este es el id de la reservacion", this.idReservacion);

    this.afs.collection("reservaciones").doc(this.idReservacion).update({
      "totalReservacion": rest,
      "uidCupon": this.uidcupon
    })
      .then(function () {
        console.log("Document successfully updated!");
      });

  }


  doToCupon(total) {

    const rest = total - this.cuponn;
    const cvc = parseInt(this.codigoSel);
    const restacupones = this.numcupon - 1;

    console.log("esta es la resta del cupon:", rest);
    console.log("este son los datos del cupon. Codigo", cvc, " valor ", this.cuponn, " id cupon ", this.uidcupon, "numero de cupon ", this.numcupon);
    console.log("total de numeros de cupon restantes: ", restacupones);
    console.log("Este es el id de la reservacion", this.idReservacion);

    this.afs.collection("cupones").doc(this.uidcupon).update({
      "numCupones": restacupones
    })
      .then(function () {
        console.log("Document successfully updated!");
      });
  }


  doToCanjeo(total) {
    this.ocultar1 = !this.ocultar1;
    this.ocultar2 = !this.ocultar2;
    const rest = total - this.cuponn;
    const cvc = parseInt(this.codigoSel);
    const restacupones = this.numcupon - 1;

    console.log("esta es la resta del cupon:", rest);
    console.log("este son los datos del cupon. Codigo", cvc, " valor ", this.cuponn, " id cupon ", this.uidcupon, "numero de cupon ", this.numcupon);
    console.log("total de numeros de cupon restantes: ", restacupones);
    console.log("Este es el id de la reservacion", this.idReservacion);

    this.afs.collection("canjeo").add({
      idSucursal: this.idSucursal,
      idReservacion: this.idReservacion,
      idUser: this.uid,
      idCupon: this.uidcupon
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

    let alerta = this.alertCtrl.create({
      message:
        "Se ha canjeado el cupón",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            console.log("Buy clicked");
          }
        }
      ]
    });
    alerta.present();
  }

  AllCupon() {
    this.fechaActual = new Date().toJSON().split("T")[0];
    console.log('ionViewDidLoad AgregarCuponesPage', this.fechaActual);

    this.sucursal = localStorage.getItem('idSucursal');
    console.log('id de la pinchi sucursal', this.sucursal);

    //Se obteniene datos del sucursales
    this.afs.collection('sucursales').doc(this.sucursal).valueChanges().subscribe(sucudata => {
      this.totalsucursal = sucudata;
      console.log("sucursales", this.totalsucursal);
    });

    //Se obteniene datos del usuario
    this.cupProv.getDataUser(this.uid).then(user => {
      this.usuariosss = user;
      console.log("datos usuario", user);
    });

    //Se obteniene datos del cupones
    this.afs.collection('cupones').valueChanges().subscribe(data => {
      this.totalcupones = data;
      console.log("total de cupones", this.totalcupones);
    });

    this.afs.collection('cupones').valueChanges().subscribe(data => {
      this.cuponess = data;
      console.log("estos son mis cupones", this.cuponess);

      var cuponesarreglo = [];

      this.cuponess.forEach(element => {
        const id = element.uid
        console.log('id del cupon', id)

        this.afs.collection('canjeo', ref => ref.where('idUser', '==', this.uid).where('idCupon', '==', id)).valueChanges().subscribe(data => {
          this.cupones_acajeados = data;
          console.log("estos son mis cupones canjeados", this.cupones_acajeados);
          console.log("estos son mis cupones canjeados", this.cupones_acajeados.length);

          if (this.cupones_acajeados.length == 0) {
            cuponesarreglo.push(id);
            console.log("estos son los id visibles", cuponesarreglo.join(", "));
            console.log("estos son los datos de los datos visibles", cuponesarreglo);

            this.cupones_visibles = cuponesarreglo;

          }
        });

      });

    });
  }


  onChange(dato) {
    console.log("Dato:", dato);
    this.codigoSel = dato;
    console.log("este es el valor de la variable global", this.codigoSel);
  }

}
