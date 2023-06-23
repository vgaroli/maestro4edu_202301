import { InicialComponent } from './views/inicial/inicial.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'inicial', component: InicialComponent},
  { path: 'mapa-estudante-show', loadChildren: () => import('./views/mapa-show/mapa-show.module').then(m => m.MapaShowModule) },
  { path: 'mapa-estudante-show/:uuid', loadChildren: () => import('./views/mapa-show/mapa-show.module').then(m => m.MapaShowModule) },
  { path: 'chamada-admin', loadChildren: () => import('./views/chamada-admin/chamada-admin.module').then(m => m.ChamadaAdminModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
