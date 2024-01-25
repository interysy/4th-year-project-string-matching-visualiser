import { AlgorithmStep } from '../models/algorithm-step.model';
import { StringMatchingAlgorithm } from '../algorithms/algorithm.model';
import { P5jsDrawClass } from '../drawers/p5js.drawer';

export class StringMatchingAlgorithmStub extends StringMatchingAlgorithm {

  protected override addWhileLoopStep(): void {
    throw new Error('Method not implemented.');
  }
  protected override addCheckStep(): void {
    throw new Error('Method not implemented.');
  }
  protected override addFullMatchStep(): void {
    throw new Error('Method not implemented.');
  }
  protected override addNoSolutionStep(): void {
    throw new Error('Method not implemented.');
  }

  override algorithmNameSlug = "stubbed-algorithm";

  protected override addSetupSteps(): void {
      return;
  }

  protected resetAdditionalVariables(): void {
      return;
  }

  workOutSteps(): number {
    return 0;
  }

  override get stepsGetter(): AlgorithmStep[] {
      for (let i = 0; i < 100; i++) {
        this.algorithmStepBuilder.setExtra =  i < 50;
        this.steps.push(this.algorithmStepBuilder.build());
      }
      return this.steps;
  }

  override draw(obj: P5jsDrawClass): void {
    return;
  }


}
