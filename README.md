# StringMatchingVisualiser (StrVis)

[![codecov](https://codecov.io/gh/interysy/4th-year-project-string-matching-visualiser/graph/badge.svg?token=KXXJVM1ZMC)](https://codecov.io/gh/interysy/4th-year-project-string-matching-visualiser)



## Description

StrVis is a web application built with Angular and P5Js that visualises the execution of 3 string matching algorithms:
- Brute Force
- Boyer-Moore (BM)
- Knuth-Morris-Pratt (KMP)

The aim of the application is to help individuals learn about how these work and compare them. The application allows the user to change the text and pattern, and see how the algorithms behave in real time. The behaviour can be seen via animations, the pseudocode, explanations, variable values or the pseudocode. There is also a few quality of life features that can help the user modify the experiance to their liking.

The application was made as part of th 4th Year Project at the University Of Glasgow.


## How run the application

1. Install Node.js and npm
2. Clone the repository
3. Run `npm run start` in the root directory of the project. Navigate to `http://localhost:4200/` to see the web application. Any changes in the source code will automatically reload the site.

## How to build

1. Install Node.js and npm
2. Clone the repository
3. Run `npm run build` in the root directory of the project. You will have the build in the `dist/` directory.


## How to test
1. Install Node.js and npm
2. Clone the repository
3. Run `npm run test` or `npm run test-headless` in the root directory of the project. Tests are set up to run on Chrome, so make sure to have it installed. Otherwise you will need to change the karma.conf.js file to use a different browser.


## Project Generation
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3.

## Acknowledgements

- Checkbox on the home page was adapted from [this example on FlowBite](https://flowbite.com/docs/forms/toggle/).
- Slider on the algorithm page was adapted for Angular from the first answer on [this StackOverflow question](https://stackoverflow.com/questions/55565001/how-do-you-allow-a-user-to-manually-resize-a-div-element-vertically).
- Using P5JsInvoker to run P5Js in Angular was adapted from [soler1212 on Github](https://github.com/soler1212/P5JSInvoker/blob/main/p5-jsinvoker.ts).

