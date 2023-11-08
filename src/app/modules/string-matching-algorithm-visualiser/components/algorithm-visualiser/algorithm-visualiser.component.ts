import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw.service';
import { Letter } from '../../models/letter.model';
import { AlgorithmStepBuilder } from '../../model-builders/algorithm-step.builder';


@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent implements AfterViewInit , OnDestroy {

  text = "The fox jumped over the lazy dog";
  pattern = "lazy";

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  stringSettings = true;

  private readonly Debounce = 1000;

  textChanged: Subject<string> = new Subject<string>();
  patternChanged : Subject<string> = new Subject<string>();

  constructor(private readonly algorithmProgressService : AlgorithmProgressService , private readonly p5jsDrawService : P5jsDrawService ) {
    this.algorithmProgressService.setTextAndPattern(this.text , this.pattern);


    this.textChanged
    .pipe(debounceTime(this.Debounce))
    .subscribe(_ => {
      this.algorithmProgressService.resetProgressService();
       algorithmProgressService.setText = this.text;
       const initialStateBuilder = new AlgorithmStepBuilder();

      initialStateBuilder.setLettersInText=  this.stringToLetterObject(this.text , "#ffffff" , 1);
      initialStateBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , "#ffffff" , 1);
      this.p5jsDrawService.stepSetter = initialStateBuilder.build();

    });

    this.patternChanged
    .pipe(debounceTime(this.Debounce))
    .subscribe(_ => {
       algorithmProgressService.setPattern = this.pattern;
       algorithmProgressService.setText = this.text;
       const initialStateBuilder = new AlgorithmStepBuilder();

      initialStateBuilder.setLettersInText=  this.stringToLetterObject(this.text , "#ffffff" , 1);
      initialStateBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , "#ffffff" , 1);
      this.p5jsDrawService.stepSetter = initialStateBuilder.build();
    });

    this.algorithmProgressService.notifier.subscribe((_) => {
      if (this.algorithmProgressService.stepGetter) this.p5jsDrawService.stepSetter = this.algorithmProgressService.stepGetter; else {
        const initialStateBuilder = new AlgorithmStepBuilder();

        initialStateBuilder.setLettersInText=  this.stringToLetterObject(this.text , "#ffffff" , 1);
        initialStateBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , "#ffffff" , 1);
        this.p5jsDrawService.stepSetter = initialStateBuilder.build();
      }
    });
  }


  ngAfterViewInit() {
    this.p5jsDrawService.destroy();
    const canvasWidth = this.canvas.nativeElement.offsetWidth;
    const canvasHeight = this.canvas.nativeElement.offsetHeight;

    const lettersInText = this.stringToLetterObject(this.text , "#ffffff" , 1);
    const lettersInPattern = this.stringToLetterObject(this.pattern , "#ffffff" , 1);
    const initialStateBuilder = new AlgorithmStepBuilder();
    initialStateBuilder.setLettersInPattern = lettersInPattern;
    initialStateBuilder.setLettersInText = lettersInText;
    const initialState = initialStateBuilder.build();

    this.p5jsDrawService.initiate(this.canvas.nativeElement , canvasWidth, canvasHeight , initialState , this.algorithmProgressService.decoratedAlgorithm);

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

  ngOnDestroy() {
    this.p5jsDrawService.destroy();
  }

  @HostListener('window:resize')
  protected onResize() {
    const canvasHeigth = this.canvas.nativeElement.offsetHeight;
    const canvasWidth = this.canvas.nativeElement.offsetWidth;
    this.p5jsDrawService.changeSizeSubject.next({width : canvasWidth , height : canvasHeigth});
  }

  protected toggleStringSettings() {
    this.stringSettings = !this.stringSettings;
  }
}
