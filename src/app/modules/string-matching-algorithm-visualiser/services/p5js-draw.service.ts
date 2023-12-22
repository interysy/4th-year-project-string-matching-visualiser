import * as p5 from 'p5';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { Letter } from '../models/letter.model';
import { Subject, Subscription } from 'rxjs';
import { AlgorithmStepBuilder } from '../model-builders/algorithm-step.builder';
import { AlgorithmProgressService } from './algorithm-progress.service';
import { OptionService } from './option.service';
import { DrawStepDecorator } from '../models/drawer-step.decorator';
import { ThemeSelectorService } from './theme-selector.service';

export class P5jsDrawService {

  private readonly MinimumSquareSideSize = 20;
  private readonly MaximumSquareSideSize = 40;
  private readonly gap = 5;
  private readonly dictionaryGap = 10;
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

  private framesToWait: number;
  private currentFrame: number;
  private smoothOffset : number;


  private readonly algorithmProgressService : AlgorithmProgressService;
  private readonly optionService: OptionService;
  private readonly themeSelectorService : ThemeSelectorService;
  private subscriptions : Subscription[] = [];
  progress = 0;



  constructor(algorithmProgressService : AlgorithmProgressService, optionService : OptionService, themeSelectorService : ThemeSelectorService, containerElement: HTMLDivElement, width: number, height: number, customDrawFunction: (p5: p5) => void , scrollable = false) {
    if (customDrawFunction) {
      this.algorithmProgressService = algorithmProgressService;
      this.optionService = optionService;
      this.themeSelectorService = themeSelectorService;


      this.p5 = new p5(this.generate_sketch(width, height , customDrawFunction), containerElement);
      this.scrollable = scrollable;
      this.step = this.algorithmProgressService.stepGetter;
      this.previousStep = JSON.parse(JSON.stringify(this.step));
      this.smoothOffset = this.step.patternOffset*this.squareSideSize;
      this.changeSquareSize(this.optionService.textGetter.length , width);
      this.algorithm = this.algorithmProgressService.decoratedAlgorithmGetter;

      this.subscriptions.push(this.algorithmProgressService.speedChangedSubscriberGetter.subscribe((speed : number) => {
        const haveFramesChanged = this.workOutFramesToWait(speed);
        this.currentFrame = 0;
        this.framesToWait = haveFramesChanged;
      }));

      this.subscriptions.push(this.optionService.textChangedSubscriberGetter.subscribe((text : string) => {
        this.resetDefaults();
        this.step = this.algorithmProgressService.stepGetter;

        this.changeSquareSize(text.length);

      }));

      this.subscriptions.push(this.optionService.patternChangedSubscriberGetter.subscribe((pattern : string) => {
        this.resetDefaults();
        this.animating = false;
        this.progress = 0;
        this.step = this.algorithmProgressService.stepGetter;
        this.changeSquareSize(this.optionService.textGetter.length);
      }));

      this.subscriptions.push(this.algorithmProgressService.stepChangedSubscriberGetter.subscribe((step : number) => {
        if (this.step) this.previousStep = JSON.parse(JSON.stringify(this.step));
        this.animating = false;
        this.progress = 0;
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
      event.preventDefault();
      this.scrollX += event.deltaY;
  }

  centraliseTextAndPattern(textWidth : number) : void {
    if (this.p5) {
      const centralXCoordinate = (this.p5.width - textWidth)/2;
      this.p5.translate(centralXCoordinate , 0);
    }
  }


  drawTextAndPattern(p : p5) {
    const background = this.themeSelectorService.currentThemeForDrawer.BACKGROUND;
    p.background(background);
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

    this.drawPattern(patternLettersToDraw , this.smoothOffset , this.progress);
    this.drawText(textLettersToDraw, this.progress);
    this.currentFrame++;


    if (this.algorithmProgressService.currentlyPlayingGetter) {
      if (!this.animating) {
        this.animating = true;
        this.currentFrame = 0;
        this.smoothOffset = this.previousStep.patternOffset*this.squareSideSize;
      } else {
        const progress = p.constrain(this.currentFrame / this.framesToWait, 0, 1);
        this.progress = progress;

        if (this.optionService.smoothAnimationsGetter) {
          const interpolatedX = p.lerp(this.previousStep.patternOffset*this.squareSideSize, graphicalOffset, progress);
          this.smoothOffset = interpolatedX;
        } else {
          this.smoothOffset = graphicalOffset;
        }

        if (progress == 1) {
          this.algorithmProgressService.moveToNextStep();
          this.animating = false;
          this.progress = 0;
        }
      }
    } else  {
      this.progress = 1;
      this.smoothOffset = graphicalOffset;
    }

    this.algorithm.draw(this);
  }


  private drawText(lettersToDraw : Letter[], fade : number) {
    lettersToDraw.forEach((letterObject, letterIndex)=> {
      if (this.p5) {
        const previousLetter = this.previousStep.lettersInText[letterIndex];
        let y = 100;
        const index = letterObject.index;
        const colour = letterObject.colour as keyof typeof this.themeSelectorService.currentThemeForDrawer;
        let color = this.p5.color(this.themeSelectorService.currentThemeForDrawer[colour]);
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR);
        this.p5.text(index , index * this.squareSideSize, y);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT)
        y = y + this.squareSideSize;
        if (previousLetter && this.optionService.smoothAnimationsGetter && previousLetter.colour !== letterObject.colour) {
          color = this.p5.lerpColor(this.p5.color(this.DefaultColour.toString()), color, fade);
        } else {
          color = this.p5.color(color);
        }
        this.p5.fill(color);
        this.p5.strokeWeight(strokeWeight);
        this.p5.rect(index * this.squareSideSize, y , this.squareSideSize , this.squareSideSize);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        this.p5.strokeWeight(1);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR_SECONDARY);
        this.p5.text(letter , index * this.squareSideSize , y);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
      }
    });

}



    private drawPattern(lettersToDraw : Letter[] , offset : number , fade : number) {
      lettersToDraw.forEach((letterObject, letterIndex)  => {
        if (this.p5) {
        const previousLetter = this.previousStep.lettersInPattern[letterIndex];
        const y = 100 + this.squareSideSize*2 + this.gap;
        const index = letterObject.index;
        const colour = letterObject.colour as keyof typeof this.themeSelectorService.currentThemeForDrawer;
        let color = this.p5.color(this.themeSelectorService.currentThemeForDrawer[colour]);
        const letter = letterObject.letter;
        const strokeWeight = letterObject.strokeWeight;

        if (this.p5) {
          if (previousLetter && this.optionService.smoothAnimationsGetter && previousLetter.colour !== letterObject.colour) {
            color = this.p5.lerpColor(this.p5.color(this.DefaultColour.toString()), color, fade);
          } else {
            color = this.p5.color(color);
          }
          this.p5.fill(color);
          this.p5.strokeWeight(strokeWeight);
          this.p5.rect(index * this.squareSideSize + offset , y , this.squareSideSize , this.squareSideSize);
          this.p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR_SECONDARY);
          this.p5.strokeWeight(1);
          this.p5.text(letter ,index * this.squareSideSize + offset  , y);
          this.p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT)
        }
      }
      })
  }

  private drawLastOccurrenceTable(p5 : p5) {
    const background = this.themeSelectorService.currentThemeForDrawer.BACKGROUND;
    p5.background(background);
    p5.textSize(this.textSize);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER , p5.CENTER);

    p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR);
    p5.text("LAST OCCURRENCE TABLE:" ,(p5.width  / 2) , 10);
    p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);


    const lastOccurrenceTable = (this.step.additional['lastOccuranceTable']) ? this.step.additional['lastOccuranceTable'] : null;
    const lastOccurrenceToHighlight = (this.step.additional['lastOccuranceToHighlight']) ? this.step.additional['lastOccuranceToHighlight'] : null;


    if (lastOccurrenceTable) {
      let i = 0;
      const y = 50;
      let colour = this.themeSelectorService.currentThemeForDrawer.DEFAULT;
      for (const [key, value] of Object.entries(lastOccurrenceTable)) {
        const xPos = i * (this.dictionaryElementSize + this.dictionaryGap) - this.scrollX + (this.dictionaryElementSize / 2);

        if (lastOccurrenceToHighlight == key && this.previousStep) {
          if (this.previousStep != this.step) this.scrollToLastOccurrenceElement(i);
              colour = this.themeSelectorService.currentThemeForDrawer.MATCH;
        } else if (this.previousLastOccurrenceTable && Object.entries(this.previousLastOccurrenceTable).length !== Object.entries(lastOccurrenceTable).length) {
          this.scrollToLastOccurrenceElement(i);
        }

        if (xPos > -this.dictionaryElementSize && xPos < p5.width) {
          this.p5?.fill(colour);
          p5.rect(xPos, y , this.dictionaryElementSize , this.dictionaryElementSize);
          colour = this.DefaultColour
          this.p5?.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR_SECONDARY);
          p5.text(key + " : " + value , xPos, y);
          this.p5?.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        }

        i++;
      }
    }
    this.previousLastOccurrenceTable = JSON.parse(JSON.stringify(lastOccurrenceTable));
  }


  private drawBorderTable(p5 : p5) {
    const background = this.themeSelectorService.currentThemeForDrawer.BACKGROUND;
    p5.background(background);
    p5.textSize(this.textSize);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER , p5.CENTER);

    p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR);
    p5.text("BORDER TABLE:" ,(p5.width  / 2) , 10);
    p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);

    const borderTable = (this.step.additional['borderTable']) ? this.step.additional['borderTable'] : null;
    const borderTableIndexToHighlight = (this.step.additional['borderTableIndexToHighlight']) ? this.step.additional['borderTableIndexToHighlight'] : null;

    const patternLength = this.step.lettersInPattern.length + 1;
    this.centraliseTextAndPattern(patternLength* this.borderTableSquareSideSize);
    const textWidth = p5.textWidth("String");
    p5.text("String" , 0 - this.scrollX , 50 + this.borderTableSquareSideSize);
    p5.text("Border" , 0 - this.scrollX, 50 + this.borderTableSquareSideSize * 2);

    let y = 50;

    for (let i = 0 ; i < patternLength ; i++) {

        p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR);
        p5.text(i , i * this.borderTableSquareSideSize + textWidth - this.scrollX, y);
        p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        y = y + this.borderTableSquareSideSize;
        if (borderTableIndexToHighlight != null && borderTableIndexToHighlight == i) {
          p5.fill(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK);
          p5.rect(i * this.borderTableSquareSideSize + textWidth - this.scrollX, y , this.borderTableSquareSideSize , this.borderTableSquareSideSize);
          p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT)
        } else {
          p5.rect(i * this.borderTableSquareSideSize + textWidth - this.scrollX, y , this.borderTableSquareSideSize , this.borderTableSquareSideSize);
        }

        const nextLetter = (i-1 < 0) ? '""' : this.step.lettersInPattern[i-1].letter;

        p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR_SECONDARY);
        p5.text(nextLetter, i * this.borderTableSquareSideSize + textWidth - this.scrollX , y);
        p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        y = y + this.borderTableSquareSideSize;
        if (borderTableIndexToHighlight != null && borderTableIndexToHighlight == i) {
          p5.fill(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK);
          p5.rect(i * this.borderTableSquareSideSize + textWidth - this.scrollX, y , this.borderTableSquareSideSize , this.borderTableSquareSideSize);
          p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT)
        } else {
          p5.rect(i * this.borderTableSquareSideSize + textWidth - this.scrollX, y , this.borderTableSquareSideSize , this.borderTableSquareSideSize);
        }

        p5.line((patternLength -1 )* this.borderTableSquareSideSize + textWidth - this.borderTableSquareSideSize/2 - this.scrollX , y - this.borderTableSquareSideSize/2 , (patternLength -1 )* this.borderTableSquareSideSize + textWidth + this.borderTableSquareSideSize/2 - this.scrollX, y + this.borderTableSquareSideSize/2);
        const nextBorderValue = (borderTable != null && borderTable[i] != null) ? borderTable[i] : "";
        p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR_SECONDARY);
        p5.text(nextBorderValue , i * this.borderTableSquareSideSize + textWidth - this.scrollX , y);
        p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        y = 50;
      }

    }


  public annotatePattern() {
    const y = 100 + this.squareSideSize*2 + this.gap;
    if (this.p5 && this.step) {
      this.p5.push();
      if (this.step.additional['borderOne'] && this.step.additional['i'] != null) {
        const borderOne = this.step.additional['borderOne'];
        const i = this.step.additional['i'];
        this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK_ONE);
        this.p5.line( i * this.squareSideSize , y + this.squareSideSize /2 + 5 , i * this.squareSideSize + this.squareSideSize/2 , y + 55);
        this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        this.p5.strokeWeight(5);
        this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK_ONE);
        this.p5.line(borderOne[0] * this.squareSideSize - this.squareSideSize/2 , y - this.squareSideSize/2, borderOne[0] * this.squareSideSize - this.squareSideSize/2 , y + this.squareSideSize/2);
        this.p5.line(borderOne[1] * this.squareSideSize + this.squareSideSize/2 , y - this.squareSideSize/2, borderOne[1] * this.squareSideSize + this.squareSideSize/2 , y + this.squareSideSize/2);
        this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
        this.p5.strokeWeight(0);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR);
        this.p5.text(`Potential Border is "${this.optionService.patternGetter.substring(borderOne[0] , borderOne[1] + 1)}"`,i * this.squareSideSize + this.squareSideSize *2 , y + 75);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.DEFAULT);
      }

      if (this.step.additional['borderTwo'] && this.step.additional['j'] != null) {
        const borderTwo = this.step.additional['borderTwo'];
        const j = this.step.additional['j'] - 1;
        this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK_TWO);
        this.p5.line(j * this.squareSideSize , y - this.squareSideSize /2  , j * this.squareSideSize + this.squareSideSize/2 , y - 90);
        this.p5.strokeWeight(5);
        this.p5.line(borderTwo[0] * this.squareSideSize - this.squareSideSize/2 , y - this.squareSideSize/2, borderTwo[0] * this.squareSideSize - this.squareSideSize/2 , y + this.squareSideSize/2);
        this.p5.line(borderTwo[1] * this.squareSideSize + this.squareSideSize/2 , y - this.squareSideSize/2, borderTwo[1] * this.squareSideSize + this.squareSideSize/2 , y + this.squareSideSize/2);
        this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.DEFAULT_STROKE);
        this.p5.strokeWeight(0);
        this.p5.fill(this.themeSelectorService.currentThemeForDrawer.TEXT_COLOUR);
        this.p5.text(`Potential Border is "${this.optionService.patternGetter.substring(borderTwo[0] , borderTwo[1] + 1)}"`, j * this.squareSideSize + this.squareSideSize/2 , y - 110)
        this.p5.fill("#000000");
      }

      if (this.step.additional['borderTwo'] && this.step.additional['borderOne']) {
        const borderOne = this.step.additional['borderOne'];
        const borderTwo = this.step.additional['borderTwo'];

        if (borderOne[1] == borderTwo[0] - 1) {
          this.p5.strokeWeight(5);
          this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK_ONE);
          this.p5.line(borderOne[1] * this.squareSideSize + this.squareSideSize/2 , y - this.squareSideSize/2, borderOne[1] * this.squareSideSize + this.squareSideSize/2 , y);
          this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.BORDER_CHECK_TWO);
          this.p5.line(borderTwo[0] * this.squareSideSize - this.squareSideSize/2 , y , borderTwo[0] * this.squareSideSize - this.squareSideSize/2 , y + this.squareSideSize/2);
          this.p5.stroke(this.themeSelectorService.currentThemeForDrawer.DEFAULT_STROKE);
          this.p5.strokeWeight(0);
        }
      }
      this.p5.pop();
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
    this.scrollX += 40;
    return true;
  }

  public skipLeft() : boolean {
    this.scrollX -= 40;
    return true;
  }

  public resetDefaults() {
    this.algorithmStepBuilder.setDefaults();
    this.step = this.algorithmStepBuilder.build();
    this.previousStep = this.algorithmStepBuilder.build();
    this.previousLastOccurrenceTable = {};
  }
}