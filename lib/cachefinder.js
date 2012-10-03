/*
  Injects in all pages.

  Also used by:

  * background.js to construct a context menu.
  * popup.m4 to generate a list in popup.html.
  
*/

(function() {
	var root = typeof exports !== "undefined" && exports !== null ? exports : this

	root.CacheFinder = (function() {
		function CacheFinder() {}

		CacheFinder.rewriteUri = function(src, uri_template) {
			if (!src) return 'http://127.0.0.1/'
			return uri_template.replace('%s', src)
		}

		CacheFinder.bingCache = function(src, uri_template) {
			throw new Error("not implemented")
		}

		/*
		  Create a hidden dom <a> element to parse it like window.location.

		  src -- href for <a>
		  uri_template -- unused
		*/
		CacheFinder.coralcdn = function(src, uri_template) {
			if (!src) return 'http://127.0.0.1/'

			var a = document.createElement('a')
			a.href = src
			if (a.protocol !== 'http:') throw new Error("Coral CND supports only HTTP protocol")

			var port = a.port ? ("." + a.port) : ""
			return a.protocol + '//' + a.hostname + port + '.nyud.net' + a.pathname + a.search + a.hash
		}

		CacheFinder.isSeparator = function(text) {
			return text.match(/^separator/i)
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
			'separator 0' : null,
			'Blekko' : {
				'callback' : CacheFinder.rewriteUri,
				'uri' : 'http://blekko-webcache.com/cache/%s'
			},
			'Bing' : {
				'hide' : true,
				'callback' : CacheFinder.bingCache,
				'uri' : null
			},
			'Coral CDN' : {
				'callback' : CacheFinder.coralcdn,
				'uri' : null
			},
			'separator 1' : null,
			'Wayback Machine' : {
				'callback' : CacheFinder.rewriteUri,
				'uri' : 'http://wayback.archive.org/web/*/%s'
			},
			'Liveweb' : {
				'callback' : CacheFinder.rewriteUri,
				'uri' : 'http://liveweb.archive.org/%s'
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

		return CacheFinder
	})()

}).call(this)
