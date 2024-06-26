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

As a note this week is longer than normal, as I treat a week to be the 7 days in between supervisor meetings, which take place on Tuesdays. In the first week, work began before the preliminary meeting.

### 16 September
* *2 hours* Looking through existing string search animators - seeing what they have, what they're missing and what technologies are being used.

### 18 September
* *2 hours* Watch introduction video, read guidance notes, read marking scheme. Make notes on all.
* *1 hour* Prepare preliminary meeting document, outlining what I have done so far, what are the current requirements I know of, my ideas for the project going forward, questions and my plan for the upcoming week.

### 19 September
* *1 hour* Watch video on Dijkstra algorithm visualiser
* *0.5 hours* Read over the preliminary meeting document in preparation for the meeting
* *0.5 hours* Meeting with supervisor

### 20 September
* *1 hour* Solving laptop issues regarding pip and setting up the repository for the project (also applying for GitHub Pro through the student pack)
* *2 hours* Messing around with Sphinx Docs, which will be used to automatically show all my timelogs, plans etc. on GitHub alongside code documentation

### 21 September
* *3 hours* Setting up pipeline for automatic wiki deployment and code testing
* *1.5 hours* Research of potential deployment servers for continuous deployment

### 23 September
* *1.5 hours* Dissertation introduction and motivation
* *2 hours* Continued work on dissertation motivation and the high-level aims (with research)

### 24 September
* *2 hours* Learning docker and attempting to create a continuous deployment pipeline to work with DigitalOcean
* *2 hours* Set up project skeleton and more work on pipelines (wiki generation, ci and cd)

### 25 September
* *1.5 hours* Work on creating initial wireframes for the project
* *2 hours* Work on adding wiki generation and ci pipeline to the project repository on GitHub

## Week 2

### 26 September
* *0.5 hours* Finish up initial wireframes for the project - these will be used for requirement gathering. Upload onto GitHub
* *0.5 hours* Supervisor Meeting

### 27 September
* *2 hours* Working away at the build deployment pipeline (via GitHub packages), setting up Netlify for auto deployment and latex-to-pdf pipeline.

### 30 September
* *1 hour* Research how to conduct a requirement-gathering workshop and write an initial plan for the workshop.
* *1 hour* Creation of all ethics-related documents, including intro, debriefing and consent form.

### 3 October
* *1 hour* Running requirement gathering workshop to gather the goals of the project
* *1 hour* Writing up the notes from the workshop and creating user stories


## Week 3

### 4 October
* *0.5 hours* Finish up writing user stories from the day before and update the timelog
* *1.5 hours* Messing around with HTML Canvas, managed to get some animations working as well as pausing, playing and code highlighting.

### 5 October
* *0.5 hours* Adding missing user stories to the GitHub Kanban board
* *1.5 hours* Creating a final wireframe to work off of, based on requirements gathered from the workshop.
* *2 hours* Adding tailwind.css, working on the navbar and creating the initial structure of directories and files within the angular project.

### 6 October
* *3 hours* First attempt at creating pseudocode walkthrough for brute force algorithm. Also added Tailwind and made a navbar to allow for easy navigation while developing!

### 7 October
* *4 hours* Implement pseudocode walkthrough for brute force algorithm, including code highlighting. Also, implement showing variable values and the relevant message to be shown about what is happening at each step of the algorithm. All features now show up as we press play.

### 10 October
* *0.5 hours* Preparing documents for the supervisor meeting
* *0.5 hours* Supervisor Meeting

## Week 4

### 12 October
* *2 hours* Refactoring current code on the new builder.
* *2 hours* Creating a way to inject the correct algorithm into the visualiser component and making a pseudocode parser service.

### 13 October
* *2 hours* Exploring anime.js as an animation framework - not appropriate
* *1.5 hours* Exploring other animation frameworks - choosing to go forward with p5js.

### 14 October
* *3 hours* Messing around with p5js and adding it to the angular project.

### 16 October
* *2 hours* Implement the initial drawing to the canvas. This includes drawing text on change and having the animation be centralised regardless of the size of the canvas.
* *2 hours* Implement brute force algorithm visualisation. This includes step parsing and then redrawing on canvas with the correct colouring.

