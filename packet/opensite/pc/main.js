/*!
 * @packet opensite.pc.main; 
 * @template opensite.pc.template.tmp;
 * @css opensite.pc.style.new;
 * @css opensite.pc.style.font;
 * @json opensite.pc.data.menu;
 * @js lib.prism;
 * @css lib.prism;
 */
Module({
    name: "menu",
    extend: "view",
    className: "menu",
    template: module.getTemplate("@tmp", "menu"),
    init: function () {
        this.render(module.getJson("@menu").data);
    },
    find_item: function (dom) {
        var ths = this;
        dom.click(function () {
            $(this).parent().children().each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
            ths.parentView.togglePage($(this).attr("pagename"));
            var index = $(this).index();
            if (index === 0) {
                ths.parentView.hideLeft();
                ths.parentView.showRight();
            } else if (index === $(this).parent().children().length - 1) {
                ths.parentView.showLeft();
                ths.parentView.hideRight();
            } else {
                ths.parentView.showLeft();
                ths.parentView.showRight();
            }
        });
    },
    nextPage: function () {
        this.dom.find(".active").prev().click();
    },
    prevPage: function () {
        this.dom.find(".active").next().click();
    },
    firstClick: function () {
        this.finders().eq(0).click();
    },
    gotoPage: function (pagename) {
        var t = null;
        this.finders("item").each(function () {
            var c = $(this).attr("pagename");
            if (c === pagename) {
                t = $(this);
                return false;
            }
        });
        if (t) {
            t.click();
        }
    }
});
Module({
    name: "container",
    extend: "viewgroup",
    className: "container",
    option: {
        offset: 30
    },
    layout: module.getTemplate("@tmp", "container"),
    init: function () {
        var ths = this;
        this._running = false;
        this._currentpage = "";
        var qq = [
            {pagename: "about", width: 400, type: "@.aboutpage"},
            {pagename: "start", width: 600, type: "@.page"},
            {pagename: "todo", width: 800, type: "@.todolistpage"},
            {pagename: "demo", width: 300, type: "@.page"},
            {pagename: "api", width: 300, type: "@.apipage"},
            {pagename: "tools", width: 400, type: "@.page"},
            {pagename: "question", width: 700, type: "@.page"},
            {pagename: "end", width: $(window).width() - 700 - 260, type: "@.page"}
        ];
        ths.addChild({
            type: "@.menu"
        });
        for (var i = 0; i < qq.length; i++) {
            var t = ths.addChild({
                type: qq[i].type,
                option: qq[i],
                container: ths.dom.children(0)
            });
            if (i === qq.length - 1) {
                t.done(function (p) {
                    p.dom.children(0).children(0).css("overflow", "auto");
                    this.getChildAt(0).firstClick();
                });
            }
        }
    },
    find_left: function (dom) {
        var ths = this;
        dom.click(function () {
            ths.getChildAt(0).nextPage();
        });
    },
    find_right: function (dom) {
        var ths = this;
        dom.click(function () {
            ths.getChildAt(0).prevPage();
        });
    },
    togglePage: function (pagename) {
        if (this._running === false && pagename !== this._currentpage) {
            this._running = true;
            var ths = this, current = false, k = 0;
            this.children.forEach(function (pageis, i) {
                if (pageis.typeOf("@.page")) {
                    pageis.setMask();
                    if (!current) {
                        if (pageis.option.pagename === pagename) {
                            current = true;
                            pageis.removeMask();
                            ths._currentpage = pagename;
                        } else {
                            k += pageis.width();
                        }
                    }
                }
            });
            this.dom.children(0).scrollingLeft(k, 400).done(function () {
                ths._running = false;
            });
        }
    },
    showLeft: function () {
        this.finders("left").removeClass("hide");
    },
    hideLeft: function () {
        this.finders("left").addClass("hide");
    },
    showRight: function () {
        this.finders("right").removeClass("hide");
    },
    hideRight: function () {
        this.finders("right").addClass("hide");
    },
    event_togglePage: function (e) {
        this.getChildAt(0).gotoPage(e.data);
    }
});
Module({
    name: "page",
    extend: "viewgroup",
    className: "page",
    option: {
        width: 700,
        title: "",
        pagename: "",
        path: "",
        id: ""
    },
    layout: module.getTemplate("@tmp", "page"),
    find_btn: function (dom) {
        var ths = this;
        dom.click(function () {
            ths.dispatchEvent($(this).attr("action"), ths);
        });
    },
    event_close: function () {
        this.dispatchEvent("closepage", this);
    },
    init: function () {
        var ths = this;
        this.iscontent = false;
        this.dom.width(this.option.width);
        if (this.option.path === "") {
            this.option.path = basePath + "pages/" + this.option.pagename + ".html";
        }
        this.getContent(this.option.path);
        $(window).bind("resize", function () {
            ths.setScroll();
        });
        this.dom.click(function () {
            ths.dispatchEvent("togglePage", ths.option.pagename);
        });
    },
    width: function () {
        return this.option.width;
    },
    getContent: function (url) {
        var ths = this;
        $.loader().text(url, function (data) {
            var n = data.match(/<body>[\S\s]*?<\/body>/);
            if (n) {
                data = "<div class='content-p-code'>" + n[0].substring(6, n[0].length - 7) + "</div>";
            }
            ths.finders("content").html(data);
            ths.setScroll();
            ths.setScrollEvent();
            ths.iscontent = true;
            ths.scrollTop(ths.option.id);
            ths.delegate();
            ths.dispatchEvent("contentdone");
        });
    },
    setMask: function () {
        this.dom.addClass("active");
    },
    removeMask: function () {
        this.dom.removeClass("active");
        if (this.iscontent) {
            this.setScroll();
        }
    },
    setScroll: function () {
        var h = this.dom.height(), t = this.finders("content").height(), his = h / t * h, ths = this;
        if (h <= t) {
            ths.dom.removeClass("hidebar");
        } else {
            ths.dom.addClass("hidebar");
        }
    },
    setScrollEvent: function () {
    },
    refresh: function (path, id) {
        if (arguments.length === 0) {
            path = basePath + "pages/" + this.option.pagename + ".html";
        } else {
            this.option.path = path;
        }
        this.finders("content").html("<div class='page-body-content-loading'><div class='a fa-spin'><i class='fa fa-repeat fa-spin'></i></div> Loading...</div>");
        this.option.id = id;
        this.getContent(this.option.path);
    },
    scrollTop: function (id) {
        if ($.is.isNumber(id)) {
            var c = this.dom.find("h2").eq(id);
            if (c.length > 0) {
                this.finders("content").parent().scrollingTop(c.get(0).offsetTop);
            }
        }
    },
    checkPath: function (path) {
        return this.option.path === path;
    }
});

