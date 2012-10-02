function Linker() {
	this.port = null
}

// Listen to 'portReady' message from main.js
Linker.prototype.listen = function() {
	var o = this
	
	opera.extension.onmessage = function(event) {
		if (event.data.msg == "portReady") {
			if (event.ports.length > 0) {
				console.log('popup.js: new port received')
				o.port = event.ports[0]
				o.port.onmessage = this.handleMessageFromInjectedScript

				o.mybind()
			}
		} else {
			console.error('popup.js: unknown message: ' + event.data)
		}
	}
}

// FIXME: unused
Linker.prototype.handleMessageFromInjectedScript = function(event) {
	console.log("popup.js: MESSAGE FROM THE INJECTED SCRIPT: " + event.data)
}

Linker.prototype.mybind = function() {
	var e = document.querySelectorAll('li')
	var o = this
	for (var i = 0, len = e.length; i < len; i++) {
		e[i].addEventListener('click', function() {
			o.sendMessage(this.innerText)
		}, false)
	}
}

Linker.prototype.sendMessage = function(userChoice) {
	if (!this.port) return
	
	this.port.postMessage({msg: 'popupSelection', mdata: userChoice})
	console.log('popup.js: send a msg: ' + userChoice)
}


/* Main */
window.onload = function() {
	var linker = new Linker()
	linker.listen()
}
