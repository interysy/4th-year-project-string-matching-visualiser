import { Component , ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.dev';

/**
 * @description
 * This component represents the navbar that will appear on each page
 * It will contain logo and links to all pages
*/
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  /**
   * @description
   * The mobile menu element from the DOM
   */
  @ViewChild('mobileMenu', {static: true}) protected mobileMenu: ElementRef<HTMLDivElement>;

  /**
   * @description
   * The environment variable, explicitly set for HTML access
   */
  protected environment = environment;


  /**
   * @description The constructor for the NavbarComponent
   * @param router The router to change pages upon link click
   */
  constructor (private readonly router : Router) {}


  /**
   * @description Class to open/hide the mobile menu when hamburger icon is clicked
   * @returns void
  */
  protected toggleMobileMenu() : void {
    this.mobileMenu.nativeElement.classList.toggle('hidden');
  }

  /**
   * @description A function to hide the mobile menu when the window is resized,
   * avoids bug where the mobile menu is still visible on a larger screen if not closed.
   * @returns void
   */
  @HostListener('window:resize')
  protected onResize() : void {
    const windowWidth = window.innerWidth;

    if (windowWidth > 768) {
      this.mobileMenu.nativeElement.classList.add('hidden');
    }
  }

  /**
   * Asynchronous function to change the page
   * @param path A string representing the path to the page
   * @returns Promise<void>
   */
  protected async changePage(path : string) : Promise<void> {
    if (path === this.router.url) return;
    this.router.navigateByUrl(path);
  }
}
