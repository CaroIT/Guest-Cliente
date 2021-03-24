import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservacionDetallePage } from './reservacion-detalle';

@NgModule({
  declarations: [
    ReservacionDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservacionDetallePage),
  ],
})
export class ReservacionDetallePageModule {}
