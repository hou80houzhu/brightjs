/*!
 * @packet admin.util.canvas;
 */
var factory = $.adapt();
factory.def({
    name: "DisplayObject",
    init: function (option) {
        option.init && option.init.call(this, option);
        this._id = option.id;
        this._x = $.is.isAvalid(option.x) ? option.x : 0;
        this._y = $.is.isAvalid(option.y) ? option.y : 0;
        this._originalx = this._x;
        this._originaly = this._y;
        this._width = $.is.isAvalid(option.width) ? option.width : 10;
        this._height = $.is.isAvalid(option.height) ? option.height : 10;
        this._rotate = $.is.isAvalid(option.rotate) ? option.rotate : 0;
        this._alpha = $.is.isAvalid(option.alpha) ? option.alpha : 1;
        var cvs = document.createElement("canvas");
        cvs.width = this._width;
        cvs.height = this._height;
        this.canvas = cvs;
        this.ctx = cvs.getContext("2d");
        this._minx = this._x;
        this._miny = this._y;
        this._maxwidth = this._width;
        this._maxheight = this._height;
        this.cache = {};
    },
    id: function (a) {
        if (arguments.length === 0) {
            return this._id;
        } else {
            this._id = a;
            return this;
        }
    },
    props: function (obj) {
        for (var i in obj) {
            if (this["_" + i]) {
                this["_" + i] = obj[i];
            }
        }
        this.redraw();
        return this;
    },
    render: function () {
    },
    redraw: function () {
        var a = this._parent;
        while (a) {
            a.draw();
            a = a._parent;
        }
    },
    _clear: function () {
    }
}).def({
    name: "DisplayEvent",
    init: function (option) {
        this.eventType = option.type;
        this.target = null;
        this.currentTarget = null;
        this.data = option.data || null;
        this._goon = true;
    },
    stopPropagation: function () {
        this._goon = false;
    }
}).def({
    name: "MouseEvent",
    extend: "DisplayEvent",
    init: function (option) {
        this.pageX = option.pageX || 0;
        this.pageY = option.pageY || 0;
    }
}).def({
    name: "Sprite",
    extend: "DisplayObject",
    init: function (option) {
        this._handler = {};
        this._parent = null;
        this._root = null;
        this._depth = 0;
        this._rotatepoint = option.rotatepoint || [0, 0];
        this._scale = 1;
        this._event = option.event === false ? false : true;
        for (var i in option) {
            if (/^on/.test(i) && $.is.isFunction(option[i])) {
                this[i] = option[i];
            }
        }
    },
    root: function () {
        if (!this._root) {
            var a = this;
            while (!a.typeOf("root")) {
                a = a._parent;
            }
            this._root = a;
        }
        return this._root;
    },
    parent: function () {
        return this._parent;
    },
    x: function (a) {
        if (arguments.length === 0) {
            return this._x;
        } else {
            this._x = a;
            this._originalx = a;
            this.redraw();
            return this;
        }
    },
    y: function (a) {
        if (arguments.length === 0) {
            return this._y;
        } else {
            this._y = a;
            this._originaly = a;
            this.redraw();
            return this;
        }
    },
    width: function (a) {
        if (arguments.length === 0) {
            return this._width;
        } else {
            this._width = a;
            this.redraw();
            return this;
        }
    },
    height: function (a) {
        if (arguments.length === 0) {
            return this._height;
        } else {
            this._height = a;
            this.redraw();
            return this;
        }
    },
    alpha: function (a) {
        if (arguments.length === 0) {
            return this._alpha;
        } else {
            this._alpha = a;
            this.redraw();
            return this;
        }
    },
    rotate: function (rotate) {
        if (arguments.length === 1 && $.is.isNumber(rotate)) {
            this._rotate = rotate;
            var _pp = Math.PI * (rotate / 180), rotatepoint = this._rotatepoint, x = this._originalx, y = this._originaly;
            if (rotatepoint[1] !== 0) {
                var R = Math.sqrt((rotatepoint[0] - x) * (rotatepoint[0] - x) + (rotatepoint[1] - y) * (rotatepoint[1] - y));
                var offset = Math.PI - Math.atan((rotatepoint[1] - y) / (rotatepoint[0] - x)) - _pp;
                this._x = rotatepoint[0] + R * Math.cos(offset);
                this._y = rotatepoint[1] - R * Math.sin(offset);
            } else {
                this._x = x;
                this._y = y;
            }
            this.redraw();
            return this;
        } else {
            return this._rotate;
        }
    },
    rotatePoint: function (x, y) {
        if (arguments.length === 0) {
            return this._rotatepoint;
        } else {
            this._rotatepoint = [x, y];
            return this;
        }
    },
    checkPointIn: function (x, y) {
        return (x >= 0 && x <= 0 + this._width && y >= 0 && y <= 0 + this._height);
    },
    getLocalRelativeParentPoint: function (x, y) {
        var sprite = this;
        var _pp = Math.PI * (sprite._rotate / 180);
        var cos = Math.cos(_pp), sin = Math.sin(_pp);
        var ox = (x - sprite._x), oy = (y - sprite._y);
        return{
            x: ox * cos + oy * sin,
            y: oy * cos - ox * sin
        };
    },
    getLocalRelativeRootPoint: function (x, y) {
        var a = [], b = this._parent;
        while (b) {
            a.push(b);
            b = b._parent;
        }
        var mx = {
            x: 0,
            y: 0
        };
        for (var i = a.length - 1; i >= 0; --i) {
            mx = a[i].getLocalRelativeParentPoint(x, y);
        }
        return mx;
    },
    clean: function () {
        this.ctx.clearRect(0, 0, this._width, this._height);
    },
    addEventListenter: function (type, fn) {
        if (!this._handler[type]) {
            this._handler[type].push(fn);
        } else {
            this._handler[type] = [fn];
        }
        return this;
    },
    removeEventListener: function (type, fn) {
        if (this._handler[type]) {
            if (fn) {
                var a = this._handler[type].indexOf(fn);
                if (a !== -1) {
                    this._handler[type].splice(a, 1);
                }
            } else {
                this._handler[type].length = 0;
            }
        }
        return this;
    },
    dispatchEvent: function (event) {
        event.target = this;
        var i = this;
        while (i) {
            i.privator("triggerEvent", event);
            if (event._goon) {
                i = i._parent;
            } else {
                break;
            }
        }
        return this;
    },
    getImageDate: function (x, y, width, height) {
        var xis = x || 0, yis = y || 0, widthis = width || this._width, heightis = height || this._height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = widthis;
        canvas.height = heightis;
        ctx.drawImage(this.ctx.canvas, xis, yis, widthis, heightis, 0, 0, widthis, heightis);
        return canvas.toDataURL("image/png");
    },
    _triggerEvent: function (e) {
        e.currentTarget = this;
        if (this._handler[e.eventType]) {
            for (var i = 0; i < this._handler[e.eventType].length; i++) {
                this._handler[e.eventType][i].call(this, e);
            }
        } else {
            if ($.is.isFunction(this["on" + e.eventType])) {
                this["on" + e.eventType].call(this, e);
            }
        }
        return this;
    }
}).def({
    name: "DisplayObjectContainer",
    extend: "Sprite",
    init: function () {
        this.children = [];
    },
    addChild: function (child) {
        if (child.typeOf && child.typeOf("DisplayObject")) {
            this.children.push(child);
            child._depth = this.children.length;
            child._parent = this;
            child._root = this.typeOf("root") ? this : this._root;
        } else if ($.is.isObject(child)) {
            if (child.displayType) {
                var a = factory.create(child.displayType, child);
                this.children.push(a);
                a._depth = this.children.length;
                a._parent = this;
                a._root = (this._id === "ROOT" ? this : this._parent);
            }
        }
        this.render();
        return this;
    },
    getChildAt: function (num) {
        if (num >= 0 && num < this.children.length) {
            return this.children[num];
        } else {
            return null;
        }
    },
    getChildById: function (name) {
        var r = null;
        if (name && name !== "") {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i]._id === name) {
                    r = this.children[i];
                }
            }
        }
        return r;
    },
    removeChildAt: function (num) {
        if (num >= 0 && num < this.children.length) {
            this.children.splice(num, 1);
            this.render();
        }
        return this;
    },
    render: function () {
        var ths = this;
        this.clean();
        ths.ctx.globalAlpha = ths._alpha;
        this.children.forEach(function (a) {
            ths.ctx.save();
            a.render();
            if (a.typeOf("DisplayObjectContainer")) {
                ths.ctx.translate(a._x, a._y);
                ths.ctx.rotate(a._rotate / 180 * Math.PI);
                ths.ctx.drawImage(a.canvas, 0, 0, a._width, a._height);
            } else {
                ths.ctx.translate(a._x, a._y);
                ths.ctx.rotate(a._rotate / 180 * Math.PI);
                ths.ctx.drawImage(a.canvas, 0, 0, a._width, a._height);
            }
            ths.ctx.restore();
        });
    },
    draw: function () {
        var ths = this;
        this.clean();
        ths.ctx.globalAlpha = ths._alpha;
        this.children.forEach(function (a) {
            ths.ctx.save();
            if (a.typeOf("DisplayObjectContainer")) {
                ths.ctx.translate(a._x, a._y);
                ths.ctx.rotate(a._rotate / 180 * Math.PI);
                ths.ctx.drawImage(a.canvas, 0, 0, a._width, a._height);
            } else {
                ths.ctx.translate(a._x, a._y);
                ths.ctx.rotate(a._rotate / 180 * Math.PI);
                ths.ctx.drawImage(a.canvas, 0, 0, a._width, a._height);
            }
            ths.ctx.restore();
        });
    },
    setdrawingsize: function () {
        var minx = 0, maxx = this._width, maxy = this._height, miny = 0, maxwidth = this._width, maxheight = this._height;
        for (var i in this.children) {
            if (this.children[i]._x < 0 && this.children[i]._x < minx) {
                minx = this.children[i]._x;
            }
            if (this.children[i]._x > maxx) {
                maxx = this.children[i]._x;
            }
            maxx += 200;
            if (this.children[i]._y > maxy) {
                maxy = this.children[i]._y;
            }
            maxy += 200;
            if (this.children[i]._y < 0 && this.children[i]._y < miny) {
                miny = this.children[i]._y;
            }
            if (this.children[i]._width > maxwidth) {
                maxwidth = this.children[i]._width;
            }
            if (this.children[i]._height > maxheight) {
                maxheight = this.children[i]._height;
            }
        }
        this._minx = this._x - Math.abs(minx);
        this._miny = this._y - Math.abs(miny);
        this._maxwidth = Math.abs(minx) + maxwidth + (maxx - this._width);
        this._maxheight = Math.abs(miny) + maxheight + (maxy - this._height);
        this.canvas.width = this._maxwidth;
        this.canvas.height = this._maxheight;
    },
    clean: function () {
        this.ctx.clearRect(0, 0, this._maxwidth, this._maxheight);
    },
    _target: function (x, y) {
        var aa = this;
        for (var i = this.children.length - 1; i >= 0; --i) {
            var a = this.children[i];
            if (a._event) {
                var b = a.getLocalRelativeParentPoint(x, y);
                if (a.checkPointIn(b.x, b.y)) {
                    if (a.typeOf("DisplayObjectContainer")) {
                        aa = a.privator("target", b.x, b.y);
                    } else {
                        aa = a;
                    }
                    break;
                }
            }
        }
        return aa;
    }
}).def({
    name: "Animate",
    extend: "DisplayObjectContainer",
    init: function () {
        var ths = this;
        this._interval = setInterval(function () {
            ths.onenterframe && ths.onenterframe();
        }, 50);
    },
    _clear: function () {
        for (var i in this) {
            this[i] = null;
        }
        clearInterval(this._interval);
    }
}).def({
    name: "SquartDisplay",
    extend: "Sprite",
    init: function (option) {
        this.backgroundColor = option.backgroundColor || null;
        this.borderSize = option.borderSize || null;
        this.borderColor = option.borderColor || null;
    },
    render: function () {
        this.ctx.globalAlpha = this._alpha;
        if (this.backgroundColor) {
            this.ctx.save();
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this._width, this._height);
            this.ctx.restore();
        }
        if (this.borderSize || this.borderColor) {
            this.ctx.save();
            this.ctx.lineWidth = this.borderSize;
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, this._height);
            this.ctx.lineTo(this._width, this._height);
            this.ctx.lineTo(this._width, 0);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
}).def({
    name: "ImageDisplay",
    extend: "Sprite",
    init: function (option) {
        this.image = option.image;
        this.imageType = option.imageType;
        this.backgroundColor = option.backgroundColor || null;
    },
    render: function () {
        this.ctx.globalAlpha = this._alpha;
        if (this.backgroundColor) {
            this.ctx.save();
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this._width, this._height);
            this.ctx.restore();
        }
        if (this.image) {
            var image = this.image;
            var type = this.imageType ? this.imageType : "fit";
            var sprite = this;
            if (type === "fit") {
                var _w = 0, _h, _x = 0, _y = 0;
                if (image.width > sprite._width) {
                    _w = sprite._width;
                    _h = (image.height / image.width) * _w;
                    if (_h > sprite._height) {
                        _h = sprite._height;
                        _w = (image.width / image.height) * _h;
                    }
                } else {
                    _h = sprite._height;
                    _w = (image.width / image.height) * _h;
                    if (_w > sprite._width) {
                        _w = sprite._width;
                        _h = (image.height / image.width) * _w;
                    }
                }
                _x = (sprite._width - _w) / 2;
                _y = (sprite._height - _h) / 2;
                sprite.ctx.drawImage(image, _x, _y, _w, _h);
            } else if (type === "repeat") {
                var _w = sprite._width, _h = sprite._height, _x = 0, _y = 0;
                while (true) {
                    sprite.ctx.drawImage(image, _x, _y, image.width, image.height);
                    _x += image.width;
                    if (_x > _w) {
                        _y += image.height;
                        if (_y < _h) {
                            _x = 0;
                        } else {
                            break;
                        }
                    }
                }
            } else if (type === "fill") {
                sprite.ctx.drawImage(image, 0, 0, sprite._width, sprite._height);
            } else if (type === "center") {
                var _w = image.width, _h = image.height, _x = 0, _y = 0;
                _x = (sprite._width - _w) / 2;
                _y = (sprite._height - _h) / 2;
                sprite.ctx.drawImage(image, _x, _y, _w, _h);
            }
        }
    },
    setImage: function (a, type) {
        this.image = a;
        this.imageType = type || "fit";
        this.render();
        this.redraw();
        return this;
    }
}).def({
    name: "root",
    extend: "DisplayObjectContainer",
    init: function (ops) {
        this._parent = null;
        this._root = null;
        this._id = "ROOT";
        var ths = this;
        $(this.canvas).appendTo(ops.dom).click(function (e) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var target = ths.privator("target", x, y);
            target.dispatchEvent(factory.create("MouseEvent", {
                type: "click",
                pageX: x,
                pageY: y
            }));
        }).bind("mousedown", function (e) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var target = ths.privator("target", x, y);
            target.dispatchEvent(factory.create("MouseEvent", {
                type: "mousedown",
                pageX: x,
                pageY: y
            }));
        }).bind("mouseup", function (e) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var target = ths.privator("target", x, y);
            target.dispatchEvent(factory.create("MouseEvent", {
                type: "mouseup",
                pageX: x,
                pageY: y
            }));
        }).bind("mousemove", function (e) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var target = ths.privator("target", x, y);
            target.dispatchEvent(factory.create("MouseEvent", {
                type: "mousemove",
                pageX: x,
                pageY: y
            }));
        });
    }
});
$.fn.display = function (option) {
    var ops = {
        width: $(this).width(),
        height: $(this).height(),
        dom: $(this)
    };
    return factory.create("root", $.extend(ops, option));
};
module.exports = {
    create: function (type, option) {
        return factory.create(type, option);
    },
    def: function (obj) {
        return factory.def(obj);
    },
    factory: function () {
        return factory;
    }
};