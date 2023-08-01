/*
    FileTypes - Determine types of files
    Copyright © 2008,2017 Harry Whitfield

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

    FileTypes - Determine types of files
    26 December, 2017
    Copyright © 2017 Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint multivar */

/*property
    lastIndexOf, length, platform, replace, some, split, substring,
    toLowerCase
*/

"use strict";

var eprint;

////////////////////////////////////// get file type /////////////////////////////////////

var fileTypes = ["ASCII", "UTF-8", "HTML", "XML", "ISO-8859", "C++"]; // Unix "file" command types

/*
var documentTypes = [".doc", ".docx", ".odt", ".rtf", ".pdf", ".txt", ".htm", ".html", ".ppt", ".pptx", ".xml"];
var movieTypes = [".avi", ".asf", ".mov", ".mpeg", ".mp4", ".mpg", ".flv", ".swf", ".vob", ".wmv"];
var musicTypes = [".m4a", ".mpg", ".mp3", ".aac", ".wav", ".wma", ".aif", ".aiff", ".au", ".snd", ".ogg", ".aac"];
var pictureTypes = [".gif", ".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"];
var compressedTypes = [".zip", ".rar", ".arj", ".gz", ".tgz", ".hqx", ".sit", ".sitx", ".zipx"];
*/

var imageExtns = [".gif", ".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"];
var soundExtns = [".m4a", ".mpg", ".mp3", ".aac", ".wav", ".wma", ".aif", ".aiff", ".au", ".snd", ".ogg", ".aac"];
var textExtns = [".txt", ".js", ".xml", ".vbs", ".kon", ".c", ".cc", ".bat", ".css", ".csv", ".dtd", ".faq", ".jav", ".log", ".pl", ".sig", ".htm", ".html"];

var widgetExtns = [".widget", ".wdgt"];
var packageExtns = [".rtfd"];

var isMacintosh = system && (system.platform === "macintosh");

function xtn(s) {
    var ext;
    var idx = s.lastIndexOf(".");

    if (idx >= 0) {
        ext = s.substring(idx);
        if (ext.length > 11) {
            return "";
        }
        if (ext.length > 1) {
            return ext;
        }
    }
    return "";
}

function escapePath(path) {
    return path.replace(/([\W])/g, "\\$1");
}

// calls used only on the Macintosh - never have been in Unix Utils
function getFileInfo(path) {
    return runCommand("file " + escapePath(path));
}

function getFileData(path) {
    return getFileInfo(path).substring(path.length + 2);
}

function isItemIn(item, vector) {
    return vector.some(function (ele) {
        return ele === item;
    });
}

function getFileType(path) { // returns "image", "sound", "text" or "other"
    var fileData, item, dtype, itype, mtype, stype, extn;

    // .jpg     JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16,
    //          Exif Standard: [TIFF image data, little-endian, direntries=1, copyright=© www.splashnews.com], progressive, precision 8, 564x1024, frames 3

    // .txt     ASCII text

    // .aif     IFF data, AIFF audio
    // .aiff    IFF data, AIFF audio
    // .au      Sun/NeXT audio data: 8-bit ISDN u-law, mono, 8000 Hz
    // .mp3     MP3, 128 kBits, 44.1 kHz, Mono
    // .mp3     MP3 file with ID3 version 2.3.0 tag
    // .snd     Sun/NeXT audio data: 16-bit linear PCM, mono, 22050 Hz
    // .wav     RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 44100 Hz
    // .wav     RIFF (little-endian) data, WAVE audio, Microsoft PCM, 8 bit, mono 22255 Hz
    // .mp3     MPEG ADTS, layer III, v1, 128 kbps, 44.1 kHz, Stereo

    if (system.platform === "macintosh") {
        fileData = getFileData(path);
        eprint("getFileType:fileData: " + fileData);
        item = fileData.split(" ", 3);
        if (item.length > 2) {
            itype = item[1];
            dtype = item[2].substring(0, 4);
            if ((itype === "image") && (dtype === "data")) {
                return "image";
            }
        }

        item = fileData.split(",");
        stype = item[0];
        if (
            (stype === "IFF data") || (stype === "MP3") || (stype === "MP3 file with ID3 version 2.3.0 tag") ||
            (stype === "Sun/NeXT audio data: 8-bit ISDN u-law") ||
            (stype === "Sun/NeXT audio data: 16-bit linear PCM")
        ) {
            return "sound";
        }
        mtype = item[1];
        if ((stype === "RIFF (little-endian) data") && (mtype === " WAVE audio")) {
            return "sound";
        }

        stype = item[0];
        if (isItemIn(stype, fileTypes)) {
            return "text";
        }
    }

    extn = xtn(path).toLowerCase();

    if (isItemIn(extn, imageExtns)) {
        return "image";
    }
    if (isItemIn(extn, soundExtns)) {
        return "sound";
    }
    if (isItemIn(extn, textExtns)) {
        return "text";
    }
    return "other";
}

function isImage(path) {
    return (getFileType(path) === "image");
}
function isSound(path) {
    return (getFileType(path) === "sound");
}
function isText(path) {
    return (getFileType(path) === "text");
}
function isAlias(path) {
    var fileData;

    if (isMacintosh) {
        fileData = getFileData(path);
        return fileData === "MacOS Alias file";
    }
    return xtn(path).toLowerCase() === ".lnk";
}
function isWebloc(path) {
    var extn = xtn(path).toLowerCase();

    return extn === ".webloc";
}
function isURL(path) {
    var extn = xtn(path).toLowerCase();

    return extn === ".url";
}
function isWidget(path) {
    var extn = xtn(path).toLowerCase();

    return isItemIn(extn, widgetExtns);
}
function isPackage(path) {
    var extn = xtn(path).toLowerCase();

    return isItemIn(extn, packageExtns);
}

////////////////////////////////// end of get file type //////////////////////////////////
