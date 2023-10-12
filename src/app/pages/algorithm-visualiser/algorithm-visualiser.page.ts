import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BruteForceAlgorithm } from 'src/app/modules/string-matching-algorithm-visualiser/algorithms/brute-force/brute-force.algorithm';
import { AlgorithmProgressService } from 'src/app/modules/string-matching-algorithm-visualiser/services/algorithm-progress.service';

@Component({
  selector: 'app-algorithm-visualiser',
  templateUrl: './algorithm-visualiser.page.html',
  styleUrls: ['./algorithm-visualiser.page.css']
})
export class AlgorithmVisualiserPageComponent {

  constructor (route : ActivatedRoute , algorithmProgressService : AlgorithmProgressService) {
    const algorithmToInject = route.snapshot.data['requiredService'];
    algorithmProgressService.injectAlgorithm(algorithmToInject);
  }
}
