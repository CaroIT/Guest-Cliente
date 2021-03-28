import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
// import { AngularFirestore } from '@angular/fire/firestore';
import { ReservacionesPage } from '../reservaciones/reservaciones';
import { TabsPage } from "../tabs/tabs";
@IonicPage()
@Component({
  selector: "page-evento-detalle",
  templateUrl: "evento-detalle.html"
})
export class EventoDetallePage {
  evento: any = {};
  key: null;
  sucursalID: any;
  mostrar: any;
  tabBarElement: any;
  miUser: any = {};
  uidUserSesion: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _cap: CargaArchivoProvider,
    public afs: AngularFirestore
  ) {
    this.evento.uid = this.navParams.get("uid");
    this.sucursalID = this.navParams.get("sucursalID");
    console.log("key", this.evento.uid);
    console.log("SucursalID", this.sucursalID);
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

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

  ionViewDidLoad() {
    this.getDetails();
    console.log("ionViewDidLoad EventoDetallePage");
    this.mostrar = true;
    //this.ionViewWillEnter();
  }

  //funciones para ocultar las tabs
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  getDetails() {
    this._cap.getEvento(this.evento.uid).then(e => {
      this.evento = e;
      console.log("evento", e);
    });
  }

  Reservar(uid, idSucursal) {
    console.log(idSucursal);

    this.navCtrl.push(ReservacionesPage, {
      uid: uid,
      idSucursal: idSucursal
    });
  }

  goBack() {
    this.navCtrl.setRoot(TabsPage);
  }
}
