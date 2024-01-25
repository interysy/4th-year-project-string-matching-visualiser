import { StringMatchingAlgorithm } from "../algorithm.model";
import { BoyerMooreAdditionalVariables } from "../../models/boyer-moore-additional-variables.model";
import { LetterBuilder } from "../../model-builders/letter.builder";
import { AlgorithmStep } from "../../models/algorithm-step.model";
import { environment } from "src/environments/environment.dev";

export class BoyerMooreAlgorithm extends StringMatchingAlgorithm {

    override algorithmNameSlug = "boyer-moore";
    override additionalVariables : BoyerMooreAdditionalVariables = new BoyerMooreAdditionalVariables();

    public workOutSteps(text : string , pattern : string) : number {
        this.text = text;
        this.pattern = pattern;

        this.additionalVariables.textLength = text.length;
        this.additionalVariables.patternLength = pattern.length;
        this.additionalVariables.startingPoint = 0;

        this.textIndex = this.additionalVariables.patternLength - 1;
        this.patternIndex = this.additionalVariables.patternLength - 1;
        this.addSetupSteps();

        const lastOccurance = this.setUpLastOccurrenceDictionary(pattern);
        this.additionalVariables.lastOccurrenceTable = lastOccurance;


        while (this.additionalVariables.startingPoint <= (this.additionalVariables.textLength - this.additionalVariables.patternLength) && this.patternIndex >= 0) {
            this.addWhileLoopStep();
            this.addCheckStep();
            if (text.charAt(this.textIndex) === pattern.charAt(this.patternIndex)) {
                this.textIndex--;
                this.patternIndex--;
                this.addMatchStep();
            } else {
                const occurance = (lastOccurance[this.text.charAt(this.textIndex)] === undefined) ? -1  : lastOccurance[text.charAt(this.textIndex)];
                const lastOccuranceCharacter = text.charAt(this.textIndex);
                const mismatchCase = this.boyerMooreMismatchCase(this.patternIndex , occurance);
                this.additionalVariables.startingPoint += Math.max(1, this.patternIndex - occurance);
                this.textIndex += (this.additionalVariables.patternLength - Math.min(this.patternIndex , 1 + occurance));
                this.patternIndex = this.additionalVariables.patternLength - 1;
                this.addMismatchStep(mismatchCase , occurance , lastOccuranceCharacter);
            }
        }

        if (this.patternIndex < 0) {
            this.addFullMatchStep();
            return this.additionalVariables.startingPoint;
        } else {
            this.addNoSolutionStep();
            return -1;
        }
    }


    private setUpLastOccurrenceDictionary(pattern : string) : { [character : string] : number; } {
        const lastOccurrenceDictionary : { [character : string] : number; } = {};

        this.algorithmStepBuilder.setPseudocodeLine = 8;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setCommand = "Creating a last occurrence dictionary";
        this.algorithmStepBuilder.setAdditional = this.previousStep.additional;

        this.addStep(true,false);

        this.algorithmStepBuilder.setExtra = true;
        pattern.split("").forEach((character, index) => {

            this.previousStep.lettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "DEFAULT", 1);
            this.additionalVariables.lastOccurrenceToHighlight = "";
            this.createLetterUsingBuilderUsingPrev(index, character, "CHECKING", 1 , false, "pattern");
            this.algorithmStepBuilder.setPseudocodeLine = 8;
            this.algorithmStepBuilder.setCommand = `Checking last occurrence for ${character}`;
            this.additionalVariables.lastOccurrenceTable = lastOccurrenceDictionary;
            this.algorithmStepBuilder.setAdditional = this.additionalVariables;

            this.addStep(true,false);

            if (lastOccurrenceDictionary[character] === undefined) {
                lastOccurrenceDictionary[character] = pattern.lastIndexOf(character);
                this.createLetterUsingBuilderUsingPrev(lastOccurrenceDictionary[character], character , "MATCH", 4, false, "pattern");

                this.algorithmStepBuilder.setCommand = `Last occurrence of ${character} is ${lastOccurrenceDictionary[character]}`;
                this.additionalVariables.lastOccurrenceTable = lastOccurrenceDictionary;
                this.additionalVariables.lastOccurrenceToHighlight = character;
                this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                this.addStep(true, false);
            } else {
                this.createLetterUsingBuilderUsingPrev(lastOccurrenceDictionary[character], character , "MATCH", 4, false, "pattern");
                this.algorithmStepBuilder.setCommand = `${character} already exists in the last occurrence table`;
                this.additionalVariables.lastOccurrenceToHighlight = character;
                this.algorithmStepBuilder.setAdditional = this.additionalVariables;
                this.addStep(true, false);
            }

        });


