# Third Supervisor Meeting - 10/10/23

## What Have I Done Since Last Meeting?
- refactored the current step model
- implemented playback functionality prototype - this include play,pause, step forward, step back and reset (unstyled)
- fixed error with p5js library not loading on initiation, it does not happen anymore, although very rarely there is another error which I haven't been able to reproduce or diagnose
- ended up choosing p5.js as it is a library built on top of HTMLCanvas and is very easy to use, while also
- implemented the base animations for the BM algorithm
- added midstep highlighting - ask for feedback on this

## Plan From Last Week and What Has Been Therefore Done

Whole proposed plan from last week completed. Currently the functionality part is going ok, but non-functional requirements are not - currently there are bugs with dependency injection (cannot reset p5js canvas upon change of page).

## Questions
- feedback on animation - what can I add ? I feel like something is missing.
- how do you think the pre-processing steps are to be shown - BM and KMP
- currently the play functionality is a while loop ,which after pressing pause will continue highlighting step until the condition is checked again, this lead toa delay. I am unsure on how to handle this and make the software pause immediately.

## Proposed Plan
- implement any visual changes to be proposed by Gethin
- implement pre-processing visualisation steps for BM
- fix bugs with dependency injection
- fix bugs with variable displayer - mainly additional variables not being displayed (loop through all additional and display - do not change value if no new value is passed across)
- potentially start implementing the KMP algorithm