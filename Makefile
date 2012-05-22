M4 = gm4
JSONTOOL = json

INFO = package.json
NAME = $(shell $(JSONTOOL) name < $(INFO))
VER = $(shell $(JSONTOOL) version < $(INFO))
PACKAGE = $(NAME)-$(VER).oex
TEMPLATE = template

.PHONY: src src_clean clean test package package_clean

all: test

src_clean:
	rm -rf config.xml

src: config.xml

config.xml: $(INFO) $(TEMPLATE)/config-xml.js $(TEMPLATE)/config.xml.m4
	$(TEMPLATE)/config-xml.js $< $(TEMPLATE)/config.xml.m4 > $@

test: src
	node_modules/.bin/tap test

package_clean:
	rm -rf $(PACKAGE)

package: $(INFO) package_clean src
	zip $(PACKAGE) `$(JSONTOOL) files < $< | $(JSONTOOL) -a`

clean: package_clean src_clean