        this.algorithmStepBuilder.setDefaults();
        this.additionalVariables.lastOccurrenceTable = lastOccurrenceDictionary;
        this.additionalVariables.lastOccurrenceToHighlight = "";
        return lastOccurrenceDictionary;
    }

    protected addSetupSteps() : void {

        let tempAdditional;

        const setUpSteps  = [
            { textLength : -1 , patternLength : -1 , startingPoint : -1 },
            { command : "Measuring the length of the text" , highlightText : true , textLength : this.additionalVariables.textLength },
            { command : "Measuring the length of the pattern" , highlightPattern : true , patternLength : this.additionalVariables.patternLength },
            { command : "Initialising the starting point to 0", startingPoint: this.additionalVariables.startingPoint },
            { command : `Initialising the text index to ${this.additionalVariables.patternLength - 1}` , textIndex : this.additionalVariables.patternLength - 1  },
            { command : `Initialising the pattern index to ${this.additionalVariables.patternLength - 1}` , patternIndex : this.additionalVariables.patternLength - 1 },
        ]

        setUpSteps.forEach(({ command , highlightText , highlightPattern , textLength , patternLength , startingPoint, textIndex , patternIndex} , index) => {
            this.algorithmStepBuilder.setPseudocodeLine = index + 1;

            if (this.previousStep) tempAdditional = this.algorithmStepBuilder.createDeepCopy(this.previousStep).additional; else tempAdditional = new BoyerMooreAdditionalVariables();

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
            if (startingPoint !=  undefined) tempAdditional["startingPoint"] = startingPoint;
            if (textLength != undefined) tempAdditional.textLength = textLength;
            if (patternLength != undefined) tempAdditional.patternLength = patternLength;
            this.algorithmStepBuilder.setAdditional = tempAdditional;

            this.addStep(true,false);
        });

        this.algorithmStepBuilder.setDefaults();
    }


    protected addWhileLoopStep() : void {
        this.algorithmStepBuilder.setPseudocodeLine = 10;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setCommand = "Looping through the pattern and text looking for a match";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;
        this.addStep(true,true);
    }

    protected addCheckStep() : void {
        this.algorithmStepBuilder.setPseudocodeLine = 11;
        this.algorithmStepBuilder.setCommand = "Checking if the 2 characters match";
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;


        this.createLetterUsingBuilderUsingPrev(this.textIndex,this.text.charAt(this.textIndex), "CHECKING", 4 ,false, "text");
        this.createLetterUsingBuilderUsingPrev(this.patternIndex , this.pattern.charAt(this.patternIndex) , "CHECKING", 4 ,true, "pattern")

        this.addStep(true, true);
    }

    protected addMatchStep() : void {
        this.algorithmStepBuilder.setPseudocodeLine = 12;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setCommand = "Found a character match - move one character left in text";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex , this.pattern.charAt(this.previousStep.patternIndex) , "MATCH", 4 ,false, "pattern");
        this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex , this.text.charAt(this.previousStep.textIndex) , "MATCH", 4 ,true, "text");

        this.addStep(true, false)

        this.algorithmStepBuilder.setPseudocodeLine = 13;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setCommand = "Move one character left in pattern";

        this.addStep(true , true);
    }

    protected addMismatchStep(mismatchCase : number , lastOccurance : number , lastOccuranceCharacter : string) : void {

        this.algorithmStepBuilder.setPseudocodeLine = 14;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setCommand = "No character match found, enter the else block.";
        this.algorithmStepBuilder.setAdditional = this.previousStep.additional;


        this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex , this.pattern.charAt(this.previousStep.patternIndex) , "MISMATCH", 4 ,false, "pattern");
        this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex ,this.text.charAt(this.previousStep.textIndex), "MISMATCH", 4 ,true, "text");

        this.addStep(true , false)

        switch (mismatchCase) {
            case 1:
                this.algorithmStepBuilder.setCommand = `Set starting point to ${this.additionalVariables.startingPoint} , which is a shift right by pattern length (${this.additionalVariables.patternLength}) - index of last occurance ${lastOccurance}`;
                break;
            case 2:
                this.algorithmStepBuilder.setCommand = `Set starting point to ${this.additionalVariables.startingPoint} , which is a shift right by 1 as the last occurance is further in the pattern than current index`;
                break;
            case 3:
                this.algorithmStepBuilder.setCommand = `Set starting point to ${this.additionalVariables.startingPoint} , which is a shift right by patternLength ${this.additionalVariables.patternLength}, since there is no last occurance (so we don't need to match at any point between starting point and starting point + length of pattern)`;
                break;
        }


        this.algorithmStepBuilder.setPseudocodeLine = 15;
        this.previousStep.lettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "DEFAULT", 1);
        this.previousStep.lettersInText = LetterBuilder.highlightEntireLine(this.text , "DEFAULT", 1);
        this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex , this.pattern.charAt(this.previousStep.patternIndex) , "MISMATCH", 4 ,false, "pattern");
        this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex ,this.text.charAt(this.previousStep.textIndex), "MISMATCH", 4 ,true, "text");
        this.additionalVariables.lastOccurrenceToHighlight = lastOccuranceCharacter;
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.addStep(true, false);

        this.algorithmStepBuilder.setPseudocodeLine = 16;
        switch (mismatchCase) {
            case 1:
                this.algorithmStepBuilder.setCommand = `Set text index to ${this.textIndex} , which is a shift right by pattern length (${this.additionalVariables.patternLength}) - index of last occurance ${lastOccurance}`;
                break;
            case 2:
                this.algorithmStepBuilder.setCommand = `Set text index to ${this.textIndex} , which is a shift right by patternlength - pattern index (${this.additionalVariables.patternLength} - ${this.patternIndex})  as the last occurance is further in the pattern than current index`;
                break;
            case 3:
                this.algorithmStepBuilder.setCommand = `Set text index to ${this.textIndex} , which is a shift right by patternLength ${this.additionalVariables.patternLength}, since there is no last occurance (so we don't need to match at any point between starting point and starting point + length of pattern)`;
                break;
        }
        this.algorithmStepBuilder.setTextIndex = this.textIndex;

        this.addStep(true,false);

        this.algorithmStepBuilder.setPseudocodeLine = 17;
        this.algorithmStepBuilder.setCommand = "Set pattern index to pattern length - 1, as we want to start comparing right to left again";
        this.algorithmStepBuilder.setPatternOffset = this.additionalVariables.startingPoint;
        this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "DEFAULT", 1);
        this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "DEFAULT", 1);
        this.additionalVariables.lastOccurrenceToHighlight = "";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;


        this.addStep(true,true);
    }

    protected addFullMatchStep() {

        this.algorithmStepBuilder.setPseudocodeLine = 21;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.addStep(true, false);


        this.algorithmStepBuilder.setPseudocodeLine = 22;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setCommand = "Report that there has been a match";

        this.addStep(true, true);
    }

    protected addNoSolutionStep() {

        this.algorithmStepBuilder.setPseudocodeLine = 21;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setLettersInPattern = [...this.previousStep.lettersInPattern];
        this.algorithmStepBuilder.setLettersInText = [...this.previousStep.lettersInText];
        this.algorithmStepBuilder.setCommand = "Checking if fully matched the pattern";
        this.algorithmStepBuilder.setAdditional = this.additionalVariables;

        this.addStep(true , false);

        this.algorithmStepBuilder.setPseudocodeLine = 23;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setCommand = "No match !";
        this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "MISMATCH", 4);
        this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern , "MISMATCH", 4);

        this.addStep(true,  true);
    }


    private boyerMooreMismatchCase(patternIndex :number , occurance : number) : number {
        if (occurance === 0) return 3;
        if (occurance > patternIndex) return 2;
        return 1;
    }

    protected resetAdditionalVariables() {
        this.additionalVariables = new BoyerMooreAdditionalVariables();
    }


    // TESTER METHODS

    get matchStepsTesterGetter() : AlgorithmStep[] {
        if (environment.type == "dev") {
            this.addMatchStep();
            return this.steps;
        }
        throw new Error("Attempting to use a dev function from a non-dev environment");
    }

    public mismatchStepsTesterGetter(mismatchCase : number , lastOccurrence : number , lastOccurrenceCharacter : string) : AlgorithmStep[] {
        if (environment.type == "dev") {
            this.addMismatchStep(mismatchCase , lastOccurrence , lastOccurrenceCharacter);
            return this.steps;
        }
        throw new Error("Attempting to use a dev function from a non-dev environment");
    }

    public setupAdditionalVariablesTesterGetter(textLength : number , patternLength : number , startingPoint : number) : void {
        if (environment.type == "dev") {
            this.additionalVariables.textLength = textLength;
            this.additionalVariables.patternLength = patternLength;
            this.additionalVariables.startingPoint = startingPoint;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }
    }

    public setUpLastOcurrenceDictionaryTester(pattern: string) : { [character : string] : number; } {
        if (environment.type == "dev") {
            this.algorithmStepBuilder.setDefaults();
            this.previousStep = this.algorithmStepBuilder.build();
            return this.setUpLastOccurrenceDictionary(pattern);
        }
        throw new Error("Attempting to use a dev function from a non-dev environment");
    }

    public boyerMooreMismatchCaseTester(patternIndex :number , occurance : number) : number {
        if (environment.type == "dev") {
            return this.boyerMooreMismatchCase(patternIndex , occurance);
        }
        throw new Error("Attempting to use a dev function from a non-dev environment");
    }


}