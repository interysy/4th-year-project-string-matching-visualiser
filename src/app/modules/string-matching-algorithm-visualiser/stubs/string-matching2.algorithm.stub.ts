import { AlgorithmStep } from '../models/algorithm-step.model';
import { StringMatchingAlgorithmStub } from './string-matching.algorithm.stub';

export class StringMatchingAlgorithmStub2 extends StringMatchingAlgorithmStub {

  override algorithmName = "stubbed-algorithm-2";

  override get stepsGetter(): AlgorithmStep[] {
      for (let i = 0; i < 50; i++) {
        this.algorithmStepBuilder.setExtra =  Math.random() < 0.5;
        this.steps.push(this.algorithmStepBuilder.build());
      }
      return this.steps;
  }
}
