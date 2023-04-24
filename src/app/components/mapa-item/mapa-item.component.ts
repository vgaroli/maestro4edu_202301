import { ChangeDetectorRef, Component, Input, OnInit, NgZone } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { DadoItem } from 'src/app/models/mapa.model';
import { MapaListService } from 'src/app/services/mapa-list.service';
import { PrincipalService } from 'src/app/services/principal.service';

@Component({
  selector: 'app-mapa-item',
  templateUrl: './mapa-item.component.html',
  styleUrls: ['./mapa-item.component.scss']
})
export class MapaItemComponent implements OnInit {
  textos: DadoItem[]
  cabecalho: DadoItem[]
  isCoordenador: boolean
  isAluno: boolean
  isLiberado: boolean
  colunasGrid = 0
  customStyle: string = `grid-template-columns: repeat(${this.colunasGrid}, auto)`
  firstText: string = "ok"

  @Input() idValue: string = ""
  @Input() idField: string = ""
  @Input() colletion: string = ""
  @Input() idGrade: string = ""
  @Input() idCurso: string = ""
  @Input() order: string = ""


  constructor(private principal: PrincipalService, private zone: NgZone,
    private mapaListService: MapaListService, private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    this.changeDetection.detectChanges()
      if (this.principal.tokensLoaded || this.principal.isAnonimo) {
        this.processar()
      } else {
        this.principal.okTokens.subscribe(() => [
          this.processar()
        ])
      }
  }

  processar() {
    if (this.idValue) {
      this.isCoordenador = (this.principal.cargos.indexOf('coordenador') > -1)
      this.isAluno = (this.principal.cargos.indexOf('aluno') > -1)
      this.getItem()
    }
  }

  getItem() {
    this.mapaListService.getItemHeader(this.idCurso, this.colletion).pipe(take(1)).subscribe(cabecalho => this.zone.run(() => {
      this.colunasGrid = cabecalho.colunas
      this.customStyle = `grid-template-columns: repeat(${this.colunasGrid}, auto)`
      console.log(this.customStyle)
      this.cabecalho = cabecalho.cabecalho
      this.mapaListService.loadDataItem(this.colletion, this.idField, this.idValue, this.order).subscribe(dados => this.zone.run(() => {
        let localTexto: DadoItem[]
        localTexto = this.cabecalho
        dados.forEach(dado => {
          localTexto = localTexto.concat(dado.linhaItem)
        })
        this.textos = localTexto
        //this.firstText = this.textos[0].texto
        //console.log(this.firstText)
      }))
    }))
  }
}
