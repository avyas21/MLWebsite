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
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
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
    this.result = "There is no pure separation of data for a Primary Color of "
    + form.value.primaryColor + " and a Secondary Color of "
    + form.value.secondaryColor + " so the point is classified as null";

    var sol = this.model.evaluate(form.value);
    if(sol != null) {
    this.result = "From the Decision Tree, a Primary Color of "
      + form.value.primaryColor + " and a Secondary Color of "
      + form.value.secondaryColor + " gives a Resulting Color of "
      + sol.toString();
    form.reset();
    }

  }

  drawModel() {

    this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context.strokeRect(0, 0, this.canvas.nativeElement.width,
      this.canvas.nativeElement.height);
    this.context.setLineDash([10, 5]);
    this.drawNodes(this.canvas.nativeElement.width/2 - 25 ,50, this.model, 50);

  }

  drawNodes(x,y,node,size) {

    if(node.isLeaf) {
      this.context.fillStyle = node.majorityClass;
      this.context.fillRect(x,y,size,size);
      this.context.font = "12px Arial";
      this.context.fillText(node.majorityClass, x, y);
      return;
    }

    this.context.fillStyle = 'black';
    this.context.fillRect(x,y,size, size);

    this.context.font = "12px Arial";
    this.context.fillText(node.bestAttribute, x, y);


    var xpos = x-(4*size) + size/4;
    for(var i = 0; i < Object.keys(node.children).length; ++i) {
      this.drawNodes(xpos, y+100, Object.values(node.children)[i], size/Math.sqrt(2));

      this.context.moveTo(x+size/2, y+size/2);
      this.context.lineTo(xpos + size/4, y+100);
      this.context.stroke();
      this.context.fillStyle = "black";
      this.context.fillText(Object.keys(node.children)[i], (x+xpos+size/2+size/4)/2, y + size/4 + 50);

      xpos += 4*size;
    }

  }

  makeDecisionTree() {
  //   this.attributes = [{primaryColor: 'red', secondaryColor: 'red'},
  // {primaryColor: 'red', secondaryColor: 'blue'},
  // {primaryColor: 'red', secondaryColor: 'yellow'}];
  //
  //   this.labels = ['red', 'purple', 'green'];

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
