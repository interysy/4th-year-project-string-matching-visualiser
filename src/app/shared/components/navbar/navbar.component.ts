import { Component , ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @ViewChild('mobileMenu', {static: true}) mobileMenu: ElementRef<HTMLDivElement>;

  environment = environment;

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
  async changePage(path : string , queryParam : string | null = null) {
    if (path === this.router.url) return;
    this.router.navigate(
      [path],
      { queryParams: { algorithm : queryParam } }
    );
  }
}
