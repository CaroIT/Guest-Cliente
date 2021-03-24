import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrGeneradoPage } from './qr-generado';

@NgModule({
  declarations: [
    QrGeneradoPage,
  ],
  imports: [
    IonicPageModule.forChild(QrGeneradoPage),
  ],
})
export class QrGeneradoPageModule {}
