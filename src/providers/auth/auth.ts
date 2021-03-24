import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthProvider {


  public sucursalDoc: AngularFirestoreDocument<any>;
  public sucursal: Observable<any>;
  public adminDoc: AngularFirestoreDocument<any>;
  public admin: Observable<any>;
  public adminUsDoc: AngularFirestoreDocument<any>;
  public adminUs: Observable<any>;
  public suAdCollection: AngularFirestoreCollection<any>;
  public suAds: Observable<any[]>;

  constructor(public angFireAuth: AngularFireAuth,
              public afs: AngularFirestore) {

  }
  login(credentials) {
        var promise = new Promise((resolve, reject) => {
            this.angFireAuth.auth.signInWithEmailAndPassword(
                    credentials.email, credentials.password)
                .then(() => {
                    localStorage.setItem("isLogin", "true");
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                })
        })
        return promise;
    }

    logout() {
        localStorage.removeItem("isLogin")
    }
    getUserBd(uid) {
        this.sucursalDoc = this.afs.doc<any>(`sucursales/${uid}`);
          return this.sucursal = this.sucursalDoc.snapshotChanges().pipe(map(action => {
            if ( action.payload.exists === false) {
              return null;
            } else {
              const data = action.payload.data() as any;
              data.uid = action.payload.id;
              return data;
            }
          })
          );
    }
    getUserAdmins(uid) {
      this.adminDoc = this.afs.doc<any>(`users/${uid}`);
        return this.admin = this.adminDoc.snapshotChanges().pipe(map(action => {
          if ( action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as any;
            data.uid = action.payload.id;
            return data;
          }
        })
        );
  }
  getUserAdminsSucursal(uidSucursal) {
    this.adminUsDoc = this.afs.doc<any>(`sucursales/${uidSucursal}`);
        return this.adminUs = this.adminUsDoc.snapshotChanges().pipe(map(action => {
          if ( action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as any;
            data.uid = action.payload.id;
            return data;
          }
        })
        );
}

}
