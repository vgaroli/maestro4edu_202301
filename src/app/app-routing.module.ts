import { InicialComponent } from './views/inicial/inicial.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'inicial', component: InicialComponent},
  { path: 'mapa-estudante-show', loadChildren: () => import('./views/mapa-show/mapa-show.module').then(m => m.MapaShowModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
