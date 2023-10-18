import { MatchingAlgorithmColourConstants } from "../../constants/matching-algorithm-colours.constant";
import { StringMatchingAlgorithm } from "../../models/algorithm.model";
import { Injectable } from "@angular/core";
import { BruteForceAdditionalVariables } from "../../models/brute-force-additional-variables.model";
import { AlgorithmStepTypeConstants } from "../../constants/algorithm-step-model.constant";
import { LetterDraw } from "../../models/letter-draw.model";

@Injectable({
    providedIn: 'root'
})
export class BruteForceAlgorithm extends StringMatchingAlgorithm {

        startingPoint : number;

        workOutSteps(text : string , pattern : string) : number {
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

            const setUpSteps  = [
                {type : AlgorithmStepTypeConstants.HIGHLIGHT , command : "Measuring the length of the text" , highlightText : true , textLength : textLength },
                {type : AlgorithmStepTypeConstants.HIGHLIGHT , command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : patternLength },
                { command : "Initialising the starting point to 0", startingPoint: 0 },
                { command : "Initialising the text index to 0" , textIndex : 0},
                { command : "Initialising the pattern index to 0"  ,  textIndex  : 0 , patternIndex : 0  } ,
            ]

            setUpSteps.forEach(({type , command , highlightText , highlightPattern , textLength , patternLength , startingPoint, textIndex , patternIndex} , index) => {
                this.algorithmStepBuilder.setPseudocodeLine = index + 1;
                if (type) this.algorithmStepBuilder.setType = type;
                if (command) this.algorithmStepBuilder.setCommand = command;
                if (highlightText) this.algorithmStepBuilder.setHighlightText = highlightText;
                if (highlightPattern) this.algorithmStepBuilder.setHighlightPattern = highlightPattern;
                if (textIndex != undefined) this.algorithmStepBuilder.setTextIndex = textIndex;
                if (patternIndex != undefined) this.algorithmStepBuilder.setPatternIndex = patternIndex;

                const additional = new BruteForceAdditionalVariables();
                additional.type = "BruteForceAdditionalVariables";
                if (startingPoint !=  undefined) additional.startingPoint = startingPoint;
                if (textLength) additional.textLength = textLength;
                if (patternLength) additional.patternLength = patternLength;
                this.algorithmStepBuilder.setAdditional = additional;

                this.addStep(this.algorithmStepBuilder.build());
                this.algorithmStepBuilder.setDefaults();
            });
        }

        addWhileLoopStep(textIndex : number , patternIndex : number) : void {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setPseudocodeLine = 7;
            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.PROCESSING;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = (previousStep.type != AlgorithmStepTypeConstants.MISMATCH) ? [...previousStep.alreadyMatchedIndexesInPattern] :[];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = (previousStep.type != AlgorithmStepTypeConstants.MISMATCH) ? [...previousStep.alreadyMatchedIndexesInText] :[];
            this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        addCheckStep(textIndex : number , patternIndex : number) : void {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setPseudocodeLine = 8;
            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.COMPARISON;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setCommand = "Checking if the 2 characters match";

            let letterDraw = new LetterDraw();
            letterDraw.colour = MatchingAlgorithmColourConstants.CHECKING;
            letterDraw.index = patternIndex;
            letterDraw.weight = 4;

            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern, letterDraw];

            letterDraw = new LetterDraw();
            letterDraw.colour = MatchingAlgorithmColourConstants.CHECKING;
            letterDraw.index = textIndex;
            letterDraw.weight = 4;


            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText , letterDraw];
            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        addMatchStep(textIndex : number , patternIndex : number) {
            const previousStep = this.stepsGetter[this.stepsLength -  1];

            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.COMPARISON;
            this.algorithmStepBuilder.setPseudocodeLine = 9;
            this.algorithmStepBuilder.setPatternIndex = previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = previousStep.textIndex;
            this.algorithmStepBuilder.setCommand = "Found a character match - move to next character in text";

            let letterDraw = new LetterDraw();
            letterDraw.colour = MatchingAlgorithmColourConstants.MATCH;
            letterDraw.index = previousStep.patternIndex;
            letterDraw.weight = 4;

            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = this.replaceLetterDraw(previousStep.alreadyMatchedIndexesInPattern , letterDraw);

            letterDraw = new LetterDraw();
            letterDraw.colour = MatchingAlgorithmColourConstants.MATCH;
            letterDraw.index = previousStep.textIndex;
            letterDraw.weight = 4;

            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = this.replaceLetterDraw(previousStep.alreadyMatchedIndexesInText , letterDraw);


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

            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.COMPARISON;
            this.algorithmStepBuilder.setPseudocodeLine = 11;
            this.algorithmStepBuilder.setPatternIndex = previousStep.patternIndex;
            this.algorithmStepBuilder.setTextIndex = previousStep.textIndex;
            this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";


            let letterDraw = new LetterDraw();
            letterDraw.colour = MatchingAlgorithmColourConstants.MISMATCH;
            letterDraw.index = previousStep.patternIndex;
            letterDraw.weight = 4;

            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [letterDraw];

            letterDraw = new LetterDraw();
            letterDraw.colour = MatchingAlgorithmColourConstants.MISMATCH;
            letterDraw.index = previousStep.textIndex;
            letterDraw.weight = 4;


            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [letterDraw];

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 12;
            this.algorithmStepBuilder.setPatternIndex = 0;
            this.algorithmStepBuilder.setCommand = "Reset pattern index to 0";

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 13;
            this.algorithmStepBuilder.setCommand = "Increment starting point of comparison to next element of text";

            const additional = new BruteForceAdditionalVariables();
            additional.type = "BruteForceAdditionalVariables";
            additional.startingPoint = this.startingPoint;
            this.algorithmStepBuilder.setAdditional = additional;

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 14;
            this.algorithmStepBuilder.setType = AlgorithmStepTypeConstants.MISMATCH;
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
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText];
            this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";

            this.addStep(this.algorithmStepBuilder.build());

            this.algorithmStepBuilder.setPseudocodeLine = 19;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInPattern = [...previousStep.alreadyMatchedIndexesInPattern];
            this.algorithmStepBuilder.setAlreadyMatchedIndexesInText = [...previousStep.alreadyMatchedIndexesInText];
            this.algorithmStepBuilder.setCommand = "Report that there has been a match";

            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        private addNoSolutionStep(textIndex : number , patternIndex : number) {
            this.algorithmStepBuilder.setPseudocodeLine = 21;
            this.algorithmStepBuilder.setPatternIndex = patternIndex;
            this.algorithmStepBuilder.setTextIndex = textIndex;
            this.algorithmStepBuilder.setCommand = "No match !";
            this.algorithmStepBuilder.setHighlightPattern = true;
            this.algorithmStepBuilder.setHighlightPattern = true;

            this.addStep(this.algorithmStepBuilder.build());
            this.algorithmStepBuilder.setDefaults();
        }

        replaceLetterDraw(toHighlight :  LetterDraw[] , newLetterDraw : LetterDraw) : LetterDraw[] {
            toHighlight = toHighlight.filter(letterDraw => {
                return letterDraw.index !== newLetterDraw.index;
            });
            console.log("Fixing highlights")
            console.log(toHighlight);
            toHighlight.push(newLetterDraw);
            return toHighlight;
        }

        // additionalToExport() : BruteForceAdditionalVariables {
        //     const additional : BruteForceAdditionalVariables = {
        //         startingPoint : this.startingPoint,
        //     }
        //     return additional;
        // }
}