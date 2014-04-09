function identifyExpression(expanded) {
	var i, j, coeff,
	expression = [],
	str = [];

	for (i = 0; i < expanded.length; i++) {
		expression[i] = identifyFactors(expanded[i].factors);
	}
	for (i = 0; i < expression.length; i++) {
		if (expression[i] != null) {
			coeff = expanded[i].coeff;
			for (j = i + 1; j < expression.length; j++) {
				if (expression[i] == expression[j]) {
					coeff += expanded[j].coeff;
					expression[j] = null;
				}
			}
			if (coeff == 1) {
				str.push(expression[i]);
			}
			else {
				str.push(coeff.toString() + '*' + expression[i]);
			}
		}
	}
	str.sort();
	return str.join('or');
}

function identifyFactors(factors) {
	var i,
	factor = 0,
	str = [];

	for (i = 0; i < factors.length; i++) {
		if (typeof factors[i] == 'object') {
			str.push('(' + identifyExpression(factors[i]) + ')^?');
		}
		else {
			factor += factors[i];
		}
	}
	if (factor > 0 || str.length == 0) {
		str.push(factor.toString());
	}
	str.sort();
	return str.join('');
}
