import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadaAdminComponent } from './chamada-admin.component';

const routes: Routes = [{ path: '', component: ChamadaAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadaAdminRoutingModule { }
