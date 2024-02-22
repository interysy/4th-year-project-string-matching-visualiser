import { Component , ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.dev';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { SharedRouterFunctions } from '../../functions/router.functions';

library.add(faCompass, faGithub, faLinkedin);


/**
 * @description
 * This component represents the navbar that will appear on each page.
 * It will contain logo and links to all pages.
*/
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  /**
   * @description The mobile menu element from the DOM
   */
  @ViewChild("mobileMenu", {static: true}) public mobileMenu: ElementRef<HTMLDivElement>;

  /**
   * @description
   * The environment variable, explicitly set for HTML access.
  */
  protected environment = environment;

  /**
   * @description Variable used to determine when mobile view should be triggered
   */
  protected readonly ResizeThreshold = 768;


  /**
   * @description The shared router functions, reused across compoonents.
   * @see SharedRouterFunctions
   */
  protected readonly sharedRounterFunctions = SharedRouterFunctions;


  /**
   * @description The CSS class to hide the mobile menu.
  **/
  private readonly HiddenClass = "hidden";

  /**
   * @description The constructor for the NavbarComponent.
   * @param router The router singleton to change pages upon link click.
   */
  constructor (readonly router : Router) {}


  /**
   * @description Class to open/hide the mobile menu when hamburger icon is clicked
   * @returns void
  */
  public toggleMobileMenu() : void {
    this.mobileMenu.nativeElement.classList.toggle(this.HiddenClass);
  }

  /**
   * @description A function to hide the mobile menu when the window is resized,
   * avoids bug where the mobile menu is still visible on a larger screen if not closed.
   * @returns void
   */
  @HostListener("window:resize")
  protected onResize() : void {
    const windowWidth = window.innerWidth;

    if (windowWidth > this.ResizeThreshold) {
      this.mobileMenu.nativeElement.classList.add(this.HiddenClass);
    }
  }
}
