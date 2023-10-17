import { MatchingAlgorithmColourConstants } from "../../constants/matching-algorithm-colours.constant";
import { StringMatchingAlgorithm } from "../../models/algorithm.model";
import { Injectable } from "@angular/core";
import { BruteForceAdditionalVariables } from "../../models/brute-force-additional-variables.model";
import { AlgorithmStepTypeConstants } from "../../constants/algorithm-step-model.constant";

@Injectable({
    providedIn: 'root'
})
export class BruteForceAlgorithm extends StringMatchingAlgorithm {

        startingPoint : number;

        workOutSteps(text : string , pattern : string) : number {
            const textLength = text.length;
            this.textLengthSetter = textLength;
            const patternLength = pattern.length;
            this.patternLengthSetter = patternLength;
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
                    this.startingPoint = startingPoint;
                    textIndex = startingPoint;
                    this.addMismatchStep(textIndex , patternIndex);
                }
            }

            if (patternIndex === patternLength) {
               this.addFullMatchStep(textIndex , patternIndex);
                return startingPoint;
            }
            this.addNoSolutionStep(textIndex, patternIndex);
            return -1;
        }

        addSetupSteps(textLength : number , patternLength : number) {

            const setUpCommands = [
                { command : "Measuring the length of the text" , highlightText : true , highlightPattern : false , textLength : textLength } ,
                { command : "Measuring the length of the pattern"  , highlightText : false , highlightPattern : true , paternLength : patternLength} ,
                { command : "Initialising the starting point to 0" , highlightText : false , highlightPattern : false , startingPoint: 0 },
                { command : "Initialising the text index to 0" , highlightText : false , highlightPattern : false , textIndex : 0},
                { command : "Initialising the pattern index to 0"  , highlightText : false , highlightPattern : false ,  patternIndex : 0  } ,
            ];

            setUpCommands.forEach(({command , highlightText , highlightPattern , startingPoint} , index) => {
                this.algorithmStepBuilder.setCommand = command;
                this.algorithmStepBuilder.setHighlightText = highlightText;
                this.algorithmStepBuilder.setHighlightPattern = highlightPattern;
                this.algorithmStepBuilder.setPseudocodeLine = index + 1;
                if (startingPoint) {
                    this.startingPoint = startingPoint;
                    this.algorithmStepBuilder.setAdditional = this.additionalToExport();
                }
                this.addStep(this.algorithmStepBuilder.build());
                this.algorithmStepBuilder.setDefaults();
            });
        }

        addWhileLoopStep(textIndex : number , patternIndex : number) : void {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setPseudocodeLine = 7;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText]
            this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        addCheckStep(textIndex : number , patternIndex : number) : void {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setPseudocodeLine = 8;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternElementColour = MatchingAlgorithmColourConstants.CHECKING;
            this.algorithmStepBuilder.setTextElementColour = MatchingAlgorithmColourConstants.CHECKING;
            this.algorithmStepBuilder.setCommand = "Checking if the 2 characters match";
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText];
            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        addMatchStep(textIndex : number , patternIndex : number) {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.PROCESSING;
            this.algorithmStepBuilder.setPseudocodeLine = 9;
            this.algorithmStepBuilder.setPatternIndex = patternIndex-1;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternElementColour = MatchingAlgorithmColourConstants.MATCH;
            this.algorithmStepBuilder.setTextElementColour = MatchingAlgorithmColourConstants.MATCH;
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern, patternIndex];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText, textIndex];
            this.algorithmStepBuilder.setCommand = "Found a character match - move to next character in text";

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 10;
            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.MATCH;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setCommand = "Move to next character in pattern";

            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        addMismatchStep(textIndex : number , patternIndex: number) {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.MISMATCH;
            this.algorithmStepBuilder.setPseudocodeLine = 11;
            this.algorithmStepBuilder.setPatternIndex = previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = previousStep.textIndex;
            this.algorithmStepBuilder.setPatternElementColour = MatchingAlgorithmColourConstants.MISMATCH;
            this.algorithmStepBuilder.setTextElementColour = MatchingAlgorithmColourConstants.MISMATCH;
            this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 12;
            this.algorithmStepBuilder.setPatternIndex = 0;
            this.algorithmStepBuilder.setCommand = "Reset pattern index to 0";

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 13;
            this.algorithmStepBuilder.setCommand = "Increment starting point of comparison to next element of text";
            this.algorithmStepBuilder.setAdditional = this.additionalToExport();

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 14;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setCommand = "Set text index to starting point";

            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }


        addFullMatchStep(textIndex : number , patternIndex : number) {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setPseudocodeLine = 18;
            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.PROCESSING;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternElementColour = MatchingAlgorithmColourConstants.CHECKING;
            this.algorithmStepBuilder.setTextElementColour = MatchingAlgorithmColourConstants.CHECKING;
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText];
            this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 19;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText];
            this.algorithmStepBuilder.setPatternElementColour = MatchingAlgorithmColourConstants.MATCH;
            this.algorithmStepBuilder.setTextElementColour = MatchingAlgorithmColourConstants.MATCH;
            this.algorithmStepBuilder.setCommand = "Report that there has been a match";

            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        private addNoSolutionStep(textIndex : number , patternIndex : number) {
            this.algorithmStepBuilder.setPseudocodeLine = 21;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setPatternElementColour = MatchingAlgorithmColourConstants.MISMATCH;
            this.algorithmStepBuilder.setTextElementColour = MatchingAlgorithmColourConstants.MISMATCH;
            this.algorithmStepBuilder.setCommand = "No match !";
            this.algorithmStepBuilder.setHighlightPattern = true;
            this.algorithmStepBuilder.setHighlightPattern = true;

            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        additionalToExport() : BruteForceAdditionalVariables {
            const additional : BruteForceAdditionalVariables = {
                startingPoint : this.startingPoint,
            }
            return additional;
        }
}