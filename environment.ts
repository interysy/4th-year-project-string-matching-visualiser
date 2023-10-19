export const environment = {
  supportedAlgorithms: [
    {name : "Brute Force" , urlParam : "bruteForce" , requiredService : "BruteForceAlgorithm"},
    {name : "Boyer-Moore" , urlParam : "boyerMoore" , requiredService : "BoyerMooreAlgorithm"},
    {name : "Knuth-Morris-Pratt" , urlParam : "knuthMorrisPratt" , requiredService : "KnuthMorrisPrattAlgorithm"},
  ]
};