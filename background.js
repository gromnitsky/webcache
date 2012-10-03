/*global CacheFinder:true */

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
			if (!tab) throw new Error('background.js: no tab focus')
			tab.postMessage({msg: 'portNew'}, [event.source])
			console.log('background.js: newPort to injected script')
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
		var folder = makeMenu(function(event) {
			console.log('background.js: click in the context menu')
			var m = {
				msg: 'menuContext',
				mdata: {
					crawler: event.target.title,
					src: (event.linkURL || event.srcURL)
				}
			}
			// send a message to the injected script in the originating tab
			event.source.postMessage(m)
		})
		
		opera.contexts.menu.addItem(folder)
	} else {
		console.log("background.js: contexts menu isn't supported; upgrade Opera to 12.10")
	}
}, false)

function makeMenu(onclickCallback) {
	var folder = opera.contexts.menu.createItem({
		contexts: ['link', 'image'],
		title: 'webcache',
		type: 'folder',
		icon: 'icons/16.png'
	})

	// put entries in folder
	for (var idx in CacheFinder.data) {
		var entry = null
		
		if (CacheFinder.isSeparator(idx)) {
			entry = opera.contexts.menu.createItem({
				contexts: ['link', 'image'],
				title: idx,
				type: 'line'
			})
		} else {
			if (CacheFinder.data[idx].hide) continue
			
			entry = opera.contexts.menu.createItem({
				contexts: ['link', 'image'],
				title: idx,
				type: 'entry',
				onclick: function(event) { onclickCallback(event) }
			})
		}

		folder.addItem(entry)
	}

	return folder
}

console.log('background.js: loaded')
