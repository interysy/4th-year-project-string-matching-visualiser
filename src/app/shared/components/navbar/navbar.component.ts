import { Component , ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.dev';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @ViewChild('mobileMenu', {static: true}) mobileMenu: ElementRef<HTMLDivElement>;

  environment = environment;
  // will be exported onto a config file - added as an issue to backlog - #43
  algorithms = [
    "Brute Force",
    "Boyer-Moore",
    "Knuth-Morris-Pratt",
  ];

  constructor (private readonly router : Router) {}
  /**
   * A class to toggle the mobile menu on a smaller screen
   */
  toggleMobileMenu() {
    this.mobileMenu.nativeElement.classList.toggle('hidden');
  }

  /**
   * A function to hide the mobile menu when the window is resized,
   * avoids bug where the mobile menu is still visible on a larger screen if not closed
   */
  @HostListener('window:resize')
  onResize() {
    const windowWidth = window.innerWidth;

    if (windowWidth > 768) {
      this.mobileMenu.nativeElement.classList.add('hidden');
    }
  }

  /**
   * Asynchronous function to change the page
   * @param path A string representing the path to the page
   * @returns void
   */
  async changePage(path : string) {
    if (path === this.router.url) return;
    this.router.navigateByUrl(path);
  }
}
