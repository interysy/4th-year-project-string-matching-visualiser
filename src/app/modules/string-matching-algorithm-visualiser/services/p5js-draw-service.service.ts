import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';

@Injectable({
  providedIn: 'root'
})
export class P5jsDrawService extends P5JSInvoker {

  private readonly SquareSize = 20

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
    this.drawTextAndPattern(text , pattern);
  }


  private drawText(text : string , fill = "#ffffff" , alreadyMatched : number[] = []) {
    const oldFill = fill;
    [...text].forEach((char , index) => {
      if (alreadyMatched.indexOf(index) !== -1) {
        fill = MatchingAlgorithmColourConstants.MATCH;
      } else {
        fill = oldFill;
      }

      this.p5.text(index , index * 20 + 10 , 10);
      this.p5.fill(fill);
      this.p5.rect(index * 20 + 5 , 15 , 20 , 20);
      this.p5.fill("#000000");
      this.p5.text(char , index * 20  + 10 , 30);
    })
  }

  private drawPattern(pattern : string , fill = "#ffffff" , patternOffset = 0 , alreadyMatched : number[] = []) {
    const oldFill = fill;
    [...pattern].forEach((char , index) => {
      if (alreadyMatched.indexOf(index) !== -1) {
        fill = MatchingAlgorithmColourConstants.MATCH;
      } else {
        fill = oldFill;
      }

      this.p5.fill(fill);
      this.p5.rect(index * 20 + 5  + patternOffset , 40 , 20 , 20);
      this.p5.fill("#000000");
      this.p5.text(char , index * 20 + 10 + patternOffset , 55);
    });
  }

  drawTextAndPattern(text : string , pattern : string , patternOffset = 0 , alreadyMatchedText : number[] = [] , alreadyMatchedPattern : number[] = []) {
    this.p5.background(255);

    this.workOutTextWidth(text);
    this.centraliseDrawing(this.p5.width , this.p5.height);
    this.drawText(text , "#ffffff",alreadyMatchedText);
    this.drawPattern(pattern , "#ffffff", patternOffset , alreadyMatchedPattern);
  }

  workOutTextWidth(text : string) : void {
    this.textWidth = text.length * this.SquareSize;
  }

  centraliseDrawing(canvasWidth : number , canvasHeight : number) : void {
    const centralCoordinate = (canvasWidth - this.textWidth)/2;
    this.p5.translate(centralCoordinate , canvasHeight / 2);
  }


  highlightTextAndPattern(text : string , pattern : string , textColor : boolean , patternColor : boolean ) {
    this.p5.background(255);
    this.workOutTextWidth(text);
    this.centraliseDrawing(this.p5.width , this.p5.height);

    if (textColor) {
      this.drawText(text , MatchingAlgorithmColourConstants.CHECKING);
    } else {
      this.drawText(text);
    }

    if (patternColor) {
      this.drawPattern(pattern ,MatchingAlgorithmColourConstants.CHECKING , this.oldOffset);
    } else {
      this.drawPattern(pattern);
    }

  }

  movePattern(textIndex : number , text : string , pattern : string) {
    const offset = textIndex *  this.SquareSize;
    this.oldOffset = offset;
    this.drawTextAndPattern(text , pattern , offset);
  }

  highlightSpecificSquares(color : string , textIndex : number , patternIndex : number , alreadyMatchedPattern : number[] , alreadyMatchedText : number[] , text : string , pattern : string) {
    alreadyMatchedText = alreadyMatchedText.map(textIndex => textIndex - 1);
    alreadyMatchedPattern = alreadyMatchedPattern.map(patternIndex => patternIndex - 1);
    this.drawTextAndPattern(text , pattern , this.oldOffset , alreadyMatchedText , alreadyMatchedPattern);
  }

}
