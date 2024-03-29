import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ItemMapa } from 'src/app/models/mapa.model';
import { MapaListService } from 'src/app/services/mapa-list.service';

@Component({
  selector: 'app-mapa-list',
  templateUrl: './mapa-list.component.html',
  styleUrls: ['./mapa-list.component.scss']
})
export class MapaListComponent implements OnInit {
  @Input() idGoogle: string = ""
  @Input() idGrade: string = ""
  @Input() idCurso: string = ""
  @Input() colecao: string = ""
  itens: ItemMapa[] = []

  colunasGrid = 0
  customStyle: string = `grid-template-columns: repeat(${this.colunasGrid}, auto)`

  constructor(private mapaService: MapaListService, private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.mapaService.getListGrade(this.idGrade).subscribe(grade => {
      this.itens = grade.itensMapa
      //let novoItem:ItemMapa={campoId: "idGoogle", colecao:"ciclosAvaliacao", ordem:"nomeDisciplina", titulo: "Ciclo Avaliação"}
      //this.itens.push(novoItem)
      this.colunasGrid = grade.colunasMapa
      this.customStyle = `grid-template-columns: repeat(${this.colunasGrid}, auto)`
      this.changeDetection.detectChanges()
    })
  }


}
