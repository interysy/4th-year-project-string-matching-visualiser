import { StringMatchingAlgorithm } from "../algorithm.model";
import { KnuthMorrisPrattAdditionalVariables } from "./knuth-morris-pratt-additional.model.";
import { Letter } from "../../models/letter.model";
import { LetterBuilder } from "../../model-builders/letter.builder";
import { environment } from "src/environments/environment.dev";
import { AlgorithmStep } from "../../models/algorithm-step.model";


/**
 * @description Class responsible for executing the Knuth-Morris-Pratt algorithm and creating steps for the app to parse.
 */
export class KnuthMorrisPrattAlgorithm extends StringMatchingAlgorithm {

        /**
         * @description The name of the algorithm as a slug.
         */
        override algorithmNameSlug = "knuth-morris-pratt";

        /**
         * @description Additional variables required by Knuth-Morris-Pratt to work.
         */
        override additionalVariables = new KnuthMorrisPrattAdditionalVariables();

        /**
         * @description Function executing the Knuth-Morris-Pratt algorithm and creating steps.
         */
        public workOutSteps(text : string , pattern : string) : number {
            if (this.tooLongPatternOrText(text , pattern)) return -1;

           this.text = text;
           this.pattern = pattern;
           this.additionalVariables.textLength = text.length;
           this.additionalVariables.patternLength = pattern.length;
           this.patternIndex = 0;
           this.textIndex = 0;
           this.addSetupSteps();

           const borderTable = this.createBorderTable(pattern);


           while (this.textIndex < this.additionalVariables.textLength) {
                this.addWhileLoopStep();
                this.addCheckStep();
                if (text.charAt(this.textIndex) == pattern.charAt(this.patternIndex)) {
                    this.textIndex++;
                    this.patternIndex++;
                    if (this.patternIndex === this.additionalVariables.patternLength) {
                        this.addMatchStep(true);
                        return this.textIndex - this.patternIndex;
                    } else {
                        this.addMatchStep(false);
                    }
                } else {
                    if (borderTable[this.patternIndex] > 0) {
                        const temp = this.patternIndex;
                        this.patternIndex = borderTable[this.patternIndex];
                        this.addMismatchStep(1 , temp);
                    } else {
                        if (this.patternIndex == 0) {
                            this.textIndex++;
                            this.addMismatchStep(2 , null);
                        } else {
                            this.patternIndex = 0;
                            this.addMismatchStep(3, null);
                        }
                    }
                }
           }
           this.addNoSolutionStep();
           return -1;
        }

        /**
         * @description KMP does not require the full match step in this implementation, but stil needs to override.
         */
        protected override addFullMatchStep(): void {
            throw new Error("Method not implemented.");
        }

        /**
         * @description Function creating the border table for the Knuth-Morris-Pratt algorithm, it is the O(n) version.
         * @param pattern The pattern to create the border table for.
         * @returns The border table for the pattern.
        */
        private createBorderTable(pattern : string) : number[] {
            const borderTable = new Array<number>(this.additionalVariables.patternLength + 1);
            const beforeBorderTableStep = this.algorithmStepBuilder.createDeepCopy(this.previousStep);
            let i = 0 , j = 2, difference , updatedLetterArray;

            this.algorithmStepBuilder.setPseudocodeLine = 7;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setCommand = `Creating a border table of length ${pattern.length}`;
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(false , false);
            this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


            borderTable[0] = 0;

            this.algorithmStepBuilder.setPseudocodeLine = 3;
            this.algorithmStepBuilder.setCommand = 'The first element of the border table is the border of the empty string "", this is 0';
            this.algorithmStepBuilder.setExtra = true;
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.algorithmStepBuilder.setPseudocodeFilename = "border-table";

            this.addStep(false, false);
            this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);

            borderTable[1] = 0;

