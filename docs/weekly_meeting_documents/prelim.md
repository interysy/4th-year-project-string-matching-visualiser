# Preliminary Individual Meeting With Supervisor 19/09/23  
 
## What Have I Done So Far? 
 
* Research On Existing Animators 
* Read Over Project Documents On Moodle (how to handle meetings, tools , time expectation etc.) 
* Starting to think about what tech I can use 
* Looking at how to go about making a visualiser  
 
## Current Known Requirements 
* Need to be able to support naive,BM and KMP
 
## Current Ideas  
* Thinking of having a side by side view - left hand side is the animation of example string , right hand side would be the the current step in the algorithm.  
* Use angular, 1 main component, 2 child components
* Thinking of making a web application for ease of portability 
* Have autoplay 
* Have go forward and go backwards buttons 
* Have pause 
* Have messages letting user know what is happening at the current step 
* Ability to speed up / slow down autoplay of animation  
* Ability to input search string and target string
* Description of algorithm below the visualiser  
* Would like to utilise observer pattern - notify one side of changes on other (forward/backward buttons should notify both sides of changes, as these will be in the parent component) 
* Strategy pattern to allow different algorithms to be plugged into the visualiser.

## Questions  
* Treat Gethin as a client? 
* VCS - Github, Gitlab  
* Can repo be public? When public if not?
* What licences can I use?
* Trello 
* Write dissertation as I build the product - especially the analysis part , less so the rest 
* Do you have any tech / libraries I can start looking at for the implementation?  
* I have found that there is 2 ways of approaching - get all steps at start or work out dynamically? Which do you think is better? 
* What reference manager do you recommend? 
* Would it be appropriate to create a pipeline this week for automatic testing and deployment (onto a test site)?  
* What do you think of the current plan?
 
## Proposed Plan Until 
* Set up repo (once VCS confirmed) 
* Choose tech (hopefully at this meeting) 
* Set up a pipeline for auto disseration compilation and software build
* Put current plan in trello 
* Wireframes for initial plan  
* Set up dissertation and reference manager software 
* Create skeleton of the project 
* Start drawing out structure - strategy and observer pattern 