import { Component, OnInit } from '@angular/core';
import { Modal, initTE } from 'tw-elements';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {

  text = "The fox jumped over the lazy dog";
  pattern = "lazy";
  preProcessingSteps = true;
  smoothAnimations = false;

  constructor(private readonly algorithmProgressService : AlgorithmProgressService) {
    this.algorithmProgressService.textChanged.next(this.text)
    this.algorithmProgressService.patternChanged.next(this.pattern)
  }

  ngOnInit() {
    initTE({ Modal });
  }

  protected sendTextToService() {
    this.algorithmProgressService.textChanged.next(this.text)
  }

  protected sendPatternToService() {
    this.algorithmProgressService.patternChanged.next(this.pattern)
  }

  protected setPreprocessingSteps() {
    this.algorithmProgressService.preProcessingStepsSetter = this.preProcessingSteps;
  }

  protected setSmoothAnimations() {
    this.algorithmProgressService.smoothAnimationsSetter = this.smoothAnimations;
  }
}