import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgregarTarjetaPage } from './agregar-tarjeta';

@NgModule({
  declarations: [
    AgregarTarjetaPage,
  ],
  imports: [
    IonicPageModule.forChild(AgregarTarjetaPage),
  ],
})
export class AgregarTarjetaPageModule {}
