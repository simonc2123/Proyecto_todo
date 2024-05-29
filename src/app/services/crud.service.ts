import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: AngularFirestore) {}

  getUserByUid(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('usuarios')
        .doc(uid)
        .get()
        .toPromise()
        .then((doc) => {
          if (doc && doc.exists) {
            // Si el documento existe, devolver sus datos
            resolve(doc.id);
          } else {
            // Si el documento no existe o es undefined, rechazar la promesa con un mensaje de error
            reject('No se encontró ningún usuario con el UID especificado');
          }
        })
        .catch((error) => {
          // Si ocurre un error al consultar la base de datos, rechazar la promesa con el error
          reject(error);
        });
    });
  }
}
