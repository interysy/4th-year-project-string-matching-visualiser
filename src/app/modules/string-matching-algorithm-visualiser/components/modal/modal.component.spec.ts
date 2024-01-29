// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ModalComponent } from './modal.component';
// import { ElementRef } from '@angular/core';
// import { OptionService } from '../../services/option.service';
// import { ThemeSelectorService } from 'src/app/modules/string-matching-algorithm-visualiser/services/theme-selector.service';
// import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
// import { environment } from 'src/environments/environment.dev';
// import { Subject } from 'rxjs';
// import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { faCheck, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
// import { FormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';

// describe('ModalComponent', () => {
//   let component: ModalComponent;
//   let fixture: ComponentFixture<ModalComponent>;
//   let optionServiceSpy: jasmine.SpyObj<OptionService>;
//   let themeSelectorServiceSpy: jasmine.SpyObj<ThemeSelectorService>;
//   let algorithmProgressServiceSpy: jasmine.SpyObj<AlgorithmProgressService>;

//   const textChangedSubscriberFake = new Subject<string>;
//   const patternChangedSubscriberFake = new Subject<string>;



//   beforeEach(() => {
//     optionServiceSpy = jasmine.createSpyObj('OptionService', [
//       "textGetter",
//       "patternGetter",
//       "smoothAnimationsGetter",
//       "preProcessingStepsGetter",
//       "showLegendGetter",
//       "textSetter",
//       "patternChangedSubscriberGetter",
//       "patternSetter",
//       "textChangedSubscriberGetter",
//     ]);
//     optionServiceSpy.textChangedSubscriberGetter.and.returnValue(textChangedSubscriberFake);
//     optionServiceSpy.patternChangedSubscriberGetter.and.returnValue(patternChangedSubscriberFake);
//     optionServiceSpy.patternGetter.and.returnValue("test pattern");
//     optionServiceSpy.textGetter.and.returnValue("test text");


//     themeSelectorServiceSpy = jasmine.createSpyObj('ThemeSelectorService', ['currentThemeGetter']);
//     algorithmProgressServiceSpy = jasmine.createSpyObj('AlgorithmProgressService', ['algorithmNameGetter']);

//     TestBed.configureTestingModule({
//       declarations: [ModalComponent],
//       imports: [FontAwesomeModule ,  FormsModule],
//       providers: [
//         { provide: OptionService, useValue : optionServiceSpy},
//         { provide: ThemeSelectorService, useClass : class {} },
//         { provide: AlgorithmProgressService, useValue : algorithmProgressServiceSpy },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(ModalComponent);
//     component = fixture.componentInstance;
//     const faIconLibrary = TestBed.inject(FaIconLibrary);
//     faIconLibrary.addIcons(faGear, faXmark, faCheck);
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should create with initial values" , fakeAsync(() => {
//     const textInputField = fixture.debugElement.query(By.css('#text')).nativeElement;
//     const patternInputField = fixture.debugElement.query(By.css('#pattern')).nativeElement;
//     const preProcessingCheckBox = fixture.debugElement.query(By.css('#preProcessingSteps')).nativeElement;
//     const smoothAnimationsCheckBox = fixture.debugElement.query(By.css('#smoothAnimations')).nativeElement;
//     const showLegendCheckBox = fixture.debugElement.query(By.css('#showLegend')).nativeElement;

//     tick();
//     fixture.detectChanges();

//     expect(textInputField.value).toEqual("test text");
//     expect(patternInputField.value).toEqual("test pattern");
//     expect(preProcessingCheckBox.checked).toEqual(true);
//     expect(smoothAnimationsCheckBox.checked).toEqual(false);
//     expect(showLegendCheckBox.checked).toEqual(false);

//   }));


// //   it("should update text when sendTextToService is called", fakeAsync(() => {
// //     const newText = 'New test text';

// //     const inputField = fixture.debugElement.query(By.css("#text"));

// //     inputField.nativeElement.value = newText;
// //     inputField.nativeElement.dispatchEvent(new Event("ngModelChange"));


