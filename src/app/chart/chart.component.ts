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

  first = true;

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
      data: [{x: 0, y:0},
      {x:1,y:1}, {x:2, y:2}],
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
        data: [{x: 0, y:0},
        {x:1,y:1}, {x:2, y:2}],
        label: 'Boundary',
        type:  'line',
        pointRadius: 1,
        fill: false
      },
    ];
  }

  ngOnInit(): void {
  }



  addPoint(form: NgForm) {

    if(typeof(form.value.x) == 'string' || form.value.x == null
    || typeof(form.value.y) == 'string' || form.value.y == null
    || form.value.type == "" || form.value.type == null) {
      alert('Invalid Input. Enter all fields');
      return;
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
