import { Component, OnInit } from '@angular/core';
import { StringMatchingAlgorithm } from '../../models/algorithm.model';
import { BruteForceAlgorithm } from '../../algorithms/brute-force.algorithm';
import { PlaybackServiceService } from '../../services/playback-service.service';

@Component({
  selector: 'app-algorithm-visualiser-animation',
  templateUrl: './algorithm-visualiser.component.html',
  styleUrls: ['./algorithm-visualiser.component.css']
})
export class AlgorithmVisualiserComponent {

}
