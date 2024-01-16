import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OptionService } from './option.service';

describe('OptionService', () => {
  let service: OptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptionService]
    });
    service = TestBed.inject(OptionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should have default values", () => {
    expect(service.textGetter()).toEqual(service.DefaultText);
    expect(service.patternGetter()).toEqual(service.DefaultPattern);
    expect(service.smoothAnimationsGetter()).toBeFalsy();
    expect(service.preProcessingStepsGetter()).toBeTruthy();
    expect(service.showLegendGetter()).toBeFalsy();
  });

  it("should notify subscribers when text changes", () => {
    let notifiedText: string | undefined;
    service.textChangedSubscriberGetter().subscribe((text) => {
      notifiedText = text;
    });

    const newText = "this is a new text to search";
    service.textSetter(newText);

    expect(notifiedText).toEqual(newText);
  });

  it("should notify subscribers when pattern changes", fakeAsync(() => {
    let notifiedPattern: string | undefined;
    service.patternChangedSubscriberGetter().subscribe((pattern) => {
      notifiedPattern = pattern;
    });

    const newPattern = "new pattern to look for";
    service.patternSetter(newPattern);

    tick();

    expect(notifiedPattern).toEqual(newPattern);
  }));

  it("should notify subscribers when smooth animations change", fakeAsync(() => {
    let notifiedSmoothAnimations: boolean | undefined;
    service.smoothAnimationsChangedSubscriberGetter().subscribe((smoothAnimations) => {
      notifiedSmoothAnimations = smoothAnimations;
    });

    const newSmoothAnimations = !service.smoothAnimationsGetter;
    service.smoothAnimationsSetter(newSmoothAnimations);

    tick();

    expect(notifiedSmoothAnimations).toEqual(newSmoothAnimations);
  }));

  it("should notify subscribers when pre-processing steps change", fakeAsync(() => {
    let notifiedPreProcessingSteps: boolean | undefined;
    service.preProcessingStepsChangedSubscriberGetter().subscribe((preProcessingSteps) => {
      notifiedPreProcessingSteps = preProcessingSteps;
    });

    const newPreProcessingSteps = !service.preProcessingStepsGetter;
    service.preProcessingStepsSetter(newPreProcessingSteps);

    tick();

    expect(notifiedPreProcessingSteps).toEqual(newPreProcessingSteps);
  }));

  it("should notify subscribers when show legend changes", fakeAsync(() => {
    let notifiedShowLegend: boolean | undefined;
    service.showLegendChangedSubscriberGetter().subscribe((showLegend) => {
      notifiedShowLegend = showLegend;
    });

    const newShowLegend = !service.showLegendGetter;
    service.showLegendSetter(newShowLegend);

    expect(notifiedShowLegend).toEqual(newShowLegend);
  }));


});
