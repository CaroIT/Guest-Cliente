import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { TabsPage } from '../tabs/tabs';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
/**
 * Generated class for the PropinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-propina',
  templateUrl: 'propina.html',
})
export class PropinaPage {

  idReservacion: any;
  propina: any;
  myForm: FormGroup;
  infoReservaciones: any;
  validarCupon:any;
  total: any;
  totalPropina:any;
  totalPropina2:any;
  productos: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public providerReserva: ReservacionProvider,
              public afs: AngularFirestore,
              public alertCtrl: AlertController,
              public fb: FormBuilder) {
        this.idReservacion = navParams.get("idReservacion");
        //validar que los inputs del formulario no esten vacios
        this.myForm = this.fb.group({
          propina: ["", [Validators.required]]
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PropinaPage');
  }

  propinaAdd(){

  //Guarda la propina en la reservacion indicada
  console.log('reservacion propina',this.idReservacion);
  console.log('propina',this.propina);
  this.afs.collection("reservaciones").doc(this.idReservacion).update({
    "propina": this.propina
  })
    .then(function () {
      console.log("se adjunto la propina!");
    });
    //SABER SI SE USO UN cupon en la reservacion
    this.providerReserva.getInfo(this.idReservacion).subscribe(info => {
      this.infoReservaciones = info;
      if(info[0].uidCupon==undefined){
         this.validarCupon='Noexiste';
         // total de general dependiendo los productos que tenga la reservacion
         this.providerReserva.getProductos(this.idReservacion).subscribe(productos => {
           this.productos = productos;
           this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
           const propinaCalculo=this.total*this.propina;
           this.totalPropina=this.total + propinaCalculo;
           //Manda mensaje de termino de la reservacion
           let alertMesas = this.alertCtrl.create({
             message:
               "Total de la reservacion con propina es: $ " +this.totalPropina+ " Gracias por reservar en Guest Resy te notificaremos cuando tu reservación haya sido aceptada.",
             buttons: [
               {
                 text: "Aceptar",
                 handler: () => {
                   console.log("Buy clicked");
                   this.navCtrl.setRoot(TabsPage);
                 }
               }
             ]
           });
           alertMesas.present();
         });
       }else{
          this.validarCupon='Existe';
          const totalDescuento=info[0].totalReservacion;
          const propinaCalculo2=totalDescuento*this.propina;
          this.totalPropina2=totalDescuento + propinaCalculo2;
          //Manda mensaje de termino de la reservacion
          let alertMesas2 = this.alertCtrl.create({
            message:
              "Total de la reservacion con propina es: $ " +this.totalPropina2+ " Gracias por reservar en Guest Resy te notificaremos cuando tu reservación haya sido aceptada.",
            buttons: [
              {
                text: "Aceptar",
                handler: () => {
                  console.log("Buy clicked");
                  this.navCtrl.setRoot(TabsPage);
                }
              }
            ]
          });
          alertMesas2.present();

        }

    });
  }

}
