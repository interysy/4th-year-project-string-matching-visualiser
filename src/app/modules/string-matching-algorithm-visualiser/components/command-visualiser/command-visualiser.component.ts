import { Component } from '@angular/core';
import { PlaybackServiceService } from '../../services/playback-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-command-visualiser',
  templateUrl: './command-visualiser.component.html',
  styleUrls: ['./command-visualiser.component.css']
})
export class CommandVisualiserComponent {

    currentCommand : string;


    constructor(private playbackService : PlaybackServiceService) {
      this.playbackService.notifier.subscribe((_) => {
          this.currentCommand = this.playbackService.command;
      });
    }
  }
