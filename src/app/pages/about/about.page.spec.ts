import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPageComponent } from './about.page';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';

describe('AboutPageComponent', () => {
  let component: AboutPageComponent;
  let fixture: ComponentFixture<AboutPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AboutPageComponent,
        NavbarComponent
      ],
      imports: [
        FontAwesomeModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faGithub, faLinkedin, faCompass);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
