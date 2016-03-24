var bright = function (start) {
    return new dom(start);
};
var browser = (function () {
    var map = {
        kenel: [{n: "webkit", g: /applewebkit\/([\d.]+)/}, {n: "gecko", g: /gecko\/([\d.]+)/}, {n: "trident", g: /trident\/([\d.]+)/}, {n: "edge", g: /edge\/([\d.]+)/}],
        info: [{n: "chrome", g: /chrome\/([\d.]+)/}, {n: "mozilla", g: /mozilla\/([\d.]+)/}, {n: "firefox", g: /firefox\/([\d.]+)/}, {n: "msie", g: /msie ([\d.]+)/}, {n: "opera", g: /opera\/([\d.]+)/}, {n: "safari", g: /safari\/([\d.]+)/}, {n: "blackberry", g: /blackberry ([\d.]+)/}, {n: "blackberry", g: /edge ([\d.]+)/}],
        os: [{n: "windows", g: /windows ([a-z\d. ]+)/}, {n: "osx", g: /mac os x ([a-z\d. ]+)/}, {n: "ios", g: /os ([a-z\d. _]+)/}, {n: "linux", g: /linux ([a-z\d. _]+)/}, {n: "linux", g: /linux/}, {n: "blackberry", g: /blackberry ([a-z\d. ]+)/}, {n: "blackberry", g: /bb[0-9]+/}, {n: "windowsphone", g: /windows phone/}],
        mobile: [{n: "android", g: /android ([\d.]+)/}, {n: "iphone", g: /iphone/}, {n: "ipad", g: /ipad/}, {n: "blackberry", g: /bb[0-9]+/}, {n: "blackberry", g: /blackberry/}, {n: "windowsphone", g: /iemobile/}]
    }, ua = window.navigator.userAgent.toLowerCase(), c = {};
    for (var i in map) {
        var has = false;
        for (var t in map[i]) {
            var a = map[i][t], b = ua.match(a.g);
            if (b) {
                var v = b[0].match(/[0-9._]+/);
                c[i] = {
                    name: a.n,
                    version: v ? v[0] : "unknow"
                };
                has = true;
                break;
            }
        }
        if (!has) {
            c[i] = {
                name: "unknow",
                version: "unknow"
            };
        }
    }
    if (c.kenel && c.kenel.name === "trident" && c.kenel.version === "7.0") {
        c.info = {name: "msie", version: "11"};
    }
    c.name = function () {
        return c.info.name;
    };
    c.version = function () {
        return c.info.verison;
    };
    c.isMobile = function () {
        return this.mobile.name !== "unknow";
    };
    c.isAndroid = function (version) {
        if (arguments.length === 0) {
            return this.mobile.name === "android";
        } else {
            return this.mobile.name === "android" && parseInt(this.mobile.version) === parseInt(version);
        }
    };
    c.isIos = function (version) {
        if (arguments.length === 0) {
            return this.mobile.name === "iphone" || this.mobile.name === "ipad";
        } else {
            return (this.mobile.name === "iphone" || this.mobile.name === "ipad") && parseInt(this.mobile.version) === parseInt(version);
        }
    };
    c.isWebkit = function (version) {
        if (arguments.length === 0) {
            return this.kenel.name === "webkit";
        } else {
            return this.kenel.name === "webkit" && parseInt(this.kenel.version) === parseInt(version);
        }
    };
    c.isGecko = function (version) {
        if (arguments.length === 0) {
            return this.kenel.name === "gecko";
        } else {
            return this.kenel.name === "gecko" && parseInt(this.kenel.version) === parseInt(version);
        }
    };
    c.isTrident = function () {
        return this.kenel.name === "trident";
    };
    c.isEdge = function () {
        return this.kenel.name === "edge";
    };
    c.isIe = function (version) {
        if (arguments.length === 0) {
            return this.info.name === "msie";
        } else {
            return this.info.name === "msie" && parseInt(this.info.version) === parseInt(version);
        }
    };
    c.isSupport = function () {
        return this.kenel.name === "webkit" || this.kenel.name === "gecko" || (this.kenel.name === "trident" && this.kenel.version / 1 >= 6);
    };
    return c;
})();
var is = {
    isFunction: function (obj) {
        return (typeof obj === 'function') && obj.constructor === Function;
    },
    isEmptyObject: function (obj) {
        for (var a in obj) {
            return false;
        }
        return true;
    },
    isUndefined: function (obj) {
        return obj === undefined;
    },
    isWindow: function (obj) {
        return obj !== undefined && obj !== null && obj === obj.window;
    },
    isDocument: function (obj) {
        return obj !== null && obj.nodeType === obj.DOCUMENT_NODE;
    },
    isObject: function (obj) {
        return  typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
    },
    isString: function (obj) {
        return (typeof obj === 'string') && obj.constructor === String;
    },
    isNumber: function (obj) {
        return typeof obj === "number";
    },
    isNumeric: function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    },
    isAvalid: function (obj) {
        return obj !== null && obj !== undefined;
    },
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    isQueryString: function (str) {
        return is.isString(str) && /(^|&).*=([^&]*)(&|$)/.test(str);
    },
    isElement: function (e) {
        return e && e.nodeType === 1 && e.nodeName;
    }
};
var serialize = {
    postData: function (obj) {
        if (obj) {
            if (obj instanceof FormData || obj instanceof Blob || obj instanceof ArrayBuffer) {
                return obj;
            } else if (is.isObject(obj)) {
                var has = false;
                for (var i in obj) {
                    if (obj[i] instanceof Blob || obj[i] instanceof ArrayBuffer || obj[i] instanceof File) {
                        has = true;
                        break;
                    }
                }
                if (has) {
                    var fd = new FormData();
                    for (var i in obj) {
                        if (obj[i] instanceof Blob) {
                            fd.append(i, obj[i]);
                        } else if (obj[i] instanceof File) {
                            fd.append(i, obj[i]);
                        } else if (is.isArray(obj[i]) || is.isObject(obj[i])) {
                            fd.append(i, window.encodeURIComponent(json.stringify(obj[i])));
                        } else if (obj[i] instanceof FormData) {
                        } else {
                            fd.append(i, window.encodeURIComponent(obj[i].toString()));
                        }
                    }
                    return fd;
                } else {
                    return serialize.queryString(obj);
                }
            } else if (is.isArray(obj)) {
                return window.encodeURIComponent(json.stringify({key: obj}));
            } else {
                return obj;
            }
        } else {
            return null;
        }
    },
    queryString: function (obj) {
        var result = "";
        if (obj) {
            for (var i in obj) {
                var val = obj[i];
                if (is.isString(val)) {
                    result += i + "=" + window.encodeURIComponent(val) + "&";
                } else if (is.isObject(val) || is.isArray(val)) {
                    result += i + "=" + window.encodeURIComponent(json.stringify(val)) + "&";
                } else if (val instanceof FormData || val instanceof Blob || val instanceof File || val instanceof ArrayBuffer) {
                } else {
                    result += i + "=" + (val !== undefined && val !== null ? window.encodeURIComponent(val.toString()) : "") + "&";
                }
            }
            return result.length > 0 ? result.substring(0, result.length - 1) : "";
        } else {
            return "";
        }
    },
    getURLInfo: function (str) {
        var a = str.indexOf("?"), b = str.indexOf("#"), querystring = "",
                hashstring = "", qo = null, ho = null, host = str, port = null, protocol = null;
        if (a !== -1 && b !== -1) {
            host = str.substring(0, a);
            if (a > b) {
                hashstring = str.substring(b + 1, a);
                querystring = str.substring(a + 1);
            } else {
                querystring = str.substring(a + 1, b);
                hashstring = str.substring(b + 1);
            }
        } else if (a !== -1) {
            querystring = str.substring(a + 1);
            host = str.substring(0, a);
        } else if (b !== -1) {
            hashstring = str.substring(b + 1);
            host = str.substring(0, b);
        }
        var _port = str.match(/:[0-9]+/g), _protocol = str.match(/[a-z]+:\/\//);
        port = _port ? _port[_port.length - 1].substring(1) : null;
        protocol = _protocol ? _protocol[0].substring(0, _protocol[0].length - 3) : null;
        if (protocol) {
            host = host.substring(protocol.length + 3);
        }
        if (port) {
            host = host.substring(0, host.length - port.length - 1);
        }
        var _host = host.substring(0, host.indexOf("/"));
        host = _host === "" ? host : _host;
        if (querystring !== "") {
            qo = {};
            var c = querystring.split("&");
            for (var i = 0; i < c.length; i++) {
                var d = c[i].split("=");
                qo[d[0]] = d[1];
            }
        }
        if (hashstring !== "") {
            ho = {};
            var c = hashstring.split("&");
            for (var i = 0; i < c.length; i++) {
                var d = c[i].split("=");
                ho[d[0]] = d[1];
            }
        }
        return {
            query: qo,
            hash: ho,
            host: host,
            port: port,
            protocol: protocol
        };
    },
    queryObject: function (str) {
        return serialize.getURLInfo(str).query;
    },
    hashObject: function (str) {
        return serialize.getURLInfo(str).hash;
    }
};
var json = {
    parse: function (str) {
        return window.JSON.parse(str);
    },
    stringify: function (obj) {
        return window.JSON.stringify(obj);
    },
    each: function (object, fn) {
        var name, i = 0, length = object.length, isObj = length === undefined || is.isFunction(object);
        if (isObj) {
            for (name in object) {
                if (fn.call(object[ name ], name, object[ name ]) === false) {
                    break;
                }
            }
        } else {
            while (i < length) {
                if (fn.call(object[ i ], i, object[ i++ ]) === false) {
                    break;
                }
            }
        }
        return object;
    },
    clone: function (obj) {
        var a;
        if (is.isArray(obj)) {
            a = [];
            for (var i = 0; i < obj.length; i++) {
                a[i] = json.clone(obj[i]);
            }
            return a;
        } else if (is.isObject(obj)) {
            a = {};
            for (var i in obj) {
                a[i] = json.clone(obj[i]);
            }
            return a;
        } else {
            return obj;
        }
    },
    cover: function () {
        var obj, key, val, vals, arrayis, clone, result = arguments[0] || {}, i = 1, length = arguments.length, isdeep = false;
        if (typeof result === "boolean") {
            isdeep = result;
            result = arguments[1] || {};
            i = 2;
        }
        if (typeof result !== "object" && !is.isFunction(result)) {
            result = {};
        }
        if (length === i) {
            result = this;
            i = i - 1;
        }
        while (i < length) {
            obj = arguments[i];
            if (obj !== null) {
                for (key in obj) {
                    val = result[key];
                    vals = obj[key];
                    if (result === vals) {
                        continue;
                    }
                    arrayis = is.isArray(vals);
                    if (isdeep && vals && (is.isObject(vals) || arrayis)) {
                        if (arrayis) {
                            arrayis = false;
                            clone = val && is.isArray(val) ? val : [];
                        } else {
                            clone = val && is.isObject(val) ? val : {};
                        }
                        result[key] = json.cover(isdeep, clone, vals);
                    } else if (vals !== undefined) {
                        result[key] = vals;
                    }
                }
            }
            i++;
        }
        return result;
    }
};
var prefix = (function () {
    var c = {};
    if (browser.isWebkit()) {
        c.prefix = "-webkit-";
        c.transitionEnd = "webkitTransitionEnd";
    } else if (browser.isGecko() === "gecko") {
        c.prefix = "-moz-";
        c.transitionEnd = "transitionend";
    } else {
        c.prefix = "";
        c.transitionEnd = "transitionend";
    }
    c.fix = function (cssset) {
        var prefix = /^-all-/;
        if (is.isString(cssset)) {
            return cssset.replace(prefix, this.prefix);
        } else if (is.isArray(cssset)) {
            var a = [];
            for (var i = 0; i < cssset.length; i++) {
                a.push(cssset[i].replace(prefix, this.prefix));
            }
            return a;
        } else if (is.isObject(cssset)) {
            var result = {};
            for (var i in cssset) {
                result[i.replace(prefix, this.prefix)] = is.isString(cssset[i]) ? cssset[i].replace(prefix, this.prefix) : cssset[i];
            }
            return result;
        } else {
            return cssset;
        }
    };
    return c;
})();
var util = {
    uuid: function () {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = new Array(36), rnd = 0, r;
        for (var i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid[i] = '-';
            } else if (i === 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02)
                    rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    },
    getDatasetName: function (a) {
        var n = "";
        for (var i = 0; i < a.length; i++) {
            if (/^[A-Z]+$/.test(a.charAt(i))) {
                n += "-" + a.charAt(i).toLowerCase();
            } else {
                n += a.charAt(i);
            }
        }
        return "data-" + n;
    },
    getDatasetReserve: function (a) {
        return a.substring(4).replace(/-[a-zA-Z]{1}/g, function (a) {
            return a[1].toUpperCase();
        });
    }
};
bright.json = json, bright.is = is, bright.browser = browser, bright.prefix = prefix, bright.util = util;
bright.serialize = serialize, bright.extend = bright.json.cover, bright.nfn = function () {};


var adapt = function () {
};
adapt.isSuper = /this.superClass\(.*?\);/g;
adapt.superInvoke = function (ths, adaptName, propName, argus) {
    if (ths.__superinvoke__ && !ths.__superinvoke__[adaptName + propName]) {
        ths.__superinvoke__[adaptName + propName] = 1;
        return adapt.superInvoke(ths, ths.__superinvoke__.current, propName, argus);
    }
    if (!ths.__superinvoke__) {
        ths.__superinvoke__ = {};
    }
    if (!ths.__superinvoke__[adaptName + propName] || ths.__superinvoke__[adaptName + propName] === 1) {
        ths.__superinvoke__[adaptName + propName] = {};
    }
    if (!ths.__superinvoke__[adaptName + propName].calling) {
        var a = Object.getPrototypeOf(ths), prot = null;
        if (adaptName) {
            while (a) {
                if (a.__info__.name === adaptName) {
                    prot = a;
                    break;
                } else {
                    a = Object.getPrototypeOf(a);
                }
            }
        } else {
            prop = ths;
        }
        if (prot) {
            ths.__superinvoke__[adaptName + propName].returns = [];
            ths.__superinvoke__[adaptName + propName].propName = propName;
            ths.__superinvoke__[adaptName + propName].current = "";
            var fns = [], protos = [];
            while (prot) {
                var p = prot[propName].toString().match(adapt.isSuper);
                if (p && p.length > 0) {
                    for (var i = 0; i < p.length; i++) {
                        var t = p[i].substring(16, p[i].length - 2);
                        var fnname = t.split(",").shift();
                        fnname = fnname.substring(1, fnname.length - 1);
                        if (fnname === propName) {
                            fns.push(prot[propName]);
                            protos.push(prot.__info__.name);
                        }
                    }
                    prot = Object.getPrototypeOf(prot);
                } else {
                    fns.push(prot[propName]);
                    protos.push(prot.__info__.name);
                    break;
                }
            }
            if (fns.length > 1) {
                fns.shift();
                fns.reverse();
                protos.shift();
                protos.reverse();
            }
            var m = null;
            ths.__superinvoke__[adaptName + propName].calling = true;
            for (var i = 0; i < fns.length; i++) {
                ths.__superinvoke__.current = protos[i];
                var x = fns[i].apply(ths, argus);
                ths.__superinvoke__[adaptName + propName].returns.push(x);
                m = x;
            }
            ths.__superinvoke__[adaptName + propName].calling = false;
            ths.__superinvoke__[adaptName + propName].returns = [];
            ths.__superinvoke__[adaptName + propName] = null;
            var re = true;
            for (var i in ths.__superinvoke__) {
                if (i !== "current") {
                    if (ths.__superinvoke__[i] !== null && ths.__superinvoke__[i] !== 1) {
                        re = false;
                    }
                }
            }
            if (re) {
                ths.__superinvoke__ = null;
            }
            return m;
        } else {
            return null;
        }
    } else {
        return ths.__superinvoke__[adaptName + propName].returns.shift();
    }
};
Object.defineProperty(adapt.prototype, "__info__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: {
        name: "adapt",
        short: "adapt",
        interface: null,
        super: null,
        packet: null,
        types: ["adapt"]
    }
});
adapt.prototype.option = {};
adapt.prototype.privator = function () {
    var t = Array.prototype.slice.call(arguments);
    var name = t.shift();
    if (bright.is.isFunction(this["_" + name])) {
        return this["_" + name].apply(this, t);
    } else {
        return this["_" + name];
    }
};
adapt.prototype.staticor = function () {
    var t = Array.prototype.slice.call(arguments);
    var name = t.shift();
    if (bright.is.isFunction(this["__" + name])) {
        return this["__" + name].apply(this, t);
    } else {
        return this["__" + name];
    }
};
adapt.prototype.type = function () {
    return this["__info__"].name;
};
adapt.prototype.shortName = function () {
    return this["__info__"].short;
};
adapt.prototype.packet = function () {
    return this["__info__"].packet;
};
adapt.prototype.typeOf = function (type) {
    var t = this, has = false;
    while (t["__info__"]) {
        var a = t["__info__"];
        if (a.types.indexOf(type) !== -1) {
            has = true;
            break;
        } else {
            t = Object.getPrototypeOf(t);
        }
    }
    return has;
};
adapt.prototype.extendsOf = function (type) {
    var t = this, has = false;
    while (t["__info__"]) {
        if (t["__info__"].name === type) {
            has = true;
            break;
        } else {
            t = Object.getPrototypeOf(t);
        }
    }
    return has;
};
adapt.prototype.clean = function () {
    for (var i in this) {
        this[i] = null;
    }
};
adapt.prototype.superClass = function (propName) {
    var name = "";
    var keys = Object.keys(this);
    if (keys.indexOf(propName) === -1) {
        name = Object.getPrototypeOf(this).__info__.name;
    }
    var argus = Array.prototype.slice.call(arguments);
    argus.shift();
    return adapt.superInvoke(this, name, propName, argus);
};
var factory = function () {
    this._mapping = {
        "adapt": adapt
    };
};
factory.set = function (objn, obj) {
    for (var i in obj) {
        Object.defineProperty(objn, i, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: obj[i]
        });
    }
    return objn;
};
factory.prototype.def = function (obj) {
    if (!obj.extend) {
        obj.extend = ["adapt"];
    } else {
        if (bright.is.isString(obj.extend)) {
            obj.extend = [obj.extend];
        }
    }
    var b = new this._mapping[obj.extend[0]]();
    for (var i in obj) {
        if (i !== "name" && i !== "extend" && i !== "shortName" && i !== "packet") {
            b[i] = obj[i];
        }
    }
    if (!b.option) {
        b.option = {};
    }
    var r = Object.getPrototypeOf(b), ops = [b.option];
    while (r) {
        ops.push(r.option ? bright.json.clone(r.option) : {});
        r = Object.getPrototypeOf(r);
    }
    var ife = [], ex = [obj.name];
    if (obj.extend.length > 1) {
        ex.push(obj.extend.shift());
        for (var i = 0; i < obj.extend.length; i++) {
            var t = obj.extend[i];
            var q = this._mapping[t];
            if (q) {
                ife.push(t);
                var m = Object.keys(q.prototype);
                for (var k = 0; k < m.length; k++) {
                    var opn = m[k];
                    if (opn !== "option" && opn !== "init") {
                        b[opn] = q.prototype[opn];
                    }
                }
                ops.push(bright.json.clone(q.prototype.option));
            }
        }
    }
    bright.extend.apply({}, ops);
    if (!b.init) {
        b.init = function () {};
    }
    var pp = ex.concat(obj.extend);
    if (this._mapping[obj.extend[0]].prototype.__info__) {
        for (var i in this._mapping[obj.extend[0]].prototype.__info__.types) {
            var t = this._mapping[obj.extend[0]].prototype.__info__.types[i];
            if (pp.indexOf(t) === -1) {
                pp.push(t);
            }
        }
    }
    factory.set(b, {"__info__": factory.set({}, {
            name: (obj.packet ? obj.packet + "." + obj.name : obj.name),
            short: obj.name || "",
            packet: obj.packet || "",
            interface: ife,
            super: ex.join(""),
            types: pp
        })});
    var adapt = function () {};
    adapt.prototype = b;
    this._mapping[obj.name] = adapt;
};
factory.prototype.get = function (name) {
    return this._mapping[name];
};
factory.prototype.create = function (type, option) {
    var a = this.instance(type, option);
    if (a) {
        a.init();
    }
    return a;
};
factory.prototype.instance = function (type, option) {
    var obj = null, name = type;
    var clazz = this._mapping[name];
    if (clazz) {
        obj = new clazz();
        obj.option = bright.extend(bright.json.clone(clazz.prototype.option), option);
    }
    return obj;
};
factory.prototype.invoke = function (clazzName, methodName, scope) {
    var a = null;
    if (is.isString(clazzName)) {
        var j = this._mapping[clazzName];
        j && (a = new j());
    } else if (is.isObject(clazzName)) {
        a = clazzName;
    }
    if (a && a[methodName]) {
        if (is.isFunction(a[methodName]) && is.isObject(scope)) {
            var paras = Array.prototype.slice.call(arguments), keys = Object.keys(scope), obj = a;
            paras.splice(0, 3);
            for (var i = 0; i < keys.length; i++) {
                obj[keys[i]] = scope[keys[i]];
            }
            try {
                var r = obj[methodName].apply(obj, paras), n = Object.keys(obj);
                for (var i = 0; i < n.length; i++) {
                    scope[n[i]] = obj[n[i]];
                }
                return r;
            } catch (e) {
                console.error(e.message);
                return null;
            }
        }
    }
    return null;
};
factory.prototype.has = function (clazzType) {
    return this._mapping[clazzType] !== undefined;
};


