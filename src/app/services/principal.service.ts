import { Escola, AnoLetivo, Docente, Sala } from './../models/escola.model';
import { Conta, Pessoa, AnonimoData, Menu, MenuCargo } from './../models/basic.model';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { Observable, take } from 'rxjs';
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, UserCredential } from "firebase/auth"

import { doc, docData, setDoc, DocumentReference, Firestore, query, where, collection, CollectionReference, collectionData, Timestamp } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  @Output() okTokens = new EventEmitter<boolean>()
  @Output() mudouAno = new EventEmitter<number>()
  @Output() changeData = new EventEmitter<boolean>()

  accessToken?: string = ""
  naoAnonimo=true
  tokensLoaded: boolean = false
  idUser: string = ""
  isCoordenador: boolean = false
  boletimEscolaLiberado?: boolean = true
  avisoBoletim?: string=""
  idCurso: string = ""
  idGoogle: string = ""
  idGeekie: string = ""
  conta: string = ""
  photoURL: string = ""
  autenticado: boolean = false
  escola: string = ""
  nomeEscola: string = ""
  cargos: string[] = []
  menus: Menu[] = []
  ultimoUpdateClassroom: Date = new Date(1900, 1, 1)
  anoLetivo: number = 0
  showBoletim: boolean = false
  nome: string = ""
  isAnonimo = false
  nomePessoa: string = ""

  anosLetivos: AnoLetivo[] = []
  salas: Sala[] = []

  constructor(private firestore: Firestore) { }

  isLinkLogin(): boolean {
    const auth = getAuth()
    let testLink: boolean = isSignInWithEmailLink(auth, window.location.href)
    return testLink
  }

  mudarAno(ano: number) {
    this.anoLetivo = ano
    this.mudouAno.emit(ano)
  }

  mudouDados(){
    this.changeData.emit(true)
  }

  checkLinkLogin(email: string): Promise<UserCredential> {
    const auth = getAuth()
    return signInWithEmailLink(auth, email, window.location.href)
  }

  loadAnonimoData(uuid: string): Observable<AnonimoData[]> {
    return collectionData(
      query<AnonimoData>(
        collection(this.firestore, "uuids") as CollectionReference<AnonimoData>,
        where('uuid', "==", uuid))
    )
  }

  getShowBoletimForAnonimo(escola: string): Observable<Escola> {
    return docData<Escola>(doc(this.firestore, 'escolas', escola) as DocumentReference<Escola>)
    //return this.firestore.collection<Escola>('escolas').doc(escola).valueChanges()
  }

  trocarAnoLetivo(ano: number) {
    this.anoLetivo = ano
    this.okTokens.emit(true)
  }

  updateConta(conta: Conta) {
    collectionData(
      query<Conta>(
        collection(this.firestore, "contas") as CollectionReference<Conta>,
        where('conta', "==", conta.conta)), { idField: "id" }).subscribe(snaps => {
          setDoc(doc(collection(this.firestore, "contas"), snaps[0].id), conta)
        })
  }

  checkToken() {
    const auth = getAuth()
    auth.onAuthStateChanged(
      state => {
        if (state) {
          this.autenticado = true
          if (state.photoURL) {
            this.photoURL = state.photoURL
          }
          this.idUser = state.uid
          if (state.email) {
            this.conta = state.email
          }

          //this.conta = 'paloma.baptistela@csceducacao.com.br'
          if (!this.accessToken) {
            this.login()
          } else {
            collectionData(
              query<Conta>(
                collection(this.firestore, "contas") as CollectionReference<Conta>,
                where('conta', "==", this.conta))
            ).pipe(first()).subscribe(contas => {
              let conta = contas[0]
              console.log(conta)
              if (conta) {
                this.idGoogle = conta.idGoogle
                if (conta.idGeekie) {
                  this.idGeekie = conta.idGeekie
                }
                if (conta.idCurso) {
                  this.idCurso = conta.idCurso
                }
                this.escola = conta.escola
                console.log(conta.pessoa.path)
                docData<Pessoa>(doc(this.firestore, 'pessoas', conta.pessoa.path.split('/')[1]) as DocumentReference<Pessoa>)
                  .pipe(take(1)).subscribe(pessoa => {

                    if (pessoa) {
                      this.nome = pessoa.nome
                      this.nomePessoa = pessoa.nome
                    }
                  })
                this.cargos = conta.cargos
                this.isCoordenador = (this.cargos.indexOf("coordenador") > -1)
                if (this.cargos.length > 0) {
                  let menusCargosNoUnique: string[] = []
                  let menusCargos: string[] = []
                  let totalCargos: number = 0
                  this.cargos.forEach(cargo => {
                    docData<MenuCargo>(doc(this.firestore, 'menuCargo', cargo) as DocumentReference<MenuCargo>).pipe(take(1)).subscribe(menuCargo => {
                      if (menuCargo) {
                        menusCargosNoUnique = menusCargosNoUnique.concat(menuCargo.menus)
                      }
                      totalCargos++
                      if (totalCargos == this.cargos.length) {
                        menusCargos = menusCargosNoUnique.filter((v, i, a) => a.indexOf(v) === i);
                        menusCargos.forEach(menu => {
                          docData<Menu>(doc(this.firestore, 'menuSistema', menu) as DocumentReference<Menu>).pipe(take(1)).subscribe(menuSistema => {
                            this.menus.push(menuSistema)
                          });
                        })
                      }
                    })
                  })
                }
                if (conta.ultimoUpdateClassroom) {
                  this.ultimoUpdateClassroom = conta.ultimoUpdateClassroom.toDate()
                } else {
                  this.ultimoUpdateClassroom = new Date(1900, 1, 1)
                  conta.ultimoUpdateClassroom = Timestamp.fromDate(this.ultimoUpdateClassroom)
                  //conta.ultimoUpdateClassroom = this.ultimoUpdateClassroom
                  this.updateConta(conta)
                }
                docData<Escola>(doc(this.firestore, 'escolas', conta.escola) as DocumentReference<Escola>)
                  .pipe(take(1)).subscribe(escola => {
                    if (escola) {
                      this.anoLetivo = escola.anoLetivo
                      docData<AnoLetivo>(doc(this.firestore, `escolas/${this.escola}/anosLetivos`, this.anoLetivo.toString()) as DocumentReference<AnoLetivo>).subscribe(anoLetivo => {
                        this.boletimEscolaLiberado = anoLetivo.boletimEscolaLiberado
                        this.avisoBoletim = anoLetivo.avisoBoletim
                      })
                      if (escola.showBoletim) {
                        this.showBoletim = escola.showBoletim
                      }
                      if (escola.fantasia) {
                        this.nomeEscola = escola.fantasia
                      }
                    }
                    collectionData(collection(this.firestore, `escolas/${this.escola}/anosLetivos`) as CollectionReference<AnoLetivo>)
                      .pipe(take(1)).subscribe(anos => {
                        this.anosLetivos = anos
                        if (this.cargos.indexOf('aluno') == -1) {
                          docData<Docente>(doc(this.firestore, `escolas/${this.escola}/anosLetivos/${this.anoLetivo}/docentes/${this.idGoogle}`) as DocumentReference<Docente>)
                            .subscribe(docente => {
                              if (docente) {
                                this.salas = docente.salas
                              }
                              this.tokensLoaded = true
                              this.okTokens.emit(true)
                            })
                        } else {
                          this.tokensLoaded = true
                          this.okTokens.emit(true)
                        }
                      })
                  })
              }
            })
          }
        }
      }
    )
  }

  requestLink(email: string) {
    const actionCodeSettings = {
      url: "http://localhost:4200/loginLink",
      handleCodeInApp: true
    }
    const auth = getAuth()

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailLink", email)
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message)
      })
  }

  login() {
    const provider = new GoogleAuthProvider()
    //    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email")
    provider.addScope("https://www.googleapis.com/auth/classroom.courses")
    provider.addScope("https://www.googleapis.com/auth/classroom.coursework.students")
    provider.addScope("https://www.googleapis.com/auth/drive.appdata")
    provider.addScope("https://www.googleapis.com/auth/drive.file")
    provider.addScope("https://www.googleapis.com/auth/drive.install")
    const auth = getAuth()
    signInWithPopup(auth, provider).then(
      result => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          this.accessToken = credential.accessToken
          this.checkToken()
        }
      }
    );
  }

  logout(): Promise<void> {
    const auth = getAuth()
    return signOut(auth)
  }

}
