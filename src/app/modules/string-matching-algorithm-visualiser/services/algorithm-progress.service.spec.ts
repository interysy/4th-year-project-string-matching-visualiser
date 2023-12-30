import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlgorithmProgressService } from './algorithm-progress.service';
import { OptionService } from './option.service';
import { Subject } from 'rxjs';
import { StringMatchingAlgorithmStub } from '../stubs/string-matching.algorithm.stub';
import { StringMatchingAlgorithmStub2 } from '../stubs/string-matching2.algorithm.stub';


describe("AlgorithmProgressService", () => {
  let service: AlgorithmProgressService;
  let textChangedSubject$: Subject<string>;
  let patternChangedSubject$: Subject<string>;
  let preProcessingStepsChangedSubject$ : Subject<boolean>;

  function setUpConfig(preProcessingSteps : boolean) {
    TestBed.configureTestingModule({
        imports: [],
        providers: [
          AlgorithmProgressService,
          {provide: OptionService, useClass : class {
              textChangedSubscriberGetter = textChangedSubject$;
              patternChangedSubscriberGetter = patternChangedSubject$;
              preProcessingStepsChangedSubscriberGetter = preProcessingStepsChangedSubject$;
              textGetter = "test-text";
              patternGetter = "test-pattern";
              preProcessingStepsGetter = preProcessingSteps;
              }
          }
      ],
      }).compileComponents();
}


  beforeEach(() => {
    textChangedSubject$ = new Subject<string>();
    patternChangedSubject$ = new Subject<string>();
    preProcessingStepsChangedSubject$ = new Subject<boolean>();

    setUpConfig(true);

    service = TestBed.inject(AlgorithmProgressService);
  });

  beforeEach(() => {
    const decorators: any[] = [];
    service.injectAlgorithm(StringMatchingAlgorithmStub, decorators, false, null);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should be created with default values" , () => {
    expect(service.currentStepNumberGetter).toBe(0);
    expect(service.currentlyPlayingGetter).toBe(false);
    expect(service.speedGetter).toBe(service.DefaultSpeed);
  });

  it("should be created with relevant subscriptions" , () => {
    expect(service.subscriptions.length).toBe(3);
    service.subscriptions.forEach(subscription => {
        expect(subscription.closed).toBe(false);
    });
  });

  it('should inject algorithm and execute it', () => {
    expect(service.algorithmNameGetter).toBe("stubbed-algorithm");
    expect(service.amountOfStepsGetter).toBe(100);
  });


  it("should move to the next step", () => {
    const initialStep = service.currentStepNumberGetter;

    service.moveToNextStep();

    expect(service.currentStepNumberGetter).toBe(initialStep + 1);
  });

  it("should move to the previous step", () => {
    service.moveToNextStep();
    const initialStep = service.currentStepNumberGetter;

    service.moveToPreviousStep();

    expect(service.currentStepNumberGetter).toBe(initialStep - 1);
  });

  it("should pause and play the algorithm", fakeAsync(() => {

    service.play();

    tick();

    expect(service.currentlyPlayingGetter).toBe(true);

    service.pause();

    tick();

    expect(service.currentlyPlayingGetter).toBe(false);
  }));

  it('should change the speed of playback', () => {
    service.changeSpeedOfPlayback(500);
    expect(service.speedGetter).toBe(500);

    service.changeSpeedOfPlayback(1000);
    expect(service.speedGetter).toBe(1000);
  });

  it("should change algorithm when re-injected", fakeAsync(() => {
    const initialAmountOfSteps = service.amountOfStepsGetter;

    tick();

    service.moveToNextStep();
    service.injectAlgorithm(StringMatchingAlgorithmStub2 , [] , false, null);

    tick();

    expect(service.algorithmNameGetter).toEqual("stubbed-algorithm-2");
    expect(service.currentStepNumberGetter).toEqual(0);
    expect(service.amountOfStepsGetter).toBe(50);
    expect(service.amountOfStepsGetter).toBeLessThan(initialAmountOfSteps);
  }));

  it("should reset progress" , fakeAsync(() => {
    service.moveToNextStep();
    service.play();

    tick();

    service.resetProgress();

    expect(service.currentStepNumberGetter).toEqual(0);
    expect(service.currentlyPlayingGetter).toBeFalsy();
  }));

  it("should filter out preprocessing steps", fakeAsync(() => {
    const initialAmountOfSteps = service.amountOfStepsGetter;

    TestBed.resetTestingModule();
    setUpConfig(false);

    service = TestBed.inject(AlgorithmProgressService);
    const decorators: any[] = [];
    service.injectAlgorithm(StringMatchingAlgorithmStub, decorators, false, null);

    tick();

    expect(service.amountOfStepsGetter).toBeLessThan(initialAmountOfSteps);

  }));

  it("should notify of step change" , fakeAsync(() => {
    let notifiedStepChange: number | undefined;
    service.stepChangedSubscriberGetter.subscribe((stepNumber) => {
      notifiedStepChange = stepNumber;
    });

    const newStep = 5;
    service.currentStepNumberSetter = newStep;

    expect(notifiedStepChange).toEqual(newStep);
  }));

});

