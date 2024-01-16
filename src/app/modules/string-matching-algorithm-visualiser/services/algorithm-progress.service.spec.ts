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
  let optionServiceSpy: jasmine.SpyObj<OptionService>;


  beforeEach(() => {
    textChangedSubject$ = new Subject<string>();
    patternChangedSubject$ = new Subject<string>();
    preProcessingStepsChangedSubject$ = new Subject<boolean>();
    optionServiceSpy = jasmine.createSpyObj('OptionService', [
        "textGetter",
        "patternGetter",
        "smoothAnimationsGetter",
        "preProcessingStepsGetter",
        "showLegendGetter",
        "textSetter",
        "patternSetter",
        "textChangedSubscriberGetter",
        "patternChangedSubscriberGetter",
        "preProcessingStepsChangedSubscriberGetter"

    ]);
    optionServiceSpy.textChangedSubscriberGetter.and.returnValue(textChangedSubject$);
    optionServiceSpy.patternChangedSubscriberGetter.and.returnValue(patternChangedSubject$);
    optionServiceSpy.preProcessingStepsChangedSubscriberGetter.and.returnValue(preProcessingStepsChangedSubject$);
    optionServiceSpy.preProcessingStepsGetter.and.returnValue(true);

    TestBed.configureTestingModule({
        imports: [],
        providers: [
          AlgorithmProgressService,
          {provide: OptionService, useValue :  optionServiceSpy},
      ],
    }).compileComponents();

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
    expect(service.currentStepNumberGetter()).toBe(0);
    expect(service.currentlyPlayingGetter()).toBe(false);
    expect(service.speedGetter()).toBe(service.DefaultSpeed);
  });

  it("should be created with relevant subscriptions" , () => {
    expect(service.subscriptions.length).toBe(3);
    service.subscriptions.forEach(subscription => {
        expect(subscription.closed).toBe(false);
    });
  });

  it('should inject algorithm and execute it', () => {
    expect(service.algorithmNameGetter()).toBe("stubbed-algorithm");
    expect(service.amountOfStepsGetter()).toBe(100);
  });


  it("should move to the next step", () => {
    const initialStep = service.currentStepNumberGetter();

    service.moveToNextStep();

    expect(service.currentStepNumberGetter()).toBe(initialStep + 1);
  });

  it("should not go beyond the last step" , () => {
    service.currentStepNumberSetter(service.amountOfStepsGetter()-1);

    service.moveToNextStep();

    expect(service.currentStepNumberGetter()).toBe(service.amountOfStepsGetter()-1);
  });

  it("should not go onto a negative step" , () => {
    service.currentStepNumberSetter(0);

    service.moveToPreviousStep();

    expect(service.currentStepNumberGetter()).toBe(0);
  });

  it("should move to the previous step", () => {
    service.moveToNextStep();
    const initialStep = service.currentStepNumberGetter();

    service.moveToPreviousStep();

    expect(service.currentStepNumberGetter()).toBe(initialStep - 1);
  });

  it("should pause and play the algorithm", fakeAsync(() => {

    service.play();

    tick();

    expect(service.currentlyPlayingGetter()).toBe(true);

    service.pause();

    tick();

    expect(service.currentlyPlayingGetter()).toBe(false);
  }));

  it('should change the speed of playback', () => {
    service.changeSpeedOfPlayback(500);
    expect(service.speedGetter()).toBe(500);

    service.changeSpeedOfPlayback(1000);
    expect(service.speedGetter()).toBe(1000);
  });

  it("should change the speed and notify subscribers about it", fakeAsync(() => {
    let notifiedSpeed: number | undefined;
    service.speedChangedSubscriberGetter().subscribe((speed) => {
      notifiedSpeed = speed;
    });

    const newSpeed = 500;
    service.changeSpeedOfPlayback(newSpeed);

    expect(notifiedSpeed).toEqual(newSpeed);
  }));

  it("should change algorithm when re-injected", fakeAsync(() => {
    const initialAmountOfSteps = service.amountOfStepsGetter();

    tick();

    service.moveToNextStep();
    service.injectAlgorithm(StringMatchingAlgorithmStub2 , [] , false, null);

    tick();

    expect(service.algorithmNameGetter()).toEqual("stubbed-algorithm-2");
    expect(service.currentStepNumberGetter()).toEqual(0);
    expect(service.amountOfStepsGetter()).toBe(50);
    expect(service.amountOfStepsGetter()).toBeLessThan(initialAmountOfSteps);
  }));

  it("should reset progress" , fakeAsync(() => {
    service.moveToNextStep();
    service.play();

    tick();

    service.resetProgress();

    expect(service.currentStepNumberGetter()).toEqual(0);
    expect(service.currentlyPlayingGetter()).toBeFalsy();
  }));

  it("should filter out preprocessing steps", fakeAsync(() => {

    optionServiceSpy.preProcessingStepsGetter.and.returnValue(true);

    tick();
    const initialAmountOfSteps = service.amountOfStepsGetter();

    preProcessingStepsChangedSubject$.next(false);

    tick();

    expect(service.amountOfStepsGetter()).toBeLessThan(initialAmountOfSteps);
  }));

  it("should notify of step change" , fakeAsync(() => {
    let notifiedStepChange: number | undefined;
    service.stepChangedSubscriberGetter().subscribe((stepNumber) => {
      notifiedStepChange = stepNumber;
    });

    const newStep = 5;
    service.currentStepNumberSetter(newStep);

    expect(notifiedStepChange).toEqual(newStep);
  }));

  it("should not notify of step change if not in the correct range" , () => {
    let notifiedStepChange: number | undefined;
    service.stepChangedSubscriberGetter().subscribe((stepNumber) => {
      notifiedStepChange = stepNumber;
    });

    const newStep = -1;
    service.currentStepNumberSetter(newStep);

    expect(notifiedStepChange).toBeUndefined();
  });

});

