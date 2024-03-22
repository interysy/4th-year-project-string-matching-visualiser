# Workshop Notes 

## Introduction   

- one person did not make it, had 5 people turn up in the end
## Feature Analysis 
- 
### Wireframe 1  

- the visualiser design is great and contains a lot of features that are useful 
- self-explanatory 
- a lot of useful features, but also many that are overkill (export code , algorithm description (takes too much space, but people who open this website should already have this knowledge - perhaps make it as a seperate page or a i button)) 
- don't have rewind, but a go-forward and go-backward one step buttons 
- HIGHEST PRIORITY (MVP) = play/animate , reset , go forward , go backward , animation , pseudocode animation and variable values (but with a meaningful name) 
- POTENTIAL FEATURE = with variable values it might be worth making them changeable for the user, so they can modify the algorithm to what they know so far (e.g. use the word needle for the word we are changing) - WOULD BE NICE TO HAVE
- POTENTIAL FEATURE  = breakpoint feature , set a breakpoint at a step to break, so that variable values can be seen (essentially half of timeline feature) - WOULD BE NICE TO HAVE 
- POTENTIAL UI DESIGN = sidebar for the pseudocode + variables values - not ideal, as pseudocode should be seen on the (sidebar for potential algorithm description and extra stuff - perhaps a graph of steps showing where the match happens (timeline - esque)) 
- FEATURE = algorithm description - SHOULD HAVE , as most people will have this knowledge - should be hidden to avoid clutter (sidebar as mentioned above might be useful) 
- IDEA = hold A-B testing in order to see if people use like the visible description and potentila other non-mvp features or not (get metrics or ask for feedback in the evaluation) 
- FEATURE = messages about what is happening - SHOULD HAVE OR COULD HAVE 
- MOBILE PHONE SUPPORT (non-functional req) = WOULD BE NICE TO HAVE    
    - mobile phone UI design is off, animations on seperate page, initially show the description which takes up the whole viewport
- EXPORT FEATURE = very much would be nice to have 
### Wireframe 2  
 
- missing required features in the opinion of potential stakeholders  (pseudocode necessary at the least)
- a lot cleaner, but not enough to be super useful - first wireframe better to it could be good to split across pages or components such as a sidebar or tooltips in some cases
 
### Wireframe 3   
- quite novel, shows history and upcoming steps which would be useful for understand, however on the whole it is a COULD HAVE -> consider time constrains of implementation
- a lot better mobile version, but overall consus is that the messages should be dropped on mobile ! 
- it was highlighted mobile will be barely used and should definitely be a low priority requirement  
- mobile would have a fat finger problem with long strings (occlusion) - consider constraining string size based on device and in general! -> becomes less helpful with long strings 
- someone mentioned doing this as a web extension and having a visualiser to visualise CTRL-F of a certain website - others argued this was not helpful -> labelled as won't be done
 
## Case Study Analysis
- would use mainly on a laptop or a desktop - have some more margin around the page (UI design) - 16:9? 
- would like to have this replace example shown in lectures, might be more intuitive instead of clicking through slides - for this it requires for the page to be clean, easy to read on larger screens, accessible from any building (web app is perfect) 
- would use this during revision for refreshing the intuition behind an algorithm - pseudocode particularly useful for this - speed feature useful (NEW FEATURE - CHANGE SPEED, after discussion this should be a should have priority) 
- for learning - some people stated it was hard to learn BM without visualiser  
- for career changes
 
## Debriefing 
 
- nothing of value 

## (Post Workshop) User Stories Identified and Priority via MOSCOW  
 
_M = Must Have_
_S = Should Have_ 
_C = Could Have_ 
_W = Would Be Nice To Have_

 
1. As a student I want to be able to be able to access the system from any device so that I can open it in a range of settings. (M)
 
2. As a student I want an easy way to learn about string matching algorithms via animations, so that I can reproduce the way these work.  (M)
    - covers learning and revision
 
3. As a student I want to be able to see the pseudocode walkthrough, so that I know how the algorithm visualisation relates to the actual code.  (M)

4. As a student I want to be able to see the text describing what is happening in a string search animation, so that I can refer to these when lost in the visuals. (S)
 
5. As a student I want to see information about an algorithm, so that I am aware of design complexities.  (C)
 
6. As a student I want to be able to access the string search animator on a mobile phone, so that I can learn about these while on the move. (W) 
 
7. As a student I want the tool to have a clear UI , so that there are no distractions when learning. (M) 
 
8. As a student I want to be able to view the animation with a press of the button, so that I can follow along with the animation. (M) 
 
9. As a student I want to be able to pause the animation, so that I can get up to speed with what is going on with the working of the algorithm. (M) 
 
10. As a student I want to be able to go forward and backward within the animation, so that I can analyse what happened between steps. (M)
 
11. As a student I want to be able to slide across to any step within the animation, so that I can visualise a specific point within the algorithm. (C) 
 
12. As a student I want to be able to modify the speed of the animation, so that it goes at a speed I can follow comfortably. (M) 
 
13. As a student I want to be able to modify the important variable names within the algorithm, so that these match the standard I have been using while learning about them. (W) 
  
14. As a student I want to be able to have a breakpoint feature so that I can pause the algorithm at a specific step without having to do so manually. (W) 
 
15. As a student I am unlikely to need to actively see the algorithm background, as it distracts from the main point of the software. (S) 
    - basically hide this
 
16. As a student I want to be able to export pseudocode of the algorithm running so that I can analyse it in my free time. (W) 
 
17. As a student I want to be able to visualise the CTRL-F process of my browser on a specific page, so that I know how it relates to the real world. (W)

