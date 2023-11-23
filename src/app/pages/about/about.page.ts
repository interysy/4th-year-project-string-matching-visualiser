import { Component } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';


library.add(faCompass, faGithub, faLinkedin);
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.css']
})
export class AboutPageComponent {

}
