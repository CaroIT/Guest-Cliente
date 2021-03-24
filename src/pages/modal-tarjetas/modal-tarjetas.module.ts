import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTarjetasPage } from './modal-tarjetas';

@NgModule({
  declarations: [
    ModalTarjetasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTarjetasPage),
  ],
})
export class ModalTarjetasPageModule {}
