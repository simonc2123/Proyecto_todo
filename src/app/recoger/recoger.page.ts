import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-recoger',
  templateUrl: './recoger.page.html',
  styleUrls: ['./recoger.page.scss'],
})
export class RecogerPage /*implements OnInit*/ {
  uid: string = '';
  listoEnabled: boolean = false;
  carril: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private firestore: AngularFirestore
  ) {}

  // ngOnInit() {
  //   // Obtener el UID del localStorage
  //   const uidParam = localStorage.getItem('uid');
  //   if (uidParam !== null) {
  //     this.crudService
  //       .getUserByUid(uidParam)
  //       .then((docId) => {
  //         // Si se obtiene el ID del documento, establecerlo como UID
  //         this.uid = docId;
  //         console.log('UID:', this.uid);
  //       })
  //       .catch((error) => {
  //         console.error('Error al obtener el ID del documento:', error);
  //       });
  //   } else {
  //     console.error('UID is null');
  //   }
  // }

  segmentChanged(segmentValue: string) {
    if (segmentValue === 'alumno') {
      // Navegar a la página de alumno y pasar el UID como parámetro de ruta
      this.router.navigate(['/alumno', { uid: this.uid }]);
    }
  }

  carrilSeleccionado(carril: number) {
    this.carril = carril;
    console.log('Carril seleccionado:', carril);
  }

  async llegue() {
    try {
      let uidParam = localStorage.getItem('uid');
      if (!uidParam) {
        console.error('UID is null');
        return;
      }

      console.log('parametro', uidParam);

      // Obtener el ID del documento
      let documentId = await this.crudService.getUserByUid(uidParam);
      console.log('UID:', documentId);

      // Si no hay carril seleccionado o el documentId es inválido, salimos
      if (!documentId || !this.carril) {
        console.error('UID is null or carril is not selected');
        return;
      }

      // Obtener todos los documentos de alumnos con el mismo UID
      let querySnapshot = await this.firestore
        .collection('alumnos', (ref) => ref.where('uid', '==', documentId))
        .get()
        .toPromise();

      if (!querySnapshot || querySnapshot.empty) {
        console.error('No se encontraron alumnos con el UID especificado');
        return;
      }

      // Actualizar estado y carril de cada documento
      querySnapshot.forEach(async (doc) => {
        try {
          await doc.ref.update({ estado: true, carril: this.carril });
          console.log(
            'Estado de llegue actualizado en la base de datos para el alumno',
            doc.id
          );

          // Actualizar el estado de recogida en el usuario
          await this.firestore
            .collection('usuarios')
            .doc(this.uid)
            .update({ estadoRecogida: 'llegue' });
        } catch (error) {
          console.error(
            'Error al actualizar estado de llegue para el alumno',
            doc.id,
            ':',
            error
          );
        }
      });

      this.listoEnabled = true;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async listo() {
    try {
      let uidParam = localStorage.getItem('uid');
      if (!uidParam) {
        console.error('UID is null');
        return;
      }

      console.log('parametro', uidParam);

      // Obtener el ID del documento
      let documentId = await this.crudService.getUserByUid(uidParam);
      this.uid = documentId;
      console.log('UID:', this.uid);

      if (!this.uid) {
        console.error('UID is null');
        return;
      }

      // Obtener todos los documentos de alumnos con el mismo UID
      let querySnapshot = await this.firestore
        .collection('alumnos', (ref) => ref.where('uid', '==', this.uid))
        .get()
        .toPromise();

      if (!querySnapshot || querySnapshot.empty) {
        console.error('No se encontraron alumnos con el UID especificado');
        return;
      }

      // Actualizar estado y carril de cada documento
      for (const doc of querySnapshot.docs) {
        try {
          await doc.ref.update({ estado: false, carril: null });
          console.log(
            'Estado de listo actualizado en la base de datos para el alumno',
            doc.id
          );

          // Actualizar el estado de recogida en el usuario
          await this.firestore
            .collection('usuarios')
            .doc(this.uid)
            .update({ estadoRecogida: 'listo' });
        } catch (error) {
          console.error(
            'Error al actualizar estado de listo para el alumno',
            doc.id,
            ':',
            error
          );
        }
      }

      this.listoEnabled = false;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  logout() {
    // Eliminar el UID del almacenamiento local
    localStorage.removeItem('uid');

    // Verificar si el UID se ha eliminado correctamente
    console.log('UID después de eliminar:', localStorage.getItem('uid'));

    // Redirigir al usuario a la página de login
    this.router.navigate(['/login', { logout: true }]);
  }
}
