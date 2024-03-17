# User manual

## How to run the application

1. Install [Node.js](https://nodejs.org/en), this should come NPM as well. If not follow instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. From the <b>root</b> (not from src/) directory run npm install. This will install all the dependencies needed to run the application.
3. Run `npm run start` in the root directory of the project. Navigate to `http://localhost:4200/` to see the web application. Any changes in the source code will automatically reload the site.

## How to build (if need website binaries for publishing or deployment)

1. Install Node.js and npm
2. Install dependencies with `npm install`
3. Run `npm run build` in the root directory of the project. You will have the build in the `dist/` directory.


## How to test
1. Install Node.js and npm
2. Install dependencies with `npm install`
3. Run `npm run test` or `npm run test-headless` in the root directory of the project. Tests are set up to run on Chrome, so make sure to have it installed. Otherwise, you will need to change the karma.conf.js file to use a different browser.


## How to use the application? (main things to know)

1. Navigate to `http://localhost:4200/` to see the web application.
2. You will see a home page. From here you can navigate to the home page or the algorithm page with any supported algorithm from Brute Force, Boyer-Moore and Knuth-Morris-Pratt.
3. The about page shows project information.
4. The algorithm page shows the algorithm animation in the top left corner with explanations and variable values right below. On the right-hand side, you see the pseudocode of the algorithm.
5. At the bottom of the algorithm page you will see various buttons used to modify the algorithm execution. The settings cog will allow you to change the text and pattern for the algorithm, enable smooth animations, filter preprocessing steps or display of legend. Here you can also set the theme.
6. The left arrow goes back one step.
7. The right arrow goes forward one step.
8. The play button will play the algorithm until the end at the set speed on the slider located in the footer.
9. The current step slider enables you to set the exact step to jump to.

Clicking any of the arrows or play should change the animation, the line highlighted on pseudocode, the explanation and variable values. It could also change the preprocessing steps shown below the main animation for Boyer-Moore and Knuth-Morris-Pratt.
