import { TestBed } from '@angular/core/testing';

import { P5jsDrawService } from './p5js-draw.service';

describe('P5jsDrawService', () => {
  let service: P5jsDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P5jsDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
