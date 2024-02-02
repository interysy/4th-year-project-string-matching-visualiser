import { AlgorithmStepBuilder } from '../../model-builders/algorithm-step.builder';
import { BoyerMooreAlgorithm } from './boyer-moore.algorithm';
import { LetterBuilder } from '../../model-builders/letter.builder';
import { AlgorithmStep } from '../../models/algorithm-step.model';
import { Letter } from '../../models/letter.model';
import { BoyerMooreAdditionalVariables } from './boyer-moore-additional-variables.model';


describe("BoyerMooreAlgorithm", () => {
  let boyerMooreAlgorithm: BoyerMooreAlgorithm;
  let algorithmStepBuilder : AlgorithmStepBuilder;

  beforeEach(() => {
    boyerMooreAlgorithm = new BoyerMooreAlgorithm();
    algorithmStepBuilder = new AlgorithmStepBuilder();
    algorithmStepBuilder.setDefaults();
  });

  it("should create setup steps" , () => {
    const text = "test text" ;
    const pattern = "text";

    boyerMooreAlgorithm.textAndPatternTesterSetter(text, pattern);
    const testSteps = boyerMooreAlgorithm.setUpStepsTesterGetter;

    expect(testSteps.length).toEqual(6);

  });

  it("first setup steps should have no values for patternLength , textLength or startingPoint", () => {
    const text = "test text";
    const pattern = "text";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const firstStep = boyerMooreAlgorithm.stepsGetter[0];

    expect(firstStep.command).toEqual("");
    expect(firstStep.additional.patternLength).toEqual(-1);
    expect(firstStep.additional.textLength).toEqual(-1);
    expect(firstStep.additional["startingPoint"]).toBeDefined();
    expect(firstStep.additional["startingPoint"]).toEqual(-1);
  });

  it("it should create measuring textLength steps and highlight all of the text letters" , () => {
    const text = "test text";
    const pattern = "text";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const textMeasuringStep = boyerMooreAlgorithm.stepsGetter[1];

    expect(textMeasuringStep.command).toEqual("Measuring the length of the text");
    expect(textMeasuringStep.additional.patternLength).toEqual(-1);
    expect(textMeasuringStep.additional.textLength).toEqual(text.length);
    expect(textMeasuringStep.additional["startingPoint"]).toBeDefined();
    expect(textMeasuringStep.additional["startingPoint"]).toEqual(-1);
    textMeasuringStep.lettersInText.forEach((letter) => {
      expect(letter.colour).toEqual("CHECKING");
    });
  });

  it("it should create measuring patternLength steps and highlight all of the pattern letters" , () => {
    const text = "test text";
    const pattern = "text";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const patternMeasuringStep = boyerMooreAlgorithm.stepsGetter[2];

    expect(patternMeasuringStep.command).toEqual("Measuring the length of the pattern");
    expect(patternMeasuringStep.additional.patternLength).toEqual(pattern.length);
    expect(patternMeasuringStep.additional.textLength).toEqual(text.length);
    expect(patternMeasuringStep.additional["startingPoint"]).toBeDefined();
    expect(patternMeasuringStep.additional["startingPoint"]).toEqual(-1);
    patternMeasuringStep.lettersInPattern.forEach((letter) => {
      expect(letter.colour).toEqual("CHECKING");
    });
  });


  it("it should set startingPoint to 0" , () => {
    const text = "test text";
    const pattern = "text";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const startingPointSetterStep = boyerMooreAlgorithm.stepsGetter[3];

    expect(startingPointSetterStep.command).toEqual("Initialising the starting point to 0");
    expect(startingPointSetterStep.additional.patternLength).toEqual(pattern.length);
    expect(startingPointSetterStep.additional.textLength).toEqual(text.length);
    expect(startingPointSetterStep.additional["startingPoint"]).toBeDefined();
    expect(startingPointSetterStep.additional["startingPoint"]).toEqual(0);
  });

  it("it should set textIndex and patternIndex to length of the pattern" , () => {
    const text = "test text";
    const pattern = "text";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const textIndexSetterStep = boyerMooreAlgorithm.stepsGetter[4];
    const patternIndexSetterStep = boyerMooreAlgorithm.stepsGetter[5];

    expect(textIndexSetterStep.command).toEqual(`Initialising the text index to ${pattern.length - 1}` );
    expect(textIndexSetterStep.additional.patternLength).toEqual(pattern.length);
    expect(textIndexSetterStep.additional.textLength).toEqual(text.length);
    expect(textIndexSetterStep.additional["startingPoint"]).toBeDefined();
    expect(textIndexSetterStep.additional["startingPoint"]).toEqual(0);
    expect(textIndexSetterStep.patternIndex).toEqual(-1);
    expect(textIndexSetterStep.textIndex).toEqual(pattern.length - 1);

    expect(patternIndexSetterStep.command).toEqual(`Initialising the pattern index to ${pattern.length - 1}` );
    expect(patternIndexSetterStep.additional.patternLength).toEqual(pattern.length);
    expect(patternIndexSetterStep.additional.textLength).toEqual(text.length);
    expect(patternIndexSetterStep.additional["startingPoint"]).toBeDefined();
    expect(patternIndexSetterStep.additional["startingPoint"]).toEqual(0);
    expect(patternIndexSetterStep.patternIndex).toEqual(pattern.length - 1);
    expect(patternIndexSetterStep.textIndex).toEqual(pattern.length - 1);
  });

  it("should create a last ocurrence dictionary correctly" , () => {
    const pattern = "bacbabababaacaa";

    const lastOccurrenceDictionary = boyerMooreAlgorithm.setUpLastOcurrenceDictionaryTester(pattern);

    expect(Object.entries(lastOccurrenceDictionary).length).toEqual(3);
    expect(lastOccurrenceDictionary["a"]).toEqual(14);
    expect(lastOccurrenceDictionary["b"]).toEqual(9);
    expect(lastOccurrenceDictionary["c"]).toEqual(12);
  });

  it("should label all last occurrence steps as extra besides the initial one" , () => {
    const pattern = "bacbabababaacaa";
    boyerMooreAlgorithm.setUpLastOcurrenceDictionaryTester(pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    creationSteps.slice(1).forEach((step) => {
      expect(step.extra).toBeTrue();
    });
  });

  it("should report a single step finding each character" , () => {
    const pattern = "bacbabababaacaa";

    boyerMooreAlgorithm.setUpLastOcurrenceDictionaryTester(pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    expect(creationSteps.filter((step) => step.command.startsWith("Last occurrence of a is ")).length).toEqual(1);
    expect(creationSteps.filter((step) => step.command.startsWith("Last occurrence of b is ")).length).toEqual(1);
    expect(creationSteps.filter((step) => step.command.startsWith("Last occurrence of c is ")).length).toEqual(1);

  });

  it("should report that a character already has a last occurrence" , () => {
    const pattern = "bacbabababaacaa";

    boyerMooreAlgorithm.setUpLastOcurrenceDictionaryTester(pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    expect(creationSteps.filter((step) => step.command === "a already exists in the last occurrence table").length).toEqual(7);
    expect(creationSteps.filter((step) => step.command === "b already exists in the last occurrence table").length).toEqual(4);
    expect(creationSteps.filter((step) => step.command === "c already exists in the last occurrence table").length).toEqual(1);
  });

  it("should highlight character in dictionary already within the last occurrence table" , () => {
    const pattern = "bacbabababaacaa";

    boyerMooreAlgorithm.setUpLastOcurrenceDictionaryTester(pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    creationSteps.filter((step) => step.command === "a already exists in the last occurrence table").forEach(step => {
      expect(step.additional["lastOccurrenceToHighlight"]).toBeDefined();
      expect(step.additional["lastOccurrenceToHighlight"]).toEqual("a");
    });

    creationSteps.filter((step) => step.command === "b already exists in the last occurrence table").forEach(step => {
      expect(step.additional["lastOccurrenceToHighlight"]).toBeDefined();
      expect(step.additional["lastOccurrenceToHighlight"]).toEqual("b");
    });

    creationSteps.filter((step) => step.command === "c already exists in the last occurrence table").forEach(step => {
      expect(step.additional["lastOccurrenceToHighlight"]).toBeDefined();
      expect(step.additional["lastOccurrenceToHighlight"]).toEqual("c");
    });
  });


  it("should highlight character in dictionary being identified as last occurrence" , () => {
    const pattern = "bacbabababaacaa";

    boyerMooreAlgorithm.setUpLastOcurrenceDictionaryTester(pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    creationSteps.filter((step) => step.command.startsWith("Last occurrence of a")).forEach(step => {
      expect(step.additional["lastOccurrenceToHighlight"]).toBeDefined();
      expect(step.additional["lastOccurrenceToHighlight"]).toEqual("a");
    });

    creationSteps.filter((step) => step.command.startsWith("Last occurrence of b")).forEach(step => {
      expect(step.additional["lastOccurrenceToHighlight"]).toBeDefined();
      expect(step.additional["lastOccurrenceToHighlight"]).toEqual("b");
    });

    creationSteps.filter((step) => step.command.startsWith("Last occurrence of c")).forEach(step => {
      expect(step.additional["lastOccurrenceToHighlight"]).toBeDefined();
      expect(step.additional["lastOccurrenceToHighlight"]).toEqual("c");
    });
  });


  it("should highlight current letter in pattern being checked or matched" , () => {
    const pattern = "bacbabababaacaa";
    const text = "bacbabababaacaa";

    boyerMooreAlgorithm.workOutSteps(text , pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    creationSteps.filter((step) => {
       return step.command.startsWith("Last occurrence of");
    }).forEach((step) => {
      expect(step.lettersInPattern.filter((letter) => letter.colour == "CHECKING").length).toBeLessThanOrEqual(1);
      expect(step.lettersInPattern.filter((letter) => letter.colour == "MATCH").length).toEqual(1);
    });


    creationSteps.filter((step) => {
      return step.command.startsWith("Checking last occurrence for");
    }).forEach((step) => {
     expect(step.lettersInPattern.filter((letter) => letter.colour === "CHECKING").length).toEqual(1);
    });

    creationSteps.filter((step) => {
      return step.command === "a already exists in the last occurrence table" || step.command === "b already exists in the last occurrence table" || step.command === "c already exists in the last occurrence table";
    }).forEach((step) => {

      expect(step.lettersInPattern.filter((letter) => letter.colour === "CHECKING").length).toBeLessThanOrEqual(1);
      expect(step.lettersInPattern.filter((letter) => letter.colour === "MATCH").length).toEqual(1);
    });

  });

  it("should add while loop steps with the same step properties as the previous step except pattern and text index variables" , () => {
    const text = "bacbabababaacaa";
    const pattern = "bacbababab";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    let stepsWithIndexes = boyerMooreAlgorithm.stepsGetter.map((step: AlgorithmStep,index: number) => {
      const newStep = step as any;
      newStep.index = index;
      return newStep;
    });

    stepsWithIndexes = stepsWithIndexes.filter((step : any) => {
      return step.pseudocodeLine === 10;
    });

    stepsWithIndexes.forEach((stepWithIndex: any) => {
      expect(stepWithIndex.additional["startingPoint"]).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].additional["startingPoint"]);
      expect(stepWithIndex.additional.patternLength).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.patternLength);
      expect(stepWithIndex.additional.textLength).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.textLength);
      expect(stepWithIndex.lettersInPattern).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].lettersInPattern);
      expect(stepWithIndex.lettersInText).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].lettersInText);
      expect(stepWithIndex.patternOffset).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index -1 ].patternOffset);
    });
  });

  it("should create check steps with the same step properties as the previous step except letters" , () => {
    const text = "bacbabababaacaa";
    const pattern = "bacbababab";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    let stepsWithIndexes = boyerMooreAlgorithm.stepsGetter.map((step: AlgorithmStep,index: number) => {
      const newStep = step as any;
      newStep.index = index;
      return newStep;
    });

    stepsWithIndexes = stepsWithIndexes.filter((step : any) => {
      return step.pseudocodeLine === 11;
    });

    stepsWithIndexes.forEach((stepWithIndex: any) => {
      expect(stepWithIndex.additional["startingPoint"]).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].additional["startingPoint"]);
      expect(stepWithIndex.additional.patternLength).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.patternLength);
      expect(stepWithIndex.additional.textLength).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.textLength);
      expect(stepWithIndex.patternOffset).toEqual(boyerMooreAlgorithm.stepsGetter[stepWithIndex.index -1 ].patternOffset);
    });
  });

  it("should highlight letters being checked at textIndex and patternIndex" , () => {
    const text = "bacbabababaacaa";
    const pattern = "bacbababab";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const creationSteps = boyerMooreAlgorithm.stepsGetter;

    const checkSteps = creationSteps.filter((step) => {
      return step.pseudocodeLine === 11;
    });

    checkSteps.forEach(step => {
      expect(step.lettersInText[step.textIndex].colour).toEqual("CHECKING");
      expect(step.lettersInPattern[step.patternIndex].colour).toEqual("CHECKING");
    });
  });


  it("should highlight 2 letters when there is a match" , () => {
    const text = "bacbabababaacaa";
    const pattern = "bacb";
    const stepBuilder = new AlgorithmStepBuilder();

    boyerMooreAlgorithm.textAndPatternTesterSetter(text , pattern);
    boyerMooreAlgorithm.textAndPatternIndexTesterSetter(0, 0);
    const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
    const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

    stepBuilder.setLettersInPattern = highlightedPattern;
    stepBuilder.setLettersInText = highlightedText;
    stepBuilder.setPatternIndex = pattern.length-1;
    stepBuilder.setTextIndex = pattern.length-1;

    boyerMooreAlgorithm.previousStepTesterSetter(stepBuilder.build());

    const matchSteps = boyerMooreAlgorithm.matchStepsTesterGetter;

    expect(matchSteps.length).toEqual(2);

    expect(matchSteps[0].lettersInPattern[pattern.length-1].colour).toEqual("MATCH");
    expect(matchSteps[0].lettersInText[pattern.length-1].colour).toEqual("MATCH");

    expect(matchSteps[1].lettersInPattern[pattern.length-1].colour).toEqual("MATCH");
    expect(matchSteps[1].lettersInText[pattern.length-1].colour).toEqual("MATCH");
  });

  it("should show correct commands and indexes when there is a match" , () => {
    const text = "bacbabababaacaa";
    const pattern = "bacb";
    const stepBuilder = new AlgorithmStepBuilder();

    boyerMooreAlgorithm.textAndPatternTesterSetter(text , pattern);
    boyerMooreAlgorithm.textAndPatternIndexTesterSetter(3, 3);
    const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
    const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

    stepBuilder.setLettersInPattern = highlightedPattern;
    stepBuilder.setLettersInText = highlightedText;
    stepBuilder.setPatternIndex = pattern.length-1;
    stepBuilder.setTextIndex = pattern.length-1;

    boyerMooreAlgorithm.previousStepTesterSetter(stepBuilder.build());

    const matchSteps = boyerMooreAlgorithm.matchStepsTesterGetter;

    expect(matchSteps[0].command).toEqual("Found a character match - move one character left in text");
    expect(matchSteps[1].command).toEqual("Move one character left in pattern");

    expect(matchSteps[0].patternIndex).toEqual(pattern.length - 1);
    expect(matchSteps[0].textIndex).toEqual(pattern.length - 1);
    expect(matchSteps[1].textIndex).toEqual(3);
    expect(matchSteps[1].patternIndex).toEqual(3);
  });

  it("upon mismatch should highlight characters mismatched" , () => {
    const text = "bacbababaacaabaaca";
    const pattern = "ababaca";
    const stepBuilder = new AlgorithmStepBuilder();
    const mismatchCase = 1;


    boyerMooreAlgorithm.textAndPatternTesterSetter(text , pattern);
    boyerMooreAlgorithm.textAndPatternIndexTesterSetter(5, 5);
    const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);

    highlightedPattern[6] = new Letter();
    highlightedPattern[6].colour = "MATCH";
    highlightedPattern[6].letter = "a";
    highlightedPattern[6].index = 6;
    highlightedPattern[6].strokeWeight = 4;

    const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

    highlightedText[6] = new Letter();
    highlightedText[6].colour = "MATCH";
    highlightedText[6].letter = "a";
    highlightedText[6].index = 6;
    highlightedText[6].strokeWeight = 4;

    stepBuilder.setLettersInPattern = highlightedPattern;
    stepBuilder.setLettersInText = highlightedText;
    stepBuilder.setPatternIndex = 5;
    stepBuilder.setTextIndex = 5;

    boyerMooreAlgorithm.previousStepTesterSetter(stepBuilder.build());

    const mismatchSteps = boyerMooreAlgorithm.mismatchStepsTesterGetter(mismatchCase , 3 , 'b');

    expect(mismatchSteps.length).toEqual(4);
    expect(mismatchSteps[0].lettersInPattern[5].colour).toEqual("MISMATCH");
    expect(mismatchSteps[0].lettersInText[5].colour).toEqual("MISMATCH");
  });

  it("upon mismatch should keep matched highlighted when on the else line" , () => {
    const text = "bacbababaacaabaaca";
    const pattern = "ababaca";
    const stepBuilder = new AlgorithmStepBuilder();
    const mismatchCase = 1;


    boyerMooreAlgorithm.textAndPatternTesterSetter(text , pattern);
    boyerMooreAlgorithm.textAndPatternIndexTesterSetter(5, 5);
    const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);

    highlightedPattern[6] = new Letter();
    highlightedPattern[6].colour = "MATCH";
    highlightedPattern[6].letter = "a";
    highlightedPattern[6].index = 6;
    highlightedPattern[6].strokeWeight = 4;

    const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

    highlightedText[6] = new Letter();
    highlightedText[6].colour = "MATCH";
    highlightedText[6].letter = "a";
    highlightedText[6].index = 6;
    highlightedText[6].strokeWeight = 4;

    stepBuilder.setLettersInPattern = highlightedPattern;
    stepBuilder.setLettersInText = highlightedText;
    stepBuilder.setPatternIndex = 5;
    stepBuilder.setTextIndex = 5;

    boyerMooreAlgorithm.previousStepTesterSetter(stepBuilder.build());

    const mismatchSteps = boyerMooreAlgorithm.mismatchStepsTesterGetter(mismatchCase , 3 , 'b');

    expect(mismatchSteps[0].lettersInPattern[6].colour).toEqual("MATCH");
    expect(mismatchSteps[0].lettersInPattern[6].colour).toEqual("MATCH");
  });

  it("upon mismatch should update patternIndex ,textIndex, startingPoint and patternOffset" , () => {
    const text = "bacbababaacaabaaca";
    const pattern = "ababaca";
    const stepBuilder = new AlgorithmStepBuilder();
    const mismatchCase = 1;


    boyerMooreAlgorithm.textAndPatternTesterSetter(text , pattern);
    boyerMooreAlgorithm.textAndPatternIndexTesterSetter(8, pattern.length-1);
    boyerMooreAlgorithm.setupAdditionalVariablesTesterGetter(text.length, pattern.length , 2);
    const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);

    highlightedPattern[6] = new Letter();
    highlightedPattern[6].colour = "MATCH";
    highlightedPattern[6].letter = "a";
    highlightedPattern[6].index = 6;
    highlightedPattern[6].strokeWeight = 4;

    const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

    highlightedText[6] = new Letter();
    highlightedText[6].colour = "MATCH";
    highlightedText[6].letter = "a";
    highlightedText[6].index = 6;
    highlightedText[6].strokeWeight = 4;

    stepBuilder.setLettersInPattern = highlightedPattern;
    stepBuilder.setLettersInText = highlightedText;
    stepBuilder.setPatternIndex = 5;
    stepBuilder.setTextIndex = 5;
    stepBuilder.setPatternOffset = 0;

    const additionalVars = new BoyerMooreAdditionalVariables();
    additionalVars.startingPoint = pattern.length - 1;
    stepBuilder.setAdditional = additionalVars;

    boyerMooreAlgorithm.previousStepTesterSetter(stepBuilder.build());

    const mismatchSteps = boyerMooreAlgorithm.mismatchStepsTesterGetter(mismatchCase , 3 , 'b');

    expect(mismatchSteps[0].patternIndex).toEqual(5);
    expect(mismatchSteps[0].textIndex).toEqual(5);
    expect(mismatchSteps[0].patternOffset).toEqual(0);
    expect(mismatchSteps[0].additional["startingPoint"]).toBeDefined();
    expect(mismatchSteps[0].additional["startingPoint"]).toEqual(pattern.length - 1);

    expect(mismatchSteps[1].patternIndex).toEqual(5);
    expect(mismatchSteps[1].textIndex).toEqual(5);
    expect(mismatchSteps[1].patternOffset).toEqual(0);
    expect(mismatchSteps[1].additional["startingPoint"]).toBeDefined();
    expect(mismatchSteps[1].additional["startingPoint"]).toEqual(2);


    expect(mismatchSteps[2].patternIndex).toEqual(5);
    expect(mismatchSteps[2].textIndex).toEqual(8);
    expect(mismatchSteps[2].patternOffset).toEqual(0);
    expect(mismatchSteps[2].additional["startingPoint"]).toBeDefined();
    expect(mismatchSteps[2].additional["startingPoint"]).toEqual(2);


    expect(mismatchSteps[3].patternIndex).toEqual(pattern.length - 1);
    expect(mismatchSteps[3].textIndex).toEqual(8);
    expect(mismatchSteps[3].patternOffset).toEqual(2);
    expect(mismatchSteps[3].additional["startingPoint"]).toBeDefined();
    expect(mismatchSteps[3].additional["startingPoint"]).toEqual(2);
  });

  it("upon mismatch should not highlight any letters when changing pattern offset" , () => {
    const text = "bacbababaacaabaaca";
    const pattern = "ababaca";
    const stepBuilder = new AlgorithmStepBuilder();
    const mismatchCase = 1;

    boyerMooreAlgorithm.textAndPatternTesterSetter(text , pattern);
    boyerMooreAlgorithm.textAndPatternIndexTesterSetter(8, pattern.length);
    boyerMooreAlgorithm.setupAdditionalVariablesTesterGetter(text.length, pattern.length , 2);
    const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);

    highlightedPattern[6] = new Letter();
    highlightedPattern[6].colour = "MATCH";
    highlightedPattern[6].letter = "a";
    highlightedPattern[6].index = 6;
    highlightedPattern[6].strokeWeight = 4;

    const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

    highlightedText[6] = new Letter();
    highlightedText[6].colour = "MATCH";
    highlightedText[6].letter = "a";
    highlightedText[6].index = 6;
    highlightedText[6].strokeWeight = 4;

    stepBuilder.setLettersInPattern = highlightedPattern;
    stepBuilder.setLettersInText = highlightedText;
    stepBuilder.setPatternIndex = 5;
    stepBuilder.setTextIndex = 5;
    stepBuilder.setPatternOffset = 0;

    const additionalVars = new BoyerMooreAdditionalVariables();
    additionalVars.startingPoint = pattern.length - 1;
    stepBuilder.setAdditional = additionalVars;

    boyerMooreAlgorithm.previousStepTesterSetter(stepBuilder.build());

    const mismatchSteps = boyerMooreAlgorithm.mismatchStepsTesterGetter(mismatchCase , 3 , 'b');

    mismatchSteps[3].lettersInPattern.forEach((letter) => {
      expect(letter.colour === "DEFAULT");
    });

    mismatchSteps[3].lettersInText.forEach((letter) => {
      expect(letter.colour === "DEFAULT");
    });
  });


  it("should report a full match" , () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const pattern = "lazy";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const steps = boyerMooreAlgorithm.matchStepsTesterGetter;


    expect(steps.filter((step) =>
      step.pseudocodeLine === 21
    ).length).toEqual(1);

    expect(steps.filter((step) =>
    step.pseudocodeLine === 22
    ).length).toEqual(1);
  });


  it("should not report a match when there isn't one" , () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const pattern = "quickly";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const steps = boyerMooreAlgorithm.matchStepsTesterGetter;


    expect(steps.filter((step) =>
      step.pseudocodeLine === 21
    ).length).toEqual(1);

    expect(steps.filter((step) =>
    step.pseudocodeLine === 23
    ).length).toEqual(1);
  });



  it("should highlight entire text and pattern red if there is no match" , () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const pattern = "quickly";

    boyerMooreAlgorithm.workOutSteps(text, pattern);

    const steps = boyerMooreAlgorithm.stepsGetter;

    expect(steps[steps.length - 1].command).toEqual("No match !");

    steps[steps.length - 1].lettersInPattern.forEach(letter => {
      expect(letter.colour).toEqual("MISMATCH");
    });

    steps[steps.length - 1].lettersInText.forEach(letter => {
      expect(letter.colour).toEqual("MISMATCH");
    });
  });

  it("should find the word correctly" , () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const pattern = "lazy";

    const result = boyerMooreAlgorithm.workOutSteps(text, pattern);

    expect(result).toEqual(35)
  });


  it("should find the word that isn't in the text" , () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const pattern = "quick;y";

    const result = boyerMooreAlgorithm.workOutSteps(text, pattern);

    expect(result).toEqual(-1);
  });

  it("should not find word with upper case letter that exists in text" , () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const pattern = "Lazy";

    const result = boyerMooreAlgorithm.workOutSteps(text, pattern);

    expect(result).toEqual(-1);
  });
});
