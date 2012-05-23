#!/usr/bin/env node

var mr = require('../includes/00-myrelocator').myrelocator

var t = '<ul>\n'
for (var i in mr.data) {
	if (mr.isSeparator(i))
		t += '<hr />\n'
	else
		t += '<li>' + i + '</li>\n'
}
t += '</ul>'

console.log(t)