// Read in command line options
var args = require('yargs').argv;
var path = require('path');
var arff = require('node-arff');
var Neuron = require('./neuron');
var _ = require('lodash');

function readInput(cb) {
	var options = {};
	options.hidden = args.hidden || 1;
	options.nodes = args.nodes || 3;
	options.momentum = args.momentum || null;
	options.file = path.join(__dirname, args.file) || null;
	options.class = args.class || null;
	options.train = args.train / 100;

	if (!options.file || !options.class) throw new Error('Must supply arff file and class (--file <file> --class <class>)');

	arff.load(options.file, function (err, data) {
		options.features = data.types;
		options.data = data.data;
		options.classes = options.features[options.class].oneof;
		cb(options);
	});
}

function getRandomWeight() {

}

function createInputNodes(options) {
	// Determine number of input nodes by feature type
	var inputNodes = [];

	_.forEach(options.features, function (value, key) {
		if (key !== options.class && options.features[key].type === 'numeric') {
			inputNodes.push(new Neuron(Neuron.types.ROOT, key));
		} else if (key !== options.class) {
			// TODO Handle nominal features
		}
	});

	return inputNodes;
}

function createOutputNodes(options) {
	var outputNodes = [];

	_.forEach(options.features[options.class].oneof, function (classValue) {
		outputNodes.push(new Neuron(Neuron.types.OUTPUT, classValue));
	});

	return outputNodes;
}

function connectNetwork(nodes, options, ends) {

	if (nodes[0].depth < options.hidden) {

		// Make new layer
		var newLayer = [];
		for (var i = 0; i < options.nodes; i++) {
			var node = new Neuron(Neuron.types.HIDDEN);
			node.depth = nodes[0].depth + 1;
			newLayer.push(node);
		}

		// Connect to layer
		nodes.forEach(function (node) {
			newLayer.forEach(function (newLayerNode) {
				node.next.push({
					neuron: newLayerNode
				});
				newLayerNode.prev.push({
					neuron: node
				});
			});
		});

		connectNetwork(newLayer, options, ends);

	} else {
		// Connect to ends
		nodes.forEach(function (node) {
			ends.forEach(function (endNode) {
				node.next.push({
					neuron: endNode
				});
				endNode.prev.push({
					neuron: node
				});
			});
		});
	}
}

function createNetwork(options) {
	var roots = createInputNodes(options);
	var ends = createOutputNodes(options);
	connectNetwork(roots, options, ends);

	return {
		roots: roots,
		ends: ends,
		options: options
	};
}

module.exports = {
	readInput: readInput,
	createNetwork: createNetwork
};
