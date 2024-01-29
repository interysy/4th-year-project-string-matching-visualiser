import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.dev';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents(); // Don't forget to call compileComponents
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faGithub, faLinkedin, faCompass);
    fixture.detectChanges();
  });

  it("should create navbar", () => {
    expect(component).toBeTruthy();
  });

  it("should display links to algorithms", () => {
    for (const algorithm of environment.supportedAlgorithms) {
      expect(fixture.nativeElement.querySelector(".algorithms").textContent).toContain(algorithm.name);
    }
  });

  it("should toggle mobile menu", () => {
    const initialClassList = component.mobileMenu.nativeElement.classList.value;

    component.toggleMobileMenu();
    fixture.detectChanges();

    const afterToggleClassList = component.mobileMenu.nativeElement.classList.value;
    expect(afterToggleClassList).not.toBe(initialClassList);
  });

  it("should hide mobile menu on window resize if window width > 768", fakeAsync(() => {
    component.mobileMenu.nativeElement.classList.remove('hidden');

    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    window.dispatchEvent(new Event("resize"));
    tick(300);

    fixture.detectChanges();
    expect(component.mobileMenu.nativeElement.classList.contains("hidden")).toBe(true);
  }));

  it("should show mobile menu on window resize if window width < 768 and toggle", fakeAsync(() => {
    Object.defineProperty(window, "innerWidth", { value: 750, configurable: true });

    window.dispatchEvent(new Event("resize"));
    tick(300);
    component.toggleMobileMenu();

    fixture.detectChanges();
    expect(component.mobileMenu.nativeElement.classList.contains("hidden")).toBe(false);
    const mobileMenu = fixture.nativeElement.querySelector('#mobile-menu');
    expect(mobileMenu).toBeTruthy();
  }));

  it("should navigate to the specified path", fakeAsync(() => {
    const path = "/about";

    component.changePage(path);
    tick();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(path);
  }));

  it("should not navigate if the path is the same as the current URL", fakeAsync(() => {
    const path = component.router.url;

    component.changePage(path);
    tick();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  }));
});
