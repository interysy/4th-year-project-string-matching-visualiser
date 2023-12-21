import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmVisualiserComponent } from 'src/app/modules/string-matching-algorithm-visualiser/components/algorithm-visualiser/algorithm-visualiser.component';
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

  @ViewChild('leftHandSide', {static: true})
  leftHandSideElement: ElementRef<HTMLDivElement>;

  @ViewChild(AlgorithmVisualiserComponent) child:AlgorithmVisualiserComponent;

  private resizing = false;
  dragX: any;

  /**
   * @description The constuctor creates the page and setups a progress service to be used by the app with the correct algorithm
   * @param route Used to fetch the data to inject onto the page
   * @param algorithmProgressService Used to setup the algorithm to be visualised
   */
  constructor (route : ActivatedRoute , algorithmProgressService : AlgorithmProgressService) {
    const algorithmToInject = route.snapshot.data['requiredService'];
    const algorithmName = route.snapshot.data['algorithmNameSlug'];
    const decorators = route.snapshot.data['decorators'];
    const preProcessingCanvas = route.snapshot.data['preProcessingCanvas'] ? true : false;
    const preProcessingFunction = route.snapshot.data['preProcessingCanvas'] ? route.snapshot.data['preProcessingFunction'] : null;
    algorithmProgressService.injectAlgorithm(algorithmToInject, algorithmName , decorators, preProcessingCanvas , preProcessingFunction);
  }

  protected startResize($event : any) {
    this.resizing = true;
    this.dragX = $event.clientX;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove($event : any) {
    if (this.resizing) {
      this.leftHandSideElement.nativeElement.style.width = this.leftHandSideElement.nativeElement.offsetWidth+ $event.clientX - this.dragX + "px";
      this.dragX = $event.clientX;
      this.child.drawersResizeCanvas();
    }
  }


  @HostListener('document:mouseup', ['$event'])
  onMouseUp($event : any) {
    this.resizing = false;
    this.child.drawersResizeCanvas();
  }
}
