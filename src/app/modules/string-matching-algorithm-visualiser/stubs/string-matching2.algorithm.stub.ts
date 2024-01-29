import { AlgorithmStep } from '../models/algorithm-step.model';
import { StringMatchingAlgorithmStub } from './string-matching.algorithm.stub';

export class StringMatchingAlgorithmStub2 extends StringMatchingAlgorithmStub {

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

  override algorithmNameSlug = "stubbed-algorithm-2";

  override get stepsGetter(): AlgorithmStep[] {
      let extra = true;
      for (let i = 0; i < 50; i++) {
        if (i === 25) extra = false;
        this.algorithmStepBuilder.setExtra =  extra;
        this.steps.push(this.algorithmStepBuilder.build());
      }
      return this.steps;
  }
}
