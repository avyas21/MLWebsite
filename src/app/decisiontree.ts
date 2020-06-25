
export function segregate(attributearray, value) {
  var outlist = [];
  for(var i = 0; i < attributearray.length; ++i) {
    if(attributearray[i] == value) {
      outlist.push(i);
    }
  }
  return outlist;
}

export function filter(array, indices) {
  var filtered = [];
  for(var i = 0; i < array.length; ++i) {
    if(indices.includes(i)) {
      filtered.push(array[i]);
    }
  }
  return filtered;
}

export function computeEntropy(labels, label_values) {
  var entropy = 0;
  for(var i = 0; i < label_values.length; ++i) {
    var probability_i = segregate(labels,label_values[i]).length/labels.length;

    if(probability_i != 0 && !Number.isNaN(probability_i)) {
      entropy -= probability_i * Math.log(probability_i);
    }
  }
  return entropy;
}

export function computeEntropy2(labels, label_values) {
  var entropy = 0;

  var total = 0;
  for(var i = 0; i < label_values.length; ++i) {
    total += labels[label_values[i]];
  }

  for(var i = 0; i < label_values.length; ++i) {
    var probability_i = labels[label_values[i]].length/total;

    if(probability_i != 0 && !Number.isNaN(probability_i)) {
      entropy -= probability_i * Math.log(probability_i);
    }
  }
  return entropy;
}

export function mostFrequentlyOccuringValue(labels,label_values) {
  var best_count = segregate(labels,label_values[0]).length;
  var best_id = 0;

  for (var i = 1; i < label_values.length; ++i) {
    var count_i = segregate(labels,label_values[i]).length;
    if(count_i > best_count) {
      best_count = count_i;
      best_id = i;
    }
  }
  return label_values[best_id];
}

export class DecisionTree {
  nodeGainRatio: number;
  nodeGainInformation: number;
  isLeaf: boolean;
  majorityClass: number;
  bestAttribute: number;
  parent: DecisionTree;
  public children: {[attribute: string]: DecisionTree; } = { };


  constructor(attributes, labels, label_values, attribute_values) {
    this.parent = null;
    this.buildTree(attributes, labels, label_values, attribute_values);
  }

  buildTree(attributes, labels, label_values, attribute_values) {
    var num_instances = labels.length;
    var node_information = num_instances * computeEntropy(labels, label_values);
    this.majorityClass = mostFrequentlyOccuringValue(labels, label_values);

    if(node_information == 0) {
      this.isLeaf = true;
      return;
    }

    var bestAttribute = null;
    var bestGainRatio = -1 * Infinity;
    var bestInformationGain = -1 * Infinity;


    for(var i in Object.keys(attributes[0])) {
      var attribute =  Object.keys(attributes[0])[i];
      var conditionalInfo = 0;
      var attributeCount = {};

      for (var j in attribute_values[attribute]) {
        var value = attribute_values[attribute][j];
        var data = attributes.map(x => x[attribute]);
        var ids = segregate(data,value);
        attributeCount[value] = ids.length;
        conditionalInfo += attributeCount[value] * computeEntropy(filter(labels, ids), label_values);

      }

      var attributeInformationGain = node_information - conditionalInfo;
      var gainRatio = attributeInformationGain / computeEntropy2(attributeCount, attribute_values);
      if(gainRatio > bestGainRatio) {
        bestInformationGain = attributeInformationGain;
        bestGainRatio = gainRatio;
        bestAttribute = attribute;
      }
    }

    if(bestGainRatio == 0) {
      this.isLeaf = true;
      return;
    }

    this.bestAttribute = bestAttribute;
    this.nodeGainRatio = bestGainRatio;
    this.nodeGainInformation = bestInformationGain;

    for(var i in attribute_values[bestAttribute]) {
      var value = attribute_values[bestAttribute][i];
      var data = attributes.map(x => x[bestAttribute]);
      var ids = segregate(data, value);
      this.children[value] = new DecisionTree(filter(attributes, ids),
        filter(labels, ids), label_values, attribute_values);
      this.children[value].parent = this;
    }
    return;

  }

  evaluate(testAttributes) {
    if(this.isLeaf) {
      return this.majorityClass;
    }

    else {
      return this.children[testAttributes[this.bestAttribute]].evaluate(testAttributes);
    }
  }
}


export class RandomForest {
  trees: DecisionTree[] = [];
  constructor(num_trees, sample_size, attributes, labels, label_values, attribute_values) {
    for(var i  = 0; i < num_trees; ++i) {
      var sampled_attributes = [];
      var sampled_labels = [];
      for(var j = 0; j < sample_size; ++j) {
        var index = Math.floor(Math.random()*attributes.length);
        sampled_labels.push(labels[index]);
        sampled_attributes.push(attributes[index]);
      }

      this.trees.push(new DecisionTree(sampled_attributes, sampled_labels,
        label_values, attribute_values));
    }

  }

  evaluate(testAttributes) {
    var results = [];
    for(var i = 0; i < this.trees.length; ++i) {
      results.push(this.trees[i].evaluate(testAttributes));
    }

    return results;
  }

  classify(results) {
    var counts = {};
    for(var i = 0; i < results.length; ++i) {
      if(results[i] in counts) {
        counts[results[i]] += 1;
      }
      else {
        counts[results[i]] = 1;
      }
    }

    var max = Object.keys(counts)[0];
    var max_count = counts[max];

    for(var i = 1; i < Object.keys(counts).length; ++i) {
      var max_i = counts[Object.keys(counts)[i]];
      if(max_i > max_count) {
        max = Object.keys(counts)[i];
        max_count = max_i;
      }
    }

    return max;
  }
}
