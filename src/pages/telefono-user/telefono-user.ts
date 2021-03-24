import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { TabsPage } from "../tabs/tabs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-telefono-user',
  templateUrl: 'telefono-user.html',
})
export class TelefonoUserPage {

//Declarar variables
idUsuario: any;
telefono: any;
ciudad: any;
myForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public usuarioProv: UsuarioProvider,
              public afDB: AngularFireDatabase,
              public fb: FormBuilder,
              public afs: AngularFirestore) {
              //recibe parametro del id del usuario
              this.idUsuario = this.navParams.get("idUsuario");

              //validas que los inputs del formulario no esten vacios
              this.myForm = this.fb.group({
                telefono: ["", [Validators.required]],
                ciudad: ["", [Validators.required]]
              });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TelefonoUserPage');
  }

  addTelefono(){
      //console.log('El ciudad llego ',this.ciudad);
      //console.log('El telefono llego ',this.inputText);
      this.usuarioProv.agregarTelefono(this.idUsuario,this.telefono,this.ciudad).then((respuesta: any) => {
          console.log("Respuesta: ", respuesta);
          if (respuesta.success == true) {
            localStorage.setItem('telefono', this.telefono);
            console.log("Success: ", respuesta.success);
          }
        });
      this.navCtrl.setRoot(TabsPage);
  }

}
