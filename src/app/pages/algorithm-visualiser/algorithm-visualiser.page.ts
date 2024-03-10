import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmVisualiserComponent } from 'src/app/modules/string-matching-algorithm-visualiser/components/algorithm-visualiser/algorithm-visualiser.component';
import { AlgorithmProgressService } from 'src/app/modules/string-matching-algorithm-visualiser/services/algorithm-progress.service';
import { OptionService } from 'src/app/modules/string-matching-algorithm-visualiser/services/option.service';

/**
 * @description
 * This component will contain the main functionality of the application , containing the algorithm visualiser,
 * the control UI, navbar, pseudocode visualiser, command displayer and variable displayer,
 * @see https://stackoverflow.com/questions/55565001/how-do-you-allow-a-user-to-manually-resize-a-div-element-vertically
 * The code for the slider has been adapted for Angular from the first answer on stackoverflow.
*/
@Component({
  selector: 'app-algorithm-visualiser',
  templateUrl: './algorithm-visualiser.page.html',
  styleUrls: ['./algorithm-visualiser.page.css']
})
export class AlgorithmVisualiserPageComponent {

  /**
   * @description With slider, the left hand side refers to animation, variable visualiser and command displayer. The side gets resized.
   */
  @ViewChild('leftHandSide', {static: false})
  leftHandSideElement: ElementRef<HTMLDivElement>;

  /**
   * @description With slider, the right hand side refers to the pseudocode visualiser. The side gets resized.
   */
  @ViewChild('rightHandSide', {static: false})
  rightHandSideElement: ElementRef<HTMLDivElement>;

  /**
   * @description The child component, the algorithm visualiser, which contains and controls the canvas for animations.
   */
  @ViewChild(AlgorithmVisualiserComponent) child:AlgorithmVisualiserComponent;

  /**
   * @description The boolean used to check if the user is resizing the left hand side of the page.
   */
  private resizing = false;

  /**
   * @description The amount user slides across.
  */
  private dragX: number;

  /**
   * @description Boolean to check if user should be shown playback tutorial.
   */
  showPlaybackHelp = false;

  /**
   * @description Boolean to check if user should be shown visualiser tutorial.
   */
  showAlgorithmVisualiserHelp  = false;

    /**
   * @description Boolean to check if user should be shown pseudocode tutorial.
   */
  showPseudocodeHelp = false;

    /**
   * @description Boolean to check if user should be shown command displayer tutorial.
   */
  showCommandDisplayerHelp = false;

    /**
   * @description Boolean to check if user should be shown variable visualiser tutorial.
   */
  showVariableVisualiserHelp = false;

  /**
   * @description The constuctor creates the page and setups a progress service to be used by the app with the correct algorithm
   * @param route Used to fetch the data to inject onto the page
   * @param algorithmProgressService Used to setup the algorithm to be visualised
   * @param elementRef Code required to reference a HTML elements from within the class.
   * @param optionService Used to setup the options for the algorithm
   */
  constructor (protected readonly route : ActivatedRoute , protected readonly algorithmProgressService : AlgorithmProgressService, protected readonly elementRef : ElementRef , protected readonly optionService : OptionService) {
    const algorithmToInject = route.snapshot.data['requiredService'];
    const decorators = route.snapshot.data['decorators'];
    const preProcessingCanvas = route.snapshot.data['preProcessingCanvas'] ? true : false;
    const preProcessingFunction = route.snapshot.data['preProcessingCanvas'] ? route.snapshot.data['preProcessingFunction'] : null;
    algorithmProgressService.injectAlgorithm(algorithmToInject , decorators, preProcessingCanvas , preProcessingFunction);
  }

  /**
   * @description The function to start the tutorial, which will show the user how to use the playback controls.
   */
  protected startTutorial() : void {
    this.endTutorial();
    this.showPlaybackHelp = true;
  }

  /**
   * @description The function to end the tutorial, which will hide all the tutorial popups.
   */
  protected endTutorial() : void {
    this.showPlaybackHelp = false;
    this.showAlgorithmVisualiserHelp = false;
    this.showPseudocodeHelp = false;
    this.showCommandDisplayerHelp = false;
    this.showVariableVisualiserHelp = false;
  }

  /**
   * @description The function to go to the next step in the tutorial, which will show the user how to use the pseudocode visualiser.
   */
  protected nextStepInTutorialAfterPlayback() : void {
    this.showPlaybackHelp = false;
    this.showPseudocodeHelp = true;
    this.elementRef.nativeElement.querySelector('#pseudocodeVisualiser').scrollIntoView({behavior: 'smooth'});
  }

  /**
   * @description The function to go to the next step in the tutorial, which will show the user how to use the algorithm visualiser.
   */
  protected nextStepInTutorialAfterPseudocode() : void {
    this.showPseudocodeHelp = false;
    this.showAlgorithmVisualiserHelp = true;
    this.elementRef.nativeElement.querySelector('#algorithmVisualiser').scrollIntoView({behavior: 'smooth'});
  }

  /**
   * @description The function to go to the next step in the tutorial, which will show the user how to use the command displayer.
   */
  protected nextStepInTutorialAfterVisualiser() : void {
    this.showAlgorithmVisualiserHelp = false;
    this.showCommandDisplayerHelp = true;
    this.elementRef.nativeElement.querySelector('#commandDisplayer').scrollIntoView({behavior: 'smooth'});
  }

  /**
   * @description The function to go to the next step in the tutorial, which will show the user how to use the variable visualiser.
   */
  protected nextStepInTutorialAfterCommand() : void {
    this.showCommandDisplayerHelp = false;
    this.showVariableVisualiserHelp = true;
    this.elementRef.nativeElement.querySelector('#variableDisplayer').scrollIntoView({behavior: 'smooth'});
  }

  /**
   * @description Called when user clicks on the slider. It starts to resize by setting the resizing boolean to true and calculating the drag.
   * @param $event The event that triggered the function.
   */
  protected startResize($event : any) : void {
    this.resizing = true;
    this.dragX = $event.clientX;
  }

  /**
   * @description Called when mouse is moved and user is holding the slider, dragging it along to resize. It resizes components and canvases within the visualiser component.
   * @param $event Moving mouse event
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove($event : any) : void {
    if (this.resizing) {
      if (this.leftHandSideElement.nativeElement.offsetWidth + $event.clientX - this.dragX > 300) {
        this.leftHandSideElement.nativeElement.style.width = this.leftHandSideElement.nativeElement.offsetWidth+ $event.clientX - this.dragX + "px";
        this.dragX = $event.clientX;
        this.child.drawersResizeCanvas();
      }
    }
  }

  /**
   * @description Called when user releases the slider, it stops resizing. It resets drag and resizes the canvases within the visualiser component.
   * @event mouseup event
   */
  @HostListener('document:mouseup', ['$event'])
  onMouseUp($event : any) : void {
    this.resizing = false;
    this.child.drawersResizeCanvas();
    this.dragX = 0;
  }
}
