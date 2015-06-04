// Properties
// type: root, output, hidden
// input: from other neuron
// output: what was sent to another neuron
// next/prev connections: list (other neuron, weight of connection)
// error: my error
// value: feature or class value (root/output nodes only)
// depth: how deep a neuron is
// weight: the weight the node under me uses

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

	if (this.type !== Neuron.types.OUTPUT) {
		this.weight = randomWeight();
	}
}

Neuron.prototype.calculateError = function () {

};

Neuron.types = {
	ROOT: 'root',
	OUTPUT: 'output',
	HIDDEN: 'hidden'
};

module.exports = Neuron;
