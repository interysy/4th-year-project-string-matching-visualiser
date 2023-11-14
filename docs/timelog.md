# Timelog

* String Search Algorithm Visualiser
* Michal Wozniak
* 2554268w
* Gethin Norman

## Guidance

* This file contains the time log for your project. It will be submitted along with your final dissertation.
* **YOU MUST KEEP THIS UP TO DATE AND UNDER VERSION CONTROL.**
* This timelog should be filled out honestly, regularly (daily) and accurately. It is for *your* benefit.
* Follow the structure provided, grouping time by weeks.  Quantise time to the half hour.

## Week 1

As a note this week is longer than normal, as I treat a week to be the 7 days in between supervisor meetings, which take place on tuesdays. On the first week work began before the preliminary meeting.
### 16 September

* *2 hours* Looking through existing string search animators - seeing what they have, what they're missing and what technologies are being used.

### 18 September

* *2 hours* Watch introduction video , read guidance notes, read marking scheme. Make notes on all.
* *1 hour* Prepare prelimiary meeting document, outlining what I have done so far, what are the current requirements I know of, my ideas of the project going forward, questions and my plan for the upcoming week.

### 19 September
* *1 hour* Watch video on Dijkstra algorithm visualiser
* *0.5hour* Read over preliminary meeting document in preparation for meetingv
* *20 mins* Meeting with supervisor

### 20 September
* *1 hour* Solving laptop issues regarding pip and setting up repository for the project (also applying for github pro through the student pack)
* *2 hours* Messing around with Sphinx Docs, which will be used to automatically show all my timelogs, plans etc. on Github alongside code documentation

### 21 September
* *3 hours* Setting up pipeline for automatic wiki deployment and code testing
* *1.5 hours* Research of potential deployment servers for continous deployment

### 23 September
* *1.5 hours* Dissertation introduction and motivation
* *2 hour* Continued work on dissertation motivation and the high level aims (with research)

### 24 September
* *2 hours* Learning docker and attempting to create a continous deployment pipeline to work with DigitalOcean
* *2 hours* Set up project skeleton and more work on pipelines (wiki generation , ci and cd)

### 25 September
* *1.5 hours* Work on creating initial wireframes for the project
* *2 hours* Work on adding wiki generation and ci pipeline to project repository on github

## Week 2

### 26 September

* *0.75 hours* Finish up initial wireframes for the project - these will be used for requirement gathering. Upload onto github
* *0.5 hours* Supervisor Meeting

### 27 September

* *2 hours* Working away at the build deployment pipeline (via github packages), setting up netlify for auto deployment and latex-to-pdf pipeline.

### 30 September

* *1 hour* Research about how to conduct a requirement gathering workshop and writing an initial plan for the workshop.
* *1 hour* Creation of  all ethics related documents, including intro, debriefing and consent form.

### 3 October

* *1 hour* Running requirement gathering workshop in order to gather the goals of the project
* *1 hour* Writing up the notes from workshop and creating user stories


## Week 3

### 4 October

* *15 mins* Finish up writing user stories from the day before and update timelog
* *1.5 hours* Messing around with HTML Canvas, managed to get some animations working aswell as pausing, playing and code highlighting.

### 5 October

* *15 mins* Adding missing user stories to GitHub Kanban board

* *1.5 hours* Creating a final wireframe to work off of, based on requirements gathered from the workshop.
* *2 hours* Adding tailwind.css, working on the navbar and creating initial structure of directories and files within the angular project.

### 6 October

* *3 hours* First attempt at creating pseudocode walkthrough for brute force algorithm. Also added tailwind and made a navbar to allow for easy navigation while developing!
### 7 October
* *4 hours* Implement pseduocode walkthrough for brute force algorithm, including code highlighting. Also implement showing variable values and the relevant message to be shown about what is happening at each step of the algorithm. All features now show up as we press play.

### 10 October

* *0.5 hours* Preparing documents for the supervisor meeting
* *0.5 hours* Supervisor Meeting

## Week 4

### 12 October

