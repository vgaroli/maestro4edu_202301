import { Component, OnInit } from '@angular/core';
import { PrincipalService } from 'src/app/services/principal.service';
import { SalasService } from 'src/app/services/salas.service';
import { AlunoSala, SalaGrade } from 'src/app/models/escola.model';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa-show',
  templateUrl: './mapa-show.component.html',
  styleUrls: ['./mapa-show.component.scss']
})
export class MapaShowComponent implements OnInit {
  isCoordenador: boolean = false
  isProfessor: boolean = false
  isAluno: boolean = false
  salas: SalaGrade[] = []
  alunos: AlunoSala[] = []
  showBoletim: boolean = false
  showBoletimAnonimo: boolean = false
  avisoBoletim: string = "Os boletins estão sendo conferidos."
  showNome: boolean = false


  constructor(private principal: PrincipalService,
    private salasService: SalasService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.principal.isAnonimo) {
      this.loadAnonimoData()
    } else {
      if (this.principal.tokensLoaded) {
        this.isCoordenador = this.principal.isCoordenador
        this.ajustes()
        this.loadSalas()
      } else {
        this.principal.okTokens.subscribe(() => {
          this.ajustes
          this.loadSalas()
        })
      }
    }
    this.principal.mudouAno.subscribe(ano => this.loadSalas())
  }

  loadSalas() {
    if (this.isCoordenador) {
      this.salasService.listaSalasBoletim().subscribe(salas => {
        this.salas = salas
      })
    }
    if (this.isAluno) {
      let alunoSala: AlunoSala = {
        idGoogle: this.principal.idGoogle,
        idGeekie: this.principal.idGeekie,
        idSala: "",
        nomeAluno: this.principal.nomePessoa,
        nomeSala: "",
        idCurso: this.principal.idCurso,
        idGrade: this.principal.idGrade,
        ativo: true
      }
      this.showBoletimAnonimo = true
      this.alunos.push(alunoSala)
      console.log(this.alunos)
    }
  }

  loadAnonimoData() {
    let dt = new Date()
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      let uuid = params.get("uuid")
      console.log(uuid)
      this.principal.loadAnonimoData(uuid).pipe(take(1)).subscribe(dados => {
        if (dados) {
          console.log(dados)
          this.principal.getShowBoletimForAnonimo(dados[0].escola).subscribe(dado => {
            this.showBoletimAnonimo = dado.showBoletim
            this.showNome = !this.showBoletimAnonimo
            this.showBoletimAnonimo = true
          })
          this.principal.escola = dados[0].escola
          this.principal.anoLetivo =dados[0].anoLetivo
          this.principal.idGoogle = dados[0].idGoogle
          this.principal.idGrade = dados[0].idGrade
          this.principal.nomePessoa = dados[0].nomeAluno
          if (dados[0].idCurso) {
            this.principal.idCurso = dados[0].idCurso
          }
          if (dados[0].idGeekie) {
            this.principal.idGeekie = dados[0].idGeekie
          }
          this.principal.mudouDados()
          this.isAluno = true
          this.isCoordenador = false
          this.showBoletim = true
          this.loadSalas()
        }
      })
    })
  }

  buscaSala(sala: string) {
    //console.log("Entrando busca sala")
    this.salasService.listaAlunosBySala(sala).subscribe(alunosSala => {
      this.alunos = alunosSala
    })
  }

  ajustes() {
    console.log(this.principal.cargos)
    this.isCoordenador = (this.principal.cargos.indexOf("coordenador") != -1 || this.principal.cargos.indexOf("diretor") != -1 || this.principal.cargos.indexOf("professor") != -1)
    this.isProfessor = (this.principal.cargos.indexOf("professor") != -1)
    this.isAluno = (this.principal.cargos.indexOf("aluno") != -1)
    console.log(this.principal.boletimEscolaLiberado)

    this.showBoletim = (this.isCoordenador || this.isProfessor || this.principal.boletimEscolaLiberado)
    this.showBoletimAnonimo = this.showBoletim
    this.avisoBoletim = this.principal.avisoBoletim
    this.showNome = (!this.showBoletimAnonimo || this.isCoordenador)
  }
}
