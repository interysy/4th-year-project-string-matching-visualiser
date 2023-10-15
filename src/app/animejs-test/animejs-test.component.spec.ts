import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimejsTestComponent } from './animejs-test.component';

describe('AnimejsTestComponent', () => {
  let component: AnimejsTestComponent;
  let fixture: ComponentFixture<AnimejsTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimejsTestComponent]
    });
    fixture = TestBed.createComponent(AnimejsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
