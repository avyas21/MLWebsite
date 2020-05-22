import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  types= ['A','B'];

  min = -2;
  max = 3;

  gotParameters = false;

  W = [0,0];
  b = 0;
  alpha = 0;

  W_initial = [0,0];
  b_initial = 0;
  alpha_initial = 0;

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
      pointRadius: 1,
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

  resetData() {
    this.gotParameters = false;
  }

  clearData() {
    this.scatterChartData = [
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
        pointRadius: 1,
        fill: false
      },
    ];
  }

  ngOnInit(): void {
  }

  updateBoundary() {
    this.scatterChartData[2].data = [];
    const data: object[] = this.scatterChartData[2].data as object[];
    var i;
    for(i = this.min; i < this.max; ++i) {
      var x2;
      if(this.W[1]) {
        x2 = ((-1*this.b)-(this.W[0]*i))/this.W[1];
      }
      else {
        x2 = 0;
      }
      data.push({x: i, y: x2});
    }
  }

  getParameters(form: NgForm) {
    console.log(form.value);
    if(typeof(form.value.alpha) == 'string' || typeof(form.value.w1) == 'string'
    || typeof(form.value.w2) == 'string'  || typeof(form.value.b) == 'string'
    || form.value.alpha == null || form.value.w1 == null
    || form.value.w2 == null || form.value.b == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    this.alpha = form.value.alpha;
    this.W[0] = form.value.w1;
    this.W[1] = form.value.w2;
    this.b = form.value.b;

    this.W_initial = this.W.slice(0);
    this.alpha_initial = this.alpha;
    this.b_initial = this.b;

    this.gotParameters = true;

    this.updateBoundary();
  }


  addPoint(form: NgForm) {

    if(typeof(form.value.x) == 'string' || form.value.x == null
    || typeof(form.value.y) == 'string' || form.value.y == null
    || form.value.type == "" || form.value.type == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    if(form.value.x < this.min) {
      this.min = form.value.x;
    }

    else if(form.value.x > this.max) {
      this.max = form.value.x;
    }

    var changed = false;

    if((this.W[0]*form.value.x) + (this.W[1]*form.value.y) + this.b > 0) {
      if(form.value.type != 'A') {
        this.W[0] = this.W[0] + this.alpha*form.value.x;
        this.W[1] = this.W[1] + this.alpha*form.value.y;
        this.b = this.b + this.alpha;
        changed = true;
      }
    }

    else {
      if(form.value.type != 'B') {
        this.W[0] = this.W[0] - this.alpha*form.value.x;
        this.W[1] = this.W[1] - this.alpha*form.value.y;
        this.b = this.b - this.alpha;
        changed = true;
      }
    }

    if(changed) {
      this.updateBoundary();
    }

    this.scatterChartData.forEach(element => {
      if(element.label == form.value.type) {
        const data: object[] = element.data as object[];
        data.push({x: form.value.x, y: form.value.y});
        form.reset();
        return;
      }
    });

  }

}
