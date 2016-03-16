/*!
 * @packet admin.util.math;
 */
var prefix = {
    prefix: "-webkit-"
};
var is = $.is;

var transform2 = function (dom) {
    this.dom = dom;
    transform.init.call(this);
    dom.data("_transform_", this);
};
transform2.parse = function () {
    var matrix = this.dom.css(prefix.prefix + "transform");
    var a = matrix.match(/(-?[0-9\.]+)/g);
    if (a) {
        if (a.length > 6) {
            a.shift();
        }
        for (var i = 0; i < a.length; i++) {
            a[i] = a[i] / 1;
        }
    }
    return a;
};
transform2.init = function () {
    var ap = transform.parse.call(this);
    if (!ap) {
        this.dom.css(prefix.prefix + "transform", "translate(0,0)");
        ap = [1, 0, 0, 1, 0, 0];
    }
    if (ap.length === 6) {
        this._rotate = ap[0] !== undefined ? Math.acos(ap[0]) / Math.PI * 180 : 0;
        this._rotate3d = [0, 0, 0];
        this._scale = [ap[0], ap[3]];
        this._scale3d = [1, 1, 1];
        this._skew = [Math.atan(ap[2]) / Math.PI * 180, Math.atan(ap[1]) / Math.PI * 180];
        this._translate3d = [0, 0, 0];
    } else {
        this._rotate = ap[0] !== undefined ? Math.acos(ap[0]) / Math.PI * 180 : 0;
        this._rotate3d = [Math.acos(ap[5]) / Math.PI * 180, Math.acos(ap[0]) / Math.PI * 180, Math.acos(ap[0]) / Math.PI * 180];
        this._scale = [ap[0], ap[5]];
        this._scale3d = [ap[0], ap[5], ap[10]];
        this._skew = [Math.atan(ap[4]) / Math.PI * 180, Math.atan(ap[1]) / Math.PI * 180];
        this._translate3d = [ap[12], ap[13], ap[14]];
    }
};
transform2.set = function () {
    var translate = "translate3d(" + (is.isNumber(this._translate3d[0]) ? this._translate3d[0] + "px" : this._translate3d[0]) +
            "," + (is.isNumber(this._translate3d[1]) ? this._translate3d[1] + "px" : this._translate3d[1]) +
            "," + (is.isNumber(this._translate3d[2]) ? this._translate3d[2] + "px" : this._translate3d[2]) + ") ";
    var rotate = this._rotate !== 0 ? "rotate(" + this._rotate + "deg) " : "";
    var scale3d = this._scale3d[0] !== 1 || this._scale3d[1] !== 1 || this._scale3d[2] !== 1 ? "scale3d(" + this._scale3d[0] +
            "," + this._scale3d[1] + "," + this._scale3d[2] + ") " : "";
    var scale = this._scale[0] !== 1 || this._scale[1] !== 1 ? "scale(" + this._scale[0] + "," + this._scale[1] + ") " : "";
    var rotate3d = (this._rotate3d[0] !== 0 ? "rotateX(" + this._rotate3d[0] + "deg)" : "") + (this._rotate3d[1] !== 0 ? "rotateY(" + this._rotate3d[1] + "deg)" : "") + (this._rotate3d[2] !== 0 ? "rotateZ(" + this._rotate3d[2] + "deg)" : "");
    var skew = this._skew[0] !== 0 || this._skew[1] !== 0 ? "skew(" + this._skew[0] + "deg," + this._skew[1] + "deg)" : "";
    this.dom.css(prefix.prefix + "transform", translate + rotate + scale3d + scale + rotate3d + skew);
};
transform2.prototype.matrix = function (a) {
    if (arguments.length === 0) {
        return transform.parse.call(this);
    } else {
        if (is.isArray(a)) {
            if (a.length === 6) {
                this.dom.css(prefix.prefix + "transform", "matrix(" + a + ")");
            } else {
                this.dom.css(prefix.prefix + "transform", "matrix3d(" + a + ")");
            }
        }
    }
};
transform2.prototype.set = function (a) {
    for (var i in a) {
        if (this["_" + i] !== undefined && a[i]) {
            this["_" + i] = a[i];
        }
    }
    transform.set.call(this);
    return this;
};
transform2.prototype.translate = function (x, y, z) {
    if (arguments.length === 0) {
        return {
            x: this._translate3d[0],
            y: this._translate3d[1],
            z: this._translate3d[2]
        };
    } else {
        x !== undefined && x !== null && (this._translate3d[0] = x);
        y !== undefined && y !== null && (this._translate3d[1] = y);
        z !== undefined && z !== null && (this._translate3d[2] = z);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.scale = function (x, y) {
    if (arguments.length === 0) {
        return {
            x: this._scale[0],
            y: this._scale[1]
        };
    } else {
        x !== undefined && x !== null && (this._scale[0] = x);
        y !== undefined && y !== null && (this._scale[1] = y);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.scale3d = function (x, y, z) {
    if (arguments.length === 0) {
        return {
            x: this._scale3d[0],
            y: this._scale3d[1],
            z: this._scale3d[2]
        };
    } else {
        x !== undefined && x !== null && (this._scale3d[0] = x);
        y !== undefined && y !== null && (this._scale3d[1] = y);
        z !== undefined && z !== null && (this._scale3d[2] = z);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.rotate = function (a) {
    if (arguments.length === 0) {
        return this._rotate;
    } else {
        a !== undefined && a !== null && (this._rotate = a);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.rotate3d = function (x, y, z) {
    if (arguments.length === 0) {
        return {
            x: this._rotate3d[0],
            y: this._rotate3d[1],
            z: this._rotate3d[2]
        };
    } else {
        x !== undefined && x !== null && (this._rotate3d[0] = x);
        y !== undefined && y !== null && (this._rotate3d[1] = y);
        z !== undefined && z !== null && (this._rotate3d[2] = z);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.skew = function (x, y) {
    if (arguments.length === 0) {
        return {
            x: this._skew[0],
            y: this._skew[1]
        };
    } else {
        x !== undefined && x !== null && (this._skew[0] = x);
        y !== undefined && y !== null && (this._skew[1] = y);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.x = function (x) {
    if (arguments.length === 0) {
        return this._translate3d[0];
    } else {
        x !== undefined && x !== null && (this._translate3d[0] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.y = function (x) {
    if (arguments.length === 0) {
        return this._translate3d[1];
    } else {
        x !== undefined && x !== null && (this._translate3d[1] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.z = function (x) {
    if (arguments.length === 0) {
        return this._translate3d[2];
    } else {
        x !== undefined && x !== null && (this._translate3d[2] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.scaleX = function (x) {
    if (arguments.length === 0) {
        return this._scale3d[0];
    } else {
        x !== undefined && x !== null && (this._scale3d[0] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.scaleY = function (x) {
    if (arguments.length === 0) {
        return this._scale3d[1];
    } else {
        x !== undefined && x !== null && (this._scale3d[1] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.scaleZ = function (x) {
    if (arguments.length === 0) {
        return this._scale3d[2];
    } else {
        x !== undefined && x !== null && (this._scale3d[2] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.rotateX = function (x) {
    if (arguments.length === 0) {
        return this._rotate3d[0];
    } else {
        x !== undefined && x !== null && (this._rotate3d[0] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.rotateY = function (x) {
    if (arguments.length === 0) {
        return this._rotate3d[1];
    } else {
        x !== undefined && x !== null && (this._rotate3d[1] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.rotateZ = function (x) {
    if (arguments.length === 0) {
        return this._rotate3d[2];
    } else {
        x !== undefined && x !== null && (this._rotate3d[2] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.skewX = function (x) {
    if (arguments.length === 0) {
        return this._skew[0];
    } else {
        x !== undefined && x !== null && (this._skew[0] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.skewY = function (x) {
    if (arguments.length === 0) {
        return this._skew[1];
    } else {
        x !== undefined && x !== null && (this._skew[1] = x);
        transform.set.call(this);
        return this;
    }
};
transform2.prototype.origin = function (a) {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "transform-origin");
    } else {
        this.dom.css(prefix.prefix + "transform-origin", a);
        return this;
    }
};
transform2.prototype.style = function (a) {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "transform-sttle");
    } else {
        this.dom.css(prefix.prefix + "transform-style", a);
        return this;
    }
};
transform2.prototype.perspective = function (a) {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "perspective");
    } else {
        this.dom.css(prefix.prefix + "perspective", a);
        return this;
    }
};
transform2.prototype.perOrigin = function () {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "perspective-origin");
    } else {
        this.dom.css(prefix.prefix + "perspective-origin", a);
        return this;
    }
};
transform2.prototype.backface = function () {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "backface-visibility");
    } else {
        this.dom.css(prefix.prefix + "backface-visibility", a);
        return this;
    }
};
transform2.prototype.clean = function () {
    for (var i in this) {
        this[i] = null;
    }
};
transform2.prototype.dom = function () {
    return this.dom;
};

var transform = function (dom, attrs) {
    this.dom = dom;
    this.attrs = attrs.length === 0 ? ["translate"] : attrs;
    transform.init.call(this);
    transform.defaultValue.call(this);
    dom.data("_transform_", this);
};
transform.parse = function () {
    var matrix = this.dom.css(prefix.prefix + "transform");
    var a = matrix.match(/(-?[0-9\.]+)/g);
    if (a) {
        if (a.length > 6) {
            a.shift();
        }
        for (var i = 0; i < a.length; i++) {
            a[i] = a[i] / 1;
        }
    }
    return a;
};
transform.defaultValue = function () {
    var trans = {translate: [0, 0],translate3d: [0, 0, 0],translateX: 0,translateY: 0,translateZ: 0,rotate: 0,rotateX: 0,rotateY: 0,rotateZ: 0,rotate3d: [0, 0, 0, 1],scale: [1, 1],scaleX: 1,scaleY: 1,scaleZ: 1,scale3d: [1, 1, 1],skew: [0, 0],skewX: 0,skewY: 0};
    var ap = transform.parse.call(this);
    if (ap) {
        if (ap[0] !== 1) {
            var a = this.dom.get(0), transformstr = a.style.webkitTransform || a.style.mozTransform || a.style.msTransform || a.style.transform;
            if (transformstr || transformstr === "") {
                var sheets = document.styleSheets;
                a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector;
                for (var i in sheets) {
                    var rules = sheets[i].rules || sheets[i].cssRules;
                    for (var r in rules) {
                        if (a.matches(rules[r].selectorText)) {
                            transformstr = rules[r].style.webkitTransform || rules[r].style.mozTransform || rules[r].style.msTransform || rules[r].style.transform;
                        }
                    }
                }
            }
            if (transformstr && transformstr !== "") {
                var names = [], values = [], name = "", value = "", isname = true;
                for (var i = 0; i < transformstr.length; i++) {
                    var c = transformstr[i];
                    if (c !== "(" && c !== ")") {
                        if (isname) {
                            name += c;
                        } else {
                            value += c;
                        }
                    } else if (c === "(") {
                        names.push(name.trim());
                        name = "";
                        isname = false;
                    } else if (c === ")") {
                        values.push(value.trim());
                        value = "";
                        isname = true;
                    }
                }
                for (var i = 0; i < names.length; i++) {
                    var val = "";
                    if (values[i].indexOf(",") !== -1) {
                        var p = values[i].split(",");
                        for (var k = 0; k < p.length; k++) {
                            p[k] = parseFloat(p[k]);
                        }
                        val = p;
                    } else {
                        val = parseFloat(values[i]);
                    }
                    trans[names[i]] = val;
                }
            }
        }
        if (ap.length === 6) {
            trans.translate3d = [ap[4], ap[5], 0];
            trans.translateX = ap[4];
            trans.translateY = ap[5];
        } else {
            trans.translate3d = [ap[12], ap[13], ap[14]];
            trans.translateX = ap[12];
            trans.translateY = ap[13];
            trans.translateZ = ap[14];
        }
    }
    this.values = trans;
};
transform.init = function () {
    this.setter = [];
    this.attrs.indexOf("translate") !== -1 && this.setter.push(function () {
        return "translate3d(" + (is.isNumber(this.values.translate3d[0]) ? this.values.translate3d[0] + "px" : this.values.translate3d[0]) + "," +
                (is.isNumber(this.values.translate3d[1]) ? this.values.translate3d[1] + "px" : this.values.translate3d[1]) + "," +
                (is.isNumber(this.values.translate3d[2]) ? this.values.translate3d[2] + "px" : this.values.translate3d[2]) + ")";
    });
    this.attrs.indexOf("rotate3d") !== -1 && this.setter.push(function () {
        var rotate3d = this.values.rotate3d.join("") !== "0000" ? "rotate3d(" + this.values.rotate3d[0] + "," + this.values.rotate3d[1] + "," + this.values.rotate3d[2] + "," + this.values.rotate3d[3] + "deg)" : "";
        rotate3d += (this.values.rotateX !== 0 ? " rotateX(" + this.values.rotateX + "deg)" : "");
        rotate3d += (this.values.rotateY !== 0 ? " rotateY(" + this.values.rotateY + "deg)" : "");
        rotate3d += (this.values.rotateZ !== 0 ? " rotateZ(" + this.values.rotateZ + "deg)" : "");
        return rotate3d;
    });
    this.attrs.indexOf("scale3d") !== -1 && this.setter.push(function () {
        var scale3d = this.values.scale3d.join("") !== "111" ? "scale3d(" + this.values.scale3d[0] + "," + this.values.scale3d[1] + "," + this.values.scale3d[2] + ")" : "";
        scale3d += this.values.scaleX !== 1 ? " scaleX(" + this.values.scaleX + ")" : "";
        scale3d += this.values.scaleY !== 1 ? " scaleY(" + this.values.scaleY + ")" : "";
        scale3d += this.values.scaleZ !== 1 ? " scaleZ(" + this.values.scaleZ + ")" : "";
        return scale3d;
    });
    this.attrs.indexOf("scale") !== -1 && this.setter.push(function () {
        return this.values.scale.join("") !== "11" ? "scale(" + this.values.scale[0] + "," + this.values.scale[1] + ")" : "";
    });
    this.attrs.indexOf("skew") !== -1 && this.setter.push(function () {
        return this.values.skew.join("") !== "00" ? "skew(" + this.values.skew[0] + "deg," + this.values.skew[1] + "deg)" : "";
    });
    this.attrs.indexOf("rotate") !== -1 && this.setter.push(function () {
        return this.values.rotate !== 0 ? "rotate(" + this.values.rotate + "deg)" : "";
    });
};
transform.set = function () {
    var str = "";
    for (var i in this.setter) {
        str += this.setter[i].call(this) + " ";
    }
    console.log(str);
    this.dom.css(prefix.prefix + "transform", str);
};
transform.translate = function (index, name, x) {
    if (arguments.length === 2) {
        var n = this.values.translate3d[index];
        if (/^[0-9\.]*$/.test(n)) {
            var ap = transform.parse.call(this);
            if (ap.length === 6) {
                this.values.translate3d = [ap[4], ap[5], 0];
                this.values.translateX = ap[4];
                this.values.translateY = ap[5];
            } else {
                this.values.translate3d = [ap[12], ap[13], ap[14]];
                this.values.translateX = ap[12];
                this.values.translateY = ap[13];
                this.values.translateZ = ap[14];
            }
        }
        return this.values.translate3d[index];
    } else {
        this.values.translate3d[index] = x;
        this.values.translate[index] = x;
        this.values[name] = x;
        transform.set.call(this);
        return this;
    }
};
transform.sett = function (type, defaultValue, value) {
    if (arguments.length === 2) {
        return this.values[type];
    } else {
        (value === undefined || value === null) && (value = defaultValue);
        this.values[type] = value;
        transform.set.call(this);
        return this;
    }
};
transform.prototype.matrix = function () {
    return transform.parse.call(this);
};
transform.prototype.sets = function (a) {
    for (var i in a) {
        if (this.values[i] !== undefined) {
            this.values[i] = a[i];
        }
    }
    transform.set.call(this);
    return this;
};
transform.prototype.scale = function (x, y) {
    if (arguments.length === 0) {
        return this.values.scale;
    } else {
        (x === undefined || x === null) && (x = 1), (y === undefined || y === null) && (y = 1);
        this.values.scale[0] = x;
        this.values.scale[1] = y;
        transform.set.call(this);
        return this;
    }
};
transform.prototype.rotate = function (reg) {
    if (arguments.length === 0) {
        return this.values.rotate;
    } else {
        (reg === undefined || reg === null) && (reg = 0);
        this.values.rotate = reg;
        transform.set.call(this);
        return this;
    }
};
transform.prototype.scale3d = function (x, y, z) {
    if (arguments.length === 0) {
        return this.values.scale3d;
    } else {
        (x === undefined || x === null) && (x = 1), (y === undefined || y === null) && (y = 1), (z === undefined || z === null) && (z = 1);
        this.values.scale3d[0] = x;
        this.values.scale3d[1] = y;
        this.values.scale3d[2] = z;
        transform.set.call(this);
        return this;
    }
};
transform.prototype.rotate3d = function (x, y, z, reg) {
    if (arguments.length === 0) {
        return this.values.rotate3d;
    } else {
        (x === undefined || x === null) && (x = 0), (y === undefined || y === null) && (y = 0), (z === undefined || z === null) && (z = 0), (reg === undefined || reg === null) && (reg = 0);
        this.values.rotate3d[0] = x;
        this.values.rotate3d[1] = y;
        this.values.rotate3d[2] = z;
        this.values.rotate3d[3] = reg;
        transform.set.call(this);
        return this;
    }
};
transform.prototype.skew = function (x, y) {
    if (arguments.length === 0) {
        return this.values.skew;
    } else {
        (x === undefined || x === null) && (x = 1), (y === undefined || y === null) && (y = 1);
        this.values.skew[0] = x;
        this.values.skew[1] = y;
        transform.set.call(this);
        return this;
    }
};
transform.prototype.x = function (x) {
    return transform.translate.apply(this, arguments.length === 0 ? [0, "translateX"] : [0, "translateX", x]);
};
transform.prototype.y = function (x) {
    return transform.translate.apply(this, arguments.length === 0 ? [1, "translateY"] : [1, "translateY", x]);
};
transform.prototype.z = function (x) {
    return transform.translate.apply(this, arguments.length === 0 ? [2, "translateZ"] : [2, "translateZ", x]);
};
transform.prototype.scaleX = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["scaleX", 1, x] : ["scaleX", 1, x]);
};
transform.prototype.scaleY = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["scaleY", 1, x] : ["scaleY", 1, x]);
};
transform.prototype.scaleZ = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["scaleZ", 1, x] : ["scaleZ", 1, x]);
};
transform.prototype.rotateX = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["rotateX", 0, x] : ["rotateX", 0, x]);
};
transform.prototype.rotateY = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["rotateY", 0, x] : ["rotateY", 0, x]);
};
transform.prototype.rotateZ = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["rotateZ", 0, x] : ["rotateZ", 0, x]);
};
transform.prototype.skewX = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["skewX", 0, x] : ["skewX", 0, x]);
};
transform.prototype.skewY = function (x) {
    return transform.sett.apply(this, arguments.length === 0 ? ["skewY", 0, x] : ["skewY", 0, x]);
};
transform.prototype.origin = function (a, b) {
    if (arguments.length === 0) {
        var a = this.dom.css(prefix.prefix + "transform-origin").split(" ");
        return {x: a[0], y: a[1]};
    } else if (arguments.length === 2) {
        return this.dom.css(prefix.prefix + "transform-origin", a + " " + b);
    }
};
transform.prototype.style = function (a) {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "transform-style");
    } else {
        this.dom.css(prefix.prefix + "transform-style", a);
        return this;
    }
};
transform.prototype.perspective = function (a) {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "perspective");
    } else {
        this.dom.css(prefix.prefix + "perspective", a);
        return this;
    }
};
transform.prototype.perspectiveOrigin = function () {
    if (arguments.length === 0) {
        var a = this.dom.css(prefix.prefix + "perspective-origin").split(" ");
        return {x: a[0], y: a[1]};
    } else if (arguments.length === 2) {
        return this.dom.css(prefix.prefix + "perspective-origin", a + " " + b);
    }
};
transform.prototype.backface = function () {
    if (arguments.length === 0) {
        return this.dom.css(prefix.prefix + "backface-visibility");
    } else {
        this.dom.css(prefix.prefix + "backface-visibility", a);
        return this;
    }
};
transform.prototype.clean = function () {
    for (var i in this) {
        this[i] = null;
    }
};
transform.prototype.dom = function () {
    return this.dom;
};
$.fn.transform = function (attrs) {
    var a = this.data("_transform_");
    if (!a) {
        a = new transform(this, Array.prototype.slice.call(arguments));
    }
    return a;
};