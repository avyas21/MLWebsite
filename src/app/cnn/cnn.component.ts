import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
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

  private context_filter: CanvasRenderingContext2D;
  @ViewChild('canvas_filter') canvas_filter: ElementRef;

  private context_original: CanvasRenderingContext2D;
  @ViewChild('canvas_original') canvas_original: ElementRef;

  private context_feature: CanvasRenderingContext2D;
  @ViewChild('canvas_feature') canvas_feature: ElementRef;

  isLayerSelected = false;
  selectedLayer = 0;
  inputChannel = 1;
  outputChannel = 1;
  maxInp = 0;
  maxOut = 0;
  showConv = false;
  showPooling = false;
  haveImage = false;
  inputImageData: ImageData;
  outputImage = 0;
  maxImage = 0;
  constructor(private cdRef : ChangeDetectorRef) {
    this.cdRef = cdRef;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.context = (this.canvas.nativeElement as
      HTMLCanvasElement).getContext('2d');
    this.context_filter = (this.canvas_filter.nativeElement as
       HTMLCanvasElement).getContext('2d');

    this.context_original = (this.canvas_original.nativeElement as
      HTMLCanvasElement).getContext('2d');

    this.context_feature = (this.canvas_feature.nativeElement as
      HTMLCanvasElement).getContext('2d');

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

    this.initialVisual();
  }


  showConv2d(layer_num, inp, out) {
    var arr = this.model.layers[layer_num].getWeights()[0].arraySync();
    var dimensions = this.model.layers[layer_num].getWeights()[0].shape;
    this.maxInp = dimensions[2];
    this.maxOut = dimensions[3];
    this.showConv = true;
    this.maxImage = this.model.layers[layer_num].outputShape[3] as number;

    this.canvas_filter.nativeElement.width = dimensions[1]*50 + 100;
    this.canvas_filter.nativeElement.height = dimensions[0]*50 + 100;
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
        imgData.data[4 * (i * dimensions[1] + j) + 0] = (arr[i][j][inp][out]-min)/(max-min)*255;
        imgData.data[4 * (i * dimensions[1] + j) + 1] = (arr[i][j][inp][out]-min)/(max-min)*255;
        imgData.data[4 * (i * dimensions[1] + j) + 2] = (arr[i][j][inp][out]-min)/(max-min)*255;
        imgData.data[4 * (i * dimensions[1] + j) + 3] = 255;
      }
    }


    this.scaleImageData(imgData, 50, this.context_filter);

    // this.visualizeFeature("assets/img_1.jpg", layer_num);
    return string;
  }

  showPooling2d(layer_num) {
    var pool = this.model.layers[layer_num].getConfig().poolSize;
    var stride = this.model.layers[layer_num].getConfig().strides;

    var string = '';
    var line =  '-----'.repeat(pool[1]);

    for(var i = 0; i < pool[0]; ++i) {
      string += line + '\n';
      for(var j = 0; j < pool[1]; ++j) {
        string += '| 0 ';
      }
      string += '|\n';

    }

    string += line;
    return string;
  }

  showLayerInfo(layer_num) {
    this.showConv = false;
    this.showPooling = false;


    if(this.model.layers[layer_num].name.startsWith('conv2d')) {
      this.showConv2d(layer_num, 0, 0);
      this.visualizeFeature('assets/img_1.jpg', 0);
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

  }

  scaleImageData(imageData, scale, context) {
    var scaled = context.createImageData(imageData.width * scale, imageData.height * scale);

    for(var row = 0; row < imageData.height; row++) {
      for(var col = 0; col < imageData.width; col++) {
        var sourcePixel = [
          imageData.data[(row * imageData.width + col) * 4 + 0],
          imageData.data[(row * imageData.width + col) * 4 + 1],
          imageData.data[(row * imageData.width + col) * 4 + 2],
          imageData.data[(row * imageData.width + col) * 4 + 3]
        ];
        for(var y = 0; y < scale; y++) {
          var destRow = row * scale + y;
          for(var x = 0; x < scale; x++) {
            var destCol = col * scale + x;
            for(var i = 0; i < 4; i++) {
              scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
                sourcePixel[i];
            }
          }
        }
      }
    }

    context.putImageData(scaled, 0, 0);
    return scaled;
  }

  initialVisual() {
    if(this.model.layers[0].name.startsWith('conv2d')) {
      this.showConv2d(0, 0, 0);
      this.visualizeFeature('assets/img_1.jpg', 0);
      return;
    }

    if(this.model.layers[0].name.startsWith('max_pooling2d')) {
      this.showPooling = true;
      return;
    }
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
        this.canvas_original.nativeElement.width = image.width*8 + 100;
        this.canvas_original.nativeElement.height = image.height*8 + 100;

        this.context_original.scale(8,8);
        this.context_original.drawImage(image, 0, 0);
        this.visualizeFeature(path,layer_num);
        return;
      }
      console.log("hi");
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

      var max = arr[layer_num][0][0][this.outputImage];
      var min = arr[layer_num][0][0][this.outputImage];

      for(var i = 0; i < dimensions[1]; ++i) {
        for(var j = 0; j < dimensions[2]; ++j) {
          if(arr[layer_num][i][j][this.outputImage] > max) {
            max = arr[layer_num][i][j][this.outputImage];
          }
          if(arr[layer_num][i][j][this.outputImage] < min) {
            min = arr[layer_num][i][j][this.outputImage];
          }
        }
      }

      for(var i = 0; i < dimensions[0]; ++i) {
        for(var j = 0; j < dimensions[1]; ++j) {
          var val = (arr[layer_num][i][j][this.outputImage]-min)/(max-min)*255;
          imgData.data[4 * (i * dimensions[1] + j) + 0] = val;
          imgData.data[4 * (i * dimensions[1] + j) + 1] = val;
          imgData.data[4 * (i * dimensions[1] + j) + 2] = val;
          imgData.data[4 * (i * dimensions[1] + j) + 3] = 255;
        }
      }
      console.log("hi2");
      this.canvas_feature.nativeElement.width = dimensions[1]*8 + 100;
      this.canvas_feature.nativeElement.height = dimensions[0]*8 + 100;

      this.context_feature.scale(8,8);
      this.context_feature.putImageData(imgData, 0, 0);
    }
  }
}
