import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmProgressService } from 'src/app/modules/string-matching-algorithm-visualiser/services/algorithm-progress.service';

@Component({
  selector: 'app-algorithm-visualiser',
  templateUrl: './algorithm-visualiser.page.html',
  styleUrls: ['./algorithm-visualiser.page.css']
})
export class AlgorithmVisualiserPageComponent {

  constructor (route : ActivatedRoute , algorithmProgressService : AlgorithmProgressService) {
    const algorithmToInject = route.snapshot.data['requiredService'];
    const algorithmName = route.snapshot.data['algorithmNameSlug'];
    algorithmProgressService.injectAlgorithm(algorithmToInject, algorithmName);
  }
}
