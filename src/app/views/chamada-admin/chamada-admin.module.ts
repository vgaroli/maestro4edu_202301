import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChamadaAdminRoutingModule } from './chamada-admin-routing.module';
import { ChamadaAdminComponent } from './chamada-admin.component';
import { ChamadaComponent } from '../../components/chamada/chamada.component';

import { MatSelectModule } from '@angular/material/select'
import { MatListModule } from '@angular/material/list'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    ChamadaAdminComponent,
    ChamadaComponent
  ],
  imports: [
    CommonModule,
    ChamadaAdminRoutingModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ]
})
export class ChamadaAdminModule { }
