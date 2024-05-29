import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-recoger',
  templateUrl: './recoger.page.html',
  styleUrls: ['./recoger.page.scss'],
})
export class RecogerPage implements OnInit {
  uid: string = '';
  listoEnabled: boolean = false;
  carril: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private firestore: AngularFirestore
  ) {}

  async ngOnInit() {
    const uidParam = localStorage.getItem('uid');
    if (uidParam !== null) {
      try {
        const docId = await this.crudService.getUserByUid(uidParam);
        this.uid = docId;
        console.log('UID:', this.uid);

        // Verificar el estado de recogida del usuario
        const userDoc = await this.firestore
          .collection('usuarios')
          .doc(this.uid)
          .get()
          .toPromise();
        if (userDoc && userDoc.exists) {
          const userData = userDoc.data() as
            | { estadoRecogida?: string }
            | undefined;
          if (userData?.estadoRecogida === 'llegue') {
            this.listoEnabled = true;
          } else if (userData?.estadoRecogida === 'listo') {
            this.listoEnabled = false;
          }
        }
      } catch (error) {
        console.error('Error al obtener el ID del documento:', error);
      }
    } else {
      console.error('UID is null');
    }
  }

  segmentChanged(segmentValue: string) {
    if (segmentValue === 'alumno') {
      this.router.navigate(['/alumno', { uid: this.uid }]);
    }
  }

  carrilSeleccionado(carril: number) {
    this.carril = carril;
    console.log('Carril seleccionado:', carril);
  }

  async llegue() {
    try {
      const uidParam = localStorage.getItem('uid');
      if (!uidParam) {
        console.error('UID is null');
        return;
      }

      console.log('parametro', uidParam);

      const documentId = await this.crudService.getUserByUid(uidParam);
      console.log('UID:', documentId);

      if (!documentId || !this.carril) {
        console.error('UID is null or carril is not selected');
        return;
      }

      const querySnapshot = await this.firestore
        .collection('alumnos', (ref) => ref.where('uid', '==', documentId))
        .get()
        .toPromise();

      if (!querySnapshot || querySnapshot.empty) {
        console.error('No se encontraron alumnos con el UID especificado');
        return;
      }

      querySnapshot.forEach(async (doc) => {
        try {
          await doc.ref.update({ estado: true, carril: this.carril });
          console.log(
            'Estado de llegue actualizado en la base de datos para el alumno',
            doc.id
          );

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
      const uidParam = localStorage.getItem('uid');
      if (!uidParam) {
        console.error('UID is null');
        return;
      }

      console.log('parametro', uidParam);

      const documentId = await this.crudService.getUserByUid(uidParam);
      this.uid = documentId;
      console.log('UID:', this.uid);

      if (!this.uid) {
        console.error('UID is null');
        return;
      }

      const querySnapshot = await this.firestore
        .collection('alumnos', (ref) => ref.where('uid', '==', this.uid))
        .get()
        .toPromise();

      if (!querySnapshot || querySnapshot.empty) {
        console.error('No se encontraron alumnos con el UID especificado');
        return;
      }

      for (const doc of querySnapshot.docs) {
        try {
          await doc.ref.update({ estado: false, carril: null });
          console.log(
            'Estado de listo actualizado en la base de datos para el alumno',
            doc.id
          );

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

  async logout() {
    try {
      const uidParam = localStorage.getItem('uid');
      if (!uidParam) {
        console.error('UID is null');
        return;
      }

      const userDoc = await this.firestore
        .collection('usuarios')
        .doc(uidParam)
        .get()
        .toPromise();
      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as
          | { estadoRecogida?: string }
          | undefined;
        if (userData?.estadoRecogida === 'llegue') {
          await this.firestore
            .collection('usuarios')
            .doc(uidParam)
            .update({ estadoRecogida: 'listo' });
        }
      }

      localStorage.removeItem('uid');
      console.log('UID después de eliminar:', localStorage.getItem('uid'));

      this.router.navigate(['/login', { logout: true }]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
