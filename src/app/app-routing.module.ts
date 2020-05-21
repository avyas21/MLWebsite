import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinelearningComponent } from './machinelearning/machinelearning.component';
import { DeeplearningComponent } from './deeplearning/deeplearning.component';
import { ReinforcementlearningComponent } from './reinforcementlearning/reinforcementlearning.component';
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  { path: 'machinelearning', component: MachinelearningComponent },
  { path: 'deeplearning', component: DeeplearningComponent },
  { path: 'reinforcementlearning', component: ReinforcementlearningComponent },
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
