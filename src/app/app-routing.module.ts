import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { AboutPageComponent } from './pages/about/about.page';
import { AlgorithmVisualiserPageComponent } from './pages/algorithm-visualiser/algorithm-visualiser.page';
import { implementedAlgorithmsGuard } from './modules/string-matching-algorithm-visualiser/guards/implemented-algorithms.guard';

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path : "about" , component : AboutPageComponent },
  { path : "algorithm-visualiser/:algorithm" , component : AlgorithmVisualiserPageComponent , canActivate : [implementedAlgorithmsGuard]},
  // { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
