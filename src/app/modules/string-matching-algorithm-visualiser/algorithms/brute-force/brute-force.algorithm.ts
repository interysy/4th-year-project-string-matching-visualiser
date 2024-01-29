import { StringMatchingAlgorithm } from "../algorithm.model";
import { BruteForceAdditionalVariables } from "../../models/brute-force-additional-variables.model";
import { LetterBuilder } from "../../model-builders/letter.builder";

/**
 * @description This class is responsible for executing the brute force algorithma and creating steps for animating it.
 */
export class BruteForceAlgorithm extends StringMatchingAlgorithm {

        /**
         * @description Additional variables required for brute force algorithm to work.
         */
        protected override additionalVariables : BruteForceAdditionalVariables = new BruteForceAdditionalVariables();

        /**
         * @description The name of the algorithm used for the slug in the url.
         */
        protected override algorithmNameSlug = "brute-force";

        /**
         * @description Function that runs the brute force algorithm and creates relevant steps for parsing by the app.
         * @param text The text to search for the pattern in.
         * @param pattern The pattern to look for.
         * @returns The starting point of pattern found or -1.
         */
        public workOutSteps(text : string , pattern : string) : number {
            this.text = text;
            this.pattern = pattern;

            this.additionalVariables.textLength = text.length;
            this.additionalVariables.patternLength = pattern.length;
            this.additionalVariables.startingPoint = 0;
            this.textIndex = 0;
            this.patternIndex = 0;
            this.addSetupSteps();

            while (this.additionalVariables.startingPoint <= this.additionalVariables.textLength - this.additionalVariables.patternLength && this.patternIndex < this.additionalVariables.patternLength) {
                this.addWhileLoopStep();
                this.addCheckStep();
                if (text.charAt(this.textIndex) === pattern.charAt(this.patternIndex)) {
                    this.textIndex++;
                    this.patternIndex++;
                    this.addMatchStep();
                } else {
                    this.patternIndex = 0;
                    this.additionalVariables.startingPoint += 1;
                    this.textIndex = this.additionalVariables.startingPoint;
                    this.addMismatchStep();
                }
            }
            if (this.patternIndex === this.additionalVariables.patternLength) {
                this.addFullMatchStep();
                return this.additionalVariables.startingPoint;
            }
            this.addNoSolutionStep();
            return -1;
        }

