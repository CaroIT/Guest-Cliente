import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerarqrPage } from './generarqr';
import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  declarations: [
    GenerarqrPage,
  ],
  imports: [
    IonicPageModule.forChild(GenerarqrPage),
    QRCodeModule,
  ],
})
export class GenerarqrPageModule {}
