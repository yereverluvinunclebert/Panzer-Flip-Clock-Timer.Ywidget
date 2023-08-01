/*
    Log To File - A Log To File Module for Yahoo! Widgets
    Copyright © 2017,2018 Harry Whitfield

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

    Log To File - version 1.2
    30 September, 2018
    Copyright © 2017,2018 Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint multivar */

/*property
    getDate, getFullYear, getHours, getMilliseconds, getMinutes, getMonth,
    getSeconds, getUTCDate, getUTCFullYear, getUTCHours, getUTCMilliseconds,
    getUTCMinutes, getUTCMonth, getUTCSeconds, length, platform, toString,
    userDesktopFolder, writeFile
*/

"use strict";

// diagnostic printing on macintosh
var print;
if (system.platform === "macintosh") {
    print = function (s) {
        filesystem.writeFile("~/Logs/PFT Log.txt", s + "\n", true);
    };
}

var eprint = print;
var sprint = print;

var log = function (theString, utc) {    // 2004-09-20 17:36:28.004: theString
    var d = new Date(),
        year,
        month,
        date,
        hours,
        mins,
        secs,
        ms,
        temp;

    if (utc) {
        year = d.getUTCFullYear().toString();
        temp = d.getUTCMonth() + 1;
        month = temp.toString();
        date = d.getUTCDate().toString();
        hours = d.getUTCHours().toString();
        mins = d.getUTCMinutes().toString();
        secs = d.getUTCSeconds().toString();
        ms = d.getUTCMilliseconds().toString();
    } else {
        year = d.getFullYear().toString();
        temp = d.getMonth() + 1;
        month = temp.toString();
        date = d.getDate().toString();
        hours = d.getHours().toString();
        mins = d.getMinutes().toString();
        secs = d.getSeconds().toString();
        ms = d.getMilliseconds().toString();
    }

    if (month.length === 1) {
        month = "0" + month;
    }

    if (date.length === 1) {
        date = "0" + date;
    }

    if (hours.length === 1) {
    	hours = "0" + hours;
    }

    if (mins.length === 1) {
    	mins = "0" + mins;
    }

    if (secs.length === 1) {
    	secs = "0" + secs;
    }

    if (ms.length === 2) {
        ms = "0" + ms;
    } else if (ms.length === 1) {
        ms = "00" + ms;
    }
    print(year + "-" + month + "-" + date + " " + hours + ":" + mins + ":" + secs + "." + ms + ": " + theString);
};

var lprint = log;

