import * as p5 from 'p5';

/**
 * No changes made to the original code by soler1212. The software will be
 * distributed under the GPL-3.0 license as per the requirements.
 * @description Abstract class that provides a p5 instance to the child class.
 * @copyright https://github.com/soler1212/P5JSInvoker
 */
export abstract class P5JSInvoker {
  protected p5: p5;

  abstract setup(p : p5) : void;
  abstract draw(p : p5) : void;

  protected startP5JS(containerElement: HTMLElement): void {
    this.p5 = new p5(this.generate_sketch(), containerElement);
  }

  private generate_sketch() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;

      return ((p: p5) => {
        p.setup = function() {
            that.setup(p);
        };

        p.draw = function() {
            that.draw(p);
        };
      })
  }
}