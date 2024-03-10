import { TestBed } from '@angular/core/testing';
import { ThemeSelectorService } from './theme-selector.service';
import { DarkGreenTheme } from '../themes/dark-green.theme';
import { DefaultTheme } from '../themes/default.theme';

describe("ThemeSelectorService", () => {
  let service: ThemeSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeSelectorService]
    });
    service = TestBed.inject(ThemeSelectorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should have a default theme of 'base'", () => {
    expect(service.currentThemeGetter).toEqual('theme-dark-green');
  });

  it("should notify subscribers when the theme changes", () => {
    let notifiedTheme: string | undefined;
    service.themeChangedSubscriberGetter.subscribe((theme) => {
      notifiedTheme = theme;
    });

    const newTheme = "theme-dark-green";
    service.themeSetter = newTheme;

    expect(notifiedTheme).toEqual(newTheme);
  });

  it("should update the current theme object when the theme changes", () => {
    const newTheme = "theme-dark-green";
    service.themeSetter = newTheme;

    const themeObject = service.currentThemeObjectGetter;
    expect(themeObject).toBeDefined();
    expect(themeObject).toBeInstanceOf(DarkGreenTheme);
  });

  it("should not update the current theme object when the theme changes to one that does not exist", () => {
    const newTheme = "dark";
    service.themeSetter = newTheme;

    const themeObject = service.currentThemeObjectGetter;
    expect(themeObject).toBeDefined();
    expect(themeObject).toBeInstanceOf(DarkGreenTheme);
    expect(service.currentThemeGetter).toEqual("theme-dark-green");
  });


  it("should not notify subscribers when the theme changes to one that does not exist", () => {
    let notifiedTheme: string | undefined;
    service.themeChangedSubscriberGetter.subscribe((theme) => {
      notifiedTheme = theme;
    });

    const newTheme = "theme";
    service.themeSetter = newTheme;

    expect(notifiedTheme).toBeUndefined();
  });

});
