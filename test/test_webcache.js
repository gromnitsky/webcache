var test = require("tap").test

// fake browser staff
opera = {
	'extension' : {
		'tabs' : {
			'create' : function(foo) {}
		}
	}
}

var cf = require('../src/cachefinder').cachefinder

test("rewriteUri", function(t) {
	t.equal('http://webcache.googleusercontent.com/search?q=cache:foo&strip=1',
			cf.find('foo', 'Google Text Only'))
	t.end()
})
