import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { AboutPageComponent } from './pages/about/about.page';
import { AlgorithmVisualiserPageComponent } from './pages/algorithm-visualiser/algorithm-visualiser.page';
import { environment } from 'environment';


const algorithmVisualiserRoutes: Routes = environment.supportedAlgorithms.map(algorithm => {
  return {path : "algorithm-visualiser/" + algorithm.urlParam ,  pathMatch: 'full',  component : AlgorithmVisualiserPageComponent , data : {requiredService : algorithm.requiredService }}
});
const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path : "about" , pathMatch: 'full', component : AboutPageComponent },
  ...algorithmVisualiserRoutes,
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
