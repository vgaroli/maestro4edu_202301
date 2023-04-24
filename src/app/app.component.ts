import { PrincipalService } from './services/principal.service';
import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Menu } from './models/basic.model';
import { Router } from '@angular/router';
import { AnoLetivo } from './models/escola.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'maestro4edu'
  isAutenticado: boolean = false
  escola: string = ""
  photoURL: string = ""
  nome: string = ""
  menus: Menu[] = []
  anoLetivo: number = 0
  anosLetivos: AnoLetivo[]
  primeriraEntrada: boolean = true
  showNavegacao: boolean = false
  showNomeAluno: boolean = false

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver
    , private principal: PrincipalService
    , private router: Router) {
    let url = window.location.href
    if (url.indexOf("UUID") === -1) {
      this.principal.isAnonimo = false
      this.principal.naoAnonimo = true
      this.showNavegacao = true
      this.loadCredential()
    } else {
      this.principal.isAnonimo = true
      this.showNavegacao = false
      this.isAutenticado = true
      this.principal.naoAnonimo = false
      this.showNomeAluno = true
      this.principal.changeData.subscribe(() => {
        this.nome = this.principal.nomePessoa
      })

    }
  }

  loadCredential(){
    if (this.principal.isLinkLogin()) {
      let email = window.localStorage.getItem("emailLink")
      if (!email) {
        email = prompt("Por favor, informe o seu e-mail para confirmação")
      }
      this.principal.checkLinkLogin(email).then(result => {
        alert(result.user.email)
        this.isAutenticado = true
        window.localStorage.removeItem("emailLink")
      })
    } else {
      this.principal.okTokens.subscribe(result => {
        if (result) {
          this.isAutenticado = true
          this.anosLetivos = this.principal.anosLetivos
          this.escola = this.principal.nomeEscola
          this.photoURL = this.principal.photoURL
          this.nome = this.principal.nomePessoa
          this.menus = this.principal.menus
          this.anoLetivo = this.principal.anoLetivo
          if (this.primeriraEntrada) {
            this.router.navigateByUrl("inicial")
            this.primeriraEntrada = false
          }
        }
      })
    }
  }



  logout() {
    this.principal.logout().then(() => {
      this.isAutenticado = false
    })
  }

  mudarAno(ano: number) {
    this.principal.mudarAno(ano)
    this.anoLetivo = ano
  }

}
