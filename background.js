window.addEventListener("load", function() {
	// add a button
	var UIItemProperties = {
		title: "Get this page form the cache on the web",
//		icon: "icons/18.png",
		popup: {
            href: "popup.html",
            width: 200,
            height: 200
        }
	}

	var b = opera.contexts.toolbar.createItem(UIItemProperties)
	opera.contexts.toolbar.addItem(b)

	// Listen for the click in a popup button
	opera.extension.onconnect = function(event) {
		if (event.origin.indexOf("popup.html") > -1 && event.origin.indexOf('widget://') > -1 ) {
			var tab = opera.extension.tabs.getFocused()
			if (tab) {
				tab.postMessage("port:new", [event.source])
				console.log('background.js: port:new to injected script')
			}
		}
	}

	// Listen to the message form 00-webcache.js
	opera.extension.onmessage = function(event) {
		opera.extension.tabs.create({url: event.data})
	}
	
}, false)
