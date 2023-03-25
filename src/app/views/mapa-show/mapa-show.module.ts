import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaShowRoutingModule } from './mapa-show-routing.module';
import { MapaShowComponent } from './mapa-show.component';
import { MapItemListComponent } from '../../components/map-item-list/map-item-list.component';


@NgModule({
  declarations: [
    MapaShowComponent,
    MapItemListComponent,
  ],
  imports: [
    CommonModule,
    MapaShowRoutingModule,
  ]
})
export class MapaShowModule { }
