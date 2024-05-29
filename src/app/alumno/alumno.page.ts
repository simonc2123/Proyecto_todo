import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  alumno = {
    nombre: '',
    seccion: 'Pre-escolar',
  };
  alumnos: any[] = [];
  uid: string | undefined;

  constructor(
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    // Obtener el UID del localStorage
    const uidParam = localStorage.getItem('uid');
    if (uidParam !== null) {
      this.uid = uidParam;
      // Cargar alumnos después de obtener el UID
      this.cargarAlumnos();
    } else {
      console.error('UID is null');
    }
  }

  segmentChanged(segmentValue: string) {
    if (segmentValue === 'recoger') {
      this.router.navigate(['/recoger']);
    }
  }

  guardarAlumno() {
    console.log(this.uid);
    if (this.uid) {
      const nuevoAlumno = { ...this.alumno, uid: this.uid };
      this.firestore
        .collection('alumnos')
        .add(nuevoAlumno)
        .then(() => {
          this.cargarAlumnos();
          this.alumno = { nombre: '', seccion: 'Pre-escolar' };
        })
        .catch((error) => {
          console.error('Error adding student:', error);
        });
    } else {
      console.error('UID is undefined');
    }
  }

  cargarAlumnos() {
    if (this.uid) {
      this.firestore
        .collection('alumnos', (ref) => ref.where('uid', '==', this.uid))
        .snapshotChanges()
        .subscribe((data) => {
          this.alumnos = data.map((e) => {
            const data = e.payload.doc.data() as any;
            return {
              id: e.payload.doc.id,
              ...data,
            };
          });
        });
    } else {
      console.error('UID is undefined');
    }
  }

  eliminarAlumno(id: string) {
    this.firestore
      .collection('alumnos')
      .doc(id)
      .delete()
      .then(() => {
        this.cargarAlumnos();
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
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
