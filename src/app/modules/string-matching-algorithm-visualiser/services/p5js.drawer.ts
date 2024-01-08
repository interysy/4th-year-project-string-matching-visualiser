import * as p5 from 'p5';
import { Subject, Subscription } from 'rxjs';
import { AlgorithmProgressService } from './algorithm-progress.service';
import { OptionService } from './option.service';
import { ThemeSelectorService } from './theme-selector.service';
import { Letter } from '../models/letter.model';

/**
 * @description Represents a class for drawing visuals on a within a specific DOM element using the p5.js library.
 */
export class P5jsDrawClass {

  /**
   * @description The default frame rate for the application.
   */
  public readonly DefaultFrameRate = 60;


  /**
   * @description Minimum size of squares included in animation
   */
  public readonly MinimumSquareSideSize = 15;
  public readonly MaximumSquareSideSize = 40;


  /**
   * @description Minimum size of dictionary squares included in animation
   */
  public readonly MaximumDictionarySquareSideSize = 60;
  public readonly MinimumDictionarySquareSideSize = 30;



  public readonly DictionaryElementsPerPage = 5

  /**
   * @description Minimum gap between each part of the animation
   */
  public readonly AnimationGap = 5;

  /**
   * @description Margin around the animation
   */
  public readonly AnimationMargin = 50;

  /**
   * @description The gap between each element of the last occurrene dictionary
   */
  public readonly DictionaryGap = 10;


  public readonly StartingYToDraw = 0;


  public readonly LastOccurrenceTitle = "LAST OCCURRENCE TABLE:";

  public readonly LastOccurrenceVariableName = "lastOccurrenceTable";

  public readonly LastOccurrenceToHighlightVariableName = "LastOccurrenceToHighlight";


  public readonly BorderTableTitle = "BORDER TABLE:";

  public readonly BorderTableVariableName = "borderTable";

  public readonly BorderTableToHighlightVariableName = "borderTableIndexToHighlight";

  public readonly BorderOneVariableName = "borderOne";
  public readonly BorderTwoVariableName = "borderTwo";
  public readonly IVariableName = "i";
  public readonly JVariableName = "j";


  public readonly LegendTitle = "LEGEND:"
  /**
   * @description Drawing object for the animation
   */
  private _p5: p5;


  /**
   * @description The current size of squares within the animation
   */
  private _squareSideSize : number;

  /**
   * @description The current size of border table squares within the animation
   */
  private _borderTableSquareSideSize = 20;

  /**
   * @description The current size of dictionary squares within the animation
   */
  private _dictionarySquareSideSize = 50;

  /**
   * @description The current size of text within the animation
   */
  private _textSize : number;

  private _legendTextSize = 10;

  /**
   * @description If the canvas is scrollable then this variable is used to keep track of the scroll
   */
  private _scrollX = 0;

  /**
   * @description Denotes whether the canvas is scrollable
   */
  private _scrollable : boolean;

  /**
   * @description Subject for notifying subscribers of a change in size of the canvas
   */
  private _changeSizeSubject$ = new Subject<{width : number , height : number}>();

  private _animating = false;
  private _framesToWait: number;
  private _currentFrame = 0;

  private _smoothAnimationProgress = 0;
  private _offsetProgress = 0;


  subscriptions : Subscription[] = [];

  private _lastOccurrenceScroll = false;


