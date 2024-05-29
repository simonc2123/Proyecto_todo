import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  identificacion: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Verificar si se ha pasado el parámetro 'logout' en la URL
    this.route.queryParams.subscribe((params) => {
      if (params['logout'] === 'true') {
        // Eliminar el UID del almacenamiento local
        localStorage.removeItem('uid');
        console.log(localStorage.getItem('uid'));
      }
    });
  }

  login() {
    this.authService
      .login(this.identificacion, this.password)
      .then((response) => {
        console.log('Usuario logueado:', response);
        localStorage.setItem('uid', response.uid); // Guardar el UID en localStorage
        localStorage.setItem('estadoRecogida', response.estado); // Guardar el estado de recogida
        console.log(
          'UID almacenado en localStorage:',
          localStorage.getItem('uid')
        ); // Verificar el UID almacenado
        this.router.navigate(['/recoger']);
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
      });
  }
}