### 17 October
* *0.5 hours* Prepare for supervisor meeting with new meeting document and get a demo ready. Also, update the timelog.

## Week 5

### 18 October
* *4 hours* Rework the current step model and change the brute force algorithm (while at it - refactor). This fixed the p5js error earlier reported.
* *2 hours* Change drawing service based on new step model and refactor

### 19 October
* *1 hour* Add dependency injection to the webpage after model changes
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
* *1.5 hours* Fix logical errors with BM and related animation. Also, refactor the class to be more readable.
* *0.5 hours* Prepare for the supervisor meeting by updating the timelog and meeting document.

### 24 October
* *0.5 hours* Supervisor Meeting

## Week 6

### 25 October
* *1.5 hour * Fixing dependency injection bug
* *1.5 hours* Fixing bug with p5js resetting on change of page

### 26 October
* *3 hours* Refactoring current codebase to use the decorator pattern, which not only got rid of the bug I was attempting to remove earlier, but I was able to add code that dynamically draws more on the canvas if necessary

### 31 October
* *1 hour* Adding all changes so far to the repository and merging with the main (I have decided to omit staging, as it has not brought much value over the last few weeks)
* *0.5 hours* Preparation for supervisor meeting
* *0.5 hours* Supervisor meeting

## Week 7

### 1 November
* *2 hours* Exploring PrismJS for code syntax highlighting and adding it to the project
* *3 hours* Configuring PrismJS and adding line highlighting to be controlled by the algorithm progress service

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

## Week 8

### 8 November
* *1.5 hours* Fixing various bugs e.g. error on step being reset to -1
* *1 hour* Attempting to fix p5js issues with multiple objects , but unsuccessful
* *1.5 hours* Fixing p5js, this time successfully and adding an automatic animation resize

### 9 November
* *2 hours* Implementing active window view, which means the user can only see the active part of the animation on a smaller screen
* *1 hour* Changing the layout to be more mobile-friendly
* *1 hour* Add the last occurrence highlighting functionality

### 10 November
* *1.5 hours* Final stylistic changes for the evaluation

### 11 November
* *1 hour* Creating a survey for evaluation and preparing necessary forms
* *0.5 hours* Deploying the current state of the project (removing unimplemented pages)

### 14 November
* *1 hour* Preparation for supervisor meeting
* *0.5 hours* Supervisor meeting

## Week 9

### 18 November
* *1 hour* Fixing issues with dissertation writing so far

### 19 November
* *4 hours* Working through learning a drawing package for latex and using it to make a start on the background section of the dissertation

### 21 November
* *1 hour* Further work on KMP background
* *30 mins* Supervisor meeting preparation


## Week 10

### 22 November
* *1 hour* Fixing wiki pipeline
* *1 hour* Learning how to test in angular and writing initial tests
* *1 hour* Testing the navbar component, refactoring and adding documentation

### 23 November
* *1.5 hours* Working on testing the page components and parser (adding documentation when tests pass)
* *1.5 hours* Testing progress service and refactoring (adding documentation when tests pass)
* *1.5* Working on test coverage export

### 26 November
* *1 hour* Finishing up the KMP section and starting to write up the BM section
* *1.5 hours* Writing up the BM section, including adding relevant diagrams. Send dissertation to supervisor for feedback.

### 28 November
* *1 hour* Preparation for supervisor meeting.
* *1 hour* Unsuccessfully attempted to write tests for the module components
* *0.5 hours* Supervisor meeting

## Week 11

### 28 November
* *2 hours* Implement the KMP algorithm (no animations, but with O(n) border creation preprocessing algorithm)
* *2 hours* Attempting to implement a scrollable canvas for preprocessing data structures and their animations

### 29 November
* *1 hour* Attempting to create a dynamic layout for a scrollable canvas
* *2 hours* Creating an extra canvas for preprocessing steps (not dynamic, rather you can choose 1 or 2 depending on algorithm needs)

### 30 November
* *2 hours* Lecture on dissertation writing

### 4 December
* *1 hour* Reading over and analysing responses from the prototype evaluation survey

