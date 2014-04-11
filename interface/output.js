var curInput = null,
curSequence = null;

function refreshSequence() {
	if (curInput == elDeal.val()) {
		return;
	}
	curInput = elDeal.val();
	try {
		curSequence = new Sequence(curInput);
	}
	catch (e) {
		elStatus.text('A' + (e.i + 1).toString());
		rejectSequence('');
		return;
	}
	setHash(curInput);
	try {
		curSequence.build();
	}
	catch (e) {
		elStatus.html('B' + e.toString());
		rejectSequence('Your deal <a href="#0%5E0-1">does</a> ' +
		'<a href="#0%5E0-2">not</a> <a href="#0%5E0-3">make</a> ' +
		'<a href="#0%5E0-4">sense</a>!');
		return;
	}
	elStatus.html('C' + curSequence.machine.states.toString());
	elList.html('');
	identifySequence(listSequence());
}

function rejectSequence(reason) {
	curSequence = null;
	elList.html('');
	listSequence();
	elInfo.html(reason);
}

function identifySequence(initial) {
	var identity = curSequence.identify();

	if (knownSequences.hasOwnProperty(identity)) {
		elInfo.html(knownSequences[identity]);
	}
	else {
		elInfo.html('Does this sequence <a href="http://oeis.org/search?q=' +
		encodeURIComponent('signed:' + initial.slice(2, 12).join(',')) +
		'&fmt=short" title="Search the OEIS">look familiar</a>?');
	}
}

function listSequence() {
	var i,
	items = [];

	for (i = 0; i < 12 || elBottom.is(':in-viewport'); i++) {
		if (curSequence == null) {
			elList.append('<li></li>');
		}
		else {
			items.push(curSequence.next().toString());
			elList.append('<li><span class="num">' + items[i] + '</span></li>');
		}
	}
	return items;
}
