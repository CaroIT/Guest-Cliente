import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { TelefonoUserPage } from '../telefono-user/telefono-user';
import { EventosPage } from '../eventos/eventos';
import { PushNotiProvider } from '../../providers/push-noti/push-noti';
import * as firebase from 'firebase';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';


@IonicPage()
@Component({
  selector: 'page-login-correo',
  templateUrl: 'login-correo.html',
})
export class LoginCorreoPage {

  palabra: any;
  pass: any;
  email: any;
  name: any;
  email_lo: any;
  pass_lo: any;
  email_re: any;
  us: any;
  codigos: any;
  telefono: any;
  myForm: FormGroup;
  myForm_lo: FormGroup;
  myFormr: FormGroup;
  afs = firebase.firestore();

    constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public usuarioProv: UsuarioProvider,
    public fbr: FormBuilder,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public _providerPus: PushNotiProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams) {

    this.myForm = this.fbr.group({
      email: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });

    this.myForm_lo = this.fbr.group({
      email_lo: ['', [Validators.required]],
      pass_lo: ['', [Validators.required]]
    });

    this.myFormr = this.fbr.group({
      email_re: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginCorreoPage');
  
    this.palabra = this.navParams.get('palabra');
    console.log("Dato", this.palabra);

  }

  goBack() {
    this.navCtrl.setRoot(LoginPage);
  }

  RegisterToEmail() {

    console.log("nombre", this.name, "correo", this.email, "password", this.pass);

    const result = this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.pass).then((user: any) => {
      console.log('usuario', user);

      localStorage.setItem("isLogin", 'true');
      this.us = user.user;
      console.log('Usuario: ', JSON.stringify(this.us));
      console.log("contraseña", this.us.pass);
      localStorage.setItem("uid", this.us.uid);

      this.usuarioProv.getCodigo(this.us.uid).subscribe(co => {
        this.codigos = co;
        console.log('datos tabla user', this.codigos.length);
        if (this.codigos.length == 0) {
          console.log('agregar tel');

          this.db.collection("users").doc(this.us.uid).set({
            uid: this.us.uid,
            displayName: this.name,
            email: this.us.email,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
            playerID: localStorage.getItem('playerID'),
            phoneNumber: 'null',
            provider: 'google',
            type: 'u',
            ciudad: 'null',
          });

          this._providerPus.init_notification();
          this.navCtrl.setRoot(TelefonoUserPage, {
            idUsuario: this.us.uid
          });

        }
        this.codigos.forEach(data => {
          console.log('telefonoforeach', data.phoneNumber);
          this.telefono = data.phoneNumber;
          //console.log('telefono',data.phoneNumber);
          if (data.phoneNumber == 'null' || data.phoneNumber == undefined || data.phoneNumber == null) {
            console.log('No existe telefono manda a telefono');
            console.log('telefonoif', data.phoneNumber);
            this.db.collection('users').doc(this.usuarioProv.usuario.uid).set({
              uid: this.usuarioProv.usuario.uid,
              displayName: this.us.displayName,
              email: this.us.email,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
              playerID: localStorage.getItem('playerID'),
              phoneNumber: 'null',
              provider: 'google',
              type: 'u',
              ciudad: 'null'
            });
            this._providerPus.init_notification();
            this.navCtrl.setRoot(TelefonoUserPage, {
              idUsuario: this.us.uid
            });
          } else {
            console.log('Ya existe telefono manda a tabs');
            console.log('telefonoelse', data.phoneNumber);
            localStorage.setItem('telefono', data.phoneNumber);
            this.db.collection('users').doc(this.usuarioProv.usuario.uid).set({
              uid: this.usuarioProv.usuario.uid,
              displayName: this.us.displayName,
              email: this.us.email,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
              playerID: localStorage.getItem('playerID'),
              phoneNumber: data.phoneNumber,
              provider: 'google',
              type: 'u',
              ciudad: data.ciudad
            });
          }
        });
      });
    });
  }

  LoginToEmail() {

    console.log("correo", this.email_lo, "password", this.pass_lo);

    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(this.email_lo, this.pass_lo).then((user: any) => {
        localStorage.setItem("isLogin", 'true');
        if (result) {
          this.us = result;
          console.log('Usuario: ', JSON.stringify(user));
          localStorage.setItem("uid", user.user.uid);
          console.log("Este es el usuario", JSON.stringify(user.user.uid), "cual de los dos sera", user.user.uid);
          // this.navCtrl.setRoot(EventosPage, { 'uid': user.user.uid });
          this.navCtrl.setRoot(TipoLugarPage, { 'uid': user.user.uid });
        }
      });
    } catch (error) {
      const alert = this.alertCtrl.create({
        title: 'Usuario',
        subTitle: 'Correo o contraseña incorrectos',
        buttons: ['Aceptar']
      });
      alert.present();
    }

  }

  onReset(position: string) {
    console.log("llega");
    console.log("este es el correo", this.email);

    var auth = firebase.auth();

    auth.sendPasswordResetEmail(this.email).then(function () {

      this.flashMessage.show('Se ha enviado un mensaje a tu correo', { cssClass: 'alert-success', timeout: 4000 });

      // this.router.navigate(['login']);

    }).catch(function (error) {
    });

    let toast = this.toastCtrl.create({
      message: 'Se ha enviado un mensaje a tu correo',
      duration: 4000,
      position: position
    });

    toast.present(toast);

    this.navCtrl.setRoot(LoginCorreoPage);
  }




}
