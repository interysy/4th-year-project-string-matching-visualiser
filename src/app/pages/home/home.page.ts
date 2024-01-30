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

  protected sharedRouterFunctions = SharedRouterFunctions;

  /**
   * @description The constructor for the NavbarComponent
   * @param router The router to change pages upon link click
   */
  constructor (protected readonly router : Router , private readonly themeSelectorService: ThemeSelectorService) {
    this.videoLink = this.themeSelectorService.currentThemeObjectGetter.HOME_PAGE_BACKGROUND;
    this.themeSelectorService.themeChangedSubscriberGetter.subscribe(() => {
      this.videoLink = this.themeSelectorService.currentThemeObjectGetter.HOME_PAGE_BACKGROUND;
    });
  }

  /**
   * Asynchronous function to change the page
   * @param path A string representing the path to the page
   * @returns Promise<void>
   */
  public async changePage(path : string) : Promise<void> {
    if (path === this.router.url) return;
    this.router.navigateByUrl(path);
  }
}
