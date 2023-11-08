import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { Letter } from '../models/letter.model';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { DrawStepDecorator } from '../models/drawer-step.decorator';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class P5jsDrawService extends P5JSInvoker {

  private squareSideSize = 20;
  private readonly DefaultFill  = MatchingAlgorithmColourConstants.DEFAULT;
  private readonly RectangleOffset = 5;
  private readonly SingleCharTextOffset = 10;
  private readonly DoubleCharTextOffset = 7;

  private textWidth : number;
  algorithm : DrawStepDecorator;
  changeSizeSubject = new Subject<{width : number , height : number}>();


  initiate(canvas : HTMLElement | null , width : number , height : number, step : AlgorithmStep, algorithm : DrawStepDecorator) {
    if (canvas) this.startP5JS(canvas , width , height , step) ;
    this.algorithm = algorithm;
  }

  setup(p:p5 , width : number , height : number) {
    p.createCanvas(width, height);

    this.changeSizeSubject.subscribe( sizes => {
      this.resizeCanvas(p , sizes.width , sizes.height);
    });
  }

  draw(p : p5) {
    //console.log("drawing in ", this.squareSideSize);
    if (this.step && this.algorithm) {
      this.algorithm.draw(p , this.step);
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
    this.textWidth = textLength * this.squareSideSize;
  }

  centraliseDrawing(p : p5, canvasWidth : number , canvasHeight : number) : void {
    if (p) {
      const centralCoordinate = (canvasWidth - this.textWidth)/2;
      p.translate(centralCoordinate , canvasHeight / 2);
    }
  }

  decenraliseDrawing(p : p5 , canvasWidth : number , canvasHeight : number) : void {
    if (p) {
      const centralCoordinate = (canvasWidth - this.textWidth)/2;
      p.translate(-centralCoordinate , -canvasHeight / 2);
    }
  }

  drawTextAndPattern(p : p5 ,textLettersToDraw : Letter[] , patternLettersToDraw : Letter[] , patternOffset : number) {
    if (p) {

      const graphicalOffset = patternOffset * this.squareSideSize;
      this.drawText(p , textLettersToDraw);
      this.drawPattern(p, patternLettersToDraw , graphicalOffset);
    }
  }

  private drawText(p : p5, lettersToDraw : Letter[]) {
    //console.log("drawing in ", this.squareSideSize);
      lettersToDraw.forEach(letterObject => {
        let y = 0;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;
        const textOffset = (index > 9) ? this.DoubleCharTextOffset : this.SingleCharTextOffset;

        if (p) {
          p.text(index , index * this.squareSideSize + textOffset , y);
          y = y + 10;
          p.fill(colour.toString());
          p.strokeWeight(strokeWeight);
          p.rect(index * this.squareSideSize + this.RectangleOffset , y , this.squareSideSize , this.squareSideSize);
          y = y + 15;
          p.fill("#000000");
          p.strokeWeight(1);
          p.text(letter , index * this.squareSideSize  + textOffset , y);
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
          p.rect(index * this.squareSideSize + this.RectangleOffset  + offset , y , this.squareSideSize , this.squareSideSize);
          y = y + 15;
          p.fill("#000000");
          p.strokeWeight(1);
          p.text(letter ,index * this.squareSideSize + this.SingleCharTextOffset  + offset  , y);
        }
      })
  }

  public drawLastOccuranceTable(p : p5 , lastOccuranceTable : {[character : string] : number}) {

    if (p) {
      let y = 100;
      p.text("lastOccuranceTable = {" , 0 , y)
      y  += 15;
      p.fill("#000000");
      for (const [key, value] of Object.entries(lastOccuranceTable)) {
        p.text(key + ':' + value + ',', this.squareSideSize , y);
        y += 10;
      }
      p.text('}', 0 , y);
    }
  }

  private resizeCanvas(p : p5 , width : number , height : number) {
    if (this.step) {
      //console.log("determine")
      const newSquareSize = this.determineSquareSize(this.squareSideSize , this.step.lettersInText.length , width)
      //console.log("new size" , newSquareSize)
      this.squareSideSize = newSquareSize;
      //console.log("updated " , this.squareSideSize)
    }
   //console.log("again check" , this.squareSideSize)

    p.resizeCanvas(width, height);

      //this.drawTextAndPattern(text , pattern);
    }

    private determineSquareSize(currentSquareSize : number , textLength : number , canvasWidth : number) : number {
      let lengthInPixels = textLength * currentSquareSize;
      if (lengthInPixels > canvasWidth) {
        //console.log("need decrease")
        while (lengthInPixels > canvasWidth) {
          currentSquareSize = currentSquareSize - 1;
          //console.log("new size" , currentSquareSize)
          lengthInPixels = textLength * currentSquareSize;
        }
      } else {
        while (lengthInPixels < canvasWidth) {
          currentSquareSize = currentSquareSize + 1;
          lengthInPixels = textLength * currentSquareSize;
        }
      }
      return currentSquareSize;
    }

}
