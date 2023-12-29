import { BoyerMooreAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/boyer-moore.algorithm";
import { BruteForceAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm";
import { KnuthMorrisPrattAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/knuth-morris-pratt.algorithm";
import { DarkBlueTheme } from "src/app/modules/string-matching-algorithm-visualiser/themes/dark-blue.theme";
import { DarkGreenTheme } from "src/app/modules/string-matching-algorithm-visualiser/themes/dark-green.theme";
import { DefaultTheme } from "src/app/modules/string-matching-algorithm-visualiser/themes/default.theme";
import { BorderTableDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/border-table.drawer";
import { LegendDrawer } from "src/app/modules/string-matching-algorithm-visualiser/drawers/legend.drawer";

export const environment = {
  githubLink : "https://github.com/interysy/4th-year-project-string-matching-visualiser",
  linkedinLink : "https://www.linkedin.com/in/michal-wozniak-9a2474240",
  logo : "../../../../assets/str_vis_logo_v2.png",
  supportedAlgorithms: [
    {name : "Brute Force" , nameSlug : "brute-force" , urlParam : "bruteForce" , requiredService : BruteForceAlgorithm , decorators : [LegendDrawer]},
    {name : "Boyer Moore" ,nameSlug : "boyer-moore" , urlParam : "boyerMoore" , requiredService : BoyerMooreAlgorithm , decorators : [LegendDrawer], prePreprocessingCanvas : true, preProcessingFunction : "drawLastOccurrenceTable"},
    {name : "Knuth-Morris-Pratt" , nameSlug : "knuth-morris-pratt" , urlParam : "knuthMorrisPratt" , requiredService : KnuthMorrisPrattAlgorithm , decorators : [BorderTableDrawer , LegendDrawer] , prePreprocessingCanvas : true, preProcessingFunction : "drawBorderTable"},
  ],
  additionalVariablesToExclude : [
    "textLength",
    "patternLength",
    "textIndex",
    "patternIndex",
    "lastOccuranceTable",
    "borderTable",
    "borderOne",
    "borderTwo"
  ],
  themes : {
    "base" : {colorOne : "#FFFFFF" , colorTwo : "#E3E5EA", themeObject : DefaultTheme},
    "theme-dark-green" : {colorOne : "#2D333B" , colorTwo : "#29FD2F" , themeObject : DarkGreenTheme},
    "theme-dark-blue" : {colorOne : "#2D333B" , colorTwo : "#1B7CED", themeObject : DarkBlueTheme}
  }
};