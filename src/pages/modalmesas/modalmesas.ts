import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { GestionReservacionesProvider } from "../../providers/gestion-reservaciones/gestion-reservaciones";

@IonicPage()
@Component({
  selector: "page-modalmesas",
  templateUrl: "modalmesas.html"
})
export class ModalmesasPage {
  idZona: any;
  idReserv: any;
  mesas: any[];
  items: any[] = [];
  ids: any[] = [];
  prueba: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private reservProv: GestionReservacionesProvider
  ) {
    this.idReserv = this.navParams.get("idReserv");
    console.log("Id Reserv: ", this.idReserv);

    this.idZona = this.navParams.get("idZona");
    console.log("Zona: ", this.idZona);
  }

  ionViewDidLoad() {
    this.getMesas();
  }

  getMesas() {
    this.reservProv.getMesas(this.idZona).subscribe(mesas => {
      this.mesas = mesas;
      let longitud = this.mesas.length;
      console.log("Esta es la longitud: ", longitud);

      console.log("mesas JAJA: ", this.mesas);
    });
  }

  // consultarMesas() {
  //   this.reservProv.consultarMesas().subscribe(mesas => {
  //     this.mesas = mesas;
  //     console.log("Todas las mesas: ", this.mesas);
  //   });
  // }

  selecMesa(idMesa) {
    let items = JSON.parse(localStorage.getItem("mesas"));

    if (items != null) {
      var res = items.indexOf(idMesa);

      if (res == -1) {
        let estatus = "ocupada";
        this.reservProv.actualizaEstatus(idMesa, estatus);
        console.log("No esta la mesa en el arreglo");
        let mesas =idMesa;
        this.items = JSON.parse(localStorage.getItem('mesas'));
        this.items.push(mesas);
        localStorage.setItem("mesas", JSON.stringify(this.items));

      } else {
       console.log("Esta en esta posicion del arreglo: ",res);
       this.items = JSON.parse(localStorage.getItem('mesas'));
        this.items.splice(res, 1);
        localStorage.setItem("mesas", JSON.stringify(this.items));
        let estatus = "libre";
        this.reservProv.actualizaEstatus(idMesa, estatus);

      }
    } else {
      console.log("Primera vez");
      let mesas = idMesa;
      this.items.push(mesas);
      localStorage.setItem("mesas", JSON.stringify(this.items));
      let estatus = "ocupada";
      this.reservProv.actualizaEstatus(idMesa, estatus);
    }
  }

  // consultarDatos() {
  //   setTimeout(() => {
  //     this.prueba = JSON.parse(localStorage.getItem("mesas"));
  //     console.log("Prueba: "+this.prueba);

  //   }, 100);
  // }

  Cancelar() {
    this.reservProv.Cancelar();
    this.cerrar();
  }

  Aceptar() {
    let mesas = JSON.parse(localStorage.getItem("mesas"));
    // console.log("Este es el id de la reservacion: ", mesas);
    this.reservProv.Aceptar(this.idReserv, mesas);
    this.cerrar();
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }
}
