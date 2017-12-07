"use strict";
document.addEventListener('deviceready', onDeviceReady, false);

// Für NW.js build muss statt 'deviceready' das Event 'DOMContentLoaded' verwendet werden 
var db = null;
var navStack = [];  // for navigation tree
var hasOnDeviceReadyBeenInvoked = false;

function onDeviceReady() {
    console.log("deviceready fired");
    FastClick.attach(document.body);
    console.log("FastClick listener attached");

    initApp();

    iqu.state = "ready";
}

var iqu = (function (my) {
    my.state = undefined;
    my.store = {};
    my.showMenu = () => {
        $("#left").addClass("active");
        if (!$(".mainpages .panel.active").hasClass("menu_open")) {
            $(".mainpages .panel.active").addClass("menu_open");
            $("body").addClass("menu_open");
        }
    };

    my.hideMenu = () => {
        if ($("#left").hasClass("active")) {
            $("#left").removeClass("active");
        }
        $(".menu_open").removeClass("menu_open");
    };

    my.showBackButton = () => {
        if ($("#naviButton").hasClass("backButtonsvg")) {
            return;
        } else {
            $("#naviButton").removeClass();
            $("#naviButton").addClass("backButtonsvg");

        }

    };

    my.showMenuButton = () => {
        if ($("#naviButton").hasClass("menuButtonsvg")) {
            return;
        } else {
            $("#naviButton").removeClass();
            $("#naviButton").addClass("menuButtonsvg");

        }
    };

    my.wipeRight = function (x, y) {
        if (!$("#left").hasClass("active")) {
            if (x < 200) {
                this.showMenu();
            }
        }
    };

    my.wipeLeft = function (x, y, e) {
        this.hideMenu();
    };


    my.goBack = function () {
        var x = navStack.pop();
        $.afui.loadContent(navStack[navStack.length - 1], "", x);
    };

    my.afterPanelLoad = function () {
        var activePanel = $(".panel.active");
        var scroll = $(activePanel).attr("data-scroll");
        if (scroll) {
            $(activePanel).parent().scrollTop(scroll);
            $(activePanel).attr("data-scroll", "");
        } else {
            $(activePanel).parent().scrollTop(0);
        }
        var selected = $(activePanel).attr("data-selected");
        if (selected) {
            $(".selected").removeClass("selected");
            $("[data-id=\"" + selected + "\"]").addClass("selected");
        }
        var goto = $(".panel.active").attr("data-goto");
        if (goto) {
            iqu.showBackButton();
        } else {
            iqu.showMenuButton();
        }
    };

    my.showVideo = function (filename) {
        window.plugins.streamingMedia.playVideo(filename);
    };

    my.showPdf = function (tmpfilename) {
        var filename;
        if (tmpfilename.startsWith("file")) {
            filename = tmpfilename.slice(7);
        } else {
            filename = tmpfilename;
        }
        window.open(filename);
    };

    var AFUi = function () {
        var that = this;
        $.afui = that;
    };
    AFUi.prototype = {
        loadContent: function (target, newView, back, transition, anchor) {
            if (navStack[navStack.length - 1] !== target) { navStack.push(target); }
            if (navStack.length > 1 && back === false) {
                $(target).css({ left: '100%' });
                $(target).addClass("active");
                $(navStack[navStack.length - 2]).animate({ left: '-110%' }, 1000);
                $(target).animate({ left: '0%' }, 1000);
                window.setTimeout(function () {
                    $(navStack[navStack.length - 2]).removeClass("active");
                    $(navStack[navStack.length - 2]).css({ left: '0%' });
                }, 1000);
            } else if (back) {
                $(target).css({ left: '-110%' });
                $(target).addClass("active");
                $(back).animate({ left: '110%' }, 1000);
                $(target).animate({ left: '0%' }, 1000);
                window.setTimeout(function () {
                    $(back).removeClass("active");
                    $(back).css({ left: '0%' });
                }, 1000);
            } else {
                $(".panel.active").removeClass("active");
                if (!$(target).hasClass("active")) {
                    $(target).addClass("active");
                }
            }
            console.log("Navigation stack:" + navStack);
            console.log("load content: " + target);



            // Titel austauschen
            var newTitle = $(target).attr("data-title");
            $("#mainview > header h1").text(newTitle);
            $("#mainview").removeClass("detail grid mc");
            try {
                if ($(target).attr("id").endsWith("detail")) {
                    $("#mainview").addClass("detail");
                } else if ($(target).attr("id").endsWith("grid")) {
                    $("#mainview").addClass("grid");
                } else if (target === "#matchcode" || target === "#mediaMC") {
                    $("#mainview").addClass("mc");
                }
            } catch (err) {
                console.log("ERROR: DOM-Element " + target + " not found");
            }
            if (navStack.length > 1) {
                iqu.showBackButton();
            } else {
                iqu.showMenuButton();
                $("#mainview").addClass("detail");
            }
        },
        toast: function (p) {
            console.log(p.message);
            if (typeof p.type === "undefined" || p.type === "error" || p.type === "success") {
                $("#toaster").text(p.message);
                $("#toaster").addClass("active");
                var timeout = p.delay ? p.delay : 2000;
                window.setTimeout(function () {
                    $("#toaster").removeClass("active");
                }, timeout);
            }
        },
        clearHistory: function () {
            //macht nix
        },
        showBackButton: function (view, isNewView) {
            var items = this.views[view.prop("id")].length;
            var hdr = view.children("header");
            if (hdr.length === 0) return;

            if (items >= 2 && isNewView !== true) {
                //Add the back button if it's not there
                if (hdr.find(".backButton").length === 1) return;
                hdr.prepend("<a class='backButton back'>" + this.backButtonText + "</a>");
            }
            else {
                hdr.find(".backButton").remove();
            }
        }
    };
    $.afui = new AFUi();
    return my;
}(iqu || {}));

