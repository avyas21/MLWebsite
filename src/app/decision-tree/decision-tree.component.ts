import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DecisionTree } from '../decisiontree';

@Component({
  selector: 'app-decision-tree',
  templateUrl: './decision-tree.component.html',
  styleUrls: ['./decision-tree.component.css']
})
export class DecisionTreeComponent implements AfterViewInit{

  private context: CanvasRenderingContext2D;
  @ViewChild('canvas') canvas: ElementRef;

  attributes = [];
  labels = [];
  resultingColors = ['red','orange','green','yellow','purple','blue'];
  primaryColors = ['red','yellow','blue'];
  secondaryColors = ['red','yellow','blue'];
  attribute_values = {primaryColor: ['red','yellow','blue'], secondaryColor: ['red','yellow','blue']};
  model: DecisionTree;
  gotParameters = false;

  showResult = false;
  result = "";


  constructor() { }

  ngAfterViewInit() {

  }

  resetData() {
    this.attributes = [];
    this.labels = [];
    this.showResult = false;
    this.gotParameters = false;
    this.result = "";
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

    this.showResult = true;
    this.result = "From the Decision Tree, a Primary Color of "
      + form.value.primaryColor + " and a Secondary Color of "
      + form.value.secondaryColor + " gives a Resulting Color of "
      + this.model.evaluate(form.value).toString();
    form.reset();

  }

  drawModel() {

    this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context.strokeRect(0, 0, this.canvas.nativeElement.width,
      this.canvas.nativeElement.height);
    this.context.fillRect(50,50,50,50);
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
    this.model = new DecisionTree(this.attributes, this.labels, this.resultingColors, this.attribute_values);
    this.gotParameters = true;
    this.drawModel();
  }

}
