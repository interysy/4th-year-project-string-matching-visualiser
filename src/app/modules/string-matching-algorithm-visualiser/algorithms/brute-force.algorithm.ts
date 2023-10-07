import { StringMatchingAlgorithm } from "../models/algorithm.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class BruteForceAlgorithm extends StringMatchingAlgorithm {

        workOutSteps(text : string , pattern : string) : number {
            const textLength = text.length;
            const patternLength = pattern.length;
            this.textLength = textLength;
            this.patternLength = patternLength;
            let startingPoint = 0;
            let textIndex = 0;
            let patternIndex = 0;

            while (startingPoint <= textLength - patternLength && patternIndex < patternLength) {
                if (text.charAt(textIndex) === pattern.charAt(patternIndex)) {
                    textIndex++;
                    patternIndex++;
                } else {
                    patternIndex = 0;
                    startingPoint += 1;
                    textIndex = startingPoint;
                }
            }
            if (patternIndex === patternLength) {
                return startingPoint;
            }
            return -1;
        }
}