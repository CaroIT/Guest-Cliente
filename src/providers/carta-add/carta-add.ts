import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { CartaItem } from './CartaItem';
//import { ToastController } from 'ionic-angular';
//import { Observable } from 'rxjs/Observable';




@Injectable()
export class CartaAddProvider {

  private cartaList = this.DB.list<CartaItem>('bebidas');
  //cartaList:  AngularFireList<any>;
  //public cartaList: Observable<CartaItem>

  imagenes: CartaItem[] = [];

  selectedProduct: CartaItem = new CartaItem();


  constructor(
                private DB: AngularFireDatabase,
                //public toastCtrl: ToastController
             ) {}

 getCarta()
 {
   //return this.cartaList = this.DB.list('bebidas');
 }


  // addCarta(cartaItem: CartaItem ){
  //   return this.cartaList.push(cartaItem);
  // }
  

   public getEvento(id){
      return this.DB.object('carta/'+id);      
        
   }

  updateCarta(data)
  {
    console.log(data);    
    // this.cartaList.update(cartaItem.$key,{
    //   name: cartaItem.name,
    //   categoria: cartaItem.categoria,
    //   precio: cartaItem.precio
    // });
    return this.cartaList.update(data.$key, data);
  }

  

}

