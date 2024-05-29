import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  login(identificacion: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('usuarios', (ref) =>
          ref.where('identificacion', '==', identificacion)
        )
        .get()
        .toPromise()
        .then((querySnapshot) => {
          if (querySnapshot && !querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData: any = userDoc.data();
            if (userData.password === password) {
              resolve({ uid: userDoc.id, ...userData });
            } else {
              reject('Contraseña incorrecta');
            }
          } else {
            reject('Usuario no encontrado');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  register(
    nombre: string,
    identificacion: string,
    celular: string,
    correo: string,
    password: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const user = { nombre, identificacion, celular, correo, password };
      this.firestore
        .collection('usuarios')
        .add(user)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.firestore
            .collection('usuarios')
            .doc(user.uid)
            .ref.get()
            .then((doc) => {
              if (doc.exists) {
                const userData = doc.data();
                if (userData) {
                  resolve({ uid: user.uid, ...userData });
                } else {
                  reject('No user data found');
                }
              } else {
                reject('No user data found');
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject('No user logged in');
        }
      });
    });
  }
}
