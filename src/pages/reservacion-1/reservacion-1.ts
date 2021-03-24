import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { Observable } from 'rxjs-compat';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReservacionesPage } from '../reservaciones/reservaciones';
import { AngularFirestore } from '@angular/fire/firestore';
@IonicPage()
@Component({
  selector: 'page-reservacion-1',
  templateUrl: 'reservacion-1.html',
})
export class Reservacion_1Page {
// sucursales: Observable<any[]>;
sucursales = [];
uid : string;
reservacion : any ={};
contador : any;
estado : any;
modificador: any;
public filterPost: '';
public filterPostCiudad: '';
uidUserSesion: any;
usuarios: any;
ciudades: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public afDB: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              public afs: AngularFirestore,
              ) {
    // this.sucursales = afDB.list('sucursales').valueChanges();
    // this.uid = this.afAuth.auth.currentUser.uid;
    // console.log("uid desde Auth", this.uid);

    this.uid = localStorage.getItem('uid');
    console.log('id del usuario en Reservacion',this.uid);

    //obtener el id del user en sesion
    this.uidUserSesion=localStorage.getItem('uid');
    console.log('user en sucursales',this.uidUserSesion);
    //obtener informacion de todas las sucursales
    this.afs.collection('sucursales').valueChanges().subscribe( s => {
      this.sucursales = s;
      console.log('sucursales', this.sucursales);
    // afDB.list('sucursales').valueChanges().subscribe( s => {
    //   this.sucursales = s;
    //   console.log('sucursale', this.sucursales);
    })
    //obtener informacion de todos los usuarios
    this.afs.collection('users').valueChanges().subscribe( user => {
      this.usuarios = user;
      console.log('usuarios', this.usuarios);
    })
    //sacar todas las ciudades
    this.afs
      .collection("ciudades")
      .valueChanges()
      .subscribe(dataCiudad => {
        this.ciudades = dataCiudad;
        console.log('cudades',  this.ciudades);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Reservacion_1Page');
    console.log('filtro', this.filterPostCiudad);

  }
  reservar(idSucursal){
        this.navCtrl.push(ReservacionesPage, {'idSucursal':idSucursal});
  }
  // filtro( ) {
  //   this.modificador = this.modificador.filter(( sucursal ) => {
  //     console.log('respuesta de filtro', this.modificador);
  //     return sucursal.tipo == 'bar';
  //   })
  // }


}
