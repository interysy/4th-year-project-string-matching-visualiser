import { AlgorithmStep } from '../models/algorithm-step.model';
import { StringMatchingAlgorithm } from '../models/algorithm.model';
import { P5jsDrawClass } from '../drawers/p5js.drawer';

export class StringMatchingAlgorithmStub extends StringMatchingAlgorithm {

  override algorithmName = "stubbed-algorithm";

  protected override addSetupSteps(textLength: number, patternLength: number): void {
      return;
  }
  override resetAdditionalVariables(): void {
      return;
  }

  workOutSteps(text: string, pattern: string): number {
    return 0;
  }

  override get stepsGetter(): AlgorithmStep[] {
      for (let i = 0; i < 100; i++) {
        this.algorithmStepBuilder.setExtra =  Math.random() < 0.5;
        this.steps.push(this.algorithmStepBuilder.build());
      }
      return this.steps;
  }

  override draw(obj: P5jsDrawClass): void {
    return;
  }


}
