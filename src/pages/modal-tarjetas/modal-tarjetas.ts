import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,ViewController } from 'ionic-angular';
import { AgregarTarjetaPage } from "../../pages/agregar-tarjeta/agregar-tarjeta";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { TarjetasPage } from "../../pages/tarjetas/tarjetas";

@IonicPage()
@Component({
  selector: 'page-modal-tarjetas',
  templateUrl: 'modal-tarjetas.html',
})
export class ModalTarjetasPage {

  misTarjetas: any;
  uid: any;
  misTarjetasRegistradas: any;
  tarjetas: any;
  tarjetaActiva: any;
  //tarjetaAnterior: any;
  numTarjetas: any;
  idReservacion: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public afs: AngularFirestore,
              public viewCtrl: ViewController,
              private modalCtrl: ModalController,
              public usuarioProv: UsuarioProvider) {
                //sacar el id del usuario del local storage
                this.idReservacion = this.navParams.get("idReservacion");
                console.log("Id Reservacion en tarjetas: ", this.idReservacion);
                this.uid = localStorage.getItem('uid');
                console.log('id sesion',this.uid);
  }

  ionViewDidLoad() {
  //  console.log('ionViewDidLoad ModalTarjetasPage');
  this.getAllTarjetas();
  //  this.navCtrl.push(TarjetasPage, {
  //    idReservacion: this.idReservacion
  //  });

  }
  //obtener todas las tarjetas del usuario
    getAllTarjetas() {
    //console.log('miuser',this.uid);
      this.usuarioProv.getTarjetasUser(this.uid).subscribe(tarjeta => {
        this.misTarjetas = tarjeta;
         this.numTarjetas=this.misTarjetas.length;
    //  console.log('misTarjetas',this.numTarjetas);
    //    this.tarjetaAnterior = localStorage.getItem('TarjetaId');
      console.log('misTarjetas',this.misTarjetas);
      });
    }

  //ir a la pantalla para registrar una tarjeta nueva
   agregarTarjeta(){
     let modal = this.modalCtrl.create("ModalTarjetasAddPage",{
        idReservacion: this.idReservacion,
      });
      modal.present();
   }

  //cambiar el estatus de la tarjeta a Eliminada
  eliminarTarjeta(idTarjeta){
   this.usuarioProv.updateTarjetaEliminar(idTarjeta).then((respuesta: any) => {
       console.log('eliminada');
    });
  }

    goBack(modal) {
      this.navCtrl.push(ReservacionDetallePage, {
        idReservacion: this.idReservacion,
        modal: modal
      });
  }

}
