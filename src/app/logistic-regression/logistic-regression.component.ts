import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-logistic-regression',
  templateUrl: './logistic-regression.component.html',
  styleUrls: ['./logistic-regression.component.css']
})
export class LogisticRegressionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  gotParameters = false;

  alpha = 0;
  theta0 = 0;
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
      label: 'A',
      pointRadius: 10,
    },
    {
      data: [],
      label: 'B',
      pointRadius: 10,
    },
    {
      data: [],
      label: 'Boundary',
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
    },
    {
      backgroundColor: 'rgba(0,0,0,0.9)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(0,0,0,0.9)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public scatterChartType: ChartType = 'scatter';

  sigmoid(x) {
    return 1/(1+Math.pow(Math.E, -x));
  }


  hypothesis(x,y) {
    return this.sigmoid(this.theta0 + (this.theta1 * x) + (this.theta2 * y));
  }

  cost() {
    var sum = 0;
    const data: object[] = this.scatterChartData[0].data as object[];
    for(var i = 0; i < data.length; ++i) {
      sum += -1 * Math.log(1 - this.hypothesis(data[i]['x'],data[i]['y']));
    }

    const data2: object[] = this.scatterChartData[1].data as object[];
    for(var i = 0; i < data2.length; ++i) {
      sum += -1 * Math.log(this.hypothesis(data2[i]['x'],data2[i]['y']));
    }


    return sum/(data2.length + data.length);
  }

  step() {
    let zero = 0;
    let one = 0;
    let two = 0;

    const data: object[] = this.scatterChartData[0].data as object[];
    const data2: object[] = this.scatterChartData[1].data as object[];

    for(var i = 0; i < data.length; ++i) {
      var h = this.hypothesis(data[i]['x'],data[i]['y']);
      zero += h;
      one += h * data[i]['x'];
      two += h * data[i]['y'];
    }

    for(var i = 0; i < data2.length; ++i) {
      var h = this.hypothesis(data2[i]['x'],data2[i]['y']) - 1;
      zero += h;
      one += h * data2[i]['x'];
      two += h * data2[i]['y'];
    }

    var l = data.length + data2.length;
    this.theta0 -= (this.alpha/l)*zero;
    this.theta1 -= (this.alpha/l)*one;
    this.theta2 -= (this.alpha/l)*two;

    this.updateBoundary();
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

  updateBoundary() {
    this.scatterChartData[2].data = [];
    const data: object[] = this.scatterChartData[2].data as object[];
    var i;
    for(i = this.min; i <= this.max; ++i) {
      var x2;
      if(this.theta2 != 0) {
        x2 = ((-1*this.theta0)-(this.theta1*i))/this.theta2;
      }
      else {
        x2 = 0;
      }
      data.push({x: i, y: x2});
    }

    console.log(data);
  }


  resetData() {
    this.gotParameters = false;
    this.scatterChartData[0].data = [];
    this.scatterChartData[1].data = [];
    this.alpha = 0;
    this.theta1 = 0;
    this.theta2 = 0;
  }


  getParameters(form: NgForm) {
    if(typeof(form.value.alpha) == 'string' || typeof(form.value.theta1) == 'string'
    || typeof(form.value.theta2) == 'string'   || typeof(form.value.theta0) == 'string'
    || form.value.alpha == null || form.value.theta1 == null
    || form.value.theta2 == null   || form.value.theta0 == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    const valid_regex = /\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*?,[AB]\)$/;
    var points_exist = false;

    var points = form.value.points.replace(/\s+/g,'');
    points = points.replace(/[^()0-9AB,\.;]/g,'');
    points = points.split(';');

    const data2: object[] = this.scatterChartData[1].data as object[];
    const data1: object[] = this.scatterChartData[0].data as object[];

    for(var i = 0; i < points.length; ++i) {
      if(valid_regex.test(points[i])) {

        var valid_point = points[i].substr(1);
        valid_point = valid_point.slice(0, -1);
        valid_point = valid_point.split(',');


        if(valid_point[2] == 'B') {
          data2.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
        }

        else {
          data1.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
        }

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
    this.theta0 = form.value.theta0;
    this.theta1 = form.value.theta1;
    this.theta2 = form.value.theta2;

    this.gotParameters = true;

    this.updateBoundary();

  }

}
