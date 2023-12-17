import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {

  protected textLength : number;
  protected patternLength : number;
  protected textIndex : number;
  protected patternIndex : number;
  protected additionalVariables : { [variableName: string]: number | string; }[] = [];
  private doNotDisplay : string[] = [];

  constructor(private algorithmProgressService : AlgorithmProgressService) {
    this.doNotDisplay = environment.additionalVariablesToExclude;

    this.textLength = this.algorithmProgressService.textLength;
    this.patternLength = this.algorithmProgressService.patternLength;

    this.algorithmProgressService.stepChangedSubscriberGetter.subscribe((_) => {
      const additional = algorithmProgressService.additionalVariablesGetter;

      if (additional["textLength"] != undefined) this.textLength = additional["textLength"];
      if (additional["patternLength"] != undefined) this.patternLength = additional["patternLength"];
      this.textIndex = this.algorithmProgressService.textIndex;
      this.patternIndex = this.algorithmProgressService.patternIndex;


      for (const additionalVariableName of Object.keys(additional)) {
        if (this.additionalVariables.find(existingAdditionalVariable => existingAdditionalVariable["variableName"] == additionalVariableName) == undefined && !this.doNotDisplay.includes(additionalVariableName) ) {
          this.additionalVariables.push({variableName : additionalVariableName, value : additional[additionalVariableName]});
        } else {
          this.additionalVariables.map(existingAdditionalVariable => {
            if (existingAdditionalVariable["variableName"] == additionalVariableName) {
              existingAdditionalVariable["value"] = additional[additionalVariableName];
            }});
        }
      }
    });

  }
}
