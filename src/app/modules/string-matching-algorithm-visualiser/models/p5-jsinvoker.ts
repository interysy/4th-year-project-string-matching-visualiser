import * as p5 from 'p5';

/**
 * Original code by soler1212. The software will be
 * distributed under the GPL-3.0 license as per the requirements.
 * Changes:
 * - Add width , height , text and pattern parameters to startP5JS method and the setup method.
 * @description Abstract class that provides a p5 instance to the child class.
 * @copyright https://github.com/soler1212/P5JSInvoker
 */
export abstract class P5JSInvoker {
  protected p5: p5;

  abstract setup(p : p5 , width : number , height : number , text : string , pattern : string) : void;
  abstract draw(p : p5) : void;

  protected startP5JS(containerElement: HTMLElement , text : string , pattern : string , width : number , height : number): void {
    this.p5 = new p5(this.generate_sketch(text , pattern , width , height), containerElement);
  }

  private generate_sketch(text : string , pattern : string , width : number , height : number) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;

      return ((p: p5) => {
        p.setup = function() {
            that.setup(p , width , height , text , pattern);
        };

        p.draw = function() {
            that.draw(p);
        };
      })
  }
}