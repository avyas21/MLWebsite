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
import { KmeansComponent } from './kmeans/kmeans.component';
import { KnnComponent } from './knn/knn.component';
import { SVMComponent } from './svm/svm.component';
import { DecisionTreeComponent } from './decision-tree/decision-tree.component';
import { RandomForestComponent } from './random-forest/random-forest.component';
import { CNNComponent } from './cnn/cnn.component';

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
    LogisticRegressionComponent,
    KmeansComponent,
    KnnComponent,
    SVMComponent,
    DecisionTreeComponent,
    RandomForestComponent,
    CNNComponent
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
