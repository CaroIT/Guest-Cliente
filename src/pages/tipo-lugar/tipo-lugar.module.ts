import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TipoLugarPage } from './tipo-lugar';

@NgModule({
  declarations: [
    TipoLugarPage,
  ],
  imports: [
    IonicPageModule.forChild(TipoLugarPage),
  ],
})
export class TipoLugarPageModule {}
