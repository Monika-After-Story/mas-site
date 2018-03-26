function InlinePlayer() {
    function playIt(sound, o) {
        var loop = o.getAttribute("loop"); - 1 == loop ? loopSound(sound, Number.MAX_VALUE) : loopSound(sound, loop)
    }

    function loopSound(sound, n) {
        sound.play({
            onfinish: function() {
                n > 0 ? loopSound(sound, n - 1) : finishSound(this)
            }
        })
    }

    function finishSound(s) {
        pl.removeClass(s._data.oLink, s._data.className);
        s._data.className = "";
        if (pl.config.playNext) {
            var nextLink = pl.indexByURL[s._data.oLink.href] + 1;
            nextLink < pl.links.length && pl.handleClick({
                target: pl.links[nextLink]
            })
        }
        removeTheSound(s)
    }

    function removeTheSound(s) {
        self.soundsByURL[s.url] = null;
        var index = self.sounds.indexOf(s);
        self.sounds.splice(index, 1)
    }
    var self = this,
        pl = this,
        sm = soundManager,
        isIE = navigator.userAgent.match(/msie/i);
    this.playableClass = "inline-playable";
    this.excludeClass = "inline-exclude";
    this.links = [];
    this.sounds = [];
    this.soundsByURL = [];
    this.indexByURL = [];
    this.lastSound = null;
    this.soundCount = 0;
    this.config = {
        playNext: false,
        autoPlay: false
    };
    this.css = {
        sDefault: "sm2_link",
        sLoading: "sm2_loading",
        sPlaying: "sm2_playing",
        sPaused: "sm2_paused"
    };
    this.addEventHandler = "undefined" != typeof window.addEventListener ? function(o, evtName, evtHandler) {
        return o.addEventListener(evtName, evtHandler, false)
    } : function(o, evtName, evtHandler) {
        o.attachEvent("on" + evtName, evtHandler)
    };
    this.removeEventHandler = "undefined" != typeof window.removeEventListener ? function(o, evtName, evtHandler) {
        return o.removeEventListener(evtName, evtHandler, false)
    } : function(o, evtName, evtHandler) {
        return o.detachEvent("on" + evtName, evtHandler)
    };
    this.classContains = function(o, cStr) {
        return "undefined" != typeof o.className && o.className.match(new RegExp("(\\s|^)" + cStr + "(\\s|$)"))
    };
    this.addClass = function(o, cStr) {
        if (!o || !cStr || self.classContains(o, cStr)) return false;
        o.className = (o.className ? o.className + " " : "") + cStr
    };
    this.removeClass = function(o, cStr) {
        if (!o || !cStr || !self.classContains(o, cStr)) return false;
        o.className = o.className.replace(new RegExp("( " + cStr + ")|(" + cStr + ")", "g"), "")
    };
    this.getSoundByURL = function(sURL) {
        return "undefined" != typeof self.soundsByURL[sURL] ? self.soundsByURL[sURL] : null
    };
    this.setVolume = function(soundUrl, volume) {
        var sound = self.getSoundByURL(soundUrl);
        null != sound && sm.setVolume(sound.id, volume)
    };
    this.destroySound = function(soundId) {
        sm.destroySound(soundId)
    };
    this.isChildOfNode = function(o, sNodeName) {
        if (!o || !o.parentNode) return false;
        sNodeName = sNodeName.toLowerCase();
        do o = o.parentNode; while (o && o.parentNode && o.nodeName.toLowerCase() != sNodeName);
        return o.nodeName.toLowerCase() == sNodeName ? o : null
    };
    this.events = {
        play: function() {
            pl.removeClass(this._data.oLink, this._data.className);
            this._data.className = pl.css.sPlaying;
            pl.addClass(this._data.oLink, this._data.className)
        },
        stop: function() {
            pl.removeClass(this._data.oLink, this._data.className);
            this._data.className = ""
        },
        pause: function() {
            pl.removeClass(this._data.oLink, this._data.className);
            this._data.className = pl.css.sPaused;
            pl.addClass(this._data.oLink, this._data.className)
        },
        resume: function() {
            pl.removeClass(this._data.oLink, this._data.className);
            this._data.className = pl.css.sPlaying;
            pl.addClass(this._data.oLink, this._data.className)
        },
        finish: function() {
            pl.removeClass(this._data.oLink, this._data.className);
            this._data.className = "";
            if (pl.config.playNext) {
                var nextLink = pl.indexByURL[this._data.oLink.href] + 1;
                nextLink < pl.links.length && pl.handleClick({
                    target: pl.links[nextLink]
                })
            }
        }
    };
    this.stopEvent = function(e) {
        "undefined" != typeof e && "undefined" != typeof e.preventDefault ? e.preventDefault() : "undefined" != typeof event && "undefined" != typeof event.returnValue && (event.returnValue = false);
        return false
    };
    this.getTheDamnLink = isIE ? function(e) {
        return e && e.target ? e.target : window.event.srcElement
    } : function(e) {
        return e.target
    };
    this.getTheAudioId = function(url) {
        if (null != url) {
            var audioVar = "audio_id=",
                indexFace = url.indexOf(audioVar);
            return url.substring(indexFace + audioVar.length)
        }
        return null
    };
    this.handleClick = function(e) {
        if ("undefined" != typeof e.button && e.button > 1) return true;
        var o = self.getTheDamnLink(e);
        if ("a" != o.nodeName.toLowerCase()) {
            o = self.isChildOfNode(o, "a");
            if (!o) return true
        }
        if (!o.href || !sm.canPlayLink(o) && !self.classContains(o, self.playableClass) || self.classContains(o, self.excludeClass)) return true;
        var soundURL = o.href,
            thisSound = self.getSoundByURL(soundURL);
        if (thisSound)
            if (thisSound == self.lastSound) thisSound.togglePause();
            else {
                sm._writeDebug("sound different than last sound: " + self.lastSound.id);
                self.lastSound && self.stopSound(self.lastSound);
                removeTheSound(self.lastSound);
                thisSound.togglePause()
            }
        else {
            if (self.lastSound) {
                self.stopSound(self.lastSound);
                removeTheSound(self.lastSound)
            }
            thisSound = sm.createSound({
                id: "inlineMP3Sound" + self.soundCount++,
                url: soundURL,
                onplay: self.events.play,
                onstop: self.events.stop,
                onpause: self.events.pause,
                onresume: self.events.resume,
                onfinish: self.events.finish,
                type: o.type || null
            });
            var theAudioId = self.getTheAudioId(soundURL);
            if (null != theAudioId) {
                var volume = $("#slider" + theAudioId).slider("value");
                null != volume && sm.setVolume(thisSound.id, volume)
            }
            thisSound._data = {
                oLink: o,
                className: self.css.sPlaying
            };
            self.soundsByURL[soundURL] = thisSound;
            self.sounds.push(thisSound);
            playIt(thisSound, o)
        }
        self.lastSound = thisSound;
        "undefined" != typeof e && "undefined" != typeof e.preventDefault ? e.preventDefault() : event.returnValue = false;
        return false
    };
    this.stopSound = function(oSound) {
        soundManager.stop(oSound.id);
        soundManager.unload(oSound.id)
    };
    this.init = function() {
        sm._writeDebug("inlinePlayer.init()");
        for (var oLinks = document.getElementsByTagName("a"), foundItems = 0, i = 0, j = oLinks.length; j > i; i++)
            if ((sm.canPlayLink(oLinks[i]) || self.classContains(oLinks[i], self.playableClass)) && !self.classContains(oLinks[i], self.excludeClass)) {
                self.addClass(oLinks[i], self.css.sDefault);
                self.links[foundItems] = oLinks[i];
                self.indexByURL[oLinks[i].href] = foundItems;
                foundItems++
            }
        if (foundItems > 0) {
            self.addEventHandler(document, "click", self.handleClick);
            self.config.autoPlay && self.handleClick({
                target: self.links[0],
                preventDefault: function() {}
            })
        }
        sm._writeDebug("inlinePlayer.init(): Found " + foundItems + " relevant items.")
    };
    this.init()
}

function reloadAudio() {
    inlinePlayer = new InlinePlayer
}

function stopAllSounds() {
    soundManager.stopAll()
}

function setVolume(soundUrl, volume) {
    inlinePlayer.setVolume(getFullUrl(soundUrl), volume)
}

function getFullUrl(soundUrl) {
    var protocol = window.location.protocol;
    null == protocol && (protocol = document.location.protocol);
    null == protocol && (protocol = "https:");
    var fullUrl = protocol + "//";
    fullUrl += $(location).attr("host");
    fullUrl += soundUrl;
    fullUrl = fullUrl.replace(/\s+/g, "%20");
    return fullUrl
}

function destroyTheSound(sURL) {
    var s = inlinePlayer.getSoundByURL(getFullUrl(sURL));
    null != s && inlinePlayer.destroySound(s.id)
}
var inlinePlayer = null;
soundManager.setup({
    debugMode: false,
    preferFlash: false,
    useFlashBlock: true,
    url: "../edit/",
    flashVersion: 9,
    defaultOptions: {
        volume: 50
    }
});
soundManager.onready(function() {
    inlinePlayer = new InlinePlayer
});