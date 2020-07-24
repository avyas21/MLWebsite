import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-cnn',
  templateUrl: './cnn.component.html',
  styleUrls: ['./cnn.component.css']
})
export class CNNComponent implements AfterViewInit {
  private context: CanvasRenderingContext2D;
  @ViewChild('canvas') canvas: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.visualizeLayers();
    console.log(this.model.layers);
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


}
