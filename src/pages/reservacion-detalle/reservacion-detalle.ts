import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MisReservacionesPage } from "../../pages/mis-reservaciones/mis-reservaciones";
import { GenerarqrPage } from "../../pages/generarqr/generarqr";
import { Generarqr_2Page } from "../../pages/generarqr-2/generarqr-2";
import { QrGeneradoPage } from "../../pages/qr-generado/qr-generado";
//importa provider donde se hacen las consultas
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from 'ionic-angular';
import { TarjetasPage } from "../../pages/tarjetas/tarjetas";
import { ModalController } from 'ionic-angular';
//import { Platform } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-reservacion-detalle',
  templateUrl: 'reservacion-detalle.html',
})
export class ReservacionDetallePage {
    listaProductos: any;
    idReservacion: any;
    mostrar: any;
    total: any;
    total2: any;
    total3: any;
    productos: any;
    infoReservaciones: any;
    infoReservaciones2: any;
    infoReservaciones3: any;
    nombresAreas: any;
    nombresZonas: any;
    listado: any;
    aleatorio : any;
    seleccion : any;
    idResrvacion: any;
    idUsuario: any;
    cuentasCompartidas: any;
    infoUsers: any;
    allContacts: any;
    compartidasAceptadas: any;
    tamano: any;
    resultadoCompartir: any;
    idUser: any;
    infoEspera: any;
    resultadoEspera: any;
    infoEsperaEstatus: any;
    resultadoEsperaEstatus: any;
    infoResEstatus: any;
    infoCupones: any;
    validarCupon: any;
    validarPropina: any;
    cuponExiste: any;
    cuponesDatos: any;
    propinaRe: any;
    propinaRe2: any;
    totalPropinaCupon: any;
    totalPropina: any;
    reservacionLugar: any;
    reservacionLugar2: any;
    nombreLugar: any;
    escaneo: any;
    modal: any;
    reservacionC: any;
    formatoFecha: any;
    reservacionFecha: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reservaProvider: ReservacionProvider,
              public afDB: AngularFireDatabase,
              public alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public afs: AngularFirestore
              ) {

                //this.afs.collection('compartidas', ref => ref.where('idCompartir', '==', 'M4rUKeGx7WPOHXMxOTzy')).valueChanges().subscribe(data2 => {
                //  this.reservacionLugar2 = data2;
                //    this.reservacionLugar2.forEach(element2 => {
                //    const estatus_pago=element2.estatus_pago;
                //    console.log("esta pago",estatus_pago);
                //    });
                //});
    //recibe parametro de la reservacion
    this.idReservacion = this.navParams.get("idReservacion");
    this.modal = this.navParams.get("modal");
    console.log('este es el modal', this.modal);
    //sacar el id del usuario guardado en el local storage
    this.idUser = localStorage.getItem('uid');

    //consultar tabla areas
    this.afs
      .collection("areas")
      .valueChanges()
      .subscribe(data => {
        this.nombresAreas = data;
      });

      //consultar tabla zonas
      this.afs
        .collection("zonas")
        .valueChanges()
        .subscribe(data1 => {
          this.nombresZonas = data1;
        });
        //consultar tabla users
        this.afs
          .collection("users")
          .valueChanges()
          .subscribe(data2 => {
            this.infoUsers = data2;
          });
        //consultar tabla compartidas
        this.afs
          .collection("compartidas")
          .valueChanges()
          .subscribe(data3 => {
            this.cuentasCompartidas = data3;
          });
          //consultar tabla cupones
          //consultar tabla compartidas
          this.afs
            .collection("cupones")
            .valueChanges()
            .subscribe(data4 => {
              this.infoCupones = data4;
              console.log("cupones", this.infoCupones);
            });
            //obtener el nombre del lugar
            this.afs.collection('reservaciones', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data => {
              this.reservacionLugar = data;
              this.reservacionLugar.forEach(element => {
               const idSucursal=element.idSucursal;
              //console.log("esta es la sucursal", data[0].idSucursal);
                this.afs.collection('sucursales', ref => ref.where('uid', '==', idSucursal)).valueChanges().subscribe(data2 => {
                  this.reservacionLugar2 = data2;
                    this.reservacionLugar2.forEach(element2 => {
                    this.nombreLugar=element2.displayName;
                    //console.log("esta es la sucursal",this.nombreLugar);
                    });
                });
              });

            });
  }



  ionViewDidLoad() {
    //carga funcion cuando abre la pagina
    this.getDetails();
    console.log("ionViewDidLoad EventoDetallePage");
    this.mostrar = true;
    this.personaAcepta();
    this.compartidaEstatusFinal();
    this.verificarEscaneo();
    this.estatusPagando();
    }

    compartidaEstatusFinal(){
      //consultar ya ninguna persona esta en espera se cambia el estatus de la reservacion
      this.reservaProvider.consultarEstatusRe(this.idReservacion).subscribe(resEs => {
        this.infoResEstatus = resEs;
        console.log('Info espera resultado estatus',this.infoResEstatus[0].estatus);
        if(this.infoResEstatus[0].estatus=='Compartida'){
        this.reservaProvider.consultarEspera(this.idReservacion).subscribe(infoEs => {
        this.infoEsperaEstatus = infoEs;
        console.log('Info espera resultado',this.infoEsperaEstatus);
        if(this.infoEsperaEstatus.length==0){
           this.resultadoEsperaEstatus='true';
           console.log('Ejecutar estatus final');
           this.reservaProvider.updateCreadaCompartida(this.idReservacion).then((respuestaCom: any) => {
            console.log("respuestaCom: ", respuestaCom);
           });
        }else{
          this.resultadoEsperaEstatus='false';
          console.log('NO Ejecutar estatus final');
        }
      });
      }
      });
    }

  getDetails() {
    // funcion para sacar lista de productos de una reservacion
    this.reservaProvider.getReservacionesProducto(this.idReservacion).subscribe(r => {
      this.listaProductos = r;
    });
    // total de general dependiendo los productos que tenga la reservacion
    this.reservaProvider.getProductos(this.idReservacion).subscribe(productos => {
      this.productos = productos;
      this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
      //const calculoPropina2 = this.productos.reduce((acc, obj) => acc + obj.total, 0);
      this.reservaProvider.getInfo(this.idReservacion).subscribe(info => {
        this.infoReservaciones = info;
        if(info[0].propina!=undefined){
             this.propinaRe=this.total*info[0].propina;
             this.totalPropina = this.total+this.propinaRe;
             console.log('propina',this.totalPropina);
             this.validarPropina='Existe';
         }
      });
    });
    //informacion de la reservacion seleccionada
    this.reservaProvider.getInfo(this.idReservacion).subscribe(info => {
      this.infoReservaciones = info;
      this.idUser = localStorage.getItem('uid');
      if(info[0].uidCupon==undefined){
         this.validarCupon='Noexiste';
       }else{
          this.validarCupon='Existe';
           this.propinaRe2=info[0].totalReservacion*info[0].propina;;
          const propinaCalculo=info[0].totalReservacion*info[0].propina;
          this.totalPropinaCupon=info[0].totalReservacion+propinaCalculo;
          console.log('descuenton',info[0].totalReservacion);
          console.log('propina',info[0].propina);
          console.log('propina y cupon',this.totalPropinaCupon);
        }
    });
    //consultar si exiente usuarios es espera de aceptar compartir la reservacion
    this.reservaProvider.consultarEspera(this.idReservacion).subscribe(infoE => {
      this.infoEspera = infoE;
      console.log('Info espera',this.infoEspera.length);
      if(this.infoEspera.length==0){
         this.resultadoEspera='true';
      }
      else{
        this.resultadoEspera='false';
      }
    });
  }


  personaAcepta() {
    //Consulta para revisar las personas que han aceptado compartir la reservacion
    this.reservaProvider.getCompartidaAceptada(this.idReservacion).subscribe(comAceptada => {
      const totalDividido =[];
      this.compartidasAceptadas = comAceptada;
      this.tamano = this.compartidasAceptadas.length;
          // total de la reservacion y dividirlo entre la persoas que han aceptado compartir
          this.reservaProvider.getProductos(this.idReservacion).subscribe(productos => {
            this.productos = productos;
            //informacion de la reservacion seleccionada saber si se uso cupon
            this.reservaProvider.getInfo(this.idReservacion).subscribe(info2 => {
              this.infoReservaciones2 = info2;
              //si el cupon no existe en la reservacion se hace la division normal
              if(info2[0].uidCupon==undefined){
                this.total2 = this.productos.reduce((acc, obj) => acc + obj.total, 0);
                const propiCal=this.total2*info2[0].propina;
                const totalPropin= this.total2+propiCal;
                this.resultadoCompartir=totalPropin/this.tamano;
                  totalDividido.push(this.resultadoCompartir);
                  //asignar a cada persona que acepto compartir lo que le toca de la cuenta
                  this.compartidasAceptadas.forEach(datacom => {
                  this.reservaProvider.compartirDividido(datacom.idCompartir,this.resultadoCompartir).then((respuesta: any) => {
                   console.log("Respuesta: ", respuesta);
                   });
                });
               }else{
                 //si el cupon existe en la reservacion se resta el descuento y se hace la division
                 this.cuponExiste=info2[0].uidCupon;//sacar el uid del cupon
                 //obtener el valor del cupon de acuerdo al uid
                 this.afs.collection('cupones', ref => ref.where('uid', '==', this.cuponExiste)).valueChanges().subscribe(dataCu => {
                   this.cuponesDatos = dataCu;
                   console.log("este es el cupon usado",this.cuponesDatos[0].valorCupon);
                   this.total2 = this.productos.reduce((acc, obj) => acc + obj.total, 0);
                   this.total3= this.total2-this.cuponesDatos[0].valorCupon;
                   const propiCal2=this.total3*info2[0].propina;
                   const totalPropin2= this.total3+propiCal2;
                   this.resultadoCompartir=totalPropin2/this.tamano;
                     totalDividido.push(this.resultadoCompartir);
                     //asignar a cada persona que acepto compartir lo que le toca de la cuenta
                     this.compartidasAceptadas.forEach(datacom => {
                       this.reservaProvider.compartirDividido(datacom.idCompartir,this.resultadoCompartir).then((respuesta: any) => {
                      console.log("Respuesta: ", respuesta);
                      });
                   });
                 });//termina info valor del cupon
               }//termina else
            });//termina info de reservacion seleccionada saber si se uso cupon
          });//termina total de productos
    });//termina saber personas que han aceptado compartir
  }//termina funcion principal

  //mandar datos a la pagina del QR
  genararQR(idReservacion,totalDividido,idUsuario,telefono,idCompartir){
    this.navCtrl.setRoot(GenerarqrPage, {
      idReservacion: idReservacion,
      totalDividido: totalDividido,
      idUsuario: idUsuario,
      telefono: telefono,
      idCompartir: idCompartir
    });
  }

  genararQR_revisarTarjeta(idReservacion){
    let modal = this.modalCtrl.create("ModalTarjetasPage",{
       idReservacion: idReservacion,
     });
     modal.present();
  }

  genararQR_Pagado(idReservacion,idCompartir){
    this.navCtrl.setRoot(QrGeneradoPage, {
      idReservacion: idReservacion,
      idCompartir: idCompartir
    });
  }

  //mandar datos a la pagina del QR
  genararQRNormal(idReservacion,total,idUsuario){
    this.navCtrl.setRoot(Generarqr_2Page, {
      idReservacion: idReservacion,
      total: total,
      idUsuario: idUsuario
    });
  }
  genararQRNormal_revisarTarjeta(idReservacion){
    let modal = this.modalCtrl.create("ModalTarjetasPage",{
       idReservacion: idReservacion,
     });
     modal.present();
  }

  goBack() {
    this.navCtrl.setRoot(MisReservacionesPage);
  }

  verificarEscaneo(){

    //obtener el nombre del lugar
    this.afs.collection('compartidas', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data10 => {
      this.reservacionC = data10;
      console.log("existe compartidas",this.reservacionC.length);
      if(this.reservacionC.length != 0){
        // funcion para obtener qr escaneados
        this.reservaProvider.getEscaneos(this.idReservacion).subscribe(rEs => {
          this.escaneo = rEs;
          console.log("resultado escaneo",this.escaneo.length);
          if(this.escaneo.length == 0){
            console.log('Cambia estatus principal');
            //CUNADO TODAS LAS PERSONAS QUE YA ESCANEARON SU QR SE  CAMBIA LA RESERVACION AL ESTATUS FINAL
            this.afs.collection('reservaciones').doc(this.idReservacion).update({
              estatus: 'Pagando'
             });
            }
        });
      }
    });

  }

 //CAMBIAR A ESTATUS PAGANDO, SI ALGUNO NO LLEGO A LA RESERVACION, VALIDAR CON EL DIA, SI PASA DEL DIA SE CAMBIA A PAGANDO
  estatusPagando(){
    // OBTENER EL DIA ACTUAL (año-mes-dia->2019-11-30)
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
    //SABER SI LA RESERVACION EXISTE EN COMPARTIDAS O NO
    this.afs.collection('compartidas', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data11 => {
      this.reservacionC = data11;
      console.log("existe compartidas",this.reservacionC.length);
      //COMO EL RESULTADO ES DIFERENTE DE 0 QUIEDE DECIR QUE SI HAY RESERVACION EN COMPARTIDAS
      if(this.reservacionC.length != 0){
        this.afs.collection('reservaciones', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data12 => {
          this.reservacionFecha = data12;
          //const fechaReservacion=data12[0].fechaR;
          this.reservacionFecha.forEach(element2 => {
           const fechaReservacion=element2.fechaR;
           console.log("fecha reservacion",fechaReservacion);
           if(this.formatoFecha > fechaReservacion){
             //SI YA PASO LA FECHA DE LA RESERVACION SE CAMBIA EL ESTATUS PINCIPAL A PAGANDO POR SI ALGUIN NO LLEGO A ESCANEAR QR
             this.afs.collection('reservaciones').doc(this.idReservacion).update({
               estatus: 'Pagando'
              });
                console.log("se cambio a pagando");
           }
          });
        });
      }
    });
  }


}
