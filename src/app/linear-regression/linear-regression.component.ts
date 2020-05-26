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

  alpha = 0;
  theta1 = 0;
  theta2 = 0;

  min = -2;
  max = 3;

  public scatterChartOptions: ChartOptions = {
    responsive: true,
  };

  public scatterChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Data',
      pointRadius: 10,
    },
    {
      data: [],
      label: 'Best Fit',
      type:  'line',
      pointRadius: 0,
      borderWidth: 5,
      fill: false
    },
  ];

  public scatterChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(100,0,0,0.9)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(100,0,0,0.9)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(0,0,50,0.9)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(0,0,50,0.9)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public scatterChartType: ChartType = 'scatter';

  constructor() { }

  ngOnInit(): void {
  }

  regressionFunction(x) {
    return this.theta1 + (this.theta2 * x);
  }

  cost() {
    var sum = 0;
    const data: object[] = this.scatterChartData[0].data as object[];
    for(var i = 0; i < data.length; ++i) {
      sum += Math.pow(this.regressionFunction(data[i]['x']) - data[i]['y'], 2);
    }
    return sum/(2 * data.length);
  }

  step() {

    let one = 0;
    let two = 0;

    const data: object[] = this.scatterChartData[0].data as object[];

    for(var i = 0; i < data.length; ++i) {
      one += this.regressionFunction(data[i]['x']) - data[i]['y'];
      two += (this.regressionFunction(data[i]['x']) - data[i]['y'])
        * data[i]['x'];
    }

    this.theta1 = this.theta1 - (this.alpha/data.length) * one;
    this.theta2 = this.theta2 - (this.alpha/data.length) * two;

    this.updateBoundary();
  }

  resetData() {
    this.gotParameters = false;
    this.scatterChartData[0].data = [];
    this.alpha = 0;
    this.theta1 = 0;
    this.theta2 = 0;
  }

  updateBoundary() {
    this.scatterChartData[1].data = [];
    const data: object[] = this.scatterChartData[1].data as object[];
    for(var i = this.min; i <= this.max; ++i) {
      data.push({x: i, y: this.regressionFunction(i)});
    }
  }

  Step(form: NgForm) {
    console.log(form.value);
    if(typeof(form.value.steps) == 'string'
    || form.value.steps == null ) {
      alert('Invalid Input. Enter Number of Steps');
      return;
    }

    if(!(form.value.steps >= 2)) {
      alert('Steps should be >= 2');
      return;
    }

    for(var i = 0; i < form.value.steps; ++i) {
      this.step();
    }


  }

  getParameters(form: NgForm) {
    if(typeof(form.value.alpha) == 'string' || typeof(form.value.theta1) == 'string'
    || typeof(form.value.theta2) == 'string'
    || form.value.alpha == null || form.value.theta1 == null
    || form.value.theta2 == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    const valid_regex = /\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*?\)$/;
    var points_exist = false;

    var points = form.value.points.replace(/\s+/g,'');
    points = points.replace(/[^()0-9,\.;]/g,'');
    points = points.split(';');

    const data: object[] = this.scatterChartData[0].data as object[];

    for(var i = 0; i < points.length; ++i) {
      if(valid_regex.test(points[i])) {

        var valid_point = points[i].substr(1);
        valid_point = valid_point.slice(0, -1);
        valid_point = valid_point.split(',');

        data.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});

        if(!points_exist) {
          this.min = parseFloat(valid_point[0]);
          this.max = parseFloat(valid_point[0]);
        }

        else {
          if(parseFloat(valid_point[0]) < this.min) {
            this.min = parseFloat(valid_point[0]);
          }

          else if(parseFloat(valid_point[0]) > this.max) {
            this.max = parseFloat(valid_point[0]);
          }
        }

        points_exist = true;
      }
    }

    if(!points_exist) {
      alert('Enter points in valid format');
      return;
    }

    this.alpha = form.value.alpha;
    this.theta1 = form.value.theta1;
    this.theta2 = form.value.theta2;

    this.gotParameters = true;


    this.updateBoundary();
  }
}
