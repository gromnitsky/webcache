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
		case 'error':
			alert("Error: " + event.data.mdata)
			break
		case 'getLocation':
			console.log('z.js: sent window.location to bg')
			opera.extension.postMessage({
				msg: 'location',
				mdata: {
					crawlerName: event.data.mdata,
					location: window.location.toString()
				}
			})
			break
		default:
			console.error('z.js: unknown message: ' + event.data.msg)
			break
		}
	}
	
}).call(this)
