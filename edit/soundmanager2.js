! function(window, _undefined) {
    "use strict";

    function SoundManager(smURL, smID) {
        function preferFlashCheck(kind) {
            return sm2.preferFlash && hasFlash && !sm2.ignoreFlash && sm2.flash[kind] !== _undefined && sm2.flash[kind]
        }

        function html5_event(oFn) {
            return function(e) {
                var result, s = this._s;
                if (s && s._a) result = oFn.call(this, e);
                else {
                    s && s.id ? sm2._wD(s.id + ": Ignoring " + e.type) : sm2._wD(h5 + "Ignoring " + e.type);
                    result = null
                }
                return result
            }
        }
        this.setupOptions = {
            url: smURL || null,
            flashVersion: 8,
            debugMode: true,
            debugFlash: false,
            useConsole: true,
            consoleOnly: true,
            waitForWindowLoad: false,
            bgColor: "#ffffff",
            useHighPerformance: false,
            flashPollingInterval: null,
            html5PollingInterval: null,
            flashLoadTimeout: 1e3,
            wmode: null,
            allowScriptAccess: "always",
            useFlashBlock: false,
            useHTML5Audio: true,
            html5Test: /^(probably|maybe)$/i,
            preferFlash: false,
            noSWFCache: false,
            idPrefix: "sound"
        };
        this.defaultOptions = {
            autoLoad: false,
            autoPlay: false,
            from: null,
            loops: 1,
            onid3: null,
            onload: null,
            whileloading: null,
            onplay: null,
            onpause: null,
            onresume: null,
            whileplaying: null,
            onposition: null,
            onstop: null,
            onfailure: null,
            onfinish: null,
            multiShot: true,
            multiShotEvents: false,
            position: null,
            pan: 0,
            stream: true,
            to: null,
            type: null,
            usePolicyFile: false,
            volume: 100
        };
        this.flash9Options = {
            isMovieStar: null,
            usePeakData: false,
            useWaveformData: false,
            useEQData: false,
            onbufferchange: null,
            ondataerror: null
        };
        this.movieStarOptions = {
            bufferTime: 3,
            serverURL: null,
            onconnect: null,
            duration: null
        };
        this.audioFormats = {
            mp3: {
                type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                required: true
            },
            mp4: {
                related: ["aac", "m4a", "m4b"],
                type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                required: false
            },
            ogg: {
                type: ["audio/ogg; codecs=vorbis"],
                required: false
            },
            opus: {
                type: ["audio/ogg; codecs=opus", "audio/opus"],
                required: false
            },
            wav: {
                type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
                required: false
            }
        };
        this.movieID = "sm2-container";
        this.id = smID || "sm2movie";
        this.debugID = "soundmanager-debug";
        this.debugURLParam = /([#?&])debug=1/i;
        this.versionNumber = "V2.97a.20131201";
        this.version = null;
        this.movieURL = null;
        this.altURL = null;
        this.swfLoaded = false;
        this.enabled = false;
        this.oMC = null;
        this.sounds = {};
        this.soundIDs = [];
        this.muted = false;
        this.didFlashBlock = false;
        this.filePattern = null;
        this.filePatterns = {
            flash8: /\.mp3(\?.*)?$/i,
            flash9: /\.mp3(\?.*)?$/i
        };
        this.features = {
            buffering: false,
            peakData: false,
            waveformData: false,
            eqData: false,
            movieStar: false
        };
        this.sandbox = {
            type: null,
            types: {
                remote: "remote (domain-based) rules",
                localWithFile: "local with file access (no internet access)",
                localWithNetwork: "local with network (internet access only, no local access)",
                localTrusted: "local, trusted (local+internet access)"
            },
            description: null,
            noRemote: null,
            noLocal: null
        };
        this.html5 = {
            usingFlash: null
        };
        this.flash = {};
        this.html5Only = false;
        this.ignoreFlash = false;
        var SMSound, id, doNothing, setProperties, init, fV, debugTS, _wDS, initComplete, mixin, assign, extraOptions, addOnEvent, processOnEvents, initUserOnload, delayWaitForEI, waitForEI, rebootIntoHTML5, setVersionInfo, handleFocus, strings, initMovie, preInit, domContentLoaded, winOnLoad, didDCLoaded, getDocument, createMovie, catchError, setPolling, initDebug, disableObject, failSafely, normalizeMovieURL, str, flashBlockHandler, getSWFCSS, swfCSS, toggleDebug, loopFix, policyFix, complain, idCheck, startTimer, stopTimer, timerExecute, parseURL, canIgnoreFlash, featureCheck, html5OK, html5CanPlay, html5Ext, html5Unload, domContentLoadedIE, testHTML5, event, lastGlobalHTML5URL, hasFlash, detectFlash, badSafariFix, html5_events, showSupport, flushMessages, wrapCallback, sm2 = this,
            globalHTML5Audio = null,
            flash = null,
            sm = "soundManager",
            smc = sm + ": ",
            h5 = "HTML5::",
            ua = navigator.userAgent,
            wl = window.location.href.toString(),
            doc = document,
            on_queue = [],
            debugOpen = true,
            didAppend = false,
            appendSuccess = false,
            didInit = false,
            disabled = false,
            windowLoaded = false,
            wdCount = 0,
            debugLevels = ["log", "info", "warn", "error"],
            defaultFlashVersion = 8,
            oRemoved = null,
            oRemovedHTML = null,
            waitingForEI = false,
            initPending = false,
            h5TimerCount = 0,
            h5IntervalTimer = null,
            messages = [],
            needsFlash = null,
            slice = Array.prototype.slice,
            useGlobalHTML5Audio = false,
            idCounter = 0,
            is_iDevice = ua.match(/(ipad|iphone|ipod)/i),
            isAndroid = ua.match(/android/i),
            isIE = ua.match(/msie/i),
            isWebkit = ua.match(/webkit/i),
            isSafari = ua.match(/safari/i) && !ua.match(/chrome/i),
            isOpera = ua.match(/opera/i),
            mobileHTML5 = ua.match(/(mobile|pre\/|xoom)/i) || is_iDevice || isAndroid,
            isBadSafari = !wl.match(/usehtml5audio/i) && !wl.match(/sm2\-ignorebadua/i) && isSafari && !ua.match(/silk/i) && ua.match(/OS X 10_6_([3-7])/i),
            hasConsole = window.console !== _undefined && console.log !== _undefined,
            isFocused = doc.hasFocus !== _undefined ? doc.hasFocus() : null,
            tryInitOnFocus = isSafari && (doc.hasFocus === _undefined || !doc.hasFocus()),
            okToDisable = !tryInitOnFocus,
            flashMIME = /(mp3|mp4|mpa|m4a|m4b)/i,
            msecScale = 1e3,
            emptyURL = "about:blank",
            emptyWAV = "data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==",
            overHTTP = doc.location ? doc.location.protocol.match(/http/i) : null,
            http = overHTTP ? "" : "http://",
            netStreamMimeTypes = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,
            netStreamTypes = ["mpeg4", "aac", "flv", "mov", "mp4", "m4v", "f4v", "m4a", "m4b", "mp4v", "3gp", "3g2"],
            netStreamPattern = new RegExp("\\.(" + netStreamTypes.join("|") + ")(\\?.*)?$", "i");
        this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.useAltURL = !overHTTP;
        swfCSS = {
            swfBox: "sm2-object-box",
            swfDefault: "movieContainer",
            swfError: "swf_error",
            swfTimedout: "swf_timedout",
            swfLoaded: "swf_loaded",
            swfUnblocked: "swf_unblocked",
            sm2Debug: "sm2_debug",
            highPerf: "high_performance",
            flashDebug: "flash_debug"
        };
        this.hasHTML5 = function() {
            try {
                return Audio !== _undefined && (isOpera && opera !== _undefined && opera.version() < 10 ? new Audio(null) : new Audio).canPlayType !== _undefined
            } catch (e) {
                return false
            }
        }();
        this.setup = function(options) {
            var noURL = !sm2.url;
            options !== _undefined && didInit && needsFlash && sm2.ok() && (options.flashVersion !== _undefined || options.url !== _undefined || options.html5Test !== _undefined) && complain(str("setupLate"));
            assign(options);
            if (options) {
                noURL && didDCLoaded && options.url !== _undefined && sm2.beginDelayedInit();
                didDCLoaded || options.url === _undefined || "complete" !== doc.readyState || setTimeout(domContentLoaded, 1)
            }
            return sm2
        };
        this.ok = function() {
            return needsFlash ? didInit && !disabled : sm2.useHTML5Audio && sm2.hasHTML5
        };
        this.supported = this.ok;
        this.getMovie = function(smID) {
            return id(smID) || doc[smID] || window[smID]
        };
        this.createSound = function(oOptions, _url) {
            function make() {
                options = loopFix(options);
                sm2.sounds[options.id] = new SMSound(options);
                sm2.soundIDs.push(options.id);
                return sm2.sounds[options.id]
            }
            var cs, cs_string, options, oSound = null;
            cs = sm + ".createSound(): ";
            cs_string = cs + str(didInit ? "notOK" : "notReady");
            if (!didInit || !sm2.ok()) {
                complain(cs_string);
                return false
            }
            _url !== _undefined && (oOptions = {
                id: oOptions,
                url: _url
            });
            options = mixin(oOptions);
            options.url = parseURL(options.url);
            void 0 === options.id && (options.id = sm2.setupOptions.idPrefix + idCounter++);
            options.id.toString().charAt(0).match(/^[0-9]$/) && sm2._wD(cs + str("badID", options.id), 2);
            sm2._wD(cs + options.id + (options.url ? " (" + options.url + ")" : ""), 1);
            if (idCheck(options.id, true)) {
                sm2._wD(cs + options.id + " exists", 1);
                return sm2.sounds[options.id]
            }
            if (html5OK(options)) {
                oSound = make();
                sm2._wD(options.id + ": Using HTML5");
                oSound._setup_html5(options)
            } else {
                if (sm2.html5Only) {
                    sm2._wD(options.id + ": No HTML5 support for this sound, and no Flash. Exiting.");
                    return make()
                }
                if (sm2.html5.usingFlash && options.url && options.url.match(/data\:/i)) {
                    sm2._wD(options.id + ": data: URIs not supported via Flash. Exiting.");
                    return make()
                }
                if (fV > 8) {
                    null === options.isMovieStar && (options.isMovieStar = !!(options.serverURL || !!options.type && options.type.match(netStreamMimeTypes) || options.url && options.url.match(netStreamPattern)));
                    if (options.isMovieStar) {
                        sm2._wD(cs + "using MovieStar handling");
                        options.loops > 1 && _wDS("noNSLoop")
                    }
                }
                options = policyFix(options, cs);
                oSound = make();
                if (8 === fV) flash._createSound(options.id, options.loops || 1, options.usePolicyFile);
                else {
                    flash._createSound(options.id, options.url, options.usePeakData, options.useWaveformData, options.useEQData, options.isMovieStar, !!options.isMovieStar && options.bufferTime, options.loops || 1, options.serverURL, options.duration || null, options.autoPlay, true, options.autoLoad, options.usePolicyFile);
                    if (!options.serverURL) {
                        oSound.connected = true;
                        options.onconnect && options.onconnect.apply(oSound)
                    }
                }
                options.serverURL || !options.autoLoad && !options.autoPlay || oSound.load(options)
            }!options.serverURL && options.autoPlay && oSound.play();
            return oSound
        };
        this.destroySound = function(sID, _bFromSound) {
            if (!idCheck(sID)) return false;
            var i, oS = sm2.sounds[sID];
            oS._iO = {};
            oS.stop();
            oS.unload();
            for (i = 0; i < sm2.soundIDs.length; i++)
                if (sm2.soundIDs[i] === sID) {
                    sm2.soundIDs.splice(i, 1);
                    break
                }
            _bFromSound || oS.destruct(true);
            oS = null;
            delete sm2.sounds[sID];
            return true
        };
        this.load = function(sID, oOptions) {
            return !!idCheck(sID) && sm2.sounds[sID].load(oOptions)
        };
        this.unload = function(sID) {
            return !!idCheck(sID) && sm2.sounds[sID].unload()
        };
        this.onPosition = function(sID, nPosition, oMethod, oScope) {
            return !!idCheck(sID) && sm2.sounds[sID].onposition(nPosition, oMethod, oScope)
        };
        this.onposition = this.onPosition;
        this.clearOnPosition = function(sID, nPosition, oMethod) {
            return !!idCheck(sID) && sm2.sounds[sID].clearOnPosition(nPosition, oMethod)
        };
        this.play = function(sID, oOptions) {
            var result = null,
                overloaded = oOptions && !(oOptions instanceof Object);
            if (!didInit || !sm2.ok()) {
                complain(sm + ".play(): " + str(didInit ? "notOK" : "notReady"));
                return false
            }
            if (idCheck(sID, overloaded)) overloaded && (oOptions = {
                url: oOptions
            });
            else {
                if (!overloaded) return false;
                overloaded && (oOptions = {
                    url: oOptions
                });
                if (oOptions && oOptions.url) {
                    sm2._wD(sm + '.play(): Attempting to create "' + sID + '"', 1);
                    oOptions.id = sID;
                    result = sm2.createSound(oOptions).play()
                }
            }
            null === result && (result = sm2.sounds[sID].play(oOptions));
            return result
        };
        this.start = this.play;
        this.setPosition = function(sID, nMsecOffset) {
            return !!idCheck(sID) && sm2.sounds[sID].setPosition(nMsecOffset)
        };
        this.stop = function(sID) {
            if (!idCheck(sID)) return false;
            sm2._wD(sm + ".stop(" + sID + ")", 1);
            return sm2.sounds[sID].stop()
        };
        this.stopAll = function() {
            var oSound;
            sm2._wD(sm + ".stopAll()", 1);
            for (oSound in sm2.sounds) sm2.sounds.hasOwnProperty(oSound) && sm2.sounds[oSound].stop()
        };
        this.pause = function(sID) {
            return !!idCheck(sID) && sm2.sounds[sID].pause()
        };
        this.pauseAll = function() {
            var i;
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) sm2.sounds[sm2.soundIDs[i]].pause()
        };
        this.resume = function(sID) {
            return !!idCheck(sID) && sm2.sounds[sID].resume()
        };
        this.resumeAll = function() {
            var i;
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) sm2.sounds[sm2.soundIDs[i]].resume()
        };
        this.togglePause = function(sID) {
            return !!idCheck(sID) && sm2.sounds[sID].togglePause()
        };
        this.setPan = function(sID, nPan) {
            return !!idCheck(sID) && sm2.sounds[sID].setPan(nPan)
        };
        this.setVolume = function(sID, nVol) {
            return !!idCheck(sID) && sm2.sounds[sID].setVolume(nVol)
        };
        this.mute = function(sID) {
            var i = 0;
            sID instanceof String && (sID = null);
            if (sID) {
                if (!idCheck(sID)) return false;
                sm2._wD(sm + '.mute(): Muting "' + sID + '"');
                return sm2.sounds[sID].mute()
            }
            sm2._wD(sm + ".mute(): Muting all sounds");
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) sm2.sounds[sm2.soundIDs[i]].mute();
            sm2.muted = true;
            return true
        };
        this.muteAll = function() {
            sm2.mute()
        };
        this.unmute = function(sID) {
            var i;
            sID instanceof String && (sID = null);
            if (sID) {
                if (!idCheck(sID)) return false;
                sm2._wD(sm + '.unmute(): Unmuting "' + sID + '"');
                return sm2.sounds[sID].unmute()
            }
            sm2._wD(sm + ".unmute(): Unmuting all sounds");
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) sm2.sounds[sm2.soundIDs[i]].unmute();
            sm2.muted = false;
            return true
        };
        this.unmuteAll = function() {
            sm2.unmute()
        };
        this.toggleMute = function(sID) {
            return !!idCheck(sID) && sm2.sounds[sID].toggleMute()
        };
        this.getMemoryUse = function() {
            var ram = 0;
            flash && 8 !== fV && (ram = parseInt(flash._getMemoryUse(), 10));
            return ram
        };
        this.disable = function(bNoDisable) {
            var i;
            bNoDisable === _undefined && (bNoDisable = false);
            if (disabled) return false;
            disabled = true;
            _wDS("shutdown", 1);
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) disableObject(sm2.sounds[sm2.soundIDs[i]]);
            initComplete(bNoDisable);
            event.remove(window, "load", initUserOnload);
            return true
        };
        this.canPlayMIME = function(sMIME) {
            var result;
            sm2.hasHTML5 && (result = html5CanPlay({
                type: sMIME
            }));
            !result && needsFlash && (result = sMIME && sm2.ok() ? !!((fV > 8 ? sMIME.match(netStreamMimeTypes) : null) || sMIME.match(sm2.mimePattern)) : null);
            return result
        };
        this.canPlayURL = function(sURL) {
            var result;
            sm2.hasHTML5 && (result = html5CanPlay({
                url: sURL
            }));
            !result && needsFlash && (result = sURL && sm2.ok() ? !!sURL.match(sm2.filePattern) : null);
            return result
        };
        this.canPlayLink = function(oLink) {
            return !(oLink.type === _undefined || !oLink.type || !sm2.canPlayMIME(oLink.type)) || sm2.canPlayURL(oLink.href)
        };
        this.getSoundById = function(sID, _suppressDebug) {
            if (!sID) return null;
            var result = sm2.sounds[sID];
            result || _suppressDebug || sm2._wD(sm + '.getSoundById(): Sound "' + sID + '" not found.', 2);
            return result
        };
        this.onready = function(oMethod, oScope) {
            var sType = "onready",
                result = false;
            if ("function" != typeof oMethod) throw str("needFunction", sType);
            didInit && sm2._wD(str("queue", sType));
            oScope || (oScope = window);
            addOnEvent(sType, oMethod, oScope);
            processOnEvents();
            result = true;
            return result
        };
        this.ontimeout = function(oMethod, oScope) {
            var sType = "ontimeout",
                result = false;
            if ("function" != typeof oMethod) throw str("needFunction", sType);
            didInit && sm2._wD(str("queue", sType));
            oScope || (oScope = window);
            addOnEvent(sType, oMethod, oScope);
            processOnEvents({
                type: sType
            });
            result = true;
            return result
        };
        this._writeDebug = function(sText, sTypeOrObject) {
            var o, oItem, sDID = "soundmanager-debug";
            if (!sm2.debugMode) return false;
            if (hasConsole && sm2.useConsole) {
                sTypeOrObject && "object" == typeof sTypeOrObject || debugLevels[sTypeOrObject] !== _undefined;
                if (sm2.consoleOnly) return true
            }
            o = id(sDID);
            if (!o) return false;
            oItem = doc.createElement("div");
            ++wdCount % 2 === 0 && (oItem.className = "sm2-alt");
            sTypeOrObject = sTypeOrObject === _undefined ? 0 : parseInt(sTypeOrObject, 10);
            oItem.appendChild(doc.createTextNode(sText));
            if (sTypeOrObject) {
                sTypeOrObject >= 2 && (oItem.style.fontWeight = "bold");
                3 === sTypeOrObject && (oItem.style.color = "#ff3333")
            }
            o.insertBefore(oItem, o.firstChild);
            o = null;
            return true
        }; - 1 !== wl.indexOf("sm2-debug=alert") && (this._writeDebug = function(sText) {
            window.alert(sText)
        });
        this._wD = this._writeDebug;
        this._debug = function() {
            var i, j;
            _wDS("currentObj", 1);
            for (i = 0, j = sm2.soundIDs.length; j > i; i++) sm2.sounds[sm2.soundIDs[i]]._debug()
        };
        this.reboot = function(resetEvents, excludeInit) {
            sm2.soundIDs.length && sm2._wD("Destroying " + sm2.soundIDs.length + " SMSound object" + (1 !== sm2.soundIDs.length ? "s" : "") + "...");
            var i, j, k;
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) sm2.sounds[sm2.soundIDs[i]].destruct();
            if (flash) try {
                isIE && (oRemovedHTML = flash.innerHTML);
                oRemoved = flash.parentNode.removeChild(flash)
            } catch (e) {
                _wDS("badRemove", 2)
            }
            oRemovedHTML = oRemoved = needsFlash = flash = null;
            sm2.enabled = didDCLoaded = didInit = waitingForEI = initPending = didAppend = appendSuccess = disabled = useGlobalHTML5Audio = sm2.swfLoaded = false;
            sm2.soundIDs = [];
            sm2.sounds = {};
            idCounter = 0;
            if (resetEvents) on_queue = [];
            else
                for (i in on_queue)
                    if (on_queue.hasOwnProperty(i))
                        for (j = 0, k = on_queue[i].length; k > j; j++) on_queue[i][j].fired = false;
            excludeInit || sm2._wD(sm + ": Rebooting...");
            sm2.html5 = {
                usingFlash: null
            };
            sm2.flash = {};
            sm2.html5Only = false;
            sm2.ignoreFlash = false;
            window.setTimeout(function() {
                preInit();
                excludeInit || sm2.beginDelayedInit()
            }, 20);
            return sm2
        };
        this.reset = function() {
            _wDS("reset");
            return sm2.reboot(true, true)
        };
        this.getMoviePercent = function() {
            return flash && "PercentLoaded" in flash ? flash.PercentLoaded() : null
        };
        this.beginDelayedInit = function() {
            windowLoaded = true;
            domContentLoaded();
            setTimeout(function() {
                if (initPending) return false;
                createMovie();
                initMovie();
                initPending = true;
                return true
            }, 20);
            delayWaitForEI()
        };
        this.destruct = function() {
            sm2._wD(sm + ".destruct()");
            sm2.disable(true)
        };
        SMSound = function(oOptions) {
            var resetProperties, add_html5_events, remove_html5_events, stop_html5_timer, start_html5_timer, attachOnPosition, detachOnPosition, applyFromTo, lastHTML5State, urlOmitted, s = this,
                onplay_called = false,
                onPositionItems = [],
                onPositionFired = 0,
                lastURL = null;
            lastHTML5State = {
                duration: null,
                time: null
            };
            this.id = oOptions.id;
            this.sID = this.id;
            this.url = oOptions.url;
            this.options = mixin(oOptions);
            this.instanceOptions = this.options;
            this._iO = this.instanceOptions;
            this.pan = this.options.pan;
            this.volume = this.options.volume;
            this.isHTML5 = false;
            this._a = null;
            urlOmitted = !this.url;
            this.id3 = {};
            this._debug = function() {
                sm2._wD(s.id + ": Merged options:", s.options)
            };
            this.load = function(oOptions) {
                var instanceOptions, oSound = null;
                if (oOptions !== _undefined) s._iO = mixin(oOptions, s.options);
                else {
                    oOptions = s.options;
                    s._iO = oOptions;
                    if (lastURL && lastURL !== s.url) {
                        _wDS("manURL");
                        s._iO.url = s.url;
                        s.url = null
                    }
                }
                s._iO.url || (s._iO.url = s.url);
                s._iO.url = parseURL(s._iO.url);
                s.instanceOptions = s._iO;
                instanceOptions = s._iO;
                sm2._wD(s.id + ": load (" + instanceOptions.url + ")");
                if (!instanceOptions.url && !s.url) {
                    sm2._wD(s.id + ": load(): url is unassigned. Exiting.", 2);
                    return s
                }
                s.isHTML5 || 8 !== fV || s.url || instanceOptions.autoPlay || sm2._wD(s.id + ": Flash 8 load() limitation: Wait for onload() before calling play().", 1);
                if (instanceOptions.url === s.url && 0 !== s.readyState && 2 !== s.readyState) {
                    _wDS("onURL", 1);
                    3 === s.readyState && instanceOptions.onload && wrapCallback(s, function() {
                        instanceOptions.onload.apply(s, [!!s.duration])
                    });
                    return s
                }
                s.loaded = false;
                s.readyState = 1;
                s.playState = 0;
                s.id3 = {};
                if (html5OK(instanceOptions)) {
                    oSound = s._setup_html5(instanceOptions);
                    if (oSound._called_load) sm2._wD(s.id + ": Ignoring request to load again");
                    else {
                        s._html5_canplay = false;
                        if (s.url !== instanceOptions.url) {
                            sm2._wD(_wDS("manURL") + ": " + instanceOptions.url);
                            s._a.src = instanceOptions.url;
                            s.setPosition(0)
                        }
                        s._a.autobuffer = "auto";
                        s._a.preload = "auto";
                        s._a._called_load = true
                    }
                } else {
                    if (sm2.html5Only) {
                        sm2._wD(s.id + ": No flash support. Exiting.");
                        return s
                    }
                    if (s._iO.url && s._iO.url.match(/data\:/i)) {
                        sm2._wD(s.id + ": data: URIs not supported via Flash. Exiting.");
                        return s
                    }
                    try {
                        s.isHTML5 = false;
                        s._iO = policyFix(loopFix(instanceOptions));
                        instanceOptions = s._iO;
                        8 === fV ? flash._load(s.id, instanceOptions.url, instanceOptions.stream, instanceOptions.autoPlay, instanceOptions.usePolicyFile) : flash._load(s.id, instanceOptions.url, !!instanceOptions.stream, !!instanceOptions.autoPlay, instanceOptions.loops || 1, !!instanceOptions.autoLoad, instanceOptions.usePolicyFile)
                    } catch (e) {
                        _wDS("smError", 2);
                        debugTS("onload", false);
                        catchError({
                            type: "SMSOUND_LOAD_JS_EXCEPTION",
                            fatal: true
                        })
                    }
                }
                s.url = instanceOptions.url;
                return s
            };
            this.unload = function() {
                if (0 !== s.readyState) {
                    sm2._wD(s.id + ": unload()");
                    if (s.isHTML5) {
                        stop_html5_timer();
                        if (s._a) {
                            s._a.pause();
                            lastURL = html5Unload(s._a)
                        }
                    } else 8 === fV ? flash._unload(s.id, emptyURL) : flash._unload(s.id);
                    resetProperties()
                }
                return s
            };
            this.destruct = function(_bFromSM) {
                sm2._wD(s.id + ": Destruct");
                if (s.isHTML5) {
                    stop_html5_timer();
                    if (s._a) {
                        s._a.pause();
                        html5Unload(s._a);
                        useGlobalHTML5Audio || remove_html5_events();
                        s._a._s = null;
                        s._a = null
                    }
                } else {
                    s._iO.onfailure = null;
                    flash._destroySound(s.id)
                }
                _bFromSM || sm2.destroySound(s.id, true)
            };
            this.play = function(oOptions, _updatePlayState) {
                var fN, allowMulti, a, onready, audioClone, onended, oncanplay, startOK = true,
                    exit = null;
                fN = s.id + ": play(): ";
                _updatePlayState = _updatePlayState === _undefined || _updatePlayState;
                oOptions || (oOptions = {});
                s.url && (s._iO.url = s.url);
                s._iO = mixin(s._iO, s.options);
                s._iO = mixin(oOptions, s._iO);
                s._iO.url = parseURL(s._iO.url);
                s.instanceOptions = s._iO;
                if (!s.isHTML5 && s._iO.serverURL && !s.connected) {
                    if (!s.getAutoPlay()) {
                        sm2._wD(fN + " Netstream not connected yet - setting autoPlay");
                        s.setAutoPlay(true)
                    }
                    return s
                }
                if (html5OK(s._iO)) {
                    s._setup_html5(s._iO);
                    start_html5_timer()
                }
                if (1 === s.playState && !s.paused) {
                    allowMulti = s._iO.multiShot;
                    if (allowMulti) sm2._wD(fN + "Already playing (multi-shot)", 1);
                    else {
                        sm2._wD(fN + "Already playing (one-shot)", 1);
                        s.isHTML5 && s.setPosition(s._iO.position);
                        exit = s
                    }
                }
                if (null !== exit) return exit;
                oOptions.url && oOptions.url !== s.url && (s.readyState || s.isHTML5 || 8 !== fV || !urlOmitted ? s.load(s._iO) : urlOmitted = false);
                if (s.loaded) sm2._wD(fN.substr(0, fN.lastIndexOf(":")));
                else if (0 === s.readyState) {
                    sm2._wD(fN + "Attempting to load");
                    if (s.isHTML5 || sm2.html5Only)
                        if (s.isHTML5) s.load(s._iO);
                        else {
                            sm2._wD(fN + "Unsupported type. Exiting.");
                            exit = s
                        }
                    else {
                        s._iO.autoPlay = true;
                        s.load(s._iO)
                    }
                    s.instanceOptions = s._iO
                } else if (2 === s.readyState) {
                    sm2._wD(fN + "Could not load - exiting", 2);
                    exit = s
                } else sm2._wD(fN + "Loading - attempting to play...");
                if (null !== exit) return exit;
                if (!s.isHTML5 && 9 === fV && s.position > 0 && s.position === s.duration) {
                    sm2._wD(fN + "Sound at end, resetting to position:0");
                    oOptions.position = 0
                }
                if (s.paused && s.position >= 0 && (!s._iO.serverURL || s.position > 0)) {
                    sm2._wD(fN + "Resuming from paused state", 1);
                    s.resume()
                } else {
                    s._iO = mixin(oOptions, s._iO);
                    if (null !== s._iO.from && null !== s._iO.to && 0 === s.instanceCount && 0 === s.playState && !s._iO.serverURL) {
                        onready = function() {
                            s._iO = mixin(oOptions, s._iO);
                            s.play(s._iO)
                        };
                        if (s.isHTML5 && !s._html5_canplay) {
                            sm2._wD(fN + "Beginning load for from/to case");
                            s.load({
                                _oncanplay: onready
                            });
                            exit = false
                        } else if (!(s.isHTML5 || s.loaded || s.readyState && 2 === s.readyState)) {
                            sm2._wD(fN + "Preloading for from/to case");
                            s.load({
                                onload: onready
                            });
                            exit = false
                        }
                        if (null !== exit) return exit;
                        s._iO = applyFromTo()
                    }(!s.instanceCount || s._iO.multiShotEvents || s.isHTML5 && s._iO.multiShot && !useGlobalHTML5Audio || !s.isHTML5 && fV > 8 && !s.getAutoPlay()) && s.instanceCount++;
                    s._iO.onposition && 0 === s.playState && attachOnPosition(s);
                    s.playState = 1;
                    s.paused = false;
                    s.position = s._iO.position === _undefined || isNaN(s._iO.position) ? 0 : s._iO.position;
                    s.isHTML5 || (s._iO = policyFix(loopFix(s._iO)));
                    if (s._iO.onplay && _updatePlayState) {
                        s._iO.onplay.apply(s);
                        onplay_called = true
                    }
                    s.setVolume(s._iO.volume, true);
                    s.setPan(s._iO.pan, true);
                    if (s.isHTML5)
                        if (s.instanceCount < 2) {
                            start_html5_timer();
                            a = s._setup_html5();
                            s.setPosition(s._iO.position);
                            a.play()
                        } else {
                            sm2._wD(s.id + ": Cloning Audio() for instance #" + s.instanceCount + "...");
                            audioClone = new Audio(s._iO.url);
                            onended = function() {
                                event.remove(audioClone, "ended", onended);
                                s._onfinish(s);
                                html5Unload(audioClone);
                                audioClone = null
                            };
                            oncanplay = function() {
                                event.remove(audioClone, "canplay", oncanplay);
                                try {
                                    audioClone.currentTime = s._iO.position / msecScale
                                } catch (err) {
                                    complain(s.id + ": multiShot play() failed to apply position of " + s._iO.position / msecScale)
                                }
                                audioClone.play()
                            };
                            event.add(audioClone, "ended", onended);
                            void 0 !== s._iO.volume && (audioClone.volume = Math.max(0, Math.min(1, s._iO.volume / 100)));
                            s.muted && (audioClone.muted = true);
                            s._iO.position ? event.add(audioClone, "canplay", oncanplay) : audioClone.play()
                        }
                    else {
                        startOK = flash._start(s.id, s._iO.loops || 1, 9 === fV ? s.position : s.position / msecScale, s._iO.multiShot || false);
                        if (9 === fV && !startOK) {
                            sm2._wD(fN + "No sound hardware, or 32-sound ceiling hit", 2);
                            s._iO.onplayerror && s._iO.onplayerror.apply(s)
                        }
                    }
                }
                return s
            };
            this.start = this.play;
            this.stop = function(bAll) {
                var originalPosition, instanceOptions = s._iO;
                if (1 === s.playState) {
                    sm2._wD(s.id + ": stop()");
                    s._onbufferchange(0);
                    s._resetOnPosition(0);
                    s.paused = false;
                    s.isHTML5 || (s.playState = 0);
                    detachOnPosition();
                    instanceOptions.to && s.clearOnPosition(instanceOptions.to);
                    if (s.isHTML5) {
                        if (s._a) {
                            originalPosition = s.position;
                            s.setPosition(0);
                            s.position = originalPosition;
                            s._a.pause();
                            s.playState = 0;
                            s._onTimer();
                            stop_html5_timer()
                        }
                    } else {
                        flash._stop(s.id, bAll);
                        instanceOptions.serverURL && s.unload()
                    }
                    s.instanceCount = 0;
                    s._iO = {};
                    instanceOptions.onstop && instanceOptions.onstop.apply(s)
                }
                return s
            };
            this.setAutoPlay = function(autoPlay) {
                sm2._wD(s.id + ": Autoplay turned " + (autoPlay ? "on" : "off"));
                s._iO.autoPlay = autoPlay;
                if (!s.isHTML5) {
                    flash._setAutoPlay(s.id, autoPlay);
                    if (autoPlay && !s.instanceCount && 1 === s.readyState) {
                        s.instanceCount++;
                        sm2._wD(s.id + ": Incremented instance count to " + s.instanceCount)
                    }
                }
            };
            this.getAutoPlay = function() {
                return s._iO.autoPlay
            };
            this.setPosition = function(nMsecOffset) {
                nMsecOffset === _undefined && (nMsecOffset = 0);
                var position, position1K, offset = s.isHTML5 ? Math.max(nMsecOffset, 0) : Math.min(s.duration || s._iO.duration, Math.max(nMsecOffset, 0));
                s.position = offset;
                position1K = s.position / msecScale;
                s._resetOnPosition(s.position);
                s._iO.position = offset;
                if (s.isHTML5) {
                    if (s._a) {
                        if (s._html5_canplay) {
                            if (s._a.currentTime !== position1K) {
                                sm2._wD(s.id + ": setPosition(" + position1K + ")");
                                try {
                                    s._a.currentTime = position1K;
                                    (0 === s.playState || s.paused) && s._a.pause()
                                } catch (e) {
                                    sm2._wD(s.id + ": setPosition(" + position1K + ") failed: " + e.message, 2)
                                }
                            }
                        } else if (position1K) {
                            sm2._wD(s.id + ": setPosition(" + position1K + "): Cannot seek yet, sound not ready", 2);
                            return s
                        }
                        s.paused && s._onTimer(true)
                    }
                } else {
                    position = 9 === fV ? s.position : position1K;
                    s.readyState && 2 !== s.readyState && flash._setPosition(s.id, position, s.paused || !s.playState, s._iO.multiShot)
                }
                return s
            };
            this.pause = function(_bCallFlash) {
                if (s.paused || 0 === s.playState && 1 !== s.readyState) return s;
                sm2._wD(s.id + ": pause()");
                s.paused = true;
                if (s.isHTML5) {
                    s._setup_html5().pause();
                    stop_html5_timer()
                } else(_bCallFlash || _bCallFlash === _undefined) && flash._pause(s.id, s._iO.multiShot);
                s._iO.onpause && s._iO.onpause.apply(s);
                return s
            };
            this.resume = function() {
                var instanceOptions = s._iO;
                if (!s.paused) return s;
                sm2._wD(s.id + ": resume()");
                s.paused = false;
                s.playState = 1;
                if (s.isHTML5) {
                    s._setup_html5().play();
                    start_html5_timer()
                } else {
                    instanceOptions.isMovieStar && !instanceOptions.serverURL && s.setPosition(s.position);
                    flash._pause(s.id, instanceOptions.multiShot)
                }
                if (!onplay_called && instanceOptions.onplay) {
                    instanceOptions.onplay.apply(s);
                    onplay_called = true
                } else instanceOptions.onresume && instanceOptions.onresume.apply(s);
                return s
            };
            this.togglePause = function() {
                sm2._wD(s.id + ": togglePause()");
                if (0 === s.playState) {
                    s.play({
                        position: 9 !== fV || s.isHTML5 ? s.position / msecScale : s.position
                    });
                    return s
                }
                s.paused ? s.resume() : s.pause();
                return s
            };
            this.setPan = function(nPan, bInstanceOnly) {
                nPan === _undefined && (nPan = 0);
                bInstanceOnly === _undefined && (bInstanceOnly = false);
                s.isHTML5 || flash._setPan(s.id, nPan);
                s._iO.pan = nPan;
                if (!bInstanceOnly) {
                    s.pan = nPan;
                    s.options.pan = nPan
                }
                return s
            };
            this.setVolume = function(nVol, _bInstanceOnly) {
                nVol === _undefined && (nVol = 100);
                _bInstanceOnly === _undefined && (_bInstanceOnly = false);
                if (s.isHTML5) {
                    if (s._a) {
                        if (sm2.muted && !s.muted) {
                            s.muted = true;
                            s._a.muted = true
                        }
                        s._a.volume = Math.max(0, Math.min(1, nVol / 100))
                    }
                } else flash._setVolume(s.id, sm2.muted && !s.muted || s.muted ? 0 : nVol);
                s._iO.volume = nVol;
                if (!_bInstanceOnly) {
                    s.volume = nVol;
                    s.options.volume = nVol
                }
                return s
            };
            this.mute = function() {
                s.muted = true;
                s.isHTML5 ? s._a && (s._a.muted = true) : flash._setVolume(s.id, 0);
                return s
            };
            this.unmute = function() {
                s.muted = false;
                var hasIO = s._iO.volume !== _undefined;
                s.isHTML5 ? s._a && (s._a.muted = false) : flash._setVolume(s.id, hasIO ? s._iO.volume : s.options.volume);
                return s
            };
            this.toggleMute = function() {
                return s.muted ? s.unmute() : s.mute()
            };
            this.onPosition = function(nPosition, oMethod, oScope) {
                onPositionItems.push({
                    position: parseInt(nPosition, 10),
                    method: oMethod,
                    scope: oScope !== _undefined ? oScope : s,
                    fired: false
                });
                return s
            };
            this.onposition = this.onPosition;
            this.clearOnPosition = function(nPosition, oMethod) {
                var i;
                nPosition = parseInt(nPosition, 10);
                if (isNaN(nPosition)) return false;
                for (i = 0; i < onPositionItems.length; i++)
                    if (nPosition === onPositionItems[i].position && (!oMethod || oMethod === onPositionItems[i].method)) {
                        onPositionItems[i].fired && onPositionFired--;
                        onPositionItems.splice(i, 1)
                    }
            };
            this._processOnPosition = function() {
                var i, item, j = onPositionItems.length;
                if (!j || !s.playState || onPositionFired >= j) return false;
                for (i = j - 1; i >= 0; i--) {
                    item = onPositionItems[i];
                    if (!item.fired && s.position >= item.position) {
                        item.fired = true;
                        onPositionFired++;
                        item.method.apply(item.scope, [item.position]);
                        j = onPositionItems.length
                    }
                }
                return true
            };
            this._resetOnPosition = function(nPosition) {
                var i, item, j = onPositionItems.length;
                if (!j) return false;
                for (i = j - 1; i >= 0; i--) {
                    item = onPositionItems[i];
                    if (item.fired && nPosition <= item.position) {
                        item.fired = false;
                        onPositionFired--
                    }
                }
                return true
            };
            applyFromTo = function() {
                var start, end, instanceOptions = s._iO,
                    f = instanceOptions.from,
                    t = instanceOptions.to;
                end = function() {
                    sm2._wD(s.id + ': "To" time of ' + t + " reached.");
                    s.clearOnPosition(t, end);
                    s.stop()
                };
                start = function() {
                    sm2._wD(s.id + ': Playing "from" ' + f);
                    null === t || isNaN(t) || s.onPosition(t, end)
                };
                if (null !== f && !isNaN(f)) {
                    instanceOptions.position = f;
                    instanceOptions.multiShot = false;
                    start()
                }
                return instanceOptions
            };
            attachOnPosition = function() {
                var item, op = s._iO.onposition;
                if (op)
                    for (item in op) op.hasOwnProperty(item) && s.onPosition(parseInt(item, 10), op[item])
            };
            detachOnPosition = function() {
                var item, op = s._iO.onposition;
                if (op)
                    for (item in op) op.hasOwnProperty(item) && s.clearOnPosition(parseInt(item, 10))
            };
            start_html5_timer = function() {
                s.isHTML5 && startTimer(s)
            };
            stop_html5_timer = function() {
                s.isHTML5 && stopTimer(s)
            };
            resetProperties = function(retainPosition) {
                if (!retainPosition) {
                    onPositionItems = [];
                    onPositionFired = 0
                }
                onplay_called = false;
                s._hasTimer = null;
                s._a = null;
                s._html5_canplay = false;
                s.bytesLoaded = null;
                s.bytesTotal = null;
                s.duration = s._iO && s._iO.duration ? s._iO.duration : null;
                s.durationEstimate = null;
                s.buffered = [];
                s.eqData = [];
                s.eqData.left = [];
                s.eqData.right = [];
                s.failures = 0;
                s.isBuffering = false;
                s.instanceOptions = {};
                s.instanceCount = 0;
                s.loaded = false;
                s.metadata = {};
                s.readyState = 0;
                s.muted = false;
                s.paused = false;
                s.peakData = {
                    left: 0,
                    right: 0
                };
                s.waveformData = {
                    left: [],
                    right: []
                };
                s.playState = 0;
                s.position = null;
                s.id3 = {}
            };
            resetProperties();
            this._onTimer = function(bForce) {
                var duration, time, isNew = false,
                    x = {};
                if (s._hasTimer || bForce) {
                    if (s._a && (bForce || (s.playState > 0 || 1 === s.readyState) && !s.paused)) {
                        duration = s._get_html5_duration();
                        if (duration !== lastHTML5State.duration) {
                            lastHTML5State.duration = duration;
                            s.duration = duration;
                            isNew = true
                        }
                        s.durationEstimate = s.duration;
                        time = s._a.currentTime * msecScale || 0;
                        if (time !== lastHTML5State.time) {
                            lastHTML5State.time = time;
                            isNew = true
                        }(isNew || bForce) && s._whileplaying(time, x, x, x, x)
                    }
                    return isNew
                }
            };
            this._get_html5_duration = function() {
                var instanceOptions = s._iO,
                    d = s._a && s._a.duration ? s._a.duration * msecScale : instanceOptions && instanceOptions.duration ? instanceOptions.duration : null,
                    result = d && !isNaN(d) && d !== 1 / 0 ? d : null;
                return result
            };
            this._apply_loop = function(a, nLoops) {
                !a.loop && nLoops > 1 && sm2._wD("Note: Native HTML5 looping is infinite.", 1);
                a.loop = nLoops > 1 ? "loop" : ""
            };
            this._setup_html5 = function(oOptions) {
                var sameURL, instanceOptions = mixin(s._iO, oOptions),
                    a = useGlobalHTML5Audio ? globalHTML5Audio : s._a,
                    dURL = decodeURI(instanceOptions.url);
                useGlobalHTML5Audio ? dURL === decodeURI(lastGlobalHTML5URL) && (sameURL = true) : dURL === decodeURI(lastURL) && (sameURL = true);
                if (a) {
                    if (a._s)
                        if (useGlobalHTML5Audio) a._s && a._s.playState && !sameURL && a._s.stop();
                        else if (!useGlobalHTML5Audio && dURL === decodeURI(lastURL)) {
                        s._apply_loop(a, instanceOptions.loops);
                        return a
                    }
                    if (!sameURL) {
                        lastURL && resetProperties(false);
                        a.src = instanceOptions.url;
                        s.url = instanceOptions.url;
                        lastURL = instanceOptions.url;
                        lastGlobalHTML5URL = instanceOptions.url;
                        a._called_load = false
                    }
                } else {
                    if (instanceOptions.autoLoad || instanceOptions.autoPlay) {
                        s._a = new Audio(instanceOptions.url);
                        s._a.load()
                    } else s._a = isOpera && opera.version() < 10 ? new Audio(null) : new Audio;
                    a = s._a;
                    a._called_load = false;
                    useGlobalHTML5Audio && (globalHTML5Audio = a)
                }
                s.isHTML5 = true;
                s._a = a;
                a._s = s;
                add_html5_events();
                s._apply_loop(a, instanceOptions.loops);
                if (instanceOptions.autoLoad || instanceOptions.autoPlay) s.load();
                else {
                    a.autobuffer = false;
                    a.preload = "auto"
                }
                return a
            };
            add_html5_events = function() {
                function add(oEvt, oFn, bCapture) {
                    return s._a ? s._a.addEventListener(oEvt, oFn, bCapture || false) : null
                }
                if (s._a._added_events) return false;
                var f;
                s._a._added_events = true;
                for (f in html5_events) html5_events.hasOwnProperty(f) && add(f, html5_events[f]);
                return true
            };
            remove_html5_events = function() {
                function remove(oEvt, oFn, bCapture) {
                    return s._a ? s._a.removeEventListener(oEvt, oFn, bCapture || false) : null
                }
                var f;
                sm2._wD(s.id + ": Removing event listeners");
                s._a._added_events = false;
                for (f in html5_events) html5_events.hasOwnProperty(f) && remove(f, html5_events[f])
            };
            this._onload = function(nSuccess) {
                var fN, loadOK = !!nSuccess || !s.isHTML5 && 8 === fV && s.duration;
                fN = s.id + ": ";
                sm2._wD(fN + (loadOK ? "onload()" : "Failed to load / invalid sound?" + (s.duration ? " -" : " Zero-length duration reported.") + " (" + s.url + ")"), loadOK ? 1 : 2);
                if (!loadOK && !s.isHTML5) {
                    true === sm2.sandbox.noRemote && sm2._wD(fN + str("noNet"), 1);
                    true === sm2.sandbox.noLocal && sm2._wD(fN + str("noLocal"), 1)
                }
                s.loaded = loadOK;
                s.readyState = loadOK ? 3 : 2;
                s._onbufferchange(0);
                s._iO.onload && wrapCallback(s, function() {
                    s._iO.onload.apply(s, [loadOK])
                });
                return true
            };
            this._onbufferchange = function(nIsBuffering) {
                if (0 === s.playState) return false;
                if (nIsBuffering && s.isBuffering || !nIsBuffering && !s.isBuffering) return false;
                s.isBuffering = 1 === nIsBuffering;
                if (s._iO.onbufferchange) {
                    sm2._wD(s.id + ": Buffer state change: " + nIsBuffering);
                    s._iO.onbufferchange.apply(s);
                }
                return true
            };
            this._onsuspend = function() {
                if (s._iO.onsuspend) {
                    sm2._wD(s.id + ": Playback suspended");
                    s._iO.onsuspend.apply(s)
                }
                return true
            };
            this._onfailure = function(msg, level, code) {
                s.failures++;
                sm2._wD(s.id + ": Failures = " + s.failures);
                s._iO.onfailure && 1 === s.failures ? s._iO.onfailure(s, msg, level, code) : sm2._wD(s.id + ": Ignoring failure")
            };
            this._onfinish = function() {
                var io_onfinish = s._iO.onfinish;
                s._onbufferchange(0);
                s._resetOnPosition(0);
                if (s.instanceCount) {
                    s.instanceCount--;
                    if (!s.instanceCount) {
                        detachOnPosition();
                        s.playState = 0;
                        s.paused = false;
                        s.instanceCount = 0;
                        s.instanceOptions = {};
                        s._iO = {};
                        stop_html5_timer();
                        s.isHTML5 && (s.position = 0)
                    }
                    if ((!s.instanceCount || s._iO.multiShotEvents) && io_onfinish) {
                        sm2._wD(s.id + ": onfinish()");
                        wrapCallback(s, function() {
                            io_onfinish.apply(s)
                        })
                    }
                }
            };
            this._whileloading = function(nBytesLoaded, nBytesTotal, nDuration, nBufferLength) {
                var instanceOptions = s._iO;
                s.bytesLoaded = nBytesLoaded;
                s.bytesTotal = nBytesTotal;
                s.duration = Math.floor(nDuration);
                s.bufferLength = nBufferLength;
                s.isHTML5 || instanceOptions.isMovieStar ? s.durationEstimate = s.duration : instanceOptions.duration ? s.durationEstimate = s.duration > instanceOptions.duration ? s.duration : instanceOptions.duration : s.durationEstimate = parseInt(s.bytesTotal / s.bytesLoaded * s.duration, 10);
                s.isHTML5 || (s.buffered = [{
                    start: 0,
                    end: s.duration
                }]);
                (3 !== s.readyState || s.isHTML5) && instanceOptions.whileloading && instanceOptions.whileloading.apply(s)
            };
            this._whileplaying = function(nPosition, oPeakData, oWaveformDataLeft, oWaveformDataRight, oEQData) {
                var eqLeft, instanceOptions = s._iO;
                if (isNaN(nPosition) || null === nPosition) return false;
                s.position = Math.max(0, nPosition);
                s._processOnPosition();
                if (!s.isHTML5 && fV > 8) {
                    instanceOptions.usePeakData && oPeakData !== _undefined && oPeakData && (s.peakData = {
                        left: oPeakData.leftPeak,
                        right: oPeakData.rightPeak
                    });
                    instanceOptions.useWaveformData && oWaveformDataLeft !== _undefined && oWaveformDataLeft && (s.waveformData = {
                        left: oWaveformDataLeft.split(","),
                        right: oWaveformDataRight.split(",")
                    });
                    if (instanceOptions.useEQData && oEQData !== _undefined && oEQData && oEQData.leftEQ) {
                        eqLeft = oEQData.leftEQ.split(",");
                        s.eqData = eqLeft;
                        s.eqData.left = eqLeft;
                        oEQData.rightEQ !== _undefined && oEQData.rightEQ && (s.eqData.right = oEQData.rightEQ.split(","))
                    }
                }
                if (1 === s.playState) {
                    s.isHTML5 || 8 !== fV || s.position || !s.isBuffering || s._onbufferchange(0);
                    instanceOptions.whileplaying && instanceOptions.whileplaying.apply(s)
                }
                return true
            };
            this._oncaptiondata = function(oData) {
                sm2._wD(s.id + ": Caption data received.");
                s.captiondata = oData;
                s._iO.oncaptiondata && s._iO.oncaptiondata.apply(s, [oData])
            };
            this._onmetadata = function(oMDProps, oMDData) {
                sm2._wD(s.id + ": Metadata received.");
                var i, j, oData = {};
                for (i = 0, j = oMDProps.length; j > i; i++) oData[oMDProps[i]] = oMDData[i];
                s.metadata = oData;
                s._iO.onmetadata && s._iO.onmetadata.apply(s)
            };
            this._onid3 = function(oID3Props, oID3Data) {
                sm2._wD(s.id + ": ID3 data received.");
                var i, j, oData = [];
                for (i = 0, j = oID3Props.length; j > i; i++) oData[oID3Props[i]] = oID3Data[i];
                s.id3 = mixin(s.id3, oData);
                s._iO.onid3 && s._iO.onid3.apply(s)
            };
            this._onconnect = function(bSuccess) {
                bSuccess = 1 === bSuccess;
                sm2._wD(s.id + ": " + (bSuccess ? "Connected." : "Failed to connect? - " + s.url), bSuccess ? 1 : 2);
                s.connected = bSuccess;
                if (bSuccess) {
                    s.failures = 0;
                    idCheck(s.id) && (s.getAutoPlay() ? s.play(_undefined, s.getAutoPlay()) : s._iO.autoLoad && s.load());
                    s._iO.onconnect && s._iO.onconnect.apply(s, [bSuccess])
                }
            };
            this._ondataerror = function(sError) {
                if (s.playState > 0) {
                    sm2._wD(s.id + ": Data error: " + sError);
                    s._iO.ondataerror && s._iO.ondataerror.apply(s)
                }
            };
            this._debug()
        };
        getDocument = function() {
            return doc.body || doc.getElementsByTagName("div")[0]
        };
        id = function(sID) {
            return doc.getElementById(sID)
        };
        mixin = function(oMain, oAdd) {
            var o2, o, o1 = oMain || {};
            o2 = oAdd === _undefined ? sm2.defaultOptions : oAdd;
            for (o in o2) o2.hasOwnProperty(o) && o1[o] === _undefined && ("object" != typeof o2[o] || null === o2[o] ? o1[o] = o2[o] : o1[o] = mixin(o1[o], o2[o]));
            return o1
        };
        wrapCallback = function(oSound, callback) {
            oSound.isHTML5 || 8 !== fV ? callback() : window.setTimeout(callback, 0)
        };
        extraOptions = {
            onready: 1,
            ontimeout: 1,
            defaultOptions: 1,
            flash9Options: 1,
            movieStarOptions: 1
        };
        assign = function(o, oParent) {
            var i, result = true,
                hasParent = oParent !== _undefined,
                setupOptions = sm2.setupOptions,
                bonusOptions = extraOptions;
            if (o === _undefined) {
                result = [];
                for (i in setupOptions) setupOptions.hasOwnProperty(i) && result.push(i);
                for (i in bonusOptions) bonusOptions.hasOwnProperty(i) && ("object" == typeof sm2[i] ? result.push(i + ": {...}") : sm2[i] instanceof Function ? result.push(i + ": function() {...}") : result.push(i));
                sm2._wD(str("setup", result.join(", ")));
                return false
            }
            for (i in o)
                if (o.hasOwnProperty(i))
                    if ("object" != typeof o[i] || null === o[i] || o[i] instanceof Array || o[i] instanceof RegExp)
                        if (hasParent && bonusOptions[oParent] !== _undefined) sm2[oParent][i] = o[i];
                        else if (setupOptions[i] !== _undefined) {
                sm2.setupOptions[i] = o[i];
                sm2[i] = o[i]
            } else if (bonusOptions[i] === _undefined) {
                complain(str(sm2[i] === _undefined ? "setupUndef" : "setupError", i), 2);
                result = false
            } else sm2[i] instanceof Function ? sm2[i].apply(sm2, o[i] instanceof Array ? o[i] : [o[i]]) : sm2[i] = o[i];
            else {
                if (bonusOptions[i] !== _undefined) return assign(o[i], i);
                complain(str(sm2[i] === _undefined ? "setupUndef" : "setupError", i), 2);
                result = false
            }
            return result
        };
        event = function() {
            function getArgs(oArgs) {
                var args = slice.call(oArgs),
                    len = args.length;
                if (old) {
                    args[1] = "on" + args[1];
                    len > 3 && args.pop()
                } else 3 === len && args.push(false);
                return args
            }

            function apply(args, sType) {
                var element = args.shift(),
                    method = [evt[sType]];
                old ? element[method](args[0], args[1]) : element[method].apply(element, args)
            }

            function add() {
                apply(getArgs(arguments), "add")
            }

            function remove() {
                apply(getArgs(arguments), "remove")
            }
            var old = window.attachEvent,
                evt = {
                    add: old ? "attachEvent" : "addEventListener",
                    remove: old ? "detachEvent" : "removeEventListener"
                };
            return {
                add: add,
                remove: remove
            }
        }();
        html5_events = {
            abort: html5_event(function() {
                sm2._wD(this._s.id + ": abort")
            }),
            canplay: html5_event(function() {
                var position1K, s = this._s;
                if (s._html5_canplay) return true;
                s._html5_canplay = true;
                sm2._wD(s.id + ": canplay");
                s._onbufferchange(0);
                position1K = s._iO.position === _undefined || isNaN(s._iO.position) ? null : s._iO.position / msecScale;
                if (s.position && this.currentTime !== position1K) {
                    sm2._wD(s.id + ": canplay: Setting position to " + position1K);
                    try {
                        this.currentTime = position1K
                    } catch (ee) {
                        sm2._wD(s.id + ": canplay: Setting position of " + position1K + " failed: " + ee.message, 2)
                    }
                }
                s._iO._oncanplay && s._iO._oncanplay()
            }),
            canplaythrough: html5_event(function() {
                var s = this._s;
                if (!s.loaded) {
                    s._onbufferchange(0);
                    s._whileloading(s.bytesLoaded, s.bytesTotal, s._get_html5_duration());
                    s._onload(true)
                }
            }),
            ended: html5_event(function() {
                var s = this._s;
                sm2._wD(s.id + ": ended");
                s._onfinish()
            }),
            error: html5_event(function() {
                sm2._wD(this._s.id + ": HTML5 error, code " + this.error.code);
                this._s._onload(false)
            }),
            loadeddata: html5_event(function() {
                var s = this._s;
                sm2._wD(s.id + ": loadeddata");
                s._loaded || isSafari || (s.duration = s._get_html5_duration())
            }),
            loadedmetadata: html5_event(function() {
                sm2._wD(this._s.id + ": loadedmetadata")
            }),
            loadstart: html5_event(function() {
                sm2._wD(this._s.id + ": loadstart");
                this._s._onbufferchange(1)
            }),
            play: html5_event(function() {
                this._s._onbufferchange(0)
            }),
            playing: html5_event(function() {
                sm2._wD(this._s.id + ": playing");
                this._s._onbufferchange(0)
            }),
            progress: html5_event(function(e) {
                var i, j, progStr, s = this._s,
                    buffered = 0,
                    isProgress = "progress" === e.type,
                    ranges = e.target.buffered,
                    loaded = e.loaded || 0,
                    total = e.total || 1;
                s.buffered = [];
                if (ranges && ranges.length) {
                    for (i = 0, j = ranges.length; j > i; i++) s.buffered.push({
                        start: ranges.start(i) * msecScale,
                        end: ranges.end(i) * msecScale
                    });
                    buffered = (ranges.end(0) - ranges.start(0)) * msecScale;
                    loaded = Math.min(1, buffered / (e.target.duration * msecScale));
                    if (isProgress && ranges.length > 1) {
                        progStr = [];
                        j = ranges.length;
                        for (i = 0; j > i; i++) progStr.push(e.target.buffered.start(i) * msecScale + "-" + e.target.buffered.end(i) * msecScale);
                        sm2._wD(this._s.id + ": progress, timeRanges: " + progStr.join(", "))
                    }
                    isProgress && !isNaN(loaded) && sm2._wD(this._s.id + ": progress, " + Math.floor(100 * loaded) + "% loaded")
                }
                if (!isNaN(loaded)) {
                    s._onbufferchange(0);
                    s._whileloading(loaded, total, s._get_html5_duration());
                    loaded && total && loaded === total && html5_events.canplaythrough.call(this, e)
                }
            }),
            ratechange: html5_event(function() {
                sm2._wD(this._s.id + ": ratechange")
            }),
            suspend: html5_event(function(e) {
                var s = this._s;
                sm2._wD(this._s.id + ": suspend");
                html5_events.progress.call(this, e);
                s._onsuspend()
            }),
            stalled: html5_event(function() {
                sm2._wD(this._s.id + ": stalled")
            }),
            timeupdate: html5_event(function() {
                this._s._onTimer()
            }),
            waiting: html5_event(function() {
                var s = this._s;
                sm2._wD(this._s.id + ": waiting");
                s._onbufferchange(1)
            })
        };
        html5OK = function(iO) {
            var result;
            result = !(!iO || !(iO.type || iO.url || iO.serverURL)) && !(iO.serverURL || iO.type && preferFlashCheck(iO.type)) && (iO.type ? html5CanPlay({
                type: iO.type
            }) : html5CanPlay({
                url: iO.url
            }) || sm2.html5Only || iO.url.match(/data\:/i));
            return result
        };
        html5Unload = function(oAudio) {
            var url;
            if (oAudio) {
                url = isSafari ? emptyURL : sm2.html5.canPlayType("audio/wav") ? emptyWAV : emptyURL;
                oAudio.src = url;
                void 0 !== oAudio._called_unload && (oAudio._called_load = false)
            }
            useGlobalHTML5Audio && (lastGlobalHTML5URL = null);
            return url
        };
        html5CanPlay = function(o) {
            if (!sm2.useHTML5Audio || !sm2.hasHTML5) return false;
            var result, offset, fileExt, item, url = o.url || null,
                mime = o.type || null,
                aF = sm2.audioFormats;
            if (mime && sm2.html5[mime] !== _undefined) return sm2.html5[mime] && !preferFlashCheck(mime);
            if (!html5Ext) {
                html5Ext = [];
                for (item in aF)
                    if (aF.hasOwnProperty(item)) {
                        html5Ext.push(item);
                        aF[item].related && (html5Ext = html5Ext.concat(aF[item].related))
                    }
                html5Ext = new RegExp("\\.(" + html5Ext.join("|") + ")(\\?.*)?$", "i")
            }
            fileExt = url ? url.toLowerCase().match(html5Ext) : null;
            if (fileExt && fileExt.length) fileExt = fileExt[1];
            else if (mime) {
                offset = mime.indexOf(";");
                fileExt = (-1 !== offset ? mime.substr(0, offset) : mime).substr(6)
            } else result = false;
            if (fileExt && sm2.html5[fileExt] !== _undefined) result = sm2.html5[fileExt] && !preferFlashCheck(fileExt);
            else {
                mime = "audio/" + fileExt;
                result = sm2.html5.canPlayType({
                    type: mime
                });
                sm2.html5[fileExt] = result;
                result = result && sm2.html5[mime] && !preferFlashCheck(mime)
            }
            return result
        };
        testHTML5 = function() {
            function cp(m) {
                var canPlay, j, result = false,
                    isOK = false;
                if (!a || "function" != typeof a.canPlayType) return result;
                if (m instanceof Array) {
                    for (i = 0, j = m.length; j > i; i++)
                        if (sm2.html5[m[i]] || a.canPlayType(m[i]).match(sm2.html5Test)) {
                            isOK = true;
                            sm2.html5[m[i]] = true;
                            sm2.flash[m[i]] = !!m[i].match(flashMIME)
                        }
                    result = isOK
                } else {
                    canPlay = !(!a || "function" != typeof a.canPlayType) && a.canPlayType(m);
                    result = !!(canPlay && canPlay.match(sm2.html5Test))
                }
                return result
            }
            if (!sm2.useHTML5Audio || !sm2.hasHTML5) {
                sm2.html5.usingFlash = true;
                needsFlash = true;
                return false
            }
            var item, lookup, aF, i, a = Audio !== _undefined ? isOpera && opera.version() < 10 ? new Audio(null) : new Audio : null,
                support = {};
            aF = sm2.audioFormats;
            for (item in aF)
                if (aF.hasOwnProperty(item)) {
                    lookup = "audio/" + item;
                    support[item] = cp(aF[item].type);
                    support[lookup] = support[item];
                    if (item.match(flashMIME)) {
                        sm2.flash[item] = true;
                        sm2.flash[lookup] = true
                    } else {
                        sm2.flash[item] = false;
                        sm2.flash[lookup] = false
                    }
                    if (aF[item] && aF[item].related)
                        for (i = aF[item].related.length - 1; i >= 0; i--) {
                            support["audio/" + aF[item].related[i]] = support[item];
                            sm2.html5[aF[item].related[i]] = support[item];
                            sm2.flash[aF[item].related[i]] = support[item]
                        }
                }
            support.canPlayType = a ? cp : null;
            sm2.html5 = mixin(sm2.html5, support);
            sm2.html5.usingFlash = featureCheck();
            needsFlash = sm2.html5.usingFlash;
            return true
        };
        strings = {
            notReady: "Unavailable - wait until onready() has fired.",
            notOK: "Audio support is not available.",
            domError: sm + "exception caught while appending SWF to DOM.",
            spcWmode: "Removing wmode, preventing known SWF loading issue(s)",
            swf404: smc + "Verify that %s is a valid path.",
            tryDebug: "Try " + sm + ".debugFlash = true for more security details (output goes to SWF.)",
            checkSWF: "See SWF output for more debug info.",
            localFail: smc + "Non-HTTP page (" + doc.location.protocol + " URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",
            waitFocus: smc + "Special case: Waiting for SWF to load with window focus...",
            waitForever: smc + "Waiting indefinitely for Flash (will recover if unblocked)...",
            waitSWF: smc + "Waiting for 100% SWF load...",
            needFunction: smc + "Function object expected for %s",
            badID: 'Sound ID "%s" should be a string, starting with a non-numeric character',
            currentObj: smc + "_debug(): Current sound objects",
            waitOnload: smc + "Waiting for window.onload()",
            docLoaded: smc + "Document already loaded",
            onload: smc + "initComplete(): calling soundManager.onload()",
            onloadOK: sm + ".onload() complete",
            didInit: smc + "init(): Already called?",
            secNote: "Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",
            badRemove: smc + "Failed to remove Flash node.",
            shutdown: sm + ".disable(): Shutting down",
            queue: smc + "Queueing %s handler",
            smError: "SMSound.load(): Exception: JS-Flash communication failed, or JS error.",
            fbTimeout: "No flash response, applying ." + swfCSS.swfTimedout + " CSS...",
            fbLoaded: "Flash loaded",
            fbHandler: smc + "flashBlockHandler()",
            manURL: "SMSound.load(): Using manually-assigned URL",
            onURL: sm + ".load(): current URL already assigned.",
            badFV: sm + '.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',
            as2loop: "Note: Setting stream:false so looping can work (flash 8 limitation)",
            noNSLoop: "Note: Looping not implemented for MovieStar formats",
            needfl9: "Note: Switching to flash 9, required for MP4 formats.",
            mfTimeout: "Setting flashLoadTimeout = 0 (infinite) for off-screen, mobile flash case",
            needFlash: smc + "Fatal error: Flash is needed to play some required formats, but is not available.",
            gotFocus: smc + "Got window focus.",
            policy: "Enabling usePolicyFile for data access",
            setup: sm + ".setup(): allowed parameters: %s",
            setupError: sm + '.setup(): "%s" cannot be assigned with this method.',
            setupUndef: sm + '.setup(): Could not find option "%s"',
            setupLate: sm + ".setup(): url, flashVersion and html5Test property changes will not take effect until reboot().",
            noURL: smc + "Flash URL required. Call soundManager.setup({url:...}) to get started.",
            sm2Loaded: "SoundManager 2: Ready.",
            reset: sm + ".reset(): Removing event callbacks",
            mobileUA: "Mobile UA detected, preferring HTML5 by default.",
            globalHTML5: "Using singleton HTML5 Audio() pattern for this device."
        };
        str = function() {
            var args, i, j, o, sstr;
            args = slice.call(arguments);
            o = args.shift();
            sstr = strings && strings[o] ? strings[o] : "";
            if (sstr && args && args.length)
                for (i = 0, j = args.length; j > i; i++) sstr = sstr.replace("%s", args[i]);
            return sstr
        };
        loopFix = function(sOpt) {
            if (8 === fV && sOpt.loops > 1 && sOpt.stream) {
                _wDS("as2loop");
                sOpt.stream = false
            }
            return sOpt
        };
        policyFix = function(sOpt, sPre) {
            if (sOpt && !sOpt.usePolicyFile && (sOpt.onid3 || sOpt.usePeakData || sOpt.useWaveformData || sOpt.useEQData)) {
                sm2._wD((sPre || "") + str("policy"));
                sOpt.usePolicyFile = true
            }
            return sOpt
        };
        complain = function(sMsg) {
            hasConsole && console.warn !== _undefined || sm2._wD(sMsg)
        };
        doNothing = function() {
            return false
        };
        disableObject = function(o) {
            var oProp;
            for (oProp in o) o.hasOwnProperty(oProp) && "function" == typeof o[oProp] && (o[oProp] = doNothing);
            oProp = null
        };
        failSafely = function(bNoDisable) {
            bNoDisable === _undefined && (bNoDisable = false);
            (disabled || bNoDisable) && sm2.disable(bNoDisable)
        };
        normalizeMovieURL = function(smURL) {
            var url, urlParams = null;
            if (smURL)
                if (smURL.match(/\.swf(\?.*)?$/i)) {
                    urlParams = smURL.substr(smURL.toLowerCase().lastIndexOf(".swf?") + 4);
                    if (urlParams) return smURL
                } else smURL.lastIndexOf("/") !== smURL.length - 1 && (smURL += "/");
            url = (smURL && -1 !== smURL.lastIndexOf("/") ? smURL.substr(0, smURL.lastIndexOf("/") + 1) : "./") + sm2.movieURL;
            sm2.noSWFCache && (url += "?ts=" + (new Date).getTime());
            return url
        };
        setVersionInfo = function() {
            fV = parseInt(sm2.flashVersion, 10);
            if (8 !== fV && 9 !== fV) {
                sm2._wD(str("badFV", fV, defaultFlashVersion));
                sm2.flashVersion = fV = defaultFlashVersion
            }
            var isDebug = sm2.debugMode || sm2.debugFlash ? "_debug.swf" : ".swf";
            if (sm2.useHTML5Audio && !sm2.html5Only && sm2.audioFormats.mp4.required && 9 > fV) {
                sm2._wD(str("needfl9"));
                sm2.flashVersion = fV = 9
            }
            sm2.version = sm2.versionNumber + (sm2.html5Only ? " (HTML5-only mode)" : 9 === fV ? " (AS3/Flash 9)" : " (AS2/Flash 8)");
            if (fV > 8) {
                sm2.defaultOptions = mixin(sm2.defaultOptions, sm2.flash9Options);
                sm2.features.buffering = true;
                sm2.defaultOptions = mixin(sm2.defaultOptions, sm2.movieStarOptions);
                sm2.filePatterns.flash9 = new RegExp("\\.(mp3|" + netStreamTypes.join("|") + ")(\\?.*)?$", "i");
                sm2.features.movieStar = true
            } else sm2.features.movieStar = false;
            sm2.filePattern = sm2.filePatterns[8 !== fV ? "flash9" : "flash8"];
            sm2.movieURL = (8 === fV ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", isDebug);
            sm2.features.peakData = sm2.features.waveformData = sm2.features.eqData = fV > 8
        };
        setPolling = function(bPolling, bHighPerformance) {
            if (!flash) return false;
            flash._setPolling(bPolling, bHighPerformance)
        };
        initDebug = function() {
            sm2.debugURLParam.test(wl) && (sm2.debugMode = true);
            if (id(sm2.debugID)) return false;
            var oD, oDebug, oTarget, oToggle, tmp;
            if (sm2.debugMode && !id(sm2.debugID) && (!hasConsole || !sm2.useConsole || !sm2.consoleOnly)) {
                oD = doc.createElement("div");
                oD.id = sm2.debugID + "-toggle";
                oToggle = {
                    position: "fixed",
                    bottom: "0px",
                    right: "0px",
                    width: "1.2em",
                    height: "1.2em",
                    lineHeight: "1.2em",
                    margin: "2px",
                    textAlign: "center",
                    border: "1px solid #999",
                    cursor: "pointer",
                    background: "#fff",
                    color: "#333",
                    zIndex: 10001
                };
                oD.appendChild(doc.createTextNode("-"));
                oD.onclick = toggleDebug;
                oD.title = "Toggle SM2 debug console";
                if (ua.match(/msie 6/i)) {
                    oD.style.position = "absolute";
                    oD.style.cursor = "hand"
                }
                for (tmp in oToggle) oToggle.hasOwnProperty(tmp) && (oD.style[tmp] = oToggle[tmp]);
                oDebug = doc.createElement("div");
                oDebug.id = sm2.debugID;
                oDebug.style.display = sm2.debugMode ? "block" : "none";
                if (sm2.debugMode && !id(oD.id)) {
                    try {
                        oTarget = getDocument();
                        oTarget.appendChild(oD)
                    } catch (e2) {
                        throw new Error(str("domError") + " \n" + e2.toString())
                    }
                    oTarget.appendChild(oDebug)
                }
            }
            oTarget = null
        };
        idCheck = this.getSoundById;
        _wDS = function(o, errorLevel) {
            return o ? sm2._wD(str(o), errorLevel) : ""
        };
        toggleDebug = function() {
            var o = id(sm2.debugID),
                oT = id(sm2.debugID + "-toggle");
            if (!o) return false;
            if (debugOpen) {
                oT.innerHTML = "+";
                o.style.display = "none"
            } else {
                oT.innerHTML = "-";
                o.style.display = "block"
            }
            debugOpen = !debugOpen
        };
        debugTS = function(sEventType, bSuccess, sMessage) {
            if (window.sm2Debugger !== _undefined) try {
                sm2Debugger.handleEvent(sEventType, bSuccess, sMessage)
            } catch (e) {
                return false
            }
            return true
        };
        getSWFCSS = function() {
            var css = [];
            sm2.debugMode && css.push(swfCSS.sm2Debug);
            sm2.debugFlash && css.push(swfCSS.flashDebug);
            sm2.useHighPerformance && css.push(swfCSS.highPerf);
            return css.join(" ")
        };
        flashBlockHandler = function() {
            var name = str("fbHandler"),
                p = sm2.getMoviePercent(),
                css = swfCSS,
                error = {
                    type: "FLASHBLOCK"
                };
            if (sm2.html5Only) return false;
            if (sm2.ok()) {
                sm2.didFlashBlock && sm2._wD(name + ": Unblocked");
                sm2.oMC && (sm2.oMC.className = [getSWFCSS(), css.swfDefault, css.swfLoaded + (sm2.didFlashBlock ? " " + css.swfUnblocked : "")].join(" "))
            } else {
                if (needsFlash) {
                    sm2.oMC.className = getSWFCSS() + " " + css.swfDefault + " " + (null === p ? css.swfTimedout : css.swfError);
                    sm2._wD(name + ": " + str("fbTimeout") + (p ? " (" + str("fbLoaded") + ")" : ""))
                }
                sm2.didFlashBlock = true;
                processOnEvents({
                    type: "ontimeout",
                    ignoreInit: true,
                    error: error
                });
                catchError(error)
            }
        };
        addOnEvent = function(sType, oMethod, oScope) {
            on_queue[sType] === _undefined && (on_queue[sType] = []);
            on_queue[sType].push({
                method: oMethod,
                scope: oScope || null,
                fired: false
            })
        };
        processOnEvents = function(oOptions) {
            oOptions || (oOptions = {
                type: sm2.ok() ? "onready" : "ontimeout"
            });
            if (!didInit && oOptions && !oOptions.ignoreInit) return false;
            if ("ontimeout" === oOptions.type && (sm2.ok() || disabled && !oOptions.ignoreInit)) return false;
            var i, j, status = {
                    success: oOptions && oOptions.ignoreInit ? sm2.ok() : !disabled
                },
                srcQueue = oOptions && oOptions.type ? on_queue[oOptions.type] || [] : [],
                queue = [],
                args = [status],
                canRetry = needsFlash && !sm2.ok();
            oOptions.error && (args[0].error = oOptions.error);
            for (i = 0, j = srcQueue.length; j > i; i++) true !== srcQueue[i].fired && queue.push(srcQueue[i]);
            if (queue.length)
                for (i = 0, j = queue.length; j > i; i++) {
                    queue[i].scope ? queue[i].method.apply(queue[i].scope, args) : queue[i].method.apply(this, args);
                    canRetry || (queue[i].fired = true)
                }
            return true
        };
        initUserOnload = function() {
            window.setTimeout(function() {
                sm2.useFlashBlock && flashBlockHandler();
                processOnEvents();
                if ("function" == typeof sm2.onload) {
                    _wDS("onload", 1);
                    sm2.onload.apply(window);
                    _wDS("onloadOK", 1)
                }
                sm2.waitForWindowLoad && event.add(window, "load", initUserOnload)
            }, 1)
        };
        detectFlash = function() {
            if (hasFlash !== _undefined) return hasFlash;
            var obj, type, types, hasPlugin = false,
                n = navigator,
                nP = n.plugins,
                AX = window.ActiveXObject;
            if (nP && nP.length) {
                type = "application/x-shockwave-flash";
                types = n.mimeTypes;
                types && types[type] && types[type].enabledPlugin && types[type].enabledPlugin.description && (hasPlugin = true)
            } else if (AX !== _undefined && !ua.match(/MSAppHost/i)) {
                try {
                    obj = new AX("ShockwaveFlash.ShockwaveFlash")
                } catch (e) {
                    obj = null
                }
                hasPlugin = !!obj;
                obj = null
            }
            hasFlash = hasPlugin;
            return hasPlugin
        };
        featureCheck = function() {
            var flashNeeded, item, formats = sm2.audioFormats,
                isSpecial = is_iDevice && !!ua.match(/os (1|2|3_0|3_1)/i);
            if (isSpecial) {
                sm2.hasHTML5 = false;
                sm2.html5Only = true;
                sm2.oMC && (sm2.oMC.style.display = "none")
            } else if (sm2.useHTML5Audio) {
                if (!sm2.html5 || !sm2.html5.canPlayType) {
                    sm2._wD("SoundManager: No HTML5 Audio() support detected.");
                    sm2.hasHTML5 = false
                }
                isBadSafari && sm2._wD(smc + "Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id=32159 - " + (hasFlash ? "will use flash fallback for MP3/MP4, if available" : " would use flash fallback for MP3/MP4, but none detected."), 1)
            }
            if (sm2.useHTML5Audio && sm2.hasHTML5) {
                canIgnoreFlash = true;
                for (item in formats)
                    if (formats.hasOwnProperty(item) && formats[item].required)
                        if (sm2.html5.canPlayType(formats[item].type)) sm2.preferFlash && (sm2.flash[item] || sm2.flash[formats[item].type]) && (flashNeeded = true);
                        else {
                            canIgnoreFlash = false;
                            flashNeeded = true
                        }
            }
            if (sm2.ignoreFlash) {
                flashNeeded = false;
                canIgnoreFlash = true
            }
            sm2.html5Only = sm2.hasHTML5 && sm2.useHTML5Audio && !flashNeeded;
            return !sm2.html5Only
        };
        parseURL = function(url) {
            var i, j, result, urlResult = 0;
            if (url instanceof Array) {
                for (i = 0, j = url.length; j > i; i++)
                    if (url[i] instanceof Object) {
                        if (sm2.canPlayMIME(url[i].type)) {
                            urlResult = i;
                            break
                        }
                    } else if (sm2.canPlayURL(url[i])) {
                    urlResult = i;
                    break
                }
                url[urlResult].url && (url[urlResult] = url[urlResult].url);
                result = url[urlResult]
            } else result = url;
            return result
        };
        startTimer = function(oSound) {
            if (!oSound._hasTimer) {
                oSound._hasTimer = true;
                if (!mobileHTML5 && sm2.html5PollingInterval) {
                    null === h5IntervalTimer && 0 === h5TimerCount && (h5IntervalTimer = setInterval(timerExecute, sm2.html5PollingInterval));
                    h5TimerCount++
                }
            }
        };
        stopTimer = function(oSound) {
            if (oSound._hasTimer) {
                oSound._hasTimer = false;
                !mobileHTML5 && sm2.html5PollingInterval && h5TimerCount--
            }
        };
        timerExecute = function() {
            var i;
            if (null !== h5IntervalTimer && !h5TimerCount) {
                clearInterval(h5IntervalTimer);
                h5IntervalTimer = null;
                return false
            }
            for (i = sm2.soundIDs.length - 1; i >= 0; i--) sm2.sounds[sm2.soundIDs[i]].isHTML5 && sm2.sounds[sm2.soundIDs[i]]._hasTimer && sm2.sounds[sm2.soundIDs[i]]._onTimer()
        };
        catchError = function(options) {
            options = options !== _undefined ? options : {};
            "function" == typeof sm2.onerror && sm2.onerror.apply(window, [{
                type: options.type !== _undefined ? options.type : null
            }]);
            options.fatal !== _undefined && options.fatal && sm2.disable()
        };
        badSafariFix = function() {
            if (!isBadSafari || !detectFlash()) return false;
            var i, item, aF = sm2.audioFormats;
            for (item in aF)
                if (aF.hasOwnProperty(item) && ("mp3" === item || "mp4" === item)) {
                    sm2._wD(sm + ": Using flash fallback for " + item + " format");
                    sm2.html5[item] = false;
                    if (aF[item] && aF[item].related)
                        for (i = aF[item].related.length - 1; i >= 0; i--) sm2.html5[aF[item].related[i]] = false
                }
        };
        this._setSandboxType = function(sandboxType) {
            var sb = sm2.sandbox;
            sb.type = sandboxType;
            sb.description = sb.types[sb.types[sandboxType] !== _undefined ? sandboxType : "unknown"];
            if ("localWithFile" === sb.type) {
                sb.noRemote = true;
                sb.noLocal = false;
                _wDS("secNote", 2)
            } else if ("localWithNetwork" === sb.type) {
                sb.noRemote = false;
                sb.noLocal = true
            } else if ("localTrusted" === sb.type) {
                sb.noRemote = false;
                sb.noLocal = false
            }
        };
        this._externalInterfaceOK = function(swfVersion) {
            if (sm2.swfLoaded) return false;
            var e;
            debugTS("swf", true);
            debugTS("flashtojs", true);
            sm2.swfLoaded = true;
            tryInitOnFocus = false;
            isBadSafari && badSafariFix();
            if (!swfVersion || swfVersion.replace(/\+dev/i, "") !== sm2.versionNumber.replace(/\+dev/i, "")) {
                e = sm + ': Fatal: JavaScript file build "' + sm2.versionNumber + '" does not match Flash SWF build "' + swfVersion + '" at ' + sm2.url + ". Ensure both are up-to-date.";
                setTimeout(function() {
                    throw new Error(e)
                }, 0);
                return false
            }
            setTimeout(init, isIE ? 100 : 1)
        };
        createMovie = function(smID, smURL) {
            function initMsg() {
                var title, options = [],
                    msg = [],
                    delimiter = " + ";
                title = "SoundManager " + sm2.version + (!sm2.html5Only && sm2.useHTML5Audio ? sm2.hasHTML5 ? " + HTML5 audio" : ", no HTML5 audio support" : "");
                if (sm2.html5Only) sm2.html5PollingInterval && options.push("html5PollingInterval (" + sm2.html5PollingInterval + "ms)");
                else {
                    sm2.preferFlash && options.push("preferFlash");
                    sm2.useHighPerformance && options.push("useHighPerformance");
                    sm2.flashPollingInterval && options.push("flashPollingInterval (" + sm2.flashPollingInterval + "ms)");
                    sm2.html5PollingInterval && options.push("html5PollingInterval (" + sm2.html5PollingInterval + "ms)");
                    sm2.wmode && options.push("wmode (" + sm2.wmode + ")");
                    sm2.debugFlash && options.push("debugFlash");
                    sm2.useFlashBlock && options.push("flashBlock")
                }
                options.length && (msg = msg.concat([options.join(delimiter)]));
                sm2._wD(title + (msg.length ? delimiter + msg.join(", ") : ""), 1);
                showSupport()
            }

            function param(name, value) {
                return '<param name="' + name + '" value="' + value + '" />'
            }
            if (didAppend && appendSuccess) return false;
            if (sm2.html5Only) {
                setVersionInfo();
                initMsg();
                sm2.oMC = id(sm2.movieID);
                init();
                didAppend = true;
                appendSuccess = true;
                return false
            }
            var oEmbed, oMovie, tmp, movieHTML, oEl, s, x, sClass, remoteURL = smURL || sm2.url,
                localURL = sm2.altURL || remoteURL,
                swfTitle = "JS/Flash audio component (SoundManager 2)",
                oTarget = getDocument(),
                extraClass = getSWFCSS(),
                isRTL = null,
                html = doc.getElementsByTagName("html")[0];
            isRTL = html && html.dir && html.dir.match(/rtl/i);
            smID = smID === _undefined ? sm2.id : smID;
            setVersionInfo();
            sm2.url = normalizeMovieURL(overHTTP ? remoteURL : localURL);
            smURL = sm2.url;
            sm2.wmode = !sm2.wmode && sm2.useHighPerformance ? "transparent" : sm2.wmode;
            if (null !== sm2.wmode && (ua.match(/msie 8/i) || !isIE && !sm2.useHighPerformance) && navigator.platform.match(/win32|win64/i)) {
                messages.push(strings.spcWmode);
                sm2.wmode = null
            }
            oEmbed = {
                name: smID,
                id: smID,
                src: smURL,
                quality: "high",
                allowScriptAccess: sm2.allowScriptAccess,
                bgcolor: sm2.bgColor,
                pluginspage: http + "www.macromedia.com/go/getflashplayer",
                title: swfTitle,
                type: "application/x-shockwave-flash",
                wmode: sm2.wmode,
                hasPriority: "true"
            };
            sm2.debugFlash && (oEmbed.FlashVars = "debug=1");
            sm2.wmode || delete oEmbed.wmode;
            if (isIE) {
                oMovie = doc.createElement("div");
                movieHTML = ['<object id="' + smID + '" data="' + smURL + '" type="' + oEmbed.type + '" title="' + oEmbed.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + http + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">', param("movie", smURL), param("AllowScriptAccess", sm2.allowScriptAccess), param("quality", oEmbed.quality), sm2.wmode ? param("wmode", sm2.wmode) : "", param("bgcolor", sm2.bgColor), param("hasPriority", "true"), sm2.debugFlash ? param("FlashVars", oEmbed.FlashVars) : "", "</object>"].join("")
            } else {
                oMovie = doc.createElement("embed");
                for (tmp in oEmbed) oEmbed.hasOwnProperty(tmp) && oMovie.setAttribute(tmp, oEmbed[tmp])
            }
            initDebug();
            extraClass = getSWFCSS();
            oTarget = getDocument();
            if (oTarget) {
                sm2.oMC = id(sm2.movieID) || doc.createElement("div");
                if (sm2.oMC.id) {
                    sClass = sm2.oMC.className;
                    sm2.oMC.className = (sClass ? sClass + " " : swfCSS.swfDefault) + (extraClass ? " " + extraClass : "");
                    sm2.oMC.appendChild(oMovie);
                    if (isIE) {
                        oEl = sm2.oMC.appendChild(doc.createElement("div"));
                        oEl.className = swfCSS.swfBox;
                        oEl.innerHTML = movieHTML
                    }
                    appendSuccess = true
                } else {
                    sm2.oMC.id = sm2.movieID;
                    sm2.oMC.className = swfCSS.swfDefault + " " + extraClass;
                    s = null;
                    oEl = null;
                    if (!sm2.useFlashBlock)
                        if (sm2.useHighPerformance) s = {
                            position: "fixed",
                            width: "8px",
                            height: "8px",
                            bottom: "0px",
                            left: "0px",
                            overflow: "hidden"
                        };
                        else {
                            s = {
                                position: "absolute",
                                width: "6px",
                                height: "6px",
                                top: "-9999px",
                                left: "-9999px"
                            };
                            isRTL && (s.left = Math.abs(parseInt(s.left, 10)) + "px")
                        }
                    isWebkit && (sm2.oMC.style.zIndex = 1e4);
                    if (!sm2.debugFlash)
                        for (x in s) s.hasOwnProperty(x) && (sm2.oMC.style[x] = s[x]);
                    try {
                        isIE || sm2.oMC.appendChild(oMovie);
                        oTarget.appendChild(sm2.oMC);
                        if (isIE) {
                            oEl = sm2.oMC.appendChild(doc.createElement("div"));
                            oEl.className = swfCSS.swfBox;
                            oEl.innerHTML = movieHTML
                        }
                        appendSuccess = true
                    } catch (e) {
                        throw new Error(str("domError") + " \n" + e.toString())
                    }
                }
            }
            didAppend = true;
            initMsg();
            return true
        };
        initMovie = function() {
            if (sm2.html5Only) {
                createMovie();
                return false
            }
            if (flash) return false;
            if (!sm2.url) {
                _wDS("noURL");
                return false
            }
            flash = sm2.getMovie(sm2.id);
            if (!flash) {
                if (oRemoved) {
                    isIE ? sm2.oMC.innerHTML = oRemovedHTML : sm2.oMC.appendChild(oRemoved);
                    oRemoved = null;
                    didAppend = true
                } else createMovie(sm2.id, sm2.url);
                flash = sm2.getMovie(sm2.id)
            }
            "function" == typeof sm2.oninitmovie && setTimeout(sm2.oninitmovie, 1);
            flushMessages();
            return true
        };
        delayWaitForEI = function() {
            setTimeout(waitForEI, 1e3)
        };
        rebootIntoHTML5 = function() {
            window.setTimeout(function() {
                complain(smc + "useFlashBlock is false, 100% HTML5 mode is possible. Rebooting with preferFlash: false...");
                sm2.setup({
                    preferFlash: false
                }).reboot();
                sm2.didFlashBlock = true;
                sm2.beginDelayedInit()
            }, 1)
        };
        waitForEI = function() {
            var p, loadIncomplete = false;
            if (!sm2.url) return false;
            if (waitingForEI) return false;
            waitingForEI = true;
            event.remove(window, "load", delayWaitForEI);
            if (hasFlash && tryInitOnFocus && !isFocused) {
                _wDS("waitFocus");
                return false
            }
            if (!didInit) {
                p = sm2.getMoviePercent();
                p > 0 && 100 > p && (loadIncomplete = true)
            }
            setTimeout(function() {
                p = sm2.getMoviePercent();
                if (loadIncomplete) {
                    waitingForEI = false;
                    sm2._wD(str("waitSWF"));
                    window.setTimeout(delayWaitForEI, 1);
                    return false
                }
                if (!didInit) {
                    sm2._wD(sm + ": No Flash response within expected time. Likely causes: " + (0 === p ? "SWF load failed, " : "") + "Flash blocked or JS-Flash security error." + (sm2.debugFlash ? " " + str("checkSWF") : ""), 2);
                    if (!overHTTP && p) {
                        _wDS("localFail", 2);
                        sm2.debugFlash || _wDS("tryDebug", 2)
                    }
                    0 === p && sm2._wD(str("swf404", sm2.url), 1);
                    debugTS("flashtojs", false, ": Timed out" + overHTTP ? " (Check flash security or flash blockers)" : " (No plugin/missing SWF?)")
                }
                if (!didInit && okToDisable)
                    if (null === p)
                        if (sm2.useFlashBlock || 0 === sm2.flashLoadTimeout) {
                            sm2.useFlashBlock && flashBlockHandler();
                            _wDS("waitForever")
                        } else if (!sm2.useFlashBlock && canIgnoreFlash) rebootIntoHTML5();
                else {
                    _wDS("waitForever");
                    processOnEvents({
                        type: "ontimeout",
                        ignoreInit: true,
                        error: {
                            type: "INIT_FLASHBLOCK"
                        }
                    })
                } else 0 === sm2.flashLoadTimeout ? _wDS("waitForever") : !sm2.useFlashBlock && canIgnoreFlash ? rebootIntoHTML5() : failSafely(true)
            }, sm2.flashLoadTimeout)
        };
        handleFocus = function() {
            function cleanup() {
                event.remove(window, "focus", handleFocus)
            }
            if (isFocused || !tryInitOnFocus) {
                cleanup();
                return true
            }
            okToDisable = true;
            isFocused = true;
            _wDS("gotFocus");
            waitingForEI = false;
            delayWaitForEI();
            cleanup();
            return true
        };
        flushMessages = function() {
            if (messages.length) {
                sm2._wD("SoundManager 2: " + messages.join(" "), 1);
                messages = []
            }
        };
        showSupport = function() {
            flushMessages();
            var item, tests = [];
            if (sm2.useHTML5Audio && sm2.hasHTML5) {
                for (item in sm2.audioFormats) sm2.audioFormats.hasOwnProperty(item) && tests.push(item + " = " + sm2.html5[item] + (!sm2.html5[item] && needsFlash && sm2.flash[item] ? " (using flash)" : sm2.preferFlash && sm2.flash[item] && needsFlash ? " (preferring flash)" : sm2.html5[item] ? "" : " (" + (sm2.audioFormats[item].required ? "required, " : "") + "and no flash support)"));
                sm2._wD("SoundManager 2 HTML5 support: " + tests.join(", "), 1)
            }
        };
        initComplete = function(bNoDisable) {
            if (didInit) return false;
            if (sm2.html5Only) {
                _wDS("sm2Loaded");
                didInit = true;
                initUserOnload();
                debugTS("onload", true);
                return true
            }
            var error, wasTimeout = sm2.useFlashBlock && sm2.flashLoadTimeout && !sm2.getMoviePercent(),
                result = true;
            wasTimeout || (didInit = true);
            error = {
                type: !hasFlash && needsFlash ? "NO_FLASH" : "INIT_TIMEOUT"
            };
            sm2._wD("SoundManager 2 " + (disabled ? "failed to load" : "loaded") + " (" + (disabled ? "Flash security/load error" : "OK") + ")", disabled ? 2 : 1);
            if (disabled || bNoDisable) {
                sm2.useFlashBlock && sm2.oMC && (sm2.oMC.className = getSWFCSS() + " " + (null === sm2.getMoviePercent() ? swfCSS.swfTimedout : swfCSS.swfError));
                processOnEvents({
                    type: "ontimeout",
                    error: error,
                    ignoreInit: true
                });
                debugTS("onload", false);
                catchError(error);
                result = false
            } else debugTS("onload", true);
            if (!disabled)
                if (sm2.waitForWindowLoad && !windowLoaded) {
                    _wDS("waitOnload");
                    event.add(window, "load", initUserOnload)
                } else {
                    sm2.waitForWindowLoad && windowLoaded && _wDS("docLoaded");
                    initUserOnload()
                }
            return result
        };
        setProperties = function() {
            var i, o = sm2.setupOptions;
            for (i in o) o.hasOwnProperty(i) && (sm2[i] === _undefined ? sm2[i] = o[i] : sm2[i] !== o[i] && (sm2.setupOptions[i] = sm2[i]))
        };
        init = function() {
            function cleanup() {
                event.remove(window, "load", sm2.beginDelayedInit)
            }
            if (didInit) {
                _wDS("didInit");
                return false
            }
            if (sm2.html5Only) {
                if (!didInit) {
                    cleanup();
                    sm2.enabled = true;
                    initComplete()
                }
                return true
            }
            initMovie();
            try {
                flash._externalInterfaceTest(false);
                setPolling(true, sm2.flashPollingInterval || (sm2.useHighPerformance ? 10 : 50));
                sm2.debugMode || flash._disableDebug();
                sm2.enabled = true;
                debugTS("jstoflash", true);
                sm2.html5Only || event.add(window, "unload", doNothing)
            } catch (e) {
                sm2._wD("js/flash exception: " + e.toString());
                debugTS("jstoflash", false);
                catchError({
                    type: "JS_TO_FLASH_EXCEPTION",
                    fatal: true
                });
                failSafely(true);
                initComplete();
                return false
            }
            initComplete();
            cleanup();
            return true
        };
        domContentLoaded = function() {
            if (didDCLoaded) return false;
            didDCLoaded = true;
            setProperties();
            initDebug();
            ! function() {
                var a = "sm2-usehtml5audio=",
                    a2 = "sm2-preferflash=",
                    b = null,
                    b2 = null,
                    l = wl.toLowerCase();
                if (-1 !== l.indexOf(a)) {
                    b = "1" === l.charAt(l.indexOf(a) + a.length);
                    sm2.setup({
                        useHTML5Audio: b
                    })
                }
                if (-1 !== l.indexOf(a2)) {
                    b2 = "1" === l.charAt(l.indexOf(a2) + a2.length);
                    sm2.setup({
                        preferFlash: b2
                    })
                }
            }();
            if (!hasFlash && sm2.hasHTML5) {
                sm2._wD("SoundManager 2: No Flash detected" + (sm2.useHTML5Audio ? ". Trying HTML5-only mode." : ", enabling HTML5."), 1);
                sm2.setup({
                    useHTML5Audio: true,
                    preferFlash: false
                })
            }
            testHTML5();
            if (!hasFlash && needsFlash) {
                messages.push(strings.needFlash);
                sm2.setup({
                    flashLoadTimeout: 1
                })
            }
            doc.removeEventListener && doc.removeEventListener("DOMContentLoaded", domContentLoaded, false);
            initMovie();
            return true
        };
        domContentLoadedIE = function() {
            if ("complete" === doc.readyState) {
                domContentLoaded();
                doc.detachEvent("onreadystatechange", domContentLoadedIE)
            }
            return true
        };
        winOnLoad = function() {
            windowLoaded = true;
            event.remove(window, "load", winOnLoad)
        };
        preInit = function() {
            if (mobileHTML5) {
                (!sm2.setupOptions.useHTML5Audio || sm2.setupOptions.preferFlash) && messages.push(strings.mobileUA);
                sm2.setupOptions.useHTML5Audio = true;
                sm2.setupOptions.preferFlash = false;
                if (is_iDevice || isAndroid && !ua.match(/android\s2\.3/i)) {
                    messages.push(strings.globalHTML5);
                    is_iDevice && (sm2.ignoreFlash = true);
                    useGlobalHTML5Audio = true
                }
            }
        };
        preInit();
        detectFlash();
        event.add(window, "focus", handleFocus);
        event.add(window, "load", delayWaitForEI);
        event.add(window, "load", winOnLoad);
        if (doc.addEventListener) doc.addEventListener("DOMContentLoaded", domContentLoaded, false);
        else if (doc.attachEvent) doc.attachEvent("onreadystatechange", domContentLoadedIE);
        else {
            debugTS("onload", false);
            catchError({
                type: "NO_DOM2_EVENTS",
                fatal: true
            })
        }
    }
    var soundManager = null;
    void 0 !== window.SM2_DEFER && SM2_DEFER || (soundManager = new SoundManager);
    window.SoundManager = SoundManager;
    window.soundManager = soundManager
}(window);