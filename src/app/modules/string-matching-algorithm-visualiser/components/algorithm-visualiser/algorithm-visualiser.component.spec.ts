// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AlgorithmVisualiserComponent } from './algorithm-visualiser.component';
// import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
// import { OptionService } from '../../services/option.service';
// import { ThemeSelectorService } from '../../services/theme-selector.service';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// describe("AlgorithmVisualiserComponent", () => {
//   let component: AlgorithmVisualiserComponent;
//   let fixture: ComponentFixture<AlgorithmVisualiserComponent>;
//   let optionServiceSpy: jasmine.SpyObj<OptionService>;
//   let themeSelectorServiceSpy: jasmine.SpyObj<ThemeSelectorService>;
//   let algorithmProgressServiceSpy: jasmine.SpyObj<AlgorithmProgressService>;


//   beforeEach(() => {
//     algorithmProgressServiceSpy = jasmine.createSpyObj('AlgorithmProgressService', ["extraCanvasGetter" , "speedGetter"]);
//     algorithmProgressServiceSpy.extraCanvasGetter.and.returnValue(null);
//     algorithmProgressServiceSpy.speedGetter.and.returnValue(1);

//     TestBed.configureTestingModule({
//         declarations: [AlgorithmVisualiserComponent],
//         imports: [CommonModule, BrowserAnimationsModule],
//         providers: [
//           {provide : AlgorithmProgressService , useValue : algorithmProgressServiceSpy},
//           {provide : ThemeSelectorService , useValue : themeSelectorServiceSpy},
//           {provide: OptionService, useValue : optionServiceSpy},
//         ],
//         schemas: [
//           NO_ERRORS_SCHEMA
//         ]
//       }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AlgorithmVisualiserComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });


//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   // it("should create a single canvas and drawer", () => {
//   //   expect(component.drawingServices.length).toEqual(1);
//   //   // expect(component.drawingServices.)
//   // });

//   // it("should create a main dr")

// });
