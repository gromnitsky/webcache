window.addEventListener("load", function() {
	var UIItemProperties = {
		title: "Get a cached version of this page",
		icon: "icons/18.png",
		popup: {
            href: "popup.html",
            width: 200,
            height: 180
        }
	}

	// add a button
	var b = opera.contexts.toolbar.createItem(UIItemProperties)
	opera.contexts.toolbar.addItem(b)

	// Listen for a click in a popup button
	opera.extension.onconnect = function(event) {
		if (event.origin.indexOf("popup.html") > -1
			&& event.origin.indexOf('widget://') > -1 ) {
			var tab = opera.extension.tabs.getFocused()
			if (tab) {
				tab.postMessage("port:new", [event.source])
				console.log('background.js: port:new to injected script')
			}
		}
	}

	// Listen to the messages form main.js.
	// Those are the result of clinking in popup.html.
	opera.extension.onmessage = function(event) {
		opera.extension.tabs.create({url: event.data})
	}
	
}, false)
