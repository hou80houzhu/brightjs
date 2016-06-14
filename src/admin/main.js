/*!
 * @packet admin.main;
 * @require admin.util.fullscreen;
 * @include admin.group;
 * @include admin.form;
 * @template admin.template.skin;
 */
Module({
    name: "login",
    extend: "viewgroup",
    className: "login",
    option: {
        formType: "@form.simpleform",
        form: {}
    },
    layout: module.getTemplate("@skin", "login"),
    oninitchild:function(a){
        $.extend(a.option,this.option.form);
    },
    init: function () {
        var ths = this;
        var clock = true;
        var sub = true;
        setTimeout(function () {
            ths.dom.addClass("in");
        }, 500);
        $(window).bind("keyup", function (e) {
            if (e.keyCode === 13) {
                if (clock) {
                    clock = false
                    ths.getFirstChild().submit().done(function (data) {
                        sub = false;
                        $(".denglu").parent(3).transition().all().done(function () {
                            ths.dispatchEvent("loginEnd");
                        }).scope().toggleClass("out");
                    }).fail(function (data) {
                        setTimeout(function () {
                            clock = true;
                        }, 2000);
//                        ths.getFirstChild().getLastChild().showTip(data);
                    });
                    setTimeout(function () {
                        if (sub)
                            clock = true;
                    }, 2000);
                }
            }
        });
    },
    bind_login: function (dom) {
        var ths = this;
        this.getFirstChild().submit().done(function (data) {
            dom.parent(3).transition().all().done(function () {
                ths.dispatchEvent("loginEnd");
            }).scope().toggleClass("out");
        }).fail(function (data) {
//            ths.getFirstChild().getLastChild().showTip(data);
        });
    },
    checkLogin: function () {
    },
    login: function () {
    }
});
Module({
    name: "mainpage",
    extend: "viewgroup",
    option: {
        listType: "@.newlist",
        pageType: "@.pages",
        menu: {}
    },
    layout: module.getTemplate("@skin", "mainpage"),
    onbeforeinit: function (option) {
        option["@.newlist"] = option.menu;
    },
    bind_config: function () {
        this.dispatchEvent("systemconfig");
    },
    bind_quit: function (dom) {
        dom.toggleClass("open");
    },
    bind_quitsure: function () {
        this.dispatchEvent("quitApp");
    },
    bind_userinfo: function () {
        this.dispatchEvent("userInfo");
    },
    bind_fullscreen: function (dom) {
        if (dom.children(0).hasClass("fa-compress")) {
            dom.html("<i class='fa fa-expand'></i>");
            $.exitFullScreen();
        } else {
            dom.html("<i class='fa fa-compress'></i>");
            $.fullScreen();
        }
    },
    bind_about: function () {
        this.addChild({
            type: "@.about"
        });
    },
    event_showTask: function () {
        this.getLastChild().taskShow();
    },
    event_flipPageNo: function (e) {
        this.getFirstChild().focusItem(e.data.id);
        this.dom.find(".main-bar .title").html(e.data.name);
    },
    event_flipPage: function (e) {
        this.getLastChild().gotoPage(e.data);
        this.getFirstChild().focusItem(e.data.id);
        this.dom.find(".main-bar .title").html(e.data.mapping.name);
    },
    event_flipBlank: function (e) {
        this.addChild({
            type: "@.blank",
            option: {url: e.data.url, title: e.data.name}
        });
    }
});
Module({
    name: "newlist",
    extend: "view",
    className: "newlist",
    template: module.getTemplate("@skin", "newlist"),
    option: {},
    onbeforeinit: function () {
        this.items = [];
    },
    init: function (option) {
        var ths = this;
        var fn = function () {
            ths.privator("resize");
        };
        $(window).bind("resize", fn);
        this.onunload(function () {
            $(window).unbind("resize", fn);
        });
        this.postRequest(option.url).done(function (data) {
            this.remoteData = data;
            this.render(data);
            this.finders("item").eq(0).click();
        });
    },
    bind_open: function (dom) {
        this.dom.toggleClass("open");
    },
    bind_task: function () {
        this.dispatchEvent("showTask");
    },
    bind_item: function (dom) {
        var ths = this;
        this.dom.removeClass("open");
        if (!ths.parentView.dom.hasClass("clock")) {
            var id = dom.attr("num");
            var cd = ths.remoteData[id];
            if (cd.action && cd.action === "blank") {
                ths.dispatchEvent("flipBlank", cd);
            } else if (cd.action && cd.action === "link") {
                $().create("a").attr("href", cd.url).attr("target", "_blank").trigger("click");
            } else {
                ths.focusItem(id);
                ths.dispatchEvent("flipPage", {
                    id: id,
                    mapping: ths.remoteData[id],
                    all: ths.remoteData
                });
            }
        }
    },
    focusItem: function (index) {
        index = parseInt(index);
        this.finders("item").each(function(a,i){
            if (i !== index) {
                $(this).removeClass("hover");
            } else {
                $(this).addClass("hover");
            }
        });
    },
    _resize: function () {
        if (this.dom)
            if (this.dom.height() < this.dom.children(0).height()) {
                this.dom.unbind("mousemove");
                this.dom.css("overflow", "hidden");
                this.dom.bind("mousemove", function (e) {
                    var offset = $(this).children(0).height() - $(this).height();
                    var a = offset * (e.pageY - $(this).offset().top) / $(this).height();
                    $(this).scrollTop(a);
                });
            } else {
                this.dom.css("overflow", "");
                this.dom.unbind("mousemove");
            }
    }
});
Module({
    name: "rootlist",
    className: "rootlist",
    extend: "view",
    template: module.getTemplate("@skin", "rootlist"),
    option: {
        url: "data/menumapping.json"
    },
    init: function (option) {
        var ths = this;
        this.render(option.url, null);
        var fn = function () {
            ths.privator("resize");
        };
        $(window).bind("resize", fn);
        this.onunload(function () {
            $(window).unbind("resize", fn);
        });
    },
    onendrender: function (data) {
        this.remoteData = data;
        this.privator("resize");
        this.dom.children(0).children(0).click();
    },
    find_item: function (dom) {
        var ths = this;
        dom.click(function () {
            if (!ths.parentView.dom.hasClass("clock")) {
                var id = $(this).attr("num");
                var cd = ths.remoteData[id];
                if (cd.action && cd.action === "blank") {
                    ths.dispatchEvent("flipBlank", cd);
                } else if (cd.action && cd.action === "link") {
                    $().create("a").attr("href", cd.url).attr("target", "_blank").trigger("click");
                } else {
                    $(this).parent().children().each(function () {
                        $(this).removeClass("hover");
                    });
                    $(this).addClass("hover");
                    ths.dispatchEvent("flipPage", {
                        id: id,
                        mapping: ths.remoteData[id],
                        all: ths.remoteData
                    });
                }
            }
        });
    },
    focusItem: function (index) {
        index = parseInt(index);
        if (index >= 0 && index < this.dom.children(0).children().length) {
            this.dom.children(0).children().each(function (i) {
                if (i !== index) {
                    $(this).removeClass("hover");
                } else {
                    $(this).addClass("hover");
                }
            });
        }
    },
    _resize: function () {
        if (this.dom.height() < this.dom.children(0).height()) {
            this.dom.unbind("mousemove");
            this.dom.css("overflow", "hidden");
            this.dom.bind("mousemove", function (e) {
                var offset = $(this).children(0).height() - $(this).height();
                var a = offset * (e.pageY - $(this).offset().top) / $(this).height();
                $(this).scrollTop(a);
            });
        } else {
            this.dom.css("overflow", "");
            this.dom.unbind("mousemove");
        }
    }
});
Module({
    name: "pages",
    className: "pages",
    extend: "viewgroup",
    layout: module.getTemplate("@skin","pages"),
    option: {
    },
    init: function () {
        this.current = 0;
        this.mapping = [];
    },
    taskShow: function () {
        var ths = this;
        $("body").toggleClass("menushow");
        ths.oldcurrent = ths.current;
        ths.current = 0;
        ths.childEach(function () {
            this.dom.removeClass("out").removeClass("in").removeClass("show");
        });
        var bg = $("<div class='taskmask'>" +
                "<div class='wrapper'></div>" +
                "<div class='mask'>" +
                "<div class='tasktitleis'><i class='" + ths.getChildAt(0).parameters.mapping.img + "'></i> " + ths.getChildAt(0).parameters.mapping.name + "</div>" +
                "<div class='btnleft'>" +
                "<div style='display:none;'><i class='fa fa-chevron-left'></i></div>" +
                "</div>" +
                "<div class='btncenter'></div>" +
                "<div class='btnremove' style='display:none;'><i class='fa fa-times'></i></div>" +
                "<div class='btnright'>" +
                "<div" + (ths.children.length > 1 ? "" : " style='display:none;'") + "><i class='fa fa-chevron-right'></i></div>" +
                "</div>" +
                "<div class='tbtns'>" +
                "<div class='tbtn gotohome'><i class='fa fa-home'></i></div>" +
                "<div class='tbtn deleteall'><i class='fa fa-times'></i></div>" +
                "<div class='tbtn gotocurrent'><i class='fa fa-location-arrow'></i></div>" +
                "</div>" +
                "</div>" +
                "</div>").appendTo("body");
        this.wrapper = bg.find(".wrapper");
        this.bg = bg;
        bg.find(".btnleft").click(function () {
            if (!ths.bg.hasClass("disabled"))
                ths.mprev();
        });
        bg.find(".btnright").click(function () {
            if (!ths.bg.hasClass("disabled"))
                ths.mnext();
        });
        bg.find(".btnremove").click(function (e) {
            if (!ths.bg.hasClass("disabled"))
                ths.mremoveCurrentTask();
        });
        bg.find(".gotohome").click(function () {
            if (!ths.bg.hasClass("disabled"))
                ths.mpage(0);
        });
        bg.find(".deleteall").click(function () {
            if (!ths.bg.hasClass("disabled")) {
                ths.mpage(0, function () {
                    while (ths.children.length > 1) {
                        if (ths.children[1].parameters.id / 1 !== 0) {
                            ths.children[1].remove();
                        }
                    }
                    ths.mapping = [0];
                });
            }
        });
        bg.find(".gotocurrent").click(function () {
            if (!ths.bg.hasClass("disabled"))
                ths.mpage(ths.oldcurrent);
        });
        bg.find(".btncenter").click(function () {
            if (!ths.bg.hasClass("disabled")) {
                var target = ths.bg.find(".container").children(ths.current).getModule();
                ths.childEach(function () {
                    if (this !== target) {
                        if (this.pagein) {
                            this.pagein = false;
                            this.onflipOut && this.onflipOut();
                        }
                    } else {
                        this.dom.addClass("show");
                        this.pagein = true;
                        this.onflipIn && this.onflipIn();
                        this.dispatchEvent("flipPageNo", {
                            id: this.parameters.id / 1,
                            name: this.parameters.mapping.name
                        });
                    }
                });
                $("body").toggleClass("menushow");
                ths.wrapper.find(".container").addClass("back").appendTo(ths.dom);
                setTimeout(function () {
                    ths.dom.find(".container").removeClass("back");
                }, 0);
                bg.remove();
            }
        });
        this.dom.find(".container").appendTo(bg.find(".wrapper")).addClass("outin");
        setTimeout(function () {
            bg.find(".container").removeClass("outin");
        }, 0);
    },
    mremoveCurrentTask: function () {
        var ths = this;
        var target = this.wrapper.find(".container").children(this.current);
        target.transition().all().done(function () {
            ths.mapping.splice(ths.mapping.indexOf(target.getModule().parameters.id / 1), 1);
            var thss = this;
            ths.mprev(function () {
                thss.remove();
            });
        }).scope().toggleClass("taskout");
    },
    mpage: function (index, fn) {
        var num = this.wrapper.find(".container").children().length, ths = this;
        if (index >= 0 && index < num) {
            this.current = index;
            var pre = ($(window).width()) * 0.7 * 1.17;
            this.bg.addClass("disabled");
            this.wrapper.scrollingLeft(index * pre, 500).done(function () {
                ths.bg.removeClass("disabled");
                var a = ths.getChildAt(index).parameters;
                ths.bg.find(".tasktitleis").html("<i class='" + a.mapping.img + "'></i> " + a.mapping.name);
                if (a.id / 1 === 0) {
                    ths.bg.find(".btnremove").hide();
                } else {
                    ths.bg.find(".btnremove").show();
                }
                if (index === 0) {
                    ths.bg.find(".btnleft div").hide();
                } else {
                    ths.bg.find(".btnleft div").show();
                }
                if (index === num - 1) {
                    ths.bg.find(".btnright div").hide();
                } else {
                    ths.bg.find(".btnright div").show();
                }
                fn && fn();
            });
        }
    },
    mnext: function (fn) {
        this.mpage((this.current + 1), fn);
    },
    mprev: function (fn) {
        this.mpage((this.current - 1), fn);
    },
    getIndexByid: function (id) {
        var r = -1;
        this.dom.find(".container").children().each(function (a,num) {
            if ($(this).dataset("viewId") === "win-" + id) {
                r = num;
                return false;
            }
        });
        return r;
    },
    gotoPage: function (data) {
        var ths = this;
        var id = parseInt(data.id), mapping = data.mapping;
        var id2 = this.getIndexByid(id);
        if (id2 !== this.current / 1) {
            if (!ths.parentView.dom.hasClass("clock")) {
                ths.parentView.dom.addClass("clock");
                this.childEach(function () {
                    this.dom.removeClass("in").removeClass("out").removeClass("show");
                });
                var b = this.dom.find(".container").children(this.current);
                if (b.length > 0) {
                    b = b.getModule();
                    b.pagein = false;
                    b.onflipOut && b.onflipOut.call(b);
                    b.dom.removeClass("in").addClass("out");
                }
                if (this.mapping.indexOf(id) === -1) {
                    this.mapping.push(id);
                    this.dom.find(".pages-loading").show();
                    this.addChild({
                        type: data.mapping.view,
                        container: this.dom.find(".container"),
                        id: "win-" + data.id,
                        option: data.mapping.option,
                        parameters: data
                    }).done(function(a){
                        this.dom.find(".pages-loading").hide();
                        if (a.onflipIn) {
                            a.pagein = true;
                            a.onflipIn();
                        }
                    });
                    this.current = this.mapping.length - 1;
                } else {
                    var a = this.getChildById("win-" + id);
                    a.pagein = true;
                    a.onflipIn && a.onflipIn.call(a);
                    a.dom.removeClass("out").addClass("in");
                    this.current = id2;
                }
                setTimeout(function () {
                    ths.parentView.dom.removeClass("clock");
                }, 800);
            }
        }
    }
});
Module({
    name: "basepage",
    extend: "viewgroup",
    pagein: false,
    onflipIn: function () {
        this.pagein = true;
    },
    onflipOut: function () {
        this.pagein = false;
    }
});
Module({
    name: "maincontainer",
    class: "main",
    extend: "@.basepage",
    className: "main",
    option: {
        type: '@group.treetablegroup'
    },
    layout: module.getTemplate("@skin", "maincontainer"),
    init: function () {
        var ths = this;
        var str = $.template(module.getTemplate("@skin", "maincontainermenu")).render(this.parameters.mapping.list);
        var a = this.dom.find(".top-bar").html(str);
        a.find(".xbt").each(function () {
            $(this).click(function () {
                ths.menuclick($(this).attr("num"));
            });
        });
        a.find(".top-menu .tabh").click(function () {
            $(this).parent().toggleClass("open");
        });
        a.find(".droplist").children().each(function () {
            $(this).click(function () {
                ths.menuclick($(this).attr("num"));
            });
        });
        var b = this.dom.find(".top-tabhs .con");
        if (b.width() > b.parent().width()) {
            b.parent(2).append("<div class='scrollarrow'><i class='fa fa-caret-right'></i></div>");
            var c = b.width() - b.parent().width(), d = b.parent().offset().left;
            b.parent().bind("mousemove", function (e) {
                var offset = (e.clientX - d) / $(this).width() * c;
                $(this).scrollLeft(offset);
            });
        }
        this.menuclick(0);
    },
    ondomready: function () {
        this.dom.addClass("in");
    },
    menuclick: function (num) {
        num = num / 1;
        this.dom.find(".top-menu").removeClass("open");
        this.dom.find(".top-bar .droplist").children().each(function (a,i) {
            if (i === num) {
                $(this).addClass("hover");
            } else {
                $(this).removeClass("hover");
            }
        });
        this.dom.find(".top-bar .xbt").each(function (a,i) {
            if (i === num) {
                $(this).addClass("hover");
            } else {
                $(this).removeClass("hover");
            }
        });
        var data = this.parameters.mapping.list[num];
        console.log(data);
        this.dom.find(".maincontainer-loading").html("<div><i class='fa "+data.img+"'></i></div>").show();
        this.removeAllChild().addChild({
            type: data.view,
            container: this.dom.find(".right-content"),
            option: data.option,
            parameters: data
        });
    },
    resize: function () {
        this.dom.addClass("resize");
    },
    out: function () {
        this.dom.addClass("out");
    },
    oninitchild:function(){
        this.dom.find(".maincontainer-loading").hide();
    }
});
Module({
    name: "quickmenu",
    className: "quickmenu",
    extend: "@.basepage",
    option: {
        mapping: []
    },
    init: function (option) {
        var str = module.getTemplate("@skin", "quickmenu");
        this.dom.html(str).addClass("in");
        var total = this.parameters.all.length, times = 10;
        if (total % 10 === 0) {
            times = total;
        } else {
            times = (parseInt(total / 10) + 1) * 10;
        }
        this.totalpage = times / 10;
        this.currentpage = 1;
        for (var i = 1; i <= times; i++) {
            if (this.parameters.all[i]) {
                var j = this.parameters.all[i];
                var a = option.mapping[j.id];
                if (!a) {
                    a = "@.quickLink";
                }
                this.addChild({
                    container: $("<div class='cell'></div>").appendTo(this.dom.find(".con")),
                    type: "@.quicklink",
                    option: {
                        id: j.id,
                        img: j.img,
                        index: i,
                        name: j.name,
                        mapping: j
                    },
                    parameters: this.parameters.all
                });
            } else {
                $("<div class='cell'></div>").appendTo(this.dom.find(".con"));
            }
        }
        var ths = this;
        if (this.totalpage > 1) {
            var n = $("<div class='daoh'><div><i class='fa fa-chevron-left'></i></div>" +
                    "<div><i class='fa fa-chevron-right'></i></div></div>").appendTo(this.dom);
            n.children(0).click(function () {
                ths.prevPage();
            });
            n.children(1).click(function () {
                ths.nextPage();
            });
        }
        var bp = "";
        for (var i = 0; i < this.totalpage; i++) {
            bp += "<div></div>";
        }
        this.dom.find(".pagecount").html(bp);
        this.currentIndex = 0;
    },
    prevPage: function () {
        this.gotoPage(this.currentpage - 1);
    },
    nextPage: function () {
        this.gotoPage(this.currentpage + 1);
    },
    gotoPage: function (page) {
        if (page > 0 && page <= this.totalpage) {
            if (!this.dom.hasClass("clock")) {
                this.dom.addClass("clock");
                this.currentpage = page;
                page = page - 1;
                var top = page * this.dom.find(".con").height();
                this.dom.find(".pagecount").children().each(function (index) {
                    if (index === page) {
                        $(this).addClass("current");
                    } else {
                        $(this).removeClass("current");
                    }
                });
                this.dom.find(".con").scrollingTop(top).done(function () {
                    this.parent().removeClass("clock");
                });
            }
        }
    },
    onflipIn: function () {
        var ths = this;
        clearInterval(this.timeout);
//        this.timeout = setInterval(function () {
//            var a = ths.currentIndex;
//            if (a < ths.children.length) {
//                ths.getChildAt(a).flip();
//            } else {
//                ths.currentIndex = -1;
//            }
//            ths.currentIndex++;
//        }, 5000);
    },
    onflipOut: function () {
        clearInterval(this.timeout);
    },
    onunload: function () {
//        
        clearInterval(this.timeout);
    }
});
Module({
    name: "quicklink",
    extend: "view",
    className: "quicklink",
    option: {
        name: "",
        img: ""
    },
    init: function (option) {
        this.dom.html("<div class='linkpannel'>" +
                "<div>" +
                "<div class='icon'><i class='fa " + option.img + "'></i></div>" +
                "<div class='name'>" + option.mapping.name + "</div>" +
                "</div>" +
                "</div>" +
                "<div class='msg'></div>");
        this.isin = false;
        var ths = this;
        this.dom.click(function () {
            var cd = ths.option.mapping;
            if (cd.action && cd.action === "blank") {
                ths.dispatchEvent("flipBlank", cd);
            } else if (cd.action && cd.action === "link") {
                $().create("a").attr("href", cd.url).attr("target", "_blank").trigger("click");
            } else {
                ths.dispatchEvent("flipPage", {
                    id: ths.option.index,
                    mapping: ths.option.mapping,
                    all: ths.parameters
                });
            }
        });
    },
    flipIn: function () {
        var msg = this.getStateMessageMsg();
        if (msg && msg !== "") {
            this.dom.find(".msg").html(msg);
            this.dom.addClass("flip");
            this.isin = true;
        } else {
            this.isin = 1;
        }
    },
    flipOut: function () {
        this.dom.removeClass("flip");
        this.isin = false;
    },
    flip: function () {
        if (this.isin === true) {
            this.flipOut();
        } else if (this.isin === false) {
            this.flipIn();
        }
    },
    getStateMessageMsg: function () {
        return "<ul><li>isFunction</li><li>isEmptyObject</li><li>isObject</li><li>isString</li></ul>";
    }
});
Module({
    name: "choutier",
    extend: "viewgroup",
    className: "cchoutier",
    option: {
        inner: "",
        width: 270,
        btns: [{name: "close", icon: "fa fa-times", action: "close"}]
    },
    layout: module.getTemplate("@skin", "choutier"),
    ondomready: function () {
        this.dom.width(this.option.width);
        this.update();
    },
    init: function () {
        var ths = this;
        this.dom.addClass("open").find(".mm").click(function () {
            ths.dispatchEvent("table_choutier");
        });
    },
    bind_btn: function (dom) {
        this.dispatchEvent(dom.attr("action"), {btn: dom});
    },
    disable: function (a) {
        if (a === true) {
            this.dom.find(".foot").hide();
        } else {
            this.dom.find(".foot").show();
        }
    },
    event_close: function () {
        this.remove();
    },
    close: function () {
        this.remove();
    },
    onunload: function () {
        console.log("----%o----%o", this.type(), this.getId());
    }
});
Module({
    name: "blank",
    extend: "view",
    className: "blank",
    option: {url: "", title: ""},
    template: module.getTemplate("@skin", "blank"),
    init: function () {
        this.render(this.option);
        this.flipin();
    },
    bind_close: function () {
        this.flipout();
    },
    flipin: function () {
        var ths = this;
        this.dom.transition().set("-all-transform").scope().transform().y(0);
        setTimeout(function () {
            ths.dom.find(".blank_header").removeClass("hover");
        }, 2000);
    },
    flipout: function () {
        this.dom.transition().set("-all-transform").done(function () {
            this.remove();
        }).scope().transform().y("-100%");
    }
});
Module({
    name: "about",
    extend: "view",
    className: "about",
    template: module.getTemplate("@skin", "about"),
    init: function () {
        this.render();
        var ths = this;
        setTimeout(function () {
            ths.dom.addClass("show");
        }, 0);
        this.dom.click(function () {
            ths.remove();
        });
    }
});