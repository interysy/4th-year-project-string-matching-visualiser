# Third Supervisor Meeting - 10/10/23

## What Have I Done Since Last Meeting?
- explored various visualisation libraries - anime.js, tracers.js, HTMLCanvas , p5.js
- ended up choosing p5.js as it is a library built on top of HTMLCanvas and is very easy to use, while also providing plenty of novel functionality on top of the canvas
- I refactored the implementation of the service, brute force and any related builder files.
- Implemented the visualisation for the brute force algorithm (will need a bit of refactoring to clean up the code- especially in the drawing service)
        - The refactoring will include step parsing in the algorithm visualiser component
        - The refactoring will include drawing service (a lot of hardcoded values - extract to visualiser and make sure methods do one thing only)


## Plan From Last Week and What Has Been Therefore Done

Whole proposed plan has been completed, albeit the implementation is not quite clean up and refactoring will be necessary! Main refactoring is to take place in the drawing service.

## Questions
- I have a little bit of an issue with my deployment. Unfortunately adding the p5.js library means my deployment server cannot build automatically as the resultant webapp is too big - not sure how to handle this (change library , change server or build manually and upload when required?)
- what do you think of the current state of the animation (ask for honest feedback)

## Proposed Plan
- refactor the drawing service and visualiser (might need refactoring and creating documentation of what the steps should look like)
- do something regarding deployment (decide at the meeting as unsure)
- implement any suggestions Gethin may have regarding the animation so far
- implement visualisation for the kmp algorithm