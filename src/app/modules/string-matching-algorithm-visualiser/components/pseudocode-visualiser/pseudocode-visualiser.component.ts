import { Component, ElementRef, ViewChild , OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { PseudocodeParserService } from '../../services/pseudocode-parser.service';


@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css',]
})
export class PseudocodeVisualiserComponent implements OnInit {

  protected pseudocode: string[];
  @Input() showPsuedocodeHelp : boolean;
  @Output() hidePsuedocodeHelp = new EventEmitter<boolean>();
  @Output() closeTutorial = new EventEmitter<boolean>();


  constructor(private readonly algorithmProgressService : AlgorithmProgressService,
              private readonly pseudocodeParserService : PseudocodeParserService) {

    this.algorithmProgressService.stepChangedSubscriberGetter().subscribe((_) => {
      if (this.algorithmProgressService.pseudocodeFilenameGetter() != "") {
        this.loadPseudocode(this.algorithmProgressService.pseudocodeFilenameGetter());
      } else {
        this.loadPseudocode(this.algorithmProgressService.algorithmNameGetter());
      }

      this.highlightLine(this.algorithmProgressService.stepGetter().pseudocodeLine);
    });
  }

  ngOnInit(): void {
    this.loadPseudocode(this.algorithmProgressService.algorithmNameGetter());
  }

  private loadPseudocode(filename : string) {
    this.pseudocodeParserService.getAlgorithmPseudocode(filename).subscribe((pseudocode) => {
      this.pseudocode =  pseudocode.split("\n");
      this.pseudocode = this.pseudocode.map((line) => {
        if (line == "") {
          return " ";
        } else {
          return line;
        }
      })
    });
  }

  private highlightLine(number : number) {
    console.log(number);
    document.querySelectorAll('li').forEach((li, index) => {
      if (index + 1 == number) {
        li.classList.add("bg-skin-fill-quaternary");
      } else {
        li.classList.remove('bg-skin-fill-quaternary');
      }
    });
  }
}
