import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThemeSelectorService } from './services/theme-selector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'String Matching Algorithms Visualiser';


  @ViewChild('themingDiv', {static: true})
  themingDivElement: ElementRef<HTMLDivElement>;
  currentTheme : string;


  constructor(private readonly themeSelectorService: ThemeSelectorService) {
    this.currentTheme = themeSelectorService.currentThemeGetter;

    this.themeSelectorService.themeChangedSubscriberGetter.subscribe((newTheme : string) => {
      this.themingDivElement.nativeElement.classList.replace(this.currentTheme, newTheme);
      this.currentTheme = newTheme;
    });

  }

}
