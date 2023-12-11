import * as p5 from 'p5';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { Letter } from '../models/letter.model';
import { Subject } from 'rxjs';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { AlgorithmStepBuilder } from '../model-builders/algorithm-step.builder';

export class P5jsDrawService {

  private readonly DefaultSquareSize = 20;
  private readonly MinimumSquareSideSize = 20;
  private readonly MaximumSquareSideSize = 40;
  private readonly gap = 5;
  private readonly dictionaryGap = 10;
  private readonly dictionaryOffset = 20;
  private readonly DefaultColour = "#FFFFFF";
  private readonly animationMargin = 20;

  private p5: p5 | null;
  private dictionaryElementSize = 60;
  private scrollX = 0;
  private squareSideSize : number;
  private step : AlgorithmStep;
  private previousStep : AlgorithmStep;
  private changeSizeSubject = new Subject<{width : number , height : number}>();
  private scrollable : boolean;
  private textSize = 15;
  private previousLastOccurrenceTable : {[character : string] : number; };
  private algorithmStepBuilder : AlgorithmStepBuilder = new AlgorithmStepBuilder();

  constructor(containerElement: HTMLDivElement, width: number, height: number, initialTextLength : number, customDrawFunction: (p5: p5) => void , scrollable = false) {
    this.squareSideSize = this.determineSquareSize(this.DefaultSquareSize , initialTextLength, width);
    if (customDrawFunction) this.p5 = new p5(this.generate_sketch(width, height , customDrawFunction), containerElement);
    this.scrollable = scrollable;
  }

  set stepSetter(step : AlgorithmStep) {
    this.step = step;
    // if (this.p5) this.squareSideSize = this.determineSquareSize(this.squareSideSize , step.lettersInText.length , this.p5.width);
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


  isMouseOverCanvas() : boolean {
    if (this.p5) return this.p5.mouseX > 0 && this.p5.mouseX < this.p5.width && this.p5.mouseY > 0 && this.p5.mouseY < this.p5.height;
    return false;
  }

  setup(p: p5, width: number, height: number) {
    p.createCanvas(width, height );
    this.changeSizeSubject.subscribe( sizes => {
      this.resizeCanvas(sizes.width , sizes.height);
    });
  }

  mouseWheel(event : any) {

    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    if (lastOccuranceTable && this.p5 && lastOccuranceTable.length * this.dictionaryElementSize > this.p5.width) {
      event.preventDefault();
      this.scrollX += event.deltaY;
      this.scrollX = this.p5.constrain(this.scrollX, 0, Object.entries(lastOccuranceTable).length * this.dictionaryElementSize - this.p5.width);
    }

  }

  centraliseTextAndPattern(textWidth : number) : void {
    if (this.p5) {
      const centralXCoordinate = (this.p5.width - textWidth)/2;
      this.p5.translate(centralXCoordinate , 0);
    }
  }


  drawTextAndPattern(p : p5) {
    p.background(255);
    p.textSize(this.textSize);
    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER , p.CENTER);
    if (this.activeWindow(p.width)) {
      this.centraliseTextAndPattern(((this.step.patternOffset * 2 + this.step.lettersInPattern.length ) * this.squareSideSize));
    } else {
      this.centraliseTextAndPattern(this.step.lettersInText.length * this.squareSideSize);
    }

    const patternOffset = this.step.patternOffset;
    const textLettersToDraw = this.step.lettersInText;
    const patternLettersToDraw = this.step.lettersInPattern;
    const graphicalOffset = patternOffset * this.squareSideSize;

    this.drawText(textLettersToDraw );
    this.drawPattern(patternLettersToDraw , graphicalOffset);

  }

  private drawText(lettersToDraw : Letter[]) {
      lettersToDraw.forEach(letterObject => {
        let y = 100;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        if (this.p5) {
          this.p5.text(index , index * this.squareSideSize, y);
          y = y + this.squareSideSize;
          this.p5.fill(colour.toString());
          this.p5.strokeWeight(strokeWeight);
          this.p5.rect(index * this.squareSideSize, y , this.squareSideSize , this.squareSideSize);
          this.p5.fill("#000000");
          this.p5.strokeWeight(1);
          this.p5.text(letter , index * this.squareSideSize , y);
        }
      });

  }


    private drawPattern(lettersToDraw : Letter[] , offset : number) {

      lettersToDraw.forEach(letterObject => {
        const y = 100 + this.squareSideSize*2 + this.gap;
        const index = letterObject.index;
        const colour = letterObject.colour;
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        if (this.p5) {
          this.p5.fill(colour.toString());
          this.p5.strokeWeight(strokeWeight);
          this.p5.rect(index * this.squareSideSize + offset , y , this.squareSideSize , this.squareSideSize);
          this.p5.fill("#000000");
          this.p5.strokeWeight(1);
          this.p5.text(letter ,index * this.squareSideSize + offset  , y);
        }
      })
  }

