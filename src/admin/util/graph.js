/*!
 * @packet admin.util.graph;
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
            console.log(nodes);
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