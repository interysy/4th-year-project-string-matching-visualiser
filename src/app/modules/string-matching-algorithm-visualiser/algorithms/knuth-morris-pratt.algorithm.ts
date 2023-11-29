import { StringMatchingAlgorithm } from "../models/algorithm.model";



export class KnuthMorrisPrattAlgorithm extends StringMatchingAlgorithm {
        protected override addSetupSteps(textLength: number, patternLength: number): void {
            throw new Error("Method not implemented.");
        }


        public workOutSteps(text : string , pattern : string) : number {
           const textLength = text.length;
           const patternLength = pattern.length;
           let patternIndex = 0;
           let textIndex = 0;

           const borderTable = this.createBorderTable(pattern , patternLength);

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

        createBorderTable(pattern : string , patternLength : number) : number[] {
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
            console.log(borderTable);
            return borderTable;

        }


}