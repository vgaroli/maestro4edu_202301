import { TestBed } from '@angular/core/testing';

import { MapaListService } from './mapa-list.service';

describe('MapaListService', () => {
  let service: MapaListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
