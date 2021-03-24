import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { AngularFireAuth } from 'angularfire2/auth';
import { HistorialDetallePage } from '../historial-detalle/historial-detalle';


@IonicPage()
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {
  eventos = [];
  uid: any;
  historial = [];
  cont: any = 0;
  suma: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    public _providerReserva: ReservacionProvider
  ) {

    this.uid = localStorage.getItem("uid");
    console.log("quiero ver este", this.uid);
    this.getHistorial(this.uid);
    this.contador();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialPage');
  }

  presentModal(historia: any) {
    console.log("parametro enviado a modal", historia);
    this.navCtrl.push(HistorialDetallePage, { 'historia': historia });
  }

  getHistorial(idx) {
    console.log("idUsuarioHistorial: ", idx);
    this._providerReserva.getHistorial(idx).subscribe(res => {
      console.log("Este es el resultado del historial: ", res);
      this.historial = res;
    });
  }

  contador() {
    this.cont = this.cont + 1;
    console.log("contador", this.cont);
    this.cont = this.cont;
  }

}
