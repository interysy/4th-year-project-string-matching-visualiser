import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub , faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home.page';
import { AboutPageComponent } from './pages/about/about.page';
import { AlgorithmVisualiserPageComponent } from './pages/algorithm-visualiser/algorithm-visualiser.page';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { StringMatchingAlgorithmVisualiserModule } from './modules/string-matching-algorithm-visualiser/string-matching-algorithm-visualiser.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AboutPageComponent,
    AlgorithmVisualiserPageComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    StringMatchingAlgorithmVisualiserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faGithub,
      faLinkedin,
      faCompass
    );
  }
}