function getSessionIdAlt(xml) {
    var index = xml.search("session");
    var quotes = xml.substring(index).split("&quot;"); // maybe the response from the server is getting html coded, so the "&quote"-Tag hast to be transformed in < or >
    //sessionId = quotes[1];
    return quotes[1];
}

function getSessionId(xml) {
    let id = xml.match(/session(.*?)\&quot; /gi);
    if (id) id = id.toString().replace(/\&quot;/gi, "").replace(/session\=/, "").trim();
    return id;
}

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return decompress(unescape(output));

}

// Utility function to create new unique identifier
function createGuid() {
    return "'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}

// Utility function to convert string to proper case
function toProperCase(str) {
    var noCaps = ['of', 'a', 'the', 'and', 'an', 'am', 'or', 'nor', 'but', 'is', 'if', 'then',
        'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'to', 'into', 'with'];
    return str.replace(/\w\S*/g, function (txt, offset) {
        if (offset !== 0 && noCaps.indexOf(txt.toLowerCase()) !== -1) {
            return txt.toLowerCase();
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Utility function to add highlighting by wrapping the matched text into an em tag, replacing the current elements html value with it
function addHighlighting(element, textToSearch) {
    var text = element.text();
    var index = text.toLowerCase().indexOf(textToSearch.toLowerCase());
    var textToHighlight = text.substr(index, textToSearch.length);
    var highlightedText = '<em>' + textToHighlight + '</em>';
    var newText = text.replace(textToHighlight, highlightedText);
    element.html(newText);
}

// Utility function to remove highlighting by replacing each em tag within the specified elements with its content
function removeHighlighting(highlightedElements) {
    highlightedElements.each(function () {
        var element = $(this);
        element.replaceWith(element.html());
    });
}

function parseDate(input, format) {
    format = format || 'yyyy-mm-dd'; // default format
    var parts = input.match(/(\d+)/g),
        i = 0, fmt = {};
    format.replace(/(yyyy|dd|mm)/g, function (part) { fmt[part] = i++; });
    return new Date(parts[fmt['yyyy']], parts[fmt['mm']] - 1, parts[fmt['dd']]);
}

function parseTime(input) {
    var time = input.substr(11, 8);
    var res = time.replace(/\./g, ":");
    return res;
}

function parseDateTime(input) {
    var date = parseDate(input).toLocaleDateString();
    var time = parseTime(input);
    return date + ', ' + time;
}