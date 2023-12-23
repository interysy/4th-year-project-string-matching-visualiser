import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { DefaultTheme } from '../constants/default.theme';
import { DarkGreenTheme } from '../constants/dark-green.theme';
import { DarkBlueTheme } from '../constants/dark-blue.theme';


@Injectable({
  providedIn: 'root'
})
export class ThemeSelectorService {


  private currentTheme = "base";
  public currentThemeForDrawer : any = new DefaultTheme();
  protected themes = [{name : "base" , colorOne : "#FFFFFF" , colorTwo : "#E3E5EA" , themeObject : DefaultTheme} , {name : "theme-dark-green" , colorOne : "#2D333B" , colorTwo : "#29FD2F" , themeObject : DarkGreenTheme}, {name : "theme-dark-blue" , colorOne : "#2D333B" , colorTwo : "#1b7ced" , themeObject : DarkBlueTheme}];
  private themeChangedObserver$ : Subject<string> = new Subject<string>();

  set themeSetter(theme : string) {
    this.currentTheme = theme;
    this.themeChangedObserver$.next(theme);
    const newThemeObject = this.themes.find(themeToCompare => themeToCompare.name === theme);
    if (newThemeObject) this.currentThemeForDrawer = new newThemeObject.themeObject();
  }

  get currentThemeGetter() : string {
    return this.currentTheme;
  }

  get themeChangedSubscriberGetter() : Subject<string> {
    return this.themeChangedObserver$;
  }

}
