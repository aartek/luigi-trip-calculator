import { AppLoadService } from './services/app-loader.service';
import { DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: (svc: AppLoadService) => () => svc.init(), deps: [AppLoadService], multi: true },
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
