var defaultTitle = 'Clear the deck',
defaultLength = 12, // the minimum number of sequence terms we'll generate
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
	var i,
	items = [];

	// generate at least enough sequence terms to fill the page
	for (i = 0; i < defaultLength || elBottom.is(':in-viewport'); i++) {
		// if curSequence is a placeholder sequence
		if (curSequence == null) {
			elList.append('<li></li>');
		}
		// if curSequence is a genuine sequence
		else {
			items.push(curSequence.next().toString());
			elList.append('<li><span class="num">' + items[i] + '</span></li>');
		}
	}
	return items;
}

function identifySequence(items) {
	var initial, identity, info;

	// get rid of unecessary sequence terms
	initial = items.slice(0, defaultLength).join(',');
	// if the sequence looks like it might have come from a known deal
	if (knownDeals.hasOwnProperty(initial)) {
		identity = curSequence.identify();
		// fetch sequence info (if its identity matches a known deal)
		info = knownDeals[initial](identity);
	}
	// if there's no sequence info available
	if (typeof info != 'string') {
		// provide a link to the OEIS instead
		info = 'Does this sequence <a href="http://oeis.org/search?q=' +
		encodeURIComponent('signed:' + initial) +
		'&fmt=short" title="Search the OEIS">look familiar</a>? Email\
		<a href="mailto:hi@dpw.me">hi@dpw.me</a> if you know what it is.';
	}
	elInfo.html(info);
}
