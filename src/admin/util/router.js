/*!
 * @packet admin.util.router;
 */
var agent = {
    add: function (data, title, url) {
        window.history.pushState(data, title, url);
        return this;
    },
    replace: function (data, title, url) {
        window.history.replaceState(data, title, url);
        return this;
    },
    onChange: function (fn) {
        window.onpopstate = function (e) {
            fn && fn(e);
        };
    }
};
var router = {
    map: {},
    list: [],
    hasDot: /\{\w*\}/g,
    add: function (path, fn) {
        if (path[path.length - 1] !== "/") {
            path = path + "/";
        }
        var has = false, count = 0, start = 0, pars = [];
        var pathx = path.replace(this.hasDot, function (a, b) {
            has = true;
            if (count === 0) {
                start = b;
            }
            pars.push(a.substring(1, a.length - 1));
            count++;
            return "((?!/).)*";
        });
        if (has) {
            var info = {};
            info.originalpath = path;
            info.pattern = new RegExp("^" + pathx + "$");
            info.count = count;
            info.patternString = "^" + pathx + "/$";
            info.firstposition = start;
            info.keys = pars;
            info.callback = fn;
            var aStrings = path.split("\\.");
            if (aStrings.length > 1) {
                info.suffix = aStrings[1];
            }
            this.list.push(info);
        } else {
            this.map[path] = fn;
        }
    },
    check: function (path) {
        var result = {
            found: false,
            hasParas: false,
            path: "",
            matchpath: "",
            map: {},
            paras: $.serialize.queryObject(path),
            hash: $.serialize.hashObject(path),
            callback: null
        };
        var t = path.split("?");
        if (t.length > 1) {
            path = t[0];
        }
        var suffix = "", bString = path.split("\\.");
        if (bString.length > 1) {
            suffix = bString[1];
            path = path + "/";
        } else {
            if (bString[0][bString[0] - 1] !== "/") {
                path = bString[0] + "/";
            }
        }
        if (this.map[path]) {
            result.path = path;
            result.matchpath = path;
            result.callback = this.map[path];
            result.found = true;
            return result;
        } else {
            var a = null;
            for (var i in this.list) {
                var info = this.list[i];
                if (info.pattern.test(path)) {
                    if (null === a) {
                        a = info;
                    } else if (info.suffix === suffix) {
                        if (info.count <= a.count) {
                            if (info.firstposition > a.firstposition) {
                                a = info;
                            }
                        }
                    }
                }
            }
            if (null !== a) {
                var p = path.split("/"), pp = a.originalpath.split("/");
                var cd = 0;
                for (var i = 0; i < pp.length; i++) {
                    if (pp[i][0] === "{") {
                        result.map[a.keys[cd]] = p[i];
                        cd++;
                    }
                }
                result.hasParas = true;
                result.path = a.originalpath;
                result.matchpath = path;
                result.callback = info.callback;
                result.found = true;
            }
            return result;
        }
    }
};

module.exports = {
    url: window.location.href,
    init: function (option) {
        if (option) {
            this.url = option;
        }
        var ths = this;
        agent.onChange(function (e) {
            var state = e.state, info = null;
            if (!state) {
                state = {
                    "__page__": ""
                };
            } else {
                info = {};
                for (var i in e.state) {
                    if (i !== "__page__") {
                        info[i] = e.state[i];
                    }
                }
            }
            var r = router.check(state.__page__);
            if (r.found) {
                r.callback && r.callback.call(ths, {
                    keys: r.hasParas ? r.map : null,
                    parameters: r.paras,
                    hash: r.hash,
                    info: $.is.isEmptyObject(info) ? null : info,
                    e: e
                });
            }
        });
        return this;
    },
    run: function (url, data, title) {
        if (!data) {
            data = {};
        }
        data["__page__"] = url;
        agent.add(data, title, this.url + url);
    },
    edit: function (url, data, title) {
        if (!data) {
            data = {};
        }
        data["__page__"] = url;
        agent.replace(data, title, this.url + url);
    },
    bind: function (obj, fn) {
        if (arguments.length === 1) {
            for (var i in obj) {
                router.add(i, obj[i]);
            }
        } else if (arguments.lenth === 2) {
            router.add(obj, fn);
        }
        return this;
    }
};