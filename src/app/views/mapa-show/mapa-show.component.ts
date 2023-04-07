import { Component, OnInit } from '@angular/core';
import { PrincipalService } from 'src/app/services/principal.service';
import { SalasService } from 'src/app/services/salas.service';
import { AlunoSala, SalaGrade } from 'src/app/models/escola.model';

@Component({
  selector: 'app-mapa-show',
  templateUrl: './mapa-show.component.html',
  styleUrls: ['./mapa-show.component.scss']
})
export class MapaShowComponent implements OnInit {
  isCoordenador: boolean = false
  isProfessor: boolean = false
  salas: SalaGrade[] = []
  alunos: AlunoSala[] = []
  colunasGrid = 0

  constructor(private principal: PrincipalService,
    private salasService: SalasService) { }

  ngOnInit(): void {
    if (this.principal.tokensLoaded) {
      this.isCoordenador = this.principal.isCoordenador
      this.loadSalas()
    } else {
      this.principal.okTokens.subscribe(() => this.loadSalas())
    }
    this.principal.mudouAno.subscribe(ano => this.loadSalas())
  }

  loadSalas() {
    if (this.isCoordenador) {
      this.salasService.listaSalasBoletim().subscribe(salas => {
        this.salas = salas
      })
    }
  }
  buscaSala(sala: string) {
    this.salasService.listaAlunosBySala(sala).subscribe(alunosSala => {
      this.alunos = alunosSala
    })
  }
}
