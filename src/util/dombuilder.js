/*!
 * @packet util.dombuilder;
 */
var node = function () {
    this.tag = "";
    this.props = {};
    this.hasProp = false;
    this.children = [];
    this.parent = null;
    this.cache = null;
};
node.prototype.element = function () {
    this.cache = $().create(this.tag, "http://www.w3.org/2000/svg").attr(this.props);
    if (this.parent && this.parent.cache) {
        this.parent.cache.append(this.cache);
    }
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].element();
    }
};
var textnode = function (content, parent) {
    this.content = content;
    this.parent = parent;
};
textnode.prototype.element = function () {
    var a = $();
    a.nodes = [window.document.createTextNode(this.content)];
    a.length = 1;
    this.cache = a;
    if (this.parent && this.parent.cache) {
        this.parent.cache.append(this.cache);
    }
};
var tagsTransformer = {
    isDoctype: /\<\!DOCTYPE[\s\S]*?\>/g,
    isNote: /\<\!\-\-[\s\S]*?\-\-\>/g,
    isXmlTag: /\<\?[\s\S]*?\?\>/g,
    filter: function (str) {
        str = str.trim();
        return str.replace(tagsTransformer.isNote, "").replace(tagsTransformer.isDoctype, "").replace(tagsTransformer.isXmlTag, "");
    },
    noLatin1: function (str) {
        var r = "";
        for (var i = 0; i < str.length; i++) {
            if (str[i].charCodeAt(0) <= 255) {
                r += str[i];
            }
        }
        return r;
    },
    parse: function (str) {
        if (str && str !== "") {
            str = tagsTransformer.filter(str);
            var stacks = [], nodes = [], current = null;
            var tagname = "", tagendname = "", propname = "", value = "", text = "";
            var tagnamestart = false, propstart = false, valuestart = false, tagendstart = false, element = false;
            for (var i = 0; i < str.length; i++) {
                var a = str[i];
                if (a !== "\r" && a !== "\n") {
                    if (a === "<") {
                        element = true;
                        if (text.trim() !== "") {
                            current = new textnode(text.trim(), stacks[stacks.length - 1]);
                            stacks[stacks.length - 1].children.push(current);
                            text = "";
                        }
                        if (str[i + 1] && str[i + 1] === "/") {
                            tagendstart = true;
                        } else {
                            current = new node();
                            stacks.push(current);
                            if (stacks.length - 2 >= 0) {
                                stacks[stacks.length - 2].children.push(current);
                                current.parent = stacks[stacks.length - 2];
                            }
                            tagnamestart = true;
                        }
                        continue;
                    } else if (a === " ") {
                        if (element) {
                            if (tagnamestart) {
                                tagnamestart = false;
                                current.tag = tagname.trim();
                                tagname = "";
                            }
                            if (!propstart && !valuestart) {
                                propstart = true;
                                continue;
                            }
                        }
                    } else if (a === "=") {
                        element && (propstart = false);
                    } else if (a === "'" || a === "\"") {
                        if (!valuestart && element) {
                            valuestart = a;
                            continue;
                        } else {
                            if (valuestart === a) {
                                valuestart = false, current.hasProp = true;
                                current.props[propname.trim()] = value.trim();
                                propname = "", value = "";
                            }
                        }
                    } else if (a === ">") {
                        element = false, propstart = false, valuestart = false, tagnamestart = false;
                        if (tagendstart) {
                            tagendstart = false, tagendname = "";
                            stacks.length === 1 && (nodes.push(stacks[0]));
                            stacks.pop();
                        }
                        if (!current.hasProp) {
                            current.tag === "" && (current.tag = tagname.trim());
                            tagname = "";
                        }
                        continue;
                    } else if (a === "/") {
                        if (str[i + 1] && str[i + 1] === ">") {
                            element = false, valuestart = false, propstart = false,
                                    tagendstart = false, tagnamestart = false, tagendname = "";
                            if (stacks.length === 1) {
                                nodes.push(stacks[0]);
                            }
                            if (!current.hasProp) {
                                current.tag === "" && (current.tag = tagname.trim());
                                tagname = "";
                            }
                            stacks.pop();
                        } else {
                            value += a;
                        }
                        continue;
                    }
                    tagnamestart && (tagname += a);
                    propstart && (propname += a);
                    valuestart && (value += a);
                    tagendstart && (tagendname += a);
                    !element && (text += a);
                }
            }

            return nodes;
        } else {
            return [];
        }
    },
    convers: function (svg) {
        var nodes = tagsTransformer.parse(svg), b = $();
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].element();
            b.nodes.push(nodes[i].cache.get(0));
        }
        b.length = b.nodes.length;
        return b;
    }
};

