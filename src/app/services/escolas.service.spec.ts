import { TestBed } from '@angular/core/testing';

import { EscolasService } from './escolas.service';

describe('EscolasService', () => {
  let service: EscolasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscolasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
