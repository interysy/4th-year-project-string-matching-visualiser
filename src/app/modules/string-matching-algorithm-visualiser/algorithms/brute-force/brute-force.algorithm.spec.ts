import { AlgorithmStepBuilder } from '../../model-builders/algorithm-step.builder';
import { AlgorithmStep } from '../../models/algorithm-step.model';
import { BruteForceAdditionalVariables } from './brute-force-additional-variables.model';
import { BruteForceAlgorithm } from './brute-force.algorithm';

describe("BruteForceAlgorithm", () => {
  let bruteForceAlgorithm: BruteForceAlgorithm;
  let algorithmStepBuilder : AlgorithmStepBuilder;


  function convertStepsToStepsWithIndex(steps : AlgorithmStep[]) : any[] {
    return steps.map((step,index) => {
      const newStep = step as any;
      newStep.index = index;
      return newStep;
    });
  }

  beforeEach(() => {
    bruteForceAlgorithm = new BruteForceAlgorithm();
    algorithmStepBuilder = new AlgorithmStepBuilder();
    algorithmStepBuilder.setDefaults();

  });

  it("should create setup steps", () => {
    const text = "bacbabababacaca";
    const pattern = "ababaca";

    bruteForceAlgorithm.workOutSteps(text , pattern);

    expect(bruteForceAlgorithm.stepsGetter[0].command).toEqual("");
    expect(bruteForceAlgorithm.stepsGetter[0].textIndex).toEqual(-1);
    expect(bruteForceAlgorithm.stepsGetter[0].patternIndex).toEqual(-1);
    expect(bruteForceAlgorithm.stepsGetter[0].additional.patternLength).toEqual(-1);
    expect(bruteForceAlgorithm.stepsGetter[0].additional.textLength).toEqual(-1);
    expect(bruteForceAlgorithm.stepsGetter[0].additional["startingPoint"]).toEqual(-1);

    expect(bruteForceAlgorithm.stepsGetter[1].command).toEqual("Measuring the length of the text");
    expect(bruteForceAlgorithm.stepsGetter[1].additional.textLength).toEqual(text.length);

    expect(bruteForceAlgorithm.stepsGetter[2].command).toEqual("Measuring the length of the pattern");
    expect(bruteForceAlgorithm.stepsGetter[2].additional.patternLength).toEqual(pattern.length);

    expect(bruteForceAlgorithm.stepsGetter[3].command).toEqual("Initialising the starting point to 0");
    expect(bruteForceAlgorithm.stepsGetter[3].additional["startingPoint"]).toBeDefined();
    expect(bruteForceAlgorithm.stepsGetter[3].additional["startingPoint"]).toEqual(0);

    expect(bruteForceAlgorithm.stepsGetter[4].command).toEqual("Initialising the text index to 0");
    expect(bruteForceAlgorithm.stepsGetter[4].additional["startingPoint"]).toEqual(0);
    expect(bruteForceAlgorithm.stepsGetter[4].additional.textLength).toEqual(text.length);
    expect(bruteForceAlgorithm.stepsGetter[4].additional.patternLength).toEqual(pattern.length);
    expect(bruteForceAlgorithm.stepsGetter[4].textIndex).toEqual(0);

    expect(bruteForceAlgorithm.stepsGetter[5].command).toEqual("Initialising the pattern index to 0");
    expect(bruteForceAlgorithm.stepsGetter[5].additional["startingPoint"]).toEqual(0);
    expect(bruteForceAlgorithm.stepsGetter[5].additional.textLength).toEqual(text.length);
    expect(bruteForceAlgorithm.stepsGetter[5].additional.patternLength).toEqual(pattern.length);
    expect(bruteForceAlgorithm.stepsGetter[5].textIndex).toEqual(0);
    expect(bruteForceAlgorithm.stepsGetter[5].patternIndex).toEqual(0);
  });

  it("should create the iteration step", () => {

    const text = "bacbabababacaca";
    const pattern = "ababaca";

    bruteForceAlgorithm.workOutSteps(text , pattern);

    const stepsWithIndexes = bruteForceAlgorithm.stepsGetter.map((step,index) => {
      const newStep = step as any;
      newStep.index = index;
      return newStep;
    });

    expect(bruteForceAlgorithm.stepsGetter[6].command).toEqual("Looping through the pattern and text looking for a match");

    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.command === "Looping through the pattern and text looking for a match";
    }).forEach((stepWithIndex) => {
      expect(stepWithIndex.additional["startingPoint"]).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].additional["startingPoint"]);
      expect(stepWithIndex.additional.patternLength).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.patternLength);
      expect(stepWithIndex.additional.textLength).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.textLength);
      expect(stepWithIndex.lettersInPattern).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].lettersInPattern);
      expect(stepWithIndex.lettersInText).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].lettersInText);
      expect(stepWithIndex.patternOffset).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index -1 ].patternOffset);
    });
  });

  it("should create the check step", () => {
    const text = "bacbabababacaca";
    const pattern = "ababaca";

    bruteForceAlgorithm.workOutSteps(text , pattern);

    expect(bruteForceAlgorithm.stepsGetter[7].command).toEqual("Checking if the 2 characters match");

    const stepsWithIndexes = convertStepsToStepsWithIndex(bruteForceAlgorithm.stepsGetter);

    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.command === "Checking if the 2 characters match";
    }).forEach((stepWithIndex) => {
      expect(stepWithIndex.lettersInText[stepWithIndex.textIndex].colour).toEqual("CHECKING");
      expect(stepWithIndex.lettersInPattern[stepWithIndex.patternIndex].colour).toEqual("CHECKING");
      expect(stepWithIndex.additional["startingPoint"]).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].additional["startingPoint"]);
      expect(stepWithIndex.additional.patternLength).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.patternLength);
      expect(stepWithIndex.additional.textLength).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.textLength);
      expect(stepWithIndex.textIndex).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].textIndex);
      expect(stepWithIndex.patternIndex).toEqual(bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1].patternIndex);
    });
  });

  it("it should create match steps" , () => {
    const text = "the fox jumped over the lazy dog";
    const pattern = "lazy";
    let previousStep;

    bruteForceAlgorithm.workOutSteps(text , pattern);

    const stepsWithIndexes = convertStepsToStepsWithIndex(bruteForceAlgorithm.stepsGetter);


    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.pseudocodeLine === 10;
    }).forEach((stepWithIndex) => {
      previousStep = bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1];
      expect(stepWithIndex.patternIndex).toEqual(previousStep.patternIndex);
      expect(stepWithIndex.textIndex).toEqual(previousStep.textIndex + 1);
      expect(stepWithIndex.patternOffset).toEqual(previousStep.patternOffset);
      expect(stepWithIndex.lettersInText[previousStep.textIndex].colour).toEqual("MATCH");
      expect(stepWithIndex.lettersInPattern[previousStep.patternIndex].colour).toEqual("MATCH");
      expect(pattern).toContain(stepWithIndex.lettersInPattern[stepWithIndex.patternIndex].letter);
      expect(text).toContain(stepWithIndex.lettersInText[previousStep.textIndex].letter);
      expect(stepWithIndex.lettersInText[previousStep.textIndex].letter).toEqual(stepWithIndex.lettersInPattern[stepWithIndex.patternIndex].letter);
      expect(stepWithIndex.command).toEqual("Found a character match - move to next character in text");
    });

    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.pseudocodeLine === 11;
    }).forEach((stepWithIndex) => {
      previousStep = bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1];
      expect(stepWithIndex.command).toEqual("Move to next character in pattern");
      expect(stepWithIndex.patternIndex).toEqual(previousStep.patternIndex + 1);
    });
  });

  it("should create mismatch steps" , () => {
    const text = "test text";
    const pattern = "not in";
    let previousStep;

    bruteForceAlgorithm.workOutSteps(text , pattern);


    const stepsWithIndexes = convertStepsToStepsWithIndex(bruteForceAlgorithm.stepsGetter);

    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.pseudocodeLine === 12;
    }).forEach((stepWithIndex) => {
      previousStep = bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1];
      expect(stepWithIndex.command).toEqual("No character match found, enter the else block");
      expect(stepWithIndex.lettersInText[previousStep.textIndex].colour).toEqual("MISMATCH");
      expect(stepWithIndex.lettersInPattern[previousStep.patternIndex].colour).toEqual("MISMATCH");
    });

    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.pseudocodeLine === 13;
    }).forEach((stepWithIndex) => {
      previousStep = bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1];
      expect(stepWithIndex.command).toEqual("Reset pattern index to 0");
      expect(stepWithIndex.lettersInText[previousStep.textIndex].colour).toEqual("MISMATCH");
      expect(stepWithIndex.lettersInPattern[previousStep.patternIndex].colour).toEqual("MISMATCH");
    });


    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.pseudocodeLine === 14;
    }).forEach((stepWithIndex) => {
      previousStep = bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1];
      expect(stepWithIndex.command).toEqual("Increment starting point");
      expect(stepWithIndex.lettersInText[previousStep.textIndex].colour).toEqual("MISMATCH");
      expect(stepWithIndex.lettersInPattern[previousStep.patternIndex].colour).toEqual("MISMATCH");
      expect(stepWithIndex.additional["startingPoint"]).toEqual(previousStep.additional["startingPoint"] + 1);
    });


    stepsWithIndexes.filter((stepWithIndex) => {
      return stepWithIndex.pseudocodeLine === 15;
    }).forEach((stepWithIndex) => {
      previousStep = bruteForceAlgorithm.stepsGetter[stepWithIndex.index - 1];
      expect(stepWithIndex.command).toEqual("Increment starting point of comparison to next element of text");
      expect(stepWithIndex.lettersInText[previousStep.textIndex].colour).toEqual("DEFAULT");
      expect(stepWithIndex.lettersInPattern[previousStep.patternIndex].colour).toEqual("DEFAULT");
      expect(stepWithIndex.patternOffset).toEqual(previousStep.patternOffset + 1);
      expect(stepWithIndex.textIndex).toEqual(previousStep.textIndex + 1);
    });
  });

  it("should create a full match step if a solution exists" , () => {
    const text = "the fox jumped over the lazy dog";
    const pattern = "lazy";

   const result = bruteForceAlgorithm.workOutSteps(text , pattern);

   expect(result === -1).toBeFalse();

   let filteredResults = bruteForceAlgorithm.stepsGetter.filter((step) => {
    return step.pseudocodeLine === 19;
   });

   expect(filteredResults.length).toEqual(1);

   filteredResults = bruteForceAlgorithm.stepsGetter.filter((step) => {
    return step.pseudocodeLine === 20;
   });

   expect(filteredResults.length).toEqual(1);
  });


  it("should create a no match step if a solution does not exist" , () => {
    const text = "test text";
    const pattern = "not in";

    const result = bruteForceAlgorithm.workOutSteps(text , pattern);

    expect(result).toEqual(-1);

    let filteredResults = bruteForceAlgorithm.stepsGetter.filter((step) => {
      return step.pseudocodeLine === 19;
     });

     expect(filteredResults.length).toEqual(1);

     filteredResults = bruteForceAlgorithm.stepsGetter.filter((step) => {
      return step.pseudocodeLine === 22;
     });

     expect(filteredResults.length).toEqual(1);

     filteredResults[0].lettersInText.forEach((letter) => {
      expect(letter.colour).toEqual("MISMATCH");
     });

     filteredResults[0].lettersInPattern.forEach((letter) => {
      expect(letter.colour).toEqual("MISMATCH");
     });

    });

  it("should reset additional variables" , () => {
    const text = "test text";
    const pattern = "not in";

    bruteForceAlgorithm.workOutSteps(text , pattern);

    bruteForceAlgorithm.resetAdditionalVariables();

    expect(bruteForceAlgorithm.additionalVariablesGetter).toBeInstanceOf(BruteForceAdditionalVariables);
    expect(bruteForceAlgorithm.additionalVariablesGetter.textLength).toBeUndefined();
    expect(bruteForceAlgorithm.additionalVariablesGetter.patternLength).toBeUndefined();
    expect(bruteForceAlgorithm.additionalVariablesGetter["startingPoint"]).toBeUndefined();
  });

});