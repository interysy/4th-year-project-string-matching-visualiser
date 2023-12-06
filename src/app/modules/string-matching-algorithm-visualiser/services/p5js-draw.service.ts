import * as p5 from 'p5';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { Letter } from '../models/letter.model';
import { Subject } from 'rxjs';

export class P5jsDrawService {

  private readonly DefaultSquareSize = 20;
  private readonly RectangleOffset = 5;
  private readonly SingleCharTextOffset = 10;
  private readonly DoubleCharTextOffset = 7;
  private readonly MinimumSquareSideSize = 20;
  private readonly MaximumSquareSideSize = 40;

  private p5: p5;
  private listItemWidth = 40;
  private scrollX = 0;
  private squareSideSize : number;
  private step : AlgorithmStep;
  private changeSizeSubject = new Subject<{width : number , height : number}>();
  private scrollable : boolean;

  constructor(containerElement: HTMLDivElement, width: number, height: number, initialTextLength : number, customDrawFunction: (p5: p5) => void , scrollable = false) {
    this.squareSideSize = this.determineSquareSize(this.DefaultSquareSize , initialTextLength, width);
    this.p5 = new p5(this.generate_sketch(width, height , customDrawFunction), containerElement);
    this.scrollable = scrollable;
  }

  set stepSetter(step : AlgorithmStep) {
    this.step = step;
    this.squareSideSize = this.determineSquareSize(this.squareSideSize , step.lettersInText.length , this.p5.width);
  }

  private generate_sketch(width: number, height: number ,  customDrawFunction : ((p5: p5) => void)) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return ((p5: p5) => {
      p5.setup = function () {
        that.setup(p5, width, height);
      };

      p5.draw = function () {
        customDrawFunction(p5);

      };

      p5.mouseWheel = function (event) {
        if (that.isMouseOverCanvas() && that.scrollable) {
          that.mouseWheel(event);
        }
      };
    });
  }


  isMouseOverCanvas() {
    return this.p5.mouseX > 0 && this.p5.mouseX < this.p5.width && this.p5.mouseY > 0 && this.p5.mouseY < this.p5.height;
  }

  setup(p: p5, width: number, height: number) {
    p.createCanvas(width, height);
    this.changeSizeSubject.subscribe( sizes => {
      this.resizeCanvas(sizes.width , sizes.height);
    });
  }

  mouseWheel(event : any) {

    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    if (lastOccuranceTable) {
      event.preventDefault();
      this.scrollX += event.deltaY;
      this.scrollX = this.p5.constrain(this.scrollX, 0, Object.entries(lastOccuranceTable).length * this.listItemWidth - this.p5.width);
    }

  }

  centraliseTextAndPattern(textWidth : number) : void {
    const centralXCoordinate = (this.p5.width - textWidth)/2;
    this.p5.translate(centralXCoordinate , 0);
  }


  drawTextAndPattern(p : p5) {
    p.background(255);
    if (this.activeWindow(p.width)) {
      this.centraliseTextAndPattern(((this.step.patternOffset * 2 + this.step.lettersInPattern.length ) * this.squareSideSize));
    } else {
      this.centraliseTextAndPattern(this.step.lettersInText.length * this.squareSideSize);
    }

    const patternOffset = this.step.patternOffset;
    const textLettersToDraw = this.step.lettersInText;
    const patternLettersToDraw = this.step.lettersInPattern;
    const graphicalOffset = patternOffset * this.squareSideSize;

    this.drawText(textLettersToDraw , this.squareSideSize);
    this.drawPattern(patternLettersToDraw , graphicalOffset , this.squareSideSize);

  }

  private drawText(lettersToDraw : Letter[] , squareSideSize : number) {
      lettersToDraw.forEach(letterObject => {
        let y = 100;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;
        const textOffset = (index > 9) ? this.DoubleCharTextOffset : this.SingleCharTextOffset;

        if (this.p5) {
          this.p5.text(index , index * squareSideSize + textOffset , y);
          y = y + 10;
          this.p5.fill(colour.toString());
          this.p5.strokeWeight(strokeWeight);
          this.p5.rect(index * squareSideSize + this.RectangleOffset , y , squareSideSize , squareSideSize);
          y = y + 15;
          this.p5.fill("#000000");
          this.p5.strokeWeight(1);
          this.p5.text(letter , index * squareSideSize  + textOffset , y);
        }
      });

  }


    private drawPattern(lettersToDraw : Letter[] , offset : number , squareSideSize : number) {

      lettersToDraw.forEach(letterObject => {
        let y = 125 + squareSideSize;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        if (this.p5) {
          this.p5.fill(colour.toString());
          this.p5.strokeWeight(strokeWeight);
          this.p5.rect(index * squareSideSize + this.RectangleOffset  + offset , y , squareSideSize , squareSideSize);
          y = y + 15;
          this.p5.fill("#000000");
          this.p5.strokeWeight(1);
          this.p5.text(letter ,index * squareSideSize + this.SingleCharTextOffset  + offset  , y);
        }
      })
  }

  drawLastOccurrenceTable(p5 : p5) {
    p5.background(220);

    p5.text("Last Occurrence Table:" , 0 , 10);


    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    if (lastOccuranceTable) {

      let i = 0;
      for (const [key, value] of Object.entries(lastOccuranceTable)) {
        const xPos = i * this.listItemWidth - this.scrollX;
        if (xPos > -this.listItemWidth && xPos < p5.width) {
          p5.fill(255);
          p5.rect(xPos + this.listItemWidth - 20 , 20 , 30 , 30);
          p5.fill(0);
          p5.fill(255);
          p5.rect(xPos + this.listItemWidth - 20 , 22 , 35 , 30);
          p5.fill(0);
          p5.text(key, xPos + this.listItemWidth - 20, 20);
          p5.text(value as string, xPos + this.listItemWidth - 20, 20);
        }
        i++;
      }
    }
  }

  public changeSquareSize(length : number) {
    const width = this.p5.width;
    const newSquareSideSize = this.determineSquareSize(this.squareSideSize , length , width);
    this.squareSideSize = newSquareSideSize;
  }

  public resizeCanvas(width : number , height : number) {
    const length = this.step ? this.step.lettersInText.length : 0;
    const newSquareSideSize = this.determineSquareSize(this.squareSideSize , length , width);
    this.squareSideSize = newSquareSideSize;
    this.p5.resizeCanvas(width , height);
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

  private activeWindow(canvasWidth : number) {
    if (this.squareSideSize != this.MinimumSquareSideSize) {
      return false;
    }
    const currentWidth = this.squareSideSize * this.step.lettersInText.length;
    if (currentWidth > (canvasWidth - this.squareSideSize)) {
      return true;
    }
    return false;
  }
}