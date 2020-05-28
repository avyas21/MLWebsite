import { Component, OnInit } from '@angular/core';

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

  getParameters(form: NgForm) {
    if(typeof(form.value.alpha) == 'string' || typeof(form.value.theta1) == 'string'
    || typeof(form.value.theta2) == 'string'
    || form.value.alpha == null || form.value.theta1 == null
    || form.value.theta2 == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    const valid_regex = /\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*?,[AB]\)$/;
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

  }

}
