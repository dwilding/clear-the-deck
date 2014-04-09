sequences-min.js:
	cat sequences/*.js > sequences.js
	yuicompressor sequences.js -o sequences-min.js
	rm sequences.js
