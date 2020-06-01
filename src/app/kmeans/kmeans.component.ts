import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.css']
})

export class KmeansComponent implements OnInit {
  clusters = [];
  points = [];
  k = 0;
  gotParameters = false;

  public scatterChartOptions: ChartOptions = {
    responsive: true,
  };

  public scatterChartData: ChartDataSets[] = [];

  public scatterChartColors:Array<any> = [];

  public scatterChartType: ChartType = 'scatter';

  constructor() { }

  ngOnInit(): void {
  }

  getParameters(form: NgForm) {
      if(typeof(form.value.k) == 'string' || form.value.k == null) {
        alert('Invalid Input. Enter all fields');
        return;
      }

      const valid_regex = /\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*?\)$/;
      var points_exist = false;

      var points = form.value.points.replace(/\s+/g,'');
      points = points.replace(/[^()0-9,\.;]/g,'');
      points = points.split(';');


      for(var i = 0; i < points.length; ++i) {
        if(valid_regex.test(points[i])) {

          var valid_point = points[i].substr(1);
          valid_point = valid_point.slice(0, -1);
          valid_point = valid_point.split(',');

          this.points.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});

          points_exist = true;
        }
      }

      if(!points_exist) {
        alert('Enter points in valid format');
        return;
      }

      if(form.value.k > this.points.length) {
        alert('Number of clusters cannot be greater than number of points');
        return;
      }

      this.k = form.value.k;
      this.gotParameters = true;
  }

}
