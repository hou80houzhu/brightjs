/*!
 * @packet admin.tree; 
 * @css admin.style.tree;
 * @css admin.style.treelite;
 */
Module({
    name: "tree",
    extend: "viewgroup",
    className: "tree",
    option: {
        url: "data/menumapping.json",
        listname: "list",
        showname: "name",
        iconname: "imgx",
        level: 2,
        async: false,
        ischeck: true,
        isadd: true,
        isremove: true,
        ismoveup: true,
        ismovedown: true,
        isedit: true,
        firstClick:false,
        tools: [
//            {name: "添加", title: "添加", type: "add", icon: "fa fa-at"}
        ],
        hook: function (c) {
            return c;
        }
    },
    layout: "<div class='tree-head'>" +
            "<div class='tree-head-state' data-find='state'></div>" +
            "<div class='tree-head-toggle' data-bind='click:expand'><i class='fa fa-angle-double-down' title='全部展开'></i></div>" +
            "</div><div class='tree-container'></div>",
    init: function () {
        this.current = null;
        this.build();
    },
    find_state: function (dom) {
        this.statedom = dom;
    },
    bind_expand: function (dom) {
        if (dom.children(0).hasClass("fa-angle-double-down")) {
            this.closeAllFolder();
            dom.html("<i class='fa fa-angle-double-up' title='全部关闭'></i>");
        } else {
            this.openAllFolder();
            dom.html("<i class='fa fa-angle-double-down' title='全部展开'></i>");
        }
    },
    bind_toggle: function (dom) {
        dom.parent(".tree-node").toggleClass("close");
    },
    bind_title: function (dom) {
        var nodehead = dom.parent();
        if (this.current) {
            this.current.removeClass("hover");
        }
        nodehead.toggleClass("hover");
        this.current = nodehead;
        var a = dom.parent(2), k = 0, lev = 0, data = this.cache[parseInt(a.attr("nodeid"))];
        if (!a.attr("level")) {
            while (a.get(0) && a.attr("nodeid")) {
                a = a.parent().parent();
                k++;
            }
            lev = k + 1;
            dom.parent(2).attr("level", lev);
        } else {
            lev = dom.parent(2).attr("level");
        }
        this.statedom.html(data[this.option.showname]);
        if (dom.parent().find(".tools").length === 0) {
            var str = "<div class='tools'>";
            if (this.option.level >= lev && this.option.isadd) {
                str += "<div class='tool' type='addnode' data-bind='click:tool' title=''><i class='fa fa-plus'></i></div>";
            }
            if (lev > 1 && this.option.isremove) {
                str += "<div class='tool' type='removenode' data-bind='click:tool' title=''><i class='fa fa-times'></i></div>";
            }
            if (this.option.ismoveup) {
                str += "<div class='tool' type='moveupnode' data-bind='click:tool' title=''><i class='fa fa-caret-up'></i></div>";
            }
            if (this.option.ismovedown) {
                str += "<div class='tool' type='movedownnode' data-bind='click:tool' title=''><i class='fa fa-caret-down'></i></div>";
            }
            if (this.option.isedit) {
                str += "<div class='tool' type='editnode' data-bind='click:tool' title=''><i class='fa fa-pencil'></i></div>";
            }
            this.option.tools.forEach(function (a) {
                str += "<div class='tool' type='" + a.type + "' title='" + a.title + "'><i class='" + a.icon + "'></i></div>";
            });
            str += "</div>";
            dom.parent().append(str);
            this.delegate();
        }
        this.dispatchEvent("treeclick", {
            node: this.current.parent(),
            btn: dom,
            level: lev,
            data: data
        });
    },
    bind_tool: function (dom) {
        this.dispatchEvent(dom.attr("type"), {
            node: this.current.parent(),
            btn: dom,
            level: this.current.parent().attr("level"),
            data: this.cache[parseInt(this.current.parent().attr("nodeid"))]
        });
    },
    event_treeclick: function (e) {
    },
    event_addnode: function (e) {
        
    },
    event_removenode: function () {
        this.removeNode();
    },
    event_moveupnode: function () {
        this.moveup();
    },
    event_movedownnode: function () {
        this.movedown();
    },
    build: function (data, fn) {
    	var ths = this;
        this.statedom.html("<i class='fa fa-spin fa-refresh'></i>");
        this.postData({
            url: this.option.url,
            data: data,
            back: function (da) {
                this.statedom.html("");
                var str = this.treeStr(da);
                this.dom.find(".tree-container").html(str);
                this.delegate();
                if (ths.option.firstClick) {
                    this.dom.find(".tree-node").find(".title").eq(0).click();
                }
                this.dispatchEvent("treebuilded");
                fn && fn.call(this);
            }
        });
    },
    treeStr: function (json) {
        this.cache = [];
        var html = "", ths = this;
        var cfn = function (json, c) {
            if (typeof json === "object") {
                if (json instanceof Array === false) {
                    ths.cache.push(json);
                    var i = ths.cache.length - 1;
                    var ct = "";
                    if (ths.option.hook) {
                        ct = ths.option.hook(json[ths.option.showname]);
                    } else {
                        ct = json[ths.option.fieldName];
                    }
                    if (json[ths.option.listname] && json[ths.option.listname].length > 0) {
                        html += "<div class='tree-node' nodeid='" + i + "'>" +
                                "<div class='tree-node-head'>" +
                                "<div class='arrow' data-bind='click:toggle'><i class='fa fa-caret-right'></i></div>" +
                                (ths.option.ischeck ? "<div class='check'><input type='checkbox' data-bind='click:check'/></div>" : "<div class='check' style='display:none'><input type='checkbox'/></div>") +
                                (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                                "<span class='title' data-bind='click:title'>" + ct + "</span></div><div class='tree-node-list'>";
                        arguments.callee(json[ths.option.listname]);
                    } else {
                        if (ths.option.async) {
                            html += "<div class='tree-node close' nodeid='" + i + "'>" +
                                    "<div class='tree-node-head'>" +
                                    "<div class='arrow' data-bind='click:toggle'><i class='fa fa-caret-right'></i></div>" +
                                    (ths.option.ischeck ? "<div class='check'><input type='checkbox' data-bind='click:check'/></div>" : "<div class='check' style='display:none'><input type='checkbox'/></div>") +
                                    (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                                    "<span class='title' data-bind='click:title'>" + ct + "</span></div><div class='tree-node-list'>";
                        } else {
                            html += "<div class='tree-node' nodeid='" + i + "'>" +
                                    "<div class='tree-node-head noarrow'>" +
                                    "<div class='arrow' data-bind='click:toggle'><i class='fa fa-caret-right'></i></div>" +
                                    (ths.option.ischeck ? "<div class='check'><input type='checkbox' data-bind='click:check'/></div>" : "<div class='check' style='display:none'><input type='checkbox'/></div>") +
                                    (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                                    "<span class='title' data-bind='click:title'>" + ct + "</span></div><div class='tree-node-list'>";
                        }
                    }
                    html += "</div></div>";
                } else {
                    for (var m in json) {
                        arguments.callee(json[m]);
                    }
                }
            }
        };
        cfn(json);
        return html;
    },
    removeNode: function () {
        if (this.current) {
            if (this.current.parent(2).children().length === 1) {
                this.current.parent(3).addClass("close");
                this.current.parent(3).children(0).addClass("noarrow");
            }
            
            this.current.parent().remove();
        }
        return this;
    },
    addNode: function (json) {
        if (this.current) {
            this.cache.push(json);
            var i = this.cache.length - 1;
            if (this.current.parent().children(1).children().length === 0) {
                this.current.parent().removeClass("close");
                this.current.removeClass("noarrow");
            }
            var html = "<div class='tree-node' nodeid='" + i + "'>" +
                    "<div class='tree-node-head noarrow'>" +
                    "<div class='arrow' data-bind='click:toggle'><i class='fa fa-caret-right'></i></div>" +
                    (ths.option.ischeck ? "<div class='check'><input type='checkbox' data-bind='click:check'/></div>" : "<div class='check' style='display:none'><input type='checkbox'/></div>") +
                    (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                    "<span class='title' data-bind='click:title'>" + ct + "</span></div><div class='tree-node-list'>";
            var c = $(html).appendTo(this.current.parent().children(1));
            this.delegate();
        }
        return this;
    },
    moveup: function () {
        if (this.current) {
            var a = this.current.parent().prev();
            if (a.length > 0) {
                this.current.parent().insertBefore(a);
            }
        }
        return this;
    },
    movedown: function () {
        if (this.current) {
            var a = this.current.parent().next();
            if (a.length > 0) {
                this.current.parent().insertAfter(a);
            }
        }
        return this;
    },
    editNode: function (json) {
        if (this.current) {
            var t = $.extend(json, this.cache[this.current.parent().attr("nodeid")]);
            var head = this.current;
            head.find(".title").html(t[this.option.showname]);
        }
        return this;
    },
    toggle: function (node) {
        var has = false;
        node.children(1).children().each(function () {
            if ($(this).find("input[type='checkbox']").get(0).checked) {
                has = true;
                return false;
            }
        });
        if (!has) {
            node.children(0).find("input[type='checkbox']").get(0).checked = false;
        }
    },
    closeAllFolder: function () {
        this.dom.find(".tree-node").each(function () {
            $(this).addClass("close");
        });
    },
    openAllFolder: function () {
        this.dom.find(".tree-node").each(function () {
            $(this).removeClass("close");
        });
    }
});
Module({
    name: "treeselect",
    extend: "@.tree",
    option: {
        value: "",
        xxid:"id",
        selectType: "auto"//auto,autosingle,simple
    },
    init: function () {
        this.option.ischeck = true;
        this.current = null;
        this.build(null, function () {
            this.setValue(this.option.value);
        });
    },
    bind_check: function (dom) {
        var a = dom.get(0).checked;
        if (this.option.selectType === "auto") {
            var c = dom.parent(3);
            //选中子级
            c.children(1).find("input[type='checkbox']").each(function(e){
            	   this.checked = a;
        	});
            //判断同级是否有选中的
            if(!a){
            	var d = dom.parent(4);
            	a = d.find("input[type='checkbox']:checked").length > 0;
            }
            //选中或取消选中所有父级
            while(c.parent(2).attr("nodeid")){
            	c = c.parent(2);
            	c.children(0).find("input[type='checkbox']").get(0).checked = a;
            }
        } else if (this.option.selectType === "autosingle") {
            if (a) {
                this.dom.find("input[type='checkbox']").each(function () {
                    $(this).get(0).checked = false;
                });
                dom.get(0).checked = true;
                var c = dom.parent(4);
                while (c.attr("nodeid")) {
                    c.children(0).find("input[type='checkbox']").get(0).checked = true;
                    c = c.parent(4);
                }
            } else {
                var c = dom.parent(4);
                while (c.attr("nodeid")) {
                    this.toggle(c);
                    c = c.parent(4);
                }
            }
        }
    },
    getSelectData: function () {
        var c = [], ths = this;
        this.dom.find("input[type='checkbox']").each(function () {
            if ($(this).get(0).checked) {
                var a = $(this).parent(3).attr("nodeid");
                c.push(ths.cache[parseInt(a)]);
            }
        });
        return c;
    },
    getValue: function () {
        var c = "";
        this.getSelectData().forEach(function (a) {
            c += a.id + ",";
        });
        c.length > 1 && (c = c.substring(0, c.length - 1));
        return c;
    },
    reset: function () {
        this.dom.find("input[type='checkbox']").each(function () {
            $(this).get(0).checked = false;
        });
        return this;
    },
    getData: function (id) {
    	var ths = this;
        for (var i in this.cache) {
            if (this.cache[i][ths.option.xxid] === id) {
                return i;
            }
        }
        return null;
    },
    setValue: function (ids) {
        var ths = this;
        if (ids && ids !== "") {
            ids.split(",").forEach(function (a) {
                var n = ths.getData(a);
                if (n) {
                    var cd = ths.dom.find("div[nodeid='" + n + "']");
                    if (cd.length > 0) {
                        cd.find("input").get(0).checked = true;
                    }
                }
            });
        }
    }
});
Module({
    name: "treelite",
    extend: "view",
    option: {
        url: "data/menumapping.json",
        width: 330,
        listname: "list",
        showname: "name",
        iconname: "imgx",
        level: 4,
        selectType: "autosingle", //auto,autosingle,simple
        ischeck: false,
        async: false,
        firstClick: false,
        resetId: "id",
        data:{},
        tools: [
//            {name: "添加", title: "添加", type: "add", icon: "fa fa-plus"}
        ],
        hook: function (c) {
            return c;
        }
    },
    init: function (option) {
        var ths = this;
        this.cdata=this.option.data||{};
        this.dom.addClass("xtree");
        this.dom.html("<div class='xhead'>" +
                "<div class='xcurrent'><i class='fa fa-refresh fa-spin'></i></div>" +
                "<div class='xtoggle'><i class='fa fa-angle-double-down' title='全部展开'></i><i class='fa fa-angle-double-up' title='全部收起'></i></div>" +
                "</div><div class='xcon'></div>");
        this.getRemoteData(null, function (data) {
            if ($.is.isString(data)) {
                data = window.JSON.parse(data);
            }
            if (ths.dom) {
                ths.buildTree(ths.dom.children(1), data);
                if (ths.option.firstClick) {
                    ths.dom.find(".title").eq(0).trigger("click");
                }
            }
            ths.dataend && ths.dataend();
            ths.dom.find(".xtoggle").click();
        });
        this.dom.find(".xtoggle").click(function () {
            $(this).toggleClass("toggle");
            if ($(this).hasClass("toggle")) {
                ths.closeAllFolder();
            } else {
                ths.openAllFolder();
            }
        });
        this.cache = [];
        this.current = null;
    },
    refresh: function () {
        this._old = this.cache[this.current.parent().attr("nodeid")];
        this.cache.length = 0;
        this.dom.children(1).empty();
        this.current = null;
        var ths = this;
        this.getRemoteData(null, function (data) {
            ths.buildTree(ths.dom.children(1), data);
            ths.resetNode(ths._old);
        });
    },
    getRemoteData: function (data, fn) {
        var ths = this;
        this.postData({
            url: this.option.url,
            data: data!==null?data:this.option.data,
            back: function (data) {
                ths.dom && ths.dom.find(".xcurrent").empty();
                fn && fn(data);
            },
            dataerror: function (e) {
                ths.dom && ths.dom.find(".xcurrent").html(e.msg);
            },
            neterror: function () {
                ths.dom.find(".xcurrent").html("网络错误！");
            }
        });
    },
    buildTree: function (dom, json) {
        var html = "", ths = this;
        var cfn = function (json, c) {
            if (typeof json === "object") {
                if (json instanceof Array === false) {
                    ths.cache.push(json);
                    var i = ths.cache.length - 1;
                    var ct = "";
                    if (ths.option.hook) {
                        ct = ths.option.hook(json[ths.option.showname]);
                    } else {
                        ct = json[ths.option.fieldName];
                    }
                    if ((json[ths.option.listname]) != null && (json[ths.option.listname]).length > 0) {
                        html += "<div class='xnode' nodeid='" + i + "'>" +
                                "<div class='xnode-head'>" +
                                "<div class='arrow'><i class='fa fa-caret-right'></i></div>" +
                                (ths.option.ischeck ? "<input type='checkbox'/>" : "<input type='checkbox' style='display:none'/>") +
                                (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                                "<span class='title'>" + ct + "</span></div><div class='xnode-list'>";
                        arguments.callee(json[ths.option.listname]);
                    } else {
                        if (ths.option.async) {
                            html += "<div class='xnode close' nodeid='" + i + "'>" +
                                    "<div class='xnode-head'>" +
                                    "<div class='arrow'><i class='fa fa-caret-right'></i></div>" +
                                    (ths.option.ischeck ? "<input type='checkbox'/>" : "<input type='checkbox' style='display:none'/>") +
                                    (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                                    "<span class='title'>" + ct + "</span></div><div class='xnode-list'>";
                        } else {
                            html += "<div class='xnode' nodeid='" + i + "'>" +
                                    "<div class='xnode-head noarrow'>" +
                                    "<div class='arrow'><i class='fa fa-caret-right'></i></div>" +
                                    (ths.option.ischeck ? "<input type='checkbox'/>" : "<input type='checkbox' style='display:none'/>") +
                                    (json[ths.option.iconname] ? "<div class='icon'><i class='" + json[ths.option.iconname] + "'></i></div>" : "") +
                                    "<span class='title'>" + ct + "</span></div><div class='xnode-list'>";
                        }
                    }
                    html += "</div></div>";
                } else {
                    for (var m in json) {
                        arguments.callee(json[m]);
                    }
                }
            }
        };
        cfn(json);
        dom.html(html);
        this.setTree(dom);
        return this;
    },
    setTree: function (dom) {
        var ths = this;
        dom.find(".arrow").each(function () {
            $(this).click(function () {
                if (ths.option.async && $(this).parent().parent().children(1).children().length === 0) {
                    $(this).find("i").attr("class", "fa fa-refresh fa-spin");
                    var thss = $(this);
                    var p=ths.cache[parseInt($(this).parent().parent().attr("nodeid"))].id;
                    ths.getRemoteData({pid:p}, function (data) {
                        if (data&&data.length>0) {
                            thss.find("i").attr("class", "fa fa-caret-right");
                            ths.buildTree(thss.parent().parent().removeClass("close").children(1), data);
                        } else {
                            thss.parent().addClass("noarrow");
                        }
                    });
                } else {
                    var a = $(this).parent().parent();
                    a.toggleClass("close");
                }
            });
        });
        dom.find(".title").each(function () {
            $(this).click(function () {
                ths.current = $(this).parent();
                ths.dom.find(".xnode-head").each(function () {
                    $(this).removeClass("active");
                });
                $(this).parent().addClass("active");
                var a = $(this).parent().parent(), k = 0, lev = 0, data = ths.cache[parseInt($(this).parent().parent().attr("nodeid"))];
                if (!a.attr("level")) {
                    while (a.get(0) && a.attr("nodeid")) {
                        a = a.parent().parent();
                        k++;
                    }
                    lev = k + 1;
                    $(this).parent().parent().attr("level", lev);
                } else {
                    lev = $(this).parent().parent().attr("level");
                }
                if (ths.option.tools.length > 0 && $(this).parent().find(".tools").length === 0) {
                    var str = "<div class='tools'>";
                    ths.option.tools.forEach(function (a) {
                        str += "<div class='tool' type='" + a.type + "' title='" + a.title + "'><i class='" + a.icon + "'></i></div>";
                    });
                    str += "</div>";
                    $(this).parent().append(str);
                    $(this).parent().find(".tool").each(function () {
                        $(this).click(function () {
                            var type = $(this).attr("type");
                            ths.dispatchEvent("treelite_" + type, {
                                node: ths.current,
                                btn: $(this),
                                level: ths.current.parent().attr("level"),
                                data: ths.cache[parseInt(ths.current.parent().attr("nodeid"))],
                                tree: ths
                            });
                        });
                    });
                }
                ths.dom.find(".xcurrent").html($(this).html());
                ths.dispatchEvent("treelite_click", {
                    node: ths.current,
                    level: lev,
                    data: data,
                    tree: ths
                });
            });
        });
        dom.find("input[type='checkbox']").each(function () {
            $(this).click(function () {
                var a = $(this).get(0).checked;
                if (ths.option.selectType === "auto") {
                    if (a) {
                        var c = $(this).parent().parent().parent().parent();
                        while (c.attr("nodeid")) {
                            c.children(0).find("input[type='checkbox']").get(0).checked = true;
                            c = c.parent().parent().parent().parent();
                        }
                    } else {
                        var c = $(this).parent().parent().parent().parent();
                        while (c.attr("nodeid")) {
                            ths.toggle(c);
                            c = c.parent().parent().parent().parent();
                        }
                    }
                    $(this).parent().parent().children(1).children().each(function () {
                        $(this).find("input[type='checkbox']").get(0).checked = a;
                    });
                } else if (ths.option.selectType === "autosingle") {
                    if (a) {
                        ths.dom.find("input[type='checkbox']").each(function () {
                            $(this).get(0).checked = false;
                        });
                        $(this).get(0).checked = true;
                        var c = $(this).parent().parent().parent().parent();
                        while (c.attr("nodeid")) {
                            c.children(0).find("input[type='checkbox']").get(0).checked = true;
                            c = c.parent().parent().parent().parent();
                        }
                    } else {
                        var c = $(this).parent().parent().parent().parent();
                        while (c.attr("nodeid")) {
                            ths.toggle(c);
                            c = c.parent().parent().parent().parent();
                        }
                    }
                }
            });
        });
    },
    toggle: function (node) {
        var has = false;
        node.children(1).children().each(function () {
            if ($(this).find("input[type='checkbox']").get(0).checked) {
                has = true;
                return false;
            }
        });
        if (!has) {
            node.children(0).find("input[type='checkbox']").get(0).checked = false;
        }
    },
    removeNode: function () {
        if (this.current) {
            if (this.current.parent(2).children().length === 1) {
                this.current.parent(3).addClass("close");
                this.current.parent(3).children(0).addClass("noarrow");
            }
            
            this.current.parent().remove();
        }
        return this;
    },
    addNode: function (json) {
        if (this.current) {
            this.cache.push(json);
            var i = this.cache.length - 1;
            if(this.current.parent().children(1).children().length===0){
                
                this.current.parent().removeClass("close");
                this.current.removeClass("noarrow");
            }
            var html = "<div class='xnode' nodeid='" + i + "'>" +
                    "<div class='xnode-head noarrow'>" +
                    "<div class='arrow'><i class='fa fa-caret-right'></i></div>" +
                    (this.option.ischeck ? "<input type='checkbox'/>" : "<input type='checkbox' style='display:none'/>") +
                    (json[this.option.iconname] ? "<div class='icon'><i class='" + json[this.option.iconname] + "'></i></div>" : "") +
                    "<span class='title'>" + json[this.option.showname] + "</span></div><div class='xnode-list'></div></div>";
            var c = $(html).appendTo(this.current.parent().children(1));
            this.setTree(c);
        }
        return this;
    },
    moveup: function () {
        if (this.current) {
            var a = this.current.parent().previousSibling();
            if (a.length > 0) {
                this.current.parent().insertBefore(a);
            }
        }
        return this;
    },
    movedown: function () {
        if (this.current) {
            var a = this.current.parent().nextSibling();
            if (a.length > 0) {
                this.current.parent().insertAfter(a);
            }
        }
        return this;
    },
    editNode: function (json) {
        var a = false, ths = this, index = 0;
        for (var i = 0; i < this.cache.length; i++) {
            var a = this.cache[i];
            if (a.id+""  === json.id +"") {
                $.extend(a, json);
                index = i;
                a = true;
                break;
            }
        }
        ;
        if (a) {
            var cd = ths.dom.find("div[nodeid='" + index + "']");
            if (cd.length > 0) {
                cd.children(0).find(".title").html(json[this.option.showname]);
                json[this.option.iconname] && cd.children(0).find("i").attr("class", json[this.option.iconname]);
            }
        }
        return this;
    },
    getValue: function () {
        var c = "";
        this.getSelectData().forEach(function (a) {
            c += a.id + ",";
        });
        c.length > 1 && (c = c.substring(0, c.length - 1));
        return c;
    },
    closeAllFolder: function () {
        this.dom.find(".xnode").each(function () {
            $(this).addClass("close");
        });
    },
    openAllFolder: function () {
        this.dom.find(".xnode").each(function () {
            $(this).removeClass("close");
        });
    },
    getSelectData: function () {
        var c = [], ths = this;
        this.dom.find("input[type='checkbox']").each(function () {
            var a = $(this).parent().parent().parent().attr("nodeid");
            c.push(ths.cache[parseInt(a)]);
        });
        return c;
    },
    resetNode: function (node) {
        var nodeid = 0;
        for (var i = 0; i < this.cache.length; i++) {
            if (this.cache[i][this.option.resetId] === node[this.option.resetId]) {
                nodeid = i;
                break;
            }
        }
        var c = this.dom.find("div[nodeid='" + nodeid + "']");
        if (c.length > 0) {
            this.dom.find(".xnode-head").each(function () {
                $(this).removeClass("active");
            });
            c.children(0).addClass("active");
            this.current = c.children(0);
            this.dom.find(".xcurrent").html(node[this.option.showname]);
        }
    },
    reset: function () {
        this.dom.find("input[type='checkbox']").each(function () {
            $(this).get(0).checked = false;
        });
        return this;
    },
    recheck: function (ids) {
        var ths = this;
        if (ids && ids !== "") {
            ids.split(",").forEach(function (a) {
                var n = ths.getData(a);
                if (n.data) {
                    var cd = ths.dom.find("div[nodeid='" + n.index + "']");
                    if (cd.length > 0) {
                        cd.find("input").get(0).checked = true;
                    }
                }
            });
        }
    }
});

