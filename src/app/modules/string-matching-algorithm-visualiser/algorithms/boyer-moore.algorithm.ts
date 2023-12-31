import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { BoyerMooreAdditionalVariables } from "../models/boyer-moore-additional-variables.model";

export class BoyerMooreAlgorithm extends StringMatchingAlgorithm {

    private startingPoint : number;
    private lastOccuranceTable : { [character : string] : number; };
    override algorithmName = "boyer-moore";
    additionalVariables : BoyerMooreAdditionalVariables = new BoyerMooreAdditionalVariables();

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

        const lastOccurance = this.setUpLastOccuranceDictionary(pattern , patternIndex , textIndex);
        this.lastOccuranceTable = lastOccurance;

        while (startingPoint <= (textLength - patternLength) && patternIndex >= 0) {
            this.addWhileLoopStep(textIndex , patternIndex);
            this.addCheckStep(textIndex , patternIndex);
            if (text.charAt(textIndex) === pattern.charAt(patternIndex)) {
                textIndex--;
                patternIndex--;
                this.addMatchStep(textIndex , patternIndex);
            } else {
                const occurance = (lastOccurance[text.charAt(textIndex)] === undefined) ? -1  : lastOccurance[text.charAt(textIndex)];
                const lastOccuranceCharacter = text.charAt(textIndex);
                const mismatchCase = this.boyerMooreMismatchCase(patternIndex , occurance);
                startingPoint += Math.max(1, patternIndex - occurance);
                textIndex += (patternLength - Math.min(patternIndex , 1 + occurance));
                patternIndex = patternLength - 1;
                this.addMismatchStep(startingPoint , textIndex, patternIndex , mismatchCase , patternLength , occurance , lastOccuranceCharacter);
            }
        }

