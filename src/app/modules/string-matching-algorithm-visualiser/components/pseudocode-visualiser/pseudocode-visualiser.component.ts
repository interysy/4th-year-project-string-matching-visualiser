import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css']
})
export class PseudocodeVisualiserComponent {

  lastLine : HTMLElement | null = null;

  constructor(private algorithmProgressService : AlgorithmProgressService) {
    this.algorithmProgressService.notifier.subscribe((_) => {
      this.highlightLine();
    });
  }

  highlightLine() {
    if (this.lastLine) this.lastLine.style.backgroundColor = "";

    const lineToHighlight = document.getElementById("line" + this.algorithmProgressService.pseudocodeLine);
    if (lineToHighlight) {
      lineToHighlight.style.backgroundColor = "green";
      this.lastLine = lineToHighlight;
    }
  }

  play() {
    this.algorithmProgressService.play();
  }
}
