/*global suite:true, setup:true, test:true */

var assert = require('assert')

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
		document = {
			createElement : function(e) {
				return {
					protocol: 'http:',
					port: '1234',
					hostname: 'www.example.com',
					pathname: '/host',
					search: '?s=1&2=3',
					hash: '#ccc'
				}
			}
		}
		assert.equal('http://www.example.com.1234.nyud.net/host?s=1&2=3#ccc',
					 cf.find('http://www.example.com:1234/host?s=1&2=3#ccc',
							 'Coral CDN'))

		document = {
			createElement : function(e) {
				return {
					protocol: 'http:',
					hostname: 'example.com',
					pathname: '/',
					search: '',
					hash: ''
				}
			}
		}
		assert.equal('http://example.com.nyud.net/',
					 cf.find('http://example.com', 'Coral CDN'))

		document = {
			createElement : function(e) {
				return {
					protocol: 'https:',
					hostname: 'example.com',
					pathname: '/',
					search: '',
					hash: ''
				}
			}
		}
		assert.throws(function() {
			cf.find('https://example.com', 'Coral CDN')
		})
					 
	})
	
})
