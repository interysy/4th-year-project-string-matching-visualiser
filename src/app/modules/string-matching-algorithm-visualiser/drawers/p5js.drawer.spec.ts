import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlgorithmProgressService } from '../services/algorithm-progress.service';
import { OptionService } from '../services/option.service';
import { P5jsDrawClass } from './p5js.drawer';
import { ThemeSelectorService } from '../services/theme-selector.service';
import { AlgorithmProgressServiceStub } from '../stubs/algorithm-progress.service.stub';
import { OptionServiceStub } from '../stubs/option.service.stub';
import { ThemeSelectorServiceStub } from '../stubs/theme-selector.service.stub';
import * as p5 from 'p5';


describe("P5jsDrawClass", () => {
  let fixture;
  let component;
  let drawer: P5jsDrawClass;
  let algorithmProgressServiceStub: AlgorithmProgressService;
  let optionServiceStub: OptionService;
  let themeSelectorServiceStub: ThemeSelectorService;
  const p5Instance = {
    setup: jasmine.createSpy('setup'),
    draw: jasmine.createSpy('draw'),
  };


  beforeEach(() => {


    optionServiceStub = new OptionServiceStub();
    algorithmProgressServiceStub = new AlgorithmProgressServiceStub(optionServiceStub);
    themeSelectorServiceStub = new ThemeSelectorServiceStub();

    const drawerContainer = document.createElement("div");

    drawer = new P5jsDrawClass(algorithmProgressServiceStub,
                               optionServiceStub,
                               themeSelectorServiceStub,
                               drawerContainer,
                               100,
                               100,
                               (p5: p5) => {(drawer["drawTextAndPattern" as keyof P5jsDrawClass] as (p5 : p5) => void)(p5);},
                               false);
  });

  it("should be created" , () => {
    expect(drawer).toBeTruthy();
  });

  it("should be created with the correct parameters" , () => {
    expect(drawer.subscriptions.length).toEqual(5);
  });

});

