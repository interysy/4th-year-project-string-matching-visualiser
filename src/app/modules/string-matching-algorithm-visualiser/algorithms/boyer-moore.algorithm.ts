import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { Injectable } from "@angular/core";
import { AlgorithmStepBuilder } from "../model-builders/algorithm-step.builder";
import { Letter } from "../models/letter.model";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { BoyerMooreAdditionalVariables } from "../models/boyer-moore-additional-variables.model";


@Injectable({
    providedIn: 'root'
})
export class BoyerMooreAlgorithm extends StringMatchingAlgorithm {

    startingPoint : number;
    private readonly algorithmStepBuilder: AlgorithmStepBuilder = new AlgorithmStepBuilder();
    previousStep : AlgorithmStep;
    text : string;
    pattern : string;

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
            if (text.charAt(textIndex) === pattern.charAt(patternIndex)) {
                textIndex--;
                patternIndex--;
            } else {
                startingPoint += Math.max(1, patternIndex - lastOccurance[text.charAt(textIndex)]);
                textIndex += textLength - Math.min(patternIndex , 1 + lastOccurance[text.charAt(textIndex)]);
                patternIndex = textLength - 1;
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

    addSetupSteps(textLength : number , patternLength  : number ) {

        const setUpSteps  = [
            { command : "Measuring the length of the text" , highlightText : true , textLength : textLength },
            { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : patternLength },
            { command : "Initialising the starting point to 0", startingPoint: 0 },
            { command : `Initialising the text index to ${patternLength - 1}` , textIndex : textLength - 1  },
            { command : `Initialising the pattern index to ${patternLength - 1}`  ,  textIndex  : 0 , patternIndex : patternLength - 1 },
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