        if (patternIndex < 0) {
            this.addFullMatchStep(textIndex , patternIndex);
            return startingPoint;
        } else {
            this.addNoSolutionStep(textIndex , patternIndex);
            return -1;
        }
    }

    private setUpLastOccuranceDictionary(pattern : string , patternIndex : number , textIndex : number) : { [character : string] : number; } {
        const beforeBorderTableStep = JSON.parse(JSON.stringify(this.previousStep));
        const lastOccuranceDictionary : { [character : string] : number; } = {};
        this.algorithmStepBuilder.setPseudocodeLine = 8;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setCommand = "Creating a last occurance dictionary";
        let currentStep = this.algorithmStepBuilder.build();
        this.addStep(currentStep);
        this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));

        this.algorithmStepBuilder.setExtra = true;
        pattern.split("").forEach((character, index) => {
            this.letterBuilder.setColor = "CHECKING";
            this.letterBuilder.setIndex = index;
            this.letterBuilder.setLetter = character;
            this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
            this.algorithmStepBuilder.setPseudocodeLine = 8;
            this.algorithmStepBuilder.setCommand = `Checking last occurrence for ${character}`;
            this.additionalVariables.lastOccurrenceTable = lastOccuranceDictionary;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;
            currentStep = this.algorithmStepBuilder.build();
            this.addStep(currentStep);
            this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));

            if (lastOccuranceDictionary[character] === undefined) {
                lastOccuranceDictionary[character] = pattern.lastIndexOf(character);
                this.letterBuilder.setColor = "MATCH";
                this.letterBuilder.setIndex = lastOccuranceDictionary[character];
                this.letterBuilder.setLetter = character;
                this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());
                this.algorithmStepBuilder.setCommand = `Last occurrence of ${character} is ${lastOccuranceDictionary[character]}`;
                this.additionalVariables.lastOccurrenceTable = lastOccuranceDictionary;
                this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                currentStep = this.algorithmStepBuilder.build();
                this.addStep(currentStep);
                this.previousStep = JSON.parse(JSON.stringify(beforeBorderTableStep));
            }
        });


        this.algorithmStepBuilder.setDefaults();
        this.resetAdditionalVariables();
        this.additionalVariables.lastOccurrenceTable = lastOccuranceDictionary;
        this.previousStep = currentStep;

        return lastOccuranceDictionary;
    }

    protected addSetupSteps(textLength : number , patternLength  : number ) {

        const setUpSteps  = [
            { command : "Starting Boyer Moore ..." , startingPoint : -1 },
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
                this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "CHECKING", 1);
            } else {
                this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "DEFAULT", 1);
            }
            if (highlightPattern) {
                this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "CHECKING", 1);
            } else {
                this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "DEFAULT", 1);
            }

            if (textIndex != undefined) this.algorithmStepBuilder.setTextIndex = textIndex;
            if (patternIndex != undefined) this.algorithmStepBuilder.setPatternIndex = patternIndex;

            if (startingPoint !=  undefined) this.additionalVariables.startingPoint = startingPoint;
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

        this.algorithmStepBuilder.setPseudocodeLine = 10;
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

        this.algorithmStepBuilder.setPseudocodeLine = 11;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.letterBuilder.setIndex = textIndex;
        this.letterBuilder.setLetter = this.text.charAt(textIndex);
        this.letterBuilder.setColor = "CHECKING";
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

    private addMatchStep(textIndex : number , patternIndex : number) : void {

        this.algorithmStepBuilder.setPseudocodeLine = 12;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setCommand = "Found a character match - move one character left in text";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.letterBuilder.setIndex = this.previousStep.patternIndex;
        this.letterBuilder.setLetter = this.pattern.charAt(this.previousStep.patternIndex);
        this.letterBuilder.setColor = "MATCH";
        this.letterBuilder.setStrokeWeight = 4;

        this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());

        this.letterBuilder.setIndex = this.previousStep.textIndex;
        this.letterBuilder.setLetter = this.text.charAt(this.previousStep.textIndex);
        this.letterBuilder.setColor = "MATCH";
        this.letterBuilder.setStrokeWeight = 4;

        this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.previousStep.lettersInText, this.letterBuilder.build());

        let step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setPseudocodeLine = 13;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setCommand = "Move one character left in pattern";

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;
        this.algorithmStepBuilder.setDefaults();
        this.letterBuilder.setDefaults();
        this.previousStep = step;
    }

    private addMismatchStep(startingPoint : number , textIndex : number , patternIndex : number, mismatchCase : number , patternLength : number , lastOccurance : number , lastOccuranceCharacter : string) : void {

        this.algorithmStepBuilder.setPseudocodeLine = 14;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setCommand = "No character match found, enter the else block.";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.letterBuilder.setIndex = this.previousStep.patternIndex;
        this.letterBuilder.setLetter = this.pattern.charAt(this.previousStep.patternIndex);
        this.letterBuilder.setColor = "MISMATCH";
        this.letterBuilder.setStrokeWeight = 4;

        this.algorithmStepBuilder.setLettersInPattern = this.replaceLetter(this.highlightEntireLine(this.pattern,"DEFAULT", 1), this.letterBuilder.build());

        this.letterBuilder.setIndex = this.previousStep.textIndex;
        this.letterBuilder.setLetter = this.text.charAt(this.previousStep.textIndex);

        this.algorithmStepBuilder.setLettersInText = this.replaceLetter(this.highlightEntireLine(this.text,"DEFAULT", 1), this.letterBuilder.build());

        let step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;


        switch (mismatchCase) {
            case 1:
                this.algorithmStepBuilder.setCommand = `Set starting point to ${startingPoint} , which is a shift right by pattern length (${patternLength}) - index of last occurance ${lastOccurance}`;
                break;
            case 2:
                this.algorithmStepBuilder.setCommand = `Set starting point to ${startingPoint} , which is a shift right by 1 as the last occurance is further in the pattern than current index`;
                break;
            case 3:
                this.algorithmStepBuilder.setCommand = `Set starting point to ${startingPoint} , which is a shift right by patternLength ${patternLength}, since there is no last occurance (so we don't need to match at any point between starting point and starting point + length of pattern)`;
                break;
        }

        this.additionalVariables.lastOccurrenceToHighlight = lastOccuranceCharacter;
        this.algorithmStepBuilder.setPseudocodeLine = 15;
        this.algorithmStepBuilder.setPatternIndex = 0;
        this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "DEFAULT", 1);
        this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "DEFAULT", 1);
        this.additionalVariables.startingPoint = startingPoint;
        this.additionalVariables.lastOccurrenceToHighlight = lastOccuranceCharacter;
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setPseudocodeLine = 16;
        switch (mismatchCase) {
            case 1:
                this.algorithmStepBuilder.setCommand = `Set text index to ${textIndex} , which is a shift right by pattern length (${patternLength}) - index of last occurance ${lastOccurance}`;
                break;
            case 2:
                this.algorithmStepBuilder.setCommand = `Set text index to ${textIndex} , which is a shift right by patternlength - pattern index (${patternLength} - ${patternIndex})  as the last occurance is further in the pattern than current index`;
                break;
            case 3:
                this.algorithmStepBuilder.setCommand = `Set text index to ${textIndex} , which is a shift right by patternLength ${patternLength}, since there is no last occurance (so we don't need to match at any point between starting point and starting point + length of pattern)`;
                break;
        }
        this.algorithmStepBuilder.setTextIndex = textIndex;

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setPseudocodeLine = 17;
        this.algorithmStepBuilder.setCommand = "Set pattern index to pattern length - 1, as we want to start comparing right to left again";
        this.algorithmStepBuilder.setPatternOffset = startingPoint;
        this.additionalVariables.lastOccurrenceToHighlight = "";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;


        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;
    }

    private addFullMatchStep(textIndex : number , patternIndex : number) {
        this.algorithmStepBuilder.setPseudocodeLine = 21;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInPattern = [...this.previousStep.lettersInPattern];
        this.algorithmStepBuilder.setLettersInText = [...this.previousStep.lettersInText];
        this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;
        let step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;


        this.algorithmStepBuilder.setPseudocodeLine = 22;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setCommand = "Report that there has been a match";

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setDefaults();
    }

    private addNoSolutionStep(textIndex : number , patternIndex : number) {

        this.algorithmStepBuilder.setPseudocodeLine = 21;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInPattern = [...this.previousStep.lettersInPattern];
        this.algorithmStepBuilder.setLettersInText = [...this.previousStep.lettersInText];
        this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        let step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;

        this.algorithmStepBuilder.setPseudocodeLine = 23;
        this.algorithmStepBuilder.setPatternIndex = patternIndex;
        this.algorithmStepBuilder.setTextIndex = textIndex;
        this.algorithmStepBuilder.setCommand = "No match !";
        this.algorithmStepBuilder.setLettersInText = this.highlightEntireLine(this.text , "MISMATCH", 4);
        this.algorithmStepBuilder.setLettersInPattern = this.highlightEntireLine(this.pattern , "MISMATCH", 4);

        step = this.algorithmStepBuilder.build();
        this.addStep(step);
        this.previousStep = step;
        this.algorithmStepBuilder.setDefaults();
    }


    private boyerMooreMismatchCase(patternIndex :number , occurance : number) : number {
        if (occurance === 0) return 3;
        if (occurance > patternIndex) return 2;
        return 1;
    }

    resetAdditionalVariables() {
        this.additionalVariables = new BoyerMooreAdditionalVariables();
    }

}