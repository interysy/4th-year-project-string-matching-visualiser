import { AlgorithmStepBuilder } from '../model-builders/algorithm-step.builder';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { DrawStepDecorator } from '../models/drawer-step.decorator';
import { AlgorithmProgressService } from '../services/algorithm-progress.service';
import { DrawerStub } from './drawer.stub';
import { StringMatchingAlgorithmStub } from './string-matching.algorithm.stub';

export class AlgorithmProgressServiceStub extends AlgorithmProgressService {

    override stepGetter(): AlgorithmStep {

        const algorithmStepBuilder = new AlgorithmStepBuilder();
        return algorithmStepBuilder.build();
    }

    override previousStepGetter(): AlgorithmStep {
        return this.stepGetter();
    }

    override decoratedAlgorithmGetter(): DrawStepDecorator {
        const newAlgorithm = new StringMatchingAlgorithmStub();
        return new DrawerStub(newAlgorithm);
    }
}
