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

	// listen to the messages form z.js (those are the result of
	// clinking in popup.html or context menu).
	opera.extension.onmessage = function(event) {
		if (!event.data.msg) throw new Error("bg.js: unknown message format")
		
		switch (event.data.msg) {
		case 'location':
			openTab(event.data.mdata.crawlerName, event.data.mdata.location)
			break
		default:
			console.error('bg.js: unknown message: ' + event.data.msg)
			break
		}
	}
	
}, false)

function openTabFromPopup(crawlerName) {
	var tab = opera.extension.tabs.getFocused()
	if (!tab) throw new Error('bg.js: no tab focus')
			
	console.log('bg.js: ask for window.location')
	tab.postMessage({msg: 'getLocation', mdata: crawlerName})
}

// Alert a user from an injected script.
function errx(text) {
	var tab = opera.extension.tabs.getFocused()
	if (!tab) throw new Error('bg.js: no tab focus')
			
	tab.postMessage({msg: 'error', mdata: text})
}

function openTab(crawlerName, src) {
	var uri = null
	try {
		uri = CacheFinder.find(src, crawlerName)
	} catch (e) {
		errx(e.message)
		return
	}
	console.log('bg.js: a new tab with: ' + uri)
	opera.extension.tabs.create({url: uri})
}

window.addEventListener('DOMContentLoaded', function() {
	if (!opera.contexts.menu) {
		console.error("bg.js: contexts menu isn't supported; upgrade Opera to 12.10")
	}
	
	var folder = makeMenu(function(event) {
		console.log('bg.js: click in the context menu: ' + event.target.title)
		var	src = event.linkURL || event.srcURL
		openTab(event.target.title, src)
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
