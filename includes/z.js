/*
  Injects in all pages. Serves as "main".
*/

/*global CacheFinder:true */
(function() {

	/*
	  Listen to messages from background.js.

	  event.data is a hash: { msg: 'my message name', mdata: 'my message data' }
	*/
	opera.extension.onmessage = function(event) {
		if (!event.data.msg) throw new Error("z.js: unknown message format")
		
		switch (event.data.msg) {
		case 'portNew':
			var channel = new MessageChannel()
			event.ports[0].postMessage({msg: 'portReady'}, [channel.port2])
			channel.port1.onmessage = handlePopupMessage
			
			console.log('z.js: new port send')
			break
		case 'menuContext':
			console.log('z.js: menuContent')
			// doing nothing here, just passing by in route to
			// opera.contexts.menu.onclick
			break
		default:
			console.error('z.js: unknown message: ' + event.data.msg)
			break
		}
	}

	opera.contexts.menu.onclick = function(menuEvent) {
		console.dir(menuEvent)
		// listen for a message from background.js
		opera.extension.addEventListener('message', function(event) {
			console.log('z.js: USER CLICKED ON CM: ' + event.data.mdata)
			var src = menuEvent.linkURL || menuEvent.srcURL
			if (!src) throw new Error('cannot get info from clicked DOM element')
			loadCrawler(src, event.data.mdata)
		}, false)
	}

	function handlePopupMessage(event) {
		console.log("z.js: MESSAGE RECEIVED FROM THE POPUP: " + event.data.mdata)
		loadCrawler(window.location, event.data.mdata)
	}

	// Sent it to background.js to open a new tab with transformed src as URL.
	function loadCrawler(src, crawlerName) {
		var uri = null
		try {
			uri = CacheFinder.find(src, crawlerName)
		} catch (e) {
			alert(e.message)
			return
		}
		
		opera.extension.postMessage(uri)
	}

}).call(this)
