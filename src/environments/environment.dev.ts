import { BoyerMooreAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/boyer-moore.algorithm";
import { BruteForceAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm";
import { LastOccuranceTableDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/last-occurance.drawer.decorator";
import { TextAndPatternDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/text-pattern.drawer.decorator";

export const environment = {
  githubLink : "https://github.com/interysy/4th-year-project-string-matching-visualiser",
  linkedinLink : "https://www.linkedin.com/in/michal-wozniak-9a2474240",
  logo : "../../../../assets/str_vis_logo_v2.png",
  supportedAlgorithms: [
    {name : "Brute Force" , nameSlug : "brute-force" , urlParam : "bruteForce" , requiredService : BruteForceAlgorithm , decorators : [TextAndPatternDrawer] , canvas : {rows : 1 , columns : 1, layout : [{ row : 1 , col : 1, rowSpan : 1 , colSpan : 1 ,function : "drawTextAndPattern"}]}},
    {name : "Boyer Moore" ,nameSlug : "boyer-moore" , urlParam : "boyerMoore" , requiredService : BoyerMooreAlgorithm , decorators : [TextAndPatternDrawer, LastOccuranceTableDrawer] , canvas : {rows : 1 , columns : 5 , layout : [{row : 1 , col : 1, rowSpan : 1 , colSpan : 1 ,function : "drawLastOccuranceTable"}, {row : 1 , col : 2, rowSpan : 1 , colSpan : 4, function : "drawTextAndPattern"}]}},
    // {name : "Knuth-Morris-Pratt" , nameSlug : "knuth-morris-pratt" , urlParam : "knuthMorrisPratt" , requiredService : null , decorators : []},
  ]
};