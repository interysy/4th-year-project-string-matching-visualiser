import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThemeSelectorService } from './modules/string-matching-algorithm-visualiser/services/theme-selector.service';

/**
 * @description
 * Entry point to the application. This element is a div that overlooks the entire DOM. It is used to apply a theme to the whole app.
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * @description Title of the application
   */
  title = 'String Matching Algorithms Visualiser';


  /**
   * @description Reference to the div element that will be used to apply a theme to the whole app. The div
   * overlooks the entire DOM.
   */
  @ViewChild('themingDiv', {static: true})
  themingDivElement: ElementRef<HTMLDivElement>;

  /**
   * @description The current theme of the application, the actual class name applied to the div.
   */
  currentTheme : string;


  /**
   * @description Constructor. Injects the ThemeSelectorService from the StringMatchingVisualiserModule that will be used to change theme.
   * @param themeSelectorService
   */
  constructor(private readonly themeSelectorService: ThemeSelectorService) {
    this.currentTheme = themeSelectorService.currentThemeGetter;

    this.themeSelectorService.themeChangedSubscriberGetter.subscribe((newTheme : string) => {
      this.themingDivElement.nativeElement.classList.replace(this.currentTheme, newTheme);
      this.currentTheme = newTheme;
    });
  }
}