$.svg = function (html) {
    var a = $().create("svg", "http://www.w3.org/2000/svg");
    if ($.is.isString(html)) {
        if ($.browser.name() === "chrome") {
            var b = $();
            a.html(html).children().each(function () {
                b.nodes.push(this);
                b.length += 1;
            });
            return b;
        } else {
            return tagsTransformer.convers(html);
        }
    } else {
        return a;
    }
};
$.fn.svgElement = function (type) {
    if (!$.is.isString(type)) {
        type = "svg";
    }
    return $().create(type, "http://www.w3.org/2000/svg");
};
$.svgToImage = function (dom) {
    if (dom && dom.isWrapper && !dom.isEmpty() && dom.get(0).nodeName.toLowerCase() === "svg") {
        var str = dom.attr({
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg"
        }).get(0).outerHTML;
        return $().element("img").attr("src", 'data:image/svg+xml;base64,' + btoa(tagsTransformer.noLatin1(str)));
    } else {
        return null;
    }
};
$.saveSvg = function (dom) {
    var image = $.svgToImage(dom);
    if (image) {
        var c = $().element("canvas").attr({
            width: image.get(0).width,
            height: image.get(0).height
        }).get(0);
        c.getContext("2d").drawImage(image.get(0), 0, 0);
        $().element("a").attr({
            href: c.toDataURL("image/png"),
            download: "aa.png"
        }).trigger("click");
    }
};

var d = function (d) {
    this._mapping = this.parse(d) || [];
};
$.extend(d.prototype, {
    parse: function (d) {
        if ($.is.isString(d) && d !== "") {
            var i = 0, r = [], current = {name: "", value: ""};
            while (true) {
                var t = d[i];
                if (/[a-zA-Z]/.test(t)) {
                    var m = [];
                    for (var n = 0; n < current.value.length; n++) {
                        if (current.value[n] !== "") {
                            m.push(parseFloat(current.value[n]));
                        }
                    }
                    current.value = m;
                    current = {
                        name: t,
                        value: [""]
                    };
                    r.push(current);
                } else {
                    if (/[\s,]/.test(t)) {
                        current.value.push("");
                    } else {
                        current.value[current.value.length - 1] += t;
                    }
                }
                i++;
                if (i >= d.length) {
                    break;
                }
            }
            if (r.length > 0) {
                var m = [];
                for (var n = 0; n < current.value.length; n++) {
                    if (current.value[n] !== "") {
                        m.push(parseFloat(current.value[n]));
                    }
                }
                current.value = m;
            }
            return r;
        } else {
            return null;
        }
    },
    stringify: function () {
        var r = "", array = this._mapping;
        for (var i = 0; i < array.length; i++) {
            r += array[i].name + " ";
            for (var t = 0; t < array[i].value.length; t++) {
                r += array[i].value[t] + " ";
            }
        }
        return r.trim();
    },
    get: function (m, index) {
        var r = [];
        for (var i = 0; i < this._mapping.length; i++) {
            if (this._mapping[i].name === m) {
                r.push(this._mapping[i]);
            }
        }
        if ($.is.isAvalid(index)) {
            return r[index];
        } else {
            return r;
        }
    },
    set: function (m, index, value) {
        if ($.is.isNumber(index)) {
            for (var i = 0; i < this._mapping.length; i++) {
                if (this._mapping[i].name === m && index === i) {
                    this._mapping[i].value = value;
                }
            }
        } else if ($.is.isArray(index)) {
            for (var i = 0; i < this._mapping.length; i++) {
                if (this._mapping[i].name === m) {
                    this._mapping[i].value = index;
                }
            }
        }
        return this;
    },
    add: function (m, value) {
        this._mapping.push({
            name: m,
            value: $.is.isAvalid(value) ? value : []
        });
        return this;
    },
    remove: function (m, index) {
        if ($.is.isString(m)) {
            if ($.is.isNumber(index)) {
                for (var i = 0; i < this._mapping.length; i++) {
                    if (this._mapping[i].name === m && index === i) {
                        this._mapping.splice(i, 1);
                    }
                }
            } else {
                for (var i = 0; i < this._mapping.length; i++) {
                    if (this._mapping[i].name === m) {
                        this._mapping.splice(i, 1);
                    }
                }
            }
        } else {
            this._mapping.length = 0;
        }
        return this;
    }
});
$.d = function (a) {
    return new d(a);
};



