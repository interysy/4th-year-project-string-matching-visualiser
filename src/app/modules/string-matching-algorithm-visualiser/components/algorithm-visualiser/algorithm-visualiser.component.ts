import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime , distinctUntilChanged } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw-service.service';

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
  }

  ngAfterViewInit() {
    const canvasWidth = this.canvas.nativeElement.offsetWidth;

    this.p5DrawService.initiate(this.canvas.nativeElement , canvasWidth, 400 , this.text , this.pattern);
    this.p5DrawService.drawTextAndPattern(this.text , this.pattern);
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
}
