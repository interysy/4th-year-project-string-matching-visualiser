import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { Injectable } from "@angular/core";
import { Letter } from "../models/letter.model";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { BoyerMooreAdditionalVariables } from "../models/boyer-moore-additional-variables.model";


@Injectable({
    providedIn: 'root'
})
export class BoyerMooreAlgorithm extends StringMatchingAlgorithm {

    private startingPoint : number;

    public workOutSteps(text : string , pattern : string) : number {
        const textLength = text.length;
        const patternLength = pattern.length;
        this.text = text;
        this.pattern = pattern;
        let startingPoint = 0;
        this.startingPoint = startingPoint;
        let textIndex = patternLength - 1;
        let patternIndex = patternLength - 1;
        this.addSetupSteps(textLength , patternLength);

        const lastOccurance = this.setUpLastOccuranceDictionary(pattern);

        while (startingPoint <= (textLength - patternLength) && patternIndex >= 0) {
            this.addWhileLoopStep(textIndex , patternIndex);
            this.addCheckStep(textIndex , patternIndex);
            if (text.charAt(textIndex) === pattern.charAt(patternIndex)) {
                textIndex--;
                patternIndex--;
                this.addMatchStep(textIndex , patternIndex);
            } else {
                const occurance = (lastOccurance[text.charAt(textIndex)] === undefined) ? 0  : lastOccurance[text.charAt(textIndex)];
                startingPoint += Math.max(1, patternIndex - occurance);
                textIndex += (patternLength - Math.min(patternIndex , 1 + occurance));
                patternIndex = patternLength - 1;
                this.addMismatchStep(startingPoint , startingPoint , patternIndex);
            }
        }

        if (patternIndex < 0) return startingPoint; else return -1;
    }

    private setUpLastOccuranceDictionary(pattern : string) : { [character : string] : number; } {
        const lastOccuranceDictionary : { [character : string] : number; } = {};
        pattern.split("").forEach(character => {
            if (lastOccuranceDictionary[character] === undefined) lastOccuranceDictionary[character] = pattern.lastIndexOf(character);
        });

        return lastOccuranceDictionary;
    }

    addSetupSteps(textLength : number , patternLength  : number) {

        const setUpSteps  = [
            { command : "Measuring the length of the text" , highlightText : true , textLength : textLength },
            { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : patternLength },
            { command : "Initialising the starting point to 0", startingPoint: 0 },
            { command : `Initialising the text index to ${textLength - 1}` , textIndex : textLength - 1  },
            { command : `Initialising the pattern index to ${patternLength - 1}`  ,  textIndex  : textLength - 1 , patternIndex : patternLength - 1 },
        ]

        setUpSteps.forEach(({ command , highlightText , highlightPattern , textLength , patternLength , startingPoint, textIndex , patternIndex} , index) => {
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

            const additional = new BoyerMooreAdditionalVariables();
            if (startingPoint !=  undefined) additional.startingPoint = startingPoint;
            if (textLength) additional.textLength = textLength;
            if (patternLength) additional.patternLength = patternLength;
            this.algorithmStepBuilder.setAdditional = additional;
            const step = this.algorithmStepBuilder.build();
            this.addStep(step);
            this.algorithmStepBuilder.setDefaults();
            this.previousStep = step;
        });
    }


    addWhileLoopStep(textIndex : number , patternIndex : number) : void {

        this.algorithmStepBuilder.setPseudocodeLine = 9;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
        const currentStep = this.algorithmStepBuilder.build();
        this.addStep(currentStep);
        this.algorithmStepBuilder.setDefaults();

        this.previousStep = currentStep;
    }

    addCheckStep(textIndex : number , patternIndex : number) : void {

        this.algorithmStepBuilder.setPseudocodeLine = 10;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;

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

    addMatchStep(textIndex : number , patternIndex : number) {

        this.algorithmStepBuilder.setPseudocodeLine = 11;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setCommand = "Found a character match - move one character left in text";


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

        this.algorithmStepBuilder.setPseudocodeLine = 11;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setCommand = "Move one character left in pattern";

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;
        this.algorithmStepBuilder.setDefaults();
        this.letterBuilder.setDefaults();
        this.previousStep = step;
    }

    addMismatchStep(startingPoint : number , textIndex : number , patternIndex : number) {

        this.algorithmStepBuilder.setPseudocodeLine = 13;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setCommand = "No character match found, enter the else block";

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

        this.algorithmStepBuilder.setPseudocodeLine = 14;
        this.algorithmStepBuilder.setPatternIndex = 0;
        this.algorithmStepBuilder.setCommand = "Set starting point to lastOccurance of character in text or the next character in text";
        this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , MatchingAlgorithmColourConstants.DEFAULT , 1);
        this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , MatchingAlgorithmColourConstants.DEFAULT , 1);

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setPseudocodeLine = 15;
        this.algorithmStepBuilder.setCommand = "Set text index to last in text when pattern will be shifted to the right";

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setPseudocodeLine = 16;
        this.algorithmStepBuilder.setCommand = "Increment starting point of comparison to next element of text";
        this.algorithmStepBuilder.setPatternOffset = textIndex;

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;
    }

    highlightEntireLine(stringToHighlight : string , colour : MatchingAlgorithmColourConstants, weight : number) : Letter[] {
        return stringToHighlight.split("").map((char , index) => {
            const letter = new Letter();
            letter.index = index;
            letter.letter = char;
            letter.colour = colour;
            letter.strokeWeight = weight;
            return letter;
        });
    }

    replaceLetter(toHighlight :  Letter[] , newLetterDraw : Letter) : Letter[] {
        toHighlight = toHighlight.filter(letterDraw => {
            return letterDraw.index !== newLetterDraw.index;
        });
        toHighlight.push(newLetterDraw);
        return toHighlight;
    }
}