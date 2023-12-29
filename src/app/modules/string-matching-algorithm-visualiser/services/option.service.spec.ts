import { TestBed } from '@angular/core/testing';
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
    expect(service.textGetter).toEqual(service.DefaultText);
    expect(service.patternGetter).toEqual(service.DefaultPattern);
    expect(service.smoothAnimationsGetter).toBeFalsy();
    expect(service.preProcessingStepsGetter).toBeTruthy();
    expect(service.showLegendGetter).toBeFalsy();
  });

  it("should notify subscribers when text changes", () => {
    let notifiedText: string | undefined;
    service.textChangedSubscriberGetter.subscribe((text) => {
      notifiedText = text;
    });

    const newText = "this is a new text to search";
    service.textSetter = newText;

    expect(notifiedText).toEqual(newText);
  });

  it("should notify subscribers when pattern changes", () => {
    let notifiedPattern: string | undefined;
    service.patternChangedSubscriberGetter.subscribe((pattern) => {
      notifiedPattern = pattern;
    });

    const newPattern = "new pattern to look for";
    service.patternSetter = newPattern;

    expect(notifiedPattern).toEqual(newPattern);
  });

  it("should notify subscribers when smooth animations change", () => {
    let notifiedSmoothAnimations: boolean | undefined;
    service.smoothAnimationsChangedSubscriberGetter.subscribe((smoothAnimations) => {
      notifiedSmoothAnimations = smoothAnimations;
    });

    const newSmoothAnimations = true;
    service.smoothAnimationsSetter = !service.smoothAnimationsGetter;

    expect(notifiedSmoothAnimations).toEqual(newSmoothAnimations);
  });

  it("should notify subscribers when pre-processing steps change", () => {
    let notifiedPreProcessingSteps: boolean | undefined;
    service.preProcessingStepsChangedSubscriberGetter.subscribe((preProcessingSteps) => {
      notifiedPreProcessingSteps = preProcessingSteps;
    });

    const newPreProcessingSteps = !service.preProcessingStepsGetter;
    service.preProcessingStepsSetter = newPreProcessingSteps;

    expect(notifiedPreProcessingSteps).toEqual(newPreProcessingSteps);
  });

  it("should notify subscribers when show legend changes", () => {
    let notifiedShowLegend: boolean | undefined;
    service.showLegendChangedSubscriberGetter.subscribe((showLegend) => {
      notifiedShowLegend = showLegend;
    });

    const newShowLegend = true;
    service.showLegendSetter = !service.showLegendGetter;

    expect(notifiedShowLegend).toEqual(newShowLegend);
  });
});
