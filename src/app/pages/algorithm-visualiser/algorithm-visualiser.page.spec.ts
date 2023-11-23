import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlgorithmVisualiserPageComponent } from './algorithm-visualiser.page';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { StringMatchingAlgorithmVisualiserModule } from 'src/app/modules/string-matching-algorithm-visualiser/string-matching-algorithm-visualiser.module';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmProgressService } from 'src/app/modules/string-matching-algorithm-visualiser/services/algorithm-progress.service';
import { BruteForceAlgorithm } from 'src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm';
import { TextAndPatternDrawer } from 'src/app/modules/string-matching-algorithm-visualiser/drawers/text-pattern.drawer.decorator';
import { Subject } from 'rxjs';
import { LastOccuranceTableDrawer } from 'src/app/modules/string-matching-algorithm-visualiser/drawers/last-occurance.drawer.decorator';
import { StringMatchingAlgorithm } from 'src/app/modules/string-matching-algorithm-visualiser/models/algorithm.model';
import { DrawStepDecorator } from 'src/app/modules/string-matching-algorithm-visualiser/models/drawer-step.decorator';
import { StringMatchingAlgorithmToDraw } from 'src/app/modules/string-matching-algorithm-visualiser/models/algorithm-draw.model';

describe('AlgorithmVisualiserPageComponent', () => {
  let component: AlgorithmVisualiserPageComponent;
  let fixture: ComponentFixture<AlgorithmVisualiserPageComponent>;
  let mockAlgorithmProgressService: {
    injectAlgorithm: jasmine.Spy;
    setTextAndPattern: jasmine.Spy;
    notifier: Subject<number>;
  };

  function configureTestingModule(data : any ) {
    TestBed.configureTestingModule({
        declarations: [
          AlgorithmVisualiserPageComponent,
          NavbarComponent
        ],
        imports: [
          FontAwesomeModule,
          StringMatchingAlgorithmVisualiserModule
        ],
        providers: [
          { provide: ActivatedRoute, useValue: {
              snapshot: { data : data }
          }},
          { provide: AlgorithmProgressService, useValue: mockAlgorithmProgressService}
        ],
      }).compileComponents();
  }

  beforeEach(() => {
    mockAlgorithmProgressService = jasmine.createSpyObj("AlgorithmProgressService",["injectAlgorithm" , "setTextAndPattern"]);
    mockAlgorithmProgressService.notifier = new Subject<number>();

    TestBed.configureTestingModule({
      declarations: [
        AlgorithmVisualiserPageComponent,
        NavbarComponent
      ],
      imports: [
        FontAwesomeModule,
        StringMatchingAlgorithmVisualiserModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
            snapshot: { data : { requiredService : BruteForceAlgorithm , algorithmNameSlug : "brute-force", decorators : [TextAndPatternDrawer] } }
        }},
        { provide: AlgorithmProgressService, useValue: mockAlgorithmProgressService}
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmVisualiserPageComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faGithub, faLinkedin, faCompass);
    fixture.detectChanges();
  });

  it('should create', () => {
  expect(component).toBeTruthy();
  expect(mockAlgorithmProgressService.injectAlgorithm).toHaveBeenCalledWith(
    BruteForceAlgorithm,
    'brute-force',
    [TextAndPatternDrawer]
    );
  });


  it('should handle ActivatedRoute data with different algorithm', () => {
    const newAlgorithm = class StringMatchingAlgorithm {};
    const newDecorators = [LastOccuranceTableDrawer, TextAndPatternDrawer];

    TestBed.resetTestingModule();

    configureTestingModule({
      requiredService: newAlgorithm,
      algorithmNameSlug: 'new-algorithm',
      decorators: newDecorators,
    });

    fixture = TestBed.createComponent(AlgorithmVisualiserPageComponent);
    component = fixture.componentInstance;

    expect(mockAlgorithmProgressService.injectAlgorithm).toHaveBeenCalledWith(
      newAlgorithm,
      'new-algorithm',
      newDecorators
    );
  });
});
