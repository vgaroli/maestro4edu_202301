import { PrincipalService } from './../../services/principal.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.scss']
})
export class LogonComponent {
  constructor(private principal: PrincipalService) { }

  emailLink: string=""

  login(){
    this.principal.login()
  }

  linkAccess(){
    this.principal.requestLink(this.emailLink)
  }
}
