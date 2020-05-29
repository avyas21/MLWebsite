import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinelearningComponent } from './machinelearning/machinelearning.component';
import { DeeplearningComponent } from './deeplearning/deeplearning.component';
import { ReinforcementlearningComponent } from './reinforcementlearning/reinforcementlearning.component';
import { HomeComponent } from './home/home.component';
import { PerceptronComponent } from './perceptron/perceptron.component';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';
import { LogisticRegressionComponent } from './logistic-regression/logistic-regression.component';

const routes: Routes = [
  { path: 'machinelearning', component: MachinelearningComponent },
  { path: 'deeplearning', component: DeeplearningComponent },
  { path: 'reinforcementlearning', component: ReinforcementlearningComponent },
  { path: 'home', component: HomeComponent},
  { path: 'machinelearning/perceptron', component: PerceptronComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'machinelearning/linearregression', component: LinearRegressionComponent},
  { path: 'machinelearning/logisticregression', component: LogisticRegressionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
