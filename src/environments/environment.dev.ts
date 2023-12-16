import { BoyerMooreAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/boyer-moore.algorithm";
import { BruteForceAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm";
import { KnuthMorrisPrattAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/knuth-morris-pratt.algorithm";
import { BorderTableDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/border-table.drawer";
import { LastOccuranceTableDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/last-occurance.drawer.decorator";
import { TextAndPatternDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/text-pattern.drawer.decorator";

export const environment = {
  githubLink : "https://github.com/interysy/4th-year-project-string-matching-visualiser",
  linkedinLink : "https://www.linkedin.com/in/michal-wozniak-9a2474240",
  logo : "../../../../assets/str_vis_logo_v2.png",
  supportedAlgorithms: [
    {name : "Brute Force" , nameSlug : "brute-force" , urlParam : "bruteForce" , requiredService : BruteForceAlgorithm , decorators : [TextAndPatternDrawer]},
    {name : "Boyer Moore" ,nameSlug : "boyer-moore" , urlParam : "boyerMoore" , requiredService : BoyerMooreAlgorithm , decorators : [TextAndPatternDrawer, LastOccuranceTableDrawer], prePreprocessingCanvas : true, preProcessingFunction : "drawLastOccurrenceTable"},
    {name : "Knuth-Morris-Pratt" , nameSlug : "knuth-morris-pratt" , urlParam : "knuthMorrisPratt" , requiredService : KnuthMorrisPrattAlgorithm , decorators : [BorderTableDrawer] , prePreprocessingCanvas : true, preProcessingFunction : "drawBorderTable"},
  ]
};