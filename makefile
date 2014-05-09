all: interface-min.js sequences-min.js

%-min.js: %/*.js
	cat $^ > $@
	yuicompressor $@ -o $@

.PHONY: all
