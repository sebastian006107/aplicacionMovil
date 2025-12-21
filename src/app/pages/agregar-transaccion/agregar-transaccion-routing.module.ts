import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarTransaccionPage } from './agregar-transaccion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarTransaccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarTransaccionPageRoutingModule {}
