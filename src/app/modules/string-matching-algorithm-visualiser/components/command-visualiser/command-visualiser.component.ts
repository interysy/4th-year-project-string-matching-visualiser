import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-command-visualiser',
  templateUrl: './command-visualiser.component.html',
  styleUrls: ['./command-visualiser.component.css']
})
export class CommandVisualiserComponent {

    currentCommand : string;


    constructor(private readonly algorithmProgressService : AlgorithmProgressService) {
      this.currentCommand = this.algorithmProgressService.command;
      this.algorithmProgressService.stepChangedSubscriberGetter.subscribe((_) => {
          this.currentCommand = this.algorithmProgressService.command;
      });

    }
  }