            this.algorithmStepBuilder.setPseudocodeLine = 4;
            this.algorithmStepBuilder.setCommand = `The second element of the border table is the border of the first character "${pattern.charAt(0)}", this is 0` ;
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.createLetterUsingBuilderUsingPrev(0 , pattern.charAt(0) , "BORDER_CHECK" , 1 , true , "pattern");

            this.addStep(false , false);
            this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


            this.algorithmStepBuilder.setPseudocodeLine = 5;
            this.algorithmStepBuilder.setCommand = "Initialising i to 0";
            this.additionalVariables.i = i;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;

            this.addStep(false, false);
            this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);

            this.algorithmStepBuilder.setPseudocodeLine = 6;
            this.algorithmStepBuilder.setCommand = "Initialising j to 2";
            this.additionalVariables.j = j;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(false , false);
            this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


            for (j ; j < this.additionalVariables.patternLength; j++) {
                i = borderTable[j - 1];

                this.algorithmStepBuilder.setPseudocodeLine = 8;
                this.algorithmStepBuilder.setCommand = `Looping through the pattern, now considering the substring "${pattern.substring(0,j)}"`;

                this.addStep(false, false);
                this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


                this.algorithmStepBuilder.setPseudocodeLine = 9;
                this.algorithmStepBuilder.setCommand = `Grabbing previous border value for "${pattern.substring(0, j-1)}" , which was ${borderTable[j-1]}`;
                this.addStep(false, false);
                this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


                this.algorithmStepBuilder.setPseudocodeLine = 9;
                this.additionalVariables.i = i;
                this.additionalVariables.j = j;
                this.additionalVariables.borderOne = [0  , i];
                difference = this.additionalVariables.borderOne[1] - this.additionalVariables.borderOne[0];
                this.additionalVariables.borderTwo = [j - 1 - difference , j - 1];


                updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "BORDER_CHECK" , 1 , false , this.previousStep.lettersInPattern);
                updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "BORDER_CHECK" , 1 , true, updatedLetterArray);


                this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;
                this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                this.algorithmStepBuilder.setCommand = `We will check whether substring "${pattern.substring(0,j)}" has a border by checking if the last character "${pattern.charAt(i)}" of last substring "${pattern.substring(0,i+1)}" is equal to character which is now at the end of the substring "${pattern.substring(0,j)}"`;

                this.addStep(false , false);
                this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);

                if (pattern[i] != pattern[j-1]) {
                    this.algorithmStepBuilder.setCommand = `"${pattern.charAt(i)}" != "${pattern.charAt(j-1)}"`;

                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "MISMATCH" , 1 , false , this.previousStep.lettersInPattern);
                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "MISMATCH" , 1 , true , updatedLetterArray);

                    this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;
                    this.addStep(false , false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);
                }

                while (pattern[i] != pattern[j - 1] && i > 0) {
                    this.algorithmStepBuilder.setPseudocodeLine = 10;

                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "MISMATCH" , 1 , false , this.previousStep.lettersInPattern);
                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "MISMATCH" , 1 , true , updatedLetterArray);

                    this.algorithmStepBuilder.setCommand = `The added character in the substring:  ${pattern.charAt(j-1)} is not equal to the character at the border ${pattern.charAt(i)}`;
                    this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;
                    this.addStep(false , false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);

                    i = borderTable[i];

                    this.algorithmStepBuilder.setPseudocodeLine = 11;
                    this.algorithmStepBuilder.setCommand = `Reducing i to ${i}`;
                    this.additionalVariables.i = i;
                    this.additionalVariables.j = j;
                    this.additionalVariables.borderOne = [0  , i];
                    const difference = this.additionalVariables.borderOne[1] - this.additionalVariables.borderOne[0];
                    this.additionalVariables.borderTwo = [j - 1 - difference , j - 1];


                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "BORDER_CHECK" , 1 , false , this.previousStep.lettersInPattern);
                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "BORDER_CHECK" , 1 , true , updatedLetterArray);

                    this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;
                    this.addStep(false,false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


                    this.algorithmStepBuilder.setPseudocodeLine = 10;
                    this.algorithmStepBuilder.setCommand = `Checking if there is a smaller border for the substring "${pattern.substring(0,j)}, by comparing the last character "${pattern.charAt(i)}" of the substring "${pattern.substring(0,i+1)}" to the character at the end of the substring "${pattern.substring(0,j)}"`;

                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "BORDER_CHECK" , 1 , false , this.previousStep.lettersInPattern);
                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "BORDER_CHECK" , 1 , true , updatedLetterArray);


                    this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;
                    this.addStep(false,false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);

                }

                if (pattern[i] != pattern[j-1] && i==0) {
                    borderTable[j] = 0;
                    this.algorithmStepBuilder.setPseudocodeLine = 15;
                    this.algorithmStepBuilder.setCommand = `Since the characters don't match and there is no characters left to compare then there must be no border`;


                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "MISMATCH" , 1 , false , this.previousStep.lettersInPattern);
                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "MISMATCH" , 1 , true , updatedLetterArray);


                    this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;


                    this.additionalVariables.borderTable = borderTable;
                    this.algorithmStepBuilder.setAdditional = this.additionalVariables;

                    this.addStep(false, false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);

                } else {
                    borderTable[j] = i + 1;

                    this.algorithmStepBuilder.setCommand = `"${pattern.charAt(i)}" === "${pattern.charAt(j-1)}"`;
                    this.algorithmStepBuilder.setPseudocodeLine = 16;

                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(i , pattern.charAt(i) , "MATCH" , 1 , false , this.previousStep.lettersInPattern);
                    updatedLetterArray = this.createLetterUsingBuilderUsingArray(j-1 , pattern.charAt(j-1) , "MATCH" , 1 , true , updatedLetterArray);


                    this.algorithmStepBuilder.setLettersInPattern = updatedLetterArray;


                    this.addStep(false,false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);


                    this.algorithmStepBuilder.setPseudocodeLine = 17;
                    this.algorithmStepBuilder.setCommand = `Since the characters at the start and end match, the border must be 1 more than previous border, hence "borderTable[j] = i + 1 = ${i} + 1 = ${borderTable[j]}"`;
                    this.additionalVariables.borderTable = borderTable;
                    this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                    this.addStep(false,false);
                    this.previousStep = this.algorithmStepBuilder.createDeepCopy(beforeBorderTableStep);
                }
            }

            this.algorithmStepBuilder.setPseudocodeLine = 20;
            this.algorithmStepBuilder.setCommand = "Return finished border table";
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.addStep(false,true);

            this.resetAdditionalBorderTableVariables();
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            return borderTable;
        }

        /**
         * @description Function resetting border table related variables.

        */
        private resetAdditionalBorderTableVariables() : void {
            const textTempLength = this.additionalVariables.textLength;
            const patternTempLength = this.additionalVariables.patternLength;
            this.additionalVariables = new KnuthMorrisPrattAdditionalVariables();
            this.additionalVariables.textLength = textTempLength;
            this.additionalVariables.patternLength = patternTempLength;

        }

        /**
         * @description Adds the setup steps to the steps array
        */
        protected override addSetupSteps(): void {
            let tempAdditional;

            const setUpSteps  = [
                { textLength : -1 , patternLength : -1 },
                { command : "Measuring the length of the text" , highlightText : true , textLength : this.additionalVariables.textLength },
                { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : this.additionalVariables.patternLength },
                { command : "Initialising the text index to 0" , textIndex : 0},
                { command : "Initialising the pattern index to 0"  , patternIndex : 0  } ,
            ]

            setUpSteps.forEach(({ command , highlightText , highlightPattern , textLength , patternLength, textIndex , patternIndex} , index) => {
                this.algorithmStepBuilder.setPseudocodeLine = index + 1;

                if (this.previousStep) tempAdditional = this.algorithmStepBuilder.createDeepCopy(this.previousStep).additional; else tempAdditional = new KnuthMorrisPrattAdditionalVariables();

                if (command) this.algorithmStepBuilder.setCommand = command;

                if (highlightText) {
                    this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "CHECKING", 1);
                } else {
                    this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "DEFAULT", 1);
                }
                if (highlightPattern) {
                    this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "CHECKING", 1);
                } else {
                    this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "DEFAULT", 1);
                }

                if (textIndex != undefined) this.algorithmStepBuilder.setTextIndex = textIndex;
                if (patternIndex != undefined) this.algorithmStepBuilder.setPatternIndex = patternIndex;
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
        protected override addWhileLoopStep() : void {
            this.algorithmStepBuilder.setPseudocodeLine = 9;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.addStep(true,true);
        }

        /**
        * @description Adding check step to the steps array, highlights current 2 characters being checked
        */
        protected override addCheckStep() : void {
            this.algorithmStepBuilder.setPseudocodeLine = 10;
            this.algorithmStepBuilder.setCommand = "Checking if the 2 characters match";
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;


            this.createLetterUsingBuilderUsingPrev(this.textIndex,this.text.charAt(this.textIndex), "CHECKING", 4 ,false, "text");
            this.createLetterUsingBuilderUsingPrev(this.patternIndex , this.pattern.charAt(this.patternIndex) , "CHECKING", 4 ,true, "pattern")

            this.addStep(true, true);
        }

        /**
         * @description Adding match step to the steps array, highlights current 2 characters being matched.
         * @param fullMatch Whether the match is a full match or not, it determines what gets highlighted as well as the message.
        */
        protected addMatchStep(fullMatch : boolean) : void {

            this.algorithmStepBuilder.setPseudocodeLine = 11;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "Found a character match - move to next character in text";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex , this.pattern.charAt(this.previousStep.patternIndex) , "MATCH" , 4, false , "pattern");
            this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex , this.text.charAt(this.previousStep.textIndex) , "MATCH" , 4, true , "text");

            this.addStep(true, false);
            const matchedStep = this.previousStep;

            this.algorithmStepBuilder.setPseudocodeLine = 12;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setCommand = "Move to next character in pattern";

            this.addStep(true , false);

            this.algorithmStepBuilder.setPseudocodeLine = 13;
            this.algorithmStepBuilder.setCommand = "Check if the whole string has been matched";
            this.algorithmStepBuilder.setLettersInText = this.highlightSubstringOfLine(this.previousStep.lettersInText , "CHECKING" , this.previousStep.textIndex-this.patternIndex,  this.previousStep.textIndex + this.additionalVariables.patternLength-this.patternIndex-1);
            this.algorithmStepBuilder.setLettersInPattern = this.recolourLetters(this.previousStep.lettersInPattern , "CHECKING");
            this.addStep(true , false);

            this.algorithmStepBuilder.setCommand =  (fullMatch) ? "Matched!" : "No match - continuing!";
            const matchColour = (fullMatch) ? "MATCH" : "MISMATCH";
            this.algorithmStepBuilder.setLettersInText = this.changeLetterStroke(this.highlightSubstringOfLine(this.previousStep.lettersInText , matchColour , this.previousStep.textIndex-this.patternIndex ,  this.previousStep.textIndex + this.additionalVariables.patternLength-this.patternIndex-1),1);
            this.algorithmStepBuilder.setLettersInPattern = this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInPattern , matchColour),1);

            this.addStep(true , true);

            this.previousStep.lettersInPattern = matchedStep.lettersInPattern;
            this.previousStep.lettersInText = matchedStep.lettersInText;
        }

        /**
         * @description Step to add when there is no border.
         */
        private addFailedBorderCheck() {
            this.algorithmStepBuilder.setPseudocodeLine = 17;
            this.algorithmStepBuilder.setCommand = "There is no border!";
            this.addStep(false,false);
        }

        /**
         * @description Step to add when the pattern index is 0.
         */
        private addZeroPatternIndexCheck() {
            this.algorithmStepBuilder.setPseudocodeLine = 18;
            this.algorithmStepBuilder.setCommand = "Checking if patternIndex is 0";
            this.addStep(false,false);
        }

        /**
         * @description Steps to add when there is a mismatch.
         * @param mismatchCase The case of the mismatch, 1 = border table has a value for the current pattern index, 2 = pattern is zero, 3 = pattern index is not 0.
         * @param borderIndex The index of the border table to highlight.
         */
        private addMismatchStep(mismatchCase : number, borderIndex : number | null) {

            this.algorithmStepBuilder.setPseudocodeLine = 14;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;


            this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex ,this.pattern.charAt(this.previousStep.patternIndex) , "MISMATCH" , 4, false , "pattern");
            this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex ,this.text.charAt(this.previousStep.textIndex) , "MISMATCH" , 4, true , "text");

            this.addStep(true, false);

            this.algorithmStepBuilder.setPseudocodeLine = 15;
            this.algorithmStepBuilder.setPatternIndex = 0;
            this.algorithmStepBuilder.setCommand = "Check whether border table has a value for the current pattern index";
            this.additionalVariables.borderTableIndexToHighlight = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true, false);

            switch (mismatchCase) {
                case 1: {
                    this.algorithmStepBuilder.setPseudocodeLine = 16;
                    this.algorithmStepBuilder.setCommand = "Border table has a value for the current pattern index";
                    this.additionalVariables.borderTableIndexToHighlight = borderIndex;
                    this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                    this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
                    this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
                    this.algorithmStepBuilder.setLettersInText = this.highlightSubstringOfLine(this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInText , "DEFAULT"),1) , "MATCH" , this.textIndex - this.patternIndex, this.textIndex - 1);
                    this.algorithmStepBuilder.setLettersInPattern = this.highlightSubstringOfLine(this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInPattern , "DEFAULT"),1), "MATCH" , 0 , this.patternIndex-1);


                    this.addStep(true,false);

                    this.algorithmStepBuilder.setPatternOffset = this.textIndex - this.patternIndex;
                    break;
                }
                case 2 : {

                    this.addFailedBorderCheck();
                    this.addZeroPatternIndexCheck();


                    this.algorithmStepBuilder.setPseudocodeLine = 19;
                    this.algorithmStepBuilder.setCommand = "Pattern is zero - Move forward one position in text";
                    this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
                    this.algorithmStepBuilder.setPatternOffset = this.textIndex;
                    this.algorithmStepBuilder.setLettersInText = this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInText , "DEFAULT"),1);
                    this.algorithmStepBuilder.setLettersInPattern = this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInPattern , "DEFAULT"),1);
                    break;
                }
                case 3 : {
                    this.addFailedBorderCheck();
                    this.addZeroPatternIndexCheck();

                    this.algorithmStepBuilder.setPseudocodeLine = 20;
                    this.algorithmStepBuilder.setCommand = "patternIndex is not 0";
                    this.algorithmStepBuilder.setPatternIndex = this.patternIndex;

                    this.addStep(true, false);

                    this.algorithmStepBuilder.setPseudocodeLine = 21;
                    this.algorithmStepBuilder.setCommand = "Reset current position in pattern";
                    this.algorithmStepBuilder.setPatternOffset = this.textIndex;
                    this.algorithmStepBuilder.setLettersInText = this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInText , "DEFAULT"),1);
                    this.algorithmStepBuilder.setLettersInPattern = this.changeLetterStroke(this.recolourLetters(this.previousStep.lettersInPattern , "DEFAULT"),1);
                    break;
                }
            }

            this.addStep(true , true);
            this.additionalVariables.borderTableIndexToHighlight = null;
        }

        /**
         * @description Step to add when there is no solution. Highlights both text and pattern.
         */
        protected override addNoSolutionStep() {
            this.algorithmStepBuilder.setPseudocodeLine = 26;
            this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.textIndex;
            this.algorithmStepBuilder.setCommand = "No match !";
            this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "MISMATCH" , 4);
            this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "MISMATCH" , 4);
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true , true);
        }

        /**
         * @description Method to change the colour of all letter object within an array.
         * @param letters The letter objects to recolour.
         * @param colour The new colour to recolour to.
         */
        private recolourLetters(letters : Letter[] , colour : string) : Letter[] {
            return letters.map(letter => {
                letter.colour = colour;
                return letter;
            });
        }

        /**
         * @description Method to change stroke weight of all letter objects in an array.
         * @param letters Letter objects to change stroke of.
         * @param strokeWeight The width of the stroke.
         */
        private changeLetterStroke(letters : Letter[] , strokeWeight : number) : Letter[] {
            return letters.map(letter => {
                letter.strokeWeight = strokeWeight;
                return letter;
            });
        }

        /**
         * @description Method that will highlight a section of Letter objects in an array.
         * @param letters The letter object array to change section of.
         * @param colour The colour to recolour to.
         * @param start The index to start recolouring at.
         * @param end The index to stop recolouring at.
         */
        private highlightSubstringOfLine(letters : Letter[] , colour : string , start : number , end : number) {
            return letters.map(letter => {
                if (letter.index >= start && letter.index <= end) {
                    letter.colour = colour;
                }
                return letter;
            });
        }

        /**
         * @description Resetting the additional variables.
         */
        public resetAdditionalVariables() : void {
            this.additionalVariables = new KnuthMorrisPrattAdditionalVariables();
        }

        // TESTER FUNCTIONS

        /**
         * @description Function to get border table for testing purposes. Not available in production.
         * @param pattern The pattern to create a border table for.
         * @returns The border table
         */
        public borderTableTesterGetter(pattern : string) : number[] {
            if (environment.type == "dev") {
                return this.createBorderTable(pattern);
            } else {
                throw new Error("Attempting to use a dev function from a non-dev environment");
            }
        }

        /**
         * @description Function to set the text and pattern for testing purposes. Not available in production.
         * @param text The text to set.
         * @param pattern The pattern to set.
         */
        public setupAdditionalVariablesTesterGetter(textLength : number , patternLength : number , borderTable : number[] = []) : void {
            if (environment.type == "dev") {
                this.additionalVariables.textLength = textLength;
                this.additionalVariables.patternLength = patternLength;
                this.additionalVariables.borderTable = borderTable;
            } else {
                throw new Error("Attempting to use a dev function from a non-dev environment");
            }
        }

      /**
       * @description Tester method to get the steps array for the match case. Not available in production.
       * @returns The steps array created by the match function.
       * @see addMatchStep
      */
      public matchStepsTesterGetter(full : boolean) : AlgorithmStep[] {
        if (environment.type == "dev") {
            this.addMatchStep(full);
            return this.steps;
        }
        throw new Error("Attempting to use a dev function from a non-dev environment");
      }


      /**
       * @description Tester method to get the steps array for the mismatch case. Not available in production.
       * @param mismatchCase The case of the mismatch, 1 = border table has a value for the current pattern index, 2 = pattern is zero, 3 = pattern index is not 0.
       * @param borderIndex The index of the border table to highlight.
       * @returns The steps array created by the mismatch function.
       * @see addMismatchStep
      */
      public mismatchStepsTesterGetter(mismatchCase : number , borderIndex : number) {
        if (environment.type == "dev") {
            this.addMismatchStep(mismatchCase , borderIndex);
            return this.steps;
        }
        throw new Error("Attempting to use a dev function from a non-dev environment");
      }
}