* *2 hours* Refactoring current code on the new builder.
* *2 hours* Creating a way to inject correct algorithm to visualiser component and making a pseudocode parser service.

### 13 October

* *2 hours* Exploring anime.js as an animation framework - not appropriate
* *1.5 hours* Exploring other animation frameworks - choosing to go forward with p5js.

### 14 October

* *3 hours* Messing around with p5js and adding it to the angular project.

### 16 October

* *2 hours* Implement the initial drawing to the canvas. This includes drawing text on change and having the animation be centralised regardless of size of the canvas.
* *2 hours* Implement brute force algorithm visualisation. This includes step parsing and then redrawing on canvas with the correct colouring.

### 17 October

* *45 mins* Prepare for supervisor meeting with new meeting document and getting a demo ready. Also update timelog.

## Week 4

### 18 October

* *4 hours* Rework current step model and change brute force algorithm (while at it refactor). This fixed the p5js error earlier reported.
* *2 hours* Change drawing service based on new step model and refactor

### 19 October

* *1 hour* Add depdency injection to the webpage after model changes
* *2 hours* Implement playback functionality prototype - this includes play, pause, step forward, step back and reset (unstyled)
* *0.5 hours* Add change of speed slider
* *0.5 hours* Add pseudocode parser back in


### 21 October

* *2 hours* Implementation of BM algorithm with setup steps
* *1 hour* Add BM link via dependency injection and implement pseudocode parsing for BM
* *1.5 hours* Implement base animations for BM (no preprocessing animations)

### 22 October

* *1 hour* Extraction of functions shared between brute force and BM implementation

### 22 October

* *1.5 hours* Fix logical errors with BM and related animation. Also refactor the class to be more readable.
* *0.5 hours* Prepare for supervisor meeting by updating timelog and meeting document.

### 24 October

* *0.5 hours* Supervisor Meeting

## Week 5

### 25 October

* *1.5 hour * Fixing dependency injection bug
* *1.5 hours* Fixing bug with p5js reseting on change of page

### 26 October
* *3 hours* Refactoring current codebase to use the decorator pattern, which didn't only get rid of the bug I was attempting to remove earlier, but I was able to add code that dynamically draws more on the canvas if necessary

### 31 October
* *1 hour* Adding all changes so far to repository and merging with main (I have decided to omit staging, as it has not brought much value over the last few weeks)
* *0.5 hours* Preparation for supervisor meeting
* *0.5 hours* Supervisor meeting

## Week 6

### 1 November
* *2 hours* Exploring primejs for code syntax highlighting and adding it to the project
* *3 hours* Configuring primejs and adding line highlighting to be controlled by the algorithm progress service

### 2 November
* *3 hours* Styling the playback component

### 3 November
* *2 hours* Fixing variable visualiser component (how additional variables, not standard across algorithms are passed in)
* *2 hours* Changing the current layout to better fit smaller screens (resize canvas etc.)

### 4 November

* *1.5 hours* Attempting to have the animation size be resized on change, unfortunately no success

### 6 November
* *1.5 hours* Fixing a few bugs (which caused the emergence of new bugs)

### 7 November
* *0.5 hours* Preparation for supervisor meeting
* *0.5 hours* Supervisor meeting

## Week 7

### 8 November
* *1.5 hours* Fixing various bugs e.g. error on step being reset to -1
* *1 hour* Attempting to fix p5js issues with multiple objects , but unsuccessful
* *1.5 hours* Fixing p5js, this time successfully and adding an automatic animation resize

### 9 November
* *2 hours* Implementing active window view, which means the user can only see the active part of animation on a smaller screen
* *1 hour* Changing the layout to be more mobile friendly
* *1 hour* Add last occurance highlighting functionality

### 10 November
* *1.5 hours* Final stylistic changes for the evaluation

### 11 November
* *1 hour* Creating survey for evalution and preparing necessary forms
* *0.5 hours* Deploying current state of the project (removing unimplemented pages)

### 14 November
* *1 hour* Preparation for supervisor meeting



