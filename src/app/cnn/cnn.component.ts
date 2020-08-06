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
  representativeImages = [];
  haveRepresentativeImages = false;
  selectedRepresentativeImage = 0;
  haveModel = false;
  loadmodel: tf.LayersModel;
  model: tf.LayersModel;
  numClasses: number;

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

    this.model = await tf.loadLayersModel('/assets/model.json');
    this.haveModel = true;
    this.numClasses = this.model.layers[this.model.layers.length-1].outputShape[1] as number;

    this.getRepresentativeImages();
    this.visualizeLayers();
    this.showLayerInfo(0);

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

    this.canvas_filter.nativeElement.width = dimensions[1]*scaling_factor + 100;
    this.canvas_filter.nativeElement.height = dimensions[0]*scaling_factor+100;

    this.context_filter.putImageData(scaled_data,0,0);
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

  async showLayerInfo(layer_num) {
    this.showConv = false;
    this.showPooling = false;


    if(this.model.layers[layer_num].name.startsWith('conv2d')) {
      this.showConv2d(layer_num, 0, 0);
      this.visualizeFeature('assets/img_1.jpg', layer_num);
      return;
    }

    if(this.model.layers[layer_num].name.startsWith('max_pooling2d')) {
      this.showPooling = true;
      return;
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

        this.canvas_original.nativeElement.width = image.width*scaling_factor + 100;
        this.canvas_original.nativeElement.height = image.height*scaling_factor + 100;

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
        dimensions[2]*scaling_factor + 100;
      this.canvas_feature.nativeElement.height =
        dimensions[1]*scaling_factor + 100;

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

    var out_shape = this.model.layers[this.model.layers.length-1].outputShape;
    out_shape.splice(0,1);


    for(var output_class = 0; output_class < out_shape[0]; ++output_class) {
      let loss = x =>
      (output_model.predict(x) as tf.Tensor).matMul(weights[0]).add(weights[1]).
        slice([0,output_class],[1,1]);

      let g = tf.grad(loss);
      // var input = tf.randomUniform([28,28,1]);
      var input = tf.zeros([28,28,1]);
      input = tf.expandDims(input, 0);
      for(var i = 0; i < 50; ++i) {
        let grad = g(input);
        input = input.add(g(input));
      }
      this.representativeImages.push(input);
    }

    this.haveRepresentativeImages = true;
    this.drawRepresentativeImage();
  }

  drawRepresentativeImage() {
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
      dimensions[2]*scaling_factor + 100;
    this.canvas_rep.nativeElement.height =
      dimensions[1]*scaling_factor + 100;

    this.canvas_scale.nativeElement.width = dimensions[2];
    this.canvas_scale.nativeElement.height = dimensions[1];

    this.context_scale.putImageData(imgData, 0, 0);
    this.context_rep.scale(scaling_factor,scaling_factor);
    this.context_rep.drawImage(
      this.canvas_scale.nativeElement as HTMLCanvasElement,0,0);
  }

}
