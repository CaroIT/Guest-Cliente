import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartaProvider } from '../../providers/carta/carta';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { CartaEditarPage } from '../carta-editar/carta-editar';

@IonicPage()
@Component({
  selector: 'page-producto-detalle-2',
  templateUrl: 'producto-detalle-2.html',
})
export class ProductoDetalle_2Page {

  idProducto: any;
  product: any = {};
  pisto = 0;
  idReservacion: any;
  disableButton: any = true;
  evento: any;
  idSucursal: any;
  productos: any;
  modificar: any;
  key: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _providerCarta: CartaProvider,
    public _providerReservacion: ReservacionProvider
  ) {
    this.idProducto = navParams.get("idProducto");
    this.idReservacion = navParams.get("idReservacion");
    this.evento = navParams.get("uid");
    this.idSucursal = navParams.get("idSucursal");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductoDetallePage");
    this.getProduct(this.idProducto, this.idReservacion);
  }

  getProduct(idProducto, idx) {
    this._providerCarta.getProduct(idProducto).subscribe(product => {
      this.product = product;

      this._providerReservacion.getProductos(idx).subscribe(productos => {
        console.log("Datos Reservación: ", productos);
        this.productos = productos;
        this.productos.forEach(data => {
          console.log("Productos: ", data);
          if (data.idProducto == idProducto) {
            console.log("Modificar");
            this.modificar = true;
            this.pisto = data.cantidad;
            this.key = data.$key;
          }
        });
      });
      console.log("Detalle producto: ", this.product.titulo);
    });
  }

  increment() {
    if (this.pisto < 20) {
      this.pisto++;
    }
  }

  decrement() {
    if (this.pisto > 0) {
      this.pisto--;
    }
  }

  validarBoton() {
    if (this.pisto >= 1) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
  }

  eliminar2(key){
    this._providerReservacion.deleteProduct_(key).then((res: any) => {
      if (res.success == true) {
        this.navCtrl.push(CartaEditarPage, {
          idReservacion: this.idReservacion,
          uid: this.evento,
          idSucursal: this.idSucursal
        });
      } else {
      }
    });
  }

  agregar2(_producto, costo, img) {
    console.log("Pisto: ", this.pisto);

    const total = costo * this.pisto;
    const producto = {
      producto: _producto,
      cantidad: this.pisto,
      costo: costo,
      total: total,
      idProducto: this.idProducto,
      idReservacion: this.idReservacion,
      img: img
    };
    this._providerReservacion
      .addProducto(producto)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
          this.navCtrl.push(CartaEditarPage, {
            idReservacion: this.idReservacion,
            uid: this.evento,
            idSucursal: this.idSucursal
          });
        } else {
        }
      })
      .catch();
  }

  modificar_2(_producto, costo, key) {
    console.log("Pisto: ", this.pisto);

    const total = costo * this.pisto;
    const producto = {
      producto: _producto,
      cantidad: this.pisto,
      costo: costo,
      total: total,
      idProducto: this.idProducto,
      idReservacion: this.idReservacion
    };
    this._providerReservacion
      .updateProducto(producto, key)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
          this.navCtrl.push(CartaEditarPage, {
            idReservacion: this.idReservacion,
            uid: this.evento,
            idSucursal: this.idSucursal
          });
        } else {
        }
      })
      .catch();
  }

  goBack() {
    this.navCtrl.push(CartaEditarPage, {
      idReservacion: this.idReservacion,
      uid: this.evento,
      idSucursal: this.idSucursal
    });
  }
}
