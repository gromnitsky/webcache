#!/usr/bin/env node

var cf = require('../src/cachefinder').cachefinder

var t = '<ul>\n'
for (var i in cf.data) {
	if (cf.isSeparator(i)) {
		t += '<hr />\n'
		continue
	}
	if (cf.data[i]['hide']) continue
	
	t += '<li>' + i + '</li>\n'
}
t += '</ul>'

console.log(t)