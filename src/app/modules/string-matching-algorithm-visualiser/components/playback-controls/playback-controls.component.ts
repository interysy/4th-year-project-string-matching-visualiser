import { Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { Subscription } from 'rxjs';


/**
 * @description Component for the playback controls of the visualiser.It mainly interacts with the progress service for maintaining the state of the visualiser.
 * @see AlgorithmProgressService
 */
@Component({
  selector: 'app-playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.css'],
})
export class PlaybackControlsComponent implements OnDestroy {

  @Input() showPlaybackHelp : boolean;
  @Output() hidePlaybackSettingsHelp : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeTutorial : EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @description Stores current step number locally so that it can be bound to an input field in the template.
   */
  protected currentStepNumber: number;


  /**
   * @description Stores current speed as a multiplier so that it can be bound to an input field in the template.
   * @see convertSpeedToMultiplier
   */
  protected currentSpeed : number;


  /**
   * @description Stores the amount of steps in the algorithm.
   */
  protected amountOfSteps : number;

  /**
   * @description Stores the subscriptions to the observables from the algorithm progress service.
   */
  subscriptions : Subscription[] = [];


  private static ArrowUpKey = "ArrowUp";
  private static ArrowDownKey = "ArrowDown";
  private static ArrowRightKey = "ArrowRight";
  private static ArrowLeftKey = "ArrowLeft";
  private static SpaceKey = " ";
  private static RKey = "r";

  /**
   * @description Initialises the component with the algorithm progress service and sets values from the service to the local variables for display.
   */
  constructor(protected readonly algorithmProgressService : AlgorithmProgressService) {
    this.currentStepNumber = this.algorithmProgressService.currentStepNumberGetter();
    this.currentSpeed = this.algorithmProgressService.speedGetter();

    this.subscriptions.push(this.algorithmProgressService.stepChangedSubscriberGetter().subscribe((stepNumber : number) => {
      this.currentStepNumber = stepNumber;
    }));
  }

  /**
   * @description Moves to the previous step in the algorithm.
   */
  protected previousStep() : void {
    this.algorithmProgressService.moveToPreviousStep();
  }

  /**
   * @description Plays the algorithm from the current step.
   */
  protected play() : void {
    this.algorithmProgressService.play();
  }

  /**
   * @description Binding key cotnrols to keyboard keys
   * @param $event The keypress event - used to get the key pressed
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyPress($event: KeyboardEvent) {
    $event.preventDefault();

    switch ($event.key) {
      case PlaybackControlsComponent.ArrowRightKey:
        if (!this.algorithmProgressService.currentlyPlayingGetter()) this.algorithmProgressService.moveToNextStep();
        break;
      case PlaybackControlsComponent.ArrowLeftKey:
        if (!this.algorithmProgressService.currentlyPlayingGetter()) this.algorithmProgressService.moveToPreviousStep();
        break;
      case PlaybackControlsComponent.SpaceKey:
        if (this.algorithmProgressService.currentlyPlayingGetter()) {
          this.algorithmProgressService.pause();
        } else {
          this.algorithmProgressService.play();
        }
        break;
      case PlaybackControlsComponent.RKey:
        this.algorithmProgressService.resetProgress();
        break;
      case PlaybackControlsComponent.ArrowUpKey:
        if (this.currentSpeed - 100 >= this.algorithmProgressService.MinimumSpeed) {
          this.currentSpeed -= 100;
          this.algorithmProgressService.changeSpeedOfPlayback(this.currentSpeed);
        }
        break;
      case PlaybackControlsComponent.ArrowDownKey:
        if (this.currentSpeed + 100 <= this.algorithmProgressService.MaximumSpeed) {
          this.currentSpeed += 100;
          this.algorithmProgressService.changeSpeedOfPlayback(this.currentSpeed);
        }
        break;
      default:
        break;
    }
  }

  /**
   * @description Moves to the next step in the algorithm.
   */
  protected nextStep() : void {
    this.algorithmProgressService.moveToNextStep();
  }

  /**
   * @description Resets the algorithm to the initial state.
   */
  protected reset() : void {
    this.algorithmProgressService.resetProgress();
  }

  /**
   * @description Pauses the algorithm at the current step.
   */
  protected pause() : void {
    this.algorithmProgressService.pause();
  }

  /**
   * @description Changes the speed of the playback.
   */
  protected changePlaybackSpeed() : void {
    this.algorithmProgressService.changeSpeedOfPlayback(this.currentSpeed);
  }

  /**
   * @description Sets the current step number to the value in the input field.
   */
  protected setStep() : void {
    this.algorithmProgressService.currentStepNumberSetter(this.currentStepNumber);
  }

  /**
   * @description Destroys all subscriptions when component is destroyed (i.e. removed from DOM).
   */
  ngOnDestroy() : void {
    this.subscriptions.forEach((subscription : Subscription) => {
      subscription.unsubscribe();
    });
  }

  get currentStepNumberGetter(): number {
    return this.currentStepNumber;
  }

  get currentSpeedGetter(): number {
    return this.currentSpeed;
  }

  get amountOfStepsGetter(): number {
    return this.amountOfSteps;
  }

}
