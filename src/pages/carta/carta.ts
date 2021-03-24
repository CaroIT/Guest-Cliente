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
//import { Observable } from 'rxjs/Observable';
//import { Observable } from 'rxjs-compat';
//import { map } from 'rxjs-compat/operators';
//import { CargaArchivoCartaProvider } from '../../providers/carga-archivo-carta/carga-archivo';
import { AngularFirestore } from "@angular/fire/firestore";
import { ProductoDetallePage } from "../producto-detalle/producto-detalle";
import { ReservacionesPage } from "../reservaciones/reservaciones";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { ResumenPage } from '../resumen/resumen';

@IonicPage()
@Component({
  selector: "page-carta",
  templateUrl: "carta.html"
})
export class CartaPage {
  cartas = [];
  idReservacion: any;
  idSucursal: any;
  area: any;
  zona: any;
  evento: any;
  consumo: any;
  productos: any;
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
    //  this.cartas = afDB.list('bebidas').valueChanges();
    ///if (localStorage.getItem("idReservacion") != undefined) {
    ///    this.idReservacion = localStorage.getItem("idReservacion");
    ///}else{
    ///  this.idReservacion = navParam.get("idReservacion");
    ///}
    this.idReservacion = navParam.get("idReservacion");
    this.idSucursal = navParam.get("idSucursal");
    this.evento = navParam.get("uid");
    this.area = navParam.get("area");
    this.zona = navParam.get("zona");
    console.log("zona", this.zona, "area", this.area);
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
    this.navCtrl.push(ReservacionesPage, {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      uid: this.evento,
      // area: this.area,
      zona: this.zona,
    });
  }

  goToResumen(consumo, total) {
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
        uid: this.evento,
        area: this.area,
        zona: this.zona,
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
  }

  productoDetalle(idProducto) {
    this.navCtrl.push(ProductoDetallePage, {
      idProducto: idProducto,
      idReservacion: this.idReservacion,
      uid: this.evento,
      idSucursal: this.idSucursal,
      area: this.area,
      zona: this.zona,
    });
  }

  loadReservacion(idx) {
    this._providerReserva.getReservacion(idx).subscribe(reservacion => {
      console.log('Datos Reservación: ', reservacion);
      this._getZona(reservacion.idZona);
    });
  }

  loadProductRes(idx) {
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
