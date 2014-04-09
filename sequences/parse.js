function parseExpression(raw, subExpression) {
	var i, j,
	expression = [{}];

	if (raw.str.length == 0) {
		throw raw;
	}
	for (j = 0; j < expression.length; j++) {
		skipSpace(raw);
		try {
			i = raw.i;
			expression[j].coeff = parseNumber(raw);
			skipSpace(raw);
			if (raw.str[raw.i] != '*') {
				throw raw;
			}
			raw.i++;
			skipSpace(raw);
		}
		catch (e) {
			raw.i = i;
			expression[j].coeff = 1;
		}
		expression[j].factors = [parseFactor(raw)];
		skipSpace(raw);
		while (raw.i < raw.str.length) {
			if (subExpression && raw.str[raw.i] == ')') {
				raw.i++;
				return expression;
			}
			else if (raw.str.slice(raw.i, raw.i + 2).toLowerCase() == 'or') {
				raw.i += 2;
				expression.push({});
				break;
			}
			else {
				expression[j].factors.push(parseFactor(raw));
				skipSpace(raw);
			}
		}
	}
	if (subExpression) {
		throw raw;
	}
	return expression;
}

function parseFactor(raw) {
	var i,
	factor = {};

	if (raw.str[raw.i] == '(') {
		raw.i++;
		factor.term = parseExpression(raw, true);
	}

	else if (raw.str[raw.i] == '.') {
		while (raw.str[raw.i] == '.') {
			raw.i++;
		}
		factor.term = [{
			coeff: 1,
			factors: [{
				term: 1,
				from: 0
			}]
		}];
	}
	else {
		factor.term = parseNumber(raw);
	}
	if (raw.str[raw.i] == '^') {
		raw.i++;
		if (raw.str[raw.i] == '?') {
			raw.i++;
			factor.from = 0;
			factor.to = null;
		}
		else {
			factor.from = parseNumber(raw);
			if (raw.str[raw.i] == '-') {
				raw.i++;
				if (raw.str[raw.i] == '?') {
					raw.i++;
					factor.to = null;
				}
				else {
					i = raw.i;
					factor.to = parseNumber(raw);
					if (factor.to < factor.from) {
						raw.i = i;
						throw raw;
					}
				}
			}
			else {
				factor.to = factor.from;
			}
		}
	}
	else {
		factor.from = 1;
		factor.to = 1;
	}
	return factor;
}

function parseNumber(raw) {
	var i = raw.i;

	while (raw.i < raw.str.length) {
		if (
			48 <= raw.str.charCodeAt(raw.i) &&
			raw.str.charCodeAt(raw.i) <= 57
		) {
			raw.i++;
		}
		else{
			break;
		}
	}
	if (raw.i == i) {
		throw raw;
	}
	return +raw.str.slice(i, raw.i);
}

function skipSpace(raw) {
	var i = raw.str.slice(raw.i).search(/[^\s]/);

	if (i == -1) {
		raw.i = raw.str.length;
	}
	else {
		raw.i += i;
	}
}
