import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'speedAsMultiplierPipe'
})
export class SpeedAsMultiplierPipe implements PipeTransform {
  transform(currentSpeed: number , defaultSpeed : number): number {
    return defaultSpeed / currentSpeed;
  }
}