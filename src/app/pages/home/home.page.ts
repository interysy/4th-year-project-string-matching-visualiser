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
 * @description
 * This component will contain an introduction to the project and links to all other pages
*/
@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})
export class HomePageComponent {

  environment = environment;
  protected videoLink: string;
  protected isLightTheme = true;

  protected sharedRouterFunctions = SharedRouterFunctions;

  /**
   * @description The constructor for the NavbarComponent
   * @param router The router to change pages upon link click
   */
  constructor (protected readonly router : Router , private readonly themeSelectorService: ThemeSelectorService) {
    this.videoLink = this.themeSelectorService.currentThemeObjectGetter.HOME_PAGE_BACKGROUND;
    this.themeSelectorService.themeChangedSubscriberGetter.subscribe(() => {
      console.log("Changed on home page");
      console.log(this.videoLink)
      this.videoLink = this.themeSelectorService.currentThemeObjectGetter.HOME_PAGE_BACKGROUND;
      console.log(this.videoLink);
    });
  }

  protected toggleTheme() {
    const theme = this.isLightTheme ? "base" : "theme-dark-green"
    this.themeSelectorService.themeSetter = theme;
  }

}
