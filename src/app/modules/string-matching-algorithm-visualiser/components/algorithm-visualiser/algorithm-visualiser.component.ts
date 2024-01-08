import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { P5jsDrawClass } from '../../services/p5js.drawer';
import { OptionService } from '../../services/option.service';
import { ThemeSelectorService } from '../../services/theme-selector.service';


@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent implements AfterViewInit , OnDestroy {

  @ViewChild('canvas', {static: false})
  canvasElement: ElementRef<HTMLDivElement>;
  @ViewChild('extraCanvas', {static: false})
  extraCanvasElement: ElementRef<HTMLDivElement>;

  protected extraCanvas : string | null = null;

  private drawingServices: {service : P5jsDrawClass , canvas : HTMLDivElement}[] = [];


  constructor(private readonly algorithmProgressService : AlgorithmProgressService , private readonly optionService : OptionService , private readonly themeSelectorService : ThemeSelectorService) {
    this.extraCanvas = this.algorithmProgressService.extraCanvasGetter;
  }


  private drawersResizeCanvas() {
    for (const drawer of this.drawingServices) {
      drawer.service.resizeCanvas(drawer.canvas.offsetWidth , drawer.canvas.offsetHeight);
    }
  }


  ngAfterViewInit() {
    const canvasWidth = this.canvasElement.nativeElement.offsetWidth;
    const canvasHeight = this.canvasElement.nativeElement.offsetHeight;

    const drawService = new P5jsDrawClass(this.algorithmProgressService, this.optionService, this.themeSelectorService,this.canvasElement.nativeElement, canvasWidth, canvasHeight, (p5: any) => {
      drawService.drawTextAndPattern(p5);
    });
    this.drawingServices.push({service : drawService , canvas : this.canvasElement.nativeElement});

    if (this.extraCanvas != undefined && this.extraCanvasElement != undefined) {
      const canvasWidth2 = this.extraCanvasElement.nativeElement.offsetWidth;
      const canvasHeight2 = this.extraCanvasElement.nativeElement.offsetHeight;
      const temp = new P5jsDrawClass(this.algorithmProgressService, this.optionService, this.themeSelectorService,this.extraCanvasElement.nativeElement, canvasWidth2, canvasHeight2, (p5: any) => {
        if (temp[this.extraCanvas as keyof P5jsDrawClass] && typeof temp[this.extraCanvas as keyof P5jsDrawClass] === 'function') {
          (temp[this.extraCanvas as keyof P5jsDrawClass] as (p5 : any) => void)(p5);
        }
      } , true);
      this.drawingServices.push({service : temp , canvas : this.extraCanvasElement.nativeElement});
    }
  }


  ngOnDestroy() {
    for (const drawer of this.drawingServices) {
      drawer.service.destroy();
    }
    this.algorithmProgressService.resetProgress();
  }

  @HostListener('window:resize')
  protected onResize() {
    this.drawersResizeCanvas();
  }

  protected skipRight() {
    this.drawingServices[1].service.skipRight();
  }

  protected skipLeft() {
    this.drawingServices[1].service.skipLeft();
  }

}
