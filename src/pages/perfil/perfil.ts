import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from "../login/login";


import { UsuarioProvider, Credenciales } from "../../providers/usuario/usuario";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  user: Credenciales = {};
  nombresUsers: any;
  tarjetasData: any;

  constructor(public navCtrl: NavController,
              public usuarioProv: UsuarioProvider,
              private afAuth: AngularFireAuth,
              public afDB: AngularFireDatabase,
              public afs: AngularFirestore) {

            console.log( this.usuarioProv.usuario );
            this.user = this.usuarioProv.usuario;

            this.afAuth.authState.subscribe(user =>{
              console.log('AFAUTH!!');
              console.log( JSON.stringify(user));
            });

            //consultar tabla usuarios
            this.afs
              .collection("users")
              .valueChanges()
              .subscribe(data => {
                this.nombresUsers = data;
              });
              //consultar tabla tarjetas
              this.afs
                .collection("tarjetas")
                .valueChanges()
                .subscribe(datat => {
                  this.tarjetasData = datat;
                });
  }

  salir(){
    localStorage.setItem("isLogin", 'false');
    this.afAuth.auth.signOut().then( res => {
      this.usuarioProv.usuario = {};
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
