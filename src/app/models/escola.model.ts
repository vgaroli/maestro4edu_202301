import { Time } from '@angular/common';
import { DocumentReference, Timestamp } from '@angular/fire/firestore';
 
export interface Escola {
  id?: string
  razaoSocial: string
  fantasia?: string
  cnpj: string
  anoLetivo: number
  showBoletim?: boolean
}

export interface AnoLetivo{
  id?: string
  ano?: number
  boletimEscolaLiberado?: boolean
  inicio?: Timestamp
  termino?: Timestamp
  lastClassroomUpdate?: Timestamp
  avisoBoletim?: string
}

export interface Docente{
  id?: string
  ano: number
  cargos: string[]
  conta: DocumentReference
  grades: string[]
  nome: string
  salas: Sala[]
}

export interface DocenteReduzido{
  idGoogle?: string
  nome: string
}

export interface Sala{
  diario: string
  disciplina: string
  sala: string
}

export interface Grade{
  id: string
  descricao: string
  prefixo: string
  colunasMapa?: number
  itensMapa: ItemMapa[]
}

export interface ItemMapa{
  colecao: string
  estilo?: string
  campoId?: string
  chaveCabecalho?: string
}

export interface SalaGrade{
  curso: string
  divisao: string
  grades: string[]
  id?: string
  sala: string
}

export interface Matricula{
  id: string
  ano: number
  conta: DocumentReference
  curso: string
  dataMatricula: Timestamp
  grade: string
  nome: string
}

export interface AlunoSala{
  idGoogle: string
  idGeekie?:string
  idCurso?: string
  idGrade?: string
  idSala: string
  nomeAluno: string
  nomeSala: string
  ativo: boolean
}

export interface GrupoGradeSala{
  id?: string
  nome: string
}


export interface PeriodoLetivo{
  id?: string
  de: Timestamp
  ate: Timestamp
  nomePeriodo: string
  abreviatura: string
  ordem: number
}

export interface SalaChamadaRegistro{
  id?: string
  idSala: string
  dataHoraInicio: Timestamp
  dataChamada: Timestamp
  destinoFalta: string[]
  idDisciplina: string
  realizada?: boolean
  idDocente: string
  idDocenteHorario: string
  extra: boolean
  idChaveHorario: string
  dataHoraRegistro?: Timestamp
  ausentes: AlunoSalaChamadaList[]
  programada:boolean
  registrado: boolean
}

export interface DadosChamada{
  id?: string
  idSala: string
  dataHoraInicio: Timestamp
  dataChamada: Timestamp
  destinoFalta: string[]
  extra: boolean
  idChaveHorario: string
  idDisciplina: string
  disciplina: string
  docente: string
  sala: string
  registrado: boolean
  realizada?: boolean
  idDocente: string
  idDocenteHorario: string
  dataHoraRegistro?: Timestamp
  ausentes: string //AlunoSalaChamadaList[]
  programada:boolean  
  style?: string
}

export interface AlunoSalaChamadaList{
  idGoogle: string
  nomeAluno: string
  presente: boolean
  ativo: boolean
}

export interface HoraInicioAula{
  id?: string
  idHoraInicio: Timestamp
  aula: number
}


export interface Disciplina{
  id?: string
  nome: string
}


export interface Horario{
  diaSemana: number
  horaInicio: Timestamp
  idDisciplina: string
  idGoogle: string
  idSala: string
  idsDisciplinasOutros: string[]
  idsGoogleOutros: string[]
}
