import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.css']
})
export class LinearRegressionComponent implements OnInit {
  gotParameters = false;

  constructor() { }

  ngOnInit(): void {
  }

  getParameters(form: NgForm) {
    console.log(form.value);
  }
}
