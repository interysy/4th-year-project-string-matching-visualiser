import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { implementedAlgorithmsGuard } from './implemented-algorithms.guard';

describe('implementedAlgorithmsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => implementedAlgorithmsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
