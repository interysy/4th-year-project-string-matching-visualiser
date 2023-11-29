import { Component, ElementRef, ViewChild , OnInit } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { PseudocodeParserService } from '../../services/pseudocode-parser.service';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/match-braces/prism-match-braces";


@Component({
  selector: 'app-pseudocode-visualiser',
  templateUrl: './pseudocode-visualiser.component.html',
  styleUrls: ['./pseudocode-visualiser.component.css',]
})
export class PseudocodeVisualiserComponent implements OnInit {

  @ViewChild('pseudocodePreElement') private pseudocodePreElement:ElementRef;
  @ViewChild('pseudocodeElement') private pseudocodeElement:ElementRef;
  private language = "typescript";
  private pseudocode: string;
  protected formattedPseudocode: string;


  constructor(private readonly algorithmProgressService : AlgorithmProgressService,
              private readonly pseudocodeParserService : PseudocodeParserService) {

    this.algorithmProgressService.notifierGetter.subscribe((_) => {
      this.highlightLine(this.algorithmProgressService.pseudocodeLine);
    });
  }

  ngOnInit(): void {
    this.createButtons();

    this.pseudocodeParserService.getAlgorithmPseudocode(this.algorithmProgressService.algorithmNameGetter).subscribe((pseudocode) => {
      this.pseudocode =  "\n" + pseudocode.trim();
      this.formattedPseudocode = Prism.highlight(this.pseudocode, Prism.languages[this.language] , this.language);
    });
  }

  private createButtons() {
    Prism.plugins["toolbar"].registerButton('language',
      {
        text: this.language
      }
    );
  }

  private highlightLine(lineNumber : number) {
    this.pseudocodePreElement?.nativeElement.setAttribute('data-line', lineNumber.toString());
    Prism.highlightElement(this.pseudocodeElement.nativeElement);
  }
}
