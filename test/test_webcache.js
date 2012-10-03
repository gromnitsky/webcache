/*global suite:true, setup:true, test:true */

var assert = require('assert')

var Zombie = require("zombie")
var	browser = new Zombie()

// fake browser staff
opera = {
	'extension' : {
		'tabs' : {
			'create' : function(foo) {}
		}
	}
}

var cf = require('../includes/cachefinder').CacheFinder

suite('cachefinder', function() {

	setup(function(){
	})

	test("rewriteUri", function() {
		assert.equal('http://webcache.googleusercontent.com/search?q=cache:foo&strip=1',
					 cf.find('foo', 'Google Text Only'))
	})

	test("coralcdn", function() {
		browser.window.location = 'http://www.example.com:1234/host?s=1&2=3#ccc'
		assert.equal('http://www.example.com.1234.nyud.net/host?s=1&2=3#ccc',
					 cf.find(browser.window.location, 'Coral CDN'))

		browser.window.location = 'http://example.com'
		assert.equal('http://example.com.80.nyud.net/',
					 cf.find(browser.window.location, 'Coral CDN'))

		browser.window.location = 'https://example.com'
		assert.throws(function() {
			cf.find(browser.window.location, 'Coral CDN')
		})
					 
	})
	
})
