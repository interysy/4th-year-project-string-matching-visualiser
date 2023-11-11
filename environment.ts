import { BoyerMooreAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/boyer-moore.algorithm";
import { BruteForceAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm";
import { LastOccuranceTableDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/last-occurance.drawer.decorator";
import { TextAndPatternDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/text-pattern.drawer.decorator";

export const environment = {
  supportedAlgorithms: [
    {name : "Brute Force" , nameSlug : "brute-force" , urlParam : "bruteForce" , requiredService : BruteForceAlgorithm , decorators : [TextAndPatternDrawer]},
    {name : "Boyer Moore" ,nameSlug : "boyer-moore" , urlParam : "boyerMoore" , requiredService : BoyerMooreAlgorithm , decorators : [TextAndPatternDrawer, LastOccuranceTableDrawer]},
  ]
};