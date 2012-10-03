function Linker() {
	this.port = null
}

// Listen to 'portReady' message from z.js.
Linker.prototype.listen = function() {
	var o = this
	
	opera.extension.onmessage = function(event) {
		if (event.data.msg !== "portReady") {
			console.error('popup.js: unknown message: ' + event.data.msg)
			return
		}
		
		if (event.ports.length > 0) {
			console.log('popup.js: (popup step 3/6) new port received')
			o.port = event.ports[0]
			
			o.mybind()
		}
	}
}

Linker.prototype.mybind = function() {
	var e = document.querySelectorAll('li')
	var o = this
	for (var i = 0, len = e.length; i < len; i++) {
		e[i].addEventListener('click', function() {
			o.message2injectScript(this.innerText)
		}, false)
	}
}

Linker.prototype.message2injectScript = function(userChoice) {
	if (!this.port) return
	
	this.port.postMessage({msg: 'popupSelection', mdata: userChoice})
	console.log('popup.js: (popup step 4/6) popupSelection: ' + userChoice)
}


/* Main */
window.onload = function() {
	var linker = new Linker()
	linker.listen()
}
