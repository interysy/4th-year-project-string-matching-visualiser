import { Pipe, PipeTransform } from '@angular/core';

/**
 * @description A pipe used to convert the time between steps to speed of the algorithm as multiplier.
 * We track speed by keeping track of time between steps.
 * @see AlgorithmProgressService
 */
@Pipe({
  name: 'speedAsMultiplierPipe'
})
export class SpeedAsMultiplierPipe implements PipeTransform {
  transform(currentSpeed: number , defaultSpeed : number): number {
    return defaultSpeed / currentSpeed;
  }
}