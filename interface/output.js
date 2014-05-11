var defaultTitle = 'Clear the deck',
defaultLength = 12, // the minimum number of sequence terms we'll generate
maxNumber = Math.pow(2, 53) - 1, // largest accurate number
curInput = null,
curSequence = null;

function refreshSequence() {
	// no need to do anything if the deal hasn't changed
	if (curInput == elDeal.val()) {
		return;
	}
	curInput = elDeal.val();
	// reset the page elements in preparation for a new sequence
	document.title = defaultTitle;
	elList.html('');
	elInfo.html('');
	try {
		curSequence = new Sequence(curInput);
	}
	// if the deal is not syntactically valid
	catch (e) {
		elStatus.text((e.i + 1).toString() + 'A');
		// generate a placeholder sequence (indices only)
		curSequence = null;
		listSequence();
		return;
	}
	// the deal is valid, so it's worth remembering
	setHash(curInput);
	try {
		curSequence.build();
	}
	catch (e) {
		// if the deal contains an infinite repetition
		if (e.type == 'repeatError') {
			elStatus.html(e.number.toString() + 'B');
		}
		// if the machines are getting too big
		else if (e.type == 'sizeError') {
			elStatus.html(e.number.toString() + 'D');
		}
		// generate a placeholder sequence (indices only)
		curSequence = null;
		listSequence();
		return;
	}
	// the deal is meaningful and the machine is not too big
	elStatus.html(curSequence.machine.states.toString() + 'C');
	// start generarting the sequence and see if we recognise it
	identifySequence(listSequence());
}

function listSequence() {
	var i, item,
	items = [];

	// generate at least enough sequence terms to fill the page
	for (i = 0; i < defaultLength || elBottom.is(':in-viewport'); i++) {
		// if curSequence is a placeholder sequence
		if (curSequence == null) {
			elList.append('<li></li>');
		}
		// if curSequence is a genuine sequence
		else {
			item = curSequence.next();
			// if item is too large to be accurate
			if (item > maxNumber) {
				items.push(null); // don't know what else to do
				elList.append('<li><span class="item">&ge; ' +
				(maxNumber + 1).toString() + '<span></li>');
			}
			else {
				items.push(item.toString());
				elList.append('<li><span class="item num">' +
				items[i] + '</span></li>');
			}
		}
	}
	return items;
}

function identifySequence(items) {
	var i, initial, identity, query, offset, link, input;

	// get rid of unecessary sequence terms
	items = items.slice(0, defaultLength);
	initial = items.join(',');
	// if the sequence looks like it might have come from a known deal
	if (knownDeals.hasOwnProperty(initial)) {
		// identify the sequence and display information about it
		identity = curSequence.identify();
		if (knownDeals[initial].hasOwnProperty(identity)) {
			elInfo.html(getDeal(initial, identity));
			return;
		}
	}
	// get rid of the first couple of zero terms before searching the OEIS
	for (i = 0; i < 2 && items[i] == 0; i++) {}
	query = encodeURIComponent(items.slice(i).join(','));
	offset = i.toString();
	// display a searching message
	link = '<a href="' + 'http://oeis.org/search?q=signed%3A' +
	query + '&fmt=short" title="Search for this sequence">the OEIS</a>';
	elInfo.html('Searching ' + link + '&hellip;');
	// store current input (so we can check if the search results are relevant)
	input = curInput;
	// initiate the search
	$.getJSON(
		'oeis.php?q=' + query + '&o=' + offset,
		// this function will receive the search results
		function(results) {
			var i, sequence;

			// if the search results are still relevant
			if (curInput == input) {
				// for each result
				for (i = 0; i < results.length; i++) {
					// turn the result's deal into a sequence
					try {
						sequence = new Sequence(results[i].deal);
						sequence.build();
					}
					catch (e) {
						continue;
					}
					// if the result's sequence looks like it matches ours
					if (checkSequence(sequence, items)) {
						// identify our sequence if necessary
						if (typeof identity != 'string') {
							identity = curSequence.identify();
						}
						// if the sequence identities match then we're done
						if (sequence.identify() == identity) {
							addDeal(initial, identity, results[i].oeis);
							elInfo.html(getDeal(initial, identity));
							return;
						}
					}
				}
				// none of the search results have our sequence's identity
				elInfo.html('This sequence may or may not exist in ' +
				link + '.');
			}
		}
	);
}

function checkSequence(sequence, items) {
	var i;

	// check that the first defaultLength terms in the sequence match the items
	for (i = 0; i < defaultLength; i++) {
		if (sequence.next() != items[i]) {
			return false;
		}
	}
	return true;
}
