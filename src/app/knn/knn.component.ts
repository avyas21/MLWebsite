import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-knn',
  templateUrl: './knn.component.html',
  styleUrls: ['./knn.component.css']
})
export class KnnComponent implements OnInit {
  k = 0;
  gotParameters = false;
  points = [];

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
    }
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

  constructor() { }

  ngOnInit(): void {
  }

  testPoint(form: NgForm) {
    if(typeof(form.value.x1) == 'string' || form.value.x1 == null
    || typeof(form.value.x2) == 'string' || form.value.x2 == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }
  }

  getParameters(form: NgForm) {
      if(typeof(form.value.k) == 'string' || form.value.k == null) {
        alert('Invalid Input. Enter all fields');
        return;
      }

      const valid_regex = /\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*?,[AB]\)$/;;
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

          this.points.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});

          if(valid_point[2] == 'B') {
            data2.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
          }

          else {
            data1.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
          }

          points_exist = true;
        }
      }

      if(!points_exist) {
        alert('Enter points in valid format');
        return;
      }

      if(form.value.k > this.points.length-1) {
        alert('k cannot be greater than number of points - 1');
        return;
      }

      this.k = form.value.k;
      this.gotParameters = true;

  }

}
