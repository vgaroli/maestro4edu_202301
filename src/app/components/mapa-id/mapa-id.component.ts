import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { PrincipalService } from 'src/app/services/principal.service';
import { SalasService } from 'src/app/services/salas.service';

@Component({
  selector: 'app-mapa-id',
  templateUrl: './mapa-id.component.html',
  styleUrls: ['./mapa-id.component.scss']
})
export class MapaIdComponent implements OnInit {
  @Input() idGoogle: string = ""
  nome: string = ""

  constructor(private principal: PrincipalService, private zone: NgZone,
    private salasService: SalasService, private changeDetection: ChangeDetectorRef) { }


  ngOnInit(): void {
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
    this.salasService.getMatricula(this.idGoogle).pipe(take(1)).subscribe(matricula => this.zone.run(() => {
      this.nome = matricula.nome
      //console.log(this.nome)
    }))
  }
}
