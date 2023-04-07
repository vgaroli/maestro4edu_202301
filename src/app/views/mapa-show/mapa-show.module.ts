import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaShowRoutingModule } from './mapa-show-routing.module';
import { MapaShowComponent } from './mapa-show.component';
import { MapItemListComponent } from '../../components/map-item-list/map-item-list.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import { MapaListComponent } from '../../components/mapa-list/mapa-list.component';
import { MapaItemComponent } from '../../components/mapa-item/mapa-item.component';

@NgModule({
  declarations: [
    MapaShowComponent,
    MapItemListComponent,
    MapaListComponent,
    MapaItemComponent,
  ],
  imports: [
    CommonModule,
    MapaShowRoutingModule,
    MatToolbarModule,
  ]
})
export class MapaShowModule { }
