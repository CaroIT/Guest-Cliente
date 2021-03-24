import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisReservacionesPage } from './mis-reservaciones';

@NgModule({
  declarations: [
    MisReservacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisReservacionesPage),
  ],
})
export class MisReservacionesPageModule {}
