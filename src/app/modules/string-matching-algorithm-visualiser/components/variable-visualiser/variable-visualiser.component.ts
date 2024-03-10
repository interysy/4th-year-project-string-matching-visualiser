import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { environment } from 'src/environments/environment.dev';
 import { AdditionalVariables } from '../../models/additional-variables.model';

 /**
  * @description Component for displaying current variable values.
  */
@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {


  /**
   * @description Fetches tutorial boolean to determine whether to show the prompt.
   * @see AlgorithmVisualiserPage
   */
  @Input() showVariableVisualiserHelp : boolean;

  /**
   * @description Notifies parent of finished tutorial, so it can finish the tutorial.
   */
  @Output() closeTutorial = new EventEmitter<boolean>();

  /**
   * @description Constructor for VariableVisualiserComponent
   * @param algorithmProgressService Service for getting variables to display
   */
  constructor(protected readonly algorithmProgressService : AlgorithmProgressService) {}

  /**
   * @description Gets the variables to display, it filters based on the config file for the app
   * @param variables The variables to display
   * @returns The variables to display
   */
  protected variablesToDisplay(variables : AdditionalVariables) : { [variableName: string]: number | string; }[] {

    return Object.keys(variables).filter((key) => {
      return !environment.additionalVariablesToExclude.includes(key);
      }).map((variableName) => {
        return {variableName : variableName, value : variables[variableName as keyof typeof AdditionalVariables]};
      });
  }
}
