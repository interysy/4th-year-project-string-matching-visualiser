import { TestBed } from '@angular/core/testing';

import { P5jsDrawServiceService } from './p5js-draw-service.service';

describe('P5jsDrawServiceService', () => {
  let service: P5jsDrawServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P5jsDrawServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
