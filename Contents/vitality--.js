//===========================================================================
// vitality.js
// Panzer FlipClock Widget 1.0
// Written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
//===========================================================================

/*jslint multivar */

/*property
    appendChild, createDocument, createElement, dockOpen, setAttribute,
    setDockItem, src, srcHeight, srcWidth
*/

"use strict";

//=========================================================================
// this function builds vitality for the dock
//=========================================================================
function buildVitality(bg, d0, d1, hhmm) {
    var d, v, dock_bg, w, x, y, x1, y1, img0, img1;

    if (!widget.dockOpen) {
        return;
    }

    d = XMLDOM.createDocument();
    v = d.createElement("dock-item");
    v.setAttribute("version", "1.0");
    d.appendChild(v);

    dock_bg = d.createElement("image");
    dock_bg.setAttribute("src", bg);
    dock_bg.setAttribute("hOffset", 0);

    if (hhmm) {
    	dock_bg.setAttribute("vOffset", 24);
    	v.appendChild(dock_bg);

   		x = d.createElement("text");

    	x.setAttribute("hOffset", "11");
    	x.setAttribute("vOffset", "52");
    	x.setAttribute("hAlign", "center");
    	x.setAttribute("vAlign", "center");
    	x.setAttribute("style", "font-family: 'Gill Sans';font-size: 24px; font-weight: normal; color: black");
    	x.setAttribute("data", d0[0]);
    	v.appendChild(x);

    	x1 = d.createElement("text");

    	x1.setAttribute("hOffset", "27");
    	x1.setAttribute("vOffset", "52");
    	x1.setAttribute("hAlign", "center");
    	x1.setAttribute("vAlign", "center");
    	x1.setAttribute("style", "font-family: 'Gill Sans';font-size: 24px; font-weight: normal; color: black");
    	x1.setAttribute("data", d0[1]);
    	v.appendChild(x1);

   		y = d.createElement("text");

    	y.setAttribute("hOffset", "48");
    	y.setAttribute("vOffset", "52");
    	y.setAttribute("hAlign", "center");
    	y.setAttribute("vAlign", "center");
    	y.setAttribute("style", "font-family: 'Gill Sans';font-size: 24px; font-weight: normal; color: black");
    	y.setAttribute("data", d1[0]);
    	v.appendChild(y);

    	y1 = d.createElement("text");

    	y1.setAttribute("hOffset", "64");
    	y1.setAttribute("vOffset", "52");
    	y1.setAttribute("hAlign", "center");
    	y1.setAttribute("vAlign", "center");
    	y1.setAttribute("style", "font-family: 'Gill Sans';font-size: 24px; font-weight: normal; color: black");
    	y1.setAttribute("data", d1[1]);
    	v.appendChild(y1);

   		widget.setDockItem(d, "fade");
    	return;
	}

    dock_bg.setAttribute("vOffset", 0);
    v.appendChild(dock_bg);

    if (d0 !== "") {
        img0 = new Image();
        img0.src = d0;

        w = d.createElement("image");
        w.setAttribute("src", d0);
        w.setAttribute("hOffset", "18");
        w.setAttribute("vOffset", "35");
        w.setAttribute("hAlign", "center");
        w.setAttribute("vAlign", "center");
        w.setAttribute("width", img0.srcWidth / 5);
        w.setAttribute("height", img0.srcHeight / 5);
        v.appendChild(w);
    }

    img1 = new Image();
    img1.src = d1;

    x = d.createElement("image");
    x.setAttribute("src", d1);
    x.setAttribute("hOffset", "51");
    x.setAttribute("vOffset", "35");
    x.setAttribute("hAlign", "center");
    x.setAttribute("vAlign", "center");
    x.setAttribute("width", img1.srcWidth / 5);
    x.setAttribute("height", img1.srcHeight / 5);
    v.appendChild(x);

    widget.setDockItem(d, "fade");
}
//=====================
//End function
//=====================
