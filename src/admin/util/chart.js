/*!
 * @packet admin.util.chart;
 * @require admin.util.dombuilder;
 * @require admin.util.graph;
 * @css admin.style.chart;
 */
if ($.browser.name().indexOf("msie") !== -1) {
    $.override("msiesvg", {
        addClass: function (a) {
            if (!this.isEmpty()) {
                if (this.nodes[0].className.baseVal) {
                    for (var i in this.nodes) {
                        if (this.nodes[i].className.baseVal) {
                            if (this.nodes[i].className.baseVal.indexOf(a) === -1) {
                                this.nodes[i].className.animVal = this.nodes[i].className.baseVal = this.nodes[i].className.baseVal + " " + a;
                            }
                        }
                    }
                } else {
                    this.predefined("addClass", a);
                }
            }
            return this;
        },
        removeClass: function (a) {
            if (!this.isEmpty()) {
                if (this.nodes[0].className.baseVal) {
                    if (this.nodes[0].className.baseVal.indexOf(a) !== -1) {
                        var reg = new RegExp('(\\s|^)' + a + '(\\s|$)');
                        for (var i in this.nodes) {
                            this.nodes[i].className.animVal = this.nodes[i].className.baseVal = this.nodes[i].className.baseVal.replace(reg, ' ');
                        }
                    }
                } else {
                    this.predefined("removeClass", a);
                }
            }
            return this;
        },
        hasClass: function (a) {
            var _a = false;
            if (!this.isEmpty()) {
                if (this.nodes[0].className.baseVal) {
                    _a = this.nodes[0].className.baseVal.indexOf(a) === -1;
                } else {
                    this.predefined("hasClass", a);
                }
            }
            return _a;
        },
        toggleClass: function (a) {
            if (!this.isEmpty()) {
                if (this.nodes[0].className.baseVal) {
                    if (this.nodes[0].className.baseVal.indexOf(a) !== -1) {
                        var reg = new RegExp('(\\s|^)' + a + '(\\s|$)');
                        for (var i in this.nodes) {
                            this.nodes[i].className.animVal = this.nodes[i].className.baseVal = this.nodes[i].className.baseVal.replace(reg, ' ');
                        }
                    } else {
                        for (var i in this.nodes) {
                            this.nodes[i].className.animVal = this.nodes[i].className.baseVal = this.nodes[i].className.baseVal + " " + a;
                        }
                    }
                } else {
                    this.predefined("toggleClass", a);
                }
            }
            return this;
        },
        children: function (num) {
            var r = [];
            if (!this.isEmpty()) {
                if ($.is.isString(num)) {
                    r = dom.util.queryChild(this.nodes[0], num);
                } else {
                    if (arguments.length === 1 && num >= 0) {
                        r = [this.nodes[0].children[num]] || [];
                    } else {
                        r = Array.prototype.slice.call(this.nodes[0].children || this.nodes[0].childNodes);
                    }
                }
            }
            var q = $();
            q.nodes = r;
            q.length = r.length;
            return q;
        }
    });
}

var factory = $.adapt();
factory.def({
    name: "baseChart",
    draw: function () {
    }
});

factory.def({
    name: "baseInfo",
    init: function (option) {
        for (var i in option) {
            this[i] = option[i];
        }
    }
});
factory.def({
    name: "axisInfo",
    extend: "baseInfo",
    option: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        xper: 20,
        yper: 20,
        xoffset: 10,
        yoffset: 10,
        xstep: 5,
        ystep: 5,
        xis: 100,
        yis: 100
    }
});
factory.def({
    name: "pieInfo",
    extend: "baseInfo",
    option: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        point: [50, 50],
        r: 50,
        start: [0, 0]
    }
});

