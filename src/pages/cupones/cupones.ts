import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Clipboard } from '@ionic-native/clipboard';
import { CuponesProvider } from '../../providers/cupones/cupones';
import { UsuarioProvider, Credenciales } from "../../providers/usuario/usuario";

@IonicPage()
@Component({
  selector: 'page-cupones',
  templateUrl: 'cupones.html',
})
export class CuponesPage {

  totalcupones: any;
  totalsucursal: any;
  cuponregistrado: any;
  uid: any;
  dataUser: any;
  datoUser: any;
  misdatosUser: any;
  usuario: any = {};
  today = Date.now();
  myDate: String = new Date().toISOString();
  fechaActual: any;

  userGe: any = {};
  sucurGe: any;
  canjeo: any;

  cupones: any;
  cupones_acajeados: any;
  cupones_visibles: any = [];

  constructor(public navCtrl: NavController,
    private clipboard: Clipboard,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public cupProv: CuponesProvider,
    public afs: AngularFirestore) {

    this.uid = localStorage.getItem('uid');
    console.log("este es mi uid", this.uid);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CuponesPage');

    //Se obteniene datos del sucursales
    this.afs.collection('sucursales').valueChanges().subscribe(sucudata => {
      this.totalsucursal = sucudata;
      console.log("sucursales", this.totalsucursal);
    });

    //Se obteniene datos del usuario
    this.cupProv.getDataUser(this.uid).then(user => {
      this.usuario = user;
      console.log("datos usuario", user);
    });

    //Se obteniene datos del cupones
    this.afs.collection('cupones').valueChanges().subscribe(data => {
      this.totalcupones = data;
    });


    this.fechaActual = new Date().toJSON().split("T")[0];
    console.log('ionViewDidLoad AgregarCuponesPage', this.fechaActual);


    this.afs.collection('cupones').valueChanges().subscribe(data => {
      this.cupones = data;
      console.log("estos son mis cupones", this.cupones);

      var cuponesarreglo = [];

      this.cupones.forEach(element => {
        const id = element.uid
        console.log('id del cupon', id)

        this.afs.collection('canjeo', ref => ref.where('idUser', '==', this.uid).where('idCupon', '==', id)).valueChanges().subscribe(data => {
          this.cupones_acajeados = data;
          console.log("estos son mis cupones canjeados", this.cupones_acajeados);
          console.log("estos son mis cupones canjeados", this.cupones_acajeados.length);

          if(this.cupones_acajeados.length == 0){
            cuponesarreglo.push(id);
            console.log("estos son los id visibles", cuponesarreglo.join(", "));
            console.log("estos son los datos de los datos visibles", cuponesarreglo);

            this.cupones_visibles = cuponesarreglo;

            // this.cupones_visibles = element.uid;
            // console.log("estos son los id visibles", this.cupones_visibles);

          }
        });

      });

    });


  }

  getDatUser() {

  }

  CopyText(codigocupon) {
    this.clipboard.copy(codigocupon).then(() => {
      alert("code done")
    }).catch(e => alert(e));
  }

}
