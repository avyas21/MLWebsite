import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-svm',
  templateUrl: './svm.component.html',
  styleUrls: ['./svm.component.css']
})
export class SVMComponent implements OnInit {
  types = ['A','B'];
  min = -2;
  max = 3;


  gotParameters = false;
  showData = false;
  showUpdate = false;

  updateStatement = '';
  updateW = '';
  updateB = '';
  dataStatement = '';

  W = [0,0];
  b = 0;
  alpha = 0;
  gamma = 0;

  W_initial = [0,0];
  b_initial = 0;
  alpha_initial = 0;
  gamma_initial = 0;

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

  constructor() { }

  resetData() {
    this.scatterChartData[0].data = [];
    this.scatterChartData[1].data = [];
    this.scatterChartData[2].data = [];
    this.gotParameters = false;
    this.showData = false;
    this.showUpdate = false;
  }

  clearData() {
    this.scatterChartData[0].data = [];
    this.scatterChartData[1].data = [];
    this.alpha = this.alpha_initial;
    this.W = this.W_initial.slice(0);
    this.b = this.b_initial;
    this.gamma = this.gamma_initial;
    this.min = -2;
    this.max = 3;
    this.showData = false;
    this.showUpdate = false;
    this.updateBoundary();
  }

  ngOnInit(): void {
  }

  updateBoundary() {
    this.scatterChartData[2].data = [];
    const data: object[] = this.scatterChartData[2].data as object[];
    var i;
    for(i = this.min; i <= this.max; ++i) {
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
    || typeof(form.value.gamma) == 'string' || form.value.gamma == null
    || form.value.alpha == null || form.value.w1 == null
    || form.value.w2 == null || form.value.b == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    this.alpha = form.value.alpha;
    this.W[0] = form.value.w1;
    this.W[1] = form.value.w2;
    this.b = form.value.b;
    this.gamma = form.value.gamma;

    this.W_initial = this.W.slice(0);
    this.alpha_initial = this.alpha;
    this.b_initial = this.b;
    this.gamma_initial = this.gamma;

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

    var calc = (this.W[0]*form.value.x) + (this.W[1]*form.value.y) + this.b;
    var update = 1;
    if(form.value.type == 'B') {
      update = -1;
    }

    this.showUpdate = true;
    this.showData= true;
    this.dataStatement = 'SVM calculates W.X + b = (' + this.W[0].toString()
    + '*' + form.value.x.toString() + ') + (' + this.W[1].toString()
    + '*' + form.value.y.toString() + ') + ' + this.b.toString() + ' = '
    + calc.toString();

    if(calc*update < 1) {
      this.updateStatement = 'The SVM incorrectly classifies the' +
        ' data point, so the parameters are updated as follows: ';

      this.updateW = 'W = W - \u03B1*(\u03BB*W - y*x) = [' + this.W[0] +','
      + this.W[1] + '] - ' + this.alpha.toString() + '* ('
      + this.gamma.toString() + ' * [' + this.W[0].toString() +','
      + this.W[1].toString() + '] -' + update.toString() + ' * ['
      + form.value.x.toString() + ',' + form.value.y.toString() + ']) = ';

      this.updateB = 'b = b - \u03B1*(\u03BB*b - y) = ' + this.b.toString()
      + ' - ' + this.alpha.toString() + '* (' + this.gamma.toString()
      + ' * ' + this.b.toString() + ' - ' + update.toString() + ') = ';

      this.W[0] -= this.alpha*(this.gamma*this.W[0] - update*form.value.x);
      this.W[1] -= this.alpha*(this.gamma*this.W[1] - update*form.value.y);
      this.b -= this.alpha*(this.gamma*this.b - update);

      this.updateW += '[' + this.W[0].toString() + ',' + this.W[1].toString()
      + ']';
      this.updateB += this.b.toString();
    }

    else {
      this.updateStatement = 'The SVM correctly classifies the' +
        ' data point, so the parameters are updated as follows: ';

      this.updateW = 'W = W - \u03B1*\u03BB*W = [' + this.W[0] +','
      + this.W[1] + '] - ' + this.alpha.toString() + ' * '
      + this.gamma.toString() + ' * [' + this.W[0].toString() +','
      + this.W[1].toString() + '] =';

      this.updateB = 'b = b - \u03B1*\u03BB = ' + this.b.toString()
      + ' - ' + this.alpha.toString() + ' * ' + this.gamma.toString() + ' = ';

      this.W[0] -= this.alpha*this.gamma*this.W[0];
      this.W[1] -= this.alpha*this.gamma*this.W[1];
      this.b -= this.alpha*this.gamma;

      this.updateW += '[' + this.W[0].toString() + ',' + this.W[1].toString()
      + ']';
      this.updateB += this.b.toString();
    }

    this.updateBoundary();


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
