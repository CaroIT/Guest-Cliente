import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartaEditarPage } from './carta-editar';

@NgModule({
  declarations: [
    CartaEditarPage,
  ],
  imports: [
    IonicPageModule.forChild(CartaEditarPage),
  ],
})
export class CartaEditarPageModule {}
