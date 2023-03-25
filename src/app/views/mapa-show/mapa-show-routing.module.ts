import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaShowComponent } from './mapa-show.component';

const routes: Routes = [{ path: '', component: MapaShowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaShowRoutingModule { }
