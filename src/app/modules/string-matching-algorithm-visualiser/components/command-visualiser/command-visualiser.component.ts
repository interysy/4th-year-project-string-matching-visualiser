import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subscription } from 'rxjs';

/**
 * @description This component is responsible for displaying the current command regarding what is happening in the algorithm.
 */
@Component({
  selector: 'app-command-visualiser',
  templateUrl: './command-visualiser.component.html',
  styleUrls: ['./command-visualiser.component.css']
})
export class CommandVisualiserComponent implements OnDestroy {


    /**
     * @description Fetches tutorial boolean to determine whether to show the prompt.
     * @see AlgorithmVisualiserPage
     */
    @Input() showCommandDisplayerHelp : boolean;


    /**
     * @description Notifies parent of finished tutorial, so it can move onto the next step.
     */
    @Output() hideCommandDisplayerHelp = new EventEmitter<boolean>();

    /**
     * @description Notifies parent of finished tutorial, so it can finish the tutorial.
     */
    @Output() closeTutorial = new EventEmitter<boolean>();

    /**
     * @description Current command to display.
     */
    private _currentCommand : string;

    /**
     * @description The array of observables the component subscribes to (where it gets notifications from).
     */
    subscriptions : Subscription[] = [];


    /**
     * @description Create instance of CommandVisualiserComponent, inject relevant services and subscribe to progress service to get notifications of step changes.
     * @param algorithmProgressService Needs to be injected, since the components needs to listen for step changes.
     */
    constructor(private readonly algorithmProgressService : AlgorithmProgressService) {
      this._currentCommand = this.algorithmProgressService.command();
      this.subscriptions.push(this.algorithmProgressService.stepChangedSubscriberGetter().subscribe((_) => {
          this._currentCommand = this.algorithmProgressService.command();
      }));
    }

    /**
     * @description Get the current command. Only used for testing.
     * @returns {string} Current command.
     */
    get currentCommand() : string {
      return this._currentCommand;
    }

    /**
     * @description Unsubscribe from all subscriptions upon desctruction.
     */
    ngOnDestroy() {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
