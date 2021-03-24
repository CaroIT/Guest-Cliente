import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TelefonoUserPage } from './telefono-user';

@NgModule({
  declarations: [
    TelefonoUserPage,
  ],
  imports: [
    IonicPageModule.forChild(TelefonoUserPage),
  ],
})
export class TelefonoUserPageModule {}