//<!-- Place this tag right after the last button or just before your close body tag. -->
//<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>

Module({
    name: "aboutpage",
    extend: "@.page",
    init: function () {
        this.superClass("init");
        $.loader().js("https://buttons.github.io/buttons.js",null,null,{
            id:"github-bjs"
        });
    }
});
Module({
    name: "todolistpage",
    extend: "@.page",
    init: function () {
        this.superClass("init");
    },
    event_contentdone: function () {
        this.dom.find(".demoshow").hide();
        this.addChild({
            type: "demo.todolist.todolist.todolist",
            container: this.dom.find(".demoshow")
        }).done(function () {
            this.dom.find(".demoshowloading").remove();
            this.dom.find(".demoshow").show();
        });
        this.dom.find(".language-javascript").each(function () {
            Prism.highlightElement($(this).get(0));
        });
        this.dom.find(".language-scss").each(function () {
            Prism.highlightElement($(this).get(0));
        });
        this.dom.find(".language-html").each(function () {
            Prism.highlightElement($(this).get(0));
        });
    }
});
Module({
    name: "apipage",
    extend: "@.page",
    layout: module.getTemplate("@tmp", "apipage"),
    init: function () {
        this.option.width = 240;
        this.dom.width(this.option.width);
        this.addChild({
            type: "@.page",
            option: {
                pagename: "api",
                width: 240,
                override: {
                    find_link: function (dom) {
                        var ths = this;
                        dom.click(function () {
                            ths.dispatchEvent("click", {
                                page: $(this).parent(2).dataset("href"),
                                id: $(this).index()
                            });
                        });
                    }
                }
            },
            container: this.finders("left")
        });
    },
    event_click: function (e) {
        var path = basePath + "pages/api/" + e.data.page + ".html";
        if (this.children.length === 1) {
            this.dom.transition().all().done(function () {
                this.addChild({
                    type: "@.page",
                    option: {
                        pagename: "doc",
                        width: 800,
                        path: path,
                        id: e.data.id
                    },
                    container: this.finders("right")
                });
                this.option.width = 1040;
            }.bind(this)).scope().width(1040);
        } else {
            if (this.getChildAt(1).checkPath(path)) {
                this.getChildAt(1).scrollTop(e.data.id);
            } else {
                this.getChildAt(1).refresh(path, e.data.id);
            }
        }
        e.stopPropagation();
    }
});