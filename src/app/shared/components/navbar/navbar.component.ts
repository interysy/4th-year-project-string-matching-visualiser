import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  algorithms = [
    "Brute Force",
    "Boyer-Moore",
    "Knuth-Morris-Pratt",
  ];

}
