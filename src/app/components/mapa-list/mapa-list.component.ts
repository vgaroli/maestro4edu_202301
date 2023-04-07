import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ItemMapa } from 'src/app/models/escola.model';
import { MapaListService } from 'src/app/services/mapa-list.service';

@Component({
  selector: 'app-mapa-list',
  templateUrl: './mapa-list.component.html',
  styleUrls: ['./mapa-list.component.scss']
})
export class MapaListComponent implements OnInit {
  @Input() idGoogle: string = ""
  @Input() idGrade: string = ""
  @Input() colecao: string = ""
  itens: ItemMapa[] = []
  constructor(private mapaService: MapaListService, private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.mapaService.getListGrade(this.idGrade).subscribe(grade => {
      this.itens = grade.itensMapa
      this.changeDetection.detectChanges()
    })
  }


}
