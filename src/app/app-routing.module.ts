import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlgorithmVisualiserPageComponent } from './pages/algorithm-visualiser/algorithm-visualiser.page';
import { environment } from 'environment';
import { TextAndPatternDrawer } from './modules/string-matching-algorithm-visualiser/drawers/text-pattern.drawer.decorator';
import { BruteForceAlgorithm } from './modules/string-matching-algorithm-visualiser/algorithms/brute-force.algorithm';

const algorithmVisualiserRoutes: Routes = environment.supportedAlgorithms.map(algorithm => {
  return {path : "algorithm-visualiser/" + algorithm.urlParam ,  pathMatch: 'full',  component : AlgorithmVisualiserPageComponent , data : {requiredService : algorithm.requiredService , algorithmNameSlug : algorithm.nameSlug , decorators : [TextAndPatternDrawer , ...(algorithm.decorators)]}}
});
const routes: Routes = [
  {path : "" ,  redirectTo : "algorithm-visualiser/bruteForce"  , pathMatch: 'full'},
  ...algorithmVisualiserRoutes,
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
