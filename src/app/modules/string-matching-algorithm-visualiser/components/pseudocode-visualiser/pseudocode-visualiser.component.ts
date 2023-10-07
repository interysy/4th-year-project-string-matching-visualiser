import { Component } from '@angular/core';
import { PlaybackServiceService } from '../../services/playback-service.service';

@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css']
})
export class PseudocodeVisualiserComponent {

  constructor(private playbackService : PlaybackServiceService) {}

  async play() {
    let lineToHighlight : HTMLElement | null;
    for (let i = 0; i < this.playbackService.amountOfSteps; i++) {
      lineToHighlight = document.getElementById("line" + this.playbackService.pseudocodeLine);
      if (lineToHighlight) {
        lineToHighlight.style.backgroundColor = "green";
        await this.sleep(2000);
        lineToHighlight.style.backgroundColor = "";
        this.playbackService.moveToNextStep();
      }

    }
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

}
