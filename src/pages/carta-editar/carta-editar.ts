import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams,
  AlertController
} from "ionic-angular";
//Firebase
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { ProductoDetalle_2Page } from "../producto-detalle-2/producto-detalle-2";
import { ReservacionesPage } from "../reservaciones/reservaciones";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { ResumenPage } from '../resumen/resumen';
import { MisReservacionesPage } from "../../pages/mis-reservaciones/mis-reservaciones";

@IonicPage()
@Component({
  selector: 'page-carta-editar',
  templateUrl: 'carta-editar.html',
})
export class CartaEditarPage {

  cartas = [];
  idReservacion: any;
  idSucursal: any;
  evento: any;
  consumo: any;
  productos:any;
  total: any;
  tabBarElement: any;

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public alertCtrl: AlertController,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore,
    public modalCtrl: ModalController, //private _cap: CargaArchivoCartaProvider
    public _providerReserva: ReservacionProvider
  ) {
    this.afs
      .collection("cartas")
      .valueChanges()
      .subscribe(c => {
        this.cartas = c;
        console.log("cartas", c);
      });

    this.idReservacion = navParam.get("idReservacion");
    this.idSucursal = navParam.get("idSucursal");
    this.evento = navParam.get("idevento");
    console.log('reservacion' ,this.idReservacion);
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CartaPage");
    this.loadReservacion(this.idReservacion);
    this.loadProductRes(this.idReservacion);
  }

  //funciones para ocultar las tabs
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  goBack() {
    this.navCtrl.push(MisReservacionesPage, {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      uid: this.evento
    });
  }

  goToResumen(consumo, total){
    console.log('Consumo: ', consumo, ' ', 'Total: ', total);
    const formatter = new Intl.NumberFormat("en-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2
    });
    if (total >= consumo) {
      this.navCtrl.push(ResumenPage, {
        idReservacion: this.idReservacion,
        idSucursal: this.idSucursal,
        uid: this.evento
      });
    } else {
      let alertMesas = this.alertCtrl.create({
        message:
          "<div text-center> Esta zona cuenta con un consumo sugerido de " +
          "<br><br>" +
          "<b>" +
          formatter.format(consumo) +
          "</b>" +
          "</div>",
        buttons: [
          {
            text: "Aceptar",
            handler: () => {
              console.log("Buy clicked");
            }
          }
        ]
      });
      alertMesas.present();
    }

     //cambiar el estadus de modificado a aceptado
      this._providerReserva
        .updateReservacionEstatus(this.idReservacion)
        .then((respuesta: any) => {
          console.log("Respuesta: ", respuesta);
          if (respuesta.success == true) {
            console.log("Success: ", respuesta.success);
          }
        });
  }

  productoDetalle2(idProducto) {
    this.navCtrl.push(ProductoDetalle_2Page, {
      idProducto: idProducto,
      idReservacion: this.idReservacion,
      uid: this.evento,
      idSucursal: this.idSucursal
    });
  }

  loadReservacion(idx) {
    this._providerReserva.getReservacion(idx).subscribe(reservacion => {
      console.log('Datos Reservación: ', reservacion);
      this._getZona(reservacion.idZona);
    });
  }

  loadProductRes(idx){
    this._providerReserva.getProductos(idx).subscribe(productos => {
      console.log("Datos Reservación: ", productos);
      this.productos = productos;
      this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
      console.log('Resusltado: ', this.total);
    });
  }

  _getZona(idx) {
    this._providerReserva.getZona(idx).subscribe(zona => {
      console.log('Datos zona: ', zona);
      this.consumo = zona.consumo;
    });
  }

}
