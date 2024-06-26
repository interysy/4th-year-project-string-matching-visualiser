import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmVisualiserComponent } from './components/algorithm-visualiser/algorithm-visualiser.component';
import { PseudocodeVisualiserComponent } from './components/pseudocode-visualiser/pseudocode-visualiser.component';
import { VariableVisualiserComponent } from './components/variable-visualiser/variable-visualiser.component';
import { CommandVisualiserComponent } from './components/command-visualiser/command-visualiser.component';
import { FormsModule } from '@angular/forms';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPlay,faBackward, faForward, faRotate, faPause, faGear, faArrowRight, faArrowLeft, faXmark, faCheck, faGauge, faSliders, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ModalComponent } from './components/modal/modal.component';
import { SpeedAsMultiplierPipe } from './shared/pipes/speed.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  declarations: [
    AlgorithmVisualiserComponent,
    PseudocodeVisualiserComponent,
    VariableVisualiserComponent,
    CommandVisualiserComponent,
    PlaybackControlsComponent,
    ModalComponent,
    SpeedAsMultiplierPipe,
  ],
  exports: [
    AlgorithmVisualiserComponent,
    PseudocodeVisualiserComponent,
    VariableVisualiserComponent,
    CommandVisualiserComponent,
    PlaybackControlsComponent,
  ],
})
export class StringMatchingAlgorithmVisualiserModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faPlay,
      faBackward,
      faForward,
      faRotate,
      faPause,
      faGear,
      faArrowRight,
      faArrowLeft,
      faXmark,
      faCheck,
      faGauge,
      faSliders,
      faArrowLeft,
      faArrowDown,
    );
  }
}
