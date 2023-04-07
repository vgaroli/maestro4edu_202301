import { AfterViewInit, Component, Input } from '@angular/core';
import { take } from 'rxjs';
import { MapaListService } from 'src/app/services/mapa-list.service';
import { PrincipalService } from 'src/app/services/principal.service';

@Component({
  selector: 'app-mapa-item',
  templateUrl: './mapa-item.component.html',
  styleUrls: ['./mapa-item.component.scss']
})
export class MapaItemComponent implements AfterViewInit {
  
  isCoordenador: boolean
  isAluno:boolean
  isLiberado: boolean
  
  @Input() idValue: string = ""
  @Input() idField: string = ""
  @Input() colletion: string = ""
  @Input() idGrade: string=""


  constructor(private principal: PrincipalService,
    private mapaListService: MapaListService) { }

  ngAfterViewInit(){
    if (this.principal.tokensLoaded || this.principal.isAnonimo){
      this.processar()
    } else {
      this.principal.okTokens.subscribe(() =>[
        this.processar()
      ])
    }   
  }

  processar(){
    if(this.idValue){
      this.isCoordenador = (this.principal.cargos.indexOf('coordenador') > -1)
      this.isAluno = (this.principal.cargos.indexOf('aluno') > -1)
      this.getItem()
    }
  }

  getItem(){
    this.mapaListService.getItemHeader(this.idGrade, this.colletion).pipe(take(1))
  }
}