  constructor(private readonly algorithmProgressService: AlgorithmProgressService,
              private readonly optionService: OptionService,
              private readonly themeSelectorService: ThemeSelectorService,
              containerElement: HTMLDivElement,
              width: number,
              height: number,
              customDrawFunction: (p5: p5) => void,
              scrollable = false) {

    if (customDrawFunction) {
      this.algorithmProgressService = algorithmProgressService;
      this.optionService = optionService;
      this.themeSelectorService = themeSelectorService;

      this._p5 = new p5(this.generate_sketch(width, height , customDrawFunction), containerElement);
      this._scrollable = scrollable;
      this.changeSquareSize(Math.max(this.optionService.textGetter.length,this.optionService.patternGetter.length) , width);


      this.subscriptions.push(this.algorithmProgressService.speedChangedSubscriberGetter.subscribe((speed : number) => {
        const haveFramesChanged = this.workOutFramesToWait(speed);
        this._currentFrame = 0;
        this._framesToWait = haveFramesChanged;
      }));

      const textPatternChangeSubscribers = [this.optionService.textChangedSubscriberGetter , this.optionService.patternChangedSubscriberGetter];
      this.subscriptions.push(...textPatternChangeSubscribers.map(subscriber => subscriber.subscribe(() => {
        this.changeSquareSize(Math.max(this.optionService.textGetter.length , this.optionService.patternGetter.length));
        this._animating = false;
        this._smoothAnimationProgress = 0;
      })));


      this.subscriptions.push(this.algorithmProgressService.stepChangedSubscriberGetter.subscribe((step : number) => {
        this._lastOccurrenceScroll = false;
      }));
    }
  }

