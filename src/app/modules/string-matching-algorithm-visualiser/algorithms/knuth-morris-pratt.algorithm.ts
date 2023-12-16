import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { AdditionalVariables } from "../models/additional-variables.model";
import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { KnuthMorrisPrattAdditionalVariables } from "../models/knuth-morris-pratt-additional.model.";
import { Letter } from "../models/letter.model";



export class KnuthMorrisPrattAlgorithm extends StringMatchingAlgorithm {

        additionalVariables = new KnuthMorrisPrattAdditionalVariables();
        public workOutSteps(text : string , pattern : string) : number {
           this.text = text;
           this.pattern = pattern;
           const textLength = text.length;
           const patternLength = pattern.length;
           let patternIndex = 0;
           let textIndex = 0;
           this.addSetupSteps(textLength , patternLength);

           const borderTable = this.createBorderTable(pattern , patternLength);


           while (textIndex < textLength) {
                this.addWhileLoopStep(textIndex , patternIndex);
                this.addCheckStep(textIndex , patternIndex);
                if (text.charAt(textIndex) == pattern.charAt(patternIndex)) {
                    textIndex++;
                    patternIndex++;
                    if (patternIndex == patternLength) {
                        this.addMatchStep(textIndex , patternIndex , true)
                        return textIndex - patternIndex;
                    } else {
                        this.addMatchStep(textIndex, patternIndex , false)
                    }
                } else {
                    if (borderTable[patternIndex] > 0) {
                        patternIndex = borderTable[patternIndex];
                        this.addMismatchStep(1 , patternIndex , textIndex);
                    } else {
                        if (patternIndex == 0) {
                            textIndex++;
                            this.addMismatchStep(2 , 0 , textIndex);
                        } else {
                            patternIndex = 0;
                            this.addMismatchStep(3 , 0 , textIndex);
                        }
                    }
                }
           }
           this.addNoSolutionStep(textIndex , patternIndex);
           return -1;
        }

