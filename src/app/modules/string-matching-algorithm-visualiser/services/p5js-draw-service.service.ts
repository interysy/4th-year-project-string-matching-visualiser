import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';
import { text } from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root'
})
export class P5jsDrawService extends P5JSInvoker {

  private readonly SquareSize = 20

  private textWidth : number;

  initiate(canvas : HTMLElement | null , width : number , height : number , text : string , pattern : string) {

    if (canvas) this.startP5JS(canvas , text , pattern , width , height);
  }

  setup(p:p5 , width : number , height : number, text : string , pattern : string) {
    p.createCanvas(width, height);
    this.drawTextAndPattern(text , pattern);
  }

  draw(p : p5) {
    return;
  }

  resizeCanvas(width : number , height : number , text : string , pattern : string) {
    this.p5.resizeCanvas(width, height);
    this.drawTextAndPattern(text , pattern);
  }


  private drawText(text : string) {

    [...text].forEach((char , index) => {
      this.p5.text(index , index * 20 + 10 , 10);
      this.p5.rect(index * 20 + 5 , 15 , 20 , 20);
      this.p5.text(char , index * 20  + 10 , 30);
    })
  }

  private drawPattern(pattern : string) {
    [...pattern].forEach((char , index) => {
      this.p5.rect(index * 20 + 5 , 40 , 20 , 20);
      this.p5.text(char , index * 20 + 10 , 55);
    });
  }

  drawTextAndPattern(text : string , pattern : string) {
    this.p5.background(255);

    this.workOutTextWidth(text);
    this.centraliseDrawing(this.p5.width , this.p5.height);
    this.drawText(text);
    this.drawPattern(pattern);
  }

  workOutTextWidth(text : string) : void {
    this.textWidth = text.length * this.SquareSize;
  }

  centraliseDrawing(canvasWidth : number , canvasHeight : number) : void {
    const centralCoordinate = (canvasWidth - this.textWidth)/2;
    this.p5.translate(centralCoordinate , canvasHeight / 2);
  }
}
