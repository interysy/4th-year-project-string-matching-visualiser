import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponentComponent } from './test-component/test-component.component'; 
import { FormsModule } from '@angular/forms';
import { AnimejsTestComponent } from './animejs-test/animejs-test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    AnimejsTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
