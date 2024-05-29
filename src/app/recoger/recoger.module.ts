import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecogerPageRoutingModule } from './recoger-routing.module';

import { RecogerPage } from './recoger.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecogerPageRoutingModule
  ],
  declarations: [RecogerPage]
})
export class RecogerPageModule {}
