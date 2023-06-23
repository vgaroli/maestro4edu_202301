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
  @Input() titulo:string = ""


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
      this.cabecalho = cabecalho.cabecalho
      this.mapaListService.loadDataItem(this.colletion, this.idField, this.idValue, this.order).subscribe(dados => this.zone.run(() => {
        let localTexto: DadoItem[]
        localTexto = this.cabecalho
        //console.log(dados)
        dados.forEach(dado => {
          if (dado.somenteCoordenacao){
            if(!this.isCoordenador){
              dado.linhaItem.forEach(item => {
                item.estilo = "display:none;"
              })
            }
          }
          //console.log(dado.linhaItem)
          localTexto = localTexto.concat(dado.linhaItem)
        })
        this.textos = localTexto
        //this.firstText = this.textos[0].texto
        //console.log(this.firstText)
        this.textos.forEach((texto,i) => {
          if (texto.formato === "url" && (this.isCoordenador || (this.isAluno && this.principal.tokensLoaded))){
            if (this.isCoordenador){
              let url = `https://docs.google.com/spreadsheets/d/${texto.idDocGoogle}/edit#gid=${texto.idPagina}`
              texto.texto = `<a target="_blank" href=${url}>${texto.texto}</a>`
            }
          }
          if(texto.formato){
            if (texto.formato === "0.0" && texto.texto !== ""){
              let valor: number = Number(texto.texto)
              if (!isNaN(valor)){
                texto.texto = valor.toLocaleString("pt-BR", {maximumFractionDigits: 1, minimumFractionDigits: 1 })
              }
            }
            let psP = texto.formato.indexOf('%')
            if (psP != -1 && texto.texto !== ""){
              let ps = texto.formato.indexOf('.')
              let zeros = psP - ps - 1
              let valor: number = Number(texto.texto)
              if (!isNaN(valor)){
                texto.texto = valor.toLocaleString("pt-BR", {style: "percent", maximumFractionDigits: zeros, minimumFractionDigits: zeros })
              }
            }
          }
        })
      }))
    }))
  }
}
