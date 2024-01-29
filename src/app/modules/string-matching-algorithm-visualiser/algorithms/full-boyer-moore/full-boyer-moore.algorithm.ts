import { LetterBuilder } from "../../model-builders/letter.builder";
import { FullBoyerMooreAdditionalVariables } from "../../models/full-boyer-moore-additional-variables.model";
import { Letter } from "../../models/letter.model";
import { StringMatchingAlgorithm } from "../algorithm.model";



export class FullBoyerMoore extends StringMatchingAlgorithm {

    override additionalVariables : FullBoyerMooreAdditionalVariables = new FullBoyerMooreAdditionalVariables();


    public override workOutSteps(text: string, pattern: string): number {
        this.pattern = pattern;
        this.text = text;
        this.textIndex = pattern.length - 1;
        this.patternIndex = pattern.length - 1;

        this.algorithmStepBuilder.setDefaults();
        this.addStep(false, false);
        this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(pattern, "DEFAULT" , 1);
        this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(text, "DEFAULT" , 1);

        console.log("Current text is " , text);
        console.log("Current pattern is " , pattern);

        const lastOccurrenceTable = this.setUpLastOccurrenceDictionary(pattern);
        const offsetTable = this.setUpOffsetTable(pattern);

        console.log(lastOccurrenceTable);
        console.log(offsetTable);

        while (this.textIndex < text.length) {
            this.addTextIterationStep();
            this.patternIndex = pattern.length - 1;
            while (this.patternIndex >= 0) {
                this.addPatternIterationStep();
                this.addCheckStep();
                if (pattern.charAt(this.patternIndex) === text.charAt(this.textIndex)) {
                    if (this.patternIndex == 0) {
                        this.addMatchStep(true);
                        console.log("Found something at " + this.textIndex);
                        return this.textIndex;
                    }
                    this.textIndex--;
                    this.patternIndex--;
                    this.addMatchStep(false);
                }
                else {
                    this.addMismatchStep();
                    break;
                }
            }

            const lastOccurrence = lastOccurrenceTable[text.charAt(this.textIndex)] != undefined ? lastOccurrenceTable[text.charAt(this.textIndex)] : -1;
            const offsetTableValue = offsetTable[pattern.length - 1 - this.patternIndex];
            this.textIndex += Math.max(offsetTableValue, lastOccurrence);

            this.updateTextIndexWithMismatch(offsetTableValue , lastOccurrence);
        }
        console.log(this.steps);

        return -1;

    }
    updateTextIndexWithMismatch(offsetTableValue : number , lastOccurrence : number) {
        this.algorithmStepBuilder.setCommand = `Comparing which method has greater shift, offsetTable = ${offsetTableValue} or lastOccurrenceTable = ${lastOccurrence}`;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.addStep(true, false);


        this.algorithmStepBuilder.setCommand = "Text index is now set to value of {}, which is " + this.textIndex;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.textIndex - this.pattern.length + 1;

        this.addStep(true, true);
    }


