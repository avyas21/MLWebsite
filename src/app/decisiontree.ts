
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

export function computeEntropy(labels, num_classes) {
  var entropy = 0;
  for(var i = 0; i < num_classes; ++i) {
    var probability_i = segregate(labels,i).length/labels.length;
    entropy -= probability_i * Math.log(probability_i);
  }
  return entropy;
}

export function mostFrequentlyOccuringValue(labels,num_classes) {
  var best_count = segregate(labels,0).length;
  var best_id = 0;

  for (var i = 1; i < num_classes; ++i) {
    var count_i = segregate(labels,i).length;
    if(count_i > best_count) {
      best_count = count_i;
      best_id = i;
    }
  }
  return best_id;
}

export class DecisionTree {
  nodeGainRatio: number;
  nodeGainInformation: number;
  isLeaf: boolean;
  majorityClass: number;
  bestAttribute: number;
  parent: DecisionTree;
  children: DecisionTree[];


  constructor(attributes, labels, num_classes, attribute_values) {
    this.parent = null;
  }

  buildTree(attributes, labels, num_classes, attribute_values) {
    var num_instances = labels.length;
    var node_information = num_instances * computeEntropy(labels, num_classes);
    this.majorityClass = mostFrequentlyOccuringValue(labels, num_classes);

    if(node_information == 0) {
      this.isLeaf = true;
      return;
    }

    var bestAttribute = null;
    var bestGainRatio = -1 * Infinity;
    var bestInformationGain = -1 * Infinity;

    for(var i in Object.keys(attributes[0])) {
      var conditionalInfo = 0;
      var attributeCount = {};

      for (var j in attribute_values[i]) {
        var data = attributes.map(x => x[i]);
        var ids = segregate(data,j);
        attributeCount[j] = ids.length;
        conditionalInfo += attributeCount[j] * computeEntropy(filter(labels, ids), num_classes);
      }

      var attributeInformationGain = node_information - conditionalInfo;
      var gainRatio = attributeInformationGain / computeEntropy(attributeCount, num_classes);
      if(gainRatio > bestGainRatio) {
        bestInformationGain = attributeInformationGain;
        bestGainRatio = gainRatio;
        bestAttribute = i;
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
      var data = attributes.map(x => x[bestAttribute]);
      var ids = segregate(data, i);
      this.children[i] = new DecisionTree(filter(attributes, ids),
        filter(labels, ids), num_classes, attribute_values);
      this.children[i].parent = this;
    }
    return;

  }
}
