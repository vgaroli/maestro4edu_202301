import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaItemComponent } from './mapa-item.component';

describe('MapaItemComponent', () => {
  let component: MapaItemComponent;
  let fixture: ComponentFixture<MapaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
