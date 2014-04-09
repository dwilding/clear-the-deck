function buildMachine(expression) {
	var i, j, k, factors, factor, term, optional,
	machine = zeroMachine;

	for (i = 0; i < expression.length; i++) {
		factors = charMachine(0);
		for (j = 0; j < expression[i].factors.length; j++) {
			if (typeof expression[i].factors[j].term == 'object') {
				term = buildMachine(expression[i].factors[j].term);
			}
			else {
				term = charMachine(expression[i].factors[j].term);
			}
			factor = charMachine(0);
			for (k = 0; k < expression[i].factors[j].from; k++) {
				factor = buildProduct(factor, term);
			}
			if (expression[i].factors[j].to == null) {
				optional = buildRepeat(term);
			}
			else {
				optional = charMachine(0);
				for (; k < expression[i].factors[j].to; k++) {
					optional = buildSum(
						buildProduct(optional, term),
						charMachine(0)
					);
				}
			}
			factors = buildProduct(
				factors,
				buildProduct(factor, optional)
			);
		}
		machine = buildSum(
			machine,
			buildScale(expression[i].coeff, factors)
		);
	}
	return machine;
}

function buildSum(left, right) {
	var machine;

	if (isZeroMachine(left)) {
		machine = right;
	}
	else if (isZeroMachine(right)) {
		machine = left;
	}
	else {
		machine = machineSum(left, right);
		machine.expanded = left.expanded.concat(right.expanded);
	}
	return machine;
}

function buildProduct(left, right) {
	var i, j, machine;

	if (isZeroMachine(left) || isZeroMachine(right)) {
		machine = zeroMachine;
	}
	else if (isCharMachine0(left)) {
		machine = right;
	}
	else if (isCharMachine0(right)) {
		machine = left;
	}
	else {
		machine = machineProduct(left, right);
		machine.expanded = [];
		for (i = 0; i < left.expanded.length; i++) {
			for (j = 0; j < right.expanded.length; j++) {
				machine.expanded.push({
					coeff: left.expanded[i].coeff * right.expanded[j].coeff,
					factors: left.expanded[i].factors.concat(
						right.expanded[j].factors
					)
				});
			}
		}
	}
	return machine;
}

function buildRepeat(left) {
	var machine;

	if (isZeroMachine(left)) {
		machine = charMachine(0);
	}
	else {
		machine = machineRepeat(left);
		machine.expanded = [{
			coeff: 1,
			factors: [left.expanded]
		}];
	}
	return machine;
}

function buildScale(number, right) {
	var i, machine;

	if (number == 0) {
		machine = zeroMachine;
	}
	else {
		machine = right;
		if (number > 1) {
			machine.output = matrixProduct(machine.output, [[number]]);
			for (i = 0; i < machine.expanded.length; i++) {
				machine.expanded[i].coeff *= number;
			}
		}
	}
	return machine;
}
