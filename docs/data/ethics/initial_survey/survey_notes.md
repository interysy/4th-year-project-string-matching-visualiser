# Survey Analysis

## Q1
9/13 people responded to this question. With 6 not finding any bugs. However, the other 3 participants found the following bugs/issues that will need to be fixed:
* Each character in the animation appears at a different width, these need to be monospaced to allow for consistency
* visualisation does not show at times on first load,  this will need further diagnosis, as it might be that it just took very long to load
* midway through changing text or pattern doesn't reset variable values for patternLength and textLength
* some people commented on the animation getting cut with the long text, this is the intended behaviour, but clearly, it is not communicated well
* renaming speed to delay

### Potential Solutions
* use a monospaced font for the animation, the animation, in general, will need changing to ensure the character is always in the centre of the square it is contained in
* add a loading animation, to ensure the user knows when the software is ready for use
* reset all variables when pattern or text is changed
* add a tutorial option to communicate to the users the features such as the active window mode
* rename speed to delay and make it explicit that it is connected to the play functionality

## Q2
Only 8 people responded with this question, but there were no actual bugs found that differ from the brute force animation. However, one issue that was pointed out was the incorrect occurrence spelling.

## Q3
People reported the interface as being quite easy to use, as the average score out of 5 was 4.08. The spread was also quite low with 0.82. The answers clustered around 4, meaning most find the interface easy to use, but there is room for improvement. By having a tutorial (as mentioned in Q1) I can explain how to use the interface to increase this score.

## Q4
85% of people reported that the animation is useful, nothing else to report here.

## Q5
A little bit more spread here compared to Q4, however, responses were positive, with all of them being between 4 and 5, with most being the highest score in terms of usefulness.

## Q6
The following potential improvements were identified by the participants:
* allowing to make delay even smaller
* Get the algorithm to restart when the animation is finished (perhaps include a delay with a message?)
* have the messages closer to the animation
* change speed to delay
* keep the relevant bit of execution still coloured when there is an explanation at the bottom (this means keep the colour on for the whole if/else block instead of switching off after 1 statement in the block)
* make the colours colour-blind friendly (need to reconsider the colour scheme)
* make the highlighting clearer, as it is quite dim
* remove the "starting" comment, as the algorithm is not actually running, which made it quite confusing for the participants
* again, make it clear about the "active window mode" (I think having a tutorial will be best)

## Q7
There was a massive spread in the answers to this question with a value of 1.36. It seems like users are not convinced with the current implementation of the last occurrence pre-processing dictionary. It is definitely useful to have the dictionary, but it needs to be visualised differently - this is supported by Q8 with most people not having ideas.

I have an idea off the top of my head to have a separate canvas, which will be scrollable, displaying the dictionary as a sequence of squares, with each square corresponding to a dictionary entry.

## Q8
As mentioned there was a lack of ideas, however, some participants suggested other related things:
* making it obvious dictionary is part of the algorithm
* underneath the pattern have 0-> pattern.length-1 and highlight in a different colour the last occurrences(actually build the animation for this)

## Q9
There were roughly split responses here, with 7 people saying the scrollable window is fine, but others preferring smaller text. In my next evaluation, I am planning to implement A-B testing to further investigate, which should be put into production.

## Q10
Everyone reported a willingness to use the app to learn about string-matching algorithms, which is great!

## Q11
Some further suggestions that have been pointed out are:
* complete KMP (this is a goal for the final software)
* add different colour schemes that the user can choose
* reduce the margin
* make the code language-free, make it pseudocode
* add functionality to the hoverable buttons of pseudocode (the aim is to have these buttons hide the window in the final software)
* speed does not reset at times
* The code window should be slightly bigger (perhaps making the text smaller would be better)
* speed to delay (again)
* having a dark mode
* move the speed bar next to the play button
* drop bar in navbar to choose an algorithm
* adding algorithms in different languages (as in my initial spec, would be nice to have if I have the time)


# Overall Thoughts
I think the evaluation shows that the software is on the right track, but there are apparent issues that will need fixing to allow easier usability. The highlight would be changing the last occurrence visualisation, which needs to be there but is currently not useful at all.


