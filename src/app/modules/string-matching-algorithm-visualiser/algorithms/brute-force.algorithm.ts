import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class BruteForceAlgorithm extends StringMatchingAlgorithm {

        workOutSteps(text : string , pattern : string) : number {
            const textLength = text.length;
            this.textLengthSetter = textLength;
            const patternLength = pattern.length;
            this.patternLengthSetter = patternLength;
            let startingPoint = 0;
            let textIndex = 0;
            let patternIndex = 0;
            this.addSetupSteps();

            while (startingPoint <= textLength - patternLength && patternIndex < patternLength) {
                this.addWhileLoopStep();
                if (text.charAt(textIndex) === pattern.charAt(patternIndex)) {
                    textIndex++;
                    patternIndex++;
                    this.addMatchStep(textIndex , patternIndex);
                } else {
                    patternIndex = 0;
                    startingPoint += 1;
                    textIndex = startingPoint;
                    this.addMismatchStep();
                }
            }
            if (patternIndex === patternLength) {
               this.addFullMatchStep();
                return startingPoint;
            }
            this.addNoSolutionStep();
            return -1;
        }

        private addSetupSteps() {
            const algorithmStep1 : AlgorithmStep = {
                pseudocodeLine : 1,
                patternIndex : -1,
                textIndex : -1,
                patternElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                textElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                alreadyMatchedIndexesInPattern : [],
                alreadyMatchedIndexesInText : [],
                command : "Measuring the length of the text",
                highlightText : true,
                highlightPattern : false
            };
            this.addStep(algorithmStep1);

            const algorithmStep2 : AlgorithmStep = {
                pseudocodeLine : 2,
                patternIndex : -1,
                textIndex : -1,
                patternElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                textElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                alreadyMatchedIndexesInPattern : [],
                alreadyMatchedIndexesInText : [],
                command : "Measuring the length of the pattern",
                highlightText : false,
                highlightPattern : true
            };
            this.addStep(algorithmStep2);

            const algorithmStep3 : AlgorithmStep = {
                pseudocodeLine : 3,
                patternIndex : -1,
                textIndex : -1,
                patternElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                textElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                alreadyMatchedIndexesInPattern : [],
                alreadyMatchedIndexesInText : [],
                command : "Initialising the starting point to 0",
                highlightText : false,
                highlightPattern : false,
            };
            this.addStep(algorithmStep3);

            const algorithmStep4 : AlgorithmStep = {
                pseudocodeLine : 4,
                patternIndex : -1,
                textIndex : -1,
                patternElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                textElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                alreadyMatchedIndexesInPattern : [],
                alreadyMatchedIndexesInText : [],
                command : "Initialising the text index to 0",
                highlightText : false,
                highlightPattern : false,
            };
            this.addStep(algorithmStep4);

            const algorithmStep5 : AlgorithmStep = {
                pseudocodeLine : 5,
                patternIndex : -1,
                textIndex : -1,
                patternElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                textElementColour : MatchingAlgorithmColourConstants.DEFAULT,
                alreadyMatchedIndexesInPattern : [],
                alreadyMatchedIndexesInText : [],
                command : "Initialising the pattern index to 0",
                highlightText : false,
                highlightPattern : false,
            };
            this.addStep(algorithmStep5);

            console.log("Finished adding");
            console.log(this.steps);

        }


        private addWhileLoopStep() {
            const nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 6;
            nextStep.command = "Looping through the pattern and text looking for a match"
            this.addStep(nextStep);
        }

        private addMatchStep(textIndex : number , patternIndex : number) {
            let nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 7;
            nextStep.command = "Found a character match"
            nextStep.patternElementColour = MatchingAlgorithmColourConstants.MATCH;
            nextStep.textElementColour = MatchingAlgorithmColourConstants.MATCH;
            nextStep.textIndex = textIndex;
            nextStep.patternIndex = patternIndex;
            this.addStep(nextStep);

            nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  2]));

            nextStep.pseudocodeLine = 8;
            nextStep.command = "Moving onto next text character";
            this.addStep(nextStep);

            nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  2]));

            nextStep.pseudocodeLine = 9;
            nextStep.command = "Moving onto next pattern character";
            this.addStep(nextStep);
        }

        private addMismatchStep() {
            let nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 10;
            nextStep.command = "No character match found, enter the else block"
            this.addStep(nextStep);

            nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 11;
            nextStep.command = "Reset pattern index to 0";
            this.addStep(nextStep);

            nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 12;
            nextStep.command = "Set starting point of comparison to next element of text";
            this.addStep(nextStep);

            nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 13;
            nextStep.command = "Set text index to starting point";
            this.addStep(nextStep);
        }

        private addFullMatchStep() {
            let nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 14;
            nextStep.command = "Checking if fully matched the pattern"
            this.addStep(nextStep);

            nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 15;
            nextStep.command = "Return the starting point of the match to show where the subtext matched";
            this.addStep(nextStep);
        }

        private addNoSolutionStep() {
            const nextStep = JSON.parse(JSON.stringify(this.steps[this.steps.length -  1]));

            nextStep.pseudocodeLine = 16;
            nextStep.command = "No match!";
            this.addStep(nextStep);
        }
}