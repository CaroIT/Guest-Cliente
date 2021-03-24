import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservacionesPage } from './reservaciones';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    ReservacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservacionesPage),
    AgmCoreModule
  ],
})
export class ReservacionesPageModule {}