// //     fixture.whenStable().then(() => {
// //         expect(optionServiceSpy.patternSetter).toHaveBeenCalledWith(newText);
// //         expect(optionServiceSpy.patternChangedSubscriberGetter().next).toHaveBeenCalledWith(newText);
// //     });
// //   }));

// // it("should update pattern when sendPatternToService is called", fakeAsync(() => {
// //   const newPattern = "New test pattern";

// //   let patternField = fixture.debugElement.query(By.css('#pattern')).nativeElement;





// //   // Set the value programmatically
// //   patternField.ngModelChange = newPattern;

// //   // Dispatch an 'input' event
// //   patternField.dispatchEvent(new Event("input"));

// //   tick();
// //   fixture.detectChanges();

// //   patternField =  fixture.debugElement.query(By.css('#pattern')).nativeElement;


// //   expect(patternField.value).toBe(newPattern);
// //   expect(optionServiceSpy.patternSetter).toHaveBeenCalled();
// //   expect(optionServiceSpy.patternChangedSubscriberGetter().next).toHaveBeenCalled();
// // }));


// //   it('should update preprocessing steps when setPreprocessingSteps is called', () => {
// //     const newPreProcessingSteps = true;
// //     component.preProcessingSteps = newPreProcessingSteps;

// //     component.setPreprocessingSteps();

// //     expect(optionServiceSpy.preProcessingStepsSetter).toHaveBeenCalledWith(newPreProcessingSteps);
// //   });

// //   it('should update smooth animations when setSmoothAnimations is called', () => {
// //     const newSmoothAnimations = true;
// //     component.smoothAnimations = newSmoothAnimations;

// //     component.setSmoothAnimations();

// //     expect(optionServiceSpy.smoothAnimationsSetter).toHaveBeenCalledWith(newSmoothAnimations);
// //   });

// //   it('should update theme when selectTheme is called', () => {
// //     const newTheme = 'dark';
// //     component.selectTheme(newTheme);

// //     expect(component.selectedTheme).toEqual(newTheme);
// //     expect(themeSelectorServiceSpy.themeSetter).toHaveBeenCalledWith(newTheme);
// //   });

// //   it('should update show legend when setShowLegend is called', () => {
// //     const newShowLegend = true;
// //     component.showLegend = newShowLegend;

// //     component.setShowLegend();

// //     expect(optionServiceSpy.showLegendSetter).toHaveBeenCalledWith(newShowLegend);
// //   });

// //   it('should open modal when openModal is called', () => {
// //     const modalElement: ElementRef<HTMLDivElement> = jasmine.createSpyObj('ElementRef', ['nativeElement']);
// //     spyOn(component, 'openModal').and.callThrough();

// //     component.modalElement = modalElement;

// //     component.openModal();

// //     expect(modalElement.nativeElement.classList).not.toContain('hidden');
// //   });

// //   it('should close modal when closeModal is called', () => {
// //     const modalElement: ElementRef<HTMLDivElement> = jasmine.createSpyObj('ElementRef', ['nativeElement']);
// //     spyOn(component, 'closeModal').and.callThrough();

// //     component.modalElement = modalElement;

// //     component.closeModal();

// //     expect(modalElement.nativeElement.classList).toContain('hidden');
// //   });

// //   it('should centralize scroll when centraliseScroll is called', () => {
// //     spyOn(optionServiceSpy, 'centraliseScrollSetter').and.callThrough();

// //     component.centraliseScroll();

// //     expect(optionServiceSpy.centraliseScrollSetter).toHaveBeenCalledWith(true);
// //   });

// //   it('should return true for canAlgorithmDataBeCentralised when algorithm is in the centraliseScroll list', () => {
// //     const algorithmName = 'testAlgorithm';
// //     algorithmProgressServiceSpy.algorithmNameGetter = algorithmName;

// //     const result = component.canAlgorithmDataBeCentralised();

// //     expect(result).toBe(true);
// //   });

// //   it('should return false for canAlgorithmDataBeCentralised when algorithm is not in the centraliseScroll list', () => {
// //     const algorithmName = 'nonCentralisedAlgorithm';
// //     algorithmProgressServiceSpy.algorithmNameGetter = algorithmName;

// //     const result = component.canAlgorithmDataBeCentralised();

// //     expect(result).toBe(false);
// //   });
// });
