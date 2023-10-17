import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime , distinctUntilChanged } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw-service.service';
import { AlgorithmStep } from '../../models/algorithm-step.model';
import { AlgorithmStepTypeConstants } from '../../constants/algorithm-step-model.constant';

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
       p5DrawService.drawTextAndPattern(this.text , this.pattern);
    });

    this.patternChanged
    .pipe(debounceTime(this.Debounce), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setPattern = this.pattern;
       p5DrawService.drawTextAndPattern(this.text , this.pattern);
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

    if (step.highlightPattern || step.highlightText) {
      this.p5DrawService.highlightTextAndPattern(this.text , this.pattern , step.highlightText , step.highlightPattern );
    }

    switch (step.type) {
      case AlgorithmStepTypeConstants.MATCH : {
        this.p5DrawService.highlightSpecificSquares(step.textElementColour , step.textIndex , step.patternIndex , step.alreadyMatchedIndexesInPattern , step.alreadyMatchedIndexesInText , this.text , this.pattern);
        break;
      }
      case AlgorithmStepTypeConstants.MISMATCH : {
        this.p5DrawService.movePattern(step.textIndex , this.text , this.pattern);
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
