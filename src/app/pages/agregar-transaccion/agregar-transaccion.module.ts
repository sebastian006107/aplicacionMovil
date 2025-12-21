import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarTransaccionPageRoutingModule } from './agregar-transaccion-routing.module';

import { AgregarTransaccionPage } from './agregar-transaccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarTransaccionPageRoutingModule
  ],
  declarations: [AgregarTransaccionPage]
})
export class AgregarTransaccionPageModule {}
