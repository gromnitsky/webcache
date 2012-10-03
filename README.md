# webcache

An extension for Opera 12.10+. Creates:

* a toolbar button with a popup menu of several web crawlers;
* a context menu (right click on a link or image) with a crawlers list.

See `src/cachefinder.js` for available crawlers so far.


## FAQ

1. _I installed this but it doesn't work: clicking on the popup list
   does nothing!_

   Press `shift` & click on browser `Reload` button. Then the popup will
   work. Or restart Opera after installing the extension.


## Installation

To build the extension you'll need:

1. nodejs (with npm)
2. json command line tool (https://github.com/trentm/json)
3. GNU versions of m4 & make.

Type:

	$ make oex

And look for `webcache-x.y.z.oex` file to appear.


## License

MIT.
