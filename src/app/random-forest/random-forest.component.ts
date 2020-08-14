import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RandomForest } from '../decisiontree';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-random-forest',
  templateUrl: './random-forest.component.html',
  styleUrls: ['./random-forest.component.css']
})
export class RandomForestComponent implements OnInit {
  attributes = [];
  labels = [];
  resultingColors = ['red','orange','green','yellow','purple','blue'];
  primaryColors = ['red','yellow','blue'];
  secondaryColors = ['red','yellow','blue'];
  attribute_values = {primaryColor: ['red','yellow','blue'], secondaryColor: ['red','yellow','blue']};
  model: RandomForest;
  gotParameters = false;

  showResult = false;
  result = "";
  result2 = "";

  constructor() { }

  ngOnInit(): void {
  }

  public barChartLabel: Label = ['Results'];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Red'},
    { data: [], label: 'Orange'},
    { data: [], label: 'Green'},
    { data: [], label: 'Yellow'},
    { data: [], label: 'Purple'},
    { data: [], label: 'Blue'},
  ];

  public barChartColors:Array<any> = [
    { backgroundColor: 'rgba(244,48,30,0.9)'},
    { backgroundColor: 'rgba(244,208,30,0.9)'},
    { backgroundColor: 'rgba(91,244,30,0.9)'},
    { backgroundColor: 'rgba(240,244,30,0.9)'},
    { backgroundColor: 'rgba(155,30,244,0.9)'},
    { backgroundColor: 'rgba(52,30,244,0.9)'},
  ];

  public barChartType: ChartType = 'bar';

  resetData() {
    this.attributes = [];
    this.labels = [];
    this.showResult = false;
    this.gotParameters = false;
    this.result = "";
    this.result2 = "";
  }

  addTrainPoint(form: NgForm) {
    if(form.value.color1 == "" || form.value.color2 == "" || form.value.color3 == "") {
      alert("Please enter all input fields");
      return;
    }

    this.attributes.push({primaryColor: form.value.color1, secondaryColor: form.value.color2});
    this.labels.push(form.value.color3);
    form.reset();
  }

  evaluatePoint(form: NgForm) {
    this.barChartData = [
      { data: [], label: 'Red'},
      { data: [], label: 'Orange'},
      { data: [], label: 'Green'},
      { data: [], label: 'Yellow'},
      { data: [], label: 'Purple'},
      { data: [], label: 'Blue'},
    ];

    if(form.value.primaryColor == "" || form.value.secondaryColor == "" ) {
      alert("Please enter all input fields");
      return;
    }

    var results = this.model.evaluate(form.value);
    var data  = {red: 0,orange:0,green:0,yellow:0,purple:0,blue:0};

    for(var i =0; i < results.length; ++i) {
      data[results[i]] += 1;
    }

    for(var i = 0; i < Object.values(data).length; ++i) {
      this.barChartData[i].data.push(Object.values(data)[i]);
    }

    console.log(this.barChartData);

    this.showResult = true;
    this.result = "From the Random Forest, a Primary Color of "
      + form.value.primaryColor + " and a Secondary Color of "
      + form.value.secondaryColor + " gives Resulting Colors of ["
      + results.toString() + "]";

    this.result2 = "The mode of the results is " + this.model.classify(results);

    form.reset();
  }

  makeRandomForest(form: NgForm) {
    if(form.value.trees == "" || form.value.sample == ""
      || form.value.trees == null || form.value.sample == null) {
        alert("Please enter all input fields");
        return;
      }

    if(this.attributes.length < 3) {
      var left = 3 - this.attributes.length;
      alert("Please Add " + left.toString() + " more Points");
      return;
    }
    this.model = new RandomForest(form.value.trees, form.value.sample,
      this.attributes, this.labels, this.resultingColors, this.attribute_values);
    this.gotParameters = true;
  }

}
