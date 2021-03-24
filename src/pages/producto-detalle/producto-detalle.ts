import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartaProvider } from '../../providers/carta/carta';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { CartaPage } from '../carta/carta';

@IonicPage()
@Component({
  selector: "page-producto-detalle",
  templateUrl: "producto-detalle.html"
})
export class ProductoDetallePage {
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
  tabBarElement: any;
  area: any;
  zona: any;

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
    this.area = navParams.get("area");
    this.zona = navParams.get("zona");
    console.log("zona", this.zona, "area", this.area);
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductoDetallePage");
    this.getProduct(this.idProducto, this.idReservacion);
  }
  //funciones para ocultar las tabs
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
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

  eliminar(key) {
    this._providerReservacion.deleteProduct_(key).then((res: any) => {
      if (res.success == true) {
        this.navCtrl.push(CartaPage, {
          idReservacion: this.idReservacion,
          uid: this.evento,
          idSucursal: this.idSucursal,
          area: this.area,
          zona: this.zona,
        });
      } else {
      }
    });
  }

  agregar(_producto, costo, img) {
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
          this.navCtrl.push(CartaPage, {
            idReservacion: this.idReservacion,
            uid: this.evento,
            idSucursal: this.idSucursal,
            area: this.area,
            zona: this.zona,
          });
        } else {
        }
      })
      .catch();
  }

  modificar_(_producto, costo, key) {
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
          this.navCtrl.push(CartaPage, {
            idReservacion: this.idReservacion,
            uid: this.evento,
            idSucursal: this.idSucursal,
            area: this.area,
            zona: this.zona,
          });
        } else {
        }
      })
      .catch();
  }

  goBack() {
    this.navCtrl.push(CartaPage, {
      idReservacion: this.idReservacion,
      uid: this.evento,
      idSucursal: this.idSucursal,
      area: this.area,
      zona: this.zona,
    });
  }
}
