function mybind() {
	var e = document.querySelectorAll('li')
	var o = this
	for (var i = 0, len = e.length; i < len; i++) {
		e[i].addEventListener('click', function() {
			opera.extension.bgProcess.openTabFromPopup(this.innerText)
		}, false)
	}
}

/* Main */
window.onload = function() {
	mybind()
}
