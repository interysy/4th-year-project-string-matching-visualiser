import { TestBed } from '@angular/core/testing';

import { PseudocodeParserService } from './pseudocode-parser.service';

describe('PseudocodeParserService', () => {
  let service: PseudocodeParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudocodeParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
