import { Component } from '@angular/core';
import { PlaybackServiceService } from '../../services/playback-service.service';

@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css']
})
export class PseudocodeVisualiserComponent {

  lastLine : HTMLElement | null = null;

  constructor(private playbackService : PlaybackServiceService) {
    this.playbackService.notifier.subscribe((_) => {
      this.highlightLine();
    });
  }

  highlightLine() {
    if (this.lastLine) this.lastLine.style.backgroundColor = "";

    const lineToHighlight = document.getElementById("line" + this.playbackService.pseudocodeLine);
    if (lineToHighlight) {
      lineToHighlight.style.backgroundColor = "green";
      this.lastLine = lineToHighlight;
    }
  }

  play() {
    this.playbackService.play();
  }
}
