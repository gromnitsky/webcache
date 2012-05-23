var test = require("tap").test

// fake browser staff
opera = {
	'extension' : {
		'tabs' : {
			'create' : function(foo) {}
		}
	}
}

var myrel = require('../includes/00-myrelocator').myrelocator

test("rewriteUri", function(t) {
	t.equal('http://webcache.googleusercontent.com/search?q=cache:foo&strip=1',
			myrel.relocate('foo', 'Google Text Only'))
	t.end()
})
