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
  private listItemHeight = 40;
  private scrollY = 0;
  // private list: {character : string , number : number}[] = [];
  private squareSideSize : number;
  private textAndPatternHeight : number;
  customDrawFunction: ((p5: p5) => void);
  step : AlgorithmStep;
  changeSizeSubject = new Subject<{width : number , height : number}>();

  constructor(containerElement: HTMLDivElement, width: number, height: number, initialTextLength : number, customDrawFunction: (p5: p5) => void) {
    console.log(customDrawFunction);
    this.customDrawFunction = customDrawFunction;
    this.squareSideSize = this.determineSquareSize(this.DefaultSquareSize , initialTextLength, width);
    this.textAndPatternHeight = this.squareSideSize * 2 + 10 + 15;
    this.p5 = new p5(this.generate_sketch(width, height), containerElement);
  }

  set stepSetter(step : AlgorithmStep) {
    this.step = step;
    const squareSideSize = this.determineSquareSize(20 , step.lettersInText.length , this.p5.width);
    this.squareSideSize = squareSideSize;
  }

  private generate_sketch(width: number, height: number) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return ((p5: p5) => {
      p5.setup = function () {
        that.setup(p5, width, height);
      };

      p5.draw = function () {
        that.customDrawFunction(p5);

      };

      p5.mouseWheel = function (event) {
        if (that.isMouseOverCanvas(p5)) {
          that.mouseWheel(p5, event);
        }
      };
    });
  }

  // draw(p5: p5) {
  //   p5.background(220)
  //   p5.fill(0);
  //   p5.textSize(20);
  //   for (let i = 0; i < this.list.length; i++) {
  //     const yPos = i * this.listItemHeight - this.scrollY;
  //     if (yPos > -this.listItemHeight && yPos < this.canvasHeight) {
  //       p5.text(this.list[i], 20, yPos + this.listItemHeight);
  //     }
  //   }
  // }

  isMouseOverCanvas(p5: p5) {
    return p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height;
  }

  setup(p: p5, width: number, height: number) {
    p.createCanvas(width, height);
    this.changeSizeSubject.subscribe( sizes => {
      this.resizeCanvas(p , sizes.width , sizes.height);
    });
  }

  mouseWheel(p5 : p5 , event : any) {

    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    console.log(lastOccuranceTable)
    if (lastOccuranceTable) {
      event.preventDefault();
      this.scrollY += event.deltaY;
      this.scrollY = p5.constrain(this.scrollY, 0, Object.entries(lastOccuranceTable).length * this.listItemHeight - p5.height);
    }

  }

  centraliseTextAndPattern(p5 : p5 , width : number , height : number , textWidth : number) : void {
    const centralXCoordinate = (width - textWidth)/2;
    const centralYCoordinate = (height - this.textAndPatternHeight)/2;
    // const centralYCoordinate = (canvasHeight - 50)/2;
    p5.translate(centralXCoordinate , centralYCoordinate);
  }


  drawTextAndPattern(p : p5) {
    console.log("draw wtf")
    p.background(255);
    if (this.activeWindow(p.width)) {
      this.centraliseTextAndPattern(p, p.width , p.height , ((this.step.patternOffset * 2 + this.step.lettersInPattern.length ) * this.squareSideSize));
    } else {
      this.centraliseTextAndPattern(p , p.width , p.height , this.step.lettersInText.length * this.squareSideSize);
    }

    const patternOffset = this.step.patternOffset;
    const textLettersToDraw = this.step.lettersInText;
    const patternLettersToDraw = this.step.lettersInPattern;
    const graphicalOffset = patternOffset * this.squareSideSize;

    this.drawText(p , textLettersToDraw , this.squareSideSize);
    this.drawPattern(p, patternLettersToDraw , graphicalOffset , this.squareSideSize);

  }

  private drawText(p : p5, lettersToDraw : Letter[] , squareSideSize : number) {
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

  drawLastOccurrenceTable(p5 : p5) {
    p5.background(220);

    p5.text("Last Occurrence Table:" , 0 , 10);


    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    if (lastOccuranceTable) {

      let i = 0;
      for (const [key, value] of Object.entries(lastOccuranceTable)) {
        const yPos = i * this.listItemHeight - this.scrollY;
        if (yPos > -this.listItemHeight && yPos < p5.height) {
          p5.fill(255);
          p5.rect(20 , yPos + this.listItemHeight - 20 , 30 , 30);
          p5.fill(0);
          p5.fill(255);
          p5.rect(55 , yPos + this.listItemHeight - 20 , 35 , 30);
          p5.fill(0);
          p5.text(key, 27.5, yPos + this.listItemHeight);
          p5.text(value as string, 62.5, yPos + this.listItemHeight);
        }
        i++;
      }
    }

  }
  // public drawLastOccuranceTable(p5 : p5) {
  //   console.log("fucking drawing so fuckoffs")
  //   p5.background(220)
  //   p5.fill(0);
  //   p5.textSize(20);
  //   console.log(this.step)
  //   console.log(this.step.additional)
  //   const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
  //   console.log(lastOccuranceTable);
  //   let i = 0;
  //   for (const [key, value] of Object.entries(lastOccuranceTable)) {
  //     const yPos = i * this.listItemHeight - this.scrollY;
  //     if (yPos > -this.listItemHeight && yPos < this.canvasHeight) {
  //       p5.text(key , 20, yPos + this.listItemHeight);
  //       console.log(key);
  //       // p5.text(value , 20, yPos + this.listItemHeight);
  //     }
  //     i++;
  //   }

    // for (let i = 0; i < this.list.length; i++) {
    //   const yPos = i * this.listItemHeight - this.scrollY;
    //   if (yPos > -this.listItemHeight && yPos < this.canvasHeight) {
    //     p5.fill(255);
    //     p5.rect(20 , yPos + this.listItemHeight - 20 , 30 , 30);
    //     p5.fill(0);
    //     p5.fill(255);
    //     p5.rect(55 , yPos + this.listItemHeight - 20 , 35 , 30);
    //     p5.fill(0);
    //     p5.text(this.list[i].character, 27.5, yPos + this.listItemHeight);
    //     p5.text(this.list[i].number, 62.5, yPos + this.listItemHeight);
    //   }
    // }
  // }


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
