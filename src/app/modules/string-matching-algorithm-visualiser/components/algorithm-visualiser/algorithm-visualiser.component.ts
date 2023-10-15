import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subject , debounceTime , distinctUntilChanged } from 'rxjs';
import { P5jsDrawService } from '../../services/p5js-draw-service.service';

@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})

export class AlgorithmVisualiserComponent {

  text = "The fox jumped over the lazy dog";
  pattern = "lazy";

  where = 200;

  @ViewChild('canvasDemo', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  stringSettings = false;

  private readonly Debounce = 1000;

  textChanged: Subject<string> = new Subject<string>();
  patternChanged : Subject<string> = new Subject<string>();


  constructor(private algorithmProgressService : AlgorithmProgressService , private p5DrawService : P5jsDrawService) {
    this.algorithmProgressService.setTextAndPattern(this.text , this.pattern);
    // console.log(this.canvas);
    // if (document.getElementById("canvas")) {
    //   console.log("Initialising p5js");
    //   p5DrawService.initialiseP5(document.getElementById("canvas"));
    // }

    this.textChanged
    .pipe(debounceTime(1000), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setText = this.text;
    });

    this.patternChanged
    .pipe(debounceTime(1000), distinctUntilChanged())
    .subscribe(_ => {
       algorithmProgressService.setPattern = this.pattern;
    });
  }

  ngAfterViewInit() {
    console.log(this.canvas);
    this.p5DrawService.initiate(this.canvas.nativeElement);
  }

  protected sendTextToService() {
    this.textChanged.next(this.text)
  }

  protected sendPatternToService() {
    this.patternChanged.next(this.pattern)
  }

  drawMore(offset : number) {
    this.where += offset
    this.p5DrawService.drawMore(this.where);
  }

}
