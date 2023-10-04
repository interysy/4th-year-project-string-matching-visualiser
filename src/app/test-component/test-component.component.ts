import { Component, ViewChild , ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent { 
   
  @ViewChild('canvasDemo', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
   
  context : CanvasRenderingContext2D | null;  
 
  text = 'Angular Canvas'; 
  pattern = "Can";   
   
  xPos = 20;  
  timeInBetween = 500;

  ngAfterViewInit() { 
    this.context = this.canvas.nativeElement.getContext('2d');
    this.draw();
  }

  /**
   * Draws something using the context we obtained earlier on
   */
  private draw() { 
    if (this.context) { 
       
      this.context.font = "14px verdana";
      //const textWidth = this.context.measureText("H").width; 

      this.context.font = '30px Arial';
      this.context.textBaseline = 'middle';
      this.context.textAlign = 'center';

      const x = (this.canvas.nativeElement as HTMLCanvasElement).width / 2;
      const y = (this.canvas.nativeElement as HTMLCanvasElement).height / 2;
      this.context.fillText('Angular Canvas', x, y); 

 
      this.drawText();

      this.drawPattern(20);
      
    }
  }    

  private drawText() {  
    if (this.context) {
    let xCoord = 20;
    for (const char of this.text) {   
      if (char != ' ') { 
        this.context.fillStyle = "#FF0000";
        this.context.fillRect(xCoord, 50, 20, 20);
        this.context.font = "16px Arial";
        this.context.fillStyle = "#FFFFFF"; 
        this.context.fillText(char,xCoord + 10 , 60); 
      }
      xCoord += 25 

    } 
  } 
  }

  private drawPattern(space : number) {   
    if (this.context) {
    let xCoord = space;
    for (const char of this.pattern) {   
      if (char != ' ') { 
        this.context.fillStyle = "#FF0028";
        this.context.fillRect(xCoord, 20, 20, 20);
        this.context.font = "16px Arial";
        this.context.fillStyle = "#FFFFFF"; 
        this.context.fillText(char, xCoord + 10 , 30); 
      }
      xCoord += 25 

    } 
  }

  } 

  private moveRectangles(add : number) { 
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); 
      this.drawText(); 
      this.drawPattern(this.xPos + add);
      this.context.fillStyle = 'black';
      this.context.fillRect(this.xPos, 0, 20, 20);
    }
  } 

  async triggerRedraw($event: any) {  
    console.log("Redrawing")
      for (let i = 0 ; i < 10 ; i++) {  
        console.log("Moving rectangles");
        this.moveRectangles(25 * i);
        await this.sleep(this.timeInBetween);
      }
    }
  
    async sleep(msec: number) {
      return new Promise(resolve => setTimeout(resolve, msec));
    }
  }

  // private moveRectangles() {
  //   var x = ($pos.val() / 100) * (ctx.canvas.width - 20);

  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   ctx.fillStyle = 'black';
  //   ctx.fillRect(x, 0, 20, 20);
  // };

  // setInterval(draw, 40);
