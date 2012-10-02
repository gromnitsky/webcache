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
				tab.postMessage({msg: 'portNew'}, [event.source])
				console.log('background.js: newPort to injected script')
			}
		}
	}

	// Listen to the messages form main.js.
	// Those are the result of clinking in popup.html.
	opera.extension.onmessage = function(event) {
		opera.extension.tabs.create({url: event.data})
	}
	
}, false)


window.addEventListener('DOMContentLoaded', function() {
	if (opera.contexts.menu) {
		// create a menu item properties object
		var itemProps = {
			contexts: ['link', 'image'],
			title: 'webcache',
			onclick: function(event) {
				// send a message to the injected script in the originating tab
				console.log('background.js: clicked in the context menu')
				var m = {
					msg: 'menuContext',
					mdata: 'some crawler'
				}
				event.source.postMessage(m)
			}
		}
		
		// create a menu item
		var item = opera.contexts.menu.createItem(itemProps)
		opera.contexts.menu.addItem(item)
	} else {
		console.log('background.js: opera.contexts.menu is undefined')
	}
}, false);

console.log('background.js: loaded')
