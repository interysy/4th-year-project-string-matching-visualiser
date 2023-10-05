import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // will be exported onto a config file - added as an issue to backlog - #43
  algorithms = [
    "Brute Force",
    "Boyer-Moore",
    "Knuth-Morris-Pratt",
  ];

}
