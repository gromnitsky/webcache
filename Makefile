M4 := gm4
JSONTOOL := json
MOCHA := node_modules/.bin/mocha

INFO := package.json
NAME := $(shell $(JSONTOOL) name < $(INFO))
VER := $(shell $(JSONTOOL) version < $(INFO))
PACKAGE := $(NAME)-$(VER).oex
TEMPLATE := template
SRC := $(wildcard src/*.js)

all: test

src_clean:
	rm -rf config.xml popup.html includes/base.js

src: config.xml includes/base.js popup.html

config.xml: $(INFO) $(TEMPLATE)/config-xml.js $(TEMPLATE)/config.xml.m4
	$(TEMPLATE)/config-xml.js $< $(TEMPLATE)/config.xml.m4 > $@

popup.html: $(TEMPLATE)/popup.m4 $(TEMPLATE)/popup.js $(SRC)
	$(M4) -D_SCRIPT=$(TEMPLATE)/popup.js $< > $@

includes/base.js: $(TEMPLATE)/src.m4 $(SRC)
	$(M4) $< > $@

node_modules: package.json
	npm install
	touch $@

test: src node_modules
	$(MOCHA) -u tdd

package_clean:
	rm -rf $(PACKAGE)

package: $(INFO) package_clean src
	zip $(PACKAGE) `$(JSONTOOL) files < $< | $(JSONTOOL) -a`

clean: package_clean src_clean

findjs:
	@ls *js $(SRC)

.PHONY: src src_clean clean test package package_clean findjs
