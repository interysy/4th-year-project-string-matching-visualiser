import { Component } from '@angular/core';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { environment } from 'src/environments/environment.dev';
import { Router } from '@angular/router';
import { ThemeSelectorService } from 'src/app/modules/string-matching-algorithm-visualiser/services/theme-selector.service';
import { SharedRouterFunctions } from 'src/app/shared/functions/router.functions';

library.add(faCompass, faGithub, faLinkedin);

/**
 * @description This component will contain an introduction to the project and links to all other pages
*/
@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})
export class HomePageComponent {

  /**
   * @description
   * The environment variable, explicitly set for HTML access.
  */
  protected environment = environment;


  /**
   * @description Boolean specifying whether the theme is light or dark.
   */
  protected isLightTheme = true;


  /**
   * @description The shared router functions, reused across compoonents. Used for linking to other pages.
   * @see SharedRouterFunctions
   */
  protected sharedRouterFunctions = SharedRouterFunctions;

  /**
   * @description The constructor for the NavbarComponent
   * @param router The router to change pages upon link click
   * @param themeSelectorService The service used to change the theme of the application
   */
  constructor (protected readonly router : Router , private readonly themeSelectorService: ThemeSelectorService) {
    this.pickTheme();
    this.themeSelectorService.themeChangedSubscriberGetter.subscribe(() => {
      this.pickTheme();
    });
  }

  /**
   * @description Function used to set the isLightTheme variable based on the HTML element.
   */
  private pickTheme() : void {
    if (this.themeSelectorService.currentThemeObjectGetter.HOME_PAGE_BACKGROUND.endsWith("dark.mov")) {
      this.isLightTheme = false;
    } else {
      this.isLightTheme = true;
    }
  }

  /**
   * @description Function used to toggle the theme of the application, home page can toggle between default and dark green.
   */
  protected toggleTheme() : void {
    const theme = this.isLightTheme ? "base" : "theme-dark-green"
    this.themeSelectorService.themeSetter = theme;
  }

  /**
   * @description Function used to get the theme of the application, used for testing.
   * @returns boolean
   */
  public getThemeTester() : boolean {
    if (environment.type == "dev") {
      return this.isLightTheme;
    }
    throw new Error("Attempting to use a dev function from a non-dev environment");
  }

  /**
   * @description Function used to set the theme of the application, used for testing.
   * @param theme The theme to set
   */
  public setThemeTester(theme : boolean) : void {
    if (environment.type == "dev") {
      this.isLightTheme = theme;
    } else {
      throw new Error("Attempting to use a dev function from a non-dev environment");
    }
  }

}
