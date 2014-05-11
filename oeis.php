<?php
	/*
	This script takes the first few terms of a sequence and returns a JSON
	formatted list of candidate sequences from the OEIS (http://oeis.org/).
	*/
	header('Content-Type: application/json');

	// query the OEIS
	$url = 'http://oeis.org/search?q=signed%3A' . $_GET['q'] . '&fmt=text';
	$handle = curl_init($url);
	curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
	$reply = curl_exec($handle);

	// loop through the names of some sequences that contain the query
	$results = array();
	preg_match_all('#%I (A\d+)#', $reply, $results, PREG_SET_ORDER);
	foreach ($results as $key => $result) {
		$name = $result[1];

		// find the first few terms of the sequence
		$regex = '#%S ' . $name . ' ([,\d]+)#';
		$sequence = array();
		preg_match($regex, $reply, $sequence);

		// pad the sequence with '0's if it has an offset
		$regex = '#%O ' . $name . ' (\d+),#';
		$offset = array();
		preg_match($regex, $reply, $offset);
		$sequence = str_repeat('0,', intval($offset[1])) . $sequence[1];

		// pad the query with '0's if an offset is given
		$query = str_repeat('0,', intval($_GET['o'])) . urldecode($_GET['q']);

		// the query should match the start of the sequence
		$length = min(strlen($query), strlen($sequence));
		if (substr($query, 0, $length) != substr($sequence, 0, $length)) {
			unset($results[$key]);
			continue;
		}

		// find a rational generating function for the sequence
		$regex = '#' . $name . ' G\.f\.: ([+*()x\^\d\s]+)/([-+*()x\^\d\s]+)#';
		$formula = array();
		preg_match($regex, $reply, $formula);
		if (empty($formula)) {
			unset($results[$key]);
			continue;
		}

		// rewrite the generating function in the form of a deal
		$numerator = convert_expression($formula[1]);
		$denominator = convert_expression(convert_denominator($formula[2]));
		$results[$key] = array(
			'deal' => $numerator . ' ' . $denominator,
			'oeis' => $name
		);
	}

	// ouput the list of candidate sequences
	echo json_encode(array_values($results));

	/*
	Convert a polynomial-based expression to a deal.
	*/
	function convert_expression($expr) {
		$expr = str_replace('*', ' ', $expr);
		$expr = preg_replace('#([+(\s])(\d+)#', '$1($2*0)', ' ' . $expr);
		$expr = str_replace('x^', '', $expr);
		$expr = str_replace('x', '1', $expr);
		return str_replace('+', 'or', $expr);
	}

	/*
	Partially convert a polynomial-based denominator to a deal. A denominator of
	the form (1 - f) corresponds to the deal f^?, so

	   (i) lone '1's and '+1's are removed,
	  (ii) '-'s are replaced with '+'s, and
	 (iii) '^?'s are added

	for each bracketed factor. However, some generating functions on the OEIS
	unfortunately have a denominator of the form (f - 1)(g - 1), which is
	equivalent to (1 - f)(1 - g) because there are two factors. To deal with
	this case, lone '-1's are also removed in step (i). This isn't really ideal,
	but I think it's good enough because the deal will be verified later anyway.
	*/
	function convert_denominator($expr) {
		$expr = preg_replace('#((\()|[-+])\s*1\s*([-+)])#', '$2$3', $expr);
		$expr = str_replace('-', '+', $expr);
		return preg_replace('#\(\s*\+?([+*x\^\d\s]+)\)#', '(($1)^?)', $expr);
	}
?>
