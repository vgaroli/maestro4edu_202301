import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaIdComponent } from './mapa-id.component';

describe('MapaIdComponent', () => {
  let component: MapaIdComponent;
  let fixture: ComponentFixture<MapaIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