  private generate_sketch(width: number, height: number ,  customDrawFunction : ((p5: p5) => void)) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
      return ((p5: p5) => {
        p5.setup = () => {
          that.setup(p5, width, height);
        };

        p5.draw = () => {
          customDrawFunction(p5);
        };

        p5.mouseWheel = (event) => {
          if (that.isMouseOverCanvas() && that._scrollable) {
            that.mouseWheelMove(event);
          }
        };
      });
  }

  private isMouseOverCanvas() : boolean {
    return this._p5.mouseX > 0 && this._p5.mouseX < this._p5.width && this._p5.mouseY > 0 && this._p5.mouseY < this._p5.height;
  }

  private workOutFramesToWait(speed : number) : number {
    return Math.round(60 * (speed / 1000));
  }

  private setup(p5 : p5, width: number, height: number) : void {
    p5.createCanvas(width, height);
    p5.frameRate(this.DefaultFrameRate);

    this.subscriptions.push(this._changeSizeSubject$.subscribe(sizes => {
      this.resizeCanvas(sizes.width , sizes.height);
    }));

    this._framesToWait = this.workOutFramesToWait(this.algorithmProgressService.speedGetter);
  }

  private mouseWheelMove(event : any) : void {
      event.preventDefault();
      this._scrollX += event.deltaY;
  }

  private centraliseDrawing(drawingWidth : number ,drawingHeight : number) : void {
    const centralXCoordinate = (this._p5.width - drawingWidth)/2;
    const centralYCoordinate = (this._p5.height - drawingHeight)/2;
    this._p5.translate(centralXCoordinate , centralYCoordinate);
  }

  private centraliseDrawingInY(drawingHeight : number) : void {
    const centralYCoordinate = (this._p5.height - drawingHeight)/2;
    this._p5.translate(0 , centralYCoordinate);
  }

  private centraliseScroll(drawingWidth : number | null = null) : void {
    if (drawingWidth === null) {
      this._scrollX = 0;
    } else {
      this._scrollX = -((this._p5.width - drawingWidth)/2);
    }
  }
  private drawingFunctionSetUp(p5 : p5 , background : string) : void {
    p5.background(background);
    p5.textSize(this._textSize);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER , p5.CENTER);
  }

  private getColourFromString(colourAsString : string) : p5.Color {
    const colourAsThemeKey = colourAsString as keyof typeof this.themeSelectorService.currentThemeObjectGetter;
    return this._p5.color(this.themeSelectorService.currentThemeObjectGetter[colourAsThemeKey]);
  }

  private createColourFade(previousLetter : Letter , previousColourAsAString : string, currentLetterColour : p5.Color , fade : number) : p5.Color {
    if (previousLetter && this.optionService.smoothAnimationsGetter && previousLetter.colour !== previousColourAsAString) {
      return this._p5.lerpColor(this._p5.color(this.themeSelectorService.currentThemeObjectGetter.DEFAULT), currentLetterColour, fade);
    }
    return currentLetterColour;
  }

  private updateAnimationProgress() : void {
    if (this.algorithmProgressService.currentlyPlayingGetter) {
      if (!this._animating) {
        this._animating = true;
        this._currentFrame = 0;
      } else {
        const progress = this._p5.constrain(this._currentFrame / this._framesToWait, 0, 1);
        this._smoothAnimationProgress = progress;

        if (progress == 1) {
          this.algorithmProgressService.moveToNextStep();
          this._lastOccurrenceScroll = false;
          this._animating = false;
          this._smoothAnimationProgress = 0;
        }
      }
    } else  {
      this._smoothAnimationProgress = 1;
    }
  }

  public drawTextAndPattern(p5 : p5) : void {
    const background = this.themeSelectorService.currentThemeObjectGetter.BACKGROUND;

    this.drawingFunctionSetUp(p5 , background);

    const stepToDraw = this.algorithmProgressService.stepGetter;
    const maxAnimationWidth =  this._squareSideSize * Math.max(stepToDraw.lettersInPattern.length , stepToDraw.lettersInText.length)
    const maxAnimationHeight = this.StartingYToDraw + this._squareSideSize*3 + this.AnimationGap;

    if (this.activeWindow(maxAnimationWidth)) {
      this.centraliseDrawing((stepToDraw.patternOffset*2 + (stepToDraw.patternIndex*2)) * this._squareSideSize , maxAnimationHeight);
    } else {
      this.centraliseDrawing(maxAnimationWidth , maxAnimationHeight);
    }

    const patternOffset = stepToDraw.patternOffset;
    const textLettersToDraw = stepToDraw.lettersInText;
    const patternLettersToDraw = stepToDraw.lettersInPattern;
    const graphicalOffset = patternOffset * this._squareSideSize;


    this._currentFrame++;

    const previousStepOffset = this.algorithmProgressService.previousStepGetter.patternOffset;

    this.updateAnimationProgress();

    if (this.optionService.smoothAnimationsGetter) {
      const interpolatedX = p5.lerp(previousStepOffset * this._squareSideSize, graphicalOffset, this._smoothAnimationProgress);
      this._offsetProgress = interpolatedX;
    } else {
      this._offsetProgress = graphicalOffset;
    }


    this.drawPattern(patternLettersToDraw , this._offsetProgress , this._smoothAnimationProgress);


    this.drawText(textLettersToDraw, this._smoothAnimationProgress);

    this.algorithmProgressService.decoratedAlgorithmGetter.draw(this);
  }


  private drawText(lettersToDraw : Letter[], fade : number) : void {
    const previousStepTextLetters  = this.algorithmProgressService.previousStepGetter.lettersInText;
    let y = this.StartingYToDraw;
    let colour : p5.Color, index : number , letter : string , strokeWeight : number , previousLetter : Letter;

    lettersToDraw.forEach((letterObject, letterIndex)=> {
        previousLetter = previousStepTextLetters[letterIndex];
        index = letterObject.index;
        letter = letterObject.letter;
        strokeWeight = letterObject.strokeWeight;

        colour = this.getColourFromString(letterObject.colour);

        this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
        this._p5.text(index , index * this._squareSideSize, y);
        this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT)
        y = y + this._squareSideSize;

        colour = this.createColourFade(previousLetter , letterObject.colour, colour , fade);

        this._p5.fill(colour);
        this._p5.strokeWeight(strokeWeight);
        this._p5.rect(index * this._squareSideSize, y , this._squareSideSize , this._squareSideSize);
        this._p5.strokeWeight(1);

        this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR_SECONDARY);
        this._p5.text(letter , index * this._squareSideSize , y);
        this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

        y = this.StartingYToDraw;
    });
  }

  private drawPattern(lettersToDraw : Letter[] , offset : number , fade : number) : void {
    const previousStepPatternLetters = this.algorithmProgressService.previousStepGetter.lettersInPattern;
    const y = this.StartingYToDraw + this._squareSideSize*2 + this.AnimationGap;
    let colour : p5.Color, index : number , letter : string , strokeWeight : number , previousLetter : Letter;

    lettersToDraw.forEach((letterObject, letterIndex)  => {
        previousLetter = previousStepPatternLetters[letterIndex];
        index = letterObject.index;
        letter = letterObject.letter;
        strokeWeight = letterObject.strokeWeight;

        colour = this.getColourFromString(letterObject.colour);
        colour = this.createColourFade(previousLetter , letterObject.colour , colour , fade);

        this._p5.fill(colour);
        this._p5.strokeWeight(strokeWeight);
        this._p5.rect(index * this._squareSideSize + offset , y , this._squareSideSize , this._squareSideSize);

        this._p5.strokeWeight(1);

        this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR_SECONDARY);
        this._p5.text(letter ,index * this._squareSideSize + offset  , y);
        this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT)
    });
  }

  public drawLastOccurrenceTable(p5 : p5) : void {
    const background = this.themeSelectorService.currentThemeObjectGetter.BACKGROUND;
    let y = this.StartingYToDraw;
    let xPosition : number , colour : p5.Color;

    this.drawingFunctionSetUp(p5 , background);
    this.centraliseDrawingInY(this.StartingYToDraw + this._dictionarySquareSideSize * 2);

    if (this.optionService.centraliseScrollGetter) {
      this.centraliseScroll();
      this.optionService.centraliseScrollSetter = false;
   }

    p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
    p5.text(this.LastOccurrenceTitle ,(p5.width  / 2) , this.StartingYToDraw);
    p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

    y = this._dictionarySquareSideSize;

    const lastOccurrenceTable = (this.algorithmProgressService.stepGetter.additional[this.LastOccurrenceVariableName]) ? this.algorithmProgressService.stepGetter.additional[this.LastOccurrenceVariableName] : null;
    const lastOccurrenceToHighlight = (this.algorithmProgressService.stepGetter.additional[this.LastOccurrenceToHighlightVariableName]) ? this.algorithmProgressService.stepGetter.additional[this.LastOccurrenceToHighlightVariableName] : null;


    if (lastOccurrenceTable) {
      const lastOccurrenceTableAsArray = Object.entries(lastOccurrenceTable);
      const lastOccurrenceTableLength = lastOccurrenceTableAsArray.length;

      lastOccurrenceTableAsArray.forEach(([key, value], index) => {
        xPosition = index * (this._dictionarySquareSideSize + this.DictionaryGap) - this._scrollX + (this._dictionarySquareSideSize / 2);

        if (lastOccurrenceToHighlight == key && !this._lastOccurrenceScroll) {
          this.scrollToLastOccurrenceElement(index);
          this._lastOccurrenceScroll = true;
          colour = p5.color(this.themeSelectorService.currentThemeObjectGetter.CHECKING);
        } else if ((this.algorithmProgressService.previousStepGetter.additional[this.LastOccurrenceVariableName]) && lastOccurrenceTable.length != Object.entries(this.algorithmProgressService.previousStepGetter.additional[this.LastOccurrenceVariableName]).length && !this._lastOccurrenceScroll) {
          this.scrollToLastOccurrenceElement(lastOccurrenceTableLength - 1);
          colour = p5.color(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);
          this._lastOccurrenceScroll = true;
        } else {
          colour = p5.color(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);
        }

        if (xPosition > -this._dictionarySquareSideSize && xPosition < p5.width) {
          p5.fill(colour);
          p5.rect(xPosition, y , this._dictionarySquareSideSize , this._dictionarySquareSideSize);

          p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR_SECONDARY);
          p5.text(key + " : " + value , xPosition, y);
          p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);
        }
      });
    }
  }

  public drawBorderTable(p5 : p5) : void {
    const background = this.themeSelectorService.currentThemeObjectGetter.BACKGROUND;
    const startingPointOfBorderTable = 20;
    const textWidth = Math.max(p5.textWidth("String") , p5.textWidth("Border"));
    const patternLength = this.algorithmProgressService.stepGetter.lettersInPattern.length + 1;
    let y = this.StartingYToDraw;
    this.drawingFunctionSetUp(p5 , background);

    this.centraliseDrawingInY(startingPointOfBorderTable + this.StartingYToDraw + 3 * this._borderTableSquareSideSize);

    if (this.optionService.centraliseScrollGetter) {
       this.centraliseScroll(textWidth + this._borderTableSquareSideSize * patternLength);
       this.optionService.centraliseScrollSetter = false;
    }

    p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
    p5.text(this.BorderTableTitle ,(p5.width  / 2) , y);
    p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

    const borderTable = (this.algorithmProgressService.stepGetter.additional[this.BorderTableVariableName]) ? this.algorithmProgressService.stepGetter.additional[this.BorderTableVariableName] : null;
    const borderTableIndexToHighlight = (this.algorithmProgressService.stepGetter.additional[this.BorderTableToHighlightVariableName]) ? this.algorithmProgressService.stepGetter.additional[this.BorderTableToHighlightVariableName] : null;

    if (borderTable) {

      p5.text("String" , 0 - this._scrollX , startingPointOfBorderTable + this._borderTableSquareSideSize);
      p5.text("Border" , 0 - this._scrollX, startingPointOfBorderTable + this._borderTableSquareSideSize * 2);

      y = startingPointOfBorderTable;

      for (let i = 0 ; i < patternLength ; i++) {

        p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
        p5.text(i , i * this._borderTableSquareSideSize + textWidth - this._scrollX, y);
        p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

        y = y + this._borderTableSquareSideSize;

        if (borderTableIndexToHighlight != null && borderTableIndexToHighlight == i) {
          p5.fill(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK);
          p5.rect(i * this._borderTableSquareSideSize + textWidth - this._scrollX, y , this._borderTableSquareSideSize , this._borderTableSquareSideSize);
          p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT)
        } else {
          p5.rect(i * this._borderTableSquareSideSize + textWidth - this._scrollX, y , this._borderTableSquareSideSize , this._borderTableSquareSideSize);
        }

        const nextLetter = (i-1 < 0) ? '""' : this.algorithmProgressService.stepGetter.lettersInPattern[i-1].letter;

        p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR_SECONDARY);
        p5.text(nextLetter, i * this._borderTableSquareSideSize + textWidth - this._scrollX , y);
        p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

        y = y + this._borderTableSquareSideSize;

        if (borderTableIndexToHighlight != null && borderTableIndexToHighlight == i) {
          this.scrollToBorderTableElement(i , textWidth);
          p5.fill(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK);
          p5.rect(i * this._borderTableSquareSideSize + textWidth - this._scrollX, y , this._borderTableSquareSideSize , this._borderTableSquareSideSize);
          p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT)
        } else {
          p5.rect(i * this._borderTableSquareSideSize + textWidth - this._scrollX, y , this._borderTableSquareSideSize , this._borderTableSquareSideSize);
        }

        p5.line((patternLength-1)* this._borderTableSquareSideSize + textWidth - this._borderTableSquareSideSize/2 - this._scrollX , y - this._borderTableSquareSideSize/2 , (patternLength -1 )* this._borderTableSquareSideSize + textWidth + this._borderTableSquareSideSize/2 - this._scrollX, y + this._borderTableSquareSideSize/2);

        const nextBorderValue = (borderTable != null && borderTable[i] != null) ? borderTable[i] : "";

        p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR_SECONDARY);
        p5.text(nextBorderValue , i * this._borderTableSquareSideSize + textWidth - this._scrollX , y);
        p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

        y = startingPointOfBorderTable;
      }
    }
  }

  private createPotentialBorderText(potentialBorderAsString : string) : string {
    return `Potential Border is "${potentialBorderAsString}"`;
  }

  public annotatePattern() : void {
    const y = this.StartingYToDraw + this._squareSideSize*2 + this.AnimationGap;
    const outlineWeight = 5, lineWeight = 2 , howRight = 1.5;
    let j , potentialBorderText , potentialBorderTextLength;

    this._p5.push();

    const borderOne = this.algorithmProgressService.stepGetter.additional[this.BorderOneVariableName]  ? this.algorithmProgressService.stepGetter.additional[this.BorderOneVariableName] : null;
    const borderTwo = this.algorithmProgressService.stepGetter.additional[this.BorderTwoVariableName] ? this.algorithmProgressService.stepGetter.additional[this.BorderTwoVariableName] : null;
    const i = (this.algorithmProgressService.stepGetter.additional[this.IVariableName] != undefined) ? this.algorithmProgressService.stepGetter.additional[this.IVariableName] : null;
    j = (this.algorithmProgressService.stepGetter.additional[this.JVariableName] != undefined) ? this.algorithmProgressService.stepGetter.additional[this.JVariableName] : null;

    if (borderOne != undefined && i != undefined) {

      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK_ONE);
      this._p5.strokeWeight(lineWeight);
      this._p5.line(i * this._squareSideSize , y + this._squareSideSize/2 + this.AnimationGap , i * this._squareSideSize * howRight , y + this._squareSideSize + this.AnimationGap);

      this._p5.strokeWeight(outlineWeight);
      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK_ONE);
      this._p5.line(borderOne[0] * this._squareSideSize - this._squareSideSize/2 , y - this._squareSideSize/2, borderOne[0] * this._squareSideSize - this._squareSideSize/2 , y + this._squareSideSize/2);
      this._p5.line(borderOne[1] * this._squareSideSize + this._squareSideSize/2 , y - this._squareSideSize/2, borderOne[1] * this._squareSideSize + this._squareSideSize/2 , y + this._squareSideSize/2);
      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);
      this._p5.strokeWeight(0);


      console.log(this.optionService.patternGetter.substring(borderOne[0] , borderOne[1] + 1));

      potentialBorderText = this.createPotentialBorderText((this.optionService.patternGetter.substring(borderOne[0] , borderOne[1] + 1)) as string);
      potentialBorderTextLength = this._p5.textWidth(potentialBorderText);

      this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
      this._p5.text(potentialBorderText,i * this._squareSideSize + potentialBorderTextLength/2  , y + this._squareSideSize + this.AnimationGap * 3);
      this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);
    }


    if (borderTwo != undefined && j != undefined) {

      j -= 1;

      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK_TWO);
      this._p5.strokeWeight(lineWeight);
      this._p5.line(j * this._squareSideSize , y - this._squareSideSize /2  , j * this._squareSideSize + this._squareSideSize/2 , this.StartingYToDraw - this._squareSideSize/2);


      this._p5.strokeWeight(outlineWeight);

      this._p5.line(borderTwo[0] * this._squareSideSize - this._squareSideSize/2 , y - this._squareSideSize/2, borderTwo[0] * this._squareSideSize - this._squareSideSize/2 , y + this._squareSideSize/2);
      this._p5.line(borderTwo[1] * this._squareSideSize + this._squareSideSize/2 , y - this._squareSideSize/2, borderTwo[1] * this._squareSideSize + this._squareSideSize/2 , y + this._squareSideSize/2);
      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.DEFAULT_STROKE);
      this._p5.strokeWeight(0);

      potentialBorderText = this.createPotentialBorderText(this.optionService.patternGetter.substring(borderTwo[0] , borderTwo[1] + 1) as string);
      potentialBorderTextLength = this._p5.textWidth(potentialBorderText);

      this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
      this._p5.text(potentialBorderText, j * this._squareSideSize + potentialBorderTextLength/2 , this.StartingYToDraw - this._squareSideSize)
      this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);
    }

    if (borderTwo != undefined && borderOne != undefined && borderOne[1] == borderTwo[0] - 1) {
      this._p5.strokeWeight(outlineWeight);
      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK_ONE);
      this._p5.line(borderOne[1] * this._squareSideSize + this._squareSideSize/2 , y - this._squareSideSize/2, borderOne[1] * this._squareSideSize + this._squareSideSize/2 , y);

      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.BORDER_CHECK_TWO);
      this._p5.line(borderTwo[0] * this._squareSideSize - this._squareSideSize/2 , y , borderTwo[0] * this._squareSideSize - this._squareSideSize/2 , y + this._squareSideSize/2);
      this._p5.stroke(this.themeSelectorService.currentThemeObjectGetter.DEFAULT_STROKE);
      this._p5.strokeWeight(0);
    }

      this._p5.pop();
  }

  public drawLegend() : void {
    let seperator = 0 , y = this.StartingYToDraw + this._squareSideSize*4 + this.AnimationGap * 5;
    let headingWidth = this._p5.textWidth(this.LegendTitle);
    let textWidth;
    const wordGap = 30;
    const legendSquareSideSize = 10;
    const keysToShow = ["MISMATCH" , "MATCH" ,  "BORDER_CHECK_ONE" ,"BORDER_CHECK_TWO","BORDER_CHECK"];

    if (this.optionService.showLegendGetter) {
      this._p5.push();
      this._p5.textSize(this._legendTextSize);

      this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
      this._p5.text(this.LegendTitle, 0, y);
      this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

      Object.entries(this.themeSelectorService.currentThemeObjectGetter).forEach(([key, value]) => {
        if (keysToShow.findIndex((value) => value === key) !== -1) {
          textWidth = this._p5.textWidth(key);


          if (seperator + headingWidth + 10 + textWidth*2 > this._p5.width) {
            y += legendSquareSideSize + this.AnimationGap;
            seperator = 0;
            headingWidth = 0;
          }


          this._p5.fill(value);
          this._p5.rect(seperator + headingWidth, y , legendSquareSideSize , legendSquareSideSize);
          this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);


          this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
          this._p5.text(key , seperator + headingWidth + legendSquareSideSize + textWidth/2 , y);
          this._p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);


          seperator = seperator + textWidth + wordGap;
      }});

      this._p5.pop();
    }
  }

  private scrollToLastOccurrenceElement(index : number) : void {
    const position = index * (this._dictionarySquareSideSize + this.DictionaryGap);
    if (position < this._scrollX || position > this._p5.width + this._scrollX) {
      this._scrollX = position;
    }
  }

  private scrollToBorderTableElement(index : number , textWidth : number) : void {
    const position = index * (this._borderTableSquareSideSize) + textWidth;
    if (position < this._scrollX || position > this._p5.width + this._scrollX) {
      this._scrollX = position;
    }
  }

  public changeSquareSize(length : number , width = 0) : void {
    const canvasWidth = (width == 0) ? this._p5.width : width;
    this._squareSideSize = this.determineSquareSize(length , canvasWidth);
  }


  public resizeCanvas(width : number , height : number) : void {
    const maxLength = Math.max(this.optionService.textGetter.length , this.optionService.patternGetter.length);
    this.changeSquareSize(maxLength , width);
    this._p5.resizeCanvas(width , height);
    this.centraliseScroll();
  }

  protected determineSquareSize(textLength : number , canvasWidth : number) : number {
    let newSquareSideSize = Math.round((canvasWidth - (this.AnimationMargin*2)) / textLength);
    newSquareSideSize = (newSquareSideSize > this.MaximumSquareSideSize) ? this.MaximumSquareSideSize : newSquareSideSize;
    newSquareSideSize = (newSquareSideSize < this.MinimumSquareSideSize) ? this.MinimumSquareSideSize : newSquareSideSize;
    return newSquareSideSize;
  }


  private activeWindow(drawingWidth : number) : boolean {
    if (this._squareSideSize !== this.MinimumSquareSideSize) return false;
    if (drawingWidth > (this._p5.width - this.AnimationMargin)) return true;
    return false;
  }

  public destroy() : void {
    this._p5.remove();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  public skipRight() : boolean {
    this._scrollX += 40;
    return true;
  }

  public skipLeft() : boolean {
    this._scrollX -= 40;
    return true;
  }
}