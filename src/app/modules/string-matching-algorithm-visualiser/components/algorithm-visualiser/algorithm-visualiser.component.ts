import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { P5jsDrawClass } from '../../drawers/p5js.drawer';
import { OptionService } from '../../services/option.service';
import { ThemeSelectorService } from '../../services/theme-selector.service';
import * as p5 from 'p5';

/**
 * @description This component is responsible for holding a p5js canvas used for drawing the animation. It handles its resize and destruction.
 */
@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent implements AfterViewInit , OnDestroy {

  /**
   * @description Fetches tutorial boolean to determine whether to show the prompt.
   * @see AlgorithmVisualiserPage
   */
  @Input() showAlgorithmVisualiserHelp : boolean;

  /**
   * @description Notifies parent of finished tutorial, so it can move onto the next step.
   */
  @Output() hideAlgorithmVisualiserHelp = new EventEmitter<boolean>();

  /**
   * @description Notifies parent of finished tutorial, so it can finish the tutorial.
   */
  @Output() closeTutorial = new EventEmitter<boolean>();

  /**
   * @description Reference to the main canvas element. This is where the text and pattern are drawn.
   */
  @ViewChild('canvas', {static: false})
  canvasElement: ElementRef<HTMLDivElement>;

  /**
   * @description Reference to the extra canvas element. Extra data (typically preprocessing) is draw here.
   * @see {@link constructor}
   */
  @ViewChild('extraCanvas', {static: false})
  extraCanvasElement: ElementRef<HTMLDivElement>;

  /**
   * @description Array of drawing services. Each service is responsible for drawing on a different canvas. With the current design this stores maximium 2 canvases , main and extra.
   */
  private _drawingServices: {service : P5jsDrawClass , canvas : HTMLDivElement}[] = [];


  /**
   * @description Create instance of AlgorithmVisualiserComponent and inject relevant services.
   * @param algorithmProgressService Used for fetching step changes.
   * @param optionService Used to fetch current options set.
   * @param themeSelectorService Used to fetch current them, as this needed to draw in the correct colours.
   */
  constructor(protected readonly algorithmProgressService : AlgorithmProgressService , private readonly optionService : OptionService , private readonly themeSelectorService : ThemeSelectorService) {}

  /**
   * @description Get drawers to resize their canvas when the window is resized.
   */
  public drawersResizeCanvas() : void {
    for (const drawer of this._drawingServices) {
      drawer.service.resizeCanvas(drawer.canvas.offsetWidth , drawer.canvas.offsetHeight);
    }
  }

  /**
   * @description Construct a drawer and add it to the drawing services array.
   * @param canvasDiv The div to contain the new canvas for the drawer.
   * @param functionName The main drawing function that will draw on the canvas.
   * @param scrollable Whether the canvas will be scrollable using a scrollwheel.
   */
  private constructDrawer(canvasDiv : ElementRef<HTMLDivElement> , functionName : string, scrollable : boolean) : void {
    const canvasWidth = canvasDiv.nativeElement.offsetWidth;
    const canvasHeight = canvasDiv.nativeElement.offsetHeight;

    const drawService = new P5jsDrawClass(this.algorithmProgressService, this.optionService, this.themeSelectorService, canvasDiv.nativeElement, canvasWidth, canvasHeight, (p5: p5) => {

      if (drawService[functionName as keyof P5jsDrawClass] && typeof drawService[functionName as keyof P5jsDrawClass] === 'function') {
        (drawService[functionName as keyof P5jsDrawClass] as (p5 : p5) => void)(p5);
      }

    }, scrollable);
    this._drawingServices.push({service : drawService , canvas : canvasDiv.nativeElement});
  }

  /**
   * @description After rendering (as we need to know how much space is available) Create the drawing services and add them to the drawing services array.
   * The creation happens with a custom draw function from the env for the algorithm.
   */
  ngAfterViewInit() : void {

    this.constructDrawer(this.canvasElement , "drawTextAndPattern" , false);

    const extraCanvas = this.algorithmProgressService.extraCanvasGetter();
    if (extraCanvas != undefined && this.extraCanvasElement != undefined) {
      this.constructDrawer(this.extraCanvasElement , extraCanvas , true);
    }

  }

  /**
   * @description Destroy the drawing services and reset any algorithm progress.
   */
  ngOnDestroy() : void {
    for (const drawer of this._drawingServices) {
      drawer.service.destroy();
    }
    this.algorithmProgressService.resetProgress();
  }

  /**
   * @description Get drawers to resize their canvas when the window is resized.
   */
  @HostListener('window:resize')
  protected onResize() {
    this.drawersResizeCanvas();
  }

  /**
   * @description Update scrollX to go right in the drawers when the user scrolls.
   */
  protected skipRight() : void {
    this._drawingServices[1].service.skipRight();
  }

  /**
   * @description Update scrollX to go left in the drawers when the user scrolls.
   */
  protected skipLeft() : void {
    this._drawingServices[1].service.skipLeft();
  }

  /**
   * @description Get all drawers initiated in component and the objects controlling them.
   */
  get drawingServices() {
    return this._drawingServices;
  }

}
