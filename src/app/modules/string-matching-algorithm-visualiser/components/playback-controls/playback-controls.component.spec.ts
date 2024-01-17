import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlaybackControlsComponent } from './playback-controls.component';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject, Subscription } from 'rxjs';
import { SpeedAsMultiplierPipe } from '../../shared/pipes/speed.pipe';
import { By } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { faBackward, faCheck, faForward, faGear, faPause, faPlay, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalComponent } from '../modal/modal.component';

describe("PlaybackControlsComponent", () => {
  let component: PlaybackControlsComponent;
  let fixture: ComponentFixture<PlaybackControlsComponent>;
  let algorithmProgressServiceSpy: jasmine.SpyObj<AlgorithmProgressService>;
  const stepChangedSubscriberFake : Subject<number> = new Subject<number>();

  beforeEach(() => {
    algorithmProgressServiceSpy = jasmine.createSpyObj("AlgorithmProgressService", [
        "currentStepNumberGetter",
        "stepChangedSubscriberGetter",
        "speedGetter",
        "currentlyPlayingGetter",
        "amountOfStepsGetter",
        "algorithmNameGetter",
        "resetProgress",
        "moveToPreviousStep",
        "play",
        "moveToNextStep",
        "currentStepNumberSetter",
        "changeSpeedOfPlayback"
    ]);
    algorithmProgressServiceSpy.stepChangedSubscriberGetter.and.returnValue(stepChangedSubscriberFake);
    algorithmProgressServiceSpy.currentStepNumberGetter.and.returnValue(2);
    algorithmProgressServiceSpy.speedGetter.and.returnValue(1000);

    TestBed.configureTestingModule({
      declarations: [PlaybackControlsComponent, SpeedAsMultiplierPipe , ModalComponent],
      providers: [{ provide: AlgorithmProgressService, useValue: algorithmProgressServiceSpy }],
      imports: [FontAwesomeModule ,  FormsModule],
    });

    fixture = TestBed.createComponent(PlaybackControlsComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faBackward, faForward, faPlay ,faPause, faRotate , faGear, faXmark, faCheck);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize component with values currently held by the progress service", () => {
    fixture.detectChanges();

    expect(component.currentStepNumberGetter).toEqual(2);
    expect(component.currentSpeedGetter).toEqual(1000);
  });

  it("should call moveToPreviousStep when previous step button is clicked", fakeAsync(() => {

    const buttonToGoPreviousStep = fixture.debugElement.query(By.css("#previousStepButton"));
    buttonToGoPreviousStep.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();

    expect(algorithmProgressServiceSpy.moveToPreviousStep).toHaveBeenCalled();
  }));

  it("should call play when play is clicked", fakeAsync(() => {
    const buttonToGoPreviousStep = fixture.debugElement.query(By.css("#playButton"));
    buttonToGoPreviousStep.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();

    expect(algorithmProgressServiceSpy.play).toHaveBeenCalled();
  }));


  it("should display pause button when playing", fakeAsync(() => {

    algorithmProgressServiceSpy.currentlyPlayingGetter.and.returnValue(true);

    tick();
    fixture.detectChanges();

    const buttonToPlay = fixture.debugElement.query(By.css("#playButton"));
    const buttonToPause = fixture.debugElement.query(By.css("#pauseButton"));

    expect(buttonToPlay).toBeNull();
    expect(buttonToPause).toBeDefined();
  }));



  it("should call moveToNextStep when next step button is clicked", fakeAsync(() => {

    const buttonToGoPreviousStep = fixture.debugElement.query(By.css("#nextStepButton"));
    buttonToGoPreviousStep.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();

    expect(algorithmProgressServiceSpy.moveToNextStep).toHaveBeenCalled();
  }));

  it("should call resetProgress when reset button is clicked", fakeAsync(() => {

    const buttonToGoPreviousStep = fixture.debugElement.query(By.css("#resetButton"));
    buttonToGoPreviousStep.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();

    expect(algorithmProgressServiceSpy.resetProgress).toHaveBeenCalled();
  }));

  it("should update current step number when range element value is changed", () => {

    const rangeElement = fixture.debugElement.query(By.css("#stepSlider"));
    rangeElement.triggerEventHandler("change", {target : {value : 5}});
    fixture.detectChanges();

    expect(component.currentStepNumberGetter).toEqual(5);
    expect(algorithmProgressServiceSpy.currentStepNumberSetter).toHaveBeenCalledWith(5);
  });


  it("should update speed when range element value is changed", () => {

    const rangeElement = fixture.debugElement.query(By.css("#reversedSpeedSlider"));
    rangeElement.triggerEventHandler("change", {target : {value : 150}});

    fixture.detectChanges();

    expect(component.currentSpeedGetter).toEqual(150);
  });

  it("should disable forward and backward buttons when playing" , fakeAsync(() => {

      algorithmProgressServiceSpy.currentlyPlayingGetter.and.returnValue(true);

      tick();
      fixture.detectChanges();

      const buttonToGoPreviousStep = fixture.debugElement.query(By.css("#previousStepButton"));
      const buttonToGoNextStep = fixture.debugElement.query(By.css("#nextStepButton"));

      expect(buttonToGoPreviousStep.nativeElement.disabled).toBeTruthy();
      expect(buttonToGoNextStep.nativeElement.disabled).toBeTruthy();
  }));

  it("should unsubscribe from subscriptions", () => {

    component.ngOnDestroy();
    component.subscriptions.forEach((subscription : Subscription) => {
      expect(subscription.closed).toBeTruthy();
    });

  });
});
