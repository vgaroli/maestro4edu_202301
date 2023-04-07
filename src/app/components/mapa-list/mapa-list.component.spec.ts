import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaListComponent } from './mapa-list.component';

describe('MapaListComponent', () => {
  let component: MapaListComponent;
  let fixture: ComponentFixture<MapaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