### 5 December
* *0.5 hours* Prepare for the supervisor meeting
* *0.5 hours* Supervisor meeting
* *2 hours* Create initial animations for the KMP algorithm

## Week 12

### 6 December
* *1 hour* Finish up the second canvas feature for algorithms requiring extra space for the animation
* *1 hour* Add 2 canvas handling to current code
* *1.5 hours* Ensure characters are always centralised in the animation
* *2.5 hours* Add scrollable the last occurrence and ensure it is mobile-friendly

### 11 December
* *2 hours* Add animations for the last occurrence of the preprocessing dictionary. Also, make it auto-scrollable when needing to focus during animation
* *0.5 hours* Prepare for the supervisor meeting
* *0.5 hours* Supervisor meeting
* *1 hour* Add vertical and horizontal centring of the canvases
* *0.5 hours* Update broken tests

## Week 13

### 12 December
* *1 hour* Populate project Kanban board with things to do over Christmas
* *1 hour* Starting to work on smooth animations

### 13 December
* *3 hours* Adding animation smoothing based on counting frames
* *2 hours* Create a settings modal and move text and pattern textboxes there
* *1 hour* Add extra steps filtering option and an animation smoothing option
* *1.5 hours* Refactor everything based on new features

### 14 December
* *2 hours* Finish up the refactoring and update the resizeCanvas method to always fit on the screen (done by adding a margin)
* *1 hour* Updating timelog and meeting notes (documentation in general)

### 15 December
* *1.5 hours* Write the status report and upload it to Moodle
* *2 hours* Refactor playing functionality. Instead of using timeouts, now frames within the drawing service are counted.
* *3 hours* Working on border table animations for KMP

### 16 December
* *2 hours* Finishing up border table animations for KMP by adding border colourings and annotations on top of the animation (required refactoring of how the decorator pattern works in the application)
* *1 hour* Have the KMP pseudocode change to show the border table creation algorithm. This makes what is happening with the border table creation algorithm explicit.
* *1.5 hours* Fixing bugs due to changes in the decorator pattern and modal

### 17 December
* *2 hours* Add an initial theme selector functionality in the modal.
* *1 hour* Add colour fading to smooth animations
* *1.5 hours* Research on how to make themes change dynamically

### 18 December
* *1 hour* Create a new theming service, which will be used to select the theme.
* *1 hour* Learning how I can make the theme change dynamically.
* *1.5 hours* Start reworking the modal, as using the tw-elements library may lead to licensing issues.

## Week 14 (Christmas Break)

### 21 December
* *2 hours* Add theme configuration and necessary settings icon for the modal
* *1.5 hours* Create and apply 3 themes to the application

### 22 December
* *2 hours* Refactor drawing service to use dynamically loaded colours from the theme service
* *1 hour* Start working on the legend for the animation

### 23 December
* *1.5 hours* Add the ability to disable the legend and adjust the coordinates of it (so it avoids cutting off)


## Week 15 (Christmas Break)

### 28 December
* *2 hours* Updating timelog, kanban board and meeting notes on Moodle (general update of documentation from my notes, including spelling and formatting to make everything easy to read)
* *1 hour* Attempting to upgrade Angular to the latest version on the app (needed to utilise the cookie service for keeping track of user options)
* *1.5 hours* Working on adding unit tests and documentation (done the app component and navbar)

### 29 December
* *2.5 hours* Refactoring, documenting and creating tests for theme and option services. Started doing the same for the algorithm progress service.

### 30 December
* *2.5 hours* Finished tests for progress service. Started refactoring on the P5JSDrawingService.
* *2 hours* Further refactoring on P5JSDrawingService. Cleaned up drawText, drawPattern, centralisation functions, scroller functions, drawLastOccurrenceTable and drawBorderTable.
* *1.5 hours* Working on refactoring drawLegend, annotatePattern. Also fixed bugs with resizing of animation.

### 31 December
* *1.5 hours* Refactored drawLegend and all auxiliary functions within P5JSDrawService. Still need to rework smooth animations and the playing functionality of the animation.
* *2 hours* Finished refactoring of the draw service. Started working on testing it and documenting.


