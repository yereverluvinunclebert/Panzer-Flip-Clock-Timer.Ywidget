//===========================================================================
// vitality.js
// Panzer FlipClock Widget 1.3
// Written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
//===========================================================================

/*jslint multivar */

/*property
    appendChild, createDocument, createElement, dockOpen, setAttribute,
    setDockItem, src, srcHeight, srcWidth
*/

"use strict";

function buildVitality(bg, d0, d1, hhmm) {
    var doc, dockItem, dock_bg, w, x, y, x1, y1, img0, img1;
    var style = "font-family: 'Gill Sans';font-size: 24px; font-weight: normal; color: black";

	function newDockItem(doc) {
    	var item = doc.createElement("dock-item");

    	item.setAttribute("version", "1.0");
    	return item;
	}

	function newImage(doc, src, hOffset, vOffset, width, height, hAlign, vAlign) {
    	var item = doc.createElement("image");

    	item.setAttribute("src", src);
    	item.setAttribute("hOffset", String(hOffset));
    	item.setAttribute("vOffset", String(vOffset));
    	item.setAttribute("width", String(width));
    	item.setAttribute("height", String(height));
    	item.setAttribute("hAlign", hAlign);
    	item.setAttribute("vAlign", vAlign);
    	return item;
	}

	function newText(doc, hOffset, vOffset, hAlign, vAlign, style, data) {
   		var item = doc.createElement("text");

    	item.setAttribute("hOffset", String(hOffset));
    	item.setAttribute("vOffset", String(vOffset));
    	item.setAttribute("hAlign", hAlign);
    	item.setAttribute("vAlign", vAlign);
    	item.setAttribute("style", style);
    	item.setAttribute("data", data);
    	return item;
    }

    if (!widget.dockOpen) {
        return;
    }

    doc = XMLDOM.createDocument();

    dockItem = newDockItem(doc);
    doc.appendChild(dockItem);

    if (hhmm) {
    	dock_bg = newImage(doc, bg, 0, 24, 75, 38, "left", "top");
    	dockItem.appendChild(dock_bg);

   		x = newText(doc, 11, 52, "center", "center", style, d0[0]);
    	dockItem.appendChild(x);

    	x1 = newText(doc, 27, 52, "center", "center", style, d0[1]);
    	dockItem.appendChild(x1);

   		y = newText(doc, 48, 52, "center", "center", style, d1[0]);
       	dockItem.appendChild(y);

    	y1 = newText(doc, 64, 52, "center", "center", style, d1[1]);
    	dockItem.appendChild(y1);

   		widget.setDockItem(doc, "fade");
    	return;
	}

    dock_bg = newImage(doc, bg, 0, 0, 75, 75, "left", "top");
    dockItem.appendChild(dock_bg);

    if (d0 !== "") {
        img0 = new Image();
        img0.src = d0;

        w = newImage(doc, d0, 18, 35, img0.srcWidth / 5, img0.srcHeight / 5, "center", "center");
        dockItem.appendChild(w);
    }

    img1 = new Image();
    img1.src = d1;

    x = newImage(doc, d1, 51, 35, img1.srcWidth / 5, img1.srcHeight / 5, "center", "center");
    dockItem.appendChild(x);

    widget.setDockItem(doc, "fade");
}
