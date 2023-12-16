import * as p5 from 'p5';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { Letter } from '../models/letter.model';
import { Subject, Subscription } from 'rxjs';
import { MatchingAlgorithmColourConstants } from '../constants/matching-algorithm-colours.constant';
import { AlgorithmStepBuilder } from '../model-builders/algorithm-step.builder';
import { AlgorithmProgressService } from './algorithm-progress.service';
import { OptionService } from './option.service';
import { DrawStepDecorator } from '../models/drawer-step.decorator';

export class P5jsDrawService {

  private readonly DefaultSquareColor: string;
  private readonly DefaultStrokeWeight: number;
  private readonly DefaultSquareSize = 20;
  private readonly MinimumSquareSideSize = 20;
  private readonly MaximumSquareSideSize = 40;
  private readonly gap = 5;
  private readonly dictionaryGap = 10;
  private readonly dictionaryOffset = 20;
  private readonly DefaultColour = "#FFFFFF";
  private readonly animationMargin = 50;

  private p5: p5 | null;
  private dictionaryElementSize = 60;
  private scrollX = 0;
  private squareSideSize : number;
  private borderTableSquareSideSize = 20;
  private step : AlgorithmStep;
  private previousStep : AlgorithmStep;
  private changeSizeSubject$ = new Subject<{width : number , height : number}>();
  private scrollable : boolean;
  private textSize = 15;
  private previousLastOccurrenceTable : {[character : string] : number; };
  private algorithmStepBuilder : AlgorithmStepBuilder = new AlgorithmStepBuilder();
  private algorithm : DrawStepDecorator;



  private animating = false;

  private startTime = 0;
  private framesToWait: number;
  private currentFrame: number;


  private readonly algorithmProgressService : AlgorithmProgressService;
  private readonly optionService: OptionService;
  private subscriptions : Subscription[] = [];



