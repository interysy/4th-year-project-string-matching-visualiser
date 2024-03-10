import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { OptionService } from '../../services/option.service';
import { ThemeSelectorService } from 'src/app/modules/string-matching-algorithm-visualiser/services/theme-selector.service';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject } from 'rxjs';
import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let optionServiceSpy: jasmine.SpyObj<OptionService>;
  let themeSelectorServiceSpy: jasmine.SpyObj<ThemeSelectorService>;
  let algorithmProgressServiceSpy: jasmine.SpyObj<AlgorithmProgressService>;

  const textChangedSubscriberFake = new Subject<string>;
  const patternChangedSubscriberFake = new Subject<string>;



  beforeEach(() => {
    optionServiceSpy = jasmine.createSpyObj('OptionService', [
      "textGetter",
      "patternGetter",
      "smoothAnimationsGetter",
      "preProcessingStepsGetter",
      "showLegendGetter",
      "textSetter",
      "patternChangedSubscriberGetter",
      "patternSetter",
      "textChangedSubscriberGetter",
    ]);
    optionServiceSpy.textChangedSubscriberGetter.and.returnValue(textChangedSubscriberFake);
    optionServiceSpy.patternChangedSubscriberGetter.and.returnValue(patternChangedSubscriberFake);
    optionServiceSpy.patternGetter.and.returnValue("test pattern");
    optionServiceSpy.textGetter.and.returnValue("test text");


    themeSelectorServiceSpy = jasmine.createSpyObj('ThemeSelectorService', ['currentThemeGetter']);
    algorithmProgressServiceSpy = jasmine.createSpyObj('AlgorithmProgressService', ['algorithmNameGetter']);

    TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [FontAwesomeModule ,  FormsModule],
      providers: [
        { provide: OptionService, useValue : optionServiceSpy},
        { provide: ThemeSelectorService, useClass : class {} },
        { provide: AlgorithmProgressService, useValue : algorithmProgressServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faGear, faXmark, faCheck);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create with initial values" , fakeAsync(() => {
    const textInputField = fixture.debugElement.query(By.css('#text')).nativeElement;
    const patternInputField = fixture.debugElement.query(By.css('#pattern')).nativeElement;
    const preProcessingCheckBox = fixture.debugElement.query(By.css('#preProcessingSteps')).nativeElement;
    const smoothAnimationsCheckBox = fixture.debugElement.query(By.css('#smoothAnimations')).nativeElement;
    const showLegendCheckBox = fixture.debugElement.query(By.css('#showLegend')).nativeElement;

    tick();
    fixture.detectChanges();

    expect(textInputField.value).toEqual("test text");
    expect(patternInputField.value).toEqual("test pattern");
    expect(preProcessingCheckBox.checked).toEqual(true);
    expect(smoothAnimationsCheckBox.checked).toEqual(false);
    expect(showLegendCheckBox.checked).toEqual(false);

  }));
});
