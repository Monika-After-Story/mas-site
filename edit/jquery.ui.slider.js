function changeVolume() {
    var sliderId = $(this).attr("id"),
        volume = $("#" + sliderId).slider("value");
    $(this).attr("val", volume);
    setVolume($(this).attr("src"), $("#" + sliderId).slider("value"))
}

function initSlider() {
    $(".dyna-sitebuild-aud-slider").each(function() {
        $(this).slider({
            slide: changeVolume,
            change: changeVolume,
            min: 0,
            max: 100,
            value: 50,
            range: "min"
        })
    })
}! function($, undefined) {
    function focusable(element, isTabIndexNotNaN) {
        var map, mapName, img, nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || "map" !== map.nodeName.toLowerCase()) return false;
            img = $("img[usemap=#" + mapName + "]")[0];
            return !!img && visible(img)
        }
        return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element)
    }

    function visible(element) {
        return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
            return "hidden" === $.css(this, "visibility")
        }).length
    }
    var uuid = 0,
        runiqueId = /^ui-id-\d+$/;
    $.ui = $.ui || {};
    $.extend($.ui, {
        version: "1.10.4",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });
    $.fn.extend({
        focus: function(orig) {
            return function(delay, fn) {
                return "number" == typeof delay ? this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $(elem).focus();
                        fn && fn.call(elem)
                    }, delay)
                }) : orig.apply(this, arguments)
            }
        }($.fn.focus),
        scrollParent: function() {
            var scrollParent;
            scrollParent = $.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                return /(relative|absolute|fixed)/.test($.css(this, "position")) && /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"))
            }).eq(0) : this.parents().filter(function() {
                return /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"))
            }).eq(0);
            return /fixed/.test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent
        },
        zIndex: function(zIndex) {
            if (zIndex !== undefined) return this.css("zIndex", zIndex);
            if (this.length)
                for (var position, value, elem = $(this[0]); elem.length && elem[0] !== document;) {
                    position = elem.css("position");
                    if ("absolute" === position || "relative" === position || "fixed" === position) {
                        value = parseInt(elem.css("zIndex"), 10);
                        if (!isNaN(value) && 0 !== value) return value
                    }
                    elem = elem.parent()
                }
            return 0
        },
        uniqueId: function() {
            return this.each(function() {
                this.id || (this.id = "ui-id-" + ++uuid)
            })
        },
        removeUniqueId: function() {
            return this.each(function() {
                runiqueId.test(this.id) && $(this).removeAttr("id")
            })
        }
    });
    $.extend($.expr[":"], {
        data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
            return function(elem) {
                return !!$.data(elem, dataName)
            }
        }) : function(elem, i, match) {
            return !!$.data(elem, match[3])
        },
        focusable: function(element) {
            return focusable(element, !isNaN($.attr(element, "tabindex")))
        },
        tabbable: function(element) {
            var tabIndex = $.attr(element, "tabindex"),
                isTabIndexNaN = isNaN(tabIndex);
            return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN)
        }
    });
    $("<a>").outerWidth(1).jquery || $.each(["Width", "Height"], function(i, name) {
        function reduce(elem, size, border, margin) {
            $.each(side, function() {
                size -= parseFloat($.css(elem, "padding" + this)) || 0;
                border && (size -= parseFloat($.css(elem, "border" + this + "Width")) || 0);
                margin && (size -= parseFloat($.css(elem, "margin" + this)) || 0)
            });
            return size
        }
        var side = "Width" === name ? ["Left", "Right"] : ["Top", "Bottom"],
            type = name.toLowerCase(),
            orig = {
                innerWidth: $.fn.innerWidth,
                innerHeight: $.fn.innerHeight,
                outerWidth: $.fn.outerWidth,
                outerHeight: $.fn.outerHeight
            };
        $.fn["inner" + name] = function(size) {
            return size === undefined ? orig["inner" + name].call(this) : this.each(function() {
                $(this).css(type, reduce(this, size) + "px")
            })
        };
        $.fn["outer" + name] = function(size, margin) {
            return "number" != typeof size ? orig["outer" + name].call(this, size) : this.each(function() {
                $(this).css(type, reduce(this, size, true, margin) + "px")
            })
        }
    });
    $.fn.addBack || ($.fn.addBack = function(selector) {
        return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector))
    });
    $("<a>").data("a-b", "a").removeData("a-b").data("a-b") && ($.fn.removeData = function(removeData) {
        return function(key) {
            return arguments.length ? removeData.call(this, $.camelCase(key)) : removeData.call(this)
        }
    }($.fn.removeData));
    $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    $.support.selectstart = "onselectstart" in document.createElement("div");
    $.fn.extend({
        disableSelection: function() {
            return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
                event.preventDefault()
            })
        },
        enableSelection: function() {
            return this.unbind(".ui-disableSelection")
        }
    });
    $.extend($.ui, {
        plugin: {
            add: function(module, option, set) {
                var i, proto = $.ui[module].prototype;
                for (i in set) {
                    proto.plugins[i] = proto.plugins[i] || [];
                    proto.plugins[i].push([option, set[i]])
                }
            },
            call: function(instance, name, args) {
                var i, set = instance.plugins[name];
                if (set && instance.element[0].parentNode && 11 !== instance.element[0].parentNode.nodeType)
                    for (i = 0; i < set.length; i++) instance.options[set[i][0]] && set[i][1].apply(instance.element, args)
            }
        },
        hasScroll: function(el, a) {
            if ("hidden" === $(el).css("overflow")) return false;
            var scroll = a && "left" === a ? "scrollLeft" : "scrollTop",
                has = false;
            if (el[scroll] > 0) return true;
            el[scroll] = 1;
            has = el[scroll] > 0;
            el[scroll] = 0;
            return has
        }
    })
}(jQuery);
! function($, undefined) {
    var uuid = 0,
        slice = Array.prototype.slice,
        _cleanData = $.cleanData;
    $.cleanData = function(elems) {
        for (var elem, i = 0; null != (elem = elems[i]); i++) try {
            $(elem).triggerHandler("remove")
        } catch (e) {}
        _cleanData(elems)
    };
    $.widget = function(name, base, prototype) {
        var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {},
            namespace = name.split(".")[0];
        name = name.split(".")[1];
        fullName = namespace + "-" + name;
        if (!prototype) {
            prototype = base;
            base = $.Widget
        }
        $.expr[":"][fullName.toLowerCase()] = function(elem) {
            return !!$.data(elem, fullName)
        };
        $[namespace] = $[namespace] || {};
        existingConstructor = $[namespace][name];
        constructor = $[namespace][name] = function(options, element) {
            if (!this._createWidget) return new constructor(options, element);
            arguments.length && this._createWidget(options, element)
        };
        $.extend(constructor, existingConstructor, {
            version: prototype.version,
            _proto: $.extend({}, prototype),
            _childConstructors: []
        });
        basePrototype = new base;
        basePrototype.options = $.widget.extend({}, basePrototype.options);
        $.each(prototype, function(prop, value) {
            $.isFunction(value) ? proxiedPrototype[prop] = function() {
                var _super = function() {
                        return base.prototype[prop].apply(this, arguments)
                    },
                    _superApply = function(args) {
                        return base.prototype[prop].apply(this, args)
                    };
                return function() {
                    var returnValue, __super = this._super,
                        __superApply = this._superApply;
                    this._super = _super;
                    this._superApply = _superApply;
                    returnValue = value.apply(this, arguments);
                    this._super = __super;
                    this._superApply = __superApply;
                    return returnValue
                }
            }() : proxiedPrototype[prop] = value
        });
        constructor.prototype = $.widget.extend(basePrototype, {
            widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });
        if (existingConstructor) {
            $.each(existingConstructor._childConstructors, function(i, child) {
                var childPrototype = child.prototype;
                $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto)
            });
            delete existingConstructor._childConstructors
        } else base._childConstructors.push(constructor);
        $.widget.bridge(name, constructor)
    };
    $.widget.extend = function(target) {
        for (var key, value, input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length; inputLength > inputIndex; inputIndex++)
            for (key in input[inputIndex]) {
                value = input[inputIndex][key];
                input[inputIndex].hasOwnProperty(key) && value !== undefined && ($.isPlainObject(value) ? target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value) : target[key] = value)
            }
        return target
    };
    $.widget.bridge = function(name, object) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[name] = function(options) {
            var isMethodCall = "string" == typeof options,
                args = slice.call(arguments, 1),
                returnValue = this;
            options = !isMethodCall && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options;
            isMethodCall ? this.each(function() {
                var methodValue, instance = $.data(this, fullName);
                if (!instance) return $.error("cannot call methods on " + name + " prior to initialization; attempted to call method '" + options + "'");
                if (!$.isFunction(instance[options]) || "_" === options.charAt(0)) return $.error("no such method '" + options + "' for " + name + " widget instance");
                methodValue = instance[options].apply(instance, args);
                if (methodValue !== instance && methodValue !== undefined) {
                    returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
                    return false
                }
            }) : this.each(function() {
                var instance = $.data(this, fullName);
                instance ? instance.option(options || {})._init() : $.data(this, fullName, new object(options, this))
            });
            return returnValue
        }
    };
    $.Widget = function() {};
    $.Widget._childConstructors = [];
    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: false,
            create: null
        },
        _createWidget: function(options, element) {
            element = $(element || this.defaultElement || this)[0];
            this.element = $(element);
            this.uuid = uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();
            if (element !== this) {
                $.data(element, this.widgetFullName, this);
                this._on(true, this.element, {
                    remove: function(event) {
                        event.target === element && this.destroy()
                    }
                });
                this.document = $(element.style ? element.ownerDocument : element.document || element);
                this.window = $(this.document[0].defaultView || this.document[0].parentWindow)
            }
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,
        destroy: function() {
            this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus")
        },
        _destroy: $.noop,
        widget: function() {
            return this.element
        },
        option: function(key, value) {
            var parts, curOption, i, options = key;
            if (0 === arguments.length) return $.widget.extend({}, this.options);
            if ("string" == typeof key) {
                options = {};
                parts = key.split(".");
                key = parts.shift();
                if (parts.length) {
                    curOption = options[key] = $.widget.extend({}, this.options[key]);
                    for (i = 0; i < parts.length - 1; i++) {
                        curOption[parts[i]] = curOption[parts[i]] || {};
                        curOption = curOption[parts[i]]
                    }
                    key = parts.pop();
                    if (1 === arguments.length) return curOption[key] === undefined ? null : curOption[key];
                    curOption[key] = value
                } else {
                    if (1 === arguments.length) return this.options[key] === undefined ? null : this.options[key];
                    options[key] = value
                }
            }
            this._setOptions(options);
            return this
        },
        _setOptions: function(options) {
            var key;
            for (key in options) this._setOption(key, options[key]);
            return this
        },
        _setOption: function(key, value) {
            this.options[key] = value;
            if ("disabled" === key) {
                this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!value).attr("aria-disabled", value);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus")
            }
            return this
        },
        enable: function() {
            return this._setOption("disabled", false)
        },
        disable: function() {
            return this._setOption("disabled", true)
        },
        _on: function(suppressDisabledCheck, element, handlers) {
            var delegateElement, instance = this;
            if ("boolean" != typeof suppressDisabledCheck) {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false
            }
            if (handlers) {
                element = delegateElement = $(element);
                this.bindings = this.bindings.add(element)
            } else {
                handlers = element;
                element = this.element;
                delegateElement = this.widget()
            }
            $.each(handlers, function(event, handler) {
                function handlerProxy() {
                    return suppressDisabledCheck || true !== instance.options.disabled && !$(this).hasClass("ui-state-disabled") ? ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments) : void 0
                }
                "string" != typeof handler && (handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++);
                var match = event.match(/^(\w+)\s*(.*)$/),
                    eventName = match[1] + instance.eventNamespace,
                    selector = match[2];
                selector ? delegateElement.delegate(selector, eventName, handlerProxy) : element.bind(eventName, handlerProxy)
            })
        },
        _off: function(element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            element.unbind(eventName).undelegate(eventName)
        },
        _delay: function(handler, delay) {
            function handlerProxy() {
                return ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments)
            }
            var instance = this;
            return setTimeout(handlerProxy, delay || 0)
        },
        _hoverable: function(element) {
            this.hoverable = this.hoverable.add(element);
            this._on(element, {
                mouseenter: function(event) {
                    $(event.currentTarget).addClass("ui-state-hover")
                },
                mouseleave: function(event) {
                    $(event.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function(element) {
            this.focusable = this.focusable.add(element);
            this._on(element, {
                focusin: function(event) {
                    $(event.currentTarget).addClass("ui-state-focus")
                },
                focusout: function(event) {
                    $(event.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function(type, event, data) {
            var prop, orig, callback = this.options[type];
            data = data || {};
            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
            event.target = this.element[0];
            orig = event.originalEvent;
            if (orig)
                for (prop in orig) prop in event || (event[prop] = orig[prop]);
            this.element.trigger(event, data);
            return !($.isFunction(callback) && false === callback.apply(this.element[0], [event].concat(data)) || event.isDefaultPrevented())
        }
    };
    $.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(method, defaultEffect) {
        $.Widget.prototype["_" + method] = function(element, options, callback) {
            "string" == typeof options && (options = {
                effect: options
            });
            var hasOptions, effectName = options ? true === options || "number" == typeof options ? defaultEffect : options.effect || defaultEffect : method;
            options = options || {};
            "number" == typeof options && (options = {
                duration: options
            });
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            options.delay && element.delay(options.delay);
            hasOptions && $.effects && $.effects.effect[effectName] ? element[method](options) : effectName !== method && element[effectName] ? element[effectName](options.duration, options.easing, callback) : element.queue(function(next) {
                $(this)[method]();
                callback && callback.call(element[0]);
                next()
            })
        }
    })
}(jQuery);
! function($, undefined) {
    var mouseHandled = false;
    $(document).mouseup(function() {
        mouseHandled = false
    });
    $.widget("ui.mouse", {
        version: "1.10.4",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var that = this;
            this.element.bind("mousedown." + this.widgetName, function(event) {
                return that._mouseDown(event)
            }).bind("click." + this.widgetName, function(event) {
                if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, that.widgetName + ".preventClickEvent");
                    event.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName);
            this._mouseMoveDelegate && $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(event) {
            if (!mouseHandled) {
                this._mouseStarted && this._mouseUp(event);
                this._mouseDownEvent = event;
                var that = this,
                    btnIsLeft = 1 === event.which,
                    elIsCancel = !("string" != typeof this.options.cancel || !event.target.nodeName) && $(event.target).closest(this.options.cancel).length;
                if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) return true;
                this.mouseDelayMet = !this.options.delay;
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    that.mouseDelayMet = true
                }, this.options.delay));
                if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                    this._mouseStarted = false !== this._mouseStart(event);
                    if (!this._mouseStarted) {
                        event.preventDefault();
                        return true
                    }
                }
                true === $.data(event.target, this.widgetName + ".preventClickEvent") && $.removeData(event.target, this.widgetName + ".preventClickEvent");
                this._mouseMoveDelegate = function(event) {
                    return that._mouseMove(event)
                };
                this._mouseUpDelegate = function(event) {
                    return that._mouseUp(event)
                };
                $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                event.preventDefault();
                mouseHandled = true;
                return true
            }
        },
        _mouseMove: function(event) {
            if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) return this._mouseUp(event);
            if (this._mouseStarted) {
                this._mouseDrag(event);
                return event.preventDefault()
            }
            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = false !== this._mouseStart(this._mouseDownEvent, event);
                this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event)
            }
            return !this._mouseStarted
        },
        _mouseUp: function(event) {
            $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                event.target === this._mouseDownEvent.target && $.data(event.target, this.widgetName + ".preventClickEvent", true);
                this._mouseStop(event)
            }
            return false
        },
        _mouseDistanceMet: function(event) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return true
        }
    })
}(jQuery);
! function($, undefined) {
    var numPages = 5;
    $.widget("ui.slider", $.ui.mouse, {
        version: "1.10.4",
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        _create: function() {
            this._keySliding = false;
            this._mouseSliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            this._refresh();
            this._setOption("disabled", this.options.disabled);
            this._animateOff = false
        },
        _refresh: function() {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue()
        },
        _createHandles: function() {
            var i, handleCount, options = this.options,
                existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
                handles = [];
            handleCount = options.values && options.values.length || 1;
            if (existingHandles.length > handleCount) {
                existingHandles.slice(handleCount).remove();
                existingHandles = existingHandles.slice(0, handleCount)
            }
            for (i = existingHandles.length; handleCount > i; i++) handles.push(handle);
            this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));
            this.handle = this.handles.eq(0);
            this.handles.each(function(i) {
                $(this).data("ui-slider-handle-index", i)
            })
        },
        _createRange: function() {
            var options = this.options,
                classes = "";
            if (options.range) {
                true === options.range && (options.values ? options.values.length && 2 !== options.values.length ? options.values = [options.values[0], options.values[0]] : $.isArray(options.values) && (options.values = options.values.slice(0)) : options.values = [this._valueMin(), this._valueMin()]);
                if (this.range && this.range.length) this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                    left: "",
                    bottom: ""
                });
                else {
                    var rangeClass = this.element.find("div").attr("class");
                    if (rangeClass) {
                        rangeClass = rangeClass.replace(/\s+/g, ".");
                        $("." + rangeClass).remove()
                    }
                    this.range = $("<div></div>").appendTo(this.element);
                    classes = "ui-slider-range ui-widget-header ui-corner-all"
                }
                this.range.addClass(classes + ("min" === options.range || "max" === options.range ? " ui-slider-range-" + options.range : ""))
            } else {
                this.range && this.range.remove();
                this.range = null
            }
        },
        _setupEvents: function() {
            var elements = this.handles.add(this.range).filter("a");
            this._off(elements);
            this._on(elements, this._handleEvents);
            this._hoverable(elements);
            this._focusable(elements)
        },
        _destroy: function() {
            this.handles.remove();
            this.range && this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all");
            this._mouseDestroy()
        },
        _mouseCapture: function(event) {
            var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle, that = this,
                o = this.options;
            if (o.disabled) return false;
            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();
            position = {
                x: event.pageX,
                y: event.pageY
            };
            normValue = this._normValueFromMouse(position);
            distance = this._valueMax() - this._valueMin() + 1;
            this.handles.each(function(i) {
                var thisDistance = Math.abs(normValue - that.values(i));
                if (distance > thisDistance || distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min)) {
                    distance = thisDistance;
                    closestHandle = $(this);
                    index = i
                }
            });
            allowed = this._start(event, index);
            if (false === allowed) return false;
            this._mouseSliding = true;
            this._handleIndex = index;
            closestHandle.addClass("ui-state-active").focus();
            offset = closestHandle.offset();
            mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
            this._clickOffset = mouseOverHandle ? {
                left: 0,
                top: 0
            } : {
                left: event.pageX - offset.left - closestHandle.width() / 2,
                top: event.pageY - offset.top - closestHandle.height() / 2 - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
            };
            this.handles.hasClass("ui-state-hover") || this._slide(event, index, normValue);
            this._animateOff = true;
            return true
        },
        _mouseStart: function() {
            return true
        },
        _mouseDrag: function(event) {
            var position = {
                    x: event.pageX,
                    y: event.pageY
                },
                normValue = this._normValueFromMouse(position);
            this._slide(event, this._handleIndex, normValue);
            return false
        },
        _mouseStop: function(event) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;
            this._stop(event, this._handleIndex);
            this._change(event, this._handleIndex);
            this._handleIndex = null;
            this._clickOffset = null;
            this._animateOff = false;
            return false
        },
        _detectOrientation: function() {
            this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function(position) {
            var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;
            if ("horizontal" === this.orientation) {
                pixelTotal = this.elementSize.width;
                pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
            } else {
                pixelTotal = this.elementSize.height;
                pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
            }
            percentMouse = pixelMouse / pixelTotal;
            percentMouse > 1 && (percentMouse = 1);
            0 > percentMouse && (percentMouse = 0);
            "vertical" === this.orientation && (percentMouse = 1 - percentMouse);
            valueTotal = this._valueMax() - this._valueMin();
            valueMouse = this._valueMin() + percentMouse * valueTotal;
            return this._trimAlignValue(valueMouse)
        },
        _start: function(event, index) {
            var uiHash = {
                handle: this.handles[index],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                uiHash.value = this.values(index);
                uiHash.values = this.values()
            }
            return this._trigger("start", event, uiHash)
        },
        _slide: function(event, index, newVal) {
            var otherVal, newValues, allowed;
            if (this.options.values && this.options.values.length) {
                otherVal = this.values(index ? 0 : 1);
                2 === this.options.values.length && true === this.options.range && (0 === index && newVal > otherVal || 1 === index && otherVal > newVal) && (newVal = otherVal);
                if (newVal !== this.values(index)) {
                    newValues = this.values();
                    newValues[index] = newVal;
                    allowed = this._trigger("slide", event, {
                        handle: this.handles[index],
                        value: newVal,
                        values: newValues
                    });
                    otherVal = this.values(index ? 0 : 1);
                    false !== allowed && this.values(index, newVal)
                }
            } else if (newVal !== this.value()) {
                allowed = this._trigger("slide", event, {
                    handle: this.handles[index],
                    value: newVal
                });
                false !== allowed && this.value(newVal)
            }
        },
        _stop: function(event, index) {
            var uiHash = {
                handle: this.handles[index],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                uiHash.value = this.values(index);
                uiHash.values = this.values()
            }
            this._trigger("stop", event, uiHash)
        },
        _change: function(event, index) {
            if (!this._keySliding && !this._mouseSliding) {
                var uiHash = {
                    handle: this.handles[index],
                    value: this.value()
                };
                if (this.options.values && this.options.values.length) {
                    uiHash.value = this.values(index);
                    uiHash.values = this.values()
                }
                this._lastChangedValue = index;
                this._trigger("change", event, uiHash)
            }
        },
        value: function(newValue) {
            if (!arguments.length) return this._value();
            this.options.value = this._trimAlignValue(newValue);
            this._refreshValue();
            this._change(null, 0)
        },
        values: function(index, newValue) {
            var vals, newValues, i;
            if (arguments.length > 1) {
                this.options.values[index] = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, index)
            } else {
                if (!arguments.length) return this._values();
                if (!$.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(index) : this.value();
                vals = this.options.values;
                newValues = arguments[0];
                for (i = 0; i < vals.length; i += 1) {
                    vals[i] = this._trimAlignValue(newValues[i]);
                    this._change(null, i)
                }
                this._refreshValue()
            }
        },
        _setOption: function(key, value) {
            var i, valsLength = 0;
            if ("range" === key && true === this.options.range)
                if ("min" === value) {
                    this.options.value = this._values(0);
                    this.options.values = null
                } else if ("max" === value) {
                this.options.value = this._values(this.options.values.length - 1);
                this.options.values = null
            }
            $.isArray(this.options.values) && (valsLength = this.options.values.length);
            $.Widget.prototype._setOption.apply(this, arguments);
            switch (key) {
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();
                    for (i = 0; valsLength > i; i += 1) this._change(null, i);
                    this._animateOff = false;
                    break;
                case "min":
                case "max":
                    this._animateOff = true;
                    this._refreshValue();
                    this._animateOff = false;
                    break;
                case "range":
                    this._animateOff = true;
                    this._refresh();
                    this._animateOff = false
            }
        },
        _value: function() {
            var val = this.options.value;
            val = this._trimAlignValue(val);
            return val
        },
        _values: function(index) {
            var val, vals, i;
            if (arguments.length) {
                val = this.options.values[index];
                val = this._trimAlignValue(val);
                return val
            }
            if (this.options.values && this.options.values.length) {
                vals = this.options.values.slice();
                for (i = 0; i < vals.length; i += 1) vals[i] = this._trimAlignValue(vals[i]);
                return vals
            }
            return []
        },
        _trimAlignValue: function(val) {
            if (val <= this._valueMin()) return this._valueMin();
            if (val >= this._valueMax()) return this._valueMax();
            var step = this.options.step > 0 ? this.options.step : 1,
                valModStep = (val - this._valueMin()) % step,
                alignValue = val - valModStep;
            2 * Math.abs(valModStep) >= step && (alignValue += valModStep > 0 ? step : -step);
            return parseFloat(alignValue.toFixed(5))
        },
        _valueMin: function() {
            return this.options.min
        },
        _valueMax: function() {
            return this.options.max
        },
        _refreshValue: function() {
            var lastValPercent, valPercent, value, valueMin, valueMax, oRange = this.options.range,
                o = this.options,
                that = this,
                animate = !this._animateOff && o.animate,
                _set = {};
            if (this.options.values && this.options.values.length) this.handles.each(function(i) {
                valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
                _set["horizontal" === that.orientation ? "left" : "bottom"] = valPercent + "%";
                $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
                if (true === that.options.range)
                    if ("horizontal" === that.orientation) {
                        0 === i && that.range.stop(1, 1)[animate ? "animate" : "css"]({
                            left: valPercent + "%"
                        }, o.animate);
                        1 === i && that.range[animate ? "animate" : "css"]({
                            width: valPercent - lastValPercent + "%"
                        }, {
                            queue: false,
                            duration: o.animate
                        })
                    } else {
                        0 === i && that.range.stop(1, 1)[animate ? "animate" : "css"]({
                            bottom: valPercent + "%"
                        }, o.animate);
                        1 === i && that.range[animate ? "animate" : "css"]({
                            height: valPercent - lastValPercent + "%"
                        }, {
                            queue: false,
                            duration: o.animate
                        })
                    }
                lastValPercent = valPercent
            });
            else {
                value = this.value();
                valueMin = this._valueMin();
                valueMax = this._valueMax();
                valPercent = valueMax !== valueMin ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
                _set["horizontal" === this.orientation ? "left" : "bottom"] = valPercent + "%";
                this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
                "min" === oRange && "horizontal" === this.orientation && this.range.stop(1, 1)[animate ? "animate" : "css"]({
                    width: valPercent + "%"
                }, o.animate);
                "max" === oRange && "horizontal" === this.orientation && this.range[animate ? "animate" : "css"]({
                    width: 100 - valPercent + "%"
                }, {
                    queue: false,
                    duration: o.animate
                });
                "min" === oRange && "vertical" === this.orientation && this.range.stop(1, 1)[animate ? "animate" : "css"]({
                    height: valPercent + "%"
                }, o.animate);
                "max" === oRange && "vertical" === this.orientation && this.range[animate ? "animate" : "css"]({
                    height: 100 - valPercent + "%"
                }, {
                    queue: false,
                    duration: o.animate
                })
            }
        },
        _handleEvents: {
            keydown: function(event) {
                var allowed, curVal, newVal, step, index = $(event.target).data("ui-slider-handle-index");
                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                    case $.ui.keyCode.END:
                    case $.ui.keyCode.PAGE_UP:
                    case $.ui.keyCode.PAGE_DOWN:
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        event.preventDefault();
                        if (!this._keySliding) {
                            this._keySliding = true;
                            $(event.target).addClass("ui-state-active");
                            allowed = this._start(event, index);
                            if (false === allowed) return
                        }
                }
                step = this.options.step;
                curVal = newVal = this.options.values && this.options.values.length ? this.values(index) : this.value();
                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                        newVal = this._valueMin();
                        break;
                    case $.ui.keyCode.END:
                        newVal = this._valueMax();
                        break;
                    case $.ui.keyCode.PAGE_UP:
                        newVal = this._trimAlignValue(curVal + (this._valueMax() - this._valueMin()) / numPages);
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        newVal = this._trimAlignValue(curVal - (this._valueMax() - this._valueMin()) / numPages);
                        break;
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                        if (curVal === this._valueMax()) return;
                        newVal = this._trimAlignValue(curVal + step);
                        break;
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        if (curVal === this._valueMin()) return;
                        newVal = this._trimAlignValue(curVal - step)
                }
                this._slide(event, index, newVal)
            },
            click: function(event) {
                event.preventDefault()
            },
            keyup: function(event) {
                var index = $(event.target).data("ui-slider-handle-index");
                if (this._keySliding) {
                    this._keySliding = false;
                    this._stop(event, index);
                    this._change(event, index);
                    $(event.target).removeClass("ui-state-active")
                }
            }
        }
    })
}(jQuery);
$(function() {
    initSlider()
});