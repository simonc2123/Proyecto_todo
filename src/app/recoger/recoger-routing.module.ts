import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecogerPage } from './recoger.page';

const routes: Routes = [
  {
    path: '',
    component: RecogerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecogerPageRoutingModule {}