var f = new factory();
f.def({
    name: "c",
    option: {
        i: "i"
    },
    init: function () {
        console.log("---->[1]c--->");
        return "c";
    },
    test: function () {
        return "outest";
    },
    i1: function () {
        console.log(this);
    },
    i2: function () {}
});
f.def({
    name: "b",
    extend: "c",
    option: {
        i: "i"
    },
    init: function () {
        var r = this.superClass("init");
        console.log("---->[2]b--->" + r);
        console.log(this.superClass("test"));
        return "b";
    },
    i1: function () {
        console.log(this);
    },
    i2: function () {}
});
f.def({
    name: "a",
    option: {
        i: "i"
    },
    extend: "b",
    init: function () {
        var r = this.superClass("init");
        console.log("---->[3]a--->" + r);
        return "a";
    },
    i1: function () {
        console.log(this);
    },
    i2: function () {}
});
f.def({
    name: "interface",
    extend: "a",
    option: {
        i: "i"
    },
    init: function () {
        var r = this.superClass("init");
        console.log("---->[4]interface--->" + r);
        return "interface";
    },
    test: function () {
        return "interfacetest";
    },
    test2: function () {
        return "test2";
    },
    i1: function () {
        console.log(this);
    },
    i2: function () {}
});
f.def({
    name: "test",
    extend: "interface",
    option: {
        test: "test"
    },
    init: function () {
        var r = this.superClass("init");
        console.log("---->[5]test--->" + r);
        return "test";
    },
    test: function () {
        return this.superClass("test");
    },
    test2: function () {
        return this.superClass("test2");
    },
    f1: function () {
        console.log(this);
        this.superClass("i1");
    },
    f2: function () {}
});
f.def({
    name: "test2",
    extend: "test",
    option: {
        test2: "test2"
    },
    init: function () {
        console.log(this.type());
        this.superClass("init");
    },
    ff1: function () {
        this.superClass("f1");
    },
    ff2: function () {}
});
f.def({
    name: "mt",
    extend: "test2",
    option: {
        mt: "mt"
    },
    init: function () {
        console.log(this.type());
        this.superClass("init");
    },
    mt1: function () {},
    mt2: function () {}
});
f.def({
    name: "test3",
    extend: ["test", "mt"],
    option: {
        test3: "test3"
    },
    init: function () {
        var r = this.superClass("init", "aa", "bb");
        console.log("---->[6]test3--->" + r);
        console.log(this.superClass("test2"));
        console.log(this);
        return "test3";
    },
    test31: function () {},
    test32: function () {}
});
window.f = f;

var a = f.create("test3", {
    override: {
        test31: function () {}
    }
});