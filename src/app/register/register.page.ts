import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre: string = '';
  identificacion: string = '';
  celular: string = '';
  correo: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    this.authService
      .register(
        this.nombre,
        this.identificacion,
        this.celular,
        this.correo,
        this.password
      )
      .then((response) => {
        console.log('Usuario registrado:', response);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al registrarse:', error);
      });
  }
}
