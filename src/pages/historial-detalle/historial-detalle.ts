import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

@IonicPage()
@Component({
  selector: 'page-historial-detalle',
  templateUrl: 'historial-detalle.html',
})
export class HistorialDetallePage {

  historia: any = {};
  productos = [];
  sumatoria: number;
  infoReservacion: any;
  nombresZonas: any;
  infoCupones: any;
  cuentasCompartidas: any;
  infoUsers: any;
  infoReserCom: any;
  infoReserCom_num: any;
  validarCupon: any;
  propinaRe: any;
  propinaRe2: any;
  totalPropinaCupon: any;
  total: any;
  totalPropina: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _providerProductos: ReservacionProvider,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore
  ) {
    console.log(navParams);
    this.historia = this.navParams.get("historia");
    var idR = this.historia.idReservacion;
    console.log("Id Reservacion", idR);
    this.getProductos(idR); //llamar funcion de productos
    this.sumatoria = 0;
    this.getReservacionInfo(idR);
    //consultar tabla zonas
    this.afs
      .collection("zonas")
      .valueChanges()
      .subscribe(data1 => {
        this.nombresZonas = data1;
      });
      //consultar tabla cupones
      this.afs
        .collection("cupones")
        .valueChanges()
        .subscribe(data2 => {
          this.infoCupones = data2;
        });
        //consultar tabla compartidas
        this.afs
          .collection("compartidas")
          .valueChanges()
          .subscribe(data3 => {
            this.cuentasCompartidas = data3;
              console.log("compartidas", this.cuentasCompartidas);
          });
          //consultar tabla users
          this.afs
            .collection("users")
            .valueChanges()
            .subscribe(data4 => {
              this.infoUsers = data4;
              console.log("usuarios", this.infoUsers);
            });
        //ver si la reservacioon existe en las compartidas
        this._providerProductos.getReserCom(idR).subscribe(res11 => {
          this.infoReserCom = res11;
          this.infoReserCom_num = this.infoReserCom.length;
          console.log("Este es el resultado de compartidas: ",  this.infoReserCom_num);
        });
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
      this._providerProductos.getInfo(idx).subscribe(res2 => {
        this.infoReservacion = res2;
            this.propinaRe2=this.sumatoria*res2[0].propina;
            const propinaCalculo2=this.sumatoria*res2[0].propina;
            this.totalPropina=this.sumatoria+propinaCalculo2;
      });
    });
  }
  getReservacionInfo(idx) {
    this._providerProductos.getInfo(idx).subscribe(res2 => {
      this.infoReservacion = res2;
      console.log("Este es el resultado de reservacion: ",this.infoReservacion);
      if(res2[0].uidCupon==undefined){
         this.validarCupon='Noexiste';
         console.log('validar cupon', this.validarCupon);
       }else{
          this.validarCupon='Existe';
           console.log('validar cupon', this.validarCupon);
          this.propinaRe=res2[0].totalReservacion*res2[0].propina;
          const propinaCalculo=res2[0].totalReservacion*res2[0].propina;
          this.totalPropinaCupon=res2[0].totalReservacion+propinaCalculo;
          console.log('descuenton',res2[0].totalReservacion);
          console.log('propina',res2[0].propina);
          console.log('propina y cupon',this.totalPropinaCupon);
        }
    });
  }


}
