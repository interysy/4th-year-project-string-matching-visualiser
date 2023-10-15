import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { P5JSInvoker } from '../models/p5-jsinvoker';

@Injectable({
  providedIn: 'root'
})
export class P5jsDrawService extends P5JSInvoker {


  initiate(canvas : HTMLElement | null) {
    if (canvas) this.startP5JS(canvas);
  }

  setup(p:p5) {
    p.createCanvas(400, 400);
  }

  draw(p:p5) {
    p.stroke(0);
    p.circle(200, 200, 200);
  }


  drawMore(where : number) {
    console.log("drawing more");
    this.p5.stroke(0);
    this.p5.circle(where,0,200);
  }
}
