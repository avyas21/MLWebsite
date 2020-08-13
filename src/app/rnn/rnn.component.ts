import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { NgForm } from '@angular/forms';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-rnn',
  templateUrl: './rnn.component.html',
  styleUrls: ['./rnn.component.css']
})
export class RNNComponent implements AfterViewInit {
  model: tf.LayersModel;
  haveModel = false;
  showLstm = false;
  showLSTMInput = false;
  showDense = false;
  haveImage = false;
  selectedLayer = 0;
  gates = ['input','forget','cell state','output'];
  weights = ['kernel', 'recurrent','bias'];
  weightNum = 0;
  gateNum = 0;
  selectedDenseOut = 0;

  public barChartLabel: Label = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Units'}
  ];

  public barChartType: ChartType = 'bar';

  public barChartLabel2: Label = [];

  public barChartOptions2: ChartOptions = {
    responsive: true,
  };

  public barChartData2: ChartDataSets[] = [
    { data: [], label: 'Weights'}
  ];

  public barChartType2: ChartType = 'bar';

  private context: CanvasRenderingContext2D;
  @ViewChild('canvas') canvas: ElementRef;

  private context_weight: CanvasRenderingContext2D;
  @ViewChild('canvas_weight') canvas_weight: ElementRef;

  private context_original: CanvasRenderingContext2D;
  @ViewChild('canvas_original') canvas_original: ElementRef;

  constructor(private cdRef : ChangeDetectorRef) {
    this.cdRef = cdRef;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  async ngAfterViewInit() {
    this.context = (this.canvas.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_weight = (this.canvas_weight.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_original = (this.canvas_original.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.model = await tf.loadLayersModel('assets/LSTM/model.json');
    this.haveModel = true;
    this.visualizeLayers();
    this.showLayerInfo(0);

  }

  visualizeLayers() {
    this.canvas.nativeElement.width = 500;
    this.canvas.nativeElement.height = (this.model.layers.length * 50) + 100;
    this.context.fillStyle = "rgba(140, 182, 97, 0.7)";
    this.context.fillRect(0, 0, this.canvas.nativeElement.width,
      this.canvas.nativeElement.height);

    this.context.strokeRect(0, 0, this.canvas.nativeElement.width,
      this.canvas.nativeElement.height);

    this.context.font = "12px Arial";
    this.context.fillStyle = "black";
    this.context.fillText("Network Architecture", 200, 20);


    var y = 50;

    this.context.fillStyle = "rgb(184, 188, 87)";
    this.context.fillRect(125, y, 250, 50);
    this.context.fillStyle = "black";
    var input = "Input Shape: " +
      JSON.stringify(this.model.layers[0].batchInputShape);
    this.context.fillText(input, 125, y+35);
    y += 50;

    for(var i = 0; i < this.model.layers.length; ++i) {
      if(this.model.layers[i].name.startsWith('lstm') &&
      !this.model.layers[i].name.includes('input')) {
        this.context.fillStyle = "rgb(182, 100, 97)";
      }

      else if(this.model.layers[i].name.includes('input')) {
        this.context.fillStyle = "rgb(182, 143, 97)";
      }

      else if(this.model.layers[i].name.startsWith('dense')) {
        this.context.fillStyle = "rgb(148, 140, 132)";
      }


      this.context.fillRect(125, y, 250, 50);
      this.context.fillStyle = "black";
      this.context.fillText(this.model.layers[i].name, 125, y+20);
      var shapes = "Output Shape: " +
        JSON.stringify(this.model.layers[i].outputShape);
      this.context.fillText(shapes, 125, y+35);
      y += 50;
    }
  }

  async showLayerInfo(layer_num) {
    this.showLstm= false;
    this.showDense = false;
    this.showLSTMInput = false;

    if(this.model.layers[layer_num].name.startsWith('lstm')
      && !this.model.layers[layer_num].name.includes('input')) {
      this.showLSTM(this.gateNum, this.weightNum);
      this.processInput('assets/img_1.jpg',layer_num);
      this.showLstm = true;
      return;
    }

    if(this.model.layers[layer_num].name.startsWith('lstm')
      && this.model.layers[layer_num].name.includes('input')) {
      this.showLSTMInput = true;

    }

    if(this.model.layers[layer_num].name.startsWith('dense')) {
      this.showDenseLayer(layer_num, this.selectedDenseOut);
    }

  }

  scaleImageData(imageData, scale, ctx) {
    var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
    var subLine = ctx.createImageData(scale, 1).data
    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = imageData.data.subarray(
                (row * imageData.width + col) * 4,
                (row * imageData.width + col) * 4 + 4
            );
            for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
            for (var y = 0; y < scale; y++) {
                var destRow = row * scale + y;
                var destCol = col * scale;
                scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
            }
        }
    }

    return scaled;
  }

  showLSTM(gate_num, weight_num) {

    var w = this.model.layers[this.selectedLayer].getWeights()[0];

    var units = w.shape[1]/4;

    var indices = [];

    for(var i = 0; i < units; ++i) {
      indices.push(i + units*gate_num);
    }

    if(weight_num != 2) {
      var weight = this.model.layers[this.selectedLayer].getWeights()[weight_num]
        .gather(indices,1);
    }

    else {
      var weight = this.model.layers[this.selectedLayer].getWeights()[weight_num]
        .gather(indices);
    }
    var dimensions = weight.shape;
    var arr = weight.arraySync();


    if(dimensions.length== 2) {
      var max = arr[0][0];
      var min = arr[0][0];

      for(var i = 0; i < dimensions[0]; ++i) {
        for(var j = 0; j < dimensions[1]; ++j) {
          if(arr[i][j] > max) {
            max = arr[i][j];
          }
          if(arr[i][j] < min) {
            min = arr[i][j];
          }
        }
      }

      var imgData = this.context_weight.createImageData(dimensions[1], dimensions[0]);

      for(var i = 0; i < dimensions[0]; ++i) {
        for(var j = 0; j < dimensions[1]; ++j) {
          var val = (arr[i][j]-min)/(max-min)*255;
          imgData.data[4 * (i * dimensions[1] + j) + 0] = val;
          imgData.data[4 * (i * dimensions[1] + j) + 1] = val;
          imgData.data[4 * (i * dimensions[1] + j) + 2] = val;
          imgData.data[4 * (i * dimensions[1] + j) + 3] = 255;
        }
      }

      var scaling_factor = Math.ceil(200/dimensions[1]);
      this.canvas_weight.nativeElement.width =
        dimensions[1]*scaling_factor + 20;
      this.canvas_weight.nativeElement.height =
        dimensions[0]*scaling_factor + 20;

      var scaled_data = this.scaleImageData(imgData, scaling_factor,
        this.context_weight);


      this.context_weight.putImageData(scaled_data,0,0);
    }

    else {
      var imgData = this.context_weight.createImageData(dimensions[0], 2);

      var max = arr[0];
      var min = arr[1];

      for(var j = 0; j < dimensions[0]; ++j) {
        if(arr[j] > max) {
          max = arr[j];
        }
        if(arr[j] < min) {
          min = arr[j];
        }
      }

      for(var i = 0; i < 10; ++i) {
        for(var j = 0; j < dimensions[0]; ++j) {
          var val = (arr[j]-min)/(max-min)*255;
          imgData.data[4 * (i * dimensions[0] + j) + 0] = val;
          imgData.data[4 * (i * dimensions[0] + j) + 1] = val;
          imgData.data[4 * (i * dimensions[0] + j) + 2] = val;
          imgData.data[4 * (i * dimensions[0] + j) + 3] = 255;
        }
      }
      var scaling_factor = Math.ceil(200/dimensions[0]);
      this.canvas_weight.nativeElement.width =
        dimensions[0]*scaling_factor + 100;
      this.canvas_weight.nativeElement.height =
        10*scaling_factor + 100;

      var scaled_data = this.scaleImageData(imgData, scaling_factor,
        this.context_weight);


      this.context_weight.putImageData(scaled_data,0,0);
    }

  }

  showDenseLayer(layer_num, output_num) {
    this.showDense = false;
    var weights = this.model.layers[layer_num].getWeights();
    var w = weights[0].arraySync();
    var bias = weights[1].arraySync();
    this.barChartData2[0].data = [];
    this.barChartLabel2 = [];
    var data = [];
    (this.barChartLabel2 as string[]).push('bias');
    data.push(bias[output_num]);
    for(var i = 0; i < weights[0].shape[0]; ++i) {
      (this.barChartLabel2 as string[]).push(i.toString());
      data.push(w[i][output_num]);
    }

    this.barChartData2[0].data = data;
    this.showDense = true;
  }

  processInput(path, layer_num) {
    var image = new Image;
    image.src = path;
    image.onload = () => {
      this.context_original.drawImage(image, 0, 0);
      var imgData = this.context_original.getImageData(0, 0, image.height,
        image.width);
      var output_model = tf.model({inputs: this.model.input,
        outputs: this.model.layers[layer_num].output});

      var scaling_factor = 200/image.width;

      this.canvas_original.nativeElement.width = image.width*scaling_factor + 20;
      this.canvas_original.nativeElement.height = image.height*scaling_factor + 20;

      this.context_original.scale(scaling_factor,scaling_factor);
      this.context_original.drawImage(image, 0, 0);

      var input = tf.browser.fromPixels(imgData, 1);
      input = input.reshape([1,28,28]);
      var b = tf.scalar(255);
      input = input.div(b);
      var result = output_model.predict(input);

      var w = this.model.layers[this.selectedLayer].getWeights()[0];
      var units = w.shape[1]/4;
      this.barChartLabel = [];


      for(var i = 0; i < units; ++i) {
        (this.barChartLabel as string[]).push(i.toString());
      }
      this.barChartData[0].data = [];
      this.barChartData[0].data = (result as tf.Tensor).arraySync()[0] as number[];
    }
  }
}