        private createBorderTable(pattern : string , patternLength : number) : number[] {
            const borderTable = new Array<number>(patternLength + 1);
            const beforeBorderTableStep = JSON.parse(JSON.stringify(this.previousStep));

            this.algorithmStepBuilder.setPseudocodeLine = 7;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            this.algorithmStepBuilder.setCommand = `Creating a border table of length ${pattern.length}`;
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            let currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));

            borderTable[0] = 0;

            this.algorithmStepBuilder.setPseudocodeLine = 6;
            this.algorithmStepBuilder.setCommand = 'The first element of the border table is the border of the empty string "", this is 0';
            this.algorithmStepBuilder.setExtra = true;
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.algorithmStepBuilder.setPseudocodeFilename = "border-table";
            currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));

            borderTable[1] = 0;

            this.algorithmStepBuilder.setPseudocodeLine = 6;
            this.algorithmStepBuilder.setCommand = `The second element of the border table is the border of the first character "${pattern.charAt(0)}", this is 0` ;
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            this.letterBuilder.setIndex = 0;
            this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
            this.letterBuilder.setLetter = pattern.charAt(0);
            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
            currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.letterBuilder.setDefaults();
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));


            let i = 0;
            this.algorithmStepBuilder.setPseudocodeLine = 6;
            this.algorithmStepBuilder.setCommand = "Initialising i to 0";
            this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
            currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));

            this.algorithmStepBuilder.setPseudocodeLine = 6;
            this.algorithmStepBuilder.setCommand = "Initialising j to 2";
            currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));


            for (let j = 2 ; j < patternLength; j++) {
                i = borderTable[j - 1];

                this.algorithmStepBuilder.setPseudocodeLine = 6;
                this.algorithmStepBuilder.setCommand = `Grabbing previous border value for "${pattern.substring(0, j-1)}" , which was ${borderTable[j-1]}`;
                currentStep = this.algorithmStepBuilder.build();
                this.addStep(currentStep);
                this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));


                this.algorithmStepBuilder.setPseudocodeLine = 6;
                this.additionalVariables.i = i;
                this.additionalVariables.j = j;
                this.additionalVariables.borderOne = [0  , i];
                const difference = this.additionalVariables.borderOne[1] - this.additionalVariables.borderOne[0];
                this.additionalVariables.borderTwo = [j - 1 - difference , j - 1];
                this.letterBuilder.setIndex = i;
                this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
                this.letterBuilder.setLetter = pattern.charAt(i);
                let temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                this.letterBuilder.setIndex = j-1;
                this.letterBuilder.setColor = MatchingAlgorithmColourConstants.CHECKING;
                this.letterBuilder.setLetter = pattern.charAt(j-1);
                this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                this.algorithmStepBuilder.setCommand = `We will check whether substring "${pattern.substring(0,j)}" has a border by checking if the last character "${pattern.charAt(i)}" of last substring "${pattern.substring(0,i+1)}" is equal to character which is now at the end of the substring "${pattern.substring(0,j)}"`;
                currentStep = this.algorithmStepBuilder.build();
                this.addStep(currentStep);
                this.letterBuilder.setDefaults();
                this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));



                if (pattern[i] != pattern[j-1]) {
                    this.algorithmStepBuilder.setCommand = `"${pattern.charAt(i)}" != "${pattern.charAt(j-1)}"`;
                    this.letterBuilder.setIndex = i;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
                    this.letterBuilder.setLetter = pattern.charAt(i);
                    temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                    this.letterBuilder.setIndex = j-1;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
                    this.letterBuilder.setLetter = pattern.charAt(j-1);
                    this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep))
                }

                while (pattern[i] != pattern[j - 1] && i > 0) {
                    this.algorithmStepBuilder.setPseudocodeLine = 6;
                    this.letterBuilder.setIndex = i;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
                    this.letterBuilder.setLetter = pattern.charAt(i);
                    temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                    this.letterBuilder.setIndex = j-1;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
                    this.letterBuilder.setLetter = pattern.charAt(j-1);
                    this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                    this.algorithmStepBuilder.setCommand = `The added character in the substring:  ${pattern.charAt(j-1)} is not equal to the character at the border ${pattern.charAt(i)}`;
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep))

                    i = borderTable[i];

                    this.algorithmStepBuilder.setPseudocodeLine = 6;
                    this.algorithmStepBuilder.setCommand = `Reducing i to ${i}`;
                    this.additionalVariables.i = i;
                    this.additionalVariables.j = j;
                    this.additionalVariables.borderOne = [0  , i];
                    const difference = this.additionalVariables.borderOne[1] - this.additionalVariables.borderOne[0];
                    this.additionalVariables.borderTwo = [j - 1 - difference , j - 1];
                    this.letterBuilder.setIndex = i;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
                    this.letterBuilder.setLetter = pattern.charAt(i);
                    temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                    this.letterBuilder.setIndex = j-1;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.CHECKING;
                    this.letterBuilder.setLetter = pattern.charAt(j-1);
                    this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep))


                    this.algorithmStepBuilder.setPseudocodeLine = 6;
                    this.algorithmStepBuilder.setCommand = `Checking if there is a smaller border for the substring "${pattern.substring(0,j)}, by comparing the last character "${pattern.charAt(i)}" of the substring "${pattern.substring(0,i+1)}" to the character at the end of the substring "${pattern.substring(0,j)}"`;
                    this.letterBuilder.setIndex = i;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
                    this.letterBuilder.setLetter = pattern.charAt(i);
                    temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                    this.letterBuilder.setIndex = j-1;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.CHECKING;
                    this.letterBuilder.setLetter = pattern.charAt(j-1);
                    this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep))

                }

                if (pattern[i] != pattern[j-1] && i==0) {
                    borderTable[j] = 0;
                    this.algorithmStepBuilder.setPseudocodeLine = 6;
                    this.algorithmStepBuilder.setCommand = `Since the characters don't match and there is no characters left to compare then there must be no border`;
                    this.letterBuilder.setIndex = i;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
                    this.letterBuilder.setLetter = pattern.charAt(i);
                    temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                    this.letterBuilder.setIndex = j-1;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
                    this.letterBuilder.setLetter = pattern.charAt(j-1);
                    this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                    currentStep = this.algorithmStepBuilder.build();
                    this.additionalVariables.borderTable = borderTable;
                    this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep))
                } else {
                    borderTable[j] = i + 1;

                    this.algorithmStepBuilder.setCommand = `"${pattern.charAt(i)}" === "${pattern.charAt(j-1)}"`;
                    this.letterBuilder.setIndex = i;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
                    this.letterBuilder.setLetter = pattern.charAt(i);
                    temp = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                    this.letterBuilder.setIndex = j-1;
                    this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
                    this.letterBuilder.setLetter = pattern.charAt(j-1);
                    this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(temp, this.letterBuilder.build());
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep))


                    this.algorithmStepBuilder.setPseudocodeLine = 6;
                    this.algorithmStepBuilder.setCommand = `Since the characters at the start and end match, the border must be 1 more than previous border, hence "borderTable[j] = i + 1 = ${i} + 1 = ${borderTable[j]}"`;
                    this.additionalVariables.borderTable = borderTable;
                    this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                    currentStep = this.algorithmStepBuilder.build();
                    this.addStep(currentStep);
                    this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));
                }
            }

            this.resetAdditionalVariables();
            this.algorithmStepBuilder.setDefaults();
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));
            this.letterBuilder.setDefaults();
            this.additionalVariables.borderTable = borderTable;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            return borderTable;
        }

        protected override addSetupSteps(textLength: number, patternLength: number): void {
            const setUpSteps  = [
                { command : "Starting Knuth Morris Pratt ..." },
                { command : "Measuring the length of the text" , highlightText : true , textLength : textLength },
                { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : patternLength },
                { command : "Initialising the text index to 0" , textIndex : 0},
                { command : "Initialising the pattern index to 0"  ,  textIndex  : 0 , patternIndex : 0  } ,
            ]

            setUpSteps.forEach(({ command , highlightText , highlightPattern , textLength , patternLength , textIndex , patternIndex} , index) => {
                this.algorithmStepBuilder.setPseudocodeLine = index + 1;
                if (command) this.algorithmStepBuilder.setCommand = command;

                if (highlightText) {
                    this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , MatchingAlgorithmColourConstants.CHECKING , 1);
                } else {
                    this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , MatchingAlgorithmColourConstants.DEFAULT , 1);
                }
                if (highlightPattern) {
                    this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , MatchingAlgorithmColourConstants.CHECKING , 1);
                } else {
                    this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , MatchingAlgorithmColourConstants.DEFAULT , 1);
                }

                if (textIndex != undefined) this.algorithmStepBuilder.setTextIndex = textIndex;
                if (patternIndex != undefined) this.algorithmStepBuilder.setPatternIndex = patternIndex;

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

            this.algorithmStepBuilder.setPseudocodeLine = 9;
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

            this.algorithmStepBuilder.setPseudocodeLine = 10;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.letterBuilder.setIndex = textIndex;
            this.letterBuilder.setLetter = this.text.charAt(textIndex);
            this.letterBuilder.setColor = MatchingAlgorithmColourConstants.CHECKING;
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

        private addMatchStep(textIndex : number , patternIndex : number , fullMatch : boolean) {

            this.algorithmStepBuilder.setPseudocodeLine = 11;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "Found a character match - move to next character in text";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;


            this.letterBuilder.setIndex = this.previousStep.patternIndex;
            this.letterBuilder.setLetter = this.pattern.charAt(this.previousStep.patternIndex);
            this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
            this.letterBuilder.setStrokeWeight = 4;

            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());

            this.letterBuilder.setIndex = this.previousStep.textIndex;
            this.letterBuilder.setLetter = this.text.charAt(this.previousStep.textIndex);
            this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MATCH;
            this.letterBuilder.setStrokeWeight = 4;

            this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.previousStep.lettersInText, this.letterBuilder.build());

            let step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
            this.letterBuilder.setDefaults();

            console.log(this.algorithmStepBuilder)
            this.algorithmStepBuilder.setPseudocodeLine = 12;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setCommand = "Move to next character in pattern";

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;


            this.algorithmStepBuilder.setPseudocodeLine = 13;
            this.algorithmStepBuilder.setCommand = "Check if the whole string has been matched";
            // this.algorithmStepBuilder.setLettersInText = this.recolourLetters(this.previousStep.lettersInText , MatchingAlgorithmColourConstants.CHECKING);
            // this.algorithmStepBuilder.setLettersInPattern = this.recolourLetters(this.previousStep.lettersInPattern , MatchingAlgorithmColourConstants.CHECKING);
            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setCommand =  (fullMatch) ? "Matched!" : "No match - continuing!"

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setDefaults();
        }

        private addFailedBorderCheck() {
            this.algorithmStepBuilder.setPseudocodeLine = 17;

            this.algorithmStepBuilder.setCommand = "There is no border!";

            const step = this.algorithmStepBuilder.build();
            this.addStep(step);
        }

        private addZeroPatternIndexCheck() {
            this.algorithmStepBuilder.setPseudocodeLine = 18;

            this.algorithmStepBuilder.setCommand = "Checking if patternIndex is 0";

            const step = this.algorithmStepBuilder.build();
            this.addStep(step);
        }

        private addMismatchStep(mismatchCase : number , patternIndex : number , textIndex : number) {
            this.algorithmStepBuilder.setPseudocodeLine = 14;
            this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
            this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
            this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.letterBuilder.setIndex = this.previousStep.patternIndex;
            this.letterBuilder.setLetter = this.pattern.charAt(this.previousStep.patternIndex);
            this.letterBuilder.setColor = MatchingAlgorithmColourConstants.MISMATCH;
            this.letterBuilder.setStrokeWeight = 4;

            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.highlightEntireLine(this.pattern,MatchingAlgorithmColourConstants.DEFAULT, 1), this.letterBuilder.build());

            this.letterBuilder.setIndex = this.previousStep.textIndex;
            this.letterBuilder.setLetter = this.text.charAt(this.previousStep.textIndex);

            this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.highlightEntireLine(this.text,MatchingAlgorithmColourConstants.DEFAULT, 1), this.letterBuilder.build());

            let step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            this.algorithmStepBuilder.setPseudocodeLine = 15;
            this.algorithmStepBuilder.setPatternIndex = 0;
            this.algorithmStepBuilder.setCommand = "Check whether border table has a value for the current pattern index";
            this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , MatchingAlgorithmColourConstants.DEFAULT , 1);
            this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , MatchingAlgorithmColourConstants.DEFAULT , 1);

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;

            switch (mismatchCase) {
                case 1: {
                    this.algorithmStepBuilder.setPseudocodeLine = 16;
                    this.algorithmStepBuilder.setCommand = "Border table has a value for the current pattern index";
                    this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                    this.algorithmStepBuilder.setPatternIndex = patternIndex;
                    this.algorithmStepBuilder.setPatternOffset = textIndex - patternIndex;
                    this.algorithmStepBuilder.setLettersInText = this.highlightSubstringOfLine(this.previousStep.lettersInText , MatchingAlgorithmColourConstants.MATCH , textIndex - patternIndex, textIndex - 1);
                    this.algorithmStepBuilder.setLettersInPattern = this.highlightSubstringOfLine(this.previousStep.lettersInPattern , MatchingAlgorithmColourConstants.MATCH , 0 , patternIndex - 1);
                    break;
                }
                case 2 : {

                    this.addFailedBorderCheck();
                    this.addZeroPatternIndexCheck();


                    this.algorithmStepBuilder.setPseudocodeLine = 19;
                    this.algorithmStepBuilder.setCommand = "Pattern is zero - Move forward one position in text";
                    this.algorithmStepBuilder.setPatternIndex = patternIndex;
                    this.algorithmStepBuilder.setPatternOffset = textIndex;
                    break;
                }
                case 3 : {
                    this.addFailedBorderCheck();
                    this.addZeroPatternIndexCheck();

                    this.algorithmStepBuilder.setPseudocodeLine = 20;
                    this.algorithmStepBuilder.setCommand = "patternIndex is not 0";
                    this.algorithmStepBuilder.setPatternIndex = patternIndex;

                    step = this.algorithmStepBuilder.build();
                    this.addStep(step);
                    this.previousStep = step;

                    this.algorithmStepBuilder.setPseudocodeLine = 21;
                    this.algorithmStepBuilder.setCommand = "Reset current position in pattern";
                    this.algorithmStepBuilder.setPatternOffset = textIndex;
                    break;
                }
            }

            step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
            this.algorithmStepBuilder.setDefaults();
        }


        private addNoSolutionStep(textIndex : number , patternIndex : number) {

            this.algorithmStepBuilder.setPseudocodeLine = 26;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setCommand = "No match !";
            this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , MatchingAlgorithmColourConstants.MISMATCH , 4);
            this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , MatchingAlgorithmColourConstants.MISMATCH , 4);
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            const step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.previousStep = step;
            this.algorithmStepBuilder.setDefaults();
        }

        private recolourLetters(letters : Letter[] , colour : MatchingAlgorithmColourConstants) {
            return letters.map(letter => {
                letter.colour = colour;
                return letter;
            });
        }

        private highlightSubstringOfLine(letters : Letter[] , colour : MatchingAlgorithmColourConstants , start : number , end : number) {
            return letters.map(letter => {
                if (letter.index >= start && letter.index <= end) {
                    letter.colour = colour;
                }
                return letter;
            });
        }

        resetAdditionalVariables() {
            this.additionalVariables = new KnuthMorrisPrattAdditionalVariables();
        }



}