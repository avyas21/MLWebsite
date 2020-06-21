import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { NgForm } from '@angular/forms';
import { DecisionTree, mostFrequentlyOccuringValue, computeEntropy, segregate }
 from '../decisiontree';

@Component({
  selector: 'app-decision-tree',
  templateUrl: './decision-tree.component.html',
  styleUrls: ['./decision-tree.component.css']
})
export class DecisionTreeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
