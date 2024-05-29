 import { NgModule } from '@angular/core';
 import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   {
     path: 'login',
     loadChildren: () =>
       import('./login/login.module').then((m) => m.LoginPageModule),
   },
   {
     path: 'register',
     loadChildren: () =>
       import('./register/register.module').then((m) => m.RegisterPageModule),
   },
  {
    path: 'recoger',
    loadChildren: () => import('./recoger/recoger.module').then( m => m.RecogerPageModule)
  },
  {
    path: 'alumno',
    loadChildren: () => import('./alumno/alumno.module').then( m => m.AlumnoPageModule)
  },
 ];

 @NgModule({
   imports: [
     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
   ],
   exports: [RouterModule],
 })
 export class AppRoutingModule {}
