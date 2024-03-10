import { AlgorithmStepBuilder } from "../../model-builders/algorithm-step.builder";
import { LetterBuilder } from "../../model-builders/letter.builder";
import { AlgorithmStep } from "../../models/algorithm-step.model";
import { KnuthMorrisPrattAlgorithm } from "./knuth-morris-pratt.algorithm";

describe("KnuthMorrisPrattAlgorith", () => {
    let knuthMorrisPrattAlgorithm: KnuthMorrisPrattAlgorithm;
    let algorithmStepBuilder : AlgorithmStepBuilder;

    beforeEach(() => {
      knuthMorrisPrattAlgorithm = new KnuthMorrisPrattAlgorithm();
      algorithmStepBuilder = new AlgorithmStepBuilder();
      algorithmStepBuilder.setDefaults();
    });

    it("should create setup steps" , () => {
        const text = "test text" ;
        const pattern = "text";

        knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text, pattern);
        const testSteps = knuthMorrisPrattAlgorithm.setUpStepsTesterGetter;

        expect(testSteps.length).toEqual(5);
    });

    it("it should create measuring textLength steps and highlight all of the text letters" , () => {
        const text = "test text";
        const pattern = "text";

        knuthMorrisPrattAlgorithm.workOutSteps(text, pattern);

        const textMeasuringStep = knuthMorrisPrattAlgorithm.stepsGetter[1];

        expect(textMeasuringStep.command).toEqual("Measuring the length of the text");
        expect(textMeasuringStep.additional.patternLength).toEqual(-1);
        expect(textMeasuringStep.additional.textLength).toEqual(text.length);
        textMeasuringStep.lettersInText.forEach((letter) => {
          expect(letter.colour).toEqual("CHECKING");
        });
      });

      it("it should create measuring patternLength steps and highlight all of the pattern letters" , () => {
        const text = "test text";
        const pattern = "text";

        knuthMorrisPrattAlgorithm.workOutSteps(text, pattern);

        const patternMeasuringStep = knuthMorrisPrattAlgorithm.stepsGetter[2];

        expect(patternMeasuringStep.command).toEqual("Measuring the length of the pattern");
        expect(patternMeasuringStep.additional.patternLength).toEqual(pattern.length);
        expect(patternMeasuringStep.additional.textLength).toEqual(text.length);
        patternMeasuringStep.lettersInPattern.forEach((letter) => {
          expect(letter.colour).toEqual("CHECKING");
        });
      });

      it("it should set textIndex and patternIndex to length of the pattern" , () => {
        const text = "test text";
        const pattern = "text";

        knuthMorrisPrattAlgorithm.workOutSteps(text, pattern);

        const textIndexSetterStep = knuthMorrisPrattAlgorithm.stepsGetter[3];
        const patternIndexSetterStep = knuthMorrisPrattAlgorithm.stepsGetter[4];

        expect(textIndexSetterStep.command).toEqual(`Initialising the text index to 0` );
        expect(textIndexSetterStep.additional.patternLength).toEqual(pattern.length);
        expect(textIndexSetterStep.additional.textLength).toEqual(text.length);
        expect(textIndexSetterStep.textIndex).toEqual(0);
        expect(textIndexSetterStep.patternIndex).toEqual(-1);


        expect(patternIndexSetterStep.command).toEqual(`Initialising the pattern index to 0` );
        expect(patternIndexSetterStep.additional.patternLength).toEqual(pattern.length);
        expect(patternIndexSetterStep.additional.textLength).toEqual(text.length);
        expect(patternIndexSetterStep.textIndex).toEqual(0);
        expect(patternIndexSetterStep.patternIndex).toEqual(0);
      });


      it("should add while loop steps with the same step properties as the previous step" , () => {
        const text = "bacbabababaacaa";
        const pattern = "bacbababab";

        knuthMorrisPrattAlgorithm.workOutSteps(text, pattern);

        let stepsWithIndexes = knuthMorrisPrattAlgorithm.stepsGetter.map((step: AlgorithmStep,index: number) => {
          const newStep = step as any;
          newStep.index = index;
          return newStep;
        });

        stepsWithIndexes = stepsWithIndexes.filter((step : any) => {
          return step.pseudocodeLine === 9 && step.command === "Looping through the pattern and text looking for a match";
        });

        stepsWithIndexes.forEach((stepWithIndex: any) => {
          expect(stepWithIndex.additional.patternLength).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.patternLength);
          expect(stepWithIndex.additional.textLength).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.textLength);
          expect(stepWithIndex.patternOffset).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index -1 ].patternOffset);
        });
      });


      it("should create check steps with the same step properties as the previous step except letters" , () => {
        const text = "bacbabababaacaa";
        const pattern = "bacbababab";

        knuthMorrisPrattAlgorithm.workOutSteps(text, pattern);

        let stepsWithIndexes = knuthMorrisPrattAlgorithm.stepsGetter.map((step: AlgorithmStep,index: number) => {
          const newStep = step as any;
          newStep.index = index;
          return newStep;
        });

        stepsWithIndexes = stepsWithIndexes.filter((step : any) => {
          return step.pseudocodeLine === 10;
        });

        stepsWithIndexes.forEach((stepWithIndex: any) => {
          expect(stepWithIndex.additional.patternLength).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.patternLength);
          expect(stepWithIndex.additional.textLength).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index - 1].additional.textLength);
          expect(stepWithIndex.patternOffset).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index -1 ].patternOffset);
          expect(stepWithIndex.patternIndex).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index -1 ].patternIndex);
          expect(stepWithIndex.textIndex).toEqual(knuthMorrisPrattAlgorithm.stepsGetter[stepWithIndex.index -1 ].textIndex);
        });
      });


      it("should create correct border table" , () => {
        const pattern = "ababaca";

        knuthMorrisPrattAlgorithm.setupAdditionalVariablesTesterGetter(0 , pattern.length);
        knuthMorrisPrattAlgorithm.previousStepTesterSetter(algorithmStepBuilder.build());

        const borderTable = knuthMorrisPrattAlgorithm.borderTableTesterGetter(pattern);

        expect(borderTable.length).toEqual(pattern.length + 1);
        expect(borderTable[0]).toEqual(0);
        expect(borderTable[1]).toEqual(0);
        expect(borderTable[2]).toEqual(0);
        expect(borderTable[3]).toEqual(1);
        expect(borderTable[4]).toEqual(2);
        expect(borderTable[5]).toEqual(3);
        expect(borderTable[6]).toEqual(0);
      });

      it("should create initial, static border creation steps" , () => {
        const pattern = "ababaca";

        knuthMorrisPrattAlgorithm.setupAdditionalVariablesTesterGetter(0 , pattern.length);
        knuthMorrisPrattAlgorithm.previousStepTesterSetter(algorithmStepBuilder.build());

        const borderTable = knuthMorrisPrattAlgorithm.borderTableTesterGetter(pattern);
        let borderTableCreationSteps = knuthMorrisPrattAlgorithm.stepsGetter;

        borderTableCreationSteps = borderTableCreationSteps.slice(0,6);

        expect(borderTableCreationSteps[0].command).toEqual(`Creating a border table of length ${pattern.length}`);
        expect(borderTableCreationSteps[0].additional["borderTable"]).toBeDefined();
        expect(borderTableCreationSteps[0].additional["borderTable"].filter((borderElement: number | null ) => borderElement === null).length).toEqual(pattern.length + 1);
      });


      it("should highlight 2 letters when there is a match" , () => {
        const text = "bacbabababaacaa";
        const pattern = "bacb";
        const stepBuilder = new AlgorithmStepBuilder();

        knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text , pattern);
        knuthMorrisPrattAlgorithm.textAndPatternIndexTesterSetter(1, 1);
        const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
        const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

        stepBuilder.setLettersInPattern = highlightedPattern;
        stepBuilder.setLettersInText = highlightedText;
        stepBuilder.setPatternIndex = 0;
        stepBuilder.setTextIndex = 0;

        knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

        const matchSteps = knuthMorrisPrattAlgorithm.matchStepsTesterGetter(true);

        expect(matchSteps.length).toEqual(4);

        expect(matchSteps[0].textIndex).toEqual(1);

        expect(matchSteps[0].lettersInPattern[0].colour).toEqual("MATCH");
        expect(matchSteps[0].lettersInText[0].colour).toEqual("MATCH");

        expect(matchSteps[1].lettersInPattern[0].colour).toEqual("MATCH");
        expect(matchSteps[1].lettersInText[0].colour).toEqual("MATCH");
      });

      it("it should highlight upon mismatch" , () => {
        const text = "bacbabababaacaa";
        const pattern = "bacb";
        const stepBuilder = new AlgorithmStepBuilder();

        knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text , pattern);
        knuthMorrisPrattAlgorithm.textAndPatternIndexTesterSetter(1, 1);
        const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
        const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

        stepBuilder.setLettersInPattern = highlightedPattern;
        stepBuilder.setLettersInText = highlightedText;
        stepBuilder.setPatternIndex = 0;
        stepBuilder.setTextIndex = 0;

        knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

        const matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(1 , 0);

        expect(matchSteps[0].lettersInPattern[0].colour).toEqual("MISMATCH");
        expect(matchSteps[1].lettersInText[0].colour).toEqual("MISMATCH");
      });

      it("it should not highlight after moving pattern offset" , () => {
        const text = "bacbabababaacaa";
        const pattern = "bacb";
        const stepBuilder = new AlgorithmStepBuilder();

        knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text , pattern);
        knuthMorrisPrattAlgorithm.textAndPatternIndexTesterSetter(1, 1);
        const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
        const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

        stepBuilder.setLettersInPattern = highlightedPattern;
        stepBuilder.setLettersInText = highlightedText;
        stepBuilder.setPatternIndex = 0;
        stepBuilder.setTextIndex = 0;

        knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

        let matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(1 , 0);

        matchSteps.filter((step) => {
          return step.pseudocodeLine == 19;
        }).forEach((step) => {
          step.lettersInPattern.forEach((letter) => {
            expect(letter.colour).toEqual("DEFAULT");
          });

          step.lettersInText.forEach((letter) => {
            expect(letter.colour).toEqual("DEFAULT");
          });
        });

        matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(2 , 0);

        matchSteps.filter((step) => {
          return step.pseudocodeLine == 19;
        }).forEach((step) => {
          step.lettersInPattern.forEach((letter) => {
            expect(letter.colour).toEqual("DEFAULT");
          });

          step.lettersInText.forEach((letter) => {
            expect(letter.colour).toEqual("DEFAULT");
          });
        });

        matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(3 , 0);

        matchSteps.filter((step) => {
          return step.pseudocodeLine == 19;
        }).forEach((step) => {
          step.lettersInPattern.forEach((letter) => {
            expect(letter.colour).toEqual("DEFAULT");
          });

          step.lettersInText.forEach((letter) => {
            expect(letter.colour).toEqual("DEFAULT");
          });
        });

      });

    it("should highlight border in the first mismatch case" , () => {
      const text = "ababadaababada";
      const pattern = "ababaca";
      const stepBuilder = new AlgorithmStepBuilder();

      knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text , pattern);
      knuthMorrisPrattAlgorithm.textAndPatternIndexTesterSetter(5, 3);
      const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
      const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

      stepBuilder.setLettersInPattern = highlightedPattern;
      stepBuilder.setLettersInText = highlightedText;
      stepBuilder.setPatternIndex = 5;
      stepBuilder.setTextIndex = 5;

      knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

      knuthMorrisPrattAlgorithm.setupAdditionalVariablesTesterGetter(text.length , pattern.length , []);
      const borderTable = knuthMorrisPrattAlgorithm.borderTableTesterGetter(pattern);
      knuthMorrisPrattAlgorithm.resetSteps();
      knuthMorrisPrattAlgorithm.setupAdditionalVariablesTesterGetter(text.length , pattern.length , borderTable);
      knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

      const matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(1 , 3);

      expect(matchSteps.length).toEqual(4);

      expect(matchSteps[2].lettersInPattern[0].colour).toEqual("MATCH");
      expect(matchSteps[2].lettersInPattern[1].colour).toEqual("MATCH");
      expect(matchSteps[2].lettersInPattern[2].colour).toEqual("MATCH");

      expect(matchSteps[2].lettersInText[2].colour).toEqual("MATCH");
      expect(matchSteps[2].lettersInText[3].colour).toEqual("MATCH");
      expect(matchSteps[2].lettersInText[4].colour).toEqual("MATCH");

      expect(matchSteps[2].patternOffset).toEqual(0);

      expect(matchSteps[1].additional["borderTableIndexToHighlight"]).toBeDefined();
      expect(matchSteps[1].additional["borderTableIndexToHighlight"]).toEqual(5);

      expect(matchSteps[3].lettersInPattern[0].colour).toEqual("MATCH");
      expect(matchSteps[3].lettersInPattern[1].colour).toEqual("MATCH");
      expect(matchSteps[3].lettersInPattern[2].colour).toEqual("MATCH");

      expect(matchSteps[3].lettersInText[2].colour).toEqual("MATCH");
      expect(matchSteps[3].lettersInText[3].colour).toEqual("MATCH");
      expect(matchSteps[3].lettersInText[4].colour).toEqual("MATCH");

      expect(matchSteps[3].patternOffset).toEqual(2);
    });

    it("should not highlight on case 2" , () => {
      const text = "bacbababaacaabaaca";
      const pattern = "ababaca";
      const stepBuilder = new AlgorithmStepBuilder();

      knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text , pattern);
      knuthMorrisPrattAlgorithm.textAndPatternIndexTesterSetter(1, 0);
      const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
      const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

      stepBuilder.setLettersInPattern = highlightedPattern;
      stepBuilder.setLettersInText = highlightedText;
      stepBuilder.setPatternIndex = 0;
      stepBuilder.setTextIndex = 0;

      knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

      const matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(2 , 0);

      expect(matchSteps.length).toEqual(5);

      matchSteps[4].lettersInPattern.forEach((letter) => {
        expect(letter.colour).toEqual("DEFAULT");
      });

      matchSteps[4].lettersInText.forEach((letter) => {
        expect(letter.colour).toEqual("DEFAULT");
      });
    });


    it("should not highlight on case 3" , () => {
      const text = "bacbababaacaabaaca";
      const pattern = "bbabaca";
      const stepBuilder = new AlgorithmStepBuilder();

      knuthMorrisPrattAlgorithm.textAndPatternTesterSetter(text , pattern);
      knuthMorrisPrattAlgorithm.textAndPatternIndexTesterSetter(1, 0);
      const highlightedPattern = LetterBuilder.highlightEntireLine(pattern , "DEFAULT" , 1);
      const highlightedText = LetterBuilder.highlightEntireLine(text , "DEFAULT" , 1);

      stepBuilder.setLettersInPattern = highlightedPattern;
      stepBuilder.setLettersInText = highlightedText;
      stepBuilder.setPatternIndex = 1;
      stepBuilder.setTextIndex = 1;

      knuthMorrisPrattAlgorithm.previousStepTesterSetter(stepBuilder.build());

      const matchSteps = knuthMorrisPrattAlgorithm.mismatchStepsTesterGetter(2 , 0);

      expect(matchSteps.length).toEqual(5);

      matchSteps[4].lettersInPattern.forEach((letter) => {
        expect(letter.colour).toEqual("DEFAULT");
      });

      matchSteps[4].lettersInText.forEach((letter) => {
        expect(letter.colour).toEqual("DEFAULT");
      });
    });

    it("should highlight all of the text and pattern upon not finding a solution and reset pattern offset" , () => {
      const text = "the dog jumped over the lazy fox";
      const pattern = "foxy";

      knuthMorrisPrattAlgorithm.workOutSteps(text , pattern);
      const steps = knuthMorrisPrattAlgorithm.stepsGetter;

      steps[steps.length - 1].lettersInPattern.forEach((letter) => {
        expect(letter.colour).toEqual("MISMATCH");
      });

      steps[steps.length - 1].lettersInText.forEach((letter) => {
        expect(letter.colour).toEqual("MISMATCH");
      });

      expect(steps[steps.length - 1].patternOffset).toEqual(0);
    });

    it("should highlight all of the text and pattern upon not finding a solution and reset pattern offset" , () => {
      const text = "the dog jumped over the lazy fox";
      const pattern = "foxy";

      knuthMorrisPrattAlgorithm.workOutSteps(text , pattern);
      const steps = knuthMorrisPrattAlgorithm.stepsGetter;

      steps[steps.length - 1].lettersInPattern.forEach((letter) => {
        expect(letter.colour).toEqual("MISMATCH");
      });

      steps[steps.length - 1].lettersInText.forEach((letter) => {
        expect(letter.colour).toEqual("MISMATCH");
      });

      expect(steps[steps.length - 1].patternOffset).toEqual(0);
    });

    it("should highlight relevant part of text and pattern upon finding a solution" , () => {
      const text = "the dog jumped over the lazy fox";
      const pattern = "lazy";

      knuthMorrisPrattAlgorithm.workOutSteps(text , pattern);
      const steps = knuthMorrisPrattAlgorithm.stepsGetter;

      steps[steps.length - 1].lettersInText.forEach((letter , index) => {
        if (index >= 24 && index <= 27) expect(letter.colour).toEqual("MATCH"); else expect(letter.colour).toEqual("DEFAULT");

      });

      steps[steps.length - 1].lettersInPattern.slice().forEach((letter) => {
        expect(letter.colour).toEqual("MATCH");
      });

      expect(steps[steps.length - 1].patternOffset).toEqual(24);
    });

});