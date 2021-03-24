import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
//Paginas que conforman el tabs
 import { HomePage } from '../home/home';
import { EventosPage } from '../eventos/eventos';
import { Reservacion_1Page } from '../reservacion-1/reservacion-1';
//import { Observable } from 'rxjs/Observable';
//import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // users: Observable<any[]>;

   tab1 = HomePage;
  tab2 = EventosPage;
  tab3 = Reservacion_1Page;

  constructor(
    //public DB: AngularFireDatabase
  ) {
    // this.users = this.DB.list('users').valueChanges();
    // console.log(this.users);
    
  }
  ionViewDidLoad() {
     //console.log(this.users);
  }


}
