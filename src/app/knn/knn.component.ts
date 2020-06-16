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
  dataA = [];
  dataB = [];
  labels = [];
  classify = '';
  showClassification = false;

  public scatterChartOptions: ChartOptions = {
    responsive: true,
  };

  public scatterChartData: ChartDataSets[] = [];

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

  resetData() {
    this.k = 0;
    this.points = [];
    this.gotParameters = false;
    this.dataA = [];
    this.dataB = [];
    this.scatterChartData = [];
    this.showClassification  = false;
    this.labels = [];
  }

  clearData() {
    this.showClassification  = false;
    this.scatterChartData = [];
    this.scatterChartData.push({
      data: this.dataA,
      label: 'A',
      pointRadius: 10,
    });
    this.scatterChartData.push({
      data: this.dataB,
      label: 'B',
      pointRadius: 10,
    });
  }

  prepareString(numA,numB) {

    if(numA == 1) {
      this.classify += ' is ';
    }

    else {
      this.classify += ' are '
    }

    this.classify +=  'of Type A and ' + numB.toString();

    if(numB == 1) {
      this.classify += ' is ';
    }

    else {
      this.classify += ' are ';
    }

    this.classify += 'of Type B. Hence, the Point is classified as ';
  }

  testPoint(form: NgForm) {
    if(typeof(form.value.x1) == 'string' || form.value.x1 == null
    || typeof(form.value.x2) == 'string' || form.value.x2 == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    this.scatterChartData = [];


    var points_cpy = this.points.slice();
    var labels_cpy = this.labels.slice();

    var numA = 0;
    var numB = 0;

    var closest = [];

    for(var i = 0; i < this.k; ++i) {

      var min_ind = 0;
      var min_dis = Math.pow(form.value.x1-points_cpy[0]['x'],2) +
        Math.pow(form.value.x2-points_cpy[0]['y'],2);

      for(var j = 1; j < points_cpy.length; ++j) {
        var dis = Math.pow(form.value.x1-points_cpy[j]['x'],2) +
          Math.pow(form.value.x2-points_cpy[j]['y'],2);
        if(dis < min_dis) {
          min_dis = dis;
          min_ind = j;
        }
      }

      if(labels_cpy[min_ind] == 'A') {
        numA += 1;
      }
      else {
        numB += 1;
      }

      closest.push(points_cpy[min_ind]);
      points_cpy.splice(min_ind, 1);
      labels_cpy.splice(min_ind, 1);
    }

    console.log(closest);
    this.classify = 'Of the Closest Points to (' + form.value.x1.toString() + ','
      + form.value.x2.toString() + '), ' + numA.toString();
    this.prepareString(numA,numB);

    var color = '';

    if(numB > numA) {
      color = 'rgba(0,0,50,0.9)';
      this.classify += 'B.';
    }
    else {
      color = 'rgba(100,0,0,0.9)';
      this.classify += 'A.';
    }

    this.showClassification = true;

    this.scatterChartData.push({
      data: this.dataA,
      label: 'A',
      pointRadius: 10,
      order: 2
    });
    this.scatterChartData.push({
      data: this.dataB,
      label: 'B',
      pointRadius: 10,
      order: 3
    });

    this.scatterChartData.push({
      data: closest,
      label: 'Closest',
      pointRadius: 10,
      order: 1
    });

    this.scatterChartData.push({
      data: [{x: form.value.x1, y: form.value.x2}],
      label: 'Point',
      pointRadius: 10,
      order: 0,
      pointBackgroundColor: color,
      backgroundColor: color
    });

    form.reset();
  }

  getParameters(form: NgForm) {
      this.resetData();

      if(typeof(form.value.k) == 'string' || form.value.k == null) {
        alert('Invalid Input. Enter all fields');
        return;
      }

      const valid_regex = /^\(-?[0-9]+\.?[0-9]*,-?[0-9]+\.?[0-9]*,[AB]\)$/;;
      var points_exist = false;

      var points = form.value.points.replace(/\s+/g,'');
      points = points.replace(/[^()0-9AB,\.;-]/g,'');
      points = points.split(';');


      for(var i = 0; i < points.length; ++i) {
        if(valid_regex.test(points[i])) {

          var valid_point = points[i].substr(1);
          valid_point = valid_point.slice(0, -1);
          valid_point = valid_point.split(',');

          this.points.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
          this.labels.push(valid_point[2]);

          if(valid_point[2] == 'B') {
            this.dataB.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
          }

          else {
            this.dataA.push({x: parseFloat(valid_point[0]), y: parseFloat(valid_point[1])});
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

      this.scatterChartData.push({
        data: this.dataA,
        label: 'A',
        pointRadius: 10,
      });
      this.scatterChartData.push({
        data: this.dataB,
        label: 'B',
        pointRadius: 10,
      });
  }

}
