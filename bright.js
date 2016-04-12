(function () {
    "use strict";
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

    var queue = function () {
        this.list = [];
        this.length = null;
        this.current = null;
        this.state = "init";//running,end,stop.
        this._start = null;
        this._progress = null;
        this._complete = null;
        this.result = null;
        this._scope = null;
    };
    queue.prototype.add = function (fn, error, parameter) {
        if (this.state === "init") {
            this.list.push({
                fn: fn,
                parameter: parameter,
                error: error || null
            });
        } else {
            throw Error("[bright]-this queue can not add task when it is not in state of init.");
        }
        return this;
    };
    queue.prototype.scope = function (a) {
        if (arguments.length === 0) {
            return this._scope;
        } else {
            this._scope = arguments[0];
            return this;
        }
    };
    queue.prototype.next = function (data) {
        this._progress && this._progress.call(this, {
            total: this.length,
            runed: this.length - this.list.length,
            data: data
        });
        queue._fire.call(this, data);
        return this;
    };
    queue.prototype.left = function () {
        return this.list.length;
    };
    queue.prototype.total = function () {
        return this.length;
    };
    queue.prototype.run = function (data) {
        if (this.length === null) {
            this._start && this._start.call(this);
            this.length = this.list.length;
        }
        this.state = 'running';
        queue._fire.call(this, data);
    };
    queue.prototype.stop = function () {
        if (this.state === "running") {
            this.state = "stop";
        }
        return this;
    };
    queue.prototype.reset = function () {
        this.length === null;
        this.state = "init";
        this.result = null;
        this._scope = null;
        return this;
    };
    queue.prototype.clean = function () {
        this.list.length = 0;
        this.state = "end";
        this.length = 0;
        this.reuslt = null;
        return this;
    };
    queue.prototype.isRunning = function () {
        return this.state === "running";
    };
    queue.prototype.isEnd = function () {
        return this.state === "end";
    };
    queue.prototype.isStop = function () {
        return this.state === "stop";
    };
    queue.prototype.start = function (fn) {
        fn && (this._start = fn);
        return this;
    };
    queue.prototype.progress = function (fn) {
        fn && (this._progress = fn);
        return this;
    };
    queue.prototype.complete = function (fn) {
        fn && (this._complete = fn);
        if (this.state === "end") {
            this._complete.call(this, this.result);
        }
        return this;
    };
    queue.prototype.end = function (a) {
        this.state = "end";
        this.result = a;
        this._complete.call(this, this.result);
        this.reset();
        return this;
    };
    queue._fire = function (result) {
        if (this.list.length > 0) {
            var a = this.list.shift(), ths = this;
            this.current = a;
            try {
                a.fn && a.fn.call(ths, result, a.parameter);
            } catch (e) {
                queue.error.call(this, result, e);
                this.next(result);
            }
        } else {
            this.state = 'end';
            this.result = result;
            this._complete && this._complete.call(this, result);
        }
        return this;
    };
    queue.error = function (result, e) {
        if (this.current) {
            this.current.error && this.current.error.call(this, result, e, this.current.parameter);
        }
    };
    bright.queue = function () {
        return new queue();
    };

    var dynamicQueue = function () {
        this.state = "waiting";//waiting,running
        this.__list__ = [];
        this.result = null;
        this.current = null;
        this._complete = null;
        this._notify = null;
        this.waits = 1;
        this._completeTimes = 0;
        this._handleTimes = 0;
    };
    dynamicQueue.prototype.add = function (fn, error, parameters) {
        this.__list__.push({
            fn: fn,
            error: error,
            parameters: parameters
        });
        if (this.state === "waiting") {
            if (this.__list__.length === this.waits) {
                dynamicQueue._fire.call(this, this.result);
            }
        }
        return this;
    };
    dynamicQueue.prototype.size = function () {
        return this.__list__.length;
    };
    dynamicQueue.prototype.wait = function (num) {
        if (arguments.length === 0 || num === 0) {
            num = 10000000;
        }
        this.waits = num;
        return this;
    };
    dynamicQueue.prototype.work = function (data) {
        if (this.state === "waiting") {
            this.waits = 1;
            dynamicQueue.next.call(this, data);
        }
        return this;
    };
    dynamicQueue.prototype.delay = function (time) {
        this.add(function (data) {
            var ths = this;
            setTimeout(function () {
                ths.next(data);
            }, time);
        });
        return this;
    };
    dynamicQueue.prototype.notify = function (fn) {
        fn && (this._notify = fn);
        return this;
    };
    dynamicQueue.prototype.complete = function (fn) {
        fn && (this._complete = fn);
        return this;
    };
    dynamicQueue.prototype.isRunning = function () {
        return this.state === "running";
    };
    dynamicQueue.prototype.isWaiting = function () {
        return this.state === "waiting";
    };
    dynamicQueue.prototype.isHandleAtOnce = function () {
        if (this.state === "running" && this.__list__.length > 0) {
            return false;
        } else {
            return true;
        }
    };
    dynamicQueue.prototype.completeTimes = function () {
        return this._completeTimes;
    };
    dynamicQueue.prototype.handleTimes = function () {
        return this._handleTimes;
    };
    dynamicQueue.prototype.clean = function () {
        this.__list__.length = 0;
        this.state = "waiting";
        for (var i in this) {
            this[i] = null;
        }
    };
    dynamicQueue.prototype.next = function (data) {
        dynamicQueue.next.call(this, data);
        return this;
    };
    dynamicQueue.prototype.error = function (e) {
        return dynamicQueue.error.call(this, e);
    };
    dynamicQueue.next = function (data) {
        this._notify && this._notify.call(this, data);
        dynamicQueue._fire.call(this, data);
        return this;
    };
    dynamicQueue.error = function (data) {
        if (this.current) {
            this.current.error && this.current.error(this, data);
        }
        return this;
    };
    dynamicQueue._fire = function (result) {
        if (this.__list__.length > 0) {
            this.state = 'running';
            this._handleTimes = this._handleTimes + 1;
            var a = this.__list__.shift(), ths = this;
            this.current = a;
            try {
                a.fn && a.fn.call(ths, result, a.parameters);
            } catch (e) {
                dynamicQueue.error.call(e);
                dynamicQueue.next.call(ths, result);
            }
        } else {
            if (this.state === 'running') {
                this.result = result;
                this.state = 'waiting';
                this._completeTimes = this._completeTimes + 1;
                this.current = null;
            }
            this._complete && this._complete.call(this, result);
        }
        return this;
    };
    bright.dynamicQueue = function () {
        return new dynamicQueue();
    };

    var promise = function (task) {
        this._state = 0;
        this._scope = {};
        this._queue = new queue();
        this._complete = null;
        this._finally = null;
        this._always = null;
        this._error = null;
        this._notify = null;
        this._finalerror = null;
        this._isfinalerror = false;
        var ths = this;
        this._queue.complete(function (r) {
            if (ths._state === 0) {
                ths._complete && ths._complete.call(ths._scope, r, ths._isfinalerror);
            }
            if (ths._state === 1) {
                ths._error && ths._error.call(ths._scope, r);
                var t = ths._parent;
                while (t) {
                    t._isfinalerror = true;
                    t = t._parent;
                }
            }
            ths._always && ths._always.call(ths._scope, r, this._state);
            ths._finally && ths._finally.call(ths._scope, r, this._state);
        });
        this._queue.progress(function (a) {
            ths._notify && ths._notify.call(ths._scope, a);
        });
        if (task) {
            setTimeout(function () {
                try {
                    task.call(ths._scope, function (a) {
                        ths._state = 0;
                        ths._queue.run(a);
                    }, function (a) {
                        ths._state = 1;
                        ths._queue.run(a);
                    });
                } catch (e) {
                    console.error(e.stack);
                    ths._state = 1;
                    ths._queue.end();
                }
            }, 0);
        }
    };
    promise.prototype.scope = function (scope) {
        if (arguments.length === 1) {
            this._scope = scope;
            return this;
        } else {
            return this._scope;
        }
    };
    promise.prototype.then = function (resolver, rejecter) {
        this.done(resolver);
        this.fail(rejecter);
        return this;
    };
    promise.prototype.wait = function (fn) {
        var ths = this;
        this.done(function (n) {
            if (fn) {
                fn && fn.call(ths._scope, n, function (a) {
                    ths.next(a);
                });
            } else {
                ths.next(n);
            }
        });
        return this;
    };
    promise.prototype.done = function (fnt) {
        var ths = this;
        this._queue.add(function (n, fn) {
            if (ths._state === 0) {
                if (fn) {
                    var a = fn.call(ths._scope, n);
                    if (a instanceof promise) {
                        a._parent = ths;
                        a._finally = function (r) {
                            ths._queue.next(r);
                        };
                    } else {
                        ths._queue.next(a);
                    }
                } else {
                    ths._queue.next(n);
                }
            } else {
                ths._queue.next(n);
            }
        }, function (a) {
            ths._state = 1;
            ths._queue.next(a);
        }, fnt);
        return this;
    };
    promise.prototype.fail = function (fnt) {
        var ths = this;
        this._queue.add(function (n, fn) {
            if (ths._state === 1) {
                if (fn) {
                    var a = fn.call(ths._scope, n);
                    if (a instanceof promise) {
                        a._parent = ths;
                        a._finally = function (r) {
                            ths._queue.next(r);
                        };
                    } else {
                        ths._queue.next(a);
                    }
                } else {
                    ths._queue.next(n);
                }
            } else {
                ths._queue.next(n);
            }
        }, function (a) {
            ths._state = 1;
            ths._queue.next(a);
        }, fnt);
        return this;
    };
    promise.prototype.always = function (fn) {
        is.isFunction(fn) && (this._always = fn);
        return this;
    };
    promise.prototype.reject = function (data) {
        setTimeout(function () {
            this._state = 1;
            this._queue.run(data);
        }.bind(this), 0);
        return this;
    };
    promise.prototype.resolve = function (data) {
        setTimeout(function () {
            this._state = 0;
            this._queue.run(data);
        }.bind(this), 0);
        return this;
    };
    promise.prototype.notify = function (fn) {
        is.isFunction(fn) && (this._notify = fn);
        return this;
    };
    promise.prototype.complete = function (fn) {
        is.isFunction(fn) && (this._complete = fn);
        return this;
    };
    promise.prototype.error = function (fn) {
        is.isFunction(fn) && (this._error = fn);
        return this;
    };
    promise.prototype.delay = function (time) {
        this.queue.delay(time);
        return this;
    };
    promise.prototype.isInError = function () {
        return this._finalerror;
    };
    promise.prototype.clean = function () {
        this.queue.clean();
        for (var i in this) {
            this[i] = null;
        }
    };
    bright.promise = function (fn) {
        return new promise(fn);
    };
    bright.all = function () {
        var ps = $.promise();
        if (arguments.length > 0) {
            var a = Array.prototype.slice.call(arguments);
            var total = a.length;
            for (var i = 0; i < a.length; i++) {
                a[i].complete(function () {
                    if (this.isResolve) {
                        total = total - 1;
                        if (total === 0) {
                            ps.resolve();
                        }
                    }
                });
            }
        }
        return ps;
    };
    bright.any = function () {
        var ps = $.promise();
        if (arguments.length > 0) {
            var a = Array.prototype.slice.call(arguments);
            var total = a.length, resolved = false;
            for (var i = 0; i < a.length; i++) {
                a[i].complete(function () {
                    total = total - 1;
                    if (this.isResolve) {
                        resolved = true;
                    }
                    if (total === 0 && resolved) {
                        ps.resolve();
                    }
                });
            }
        }
        return ps;
    };

    var dom = function (start) {
        this.nodes = [];
        this.length = 0;
        if (arguments.length === 1 && is.isAvalid(start)) {
            if (is.isString(start)) {
                if (dom.util.isHTML(start)) {
                    this.nodes = dom.util.parseHTML(start);
                } else {
                    this.nodes = dom.util.query(window.document, start);
                }
                this.length = this.nodes.length;
            } else if (start instanceof query) {
                this.nodes = start.nodes;
                this.length = start.length;
            } else if (is.isWindow(start) || is.isDocument(start)) {
                return new windoc(start);
            } else if (start.nodeType === 1) {
                this.nodes = [start];
                this.length = 1;
            } else {
                this.nodes = [];
                this.length = 0;
            }
        } else if (arguments.length === 0) {
            this.nodes = [];
            this.length = 0;
        }
    };
    dom.regs = {
        root: /^(?:body|html)$/i,
        _class: /^\.([\w-]+)$/,
        _id: /^#([\w-]*)$/,
        _tag: /^[\w-]+$/,
        _html: /^\s*<(\w+|!)[^>]*>/,
        _tagName: /<([\w:]+)/,
        _property: /-+(.)?/g
    };
    dom.util = {
        getDom: function (nodes) {
            var a = new dom();
            if (arguments.length === 1) {
                a.nodes = nodes;
                a.length = nodes.length;
            } else {
                a.nodes = [];
                a.length = 0;
            }
            return a;
        },
        isClass: function (selector) {
            return dom.regs._class.test(selector);
        },
        isId: function (selector) {
            return dom.regs._id.test(selector);
        },
        isTag: function (selector) {
            return dom.regs._tag.test(selector);
        },
        isHTML: function (selector) {
            return dom.regs._html.test(selector);
        },
        query: function (node, selector) {
            var ar = null;
            switch (true) {
                case this.isId(selector):
                    var _a = document.getElementById(selector.substring(1, selector.length));
                    ar = _a ? [_a] : [];
                    break;
                case this.isClass(selector):
                    var t = node.getElementsByClassName(selector.substring(1, selector.length));
                    ar = Array.prototype.slice.call(t);
                    break;
                case this.isTag(selector):
                    var t = node.getElementsByTagName(selector);
                    ar = Array.prototype.slice.call(t);
                    break;
                default :
                    ar = Array.prototype.slice.call(node.querySelectorAll(selector));
                    break;
            }
            return ar;
        },
        queryChild: function (node, selector) {
            var id = node.getAttribute("id") || "__bright__";
            node.setAttribute("id", id);
            var ar = dom.util.query(node, "#" + id + ">" + selector);
            if (id === "__bright__") {
                node.removeAttribute("id");
            }
            return ar;
        },
        repairTags: {
            area: {l: 1, s: "<map>", e: ""},
            param: {l: 1, s: "<object>", e: ""},
            col: {l: 2, s: "<table><tbody></tbody><colgroup>", e: "</table>"},
            legend: {l: 1, s: "<fieldset>"},
            option: {l: 1, s: "<select multiple='multiple'>", e: ""},
            thead: {l: 1, s: "<table>", e: "</table>"},
            tr: {l: 2, s: "<table><tbody>", e: ""},
            td: {l: 3, s: "<table><tbody><tr>", e: ""},
            _general: {s: "", e: "", l: 0}
        },
        parseHTML: function (html) {
            var a = html.match(dom.regs._tagName), ops = dom.util.repairTags[(a ? a[1] : "_general")] || dom.util.repairTags["_general"];
            var div = document.createElement("DIV");
            div.innerHTML = ops.s + html + ops.e;
            var t = div;
            for (var i = 0; i < ops.l; i++) {
                t = t.firstChild;
            }
            return Array.prototype.slice.call(t.childNodes);
        },
        parseFlagment: function (html) {
            var _c = dom.util.parseHTML(html);
            var a = window.document.createDocumentFragment();
            for (var i in _c) {
                a.appendChild(_c[i]);
            }
            return a;
        },
        propertyName: function (str) {
            return str.replace(dom.regs._property, function (match, chr, index) {
                if (index === 0) {
                    return match.substring(1, 2);
                } else {
                    return chr ? chr.toUpperCase() : "";
                }
            });
        },
        cleanNode: function (node) {
            if (node) {
                if (node.datasets) {
                    for (var t in node.datasets) {
                        var p = node.datasets[t];
                        if (p && p.clean) {
                            p.clean();
                        }
                        node.datasets[t] = null;
                    }
                    node.datasets = null;
                }
                event.util.unbindnode(node);
                var c = node.getElementsByClassName("incache");
                for (var n in c) {
                    if (c[n].nodeType) {
                        for (var m in c[n].datasets) {
                            var q = c[n].datasets[m];
                            if (q && q.clean) {
                                q.clean();
                            }
                            c[n].datasets[m] = null;
                        }
                        c[n].datasets = null;
                        event.util.unbindnode(c[n]);
                    }
                }
            }
        },
        supported: function (paras) {
            if (arguments.length === 1) {
                return is.isString(paras) || paras instanceof dom || is.isWindow(paras) || is.isDocument(paras) || paras.nodeType === 1;
            } else {
                return false;
            }
        }
    };

    var transition = function (dom) {
        this.dom = dom;
        this.mapping = {};
        transition.init.call(this);
        this.dom.get(0).addEventListener(prefix.transitionEnd, transition.fn, false);
        this.dom.data("_transition_", this);
    };
    transition.fn = function (e) {
        var obj = $(e.currentTarget).data("_transition_");
        var name = e.propertyName;
        if (obj.mapping[name]) {
            if (obj.mapping[name].promise) {
                obj.mapping[name].promise.resolve();
            }
        } else if (obj.mapping[prefix.prefix + name]) {
            if (obj.mapping[prefix.prefix + name].promise) {
                obj.mapping[prefix.prefix + name].promise.resolve();
            }
        } else if (obj.mapping["all"]) {
            if (obj.mapping["all"].promise) {
                obj.mapping["all"].promise.resolve();
            }
        }
    };
    transition.setCss = function () {
        var value = "";
        for (var i in this.mapping) {
            if (this.mapping[i]) {
                value += i + " " + this.mapping[i].time + "ms " + this.mapping[i].type + " " + this.mapping[i].delay + "ms,";
            }
        }
        if (value.length > 0) {
            value = value.substring(0, value.length - 1);
        } else {
            value = "none";
        }
        this.dom.css(prefix.prefix + "transition", value);
    };
    transition.init = function () {
        var type = this.dom.css("-all-transition-timing-function").split(",");
        var delay = this.dom.css("-all-transition-delay").split(",");
        var duration = this.dom.css("-all-transition-duration").split(",");
        var prop = this.dom.css("-all-transition-property").split(",");
        for (var i = 0; i < prop.length; i++) {
            if (prop[i] !== "all") {
                this.mapping[prop[i]] = {
                    property: prop[i],
                    time: parseFloat(duration[i]) * 1000,
                    type: type[i],
                    delay: parseFloat(delay[i]) * 1000,
                    fn: null
                };
            }
        }
    };
    transition.prototype.set = function (properties, option) {
        var ops = {time: 200, type: "ease-out", delay: 0};
        var k = new promise();
        k.scope(this.dom);
        bright.extend(ops, option);
        var a = prefix.fix(properties.split(","));
        for (var i = 0; i < a.length; i++) {
            var property = a[i];
            if (property !== "all") {
                this.mapping[property] = {property: property, time: ops.time, type: ops.type, delay: ops.delay, promise: k};
            } else {
                this.mapping = {all: {property: property, time: ops.time, type: ops.type, delay: ops.delay, promise: k}};
                break;
            }
        }
        transition.setCss.call(this);
        return k;
    };
    transition.prototype.all = function (option) {
        var ops = {time: 200, type: "ease-out", delay: 0};
        var k = new promise();
        k.scope(this.dom);
        bright.extend(ops, option);
        this.mapping = {all: {property: "all", time: ops.time, type: ops.type, delay: ops.delay, promise: k}};
        transition.setCss.call(this);
        return k;
    };
    transition.prototype.get = function (property) {
        var a = this.mapping[prefix.fix(property)];
        if (a) {
            return {
                type: a.type,
                time: a.time,
                delay: a.delay,
                property: property
            };
        }
        return a;
    };
    transition.prototype.remove = function (properties) {
        var a = prefix.fix(properties.split(","));
        for (var i = 0; i < a.length; i++) {
            this.mapping[a[i]] && (this.mapping[a[i]] = null);
        }
        transition.setCss.call(this);
        return this;
    };
    transition.prototype.removeAll = function () {
        this.mapping = {};
        transition.setCss.call(this);
        return this;
    };
    transition.prototype.scope = function () {
        return this.dom;
    };
    transition.prototype.clean = function () {
        this.dom.get(0).removeEventListener(prefix.transitionEnd, transition.fn, false);
        for (var i in this) {
            this[i] = null;
        }
    };

    var transform = function (dom) {
        this.dom = dom;
        this.attrs = [];
        this.setter = [];
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
        } else {
            a = [1, 0, 0, 1, 0, 0];
        }
        return a;
    };
    transform.defaultValue = function () {
        var trans = {translate: [0, 0], translate3d: [0, 0, 0], translateX: 0, translateY: 0, translateZ: 0, rotate: 0, rotateX: 0, rotateY: 0, rotateZ: 0, rotate3d: [0, 0, 0, 1], scale: [1, 1], scaleX: 1, scaleY: 1, scaleZ: 1, scale3d: [1, 1, 1], skew: [0, 0], skewX: 0, skewY: 0};
        var ap = transform.parse.call(this);
        if (ap) {
            if (ap[0] !== 1) {
                var a = this.dom.get(0), transformstr = a.style.webkitTransform || a.style.mozTransform || a.style.msTransform || a.style.transform;
                if (transformstr || transformstr === "") {
                    var sheets = document.styleSheets;
                    a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector;
                    for (var i = 0; i < sheets.length; i++) {
                        var rules = sheets[i].cssRules || sheets[i].rules;
                        for (var r = 0; r < rules.length; r++) {
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
    transform.watcher = {
        translate: function () {
            return "translate3d(" + (is.isNumber(this.values.translate3d[0]) ? this.values.translate3d[0] + "px" : this.values.translate3d[0]) + "," +
                    (is.isNumber(this.values.translate3d[1]) ? this.values.translate3d[1] + "px" : this.values.translate3d[1]) + "," +
                    (is.isNumber(this.values.translate3d[2]) ? this.values.translate3d[2] + "px" : this.values.translate3d[2]) + ")";
        },
        rotate3d: function () {
            var rotate3d = this.values.rotate3d.join("") !== "0000" ? "rotate3d(" + this.values.rotate3d[0] + "," + this.values.rotate3d[1] + "," + this.values.rotate3d[2] + "," + this.values.rotate3d[3] + "deg)" : "";
            rotate3d += (this.values.rotateX !== 0 ? " rotateX(" + this.values.rotateX + "deg)" : "");
            rotate3d += (this.values.rotateY !== 0 ? " rotateY(" + this.values.rotateY + "deg)" : "");
            rotate3d += (this.values.rotateZ !== 0 ? " rotateZ(" + this.values.rotateZ + "deg)" : "");
            return rotate3d;
        },
        scale3d: function () {
            var scale3d = this.values.scale3d.join("") !== "111" ? "scale3d(" + this.values.scale3d[0] + "," + this.values.scale3d[1] + "," + this.values.scale3d[2] + ")" : "";
            scale3d += this.values.scaleX !== 1 ? " scaleX(" + this.values.scaleX + ")" : "";
            scale3d += this.values.scaleY !== 1 ? " scaleY(" + this.values.scaleY + ")" : "";
            scale3d += this.values.scaleZ !== 1 ? " scaleZ(" + this.values.scaleZ + ")" : "";
            return scale3d;
        },
        scale: function () {
            return this.values.scale.join("") !== "11" ? "scale(" + this.values.scale[0] + "," + this.values.scale[1] + ")" : "";
        },
        skew: function () {
            return this.values.skew.join("") !== "00" ? "skew(" + this.values.skew[0] + "deg," + this.values.skew[1] + "deg)" : "";
        },
        rotate: function () {
            return this.values.rotate !== 0 ? "rotate(" + this.values.rotate + "deg)" : "";
        }
    };
    transform.watch = function (key) {
        if (this.attrs.indexOf(key) === -1) {
            if (transform.watcher[key]) {
                this.attrs.push(key);
                this.setter.push(transform.watcher[key]);
            }
        }
    };
    transform.watchName = function (key) {
        if (key.indexOf("translate") !== -1) {
            return "translate";
        } else if (key.indexOf("skew") !== -1) {
            return "skew";
        } else if (key.indexOf("rotate") !== -1) {
            if (key === "rotate3d") {
                return "rotate3d";
            } else {
                return "rotate";
            }
        } else if (key.indexOf("scale") !== -1) {
            if (key === "scale3d") {
                return "scale3d";
            } else {
                return "rotate";
            }
        } else {
            return "";
        }
    };
    transform.set = function () {
        var str = "";
        for (var i in this.setter) {
            str += this.setter[i].call(this) + " ";
        }
        this.dom.css(prefix.prefix + "transform", str);
    };
    transform.translate = function (index, name, x) {
        if (arguments.length === 2) {
            var n = this.values.translate3d[index];
            if (/^[-0-9\.]*$/.test(n) === false) {
                transform.defaultValue.call(this);
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
                transform.watch.call(this, transform.watchName(i));
            }
        }
        transform.set.call(this);
        return this;
    };
    transform.prototype.scale = function (x, y) {
        transform.watch.call(this, "scale");
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
        transform.watch.call(this, "rotate");
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
        transform.watch.call(this, "scale3d");
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
        transform.watch.call(this, "rotate3d");
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
        transform.watch.call(this, "skew");
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
        transform.watch.call(this, "translate");
        return transform.translate.apply(this, arguments.length === 0 ? [0, "translateX"] : [0, "translateX", x]);
    };
    transform.prototype.y = function (x) {
        transform.watch.call(this, "translate");
        return transform.translate.apply(this, arguments.length === 0 ? [1, "translateY"] : [1, "translateY", x]);
    };
    transform.prototype.z = function (x) {
        transform.watch.call(this, "translate");
        return transform.translate.apply(this, arguments.length === 0 ? [2, "translateZ"] : [2, "translateZ", x]);
    };
    transform.prototype.scaleX = function (x) {
        transform.watch.call(this, "scale");
        return transform.sett.apply(this, arguments.length === 0 ? ["scaleX", 1, x] : ["scaleX", 1, x]);
    };
    transform.prototype.scaleY = function (x) {
        transform.watch.call(this, "scale");
        return transform.sett.apply(this, arguments.length === 0 ? ["scaleY", 1, x] : ["scaleY", 1, x]);
    };
    transform.prototype.scaleZ = function (x) {
        transform.watch.call(this, "scale");
        return transform.sett.apply(this, arguments.length === 0 ? ["scaleZ", 1, x] : ["scaleZ", 1, x]);
    };
    transform.prototype.rotateX = function (x) {
        transform.watch.call(this, "rotate");
        return transform.sett.apply(this, arguments.length === 0 ? ["rotateX", 0, x] : ["rotateX", 0, x]);
    };
    transform.prototype.rotateY = function (x) {
        transform.watch.call(this, "rotate");
        return transform.sett.apply(this, arguments.length === 0 ? ["rotateY", 0, x] : ["rotateY", 0, x]);
    };
    transform.prototype.rotateZ = function (x) {
        transform.watch.call(this, "rotate");
        return transform.sett.apply(this, arguments.length === 0 ? ["rotateZ", 0, x] : ["rotateZ", 0, x]);
    };
    transform.prototype.skewX = function (x) {
        transform.watch.call(this, "skew");
        return transform.sett.apply(this, arguments.length === 0 ? ["skewX", 0, x] : ["skewX", 0, x]);
    };
    transform.prototype.skewY = function (x) {
        transform.watch.call(this, "skew");
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
    transform.prototype.scope = function () {
        return this.dom;
    };

    var query = function () {
    };
    query.prototype.get = function (a) {
        a = a / 1;
        if (is.isAvalid(a) && a >= 0 && a < this.nodes.length) {
            return this.nodes[a];
        } else {
            return null;
        }
    };
    query.prototype.ready = function (fn) {
        var a = /complete|loaded|interactive/;
        if (a.test(window.document.readyState)) {
            fn && fn();
        } else {
            window.document.addEventListener('DOMContentLoaded', function () {
                fn && fn();
            }, false);
        }
        return this;
    };
    query.prototype.find = function (selector) {
        var r = [];
        if (!this.isEmpty()) {
            if (is.isString(selector)) {
                r = dom.util.query(this.nodes[0], selector);
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.children = function (num) {
        var r = [];
        if (!this.isEmpty()) {
            if (is.isString(num)) {
                r = dom.util.queryChild(this.nodes[0], num);
            } else {
                if (arguments.length === 1 && num >= 0) {
                    r = this.nodes[0].children[num] ? [this.nodes[0].children[num]] : [];
                } else {
                    r = Array.prototype.slice.call(this.nodes[0].children);
                }
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.siblings = function (selector) {
        var r = [];
        if (!this.isEmpty()) {
            var a = [];
            if (is.isString(selector) && this.nodes[0].parentNode) {
                a = dom.util.queryChild(this.nodes[0].parentNode, selector);
            } else {
                a = this.nodes[0].parentNode ? Array.prototype.slice.call(this.nodes[0].parentNode.children) : [];
            }
            for (var i = 0; i < a.length; i++) {
                if (a[i] !== this.nodes[0]) {
                    r.push(a[i]);
                }
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.has = function (selector) {
        var r = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var a = dom.util.queryChild(this.nodes[i], selector);
            if (a.length > 0) {
                r.push(this.nodes[i]);
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.index = function () {
        var a = -1;
        if (!this.isEmpty()) {
            var parent = this.nodes[0].parentNode;
            for (var i = 0; i < parent.children.length; i++) {
                if (parent.children[i] === this.nodes[0]) {
                    a = i;
                    break;
                }
            }
        }
        return a;
    };
    query.prototype.filter = function (selector) {
        var r = [];
        if (!this.isEmpty()) {
            var a = dom.util.query(window.document, selector);
            if (a.length > 0) {
                for (var i = 0; i < this.nodes.length; i++) {
                    (a.indexOf(this.nodes[i]) !== -1) && r.push(this.nodes[i]);
                }
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.first = function () {
        var r = [];
        if (!this.isEmpty()) {
            r.push(this.get(0));
        }
        return dom.util.getDom(r);
    };
    query.prototype.last = function () {
        var r = [];
        if (this.nodes.length > 0) {
            r.push(this.get(this.length - 1));
        }
        return dom.util.getDom(r);
    };
    query.prototype.parent = function () {
        var selector = arguments[0], r = [];
        if (!this.isEmpty()) {
            if (is.isString(selector)) {
                var n = dom.util.query(window.document, selector);
                var b = this.nodes[0].parentNode;
                while (b && !is.isDocument(b)) {
                    if (n.indexOf(b) !== -1) {
                        r.push(b);
                    }
                    b = b.parentNode;
                }
            } else if (is.isNumber(selector) && selector > 0) {
                var b = this.nodes[0].parentNode, c = selector - 1;
                while (b && !is.isDocument(b) && c > 0) {
                    c--;
                    b = b.parentNode;
                }
                r.push(b);
            } else {
                this.nodes[0].parentNode && r.push(this.nodes[0].parentNode);
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.parents = function () {
        var selector = arguments[0], r = [];
        if (!this.isEmpty()) {
            var b = this.nodes[0].parentNode;
            while (b && !is.isDocument(b)) {
                r.push(b);
                b = b.parentNode;
            }
            if (is.isString(selector)) {
                var n = dom.util.query(window.document, selector);
                r = r.filter(function (c) {
                    if (n.indexOf(c) !== -1) {
                        return true;
                    }
                });
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.next = function () {
        var r = [];
        if (!this.isEmpty()) {
            var a = this.nodes[0].nextSibling;
            a && r.push(a);
        }
        return dom.util.getDom(r);
    };
    query.prototype.nexts = function (selector) {
        var r = [], ths = this;
        if (!this.isEmpty()) {
            var a = this.nodes[0].nextSibling;
            while (a) {
                if (a.nodeType === 1) {
                    r.push(a);
                }
                a = a.nextSibling;
            }
            if (is.isString(selector) && this.nodes[0].parentNode) {
                var c = dom.util.queryChild(this.nodes[0].parentNode, selector);
                r = r.filter(function (n) {
                    if (c.indexOf(n) !== -1 && n !== ths.nodes[0]) {
                        return true;
                    }
                });
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.prev = function () {
        var r = [];
        if (!this.isEmpty()) {
            var a = this.nodes[0].previousSibling;
            a && r.push(a);
        }
        return dom.util.getDom(r);
    };
    query.prototype.prevs = function (selector) {
        var r = [], ths = this;
        if (!this.isEmpty()) {
            var a = this.nodes[0].previousSibling;
            while (a) {
                if (a.nodeType === 1) {
                    r.push(a);
                }
                a = a.previousSibling;
            }
            if (is.isString(selector) && this.nodes[0].parentNode) {
                var c = dom.util.queryChild(this.nodes[0].parentNode, selector);
                r = r.filter(function (n) {
                    if (c.indexOf(n) !== -1 && n !== ths.nodes[0]) {
                        return true;
                    }
                });
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.eq = function (index) {
        var r = [];
        if (index >= 0 && index < this.nodes.length) {
            r.push(this.nodes[index]);
        }
        return dom.util.getDom(r);
    };
    query.prototype.each = function (fn) {
        if (fn) {
            for (var i = 0; i < this.nodes.length; i++) {
                if (fn.call(this.nodes[i], this.nodes[i], i, this.nodes) === false) {
                    break;
                }
            }
        }
        return this;
    };
    query.prototype.remove = function () {
        var num = arguments[0];
        if (num && is.isNumber(num) && num < this.nodes.length) {
            var a = this.nodes[num];
            if (a) {
                dom.util.cleanNode(a);
                a.parentNode.removeChild(a);
            }
        } else if (is.isString(num)) {
            var c = dom.util.query(window.document, num);
            for (var i = 0; i < this.nodes.length; i++) {
                if (c.indexOf(this.nodes[i] !== -1)) {
                    this.nodes[i].parentNode && this.nodes[i].parentNode.removeChild(this.nodes[i]);
                }
            }
        } else {
            for (var i = 0; i < this.nodes.length; i++) {
                var a = this.nodes[i];
                if (a) {
                    dom.util.cleanNode(a);
                    a.parentNode && a.parentNode.removeChild(a);
                }
            }
        }
        return this;
    };
    query.prototype.empty = function () {
        for (var t = 0; t < this.nodes.length; t++) {
            var c = this.nodes[t].children;
            for (var i = 0; i < c.length; i++) {
                c[i].nodeType && dom.util.cleanNode(c[i]);
            }
            this.nodes[t].innerHTML = "";
        }
    };
    query.prototype.clean = function () {
        for (var i = 0; i <= this.nodes.length; i++) {
            dom.util.cleanNode(this.nodes[i]);
        }
        this.nodes = null;
        this.length = 0;
    };
    query.prototype.clone = function () {
        var r = [];
        if (!this.isEmpty()) {
            r.push(this.nodes[0].cloneNode(true));
        }
        return dom.util.getDom(r);
    };
    query.prototype.wrap = function (htm) {
        for (var i = 0; i < this.nodes.length; i++) {
            var vv = null;
            if (is.isString(htm)) {
                vv = dom.util.parseHTML(htm)[0] || null;
            } else if (htm instanceof query) {
                vv = dom.nodes[0];
            } else if (htm.nodeType) {
                vv = htm;
            } else if (is.isFunction(htm)) {
                var b = htm();
                is.isString(b) && (vv = dom.util.parseHTML(htm)[0] || null);
            }
            if (vv) {
                var c = this.nodes[i];
                if (c.parentNode) {
                    c.parentNode.replaceChild(vv, c);
                    vv.appendChild(c);
                }
            }
        }
        return this;
    };
    query.prototype.append = function () {
        var a = arguments[0];
        if (!this.isEmpty()) {
            if (is.isString(a)) {
                var _c = dom.util.parseFlagment(a);
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].appendChild(_c.cloneNode(true));
                }
            } else if (a instanceof query) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].appendChild(a.nodes[0]);
                }
            } else if (a && a.nodeType) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].appendChild(a);
                }
            } else if (is.isFunction(a)) {
                for (var i = 0; i < this.nodes.length; i++) {
                    var d = a.call(this.nodes[i], i, this.nodes[i].innerHTML);
                    dom.util.isHTML(d) && this.nodes[i].appendChild(dom.util.parseFlagment(d));
                }
            }
        }
        return this;
    };
    query.prototype.appendTo = function (a) {
        if (!this.isEmpty()) {
            if (is.isString(a)) {
                var b = dom.util.query(window.document, a);
                b.length > 0 && b[0].appendChild(this.nodes[0]);
            } else if (a instanceof query) {
                a.length > 0 && a.nodes[0].appendChild(this.nodes[0]);
            } else {
                a.appendChild(this.nodes[0]);
            }
        }
        return this;
    };
    query.prototype.insertBefore = function (a) {
        if (!this.isEmpty()) {
            if (is.isString(a)) {
                var cd = dom.util.query(window.document, a)[0];
                cd && cd.parentNode && cd.parentNode.insertBefore(this.nodes[0], cd);
            } else if (a instanceof query) {
                !a.isEmpty() && a.parent().get(0).insertBefore(this.nodes[0], a.get(0));
            } else {
                a.parentNode && a.parentNode.insertBefore(this.nodes[0], a);
            }
        }
        return this;
    };
    query.prototype.insertAfter = function (a) {
        if (!this.isEmpty()) {
            var newnode = null;
            if (is.isString(a)) {
                var newnode = dom.util.query(window.document, a)[0] || null;
            } else if (a instanceof query) {
                newnode = a.nodes[0] || null;
            } else if (a.nodeType) {
                newnode = a;
            }
            if (newnode) {
                if (newnode.nextSibling) {
                    newnode.parentNode.insertBefore(this.nodes[0], newnode.nextSibling);
                } else {
                    newnode.parentNode.appendChild(this.nodes[0]);
                }
            }
        }
        return this;
    };
    query.prototype.prepend = function () {
        var a = arguments[0];
        if (!this.isEmpty()) {
            if (is.isString(a)) {
                var _c = dom.util.parseFlagment(a);
                for (var i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].childNodes.length !== 0) {
                        this.nodes[i].insertBefore(_c.cloneNode(true), this.nodes[i].firstChild);
                    } else {
                        this.nodes[i].appendChild(_c.cloneNode(true));
                    }
                }
            } else if (is.isFunction(a)) {
                for (var i = 0; i < this.nodes.length; i++) {
                    var d = a.call(this.nodes[i], i, this.nodes[i].innerHTML);
                    if (dom.util.isHTML(d)) {
                        if (this.nodes[i].childNodes.length > 0) {
                            this.nodes[i].insertBefore(dom.util.parseFlagment(d), this.nodes[i].firstChild);
                        } else {
                            this.nodes[i].appendChild(dom.util.parseFlagment(d));
                        }
                    }
                }
            }
        }
        return this;
    };
    query.prototype.prependTo = function (a) {
        if (!this.isEmpty()) {
            if (is.isString(a)) {
                var b = dom.util.query(window.document, a);
                if (b.length > 0) {
                    if (b[0].childNodes.length > 0) {
                        b[0].insertBefore(this.nodes[0], b[0].firstChild);
                    } else {
                        b[0].appendChild(this.nodes[0]);
                    }
                }
            } else if (a instanceof query) {
                if (!a.isEmpty()) {
                    if (a.nodes[0].childNodes.length > 0) {
                        a.nodes[0].insertBefore(this.nodes[0], a.nodes[0].firstChild);
                    } else {
                        a.nodes[0].appendChild(this.nodes[0]);
                    }
                }
            } else if (a.nodeType === 1) {
                if (a.children.length > 0) {
                    a.insertBefore(this.nodes[0], a.firstChild);
                } else {
                    a.appendChild(this.nodes[0]);
                }
            }
        }
        return this;
    };
    query.prototype.before = function (a) {
        if (!this.isEmpty() && this.nodes[0].parentNode) {
            if (is.isString(a)) {
                var _c = dom.util.parseFlagment(a);
                this.nodes[0].parentNode && this.nodes[0].parentNode.insertBefore(_c, this.nodes[0]);
            } else if (a instanceof dom) {
                this.nodes[0].parentNode && this.nodes[0].parentNode.insertBefore(a.nodes[0], this.nodes[0]);
            } else if (a.nodeType) {
                this.nodes[0].parentNode && this.nodes[0].parentNode.insertBefore(a, this.nodes[0]);
            }
        }
        return this;
    };
    query.prototype.after = function (a) {
        if (!this.isEmpty()) {
            var newnode = null;
            if (is.isString(a)) {
                newnode = dom.util.parseFlagment(a);
            } else if (a instanceof query) {
                newnode = a.get(0);
            } else if (a.nodeType) {
                newnode = a;
            }
            if (this.nodes[0].nextSibling) {
                this.nodes[0].parentNode && this.nodes[0].parentNode.insertBefore(newnode, this.nodes[0].nextSibling);
            } else {
                this.nodes[0].parentNode && this.nodes[0].parentNode.appendChild(newnode);
            }
        }
        return this;
    };
    query.prototype.replaceWith = function (a) {
        if (!this.isEmpty()) {
            var newnode = null;
            if (is.isString(a)) {
                newnode = dom.util.query(window.document, a)[0];
            } else if (a instanceof query) {
                newnode = a.nodes[0];
            } else if (a.nodeType) {
                newnode = a;
            }
            if (newnode) {
                newnode.parentNode.replaceChild(this.nodes[0], newnode);
            }
        }
        return this;
    };
    query.prototype.equal = function (a) {
        return this === a;
    };
    query.prototype.same = function (a) {
        var r = true;
        a = bright(a);
        if (this.length === a.length) {
            for (var i = 0; i < this.nodes.length; i++) {
                if (a.nodes.indexOf(this.nodes[i]) === -1) {
                    r = false;
                    break;
                }
            }
        } else {
            r = false;
        }
        return r;
    };
    query.prototype.css = function (a, b) {
        var t = this;
        if (!this.isEmpty()) {
            if (arguments.length === 1 && is.isObject(a)) {
                a = prefix.fix(a);
                for (var i = 0; i < this.nodes.length; i++) {
                    var str = this.nodes[i].style.cssText + ";";
                    for (var j in a) {
                        str += j + ":" + a[j] + ";";
                    }
                    this.nodes[i].style.cssText = str;
                }
            } else if (arguments.length === 1 && is.isString(a)) {
                a = prefix.fix(a);
                t = window.getComputedStyle(this.nodes[0], '').getPropertyValue(a);
            } else if (arguments.length === 2) {
                for (var i = 0; i < this.nodes.length; i++) {
                    var c = prefix.fix(a);
                    this.nodes[i].style[dom.util.propertyName(c)] = b;
                }
            }
        }
        return t;
    };
    query.prototype.attr = function (a, b) {
        var tp = this;
        if (!this.isEmpty()) {
            if (arguments.length === 2) {
                if (a !== "") {
                    for (var i = 0; i < this.nodes.length; i++) {
                        this.nodes[i].setAttribute(a, b);
                    }
                }
            } else if (arguments.length === 1) {
                if (is.isObject(a)) {
                    for (var t = 0; t < this.nodes.length; t++) {
                        for (var i in a) {
                            if (i !== "") {
                                this.nodes[t].setAttribute(i, a[i]);
                            }
                        }
                    }
                } else if (a) {
                    tp = this.nodes[0].getAttribute(a);
                }
            }
        }
        return tp;
    };
    query.prototype.removeAttr = function (name) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].removeAttribute(name);
        }
        return this;
    };
    query.prototype.data = function (a, b) {
        var c = null;
        if (!this.isEmpty()) {
            if (arguments.length === 1) {
                if (!this.nodes[0].datasets) {
                    this.nodes[0].datasets = {
                    };
                }
                if (is.isString(a)) {
                    if (this.nodes[0].datasets[a] !== undefined && this.nodes[0].datasets[a] !== null) {
                        c = this.nodes[0].datasets[a];
                    }
                } else if (is.isObject(a)) {
                    bright.extend(this.nodes[0].datasets, a);
                }
            } else if (arguments.length === 2) {
                this.addClass("incache");
                for (var i = 0; i < this.nodes.length; i++) {
                    if (!this.nodes[i].datasets) {
                        this.nodes[i].datasets = {
                        };
                    }
                    this.nodes[i].datasets[a] = b;
                }
                c = this;
            }
        }
        return c;
    };
    query.prototype.removeData = function (a) {
        if (!this.isEmpty()) {
            if (arguments.length === 1) {
                this.data(a, null);
            }
        }
        return this;
    };
    query.prototype.dataset = function (name, value) {
        var _a = this;
        if (this.nodes.length > 0) {
            if (arguments.length === 1) {
                if (is.isString(name)) {
                    if (this.nodes[0].dataset) {
                        _a = this.nodes[0].dataset[name];
                    } else {
                        _a = this.nodes[0].getAttribute(util.getDatasetName(name));
                    }
                } else if (is.isObject(name)) {
                    for (var i in name) {
                        if (this.nodes[0].dataset) {
                            this.nodes[0].dataset[i] = name[i];
                        } else {
                            this.nodes[0].setAttribute(util.getDatasetName(i), name[i]);
                        }
                    }
                }
            } else if (arguments.length === 2) {
                for (var i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[0].dataset) {
                        this.nodes[i].dataset[name] = value;
                    } else {
                        this.nodes[0].setAttribute(util.getDatasetName(name), value);
                    }
                }
            } else if (arguments.length === 0) {
                if (this.nodes[0].dataset) {
                    _a = this.nodes[0].dataset;
                } else {
                    var t = this.nodes[0].attrbutes;
                    _a = {};
                    for (var i = 0; i < t.length; t++) {
                        if (t[i].nodeName.indexOf("data-") === 0) {
                            _a[util.getDatasetReserve(t[i].nodeName)] = t[i].nodeValue;
                        }
                    }
                }
            }
        }
        return _a;
    };
    query.prototype.create = function (tagName, ns) {
        if (tagName) {
            if (ns) {
                this.nodes = [window.document.createElementNS(ns, tagName)];
            } else {
                this.nodes = [window.document.createElement(tagName)];
            }
        } else {
            this.nodes = [window.document.createDocumentFragment()];
        }
        this.length = this.nodes.length;
        return this;
    };
    query.prototype.element = function (tagName, ns) {
        if (tagName) {
            if (ns) {
                this.nodes = [window.document.createElementNS(ns, tagName)];
            } else {
                this.nodes = [window.document.createElement(tagName)];
            }
        } else {
            this.nodes = [window.document.createDocumentFragment()];
        }
        this.length = this.nodes.length;
        return this;
    };
    query.prototype.width = function (a) {
        if (arguments.length === 1) {
            if (is.isNumber(a)) {
                a = a + "px";
            }
            this.css("width", a);
            return this;
        } else {
            return this.nodes[0].offsetWidth;
        }
    };
    query.prototype.height = function (a) {
        if (arguments.length === 1) {
            if (is.isNumber(a)) {
                a = a + "px";
            }
            this.css("height", a);
            return this;
        } else {
            return this.nodes[0].offsetHeight;
        }
    };
    query.prototype.offset = function () {
        if (!this.isEmpty()) {
            var obj = this.nodes[0].getBoundingClientRect();
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: obj.width,
                height: obj.height
            };
        } else {
            return null;
        }
    };
    query.prototype.hide = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            var ds = window.getComputedStyle(this.nodes[i], '').getPropertyValue("display");
            if (ds !== "none") {
                this.nodes[i].setAttribute("ds", ds);
                this.nodes[i].style.display = "none";
            }
        }
        return this;
    };
    query.prototype.show = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            var ds = window.getComputedStyle(this.nodes[i], '').getPropertyValue("display");
            if (ds === "none") {
                var a = this.nodes[i].getAttribute("ds");
                if (a) {
                    this.nodes[i].removeAttribute("ds");
                    this.nodes[i].style.display = a;
                } else {
                    this.nodes[i].style.display = "block";
                }
            }
        }
        return this;
    };
    query.prototype.visible = function (bole) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (bole) {
                this.nodes[i].style["visibility"] = "visible";
            } else {
                this.nodes[i].style["visibility"] = "hidden";
            }
        }
        return this;
    };
    query.prototype.html = function (tags) {
        var t = this;
        if (!this.isEmpty()) {
            if (arguments.length === 1) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].innerHTML = tags;
                }
            } else {
                t = this.nodes[0].innerHTML;
            }
        }
        return t;
    };
    query.prototype.outer = function () {
        if (!this.isEmpty()) {
            return this.nodes[0].outerHTML;
        }
        return "";
    };
    query.prototype.text = function (text) {
        var t = this;
        if (!this.isEmpty()) {
            if (arguments.length === 1) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].innerText = text;
                }
            } else {
                t = this.nodes[0].innerText;
            }
        }
        return t;
    };
    query.prototype.val = function (a) {
        var t = this;
        if (!this.isEmpty()) {
            if (arguments.length === 1) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].value = a;
                }
            } else {
                t = this.nodes[0].value;
            }
        }
        return t;
    };
    query.prototype.addClass = function (a) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].classList) {
                this.nodes[i].classList.add(a);
            } else {
                if (this.nodes[i].className.indexOf(a) === -1) {
                    this.nodes[i].className = this.nodes[i].className + " " + a;
                }
            }
        }
        return this;
    };
    query.prototype.removeClass = function (a) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].classList) {
                this.nodes[i].classList.remove(a);
            } else {
                if (this.nodes[i].className.indexOf(a) !== -1) {
                    var reg = new RegExp('(\\s|^)' + a + '(\\s|$)');
                    this.nodes[i].className = this.nodes[i].className.replace(reg, ' ');
                }
            }
        }
        return this;
    };
    query.prototype.contains = function (a) {
        if (!this.isEmpty()) {
            var b = bright(a);
            if (!b.isEmpty()) {
                return this.nodes[0].contains(b.nodes[0]);
            }
        }
        return false;
    };
    query.prototype.contain = function (a) {
        return this.same(a) || this.contains(a);
    };
    query.prototype.hasClass = function (a) {
        var _a = false;
        if (!this.isEmpty()) {
            if (this.nodes[0].classList) {
                _a = this.nodes[0].classList.contains(a);
            } else {
                _a = this.nodes[0].className.indexOf(a) === -1;
            }
        }
        return _a;
    };
    query.prototype.toggleClass = function (a) {
        if (!this.isEmpty()) {
            if (this.nodes[0].classList) {
                this.nodes[0].classList.toggle(a);
            } else {
                if (this.nodes[0].className.indexOf(a) !== -1) {
                    var reg = new RegExp('(\\s|^)' + a + '(\\s|$)');
                    for (var i = 0; i < this.nodes.length; i++) {
                        this.nodes[i].className = this.nodes[i].className.replace(reg, ' ');
                    }
                } else {
                    for (var i = 0; i < this.nodes.length; i++) {
                        this.nodes[i].className = this.nodes[i].className + " " + a;
                    }
                }
            }
        }
        return this;
    };
    query.prototype.scrollTop = function (top) {
        var a = this;
        if (arguments.length === 0) {
            if (!this.isEmpty()) {
                a = (this.nodes[0]["scrollTop"] !== undefined) ? this.nodes[0].scrollTop : this.nodes[0].scrollY;
            } else {
                a = null;
            }
        } else {
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i]["scrollTop"] !== undefined) {
                    this.nodes[i].scrollTop = top;
                } else {
                    this.nodes[i].scrollY = top;
                }
            }
        }
        return a;
    };
    query.prototype.scrollLeft = function (left) {
        var a = this;
        if (arguments.length === 0) {
            if (!this.isEmpty()) {
                a = (this.nodes[0]["scrollLeft"] !== undefined) ? this.nodes[0].scrollLeft : this.nodes[0].scrollX;
            } else {
                a = null;
            }
        } else {
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i]["scrollLeft"] !== undefined) {
                    this.nodes[i].scrollLeft = left;
                } else {
                    this.nodes[i].scrollX = left;
                }
            }
        }
        return a;
    };
    query.prototype.click = function (fn) {
        if (arguments.length === 1) {
            this.bind("click", fn);
        } else {
            this.trigger("click");
        }
        return this;
    };
    query.prototype.load = function (fn) {
        if (arguments.length === 1) {
            this.bind("load", fn);
        } else {
            this.trigger("load");
        }
        return this;
    };
    query.prototype.trigger = function (type, data) {
        return event.util.trigger(this, type, data);
    };
    query.prototype.bind = function (type, fn) {
        if (is.isString(type)) {
            return event.util.bind(this, type, fn);
        } else if (is.isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                event.util.bind(this, type[i], fn);
            }
            return this;
        }
    };
    query.prototype.unbind = function (type, fn) {
        return event.util.unbind(this, type, fn);
    };
    query.prototype.isEmpty = function (fn) {
        if (arguments.length === 0) {
            return this.nodes.length === 0;
        } else {
            if (is.isFunction(fn)) {
                fn.call(this, this.nodes.length === 0);
                return this;
            }
            return this;
        }
    };
    query.prototype.isWrapper = function () {
        return this instanceof query;
    };
    query.prototype.add = function (a) {
        var k = bright(a);
        this.nodes = this.nodes.concat(k.nodes);
        this.length = this.nodes.length;
        return this;
    };
    query.prototype.prop = function (name, value) {
        for (var i = 0; i < this.nodes.length; i++) {
            var val = this.nodes[i][name];
            if (val !== undefined) {
                if (is.isFunction(value)) {
                    this.nodes[i][name] = value.call(this.nodes[i], i, val);
                } else {
                    this.nodes[i][name] = value;
                }
            }
        }
        return this;
    };
    query.prototype.position = function (a, b) {
        if (arguments.length === 0) {
            var a = this.offsetParent();
            if (a.length > 0 && !is.isDocument(a.get(0))) {
                return {
                    left: this.css("left"),
                    top: this.css("top")
                };
            } else {
                return this.offset();
            }
        } else {
            a && this.css("left", a);
            b && this.css("top", b);
            return this;
        }
    };
    query.prototype.offsetParent = function () {
        var r = [];
        if (!this.isEmpty()) {
            if (this.nodes[0].offsetParent === undefined) {
                var a = this.nodes[0].parentNode;
                while (a && !dom.regs.root.test(a.nodeName) && window.getComputedStyle(a, '').getPropertyValue("position") === "static") {
                    a = a.parentNode;
                }
                r.push(a);
            } else {
                r.push(this.nodes[0].offsetParent);
            }
        }
        return dom.util.getDom(r);
    };
    query.prototype.scrollingLeft = function (scrollLeft, time, type) {
        var promise = bright.promise().scope(this), ths = this;
        if (this.scrollLeft() !== scrollLeft) {
            new tween({
                from: this.scrollLeft(),
                to: scrollLeft,
                during: time,
                fn: type,
                onrunning: function (a) {
                    ths.scrollLeft(a);
                },
                onend: function () {
                    promise.resolve();
                }
            }).start();
        } else {
            promise.resolve();
        }
        return promise;
    };
    query.prototype.scrollingTop = function (scrollTop, time, type) {
        var promise = bright.promise().scope(this), ths = this;
        if (this.scrollTop() !== scrollTop) {
            new tween({
                from: this.scrollTop(),
                to: scrollTop,
                during: time,
                fn: type,
                onrunning: function (a) {
                    ths.scrollTop(a);
                },
                onend: function () {
                    promise.resolve();
                }
            }).start();
        } else {
            promise.resolve();
        }
        return promise;
    };
    query.prototype.transition = function () {
        var trans = this.data("_transition_");
        if (!trans) {
            trans = new transition(this);
        }
        return trans;
    };
    query.prototype.animate = function (cssset, option) {
        var dom = this;
        var ani = this.data("_animate_");
        var ops = {
            duration: 350,
            delay: 0,
            type: "ease-out"
        };
        bright.extend(ops, option);
        cssset = prefix.fix(cssset);
        var v = "";
        for (var i in cssset) {
            v += i + " " + ops.duration + "ms " + ops.type + " " + ops.delay + "ms,";
        }
        if (v.length > 0) {
            v = v.substring(0, v.length - 1);
        }
        if (!ani) {
            var promise = bright.promise().scope(dom);
            var _endHandler = function (e) {
                dom.get(0).removeEventListener(prefix.transitionEnd, _endHandler, false);
                promise.resolve(e);
            };
            dom.css(prefix.prefix + "transition", v).get(0).addEventListener(prefix.transitionEnd, _endHandler, false);
            dom.css(cssset);
            dom.data("_animate_", promise);
            ani = promise;
        } else {
            ani.then(function () {
                var promise = bright.promise().scope(dom);
                var _endHandler = function (e) {
                    dom.get(0).removeEventListener(prefix.transitionEnd, _endHandler, false);
                    promise.resolve(e);
                };
                dom.css(prefix.prefix + "transition", v).get(0).addEventListener(prefix.transitionEnd, _endHandler, false);
                dom.css(cssset);
                return promise;
            });
        }
        return ani;
    };
    query.prototype.transform = function () {
        var a = this.data("_transform_");
        if (!a) {
            a = new transform(this);
        }
        return a;
    };
    query.prototype.isRemoved = function () {
        if (this.nodes[0]) {
            return !window.document.contains(this.nodes[0]);
        } else {
            return false;
        }
    };
    query.prototype.mutationObserve = function (callback, option) {
        if (!this.isEmpty()) {
            if (!this.nodes[0].datasets["-mutation-"]) {
                var a = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                var b = new a(callback);
                b.observe(this.nodes[0], option);
                this.nodes[0].datasets["-mutation-"] = b;
            }
        }
        return this;
    };
    query.prototype.unMutationObserve = function () {
        if (!this.isEmpty()) {
            if (this.nodes[0].datasets["-mutation-"]) {
                this.nodes[0].datasets["-mutation-"].disconnect();
                this.nodes[0].datasets["-mutation-"].takeRecord();
                this.nodes[0].datasets["-mutation-"] = null;
            }
        }
        return this;
    };
    query.prototype.finder = function () {
        if (!this.isEmpty()) {
            return this.nodes[0].datasets && this.nodes[0].datasets["-finder-"] ? this.nodes[0].datasets["-finder-"] : null;
        } else {
            return null;
        }
    };
    query.prototype.group = function () {
        if (!this.isEmpty()) {
            return this.nodes[0].datasets && this.nodes[0].datasets["-groupitem-"] ? this.nodes[0].datasets["-groupitem-"].group || null : null;
        } else {
            return null;
        }
    };
    query.prototype.items = function (name) {
        var r = new dom();
        if (!this.isEmpty()) {
            if (this.nodes[0].datasets["-group-"] && this.nodes[0].datasets["-group-"].items) {
                if (arguments.length === 1) {
                    if (this.nodes[0].datasets["-group-"].items[name]) {
                        r.add(this.nodes[0].datasets["-group-"].items[name]);
                    }
                } else {
                    for (var i in this.nodes[0].datasets["-group-"].items) {
                        r.add(this.nodes[0].datasets["-group-"].items[i]);
                    }
                }
            }
        }
        return r;
    };
    query.prototype.item = function () {
        if (!this.isEmpty()) {
            return this.nodes[0].datasets && this.nodes[0].datasets["-groupitem-"] ? this.nodes[0].datasets["-groupitem-"] || null : null;
        } else {
            return null;
        }
    };
    query.prototype.cache = function () {
        if (!this.isEmpty()) {
            if (arguments.length === 0) {
                return this.nodes[0].datasets["-cache-"] || null;
            } else {
                if (this.nodes[0].datasets === undefined || this.nodes[0].datasets === null) {
                    this.nodes[0].datasets = {};
                    this.addClass("incache");
                }
                this.nodes[0].datasets["-cache-"] = arguments[0];
                return this;
            }
        } else {
            return null;
        }
    };
    query.prototype.getModule = function () {
        return this.data("-view-");
    };
    query.prototype.predefined = function (name) {
        var b = Array.prototype.slice.call(arguments);
        var a = query.prototype[b[0]];
        if (a) {
            b.splice(0, 1);
            return a.call(this, b);
        } else {
            return this;
        }
    };
    dom.prototype = new query();
    var windoc = function (obj) {
        this.obj = obj;
    };
    windoc.prototype.width = function () {
        return window.innerWidth;
    };
    windoc.prototype.height = function () {
        return window.innerHeight;
    };
    windoc.prototype.bind = function (type, fn) {
        if (is.isWindow(this.obj)) {
            window.addEventListener(type, fn, false);
        } else {
            this.nodes = [this.obj];
            event.util.bind(this, type, fn);
        }
        return this;
    };
    windoc.prototype.unbind = function (type, fn) {
        if (is.isWindow(this.obj)) {
            window.removeEventListener(type, fn, false);
        } else {
            this.nodes = [this.obj];
            event.util.bind(this, type, fn);
        }
        return this;
    };
    windoc.prototype.scrollTop = function (top) {
        var a = this;
        if (arguments.length === 0) {
            a = document.body.scrollTop || document.documentElement.scrollTop;
        } else {
            document.body.scrollTop = top;
            document.documentElement.scrollTop = top;
        }
        return a;
    };
    windoc.prototype.scrollLeft = function (left) {
        var a = this;
        if (arguments.length === 0) {
            a = document.body.scrollLeft || document.documentElement.scrollLeft;
        } else {
            document.body.scrollLeft = left;
        }
        return a;
    };
    windoc.prototype.scrollingLeft = function (scrollLeft, time, type) {
        var promise = bright.promise().scope(this), ths = this;
        if (this.scrollLeft() !== scrollLeft) {
            new tween({
                from: this.scrollLeft(),
                to: scrollLeft,
                during: time,
                fn: type,
                onrunning: function (a) {
                    ths.scrollLeft(a);
                },
                onend: function () {
                    promise.resolve();
                }
            }).start();
        } else {
            promise.resolve();
        }
        return promise;
    };
    windoc.prototype.scrollingTop = function (scrollTop, time, type) {
        var promise = bright.promise().scope(this), ths = this;
        if (this.scrollTop() !== scrollTop) {
            new tween({
                from: this.scrollTop(),
                to: scrollTop,
                during: time,
                fn: type,
                onrunning: function (a) {
                    ths.scrollTop(a);
                },
                onend: function () {
                    promise.resolve();
                }
            }).start();
        } else {
            promise.resolve();
        }
        return promise;
    };
    var event = function (data) {
        this.currentTarget = null;
        this.target = null;
        this.timeStamp = new Date().getTime();
        this.type = "";
        this.cancelable = false;
        this._stop = false;
        this.data = data;
    };
    event.prototype.stopPropagation = function () {
        this._stop = true;
    };
    event.prototype.preventDefault = function () {
        this.cancelable = true;
    };
    event.trigger = function (e) {
        var events = e.currentTarget.events[e.type];
        for (var i in events) {
            events[i].call(e.currentTarget, e);
        }
    };
    event.util = {
        types: {
            HTMLEvents: "load,unload,abort,error,select,change,submit,reset,focus,blur,resize,scroll",
            MouseEvent: "click,mousedown,mouseup,mouseover,mousemove,mouseout",
            UIEvent: "DOMFocusIn,DOMFocusOut,DOMActivate",
            MutationEvent: "DOMSubtreeModified,DOMNodeInserted,DOMNodeRemoved,DOMNodeRemovedFromDocument,DOMNodeInsertedIntoDocument,DOMAttrModified,DOMCharacterDataModified"
        },
        isEvent: function (type) {
            var result = {
                type: type,
                interfaceName: null
            };
            for (var i in event.util.types) {
                if (event.util.types[i].indexOf(type) !== -1) {
                    result.interfaceName = i;
                    break;
                }
            }
            return result;
        },
        bind: function (dom, type, fn) {
            for (var i = 0; i < dom.nodes.length; i++) {
                if (!dom.nodes[i].events) {
                    dom.nodes[i].events = {
                    };
                }
                if (dom.nodes[i].events[type]) {
                    dom.nodes[i].events[type].push(fn);
                } else {
                    dom.nodes[i].events[type] = [];
                    dom.nodes[i].events[type].push(fn);
                }
                dom.nodes[i].addEventListener(type, event.trigger, false);
            }
            return dom;
        },
        unbind: function (dom, type, fn) {
            for (var i = 0; i < dom.nodes.length; i++) {
                var b = dom.nodes[i];
                if (b.events) {
                    if (type && type !== "") {
                        var events = b.events[type];
                        if (events) {
                            b.removeEventListener(type, event.trigger, false);
                            if (is.isFunction(fn)) {
                                for (var i in events) {
                                    if (events[i] === fn) {
                                        events.splice(i, 1);
                                    }
                                }
                            } else {
                                events.length = 0;
                            }
                        }
                    } else {
                        var c = b.events;
                        for (var i in c) {
                            b.removeEventListener(i, event.trigger, false);
                            c[i].length = 0;
                        }
                    }
                }
            }
            return dom;
        },
        unbindAll: function (dom) {
            var a = dom.nodes;
            for (var i = 0; i < a.length; i++) {
                var b = a[i].events;
                for (var j in b) {
                    a[i].removeEventListener(j, event.trigger, false);
                    b[j].length = 0;
                }
            }
            return dom;
        },
        unbindnode: function (node) {
            var b = node.events;
            for (var j in b) {
                node.removeEventListener(j, event.trigger, false);
                b[j].length = 0;
            }
        },
        trigger: function (dom, type, data) {
            var a = this.isEvent(type);
            if (a.interfaceName) {
                var eventx = document.createEvent(a.interfaceName);
                switch (a.interfaceName) {
                    case "MouseEvent":
                        eventx.initMouseEvent(type, true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        break;
                    case "HTMLEvents":
                        eventx.initEvent(type, true, false, window);
                        break;
                    case "UIEvents":
                        eventx.initUIEvents(type, true, false, window, null);
                        break
                    case "MutationEvent ":
                        eventx.initMutationEvent(type, true, false, window, null, null, null, null);
                        break;
                }
                for (var i = 0; i < dom.nodes.length; i++) {
                    dom.nodes[i].dispatchEvent(eventx);
                }
            } else {
                var _c = new event(data);
                _c.type = type;
                _c.target = dom.nodes[0];
                var _parent = dom.nodes[0];
                while (_parent) {
                    _c.currentTarget = _parent;
                    if (_parent.events && _parent.events[type]) {
                        var events = _parent.events[type];
                        for (var i in events) {
                            events[i].call(_parent, _c);
                        }
                    }
                    if (_c._stop) {
                        break;
                    }
                    _parent = _parent.parentNode;
                }
            }
            return dom;
        }
    };

    var tweenmapping = {
        "linner": function (t, b, c, d) {
            return c * t / d + b;
        },
        "ease-in-quad": function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        "ease-out-quad": function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        "ease-in-out-quad": function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        "ease-in-cubic": function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        "ease-out-cubic": function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        "ease-in-out-cubic": function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        "ease-in-quart": function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        "ease-out-quart": function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        "ease-in-out-quart": function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        "ease-in-quint": function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        "ease-out-quint": function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        "ease-in-out-quint": function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        "ease-in-sine": function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        "ease-out-sine": function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        "ease-in-out-sine": function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        "ease-in-expo": function (t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        "ease-out-expo": function (t, b, c, d) {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        "ease-in-out-expo": function (t, b, c, d) {
            if (t === 0)
                return b;
            if (t === d)
                return b + c;
            if ((t /= d / 2) < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        "ease-in-circ": function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        "ease-out-circ": function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        "ease-in-out-circ": function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        "ease-in-elastic": function (t, b, c, d, a, p) {
            var s;
            if (t === 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (typeof p === "undefined")
                p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        "ease-out-elastic": function (t, b, c, d, a, p) {
            var s;
            if (t === 0)
                return b;
            if ((t /= d) === 1)
                return b + c;
            if (typeof p === "undefined")
                p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        "ease-in-out-elastic": function (t, b, c, d, a, p) {
            var s;
            if (t === 0)
                return b;
            if ((t /= d / 2) === 2)
                return b + c;
            if (typeof p === "undefined")
                p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1)
                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        "ease-in-back": function (t, b, c, d, s) {
            if (typeof s === "undefined")
                s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        "ease-out-back": function (t, b, c, d, s) {
            if (typeof s === "undefined")
                s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        "ease-in-out-back": function (t, b, c, d, s) {
            if (typeof s === "undefined")
                s = 1.70158;
            if ((t /= d / 2) < 1)
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        "ease-in-bounce": function (t, b, c, d) {
            return c - tweenmapping["ease-out-bounce"](d - t, 0, c, d) + b;
        },
        "ease-out-bounce": function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        "ease-in-out-bounce": function (t, b, c, d) {
            if (t < d / 2) {
                return tweenmapping["ease-in-bounce"](t * 2, 0, c, d) * .5 + b;
            } else {
                return tweenmapping["ease-out-bounce"](t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    };
    var tween = function (option) {
        this.from = is.isAvalid(option.from) ? option.from : 0;
        this.to = is.isAvalid(option.to) ? option.to : 100;
        if (is.isString(option.fn)) {
            this.fn = tweenmapping[option.type] || tweenmapping["ease-out-quart"];
        } else if (is.isFunction(option.fn)) {
            this.fn = option.fn;
        } else {
            this.fn = tweenmapping["ease-out-quart"];
        }
        this.during = Math.round((option.during || 1000) / 16.7);
        this.onrunning = option.onrunning;
        this.onend = option.onend;
        this.delay = is.isAvalid(option.delay) ? option.delay : 0;
        this.isstop = true;
    };
    tween._run = function () {
        var start = 0, during = this.during, offset = this.to - this.from, ths = this;
        var run = function () {
            start++;
            ths.onrunning && ths.onrunning.call(ths, ths.fn(start, ths.from, offset, during));
            if (start < during && !ths.isstop) {
                requestAnimationFrame(run);
            } else {
                ths.onend && ths.onend.call(ths);
                ths.isstop = true;
            }
        };
        run();
    };
    tween._runs = function () {
        var start = 0, during = this.during;
        var offset = [], ths = this;
        for (var i = 0; i < this.from.length; i++) {
            offset.push(this.to[i] || 0 - this.from[i]);
        }
        var run = function () {
            start++;
            var news = [];
            for (var i = 0; i < ths.from.length; i++) {
                news.push(ths.fn(start, ths.from[i], offset[i], during));
            }
            ths.onrunning && ths.onrunning.call(ths, news);
            if (start < during && !ths.isstop) {
                requestAnimationFrame(run);
            } else {
                ths.onend && ths.onend.call(ths);
                ths.isstop = true;
            }
        };
        run();
    };
    tween._runo = function () {
        var start = 0, during = this.during;
        var offset = {}, ths = this;
        for (var i in this.from) {
            offset[i] = this.to[i] || 0 - this.from[i];
        }
        var run = function () {
            start++;
            var news = {};
            for (var i in ths.from) {
                news[i] = ths.fn(start, ths.from[i], offset[i], during);
            }
            ths.onrunning && ths.onrunning.call(ths, news);
            if (start < during && !ths.isstop) {
                requestAnimationFrame(run);
            } else {
                ths.onend && ths.onend.call(ths);
                ths.isstop = true;
            }
        };
        run();
    };
    tween.prototype.start = function () {
        var ths = this;
        this.isstop = false;
        setTimeout(function () {
            if (is.isArray(ths.from)) {
                tween._runs.call(ths);
            } else if (is.isObject(ths.from)) {
                tween._runo.call(ths);
            } else if (is.isNumber(ths.from)) {
                tween._run.call(ths);
            }
        }, this.delay);
        return this;
    };
    tween.prototype.stop = function () {
        this.isstop = true;
        return this;
    };
    tween.prototype.isRunning = function () {
        return this.isstop === true;
    };
    tween.prototype.clean = function () {
        for (var i in this) {
            this[i] = null;
        }
    };
    bright.tween = function (option) {
        return new tween(option);
    };

    var request = function (option) {
        this.mimeType = null;
        this.data = option.data || "";
        this.url = option.url || "";
        this.realURL = option.url || "";
        this.type = option.type || "post";
        this.realType = option.dataType || "text";
        this.dataType = ["arraybuffer", "blob", "document", "text"].indexOf(option.dataType) !== -1 ? option.dataType : "text";
        this.async = option.async === false ? false : true;
        this.timeout = option.timeout || 3000000;
        this.headers = option.headers || {};
        this.events = bright.extend({
            readystatechange: null,
            loadstart: null,
            progress: null,
            abort: null,
            error: null,
            load: null,
            timeout: null,
            loadend: null
        }, option.events);
        var ths = this;
        this._eventproxy = function (e) {
            var deal = ths.events[e.type];
            ths.response = this;
            deal && deal.call(ths, e);
            if (e.type === "loadend") {
                ths.clean();
            }
        };
        this._uploadproxy = function (e) {
            var deal = ths.events[e.type];
            ths.response = this;
            deal && deal.call(ths, e);
        };
        this.xhr = new XMLHttpRequest();
    };
    request.prototype.clean = function () {
        for (var i in this.events) {
            if (i === "progress") {
                this.xhr.upload.removeEventListener(i, this._uploadproxy, false);
            } else {
                this.xhr.removeEventListener(i, this._eventproxy, false);
            }
        }
        for (var i in this) {
            this[i] = null;
        }
    };
    request.prototype.abort = function () {
        this.xhr.abort();
        return this;
    };
    request.prototype.header = function (params, val) {
        if (arguments.length === 1) {
            for (var i in params) {
                this.headers[i] = params[i];
            }
        } else {
            this.headers[params] = val;
        }
        return this;
    };
    request.prototype.bind = function (type, fn) {
        if (arguments.length === 1) {
            for (var i in type) {
                this.events[i] = type[i];
            }
        } else {
            this.events[type] = fn;
        }
        return this;
    };
    request.prototype.unbind = function (type, fn) {
        var m = this.events[type];
        for (var i in m) {
            if (m[i] === fn) {
                m[i] = null;
            }
        }
        return this;
    };
    request.prototype.fire = function () {
        if (this.mimeType) {
            this.xhr.overrideMimeType(this.mimeType);
        }
        if (this.type === "get") {
            var querystr = serialize.queryString(this.data);
            this.url += (this.url.indexOf("?") !== -1 ? (querystr === "" ? "" : "&" + querystr) : (querystr === "" ? "" : "?" + querystr));
        } else {
            this.data = serialize.postData(this.data);
        }
        this.xhr.open(this.type, this.url, this.async);
        if (this.async) {
            this.xhr.responseType = this.dataType;
            this.xhr.timeout = this.timeout;
        }
        for (var i in this.events) {
            if (i === "progress") {
                this.xhr.upload.addEventListener(i, this._uploadproxy, false);
            } else {
                this.xhr.addEventListener(i, this._eventproxy, false);
            }
        }
        this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        for (var i in this.headers) {
            this.xhr.setRequestHeader(i, this.headers[i]);
        }
        if (is.isQueryString(this.data)) {
            this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        this.xhr.send(this.data);
        return this;
    };
    bright.ajax = function (option) {
        var pros = new promise();
        if (option) {
            option.events = bright.extend({
                error: function (e) {
                    option.error && option.error.call(this, e);
                    pros.reject(e);
                },
                load: function (e) {
                    var status = this.response.status;
                    if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                        var result = this.response.response;
                        if (this.realType === "json") {
                            var txt = this.response.responseText;
                            try {
                                result = json.parse(txt);
                            } catch (e) {
                                throw Error("[bright] ajax unvaliable json string,url is '" + option.url + "'");
                            }
                        }
                        option.success && option.success.call(this, result);
                        pros.resolve(result);
                    } else {
                        option.error && option.error.call(this, e);
                        pros.reject(this.response);
                    }
                }
            }, option.events);
            new request(option).fire();
            return pros;
        } else {
            return pros.resolve();
        }
    };
    bright.request = function (option) {
        return new request(option);
    };

    var loader = {
        importsmapping: {
            js: [],
            css: [],
            hasJs: function (path) {
                return this.js.indexOf(path) !== -1 ? true : false;
            },
            hasCss: function (path) {
                return this.css.indexOf(path) !== -1 ? true : false;
            },
            addJs: function (path) {
                this.js.push(path);
                return this;
            },
            addCss: function (path) {
                this.css.push(path);
                return this;
            }
        },
        css: function (csspath, callback, error, async) {
            if (async === undefined || async === null) {
                async = false;
            }
            if (!loader.importsmapping.hasCss(csspath)) {
                if (!async) {
                    var _a = document.createElement("link"), interval = null;
                    _a.href = csspath;
                    _a.type = "text/css";
                    _a.rel = "stylesheet";
                    var _oe = function (e) {
                        _a.removeEventListener("error", _oe);
                        _a.removeEventListener("load", _ol);
                        error && error.call(e.target, e);
                    };
                    var _ol = function (e) {
                        _a.removeEventListener("error", _oe);
                        _a.removeEventListener("load", _ol);
                        if (callback) {
                            clearTimeout(interval);
                            callback.call(e.target, e);
                        }
                    };
                    _a.addEventListener("error", _oe, false);
                    _a.addEventListener("load", _ol, false);
                    document.getElementsByTagName("head")[0].appendChild(_a);
                    loader.importsmapping.addCss(csspath);
                    var tpt = function () {
                        try {
                            if (_a.sheet.cssRules) {
                                if (_a.sheet.cssRules.length > 0) {
                                    _a.removeEventListener("error", _oe);
                                    _a.removeEventListener("load", _ol);
                                    callback && callback.call(_a);
                                }
                            }
                        } catch (e) {
                            interval = setTimeout(tpt, 100);
                        }
                    };
                    tpt();
                } else {
                    bright.ajax({
                        url: csspath,
                        dataType: "text",
                        type: "get",
                        async: true,
                        success: function (e) {
                            var _a = document.createElement("style");
                            _a.type = "text/css";
                            _a.setAttribute("media", "screen");
                            _a.appendChild(document.createTextNode(e));
                            document.getElementsByTagName("head")[0].appendChild(_a);
                            if (callback) {
                                callback(e);
                            }
                        },
                        error: function (e) {
                            if (error) {
                                error();
                            }
                        }
                    });
                    loader.importsmapping.addJs(csspath);
                }
            } else {
                callback && callback();
            }
            return this;
        },
        js: function (jspath, callback, error, props, async) {
            if (async === undefined || async === null) {
                async = true;
            }
            if (!loader.importsmapping.hasJs(jspath)) {
                if (async) {
                    var _ol = function (e) {
                        e.target.removeEventListener("load", _ol);
                        e.target.removeEventListener("error", _oe);
                        if (callback)
                            callback.call(e.target, e);
                    };
                    var _oe = function (e) {
                        e.target.removeEventListener("load", _ol);
                        e.target.removeEventListener("error", _oe);
                        if (error)
                            error.call(e.target, e);
                    };
                    var _a = document.createElement("script");
                    _a.src = jspath;
                    _a.type = "text/javascript";
                    for (var i in props) {
                        _a[i] = props[i];
                    }
                    _a.addEventListener("load", _ol, false);
                    _a.addEventListener("error", _oe, false);
                    document.getElementsByTagName("head")[0].appendChild(_a);
                    loader.importsmapping.addJs(jspath);
                } else {
                    bright.ajax({
                        url: jspath,
                        dataType: "text",
                        type: "get",
                        async: false,
                        success: function (e) {
                            (new Function("try{" + e + "}catch(e){console.error('[bright]imports: %s ,path " + jspath + "',e.message);}"))();
                            if (callback) {
                                callback();
                            }
                        },
                        error: function (e) {
                            if (error) {
                                error();
                            }
                        }
                    });
                    loader.importsmapping.addJs(jspath);
                }
            } else {
                if (callback)
                    callback();
            }
            return this;
        },
        image: function (url, callback, error) {
            var _a = document.createElement("img");
            var _ol = function (e) {
                e.target.removeEventListener("load", _ol);
                e.target.removeEventListener("error", _oe);
                if (callback)
                    callback.call(e.target, e);
            };
            var _oe = function (e) {
                e.target.removeEventListener("load", _ol);
                e.target.removeEventListener("error", _oe);
                if (error)
                    error.call(e.target, e);
            };
            _a.src = url;
            _a.addEventListener("load", _ol, false);
            _a.addEventListener("error", _oe, false);
            return this;
        },
        text: function (url, success, error, data) {
            bright.ajax({
                url: url,
                data: data,
                dataType: "text",
                success: success,
                type: "get",
                error: error
            });
            return this;
        },
        html: function (url, success, error, data) {
            bright.ajax({
                url: url,
                data: data,
                dataType: "text",
                success: success,
                type: "get",
                error: error
            });
            return this;
        },
        json: function (url, success, error, data) {
            bright.ajax({
                url: url,
                data: data,
                dataType: "json",
                success: success,
                type: "get",
                error: error
            });
            return this;
        },
        load: function (mapping, onload, onprogress, onerror) {//{js:[],css:[],dom:[],json:[]}
            if (mapping) {
                var que = new queue();
                for (var i in mapping) {
                    for (var j in mapping[i]) {
                        que.add(function (a, b) {
                            var q = this;
                            loader[b.type](b.path, function (e) {
                                q.next();
                            }, function (e) {
                                if (onerror)
                                    onerror.call(q, b.type, b.path);
                            });
                        }, null, {type: i, path: mapping[i][j]});
                    }
                }
                que.complete(function () {
                    if (onload)
                        onload();
                }).progress(function (k) {
                    if (onprogress)
                        onprogress({
                            total: k.total,
                            runed: k.runed,
                            progress: Math.floor((k.runed / k.total) * 100)
                        });
                }).run();
            } else {
                if (onload) {
                    onload();
                }
            }
        }
    };
    bright.loader = function () {
        return loader;
    };

    var baseMapping = {
        id: "",
        preload: [],
        basePath: "",
        debug: false,
        update: -1,
        sourceMapping: {},
        pretreat: null,
        urlfilter: null,
        cacheReset: false,
        onpreloadprogress: null,
        docode: function (str) {
            return str;
        },
        observers: {},
        onimportstart: function (e) {
            baseMapping.observers[e.packet] && baseMapping.observers[e.packet].onimportstart && baseMapping.observers[e.packet].onimportstart(e);
        },
        onimportprogress: function (e) {
            baseMapping.observers[e.packet] && baseMapping.observers[e.packet].onimportprogress && baseMapping.observers[e.packet].onimportprogress(e);
        },
        onimportend: function (e) {
            baseMapping.observers[e.packet] && baseMapping.observers[e.packet].onimportend && baseMapping.observers[e.packet].onimportend(e);
        }
    };
    var bootstrap = function (obj) {
        bright.extend(baseMapping, {
            id: obj.id ? obj.id.toUpperCase() : "",
            preload: obj.preload,
            basePath: (obj.basePath[obj.basePath.length - 1] === "/" ? obj.basePath : obj.basePath + "/"),
            debug: obj.debug,
            update: obj.update,
            sourceMapping: obj.sourceMapping
        });
        if (is.isEmptyObject(baseMapping.sourceMapping)) {
            baseMapping.persistence = false;
        } else {
            baseMapping.persistence = true;
        }
    };
    bootstrap.prototype.pretreat = function (fn) {
        if (fn) {
            baseMapping.pretreat = fn;
        }
        return this;
    };
    bootstrap.prototype.setPreloadListener = function (fn) {
        baseMapping.onpreloadprogress = fn;
        return this;
    };
    bootstrap.prototype.setImportListener = function (packetName, callbacks) {
        if (arguments.length === 2) {
            baseMapping.observers[packetName] = callbacks;
        } else if (arguments.length === 1 && is.isObject(packetName)) {
            baseMapping.onimportstart = packetName.onimportstart || null;
            baseMapping.onimportprogress = packetName.onimportprogress || null;
            baseMapping.onimportend = packetName.onimportend || null;
        }
        return this;
    };
    bootstrap.prototype.setCodeRewriter = function (fn) {
        if (fn) {
            packet.docode = fn;
        }
        return this;
    };
    bootstrap.prototype.setPathFilter = function (fn) {
        if (is.isFunction(fn)) {
            baseMapping.urlfilter = fn;
        }
        return this;
    };
    bootstrap.prototype.setAppUpdateListener = function (fn) {
        if (fn) {
            baseMapping.appupdate = fn;
        }
        return this;
    };
    bootstrap.prototype.boot = function (selector, optionName) {
        if (baseMapping.persistence) {
            var idcode = "PACKETBUILD[" + baseMapping.id + "]";
            try {
                var a = window.localStorage.getItem(idcode);
                var b = a.match(/[0-9]+/), c = 0;
                if (b) {
                    c = parseInt(b[0]);
                }
                baseMapping.currentBuild = c;
            } catch (e) {
                baseMapping.currentBuild = 0;
            }
            var cid = parseInt(baseMapping.sourceMapping.build.substring(baseMapping.id.length));
            baseMapping.update = parseInt(baseMapping.update);
            if (baseMapping.update === 0 || baseMapping.currentBuild <= baseMapping.update || baseMapping.currentBuild > cid) {
                if (baseMapping.currentBuild !== 0) {
                    baseMapping.cacheReset = true;
                    try {
                        baseMapping.appupdate && baseMapping.appupdate({old: baseMapping.currentBuild, current: baseMapping.sourceMapping.build, update: baseMapping.update});
                    } catch (e) {
                        console.error("[bright] onappupdate called error " + e.message);
                    }
                }
            }
        } else {
            baseMapping.update = -1;
            baseMapping.currentBuild = 0;
            baseMapping.cacheReset = true;
        }
        packet.jspersistence = new filepersistence("js");
        packet.csspersistence = new filepersistence("css");
        packet.jsonpersistence = new filepersistence("json");
        packet.textpersistence = new filepersistence("text");
        packet.htmlpersistence = new filepersistence("html");
        packet.imagepersistence = new filepersistence("image");
        packet.templatepersistence = new filepersistence("template");
        packet.codepersistence = new filepersistence("code");
        packet.otherpersistence = new filepersistence("other");
        try {
            window.localStorage.setItem(idcode, baseMapping.sourceMapping.build);
        } catch (e) {
        }
        if (baseMapping.debug) {
            bright.debug = {
                modules: module.factory,
                options: option.options,
                json: packet.jsonpersistence._data,
                resource: {
                    js: packet.jspersistence,
                    css: packet.cssmapping,
                    text: packet.textpersistence,
                    html: packet.htmlpersistence,
                    image: packet.imagepersistence
                },
                require: packet.requiremapping,
                doms: packet.templatepersistence._data
            };
        }
        var dom = null, arg = arguments.length;
        bright().ready(function () {
            if (arg === 1) {
                dom = $("body");
                optionName = selector;
            } else if (arg === 2) {
                dom = $(selector);
            }
            packet.preload(function () {
                packet.pretreat().done(function () {
                    if (is.isString(optionName)) {
                        dom.dataset("view", "root").dataset("viewId", "root").dataset("option", optionName);
                        optionName = {};
                    } else {
                        dom.dataset("view", "root").dataset("viewId", "root").dataset("option", "");
                    }
                    baseMapping.debug && console.log("[bright] version:0.10.4,debug:" + baseMapping.debug + ",basePath:" + baseMapping.basePath);
                    var root = bright("*[data-view='root']");
                    if (root.length > 0) {
                        module.getViewInstance(root, optionName, function (a) {
                            a.privator("render");
                        });
                    } else {
                        throw Error("[bright boot] can not find the root element.");
                    }
                });
            });
        });
    };
    bright.App = function (obj) {
        return new bootstrap(obj);
    };

    var packetInfo = function () {
        this._packets_ = {};
        this.exports = {};
        this._depends = [];
        this.children = [];
        this.packet = "";
        this.require = [];
        this.include = [];
        this.template = [];
        this.js = [];
        this.css = [];
        this.html = [];
        this.json = [];
        this.image = [];
        this.text = [];
        this.usestrict = false;
    };
    packetInfo.prototype.getTemplate = function (packetName, key) {
        for (var i in this.template) {
            if (this.template[i].packet === packetName) {
                return this.template[i].value[key] || "";
            }
        }
    };
    packetInfo.prototype.getJson = function (packetName) {
        for (var i in this.json) {
            if (this.json[i].packet === packetName) {
                return this.json[i].value || {};
            }
        }
    };
    packetInfo.prototype.getImage = function (packetName) {
        for (var i in this.image) {
            if (this.image[i].packet === packetName) {
                return this.image[i].value || {};
            }
        }
    };
    packetInfo.prototype.getHtml = function (packetName) {
        for (var i in this.html) {
            if (this.html[i].packet === packetName) {
                return this.html[i].value || {};
            }
        }
    };
    packetInfo.prototype.getText = function (packetName) {
        for (var i in this.text) {
            if (this.text[i].packet === packetName) {
                return this.text[i].value || {};
            }
        }
    };
    packetInfo.prototype.getParent = function () {
        return packet.requiremapping[this.parent] || {};
    };
    packetInfo.prototype.getChild = function (num) {
        if (num >= 0 && num < this.children.length) {
            return packet.requiremapping[this.children[num]] || {};
        }
    };
    packetInfo.prototype.getChildren = function () {
        var a = [];
        for (var i = 0; i < this.children.length; i++) {
            a.push(packet.requiremapping[this.children[i]]);
        }
        return a;
    };

    var filepersistence = function (type) {
        this.type = type;
        this.cacheId = "PACKETCACHE[" + baseMapping.id + ":" + this.type.toUpperCase() + "]";
        this._data = {};
        this.currentTempHash = baseMapping.sourceMapping ? (baseMapping.sourceMapping[this.type] || {}) : {};
        this.init();
    };
    filepersistence.getStaitcFile = function (type, packetis, fn) {
        var a = packet[type + "persistence"];
        if (a && type === "json" || type === "html" || type === "text" || type === "image") {
            var path = filepersistence.getStaticPath(type, packetis), has = true;
            if (!path) {
                has = false;
                path = baseMapping.basePath + packetis.replace(/\./g, "/") + "." + type;
            }
            if (!has) {
                if (baseMapping.sourceMapping && baseMapping.sourceMapping[type][packetis]) {
                    a.set(packetis, baseMapping.sourceMapping[type][packetis], path).save();
                }
            }
            loader[type](filepersistence.getStaticPath(type, packetis), function (e) {
                fn && fn(e);
            });
        }
    };
    filepersistence.getStaticPath = function (type, packetis) {
        var a = packet[type + "persistence"], path = null;
        if (baseMapping.sourceMapping && baseMapping.sourceMapping[type] && baseMapping.sourceMapping[type][packetis]) {
            if (a.check(packetis)) {
                path = a.get(packetis);
            } else {
                if (type !== "json" && type !== "text" && type !== "html") {
                    var u = packetis.match(packet.issuffix), suffix = "." + type;
                    if (type === "image") {
                        suffix = "png";
                    }
                    if (u) {
                        suffix = u[0].substring(1, u[0].length - 1);
                    }
                    path = baseMapping.basePath + packetis.replace(packet.issuffix, "").replace(packet.isdot, "/") + suffix;
                } else {
                    path = baseMapping.basePath + packetis.split(".").join("/") + (type === "json" ? ".json" : (type === "html" ? ".html" : (type === "text") ? ".txt" : ".json"));
                }
                a.set(packetis, baseMapping.sourceMapping[type][packetis], path).save();
            }
        } else {
            if (type !== "json" && type !== "text" && type !== "html") {
                var u = packetis.match(packet.issuffix), suffix = "." + type;
                if (type === "image") {
                    suffix = "png";
                }
                if (u) {
                    suffix = u[0].substring(1, u[0].length - 1);
                }
                path = baseMapping.basePath + packetis.replace(packet.issuffix, "").replace(packet.isdot, "/") + suffix;
            } else {
                path = baseMapping.basePath + packetis.split(".").join("/") + (type === "json" ? ".json" : (type === "html" ? ".html" : (type === "text") ? ".txt" : ".json"));
            }
        }
        return path;
    };
    filepersistence.prototype.save = function () {
        if (baseMapping.persistence) {
            var ths = this;
            setTimeout(function () {
                try {
                    window.localStorage.setItem(ths.cacheId, window.JSON.stringify(ths._data));
                } catch (e) {
                }
            }, 0);
        }
    };
    filepersistence.prototype.clean = function () {
        try {
            window.localStorage.removeItem(this.cacheId);
        } catch (e) {
            console.log(e);
        }
    };
    filepersistence.prototype.init = function () {
        if (baseMapping.persistence) {
            if (baseMapping.cacheReset) {
                try {
                    window.localStorage.removeItem(this.cacheId);
                } catch (e) {
                }
            }
            try {
                var t = window.JSON.parse(window.localStorage.getItem(this.cacheId)) || {};
                this._data = t;
            } catch (e) {
            }
        } else {
            try {
                window.localStorage.removeItem(this.cacheId);
            } catch (e) {
            }
        }
        return this;
    };
    filepersistence.prototype.get = function (packet) {
        return this._data[packet] ? this._data[packet].data : null;
    };
    filepersistence.prototype.has = function (packet, hash) {
        return this._data[packet] && this.data[packet].hash === hash;
    };
    filepersistence.prototype.set = function (packet, hash, data) {
        this._data[packet] = {
            hash: hash,
            data: data
        };
        return this;
    };
    filepersistence.prototype.check = function (packet) {
        var has = this.getCurrentHash(packet);
        var old = this._data[packet] ? this._data[packet].hash : null;
        return has && has === old;
    };
    filepersistence.prototype.getCurrentHash = function (packet) {
        return this.currentTempHash[packet];
    };
    filepersistence.prototype.isLoaded = function () {
        return !is.isEmptyObject(this._data);
    };

    var pretreat = function (promise) {
        this.promise = promise;
    };
    pretreat.prototype.done = function () {
        this.promise.resolve();
    };
    pretreat.prototype.json = function (packet, fn) {
        filepersistence.getStaitcFile("json", packet, fn);
    };
    pretreat.prototype.html = function (packet, fn) {
        filepersistence.getStaitcFile("html", packet, fn);
    };
    pretreat.prototype.text = function (packet, fn) {
        filepersistence.getStaitcFile("text", packet, fn);
    };
    pretreat.prototype.image = function (packet, fn) {
        filepersistence.getStaitcFile("image", packet, fn);
    };
    pretreat.prototype.path = function (type, packetis) {
        filepersistence.getStaticPath(type, packetis);
    };

    var packet = function (option) {
        var ops = {
            basepath: baseMapping.basePath,
            packetName: "",
            back: null,
            target: "",
            onimportstart: baseMapping.onimportstart,
            onimportend: baseMapping.onimportend,
            onimportprogress: baseMapping.onimportprogress
        }, ths = this;
        bright.extend(ops, option);
        if (ops.packetName !== "") {
            var hassuffix = ops.packetName.match(packet.issuffix), suffix = null;
            if (hassuffix) {
                suffix = hassuffix[0].substring(1, hassuffix[0].length - 1);
//                ops.packetName = ops.packetName.replace(packet.issuffix, "");
            }
            var path = ops.basepath + ops.packetName.replace(packet.isdot, "/") + (suffix ? "." + suffix : ".js");
            this.option = ops;
            this.option["path"] = path;
            this.info = [];
            if (packet.packetmapping.indexOf(path) === -1) {
                ops.onimportstart && ops.onimportstart({
                    packet: ops.packetName,
                    path: path
                });
                this.load(ops.packetName, path, function () {
                    var re = packet.dependsSort.call(ths, ths.info);
                    if (re.length === ths.info.length) {
                        ths.info = re;
                        for (var i = 0; i < ths.info.length; i++) {
                            var d = ths.info[i].info;
                            packet.requiremapping[d.packet] = d;
                            var xp = packet.docode(ths.info[i].code, d), xcode = "";
                            xp = packet.deleteR(xp) + "$.is.isEmptyObject(module.exports)?(module.exports=exports):'';";
                            if (d.usestrict === "true") {
                                d.usestrict = true;
                                if (baseMapping.debug) {
                                    xcode = "\"use strict\";" + xp + "//# sourceURL=" + d.path;
                                } else {
                                    xcode = xp;
                                }
                            } else {
                                if (baseMapping.debug) {
                                    xcode = xp + "//# sourceURL=" + d.path;
                                } else {
                                    xcode = xp;
                                }
                            }
                            try {
                                d["basePath"] = ops.basepath;
                                d["folder"] = d.path.substring(0, d.path.lastIndexOf("/")) + "/";
                                bright.___info = d;
                                new Function("$", "Module", "Option", "module", "exports", "require", "Plugin", "Method", xcode).call(
                                        d, bright, bright.Module, bright.Option, d, {},
                                        function (packetName) {
                                            var ap = packet.requiremapping[packetName];
                                            if (ap) {
                                                return ap.exports;
                                            } else {
                                                throw Error("[bright] method require() called error,packet of " + packetName + " is not required in packet of " + d.packet);
                                            }
                                        }, function (obj) {
                                    bright.Plugin(obj);
                                }, function (obj) {
                                    bright.Method(obj);
                                });
                                bright.___info = null;
                            } catch (e) {
                                bright.___info = null;
                                console.error("[bright] packet import error name of " + d.packet + " path of " + d.path + " Message:" + e.stack);
                            }
                        }
                        packet.packetmapping.push(path);
                        ths.option.back && ths.option.back();
                        ths.option.onimportend && ths.option.onimportend({
                            packet: ths.option.packetName,
                            path: ths.option.path
                        });
                    } else {
                        throw Error("[bright] packet _depends error,maybe has circle _depends,or some file has no packet info.");
                    }
                    ths.clean();
                }, ops.target);
            } else {
                ths.option.back && ths.option.back();
                ths.clean();
            }
        }
    };
    packet.i = /\r\n/g;
    packet.k = /\r/g;
    packet.l = /\n/g;
    packet.f = />[\s]+</g;
    packet.isdot = /\./g;
    packet.issuffix = /\[.*\]/g;
    packet.isNote = /\/\*[\w\W]*?\*\//;
    packet.isNoteall = /\/\*[\w\W]*?\*\//g;
    packet.isInfo = /@([\s\S]*?);/g;
    packet.isPacketTag = /["\']@[A-Za-z0-9_\[\]-]+\.[A-Za-z0-9_-]*["\']/g;
    packet.isCurrentTag = /["\']@\.[A-Za-z0-9_-]+["\']/g;
    packet.isPacket = /["\']@[A-Za-z0-9_\[\]-]+["\']/g;
    packet.isOther = /["\']\\@[A-Za-z0-9_-]+["\']/g;
    packet.isNotep = /\<\!\-\-\[[0-9a-zA-Z-_]*?\]\-\-\>/;
    packet.isNotes = /\<\!\-\-\[[0-9a-zA-Z-_]*?\]\-\-\>/g;
    packet.isNotec = /\<\!\-\-[\s\S]*?\-\-\>/g;
    packet.isNotet = /\<\!\-\-\[@[\s\S]*?;\]\-\-\>/;
    packet.isNotets = /\<\!\-\-\[@[\s\S]*?;\]\-\-\>/g;
    packet.isCssPath = /url\(.+?\)/g;
    packet.packetmapping = [];
    packet.cssmapping = [];
    packet.jsmapping = [];
    packet.imagemapping = {};
    packet.requiremapping = {};
    packet.packetDone = [];
    packet.deleteR = function (str) {
        if (baseMapping.debug) {
            for (var i = 0; i < 2; i++) {
                str = str.replace(/\n/, "");
            }
            return str;
        } else {
            return str;
        }
    };
    packet.docode = function (str) {
        return str;
    };
    packet.pretreat = function () {
        var ps = bright.promise();
        if (baseMapping.pretreat) {
            baseMapping.pretreat.call(new pretreat(ps));
        } else {
            ps.resolve();
        }
        return ps;
    };
    packet.dependsSort = function (mapping) {
        var k = [], kk = [];
        for (var i = 0; i < mapping.length; i++) {
            var a = mapping[i];
            a.dependTimes = a.info._depends.length;
            for (var j = 0; j < a.info._depends.length; j++) {
                var n = a.info._depends[j];
                if (packet.packetDone.indexOf(n) !== -1) {
                    a.dependTimes = a.dependTimes - 1;
                }
            }
        }
        for (var i = 0; i < mapping.length; i++) {
            var a = mapping[i];
            if (a.dependTimes === 0 || a.info._depends.length === 0) {
                packet.packetDone.push(a.info.packet);
                k.push(a);
            } else {
                a.dependTimes = a.info._depends.length;
                kk.push(a);
            }
        }
        for (var i = 0; i < k.length; i++) {
            var a = k[i];
            for (var j = 0; j < kk.length; j++) {
                var b = kk[j];
                if (b.info._depends.indexOf(a.info.packet) !== -1) {
                    b.dependTimes = b.dependTimes - 1;
                    if (b.dependTimes <= 0) {
                        packet.packetDone.push(b.info.packet);
                        k.push(b);
                        kk.splice(j, 1);
                        break;
                    }
                }
            }
        }
        for (var i = 0; i < kk.length; i++) {
            var a = kk[i];
            for (var j = 0; j < a.info._depends.length; j++) {
                var b = a.info._depends[j];
                if (packet.packetDone.indexOf(b) !== -1) {
                    a.dependTimes = a.dependTimes - 1;
                    if (a.dependTimes <= 0) {
                        packet.packetDone.push(a.packet);
                        k.push(a);
                        kk.splice(i, 1);
                        break;
                    }
                }
            }
        }
        return k;
    };
    packet.getPacketInfo = function (str) {
        var a = str.match(packet.isNote), basepath = this.option.basepath, n = new packetInfo();
        if (a && a.length > 0) {
            var b = a[0];
            var tp = b.match(packet.isInfo);
            for (var o = 0; o < tp.length; o++) {
                var a = tp[o];
                var d = a.split(" ");
                if (d.length >= 2) {
                    var key = d[0].substring(1, d[0].length), value = d[1][d[1].length - 1] === ";" ? d[1].substring(0, d[1].length - 1) : d[1], suffix = null;
                    if (!n[key]) {
                        n[key] = [];
                    }
                    var u = value.match(packet.issuffix);
                    if (u) {
                        suffix = u[0].substring(1, u[0].length - 1);
                    }
                    var t = value.split(":");
                    if (t.length > 1) {
                        var mt = t[t.length - 1];
                        if (key !== "image") {
                            mt = mt.replace(packet.issuffix, "");
                        }
                        t.splice(t.length - 1, 1);
                        value = t.join(":");
                        n._packets_[mt] = value;
                    } else {
                        var m = t[0].split("\.");
                        var mt = m[m.length - 1];
                        if (key !== "image") {
                            mt = mt.replace(packet.issuffix, "");
                        }
                        n._packets_[mt] = t[0];
                    }
                    switch (key) {
                        case "packet":
                            n.packet = value.replace(packet.issuffix, "");
                            n["path"] = basepath + n.packet.replace(packet.isdot, "/") + ".js";
                            break;
                        case "require":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: "",
                                value: null
                            };
                            n._depends.push(t[0]);
                            n.children.push(t[0]);
                            value.path = basepath + t[0].replace(packet.issuffix, "").replace(packet.isdot, "/") + ".js";
                            break;
                        case "include":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: "",
                                value: null
                            };
                            n.children.push(t[0]);
                            value.path = basepath + t[0].replace(packet.issuffix, "").replace(packet.isdot, "/") + ".js";
                            break;
                        case "json":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: basepath + value.replace(packet.issuffix, "").replace(packet.isdot, "/") + ".json",
                                value: null
                            };
                            break;
                        case "template":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: basepath + value.replace(packet.issuffix, "").replace(packet.isdot, "/") + ".html",
                                value: null
                            };
                            break;
                        case "html":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: basepath + value.replace(packet.issuffix, "").replace(packet.isdot, "/") + ".html",
                                value: null
                            };
                            break;
                        case "image":
                            value = {
                                packet: value,
                                path: basepath + value.replace(packet.issuffix, "").replace(packet.isdot, "/") + (suffix ? "." + suffix : ".png"),
                                value: null
                            };
                            break;
                        case "text":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: basepath + value.replace(packet.issuffix, "").replace(packet.isdot, "/") + ".txt",
                                value: null
                            };
                            break;
                        case "css":
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: "",
                                value: null
                            };
                            if (value.packet.indexOf("http") === -1) {
                                if (value.packet.indexOf("/") === -1) {
                                    value.path = basepath + value.packet.replace(packet.issuffix, "").replace(packet.isdot, "/") + ".css";
                                } else {
                                    value.path = basePath + value.packet;
                                }
                            }
                            break;
                        case "js":
                            var q = value;
                            value = {
                                packet: value.replace(packet.issuffix, ""),
                                path: "",
                                value: null
                            };
                            if (value.packet.indexOf("http") === -1) {
                                if (value.packet.indexOf("/") === -1) {
                                    value.path = basepath + value.packet.replace(packet.issuffix, "").replace(packet.isdot, "/") + ".js";
                                } else {
                                    value.path = basePath + value.packet;
                                }
                            } else {
                                value.path = q;
                            }
                            break;
                        default:
                            n[key] = value;
                            break;
                    }
                    if (n[key].indexOf(value) === -1) {
                        n[key].push(value);
                    }
                }
            }
        } else {
            n.packet = "nopacket";
        }
        return n;
    };
    packet.replacePacketNames = function (info, code) {
        return code.replace(packet.isPacketTag, function (str) {
            var a = str.split("\."), index = 0, key = a[1].substring(0, a[1].length - 1), index = a[0].substring(2);
            if (info._packets_[index]) {
                return str[0] + info._packets_[index] + "." + key + str[str.length - 1];
            } else {
                throw Error("[bright] packet can not find with tag of " + str + ",packet is " + info.packet);
            }
        }).replace(packet.isCurrentTag, function (str) {
            return str[0] + info.packet + "." + str.split("\.")[1];
        }).replace(packet.isPacket, function (str) {
            var index = str.substring(2, str.length - 1);
            if (info._packets_[index]) {
                return str[0] + info._packets_[index] + str[str.length - 1];
            } else {
                throw Error("[bright] packet can not find with tag of " + str + ",packet is " + info.packet);
            }
        }).replace(packet.isOther, function (str) {
            return str.substring(1);
        });
    };
    packet.parseCode = function (codetext) {
        var info = [], a = packet.isNoteall.exec(codetext);
        while (a) {
            var _packet = a[0].match(/@packet .*;/);
            if (_packet) {
                var ab = _packet[0].substring(8, _packet[0].length - 1).split(" ");
                _packet = ab[0];
                info.push({
                    index: a.index,
                    packet: _packet
                });
            }
            a = packet.isNoteall.exec(codetext);
        }
        for (var i = 0; i < info.length; i++) {
            var end = info[i + 1] ? info[i + 1].index : codetext.length;
            packet.codepersistence.set(info[i].packet, packet.codepersistence.getCurrentHash(info[i].packet), codetext.substring(info[i].index, end)).save();
        }
    };
    packet.parseTemplate = function (template) {
        template = template.replace(packet.f, "><").replace(packet.i, "").replace(packet.k, "").replace(packet.l, "");
        var _a = template.split(packet.isNotet);
        if (_a.length > 1) {
            var _b = template.match(packet.isNotets);
            for (var i = 0; i < _b.length; i++) {
                var _pn = _b[i].substring(13, _b[i].length - 5).split(" ");
                var pn = _pn[0];
                var temp = packet.replaceHtmlPath(pn, _a[i + 1]);
                if (temp !== "") {
                    var _dommapping = {}, p = temp.split(packet.isNotep), b = temp.match(packet.isNotes);
                    for (var j = 0; j < b.length; j++) {
                        var c = b[j].substring(5, b[j].length - 4);
                        _dommapping[c] = p[j + 1].replace(packet.isNotec, "");
                    }
                    packet.templatepersistence.set(pn, packet.templatepersistence.getCurrentHash(pn), _dommapping).save();
                }
            }
        }
    };
    packet.parseCss = function (css) {
        var info = [], a = packet.isNoteall.exec(css);
        while (a) {
            var _packet = a[0].match(/@packet .*;/);
            if (_packet) {
                var ab = _packet[0].substring(8, _packet[0].length - 1).split(" ");
                _packet = ab[0];
                info.push({
                    index: a.index,
                    packet: _packet
                });
            }
            a = packet.isNoteall.exec(css);
        }
        for (var i = 0; i < info.length; i++) {
            var end = info[i + 1] ? info[i + 1].index : css.length;
            var content = packet.replaceCssPath(info[i].packet, css.substring(info[i].index, end).replace(packet.isNoteall, ""));
            packet.csspersistence.set(info[i].packet, packet.csspersistence.getCurrentHash(info[i].packet), content).save();
        }
    };
    packet.preload = function (fn) {
        var queue = bright.queue();
        queue.complete(function () {
            fn && fn();
        });
        queue.progress(function (a) {
            baseMapping.onpreloadprogress && baseMapping.onpreloadprogress(a);
        });

        if (!packet.codepersistence.isLoaded()) {
            if (baseMapping.sourceMapping.source) {
                queue.add(function () {
                    var ths = this;
                    loader.js(baseMapping.sourceMapping.source, function () {
                        ths.next();
                    }, function () {
                        ths.next();
                    });
                });
            }
        }
        packet.loadpreloadFile(queue);
        queue.run();
    };
    packet.loadpreloadFile = function (queue) {
        for (var i in baseMapping.preload) {
            var p = baseMapping.preload[i];
            var f = baseMapping.basePath + "/" + p.split(".").join("/") + ".js";
            if (packet.jspersistence.check(p)) {
                f = packet.jspersistence.get(p);
            } else {
                if (baseMapping.sourceMapping && baseMapping.sourceMapping.js) {
                    var h = baseMapping.sourceMapping && baseMapping.sourceMapping.js[p];
                    if (h) {
                        packet.jspersistence.set(p, h, f).save();
                    }
                }
            }
            queue.add(function (a, b) {
                var ths = this;
                loader.js(b, function () {
                    ths.next();
                }, function () {
                    ths.next();
                });
            }, null, f);
        }
    };
    packet.loadTextFile = function (data, type, queue) {
        for (var i = 0; i < data.length; i++) {
            var path = data[i].path;
            if (!packet[type + "persistence"].check(data[i].packet)) {
                data[i].path = baseMapping.urlfilter ? baseMapping.urlfilter({
                    type: type,
                    path: path,
                    packet: data[i].packet
                }) : path;
                queue.add(function (a, b) {
                    bright.ajax({
                        url: b.path,
                        type: "get",
                        dataType: type,
                        success: function (data) {
                            if (type === "html") {
                                data = packet.replaceHtmlPath(b.packet, data);
                            }
                            b.value = data;
                            packet[type + "persistence"].set(b.packet, packet[type + "persistence"].getCurrentHash(b.packet), data).save();
                            queue.next();
                        }
                    });
                }, null, data[i]);
            } else {
                data[i].value = packet[type + "persistence"].get(data[i].packet);
            }
        }
    };
    packet.load = function (e, fn, parent, pathname) {
        var ths = this;
        var aa = packet.getPacketInfo.call(ths, e);
        aa["parent"] = parent;
        if (aa.packet === "nopacket") {
            console.error("[bright] file has no packet info,path of " + pathname);
        }
        try {
            e = packet.replacePacketNames.call(ths, aa, e);
        } catch (e) {
            console.error(e.stack);
        }
        ths.info.push({
            info: aa,
            code: e
        });
        var queue = bright.queue();
        queue.progress(function (e) {
            e["packet"] = aa.packet;
            ths.option.onimportprogress && ths.option.onimportprogress(e);
        });
        queue.complete(function () {
            fn && fn();
        });
        packet.loadTextFile(aa.json, "json", queue);
        packet.loadTextFile(aa.html, "html", queue);
        packet.loadTextFile(aa.text, "text", queue);
        for (var i = 0; i < aa.js.length; i++) {
            var path = aa.js[i].path;
            if (packet.jsmapping.indexOf(aa.js[i].path === -1)) {
                packet.jsmapping.push(path);
                if (!packet.jspersistence.check(aa.js[i].packet)) {
                    path = baseMapping.urlfilter ? baseMapping.urlfilter({
                        type: "css",
                        path: path,
                        packet: aa.js[i].packet
                    }) : path;
                    packet.jspersistence.set(aa.js[i].packet, packet.jspersistence.getCurrentHash(aa.js[i].packet), path).save();
                } else {
                    path = packet.jspersistence.get(aa.js[i].packet);
                }
                queue.add(function (a, b) {
                    loader.js(b, function () {
                        queue.next();
                    });
                }, null, path);
            }
        }
        for (var i = 0; i < aa.css.length; i++) {
            if (packet.cssmapping.indexOf(aa.css[i].path) === -1) {
                packet.cssmapping.push(aa.css[i].path);
                var path = aa.css[i].path, d = packet.csspersistence.check(aa.css[i].packet);
                if (!d) {
                    aa.css[i].path = baseMapping.urlfilter ? baseMapping.urlfilter({
                        type: "css",
                        path: path,
                        packet: aa.css[i].packet
                    }) : path;
                    queue.add(function (a, info) {
                        if (baseMapping.persistence) {
                            bright.ajax({
                                url: info.path,
                                dataType: "text",
                                type: "get",
                                async: true,
                                success: function (e) {
                                    var ce = packet.replaceCssPath(info.packet, e);
                                    var _a = document.createElement("style");
                                    _a.type = "text/css";
                                    _a.setAttribute("media", "screen");
                                    _a.setAttribute("packet", info.packet);
                                    document.getElementsByTagName("head")[0].appendChild(_a);
                                    _a.appendChild(document.createTextNode(ce));
                                    info.value = _a;
                                    packet.csspersistence.set(info.packet, packet.csspersistence.getCurrentHash(info.packet), ce).save();
                                    queue.next();
                                }
                            });
                        } else {
                            loader.css(info.path, function () {
                                queue.next();
                            });
                        }
                    }, null, aa.css[i]);
                } else {
                    var code = packet.csspersistence.get(aa.css[i].packet);
                    var _a = document.createElement("style");
                    _a.type = "text/css";
                    _a.setAttribute("media", "screen");
                    _a.setAttribute("packet", aa.css[i].packet);
                    document.getElementsByTagName("head")[0].appendChild(_a);
                    aa.css[i].value = _a;
                    _a.appendChild(document.createTextNode(code));
                }
            }
        }
        for (var i = 0; i < aa.template.length; i++) {
            var path = aa.template[i].path, d = packet.templatepersistence.check(aa.template[i].packet);
            if (!d) {
                aa.template[i].path = baseMapping.urlfilter ? baseMapping.urlfilter({
                    type: "template",
                    path: path,
                    packet: aa.template[i].packet
                }) : path;
                queue.add(function (a, info) {
                    bright.ajax({
                        url: info.path,
                        type: "get",
                        dataType: "text",
                        success: function (txt) {
                            txt = txt.replace(packet.f, "><").replace(packet.i, "").replace(packet.k, "").replace(packet.l, "");
                            txt = packet.replaceHtmlPath(info.packet, txt);
                            var _dommapping = {}, p = txt.split(packet.isNotep), b = txt.match(packet.isNotes);
                            for (var j = 0; j < b.length; j++) {
                                var c = b[j].substring(5, b[j].length - 4);
                                _dommapping[c] = p[j + 1].replace(packet.isNotec, "");
                            }
                            info.value = _dommapping;
                            packet.templatepersistence.set(info.packet, packet.templatepersistence.getCurrentHash(info.packet), _dommapping).save();
                            queue.next();
                        }
                    });
                }, null, aa.template[i]);
            } else {
                aa.template[i].value = packet.templatepersistence.get(aa.template[i].packet);
            }
        }
        for (var i = 0; i < aa.image.length; i++) {
            if (!packet.imagemapping[aa.image[i].packet]) {
                if (!packet["imagepersistence"].check(aa.image[i].packet)) {
                    var path = aa.image[i].path;
                    aa.image[i].path = baseMapping.urlfilter ? baseMapping.urlfilter({
                        type: "image",
                        path: path,
                        packet: aa.image[i].packet
                    }) : path;
                    packet["imagepersistence"].set(aa.image[i].packet, packet["imagepersistence"].getCurrentHash(aa.image[i].packet), path).save();
                } else {
                    path = packet.imagepersistence.get(aa.image[i].packet);
                }
                queue.add(function (a, b) {
                    loader.image(b.path, function () {
                        packet.imagemapping[b.packet] = this;
                        b.value = this;
                        queue.next();
                    });
                }, null, aa.image[i]);
            } else {
                aa.image[i].value = packet.imagemapping[aa.image[i].packet];
            }
        }
        for (var i = 0; i < aa.require.length; i++) {
            var path = aa.require[i].path;
            aa.require[i].path = baseMapping.urlfilter ? baseMapping.urlfilter({
                type: "js",
                path: path,
                packet: aa.require[i].packet
            }) : path;
            if (packet.packetmapping.indexOf(path) === -1) {
                packet.packetmapping.push(path);
                queue.add(function (a, b) {
                    ths.load(b.packet, b.path, function () {
                        queue.next();
                    }, b.parent);
                }, null, {
                    path: aa.require[i].path,
                    parent: aa.packet,
                    packet: aa.require[i].packet
                });
            }
        }
        queue.run();
    };
    packet.replaceCssPath = function (packetName, code) {
        var old = packet.csspersistence.get(packetName), oldpaths = [];
        if (old) {
            var t = old.match(/url\(.+?\)/g);
            if (t) {
                for (var i = 0; i < t.length; i++) {
                    oldpaths.push(t[i]);
                }
            }
        }
        var tpp = packetName.split(".");
        tpp.splice(tpp.length - 1, 1);
        var basepath = baseMapping.basePath.length > 0 ? (baseMapping.basePath[baseMapping.basePath.length - 1] === "/" ? baseMapping.basePath : baseMapping.basePath + "/") : "", current = basepath + tpp.join("/");
        return code.replace(/url\(.+?\)/g, function (str) {
            str = str.substring(4, str.length - 1);
            var has = false, path = str;
            if (str[0] === "'" || str[0] === "\"") {
                has = true;
                str = str.substring(1, str.length - 1);
            }
            var _m = str.split("/");
            var _q = _m[_m.length - 1].split(".")[0], done = false;
            for (var i = 0; i < oldpaths.length; i++) {
                if (oldpaths[i].indexOf(_q) !== -1) {
                    done = true;
                    path = oldpaths[i];
                    break;
                }
            }
            if (!done) {
                if (str[0] === "." && str[1] === "/") {
                    path = current + str.substring(1);
                } else {
                    var a = str.match(/\.\.\//g), b = packetName.split(".");
                    b.splice(b.length - 1, 1);
                    if (a) {
                        b.splice(b.length - a.length, a.length);
                        str = str.substring(a.length * 3);
                        if (b.length > 0) {
                            path = basepath + b.join("/") + "/" + str;
                        } else {
                            path = basepath + str;
                        }
                    } else {
                        if (str[0] === "/") {
                            path = str;
                        } else {
                            path = current + "/" + str;
                        }
                    }
                }
                if (has) {
                    path = "url('" + path + "')";
                } else {
                    path = "url(" + path + ")";
                }
            }
            return path;
        });
    };
    packet.replaceHtmlPath = function (packetname, code) {
        var old = packet.templatepersistence.get(packetname), oldtemp = "", oldpaths = [];
        if (old) {
            for (var i in old) {
                oldtemp += old[i];
            }
            var q = oldtemp.match(/src=['"].+?['"]/g);
            if (q) {
                for (var i = 0; i < q.length; i++) {
                    oldpaths.push(q[i]);
                }
            }
        }
        return code.replace(/src=['"].+?['"]/g, function (a) {
            if (a.indexOf("<%") === -1) {
                var rp = a, newpath = a.substring(5, a.length - 1), _a = newpath.split("/"), name = _a[_a.length - 1].split(".")[0], done = false;
                if (oldtemp.indexOf(name) !== -1) {
                    for (var i = 0; i < oldpaths.length; i++) {
                        if (oldpaths[i].indexOf(name) !== -1) {
                            rp = oldpaths[i];
                            done = true;
                            break;
                        }
                    }
                }
                if (!done) {
                    rp = "src=\"" + baseMapping.basePath + a.substring(5, a.length - 1) + "\"";
                }
                return rp;
            } else {
                return a;
            }
        });
    };
    packet.prototype.load = function (pkt, path, fn, parent) {
        var ths = this, pathname = path;
        if (packet.codepersistence.check(pkt)) {
            packet.load.call(this, packet.codepersistence.get(pkt), fn, parent, pathname);
        } else {
            path = baseMapping.urlfilter ? baseMapping.urlfilter({
                type: "js",
                path: path,
                packet: pkt
            }) : path;
            bright.ajax({
                url: path,
                dataType: "text",
                type: "get",
                success: function (e) {
                    packet.codepersistence.set(pkt, packet.codepersistence.getCurrentHash(pkt), e).save();
                    packet.load.call(ths, e, fn, parent, pathname);
                },
                error: function (e) {
                    fn && fn();
                }
            });
        }
    };
    packet.prototype.clean = function () {
        for (var i in this) {
            this[i] = null;
        }
    };
    bright.packet = function (option) {
        new packet(option);
    };
    bright.source = function (a) {
        for (var type in a) {
            var fileload = true;
            if (packet[type + "persistence"].isLoaded()) {
                fileload = false;
            }
            if (fileload) {
                packet["parse" + type[0].toUpperCase() + type.substring(1)](a[type]);
            }
        }
    };
    bright._packet = packet;

    var template = function (temp, macro) {
        temp = template.cache(temp);
        var a = template.precompile(temp);
        this._scope = a.info;
        this._code = template.code(a.template);
        this._fn = template.compile(this._code);
        this._session = null;
        this._caching = {};
        this._macrofn = macro || {};
        bright.extend(this._macrofn, template.globalMacro);
    };
    template.a = /&lt;%/g;
    template.b = /%&gt;/g;
    template.c = /&quot;/g;
    template.d = /<%|%>/g;
    template.e = /^=.*;$/;
    template.f = />[\s]+</g;
    template.g = /\{\{.*\}\}/;
    template.h = /\<\!\-\-[\s\S]*?\-\-\>/g;
    template.j = /\{\{|\}\}/;
    template.i = /\r\n/g;
    template.k = /\r/g;
    template.l = /\n/g;
    template.m = /"/g;
    template.ch = /@cache\(.*?\)/g;
    template.globalMacro = {
        include: function (attrs, render) {
            var p = new template(attrs.template);
            var t = p.render(attrs.data);
            for (var i in p._caching) {
                this._caching[i] = p._caching[i];
            }
            return t;
        }
    };
    template.code = function (temp) {
        var fn = "var out='';";
        var tp = temp.replace(template.a, "<%").replace(template.b, "%>").split(template.d);
        for (var index = 0; index < tp.length; index++) {
            var e = tp[index];
            index % 2 !== 0 ? (template.e.test(e) ? (fn += "out+" + e) : (fn += e)) : (fn += "out+=\"" + e.replace(template.m, '\\"') + "\";");
        }
        fn += "return out;";
        return fn;
    };
    template.compile = function (code) {
        try {
            return  new Function("data", "fn", code);
        } catch (e) {
            console.error("[template error] " + e.message);
            console.info("[template result] " + code);
            return function () {
                return "";
            };
        }
    };
    template.precompile = function (str) {
        str = str.replace(template.h, "").replace(template.f, "><").replace(template.i, "").replace(template.k, "").replace(template.l, "");
        if (str.indexOf("<@") !== -1) {
            var i = -1, current = "", state = "start", tagname = "", propname = "", propnamestart, propvalue = "";
            var isbody = true, endtagname = "", props = {}, tagindex = 0, tagendindex = 0, endtagindex = 0, endtagendindex = 0, obj = [];
            while (i < str.length) {
                i++;
                current = str[i];
                if (state === "start" && current === "<" && str[i + 1] === "@") {
                    state = "tagstart";
                    tagindex = i;
                    continue;
                }
                if (state === "tagstart" && current === "@") {
                    state = "tagname";
                    tagname = "";
                    props = {};
                    continue;
                }
                if (state === "start" && current === "<" && str[i + 1] === "/" && str[i + 2] === "@") {
                    endtagindex = i;
                    state = "endtag";
                    endtagname = "";
                    i += 2;
                    continue;
                }
                if (state === "endtag" && current === ">") {
                    state = "start";
                    endtagendindex = i + 1;
                    obj.push({
                        type: "endtag",
                        tagname: endtagname,
                        start: endtagindex,
                        end: endtagendindex
                    });
                    continue;
                }
                if (state === "tagname" && current === " ") {
                    state = "propname";
                    propname = "";
                    continue;
                }
                if (state === "tagname" && (current === "/" || current === ">")) {
                    if (current === ">") {
                        tagendindex = i + 1;
                        state = "start";
                        isbody = true;
                    } else if (current === "/") {
                        tagendindex = i + 2;
                        state = "start";
                        isbody = false;
                    }
                    if (tagname !== "") {
                        obj.push({
                            type: "tag",
                            tagname: tagname,
                            props: props,
                            body: isbody,
                            start: tagindex,
                            end: tagendindex
                        });
                    }
                    continue;
                }
                if (state === "propname" && current === "=") {
                    state = "propvalue";
                    continue;
                }
                if (state === "propvalue" && (current === "'" || current === "\"")) {
                    state = "propvalueing";
                    propnamestart = current;
                    propvalue = "";
                    continue;
                }
                if (state === "propvalueing" && current === propnamestart) {
                    state = "tagname";
                    props[propname] = propvalue;
                    continue;
                }
                if (state === "endtag") {
                    endtagname += current;
                }
                if (state === "tagname") {
                    tagname += current;
                }
                if (state === "propname") {
                    propname += current;
                }
                if (state === "propvalueing") {
                    propvalue += current;
                }
            }
            var index = 0, start = 0, end = 0, inner = false, current = null, result = [], t = "", startin = 0, info = [];
            for (var i in obj) {
                if (obj[i].type === "tag" && obj[i].body === false && inner === false) {
                    obj[i].bodystr = "";
                    obj[i].from = obj[i].start;
                    obj[i].to = obj[i].end;
                    result.push(obj[i]);
                }
                if (obj[i].type === "tag" && obj[i].body === true) {
                    inner = true;
                    if (current === null) {
                        current = obj[i];
                        current.from = obj[i].start;
                    }
                    if (index === 0) {
                        start = obj[i].start;
                        end = obj[i].end;
                    }
                    index++;
                }
                if (obj[i].type === "endtag") {
                    index--;
                    if (index === 0) {
                        current.to = obj[i].end;
                        current.bodystr = str.substring(end, obj[i].start);
                        result.push(current);
                        current = null;
                        inner = false;
                    }
                }
            }
            for (var i in result) {
                var st = result[i].props, parameter = "";
                for (var tpp in st) {
                    var np = st[tpp];
                    if (template.g.test(np)) {
                        var qpp = np.split(template.j), cpp = "";
                        for (var ip = 1; ip <= qpp.length; ip++) {
                            if (ip % 2 === 0) {
                                if (qpp[ip - 1] !== "") {
                                    cpp += qpp[ip - 1] + "+";
                                }
                            } else {
                                if (qpp[ip - 1] !== "") {
                                    cpp += "'" + qpp[ip - 1] + "'+";
                                } else {
                                    cpp += qpp[ip - 1];
                                }
                            }
                        }
                        var npp = (cpp.length > 0 ? cpp.substring(0, cpp.length - 1) : "''");
                        parameter += tpp + ":" + npp + ",";
                    } else {
                        parameter += tpp + ":'" + st[tpp] + "',";
                    }
                }
                result[i].parameter = "{" + (parameter.length > 0 ? parameter.substring(0, parameter.length - 1) : parameter) + "}";
                info.push({
                    name: result[i].tagname,
                    body: result[i].bodystr,
                    parameter: result[i].parameter
                });
                var a = str.substring(startin, result[i].from);
                t += a;
                t += "<%=this._macro(" + i + (result[i].parameter === "" ? "" : "," + result[i].parameter) + ");%>";
                startin = result[i].to;
            }
            t += str.substring(startin, str.length);
            return {
                template: t,
                info: info
            };
        } else {
            return {template: str, info: []};
        }
    };
    template.cache = function (str) {
        return str.replace(template.ch, function (e) {
            var k = e.substring(7, e.length - 1);
            return "data-cache='<%=this._cache(" + k + ");%>'";
        });
    };
    template.prototype._cache = function (data) {
        var has = false;
        for (var i in this._caching) {
            if (this._caching[i] === data) {
                has = true;
                return i;
            }
        }
        if (!has) {
            var uuid = util.uuid();
            this._caching[uuid] = data;
            return uuid;
        }
    };
    template.prototype._macro = function (num, attr) {
        var n = this._scope[num], ths = this;
        if (this._macrofn[n.name]) {
            return this._macrofn[n.name].call(this, attr, function () {
                if (n.body !== "") {
                    var inner = new template(n.body).macro(ths._macrofn);
                    inner._caching = ths._caching;
                    return inner.render.apply(inner, ths._session);
                } else {
                    return "";
                }
            });
        } else {
            return "[nodata]";
        }
    };
    template.prototype.session = function () {
        if (arguments.length === 0) {
            return this._session;
        } else {
            this._session = arguments[0];
            return this;
        }
    };
    template.prototype.render = function () {
        this._session = Array.prototype.slice.call(arguments);
        return this._fn.apply(this, this._session);
    };
    template.prototype.renderTo = function (dom) {
        var a = Array.prototype.slice.call(arguments);
        a.splice(0, 1);
        this._session = a;
        var b = this._fn.apply(this, this._session);
        this.flush(dom.html(b));
    };
    template.prototype.renderAppendTo = function (dom) {
        var a = Array.prototype.slice.call(arguments);
        a.splice(0, 1);
        this._session = a;
        var b = this._fn.apply(this, this._session);
        this.flush($(b).appendTo(dom));
    };
    template.prototype.flush = function (dom) {
        var ths = this;
        dom.find("[data-cache]").add(dom).each(function () {
            var c = $(this).dataset("cache");
            if (c) {
                $(this).data("-cache-", ths._caching[c]).removeAttr("data-cache");
            }
        });
    };
    template.prototype.code = function () {
        return this._code;
    };
    template.prototype.fn = function () {
        if (arguments.length === 1) {
            this._fn = arguments[0];
            return this;
        }
        return this._fn;
    };
    template.prototype.macro = function (name, fn) {
        if (arguments.length === 1) {
            this._macrofn = name || {};
        } else if (arguments.length === 2) {
            this._macrofn[name] = fn;
        }
        return this;
    };
    template.prototype.clean = function () {
        for (var i in this) {
            this[i] = null;
        }
    };
    bright.template = function () {
        var temp = Array.prototype.slice.call(arguments).join("");
        return new template(temp);
    };
    bright.setTemplateGlobalMacro = function (key, fn) {
        if (arguments.length === 1) {
            bright.extend(template.globalMacro, key);
        } else if (arguments.length === 2) {
            template.globalMacro[key] = fn;
        }
        return this;
    };
    query.prototype.template = function () {
        var temp = new template(ths.html()), ths = this;
        return {
            render: function (data, fn) {
                ths.html(temp.render(data, fn));
                return ths;
            },
            compile: function (data, fn) {
                return temp.render(data, fn);
            }
        };
    };

    var adapt = function () {
    };
    adapt.isSuper = /superClass\(.*?\)/g;
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
                            var t = p[i].substring(12, p[i].length - 2);
                            console.log(t);
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
        var ife = [], ex = [obj.packet ? obj.packet + "." + obj.name : obj.name];
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
        this._mapping[b.__info__.name] = adapt;
        return this;
    };
    factory.prototype.get = function (name) {
        return this._mapping[name];
    };
    factory.prototype.create = function (type, option) {
        var a = this.instance(type, option);
        if (a) {
            for (var i = a.__info__.types.length - 1; i >= 0; i--) {
                var p = this._mapping[a.__info__.types[i]];
                if (p && p.prototype["init"]) {
                    p.prototype["init"].call(a, a.option);
                }
            }
        }
        return a;
    };
    factory.prototype.instance = function (type, option) {
        var obj = null, name = type;
        var clazz = this._mapping[name];
        if (clazz) {
            obj = new clazz();
            obj.option = bright.extend({}, bright.json.clone(clazz.prototype.option), option);
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
    bright.adapt = function () {
        return new factory();
    };

    var command = function () {
        this.dataType = "";
        this.type = null;
        this.object = null;
        this.value = null;
    };
    var observe = function (name, obj, fn) {
        if ($.is.isObject(obj)) {
            return observe.setObject(name, "", obj, null, fn);
        } else {
            return observe.setArray(name, "", obj, null, fn);
        }
    };
    observe.setunwrite = function (obj, key, value) {
        if (!obj.hasOwnProperty(key)) {
            Object.defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: value
            });
        } else {
            obj[key] = value;
        }
    };
    observe.setwrite = function (obj, key, value) {
        if (!obj.hasOwnProperty(key)) {
            Object.defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                writable: true,
                value: value
            });
        } else {
            obj[key] = value;
        }
    };
    observe.setObject = function (name, key, obj, parent, fn) {
        var keys = Object.keys(obj);
        for (var q = 0; q < keys.length; q++) {
            var i = keys[q], pps = obj[i];
            observe.setObserve(name, i, pps, obj, fn);
            (function (t) {
                obj.__defineSetter__(t, function (a) {
                    try {
                        this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                            name: this["_*_"].name,
                            dataType: "object",
                            type: "edit",
                            object: this,
                            property: t,
                            original: this["_" + t + "_"],
                            value: a
                        }));
                    } catch (e) {
                    }
                    this["_" + t + "_"] = a;
                });
                obj.__defineGetter__(t, function () {
                    return this["_" + t + "_"];
                });
            })(i);
            observe.setwrite(obj, "_" + i + "_", pps);
        }
        observe.setunwrite(obj, "_*_", {fn: fn, key: key, name: name});
        observe.setunwrite(obj, "_+_", parent);
        observe.setunwrite(obj, "set", function (key, value) {
            var _type = "edit";
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            } else {
                _type = "add";
                observe.setwrite(this, "_" + key + "_", observe.setObserve(this["_*_"].name, key, value, this, this["_*_"].fn));
                this.__defineSetter__(key, function (a) {
                    this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                        name: this["_*_"].name,
                        dataType: "object",
                        type: "edit",
                        object: this,
                        property: key,
                        original: this["_" + key + "_"],
                        value: a
                    }));
                    this["_" + key + "_"] = a;
                });
                this.__defineGetter__(key, function () {
                    return this["_" + key + "_"];
                });
            }
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "object",
                type: _type,
                object: this,
                property: key,
                original: undefined,
                value: value
            }));
            return this;
        });
        observe.setunwrite(obj, "get", function (key) {
            return this["_" + key + "_"];
        });
        observe.setunwrite(obj, "remove", function () {
            if ($.is.isArray(this["_+_"])) {
                this["_+_"].splice(this["_+_"].indexOf(this), 1);
            }
        });
        observe.setunwrite(obj, "getIndex", function () {
            if ($.is.isArray(this["_+_"])) {
                return this["_+_"].indexOf(this);
            }
        });
        observe.setunwrite(obj, "getPath", function () {
            var a = this, r = [], n = [];
            while (a) {
                var key = a["_*_"].key;
                if (key.indexOf("*") === -1) {
                    r.push(key);
                    n.push(key);
                } else {
                    r.push(a["_+_"].indexOf(a));
                }
                a = a["_+_"];
            }
            r.splice(r.length - 1, 1);
            n = n.reverse();
            n.splice(0, 1);
            return {
                name: n.join("."),
                value: r.reverse()
            };
        });
        return obj;
    };
    observe.setArray = function (name, key, obj, parent, fn) {
        for (var i = 0; i < obj.length; i++) {
            obj[i] = observe.setObserve(name, key + "*", obj[i], obj, fn);
        }
        observe.setunwrite(obj, "_*_", {fn: fn, key: key, name: name});
        observe.setunwrite(obj, "_+_", parent);
        observe.setunwrite(obj, "splice", function () {
            var news = Array.prototype.slice.call(arguments), index = arguments[0], parameters = [], _type = "remove";
            var size = arguments[1], value = null;
            for (var i = 2; i < news.length - 2; i++) {
                parameters.push(news[i]);
            }
            if (parameters.length > 0) {
                for (var i = 0; i < news.length; i++) {
                    parameters[i] = observe.setObserve(this["_*_"].name, this["_*_"].key + "*", parameters[i], this, this["_*_"].fn);
                }
                _type = "edit";
                value = parameters;
            } else {
                _type = "remove";
                var q = [];
                for (var i = arguments[0]; i < arguments[0] + arguments[1]; i++) {
                    q.push(this[i]);
                }
                value = q;
            }
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "array",
                type: _type,
                object: this,
                original: this,
                form: index,
                size: size,
                value: value
            }));
            return Array.prototype.splice.apply(this, news);
        });
        observe.setunwrite(obj, "pop", function () {
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "array",
                type: "remove",
                object: this,
                original: this,
                form: this.length - 1,
                size: 1
            }));
            return Array.prototype.pop.call(this);
        });
        observe.setunwrite(obj, "push", function (obj) {
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "array",
                type: "add",
                object: this,
                original: this,
                form: this.length - 1,
                size: 1,
                value: obj
            }));
            return Array.prototype.push.call(this, observe.setObserve(this["_*_"].name, this["_*_"].key + "*", obj, this, this["_*_"].fn));
        });
        observe.setunwrite(obj, "shift", function () {
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "array",
                type: "remove",
                object: this,
                original: this,
                form: 0,
                size: 1,
                value: this[0]
            }));
            return Array.prototype.shift.call(this);
        });
        observe.setunwrite(obj, "unshift", function (obj) {
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "array",
                type: "add",
                object: this,
                original: this,
                form: 0,
                size: 1,
                value: obj
            }));
            return Array.prototype.push.call(this, observe.setObserve(this["_*_"].name, this["_*_"].key + "*", obj, this, this["_*_"].fn));
        });
        observe.setunwrite(obj, "removeAll", function () {
            this["_*_"].fn && this["_*_"].fn($.extend(new command(), {
                name: this["_*_"].name,
                dataType: "array",
                type: "remove",
                object: this,
                original: this,
                form: 0,
                size: this.length,
                value: this
            }));
            return Array.prototype.shift.call(this);
        });
        observe.setunwrite(obj, "getPath", function () {
            var a = this, r = [], n = [];
            while (a) {
                var key = a["_*_"].key;
                if (key.indexOf("*") === -1) {
                    r.push(key);
                    n.push(key);
                } else {
                    r.push(a["_+_"].indexOf(a));
                }
                a = a["_+_"];
            }
            r.splice(r.length - 1, 1);
            n = n.reverse();
            n.splice(0, 1);
            return {
                name: n.join("."),
                value: r.reverse()
            };
        });
        return obj;
    };
    observe.setObserve = function (name, key, obj, parent, fn) {
        if ($.is.isArray(obj)) {
            return observe.setArray(name, key, obj, parent, fn);
        } else if ($.is.isObject(obj)) {
            return observe.setObject(name, key, obj, parent, fn);
        } else {
            return obj;
        }
    };
    bright.observe = function (name, obj, fn) {
        return observe(name, obj, fn);
    };

    var module = {
        regs: {
            a: /^(dom)|^(option)|^(name)|^(extend)|^(init)/
        },
        isMutation: function () {
            return (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null) !== null;
        },
        domInserted: function (parent, child) {
            var d = $(child);
            if (!d.dataset("parentView")) {
                var has = false;
                while (parent && parent !== window.document) {
                    if (parent.datasets && parent.datasets["-view-"]) {
                        has = true;
                        break;
                    } else {
                        parent = parent.parentNode;
                    }
                }
                if (has) {
                    var module = parent.datasets["-view-"];
                    module.onnodeinserted && module.onnodeinserted(child);
                }
            }
        },
        domRemoved: function (parent, child) {
            var d = $(child);
            if (!d.dataset("parentView")) {
                var has = false, nparent = parent;
                while (parent && parent !== window.document) {
                    if (parent.datasets && parent.datasets["-view-"]) {
                        has = true;
                        break;
                    } else {
                        parent = parent.parentNode;
                    }
                }
                if (has) {
                    var module = parent.datasets["-view-"];
                    module.onnoderemoved && module.onnoderemoved(child, nparent);
                }
            }
        },
        factory: bright.adapt(),
        getbrightName: function (name, suffix) {
            if (name) {
                name = name.trim();
                if (name !== "") {
                    var a = name.split("\.");
                    if (a.length > 1) {
                        a.splice(a.length - 1, 1);
                        return a.join(".");
                    } else {
                        return name;
                    }
                } else {
                    return "";
                }
            } else {
                return "";
            }
        },
        getArrayUnDuplicate: function (a) {
            var r = {}, c = [];
            for (var i = 0; i < a.length; i++) {
                r[a[i]] = 1;
            }
            for (var i in r) {
                c.push(i);
            }
            return c;
        },
        getViewInstance: function (dom, option, fn) {
            var moduleName = dom.dataset("view");
            if (moduleName) {
                module.get("root", moduleName, option, function (c) {
                    if (!dom.data("-view-")) {
                        c.dom = dom;
                        fn && fn(c);
                    } else {
                        fn && fn(dom.data("-view-"));
                    }
                });
            } else {
                throw Error("[bright] view can not init.the element has no attribute like view-*");
            }
        },
        add: function (obj) {
            if (!obj.tagName) {
                obj.tagName = "div";
            }
            module.factory.def(obj);
            var ne = (obj.packet && obj.packet !== "" ? obj.packet + "." : "") + obj.name;
            var sobj = module.factory.get(ne).prototype;
            var cln = [obj.className || ""];
            for (var i = sobj.__info__.types.length - 1; i >= 0; i--) {
                var b = module.factory.get(sobj.__info__.types[i]);
                if (b) {
                    var cn = b.prototype.className;
                    if (cn && cn !== "") {
                        if (cln.indexOf(cn) === -1) {
                            cln.push(cn);
                        }
                    }
                }
            }
            sobj.fullClassName = cln.join(" ");
        },
        has: function (moduleName) {
            return  module.factory.has(moduleName);
        },
        get: function (target, moduleName, option, fn) {
            if (moduleName !== undefined && moduleName !== null && moduleName !== "") {
                if (!module.has(moduleName)) {
                    var packetName = module.getbrightName(moduleName);
                    bright.packet({
                        packetName: packetName,
                        target: target,
                        back: function () {
                            if (fn) {
                                if (module.has(moduleName)) {
                                    fn(module.factory.instance(moduleName, option));
                                } else {
                                    throw Error("[bright] can not find module with name of " + moduleName + ",it is not in the packet of " + module.getbrightName(moduleName) + " or the packet file inited failed.");
                                }
                            }
                        }
                    });
                } else {
                    if (fn) {
                        fn(module.factory.instance(moduleName, option));
                    }
                }
            } else {
                throw Error("[bright] packet name can not undefined or null or ''.");
            }
        },
        task: new dynamicQueue()
    };
    var option = {
        options: {},
        add: function (obj) {
            if (obj.name && obj.name !== "") {
                option.options[obj.name] = obj.option;
            } else {
                throw Error("[bright] option name can not null or ''");
            }
        },
        has: function (optionName) {
            var a = option.options[optionName];
            if (a) {
                return a;
            } else {
                return false;
            }
        },
        get: function (target, optionName, fn) {
            if (optionName !== undefined && optionName !== "" && optionName !== "null") {
                if (optionName[0] !== "{" && optionName[0] !== "[") {
                    var a = option.has(optionName);
                    if (a === false) {
                        var packetName = module.getbrightName(optionName);
                        bright.packet({
                            packetName: packetName,
                            target: target,
                            back: function () {
                                if (fn) {
                                    var ops = option.has(optionName);
                                    if (ops) {
                                        fn(ops);
                                    } else {
                                        throw Error("[bright] can not find option with name of " + optionName + ",is not in the packet of " + module.getbrightName(optionName));
                                    }
                                }
                            }
                        });
                    } else {
                        fn && fn(a);
                    }
                } else {
                    var ot = {};
                    try {
                        ot = window.JSON.parse(optionName);
                    } catch (e) {
                    }
                    fn && fn(ot);
                }
            } else {
                fn && fn(null);
            }
        }
    };
    var viewevent = function (target, type, data) {
        this.target = target;
        this.data = data;
        this.type = type;
        this._goon = true;
        this.currentTarget = null;
    };
    viewevent.prototype.clone = function () {
        return bright.extend(new viewevnet(), this);
    };
    viewevent.prototype.stopPropagation = function () {
        this._goon = false;
    };

    var delegater = function () {
        this._data = [];
    };
    delegater.finder = function (module) {
        var r = [];
        for (var i = 0; i < module._finders._data.length; i++) {
            if (module.dom.get(0).contains(module._finders._data[i].get(0))) {
                r.push(module._finders._data[i]);
            }
        }
        module._finders._data = r;
        module.dom.find("[data-find]").each(function () {
            var _name = $(this).dataset("find");
            $(this).data("-finder-", {name: _name}).removeAttr("data-find").attr("finder", _name);
            module._finders._data.push($(this));
            try {
                module["find_" + _name] && module["find_" + _name]($(this), module._finders);
            } catch (e) {
                console.error("[bright] view finder called error with module of " + module.type() + " Message:" + e.message);
            }
        });
    };
    delegater.group = function (module) {
        var r = [];
        for (var i = 0; i < module._groups._data.length; i++) {
            if (module.dom.get(0).contains(module._groups._data[i].get(0))) {
                r.push(module._groups._data[i]);
            }
        }
        module._groups._data = r;
        module.dom.find("*[data-group]").each(function () {
            var name = $(this).dataset("group"), p = {name: name, items: {}}, qt = $(this);
            $(this).data("-group-", p).removeAttr("data-group").attr("group", name);
            module._groups._data.push($(this));
            $(this).find("*[data-groupi]").each(function () {
                p.items[$(this).dataset("groupi")] = $(this);
                var _name = $(this).dataset("groupi");
                $(this).data("-groupitem-", {name: _name, group: qt}).removeAttr("data-groupi").attr("groupi", _name);
            });
            if (module["group_" + name]) {
                try {
                    module["group_" + name]($(this));
                } catch (e) {
                    console.error("[bright] view groups called error with module of " + module.type() + " Message:" + e.message);
                }
            }
        });
    };
    delegater.event = function (module) {
        module.dom.find("[data-bind]").each(function () {
            if (!$(this).data("_eventback_")) {
                var q = {}, types = $(this).dataset("bind").split(" ");
                for (var m in types) {
                    var type = types[m].split(":"), etype = type[0], back = type[1];
                    q[etype] = back;
                    $(this).removeAttr("data-bind").bind(etype, function (e) {
                        var back = $(this).data("_eventback_")[e.type];
                        module["bind_" + back] && module["bind_" + back].call(module, $(this), e);
                    });
                }
                $(this).data("_eventback_", q);
            }
        });
    };

    module.add({
        name: "request",
        request: function (url, data, option) {
            var _rs = bright.promise(), _ok = false;
            _rs.scope(this);
            var ops = {
                url: "",
                dataType: "json",
                data: ""
            };
            bright.extend(ops, option);
            if (is.isString(url)) {
                _ok = true;
                ops.url = url;
            } else if (is.isObject(url)) {
                _ok = true;
                bright.extend(ops, url);
            }
            if (_ok) {
                ops.data = data;
                this.doRequest(ops, _rs);
                return _rs;
            } else {
                throw Error("[bright] request parameter error");
            }
        },
        doRequest: function (option, promise) {
            bright.ajax(option).done(function (a) {
                if (a.code && a.code === "1") {
                    promise.resolve(a.data);
                } else {
                    promise.reject(a);
                }
            }).fail(function (e) {
                promise.reject(e);
            });
        },
        getRequest: function (url, data) {
            return this.request(url, data, "get");
        },
        postRequest: function (url, data, option) {
            if (!option) {
                option = {};
            }
            option.type = "post";
            return this.request(url, data, option);
        },
        putRequest: function (url, data, option) {
            if (!option) {
                option = {};
            }
            option.type = "post";
            return this.request(url, data, option);
        },
        deleteRequest: function (url, data, option) {
            if (!option) {
                option = {};
            }
            option.type = "post";
            return this.request(url, data, option);
        },
        patchRequest: function (url, data, option) {
            if (!option) {
                option = {};
            }
            option.type = "post";
            return this.request(url, data, option);
        }
    });
    module.add({
        name: "view",
        extend: "request",
        packet: "",
        option: {
        },
        parentView: null,
        init: null,
        template: "",
        onbeforeinit: null,
        onendinit: null,
        onunload: bright.nfn,
        onnoderemoved: null,
        onnodeinserted: null,
        onchildremove: null,
        _render: function (fn) {
            if (!this.dom.data("-view-")) {
                this.dom.data("-view-", this);
                this._finders = new delegater();
                this._groups = new delegater();
                if (this.dom.children().length > 0) {
                    this.template = this.dom.html();
                }
                var optionName = this.dom.dataset("option"), ths = this;
                if (this.dom.hasClass("_futuretochange_")) {
                    this.dom.removeClass("_futuretochange_");
                    var prps = module.factory._mapping[this.type()].prototype;
                    var cln = prps.fullClassName;
                    if (this.dom.get(0).tagName.toLowerCase() !== this.tagName) {
                        var a = $("<" + prps.tagName + " class='" + cln + "' data-view='" + this.dom.dataset("view") + "' data-parent-view='" + this.dom.dataset("parentView") + "' data-view-id='" + this.dom.dataset("viewId") + "' daa-option='" + this.dom.dataset("option") + "'></" + prps.tagName + ">");
                        this.dom.get(0).parentNode.replaceChild(a.get(0), this.dom.get(0));
                        this.dom = a;
                    }
                }
                this._handlers = [];
                option.get(this.type(), optionName, function (ops) {
                    if (ops) {
                        ths.option.override = ops.override || {};
                        for (var i in ops) {
                            if (i !== "override") {
                                if (i.indexOf("override_") === 0) {
                                    ths.option.override[i.substring(9)] = ops[i];
                                } else {
                                    ths.option[i] = ops[i];
                                }
                            }
                        }
                    }
                    for (var i in ths.option.override) {
                        if (!module.regs.a.test(i)) {
                            ths[i] = ths.option.override[i];
                        }
                    }
                    ths["name"] = ths.type();
                    ths["shortname"] = ths.shortName();
                    if (typeof ths.onbeforeinit === 'function') {
                        try {
                            ths.onbeforeinit(ths.option);
                        } catch (e) {
                            console.error("[bright] onbeforeinit called error with module of " + ths.type() + " Message:" + e.message);
                        }
                    }
                    if (ths.className && ths.className !== "") {
                        ths.dom.addClass(ths.className);
                    }
                    if (typeof ths.init === 'function') {
                        try {
                            ths.init(ths.option);
                        } catch (e) {
                            console.error("[bright] init called error with module of " + ths.type() + " Message:" + e.stack);
                        }
                    }
                    if (typeof ths.onendinit === 'function') {
                        try {
                            ths.onendinit(ths.option);
                        } catch (e) {
                            console.error("[bright] onendinit called error with module of " + ths.type() + " Message:" + e.message);
                        }
                    }
                    fn && fn();
                });
            }
            return this;
        },
        delegate: function () {
            delegater.finder(this);
            delegater.group(this);
            delegater.event(this);
            return this;
        },
        getId: function () {
            return this.dom.dataset("viewId");
        },
        getDom: function () {
            return this.dom;
        },
        postData: function (ops) {
            ops["dataType"] = "json";
            var ths = this;
            bright.ajax(ops).done(function (a) {
                if (a.code && a.code === "1") {
                    ops.back && ops.back.call(ths, a.data);
                } else {
                    ops.dataerror && ops.dataerror.call(ths, a);
                }
            }).fail(function (a) {
                ops.neterror && ops.neterror.call(ths);
            });
        },
        triggerEvent: function (e) {
            e.currentTarget = this;
            if (this._handlers[e.type]) {
                return this._handlers[e.type].call(this, e);
            } else {
                if (this["event_" + e.type]) {
                    return this["event_" + e.type].call(this, e);
                } else {
                    return true;
                }
            }
        },
        initEvent: function (type, data) {
            var e = new viewevent(this, type, data);
            return e;
        },
        dispatchEvent: function (type, data, isdefault) {
            isdefault = isdefault === undefined ? true : isdefault;
            var event = new viewevent(this, type, data);
            if (isdefault === true) {
                var i = this;
                while (i) {
                    i.triggerEvent(event);
                    if (event._goon) {
                        i = i["parentView"];
                    } else {
                        break;
                    }
                }
            } else {
                this.triggerEvent(event);
                if (event._goon && this.typeOf("viewgroup")) {
                    for (var i = 0; i < this.children.length; i++) {
                        this.children[i].dispatchEvent(type, data, false);
                    }
                }
            }
        },
        dispatchSuroundEvent: function (type, data) {
            var event = new viewevent(this, type, data);
            if (this.parentView) {
                for (var i in this.parentView.children) {
                    var a = this.parentView.children[i];
                    a.triggerEvent(event);
                    if (!event._goon) {
                        break;
                    }
                }
            }
        },
        addEventListener: function (type, fn) {
            this._handlers[type] = fn;
            return this;
        },
        removeEventListener: function (type, fn) {
            this._handlers[type] = null;
            if (this["event_" + type]) {
                this["event_" + type] = null;
            }
            return this;
        },
        removeAllEventListener: function () {
            for (var i in this._handlers) {
                this._handlers[i] = null;
            }
            for (var i in this) {
                if (i.indexOf("event_") === 0) {
                    this[i] = null;
                }
            }
            return this;
        },
        remove: function () {
            this.dom.remove();
        },
        render: function (data) {
            var ths = this, ps = $.promise();
            ps.scope(this);
            try {
                ths.onbeforerender && ths.onbeforerender();
            } catch (e) {
                console.error("[bright] onbeforerender called error with module of " + ths.type() + " Message:" + e.message);
            }
            try {
                bright.template(ths.template).renderTo(ths.dom, data);
                ths.delegate();
            } catch (e) {
                console.error("[bright] render called error with module of " + ths.type() + " Message:" + e.message);
            }
            try {
                ths.onendrender && ths.onendrender();
            } catch (e) {
                console.error("[bright] onendrender called error with module of " + ths.type() + " Message:" + e.message);
            }
            setTimeout(function () {
                ps.resolve();
            }, 0);
            return ps;
        },
        original: function (methods) {
            var a = Object.getPrototypeOf(this)[methods];
            if (bright.is.isFunction(a)) {
                var b = Array.prototype.slice.call(arguments);
                b.splice(0, 1);
                return a.apply(this, b);
            } else {
                return a;
            }
        },
        parentsInvoke: function (methodName) {
            var t = this.parentView, r = null;
            while (t) {
                var a = t[methodName];
                if (a && bright.is.isFunction(a)) {
                    var b = Array.prototype.slice.call(arguments);
                    b.splice(0, 1);
                    r = a.apply(t, b);
                    break;
                } else {
                    t = t.parentView;
                }
            }
            return r;
        },
        parentsParameter: function (propName) {
            var t = this.parentView, b = null;
            while (t) {
                b = t.parameters[propName];
                if (b !== undefined) {
                    break;
                } else {
                    t = t.parentView;
                }
            }
            return b;
        },
        parentViews: function (level) {
            level = bright.is.isAvalid(level) ? (bright.is.isNumber(level) ? level : parseInt(level)) : 0;
            var b = this.parentView, c = level - 1;
            while (b && c > 0) {
                c--;
                b = b.parentView;
            }
            return b;
        },
        previousSibling: function () {
            if (this.parentView) {
                var a = this.parentView.children.indexOf(this);
                if (a !== 0) {
                    return this.parentView.children[a - 1];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        nextSibling: function () {
            if (this.parentView) {
                var a = this.parentView.children.indexOf(this);
                if (a + 1 < this.parentView.children.length) {
                    return this.parentView.children[a + 1];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        setStorage: function (key, obj) {
            var a = "", b = window.localStorage.getItem(this.name);
            if (!b) {
                b = {};
                b[key] = obj;
                a = window.JSON.stringify(b);
            } else {
                b = window.JSON.parse(b);
                b[key] = obj;
                a = window.JSON.stringify(b);
            }
            window.localStorage.setItem(this.name, a);
            return this;
        },
        getStorage: function (key) {
            var b = window.localStorage.getItem(this.name);
            if (b) {
                b = window.JSON.parse(b);
            } else {
                b = {};
            }
            return b[key];
        },
        removeStorage: function (key) {
            return this.setStorage(key, null);
        },
        cleanStorage: function () {
            window.localStorage.removeItem(this.name);
            return this;
        },
        getUUID: function () {
            return bright.util.uuid();
        },
        observe: function (name, obj) {
            var ths = this;
            return bright.observe(name, obj, function (e) {
                var p = name + "_" + e.object.getPath().name + (e.property ? "." + e.property : "") + "_" + e.type;
                if (ths[p]) {
                    ths[p](e);
                }
            });
        },
        getStaticJson: function (packet) {
            var ps = bright.promise().scope(this);
            filepersistence.getStaitcFile("json", packet, function (data) {
                ps.resolve(data);
            });
            return ps;
        },
        getStaticHtml: function (packet) {
            var ps = bright.promise().scope(this);
            filepersistence.getStaitcFile("html", packet, function (data) {
                ps.resolve(data);
            });
            return ps;
        },
        getStaticText: function (packet) {
            var ps = bright.promise().scope(this);
            filepersistence.getStaitcFile("text", packet, function (data) {
                ps.resolve(data);
            });
            return ps;
        },
        getStaticImage: function (packet) {
            var ps = bright.promise().scope(this);
            filepersistence.getStaitcFile("image", packet, function (data) {
                ps.resolve(data);
            });
            return ps;
        },
        getStaticPath: function (type, packet) {
            return filepersistence.getStaticPath(type, packet);
        },
        clean: function () {
            try {
                this.onunload();
            } catch (e) {
                console.error("[bright] onunload called error with module of " + this.type() + " Message:" + e.stack);
            }
            this._finders.length = 0;
            this._groups.length = 0;
            var parentview = this.parentView;
            if (parentview && parentview.children) {
                var c = parentview.children.indexOf(this);
                if (c !== -1) {
                    parentview.children.splice(c, 1);
                    try {
                        parentview.onchildremove && parentview.onchildremove(this);
                    } catch (e) {
                        console.error("[bright] onchildremove called error with module of " + parentview.type() + " Message:" + e.stack);
                    }
                }
            }
            var keys = Object.keys(this);
            for (var i in keys) {
                this[keys[i]] = null;
            }
        },
        finders: function (name) {
            var r = $();
            for (var i = 0; i < this._finders._data.length; i++) {
                if (arguments.length === 1) {
                    if (this._finders._data[i].data("-finder-") && this._finders._data[i].data("-finder-").name === name) {
                        r.add(this._finders._data[i]);
                    }
                } else {
                    r.add(this._finders._data[i]);
                }
            }
            return r;
        },
        groups: function (name) {
            var r = $();
            for (var i = 0; i < this._groups._data.length; i++) {
                if (arguments.length === 1) {
                    if (this._groups._data[i].data("-group-") && this._groups._data[i].data("-group-").name === name) {
                        r.add(this._groups._data[i]);
                    }
                } else {
                    r.add(this._groups._data[i]);
                }
            }
            return r;
        }
    });
    module.add({
        name: "viewgroup",
        extend: "view",
        layout: null,
        ondomready: null,
        onoption: null,
        oninitchild: null,
        marcos: {},
        _render: function (fn) {
            if (!this.dom.data("-view-")) {
                this.dom.data("-view-", this);
                this._finders = new delegater();
                this._groups = new delegater();
                this._handlers = {};
                this.children = [];
                var ths = this, optionName = this.dom.dataset("option"), queue = bright.queue();
                if (this.dom.hasClass("_futuretochange_")) {
                    this.dom.removeClass("_futuretochange_");
                    var prps = module.factory._mapping[this.type()].prototype;
                    var cln = prps.fullClassName;
                    if (this.dom.get(0).tagName.toLowerCase() !== this.tagName) {
                        var a = $("<" + prps.tagName + " class='" + cln + "' data-view='" + this.dom.dataset("view") + "' data-parent-view='" + this.dom.dataset("parentView") + "' data-view-id='" + this.dom.dataset("viewId") + "' daa-option='" + this.dom.dataset("option") + "'></" + prps.tagName + ">");
                        this.dom.get(0).parentNode.replaceChild(a.get(0), this.dom.get(0));
                        this.dom = a;
                    }
                }
                try {
                    option.get(this.type(), optionName, function (ops) {
                        if (!ths.option) {
                            ths.option = {};
                        }
                        if (!ths.option.override) {
                            ths.option.override = {};
                        }
                        if (ops) {
                            for (var i in ops) {
                                if (i.indexOf("override_") === 0 && i !== "override") {
                                    ths.option.override[i.substring(9)] = ops[i];
                                } else {
                                    ths.option[i] = ops[i];
                                }
                            }
                            for (var i in ops.override) {
                                ths.option.override[i] = ops.override[i];
                            }
                        }
                        for (var i in ths.option.override) {
                            if (!module.regs.a.test(i)) {
                                ths[i] = ths.option.override[i];
                            }
                        }
                        if (typeof ths.onbeforeinit === 'function') {
                            try {
                                ths.onbeforeinit(ths.option);
                            } catch (e) {
                                console.error("[bright] onbeforeinit called error with module of " + ths.type() + " Message:" + e.stack);
                            }
                        }
                        var str = ths.layout;
                        if (str === "" && ths.dom.children().length > 0) {
                            str = ths.dom.html();
                        }
                        if (bright.is.isString(str)) {
                            try {
                                var temp = bright.template(str);
                                temp.macro(bright.extend({
                                    module: function (attrs, render) {
                                        var type = attrs["type"], option = attrs["option"], id = attrs["id"];
                                        var prps = {tagName: "div", fullClassName: "_futuretochange_"};
                                        if (module.factory._mapping[type]) {
                                            var prps = module.factory._mapping[type].prototype;
                                        }
                                        return "<" + prps.tagName + " class='" + prps.fullClassName + "' data-parent-view='" + ths.getId() + "' data-view='" + type + "' data-view-id='" + (id || ths.getId() + "-" + ths.children.length) + "' data-option='" + (option || "") + "'></" + prps.tagName + ">";
                                    }
                                }, ths.marcos));
                                str = temp.fn(new Function("data", "pid", "option", "module", temp.code())).render({
                                    id: ths.getId(), option: ths.option
                                }, ths.getId(), ths.option, function (type, option, id) {
                                    var prps = {tagName: "div", fullClassName: "_futuretochange_"};
                                    if (module.factory._mapping[type]) {
                                        var prps = module.factory._mapping[type].prototype;
                                    }
                                    return "<" + prps.tagName + " class='" + prps.fullClassName + "' data-parent-view='" + ths.getId() + "' data-view='" + type + "' data-view-id='" + (id || ths.getId() + "-" + ths.children.length) + "' data-option='" + (option || "") + "'></" + prps.tagName + ">";
                                });
                                ths.dom.html(str);
                                temp.flush(ths.dom);
                            } catch (e) {
                                console.error("[bright] parse layout called error with module of " + ths.type() + " Message:" + e.stack);
                                ths.dom.html("");
                            }
                        }
                        if (typeof ths.ondomready === 'function') {
                            try {
                                ths.ondomready(ths.option);
                            } catch (e) {
                                console.error("[bright] ondomready called error with module of " + ths.type() + " Message:" + e.stack);
                            }
                        }
                        if (typeof ths.onnodeinserted === 'function') {
                            try {
                                ths.onnodeinserted(ths.dom);
                            } catch (e) {
                                console.error("[bright] onnodeinserted called error with module of " + ths.type() + " Message:" + e.stack);
                            }
                        }
                        queue.complete(function (a) {
                            a["name"] = a.type();
                            a["shortname"] = a.shortName();
                            a.delegate();
                            if (a.className && a.className !== "") {
                                a.dom.addClass(a.className);
                            }
                            if (typeof a.init === 'function') {
                                try {
                                    a.init(a.option);
                                } catch (e) {
                                    console.error("[bright] init called error with module of " + ths.type() + " Message:" + e.stack);
                                }
                            }
                            if (typeof a.onendinit === 'function') {
                                try {
                                    a.onendinit(a.option);
                                } catch (e) {
                                    console.error("[bright] onendinit called error with module of " + ths.type() + " Message:" + e.stack);
                                }
                            }
                            fn && fn();
                        });
                        ths.dom.find("*[data-parent-view='" + ths.getId() + "']").each(function () {
                            queue.add(function (aa, dom) {
                                var que = this;
                                var ops = {}, subview = dom.dataset("view"), subid = dom.dataset("viewId");
                                if (aa.oninitchild) {
                                    try {
                                        aa.oninitchild({id: subid, type: subview});
                                    } catch (e) {
                                        console.error("[bright] oninitchild called error with module of " + ths.type() + " Message:" + e.stack);
                                    }
                                }
                                module.get(aa.type(), subview, null, function (k) {
                                    for (var i = k.__info__.types.length - 1; i >= 0; i--) {
                                        bright.extend(ops, aa.option[k.__info__.types[i]]);
                                    }
                                    bright.extend(ops, aa.option[subid]);
                                    var tops = null;
                                    if (typeof aa.onoption === 'function') {
                                        try {
                                            tops = aa.onoption.call(aa, ops, subview, subid);
                                            bright.extend(ops, tops);
                                        } catch (e) {
                                            console.error("[bright] onoption called error with module of " + ths.type() + " Message:" + e.stack);
                                        }
                                    }
                                    bright.extend(k.option, ops);
                                    if (!dom.data("-view-")) {
                                        var obj = k;
                                        obj.dom = dom;
                                        obj.parentView = aa;
                                        aa.children.push(obj);
                                        obj.privator("render", function () {
                                            que.next(aa);
                                        });
                                    } else {
                                        que.next(aa);
                                    }
                                });
                            }, function () {
                                this.next(ths);
                            }, bright(this));
                        });
                        queue.run(ths);
                    });
                } catch (e) {
                    fn && fn();
                    console.error(e.stack);
                }
            }
            return this;
        },
        _addChild: function (option, callback) {
            var ths = this, ops = bright.extend({type: null,
                option: "",
                parameters: null,
                id: this.getId() + "-" + this.children.length,
                container: "body",
                domIndex: null,
                target: null,
                index: null
            }, option);
            var xindex = ops.index;
            if (ops.container.isWrapper && !ops.container.isWrapper()) {
                ops.container = "body";
            }
            try {
                module.get(ths.type(), ops.type, null, function (sobj) {
                    if (xindex === undefined || xindex === null || xindex >= ths.children.length) {
                        ths.children.push(sobj);
                    } else {
                        ths.children.splice(xindex, 0, sobj);
                    }
                    var cln = module.factory._mapping[sobj.type()].prototype.fullClassName;
                    var coner = bright(ops.container);
                    var pdom = bright("<" + sobj.tagName + " class='" + cln + "' data-parent-view='" + ths.getId() + "' data-view='" + ops.type + "' data-view-id='" + ops.id + "' data-option='" + (is.isObject(ops.option) ? "" : ops.option) + "'></" + sobj.tagName + ">");
                    if (is.isNumber(ops.domIndex)) {
                        var p = coner.children(ops.domIndex);
                        if (p.length > 0) {
                            sobj.dom = pdom.insertBefore(p);
                        } else {
                            sobj.dom = pdom.appendTo(coner, false);
                        }
                    } else {
                        sobj.dom = pdom.appendTo(coner, false);
                    }
                    var opss = {};
                    for (var i = sobj.__info__.types.length - 1; i >= 0; i--) {
                        bright.extend(opss, ths.option[sobj.__info__.types[i]]);
                    }
                    bright.extend(opss, bright.json.clone(sobj.option));
                    bright.extend(opss, ths.option[ops.id]);
                    bright.extend(opss, ths.option[ops.type]);
                    if (is.isObject(ops.option)) {
                        var tp = {};
                        tp.override = ops.option.override || {};
                        for (var i in ops.option) {
                            if (i !== "override") {
                                if (i.indexOf("override_") === 0) {
                                    tp.override[i.substring(9)] = ops.option[i];
                                } else {
                                    tp[i] = ops.option[i];
                                }
                            }
                        }
                        sobj.option = bright.extend(opss, tp);
                        for (var i in sobj.option.override) {
                            if (!module.regs.a.test(i)) {
                                sobj[i] = sobj.option.override[i];
                            }
                        }
                    }
                    if (!ths.dom.contain(sobj.dom)) {
                        sobj.___outer___ = true;
                    }
                    sobj.option = opss;
                    sobj.parameters = ops.parameters;
                    sobj.target = ops.target;
                    sobj.parentView = ths;
                    sobj.privator("render", function () {
                        if (typeof ths.oninitchild === 'function') {
                            try {
                                ths.oninitchild({id: sobj.getId(), type: sobj.type()});
                            } catch (e) {
                                console.error("[bright] oninitchild called error with module of " + ths.type() + " [" + e.message + "]");
                            }
                        }
                        callback && callback.call(sobj);
                    });
                });
            } catch (e) {
                callback && callback.call(null);
                console.error(e.stack);
            }
        },
        render: function () {
            var ps = $.promise();
            ps.scope(this);
            this.dom.unbind();
            this.dom.get(0).datasets = {};
            this.privator("render", function () {
                ps.resolve();
            });
            return ps;
        },
        getChildrenByType: function (type) {
            var r = [];
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].typeOf(type)) {
                    r.push(this.children[i]);
                }
            }
            return r;
        },
        getChildByType: function (type, index) {
            index = (index === undefined || index === index) ? 0 : index;
            return this.getChildrenByType(type)[index];
        },
        getChildById: function (id) {
            var r = null;
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].getId() === id) {
                    r = this.children[i];
                    break;
                }
            }
            return r;
        },
        getChildAt: function (index) {
            if (bright.is.isNumber(index) && index >= 0 && index < this.children.length) {
                return this.children[index];
            } else {
                return null;
            }
        },
        childEach: function (fn) {
            for (var i = 0; i < this.children.length; i++) {
                if (fn) {
                    if (fn.call(this.children[i], this.children[i], i, this.children) === false) {
                        break;
                    }
                } else {
                    break;
                }
            }
        },
        contains: function (view) {
            return this.children.indexOf(view) !== -1;
        },
        getFirstChild: function (type) {
            if (bright.is.isAvalid(type)) {
                return this.getChildrenByType(type)[0];
            } else {
                return this.children[0];
            }
        },
        getLastChild: function (type) {
            var r = null;
            if (bright.is.isAvalid(type)) {
                var a = this.getChildrenByType(type);
                if (a.length > 0) {
                    r = a[a.length - 1];
                }
            } else {
                this.children.length > 0 && (r = this.children[this.children.length - 1]);
            }
            return r;
        },
        getChildIndex: function (view) {
            return this.children.indexOf(view);
        },
        addChild: function (option) {
            var ths = this, prs = new promise();
            prs.scope(this);
            module.task.add(function (a, b) {
                var tts = this;
                ths.privator("addChild", b, function () {
                    tts.next();
                    prs.resolve(this);
                });
            }, null, option);
            return prs;
        },
        setChildIndex: function (obj, index) {
            if (index !== undefined && index !== null && index < this.children.length - 1) {
                var a = this.children.indexOf(obj);
                this.children.splice(a, 1);
                this.children.splice(index, 0, obj);
            }
            return this;
        },
        duplicateChild: function (child, id) {
            if (child) {
                this.privator("addChild", null, {
                    type: this.name,
                    option: bright.extend({}, this.option),
                    parameters: this.parameters,
                    id: id || (this.getId() + "-" + this.children.length),
                    container: this.dom.parent()
                });
            }
            return this;
        },
        removeChild: function (id) {
            var a = this.getChildById(id);
            a && a.remove();
            return this;
        },
        removeChildAt: function (index) {
            if (bright.is.isNumber(index) && index > 0 && index < this.children.length) {
                this.children[index].remove();
            }
            return this;
        },
        removeAllChild: function () {
            while (this.children.length > 0) {
                this.children.pop().remove();
            }
            return this;
        },
        clean: function () {
            var outers = [];
            for (var i in this.children) {
                if (this.children[i].___outer___) {
                    outers.push(this.children[i]);
                }
            }
            while (outers.length > 0) {
                outers.pop().remove();
            }
            try {
                this.onunload();
            } catch (e) {
                console.error("[bright] onunload called error with module of " + this.type() + " Message:" + e.stack);
            }
            var parentview = this.parentView;
            if (parentview && parentview.children) {
                var c = parentview.children.indexOf(this);
                if (c !== -1) {
                    parentview.children.splice(c, 1);
                    try {
                        parentview.onchildremove && parentview.onchildremove(this);
                    } catch (e) {
                        console.error("[bright] onchildremove called error with module of " + parentview.type() + " Message:" + e.stack);
                    }
                }
            }
            var keys = Object.keys(this);
            for (var i in keys) {
                this[keys[i]] = null;
            }
        }
    });
    module.add({
        name: "root",
        extend: "viewgroup",
        className: "root",
        init: function () {
            if (!module.isMutation()) {
                this.dom.bind("DOMNodeInserted", function (e) {
                    module.domInserted(e.target.parentNode, e.target);
                }).bind("DOMNodeRemoved", function (e) {
                    module.domRemoved(e.path[1], e.target);
                });
            } else {
                this.dom.mutationObserve(function (e) {
                    for (var i = 0; i < e.length; i++) {
                        var record = e[i], add = record.addedNodes, remove = record.removedNodes;
                        for (var j = 0; j < add.length; j++) {
                            module.domInserted(add[j].parentNode, add[j]);
                        }
                        for (var j = 0; j < remove.length; j++) {
                            module.domRemoved(record.target, remove[j]);
                        }
                    }
                }, {childList: true, subtree: true});
            }
            console.log("[bright] root view init.");
        }
    });

    var plugin = function () {
    };
    plugin.prototype.clean = function () {
        this.dom.data("__name__", null);
        for (var i in this) {
            this[i] = null;
        }
    };

    bright.Plugin = function (obj) {
        if (obj && obj.name && obj.name !== "") {
            var a = new Function("dom", "option", "this.__name__='" + obj.name + "';this.dom=dom;this.option=$.extend({},this.option,option);dom.data('" + obj.name + "',this);this.init&&this.init(dom,option);");
            a.prototype = new plugin();
            for (var i in obj) {
                a.prototype[i] = obj[i];
            }
            $.fn[obj.name] = function (option) {
                if (this.data(obj.name) && this.data(obj.name).singleton === true) {
                    return this.data(obj.name);
                } else {
                    var n = new a(this, option);
                    this.data(obj.name, n);
                    return n;
                }
            };
        }
    };
    bright.Method = function (obj) {
        if (obj && obj.name && obj.name !== "") {
            $[obj.name] = function (option) {
                if (is.isFunction(obj.action)) {
                    return obj.action(option);
                } else {
                    return null;
                }
            };
        }
    };

    var _override = {};
    if (!window.Function.prototype.bind) {
        window.Function.prototype.bind = function (scope) {
            if (typeof this !== 'function') {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }
            var args = Array.prototype.slice.call(arguments, 1), a = this;
            var r = function () {
                return a.apply(this instanceof b ? this : scope, args.concat(Array.prototype.slice.call(arguments)));
            };
            var b = function () {};
            if (this.prototype) {
                b.prototype = this.prototype;
            }
            r.prototype = new b();
            return r;
        };
    }
    bright.overrideRequest = function (obj) {
        var request = module.factory.get("request");
        var view = module.factory.get("view");
        var group = module.factory.get("viewgroup");
        var root = module.factory.get("root");
        for (var i in obj) {
            if (i !== "init" && i !== "option" && i !== "extend") {
                request.prototype[i] = obj[i];
                view.prototype[i] = obj[i];
                group.prototype[i] = obj[i];
                root.prototype[i] = obj[i];
            }
        }
    };
    bright.overrideView = function (obj) {
        var view = module.factory.get("view");
        var group = module.factory.get("viewgroup");
        var root = module.factory.get("root");
        for (var i in obj) {
            if (i !== "init" && i !== "option" && i !== "extend") {
                view.prototype[i] = obj[i];
                group.prototype[i] = obj[i];
                root.prototype[i] = obj[i];
            }
        }
    };
    bright.overrideViewGroup = function (obj) {
        var group = module.factory.get("viewgroup");
        for (var i in obj) {
            if (i !== "init" && i !== "option" && i !== "extend") {
                group.prototype[i] = obj[i];
            }
        }
    };
    bright.overrideRoot = function (obj) {
        var group = module.factory.get("root");
        for (var i in obj) {
            if (i !== "init" && i !== "option" && i !== "extend") {
                group.prototype[i] = obj[i];
            }
        }
    };
    bright.Option = function (obj) {
        if (!is.isString(obj)) {
            var optionx = obj.option, extend = [];
            if (obj.extend) {
                if (is.isString(obj.extend)) {
                    extend.push(obj.extend);
                } else {
                    extend = obj.extend;
                }
            }
            for (var i = 0; i < extend.length; i++) {
                var a = option.has(extend[i]);
                if (a) {
                    bright.extend(optionx, json.clone(a));
                } else {
                    throw Error("[bright ] can not find option with name of " + extend[i]);
                }
            }
            for (var i in obj.override) {
                var t = i.split("\."), q = optionx;
                for (var j = 0; j <= t.length - 1; j++) {
                    var key = t[j], n = q[key];
                    if (!is.isObject(n)) {
                        q[key] = {};
                    }
                    if (j === t.length - 1) {
                        q[key] = obj.override[i];
                    } else {
                        q = q[key];
                    }
                }
            }
            if (bright.___info) {
                obj.name = (bright.___info.packet ? bright.___info.packet + "." : "") + obj.name;
            }
            option.add(obj);
        } else {
            var a = option.has(obj);
            if (a) {
                return json.clone(a);
            } else {
                return null;
            }
        }
    };
    bright.Module = function (obj) {
        if (bright.___info) {
            obj.packet = bright.___info.packet;
        }
        module.add(obj);
    };
    bright.override = function (name, obj) {
        if (is.isString(name)) {
            if (is.isObject(obj)) {
                if (!_override[name]) {
                    _override[name] = bright.extend(new query(), obj);
                } else {
                    bright.extend(_override[name], obj);
                }
            }
        }
    };
    bright.toggle = function (name) {
        if (is.isString(name)) {
            _override[name] && (dom.prototype = _override[name]);
        } else {
            dom.prototype = new query();
        }
    };
    bright.global = {};
    bright.fn = query.prototype;
    window.bright = bright;
    window.$ = bright;
})();