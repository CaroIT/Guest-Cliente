import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
/**
 * Generated class for the QrGeneradoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-generado',
  templateUrl: 'qr-generado.html',
})
export class QrGeneradoPage {
  public idReservacion: string = null;
  idCompartir: any;
  //Crear variables para guardar los datos que se reciban de la reservacion
  private created_code= null;
    private qr_data = {
    "idReservacion": "",
    "mensaje": "",
    "idCompartir": ""
   }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private qrScanner: QRScanner) {
                //recibir datos de la reservacion compartida
                this.idReservacion = this.navParams.get("idReservacion");
                this.idCompartir = this.navParams.get("idCompartir");
                //guardar datos recibidos en el arreglo creado qr_data
                this.qr_data.idReservacion = this.idReservacion;
                this.qr_data.mensaje = "Reservacion pagada";
                this.qr_data.idCompartir =   this.idCompartir;
                this.created_code = JSON.stringify(this.qr_data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrGeneradoPage');
  }
  goBack() {
    this.navCtrl.push(ReservacionDetallePage, {
      idReservacion: this.idReservacion
    });
  }

}
