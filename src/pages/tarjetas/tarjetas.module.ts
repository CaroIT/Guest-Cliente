import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TarjetasPage } from './tarjetas';

@NgModule({
  declarations: [
    TarjetasPage,
  ],
  imports: [
    IonicPageModule.forChild(TarjetasPage),
  ],
})
export class TarjetasPageModule {}
