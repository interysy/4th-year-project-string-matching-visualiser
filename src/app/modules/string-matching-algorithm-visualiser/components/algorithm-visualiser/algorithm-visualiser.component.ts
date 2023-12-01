import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime, of } from 'rxjs';
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

  private readonly Debounce = 1000;
  private readonly DefaultSquareColor = "#ffffff";

  protected text = "The fox jumped over the lazy dog";
  protected pattern = "lazy";

  protected stringSettings = true;

  private textChanged: Subject<string> = new Subject<string>();
  private patternChanged : Subject<string> = new Subject<string>();

  // @ViewChild('canvas', {static: true})
  // private canvas: ElementRef<HTMLCanvasElement>;
  // @ViewChild('canvas2', {static: true})
  // private canvas2: ElementRef<HTMLCanvasElement>;

  @ViewChild("canvasContainer" , {static : true})
  private canvasContainer : ElementRef<HTMLDivElement>;
  canvases : HTMLDivElement[] = [];
  funcs : string[] = [];

  private textAndPatternDrawService : P5jsDrawService;
  private drawingServices : P5jsDrawService[] = [];
  private initialStepBuilder : AlgorithmStepBuilder;


  constructor(private readonly algorithmProgressService : AlgorithmProgressService) {
    this.initialStepBuilder = new AlgorithmStepBuilder();

    this.algorithmProgressService.setTextAndPattern(this.text , this.pattern);

    this.textChanged
    .pipe(debounceTime(this.Debounce))
    .subscribe(_ => {
      this.algorithmProgressService.resetProgressService();
      algorithmProgressService.textSetter = this.text;
      this.drawersStepSet(this.createInitialStep());
      //this.textAndPatternDrawService.changeSquareSize(this.canvas.nativeElement.offsetWidth , this.text.length)
    });

    this.patternChanged
    .pipe(debounceTime(this.Debounce))
    .subscribe(_ => {
      algorithmProgressService.patternSetter = this.pattern;
      this.drawersStepSet(this.createInitialStep());
      //this.textAndPatternDrawService.changeSquareSize(this.canvas.nativeElement.offsetWidth , this.text.length)
    });

    this.algorithmProgressService.notifierGetter.subscribe((_) => {
        const step = (this.algorithmProgressService.stepGetter) ? this.algorithmProgressService.stepGetter : this.createInitialStep();
        this.drawersStepSet(step);
      });

  }

  private createDynamicCanvasLayout() {
    const layout = this.algorithmProgressService.dynamicCanvasLayoutGetter;
    const columns = layout.columns;
    const rows = layout.rows;
    const layoutContent = layout.layout;

    const canvases = [];
    this.canvasContainer.nativeElement.className =  `grid grid-cols-${columns} gap-6`
    for (const newCanvas of layoutContent) {
      console.log(newCanvas)
      const canvas = document.createElement('div');
      const rowSpan = newCanvas.rowSpan;
      const colSpan = newCanvas.colSpan;
      const func = newCanvas.function;
      console.log(func);
      canvas.className = `col-span-${colSpan} h-96`
      this.canvasContainer.nativeElement.appendChild(canvas);
      canvases.push(canvas);
      this.funcs.push(func);
    }
    this.canvases = canvases;
  }

  private createInitialStep() {
      this.initialStepBuilder.setLettersInText=  this.stringToLetterObject(this.text , this.DefaultSquareColor , 1);
      this.initialStepBuilder.setLettersInPattern = this.stringToLetterObject(this.pattern , this.DefaultSquareColor , 1);
      return this.initialStepBuilder.build();
  }

  private drawersStepSet(step : AlgorithmStep) {
    for (const drawer of this.drawingServices) {
      drawer.stepSetter = step;
    }
  }

  ngAfterViewInit() {
    // const canvasWidth = this.canvas.nativeElement.offsetWidth;
    // const canvasHeight = this.canvas.nativeElement.offsetHeight;

    // const canvasWidth2 = this.canvas2.nativeElement.offsetWidth;
    // const canvasHeight2 = this.canvas2.nativeElement.offsetHeight;

    this.createDynamicCanvasLayout();

    let i = 0;
    console.log(this.funcs);
    console.log(this.canvases)
    for (const canvas of this.canvases) {
      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;
      const methodName = this.funcs[i];
      const temp = new P5jsDrawService(canvas , canvasWidth , canvasHeight , this.text.length , (p5) => {
        console.log(`Method name: ${methodName}`);
        if (temp[methodName as keyof P5jsDrawService] && typeof temp[methodName as keyof P5jsDrawService] === 'function') {
          console.log(temp[methodName as keyof P5jsDrawService]);
          (temp[methodName as keyof P5jsDrawService] as (p5: any) => void)(p5);
        }
      });
      temp.stepSetter = this.algorithmProgressService.stepGetter;
      this.drawingServices.push(temp);
      i++;
    }


    // this.textAndPatternDrawService = new P5jsDrawService(this.canvas.nativeElement, canvasWidth, canvasHeight, this.text.length, (p5) => {
    //   this.textAndPatternDrawService.drawTextAndPattern(p5);
    // });
    // this.textAndPatternDrawService.stepSetter = this.algorithmProgressService.stepGetter;
    // this.drawingServices.push(this.textAndPatternDrawService);

    // const temp = new P5jsDrawService(this.canvas2.nativeElement, canvasWidth2, canvasHeight2, this.text.length, (p5) => {
    //   temp.drawLastOccurrenceTable(p5);
    // });
    // temp.stepSetter = this.algorithmProgressService.stepGetter;
    // this.drawingServices.push(temp);
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
    //this.p5jsDrawService.destroy();
    console.log("destroyed")
  }

  @HostListener('window:resize')
  protected onResize() {
    //const canvasHeigth = this.canvas.nativeElement.offsetHeight;
   // const canvasWidth = this.canvas.nativeElement.offsetWidth;
   // for (const drawer of this.drawingServices) {
     // drawer.changeSizeSubject.next({width : canvasWidth , height : canvasHeigth});
   // }
  }

  protected toggleStringSettings() {
    this.stringSettings = !this.stringSettings;
  }
}
