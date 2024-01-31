import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePageComponent } from './home.page';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

describe("HomePageComponent", () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageComponent,
        NavbarComponent
      ],
      imports: [
        FontAwesomeModule,
        FormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faGithub, faLinkedin, faCompass);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });


  it("should create home page with 3 buttons" , () => {
    const buttons = fixture.nativeElement.querySelectorAll("#home-page-div button");
    expect(buttons.length).toEqual(3);
    expect(buttons[0].textContent).toContain("Brute Force");
    expect(buttons[1].textContent).toContain("Boyer Moore");
    expect(buttons[2].textContent).toContain("Knuth-Morris-Pratt");
  });

  it("should initially have the light theme" , () => {
    expect(component.getThemeTester()).toEqual(true);
    const videoSource = fixture.nativeElement.querySelector("source");
    expect(videoSource.src).toContain("light.mov");
  });

  it("should toggle theme when attribute changed" , fakeAsync(() => {
    expect(component.getThemeTester()).toEqual(true);
    let videoSource = fixture.nativeElement.querySelector(".themeVideo");
    console.log(videoSource);
    expect(videoSource.src).toContain("light.mov");


    component.setThemeTester(false);

    tick();
    fixture.detectChanges();

    videoSource = fixture.nativeElement.querySelector(".themeVideo");
    expect(videoSource.src).toContain("dark.mov");
    expect(component.getThemeTester()).toEqual(false);
  }));
});
