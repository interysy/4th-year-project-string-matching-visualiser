import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Theme } from '../themes/theme';

/**
 * @description This service is responsible for changing active theme of the application.
 */
@Injectable({
  providedIn: "root"
})
export class ThemeSelectorService {

  /**
    * @description The current theme is used to keep track of the current theme of the application.
  */
  private _currentTheme : string;

  /**
    * @description The current theme object is used to keep track of the current theme object of the application.
    * This object can be referenced to grab the colours of the current theme.
  */
  private _currentThemeObject : Theme;

  /**
    * @description The notifier is used to notify the components that the theme has changed.
    * It allows the implementation of the observer pattern, where each component receives a notification upon change.
  */
  private _themeChangedObserver$ : Subject<string> = new Subject<string>();

  /**
   * @description The themes object is used to keep track of all the themes of the application. Loaded upon initialisation.
   */
  private _themes;

  /**
   * @description The constructor initialises the themes object and sets the current theme to the base theme.
   */
  constructor() {
    this._themes = environment.themes;
    this._currentTheme = environment.defaultTheme;
    this._currentThemeObject = new this._themes[this._currentTheme as keyof  typeof environment.themes].themeObject();
  }

  /**
   * @description This function is used to change the theme.
   * Typically implemented by the root HTML component.
   * @param theme The theme to change to.
   *
   */
  set themeSetter(theme : string) {
    const themeAsKeyOfThemes = theme as keyof typeof environment.themes;
    const newThemeObject = this._themes[themeAsKeyOfThemes];
    if (newThemeObject) {
      this._currentThemeObject = new newThemeObject.themeObject();
      this._currentTheme = theme;
      this._themeChangedObserver$.next(theme);
    }
  }

  /**
   * @description This function is used to get the current theme.
   * @returns string The theme name
   */
  get currentThemeGetter() : string {
    return this._currentTheme;
  }

  /**
   * @description This function is used to get the the theme subscription to be notified of theme changes.
   * @returns Subject<string> The theme changed observer
   */
  get themeChangedSubscriberGetter() : Subject<string> {
    return this._themeChangedObserver$;
  }

  /**
   * @description This function is used to get the current theme object. Object contains all colours required for the theme.
   * @returns Theme The theme object.
   */
  get currentThemeObjectGetter() : Theme {
    return this._currentThemeObject;
  }

}
