#!/usr/bin/env node

var data = require('../includes/00-myrelocator').myrelocator.data

var t = '<ul>\n'
for (var i in data) {
	t += '<li>' + i + '</li>\n'
}
t += '</ul>'

console.log(t)