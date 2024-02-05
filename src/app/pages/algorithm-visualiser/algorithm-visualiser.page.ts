import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmProgressService } from 'src/app/modules/string-matching-algorithm-visualiser/services/algorithm-progress.service';

/**
 * @description
 * This component will contain the main functionality of the application , containing the algorithm visualiser,
 * the control UI, navbar, pseudocode visualiser, command displayer and variable displayer,
*/
@Component({
  selector: 'app-algorithm-visualiser',
  templateUrl: './algorithm-visualiser.page.html',
  styleUrls: ['./algorithm-visualiser.page.css']
})
export class AlgorithmVisualiserPageComponent {

  showPlaybackHelp = false;
  showAlgorithmVisualiserHelp  = false;
  showPseudocodeHelp = false;
  showCommandDisplayerHelp = false;
  showVariableVisualiserHelp = false;

  /**
   * @description The constuctor creates the page and setups a progress service to be used by the app with the correct algorithm
   * @param route Used to fetch the data to inject onto the page
   * @param algorithmProgressService Used to setup the algorithm to be visualised
   */
  constructor (protected readonly route : ActivatedRoute , protected readonly algorithmProgressService : AlgorithmProgressService, protected readonly elementRef : ElementRef) {
    const algorithmToInject = route.snapshot.data['requiredService'];
    const decorators = route.snapshot.data['decorators'];
    const preProcessingCanvas = route.snapshot.data['preProcessingCanvas'] ? true : false;
    const preProcessingFunction = route.snapshot.data['preProcessingCanvas'] ? route.snapshot.data['preProcessingFunction'] : null;
    algorithmProgressService.injectAlgorithm(algorithmToInject , decorators, preProcessingCanvas , preProcessingFunction);
  }

  protected  startTutorial() : void {
    this.endTutorial();
    this.showPlaybackHelp = true;
  }

  protected endTutorial() : void {
    this.showPlaybackHelp = false;
    this.showAlgorithmVisualiserHelp = false;
    this.showPseudocodeHelp = false;
    this.showCommandDisplayerHelp = false;
    this.showVariableVisualiserHelp = false;
  }

  protected nextStepInTutorialAfterPlayback() : void {
    this.showPlaybackHelp = false;
    this.showPseudocodeHelp = true;
    this.elementRef.nativeElement.querySelector('#pseudocodeVisualiser').scrollIntoView({behavior: 'smooth'});
  }

  protected nextStepInTutorialAfterPseudocode() : void {
    this.showPseudocodeHelp = false;
    this.showAlgorithmVisualiserHelp = true;
    this.elementRef.nativeElement.querySelector('#algorithmVisualiser').scrollIntoView({behavior: 'smooth'});
  }

  protected nextStepInTutorialAfterVisualiser() : void {
    this.showAlgorithmVisualiserHelp = false;
    this.showCommandDisplayerHelp = true;
    this.elementRef.nativeElement.querySelector('#commandDisplayer').scrollIntoView({behavior: 'smooth'});
  }

  protected nextStepInTutorialAfterCommand() : void {
    this.showCommandDisplayerHelp = false;
    this.showVariableVisualiserHelp = true;
    this.elementRef.nativeElement.querySelector('#variableDisplayer').scrollIntoView({behavior: 'smooth'});
  }

}
