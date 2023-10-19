import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { Letter } from '../models/letter.model';

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

  initiate(canvas : HTMLElement | null , width : number , height : number) {

    if (canvas) this.startP5JS(canvas , width , height) ;
  }

  setup(p:p5 , width : number , height : number) {
    p.createCanvas(width, height);
  }

  draw() {
    return;
  }

  workOutTextWidth(textLength : number) : void {
    this.textWidth = textLength * this.SquareSideSize;
  }

  centraliseDrawing(canvasWidth : number , canvasHeight : number) : void {
    const centralCoordinate = (canvasWidth - this.textWidth)/2;
    this.p5.translate(centralCoordinate , canvasHeight / 2);
  }

  drawTextAndPattern(textLettersToDraw : Letter[] , patternLettersToDraw : Letter[] , patternOffset : number) {
    this.p5.background(255);

    const graphicalOffset = patternOffset * this.SquareSideSize;
    this.workOutTextWidth(textLettersToDraw.length);
    this.centraliseDrawing(this.p5.width , this.p5.height);
    this.drawText(textLettersToDraw);
    this.drawPattern(patternLettersToDraw , graphicalOffset);
  }

  private drawText(lettersToDraw : Letter[]) {

    lettersToDraw.forEach(letterObject => {
      console.log(letterObject)
      let y = 0;
      const index = letterObject.index;
      const colour = letterObject.colour;
      const letter = letterObject.letter;
      const strokeWeight = letterObject.strokeWeight;
      const textOffset = (index > 9) ? this.DoubleCharTextOffset : this.SingleCharTextOffset;

      this.p5.text(index , index * this.SquareSideSize + textOffset , y);
      y = y + 10;
      this.p5.fill(colour.toString());
      this.p5.strokeWeight(strokeWeight);
      this.p5.rect(index * this.SquareSideSize + this.RectangleOffset , y , this.SquareSideSize , this.SquareSideSize);
      y = y + 15;
      this.p5.fill("#000000");
      this.p5.strokeWeight(1);
      this.p5.text(letter , index * this.SquareSideSize  + textOffset , y);
    });
  }


    private drawPattern(lettersToDraw : Letter[] , offset : number) {

      lettersToDraw.forEach(letterObject => {
        let y = 40;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;


        this.p5.fill(colour.toString());
        this.p5.strokeWeight(strokeWeight);
        this.p5.rect(index * this.SquareSideSize + this.RectangleOffset  + offset , y , this.SquareSideSize , this.SquareSideSize);
        y = y + 15;
        this.p5.fill("#000000");
        this.p5.strokeWeight(1);
        this.p5.text(letter ,index * this.SquareSideSize + this.SingleCharTextOffset  + offset  , y);
      })


  }
}
