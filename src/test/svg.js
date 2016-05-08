/* 
 * @packet test.svg;
 * @template test.template.svg;
 * @css test.style.svg:style;
 * @require util.dombuilder;
 */
Module({
    name: "svgposition",
    extend: "viewgroup",
    className: "svgposition",
    layout: module.getTemplate("@svg", "svgposition"),
    option: {
        inner: "@.position"
    },
    init: function () {},
    find_zoomin: function (dom) {
        var ths = this;
        dom.click(function () {
            ths.getChildAt(0).zoomIn();
        });
    },
    find_zoomout: function (dom) {
        var ths = this;
        dom.click(function () {
            ths.getChildAt(0).zoomOut();
        });
    },
    find_item: function (dom) {
        var ths = this;
        dom.click(function () {
            ths.getChildAt(0).flashPoints($(this).html());
        });
    },
    event_positionok: function () {
        var a = this.getChildAt(0).getUsersInfo();
        console.log(a);
        $.template(module.getTemplate("@svg", "xpositionitems")).renderAppendTo(this.finders("users"), a);
        this.delegate();
    }
});
Module({
    name: "position",
    extend: "view",
    className: "xposition",
    template: module.getTemplate("@svg", "xposition"),
    option: {
        aurl: "data/ImageInfo.json",
        burl: "data/Record.json",
        colors: ["red", "blue", "yellow", "green", "grey", "orange", "black"],
        zoom: 0.5,
        currentZoom: 1
    },
    init: function () {
        this.render();
        this.setDrag();
        this.getPicInfo();
        this.currentUser = null;
        this._hideUsers = [];
    },
    getPicInfo: function () {
        this.info = {};
        this.postRequest(this.option.aurl).done(function (a) {
            this.info.base = a;
            this.postRequest(this.option.burl).done(function (b) {
                this.info.points = b;
                this.dispatchEvent("datadone");
            });
        });
    },
    setCanvas: function () {
        this.getCanvasInfo();
        this.getPointsInfo();
        this.drawIt();
        this.setMapPosition();
        this.dispatchEvent("positionok");
    },
    getCanvasInfo: function () {
        this.info.base.width = this.info.base.bx - this.info.base.ax;
        this.info.base.height = this.info.base.by - this.info.base.ay;
        this.info.base.cwidth = this.info.base.width;
        this.info.base.cheight = this.info.base.height;
    },
    getPointsInfo: function () {
        var points = {};
        for (var i in this.info.points) {
            var a = this.info.points[i];
            a.rx = a.x - this.info.base.ax;
            a.ry = a.y - this.info.base.ay;
            a.rtime = new Date(a.time).getTime();
            if (!points[a.username]) {
                points[a.username] = [];
            }
            points[a.username].push(a);
        }
        for (var i in points) {
            var p = [];
            for (var t in points[i]) {
                var a = points[i][t], has = false;
                for (var q in p) {
                    if (p[q].rtime > a.rt) {
                        has = true;
                        p.splice(q, 0, a);
                    }
                }
                if (!has) {
                    p.push(a);
                }
            }
        }
        this.info.rpoints = points;
        this.info.opoints = points;
    },
    getColor: function (num) {
        if (num >= 0 && num < this.option.colors.length) {
            return this.option.colors[num];
        } else {
            return this.option.colors[0];
        }
    },
    drawMap: function () {
        this.dom.find(".xmain").parent().remove();
        var builder = $.svgbuilder("g", {class: "xmain"});
        var t = this.info.base.path.replace(/\//g, "//");
        builder.append("image", {
            href: t,
            x: "0",
            y: "0",
            height: this.info.base.cheight + "px",
            width: this.info.base.cwidth + "px"
        });
        builder.appendTo(this.finders("inner"));
    },
    drawPoints: function (user) {
        if (user) {
            this.currentUser = user;
        }
        this.dom.find(".xpoints").parent().remove();
        var ps = $.svgbuilder("g", {class: "xpoints"});
        var num = -1;
        for (var i in this.info.rpoints) {
            var isflash = false;
            var d = [],e={};
            num++;
            if (this._hideUsers.indexOf(i) === -1) {
                if (i === this.currentUser) {
                    var pss = ps.append("g", {
                        class: "pg " + i + " active",
                        num: num,
                        name: i
                    });
                    isflash = true;
                } else {
                    var pss = ps.append("g", {
                        class: "pg " + i,
                        num: num,
                        name: i
                    });
                }
                for (var t = 0; t < this.info.rpoints[i].length; t++) {
                    if (t === 0) {
                        d.push("M" + this.info.rpoints[i][t].rx + " " + this.info.rpoints[i][t].ry);
                    } else if (t !== this.info.rpoints[i].length - 1) {
                        d.push("L " + this.info.rpoints[i][t].rx + " " + this.info.rpoints[i][t].ry);
                    } else {
                        d.push("L " + this.info.rpoints[i][t].rx + " " + this.info.rpoints[i][t].ry + " z");
                    }
                    pss.append("circle", {
                        class: "pgc",
                        num: t,
                        cx: this.info.rpoints[i][t].rx,
                        cy: this.info.rpoints[i][t].ry,
                        r: 5,
                        fill: this.getColor(num)
                    });
                    if(!e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry]){
                        e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry]={
                            x:this.info.rpoints[i][t].rx,
                            y:this.info.rpoints[i][t].ry,
                            i:1
                        };
                        pss.append("text",{
                            x:this.info.rpoints[i][t].rx,
                            y:this.info.rpoints[i][t].ry-10,
                            "font-size":10,
                            "text-anchor":"middle",
                            fill:"black"
                        }).html(t+1);
                    }else{
                        e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry].i+=1;
                        e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry].x+=0;
                        e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry].y+=17;
                        pss.append("text",{
                            x:e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry].x,
                            y:e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry].y,
                            "font-size":10,
                            "text-anchor":"middle",
                            fill:"black"
                        }).html(t+1+"("+e[this.info.rpoints[i][t].rx+"-"+this.info.rpoints[i][t].ry].i+")");
                    }
                }
                if (isflash) {
                    pss.append("path ", {
                        class: "pgcl",
                        d: d.join(" "),
                        stroke: this.getColor(num),
                        "stroke-width": 2,
                        "fill-opacity": "0"
                    });
                }
            }
        }
        ps.appendTo(this.finders("inner"));
        var ths = this;
        this.dom.find("circle").each(function () {
            $(this).bind("mouseover", function (e) {
                var name = $(this).parent().attr("name");
                var index = $(this).attr("num");
                var t = ths.info.rpoints[name][index];
                var nt = "";
                nt += "<div>";
                nt += "<span>用户名</span>:<span>" + t.username + "</span>";
                nt += "</div><div>";
                nt += "<span>内容</span>:<span>" + t.info + "</span>";
                nt += "</div><div>";
                nt += "<span>时间</span>:<span>" + t.time + "</span>";
                nt += "</div>";
                ths.finders("tip").html(nt).addClass("show").css({
                    left: ($(this).offset().left - ths.dom.offset().left - ths.finders("tip").width() / 2 + 5) + "px",
                    top: ($(this).offset().top - ths.dom.offset().top - ths.finders("tip").height() - 5) + "px"
                });
            }).bind("mouseout", function () {
                ths.finders("tip").removeClass("show");
            }).bind("click", function () {
                var name = $(this).parent().attr("name");
                var index = $(this).attr("num");
                var t = ths.info.rpoints[name][index];
                ths.dispatchEvent("pointclick", t);
            });
        });
    },
    setMapPosition: function () {
        var t = this.finders("inner");
        var width = t.width(), height = t.height();
        t.css({
            left: (width - this.info.base.cwidth) / 2 + "px",
            top: (height - this.info.base.cheight) / 2 + "px"
        });
    },
    resetSvg: function () {
        var ths = this;
        this.dom.find("svg").each(function () {
            $(this).css({
                width: ths.info.base.cwidth,
                height: ths.info.base.cheight
            });
        });
    },
    drawIt: function () {
        this.drawMap();
        this.drawPoints();
        this.resetSvg();
    },
    zoomIn: function () {
        var tt = this.option.currentZoom + this.option.zoom;
        var w = this.info.base.cwidth * tt;
        var h = this.info.base.cheight * tt;
        var ow = (w - this.info.base.cwidth) / 2;
        var oh = (h - this.info.base.cheight) / 2;
        this.info.base.cwidth = w;
        this.info.base.cheight = h;
        for (var i in this.info.rpoints) {
            for (var t in this.info.rpoints[i]) {
                this.info.rpoints[i][t].rx = this.info.rpoints[i][t].rx * tt;
                this.info.rpoints[i][t].ry = this.info.rpoints[i][t].ry * tt;
            }
        }
        this.drawIt();
        this.finders("inner").css({
            left: (parseFloat(this.finders("inner").css("left")) - ow) + "px",
            top: (parseFloat(this.finders("inner").css("top")) - oh) + "px"
        });
    },
    zoomOut: function () {
        var tt = this.option.currentZoom - this.option.zoom;
        var w = this.info.base.cwidth * tt;
        var h = this.info.base.cheight * tt;
        var ow = (this.info.base.cwidth - w) / 2;
        var oh = (this.info.base.cheight - h) / 2;
        this.info.base.cwidth = w;
        this.info.base.cheight = h;
        for (var i in this.info.rpoints) {
            for (var t in this.info.rpoints[i]) {
                this.info.rpoints[i][t].rx = this.info.rpoints[i][t].rx * tt;
                this.info.rpoints[i][t].ry = this.info.rpoints[i][t].ry * tt;
            }
        }
        this.drawIt();
        if (w < this.finders("inner").width() || h < this.finders("inner").height()) {
            this.setMapPosition();
        } else {
            this.finders("inner").css({
                left: (parseFloat(this.finders("inner").css("left")) + ow) + "px",
                top: (parseFloat(this.finders("inner").css("top")) + oh) + "px"
            });
        }
    },
    setDrag: function () {
        var ths = this;
        this.dom.bind("mousedown", function (e) {
            ths.dom.get(0).focus();
            ths._ismove = true;
            ths._ox = e.pageX - ths.finders("inner").offset().left;
            ths._oy = e.pageY - ths.finders("inner").offset().top;
        });
        this.dom.bind("mousemove", function (e) {
            if (ths._ismove && ths.finders("inner").width() < ths.info.base.cwidth && ths.finders("inner").height() < ths.info.base.cheight) {
                var nx = e.pageX - ths._ox;
                var ny = e.pageY - ths._oy;
                if (nx >= 0) {
                    nx = 0;
                } else if (nx < ths.finders("inner").width() - ths.info.base.cwidth) {
                    nx = ths.finders("inner").width() - ths.info.base.cwidth;
                }
                if (ny >= 0) {
                    ny = 0;
                } else if (ny < ths.finders("inner").height() - ths.info.base.cheight) {
                    ny = ths.finders("inner").height() - ths.info.base.cheight;
                }
                ths.finders("inner").css({left: nx + "px"});
                ths.finders("inner").css({top: ny + "px"});
            }
        });
        this.dom.bind("mouseup", function () {
            ths._ismove = false;
        });
    },
    flashPoints: function (user) {
        this.drawPoints(user);
    },
    unflashPoints:function(){
        this.currentUser = null;
        this.drawPoints();
    },
    getUsersInfo: function () {
        var t = [], num = -1;
        for (var i in this.info.rpoints) {
            num++;
            t.push({
                username: i,
                color: this.getColor(num)
            });
        }
        return t;
    },
    hidePoints: function (users) {
        if ($.is.isString) {
            if (this._hideUsers.indexOf(users) === -1) {
                this._hideUsers.push(users);
            }
        } else {
            for (var i in users) {
                if (this._hideUsers.indexOf(users[i]) === -1) {
                    this._hideUsers.push(users[i]);
                }
            }
        }
        this.drawPoints();
    },
    removeHidePoints: function (user) {
        if ($.is.isString(user)) {
            var a = this._hideUsers.indexOf(user);
            if (a !== -1) {
                this._hideUsers.splice(a, 1);
            }
        } else {
            for (var i in user) {
                var a = this._hideUsers.indexOf(user[i]);
                if (a !== -1) {
                    this._hideUsers.splice(a, 1);
                }
            }
        }
        this.drawPoints();
    },
    event_datadone: function (e) {
        this.setCanvas();
        e.stopPropagation();
    }
});

