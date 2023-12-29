import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Theme } from '../constants/matching-algorithm-colours.constant';

@Injectable({
  providedIn: 'root'
})
export class ThemeSelectorService {

  private _currentTheme : string;
  private _currentThemeObject : Theme;
  private _themeChangedObserver$ : Subject<string> = new Subject<string>();
  private _themes;

  constructor() {
    this._themes = environment.themes;
    this._currentTheme = "base";
    this._currentThemeObject= this._themes.base;
    this._currentThemeObject = new this._themes.base.themeObject();
  }

  set themeSetter(theme : string) {
    this._currentTheme = theme;
    this._themeChangedObserver$.next(theme);

    const themeAsKeyOfThemes = theme as keyof typeof environment.themes;
    const newThemeObject = this._themes[themeAsKeyOfThemes];
    if (newThemeObject) this._currentThemeObject = new newThemeObject.themeObject();
  }

  get currentThemeGetter() : string {
    return this._currentTheme;
  }

  get themeChangedSubscriberGetter() : Subject<string> {
    return this._themeChangedObserver$;
  }

  get currentThemeObjectGetter() : Theme {
    return this._currentThemeObject;
  }

}
