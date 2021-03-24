import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { CargaCroquisProvider } from "../../providers/carga-croquis/carga-croquis";

@IonicPage()
@Component({
  selector: 'page-imagencroquis',
  templateUrl: 'imagencroquis.html',
})
export class ImagencroquisPage {

  imagenPreview : string ="";
  imagen64: string;
  idSucursal: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private imagePicker: ImagePicker,
              public cap: CargaCroquisProvider) {

                this.idSucursal = navParams.get('idSucursal');
  }

  seleccionaFoto(){
    let opciones:ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1
    }

    this.imagePicker.getPictures(opciones).then((results) => {
      for (var i = 0; i < results.length; i++) {
          //console.log('Image URI: ' + results[i]);
          this.imagenPreview = 'data:image/jpeg;base64,' + results[i];
          this.imagen64 = results[i];
      }
    }, (err) => {
      console.log( "Error en el selector", JSON.stringify(err));
    });
  }

  subirFoto(){

    let archivo = {
      plano: this.imagen64,
      key: this.idSucursal

    }

    this.cap.cargarImagen(archivo);
    // this.cerrarModal();

  }

}
