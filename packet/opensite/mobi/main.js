/*!
 * @packet opensite.mobi.main; 
 * @require opensite.mobi.util.touch;
 * @require opensite.mobi.form;
 * @template opensite.mobi.template.template;
 * @json opensite.mobi.data.menu;
 * @css opensite.mobi.style.main;
 * @css opensite.mobi.style.style;
 * @css lib.prism;
 * @js lib.prism;
 */
Module({
    name: "main",
    extend: "viewgroup",
    className: "main",
    init: function () {
        this.addChild({
            type: "@.menu"
        }).done(function (a) {
            this._menu = a;
            this.setMenu();
        });
        this.addChild({
            type: "@.mainwindow",
            container: this.dom
        }).done(function (a) {
            a.addChild({
                type: "@.mainpage",
                container: a.container
            });
        });
        var ths = this;
        $(window).bind("online", function () {
            ths.removeOffline();
        }).bind("offline", function () {
            ths.setOffline();
        });
    },
    setMenu: function () {
        var ths = this;
        this.dom.touch(function (e) {
            if (e.action === "down") {
                if (e.xis <= 10) {
                    ths._menu.show();
                    ths._menu.resetContainer();
                    ths._menu.setContainerOffset(e.xis);
                    e.stopPropagation();
                    e.preventDefault();
                }
            } else if (e.action === "move") {
                ths._menu.setContainerOffset(e.offsetX);
            } else {
                ths._menu.setContainerEnd(e.offsetX, e.timeLast, e.direction);
            }
        });
    },
    event_menu: function () {
        this._menu.open();
    },
    event_menuclick: function (e) {
        this.addChild({
            type: e.data.view,
            option: {
                title: e.data.info.title,
                list: {
                    url: basePath + "pages/" + e.data.info.page + ".html"
                }
            }
        });
        this._menu.close();
    },
    event_editicon: function (e) {
        this.getChildAt(0).editicon(e.data);
        e.stopPropagation();
    },
    setOffline: function () {
        var str = "<div class='offline'>" +
                "<div class='offline-desc'><i class='fa fa-globe'></i> 没有网络连接，请检查网络连接</div>" +
                "</div>";
        $("body").append(str);
    },
    removeOffline: function () {
        $(".offline").remove();
    }
});
Module({
    name: "menu",
    extend: "view",
    className: "menu",
    template: module.getTemplate("@template", "menu"),
    option: {
        width: 290
    },
    init: function () {
        this.render({
            option: this.option,
            data: module.getJson("@menu").data
        });
        this._container = this.finders("container");
        this._container.transform().x(-this.option.width);
    },
    find_mask: function (dom) {
        this._mask = dom;
        var ths = this;
        dom.bind("touchstart", function () {
            ths.setContainerEnd(0);
        });
    },
    find_quit: function (dom) {
        this._quit = dom;
    },
    find_container: function (dom) {
        var ths = this;
        dom.touch(function (e) {
            if (e.action === "down") {
                ths.resetContainer();
            } else if (e.action === "move") {
                if (e.direction === "left" || e.direction === "right") {
                    ths.setContainerOffsetp(e.offsetX);
                }
            } else {
                if (e.direction === "left" || e.direction === "right") {
                    ths.setContainerEnd(e.offsetX, e.timeLast, e.direction);
                }
            }
        });
    },
    group_item: function (dom) {
        var ths = this;
        dom.button(function () {
            var num = $(this).attr("num").split("-");
            var b = module.getJson("@menu").data, t = {};
            if (b) {
                t = b[num[0]].list[num[1]];
            }
            ths.dispatchEvent("menuclick", t);
        });
    },
    show: function () {
        this.dom.show();
    },
    hide: function () {
        this.dom.hide();
    },
    open: function () {
        this.show();
        var ths = this;
        setTimeout(function () {
            ths._container.transition().all().scope().transform().x(0);
        }, 10);
    },
    close: function () {
        var ths = this;
        this._container.transition().all().done(function () {
            ths.hide();
        }).scope().transform().x(-this.option.width);
    },
    resetContainer: function () {
        this._container.transition().removeAll();
    },
    setContainerOffset: function (x) {
        if (x > this.option.width) {
            x = this.option.width;
        }
        this._container.transform().x(x - this.option.width);
    },
    setContainerOffsetp: function (x) {
        if (x > 0) {
            x = 0;
        }
        this._container.transform().x(x);
    },
    setContainerEnd: function (x, times, direction) {
        var ths = this;
        if (times < 120) {
            if (direction === "right") {
                this._container.transition().all().scope().transform().x(0);
            } else {
                this._container.transition().all().done(function () {
                    ths.hide();
                }).scope().transform().x(-this.option.width);
            }
        } else {
            if (x > 0) {
                if (x < this.option.width / 2) {
                    this._container.transition().all().done(function () {
                        ths.hide();
                    }).scope().transform().x(-this.option.width);
                } else {
                    this._container.transition().all().scope().transform().x(0);
                }
            } else if (x < 0) {
                x = this.option.width - Math.abs(x);
                if (x < this.option.width / 2) {
                    this._container.transition().all().done(function () {
                        ths.hide();
                    }).scope().transform().x(-this.option.width);
                } else {
                    this._container.transition().all().scope().transform().x(0);
                }
            } else {
                this._container.transition().all().done(function () {
                    ths.hide();
                }).scope().transform().x(-this.option.width);
            }
        }
    },
    editicon: function (a) {
        this.dom.find("img").attr("src", a);
    }
});
Module({
    name: "mainwindow",
    extend: "viewgroup",
    className: "win",
    option: {
        leftBtns: [
            {action: "menu", icon: "fa fa-menu"}
        ],
        rightBtns: [
        ],
        title: "AxesJS",
        inner: "",
        option: ""
    },
    layout: module.getTemplate("@template", "mainwindow"),
    init: function () {
    },
    group_btns: function (dom) {
        var ths = this;
        dom.items().each(function () {
            $(this).button(function () {
                ths.dispatchEvent($(this).item().name, {
                    btn: $(this)
                });
            });
        });
    },
    find_container: function (dom) {
        this.container = dom;
    },
    refreshList: function () {
        this.getChildAt(0).refreshList();
    }
});
Module({
    name: "subwin",
    extend: "viewgroup",
    className: "subwin",
    option: {
        btns: [
        ],
        title: "sub window"
    },
    layout: module.getTemplate("@template", "subwin"),
    init: function () {
        var ths = this;
        this._ismove = false;
        this.dom.transition().all().done(function () {
            ths.winin && ths.winin();
        }).scope().transform().x(0);
    },
    group_btns: function (dom) {
        var ths = this;
        dom.items().each(function (item) {
            $(this).button(function () {
                ths.dispatchEvent($(this).item().name, {
                    btn: $(this)
                });
            });
        });
    },
    find_container: function (dom) {
        this._container = dom;
        var ths = this;
        dom.touch(function (e) {
            if (e.action === "down") {
                if (e.xis <= 20) {
                    ths.dom.transition().removeAll();
                    ths._xis = ths.dom.transform().x();
                    ths._ismove = true;
                }
            } else if (e.action === "move") {
                if (ths._ismove) {
                    if (e.direction === "left" || e.direction === "right") {
                        var p = ths._xis + e.offsetX;
                        if (p < 0) {
                            p = 0;
                        }
                        ths.dom.transform().x(p);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            } else {
                if (ths._ismove) {
                    ths._ismove = false;
                    if (Math.abs(e.offsetX / e.timeLast > 1)) {
                        if (e.direction === "right") {
                            ths.dom.transition().all().done(function () {
                                this.remove();
                            }).scope().transform().x("100%");
                        }
                    } else {
                        var p = ths.dom.transform().x();
                        if (p > $(window).width() / 2) {
                            ths.dom.transition().all().done(function () {
                                this.remove();
                            }).scope().transform().x("100%");
                        } else {
                            ths.dom.transition().all().scope().transform().x(0);
                        }
                    }
                }
            }
        });
    },
    close: function () {
        this.dom.transition().all().done(function () {
            this.remove();
        }).scope().transform().x("100%");
    },
    event_close: function (e) {
        this.close();
        e.stopPropagation();
    }
});
Module({
    name: "datalist",
    extend: "view",
    className: "datalist",
    option: {
        url: "data/datalist.json",
        id: null
    },
    template: module.getTemplate("@template", "datalist"),
    init: function () {
        this.offset = 0;
        this.loading = false;
        this.istop = true;
        this.isend = false;
        this.doty = 0;
        this.render();
        this.setBaseContainer();
        this.finders("nodata").hide();
        this.setDefaultParameter && this.setDefaultParameter();
        this.getData();
        this.firstloading = true;
    },
    setBaseContainer: function () {
        var ths = this, dot = this.finders("dot");
        this.finders("baseContainer").bind("scroll", function (e) {
            var top = $(this).scrollTop();
            if (top === 0) {
                ths.istop = true;
                ths.dispatchEvent("scrolltop");
            } else if (top >= ths.offset) {
                ths.istop = false;
                ths.dispatchEvent("scrollbottom");
            } else {
                ths.istop = false;
            }
            e.stopPropagation();
            e.preventDefault();
        });
        this.finders("baseContainer").touch(function (e) {
            if (e.action === "down") {
                if (ths.istop === true) {
                    ths.doty = dot.transform().y();
                    dot.transition().removeAll();
                }
            } else if (e.action === "move") {
                if (ths.istop === true && e.direction === "bottom") {
                    var a = ths.doty + e.offsetY / 2;
                    if (a > 70) {
                        a = 70;
                    }
                    dot.transform().y(a);
                    e.stopPropagation();
                    e.preventDefault();
                }
            } else {
                if (dot.transform().y() >= 70) {
                    dot.children(0).addClass("fa-spin");
                    ths.refresh(function () {
                        dot.children(0).removeClass("fa-spin");
                        dot.transition().all().scope().transform().y(-60);
                    }, function () {
                        dot.children(0).removeClass("fa-spin");
                        dot.transition().all().scope().transform().y(-60);
                    });
                } else {
                    dot.transition().all().scope().transform().y(-60);
                }
            }
            ths.dispatchEvent("touchlist");
        });
    },
    refresh: function (fn) {
        this.firstloading = true;
        this.finders("container").empty();
        this.current = 0;
        this.isend = false;
        this.finders("loading").show();
        this.finders("nodata").hide();
        this.getData(fn);
    },
    getData: function (fn, err) {
        var ths = this;
        if (!this.loading && !this.isend) {
            this.loading = true;
            $.loader().text(this.option.url, function (a) {
                var n = a.match(/<body>[\S\s]*?<\/body>/);
                if (n) {
                    a = "<div class='content-p-code'>" + n[0].substring(6, n[0].length - 7) + "</div>";
                }
                ths.loading = false;
                ths.firstloading = false;
                ths.finders("nodata").hide();
                ths.finders("container").show();
                ths.finders("loading").hide();
                ths.finders("container").html(a);
                ths.delegate();
                if (ths.option.id !== null) {
                    var c = ths.dom.find("h2").eq(ths.option.id);
                    if (c.length > 0) {
                        ths.finders("baseContainer").scrollTop(c.get(0).offsetTop);
                    }
                }
                ths.dispatchEvent("datalistlitedone");
                fn && fn(a);
            });
        }
    }
});

Module({
    name: "sublistwin",
    extend: "@.subwin",
    option: {
        btns: [
        ],
        title: "sub list window",
        listType: "@.datalist",
        list: {
            url: "data/datalist.json"
        }
    },
    init: function () {
        this.superClass("init");
    },
    winin: function () {
        this.addChild({
            type: this.option.listType,
            option: this.option.list,
            container: this.finders("container")
        }).done(function () {
            this.listend && this.listend();
        });
    }
});

Module({
    name: "mainpage",
    extend: "viewgroup",
    className: "mainpage",
    option: {
        listType: "@.datalist"
    },
    layout: module.getTemplate("@template", "mainpage"),
    onbeforeinit: function () {
        this.option[this.option.listType] = {
            url: basePath + "pages/about.html"
        };
    },
    refreshList: function () {
        this.getChildByType("@.datalist").refresh();
    },
    event_refreshlist: function (e) {
        this.getChildByType("@.datalist").refresh();
    },
    event_touchlist: function (e) {
        e.stopPropagation();
    },
    event_datalistlitedone: function (e) {
        $.loader().js("https://buttons.github.io/buttons.js", null, null, {
            id: "github-bjs"
        });
        this.dom.find(".tdonate").button(function () {
            this.dispatchEvent("menuclick", {
                view: "opensite.mobi.main.sublistwin",
                info: {
                    title: "Donate",
                    page: "donate"
                }
            });
        }.bind(this));
        e.stopPropagation();
    }
});


Module({
    name: "todo",
    extend: "@.sublistwin",
    init: function () {
        this.superClass("init");
    },
    event_datalistlitedone: function () {
        this.dom.find(".language-scss").each(function () {
            Prism.highlightElement($(this).get(0));
        });
        this.dom.find(".language-javascript").each(function () {
            Prism.highlightElement($(this).get(0));
        });
        this.dom.find(".language-html").each(function () {
            Prism.highlightElement($(this).get(0));
        });
        this.addChild({
            type: "demo.todolist.todolist.todolist",
            container: this.dom.find(".demoshow")
        }).done(function () {
            this.dom.find(".demoshowloading").remove();
        });
    }
});
Module({
    name: "api",
    extend: "@.subwin",
    option: {
        title: "sub list window",
        listType: "@.datalist",
        list: {
            url: "data/datalist.json"
        }
    },
    onbeforeinit: function () {
        this.option.list["override"] = {
            find_link: function (dom) {
                var ths = this;
                dom.button(function () {
                    ths.dispatchEvent("click", {
                        title: $(this).parent(2).children(0).html(),
                        page: $(this).parent(2).dataset("href"),
                        id: $(this).index()
                    });
                });
            }
        };
    },
    init: function () {
        this.superClass("init");
    },
    winin: function () {
        this.addChild({
            type: this.option.listType,
            option: this.option.list,
            container: this.finders("container")
        }).done(function () {
            this.listend && this.listend();
        });
    },
    event_click: function (e) {
        this.addChild({
            type: "@.sublistwin",
            option: {
                title: e.data.title,
                list: {
                    url: basePath + "pages/api/" + e.data.page + ".html",
                    id: e.data.id
                }
            }
        });
        e.stopPropagation();
    }
});
$.toast = function (text) {
    $("<div class='toast'><div class='toast_text'>" + text + "</div></div>").appendTo("body").transition().set("-all-transform").done(function () {
        this.transition().removeAll().set("opacity", {time: 1000}).delay(2000).then(function () {
            this.css("opacity", 0);
        }).delay(1000).done(function () {
            this.remove();
        }).resolve();
    }).scope().transform().y(-150);
};
$.loadingbar = function () {
    var a = $("#loadingbar");
    if (a.length === 0) {
        a = $("<div id='loadingbar'>" +
                "<div class='loadingbar-bg'></div>" +
                "<div class='loadingbar-desc'></div></div>").appendTo("body");
    }
    return new loadingbar(a);
};
var loadingbar = function (dom) {
    this.dom = dom;
};
loadingbar.prototype.showLoading = function (text) {
    this.dom.children(1).html("<i class='fa fa-repeat fa-spin'></i> " + (text || 'Loading...'));
    return this;
};
loadingbar.prototype.showError = function (text) {
    var ps = $.promise(), ths = this;
    setTimeout(function () {
        ths.close();
        ps.resolve();
    }, 2000);
    this.dom.children(1).html("<i class='fa fa-circle-cross'></i> " + (text || '操作错误'));
    return ps;
};
loadingbar.prototype.showSuccess = function (text) {
    var ps = $.promise(), ths = this;
    setTimeout(function () {
        ths.close();
        ps.resolve();
    }, 2000);
    this.dom.children(1).html("<i class='fa fa-circle-check'></i> " + (text || '操作成功'));
    return ps;
};
loadingbar.prototype.close = function () {
    this.dom.remove();
};