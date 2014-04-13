function identifyExpression(expr) {
	var i, j, coeff,
	strs = [],
	reducedStrs = [],
	expanded = expandExpression(expr);

	for (i = 0; i < expanded.length; i++) {
		strs.push(identifyFactors(expanded[i].factors));
	}
	for (i = 0; i < strs.length; i++) {
		if (strs[i] != null) {
			coeff = expanded[i].coeff;
			for (j = i + 1; j < strs.length; j++) {
				if (strs[i] == strs[j]) {
					coeff += expanded[j].coeff;
					strs[j] = null;
				}
			}
			if (coeff == 1) {
				reducedStrs.push(strs[i]);
			}
			else {
				reducedStrs.push(coeff.toString() + '*' + strs[i]);
			}
		}
	}
	reducedStrs.sort();
	return reducedStrs.join('or');
}

function identifyFactors(factors) {
	var i,
	number = 0,
	strs = [];

	for (i = 0; i < factors.length; i++) {
		if (typeof factors[i] == 'object') {
			strs.push('(' + identifyExpression(factors[i]) + ')^?');
		}
		else {
			number += factors[i];
		}
	}
	if (number > 0 || strs.length == 0) {
		strs.push(number.toString());
	}
	strs.sort();
	return strs.join('');
}

function expandExpression(expr) {
	var i, j, k, left, right,
	expanded = [];

	for (i = 0; i < expr.length; i++) {
		if (expr[i].factors.length == 1) {
			expanded.push(expr[i]);
		}
		else {
			left = expandExpression(expr[i].factors[0]);
			right = expandExpression(expr[i].factors[1]);
			for (j = 0; j < left.length; j++) {
				for (k = 0; k < right.length; k++) {
					expanded.push({
						coeff: expr[i].coeff * left[j].coeff * right[k].coeff,
						factors: left[j].factors.concat(right[k].factors)
					});
				}
			}
		}
	}
	return expanded;
}
