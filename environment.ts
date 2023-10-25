import { BoyerMooreAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/boyer-moore.algorithm";
import { BruteForceAlgorithm } from "src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm";

export const environment = {
  supportedAlgorithms: [
    {name : "Brute Force" , nameSlug : "brute-force" , urlParam : "bruteForce" , requiredService : BruteForceAlgorithm},
    {name : "Boyer Moore" ,nameSlug : "boyer-moore" , urlParam : "boyerMoore" , requiredService : BoyerMooreAlgorithm},
    {name : "Knuth-Morris-Pratt" , nameSlug : "knuth-morris-pratt" , urlParam : "knuthMorrisPratt" , requiredService : null},
  ]
};