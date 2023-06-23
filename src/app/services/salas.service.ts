import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collectionData, CollectionReference, Firestore, docData, DocumentReference, query, where, orderBy } from '@angular/fire/firestore';
import { PrincipalService } from './principal.service';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Grade, SalaGrade, Matricula, AlunoSala } from './../models/escola.model';


@Injectable({
  providedIn: 'root'
})
export class SalasService {

  constructor(private firestore: Firestore, private principal: PrincipalService) { }

  listaAlunosBySala(idSala: string): Observable<AlunoSala[]>{
    //console.log("Entrando listaAlunosBySala")
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/alunosSala`
    return collectionData(
      query<AlunoSala>(collection(this.firestore, path) as CollectionReference<AlunoSala>,
      where('idSala','==',idSala),where ('ativo','==',true),
      orderBy('nomeAluno'))
      , {idField: 'id'})
   }

   listaSalasBoletim(): Observable<SalaGrade[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salasGrade`
    return collectionData<SalaGrade>(
      query(
      collection(this.firestore, path) as CollectionReference<SalaGrade>,
      where('showBoletim','==', true)), {idField: 'id'})
  }

  listaSalas(): Observable<SalaGrade[]>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/salasGrade`
    return collectionData<SalaGrade>(collection(this.firestore, path) as CollectionReference<SalaGrade>, {idField: 'id'})
  }

  getMatricula(idGoogle: string):Observable<Matricula>{
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/matriculas`
    return docData<Matricula>(doc(this.firestore,path,idGoogle) as DocumentReference<Matricula>)
  }


}
