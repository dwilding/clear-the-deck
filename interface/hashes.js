/*
We want to store the current deal in the URL so that bookmarks, history and
links work properly. This means we need functions to manipulate the URL hash.

When we set the URL hash as the user types their deal we have to prevent that
hash change from propagating through to refreshSequence(), otherwise if the user
types too quickly an old deal will overwrite their new deal. noHashChangeUntil
contains the hash we have to see before we allow changes to propagate again.
There is probably a better way to achieve this.
*/
var noHashChangeUntil = null;

function getHash() {
	var hash = location.hash;

	// just to be safe
	if (hash[0] == '#') {
		hash = hash.slice(1);
	}
	return decodeURIComponent(hash);
}

function setHash(hash) {
	// only set the URL hash if necessary
	if (hash != getHash()) {
		// block hashChange() until we see this hash
		noHashChangeUntil = hash;
		location.hash = '#' + encodeURIComponent(hash);
	}
}

function hashChange() {
	var hash = getHash();

	// if we're not blocked
	if (noHashChangeUntil == null) {
		// let the new hash propagate
		elDeal.val(hash);
		refreshSequence();
	}
	// if we're blocked and we see the hash we're waiting for
	else if (hash == noHashChangeUntil) {
		// no longer blocked
		noHashChangeUntil = null;
	}
}
