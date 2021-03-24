import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResumenPage } from './resumen';

@NgModule({
  declarations: [
    ResumenPage,
  ],
  imports: [
    IonicPageModule.forChild(ResumenPage),
  ],
})
export class ResumenPageModule {}
