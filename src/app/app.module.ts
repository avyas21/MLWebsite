import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MachinelearningComponent } from './machinelearning/machinelearning.component';
import { DeeplearningComponent } from './deeplearning/deeplearning.component';
import { ReinforcementlearningComponent } from './reinforcementlearning/reinforcementlearning.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './chart/chart.component';
import { PerceptronComponent } from './perceptron/perceptron.component';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';
import { LogisticRegressionComponent } from './logistic-regression/logistic-regression.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MachinelearningComponent,
    DeeplearningComponent,
    ReinforcementlearningComponent,
    HomeComponent,
    ChartComponent,
    PerceptronComponent,
    LinearRegressionComponent,
    LogisticRegressionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
