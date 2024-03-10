import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { PseudocodeParserService } from '../../services/pseudocode-parser.service';

/**
 * @description Component for showing pseudocode and highlighting lines while executing it.
 */
@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css',]
})
export class PseudocodeVisualiserComponent implements OnInit {

  /**
   * @description Pseudocode to display
   */
  protected pseudocode: string[];

   /**
   * @description Fetches tutorial boolean to determine whether to show the prompt.
   * @see AlgorithmVisualiserPage
   */
  @Input() showPsuedocodeHelp : boolean;

   /**
   * @description Notifies parent of finished tutorial, so it can move onto the next step.
   */
  @Output() hidePsuedocodeHelp = new EventEmitter<boolean>();

  /**
   * @description Notifies parent of that user does not want to continue the tutorial and hence to close it.
   */
  @Output() closeTutorial = new EventEmitter<boolean>();


  /**
   * @description Class to add to line of pseudocode when it needs to be highlighted.
   */
  private static CSSHighlightClass = "bg-skin-fill-quaternary";


  /**
   * @description Starts component and fetches pseudocode to display.
   * @param algorithmProgressService Used to be notified of change step, which means another line needs to be highlighted.
   * @param pseudocodeParserService Used to fetch pseudocode from the assets folder.
   */
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

  /**
   * @description After webpage is rendered this function gets the algorithm pseudocode to display.
   */
  ngOnInit(): void {
    this.loadPseudocode(this.algorithmProgressService.algorithmNameGetter());
  }

  /**
   * @description Populates the pseudocode attribute by utilising the service.
   * @param filename Source of the pseudocode.
   */
  private loadPseudocode(filename : string) : void {
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

  /**
   * @description Highlights a specific line in the pseudocode. It utilises CSSHighlightClass.
   * @param number The line number to highlight
   */
  private highlightLine(number : number) : void {
    document.querySelectorAll('li').forEach((li, index) => {
      if (index + 1 == number) {
        li.classList.add(PseudocodeVisualiserComponent.CSSHighlightClass);
      } else {
        li.classList.remove(PseudocodeVisualiserComponent.CSSHighlightClass);
      }
    });
  }
}
