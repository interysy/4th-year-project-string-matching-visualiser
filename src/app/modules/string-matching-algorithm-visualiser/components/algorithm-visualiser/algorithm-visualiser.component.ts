import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw.service';
import { Letter } from '../../models/letter.model';
import { AlgorithmStepBuilder } from '../../model-builders/algorithm-step.builder';
import { AlgorithmStep } from '../../models/algorithm-step.model';


@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent implements AfterViewInit , OnDestroy {

  text = "The fox jumped over the lazy dog";
  pattern = "lazy";

  private readonly Debounce = 1000;
  private readonly DefaultSquareColor = "#ffffff";

  @ViewChild('canvas', {static: false})
  canvasElement: ElementRef<HTMLDivElement>;
  @ViewChild('extraCanvas', {static: false})
  extraCanvasElement: ElementRef<HTMLDivElement>;

  stringSettings = true;
  textChanged: Subject<string> = new Subject<string>();
  patternChanged : Subject<string> = new Subject<string>();

  protected extraCanvas : string | null = null;

  private drawingServices: {service : P5jsDrawService , canvas : HTMLDivElement}[] = [];
  private initialStepBuilder : AlgorithmStepBuilder = new AlgorithmStepBuilder();

  leftButton = false;
  rightButton = false;

  constructor(private readonly algorithmProgressService : AlgorithmProgressService) {
    this.algorithmProgressService.setTextAndPattern(this.text , this.pattern);
    this.extraCanvas = this.algorithmProgressService.extraCanvasGetter;

    this.textChanged
    .pipe(debounceTime(this.Debounce))
    .subscribe(_ => {
      this.algorithmProgressService.resetProgressService();

      algorithmProgressService.textSetter = this.text;
      const initialStateBuilder = new AlgorithmStepBuilder();

      initialStateBuilder.setLettersInText=  this.stringToLetterObject(this.text , "#ffffff" , 1);
      initialStateBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , "#ffffff" , 1);
      this.resetDrawers();
      this.drawersStepSet(this.createInitialStep());
      this.drawersResizeCanvas();
    });

    this.patternChanged
    .pipe(debounceTime(this.Debounce))
    .subscribe(_ => {
      this.algorithmProgressService.resetProgressService();
       algorithmProgressService.patternSetter = this.pattern;
       algorithmProgressService.textSetter = this.text;
       const initialStateBuilder = new AlgorithmStepBuilder();

      initialStateBuilder.setLettersInText=  this.stringToLetterObject(this.text , "#ffffff" , 1);
      initialStateBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , "#ffffff" , 1);
      this.resetDrawers();
      this.drawersStepSet(this.createInitialStep());
      this.drawersResizeCanvas();
    });


    this.algorithmProgressService.notifierGetter.subscribe((_) => {
      const step = (this.algorithmProgressService.stepGetter) ? this.algorithmProgressService.stepGetter : this.createInitialStep();
      this.drawersStepSet(step);
    });
  }

  private createInitialStep() {
    this.initialStepBuilder.setLettersInText=  this.stringToLetterObject(this.text , this.DefaultSquareColor , 1);
    this.initialStepBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , this.DefaultSquareColor , 1);
    return this.initialStepBuilder.build();
  }

  private drawersStepSet(step : AlgorithmStep) {
    for (const drawer of this.drawingServices) {
      drawer.service.stepSetter = step;
    }
  }

  private drawersResizeCanvas() {
    for (const drawer of this.drawingServices) {
      drawer.service.resizeCanvas(drawer.canvas.offsetWidth , drawer.canvas.offsetHeight);
    }
  }

  private resetDrawers() {
    for (const drawer of this.drawingServices) {
      drawer.service.resetDefaults();
    }
  }

  ngAfterViewInit() {
    const canvasWidth = this.canvasElement.nativeElement.offsetWidth;
    const canvasHeight = this.canvasElement.nativeElement.offsetHeight;


    const drawService = new P5jsDrawService(this.canvasElement.nativeElement, canvasWidth, canvasHeight, this.text.length, (p5) => {
      drawService.drawTextAndPattern(p5);
    });
    drawService.stepSetter = this.algorithmProgressService.stepGetter;
    this.drawingServices.push({service : drawService , canvas : this.canvasElement.nativeElement});

    if (this.extraCanvas != undefined && this.extraCanvasElement != undefined) {
      const canvasWidth2 = this.extraCanvasElement.nativeElement.offsetWidth;
      const canvasHeight2 = this.extraCanvasElement.nativeElement.offsetHeight;
      this.rightButton = P5jsDrawService.needRightButton(canvasWidth2 , this.pattern.length);
      const temp = new P5jsDrawService(this.extraCanvasElement.nativeElement, canvasWidth2, canvasHeight2, this.text.length, (p5) => {
        if (temp[this.extraCanvas as keyof P5jsDrawService] && typeof temp[this.extraCanvas as keyof P5jsDrawService] === 'function') {
          (temp[this.extraCanvas as keyof P5jsDrawService] as (p5 : any) => void)(p5);
        }
      } , true);
      temp.stepSetter = this.algorithmProgressService.stepGetter;
      this.drawingServices.push({service : temp , canvas : this.extraCanvasElement.nativeElement});
    }
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
    for (const drawer of this.drawingServices) {
      drawer.service.destroy();
    }
  }

  @HostListener('window:resize')
  protected onResize() {
    this.drawersResizeCanvas();
  }

  protected toggleStringSettings() {
    this.stringSettings = !this.stringSettings;
  }

  protected skipRight() {
    this.rightButton = this.drawingServices[1].service.skipRight();
    this.leftButton = true;
  }

  protected skipLeft() {
    this.leftButton = this.drawingServices[1].service.skipLeft();
    this.rightButton = true;
  }
}
