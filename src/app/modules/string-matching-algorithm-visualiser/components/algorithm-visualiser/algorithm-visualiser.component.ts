import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
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
   */
  constructor(protected readonly algorithmProgressService : AlgorithmProgressService , private readonly optionService : OptionService , private readonly themeSelectorService : ThemeSelectorService) {}

  /**
   * @description Get drawers to resize their canvas when the window is resized.
   */
  private drawersResizeCanvas() : void {
    for (const drawer of this._drawingServices) {
      drawer.service.resizeCanvas(drawer.canvas.offsetWidth , drawer.canvas.offsetHeight);
    }
  }

  /**
   * @description Construct a drawer and add it to the drawing services array.
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
  ngAfterViewInit() {

    this.constructDrawer(this.canvasElement , "drawTextAndPattern" , false);

    const extraCanvas = this.algorithmProgressService.extraCanvasGetter();
    if (extraCanvas != undefined && this.extraCanvasElement != undefined) {
      this.constructDrawer(this.extraCanvasElement , extraCanvas , true);
    }

  }

  /**
   * @description Destroy the drawing services and reset any algorithm progress.
   */
  ngOnDestroy() {
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
  protected skipRight() {
    this._drawingServices[1].service.skipRight();
  }

  /**
   * @description Update scrollX to go left in the drawers when the user scrolls.
   */
  protected skipLeft() {
    this._drawingServices[1].service.skipLeft();
  }

  get drawingServices() {
    return this._drawingServices;
  }

}
