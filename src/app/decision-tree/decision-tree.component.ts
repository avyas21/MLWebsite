import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DecisionTree, mostFrequentlyOccuringValue, computeEntropy, segregate }
 from '../decisiontree';

@Component({
  selector: 'app-decision-tree',
  templateUrl: './decision-tree.component.html',
  styleUrls: ['./decision-tree.component.css']
})
export class DecisionTreeComponent implements OnInit {

  attributes = [];
  labels = [];
  resultingColors = ['red','orange','green','yellow','purple','blue'];
  primaryColors = ['red','yellow','blue'];
  secondaryColors = ['red','yellow','blue'];
  attribute_values = {primaryColor: ['red','yellow','blue'], secondaryColor: ['red','yellow','blue']};
  model: DecisionTree;
  gotParameters = false;

  constructor() { }

  ngOnInit(): void {
  }

  addTrainPoint(form: NgForm) {
    console.log(form.value);
    if(form.value.color1 == "" || form.value.color2 == "" || form.value.color3 == "") {
      alert("Please enter all input fields");
      return;
    }

    this.attributes.push({primaryColor: form.value.color1, secondaryColor: form.value.color2});
    this.labels.push(form.value.color3);
  }

  evaluatePoint(form: NgForm) {
    if(form.value.color1 == "" || form.value.color2 == "" || form.value.color3 == "") {
      alert("Please enter all input fields");
      return;
    }
    var result = this.model.evaluate(form.value);
    console.log(result);
  }

  makeDecisionTree() {
    this.attributes = [{primaryColor: 'red', secondaryColor: 'red'},
  {primaryColor: 'red', secondaryColor: 'blue'},
  {primaryColor: 'red', secondaryColor: 'yellow'}];

    this.labels = ['red', 'purple', 'green'];

    if(this.attributes.length < 3) {
      var left = 3 - this.attributes.length;
      alert("Please Add " + left.toString() + " more Points");
      return;
    }
    this.model = new DecisionTree(this.attributes, this.labels, 3, this.attribute_values);
    console.log(this.model);
    this.gotParameters = true;
  }
}
