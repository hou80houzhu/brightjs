/*!
 * @packet opensite.mobi.util.touch;
 */
var currentTime = function () {
    return new Date().getTime();
};
var eventAgent = {
    events: (function () {
        if ((/AppleWebKit.*Mobile.*/).test(window.navigator.userAgent)) {
            return {
                type: "mobile",
                down: "touchstart",
                move: "touchmove",
                up: "touchend"
            };
        } else {
            return {
                type: "pc",
                down: "mousedown",
                move: "mousemove",
                up: "mouseup"
            };
        }
    })(),
    onmove: function (fn) {
        this.dom.bind(eventAgent.events["move"], eventAgent._move);
        return this;
    },
    ondown: function (fn) {
        this.dom.bind(eventAgent.events["down"], eventAgent._down);
        return this;
    },
    onup: function (fn) {
        this.dom.bind(eventAgent.events["up"], eventAgent._up);
        return this;
    },
    type: function () {
        return eventAgent.events.type;
    },
    _down: function (e) {
        var ths = e.currentTarget.datasets._touch_;
        e.action = "down";
        ths.direction = "none";
        e.direction = ths.direction;
        ths.isdown = true;
        ths.ismove = false;
        ths.movefirst = true;
        ths.itime = currentTime();

        ths.xis = e.touches ? e.touches[0].pageX : e.pageX;
        ths.yis = e.touches ? e.touches[0].pageY : e.pageY;
        ths.cxis = ths.xis;
        ths.cyis = ths.yis;
        e.xis = ths.xis;
        e.yis = ths.yis;
        ths._x = ths.xis;
        ths._y = ths.yis;
        ths._ontouch.call(ths.dom, e);
    },
    _move: function (e) {
        var ths = e.currentTarget.datasets._touch_;
        if (ths.isdown) {
            e.action = "move";
            ths.ismove = true;
            ths.cxis = e.touches ? e.touches[0].pageX : e.pageX;
            ths.cyis = e.touches ? e.touches[0].pageY : e.pageY;
            e.xis = ths.cxis;
            e.yis = ths.cyis;
            e.offsetX = ths.cxis - ths.xis;
            e.offsetY = ths.cyis - ths.yis;
            if (ths.movefirst) {
                ths.movefirst = false;
                if (Math.abs(e.offsetX) > Math.abs(e.offsetY)) {
                    ths.oishv = "h";
                } else {
                    ths.oishv = "v";
                }
                if (ths.oishv === "h") {
                    if (ths.cxis > ths.xis) {
                        ths.odirection = "right";
                    } else {
                        ths.odirection = "left";
                    }
                } else {
                    if (ths.cyis > ths.yis) {
                        ths.odirection = "bottom";
                    } else {
                        ths.odirection = "top";
                    }
                }
            }
            var _offsetx = ths.cxis - ths._x;
            var _offsety = ths.cyis - ths._y;
            if (Math.abs(_offsetx) > Math.abs(_offsety)) {
                ths.ishv = "h";
            } else {
                ths.ishv = "v";
            }
            if (ths.ishv === "h") {
                if (ths.cxis > ths._x) {
                    ths.direction = "right";
                } else {
                    ths.direction = "left";
                }
            } else {
                if (ths.cyis > ths._y) {
                    ths.direction = "bottom";
                } else {
                    ths.direction = "top";
                }
            }
            e.direction = ths.direction;
            e.odirection = ths.odirection;
            ths._x = ths.cxis;
            ths._y = ths.cyis;
            ths._ontouch.call(ths.dom, e);
        }
    },
    _up: function (e) {
        var ths = e.currentTarget.datasets._touch_;
        if (ths.isdown) {
            e.action = "up";
            ths.isdown = false;
            e.timeLast = new Date().getTime() - ths.itime;
            e.offsetY = ths.cyis - ths.yis;
            e.offsetX = ths.cxis - ths.xis;
            e.ismove = ths.ismove;
            e.xis = ths.cxis;
            e.yis = ths.cyis;
            e.direction = ths.direction;
            e.odirection = ths.odirection;
            ths._ontouch.call(ths.dom, e);
            ths.ismove = false;
        }
    }
};
$.fn.touch = function (ontouch) {
    if (!this.data("_touch_")) {
        var a = new agent(this, ontouch);
        this.data("_touch_", a);
        return a;
    } else {
        return this.data("_touch_");
    }
};
$.fn.untouch = function () {
    this.data("_touch_", null);
    this.unbind(eventAgent.events["up"]);
    this.unbind(eventAgent.events["down"]);
    this.unbind(eventAgent.events["move"]);
};
var agent = function (dom, ontouch) {
    this.dom = dom;
    this._ontouch = ontouch;
    this.xis = 0;
    this.yis = 0;
    this.cxis = 0;
    this.cyis = 0;
    this.direction = "";
    this.isdown = false;
    this.ismove = false;
    this.itime = 0;
    this.movefirst = false;
    this.ishv = "h";
    this.dom.css({
        "-webkit-user-select": "none",
        "-webkit-touch-callout": "none",
        "-webkit-user-drag": "none",
        "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
    });
    eventAgent.ondown.call(this);
    eventAgent.onmove.call(this);
    eventAgent.onup.call(this);
    return this;
};
agent.prototype.ontouch = function (fn) {
    this._ontouch = fn;
    return this;
};
var onetimeis=true;
$.fn.button = function (fn, scope, option) {
    var ops = {
        propagation: false
    };
    $.extend(ops, option);
    var fnn = this.data("_button_event_");
    if (fn) {
        var ths = this;
        if (!fnn) {
            this.data("_button_event_", fn);
            this.touch(function (e) {
                $("body").find("input").each(function(){
                    $(this).get(0).blur();
                });
                var _width = ths.width() / 2, _width2 = _width / 2;
                var _nwidth = _width * 2, _nwidth2 = _nwidth / 2;
                var _c = ths.offset();
                if (e.action === "down") {
                    if (ops.propagation) {
                        e.stopPropagation();
                    }
                }
                if (e.action === "up"&&onetimeis) {
                    if (!e.ismove && e.timeLast > 30) {
                        onetimeis=false;
                        e.stopPropagation();
                        if (ths.css("position") === "static") {
                            ths.css({
                                "position": "relative",
                                "overflow": "hidden"
                            });
                        }
                        var n = $("<div style='position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(250,250,250,.1);'><div style='" +
                                "width:" + _width + "px;" +
                                "height:" + _width + "px;" +
                                "position:absolute;" +
                                "left:" + (e.xis - _c.left) + "px;" +
                                "top:50%;" +
                                "margin-left:-" + _width2 + "px;" +
                                "margin-top:-" + _width2 + "px;" +
                                "z-index:999999999;" +
                                "background:#B7B2B2;" +
                                "opacity:0.5;" +
                                "-webkit-border-radius:" + _width2 + "px'></div></div>").appendTo(ths);
                        setTimeout(function () {
                            n.children(0).transition().all().done(function () {
                                fn && fn.call(ths, e, scope);
                                this.parent().remove();
                            }).scope().css({
                                width: _nwidth + "px",
                                height: _nwidth + "px",
                                "margin-left": -_nwidth2 + "px",
                                "margin-top": -_nwidth2 + "px",
                                "opacity": "0",
                                "-webkit-border-radius": _nwidth2 + "px"
                            });
                            setTimeout(function(){
                                onetimeis=true;
                            },500);
                        }, 100);
                    }
                }
            });
        }
    } else {
        fnn.call(this,null,scope);
    }
};
$.fn.swipeLeft = function (fn) {
    this.touch(function (e) {
        if (e.action === "up") {
            this.find("span").html(e.direction);
            if (e.timeLast < 200 && e.direction === "left") {
                if (fn) {
                    fn.call(this);
                }
            }
        }
        e.preventDefault();
    });
    return this;
};
$.fn.swipeRight = function (fn) {
    this.touch(function (e) {
        if (e.action === "up") {
            this.find("span").html(e.direction);
            if (e.timeLast < 200 && e.direction === "right") {
                if (fn) {
                    fn.call(this);
                }
            }
        }
        e.preventDefault();
    });
    return this;
};
$.fn.swipeTop = function () {
    this.touch(function (e) {
        if (e.action === "up") {
            if (e.timeLast < 200 && e.direction === "top") {
                if (fn) {
                    fn.call(this);
                }
            }
        }
        e.preventDefault();
    });
    return this;
};
$.fn.swipeBottom = function () {
    this.touch(function (e) {
        if (e.action === "up") {
            if (e.timeLast < 200 && e.direction === "bottom") {
                if (fn) {
                    fn.call(this);
                }
            }
        }
        e.preventDefault();
    });
    return this;
};
$.fn.tap = function (fn) {
    this.touch(function (e) {
        if (e.action === "up") {
            if ((!e.ismove) && e.timeLast < 200) {
                if (fn) {
                    fn.call(this, e);
                }
            }
        }
        e.preventDefault();
        e.stopPropagation();
    });
    return this;
};
$.fn.longTap = function (fn) {
    this.touch(function (e) {
        if (e.action === "up") {
            if ((!e.ismove) && e.timeLast >= 500) {
                if (fn) {
                    fn.call(this, e);
                }
            }
        }
        e.preventDefault();
    });
    return this;
};
$.fn.doubleTap = function (fn) {
    var times = 0;
    this.touch(function (e) {
        if (e.action === "down") {
        } else if (e.action === "up") {
            if (!e.ismove && e.timeLast < 200) {
                times++;
                if (times === 2) {
                    if (fn) {
                        fn.call(this);
                    }
                    times = 0;
                }
            }
        }
        e.preventDefault();
    });
    return this;
};


