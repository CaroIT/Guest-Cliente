import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ZoomAreaModule } from 'ionic2-zoom-area';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from "../pages/perfil/perfil";
import { EventosPage } from "../pages/eventos/eventos";
import { NosotrosPage } from "../pages/nosotros/nosotros";
import { CartaPage } from "../pages/carta/carta";
import { HistorialPage } from "../pages/historial/historial";
import { Reservacion_1Page } from "../pages/reservacion-1/reservacion-1";
import { TabsPage } from "../pages/tabs/tabs";
import { EventoDetallePage } from "../pages/evento-detalle/evento-detalle";
import { ReservacionesPage } from '../pages/reservaciones/reservaciones';
import { ProductoDetallePage } from "../pages/producto-detalle/producto-detalle";
import { ResumenPage } from "../pages/resumen/resumen";
import { ReservacionDetallePage } from "../pages/reservacion-detalle/reservacion-detalle";
import { CartaEditarPage } from "../pages/carta-editar/carta-editar";
import { ProductoDetalle_2Page } from "../pages/producto-detalle-2/producto-detalle-2";
import { TelefonoUserPage } from "../pages/telefono-user/telefono-user";
import { TarjetasPage } from '../pages/tarjetas/tarjetas';
import { AgregarTarjetaPage } from '../pages/agregar-tarjeta/agregar-tarjeta';
import { GenerarqrPage } from '../pages/generarqr/generarqr';
import { Generarqr_2Page } from "../pages/generarqr-2/generarqr-2";
import { CuponesPage } from "../pages/cupones/cupones";
import { HistorialDetallePage } from "../pages/historial-detalle/historial-detalle";
import { PropinaPage } from "../pages/propina/propina";
import { QrGeneradoPage } from "../pages/qr-generado/qr-generado";


//administrador
import { ImagencroquisPage } from '../pages/imagencroquis/imagencroquis';
//Pipes
import { PipesModule } from "../pipes/pipes.module";

//import { AuthService } from '../providers/auth-service';
//Firebase
import { AngularFireModule, FirebaseAuth } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
//providers
import { UsuarioProvider } from '../providers/usuario/usuario';
import { CargaArchivoProvider } from '../providers/carga-archivo/carga-archivo';
import { CartaAddProvider } from '../providers/carta-add/carta-add';
import { ToastProvider } from '../providers/toast/toast';
import { CargaArchivoCartaProvider } from '../providers/carga-archivo-carta/carga-archivo';
import { SucursalAltaProvider } from '../providers/sucursal-alta/sucursal-alta';
import { CargaCroquisProvider } from '../providers/carga-croquis/carga-croquis';
import { PushNotiProvider } from "../providers/push-noti/push-noti";
import { ReservacionProvider } from "../providers/reservacion/reservacion";


//Plugins
import { SMS } from '@ionic-native/sms';
import { Contacts } from '@ionic-native/contacts';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
//import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
import { OneSignal } from "@ionic-native/onesignal";
import { CartaProvider } from '../providers/carta/carta';
import { HttpModule } from '@angular/http';
import { GestionReservacionesProvider } from '../providers/gestion-reservaciones/gestion-reservaciones';

import { MonitoreoReservasProvider } from '../providers/monitoreo-reservas/monitoreo-reservas';
import { ResumenProvider } from '../providers/resumen/resumen';
import { MisReservacionesPage } from '../pages/mis-reservaciones/mis-reservaciones';
import { from } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { QRScanner } from '@ionic-native/qr-scanner';
import { CuponesProvider } from '../providers/cupones/cupones';
import { Clipboard } from '@ionic-native/clipboard';
import { Stripe } from '@ionic-native/stripe';



export const firebaseConfig = {
  apiKey: "AIzaSyBixlCb21nNbPSurY-Pvqu3hZB80Icl9Pk",
  authDomain: "guestreservation-8b24b.firebaseapp.com",
  databaseURL: "https://guestreservation-8b24b.firebaseio.com",
  projectId: "guestreservation-8b24b",
  storageBucket: "guestreservation-8b24b.appspot.com",
  messagingSenderId: "853477386824"
};

 firebase.initializeApp(firebaseConfig);
//  var secondaryConnection = firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PerfilPage,
    TabsPage,
    EventosPage,
    Reservacion_1Page,
    NosotrosPage,
    CartaPage,
    HistorialPage,
    ProductoDetallePage,
    ResumenPage,
    EventoDetallePage,
    ImagencroquisPage,
    ReservacionesPage,
    MisReservacionesPage,
    ReservacionDetallePage,
    CartaEditarPage,
    ProductoDetalle_2Page,
    TelefonoUserPage,
    TarjetasPage,
    AgregarTarjetaPage,
    GenerarqrPage,
    Generarqr_2Page,
    CuponesPage,
    HistorialDetallePage,
    PropinaPage,
    QrGeneradoPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ZoomAreaModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: ''
        }
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PipesModule,
    HttpModule,
    QRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PerfilPage,
    TabsPage,
    EventosPage,
    Reservacion_1Page,
    NosotrosPage,
    CartaPage,
    HistorialPage,
    ProductoDetallePage,
    ResumenPage,
    EventoDetallePage,
    ImagencroquisPage,
    ReservacionesPage,
    ReservacionesPage,
    MisReservacionesPage,
    ReservacionDetallePage,
    CartaEditarPage,
    ProductoDetalle_2Page,
    TelefonoUserPage,
    TarjetasPage,
    AgregarTarjetaPage,
    GenerarqrPage,
    Generarqr_2Page,
    CuponesPage,
    HistorialDetallePage,
    PropinaPage,
    QrGeneradoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    //ZoomAreaModule,
    //BrowserAnimationsModule,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UsuarioProvider,
    Facebook,
    GooglePlus,
    AuthProvider,
    UserProvider,
    //Camera,
    ImagePicker,
    SocialSharing,
    CargaArchivoProvider,
    CartaAddProvider,
    ToastProvider,
    CargaArchivoCartaProvider,
    SucursalAltaProvider,
    CargaCroquisProvider,
    AngularFirestore,
    PushNotiProvider,
    //AuthService,
    OneSignal,
    Clipboard,
    ReservacionProvider,
    GestionReservacionesProvider,
    CartaProvider,
    MonitoreoReservasProvider,
    ResumenProvider,
    Contacts,
    SMS,
    QRScanner,
    CuponesProvider,
    Stripe
     //BarcodeScanner
  ]
})
export class AppModule {}
