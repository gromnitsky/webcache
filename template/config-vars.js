#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var spawn = require('child_process').spawn

function m4macro(name, val) {
	return "define(`" + name + "', `" + val + "')dnl\n"
}

if (process.argv.length < 4) {
	console.error('usage: '+path.basename(process.argv[1])+' package.json template.m4')
	process.exit(1)
}

var json = JSON.parse(fs.readFileSync(process.argv[2], "ascii"))

// extract from JSON staff for m4 macro definitions
var m4m = ''
m4m += m4macro('_NAME', json.name)
m4m += m4macro('_VERSION', json.version)
m4m += m4macro('_DESCRIPTION', json.description)
m4m += m4macro('_AUTHOR', json.author.match(/(.+) <(.+)>/)[1])
m4m += m4macro('_EMAIL', json.author.match(/(.+) <(.+)>/)[2])
m4m += m4macro('_HOMEPAGE', json.repository.url)

// run m4 and feed its stdin with a template
var ls = spawn('gm4')
ls.stdin.write(m4m + fs.readFileSync(process.argv[3], "ascii"))
ls.stdin.end()

ls.stdout.on('data', function(data) {
	console.log(data.toString())
});

ls.stderr.on('data', function(data) {
	console.error(data.toString())
});

ls.on('exit', function(code) {
	if (code !== 0) process.exit(code)
});
