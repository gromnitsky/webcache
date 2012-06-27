// Listen to messages from background.js
opera.extension.onmessage = function(event) {
	switch (event.data) {
	case 'port:new':
		var channel = new MessageChannel()
		event.ports[0].postMessage("port:ready", [channel.port2])
		channel.port1.onmessage = handlePopupMessage
		
		console.log('main.js: new port send')
		break
	default:
		console.error('main.js: unknown message: ' + event.data)
		break
	}
}

function handlePopupMessage(event) {
	console.log("main.js: MESSAGE RECEIVED FROM THE POPUP: " + event.data)

	// sent it to background.js to open a new tab with current
	// window URL
	try {
		var uri = CacheFinder.find(window.location, event.data)
	} catch (e) {
		alert(e.message)
		return
	}
	
	opera.extension.postMessage(uri)
}
