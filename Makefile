M4 := gm4
JSONTOOL := json
MOCHA := node_modules/.bin/mocha

INFO := package.json
NAME := $(shell $(JSONTOOL) name < $(INFO))
VER := $(shell $(JSONTOOL) version < $(INFO))
PACKAGE := $(NAME)-$(VER).oex

all: test

compile_clean:
	rm -rf config.xml popup.html

compile: config.xml popup.html

config.xml: $(INFO) template/config-vars.js template/config.xml.m4
	template/config-vars.js $< template/config.xml.m4 > $@

popup.html: template/popup.m4 template/popup-ul-list.js lib/cachefinder.js
	$(M4) -D_SCRIPT=template/popup-ul-list.js $< > $@

node_modules: package.json
	npm install
	touch $@

test: compile node_modules
	$(MOCHA) -u tdd --ignore-leaks

oex_clean:
	rm -rf $(PACKAGE)

oex: $(INFO) oex_clean compile
	zip $(PACKAGE) `$(JSONTOOL) files < $< | $(JSONTOOL) -a`

clean: oex_clean compile_clean

clobber: clean
	rm -rf node_modules

findjs:
	@ls lib/*js includes/*js

.PHONY: compile compile_clean clean clobber test oex oex_clean findjs
