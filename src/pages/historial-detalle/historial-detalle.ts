import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';

@IonicPage()
@Component({
  selector: 'page-historial-detalle',
  templateUrl: 'historial-detalle.html',
})
export class HistorialDetallePage {

  historia : any;
  productos = [];
  sumatoria: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public _providerProductos: ReservacionProvider
  ) {
    // console.log(navParams);
    this.historia = this.navParams.get('historia');
    var idR = this.historia.idReservacion;
   console.log("id",idR);
    this.getProductos(idR); //llamar funcion de productos
    this.sumatoria = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialDetallePage');
  }

  getProductos(idx) {
    console.log("funcion productos: ", idx);
    this._providerProductos.getProductos(idx).subscribe(res => {
      console.log("Este es el resultado de productos de reservacion: ", res);

      var suma = 0;
      res.forEach(function (value) {
        suma = suma + parseFloat(value.costo);
      });

      this.sumatoria = suma;
      this.productos = res;
    });
  }

  closeModal() {
    let result ="se cerrro";
    this.viewCtrl.dismiss({result:result});
    // this.modalCtrl.dismiss();
  }

}
