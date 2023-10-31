import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { Letter } from '../models/letter.model';
import { AlgorithmStep } from '../models/algorithm-step.model';

@Injectable({
  providedIn: 'root'
})
export class P5jsDrawService extends P5JSInvoker {

  private readonly SquareSideSize = 20;
  private readonly DefaultFill  = MatchingAlgorithmColourConstants.DEFAULT;
  private readonly RectangleOffset = 5;
  private readonly SingleCharTextOffset = 10;
  private readonly DoubleCharTextOffset = 7;

  private textWidth : number;


  initiate(canvas : HTMLElement | null , width : number , height : number, step : AlgorithmStep) {
    if (canvas) this.startP5JS(canvas , width , height , step) ;
  }

  setup(p:p5 , width : number , height : number) {
    p.createCanvas(width, height);
  }

  draw(p : p5 ) {
    if (this.step) {
      const textLettersToDrawFromStep = this.step.lettersInText;
      const patternLettersToDrawFromStep = this.step.lettersInPattern;
      const patternOffsetFromStep = this.step.patternOffset;
      this.drawTextAndPattern(p , textLettersToDrawFromStep , patternLettersToDrawFromStep , patternOffsetFromStep);
    }
  }

  set stepSetter( step : AlgorithmStep) {
    this.step = step;
  }

  get stepGetter() : AlgorithmStep | null {
    if (this.step) return this.step; else return null;
  }

  destroy() {
    if (this.p5) {
      this.p5.remove();
      this.p5 = null;
    }
  }

  workOutTextWidth(textLength : number) : void {
    this.textWidth = textLength * this.SquareSideSize;
  }

  centraliseDrawing(p : p5, canvasWidth : number , canvasHeight : number) : void {
    if (p) {
      const centralCoordinate = (canvasWidth - this.textWidth)/2;
      p.translate(centralCoordinate , canvasHeight / 2);
    }
  }

  drawTextAndPattern(p : p5 ,textLettersToDraw : Letter[] , patternLettersToDraw : Letter[] , patternOffset : number) {
    if (this.p5) {
      p.background(255);

      const graphicalOffset = patternOffset * this.SquareSideSize;
      this.workOutTextWidth(textLettersToDraw.length);
      this.centraliseDrawing(p , this.p5.width , this.p5.height);
      this.drawText(p , textLettersToDraw);
      this.drawPattern(p, patternLettersToDraw , graphicalOffset);
    }
  }

  private drawText(p : p5, lettersToDraw : Letter[]) {
      lettersToDraw.forEach(letterObject => {
        let y = 0;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;
        const textOffset = (index > 9) ? this.DoubleCharTextOffset : this.SingleCharTextOffset;

        if (this.p5) {
          this.p5.text(index , index * this.SquareSideSize + textOffset , y);
          y = y + 10;
          p.fill(colour.toString());
          p.strokeWeight(strokeWeight);
          p.rect(index * this.SquareSideSize + this.RectangleOffset , y , this.SquareSideSize , this.SquareSideSize);
          y = y + 15;
          p.fill("#000000");
          p.strokeWeight(1);
          p.text(letter , index * this.SquareSideSize  + textOffset , y);
        }
      });

  }


    private drawPattern(p : p5 , lettersToDraw : Letter[] , offset : number) {

      lettersToDraw.forEach(letterObject => {
        let y = 40;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        if (p) {
          p.fill(colour.toString());
          p.strokeWeight(strokeWeight);
          p.rect(index * this.SquareSideSize + this.RectangleOffset  + offset , y , this.SquareSideSize , this.SquareSideSize);
          y = y + 15;
          p.fill("#000000");
          p.strokeWeight(1);
          p.text(letter ,index * this.SquareSideSize + this.SingleCharTextOffset  + offset  , y);
        }
      })


  }
}
