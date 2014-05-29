<?php
	/*
	This script takes the first few terms of a sequence and returns a JSON
	formatted list of candidate sequences from the OEIS (http://oeis.org/).
	*/
	header('Content-Type: application/json');
	$query = urldecode($_GET['q']);

	// remove leading '0's for the OEIS search
	$oeis_query = explode(', ', $query);
	for ($i = 0; $i < 4 && $oeis_query[$i] == '0'; $i++) {}
	$oeis_query = array_slice($oeis_query, $i);
	$q = urlencode(implode(', ', $oeis_query));

	// first try searching the list of known sequences
	$known = json_decode(file_get_contents('oeis.json'), true);
	if (array_key_exists($query, $known)) {
		$results = $known[$query];
		foreach ($results as $key => $result) {
			$results[$key]['info'] = info($result['title']);
		}
		output($results, $q);
	}

	// search the OEIS
	$url = 'http://oeis.org/search?q=signed%3A' . $q . '&fmt=text';
	$handle = curl_init($url);
	curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
	$reply = curl_exec($handle);

	// loop through the names of some sequences that contain the query
	$results = array();
	preg_match_all('#%I (A\d+)#', $reply, $results, PREG_SET_ORDER);
	foreach ($results as $key => $result) {
		$title = $result[1];

		// find the first few terms of the sequence
		$regex = '#%S ' . $title . ' ([,\d]+)#';
		$sequence = array();
		preg_match($regex, $reply, $sequence);
		$sequence = explode(',', $sequence[1]);

		// find the sequence's offset
		$regex = '#%O ' . $title . ' (\d+),#';
		$offset = array();
		preg_match($regex, $reply, $offset);
		$offset = intval($offset[1]);

		// remove leading '0's and unecessary trailing terms from the sequence
		for ($i = 0; $i < 4 - $offset && $sequence[$i] == '0'; $i++) {}
		$sequence = array_slice($sequence, $i, count($oeis_query));

		// the query should match the start of the sequence
		if ($oeis_query != $sequence) {
			unset($results[$key]);
			continue;
		}

		// find a rational generating function for the sequence
		$regex = '#' . $title . '.*G\.f\.: ([+*()x\^\d\s]+)/([-+*()x\^\d\s]+)#';
		$formula = array();
		preg_match($regex, $reply, $formula);
		if (empty($formula)) {
			unset($results[$key]);
			continue;
		}

		// rewrite the generating function in the form of a deal
		$numerator = convert_expression($formula[1]);
		$denominator = convert_expression(convert_denominator($formula[2]));

		// prepare the result
		$results[$key] = array(
			'identity' => NULL,
			'deal' => $numerator . ' ' . $denominator,
			'title' => $title,
			'info' => info($title),
			'offset' => $offset
		);
		if ($offset > 0) {
			$results[$key]['info_offset'] = info_offset($title, $offset);
		}
	}

	// sort the results by offset and output thenm
	usort($results, function ($result1, $result2) {
		return $result1['offset'] - $result2['offset'];
	});
	output($results, $q);

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

	function info($title) {
		$link = '<a href="http://oeis.org/' . $title . '">' . $title . '</a>';
		return 'Congratulations! You have found sequence ' . $link . '.';
	}

	function info_offset($title, $offset) {
		$link = '<a href="http://oeis.org/' . $title . '">' . $title . '</a>';
		return 'This sequence looks like ' . $link .
		', but ' . $link . ' is offset by ' . $offset . '.';
	}

	function output($results, $q) {
		array_push($results, array(
			'identity' => NULL,
			'deal' => NULL,
			'info' => 'This sequence may or may not exist in ' .
			'<a href="http://oeis.org/search?q=signed%3A' . $q .
			'&fmt=short" title="Search for this sequence">the OEIS</a>.',
		));
		exit(json_encode($results));
	}
?>
