import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { PseudocodeParserService } from '../../services/pseudocode-parser.service';

@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css']
})
export class PseudocodeVisualiserComponent {

  lastLine : HTMLElement | null = null;
  @ViewChild('pseudocodeVisualiserDiv') divToDisplay:ElementRef;

  constructor(private readonly algorithmProgressService : AlgorithmProgressService,
              private readonly pseudocodeParserService : PseudocodeParserService) {

    this.pseudocodeParserService.getAlgorithmPseudocode(this.algorithmProgressService.algorithmNameGetter).subscribe((pseudocode) => {

      const splittedPseudocode = pseudocode.split("\n");
      splittedPseudocode.forEach((line , index) => {
        this.divToDisplay.nativeElement.insertAdjacentHTML('beforeend', '<p id="line' + index + '">' + line + '</p>');
      })
    });

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

}
