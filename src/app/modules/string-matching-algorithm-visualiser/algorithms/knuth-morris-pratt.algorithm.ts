import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { AdditionalVariables } from "../models/additional-variables.model";
import { StringMatchingAlgorithm } from "../models/algorithm.model";



export class KnuthMorrisPrattAlgorithm extends StringMatchingAlgorithm {

        additionalVariables = new AdditionalVariables();
        public workOutSteps(text : string , pattern : string) : number {
           this.text = text;
           this.pattern = pattern;
           const textLength = text.length;
           const patternLength = pattern.length;
           let patternIndex = 0;
           let textIndex = 0;
           this.addSetupSteps(textLength , patternLength);

           const borderTable = this.createBorderTable(pattern , patternLength);
           this

           while (textIndex < textLength) {
                if (text.charAt(textIndex) == pattern.charAt(patternIndex)) {
                    patternIndex++;
                    textIndex++;
                    if (patternIndex == patternLength) return textIndex - patternIndex;
                } else {
                    if (borderTable[patternIndex] > 0) {
                        patternIndex = borderTable[patternIndex];
                    } else {
                        if (patternIndex == 0) {
                            textIndex++;
                        } else {
                            patternIndex = 0;
                        }
                    }
                }
           }
           return -1;
        }

        private createBorderTable(pattern : string , patternLength : number) : number[] {
            const borderTable = new Array<number>(patternLength);
            borderTable[0] = 0;
            borderTable[1] = 0;
            let i = 0;

            for (let j = 2 ; j < patternLength; j++) {
                i = borderTable[j - 1];
                while (pattern[i] != pattern[j - 1] && i > 0) {
                    i = borderTable[i];
                }

                if (pattern[i] != pattern[j-1] && i==0) {
                    borderTable[j] = 0;
                } else {
                    borderTable[j] = i + 1;
                }
            }
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



}