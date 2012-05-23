// Listen for messages from background.js
(function() {

	// Listen to messages from background.js
	opera.extension.onmessage = function(event) {
		switch (event.data) {
		case 'port:new':
			var channel = new MessageChannel()
			
			event.ports[0].postMessage("port:ready", [channel.port2])
			channel.port1.onmessage = handlePopupMessage
			
			console.log('99-webcache.js: new port send')
			break
		default:
			console.error('99-webcache.js: unknown message: ' + event.data)
			break
		}
	}

	function handlePopupMessage(event) {
		console.log("99-webcache.js: MESSAGE RECEIVED FROM THE POPUP: " + event.data)

		// sent it to background.js to open a new tab with
		opera.extension.postMessage(MyRelocator.relocate(window.location.toString(),
														 event.data))
	}
	
})()
