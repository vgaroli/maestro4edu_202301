import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaShowComponent } from './mapa-show.component';

describe('MapaShowComponent', () => {
  let component: MapaShowComponent;
  let fixture: ComponentFixture<MapaShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