    addMismatchStep() {
        this.algorithmStepBuilder.setCommand = "Characters do not match!";
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;

        this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex , this.pattern.charAt(this.previousStep.patternIndex), "MISMATCH" , 1 , false , "pattern");
        this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex , this.text.charAt(this.previousStep.textIndex), "MISMATCH" , 1 , false , "text");

        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.addStep(true, false);

        this.algorithmStepBuilder.setCommand = "Resetting patternIndex value, now equal to length of pattern";
        this.addStep(true, true);
    }
    addTextIterationStep() {
        this.algorithmStepBuilder.setCommand = "Iterating through text, currently at " + this.textIndex;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.addStep(true, false);

        this.algorithmStepBuilder.setCommand = "Resetting patternIndex value, now equal to length of pattern";
        this.addStep(true, true);
    }


    addPatternIterationStep() {
        this.algorithmStepBuilder.setCommand = "Iterating through pattern, currently at " + this.patternIndex;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.addStep(true, true);
   }

   addCheckStep() {
        this.algorithmStepBuilder.setCommand = "Checking match between text and pattern";
        this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex, this.pattern.charAt(this.previousStep.patternIndex) , "CHECKING" , 1 , false , "pattern");
        this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex , this.text.charAt(this.previousStep.textIndex) , "CHECKING" , 1 , false , "text");
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.addStep(true, true);
   }


   addMatchStep(fullMatch : boolean) {
    this.algorithmStepBuilder.setCommand = "Characters match!";
    this.createLetterUsingBuilderUsingPrev(this.previousStep.patternIndex, this.pattern.charAt(this.previousStep.patternIndex) , "MATCH" , 1 , false , "pattern");
    this.createLetterUsingBuilderUsingPrev(this.previousStep.textIndex , this.text.charAt(this.previousStep.textIndex) , "MATCH" , 1 , false , "text");
    this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
    this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
    this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
    this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
    this.addStep(true, false);


    this.algorithmStepBuilder.setCommand = "Checking for full match - is j 0?";
    this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern, "CHECKING" , 1);
    this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "CHECKING", 1);
   // this.algorithmStepBuilder.setLettersInText = this.highlightSubstringOfLine(LetterBuilder.highlightEntireLine(this.text , "DEFAULT",1) , "CHECKING" , this.textIndex - this.pattern.length + 1 , this.textIndex + 1);
    this.addStep(false, false);

    if (fullMatch) {
        this.algorithmStepBuilder.setCommand = "Fully matched!";
        this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern, "MATCH" , 1);
        this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(this.text , "MATCH", 1);
        // this.algorithmStepBuilder.setLettersInText = this.highlightSubstringOfLine(this.previousStep.lettersInText , "MATCH" , this.textIndex - this.pattern.length + 1 , this.textIndex);
        this.addStep(false, false);
    } else {

        this.algorithmStepBuilder.setCommand = "Moving left in text";
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.algorithmStepBuilder.setTextIndex = this.textIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.addStep(true, false);

        this.algorithmStepBuilder.setCommand = "Moving left in pattern";
        this.algorithmStepBuilder.setPatternIndex = this.patternIndex;
        this.addStep(true, true);
    }

   }

   checkFullMatchStep() {
        this.algorithmStepBuilder.setCommand = "Checking for full match - is j 0?";
        this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(this.pattern, "CHECKING" , 1);
        this.algorithmStepBuilder.setLettersInText = this.highlightSubstringOfLine(this.previousStep.lettersInText , "CHECKING" , this.textIndex - this.pattern.length + 1 , this.textIndex);
        this.algorithmStepBuilder.setTextIndex = this.previousStep.textIndex;
        this.algorithmStepBuilder.setPatternIndex = this.previousStep.patternIndex;
        this.algorithmStepBuilder.setPatternOffset = this.previousStep.patternOffset;
        this.addStep(true, true);
   }

   private highlightSubstringOfLine(letters : Letter[] , colour : string , start : number , end : number) {
    return letters.map(letter => {
        if (letter.index >= start && letter.index <= end) {
            letter.colour = colour;
        }
        return letter;
    });
}

    private setUpLastOccurrenceDictionary(pattern : string) : { [character : string] : number; } {
        const lastOccurrenceDictionary : { [character : string] : number; } = {};
            pattern.split("").forEach((character, index) => {
                if (lastOccurrenceDictionary[character] === undefined) {
                    lastOccurrenceDictionary[character] = pattern.lastIndexOf(character);
                }
            });

            this.algorithmStepBuilder.setCommand = "Building last occurrence table";
            this.addStep(true, true);
            return lastOccurrenceDictionary;
    }

    private setUpOffsetTable(pattern : string) : number[] {
        const table = new Array(pattern.length + 1);
        let lastPrefixPosition = pattern.length;

        for (let i = pattern.length; i > 0; --i) {
            if (this.isPrefix(pattern, i)) {
                lastPrefixPosition = i;
        }
        table[pattern.length - i] = lastPrefixPosition - i + pattern.length;            }
        for (let i = 0; i < pattern.length - 1; ++i) {
            const slen = this.suffixLength(pattern, i);
            table[slen] = pattern.length - 1 - i + slen;
        }

        this.algorithmStepBuilder.setCommand = "Building offset table";
        this.algorithmStepBuilder.setLettersInPattern = this.previousStep.lettersInPattern;
        this.algorithmStepBuilder.setLettersInText = this.previousStep.lettersInText;
        this.addStep(true, true);
        return table;
    }

    private isPrefix(pattern : string, p : number) : boolean {
        for (let i = p, j = 0; i < pattern.length; ++i, ++j) {
            if (pattern.charAt(i) != pattern.charAt(j)) {
                return false;
            }
        }
        return true;
    }

    private suffixLength(pattern : string, p : number) {
        let len = 0;
        for (let i = p, j = pattern.length - 1;
            i >= 0 && pattern[i] == pattern[j]; --i, --j) {
            len += 1;
        }
        return len;
    }


    protected override addSetupSteps(): void {
        throw new Error("Method not implemented.");
    }
    protected override addWhileLoopStep(): void {
        throw new Error("Method not implemented.");
    }
    protected override addFullMatchStep(): void {
        throw new Error("Method not implemented.");
    }
    protected override addNoSolutionStep(): void {
        throw new Error("Method not implemented.");
    }
    protected override resetAdditionalVariables(): void {
        throw new Error("Method not implemented.");
    }

}