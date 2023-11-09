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

  private readonly RectangleOffset = 5;
  private readonly SingleCharTextOffset = 10;
  private readonly DoubleCharTextOffset = 7;

  textWidth : number;
  algorithm : DrawStepDecorator;
  changeSizeSubject = new Subject<{width : number , height : number}>();


  initiate(canvas : HTMLElement | null , width : number , height : number, step : AlgorithmStep, algorithm : DrawStepDecorator ) {
    if (canvas) this.startP5JS(canvas , width , height , step , this) ;
    this.algorithm = algorithm;
  }

  setup(p:p5 , width : number , height : number) {
    p.createCanvas(width, height);

    this.changeSizeSubject.subscribe( sizes => {
      this.resizeCanvas(p , sizes.width , sizes.height);
    });
  }

  draw(p : p5 , squareSideSize : number) {
    if (this.step && this.algorithm) {
      this.algorithm.draw(p , this.step , squareSideSize);
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

  workOutTextWidth(textLength : number , squareSideSize : number) : number {
    return textLength * squareSideSize;
  }

  centraliseDrawing(p : p5, canvasWidth : number , canvasHeight : number, textWidth : number) : void {
    if (p) {
      const centralCoordinate = (canvasWidth - textWidth)/2;
      p.translate(centralCoordinate , 0);
    }
  }

  decentraliseDrawing(p : p5 , canvasWidth : number , canvasHeight : number , textWidth : number) : void {
    if (p) {
      const centralCoordinate = (canvasWidth - this.textWidth)/2;
      p.translate(-centralCoordinate , 0);
    }
  }

  drawTextAndPattern(p : p5 ,textLettersToDraw : Letter[] , patternLettersToDraw : Letter[] , patternOffset : number , squareSideSize : number) {
    if (p) {

      const graphicalOffset = patternOffset * squareSideSize;
      this.drawText(p , textLettersToDraw , squareSideSize);
      this.drawPattern(p, patternLettersToDraw , graphicalOffset , squareSideSize);
    }
  }

  private drawText(p : p5, lettersToDraw : Letter[] , squareSideSize : number) {
    //console.log("drawing in ", this.squareSideSize);
      lettersToDraw.forEach(letterObject => {
        let y = 100;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;
        const textOffset = (index > 9) ? this.DoubleCharTextOffset : this.SingleCharTextOffset;

        if (p) {
          p.text(index , index * squareSideSize + textOffset , y);
          y = y + 10;
          p.fill(colour.toString());
          p.strokeWeight(strokeWeight);
          p.rect(index * squareSideSize + this.RectangleOffset , y , squareSideSize , squareSideSize);
          y = y + 15;
          p.fill("#000000");
          p.strokeWeight(1);
          p.text(letter , index * squareSideSize  + textOffset , y);
        }
      });

  }


    private drawPattern(p : p5 , lettersToDraw : Letter[] , offset : number , squareSideSize : number) {

      lettersToDraw.forEach(letterObject => {
        let y = 125 + squareSideSize;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        if (p) {
          p.fill(colour.toString());
          p.strokeWeight(strokeWeight);
          p.rect(index * squareSideSize + this.RectangleOffset  + offset , y , squareSideSize , squareSideSize);
          y = y + 15;
          p.fill("#000000");
          p.strokeWeight(1);
          p.text(letter ,index * squareSideSize + this.SingleCharTextOffset  + offset  , y);
        }
      })
  }

  public drawLastOccuranceTable(p : p5 , lastOccuranceTable : {[character : string] : number} , lastOccuranceCharacter : string | null, squareSideSize : number) {

    if (p) {
      let y = 20;
      let x = 20;
      p.text("lastOccuranceTable = {" , 0 , y)
      y  += 15;
      p.fill("#000000");
      for (const [key, value] of Object.entries(lastOccuranceTable)) {
        if (lastOccuranceCharacter && key == lastOccuranceCharacter) {
          p.fill(MatchingAlgorithmColourConstants.MISMATCH);
        } else {
          p.fill("#000000");
        }
        p.text(key + ':' + value + ',', x , y);
        y += 15;
        if (y > 60) {
          y = 35;
          x += squareSideSize;
        }
      }
      p.text('}', 0 , 70);
    }
  }

  // resizeCanvas(p : p5, width : number , height : number) : void {
  //   if (this.step) {
  //     const newSquareSideSize = this.determineSquareSize(this.squareSideSize , this.step.lettersInText.length , width)
  //     p.resizeCanvas(width, height);
  //     this.squareSideSize = newSquareSideSize;
  //   }
  // }


}
