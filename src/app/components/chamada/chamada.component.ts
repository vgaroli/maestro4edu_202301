import { SalasService } from './../../services/salas.service';
import { Disciplina } from './../../models/boletim.model';
import { AlunoSala, AlunoSalaChamadaList, HoraInicioAula, SalaChamadaRegistro, SalaGrade, DadosChamada, DocenteReduzido, Docente } from './../../models/escola.model';
import { PrincipalService } from './../../services/principal.service';
import { EscolasService } from './../../services/escolas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { MatSelectionList } from '@angular/material/list';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment'

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { Timestamp } from 'firebase/firestore';





@Component({
  selector: 'app-chamada',
  templateUrl: './chamada.component.html',
  styleUrls: ['./chamada.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]

})
export class ChamadaComponent  implements OnInit {

  naoRegistra: boolean = true
  listaChamadas: boolean = true
  salas: SalaGrade[]
  selectedSala: string = ""
  chamadaRegistrada: boolean = false
  chamadas: DadosChamada[] = []
  chamadaSelecionada: DadosChamada
  docentes: DocenteReduzido[] = []
  alunos: AlunoSalaChamadaList[] = []
  isCoordenador: boolean = false
  visaoCoordenador: boolean = false
  registradasUltimo: boolean = false
  chamadasEmAberto: boolean = false
  style: string = "background:yellow"

  dataBusca: moment.Moment//Date
  timerAtualiza: any

  disciplinas: Disciplina[]
  selectedDisciplina: string = ""

  dataInicio = new Date()// moment.Moment = moment(new Date())

  selectedHoraInicio: Timestamp = null
  horas: HoraInicioAula[] = []

  @ViewChild('alunosSelect') alunosSelect: MatSelectionList

  constructor(private escolas: EscolasService, private principal: PrincipalService, private salaService: SalasService, private _snackBar: MatSnackBar) {
    let dt = new Date()
    this.dataBusca = moment(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()))
    this.timerAtualiza = setInterval(() => this.atualizaChamados(), 30000)
  }

  loadChamadas() {
    if (this.chamadasEmAberto) {
      if (this.visaoCoordenador) {
        this.escolas.listaChamadasCoordenadorAbertas(this.dataBusca.toDate()).subscribe(chamadas => {
          this.criarListaDadosChamada(chamadas)
        })
      } else {
        this.escolas.listaChamadasAbertas(this.principal.idGoogle, this.dataBusca.toDate()).subscribe(chamadas => {
          this.criarListaDadosChamada(chamadas)
        })
      }
    } else {
      if (this.visaoCoordenador) {
        this.escolas.listaChamadasCoordenador(this.dataBusca.toDate()).subscribe(chamadas => {
          this.criarListaDadosChamada(chamadas)
        })
      } else {
        this.escolas.listaChamadas(this.principal.idGoogle, this.dataBusca.toDate()).subscribe(chamadas => {
          this.criarListaDadosChamada(chamadas)
        })
      }
    }
  }

  abrirChamada(chamada: DadosChamada) {
    if (chamada.dataHoraInicio.toDate() > (new Date)) {
      alert("Ainda não é o horário da aula!")
      return
    }
    this.chamadaSelecionada = chamada
    this.selectedDisciplina = chamada.idDisciplina
    this.selectedSala = chamada.idSala
    let dt: Date = chamada.dataHoraInicio.toDate()
    this.horas.forEach(hora => {
      if (dt.getHours() == hora.idHoraInicio.toDate().getHours() && dt.getMinutes() == hora.idHoraInicio.toDate().getMinutes()) {
        this.selectedHoraInicio = hora.idHoraInicio
      }
    })
    this.dataInicio = chamada.dataHoraInicio.toDate();//this.dataBusca.toDate()
    this.loadAlunosSala(chamada.idSala)
    this.listaChamadas = false
  }

  atualizaChamados() {
    this.chamadas.forEach(chamada => {
      chamada.style = (chamada.registrado) ? "background:rgb(83, 243, 83)" : (chamada.dataHoraInicio.toDate() > (new Date)) ? "background:gray; cursor: not-allowed;" : "background:yellow"
    })
  }

  criarListaDadosChamada(lista: SalaChamadaRegistro[]) {
    this.chamadas = []
    lista.forEach(chamada => {
      let nomesAusentes = chamada.ausentes.map(ausente => ausente.nomeAluno)
      let dadoChamada: DadosChamada = {
        ausentes: nomesAusentes.join(";"),
        disciplina: this.buscaDisciplina(chamada.idDisciplina),
        idDisciplina: chamada.idDisciplina,
        dataChamada: chamada.dataChamada,
        destinoFalta: chamada.destinoFalta,
        extra: chamada.extra,
        idChaveHorario: chamada.idChaveHorario,
        idDocenteHorario: chamada.idDocenteHorario,
        idSala: chamada.idSala,
        dataHoraInicio: chamada.dataHoraInicio,
        docente: this.buscaPessoa(chamada.idDocenteHorario),
        sala: this.buscaSala(chamada.idSala),
        idDocente: chamada.idDocente,
        programada: chamada.programada,
        registrado: chamada.registrado,
        id: chamada.id,
        style: (chamada.registrado) ? "background:rgb(83, 243, 83)" : (chamada.dataHoraInicio.toDate() > (new Date)) ? "background:gray; cursor: not-allowed;" : "background:yellow"
      }
      this.chamadas.push(dadoChamada)
      this.ordenar()
    })
  }

  ordenar() {
    if (this.registradasUltimo) {
      this.chamadas.sort((a, b) => (a.registrado < b.registrado) ? -1 : 1)
    } else {
      this.chamadas.sort((a, b) => (a.dataHoraInicio < b.dataHoraInicio) ? -1 : 1)
    }
  }

  buscaDisciplina(idDisciplina: string): string {
    let disciplina = ""
    let ps = this.disciplinas.find(disciplina => disciplina.id == idDisciplina)
    if (ps) {
      disciplina = ps.nome
    }
    return disciplina
  }

  buscaSala(idSala: string): string {
    let sala = ""
    let ps = this.salas.find(sala => sala.id == idSala)
    if (ps) {
      sala = ps.sala
    }
    return sala
  }

  buscaPessoa(idGoogle: string): string {
    let docente = ""
    // if (idGoogle == this.principal.idGoogle){
    //   docente = this.principal.nome
    // } else {
    let ps = this.docentes.find(docente => docente.idGoogle == idGoogle)
    if (ps) {
      docente = ps.nome
    }
    // }
    return docente
  }

  checkDados() {
    if (this.selectedHoraInicio && this.selectedSala && this.selectedDisciplina) {
      this.naoRegistra = false
      let dtHoje = this.dataInicio
      let hora = this.selectedHoraInicio.toDate()
      let dtHora: Date = new Date(dtHoje.getFullYear(), dtHoje.getMonth(), dtHoje.getDate(), hora.getHours(), hora.getMinutes())
      let idChave = `${this.selectedSala}${this.selectedDisciplina}${moment(dtHora).format("YYYYMMDDHHmm")}`
      this.escolas.lerChamada(idChave).pipe(take(1)).subscribe(chamada => {
        if (chamada) {
          this.chamadaRegistrada = chamada.registrado
          let ids: string[] = chamada.ausentes.map<string>(ausente => ausente.idGoogle)
          for (let aluno of this.alunos) {
            if (ids.indexOf(aluno.idGoogle) >= 0) {
              aluno.presente = false
            }
          }
        } else {
          this.chamadaRegistrada = false
        }
      })
    } else {
      this.naoRegistra = true
    }
  }

  iniciarRegistro() {
    this.listaChamadas = false
  }

  cancelar() {
    this.listaChamadas = true
  }

  registrar() {
    let dtHoraRegistro = new Date()
    let bProgramada = true
    let chamada: SalaChamadaRegistro = {
      idSala: this.selectedSala,
      dataHoraInicio: this.chamadaSelecionada.dataHoraInicio,
      dataChamada: this.chamadaSelecionada.dataChamada,
      destinoFalta: this.chamadaSelecionada.destinoFalta,
      idDocenteHorario: this.chamadaSelecionada.idDocenteHorario,
      idChaveHorario: this.chamadaSelecionada.idChaveHorario,
      extra: this.chamadaSelecionada.extra,
      idDisciplina: this.selectedDisciplina,
      idDocente: this.principal.idGoogle,
      ausentes: this.faltou(this.alunos),
      dataHoraRegistro: Timestamp.fromDate(dtHoraRegistro),
      programada: bProgramada,
      registrado: true
    }
    let idChave = this.chamadaSelecionada.id
    this.escolas.salvarChamada(chamada, idChave)
    //alert('Chamada registrada!')
    this._snackBar.open('Chamada registrada!','', {duration: 3000})
    this.listaChamadas = true
    //this.loadChamadas()
  }

  faltou(alunos: AlunoSalaChamadaList[]): AlunoSalaChamadaList[] {
    let retorno: AlunoSalaChamadaList[] = []
    for (let aluno of alunos) {
      if (!aluno.presente) {
        retorno.push(aluno)
      }
    }
    return retorno
  }

  changeInicio() {
    this.checkDados()
  }


  ngOnInit(): void {
    if (this.principal.autenticado) {
      this.loadListas()
      this.loadSalaPadrao()
      this.loadChamadas()
      this.isCoordenador = this.principal.isCoordenador
    } else {
      this.principal.okTokens.subscribe((result) => {
        if (result) {
          this.loadListas()
          this.loadSalaPadrao()
          this.loadChamadas()
          this.isCoordenador = this.principal.isCoordenador
        }
      })
    }
  }

  loadSalaPadrao() {

  }

  loadListas() {
    this.salaService.listaSalas().pipe(take(1)).subscribe(salas => {
      this.salas = salas
    })
    this.escolas.listaDisciplinas().pipe(take(1)).subscribe(disciplinas => {
      this.disciplinas = disciplinas
    })
    this.escolas.listaHoraInicio().pipe(take(1)).subscribe(horas => {
      this.horas = horas
    })
    this.escolas.listaDocentes().pipe(take(1)).subscribe(docentes => {
      this.docentes = docentes.map(docente => this.convertDocente(docente))
    })
  }

  loadAlunosSala($sala) {
    this.escolas.listaAlunosSala($sala).pipe(take(1)).subscribe((alunos) => {
      this.alunos = alunos.map((aluno) => this.convertAluno(aluno))
      this.alunos = this.alunos.filter((aluno) => { return aluno.ativo })
      this.checkDados()
    })
  }

  convertAluno(aluno: AlunoSala): AlunoSalaChamadaList {
    let alunoChamada: AlunoSalaChamadaList = { idGoogle: aluno.idGoogle, nomeAluno: aluno.nomeAluno, presente: true, ativo: aluno.ativo }
    return alunoChamada
  }

  convertDocente(docente: Docente): DocenteReduzido {
    let docenteReduzido: DocenteReduzido = { idGoogle: docente.id.substring(4), nome: docente.nome }
    return docenteReduzido
  }

  listaHorario() {
    let dt = new Date(2022, 2, 16);
    let diaSemana = dt.getDay() + 1
    this.escolas.listaHorario(diaSemana).subscribe((horario) => {
      //console.log(horario)
    })
  }

}
