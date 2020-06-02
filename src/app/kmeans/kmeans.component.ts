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

  setClusters() {
    for(var i = 0; i < this.k; ++i) {
      var name = 'Cluster ' + (i+1).toString();
      this.scatterChartData.push({
        data: [],
        label: name,
        pointRadius: 10,
      });

      var red = Math.floor(Math.random()*255);
      var blue = Math.floor(Math.random()*255);
      var green = Math.floor(Math.random()*255);
      var color = 'rgba(' + red.toString() +','
        + blue.toString()+','+ green.toString() + ',0.9)';

      this.scatterChartColors.push({ // grey
        backgroundColor: color,
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      });

      var valid = false;
      while(!valid) {
        var item = this.points[Math.floor(Math.random()*this.points.length)];
        if(!this.clusters.includes(item)) {
          valid = true;
          this.clusters.push(item);
        }
      }
    }
    this.updateClusters();
  }

  updateClusters() {
    for(var i = 0; i < this.points.length; ++i) {
      var point = this.points[i];
      var min_dis = Math.pow(point['x'] - this.clusters[0]['x'],2) +
        Math.pow(point['y'] - this.clusters[0]['y'],2);
      var min_ind = 0;

      for(var j =  1; j < this.clusters.length; ++j) {
        var dis = Math.pow(point['x'] - this.clusters[j]['x'],2) +
          Math.pow(point['y'] - this.clusters[j]['y'],2);
        if(dis < min_dis) {
          min_dis = dis;
          min_ind = j;
        }
      }

      var data: object[] = this.scatterChartData[min_ind].data as object[];
      this.scatterChartData[min_ind].data.push(point);
    }
  }

  updateCentroids() {
    this.clusters = [];
    for(var i = 0; i < this.scatterChartData.length; ++i) {
      var sum_x = 0;
      var sum_y = 0;
      for(var j = 0; j < this.scatterChartData[i].data.length; ++j) {
        sum_x += this.scatterChartData[i].data[j]['x'];
        sum_y += this.scatterChartData[i].data[j]['y'];
      }

      sum_x = sum_x/this.scatterChartData[i].data.length;
      sum_y = sum_y/this.scatterChartData[i].data.length;

      this.clusters.push({x: sum_x, y: sum_y});
    }
  }

  step() {
    this.updateCentroids();

    for(var i = 0; i < this.scatterChartData.length; ++i) {
      this.scatterChartData[i].data = [];
    }

    this.updateClusters();
  }

  Step(form: NgForm) {
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

      this.setClusters();
  }

}
