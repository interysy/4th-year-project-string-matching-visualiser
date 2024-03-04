import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ThemeSelectorService } from './modules/string-matching-algorithm-visualiser/services/theme-selector.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

/**
 * @description
 * Entry point to the application. This element is a div that overlooks the entire DOM. It is used to apply a theme to the whole app.
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  /**
   * @description Title of the application
   */
  private title = 'String Matching Algorithms Visualiser';


  /**
   * @description Reference to the div element that will be used to apply a theme to the whole app. The div overlooks the entire DOM.
   */
  @ViewChild('themingDiv', {static: true})
  themingDivElement: ElementRef<HTMLDivElement>;


  /**
   * @description The current theme of the application, the actual class name applied to the div.
   */
  currentTheme : string;


  /**
   * @description The subscriptions from which the app receives updates.
   */
  subscriptions : Subscription[]  = [];


  /**
   * @description Constructor. Injects the ThemeSelectorService from the StringMatchingVisualiserModule that will be used to change theme.
   * @param themeSelectorService
   */
  constructor(private readonly themeSelectorService: ThemeSelectorService) {

    this.subscriptions.push(this.themeSelectorService.themeChangedSubscriberGetter.subscribe((newTheme : string) => {
      this.themingDivElement.nativeElement.classList.replace(this.currentTheme, newTheme);
      this.currentTheme = newTheme;
    }));
  }


  /**
   * @description After loading, apply the default theme to the div.
   */
  ngAfterViewInit() {
    this.currentTheme = this.themeSelectorService.currentThemeGetter;
    this.themingDivElement.nativeElement.classList.add(environment.defaultTheme);
  }


  /**
   * @description Unsubscribe from all subscriptions on destroy.
   */
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