        /**
         * @description Adds the setup steps to the steps array
        */
        protected addSetupSteps() : void {

            const setUpSteps = [
                { startingPoint : -1 , patternLength : -1 , textLength : -1 },
                { command : "Measuring the length of the text" , highlightText : true , textLength : this.additionalVariables.textLength},
                { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : this.additionalVariables.patternLength },
                { command : "Initialising the starting point to 0", startingPoint: this.additionalVariables.startingPoint },
                { command : "Initialising the text index to 0" , textIndex : this.textIndex },
                { command : "Initialising the pattern index to 0"  , patternIndex : this.patternIndex } ,
            ];
            let tempAdditional;

            setUpSteps.forEach(({ command , highlightText , highlightPattern , textIndex , patternIndex , startingPoint , textLength , patternLength} , index) => {
                this.algorithmStepBuilder.setPseudocodeLine = index + 1;
                tempAdditional = this.algorithmStepBuilder.createDeepCopy(this.algorithmStepBuilder.build()).additional;

                if (command != undefined) this.algorithmStepBuilder.setCommand = command;

                if (highlightText != undefined && highlightText) {
                    this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "CHECKING" , 1);
                } else {
                    this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "DEFAULT" , 1);
                }

                if (highlightPattern != undefined && highlightPattern) {
                    this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "CHECKING" , 1);
                } else {
                    this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "DEFAULT" , 1);
                }

                if (textIndex != undefined) this.algorithmStepBuilder.setTextIndex = textIndex;
                if (patternIndex != undefined) this.algorithmStepBuilder.setPatternIndex = patternIndex;

                if (startingPoint != undefined) tempAdditional["startingPoint"] = startingPoint;
                if (textLength != undefined) tempAdditional.textLength = textLength;
                if (patternLength != undefined) tempAdditional.patternLength = patternLength;


                this.algorithmStepBuilder.setAdditional = tempAdditional;
                this.addStep(true,false);
            });

            this.algorithmStepBuilder.setDefaults();
        }

        /**
         * @description Adding iteration steps to the steps array
        */
        protected addWhileLoopStep() : void {
            this.algorithmStepBuilder.setPseudocodeLine = 8;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.addStep(true, true);
        }

       /**
        * @description Adding check step to the steps array, highlights current 2 characters being checked
        */
        protected addCheckStep() : void {
            this.algorithmStepBuilder.setCommand = "Checking if the 2 characters match";
            this.algorithmStepBuilder.setPseudocodeLine = 9;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.createLetterUsingBuilderUsingPrev(this.textIndex , this.text.charAt(this.textIndex) , "CHECKING" , 4 , true , "text");
            this.createLetterUsingBuilderUsingPrev(this.patternIndex , this.pattern.charAt(this.patternIndex) , "CHECKING" , 4 , true , "pattern");

            this.addStep(true,true);
        }

        /**
         * @description Adding match step to the steps array, highlights current 2 characters being matched
        */
        protected addMatchStep() {
            this.algorithmStepBuilder.setPseudocodeLine = 10;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "Found a character match - move to next character in text";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;


            this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex , this.pattern.charAt(this.previousStep.patternIndex) , "MATCH" , 4 , true , "pattern");
            this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex , this.text.charAt(this.previousStep.textIndex) , "MATCH" , 4 , true , "text");

            this.addStep(true , false);

            this.algorithmStepBuilder.setPseudocodeLine = 11;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setCommand = "Move to next character in pattern";

            this.addStep(true , true);
        }

        /**
         * @description Adding mismatch step to the steps array, highlights current 2 characters being mismatched.
         */
        protected addMismatchStep() {

            const tempAdditionalVariables = this.previousStep.additional;
            this.algorithmStepBuilder.setPseudocodeLine = 12;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";
            this.algorithmStepBuilder.setAdditional = tempAdditionalVariables;

            this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex, this.pattern.charAt(this.previousStep.patternIndex), "MISMATCH", 4, false,"pattern");
            this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex, this.text.charAt(this.previousStep.textIndex), "MISMATCH", 4, false,"text");

            this.addStep(true, false);

            this.algorithmStepBuilder.setPseudocodeLine = 13;
            this.algorithmStepBuilder.setPatternIndex = 0;
            this.algorithmStepBuilder.setCommand = "Reset pattern index to 0";

            this.addStep(true, false);

            this.algorithmStepBuilder.setPseudocodeLine = 14;
            this.algorithmStepBuilder.setCommand = "Increment starting point";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true, false);

            this.algorithmStepBuilder.setPseudocodeLine = 15;
            this.algorithmStepBuilder.setCommand = "Increment starting point of comparison to next element of text";
            this.algorithmStepBuilder.setPatternOffset = this.textIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "DEFAULT" , 1);
            this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "DEFAULT" , 1);

            this.addStep(true, true);
        }


        /**
         * @description Adding full match step to the steps array, highlights the entire pattern and part of text matched (in this case the previous step would have set this).
        */
        protected addFullMatchStep() {

            this.algorithmStepBuilder.setPseudocodeLine = 19;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true,false)

            this.algorithmStepBuilder.setPseudocodeLine = 20;
            this.algorithmStepBuilder.setCommand = "Report that there has been a match";

            this.addStep(true,true)
        }

        /**
         * @description Adding a step to show no solution was found, highlights text and pattern as mismatch.
        */
        protected addNoSolutionStep() {
            this.algorithmStepBuilder.setPseudocodeLine = 19;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true, false);

            this.algorithmStepBuilder.setPseudocodeLine = 22;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setCommand = "No match !";
            this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "MISMATCH" , 4);
            this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "MISMATCH" , 4);
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true,true);
        }

        /**
         * @description Resets the additional variables to their default values.
         */
        resetAdditionalVariables() {
            this.additionalVariables = new BruteForceAdditionalVariables();
        }
}