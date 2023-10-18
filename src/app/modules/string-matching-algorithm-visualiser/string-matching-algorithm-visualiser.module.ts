import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmVisualiserComponent } from './components/algorithm-visualiser/algorithm-visualiser.component';
import { PseudocodeVisualiserComponent } from './components/pseudocode-visualiser/pseudocode-visualiser.component';
import { VariableVisualiserComponent } from './components/variable-visualiser/variable-visualiser.component';
import { CommandVisualiserComponent } from './components/command-visualiser/command-visualiser.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AlgorithmVisualiserComponent,
    PseudocodeVisualiserComponent,
    VariableVisualiserComponent,
    CommandVisualiserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    AlgorithmVisualiserComponent,
    PseudocodeVisualiserComponent,
    VariableVisualiserComponent,
    CommandVisualiserComponent,
  ],
})
export class StringMatchingAlgorithmVisualiserModule { }
