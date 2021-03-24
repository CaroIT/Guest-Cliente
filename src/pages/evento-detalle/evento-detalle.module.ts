import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventoDetallePage } from './evento-detalle';

@NgModule({
  declarations: [
    EventoDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(EventoDetallePage),
  ],
})
export class EventoDetallePageModule {}
