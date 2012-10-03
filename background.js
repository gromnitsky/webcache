/*global CacheFinder:true */

window.addEventListener("load", function() {
	var button = {
		title: "Get a cached version of this page",
		icon: "icons/18.png",
		popup: {
			href: "popup.html",
			width: 200,
			height: 180
		}
	}

	// add a button
	opera.contexts.toolbar.addItem(opera.contexts.toolbar.createItem(button))

	// Listen for a click in a popup button
	opera.extension.onconnect = function(event) {
		if (event.origin.indexOf("popup.html") > -1	&& event.origin.indexOf('widget://') > -1 ) {
			var tab = opera.extension.tabs.getFocused()
			if (!tab) throw new Error('bg.js: no tab focus')
			
			tab.postMessage({msg: 'portNew'}, [event.source])
			console.log('bg.js: (popup step 1/6) newPort to an injected script')
		}
	}

	// listen to the messages form z.js (those are the result of
	// clinking in popup.html or context menu).
	opera.extension.onmessage = function(event) {
		if (event.data.msg !== 'cacheURI')
			throw new Error('bg.js: unknown message form an injected script: ' + event.data.msg)
		
		console.log('bg.js: (popup step 6/6; cm 3/3) a new tab with: ' + event.data.mdata)
		opera.extension.tabs.create({url: event.data.mdata})
	}
	
}, false)

window.addEventListener('DOMContentLoaded', function() {
	if (!opera.contexts.menu) {
		console.error("bg.js: contexts menu isn't supported; upgrade Opera to 12.10")
	}
	
	var folder = makeMenu(function(event) {
		console.log('bg.js: (cm step 1/3) click in the context menu')
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
}, false)

function makeMenu(onclickCallback) {
	var folder = opera.contexts.menu.createItem({
		contexts: ['link', 'image'],
		title: 'Webcache',
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

console.log('bg.js: loaded')
