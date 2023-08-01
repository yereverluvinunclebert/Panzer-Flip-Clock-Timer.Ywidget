/*
    Alert Window - makes a non-modal alert window
    Copyright © 2008-2018 Harry Whitfield

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public
    License along with this program; if not, write to the Free
    Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston,
    MA  02110-1301  USA

    Alert Window - version 1.0
    28 April, 2018
    Copyright © 2008-2018 Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint bitwise */

/*property
    appendChild, bgColor, bgOpacity, close, color, data, font, fontWeight,
    hAlign, hOffset, height, interval, level, name, onMouseDown, onTimerFired,
    opacity, open, platform, size, src, srcHeight, srcWidth, style, ticking,
    vOffset, visible, width
*/

"use strict";

/////////////////////////////////// Alert Window Code ////////////////////////////////////

var newAlertWindow = function (base, macSrc, macOkSrc, winSrc, winOkSrc, winCloseSrc, timeout) {
	var src = (
		system.platform === "macintosh"
		? base + "/" + macSrc
		: base + "/" + winSrc
	);
	var okSrc = (
		system.platform === "macintosh"
		? base + "/" + macOkSrc
		: base + "/" + winOkSrc
	);
	var closeSrc = base + "/" + winCloseSrc;

	var o = new Window();

	function newImage(parent, src, visible) {
		var oo = new Image();

		oo.src = src;
		oo.hOffset = 0;
		oo.vOffset = 0;
		oo.width = oo.srcWidth;
		oo.height = oo.srcHeight;
		oo.hAlign = "left";
		oo.opacity = 255;
		oo.visible = visible;
		parent.appendChild(oo);
		return oo;
	}

	function newText(parent) {
		var oo = new Text();

		oo.hOffset = 0;
		oo.vOffset = 0;
		oo.width = 300;
		oo.height = 16;
		oo.hAlign = "left";
		oo.font = "Helvetica";
		oo.size = 11;
		oo.color = "#000000";
		oo.opacity = 255;
		oo.bgColor = "#FFFFFF";
		oo.bgOpacity = 0;
		parent.appendChild(oo);
		return oo;
	}

	var img = newImage(o, src, true);
	var okButton = newImage(o, okSrc, true);
	var closeButton = null;
	if (system.platform !== "macintosh") {
		closeButton = newImage(o, closeSrc, true);
	}
	var title = newText(o);
	var text = newText(o);
	var timer = new Timer();

	if (system.platform === "macintosh") {
		okButton.hOffset = 320;
		okButton.vOffset = 112;
		title.size = 14;
		title.font = "Helvetica";
		title.style.fontWeight = "bold";
		title.hOffset = 106;
		title.vOffset = 51;
		text.hOffset = 106;
		text.vOffset = 73;
	} else {
		okButton.hOffset = 194;
		okButton.vOffset = 77;
		closeButton.hOffset = 454;
		closeButton.vOffset = 8;
		closeButton.width = 10;
		closeButton.height = 10;
		title.size = 13;
		title.font = "Arial";
		title.hOffset = 7;
		title.vOffset = 16;
		text.width = 400;
		text.font = "Arial";
		text.hOffset = 61;
		text.vOffset = 53;
	}

	title.data = widget.name;

	timer.interval = timeout;
	timer.ticking = false;

	o.hOffset = (screen.width >> 1) - 210;
	o.vOffset = 250;
	o.width = img.width;
	o.height = img.height;
	o.level = "topMost";
	o.visible = false;

	o.close = function () {
    	timer.ticking = false;
    	o.visible = false;
	};

	timer.onTimerFired = o.close;

	okButton.onMouseDown = o.close;

	if (system.platform !== "macintosh") {
		closeButton.onMouseDown = o.close;
	}

	o.open = function (theText) {
		text.data = theText;
		o.visible = true;
    	timer.ticking = true;
 	};

	return o;
};

/////////////////////////////// End of Alert Window Code /////////////////////////////////

//var alertWindow = newAlertWindow("Resources/AlertImages", "alert.png", "okButton.png", "alertWin.png", "okButtonWin.png", "closeButtonWin.png", 3);
//alertWindow.open("alert message");
