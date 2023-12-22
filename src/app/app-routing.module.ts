import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { AboutPageComponent } from './pages/about/about.page';
import { AlgorithmVisualiserPageComponent } from './pages/algorithm-visualiser/algorithm-visualiser.page';
import { environment } from '../environments/environment.dev';


/**
   * @description Grab all supported algorithms and create a route for each one
   * @example { path : "algorithm-visualiser/boyerMoore" ,  pathMatch: 'full',  component : AlgorithmVisualiserPageComponent , data : {requiredService : BoyerMooreAlgorithm , algorithmNameSlug : "boyer-moore" , decorators : [TextAndPatternDrawer, lastOccuranceTableDrawer]}}
   * @type {Routes}
*/
const algorithmVisualiserRoutes  = environment.supportedAlgorithms.map(algorithm => {
  console.log(algorithm.prePreprocessingCanvas)
  console.log(algorithm.preProcessingFunction)
  return {path : "algorithm-visualiser/" + algorithm.urlParam ,  pathMatch: 'full',  component : AlgorithmVisualiserPageComponent , data : {requiredService : algorithm.requiredService , algorithmNameSlug : algorithm.nameSlug , decorators : (algorithm.decorators) , preProcessingCanvas : algorithm.prePreprocessingCanvas , preProcessingFunction : algorithm.preProcessingFunction}}
});

/**
   * @description Generate all application routes
   * @type {Routes}
*/
const routes = [
  { path: "", component: HomePageComponent },
  { path : "about" , pathMatch: 'full', component : AboutPageComponent },
  ...algorithmVisualiserRoutes,
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes as Routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
