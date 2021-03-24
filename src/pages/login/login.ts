 import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import "firebase/database";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { TabsPage } from "../../pages/tabs/tabs";
import { TelefonoUserPage } from "../../pages/telefono-user/telefono-user";
import { Platform } from 'ionic-angular';
//import { Facebook } from '@ionic-native/facebook';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';
// import { EventosPage } from '../eventos/eventos';


@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  acti: any[];
  // firedata = firebase.database().ref('/users');
  us: any;
  codigos: any;
  telefono: any;
  url: any;
  //usData: any;
  usPhotoUrl: any;

  pageLogin = "admin-login";
  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
              public usuarioProv: UsuarioProvider,
              private fb: Facebook,
              private googlePlus: GooglePlus,
              private platform: Platform,
              // public afiredatabase: AngularFireDatabase,
              public afs: AngularFirestore
              ) {
              }


   ionViewDidLoad() {
     //if (localStorage.getItem("isLogin") == "true") {
      //   this.navCtrl.setRoot(TabsPage);
      //}
  }

  signInGoogle() {
    this.googlePlus
      .login({
        webClientId:
          "853477386824-kt4bl5ccfs8hgfm255i3384fhb6e50jq.apps.googleusercontent.com",
        offline: true
      })
      .then(res => {
        firebase
          .auth()
          .signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(res.idToken)
          )
          .then(user => {
            this.us = user.user;
            console.log(JSON.stringify(user));
            console.log(res.idToken);
            this.usuarioProv.cargarUsuario(
              this.us.displayName,
              this.us.email,
              this.us.photoURL,
              this.us.uid,
              this.us.phoneNumber,
              "google"
            );
            this.afs
              .collection("users")
              .doc(this.usuarioProv.usuario.uid)
              .set({
                uid: this.usuarioProv.usuario.uid,
                displayName: this.us.displayName,
                email: this.us.email,
                photoURL: this.us.photoURL,
                provider: "google",
                phoneNumber: this.us.phoneNumber,
                type: "u"
              });
            this.navCtrl.setRoot(TabsPage);
          })
          .catch(error =>
            console.log("Firebase failure: " + JSON.stringify(error))
          );
      })
      .catch(err => console.error("Error: ", err));
  }

  signInWithFacebook() {
    localStorage.setItem("isLogin", 'true');
    if (this.platform.is('cordova')) {
      this.fb.login(['public_profile','email']).then((res: FacebookLoginResponse) => {
       const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
       firebase.auth().signInWithCredential(facebookCredential)
       .then(user => {
        //console.log('datos de la sesion del user',user);
        this.us = user.user;
        console.log('Usuario: ', JSON.stringify(this.us));
        localStorage.setItem("uid", this.us.uid);
        //console.log('userID',this.us.uid);
        this.url = "?height=500";
        this.usPhotoUrl = this.us.photoURL+this.url;
        //console.log('url foto',this.usPhotoUrl);
        //this.usData = user.additionalUserInfo.profile;
        //console.log('Usuario data2: ', JSON.stringify(this.usData));
        //this.usPhotoUrl = this.usData.picture.data.url;
        //console.log('picture user facebook',this.usPhotoUrl);
        // alert(JSON.stringify(this.us.uid));
         // console.log(res);
         //cargar datos de facebook del usuario
         this.usuarioProv.cargarUsuario(
           this.us.displayName,
           this.us.email,
           this.us.photoURL,
           this.us.uid,
           this.us.phoneNumber,
           'facebook'
         );
         //sacar el codigo del usuario
           this.usuarioProv.getCodigo(this.us.uid).subscribe(co => {
             this.codigos = co;
             console.log('datos tabla user',this.codigos.length);
             if(this.codigos.length==0){
               console.log('agregar tel');
               this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
                    uid: this.usuarioProv.usuario.uid,
                    displayName: this.us.displayName,
                    email: this.us.email,
                    photoURL: this.usPhotoUrl,
                    playerID: localStorage.getItem('playerID'),
                    phoneNumber: 'null',
                    provider: 'facebook',
                    type: 'u',
                    ciudad: 'null'
                 });
                 this.navCtrl.setRoot(TelefonoUserPage, {
                   idUsuario: this.us.uid
                 });
             }
             this.codigos.forEach(data => {
               console.log('telefonoforeach',data.phoneNumber);
               this.telefono=data.phoneNumber;
               //console.log('telefono',data.phoneNumber);
               if(data.phoneNumber == 'null' || data.phoneNumber == undefined || data.phoneNumber == null){
                 console.log('No existe telefono manda a telefono');
                 console.log('telefonoif',data.phoneNumber);
                 this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
                      uid: this.usuarioProv.usuario.uid,
                      displayName: this.us.displayName,
                      email: this.us.email,
                      photoURL: this.usPhotoUrl,
                      playerID: localStorage.getItem('playerID'),
                      phoneNumber: 'null',
                      provider: 'facebook',
                      type: 'u',
                      ciudad: 'null'
                   });
                   this.navCtrl.setRoot(TelefonoUserPage, {
                     idUsuario: this.us.uid
                   });
               }else{
                 console.log('Ya existe telefono manda a tabs');
                  console.log('telefonoelse',data.phoneNumber);
                  localStorage.setItem('telefono',data.phoneNumber);
                 this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
                      uid: this.usuarioProv.usuario.uid,
                      displayName: this.us.displayName,
                      email: this.us.email,
                      photoURL: this.usPhotoUrl,
                      playerID: localStorage.getItem('playerID'),
                      phoneNumber: data.phoneNumber,
                      provider: 'facebook',
                      type: 'u',
                      ciudad: data.ciudad
                   });
               }
             });
             //console.log('telefono',this.telefono);
           });
        this.navCtrl.setRoot(TabsPage);
        }).catch(e => alert('Error de autenticación' + JSON.stringify(e)));
      })
    }else{
      //Escritorio
      this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {

        console.log(res);
        let user = res.user;
        console.log('Datos User: ', user);
        localStorage.setItem('uid', user.uid);
        localStorage.setItem("isLogin", 'true');
        this.usuarioProv.cargarUsuario(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
          user.phoneNumber,
          'facebook'
        );
        if( this.usuarioProv.usuario.uid ){
          this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
            uid: this.usuarioProv.usuario.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            provider: 'facebook',
            type: 'u'
          });
        }else {
          this.afs.collection('users').add({
            uid: this.usuarioProv.usuario.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            provider: 'facebook',
            type: 'u'
          });
        }
        this.navCtrl.setRoot(TelefonoUserPage, {
          idUsuario: this.us.uid
        });
      });
    }
  }

  signIn(){
    this.navCtrl.setRoot(TabsPage);
  }
}
