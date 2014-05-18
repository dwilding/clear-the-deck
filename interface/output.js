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
	var input = curInput;

	// if we have already searched for this deal
	if (knownDeals.hasOwnProperty(input)) {
		getKnown(input);
		return;
	}
	// search the OEIS instead
	elInfo.html('Searching for this sequence&hellip;');
	// remove unecessary trailing terms
	items = encodeURIComponent(items.slice(0, defaultLength).join(', '));
	// initiate the search
	$.getJSON('oeis.php?q=' + items, function (results) {
		var i, j, sequence, machine, identity;

		// if the search results are no longer relevant
		if (curInput != input) {
			return;
		}
		// for each result
		for (i = 0; i < results.length; i++) {
			// if the result has an identity
			if (results[i].identity != null) {
				// accept the result if its its identity is correct
				if (results[i].identity == curSequence.identify()) {
					knownDeals[input] = {
						title: results[i].title,
						info: results[i].info
					};
					getKnown(input);
					return;
				}
			}
			// if the result has a deal
			else if (results[i].deal != null) {
				// turn the deal into a sequence so that we can get its identity
				sequence = new Sequence(results[i].deal);
				sequence.build();
				// accept the result if its identity is correct
				if (sequence.identify() == curSequence.identify()) {
					knownDeals[input] = {
						title: results[i].title,
						info: results[i].info
					};
					getKnown(input);
					return;
				}
				// if the result's sequence is offset
				if (results[i].offset > 0) {
					// shift our sequence's machine by the offset
					machine = buildProduct(
						charMachine(results[i].offset),
						curSequence.machine
					);
					// accept the result if its identity is correct up to offset
					identity = identifyExpression(machine.expr);
					if (sequence.identify() == identity) {
						knownDeals[input] = {
							title: null,
							info: results[i].info_offset
						};
						getKnown(input);
						return;
					}
				}
			}
			// if the result is the fallback (final) result
			else {
				knownDeals[input] = {
					title: results[i].title,
					info: results[i].info
				};
				getKnown(input);
			}
		}
	});
}

function getKnown(input) {
	if (knownDeals[input].title != null) {
		document.title = knownDeals[input].title + ' - ' + defaultTitle;
	}
	elInfo.html(knownDeals[input].info);
}