factory.def({
    name: "graph",
    extend: "baseChart"
});
factory.def({
    name: "board",
    extend: "baseChart",
    option: {},
    init: function () {
        this.children = [];
    },
    addChild: function (a) {
        if (a && a.typeOf && a.typeOf("baseChart")) {
            a.baseInfo = this.baseInfo;
            a.parent = this;
            this.children.push(a);
        }
        return this;
    },
    getChildByType: function (type) {
        var a = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].type() === type) {
                a.push(this.children[i]);
            }
        }
        return a;
    },
    each: function (fn) {
        for (var i = 0; i < this.children.length; i++) {
            fn && fn.call(this.children[i], i);
        }
    }
});
factory.def({
    name: "axisBoard",
    extend: "board",
    option: {
        padding: null,
        xAxis: null,
        yAxis: []
    },
    init: function (option) {
        this.xMainAxis = option.xAxis;
        this.yMainAxis = option.yAxis;
        var w = option.dom.width() - option.padding.left - option.padding.right, h = option.dom.height() - option.padding.top - option.padding.bottom;
        var xper = w / (this.xMainAxis.to - this.xMainAxis.from), yper = h / (this.yMainAxis.to - this.yMainAxis.from);
        var baseInfo = factory.create("axisInfo", {
            x: option.padding.left,
            y: option.padding.top,
            width: w,
            height: h,
            xper: xper,
            yper: yper,
            xoffset: (this.xMainAxis.to - this.xMainAxis.from) / this.xMainAxis.step * xper,
            yoffset: (this.yMainAxis.to - this.yMainAxis.from) / this.yMainAxis.step * yper,
            xstep: this.xMainAxis.step,
            ystep: this.yMainAxis.step,
            xis: (0 - this.xMainAxis.from) * xper,
            yis: (0 - this.yMainAxis.from) * yper
        });
        this.baseInfo = baseInfo;
        var tip = $("<div class='tip'></div>").appendTo(option.dom).hide();
        var currentselect = null;
        option.dom.bind("currentselect", function (e) {
            currentselect = e.data;
            e.stopPropagation();
        }).bind("mousemove", function (e) {
            var x = e.offsetX, y = e.offsetY;
            if (x >= (baseInfo.x - 10) && x <= (baseInfo.x + baseInfo.width) && y >= (baseInfo.y - 10) && y <= (baseInfo.y + baseInfo.height)) {
                if (currentselect) {
                    currentselect.find("circle").each(function () {
                        var ax = $(this).get(0).getBBox().x, ay = $(this).get(0).getBBox().y;
                        if (x >= ax - 4 && x <= ax + 4) {
                            tip.html("xxxxxxx").css({
                                left: (ax - tip.width() / 2 + 2.5) + "px",
                                top: (ay - tip.height() - 5) + "px"
                            }).show();
                            return false;
                        }
                    });
                }
            } else {
                tip.hide();
            }
        });
    },
    draw: function () {
        var builder = $.svgbuilder("g");
        builder.append(this.getChildByType("title")[0].draw());
        builder.append(this.getChildByType("grid")[0].draw());
        var axis = builder.append("g", {class: "axis"});
        axis.append(this.getChildByType("xaxis")[0].draw());
        var b = this.getChildByType("yaxis");
        for (var i = 0; i < b.length; i++) {
            axis.append(b[i].draw());
        }
        axis.append(this.getChildByType("xyaxis")[0].draw());
        var graphs = builder.append("g", {class: "graphs"});
        var ths = this;
        ["bar", "multibar", "area", "line"].forEach(function (key) {
            var b = ths.getChildByType(key);
            for (var i = 0; i < b.length; i++) {
                graphs.append(b[i].draw());
            }
        });
        builder.append(this.getChildByType("legend")[0].draw());
        builder.appendTo(this.option.dom);
    }
});
factory.def({
    name: "pieBoard",
    extend: "board",
    option: {
        r: 100,
        left: 100,
        top: 100
    },
    init: function (option) {
        this.baseInfo = factory.create("pieInfo", {
            x: option.left,
            y: option.top,
            width: option.dom.width(),
            height: option.dom.height(),
            point: [option.left + option.r, option.top + option.r],
            r: option.r,
            start: [option.left + option.r * 2, option.top + option.r]
        });
    },
    draw: function () {
        var builder = $.svgbuilder("g", {class: "pie"});
        var title = this.getChildByType("title")[0];
        var xt = $.extend({}, title.baseInfo);
        xt.x = 0;
        title.baseInfo = xt;
        builder.append(title.draw());
        var a = this.getChildByType("pie");
        for (var i = 0; i < a.length; i++) {
            builder.append(a[i].draw());
        }
        builder.append(this.getChildByType("pielabel")[0].draw());
        builder.append(this.getChildByType("legend")[0].draw());
        builder.appendTo(this.option.dom);
    }
});
factory.def({
    name: "pie",
    extend: "graph",
    option: {
        isclick: true,
        rotate: 10,
        finalRotate: 10,
        color: "yellow",
        label: "",
        name: "",
        start: [],
        end: [],
        globalStart: []
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo;
        var c;
        if (ops.rotate > 180) {
            c = $.d().add("M", ops.start).add("A", [info.r, info.r, 0, 1, 1, ops.end[0], ops.end[1]]).add("L", info.point).add("z", []);
        } else {
            c = $.d().add("M", ops.start).add("A", [info.r, info.r, 0, 0, 1, ops.end[0], ops.end[1]]).add("L", info.point).add("z", []);
        }
        var builder = $.svgbuilder("g", {class: "pie" + " " + ops.color, id: ops.id});
        builder.append("path", {class: "circle", d: c.stringify()});
        var ro = ops.finalRotate - ops.rotate / 2, start = [ops.globalStart[0] + 5, ops.globalStart[1]];
        var one = this.getRotatePoint(info.point, start, ro);
        start = [ops.globalStart[0] + 25, ops.globalStart[1]];
        var two = this.getRotatePoint(info.point, start, ro), m = $.d().add("M", one).add("L", two).add("L", [two[0], two[1] + 10]);
        builder.append("path", {class: "piclabel", d: m.stringify()});
        m = $.d().add("M", [two[0], two[1] - 10]).add("L", [two[0], two[1] + 10]);
        builder.append("path", {class: "piclabel", d: m.stringify()});
        if (two[0] < one[0]) {
            builder.append("text", {
                x: two[0] - 4,
                y: two[1] + 5
            }).html(ops.value).css({"text-anchor": "end"});
        } else {
            builder.append("text", {
                x: two[0] + 4,
                y: two[1] + 5
            }).html(ops.value);
        }
        if (ops.isclick) {
            builder.bind("click", function () {
                if ($(this).hasClass("moveout")) {
                    $(this).css({
                        transform: "translate(0,0)"
                    }).removeClass("moveout");
                } else {
                    var ro = ops.finalRotate - ops.rotate / 2 - 90, rx = Math.sin(ro / 180 * Math.PI) * 8, ry = Math.cos(ro / 180 * Math.PI) * 8;
                    $(this).css({
                        transform: "translate(" + (-rx) + "px," + (ry) + "px)"
                    }).addClass("moveout");
                }
            });
        }
        return builder;
    },
    getRotatePoint: function (point, start, rotate) {
        var x = (start[0] - point[0]) * Math.cos(rotate / 180 * Math.PI) - (start[1] - point[1]) * Math.sin(rotate / 180 * Math.PI) + point[0];
        var y = (start[1] - point[1]) * Math.cos(rotate / 180 * Math.PI) + (start[0] - point[0]) * Math.sin(rotate / 180 * Math.PI) + point[1];
        return [x, y];
    }
});
factory.def({
    name: "pielabel",
    extend: "graph",
    option: {
        r: 80,
        color: "white",
        title: []//{text,color,fontSize}
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo, builder = $.svgbuilder("g", {class: "pielabel"});
        builder.append("circle", {
            cx: info.x + info.r,
            cy: info.y + info.r,
            r: ops.r
        }).css({"fill": ops.color});
        var cm = 0;
        for (var i = 0; i < ops.title.length; i++) {
            cm += ops.title[i].lineHeight || 20;
        }
        var h = info.y + (info.r * 2 - cm) / 2;
        for (var i = 0; i < ops.title.length; i++) {
            h += ops.title[i].lineHeight || 20;
            builder.append("text", {
                x: info.x + info.r,
                y: h
            }, {
                color: ops.title[i].color || "black",
                "font-size": (ops.title[i].fontSize || "12") + "px"
            }).html(ops.title[i].text);
        }
        return builder;
    }
});
factory.def({
    name: "grid",
    extend: "graph",
    option: {
        type: "all"//x,y,all,none
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo;
        var dom = $.svgbuilder("g", {class: "grid"});
        if (ops.type === "all" || ops.type === "y") {
            for (var i = 0; i <= info.xstep; i++) {
                var b = info.x + i * info.xoffset, c = $.d().add("M", [b, info.y]).add("L", [b, info.y + info.height]);
                dom.append("path", {d: c.stringify()});
            }
        }
        if (ops.type === "all" || ops.type === "x") {
            for (var i = 0; i <= info.ystep; i++) {
                var b = info.y + i * info.yoffset, c = $.d().add("M", [info.x, b]).add("L", [info.x + info.width, b]);
                dom.append("path", {d: c.stringify()});
            }
        }
        return dom;
    }
});
factory.def({
    name: "xyaxis",
    extend: "graph",
    draw: function () {
        var info = this.baseInfo;
        var builder = $.svgbuilder("g", {class: "xyaxis"});
        var c = $.d().add("M", [info.x - 3, info.y + info.height - info.yis]).add("L", [info.x + info.width + 3, info.y + info.height - info.yis]);
        builder.append("path", {d: c.stringify()});
        c = $.d().add("M", [info.x + info.xis, info.y]).add("L", [info.x + info.xis, info.y + info.height + 3]);
        builder.append("path", {d: c.stringify()});
        return builder;
    }
});
factory.def({
    name: "title",
    extend: "graph",
    option: {
        data: null//{text,fontSize,lineHeight,color}
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo;
        var builder = $.svgbuilder("g", {class: "title"}), h = 10;
        for (var i = 0; i < ops.data.length; i++) {
            h += ops.data[i].lineHeight || 20;
            builder.append("text", {
                x: info.x + info.width / 2,
                y: h
            }, {
                color: ops.data[i].color || "black",
                "font-size": (ops.data[i].fontSize || "12") + "px"
            }).html(ops.data[i].text);
        }
        return builder;
    }
});
factory.def({
    name: "xaxis",
    extend: "graph",
    option: {
        from: 0,
        to: 100,
        step: 10,
        label: [],
        title: "",
        isnumber: false
    },
    draw: function () {
        var dom = $.svgbuilder("g", {class: "axis-x"}), ops = this.option, info = this.baseInfo;
        var offset = info.width / ops.step, y = info.y + info.height;
        var c = $.d().add("M", [info.x, info.y + info.height]).add("", [info.x + info.width, y]);
        dom.append("path", {d: c.stringify()});
        var q = (ops.to - ops.from) / ops.step;
        for (var i = 0; i <= ops.step; i++) {
            var b = info.x + i * offset, c = $.d().add("M", [b, y + 3]).add("L", [b, y]);
            dom.append("path", {d: c.stringify()});
            if (ops.isnumber) {
                dom.append("text", {
                    x: b,
                    y: y + 20,
                    class: "number"
                }).html(ops.from + i * q+ops.unit);
            }
            if (ops.islabel) {
                if (i !== ops.step) {
                    dom.append("text", {
                        x: b + offset / 2,
                        y: y + 20,
                        class: "label"
                    }).html(ops.label[i] || "");
                }
            }
        }
        if (ops.title && ops.title !== "") {
            dom.append("text", {
                x: info.x + info.width / 2,
                y: y + 40,
                class: "title"
            }).html(ops.title);
        }
        return dom;
    }
});
factory.def({
    name: "yaxis",
    extend: "graph",
    option: {
        from: 0,
        to: 100,
        step: 10,
        label: [],
        title: "",
        isnumber: false
    },
    draw: function () {
        var xt = -8, xtt = -3, xxt = -40, dom = null, ops = this.option, info = this.baseInfo, x = info.x, y = info.y;
        if (ops.position === "right") {
            dom = $.svgbuilder("g", {class: "axis-y right"});
            xt = 8, xtt = 3, xxt = 40, x = info.x + info.width;
        } else {
            dom = $.svgbuilder("g", {class: "axis-y"});
        }
        var c = $.d().add("M", [x, y]).add("", [x, y + info.height]), offset = info.height / ops.step, q = (ops.to - ops.from) / ops.step;
        dom.append("path", {d: c.stringify()});
        for (var i = 0; i <= ops.step; i++) {
            var b = y + i * offset, c = $.d().add("M", [x + xtt, b]).add("L", [x, b]);
            dom.append("path", {d: c.stringify()});
            if (ops.isnumber) {
                dom.append("text", {
                    x: x + xt,
                    y: b + 5,
                    class: "number"
                }).html(ops.from + (ops.step - i) * q+ops.unit);
            }
            if (ops.islabel) {
                if (i !== ops.step) {
                    dom.append("text", {
                        x: x + xt,
                        y: info.y + 20,
                        class: "label"
                    }).html(ops.label[i]);
                }
            }
        }
        if (ops.title && ops.title !== "") {
            dom.append("text", {
                x: x + xxt,
                y: y + info.height / 2,
                class: "title"
            }).html(ops.title);
        }
        dom.future(function () {
            var a = 0;
            if ($(this).hasClass("right")) {
                var b = $(this).prev();
                while (b && b.length > 0) {
                    if (b.hasClass("axis-y") && b.hasClass("right")) {
                        break;
                    } else {
                        b = b.prev();
                    }
                }
                if (b && b.length > 0) {
                    a = b.get(0).getBBox().width + 10;
                }
            } else {
                var b = $(this).prev();
                while (b && b.length > 0) {
                    if (b.hasClass("axis-y") && !b.hasClass("right")) {
                        break;
                    } else {
                        b = b.prev();
                    }
                }
                if (b && b.length > 0)
                    a = -b.get(0).getBBox().width - 10;
            }
            $(this).css("transform", "translate(" + a + "px,0)");
        });
        return dom;
    }
});
factory.def({
    name: "bar",
    extend: "graph",
    option: {
        width: 15,
        color: "info",
        marginLeft: 0,
        marginRight: 0,
        flip: false,
        data: null
    },
    init: function (option) {
    },
    draw: function () {
        var ops = this.option, data = ops.data, info = this.baseInfo;
        var builder = $.svgbuilder("g", {class: "bar" + " " + ops.color, id: ops.id || ""});
        if (!ops.flip) {
            for (var i = 0; i < info.xstep; i++) {
                var b = info.x + i * info.xoffset + (info.xoffset - ops.width) / 2;
                var n = data[i] * info.yper;
                if (n > 0) {
                    builder.append("rect", {
                        x: b + ops.marginRight - ops.marginLeft,
                        y: info.y - n - info.yis + info.height,
                        width: ops.width,
                        height: n
                    });
                } else {
                    builder.append("rect", {
                        x: b + ops.marginRight - ops.marginLeft,
                        y: info.y - info.yis + info.height,
                        width: ops.width,
                        height: Math.abs(n)
                    });
                }
            }
        } else {
            for (var i = 0; i < info.xstep; i++) {
                var b = info.height + info.y - i * info.yoffset - ops.width - (info.yoffset - ops.width) / 2;
                var n = data[i] * info.xper;
                if (n > 0) {
                    builder.append("rect", {
                        x: info.x + info.xis,
                        y: b + ops.marginRight - ops.marginLeft,
                        width: n,
                        height: ops.width
                    });
                } else {
                    builder.append("rect", {
                        x: info.x + info.xis - Math.abs(n),
                        y: b + ops.marginRight - ops.marginLeft,
                        width: Math.abs(n),
                        height: ops.width
                    });
                }
            }
        }
        return builder;
    }
});
factory.def({
    name: "multibar",
    extend: "graph",
    option: {
        width: 15,
        color: "info",
        marginLeft: 0,
        marginRight: 0,
        flip: false,
        data: null
    },
    draw: function () {
        var ops = this.option, data = ops.data, info = this.baseInfo;
        var builder = $.svgbuilder("g", {class: "bar", id: ops.id || ""});
        if (!ops.flip) {
            for (var i = 0; i < info.xstep; i++) {
                var b = info.x + i * info.xoffset + (info.xoffset - ops.width) / 2;
                var nh = 0, nhh = 0;
                for (var t = 0; t < data.length; t++) {
                    var cd = data[t].data[i], n = cd * info.yper;
                    if (cd > 0) {
                        nh += n;
                        builder.append("rect", {
                            x: b + ops.marginRight - ops.marginLeft,
                            y: info.y - nh - info.yis + info.height,
                            width: ops.width,
                            height: n,
                            class:data[t].color
                        });
                    } else {
                        builder.append("rect", {
                            x: b + ops.marginRight - ops.marginLeft,
                            y: info.y - info.yis + nhh + info.height,
                            width: ops.width,
                            height: Math.abs(n),
                            class:data[t].color
                        });
                        nhh += Math.abs(n);
                    }
                }
            }
        } else {
            for (var i = 0; i < info.xstep; i++) {
                var b = info.y - i * info.yoffset - ops.width - (info.yoffset - ops.width) / 2;
                var nh = 0, nhh = 0;
                for (var t = 0; t < data.length; t++) {
                    var cd = data[t].data[i];
                    var n = cd * info.xper;
                    if (cd > 0) {
                        builder.append("rect", {
                            x: ops.x + nh + info.xis,
                            y: b + ops.marginRight - ops.marginLeft,
                            width: n,
                            height: ops.width,
                            class:data[t].color
                        });
                        nh += n;
                    } else {
                        nhh += Math.abs(n);
                        builder.append("rect", {
                            x: ops.x + info.xis - nhh,
                            y: b + ops.marginRight - ops.marginLeft,
                            width: Math.abs(n),
                            height: ops.width,
                            class:data[t].color
                        });
                    }
                }
            }
        }
        return builder;
    }
});
factory.def({
    name: "line",
    extend: "graph",
    option: {
        color: "info",
        data: null
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo, dom = $.svgbuilder("g", {class: "line" + " " + ops.color, id: ops.id});
        var c = $.d(), e = [];
        for (var i = 0; i < ops.data.length; i++) {
            var x = info.xis + info.x + ops.data[i][0] * info.xper, y = info.y + info.height - ops.data[i][1] * info.yper - info.yis;
            if (i === 0) {
                c.add("M", [x, y]);
            } else {
                c.add("", [x, y]);
            }
            e.push({
                cx: x,
                cy: y,
                r: 5
            });
        }
        dom.append("path", {d: c.stringify()});
        for (var i = 0; i < e.length; i++) {
            dom.append("circle", e[i]);
        }
        dom.bind("mousemove", function () {
            $(this).trigger("currentselect", $(this));
        });
        return dom;
    }
});
factory.def({
    name: "area",
    extend: "graph",
    option: {
        color: "info",
        data: null
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo, dom = $.svgbuilder("g", {class: "area" + " " + ops.color, id: ops.id});
        var c = $.d(), e = [];
        var xstart = null, end = null;
        for (var i = 0; i < ops.data.length; i++) {
            var x = info.xis + info.x + ops.data[i][0] * info.xper, y = info.y + info.height - ops.data[i][1] * info.yper - info.yis;
            if (i === 0) {
                xstart = [x, y];
                c.add("M", [x, y]);
            } else {
                c.add("L", [x, y]);
                if (i === ops.data.length - 1) {
                    end = [x, y];
                }
            }
            e.push({
                cx: x,
                cy: y,
                r: 3
            });
        }
        c.add("L", [end[0], info.y + info.height]).add("L", [xstart[0], info.y + info.height]).add("z", []);
        dom.append("path", {d: c.stringify()});
        for (var i = 0; i < e.length; i++) {
            dom.append("circle", e[i]);
        }
        dom.bind("mousemove", function () {
            $(this).trigger("currentselect", $(this));
        });
        return dom;
    }
});
factory.def({
    name: "legend",
    extend: "graph",
    option: {
        direction: "h", //h,v
        position: "r-m", //[l,t,r,b]-[l,c,r]
        lineHeight: 15,
        data: null
    },
    draw: function () {
        var ops = this.option, info = this.baseInfo, builder = $.svgbuilder("g", {class: "legendpart", ts: ops.position});
        var lineHeight = 20, yis = 1;
        for (var i = 0; i < ops.data.length; i++) {
            var n = builder.append("g", {
                class: "legend" + " " + ops.data[i].color,
                lid: ops.data[i].id || ""
            }).bind("click", function () {
                $.toggle("msiesvg");
                $(this).toggleClass("disabled");
                var id = $(this).attr("lid");
                if ($(this).hasClass("disabled")) {
                    $(this).parent(".chart").find("#" + id).hide();
                } else {
                    $(this).parent(".chart").find("#" + id).show();
                }
                $.toggle();
            }).bind("mouseover", function () {
                var id = $(this).attr("lid");
                $.toggle("msiesvg");
                $(this).parent(".chart").find("#" + id).addClass("hover");
                $.toggle();
            }).bind("mouseout", function () {
                var id = $(this).attr("lid");
                $.toggle("msiesvg");
                $(this).parent(".chart").find("#" + id).removeClass("hover");
                $.toggle();
            });
            n.append("rect", {
                x: 1,
                y: yis,
                width: 10,
                height: 8
            });
            n.append("text", {
                x: 13,
                y: yis + 7
            }).html(ops.data[i].name || "");
            if (ops.direction === "h") {
                yis += lineHeight;
                builder.future(function () {
//                        $.toggle("msiesvg");
                    var _height = 0, _width = 0;
                    $(this).children().each(function () {
                        var q = $(this).get(0).getBBox();
                        _height += lineHeight;
                        if (q.width > _width) {
                            _width = q.width;
                        }
                    });
                    var ps = $(this).attr("ts");
                    var _c = ps.split("-");
                    var t = _c[0], l = _c[1];
                    var x = 0, y = 0, width = $(this).parent(".chart").width(), height = $(this).parent(".chart").height();
                    if (t === "t") {
                        y = 5;
                    } else if (t === "m") {
                        y = height / 2 - _height / 2;
                    } else {
                        y = height - _height - 5;
                    }
                    if (l === "l") {
                        x = 5;
                    } else if (l === "m") {
                        x = width / 2 - _width / 2;
                    } else {
                        x = width - _width - 5;
                    }
                    $(this).attr({
                        transform: "translate(" + x + "," + y + ")"
                    });
//                        $.toggle();
                });
            } else {
                builder.future(function () {
//                        $.toggle("msiesvg");
                    var c = 0;
                    $(this).children().each(function () {
                        $(this).css({
                            transform: "translate(" + c + "px,0)"
                        });
                        c += $(this).get(0).getBBox().width + 10;
                    });
                    var _width = c - 10;
                    var _height = $(this).get(0).getBBox().height;
                    var ps = $(this).attr("ts");
                    var _c = ps.split("-");
                    var t = _c[0], l = _c[1];
                    var x = 0, y = 0, width = $(this).parent(".chart").width(), height = $(this).parent(".chart").height();
                    if (t === "t") {
                        y = 5;
                    } else if (t === "m") {
                        y = height / 2 - _height / 2;
                    } else {
                        y = height - _height - 5;
                    }
                    if (l === "l") {
                        x = 5;
                    } else if (l === "m") {
                        x = width / 2 - _width / 2;
                    } else {
                        x = width - _width - 5;
                    }
                    $(this).attr({
                        transform: "translate(" + x + "," + y + ")"
                    });
//                        $.toggle();
                });
            }
        }
        builder.data("chart", this);
        return builder;
    }
});

