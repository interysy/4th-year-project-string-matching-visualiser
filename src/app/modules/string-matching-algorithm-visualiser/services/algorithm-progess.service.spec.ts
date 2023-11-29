import { TestBed } from '@angular/core/testing';
import { AlgorithmProgressService } from './algorithm-progress.service';
import { BruteForceAlgorithm } from '../algorithms/brute-force.algorithm';
import { TextAndPatternDrawer } from '../drawers/text-pattern.drawer.decorator';
import { LastOccuranceTableDrawer } from '../drawers/last-occurance.drawer.decorator';


describe('AlgorithmProgressService', () => {
  let service: AlgorithmProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [AlgorithmProgressService],
    });

    service = TestBed.inject(AlgorithmProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  beforeEach(() => {
    const newAlgorithm = BruteForceAlgorithm ;
    const newDecorators = [LastOccuranceTableDrawer, TextAndPatternDrawer];
    service.injectAlgorithm(newAlgorithm, 'test-algorithm', newDecorators);
  });

  it('should inject and execute an algorithm', () => {
    service.setTextAndPattern('test-text', 'test-pattern');
    service.executeAlgorithm();

    // Add more assertions based on your service behavior
    expect(service.currentStepNumberGetter).toBe(0);
    expect(service.amountOfStepsGetter).toBeGreaterThan(0);
  });

  it('should move to the next step', () => {
    service.setTextAndPattern('test-text', 'test-pattern');
    service.executeAlgorithm();
    const initialStep = service.currentStepNumberGetter;

    service.moveToNextStep();
    expect(service.currentStepNumberGetter).toBe(initialStep + 1);
  });

  it('should move to the previous step', () => {
    service.setTextAndPattern('test-text', 'test-pattern');
    service.executeAlgorithm();
    service.moveToNextStep();
    const initialStep = service.currentStepNumberGetter;

    service.moveToPreviousStep();
    expect(service.currentStepNumberGetter).toBe(initialStep - 1);
  });

  it('should pause and play the algorithm', async () => {
    service.setTextAndPattern('test-text', 'test-pattern');
    service.executeAlgorithm();

    service.play();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Allow some time for play to start

    expect(service.currentlyPlayingGetter).toBe(true);

    service.pause();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Allow some time for pause to take effect

    expect(service.currentlyPlayingGetter).toBe(false);
  });

  it('should change the speed of playback', () => {
    service.changeSpeedOfPlayback(500);
    expect(service.speedGetter).toBe(500);

    service.changeSpeedOfPlayback(1000);
    expect(service.speedGetter).toBe(1000);
  });

});

