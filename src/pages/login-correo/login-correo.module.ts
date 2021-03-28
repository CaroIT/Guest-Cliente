import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginCorreoPage } from './login-correo';

@NgModule({
  declarations: [
    LoginCorreoPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginCorreoPage),
  ],
})
export class LoginCorreoPageModule {}
