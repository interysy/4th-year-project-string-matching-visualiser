# /src README

The code is structured as follows:
- `app/` contains the main code. The code is split into the StringMatchingVisualiserModule and the page files which utilise it.
- `assets/` contain any static files (images, etc)
- `environments/` contains any environments for the app. The environment contains the necessary data to dynamically create the algorithm instances and any other necessary non-static data. The app only has a single environment, but this could be changed in the future.

## Build instructions

Any of these instructions need to be run from the root directory of the project. Go outside the `src/` directory, and make sure you are in the directory where the `package.json` file is located. Instead of building the application can be accessed on Netlify at [https://string-search-visualiser-prod.netlify.app/](https://string-search-visualiser-prod.netlify.app/). The documentation website can be found at [https://interysy.github.io/4th-year-project-string-matching-visualiser/index.html](https://interysy.github.io/4th-year-project-string-matching-visualiser/index.html).

## How to run the application

1. Install Node.js and npm
2. From the <b>root</b> (not from src/) directory run npm install. This will install all the dependencies needed to run the application.
3. Run `npm run start` in the root directory of the project. Navigate to `http://localhost:4200/` to see the web application. Any changes in the source code will automatically reload the site.

## How to build

1. Install Node.js and npm
2. From the <b>root</b> (not from src/) directory run npm install. This will install all the dependencies needed to run the application.
3. Run `npm run build` in the root directory of the project. You will have the build in the `dist/` directory. This directory would need to be placed on a server to be hosted and hene deployed.


## How to test
1. Install Node.js and npm
2. From the <b>root</b> (not from src/) directory run npm install. This will install all the dependencies needed to run the application.
3. Run `npm run test` or `npm run test-headless` in the root directory of the project. Tests are set up to run on Chrome, so make sure to have it installed. Otherwise, you will need to change the karma.conf.js file to use a different browser.

## How to generate documentation
1. Install Node.js and npm
2. From the <b>root</b> (not from src/) directory run npm install. This will install all the dependencies needed to run the application.
3. Run `npm run docs` in the root directory of the project. You will have the documentation in the `documentation/` directory from the root. This directory would need to be placed on a server to be hosted to be deployed.



### Requirements

List all of the pre-requisites software required to set up your project (e.g. compilers, packages, libraries, OS, hardware)

For example:

* NodeJS (I am running v18.18.2, but should work with earlier versions) and NPM (v10.2.0, but should support lower versions as well)
* Packages: listed in `package.json` in the root of the project (outside the `src/` directory). This file also lists the npm commands to run, test, build and lint applications.
* Tested on Mac 11.7.10



