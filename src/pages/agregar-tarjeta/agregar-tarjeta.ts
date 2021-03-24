import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TarjetasPage } from "../../pages/tarjetas/tarjetas";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioProvider } from "../../providers/usuario/usuario";

@IonicPage()
@Component({
  selector: 'page-agregar-tarjeta',
  templateUrl: 'agregar-tarjeta.html',
})
export class AgregarTarjetaPage {
  fechaActual: any;
  fechaActualanio: any;
  myForm: FormGroup;
  numTarjeta: any;
  numTarjeta4dijitos: any;
  mesExp: any;
  anioExp: any;
  cvc: any;
  uid: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder,
              public usuarioProv: UsuarioProvider)
 {
    //validas que los inputs del formulario no esten vacios
    this.myForm = this.fb.group({
      numTarjeta: ["", [Validators.required]],
      mesExp: ["", [Validators.required]],
      anioExp: ["", [Validators.required]],
      cvc: ["", [Validators.required]]
    });
    //sacar el id del usuario del localstorage
    this.uid = localStorage.getItem('uid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarTarjetaPage');
    this.fechaActual = new Date().toJSON().split("T")[0];
    //console.log('fecha actual',this.fechaActual);
    this.fechaActualanio=this.fechaActual.substr( 0, 4);
    //console.log('fecha actual año',this.fechaActualanio);
  }

  //agregar los datos de la tarjeta
  tarjetaAdd(){
  console.log('num tarjeta',this.numTarjeta);
  console.log('tarjeta 4 dijistos',this.numTarjeta.substr(-4));
  console.log('num mes',this.mesExp);
  console.log('num año',this.anioExp);
  console.log('num cvc',this.cvc);
  console.log('id user',this.uid);
  this.numTarjeta4dijitos=this.numTarjeta.substr(-4);
  this.usuarioProv.agregarTarjeta(this.uid,this.numTarjeta,this.anioExp,this.mesExp,this.cvc,this.numTarjeta4dijitos).then((respuesta: any) => {
      console.log("Respuesta: ", respuesta);
      if (respuesta.success == true) {
        console.log("Success: ", respuesta.success);
      }
    });
  this.navCtrl.push(TarjetasPage);
  }

  goBack() {
    this.navCtrl.setRoot(TarjetasPage);
  }
}
