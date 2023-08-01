/*
	Tell Widget Call Handler
	Copyright 2018,2021 Harry Whitfield

	This program is free software; you can redistribute it and/or modify it
	under the terms of the GNU General Public License as published by the
	Free Software Foundation; either version 2 of the License, or (at your
	option) any later version.

	This program is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	General Public License for more details.

	You should have received a copy of the GNU General Public License along
	with this program; if not, write to the Free Software Foundation, Inc.,
	51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

	Tell Widget Call Handler - version 1.2
	8 May, 2021
	Copyright 2018,2021 Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*jslint bitwise */

/*property
    availHeight, availLeft, availTop, availWidth, data, hOffset, height, match,
    onTellWidget, savedHOffset, savedVOffset, vOffset, width
*/

"use strict";

var mainWindow;
var main_window;
var helpWindow;

//////////////////////////// Code to go into controlled widgets //////////////////////////

function showWindow(show, window, defaultHOffset, defaultVOffset) {	// called by handleExternalCall
	var savedHOffset;
	var savedVOffset;
	var halfWidth;
	var halfHeight;
	var x;
	var y;

	window = window || mainWindow || main_window;

	defaultHOffset = defaultHOffset || ((screen.width - window.width) >> 1);
	defaultVOffset = defaultVOffset || ((screen.height - window.height) >> 1);

	savedHOffset = window.savedHOffset;
	savedVOffset = window.savedVOffset;

	halfWidth = window.width >> 1;
	halfHeight = window.height >> 1;

	if (show) {	// show window
		if ((savedHOffset !== undefined) && (savedVOffset !== undefined)) {	// if valid saved addresses
        	window.hOffset = savedHOffset;
        	window.vOffset = savedVOffset;
        } else {	// otherwise use default values
        	window.hOffset = defaultHOffset;
        	window.vOffset = defaultVOffset;
        }
	} else {	// hide widget
    	x = window.hOffset;
    	y = window.vOffset;
    	if ((x >= screen.width) || (y >= screen.height)) {
    		beep();
    		return;
    	}
    	if (	// check for valid addresses
    		(x > screen.availLeft - halfWidth) && (x < screen.availWidth - halfWidth) &&
        	(y > screen.availTop - halfHeight) && (y < screen.availHeight - halfHeight)
    	) {		// save valid addresses
        	window.savedHOffset = x;
        	window.savedVOffset = y;
    	} else {	// clear saved addresses
			delete window.savedHOffset;
			delete window.savedVOffset;
		}
        window.hOffset = screen.width;		// move the window off-screen
        window.vOffset = screen.height;
    }
}

var handleExternalCall = function (event) {
	var lookFor = /^show\:visible\=(true|false)$/;
	var lookFor1 = /^close\:savePrefs\=(true|false)$/;
	var found = event.data.match(lookFor);

	if (found !== null) {
		showWindow(found[1] === "true");
		showWindow(found[1] === "true", helpWindow);
	}

	found = event.data.match(lookFor1);
	if (found !== null) {
		if (found[1] === "true") {
			savePreferences();
		}
		closeWidget();
	}
};

widget.onTellWidget = handleExternalCall;		//if not set in the .kon file

// example command to be run in another widget
// tellWidget("widgetnameORpath", "show:visible=true");		// or "show:visible=false"
// tellWidget("widgetnameORpath", "close:savePrefs=true");	// or "close:savePrefs=false"
