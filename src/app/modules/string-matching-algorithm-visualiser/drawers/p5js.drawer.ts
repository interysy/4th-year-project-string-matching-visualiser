import * as p5 from 'p5';
import { Subject, Subscription } from 'rxjs';
import { AlgorithmProgressService } from '../services/algorithm-progress.service';
import { OptionService } from '../services/option.service';
import { ThemeSelectorService } from '../services/theme-selector.service';
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
   *
   @description The minimum size of squares included in animation
   */
  public readonly MinimumSquareSideSize = 15;


  /**
   * @description Maximum size of squares included in animation
   */
  public readonly MaximumSquareSideSize = 40;

  /**
   * @description Minimum gap between each part of the animation
   */
  public readonly AnimationGap = 5;

  /**
   * @description Margin around the animation from both sides
   */
  public readonly AnimationMargin = 50;

  /**
   * @description The gap between each element of the last occurrence dictionary (Boyer Moore specific)
   */
  public readonly DictionaryGap = 10;


  /**
   * @description The beginning y coordinate to draw the animation
   */
  public readonly StartingYToDraw = 0;

  /**
   * @description The title to display for the last occurrence table on the additional canvas.
   * @see {@link BoyerMooreAdditionalVariables}
   */
  public readonly LastOccurrenceTitle = "LAST OCCURRENCE TABLE:";

  /**
   * @description The variable name for the last occurrence dictionary attribute in the additional variables model
   * @see {@link BoyerMooreAdditionalVariables}
   */
  public readonly LastOccurrenceVariableName = "lastOccurrenceTable";

   /**
   * @description The variable name for the last occurrence element to highlight attribute in the additional variables model
   * @see {@link BoyerMooreAdditionalVariables}
   */
  public readonly LastOccurrenceToHighlightVariableName = "lastOccurrenceToHighlight";


  /**
   * @description The title to display for the border table on the additional canvas.
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly BorderTableTitle = "BORDER TABLE:";

   /**
   * @description The variable name for the border table attribute in the additional variables model
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly BorderTableVariableName = "borderTable";

  /**
   * @description The variable name for the border table element to highlight  attribute in the additional variables model
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly BorderTableToHighlightVariableName = "borderTableIndexToHighlight";

  /**
   * @description The variable name for the first potential border attribute in the additional variables model
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly BorderOneVariableName = "borderOne";


  /**
   * @description The variable name for the second potential border attribute in the additional variables model
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly BorderTwoVariableName = "borderTwo";

  /**
   * @description The variable name for the attribute used in border table generation in the additional variables model
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly IVariableName = "i";


  /**
   * @description The variable name for the attribute used in border table generation in the additional variables model
   * @see {@link KnuthMorrisPrattAdditionalVariables}
   */
  public readonly JVariableName = "j";

  /**
   * @description Legend annotation to show on canvas when drawing the legend.
   * @see LegendDrawer
   */
  public readonly LegendTitle = "LEGEND:"

  /**
  * @description The current size of dictionary squares within the animation
  */
  public readonly _dictionarySquareSideSize = 50;

  /**
  * @description The current size of the text within the legend of the animation
  */
  public readonly LegendTextSize = 10;


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
  private readonly _borderTableSquareSideSize = 20;


  /**
   * @description If the canvas is scrollable then this variable is used to keep track of the scroll
   */
  private _scrollX = 0;

  /**
   * @description Denotes whether the canvas is scrollable
   */
  private _scrollable : boolean;

  /**
   * @description Subject for notifying subscribers of a change in size of the canvas. Referenced by component enclosing canvas.
   */
  private _changeSizeSubject$ = new Subject<{width : number , height : number}>();

  /**
   * @description Denotes whether the service is in the middle of an animation
   */
  private _animating = false;

  /**
   * @description The amount of frames an animation will take to complete. It relies on a time unit to be provided when working out,
   * as well as the current frame rate of the application.
   */
  private _framesToWait: number;

  /**
   * @description The current frame of the animation
   */
  private _currentFrame = 0;

  /**
   * @description The progress of the animation. It is a value between 0 and 1, where 0 is the beginning of the animation and 1 is the end.
   */
  private _smoothAnimationProgress = 0;

  /**
   * @description The progress, but turned into a specialised value for the offset of the pattern when compared to the text.
   */
  private _offsetProgress = 0;

  /**
   * @description The subscriptions held by the class
   */
  public subscriptions : Subscription[] = [];

  /**
   * @description Denotes whether a change in the last occurrence dictionary has already been scrolled to. If so we don't want to automatically scroll again, unless the step has changed.
  */
  private _lastOccurrenceScroll = false;


  /**
   * @description The constructor initiates the class by creating a p5js canvas on a specific div and sets up the function that will be used to draw (the customDrawFunction is called every frame).
   * @param algorithmProgressService The service that holds the current step of the algorithm
   * @param optionService The service that holds the current options of the algorithm
   * @param themeSelectorService The service that holds the current theme of the algorithm
   * @param containerElement The div that the canvas will be in
   * @param width The width of the canvas as (same as div passed in)
   * @param height The height of the canvas as (same as div passed in)
   * @param customDrawFunction The function that will be called every frame to draw the animation
   * @param scrollable Denotes whether the canvas is scrollable (useful for the extra canvas below main animation)
   */
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
      this.changeSquareSize(Math.max(this.optionService.textGetter().length,this.optionService.patternGetter().length) , width);


      this.subscriptions.push(this.algorithmProgressService.speedChangedSubscriberGetter().subscribe((speed : number) => {
        const haveFramesChanged = this.workOutFramesToWait(speed);
        this._currentFrame = 0;
        this._framesToWait = haveFramesChanged;
      }));

      const textPatternChangeSubscribers = [this.optionService.textChangedSubscriberGetter() , this.optionService.patternChangedSubscriberGetter()];
      this.subscriptions.push(...textPatternChangeSubscribers.map(subscriber => subscriber.subscribe(() => {
        this.changeSquareSize(Math.max(this.optionService.textGetter().length , this.optionService.patternGetter().length));
        this._animating = false;
        this._smoothAnimationProgress = 0;
      })));


      this.subscriptions.push(this.algorithmProgressService.stepChangedSubscriberGetter().subscribe((_ : number) => {
        this._lastOccurrenceScroll = false;
      }));
    }
  }

  /**
   * @description Function initiating p5js. It joints the current class to the p5js instance. Original code by soler1212. The software will be
   * distributed under the GPL-3.0 license as per the requirements. My code uses the generate_sketch() method, which has been modified to take in more parameters and initialise them.
   * @copyright https://github.com/soler1212/P5JSInvoker
   * @param width The width of the canvas as (same as div passed in). Needed for the setup function to initiate the canvas correctly. No other way to pass it in.
   * @param height The height of the canvas as (same as div passed in). Needed for the setup function to initiate the canvas correctly. No other way to pass it in.
   * @param customDrawFunction The function that will be called every frame to draw the animation. It is called by the draw() function called by p5js by default.
   *
   */
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

  /**
   * @description Check if the mouse cursor is on the canvas
   */
  private isMouseOverCanvas() : boolean {
    return this._p5.mouseX > 0 && this._p5.mouseX < this._p5.width && this._p5.mouseY > 0 && this._p5.mouseY < this._p5.height;
  }

  /**
    * @description Work out the amount of frames needed for an animation speed, based on the speed.
    * @param speed Current speed of the algorithm. Held in the progress service typically.
   */
  private workOutFramesToWait(speed : number) : number {
    return Math.round(60 * (speed / 1000));
  }

  /**
   * @description Function to initate p5js canvas. It is called by the p5js setup function. Here we set up the canvas, our frame rate and subscribe to the change in size of the canvas (can't do it in constructor as the canvas is not yet created).
   * @param p5 The p5js instance
   * @param width The width of the canvas as (same as div passed in to the constructor)
   * @param height The height of the canvas as (same as div passed in to the constructor)
   */
  private setup(p5 : p5, width: number, height: number) : void {
    p5.createCanvas(width, height);
    p5.frameRate(this.DefaultFrameRate);

    this.subscriptions.push(this._changeSizeSubject$.subscribe(sizes => {
      this.resizeCanvas(sizes.width , sizes.height);
    }));

    this._framesToWait = this.workOutFramesToWait(this.algorithmProgressService.speedGetter());
  }

  /**
   * @description Function called to update _scrollX when mouse wheel is moved. The cursor has to be over the canvas.
   * @param event The mousewheel event
   */
  private mouseWheelMove($event : any) : void {
      $event.preventDefault();
      this._scrollX += $event.deltaY;
  }

  /**
   * @description Used to centralise a drawing on the canvas.
   * @param drawingWidth The width of the drawing to centralise
   * @param drawingHeight The height of the drawing to centralise
   */
  private centraliseDrawing(drawingWidth : number ,drawingHeight : number) : void {
    const centralXCoordinate = (this._p5.width - drawingWidth)/2;
    const centralYCoordinate = (this._p5.height - drawingHeight)/2;
    this._p5.translate(centralXCoordinate , centralYCoordinate);
  }

  /**
   * @description Used to centralise a drawing on the canvas in the Y axis.
   * @param drawingHeight The height of the drawing to centralise
   */
  private centraliseDrawingInY(drawingHeight : number) : void {
    const centralYCoordinate = (this._p5.height - drawingHeight)/2;
    this._p5.translate(0 , centralYCoordinate);
  }

  /**
   * @description Used to centralise the content of a scrollable canvas, since scrolling is infinite.
   * @param drawingWidth The width of the drawing to centralise
   */
  private centraliseScroll(drawingWidth : number | null = null) : void {
    if (drawingWidth === null) {
      this._scrollX = 0;
    } else {
      this._scrollX = -((this._p5.width - drawingWidth)/2);
    }
  }

  /**
   * @description Sets up canvas for drawing
   * @param p5 The p5js instance
   * @param background The background colour of the canvas (used mainly for the theme)
   */
  private drawingFunctionSetUp(p5 : p5 , background : string) : void {
    p5.background(background);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER , p5.CENTER);
  }

  /**
   * @description Convert a string to a p5js colour object, the colour is taken from the current theme.
   * @param colourAsString The colour as a string
   * @returns The colour as a p5js colour object
   */
  private getColourFromString(colourAsString : string) : p5.Color {
    const colourAsThemeKey = colourAsString as keyof typeof this.themeSelectorService.currentThemeObjectGetter;
    return this._p5.color(this.themeSelectorService.currentThemeObjectGetter[colourAsThemeKey]);
  }

  /**
   * @description Creates a faded colour for the smooth animation.
   * @param previousLetter The previous letter object
   * @param previousColourAsAString The previous colour as a string
   * @param currentLetterColour The current letter colour (what we are moving towards)
   * @param fade The fade value (between 0 and 1)
   * @returns The faded colour as a p5js colour object
   */
  private createColourFade(previousLetter : Letter , previousColourAsAString : string, currentLetterColour : p5.Color , fade : number) : p5.Color {
    if (previousLetter && this.optionService.smoothAnimationsGetter() && previousLetter.colour !== previousColourAsAString) {
      return this._p5.lerpColor(this._p5.color(this.themeSelectorService.currentThemeObjectGetter.DEFAULT), currentLetterColour, fade);
    }
    return currentLetterColour;
  }

  /**
   * @description Updates the animation - whether smooth or not. If playing then this will move on to the next step in the algorithm progress service.
   * @see {@link _animating}
   * @see {@link _currentFrame}
   * @see {@link _framesToWait}
   * @see {@link _smoothAnimationProgress}
   */
  private updateAnimationProgress() : void {
    if (this.algorithmProgressService.currentlyPlayingGetter()) {
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

  /**
   * @description Draws text and pattern onto the canvas. It incorporates smooth animations and the active window mode.
   * @param p5 The p5js instance (needed for anything functions to be called by the draw() function)
   */
  public drawTextAndPattern(p5 : p5) : void {
    const background = this.themeSelectorService.currentThemeObjectGetter.BACKGROUND;

    this.drawingFunctionSetUp(p5 , background);

    const stepToDraw = this.algorithmProgressService.stepGetter();

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

    this.updateAnimationProgress();

    const previousStepOffset = this.algorithmProgressService.previousStepGetter().patternOffset;


    if (this.optionService.smoothAnimationsGetter()) {
      const interpolatedX = p5.lerp(previousStepOffset * this._squareSideSize, graphicalOffset, this._smoothAnimationProgress);
      this._offsetProgress = interpolatedX;
    } else {
      this._offsetProgress = graphicalOffset;
    }


    this.drawPattern(patternLettersToDraw , this._offsetProgress , this._smoothAnimationProgress);


    this.drawText(textLettersToDraw, this._smoothAnimationProgress);

    this.algorithmProgressService.decoratedAlgorithmGetter().draw(this);
  }

  /**
   * @description Draws the text onto the canvas. Called by drawTextAndPattern.
   * @see {@link drawTextAndPattern}
   * @param lettersToDraw The letters of the text to draw onto the canvas
   * @param fade The fade value (between 0 and 1) - used when smooth aniamtions utilised
   */
  private drawText(lettersToDraw : Letter[], fade : number) : void {
    const previousStepTextLetters  = this.algorithmProgressService.previousStepGetter().lettersInText;
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

  /**
   * @description Draws the pattern onto the canvas. Called by drawTextAndPattern.
   * @see {@link drawTextAndPattern}
   * @param lettersToDraw The letters of the pattern to draw onto the canvas
   * @param offset The offset of the pattern from the text.
   * @param fade The fade value (between 0 and 1) - used when smooth aniamtions utilised
   */
  private drawPattern(lettersToDraw : Letter[] , offset : number , fade : number) : void {
    const previousStepPatternLetters = this.algorithmProgressService.previousStepGetter().lettersInPattern;
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

  /**
   * @description Draws the last occurrence dictionary onto the canvas (Boyer-Moore specific).
   * @param p5 The p5js instance (needed for anything functions to be called by the draw() function)
   */
  public drawLastOccurrenceTable(p5 : p5) : void {
    const background = this.themeSelectorService.currentThemeObjectGetter.BACKGROUND;
    let y = this.StartingYToDraw;
    let xPosition : number , colour : p5.Color;

    this.drawingFunctionSetUp(p5 , background);
    this.centraliseDrawingInY(this.StartingYToDraw + this._dictionarySquareSideSize * 2);

    if (this.optionService.centraliseScrollGetter()) {
      this.centraliseScroll();
      this.optionService.centraliseScrollSetter(false);
   }

    p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
    p5.text(this.LastOccurrenceTitle ,(p5.width  / 2) , this.StartingYToDraw);
    p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

    y = this._dictionarySquareSideSize;

    const lastOccurrenceTable = (this.algorithmProgressService.stepGetter().additional[this.LastOccurrenceVariableName]) ? this.algorithmProgressService.stepGetter().additional[this.LastOccurrenceVariableName] : null;
    const lastOccurrenceToHighlight = (this.algorithmProgressService.stepGetter().additional[this.LastOccurrenceToHighlightVariableName]) ? this.algorithmProgressService.stepGetter().additional[this.LastOccurrenceToHighlightVariableName] : null;

    if (lastOccurrenceTable) {
      const lastOccurrenceTableAsArray = Object.entries(lastOccurrenceTable);
      const lastOccurrenceTableLength = lastOccurrenceTableAsArray.length;

      lastOccurrenceTableAsArray.forEach(([key, value], index) => {
        xPosition = index * (this._dictionarySquareSideSize + this.DictionaryGap) - this._scrollX + (this._dictionarySquareSideSize / 2);

        if (lastOccurrenceToHighlight == key && !this._lastOccurrenceScroll) {
          this.scrollToLastOccurrenceElement(index);
          this._lastOccurrenceScroll = true;
          colour = p5.color(this.themeSelectorService.currentThemeObjectGetter.CHECKING);
        } else if (lastOccurrenceToHighlight == key && this._lastOccurrenceScroll) {
            colour = p5.color(this.themeSelectorService.currentThemeObjectGetter.CHECKING);
        } else if (!this._lastOccurrenceScroll && this.algorithmProgressService.previousStepGetter().additional[this.LastOccurrenceVariableName] !== undefined && lastOccurrenceTableLength != Object.entries(this.algorithmProgressService.previousStepGetter().additional[this.LastOccurrenceVariableName]).length) {
          this.scrollToLastOccurrenceElement(lastOccurrenceTableLength - 1);
          colour = p5.color(this.themeSelectorService.currentThemeObjectGetter.CHECKING);
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

  /**
   * @description Draws the border table onto the canvas (Knuth-Morris-Pratt specific).
   * @param p5 The p5js instance (needed for anything functions to be called by the draw() function)
   */
  public drawBorderTable(p5 : p5) : void {
    const background = this.themeSelectorService.currentThemeObjectGetter.BACKGROUND;
    const startingPointOfBorderTable = 20;
    const textWidth = Math.max(p5.textWidth("String") , p5.textWidth("Border"));
    const patternLength = this.algorithmProgressService.stepGetter().lettersInPattern.length + 1;
    let y = this.StartingYToDraw;
    this.drawingFunctionSetUp(p5 , background);

    this.centraliseDrawingInY(startingPointOfBorderTable + this.StartingYToDraw + 3 * this._borderTableSquareSideSize);

    if (this.optionService.centraliseScrollGetter()) {
       this.centraliseScroll(textWidth + this._borderTableSquareSideSize * patternLength);
       this.optionService.centraliseScrollSetter(false);
    }

    p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
    p5.text(this.BorderTableTitle ,(p5.width  / 2) , y);
    p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

    const borderTable = (this.algorithmProgressService.stepGetter().additional[this.BorderTableVariableName]) ? this.algorithmProgressService.stepGetter().additional[this.BorderTableVariableName] : null;
    const borderTableIndexToHighlight = (this.algorithmProgressService.stepGetter().additional[this.BorderTableToHighlightVariableName] !== null) ? this.algorithmProgressService.stepGetter().additional[this.BorderTableToHighlightVariableName] : null;


    if (borderTable) {

      p5.fill(this.themeSelectorService.currentThemeObjectGetter.TEXT_COLOUR);
      p5.text("String" , 0 - this._scrollX , startingPointOfBorderTable + this._borderTableSquareSideSize);
      p5.text("Border" , 0 - this._scrollX, startingPointOfBorderTable + this._borderTableSquareSideSize * 2);
      p5.fill(this.themeSelectorService.currentThemeObjectGetter.DEFAULT);

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

        const nextLetter = (i-1 < 0) ? '""' : this.algorithmProgressService.stepGetter().lettersInPattern[i-1].letter;

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

  /**
   * @description Used by annoytate to create text to display on top of the pattern
   * @param potentialBorderAsString String that is the border currently being checked by the animation
   * @returns The text to display on top of the pattern
   */
  private createPotentialBorderText(potentialBorderAsString : string) : string {
    return `Potential Border is "${potentialBorderAsString}"`;
  }

  /**
   * @description Adds extra information to pattern to help the user understand the algorithm better. Used in KMP. It is called as a layer in the decorated algorithm.
   */
  public annotatePattern() : void {
    const y = this.StartingYToDraw + this._squareSideSize*2 + this.AnimationGap;
    const outlineWeight = 5, lineWeight = 2 , howRight = 1.5;
    let j , potentialBorderText , potentialBorderTextLength;

    this._p5.push();

    const borderOne = this.algorithmProgressService.stepGetter().additional[this.BorderOneVariableName]  ? this.algorithmProgressService.stepGetter().additional[this.BorderOneVariableName] : null;
    const borderTwo = this.algorithmProgressService.stepGetter().additional[this.BorderTwoVariableName] ? this.algorithmProgressService.stepGetter().additional[this.BorderTwoVariableName] : null;
    const i = (this.algorithmProgressService.stepGetter().additional[this.IVariableName] != undefined) ? this.algorithmProgressService.stepGetter().additional[this.IVariableName] : null;
    j = (this.algorithmProgressService.stepGetter().additional[this.JVariableName] != undefined) ? this.algorithmProgressService.stepGetter().additional[this.JVariableName] : null;

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

      potentialBorderText = this.createPotentialBorderText((this.optionService.patternGetter().substring(borderOne[0] , borderOne[1] + 1)) as string);
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

      potentialBorderText = this.createPotentialBorderText(this.optionService.patternGetter().substring(borderTwo[0] , borderTwo[1] + 1) as string);
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

  /**
   * @description Draws the legend onto the canvas. Called as a layer on top of the decorated algorithm.
   */
  public drawLegend() : void {
    let seperator = 0 , y = this.StartingYToDraw + this._squareSideSize*4 + this.AnimationGap * 5;
    let headingWidth = this._p5.textWidth(this.LegendTitle);
    let textWidth;
    const wordGap = 30;
    const legendSquareSideSize = 10;
    const keysToShow = ["MISMATCH" , "MATCH" ,  "BORDER_CHECK_ONE" ,"BORDER_CHECK_TWO","BORDER_CHECK"];

    if (this.optionService.showLegendGetter()) {
      this._p5.push();
      this._p5.textSize(this.LegendTextSize);

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

  /**
   * @description When a new dictionary element is added, it could be hidden from the user. When animating we want to show it.
   * @param index The index of the element to show (determines value of the scroll)
   */
  private scrollToLastOccurrenceElement(index : number) : void {
    const position = index * (this._dictionarySquareSideSize + this.DictionaryGap);
    if (position < this._scrollX || position > this._p5.width + this._scrollX) {
      this._scrollX = position;
    }
  }

  /**
   * @description When a new border table element is added, it could be hidden from the user. When animating we want to show it.
   * @param index
   * @param textWidth
   */
  private scrollToBorderTableElement(index : number , textWidth : number) : void {
    const position = index * (this._borderTableSquareSideSize) + textWidth;
    if (position < this._scrollX || position > this._p5.width + this._scrollX) {
      this._scrollX = position;
    }
  }

  /**
   * @description Changes the size of the squares drawn on the canvas. It is called when the text or pattern changes, so it is fully visible.
   * @param length The length of the text or pattern - the higher value is should be passed in.
   * @param width The width of the canvas. If not passed in, the width of the canvas is used.
   */
  public changeSquareSize(length : number , width = 0) : void {
    const canvasWidth = (width == 0) ? this._p5.width : width;
    this._squareSideSize = this.determineSquareSize(length , canvasWidth);
  }

  /**
   * @description Resizes the canvas. Called when the window is resized.
   * @param width The new width of the canvas
   * @param height The new height of the canvas
   */
  public resizeCanvas(width : number , height : number) : void {
    const maxLength = Math.max(this.optionService.textGetter().length , this.optionService.patternGetter().length);
    this.changeSquareSize(maxLength , width);
    this._p5.resizeCanvas(width , height);
  }

  /**
   * @description Work out new value of the squares used in the animation.
   * @param textLength Length of the text or pattern - higher value should be paased in
   * @param canvasWidth Width of the canvas
   * @returns The new size of the squares
   */
  protected determineSquareSize(length : number , canvasWidth : number) : number {
    let newSquareSideSize = Math.round((canvasWidth - (this.AnimationMargin*2)) / length);
    newSquareSideSize = (newSquareSideSize > this.MaximumSquareSideSize) ? this.MaximumSquareSideSize : newSquareSideSize;
    newSquareSideSize = (newSquareSideSize < this.MinimumSquareSideSize) ? this.MinimumSquareSideSize : newSquareSideSize;
    return newSquareSideSize;
  }

  /**
   * @description Determines if the active window mode should be used.
   * @param drawingWidth The width of the drawing to be drawn on the canvas
   */
  private activeWindow(drawingWidth : number) : boolean {
    if (this._squareSideSize !== this.MinimumSquareSideSize) return false;
    if (drawingWidth > (this._p5.width - this.AnimationMargin)) return true;
    return false;
  }

  /**
   * @description Destroys the p5js instance and unsubscribes from all subscriptions.
   */
  public destroy() : void {
    this._p5.remove();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * @description Scrolls to the right. Utilised when mousewheel cannot be used e.g. mobile.
   */
  public skipRight() : void {
    this._scrollX += 40;
  }

  /**
   * @description Scrolls to the left. Utilised when mousewheel cannot be used e.g. mobile.
   */
  public skipLeft() : void {
    this._scrollX -= 40;
  }
}