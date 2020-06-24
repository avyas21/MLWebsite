import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RandomForest } from '../decisiontree';

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
    if(form.value.primaryColor == "" || form.value.secondaryColor == "" ) {
      alert("Please enter all input fields");
      return;
    }

    var results = this.model.evaluate(form.value);
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

    this.attributes = [{primaryColor: 'red', secondaryColor: 'red'},
  {primaryColor: 'red', secondaryColor: 'blue'},
  {primaryColor: 'red', secondaryColor: 'yellow'}];

    this.labels = ['red', 'purple', 'green'];

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
