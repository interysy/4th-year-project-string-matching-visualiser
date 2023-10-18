import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime , distinctUntilChanged } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw.service';
import { Letter } from '../../models/letter.model';
import { AlgorithmStep } from '../../models/algorithm-step.model';


@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent implements AfterViewInit {

  text = "The fox jumped over the lazy dog";
  pattern = "lazy";

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  stringSettings = true;

  private readonly Debounce = 1000;

  textChanged: Subject<string> = new Subject<string>();
  patternChanged : Subject<string> = new Subject<string>();

  constructor(private algorithmProgressService : AlgorithmProgressService , private p5jsDrawService : P5jsDrawService ) {
    this.algorithmProgressService.setTextAndPattern(this.text , this.pattern);

    this.textChanged
    .pipe(debounceTime(this.Debounce), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setText = this.text;

       this.p5jsDrawService.drawTextAndPattern(this.stringToLetterObject(this.text , "#ffffff" , 1), this.stringToLetterObject(this.pattern , "#ffffff" , 1) , 0 );
    });

    this.patternChanged
    .pipe(debounceTime(this.Debounce), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setPattern = this.pattern;
       this.p5jsDrawService.drawTextAndPattern(this.stringToLetterObject(this.text , "#ffffff" , 1) , this.stringToLetterObject(this.pattern,"#ffffff" , 1) , 0);
    });

    this.algorithmProgressService.notifier.subscribe((_) => {
      const step = this.algorithmProgressService.stepGetter;
      this.p5jsDrawService.drawTextAndPattern(step.lettersInText , step.lettersInPattern , step.patternOffset);
    });
  }


  ngAfterViewInit() {
    const canvasWidth = this.canvas.nativeElement.offsetWidth;

    // need to get height

    this.p5jsDrawService.initiate(this.canvas.nativeElement , canvasWidth, 200 );

    // force change
    this.textChanged.next(this.text);
  }


  protected sendTextToService() {
    this.textChanged.next(this.text)
  }

  protected sendPatternToService() {
    this.patternChanged.next(this.pattern)
  }

  private stringToLetterObject(stringToChange : string , colour : string , strokeWeight : number ) : Letter[] {
    return stringToChange.split('').map((letter , index) => {
      const letterObj = new Letter();
      letterObj.index = index;
      letterObj.letter = letter;
      letterObj.colour = colour;
      letterObj.strokeWeight = strokeWeight;

      return letterObj;
    });
  }

  // @HostListener('window:resize')
  // protected onResize() {
  //   const canvasHeigth = this.canvas.nativeElement.offsetHeight;
  //   const canvasWidth = this.canvas.nativeElement.offsetWidth;

  //   //this.p5DrawService.resizeCanvas(canvasWidth, canvasHeigth , this.text , this.pattern);
  // }

  previousStep() {
    this.algorithmProgressService.goToPreviousStep();
  }

  play() {
    this.algorithmProgressService.play();
  }

  nextStep() {
    this.algorithmProgressService.moveToNextStep();
  }

  reset() {
    this.algorithmProgressService.reset();
  }

}
