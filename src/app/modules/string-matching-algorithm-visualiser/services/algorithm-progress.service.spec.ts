import { TestBed } from '@angular/core/testing';

import { AlgorithmProgressService } from './algorithm-progress.service';

describe('PlaybackServiceService', () => {
  let service: AlgorithmProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgorithmProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
