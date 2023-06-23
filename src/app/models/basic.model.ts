import { DocumentReference, Timestamp } from '@angular/fire/firestore';


export interface Periodo{
  de: Date
  ate: Date
}

export interface DateData{
  year: number,
  month: number,
  day: number
}

export interface TimeOfDay{
  hours: number,
  minutes: number,
  seconds: number,
  nanos: number
}


export interface UserProfile{
  id: string,
  name: Name,
  emailAddress: string,
  photoUrl: string,
  permissions: GlobalPermission[],
  verifiedTeacher: boolean
}

export interface Name{
  givenName: string,
  familyName: string,
  fullName: string
}

export interface GlobalPermission{
  permission: Permission
}

export enum Permission{
  PERMISSION_UNSPECIFIED,
  CREATE_COURSE
}

export interface FilhoData{
  nome: string,
  pai: DocumentReference
}

export interface Filho{
  nome: string,
  pai: string
}

export interface Pai{
  nome: string
}

export interface Menu{
  routerLink: string
  icone: string
  texto: string
}

export interface MenuCargo{
  cargo: string
  menus: string[]
}



export interface Conta{
  id?: string
  idGoogle: string
  idGeekie?: string
  idCurso?: string
  grade?: string
  idGrade?: string
  conta: string
  escola: string
  pessoa: DocumentReference
  cargos: string[]
  suspenso: boolean
  raTotvs: string
  boletimLiberado?: boolean
  foto?: string
  coordenaSalas?: string[]
  ultimoUpdateClassroom?: Timestamp
}

export interface Pessoa{
  contaGoogle: string
  dataNascimento?: Date
  idGoogle: string
  nome: string
}

export interface AnonimoData{
  idGoogle: string
  idGeekie?: string
  idGrade?:string
  idCurso?: string
  uuid: string
  anoLetivo: number
  escola:string
  nomeAluno: string
}

