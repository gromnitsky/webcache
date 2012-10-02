/*global CacheFinder:true */

/*
  Listen to messages from background.js.

  event.data is a hash: { msg: 'my message name', mdata: 'my message data' }
 */
opera.extension.onmessage = function(event) {
	if (!event.data.msg) throw new Error("main.js: unknown message format")
	
	switch (event.data.msg) {
	case 'portNew':
		var channel = new MessageChannel()
		event.ports[0].postMessage({msg: 'portReady'}, [channel.port2])
		channel.port1.onmessage = handlePopupMessage
		
		console.log('main.js: new port send')
		break
	case 'menuContext':
		console.log('main.js: menuContent')
		break
	default:
		console.error('main.js: unknown message: ' + event.data.msg)
		break
	}
}

opera.contexts.menu.onclick = function(menuEvent) {
    // listen for a message from background.js
    opera.extension.addEventListener('message', function(event) {
		console.log('main.js: USER CLICKED ON CM: ' + event.data.mdata)
		var src = menuEvent.linkURL || menuEvent.srcURL
		if (!src) throw new Error('cannot get info from clicked DOM element')
		loadCrawler(src, event.data.mdata)
    }, false);
};

function handlePopupMessage(event) {
	console.log("main.js: MESSAGE RECEIVED FROM THE POPUP: " + event.data.mdata)
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