$.builder = function (tag, props, css, datasets) {
    return new element(tag, props, css, datasets);
};
$.svgbuilder = function (tag, props, css, datasets) {
    if (arguments.length === 0) {
        tag = "g";
    }
    var a = new element(tag, props, css, datasets);
    a._issvg = true;
    return a;
};
var element = function (tag, props, css, datasets) {
    this._tag = (tag || "").toLowerCase();
    this._class = [];
    this._dataset = {};
    this._props = props || {};
    this._css = css || {};
    this._children = [];
    this._event = null;
    this._data = null;
    this._parent = null;
    this._future = null;
    this._text = "";
    this._issvg = false;
    if (props && props["class"]) {
        this._class.push(props['class']);
        props["class"] = null;
    }
    for (var i in datasets) {
        this._dataset[element._uper(i)] = datasets[i];
    }
};
element._compile = function (withid) {
    var event = [], data = [], future = [], str = "", ids = [];
    var cle = function (element) {
        var els = " ", a = "", prop = "", css = " style='", clz = " class='", ds = "", isz = false, isx = false, isc = false;
        if (element._event) {
            event.push(element._event);
            element._event = null;
            els += " event='" + (event.length - 1) + "'";
            isc = true;
        }
        if (element._data) {
            data.push(element._data);
            element._data = null;
            els += " cache='" + (data.length - 1) + "'";
            isc = true;
        }
        if (element._future) {
            future.push(element._future);
            element._future = null;
            els += " future='" + (future.length - 1) + "'";
            isc = true;
        }
        if (isc) {
            if (withid === true) {
                if (!element._props["id"]) {
                    var nt = "___todo" + Math.round(Math.random() * 1000000);
                    element._props["id"] = nt;
                    ids.push(nt);
                } else {
                    ids.push(element._props["id"]);
                }
            } else {
                element.addClass("_todo");
            }
        }
        for (var i in element._class) {
            if (element._class[i]) {
                clz += element._class[i] + " ";
                isz = true;
            }
        }
        clz += "'";
        if (!isz) {
            clz = "";
        }
        for (var i in element._props) {
            if (element._props[i] !== undefined && element._props[i] !== null) {
                prop += " " + i + "='" + element._props[i] + "'";
            }
        }
        for (var i in element._css) {
            if (element._css[i]) {
                css += i + ":" + element._css[i] + ";";
                isx = true;
            }
        }
        for (var i in this._dataset) {
            if (this._dataset[i]) {
                ds += "data-" + i + "=" + this._dataset[i];
            }
        }
        css += "'";
        if (!isx) {
            css = "";
        }
        a += "<" + element._tag + clz + prop + css + els + ds + ">";
        for (var i = 0; i < element._children.length; i++) {
            a += cle(element._children[i]);
        }
        a += element._text;
        a += "</" + element._tag + ">";
        return a;
    };
    str = cle(this);
    return {
        ids: ids,
        future: future,
        event: event,
        data: data,
        str: str
    };
};
element._setId = function (f, r) {
    var q = r.ids;
    var qid = f.attr("id");
    if (qid && qid !== "") {
        q.unshift(qid);
    }
    for (var i = 0; i < q.length; i++) {
        var node = $("#" + q[i]);
        if (q[i].indexOf("___todo") !== -1) {
            node.attr("id", "");
        }
        var event = r.event[node.attr("event")], data = r.data[node.attr("cache")], future = r.future[node.attr("future")];
        for (var b in event) {
            var p = event[b];
            for (var t = 0; t < p.length; t++) {
                node.bind(b, p[t]);
            }
        }
        node.data(data);
        future && future.call(node);
    }
    r.event.length = 0;
    r.data.length = 0;
    r.future.length = 0;
    r.ids.length = 0;
    return f;
};
element._set = function (f, r) {
    f.find("._todo").add(f).each(function () {
        var event = r.event[$(this).attr("event")], data = r.data[$(this).attr("cache")], future = r.future[$(this).attr("future")];
        for (var i in event) {
            var p = event[i];
            for (var t = 0; t < p.length; t++) {
                $(this).bind(i, p[t]);
            }
        }
        $(this).data(data);
        future && future.call(this);
    });
    r.event.length = 0;
    r.data.length = 0;
    r.future.length = 0;
    return f;
};
element._uper = function (str) {
    return str.replace(/[A-Z]/g, function (w) {
        return "-" + w.toLowerCase();
    });
};
element.prototype.addClass = function (a) {
    if (this._class.indexOf(a) === -1) {
        this._class.push(a);
    }
    return this;
};
element.prototype.removeClass = function (a) {
    var num = this._class.indexOf(a);
    if (num !== -1) {
        this._class.splice(num, 1);
    }
    return this;
};
element.prototype.toggleClass = function (a) {
    var num = this._class.indexOf(a);
    if (num === -1) {
        this._class.push(a);
    } else {
        this._class.splice(num, 1);
    }
    return this;
};
element.prototype.dataset = function (key, value) {
    if (arguments.length === 1) {
        if ($.is.isString(key)) {
            return this._dataset[element._uper(key)];
        } else {
            for (var i in key) {
                this._dataset[element._uper(i)] = key[i];
            }
        }
    } else if (argument.lenght === 2) {
        this._dataset[element._uper(key)] = value;
    }
    return this;
};
element.prototype.attr = function (key, value) {
    if (arguments.length === 1) {
        if ($.is.isString(key)) {
            return this._props[key];
        } else {
            $.extend(this._props, key);
        }
    } else if (arguments.lenght === 2) {
        this._props[key] = value;
    }
    return this;
};
element.prototype.css = function (key, value) {
    if (arguments.length === 1) {
        if ($.is.isString(key)) {
            return this._css[key];
        } else {
            $.extend(this._css, key);
        }
    } else if (arguments.lenght === 2) {
        this._css[key] = value;
    }
    return this;
};
element.prototype.first = function () {
    return this._children[0];
};
element.prototype.last = function () {
    return this._children[this._children.length - 1];
};
element.prototype.next = function () {
    if (this._parent) {
        var c = this._parent._children.indexOf(this);
        if (c !== -1) {
            c = c + 1;
            if (c < this._parent._children.length) {
                return this._parent._children[c];
            }
        }
    }
    return null;
};
element.prototype.prev = function () {
    if (this._parent) {
        var c = this._parent._children.indexOf(this);
        if (c !== -1) {
            c = c - 1;
            if (c >= 0) {
                return this._parent._children[c];
            }
        }
    }
    return null;
};
element.prototype.children = function (num) {
    if (arguments.length === 0) {
        return this._children;
    } else {
        return this._children[num];
    }
};
element.prototype.remove = function () {
    var a = this._parent._children.indexOf(this);
    if (a !== -1) {
        this._parent._children.splice(a, 1);
    }
    return this;
};
element.prototype.clone = function () {
    var e = new element();
    for (var i in this) {
        if (e.hasOwnProperty(i)) {
            e[i] = this[i];
        }
    }
    return e;
};
element.prototype.div = function (props, css, datasets) {
    return this.append("div", props, css, datasets);
};
element.prototype.span = function (props, css, datasets) {
    return this.append("span", props, css, datasets);
};
element.prototype.append = function (tag, props, css, datasets) {
    if (tag instanceof element) {
        this._children.push(tag);
        return this;
    } else if ($.is.isString(tag)) {
        var a = new element(tag, props, css, datasets);
        a._parent = this;
        this._children.push(a);
        return a;
    } else {
        return this;
    }
};
element.prototype.parent = function (num) {
    if (arguments.length === 0) {
        return this._parent;
    } else if ($.is.isNumber(num)) {
        var i = 0, num = parseInt(num), r = this;
        while (r && i < num) {
            r = r._parent;
        }
        return r;
    }
};
element.prototype.perpend = function (tag, props, css, datasets) {
    if (tag instanceof element) {
        this._children.splice(0, 0, tag);
        return this;
    } else {
        var a = new element(tag, props, css, datasets);
        a._parent = this;
        this._children.splice(0, 0, a);
        return a;
    }
};
element.prototype.empty = function () {
    this._children.length = 0;
    return this;
};
element.prototype.wrap = function (tag, props, css, datasets) {
    if (tag instanceof element) {
        tag._parent = this._parent;
        if (this._parent) {
            var b = this._parent._children.indexOf(this);
            if (b !== -1) {
                this._parent._children.splice(b, 1, tag);
            }
        }
        tag._children.push(this);
        this._parent = tag;
    } else {
        var a = new element(tag, props, css, datasets);
        a._children.push(this);
        a._parent = this._parent;
        if (this._parent) {
            var b = this._parent._children.indexOf(this);
            if (b !== -1) {
                this._parent._children.splice(b, 1, a);
            }
        }
        this._parent = a;
    }
    return this;
};
element.prototype.before = function (tag, props, css, datasets) {
    if (this._parent) {
        var index = this._parent._children.indexOf(this);
        if (tag instanceof element) {
            if (index !== -1) {
                if (index - 1 >= 0) {
                    this._parent._children.splice(index - 1, 1, tag);
                } else {
                    this._parent._children.push(tag);
                }
                tag._parent = this._parent;
            }
        } else {
            var a = new element(tag, props, css, datasets);
            if (index - 1 >= 0) {
                this._parent._children.splice(index - 1, 1, a);
            } else {
                this._parent._children.push(a);
            }
            a._parent = this._parent;
        }
    }
    return this;
};
element.prototype.after = function (tag, props, css, datasets) {
    if (this._parent) {
        var index = this._parent._children.indexOf(this);
        if (tag instanceof element) {
            if (index !== -1) {
                if (index + 1 < this._parent._children.length) {
                    this._parent._children.splice(index + 1, 1, tag);
                } else {
                    this._parent._children.push(tag);
                }
                tag._parent = this._parent;
            }
        } else {
            var a = new element(tag, props, css, datasets);
            if (index + 1 < this._parent._children.length) {
                this._parent._children.splice(index + 1, 1, a);
            } else {
                this._parent._children.push(a);
            }
            a._parent = this._parent;
        }
    }
    return this;
};
element.prototype.html = function (b) {
    if (arguments.length === 0) {
        var els = " ", a = "", prop = "", css = " style='", clz = " class='", ds = "", isz = false, isx = false, isc = false;
        for (var i in element._class) {
            if (element._class[i]) {
                clz += element._class[i] + " ";
                isz = true;
            }
        }
        clz += "'";
        if (!isz) {
            clz = "";
        }
        for (var i in element._props) {
            if (element._props[i]) {
                prop += " " + i + "='" + element._props[i] + "'";
            }
        }
        for (var i in element._css) {
            if (element._css[i]) {
                css += i + ":" + element._css[i] + ";";
                isx = true;
            }
        }
        for (var i in this._dataset) {
            if (this._dataset[i]) {
                ds += "data-" + i + "=" + this._dataset[i];
            }
        }
        css += "'";
        if (!isx) {
            css = "";
        }
        a += "<" + element._tag + clz + prop + css + els + ds + ">";
        for (var i = 0; i < element._children.length; i++) {
            a += cle(element._children[i]);
        }
        a += "</" + element._tag + ">";
        return a;
    } else {
        this._text = b;
        return this;
    }
};
element.prototype.future = function (fn) {
    if ($.is.isFunction(fn)) {
        this._future = fn;
    }
    return this;
};
element.prototype.bind = function (type, fn) {
    if (!this._event) {
        this._event = {};
    }
    if (!this._event[type]) {
        this._event[type] = [];
    }
    this._event[type].push(fn);
    return this;
};
element.prototype.data = function (key, value) {
    if (!this._data) {
        this._data = {};
    }
    if (arguments.length === 2) {
        this._data[key] = value;
        return this;
    } else {
        return this._data[key];
    }
};
element.prototype.removeData = function (key) {
    if (arguments.length === 0) {
        this._data = {};
    } else {
        if (this._data[key]) {
            var c = {};
            for (var i in this._data) {
                if (i !== key) {
                    c[i] = this._data[i];
                }
            }
            this._data = c;
        }
    }
    return this;
};
element.prototype.unbind = function (type, fn) {
    if (arguments.length === 0) {
        this._event = null;
    } else if (arguments.length === 1) {
        this._event[type] && (this._event[type].length = 0);
    } else if (arguments.length === 2) {
        if (this._event[type]) {
            var a = this._event[type].indexOf(fn);
            if (a !== -1) {
                this._event[type].splice(a, 1);
            }
        }
    }
    return this;
};
element.prototype.clean = function () {
    this._tag = null;
    this._class.length = 0;
    this._dataset = null;
    this._props = null;
    this._css = null;
    this._event = null;
    this._data = null;
    this._parent = null;
    this._future = null;
    for (var i = 0; i < this._children.length; i++) {
        this._children[i].clean();
    }
    this._children.length = 0;
};
element.prototype.insertBefore = function (dom) {
    return element.ad.call(this, dom, "insertBefore");
};
element.prototype.insertAfter = function (dom) {
    return element.ad.call(this, dom, "insertAfter");
};
element.prototype.prepend = function (dom) {
    return element.ad.call(this, dom, "prepend");
};
element.prototype.appendTo = function (dom) {
    return element.ad.call(this, dom, "appendTo");
};
element.prototype.replaceWith = function (dom) {
    return element.ad.call(this, dom, "replaceWith");
};
element.prototype.isBuilder = function () {
    return this instanceof element;
};
element.ad = function (dom, name) {
    var f = null;
    if (this._issvg) {
        var r = null, str = null;
        if ($.browser.name().indexOf("msie") !== -1) {
            r = element._compile.call(this, true), str = r.str;
        } else {
            r = element._compile.call(this), str = r.str;
        }
        if (this._tag !== "svg") {
            f = $().create("svg", "http://www.w3.org/2000/svg").attr({
                width: dom.width(),
                height: dom.height()
            }).append($.svg(str))[name](dom);
        } else {
            f = $.svg(str)[name](dom);
        }
        if ($.browser.name().indexOf("msie") !== -1 || $.browser.name().indexOf("edge") !== -1) {
            return element._setId(f, r);
        } else {
            return element._set(f, r);
        }
    } else {
        var r = element._compile.call(this), str = r.str;
        f = $(str)[name](dom);
        return element._set(f, r);
    }
};
$.builder.fn = element.prototype;