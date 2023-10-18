import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime , distinctUntilChanged } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw-service.service';
import { AlgorithmStep } from '../../models/algorithm-step.model';
import { AlgorithmStepTypeConstants } from '../../constants/algorithm-step-model.constant';
import { MatchingAlgorithmColourConstants } from '../../constants/matching-algorithm-colours.constant';
import { LetterDraw } from '../../models/letter-draw.model';

@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent implements AfterViewInit {

  text = "The fox jumped over the lazy dog";
  pattern = "lazy";


  @ViewChild('canvasDemo', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  stringSettings = true;

  private readonly Debounce = 1000;

  textChanged: Subject<string> = new Subject<string>();
  patternChanged : Subject<string> = new Subject<string>();

  constructor(private algorithmProgressService : AlgorithmProgressService , private p5DrawService : P5jsDrawService) {
    this.algorithmProgressService.setTextAndPattern(this.text , this.pattern);

    this.textChanged
    .pipe(debounceTime(this.Debounce), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setText = this.text;
       p5DrawService.drawTextAndPattern(this.text , this.pattern , 0 , [] , [] );
    });

    this.patternChanged
    .pipe(debounceTime(this.Debounce), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setPattern = this.pattern;
       p5DrawService.drawTextAndPattern(this.text , this.pattern , 0 , [] , []);
    });

    this.algorithmProgressService.notifier.subscribe((_) => {

      this.updatePlot(this.algorithmProgressService.stepGetter);
    });
  }


  ngAfterViewInit() {
    const canvasWidth = this.canvas.nativeElement.offsetWidth;
    this.p5DrawService.initiate(this.canvas.nativeElement , canvasWidth, 400 , this.text , this.pattern);

    // force change
    this.textChanged.next(this.text);
  }


  protected sendTextToService() {
    this.textChanged.next(this.text)
  }

  protected sendPatternToService() {
    this.patternChanged.next(this.pattern)
  }

  @HostListener('window:resize')
  protected onResize() {
    const canvasHeigth = this.canvas.nativeElement.offsetHeight;
    const canvasWidth = this.canvas.nativeElement.offsetWidth;

    this.p5DrawService.resizeCanvas(canvasWidth, canvasHeigth , this.text , this.pattern);
  }

  protected updatePlot(step : AlgorithmStep) {

    // if (step.highlightPattern || step.highlightText) {
    //   this.p5DrawService.highlightTextAndPattern(this.text , this.pattern , step.highlightText , step.highlightPattern );
    // }

    switch (step.type) {
      case AlgorithmStepTypeConstants.HIGHLIGHT : {
        const highlightText = ((step.highlightText) ? Array.from(Array(this.text.length).keys()) : []).map(index => {
          const letterDraw = new LetterDraw();
          letterDraw.index = index;
          letterDraw.colour = MatchingAlgorithmColourConstants.CHECKING;
          return letterDraw;
          });
        const highlightPattern = ((step.highlightPattern) ? Array.from(Array(this.pattern.length).keys()) : []).map(index => {
          const letterDraw = new LetterDraw();
          letterDraw.index = index;
          letterDraw.colour = MatchingAlgorithmColourConstants.CHECKING;
          return letterDraw;
        });
        this.p5DrawService.drawTextAndPattern(this.text , this.pattern  , -1 , highlightText , highlightPattern)
        break;
      }
      case AlgorithmStepTypeConstants.PROCESSING : {
        this.p5DrawService.drawTextAndPattern(this.text , this.pattern , -1 , step.alreadyMatchedIndexesInText ,  step.alreadyMatchedIndexesInPattern );
        break;
      }
      case AlgorithmStepTypeConstants.COMPARISON : {
         this.p5DrawService.drawTextAndPattern(this.text , this.pattern , -1 , step.alreadyMatchedIndexesInText ,  step.alreadyMatchedIndexesInPattern );
        break;
      }
      case AlgorithmStepTypeConstants.MATCH : {
        this.p5DrawService.drawTextAndPattern(this.text , this.pattern , -1 , step.alreadyMatchedIndexesInText , step.alreadyMatchedIndexesInPattern);
        break;
      }
      case AlgorithmStepTypeConstants.MISMATCH : {
        this.p5DrawService.drawTextAndPattern(this.text , this.pattern  , step.textIndex , step.alreadyMatchedIndexesInText , step.alreadyMatchedIndexesInPattern);
        break;
      }
    }


    console.log("step");
    console.log(step);
  }

  nextStep() {
    this.algorithmProgressService.moveToNextStep();
  }
}
