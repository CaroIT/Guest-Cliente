import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorialDetallePage } from './historial-detalle';

@NgModule({
  declarations: [
    HistorialDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(HistorialDetallePage),
  ],
})
export class HistorialDetallePageModule {}
