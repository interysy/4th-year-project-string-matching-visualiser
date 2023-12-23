import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { BruteForceAdditionalVariables } from "../models/brute-force-additional-variables.model";


export class BruteForceAlgorithm extends StringMatchingAlgorithm {

        private additionalVariables : BruteForceAdditionalVariables = new BruteForceAdditionalVariables();

        public workOutSteps(text : string , pattern : string) : number {
            this.text  = text;
            this.pattern = pattern;
            const textLength = text.length;
            const patternLength = pattern.length;
            let startingPoint = 0;
            let textIndex = 0;
            let patternIndex = 0;
            this.addSetupSteps(textLength , patternLength);

            while (startingPoint <= textLength - patternLength && patternIndex < patternLength) {
                this.addWhileLoopStep(textIndex , patternIndex);
                this.addCheckStep(textIndex , patternIndex);
                if (text.charAt(textIndex) === pattern.charAt(patternIndex)) {
                    textIndex++;
                    patternIndex++;
                    this.addMatchStep(textIndex , patternIndex);
                } else {
                    patternIndex = 0;
                    startingPoint += 1;
                    textIndex = startingPoint;
                    this.addMismatchStep(textIndex , startingPoint);
                }
            }
            if (patternIndex === patternLength) {
               this.addFullMatchStep(textIndex , patternIndex);
                return startingPoint;
            }
            this.addNoSolutionStep(textIndex, patternIndex);
            return -1;
        }

        protected addSetupSteps(textLength : number , patternLength  : number ) {

            const setUpSteps  = [
                { command : "Starting Brute Force ..." , startingPoint: -1},
                { command : "Measuring the length of the text" , highlightText : true , textLength : textLength },
                { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : patternLength },
                { command : "Initialising the starting point to 0", startingPoint: 0 },
                { command : "Initialising the text index to 0" , textIndex : 0},
                { command : "Initialising the pattern index to 0"  ,  textIndex  : 0 , patternIndex : 0  } ,
            ]

            setUpSteps.forEach(({ command , highlightText , highlightPattern , textLength , patternLength , startingPoint, textIndex , patternIndex} , index) => {
                this.algorithmStepBuilder.setPseudocodeLine = index + 1;
                if (command) this.algorithmStepBuilder.setCommand = command;

                if (highlightText) {
                    this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "CHECKING" , 1);
                } else {
                    this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "DEFAULT" , 1);
                }
                if (highlightPattern) {
                    this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "CHECKING" , 1);
                } else {
                    this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "DEFAULT" , 1);
                }

                if (textIndex != undefined) this.algorithmStepBuilder.setTextIndex = textIndex;
                if (patternIndex != undefined) this.algorithmStepBuilder.setPatternIndex = patternIndex;

                if (startingPoint !=  undefined) this.additionalVariables.startingPoint = startingPoint;
                if (textLength) this.additionalVariables.textLength = textLength;
                if (patternLength) this.additionalVariables.patternLength = patternLength;
                this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                const step = this.algorithmStepBuilder.build();
                this.addStep(step);
                this.algorithmStepBuilder.setDefaults();
                this.previousStep = step;
            });

        }

        private addWhileLoopStep(textIndex : number , patternIndex : number) : void {

            this.algorithmStepBuilder.setPseudocodeLine = 8;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            const currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.algorithmStepBuilder.setDefaults();

            this.previousStep = currentStep;
        }

        private addCheckStep(textIndex : number , patternIndex : number) : void {

            this.algorithmStepBuilder.setPseudocodeLine = 9;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.letterBuilder.setIndex = textIndex;
            this.letterBuilder.setLetter = this.text.charAt(textIndex);
            this.letterBuilder.setColor = "CHECKING";
            this.letterBuilder.setStrokeWeight = 4;
            this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.previousStep.lettersInText, this.letterBuilder.build());

            this.letterBuilder.setIndex = patternIndex;
            this.letterBuilder.setLetter = this.pattern.charAt(patternIndex);
            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());

            this.algorithmStepBuilder.setCommand = "Checking if the 2 characters match";

            const step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
            this.algorithmStepBuilder.setDefaults();
            this.letterBuilder.setDefaults();

        }

        private addMatchStep(textIndex : number , patternIndex : number) {

            this.algorithmStepBuilder.setPseudocodeLine = 10;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "Found a character match - move to next character in text";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;


            this.letterBuilder.setIndex = this.previousStep.patternIndex;
            this.letterBuilder.setLetter = this.pattern.charAt(this.previousStep.patternIndex);
            this.letterBuilder.setColor = "MATCH";
            this.letterBuilder.setStrokeWeight = 4;

            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());

            this.letterBuilder.setIndex = this.previousStep.textIndex;
            this.letterBuilder.setLetter = this.text.charAt(this.previousStep.textIndex);
            this.letterBuilder.setColor = "MATCH";
            this.letterBuilder.setStrokeWeight = 4;

            this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.previousStep.lettersInText, this.letterBuilder.build());

            let step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setPseudocodeLine = 11;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setCommand = "Move to next character in pattern";

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
            this.algorithmStepBuilder.setDefaults();
            this.letterBuilder.setDefaults();
            this.previousStep = step;
        }

        private addMismatchStep(textIndex : number , startingPoint : number) {

            this.algorithmStepBuilder.setPseudocodeLine = 12;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.letterBuilder.setIndex = this.previousStep.patternIndex;
            this.letterBuilder.setLetter = this.pattern.charAt(this.previousStep.patternIndex);
            this.letterBuilder.setColor = "MISMATCH";
            this.letterBuilder.setStrokeWeight = 4;

            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.highlightEntireLine(this.pattern,"DEFAULT", 1), this.letterBuilder.build());

            this.letterBuilder.setIndex = this.previousStep.textIndex;
            this.letterBuilder.setLetter = this.text.charAt(this.previousStep.textIndex);

            this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.highlightEntireLine(this.text,"DEFAULT", 1), this.letterBuilder.build());

            let step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setPseudocodeLine = 13;
            this.algorithmStepBuilder.setPatternIndex = 0;
            this.algorithmStepBuilder.setCommand = "Reset pattern index to 0";
            this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "DEFAULT" , 1);
            this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "DEFAULT" , 1);

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setPseudocodeLine = 14;
            this.algorithmStepBuilder.setCommand = "Increment starting point";
            this.additionalVariables.startingPoint = startingPoint;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setPseudocodeLine = 15;
            this.algorithmStepBuilder.setCommand = "Increment starting point of comparison to next element of text";
            this.algorithmStepBuilder.setPatternOffset = textIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
        }


        private addFullMatchStep(textIndex : number , patternIndex : number) {
            this.algorithmStepBuilder.setPseudocodeLine = 19;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInPattern = [...this.previousStep.lettersInPattern];
            this.algorithmStepBuilder.setLettersInText = [...this.previousStep.lettersInText];
            this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            let step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;


            this.algorithmStepBuilder.setPseudocodeLine = 20;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setCommand = "Report that there has been a match";

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setDefaults();
        }

        private addNoSolutionStep(textIndex : number , patternIndex : number) {
            this.algorithmStepBuilder.setPseudocodeLine = 19;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInPattern = [...this.previousStep.lettersInPattern];
            this.algorithmStepBuilder.setLettersInText = [...this.previousStep.lettersInText];
            this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            let step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setPseudocodeLine = 22;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setCommand = "No match !";
            this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "MISMATCH" , 4);
            this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "MISMATCH" , 4);
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
            this.algorithmStepBuilder.setDefaults();
        }

        resetAdditionalVariables() {
            this.additionalVariables = new BruteForceAdditionalVariables();
        }



}