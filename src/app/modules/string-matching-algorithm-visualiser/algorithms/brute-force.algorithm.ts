import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { Injectable } from "@angular/core";
import { BruteForceAdditionalVariables } from "../models/brute-force-additional-variables.model";

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
            this.startingPoint = startingPoint;
            let textIndex = 0;
            let patternIndex = 0;
            this.addSetupSteps();

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

        addSetupSteps() {

            const setUpCommands = [
                { command : "Measuring the length of the text" , highlightText : true , highlightPattern : false } ,
                { command : "Measuring the length of the pattern"  , highlightText : false , highlightPattern : true } ,
                { command : "Initialising the starting point to 0" , highlightText : true , highlightPattern : false } ,
                { command : "Initialising the text index to 0" , highlightText : true , highlightPattern : false },
                { command : "Initialising the pattern index to 0"  , highlightText : true , highlightPattern : false } ,
            ];

            setUpCommands.forEach(({command , highlightText , highlightPattern} , index) => {
                const algorithmStep : AlgorithmStep = {
                    pseudocodeLine : index + 1 ,
                    patternIndex : -1 ,
                    textIndex : -1 ,
                    patternElementColour : MatchingAlgorithmColourConstants.DEFAULT ,
                    textElementColour : MatchingAlgorithmColourConstants.DEFAULT ,
                    alreadyMatchedIndexesInPattern : [] ,
                    alreadyMatchedIndexesInText : [] ,
                    command : command ,
                    highlightText : highlightText ,
                    highlightPattern : highlightPattern,
                    additional : this.additionalToExport(),
                };
                this.addStep(algorithmStep);
            });
        }

        addWhileLoopStep(textIndex : number , patternIndex : number) : void {
            const nextStep : AlgorithmStep = {
                pseudocodeLine : 6 ,
                patternIndex : patternIndex ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.DEFAULT ,
                textElementColour : MatchingAlgorithmColourConstants.DEFAULT ,
                alreadyMatchedIndexesInPattern : [] ,
                alreadyMatchedIndexesInText : [] ,
                command : "Looping through the pattern and text looking for a match" ,
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            }
            this.addStep(nextStep);
        }

        addCheckStep(textIndex : number , patternIndex : number) : void {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            const nextStep : AlgorithmStep = {
                pseudocodeLine : 7 ,
                patternIndex : patternIndex,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.CHECKING ,
                textElementColour : MatchingAlgorithmColourConstants.CHECKING ,
                alreadyMatchedIndexesInPattern : [...previousStep.alreadyMatchedIndexesInPattern] ,
                alreadyMatchedIndexesInText : [...previousStep.alreadyMatchedIndexesInText],
                command : "Checking if the 2 characters match" ,
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            }
            this.addStep(nextStep);
        }

        addMatchStep(textIndex : number , patternIndex : number) {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            const moveToNextInText : AlgorithmStep = {
                pseudocodeLine : 8 ,
                patternIndex : patternIndex-1 ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.MATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MATCH ,
                alreadyMatchedIndexesInPattern : [...previousStep.alreadyMatchedIndexesInPattern, patternIndex] ,
                alreadyMatchedIndexesInText : [...previousStep.alreadyMatchedIndexesInText, textIndex] ,
                command : "Found a character match - move to next character in text",
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            };

            this.addStep(moveToNextInText);

            const moveToNextInPattern : AlgorithmStep = {
                pseudocodeLine : 9 ,
                patternIndex : patternIndex ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.MATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MATCH ,
                alreadyMatchedIndexesInPattern : [...previousStep.alreadyMatchedIndexesInPattern] ,
                alreadyMatchedIndexesInText : [...previousStep.alreadyMatchedIndexesInText] ,
                command : "Move to next character in pattern",
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            }

            this.addStep(moveToNextInPattern);


        }

        addMismatchStep(textIndex : number , patternIndex: number) {

            const elseBlockStep : AlgorithmStep = {
                pseudocodeLine : 10 ,
                patternIndex : patternIndex ,
                textIndex : textIndex-1 ,
                patternElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "No character match found, enter the else block",
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            };

            this.addStep(elseBlockStep);

            const resetPatternIndex : AlgorithmStep = {
                pseudocodeLine : 11 ,
                patternIndex : patternIndex ,
                textIndex : textIndex-1 ,
                patternElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "Reset pattern index to 0",
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            };

            this.addStep(resetPatternIndex);

            const setStartingPoint : AlgorithmStep = {
                pseudocodeLine : 12 ,
                patternIndex : patternIndex ,
                textIndex : textIndex-1 ,
                patternElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "Increment starting point of comparison to next element of text",
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            };

            this.addStep(setStartingPoint);

            const setTextIndex : AlgorithmStep = {
                pseudocodeLine : 13 ,
                patternIndex : patternIndex ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MISMATCH ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "Set text index to starting point",
                highlightText : false ,
                highlightPattern : false,
                additional : this.additionalToExport(),
            };

            this.addStep(setTextIndex);
        }


        addFullMatchStep(textIndex : number , patternIndex : number) {

            const finalCheck : AlgorithmStep = {
                pseudocodeLine : 14 ,
                patternIndex : patternIndex ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.CHECKING ,
                textElementColour : MatchingAlgorithmColourConstants.CHECKING ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "Checking if fully matched the pattern",
                highlightText : true ,
                highlightPattern : true,
                additional : this.additionalToExport(),
            };

            this.addStep(finalCheck);

            const returnStatement : AlgorithmStep = {
                pseudocodeLine : 15 ,
                patternIndex : patternIndex ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.MATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MATCH ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "Report that there has been a match",
                highlightText : true ,
                highlightPattern : true,
                additional : this.additionalToExport(),
            };

            this.addStep(returnStatement);
        }

        private addNoSolutionStep(textIndex : number , patternIndex : number) {
            const returnStatement : AlgorithmStep = {
                pseudocodeLine : 16 ,
                patternIndex : patternIndex ,
                textIndex : textIndex ,
                patternElementColour : MatchingAlgorithmColourConstants.MATCH ,
                textElementColour : MatchingAlgorithmColourConstants.MATCH ,
                alreadyMatchedIndexesInPattern :[] ,
                alreadyMatchedIndexesInText : [] ,
                command : "No match !",
                highlightText : true ,
                highlightPattern : true,
                additional : this.additionalToExport(),
            };

            this.addStep(returnStatement);
        }

        additionalToExport() : BruteForceAdditionalVariables {
            const additional : BruteForceAdditionalVariables = {
                startingPoint : this.startingPoint,
            }
            return additional;
        }
}