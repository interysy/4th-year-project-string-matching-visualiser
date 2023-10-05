import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmVisualiserPageComponent } from './algorithm-visualiser.page';

describe('AlgorithmVisualiserPageComponent', () => {
  let component: AlgorithmVisualiserPageComponent;
  let fixture: ComponentFixture<AlgorithmVisualiserPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlgorithmVisualiserPageComponent]
    });
    fixture = TestBed.createComponent(AlgorithmVisualiserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
