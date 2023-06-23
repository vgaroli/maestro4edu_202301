import { Disciplina } from './../models/boletim.model';
import { PrincipalService } from './principal.service';
import { Firestore, collectionData, CollectionReference, where, query, docData, DocumentReference } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import { AlunoSala, HoraInicioAula, SalaChamadaRegistro, SalaGrade, Horario, DocenteReduzido, Docente, PeriodoLetivo } from './../models/escola.model';
import { Injectable } from '@angular/core';
import { collection, doc, orderBy, setDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class EscolasService {

  constructor(private firestore: Firestore, private principal: PrincipalService) { }

   listaChamadas(idGoogle: string, data: Date): Observable<SalaChamadaRegistro[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
    return collectionData(
      query<SalaChamadaRegistro>(collection(this.firestore, path) as CollectionReference<SalaChamadaRegistro>,
      where('idDocenteHorario','==',idGoogle),
      where('dataChamada','==',data),
      orderBy('dataHoraInicio'),
      orderBy('idSala')
      ), {idField:'id'})
  }

  listaChamadasAbertas(idGoogle: string, data: Date): Observable<SalaChamadaRegistro[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
    return collectionData(
      query<SalaChamadaRegistro>(collection(this.firestore, path) as CollectionReference<SalaChamadaRegistro>,
      where('idDocenteHorario','==',idGoogle),
      where('dataChamada','<=',data),
      where('registrado','==',false),
      orderBy('dataChamada'),
      orderBy('dataHoraInicio'),
      orderBy('idSala')
      ), {idField:'id'})
  }

  listaChamadasCoordenador(data: Date): Observable<SalaChamadaRegistro[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
    return collectionData(
      query<SalaChamadaRegistro>(collection(this.firestore, path) as CollectionReference<SalaChamadaRegistro>,
      where('dataChamada','==',data),
      orderBy('dataHoraInicio'),
      orderBy('idSala')
      ), {idField:'id'})
  }

  listaChamadasCoordenadorAbertas(data: Date): Observable<SalaChamadaRegistro[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
    return collectionData(
      query<SalaChamadaRegistro>(collection(this.firestore, path) as CollectionReference<SalaChamadaRegistro>,
      where('dataChamada','<=',data),
      orderBy('dataChamada'),
      orderBy('dataHoraInicio'),
      where('registrado','==',false),
      orderBy('idSala')
      ), {idField:'id'})
  }

  listaHoraInicio(): Observable<HoraInicioAula[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/horaInicioAula`
    return collectionData(collection(this.firestore, path) as CollectionReference<HoraInicioAula>, {idField: 'id'})
  }

  listaDisciplinas(): Observable<Disciplina[]>{
    let path = `escolas/${this.principal.escola}/disciplinas`
    return collectionData(
      query<Disciplina>(collection(this.firestore, path) as CollectionReference<Disciplina>,
      where('ativa','==',true),
      orderBy('nome')), {idField: 'id'})
  }

  listaDocentes(): Observable<Docente[]>{
    let path = `escolas/${this.principal.escola}/docentes`

    let retorno: Observable<Docente[]>=collectionData(
      query<Docente>(collection(this.firestore,
      path) as CollectionReference<Docente>,
      where('ano', "==",this.principal.anoLetivo.toString())),{idField: 'id'})
  return retorno
  }

  listaAlunosSala(idSala: string): Observable<AlunoSala[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/alunosSala`
    return collectionData(
      query<AlunoSala>(
        collection(this.firestore, path) as CollectionReference<AlunoSala>,
        where('idSala', '==', idSala),
        orderBy('nomeAluno'))
        , {idField: 'id'})
  }



  lerChamada(idChamada: string): Observable<SalaChamadaRegistro>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
    return docData<SalaChamadaRegistro>(doc(this.firestore,path,idChamada) as DocumentReference<SalaChamadaRegistro>)
  }

  lerPeriodos(): Observable<PeriodoLetivo[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/periodos`
    return collectionData(
      query<PeriodoLetivo>(
        collection(this.firestore, path) as CollectionReference<PeriodoLetivo>,
        orderBy('ordem'))
        , {idField: 'id'})
  }


  salvarChamada(chamada: SalaChamadaRegistro, id: string){
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
    setDoc(doc(this.firestore, path, id),chamada)
    this.checkDocenteParalelo(id, chamada)
  }

  checkDocenteParalelo(id: string, chamada: SalaChamadaRegistro){
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salaChamadaRegisro`
      collectionData(
    query<SalaChamadaRegistro>(
      collection(this.firestore, path) as CollectionReference<SalaChamadaRegistro>,
      where('idChaveHorario','==', chamada.idChaveHorario)), {idField: 'id'}).pipe(take(1)).subscribe(registros => {
        registros.forEach(registro => {
          if (registro.id != id && registro.dataChamada==chamada.dataChamada){
            registro.ausentes = chamada.ausentes
            registro.registrado = true
            registro.idDocente = chamada.idDocente
            setDoc(doc(this.firestore, path, registro.id), registro)
          }
        })
      })

  }

  listaHorario(diaSemana: number):Observable<Horario[]> {
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/horario`
    return collectionData(
      query<Horario>(
        collection(this.firestore, path) as CollectionReference<Horario>,
        where('diaSemana', '==', diaSemana))
        , {idField: 'id'})
  }}
