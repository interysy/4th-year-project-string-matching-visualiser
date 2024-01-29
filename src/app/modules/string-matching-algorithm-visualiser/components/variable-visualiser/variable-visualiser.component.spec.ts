import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableVisualiserComponent } from './variable-visualiser.component';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { AdditionalVariables } from '../../models/additional-variables.model';
import { KnuthMorrisPrattAdditionalVariables } from '../../models/knuth-morris-pratt-additional.model.';

describe("VariableVisualiserComponent", () => {
  let component: VariableVisualiserComponent;
  let fixture: ComponentFixture<VariableVisualiserComponent>;
  let algorithmProgressServiceSpy : jasmine.SpyObj<AlgorithmProgressService>;

  beforeEach(() => {
    algorithmProgressServiceSpy = jasmine.createSpyObj("AlgorithmProgressService" , ["textLength" , "patternLength" , "textIndex" , "patternIndex" , "additionalVariablesGetter" ]);
    algorithmProgressServiceSpy.additionalVariablesGetter.and.returnValue(new AdditionalVariables());

    TestBed.configureTestingModule({
      declarations: [VariableVisualiserComponent],
        providers : [
            {provide : AlgorithmProgressService , useValue : algorithmProgressServiceSpy}
        ]
    });
    fixture = TestBed.createComponent(VariableVisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display correct values for the variables that are ubiquitous" , () => {
    algorithmProgressServiceSpy.textLength.and.returnValue(5);
    algorithmProgressServiceSpy.patternLength.and.returnValue(2);
    algorithmProgressServiceSpy.textIndex.and.returnValue(0);
    algorithmProgressServiceSpy.patternIndex.and.returnValue(0);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#textLength").textContent).toContain("5");
    expect(fixture.nativeElement.querySelector("#patternLength").textContent).toContain("2");
    expect(fixture.nativeElement.querySelector("#textIndex").textContent).toContain("0");
    expect(fixture.nativeElement.querySelector("#patternIndex").textContent).toContain("0");
  });


  it("should show additional variables if they are present" , () => {

    const knuthMorrisPrattAdditionalVariables = new KnuthMorrisPrattAdditionalVariables();
    knuthMorrisPrattAdditionalVariables.i = 25;
    knuthMorrisPrattAdditionalVariables.j = 67;
    algorithmProgressServiceSpy.additionalVariablesGetter.and.returnValue(knuthMorrisPrattAdditionalVariables);

    fixture.detectChanges();

    const additionalVariableDivs = fixture.nativeElement.querySelectorAll(".additionalVariableDiv");

    expect(additionalVariableDivs.length).toEqual(2);

    expect(additionalVariableDivs[0].textContent).toContain("i : 25");
    expect(additionalVariableDivs[1].textContent).toContain("j : 67");

  });

  it("should not show additional variables if they are excluded in the config" , () => {

    const knuthMorrisPrattAdditionalVariables = new KnuthMorrisPrattAdditionalVariables();
    knuthMorrisPrattAdditionalVariables.i = 77;
    knuthMorrisPrattAdditionalVariables.j = 55;
    knuthMorrisPrattAdditionalVariables.borderTable = [1,2,3,4,5,6,7,8,9,10];
    algorithmProgressServiceSpy.additionalVariablesGetter.and.returnValue(knuthMorrisPrattAdditionalVariables);

    fixture.detectChanges();

    const additionalVariableDivs = fixture.nativeElement.querySelectorAll(".additionalVariableDiv");

    expect(additionalVariableDivs.length).toEqual(2);

    expect(additionalVariableDivs[0].textContent).toContain("i : 77");
    expect(additionalVariableDivs[1].textContent).toContain("j : 55");
  });
});