  drawLastOccurrenceTable(p5 : p5) {
    p5.background(255);
    p5.textSize(this.textSize);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER , p5.CENTER);

    p5.text("LAST OCCURRENCE TABLE:" ,(p5.width  / 2) , 10);


    const lastOccurrenceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    const lastOccurrenceToHighlight = (this.step.additional['lastOccuranceToHighlight']) ? this.step.additional['lastOccuranceToHighlight'] : null;


    if (lastOccurrenceTable) {
      let i = 0;
      const y = 50;
      let colour = this.DefaultColour;
      for (const [key, value] of Object.entries(lastOccurrenceTable)) {
        const xPos = i * (this.dictionaryElementSize + this.dictionaryGap) - this.scrollX + (this.dictionaryElementSize / 2);

        if (lastOccurrenceToHighlight == key && this.previousStep) {
          if (this.previousStep != this.step) this.scrollToLastOccurrenceElement(i);
              colour = MatchingAlgorithmColourConstants.MATCH;
        } else if (this.previousLastOccurrenceTable && Object.entries(this.previousLastOccurrenceTable).length !== Object.entries(lastOccurrenceTable).length) {
          this.scrollToLastOccurrenceElement(i);
        }

        if (xPos > -this.dictionaryElementSize && xPos < p5.width) {
          this.p5?.fill(colour);
          p5.rect(xPos, y , this.dictionaryElementSize , this.dictionaryElementSize);
          colour = this.DefaultColour
          this.p5?.fill("#000000");
          p5.text(key + " : " + value , xPos, y);
        }

        i++;
      }
    }
    this.previousStep = JSON.parse(JSON.stringify(this.step));
    this.previousLastOccurrenceTable = JSON.parse(JSON.stringify(lastOccurrenceTable));
  }

  private scrollToLastOccurrenceElement(index : number) {
    if (this.p5) {
      const position = index * (this.dictionaryElementSize + this.dictionaryGap);
      if (position < this.scrollX || position > this.p5.width + this.scrollX) {
        this.scrollX = position;
      }
    }
  }


  public changeSquareSize(length : number) {
    if (this.p5) {
      const width = this.p5.width;
      const newSquareSideSize = this.determineSquareSize(this.squareSideSize , length , width);
      this.squareSideSize = newSquareSideSize;
    }
  }

  public resizeCanvas(width : number , height : number) {
    const length = this.step ? this.step.lettersInText.length : 0;
    const newSquareSideSize = this.determineSquareSize(this.squareSideSize , length , width);
    this.squareSideSize = newSquareSideSize;
    if (this.p5) this.p5.resizeCanvas(width , height);
  }

  protected determineSquareSize(currentSquareSize : number , textLength : number , canvasWidth : number) : number {
    let lengthInPixels = textLength * currentSquareSize;
    if (lengthInPixels > canvasWidth) {
      while (lengthInPixels > (canvasWidth-(currentSquareSize+this.animationMargin)) && currentSquareSize > this.MinimumSquareSideSize) {
        currentSquareSize = currentSquareSize - 1;
        lengthInPixels = textLength * currentSquareSize;
      }
    } else {
      while (lengthInPixels < (canvasWidth-(currentSquareSize+this.animationMargin)) && currentSquareSize < this.MaximumSquareSideSize) {
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
    if (currentWidth > (canvasWidth - this.squareSideSize*2)) {
      return true;
    }
    return false;
  }

  public destroy() {
    if (this.p5) {
      this.p5.remove();
      this.p5 = null;
    }
  }


  public skipRight() : boolean {
    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;

    if (this.p5 && lastOccuranceTable) {
      this.scrollX += this.dictionaryElementSize;
      this.scrollX = this.p5.constrain(this.scrollX, 0, Object.entries(lastOccuranceTable).length * (this.dictionaryElementSize + this.dictionaryGap) - this.p5.width);
      if (this.scrollX >= (Object.entries(lastOccuranceTable).length * this.dictionaryElementSize - this.p5.width)) {
        return false;
      }
    }
    return true;
  }

  public skipLeft() : boolean {
    const lastOccuranceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;

    if (this.p5 && lastOccuranceTable) {
      this.scrollX -= this.dictionaryElementSize;
      this.scrollX = this.p5.constrain(this.scrollX, 0, Object.entries(lastOccuranceTable).length * (this.dictionaryElementSize + this.dictionaryGap) - this.p5.width);
      if (this.scrollX === 0) {
        return false;
      }
    }
    return true;
  }

  public resetDefaults() {
    this.algorithmStepBuilder.setDefaults();
    this.step = this.algorithmStepBuilder.build();
    this.previousStep = this.algorithmStepBuilder.build();
    this.previousLastOccurrenceTable = {};
  }
}