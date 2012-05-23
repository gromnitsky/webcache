function CacheFinder(src) {
	this.src = src
}

CacheFinder.rewriteUri = function(src, uri_template) {
	if (!src) return 'http://127.0.0.1/'
	return uri_template.replace('%s', src)
}

CacheFinder.bingCache = function(src, uri_template) {
	throw new Error("not implemented")
}

CacheFinder.isSeparator = function(text) {
	return text.match(/^separator$/i)
}

/*
  Callback:

  Prototype: foo(src, uri_template)
  Return: a string--ready-to-go uri
*/
CacheFinder.data = {
	'Google' : {
		'callback' : CacheFinder.rewriteUri,
		'uri' : 'http://webcache.googleusercontent.com/search?q=cache:%s'
	},
	'Google Text Only' : {
		'callback' : CacheFinder.rewriteUri,
		'uri' : 'http://webcache.googleusercontent.com/search?q=cache:%s&strip=1'
	},
	'separator' : null,
	'Blekko' : {
		'callback' : CacheFinder.rewriteUri,
		'uri' : 'http://blekko-webcache.com/cache/%s'
	},
	'Bing' : {
		'hide' : true,
		'callback' : CacheFinder.bingCache,
		'uri' : null
	},
	'Wayback Machine' : {
		'callback' : CacheFinder.rewriteUri,
		'uri' : 'http://wayback.archive.org/web/*/%s'
	}
}

CacheFinder.find = function(src, service) {
	if (!CacheFinder.data[service]) {
		console.error('CacheFinder.relocate: unknown service: ' + service)
		return null
	}

	var t = CacheFinder.data[service]
	return t.callback(src, t.uri)
}

// for nodejs tests
if (typeof exports == 'undefined') var exports = this['cachefinder.js'] = {}
exports.cachefinder = CacheFinder
