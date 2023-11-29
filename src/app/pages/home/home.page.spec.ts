import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home.page';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageComponent,
        NavbarComponent
      ],
      imports: [
        FontAwesomeModule
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