## Week 16


## Week 17

### 10 January
* *1 hour* Preparing documents for the meeting
* *30 mins* Supervisor meeting

### 13 January
* *1.5 hours* Refactoring algorithm visualiser component, documenting it and starting to add tests.

### 15 January
* *2.5 hours* Refactoring command displayer component and the modal component. With this documentation has been added and unit tests begun.

### 16 January
* *2.5 hours* Testing of command displayer and modal component, as well as adding documentation and refactoring.
* *1 hour* Refactoring tests for progress service and options service, as earlier work required getters and setters to be made into explicit functions.
* *3 hours* Further work on testing, mainly on the algorithm visualiser page and the playback component. Testing also included refactoring, documentation and handling speed issues from the evaluation.


## Week 18

### 17 January
* *0.5 hours* Finishing off tests for the playback component.
* *1.5 hours* Working on refactoring and documenting the command displayer and variable visualiser components. Started working on refactoring the StringMatchingAlgorithm abstract class.

### 18 January
* *3 hours* Working on refactoring the BruteForceAlgorithm class and adding tests for it.
* *1 hour* Continuing testing, refactoring and documentation of the brute force algorithm implementation.

### 19 January
* *2 hours* Finishing up brute force tests, refactoring and documentation. Starting the same process on Boyer Moore.

### 20 January
* *1 hour* Boyer Moore testing.

### 21 January
* *2 hours* Finishing up Boyer-Moore testing and refactoring.

### 22 January
* *1 hour* Adding documentation to Boyer Moore.

### 23 January
* *2 hours* Working at refactoring, documentation and testing of Knuth Morris Pratt algorithm.
* *0.5 hours* Preparation for supervisor meeting.
* *0.5 hours* Supervisor meeting.
* *1 hour* Knuth Morris Pratt continued testing.


## Week 19

### 24 January
* *3 hours* Further work on testing and refactoring of Knuth Morris Pratt.

### 25 January
* *2 hours* Further work on testing and refactoring of Knuth Morris Pratt. Fixed some other broken tests while at it.

### 28 January
* *0.5 hours* Catching up on formal documentation for the project (e.g. missing meeting notes on Moodle)
* *3 hours* Research on Full Boyer Moore, trying to understand how it works
* *1.5 hours* Attempting to implement Full Boyer Moore

### 30 January
* *2.5 hours* Working on the home page
* *0.5 hours* Preparation for supervisor meeting.
* *0.5 hours* Supervisor meeting.
* *2 hours* Working on the about page.
* *1 hour* Working on the responsiveness of the home page and about page. Also added tests for the home page.

## Week 20

### 1 February
* *1 hour* Final touches to about page and adding progress from last few days.

### 2 February
* *1.5 hours* Working on layout improvement for the algorithm visualiser page. Also fixed bugs such as brute force having additional canvas and removal of unnecessary library.

### 3 February
* *2 hours* Removing prismjs and adding manual pseudocode highlighting.
* *1.5 hours* Tweaking the layout to handle zooming in and out.

### 4 February
* *1.5 hours* Working on tutorial implementation.
* *1 hour* Finishing initial tutorial.

### 5 February
* *2 hours* Making tutorial responsive and adding a border to the tutorial. Also added smooth scrolling.
* *1 hour* Some final bug fixes, such as missing colours for the border table and overlapping li elements.Fixed any failing tests due to changes over the last few days.

### 6 February
* *1 hour* Preparing for supervisor meeting.
* *0.5hours* Supervisor meeting.

## Week 21

### 7 February
* *2 hours* Refactored introduction of the dissertation.
* *0.5 hours* Started writing up the high-level requirements section and the requirement-gathering workshop section.

### 8 February
* *2 hours* Started refactoring the brute force algorithm section.
* *1 hour* Finished up the high-level requirement section and requirement-gathering workshop section.

### 9 February
* *2 hours* Refactored the brute force algorithm section.
* *1.5 hours* Started refactoring the KMP algorithm section, this included adding diagrams and making the section more readable.
* *1 hour* Started refactoring the BM section.
* *2 hours* Finished up the BM section.

