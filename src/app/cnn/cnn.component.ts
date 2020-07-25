import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cnn',
  templateUrl: './cnn.component.html',
  styleUrls: ['./cnn.component.css']
})
export class CNNComponent implements AfterViewInit {
  private context: CanvasRenderingContext2D;
  @ViewChild('canvas') canvas: ElementRef;

  isLayerSelected = false;
  selectedLayer = -1;
  inputChannel = 1;
  outputChannel = 1;
  maxInp = 0;
  maxOut = 0;
  showConv = false;
  showPooling = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.visualizeLayers();
  }

  model = tf.sequential({
   layers: [
     tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }),
    tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}),
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }),
    tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}),
    tf.layers.flatten(),
    tf.layers.dense({
      units: 10,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    })
   ]
  });

  originalModel = this.model;

  visualizeLayers() {
    this.canvas.nativeElement.width = 500;
    this.canvas.nativeElement.height = (this.model.layers.length * 50) + 100;

    this.context.strokeRect(0, 0, this.canvas.nativeElement.width,
      this.canvas.nativeElement.height);

    this.context.font = "12px Arial";
    this.context.fillText("Network Architecture", 200, 20);


    var y = 50;

    this.context.strokeRect(125, y, 250, 50);
    var input = "Input Shape: " +
      JSON.stringify(this.model.layers[0].batchInputShape);
    this.context.fillText(input, 125, y+35);
    y += 50;

    for(var i = 0; i < this.model.layers.length; ++i) {
      this.context.strokeRect(125, y, 250, 50);
      this.context.fillText(this.model.layers[i].name, 125, y+20);
      var shapes = "Output Shape: " +
        JSON.stringify(this.model.layers[i].outputShape);
      this.context.fillText(shapes, 125, y+35);
      y += 50;
    }

  }

  showLayer(form: NgForm) {
    if(typeof(form.value.k) == 'string' || form.value.k == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    if(form.value.k < 0 || form.value.k >= this.model.layers.length) {
      alert('Enter Valid Layer Number between 0 and '
        + (this.model.layers.length-1).toString());
      return;
    }

    this.selectedLayer = form.value.k;
    this.isLayerSelected = true;

    this.showLayerInfo(this.selectedLayer);
    return;
  }

  showConv2d(layer_num, inp, out) {
    var arr = this.model.layers[layer_num].getWeights()[0].arraySync();
    var dimensions = this.model.layers[layer_num].getWeights()[0].shape;
    this.maxInp = dimensions[2];
    this.maxOut = dimensions[3];
    this.showConv = true;
    var string = '';
    string += '-----------------------------------------\n';
    for(var i = 0; i < dimensions[0]; ++i) {
      for(var j = 0; j < dimensions[1]; ++j) {
        string += '| ' + arr[i][j][inp][out].toFixed(2).toString().padStart(5,'+') + ' ';
      }
        string += '|\n';
    }
    string += '-----------------------------------------\n';
    return string;
  }

  showPooling2d(layer_num) {

  }

  showLayerInfo(layer_num) {
    this.showConv = false;
    this.showPooling = false;
    if(this.model.layers[layer_num].name.startsWith('conv2d')) {
      this.showConv2d(layer_num, 0, 0);
      return;
    }

    if(this.model.layers[layer_num].name.startsWith('max_pooling2d')) {
      this.showPooling = true;
      return;
    }
  }

  resetModel() {
    this.model = this.originalModel;
    return;
  }


  changeWeight(form: NgForm) {
    if(typeof(form.value.row) == 'string' || form.value.row == null
      || typeof(form.value.col) == 'string' || form.value.col == null
      || typeof(form.value.val) == 'string' || form.value.val == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    var dimensions =this.model.layers[this.selectedLayer].getWeights()[0].shape;
    console.log(this.model.layers[this.selectedLayer].getWeights());
    if(form.value.row < 1 ||
      form.value.row > dimensions[1]) {
      alert('Enter Valid Row Number between 1 and '
        + dimensions[1].toString());
      return;
    }

    if(form.value.col < 1 ||
      form.value.col > dimensions[0]) {
      alert('Enter Valid Col Number between 1 and '
        + dimensions[0].toString());
      return;
    }

    var arr = this.model.layers[this.selectedLayer].getWeights()[0].arraySync();
    var bias = this.model.layers[this.selectedLayer].getWeights()[1].arraySync();

    arr[form.value.row-1][form.value.col-1]
      [this.inputChannel-1][this.outputChannel-1] = form.value.val;

    this.model.layers[this.selectedLayer].setWeights([tf.tensor(arr),tf.tensor(bias)]);

    console.log(this.model.layers[this.selectedLayer].getWeights());
  }
}
