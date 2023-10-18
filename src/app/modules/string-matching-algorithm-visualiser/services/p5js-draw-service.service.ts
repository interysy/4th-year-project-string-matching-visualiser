import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { LetterDraw } from '../models/letter-draw.model';

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

  private oldOffset = 0;

  initiate(canvas : HTMLElement | null , width : number , height : number , text : string , pattern : string) {

    if (canvas) this.startP5JS(canvas , text , pattern , width , height);
  }

  setup(p:p5 , width : number , height : number, text : string , pattern : string) {
    p.createCanvas(width, height);
  }

  draw(p : p5) {
    return;
  }

  resizeCanvas(width : number , height : number , text : string , pattern : string) {
    this.p5.resizeCanvas(width, height);
    //this.drawTextAndPattern(text , pattern);
  }

  private drawText(text : string , toHighlight :  LetterDraw[]) {
    [...text].forEach((char , index) => {
      let y = 0;
      const relatedLetter = toHighlight.find(indexToHighlight => indexToHighlight.index  === index);
      const iterationFill  = relatedLetter?.colour ?  relatedLetter.colour : this.DefaultFill;
      const strokeWeight = relatedLetter?.weight ? relatedLetter.weight : 1;
      const textOffset = (index > 9) ? this.DoubleCharTextOffset : this.SingleCharTextOffset;

      this.p5.text(index , index * this.SquareSideSize + textOffset , y);
      y = y + 10;
      this.p5.fill(iterationFill);
       this.p5.strokeWeight(strokeWeight);
      this.p5.rect(index * this.SquareSideSize + this.RectangleOffset , y , this.SquareSideSize , this.SquareSideSize);
      y = y + 15;
      this.p5.fill("#000000");
      this.p5.strokeWeight(1);
      this.p5.text(char , index * this.SquareSideSize  + textOffset , y);
    });
  }

  private drawPattern(pattern : string , offset : number , toHighlight : LetterDraw[]) {
    [...pattern].forEach((char , index) => {
      const relatedLetter = toHighlight.find(indexToHighlight => indexToHighlight.index  === index);
      const iterationFill  = relatedLetter?.colour ?  relatedLetter.colour : this.DefaultFill;
      const strokeWeight = relatedLetter?.weight ? relatedLetter.weight : 1;

      let y = 40;


      this.p5.fill(iterationFill);
      this.p5.strokeWeight(strokeWeight);
      this.p5.rect(index * this.SquareSideSize + this.RectangleOffset  + offset , y , this.SquareSideSize , this.SquareSideSize);
      y = y + 15;
      this.p5.fill("#000000");
      this.p5.strokeWeight(1);
      this.p5.text(char ,index * this.SquareSideSize + this.SingleCharTextOffset  + offset  , y);
    })
  }

  // private drawPattern(pattern : string , fill = "#ffffff" , patternOffset = 0 , alreadyMatched : number[] = []) {
  //   const oldFill = fill;
  //   [...pattern].forEach((char , index) => {
  //     if (alreadyMatched.indexOf(index) !== -1) {
  //       fill = MatchingAlgorithmColourConstants.MATCH;
  //     } else {
  //       fill = oldFill;
  //     }

  //     this.p5.fill(fill);
  //     this.p5.rect(index * 20 + 5  + patternOffset , 40 , 20 , 20);
  //     this.p5.fill("#000000");
  //     this.p5.text(char , index * 20 + 10 + patternOffset , 55);
  //   });
  // }

  drawTextAndPattern(text : string , pattern : string , patternOffset : number, alreadyMatchedText :  LetterDraw[], alreadyMatchedPattern :  LetterDraw[] ) {
    const offset = (patternOffset == -1) ? this.oldOffset :  patternOffset * this.SquareSideSize;
    this.oldOffset = offset;
    this.p5.background(255);
    this.workOutTextWidth(text);
    this.centraliseDrawing(this.p5.width , this.p5.height);
    this.drawText(text ,alreadyMatchedText);
    this.drawPattern(pattern , offset, alreadyMatchedPattern);
  }

  workOutTextWidth(text : string) : void {
    this.textWidth = text.length * this.SquareSideSize;
  }

  centraliseDrawing(canvasWidth : number , canvasHeight : number) : void {
    const centralCoordinate = (canvasWidth - this.textWidth)/2;
    this.p5.translate(centralCoordinate , canvasHeight / 2);
  }


  // highlightTextAndPattern(text : string , pattern : string , textColor : boolean , patternColor : boolean ) {
  //   this.p5.background(255);
  //   this.workOutTextWidth(text);
  //   this.centraliseDrawing(this.p5.width , this.p5.height);

  //   if (textColor) {
  //     this.drawText(text ,  [] , MatchingAlgorithmColourConstants.CHECKING);
  //   } else {
  //     this.drawText(text , [] , MatchingAlgorithmColourConstants.DEFAULT);
  //   }

  //   if (patternColor) {
  //     this.drawPattern(pattern ,MatchingAlgorithmColourConstants.CHECKING , this.oldOffset);
  //   } else {
  //     this.drawPattern(pattern);
  //   }

  // }

  // movePattern(textIndex : number , text : string , pattern : string) {
  //   const offset = textIndex *  this.SquareSideSize;
  //   this.oldOffset = offset;
  //   this.drawTextAndPattern(text , pattern , offset);
  // }

  // highlightSpecificSquares(color : string , textIndex : number , patternIndex : number , alreadyMatchedPattern : number[] , alreadyMatchedText : number[] , text : string , pattern : string) {
  //   alreadyMatchedText = alreadyMatchedText.map(textIndex => textIndex - 1);
  //   alreadyMatchedPattern = alreadyMatchedPattern.map(patternIndex => patternIndex - 1);
  //   this.drawTextAndPattern(text , pattern , this.oldOffset , alreadyMatchedText , alreadyMatchedPattern);
  // }

}
