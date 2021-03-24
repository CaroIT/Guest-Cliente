import { Component, ViewChild } from "@angular/core";
import { Platform, MenuController, Nav } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { AngularFirestore } from '@angular/fire/firestore';

import { LoginPage } from "../pages/login/login";
import { TabsPage } from '../pages/tabs/tabs';
import { NosotrosPage } from "../pages/nosotros/nosotros";
import { CartaPage } from "../pages/carta/carta";
import { Reservacion_1Page } from "../pages/reservacion-1/reservacion-1";
import { PerfilPage } from "../pages/perfil/perfil";
import { HistorialPage } from "../pages/historial/historial";
import { AngularFireAuth } from "angularfire2/auth";
import { UsuarioProvider, Credenciales } from "../providers/usuario/usuario";
import { ResumenPage } from '../pages/resumen/resumen';
import { MisReservacionesPage } from '../pages/mis-reservaciones/mis-reservaciones';
import { TarjetasPage } from '../pages/tarjetas/tarjetas';
import { TelefonoUserPage } from "../pages/telefono-user/telefono-user";
import { PushNotiProvider } from '../providers/push-noti/push-noti';


import * as firebase from 'firebase/app';
import "firebase/database";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { CuponesPage } from '../pages/cupones/cupones';


@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  user: Credenciales = {};

  rootPage: any = LoginPage;
  home = TabsPage;
  nosotros = NosotrosPage;
  carta = CartaPage;
  perfil = PerfilPage;
  historial = HistorialPage;
  reservacion = Reservacion_1Page;
  reservaciones = MisReservacionesPage;
  pago = TarjetasPage;''
  cupones = CuponesPage;
  nombresUsers: any;
  us: any;

  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public _providerPushNoti: PushNotiProvider,
    private fb: Facebook,
    public afs: AngularFirestore
  ) {
    console.log(this.usuarioProv.usuario);
    this.user = this.usuarioProv.usuario;

    platform.ready().then(() => {
      if( localStorage.getItem("isLogin") == "true" && localStorage.getItem("reservacion") != "true" ){
          this.fb.login(['public_profile','email']).then((res: FacebookLoginResponse) => {
           const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
           firebase.auth().signInWithCredential(facebookCredential)
           .then(user => {
            this.us = user.user;
            console.log('Usuario: ', JSON.stringify(this.us));
            localStorage.setItem("uid", this.us.uid);
             //cargar datos de facebook del usuario
             this.usuarioProv.cargarUsuario(
               this.us.displayName,
               this.us.email,
               this.us.photoURL,
               this.us.uid,
               this.us.phoneNumber,
               'facebook'
             );
            this.nav.setRoot(TabsPage);
            }).catch(e => alert('Error de autenticación' + JSON.stringify(e)));
          })
      }
      else if( localStorage.getItem("isLogin") == "false" ){
          this.nav.setRoot(LoginPage);
      }
      else if( localStorage.getItem("reservacion") == "true" ){
        this.nav.setRoot(ResumenPage, {
          idReservacion: localStorage.getItem("idReservacion"),
          idSucursal: localStorage.getItem("idSucursal"),
          uid: localStorage.getItem("uidEvento")
        });
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      //Funcion de notificaciones para que se ejecute encuanto inicias sesion y guarde el player id en el localStorage
      this._providerPushNoti.init_push_noti();
    });

    //consultar tabla usuarios
    this.afs
      .collection("users")
      .valueChanges()
      .subscribe(data => {
        this.nombresUsers = data;
      });
  }//termina constructor

  //Menu de la aplicacion
  irHome(home: any) {
    console.log(home);
    this.rootPage = home;
    this.menuCtrl.close();
  }

  irNosotros(nosotros: any) {
    console.log(nosotros);
    this.rootPage = nosotros;
    this.menuCtrl.close();
  }

  irPerfil(perfil: any) {
    console.log(perfil);
    this.rootPage = perfil;
    this.menuCtrl.close();
  }

  irCarta(carta: any) {
    console.log(carta);
    this.rootPage = carta;
    this.menuCtrl.close();
  }

  irHistorial(historial: any) {
    console.log(historial);
    this.rootPage = historial;
    this.menuCtrl.close();
  }

  irPago( pago: any ) {
    console.log(pago);
    this.rootPage = pago;
    this.menuCtrl.close();
  }

  irCupones( cupones: any){
    console.log(cupones);
    this.rootPage = cupones;
    this.menuCtrl.close();
  }

  irMisreservaciones( reservaciones:any ){
    console.log( reservaciones );
    this.rootPage= reservaciones;
    this.menuCtrl.close();
    }

  irReservacion( reservacion:any ){
  console.log( reservacion );
  this.rootPage= reservacion;
  this.menuCtrl.close();
  }

  irLogin(rootPage) {
    console.log(rootPage);
    this.rootPage = rootPage;
    this.menuCtrl.close();
  }

  salir(rootPage) {
    localStorage.setItem("isLogin", 'false');
    this.afAuth.auth.signOut().then(res => {
      this.usuarioProv.usuario = {};
      this.rootPage = LoginPage;
      this.menuCtrl.close();
    });
  }
}
