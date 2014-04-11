all: interface-min.js sequences-min.js

.PHONY: all

interface-min.js: $(wildcard interface/*.js)
	cat interface/*.js > interface.js
	yuicompressor interface.js -o interface-min.js
	rm interface.js

sequences-min.js: $(wildcard sequences/*.js)
	cat sequences/*.js > sequences.js
	yuicompressor sequences.js -o sequences-min.js
	rm sequences.js
