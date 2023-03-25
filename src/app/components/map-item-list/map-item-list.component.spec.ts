import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapItemListComponent } from './map-item-list.component';

describe('MapItemListComponent', () => {
  let component: MapItemListComponent;
  let fixture: ComponentFixture<MapItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
