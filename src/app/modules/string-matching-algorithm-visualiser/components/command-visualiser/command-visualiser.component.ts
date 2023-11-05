import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-command-visualiser',
  templateUrl: './command-visualiser.component.html',
  styleUrls: ['./command-visualiser.component.css']
})
export class CommandVisualiserComponent {

    currentCommand = "Start the Animator Below!";


    constructor(private algorithmProgressService : AlgorithmProgressService) {

      this.algorithmProgressService.notifier.subscribe((_) => {
          this.currentCommand = this.algorithmProgressService.command;
      });

    }
  }
