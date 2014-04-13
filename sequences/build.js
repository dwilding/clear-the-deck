function buildMachine(expr) {
	var i, j, k, factors, factor, term, optional,
	machine = zeroMachine;

	for (i = 0; i < expr.length; i++) {
		factors = charMachine(0);
		for (j = 0; j < expr[i].factors.length; j++) {
			if (typeof expr[i].factors[j].term == 'object') {
				term = buildMachine(expr[i].factors[j].term);
			}
			else {
				term = charMachine(expr[i].factors[j].term);
			}
			factor = charMachine(0);
			for (k = 0; k < expr[i].factors[j].from; k++) {
				factor = buildProduct(factor, term);
			}
			if (expr[i].factors[j].to == null) {
				optional = buildRepeat(term);
			}
			else {
				optional = charMachine(0);
				for (; k < expr[i].factors[j].to; k++) {
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
			buildScale(expr[i].coeff, factors)
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
		machine.expr = left.expr.concat(right.expr);
	}
	return machine;
}

function buildProduct(left, right) {
	var machine;

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
		machine.expr = [{
			coeff: 1,
			factors: [left.expr, right.expr]
		}];
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
		machine.expr = [{
			coeff: 1,
			factors: [left.expr]
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
			for (i = 0; i < machine.expr.length; i++) {
				machine.expr[i].coeff *= number;
			}
		}
	}
	return machine;
}
