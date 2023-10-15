import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import anime from 'animejs';


@Component({
  selector: 'app-animejs-test',
  templateUrl: './animejs-test.component.html',
  styleUrls: ['./animejs-test.component.css']
})
export class AnimejsTestComponent implements AfterViewInit {

  text = "The fox jumped over the lazy dog."
  pattern = "lazy"

  @ViewChild('text') toDrawText:ElementRef;
  @ViewChild('pattern') toDrawPattern:ElementRef;

  timeInBetween = 1000;


  timeline: anime.AnimeInstance;
  // timeline: anime.AnimeTimelineInstance;

  ngAfterViewInit() {

    for (const letter of this.pattern) {
      this.toDrawPattern.nativeElement.insertAdjacentHTML('beforeend', '<div class="letter-box">' + letter + '</div>');
    }

    for (const letter of this.text) {
      this.toDrawText.nativeElement.insertAdjacentHTML('beforeend', '<div class="letter-box">' + letter + '</div>');
    }

    this.timeline = anime({
      targets: ['.pattern'],
      translateX: 1000,
      elasticity: 200,
      duration: 500,
      easing: 'easeInOutSine',
      autoplay: false
    });

    // this.animation = anime({
    //   targets: ['.pattern'],
    //   translateX: [
    //     { value: '+=50', duration: 1000 },
    //   ],
    //   duration: this.timeInBetween,
    //   loop: false
    // });
  }

  async animate() {
    console.log('play');
    for (let i = 0 ; i < this.text.length ; i++) {
      console.log('seek');
      this.timeline.seek(i*50);
      await this.sleep(500);
    }
  }

  async sleep(msec: number) {
      return new Promise(resolve => setTimeout(resolve, msec));
    }



}
