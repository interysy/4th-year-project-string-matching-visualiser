import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmVisualiserComponent } from './components/algorithm-visualiser/algorithm-visualiser.component';
import { PseudocodeVisualiserComponent } from './components/pseudocode-visualiser/pseudocode-visualiser.component';
import { VariableVisualiserComponent } from './components/variable-visualiser/variable-visualiser.component';
import { CommandVisualiserComponent } from './components/command-visualiser/command-visualiser.component';
import { FormsModule } from '@angular/forms';
import { BruteForceAlgorithm } from './algorithms/brute-force/brute-force.algorithm';
import { ActivatedRoute } from '@angular/router';
import { StringMatchingAlgorithm } from './models/algorithm.model';


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
  providers:[
    {
      provide: StringMatchingAlgorithm,
      useFactory: (activatedRoute: ActivatedRoute, injector:Injector) => {
            const param = activatedRoute.snapshot.queryParams['algorithm'];
            console.log(param);
            switch (param) {
              case "bruteForce": return injector.get(BruteForceAlgorithm)
              default : throw new Error(`No service defined for the algorithm: "${param}"`);
            }

      },
      deps:[ActivatedRoute, Injector]
    }
  ],
})
export class StringMatchingAlgorithmVisualiserModule { }
