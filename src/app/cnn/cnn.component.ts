import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { NgForm } from '@angular/forms';
import { Label } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-cnn',
  templateUrl: './cnn.component.html',
  styleUrls: ['./cnn.component.css']
})
export class CNNComponent implements AfterViewInit {

  public barChartLabel: Label = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Weights'}
  ];

  public barChartType: ChartType = 'bar';

  private context: CanvasRenderingContext2D;
  @ViewChild('canvas') canvas: ElementRef;

  private context_func: CanvasRenderingContext2D;
  @ViewChild('canvas_func') canvas_func: ElementRef;

  private context_rep: CanvasRenderingContext2D;
  @ViewChild('canvas_rep') canvas_rep: ElementRef;

  private context_filter: CanvasRenderingContext2D;
  @ViewChild('canvas_filter') canvas_filter: ElementRef;

  private context_original: CanvasRenderingContext2D;
  @ViewChild('canvas_original') canvas_original: ElementRef;

  private context_feature: CanvasRenderingContext2D;
  @ViewChild('canvas_feature') canvas_feature: ElementRef;

  private context_scale: CanvasRenderingContext2D;
  @ViewChild('canvas_scale') canvas_scale: ElementRef;

  convString = '';
  flattenString = '';
  isLayerSelected = false;
  selectedLayer = 0;
  inputChannel = 1;
  outputChannel = 1;
  maxInp = 0;
  maxOut = 0;
  showConv = false;
  showDense = false;
  showPooling = false;
  showFlatten = false;
  haveImage = false;
  inputImageData: ImageData;
  outputImage = 0;
  maxImage = 0;
  representativeImages = [];
  haveRepresentativeImages = false;
  selectedRepresentativeImage = 0;
  haveModel = false;
  loadmodel: tf.LayersModel;
  model: tf.LayersModel;
  numClasses: number;
  selectedDenseOut = 0;

  constructor(private cdRef : ChangeDetectorRef) {
    this.cdRef = cdRef;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  async ngAfterViewInit() {
    this.context = (this.canvas.nativeElement as
      HTMLCanvasElement).getContext('2d');
    this.context_filter = (this.canvas_filter.nativeElement as
       HTMLCanvasElement).getContext('2d');

    this.context_original = (this.canvas_original.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_feature = (this.canvas_feature.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_scale = (this.canvas_scale.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_rep = (this.canvas_rep.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_func = (this.canvas_func.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.model = await tf.loadLayersModel('/assets/model.json');
    this.haveModel = true;
    this.numClasses = this.model.layers[this.model.layers.length-1].outputShape[1] as number;

    this.visualizeLayers();
    this.showLayerInfo(0);
    this.getRepresentativeImages();

  }

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


  async showConv2d(layer_num, inp, out) {
    var arr = this.model.layers[layer_num].getWeights()[0].arraySync();
    var dimensions = this.model.layers[layer_num].getWeights()[0].shape;
    this.maxInp = dimensions[2];
    this.maxOut = dimensions[3];
    this.showConv = true;
    this.maxImage = this.model.layers[layer_num].outputShape[3] as number;

    this.canvas_filter.nativeElement.width = dimensions[1]*50 + 20;
    this.canvas_filter.nativeElement.height = dimensions[0]*50 + 20;
    var imgData = this.context_filter.createImageData(dimensions[0], dimensions[1]);
    var string = '';
    string += '-----------------------------------------\n';

    var max = arr[0][0][inp][out];
    var min = arr[0][0][inp][out];
    for(var i = 0; i < dimensions[0]; ++i) {
      for(var j = 0; j < dimensions[1]; ++j) {
        string += '| ' + arr[i][j][inp][out].toFixed(2).toString().padStart(5,'+') + ' ';
        if(arr[i][j][inp][out] > max) {
          max = arr[i][j][inp][out];
        }
        if(arr[i][j][inp][out] < min) {
          min = arr[i][j][inp][out];
        }
      }
        string += '|\n';
    }
    string += '-----------------------------------------\n';

    for(var i = 0; i < dimensions[0]; ++i) {
      for(var j = 0; j < dimensions[1]; ++j) {
        var val = (arr[i][j][inp][out]-min)/(max-min)*255;
        imgData.data[4 * (i * dimensions[1] + j) + 0] = val;
        imgData.data[4 * (i * dimensions[1] + j) + 1] = val;
        imgData.data[4 * (i * dimensions[1] + j) + 2] = val;
        imgData.data[4 * (i * dimensions[1] + j) + 3] = 255;
      }
    }

    this.convString = string;

    var scaling_factor = Math.ceil(200/dimensions[1]);
    var scaled_data = this.scaleImageData(imgData, scaling_factor,
      this.context_filter);

    this.canvas_filter.nativeElement.width = dimensions[1]*scaling_factor + 20;
    this.canvas_filter.nativeElement.height = dimensions[0]*scaling_factor+20;

    this.context_filter.putImageData(scaled_data,0,0);
  }

  showPooling2d(layer_num) {
    this.canvas_func.nativeElement.width = 300;
    this.canvas_func.nativeElement.height = 300;
    var current = this.model.layers[layer_num].outputShape;
    var pool_layer = this.model.layers[layer_num].getConfig();
    var poolSize = pool_layer.poolSize;
    var stride = pool_layer.strides;
    var prev = this.model.layers[layer_num-1].outputShape;

    this.context_func.beginPath();
    this.context_func.moveTo(25,25);
    this.context_func.lineTo(75,25);
    this.context_func.lineTo(67,20);
    this.context_func.moveTo(75,25);
    this.context_func.lineTo(67,30);

    this.context_func.moveTo(25,25);
    this.context_func.lineTo(25,75);
    this.context_func.lineTo(20,67);
    this.context_func.moveTo(25,75);
    this.context_func.lineTo(30,67);

    this.context_func.moveTo(100,40);
    this.context_func.lineTo(125,40);
    this.context_func.moveTo(100,50);
    this.context_func.lineTo(125,50);
    this.context_func.moveTo(120,35);
    this.context_func.lineTo(130,45);
    this.context_func.moveTo(120,55);
    this.context_func.lineTo(130,45);

    this.context_func.moveTo(155,25);
    this.context_func.lineTo(155,75);
    this.context_func.lineTo(150,67);
    this.context_func.moveTo(155,75);
    this.context_func.lineTo(160,67);

    this.context_func.moveTo(155,25);
    this.context_func.lineTo(205,25);
    this.context_func.lineTo(197,20);
    this.context_func.moveTo(205,25);
    this.context_func.lineTo(197,30);

    this.context_func.stroke();

    this.context_func.font = '12px serif';
    this.context_func.fillText(prev[2].toString(), 80, 30);
    this.context_func.fillText(prev[1].toString(), 20, 85);

    this.context_func.fillText(current[2].toString(), 210, 30);
    this.context_func.fillText(current[1].toString(), 150, 85);

    this.context_func.font = '10px serif';
    this.context_func.fillText(poolSize[0].toString() + ' x '
      + poolSize[1].toString(), 100, 65);
    this.context_func.fillText('Pool Size', 90, 75);
    this.context_func.fillText(stride[0].toString() + ' x '
      + stride[1].toString(), 100, 85);
    this.context_func.fillText('Stride', 100, 95);

    this.showPooling = true;
  }


  showDenseLayer(layer_num, output_num) {
    this.showDense = false;
    var weights = this.model.layers[layer_num].getWeights();
    var w = weights[0].arraySync();
    var bias = weights[1].arraySync();
    this.barChartData[0].data = [];
    this.barChartLabel = [];
    var data = [];
    (this.barChartLabel as string[]).push('bias');
    data.push(bias[output_num]);
    for(var i = 0; i < weights[0].shape[0]; ++i) {
      (this.barChartLabel as string[]).push(i.toString());
      data.push(w[i][output_num]);
    }

    this.barChartData[0].data = data;
    this.showDense = true;
  }

  async showLayerInfo(layer_num) {
    this.showConv = false;
    this.showPooling = false;
    this.showFlatten = false;
    this.showDense = false;

    if(this.model.layers[layer_num].name.startsWith('conv2d')) {
      this.showConv2d(layer_num, 0, 0);
      this.visualizeFeature('assets/img_1.jpg', layer_num);
      return;
    }

    if(this.model.layers[layer_num].name.startsWith('max_pooling2d')) {
      this.showPooling2d(layer_num);
      return;
    }


    if(this.model.layers[layer_num].name.startsWith('flatten')) {
      var out = this.model.layers[layer_num].outputShape;
      var inp = this.model.layers[layer_num-1].outputShape;
      inp.shift();
      this.flattenString = 'Turns input array of shape [' + inp.toString()
        + '] into array of length ' + out[1].toString();

      this.showFlatten = true;
    }

    if(this.model.layers[layer_num].name.startsWith('dense')) {
      this.showDenseLayer(layer_num, this.selectedDenseOut);
    }
  }


  changeWeight(form: NgForm) {
    if(typeof(form.value.row) == 'string' || form.value.row == null
      || typeof(form.value.col) == 'string' || form.value.col == null
      || typeof(form.value.val) == 'string' || form.value.val == null) {
      alert('Invalid Input. Enter all fields');
      return;
    }

    var dimensions =this.model.layers[this.selectedLayer].getWeights()[0].shape;
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

    this.model.layers[this.selectedLayer].
      setWeights([tf.tensor(arr),tf.tensor(bias)]);

    this.showConv2d(this.selectedLayer,this.inputChannel-1,
      this.outputChannel-1);

    this.visualizeFeature('assets/img_1.jpg', this.selectedLayer);
  }


  visualizeFeature(path,layer_num) {
    if(!this.haveImage) {
      this.haveImage = true;
      var image = new Image;
      image.src = path;
      image.onload = () => {
        this.context_original.drawImage(image, 0, 0);
        this.inputImageData = this.context_original.getImageData(0, 0, image.height,
        image.width);

        var scaling_factor = 200/image.width;

        this.canvas_original.nativeElement.width = image.width*scaling_factor + 20;
        this.canvas_original.nativeElement.height = image.height*scaling_factor + 20;

        this.context_original.scale(scaling_factor,scaling_factor);
        this.context_original.drawImage(image, 0, 0);
        this.visualizeFeature(path,layer_num);
        return;
      }
    }

    else {
      var output_model = tf.model({inputs: this.model.input,
        outputs: this.model.layers[layer_num].output});

      var input = tf.browser.fromPixels(this.inputImageData, 1);
      input = tf.expandDims(input, 0);
      var result = output_model.predict(input);
      var dimensions = (result as tf.Tensor).shape;


      var imgData = this.context_feature.createImageData(dimensions[1], dimensions[2]);
      var arr = (result as tf.Tensor).arraySync();

      var max = arr[0][0][0][this.outputImage];
      var min = arr[0][0][0][this.outputImage];

      for(var i = 0; i < dimensions[1]; ++i) {
        for(var j = 0; j < dimensions[2]; ++j) {
          if(arr[0][i][j][this.outputImage] > max) {
            max = arr[0][i][j][this.outputImage];
          }
          if(arr[0][i][j][this.outputImage] < min) {
            min = arr[0][i][j][this.outputImage];
          }
        }
      }

      for(var i = 0; i < dimensions[1]; ++i) {
        for(var j = 0; j < dimensions[2]; ++j) {
          var val = (arr[0][i][j][this.outputImage]-min)/(max-min)*255;
          imgData.data[4 * (i * dimensions[2] + j) + 0] = val;
          imgData.data[4 * (i * dimensions[2] + j) + 1] = val;
          imgData.data[4 * (i * dimensions[2] + j) + 2] = val;
          imgData.data[4 * (i * dimensions[2] + j) + 3] = 255;
        }
      }

      var scaling_factor = 200/dimensions[2];

      this.canvas_feature.nativeElement.width =
        dimensions[2]*scaling_factor + 20;
      this.canvas_feature.nativeElement.height =
        dimensions[1]*scaling_factor + 20;

      this.canvas_scale.nativeElement.width = dimensions[2];
      this.canvas_scale.nativeElement.height = dimensions[1];

      this.context_scale.putImageData(imgData, 0, 0);
      this.context_feature.scale(scaling_factor,scaling_factor);
      this.context_feature.drawImage(
        this.canvas_scale.nativeElement as HTMLCanvasElement,0,0);
    }
  }

  getRepresentativeImages() {

    if(this.haveRepresentativeImages) {
      return;
    }

    var output_class = 0;

    var weights = this.model.layers[this.model.layers.length-1].getWeights();
    var output_model = tf.model({inputs: this.model.input,
      outputs: this.model.layers[this.model.layers.length-2].output});

    var out_shape = this.numClasses;

    var output_class = 0;
    var iter = 0;
    let loss = x =>
      (output_model.predict(x) as tf.Tensor).matMul(weights[0]).add(weights[1]).
        slice([0,0],[1,1]);

    let g = tf.grad(loss);
    var input = tf.zeros([28,28,1]);
    input = tf.expandDims(input, 0);


    var images = this.representativeImages;
    let self = this;

    var interval  = setInterval(function(){
      if(iter >= 50) {
        iter = 0;
        ++output_class;
        images.push(input);
        if(output_class >= out_shape) {
          clearInterval(interval);
          self.drawRepresentativeImage();
          return;
        }

        loss = x =>
        (output_model.predict(x) as tf.Tensor).matMul(weights[0]).add(weights[1]).
        slice([0,output_class],[1,1]);
        g = tf.grad(loss);
        input = tf.zeros([28,28,1]);
        input = tf.expandDims(input, 0);
      }

      let grad = g(input);
      input = input.add(g(input));
      ++iter;
    }, 200);
  }

  drawRepresentativeImage() {
    this.haveRepresentativeImages = true;
    var img = this.representativeImages[this.selectedRepresentativeImage];
    var dimensions = img.shape;
    var arr = img.arraySync();

    var max = arr[0][0][0][0];
    var min = arr[0][0][0][0];

    var imgData = this.context_rep.createImageData(dimensions[1], dimensions[2]);

    for(var i = 0; i < dimensions[1]; ++i) {
      for(var j = 0; j < dimensions[2]; ++j) {
        if(arr[0][i][j][0] > max) {
          max = arr[0][i][j][0];
        }
        if(arr[0][i][j][0] < min) {
          min = arr[0][i][j][0];
        }
      }
    }

    for(var i = 0; i < dimensions[1]; ++i) {
      for(var j = 0; j < dimensions[2]; ++j) {
        var val = (arr[0][i][j][0]-min)/(max-min)*255;
        imgData.data[4 * (i * dimensions[2] + j) + 0] = val;
        imgData.data[4 * (i * dimensions[2] + j) + 1] = val;
        imgData.data[4 * (i * dimensions[2] + j) + 2] = val;
        imgData.data[4 * (i * dimensions[2] + j) + 3] = 255;
      }
    }

    var scaling_factor = 200/dimensions[2];

    this.canvas_rep.nativeElement.width =
      dimensions[2]*scaling_factor + 20;
    this.canvas_rep.nativeElement.height =
      dimensions[1]*scaling_factor + 20;

    this.canvas_scale.nativeElement.width = dimensions[2];
    this.canvas_scale.nativeElement.height = dimensions[1];

    this.context_scale.putImageData(imgData, 0, 0);
    this.context_rep.scale(scaling_factor,scaling_factor);
    this.context_rep.drawImage(
      this.canvas_scale.nativeElement as HTMLCanvasElement,0,0);
  }

}
