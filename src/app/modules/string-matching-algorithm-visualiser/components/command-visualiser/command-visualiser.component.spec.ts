import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CommandVisualiserComponent } from './command-visualiser.component';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject} from 'rxjs';

describe("CommandVisualiserComponent", () => {
  let component: CommandVisualiserComponent;
  let fixture: ComponentFixture<CommandVisualiserComponent>;
  let algorithmProgressServiceSpy: jasmine.SpyObj<AlgorithmProgressService>;
  const stepChangedSubscriberFake = new Subject<number>;

  beforeEach(() => {
    algorithmProgressServiceSpy = jasmine.createSpyObj("AlgorithmProgressService", ["command", "stepChangedSubscriberGetter"]);
    algorithmProgressServiceSpy.command.and.returnValue("test command");
    algorithmProgressServiceSpy.stepChangedSubscriberGetter.and.returnValue(stepChangedSubscriberFake);

    TestBed.configureTestingModule({
      declarations: [CommandVisualiserComponent],
      providers: [
        { provide: AlgorithmProgressService, useValue: algorithmProgressServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(CommandVisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it("should get the current command on initialization", () => {
    expect(component.currentCommand).toBe("test command");
  });

  it("should update currentCommand on step change", fakeAsync(() => {

    const newCommand = "a brand new test command"
    algorithmProgressServiceSpy.command.and.returnValue(newCommand);
    stepChangedSubscriberFake.next(1);

    tick();

    expect(component.currentCommand).toBe(newCommand);
  }));

  it("should display current command", () => {
    const testCommand = "test";

    const componentElement = fixture.nativeElement;
    const h2Elements = componentElement.querySelectorAll("h2");

    expect(h2Elements.length).toEqual(1);
    expect(h2Elements[0].textContent).toContain(testCommand);
  });

  it("should display updated currentCommand", fakeAsync(() => {
    const newCommand = "a brand new test command"
    algorithmProgressServiceSpy.command.and.returnValue(newCommand);
    stepChangedSubscriberFake.next(1);

    tick();
    fixture.detectChanges();

    const componentElement = fixture.nativeElement;
    const h2Elements = componentElement.querySelectorAll("h2");

    expect(h2Elements.length).toEqual(1);
    expect(h2Elements[0].textContent).toContain(newCommand);
  }));

  it("should unsubscribe from subscriptions on ngOnDestroy", () => {
    component.ngOnDestroy();

    component.subscriptions.forEach(subscription => {
        expect(subscription.closed).toBe(true);
    });

  });

});
