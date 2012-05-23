function MyRelocator(src) {
	this.src = src
}

MyRelocator.rewriteUri = function(src, uri_template) {
	if (!src) return 'http://127.0.0.1/'
	return uri_template.replace('%s', src)
}

MyRelocator.bingCache = function(src, uri_template) {
	throw new Error("not implemented")
}

MyRelocator.isSeparator = function(text) {
	return text.match(/^separator$/i)
}

/*
  Callback:

  Prototype: foo(src, uri_template)
  Return: a string--ready-to-go uri
*/
MyRelocator.data = {
	'Google' : {
		'callback' : MyRelocator.rewriteUri,
		'uri' : 'http://webcache.googleusercontent.com/search?q=cache:%s'
	},
	'Google Text Only' : {
		'callback' : MyRelocator.rewriteUri,
		'uri' : 'http://webcache.googleusercontent.com/search?q=cache:%s&strip=1'
	},
	'separator' : null,
	'Blekko' : {
		'callback' : MyRelocator.rewriteUri,
		'uri' : 'http://blekko-webcache.com/cache/%s'
	},
	'Wayback Machine' : {
		'callback' : MyRelocator.rewriteUri,
		'uri' : 'http://wayback.archive.org/web/*/%s'
	},
	'Bing' : {
		'callback' : MyRelocator.bingCache,
		'uri' : null
	}
}

MyRelocator.relocate = function(src, service) {
	if (!MyRelocator.data[service]) {
		console.error('MyRelocator.relocate: unknown service: ' + service)
		return null
	}

	var t = MyRelocator.data[service]
	return t.callback(src, t.uri)
}

// for nodejs tests
if (typeof exports == 'undefined') var exports = this['00-myrelocator.js'] = {}
exports.myrelocator = MyRelocator
