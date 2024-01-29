import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ThemeSelectorService } from './modules/string-matching-algorithm-visualiser/services/theme-selector.service';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockedThemeChangedObserver$ = new Subject<string>();

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent],
    providers: [
      { provide: ThemeSelectorService, useClass : class {
        themeChangedSubscriberGetter = mockedThemeChangedObserver$
        currentThemeGetter = "base"
      } }
    ]
  })});

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });


  it("should create the app", () => {
    expect(app).toBeTruthy();
  });

  it("should create themingDiv overlooking DOM" , () => {
    expect(app.themingDivElement).toBeTruthy();
  });

  it("should apply the initial theme from the service", () => {

    mockedThemeChangedObserver$.next("base")
    fixture.detectChanges();

    expect(app.currentTheme).toBe("base");
    expect(app.themingDivElement.nativeElement.classList.contains("base")).toBe(true);
  });

  it("should update theme on theme change", fakeAsync(() => {

    mockedThemeChangedObserver$.next("new-theme");

    fixture.detectChanges();
    tick();

    expect(app.currentTheme).toBe("new-theme");
    expect(app.themingDivElement.nativeElement.classList.contains("new-theme")).toBe(true);
  }));

  it("should unsubscribe from themeChangedSubscriberGetter on destroy" , () => {
    app.ngOnDestroy();
    expect(app.subscriptions[0].closed).toBe(true);
  });

});
