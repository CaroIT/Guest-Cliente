import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTarjetasAddPage } from './modal-tarjetas-add';

@NgModule({
  declarations: [
    ModalTarjetasAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTarjetasAddPage),
  ],
})
export class ModalTarjetasAddPageModule {}
