function Sequence(str) {
	this.expr = parseExpression(
		{
			str: str,
			i: 0
		},
		false
	);
}

Sequence.prototype.build = function () {
	this.machine = buildMachine(this.expr);
	this.reset();
}

Sequence.prototype.reset = function () {
	this.current = this.machine.input;
}

Sequence.prototype.next = function () {
	var number = matrixProduct(this.current, this.machine.output);

	this.current = matrixProduct(this.current, this.machine.jump);
	return number;
}

Sequence.prototype.identify = function () {
	return identifyExpression(this.machine.expr);
}