  constructor(algorithmProgressService : AlgorithmProgressService, optionService : OptionService, containerElement: HTMLDivElement, width: number, height: number, customDrawFunction: (p5: p5) => void , scrollable = false) {
    if (customDrawFunction) {
      this.algorithmProgressService = algorithmProgressService;
      this.optionService = optionService;


      this.p5 = new p5(this.generate_sketch(width, height , customDrawFunction), containerElement);
      this.scrollable = scrollable;
      this.step = this.algorithmProgressService.stepGetter;
      this.previousStep = JSON.parse(JSON.stringify(this.step));
      this.changeSquareSize(this.optionService.textGetter.length , width);
      this.algorithm = this.algorithmProgressService.decoratedAlgorithmGetter;

      this.subscriptions.push(this.algorithmProgressService.speedChangedSubscriberGetter.subscribe((speed : number) => {
        const haveFramesChanged = this.workOutFramesToWait(speed);
        if (this.p5) this.currentFrame = this.p5.constrain(haveFramesChanged , 0 , this.framesToWait);
        this.framesToWait = haveFramesChanged;
      }));

      this.subscriptions.push(this.optionService.textChangedSubscriberGetter.subscribe((text : string) => {
        this.resetDefaults();
        this.step = this.algorithmProgressService.stepGetter;

        this.changeSquareSize(text.length);

      }));

      this.subscriptions.push(this.optionService.patternChangedSubscriberGetter.subscribe((pattern : string) => {
        this.resetDefaults();
        this.step = this.algorithmProgressService.stepGetter;
        this.changeSquareSize(this.optionService.textGetter.length);
      }));

      this.subscriptions.push(this.algorithmProgressService.stepChangedSubscriberGetter.subscribe((step : number) => {
        if (this.step) this.previousStep = JSON.parse(JSON.stringify(this.step));
        this.step = this.algorithmProgressService.stepGetter;
      }));
    }

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

  workOutFramesToWait(speed : number) {
    return Math.round(60 * (speed / 1000));
  }

  setup(p: p5, width: number, height: number) {
    p.createCanvas(width, height );
    p.frameRate(60);
    this.changeSizeSubject$.subscribe( sizes => {
      this.resizeCanvas(sizes.width , sizes.height);
    });

    this.framesToWait = this.workOutFramesToWait(this.algorithmProgressService.speedGetter);
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


    if (this.currentFrame < this.framesToWait) {
      this.currentFrame++;
    } else {
      this.currentFrame = 0;
    }


    const patternOffset = this.step.patternOffset;
    const textLettersToDraw = this.step.lettersInText;
    const patternLettersToDraw = this.step.lettersInPattern;
    const graphicalOffset = patternOffset * this.squareSideSize;

    this.drawText(textLettersToDraw);

    if (this.optionService.smoothAnimationsGetter) {
      if (this.algorithmProgressService.currentlyPlayingGetter != this.animating && this.step.patternOffset != this.previousStep.patternOffset) {
        this.animating = this.algorithmProgressService.currentlyPlayingGetter;
        this.startTime = p.millis();
      } else if (this.algorithmProgressService.currentlyPlayingGetter && this.step.patternOffset != this.previousStep.patternOffset) {
        const currentTime = p.millis() - this.startTime;
        const progress = p.constrain(currentTime / this.algorithmProgressService.speedGetter, 0, 1);
        if (progress == 1) {
          this.algorithmProgressService.moveToNextStep();
          this.animating = false;
        }
        const interpolatedX = p.lerp(this.previousStep.patternOffset*this.squareSideSize, graphicalOffset, progress);
        this.drawPattern(patternLettersToDraw , interpolatedX);
      } else if (this.algorithmProgressService.currentlyPlayingGetter) {
        this.drawPattern(patternLettersToDraw , graphicalOffset);
        if (this.currentFrame == this.framesToWait) this.algorithmProgressService.moveToNextStep();
      } else {
        this.drawPattern(patternLettersToDraw , graphicalOffset);
      }
    } else {
      this.drawPattern(patternLettersToDraw , graphicalOffset);
    }

    this.algorithm.draw(this);
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

  private drawLastOccurrenceTable(p5 : p5) {
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
    this.previousLastOccurrenceTable = JSON.parse(JSON.stringify(lastOccurrenceTable));
  }


  private drawBorderTable(p5 : p5) {
    p5.background(255);
    p5.textSize(this.textSize);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER , p5.CENTER);

    p5.text("BORDER TABLE:" ,(p5.width  / 2) , 10);

    const borderTable = (this.step.additional['borderTable']) ? this.step.additional['borderTable'] : null;
    const borderOne = (this.step.additional['borderOne']) ? this.step.additional['borderOne'] : null;

    const patternLength = this.step.lettersInPattern.length + 1;
    this.centraliseTextAndPattern(patternLength* this.borderTableSquareSideSize);
    p5.text("String" , 0 , 50 + this.borderTableSquareSideSize);
    p5.text("Border" , 0 , 50 + this.borderTableSquareSideSize * 2);
    const textWidth = p5.textWidth("String")
    let y = 50;

    for (let i = 0 ; i < patternLength ; i++) {
      p5.text(i , i * this.borderTableSquareSideSize + textWidth, y);
      y = y + this.borderTableSquareSideSize;
      p5.rect(i * this.borderTableSquareSideSize + textWidth, y , this.borderTableSquareSideSize , this.borderTableSquareSideSize);
      const nextLetter = (i-1 < 0) ? '""' : this.step.lettersInPattern[i-1].letter;
      p5.text(nextLetter, i * this.borderTableSquareSideSize + textWidth , y);
      y = y + this.borderTableSquareSideSize;
      p5.rect(i * this.borderTableSquareSideSize + textWidth, y , this.borderTableSquareSideSize , this.borderTableSquareSideSize);
      p5.line((patternLength -1 )* this.borderTableSquareSideSize + textWidth - this.borderTableSquareSideSize/2 , y - this.borderTableSquareSideSize/2 , (patternLength -1 )* this.borderTableSquareSideSize + textWidth + this.borderTableSquareSideSize/2, y + this.borderTableSquareSideSize/2);
      const nextBorderValue = (borderTable != null && borderTable[i] != null) ? borderTable[i] : "";
      p5.text(nextBorderValue , i * this.borderTableSquareSideSize + textWidth , y);
      y = 50;

    }
  }

  public annotatePattern() {
    const y = 100 + this.squareSideSize*2 + this.gap;
    if (this.p5 && this.step) {
      if (this.step.additional['borderOne'] && this.step.additional['i'] != null) {
        const borderOne = this.step.additional['borderOne'];
        const i = this.step.additional['i'];
        console.log(borderOne);
        this.p5.line( i * this.squareSideSize , y + this.squareSideSize /2 + 5 , i * this.squareSideSize + this.squareSideSize/2 , y + 55);
        this.p5.text(`Potential Border is "${this.optionService.patternGetter.substring(borderOne[0] , borderOne[1] + 1)}"`,i * this.squareSideSize + this.squareSideSize *2 , y + 75)
      }

      if (this.step.additional['borderTwo'] && this.step.additional['j'] != null) {
        const borderTwo = this.step.additional['borderTwo'];
        const j = this.step.additional['j'] - 1;
        this.p5.line(j * this.squareSideSize , y - this.squareSideSize /2  , j * this.squareSideSize + this.squareSideSize/2 , y - 90);
        this.p5.text(`Potential Border is "${this.optionService.patternGetter.substring(borderTwo[0] , borderTwo[1] + 1)}"`, j * this.squareSideSize + this.squareSideSize/2 , y - 110)
      }
    }

  }


  private scrollToLastOccurrenceElement(index : number) {
    if (this.p5) {
      const position = index * (this.dictionaryElementSize + this.dictionaryGap);
      if (position < this.scrollX || position > this.p5.width + this.scrollX) {
        this.scrollX = position;
      }
    }
  }


  public changeSquareSize(length : number , width = 0) {
    if (this.p5) {
      const canvasWidth = (width == 0) ? this.p5.width : width;
      const newSquareSideSize = this.determineSquareSize(length , canvasWidth);
      this.squareSideSize = newSquareSideSize;
    }
  }

  public resizeCanvas(width : number , height : number) {
    const length = this.optionService.textGetter.length;
    this.changeSquareSize(length , width);
    if (this.p5) this.p5.resizeCanvas(width , height);
  }

  protected determineSquareSize(textLength : number , canvasWidth : number) : number {

    let newSquareSideSize = Math.round((canvasWidth - (this.animationMargin*2)) / textLength);
    newSquareSideSize = (newSquareSideSize > this.MaximumSquareSideSize) ? this.MaximumSquareSideSize : newSquareSideSize;
    newSquareSideSize = (newSquareSideSize < this.MinimumSquareSideSize) ? this.MinimumSquareSideSize : newSquareSideSize;
    return newSquareSideSize;

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