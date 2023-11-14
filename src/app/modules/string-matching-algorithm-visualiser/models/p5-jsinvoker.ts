import * as p5 from 'p5';
import { AlgorithmStep } from './algorithm-step.model';
import { P5jsDrawService } from '../services/p5js-draw.service';

/**
 * Original code by soler1212. The software will be
 * distributed under the GPL-3.0 license as per the requirements.
 * Changes:
 * - Add width , height , text and pattern parameters to startP5JS method and the setup method.
 * @description Abstract class that provides a p5 instance to the child class.
 * @copyright https://github.com/soler1212/P5JSInvoker
 */
export abstract class P5JSInvoker {
  protected p5: p5 | null = null;
  protected step : AlgorithmStep | null = null;
  protected squareSideSize : number;
  private readonly MinimumSquareSideSize = 20;
  private readonly MaximumSquareSideSize = 40;

  abstract setup(p : p5 , width : number , height : number) : void;
  abstract draw(p : p5 , squareSideSize : number) : void;

  protected startP5JS(containerElement: HTMLElement , width : number , height : number , initialStep : AlgorithmStep, object : P5jsDrawService): void {
    this.step = initialStep;
    if (this.p5) this.p5.remove();
    this.p5 = null;
    const squareSideSize = this.determineSquareSize(20 , initialStep.lettersInText.length , width);
    this.squareSideSize = squareSideSize;
    this.p5 = new p5(this.generate_sketch(width , height , squareSideSize), containerElement);
  }

  private generate_sketch(width : number , height : number , squareSideSize : number) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;

      return ((p: p5) => {
        p.setup = function() {
            that.setup(p , width , height);
        };

        p.draw = function() {
            that.draw(p , that.squareSideSize);
        };
      });
  }

  public changeSquareSize(width : number , length : number) {
    const newSquareSideSize = this.determineSquareSize(this.squareSideSize , length , width);
    this.squareSideSize = newSquareSideSize;
  }

  protected resizeCanvas(p : p5 , width : number , height : number) {
    const length = this.step ? this.step.lettersInText.length : 0;
    const newSquareSideSize = this.determineSquareSize(this.squareSideSize , length , width);
    this.squareSideSize = newSquareSideSize;
    p.resizeCanvas(width , height);
  }

  protected determineSquareSize(currentSquareSize : number , textLength : number , canvasWidth : number) : number {
    let lengthInPixels = textLength * currentSquareSize;
    if (lengthInPixels > canvasWidth) {
      while (lengthInPixels > canvasWidth-currentSquareSize && currentSquareSize > this.MinimumSquareSideSize) {
        currentSquareSize = currentSquareSize - 1;
        lengthInPixels = textLength * currentSquareSize;
      }
    } else {
      while (lengthInPixels < canvasWidth-currentSquareSize && currentSquareSize < this.MaximumSquareSideSize) {
        currentSquareSize = currentSquareSize + 1;
        lengthInPixels = textLength * currentSquareSize;
      }
    }
    return currentSquareSize;
  }

  public activeWindow(canvasWidth : number , squareSideSize : number , textLength : number) {
    if (squareSideSize != this.MinimumSquareSideSize) {
      return false;
    }
    const currentWidth = squareSideSize * textLength;
    if (currentWidth > (canvasWidth - squareSideSize)) {
      return true;
    }
    return false;
  }
}