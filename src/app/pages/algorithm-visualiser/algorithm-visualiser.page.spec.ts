import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlgorithmVisualiserPageComponent } from './algorithm-visualiser.page';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { StringMatchingAlgorithmVisualiserModule } from 'src/app/modules/string-matching-algorithm-visualiser/string-matching-algorithm-visualiser.module';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmProgressService } from 'src/app/modules/string-matching-algorithm-visualiser/services/algorithm-progress.service';
import { BruteForceAlgorithm } from 'src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force/brute-force.algorithm';
import { Subject } from 'rxjs';
import { LegendDrawer } from 'src/app/modules/string-matching-algorithm-visualiser/drawers/legend.drawer';
import { BorderTableDrawer } from 'src/app/modules/string-matching-algorithm-visualiser/drawers/border-table.drawer';
import { AdditionalVariables } from 'src/app/modules/string-matching-algorithm-visualiser/models/additional-variables.model';

describe("AlgorithmVisualiserPageComponent", () => {
  let component: AlgorithmVisualiserPageComponent;
  let fixture: ComponentFixture<AlgorithmVisualiserPageComponent>;
  let algorithmProgressServiceSpy: jasmine.SpyObj<AlgorithmProgressService>;
  const stepChangedSubscriberFake : Subject<number> = new Subject<number>();
  const speedChangedSubscriberFake : Subject<number> = new Subject<number>();

  function configureTestingModule(data : any) {
    TestBed.configureTestingModule({
        declarations: [
          AlgorithmVisualiserPageComponent,
          NavbarComponent,
        ],
        imports: [
          FontAwesomeModule,
          StringMatchingAlgorithmVisualiserModule
        ],
        providers: [
          { provide: ActivatedRoute, useValue: {
              snapshot: { data : data }
          }},
          { provide: AlgorithmProgressService, useValue: algorithmProgressServiceSpy}
        ],
      }).compileComponents();
  }

  beforeEach(() => {
    algorithmProgressServiceSpy = jasmine.createSpyObj("AlgorithmProgressService",["injectAlgorithm" , "setTextAndPattern", "command" , "stepChangedSubscriberGetter" , "textLength" , "patternLength" , "currentStepNumberGetter", "speedGetter" , "algorithmNameGetter" , "currentlyPlayingGetter" , "amountOfStepsGetter" , "resetProgress" , "speedChangedSubscriberGetter" , "extraCanvasGetter" , "textIndex" , "patternIndex" , "textLength" , "patternLength", "additionalVariablesGetter"]);
    algorithmProgressServiceSpy.stepChangedSubscriberGetter.and.returnValue(stepChangedSubscriberFake);
    algorithmProgressServiceSpy.speedChangedSubscriberGetter.and.returnValue(speedChangedSubscriberFake);
    algorithmProgressServiceSpy.additionalVariablesGetter.and.returnValue(new AdditionalVariables());

    TestBed.configureTestingModule({
      declarations: [
        AlgorithmVisualiserPageComponent,
        NavbarComponent,
      ],
      imports: [
        FontAwesomeModule,
        StringMatchingAlgorithmVisualiserModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
            snapshot: { data : { requiredService : BruteForceAlgorithm , algorithmNameSlug : "brute-force", decorators : [LegendDrawer], preProcessingCanvas : false , preProcessingFunction : null } }
        }},
        { provide: AlgorithmProgressService, useValue: algorithmProgressServiceSpy},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmVisualiserPageComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faGithub, faLinkedin, faCompass, faQuestion);
    fixture.detectChanges();
  });

  it("should create page", () => {
    expect(component).toBeTruthy();
    expect(algorithmProgressServiceSpy.injectAlgorithm).toHaveBeenCalledWith(
        BruteForceAlgorithm,
        [LegendDrawer],
        false,
        null
        );
  });


  it("should handle ActivatedRoute data with different algorithm", () => {
    const newAlgorithm = class StringMatchingAlgorithm {};
    const newDecorators = [LegendDrawer, BorderTableDrawer];

    TestBed.resetTestingModule();

    configureTestingModule({
      requiredService: newAlgorithm,
      algorithmNameSlug: "new-algorithm",
      decorators: newDecorators,
      preProcessingCanvas : false,
      preProcessingFunction : null
    });

    fixture = TestBed.createComponent(AlgorithmVisualiserPageComponent);
    component = fixture.componentInstance;

    expect(algorithmProgressServiceSpy.injectAlgorithm).toHaveBeenCalledWith(
      newAlgorithm,
      newDecorators,
      false,
      null
    );
  });

});
