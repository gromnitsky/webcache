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
			console.log('z.js: menuContent mdata.title=' + event.data.mdata.crawler)
			if (!event.data.mdata.src)
				throw new Error('cannot get info from clicked DOM element')

			loadCrawler(event.data.mdata.src, event.data.mdata.crawler)
			break
		default:
			console.error('z.js: unknown message: ' + event.data.msg)
			break
		}
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
