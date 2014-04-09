function matrixProduct(left, right) {
	var i, j, k,
	matrix = [];

	for (i = 0; i < left.length; i++) {
		matrix[i] = [];
		for (j = 0; j < right[0].length; j++) {
			matrix[i][j] = 0;
			for (k = 0; k < right.length; k++) {
				matrix[i][j] += left[i][k] * right[k][j];
			}
		}
	}
	return matrix;
}

function matrixConcat(left, right) {
	var i,
	matrix = [];

	for (i = 0; i < left.length; i++) {
		matrix[i] = left[i].concat(right[i])
	}
	return matrix;
}

function zeroMatrix(rows, cols) {
	var i, j,
	matrix = [];

	for (i = 0; i < rows; i++) {
		matrix[i] = [];
		for (j = 0; j < cols; j++) {
			matrix[i][j] = 0;
		}
	}
	return matrix;
}