### 12 February
* *2.5 hours* Cleaned up what I had in the dissertation so far. Also wrote the existing products section and started on the design chapter.

### 13 February
* *0.5 hours* Updated timelog and meeting documents on Moodle - these were missing from the last week.
* *2 hours* Attempting to merge the "slider" feature into the evaluation branch.
* *1 hour* Adding key bindings for controls.
* *0.5 hours* Started designing the survey

## Week 22

### 14 February
* *1 hour* Working on creating the evaluation survey. Emailed to supervisor for feedback.

### 15 February
* *1.5 hours* Working on Gethin's suggestions for the dissertation.

### 19 February
* *2.5 hours* Added references to motivation examples, and started working on Gethin's suggestions from the background.

### 20 February
* *2 hours* Finishing up suggestions and starting to write technologies on the design chapter.
* *0.5 hours* Prep for meeting and creating a diagram for the high-level application flow section of the dissertation.
* *1 hour* Reading over previous dissertations to get an idea of what to include in the design chapter.

## Week 23

### 21 February
* *1 hour* Creating a high-level flow diagram and starting on the low-level.

### 22 February
* *1.5 hours* Merging last feature for A-B testing
* *1 hour* Created a low-level system diagram and started writing it up in the dissertation.

### 23 February
* *2.5 hours* Fixed layout issues with 2 different layouts for A-B testing. Also fixed the last occurrence scroll bugs and not hiding upon reset bugs.

### 24 February
* *0.5 hours* Added a check for when pattern or text is nothing.

### 27 February
* *1 hour* Creating manual tests for the project
* *1.5 hours* Working on the design section of the dissertation.
* *0.5 hours* Work on updating documentation for meeting.
* *0.5 hours* Working on Design - UI section

## Week 24

### 28 February
* *1.5 hours* Finishing up the design section with UI considerations
* *0.5 hours* Started writing up the implementation section

### 29 February
* *2 hours* Further work on the version control section of the implementation

### 1 March
* *1.5 hours* Writing up software engineering practices section of implementation.

### 2 March
* *2.5 hours* Further work on implementation (created section on strategy, steps and drawers)

### 4 March
* *2 hours* Reading over Hall of Fame dissertations
* *1 hour* Started making changes based on hall of fame (abstract, intro, existing products)
* *2 hours* Started reworking the design to make it past tense. Also created another section in the implementation.

### 5 March
* *0.5 hours* Supervisor meeting
* *2 hours* Continuing to write the implementation section.


## Week 25

### 10 March
* *3 hours* Finishing up code documentation. Also created README and added acknowledgements of code use.
* *5 hours* Reworking introduction and fixing any suggestions up to section 4.1.

### 11 March
* *2 hours* Reworking requirements and design.
* *2.5 hours* Reworking design and implementation sections of the dissertation.

## Week 26

### 15 March
* *2 hours* Working on finishing implementation and starting evaluation.
* *3 hours* Written about the initial survey and testing in the evaluation section.

### 16 March
* *3.5 hours* Finishing up final evaluation section for evaluation.
* *2.5 hours* More work on the evaluation section. Started conclusion.

### 17 March
* *2.5 hours* Finished up the first draft of the evaluation by finishing up the conclusion.
* *1.5 hours* Working on presentation slides.
* *1 hour* Working on README.md and manual.md.

### 18 March
* *3 hours* Working on refactoring the design section of the dissertation.
* *0.5 hours* Supervisor Meeting.
* *4 hours* Further refactoring of design and implementation.

### 19 March
* *3 hours* Working on refactoring the implementation section of the dissertation.
* *3 hours* Working on refactoring the evaluation section of the dissertation.

### 20 March
* *2 hours* Working on refactoring the evaluation section of the dissertation.
* *0.5 hour* Supervisor meeting.

### 21 March
* *2 hours* Reading over dissertation.
* *3.5 hours* Addressing changes.
* *4 hours* Addressing more changes after having a review of the dissertation done.
* *1 hours* Review of source code.
* *1 hours* Uploading the final dissertation to Moodle and making sure everything is in order.