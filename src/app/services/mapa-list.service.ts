import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, doc, DocumentReference, orderBy, query, where } from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { Grade } from '../models/escola.model';
import { PrincipalService } from './principal.service';
import { Cabecalho, ItemMapa } from '../models/mapa.model';


@Injectable({
  providedIn: 'root'
})
export class MapaListService {

  constructor(private firestore: Firestore, private principal: PrincipalService) { }

  getListGrade(idGrade: string):Observable<Grade>{
    let colecao: string = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/grades`
    return docData<Grade>(doc(this.firestore, colecao, idGrade) as DocumentReference<Grade>)
  }

  getItemHeader(idHeader: string, collection: string):Observable<Cabecalho>
  {
    let collectionHeader = collection + "Cabecalhos"
    let path = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/${collectionHeader}`
    return docData<Cabecalho>(doc(this.firestore, path, idHeader) as DocumentReference<Cabecalho>)
  }

  loadDataItem(dataCollection: string, idField: string, idValue: string, ordem: string):Observable<ItemMapa[]>{
    let colecao: string = `escolas/${this.principal.escola}/anosLetivos/${this.principal.anoLetivo}/${dataCollection}`
    return collectionData(
      query<ItemMapa>(
        collection(this.firestore, colecao) as CollectionReference<ItemMapa>,
        where(idField, '==', idValue), orderBy(ordem)
      )
    )
  }
}
