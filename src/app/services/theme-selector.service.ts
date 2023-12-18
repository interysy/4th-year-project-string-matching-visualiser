import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ThemeSelectorService {


  private currentTheme = "base";
  private themeChangedObserver$ : Subject<string> = new Subject<string>();

  set themeSetter(theme : string) {
    this.currentTheme = theme;
    this.themeChangedObserver$.next(theme);
  }

  get currentThemeGetter() : string {
    return this.currentTheme;
  }

  get themeChangedSubscriberGetter() : Subject<string> {
    return this.themeChangedObserver$;
  }

}
