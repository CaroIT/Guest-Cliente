import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventoDetallePage } from "../../pages/evento-detalle/evento-detalle";
//Plugins
import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFireDatabase } from '@angular/fire/database';
// import { Observable } from 'rxjs/Observable';
//import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
import { UsuarioProvider } from '../../providers/usuario/usuario';
//import { UserProvider } from '../../providers/user/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { SMS } from '@ionic-native/sms';
//import { PushNotiProvider } from '../../providers/push-noti/push-noti';

@IonicPage()
@Component({
  selector: "page-eventos",
  templateUrl: "eventos.html"
})
export class EventosPage {
  //hayMas:boolean= true;
  eventos = [];
  filterPost: "";
  filterPostCiudad:"";
  uidUserSesion: any;
  usuarios: any;
  sucursales: any;
  formatoFecha: any;
  ciudades: any;
  //eventosF: any;
  //playerID: any;
  //userID: any;


  constructor(
    //private _cap: CargaArchivoProvider,
    private socialSharing: SocialSharing,
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public navParams: NavParams,
    public _cap: UsuarioProvider,
    private sms: SMS,
    public afs: AngularFirestore
    //public _providerPushNoti: PushNotiProvider,
  //  public _providerUser: UserProvider
  ) {
    //sacar el id del usuario del local storage
    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en eventos',this.uidUserSesion);

    //obtener informacion de todofilterPosts los usuarios
    this.afs
      .collection("users")
      .valueChanges()
      .subscribe(dataUser => {
        this.usuarios = dataUser;
        console.log('users todos',  this.usuarios);
      });

    // eventos de fecha actual y que se quiten de fechas pasadas (año-mes-dia->2019-11-30)
    var dateObj = new Date()
    var anio = dateObj.getFullYear().toString();
    var mes = dateObj.getMonth().toString();
    var dia = dateObj.getDate();
    var mesArray = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    if (dia >= 1 && dia <= 9){
       var diaCero='0'+dia;
       this.formatoFecha = anio + '-' + mesArray[mes] + '-' + diaCero;
     }else{
     this.formatoFecha = anio + '-' + mesArray[mes] + '-' + dia;
     }
      console.log("fechA ACTUAL", this.formatoFecha);
    //console.log("fecha actual");
    //console.log(this.formatoFecha);
    this.afs.collection('evento', ref => ref.where('fecha', '>=', this.formatoFecha)).valueChanges().subscribe(data => {
      this.eventos = data;
      console.log("eventos fecha", this.eventos);
    });
    //obtener informacion de todos los eventos
    //this.afs
    //  .collection("evento")
    //  .valueChanges()
    //  .subscribe(data => {
    //    this.eventos = data;
    //    console.log('eventos todos',this.eventos);
    //  });
    //obtener informacion de todas las sucursales
    this.afs
      .collection("sucursales")
      .valueChanges()
      .subscribe(dataSu => {
        this.sucursales = dataSu;
        console.log('sucursales todos',  this.sucursales);
      });

      this.afs
        .collection("ciudades")
        .valueChanges()
        .subscribe(dataCiudad => {
          this.ciudades = dataCiudad;
          console.log('cudades',  this.ciudades);
        });
    //  afDB.list('evento').valueChanges().subscribe( e =>  {
    //    this.eventos = e;
    //  })

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventosPage");
    this.sms.send('416123456', 'Hello world!');
    //this._providerPushNoti.init_push_noti();
    //this.guardarPlayerID();
  }


  compartir(evento: any) {
    this.socialSharing
      .shareViaFacebook(evento.titulo, null, evento.img)
      .then(() => {}) // se pudo compartir
      .catch(() => {}); // si sucede un error
  }

  compartirInsta(evento: any) {
    this.socialSharing
      .shareViaInstagram(evento.titulo, evento.img)
      .then(() => {}) // se pudo compartir
      .catch(() => {}); // si sucede un error
  }

  verDetalle(uid, sucursalID) {
    this.navCtrl.setRoot(EventoDetallePage, {
      uid: uid,
      sucursalID: sucursalID
    });
  }
}
