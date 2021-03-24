import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController
} from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
import { AngularFirestore } from "@angular/fire/firestore";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { CartaPage } from "../carta/carta";
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';

@IonicPage()
@Component({
  selector: "page-reservaciones",
  templateUrl: "reservaciones.html"
})
export class ReservacionesPage {
  idSucursal: any;
  sucursal: any = {};
  croquiss: any = {};
  croquis: any;
  arquitectura: any = {};
  myForm: FormGroup;
  data: any = {};
  areas: any;
  zonas: any;
  mesas: any;
  public ocultar: boolean = false;
  public areaKey: any;
  Sucursal: string = "reservar";
  area: any;
  zona: any;
  compartir: any;
  evento: any;
  people = 0;
  fechaActual: any;
  disabledFecha: boolean = false;
  idReservacion: any;
  contact = {
    displayName: null,
    phoneNumbers: null,
    birthday: null
  };
  contactlist: any;
  telefono: any;
  telefono1: any;
  telefono2: any;
  telefono3: any
  telefono4: any;
  telefono6: any;
  reservacion: any;
  uid: any;
  misTelefonos: any;
  clientes: any;
  dataUsers: any;
  telUser: any;
  players: any
  compartirID: any;
  phoneuser: any;
  tabBarElement: any;
  zonasnav: any;
  img2 = [];
  resultCompartidas: any;
  usertel: any;
  resultCompartidasFinal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public afDB: AngularFireDatabase,
    public fb: FormBuilder,
    public _cap: CargaArchivoProvider,
    public _providerReserva: ReservacionProvider,
    public afs: AngularFirestore,
    private contacts: Contacts,
    public monRes: MonitoreoReservasProvider
  ) {

    this.idSucursal = this.navParams.get("idSucursal");
    this.evento = this.navParams.get("uid");
    this.idReservacion = this.navParams.get("idReservacion");
    this.zonasnav = this.navParams.get("zona")
    if (this.evento != null) {
      this.evento = this.navParams.get("uid");
    } else {
      this.evento = null;
    }
    this.afs
      .collection("sucursales")
      .doc(this.idSucursal)
      .valueChanges()
      .subscribe(data => {
        this.sucursal = data;
        console.log(this.sucursal);
      });

      // this.afs
      // .collection("croquis_img")
      // .doc(this.idSucursal)
      // .valueChanges()
      // .subscribe(data => {
      //   this.croquiss = data;
      //   console.log("estos son los croquis",this.croquiss);
      // });

      this.afs.collection('croquis_img', ref => ref.where('idSucursal', '==', this.idSucursal)).valueChanges().subscribe(data => {
        this.croquis = data;
        console.log("croquis", this.croquis);
      });

    //consultar tabla users
    this.afs
      .collection("users")
      .valueChanges()
      .subscribe(datau => {
        this.dataUsers = datau;
      });

    this.myForm = this.fb.group({
      hora: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
      area: [" ", [Validators.required]],
      zona: ["", [Validators.required]],
      compartir: ["", []]
    });

    console.log("Area seleccionada: ", this.data.area);
    this.uid = localStorage.getItem('uid');
    //this.telefono = localStorage.getItem('telefono');

    //console.log('telefonodel user', this.telefono);
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }

  ionViewDidLoad() {
    //console.log('Este es el id del usuario',this.uid);
    if (this.evento != null) {
      this.getDetails();
      this.disabledFecha = true;
    }
    if (this.idReservacion != null) {
      this.loadReservacion(this.idReservacion);
    }
    this.getAreas(this.idSucursal);
    console.log("ionViewDidLoad EventoDetallePage");
    this.fechaActual = new Date().toJSON().split("T")[0];
    console.log("horaActual Actual: ");
    //cargar funcion de coontactos
    this.todosContactos();
    //this.ionViewWillEnter();
    this.getZonas();
    this.getImagen(this.idSucursal);
  }
  //funciones para ocultar las tabs
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  goBack(idReservacion) {
    if (this.idReservacion != null) {
      this.navCtrl.popToRoot().then(() => {
        this._providerReserva.deleteReservacion(idReservacion);
        localStorage.removeItem("idReservacion");
        localStorage.removeItem("idSucursal");
        localStorage.removeItem("uidEvento");
        localStorage.removeItem("reservacion");
      });
    } else {
      this.navCtrl.popToRoot();
    }
  }

  getDetails() {
    this._cap.getEvento(this.evento).then(e => {
      this.data = e;
      console.log("evento", this.data.plano);
    });
  }

  loadReservacion(idx) {
    this._providerReserva.getReservacion(idx).subscribe(reservacion => {
      if (reservacion != null) {
        this.people = reservacion.numPersonas;
        this.data.hora = reservacion.hora;
        this.data.area = reservacion.idArea;
        // this._getZonas(this.data.area);
        this.data.zona = reservacion.idZona;
      }
    });
  }

  increment() {
    if (this.people < 20) {
      this.people++;
    }
  }

  decrement() {
    if (this.people > 0) {
      this.people--;
    }
  }

  getAreas(idx) {
    this._providerReserva.getAreas(idx).subscribe(areas => {
      console.log("areas", areas);
      this.areas = areas;
    });
  }

  // getZonas() {
  //   const idx = this.idSucursal;
  //   const area = this.data.area;
  //   this._providerReserva.getZonas(idx, area).subscribe(zonas => {
  //     console.log("zona", zonas);
  //     this.zonas = zonas;
  //   });
  // }

  // _getZonas(_area) {
  //   const idx = this.idSucursal;
  //   this._providerReserva.getZonas(idx, _area).subscribe(zonas => {
  //     console.log("zona", zonas);
  //     this.zonas = zonas;
  //   });
  // }

  getZonas() {
    const idx = this.idSucursal;
    this._providerReserva.getZonas(idx).subscribe(zonas => {
      console.log("zona", zonas);
      this.zonas = zonas;
    });
  }

  alertConsumo() {
    const zona = this.data.zona;
    this._providerReserva.getZona(zona).subscribe(zona => {
      const formatter = new Intl.NumberFormat("en-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2
      });
      const x = formatter.format(zona.consumo); // "$1,000.00"
      console.log(x);
      let alertMesas = this.alertCtrl.create({
        message:
          "<div text-center> Esta zona cuenta con un consumo sugerido de " +
          "<br><br>" +
          "<b>" +
          formatter.format(zona.consumo) +
          "</b>" +
          "</div>",
        buttons: [
          {
            text: "Aceptar",
            handler: () => {
              console.log("Buy clicked");
            }
          }
        ]
      });
      alertMesas.present();
    });
  }

  getMesas() {
    const idx = this.idSucursal;
    const area = this.data.area;
    const zonas = this.data.zona;
    this._providerReserva.getMesas(idx, area, zonas).subscribe(mesas => {
      this.mesas = mesas;
      console.log("Mesas : ", this.mesas);
      const _mesas = mesas.length;
      console.log("Mesas : ", _mesas);
      const _personas = this.mesas.reduce(
        (acc, obj) => acc + obj.numPersonas,
        0
      );
      console.log("Personas : ", _personas);

      // this.alertMesas(_mesas, _personas);
    });
  }

  alertMesas(mesas, personas) {
    let alertMesas = this.alertCtrl.create({
      message:
        "<div text-center> Esta zona cuenta con " +
        "<b>" +
        mesas +
        "</b>" +
        " mesas y con " +
        "<b>" +
        personas +
        "</b>" +
        " lugares disponibles. </div>",
      buttons: [
        {
          text: "Atras",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Aceptar",
          handler: () => {
            console.log("Buy clicked");
          }
        }
      ]
    });
    alertMesas.present();
  }

  reservacionAdd() {
    //console.log('Telefonos',this.compartir);
    let info = {
      numPersonas: this.people,
      hora: this.data.hora,
      fecha: this.data.fecha,
      // area: this.data.area,
      zona: this.data.zona,
      idSucursal: this.idSucursal,
      idevento: this.evento
    };
    this._providerReserva.saveReservacion(info).then((respuesta: any) => {

      //Si se compartio la cuenta insertar telefonos en tabla compartidas
      if (this.compartir != undefined) {
        this.afs.collection('users', ref => ref.where('uid', '==', this.uid)).valueChanges().subscribe(data => {
          this.usertel = data;
          this.usertel.forEach(element => {
            console.log('usertel',element.phoneNumber);
            //insertar en tabla compartidas telefono del usuario en sesion
            this._providerReserva.saveCompartirPropio(element.phoneNumber, respuesta.idReservacion, this.uid).then((respuesta: any) => {
              console.log("Respuesta: ", respuesta);
            });
          });
        });

        //sacar numeros que se seleccionan en el formulario compartir cuenta
        this.compartir.forEach(data => {
          //estandarizar telefonos 10 digitos
          this.telefono1 = data.replace(/ /g, "");
          this.telefono2 = this.telefono1.replace(/-/g, "");
          this.telefono3 = this.telefono2.substr(-10);
          //insertar en tabla compartidas los numeros de con quien se esta compartiendo
             this._providerReserva.saveCompartirTodos(this.telefono3, respuesta.idReservacion, this.uid).then((respuesta2: any) => {
              console.log("Respuesta id compartir: ", respuesta2.idCompartir);
                this.afs.collection('compartidas', ref => ref.where('idCompartir', '==', respuesta2.idCompartir)).valueChanges().subscribe(data => {
                  this.resultCompartidas = data;
                //insertar el player id de cada telefono insertado
                this.resultCompartidas.forEach(element => {
                  console.log('este es el telefono',element.telefono);
                  this._providerReserva.buscarPlayerid(element.telefono).subscribe(players => {
                        this.players = players[0].playerID;
                       this.afs.collection("compartidas").doc(element.idCompartir).update({
                         "playerId": this.players
                         })
                          .then(function () {
                            console.log("se actualizo el playerid");
                          });
                  });
                  });
                });
            });
          //consulta para buscar el player id del ususario seleccionado y su tel
        });//termina foreach compartir
        console.log('reservacion nueva',respuesta.idReservacion);
        //cambiar reservacion a estatus compartido
        this._providerReserva
          .updateReservacionCompartida(respuesta.idReservacion)
          .then((respuesta: any) => {
            console.log("Respuesta: ", respuesta);
            if (respuesta.success == true) {
              console.log("Success: ", respuesta.success);
            }
          });
      }//termina funcion compartir cuenta insercion en tabla compartidas
      if (respuesta.success == true) {
        console.log("Success: ", respuesta.success);
        localStorage.setItem("idReservacion", respuesta.idReservacion);
        localStorage.setItem("idSucursal", this.idSucursal);
        localStorage.setItem("uidEvento", this.evento);
        localStorage.setItem("reservacion", "true");
        // localStorage.setItem("area", this.data.area);
        localStorage.setItem("zona", this.data.zona,);
        console.log("zona", this.data.zona, "area", this.data.area);
        //Mandar a la pagina de la carta de productos una vez inserado los datosa de la reservacion en la base
        this.navCtrl.push(CartaPage, {
          idReservacion: respuesta.idReservacion,
          idSucursal: this.idSucursal,
          uid: this.evento,
          // area: this.data.area,
          zona: this.data.zona
        });
      }
    });

  }



  reservacionUpdate(idReservacion) {
    console.log("Con consumo");
    let info = {
      numPersonas: this.people,
      hora: this.data.hora,
      fecha: this.data.fecha,
      // area: this.data.area,
      zona: this.zonasnav,
      idSucursal: this.idSucursal,
      idevento: this.evento
    };
    this._providerReserva
      .updateReservacion(idReservacion, info)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
          localStorage.setItem("idReservacion", idReservacion);
          this.navCtrl.push(CartaPage, {
            idReservacion: idReservacion,
            idSucursal: this.idSucursal,
            uid: this.evento
          });
        }
      });
  }

  areaSeleccionada() {
    console.log("Esta es el área: " + this.data.area);
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ReservacionesPage');
  // }
  ocultarClic() {
    this.ocultar = !this.ocultar;
    this.checkActiveButton();
  }

  checkActiveButton() {
    if (this.ocultar) {
      this.ocultar = true;
    } else if (!this.ocultar) {
      this.ocultar = false;
    }
  }
  //Cargar todos los contactos del telefono
  todosContactos() {
    //console.log("Cargo funcion varios contactos");
    this.contacts.find(["displayName", "phoneNumbers"], { multiple: true }).then((contacts) => {
      this.contactlist = contacts;
      console.log("Cargo funcion varios contactos", this.contactlist);
      const telefono3_ = [];
      //consultar tabla users de la base de datos y sacar numeros de telefono registrados
      //this.monRes.getAllClientes("users").then(c => {
        //this.clientes = c;
        //console.log("Entonson clienes antes de comparar", this.clientes);
        //this.clientes.forEach(datac => {
          //console.log("tel 10 dijitos base antes de comparar",datac.displayName);
          //console.log("tel 10 dijitos base antes de comparar",datac.phoneNumber);
          //consulta para sacar contactos del telefono
          this.contactlist.forEach(data => {
            console.log("resultado number telefono", data.phoneNumbers);
            //estandarizar telefono a 10 digitos
            //validar que si algun telefono es nulo no pase por la comparacion
            if (data.phoneNumbers != null) {
              this.telefono1 = data.phoneNumbers[0].value.replace(/ /g, "");
              this.telefono2 = this.telefono1.replace(/-/g, "");
              this.telefono3 = this.telefono2.substr(-10);
              console.log("tel 10 dijitos contactos", this.telefono3);
              //console.log("tel 10 dijitos base", datac.phoneNumber);
              //comparar si el nuero en la base de datos es igual a un contacto
              //if (this.telefono3 == datac.phoneNumber) {
                telefono3_.push({ tel: this.telefono3, nombre: data.displayName });
            //  }
            }
          });//cierra funcion sacar contactos
        //});
      //});
      this.telefono4 = telefono3_;
      console.log('telefonos10dijitoscomparacion', telefono3_);
      //console.log("contacts list:-->"+ JSON.stringify(contacts));
      //console.log('lista contactos',contacts);
    });
  }

  getImagen(idx){
    console.log("idUsuarioHistorial: ",idx);

   this._providerReserva.getCroquisImg(idx).subscribe(res=>{
     console.log("Este es el resultado de imagen: ", res);
     this.img2 = res;
     console.log(this.img2);
   });
  }

}
