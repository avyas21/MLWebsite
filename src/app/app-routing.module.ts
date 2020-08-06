import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinelearningComponent } from './machinelearning/machinelearning.component';
import { DeeplearningComponent } from './deeplearning/deeplearning.component';
import { ReinforcementlearningComponent } from './reinforcementlearning/reinforcementlearning.component';
import { HomeComponent } from './home/home.component';
import { PerceptronComponent } from './perceptron/perceptron.component';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';
import { LogisticRegressionComponent } from './logistic-regression/logistic-regression.component';
import { KmeansComponent } from './kmeans/kmeans.component';
import { KnnComponent } from './knn/knn.component';
import { SVMComponent } from './svm/svm.component';
import { DecisionTreeComponent } from './decision-tree/decision-tree.component';
import { RandomForestComponent } from './random-forest/random-forest.component';
import { CNNComponent } from './cnn/cnn.component';
import { RNNComponent } from './rnn/rnn.component';

const routes: Routes = [
  { path: 'machinelearning', component: MachinelearningComponent },
  { path: 'deeplearning', component: DeeplearningComponent },
  { path: 'reinforcementlearning', component: ReinforcementlearningComponent },
  { path: 'home', component: HomeComponent},
  { path: 'machinelearning/perceptron', component: PerceptronComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'machinelearning/linearregression', component: LinearRegressionComponent},
  { path: 'machinelearning/logisticregression', component: LogisticRegressionComponent },
  { path: 'machinelearning/knn', component: KnnComponent },
  { path: 'machinelearning/kmeans', component: KmeansComponent },
  { path: 'machinelearning/svm', component: SVMComponent},
  { path: 'machinelearning/decisiontree', component: DecisionTreeComponent},
  { path: 'machinelearning/randomforest', component: RandomForestComponent},
  { path: 'deeplearning/cnn', component: CNNComponent},
  { path: 'deeplearning/rnn', component: RNNComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