$.fn.axisChart = function (option) {
    $.toggle("msiesvg");
    $(this).addClass("chart");
    var board = factory.create("axisBoard", {
        dom: $(this),
        padding: option.padding,
        xAxis: option.xAxis,
        yAxis: option.yAxis[0]
    });
    board.addChild(factory.create("title", {data: option.title}));
    board.addChild(factory.create("grid", option.grid));
    board.addChild(factory.create("xyaxis"));
    board.addChild(factory.create("xaxis", option.xAxis));
    for (var i = 0; i < option.yAxis.length; i++) {
        board.addChild(factory.create("yaxis", option.yAxis[i]));
    }
    var cd = [];
    for (var i in option.graph) {
        if (factory.has(i)) {
            var q = option.graph[i];
            for (var t in q) {
                var n = factory.create(i, q[t]);
                board.addChild(n);
                n.option.id = i + "-" + t;
                n.option.name || (n.option.name = i + "-" + t);
                n.option.color || (n.option.color = "info");
                cd.push({
                    id: n.option.id,
                    name: n.option.name,
                    color: n.option.color
                });
            }
        }
    }
    option.legend["data"] = cd;
    board.addChild(factory.create("legend", option.legend));
    board.draw();
    $.toggle();
};
$.fn.pieChart = function (option) {
    $.toggle("msiesvg");
    $(this).addClass("chart");
    var ops = $.extend({
        left: 100,
        top: 50,
        r: 100,
        dom: $(this)
    }, option);
    var board = factory.create("pieBoard", ops);
    var start = board.baseInfo.start, point = board.baseInfo.point, finalrotate = 0;
    board.addChild(factory.create("title", {data: option.title}));
    board.addChild(factory.create("pielabel", option.pielabel));
    var cd = [], q = 0;
    for (var i = 0; i < option.data.length; i++) {
        q += option.data[i].value;
    }
    for (var i = 0; i < option.data.length; i++) {
        option.data[i]["rotate"] = option.data[i].value / q * 360;
    }
    for (var i = 0; i < option.data.length; i++) {
        var pie = factory.create("pie", option.data[i]), rotate = option.data[i].rotate;
        finalrotate += rotate;
        pie.option.start = start;
        pie.option.finalRotate = finalrotate;
        pie.option.globalStart = board.baseInfo.start;
        var x = (start[0] - point[0]) * Math.cos(rotate / 180 * Math.PI) - (start[1] - point[1]) * Math.sin(rotate / 180 * Math.PI) + point[0];
        var y = (start[1] - point[1]) * Math.cos(rotate / 180 * Math.PI) + (start[0] - point[0]) * Math.sin(rotate / 180 * Math.PI) + point[1];
        pie.option.end = [x, y];
        start = [x, y];
        board.addChild(pie);
        pie.option.id = "pie-" + i;
        pie.option.name || (pie.option.name = "pie-" + i);
        pie.option.color || (pie.option.color = "info");
        cd.push({
            id: pie.option.id,
            name: pie.option.name,
            color: pie.option.color
        });
    }
    option.legend["data"] = cd;
    board.addChild(factory.create("legend", option.legend));
    board.draw();
    $.toggle();
};