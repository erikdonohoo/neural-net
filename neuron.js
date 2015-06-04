// Properties
// type: root, output, hidden
// output: what was sent to another neuron
// next/prev connections: list (other neuron, weight of connection)
// error: my error
// value: feature or class value (root/output nodes only)
// depth: how deep a neuron is
// weight: the weight the node under me uses
// parentValues: values from nodes attached to me upstream that are feeding forward

function randomWeight() {
	// Between -1 and 1
	return Math.round(Math.random() * 1000) * 2 * 0.001 - 1;
}

function Neuron (type, value) {

	this.type = type;
	this.value = value;
	this.next = [];
	this.prev = [];
	this.error = 0;
	this.depth = 0;
	this.total = 0;
	this.parentValues = [];

	if (this.type !== Neuron.types.OUTPUT) {
		this.weight = randomWeight();
	}
}

Neuron.prototype.getValue = function (item) {
	// Given a data item, what is this neurons value
	if (this.type === Neuron.types.ROOT) {
		return item[this.value];
	}

	throw new Error("cant get value from non-root neuron");
};

Neuron.prototype.feedForward = function (input) {
	return input * this.weight;
};

Neuron.types = {
	ROOT: 'root',
	OUTPUT: 'output',
	HIDDEN: 'hidden'
};

module.exports = Neuron;
