import { Component } from '@angular/core';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

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

}
