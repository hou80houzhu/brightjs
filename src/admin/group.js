/*!
 * @packet admin.group;
 * @require admin.table;
 * @require admin.tree;
 * @require admin.form;
 * @template admin.template.group;
 */
Module({
    name: "basegroup",
    extend: "viewgroup",
    className: "group",
    init: function () {
        this.choutiers = [];
    },
    add: function (option) {
        var ops = {
            title: "Title",
            type: "",
            width: (300 + Math.random() * 500)+"px",
            option: "",
            parameters: {},
            target: null,
            btns: [{type: "removeChouti", name: "close", icon: "fa fa-times"}]
        };
        $.extend(ops, option);
        var ths = this;
        if (this.dom.children(".group").length === 0) {
            this.group = $("<div class='group'></div>").appendTo(this.dom);
        }
        var a = 0;
        for (var i = this.group.children().length - 1; i >= 0; i--) {
            a += 30;
            this.group.children().eq(i).css({
                "-all-transform": "translateX(" + (-this.group.children().eq(i).width() + a) + "px)"
            });
            this.group.children().eq(i).children(".foot").hide();
        }
        if($.is.isNumber(ops.width)){
            ops.width=ops.width+"px";
        }
        var cc = "<div class='choutier' num='" + this.group.children().length + "' style='width:" + ops.width + ";'>" +
                "<div class='head'><div class='title'>" + ops.title + "</div></div>" +
                "<div class='body'></div>" +
                "<div class='foot'>";
        for (var i in ops.btns) {
            cc += "<div class='tbtn' type='" + ops.btns[i].type + "' title='" + ops.btns[i].name + "'><i class='" + ops.btns[i].icon + "'></i></div>";
        }
        cc += "</div>" +
                "</div>";
        var c = $(cc).prependTo(this.group);
//        c.find(".head").click(function () {
//            ths.dispatchEvent("showit", $(this).parent());
//        });
        c.find(".tbtn").each(function () {
            $(this).click(function () {
                var type = $(this).attr("type");
                ths.dispatchEvent(type, {
                    btn: $(this),
                    chouti: $(this).parent(2),
                    view: $(this).parent(2).children(1).children(0).getModule()
                });
            });
        });
        setTimeout(function () {
            c.css({
                "-webkit-transform": "translateX(" + a + "px)"
            });
        }, 0);
        return this.addChild({
            type: ops.type,
            container: c.find(".body"),
            option: ops.option,
            parameters: ops.parameters,
            target: ops.target
        });
    },
    showIt: function (a) {
        var b = 0;
        for (var i = this.group.children().length - 1; i >= 0; i--) {
            if (i !== a) {
                b += 30;
            } else {
                b += this.group.children().eq(i).width();
            }
            this.group.children().eq(i).css("-all-transform", "translateX(" + (-this.group.children().eq(i).width() + b) + "px)");
        }
    },
    removeIt: function (a) {
        var b = 0, ths = this;
        for (var i = this.group.children().length - 1; i >= 0; i--) {
            b += 30;
            this.group.children().eq(i).css("-all-transform", "translateX(" + (-this.group.children().eq(i).width() + b) + "px)");
        }
        setTimeout(function () {
            ths.group.children().eq(a).remove();
            if (ths.group.children().length > 0) {
                ths.group.children().eq(a).children(".foot").show();
                ths.showIt(a);
            } else {
                ths.group.remove();
                ths.dispatchEvent("nochouti");
            }
        }, 500);
    },
    event_addChouti: function (e) {
        this.add(e.data);
    },
    event_showit: function (e) {
        var a = this.group.children().length - parseInt(e.data.attr("num")) - 1;
        this.showIt(a);
    },
    event_removeit: function (e) {
        var a = this.group.children().length - parseInt(e.data.attr("num")) - 1;
        this.removeIt(a);
    },
    event_removeChouti: function (e) {
        var a = this.group.children().length - parseInt(this.group.children(0).attr("num")) - 1;
        this.removeIt(a);
        e.stopPropagation();
    },
    removeLastChouti: function () {
        var a = this.group.children().length - parseInt(this.group.children(0).attr("num")) - 1;
        this.removeIt(a);
    },
    event_nochouti: function (e) {
        e.stopPropagation();
    },
    onunload: function () {
        console.log("--44444444--%o----%o", this.type(), this.getId());
    }
});
Module({
    name: "extendgroup",
    extend: "@.basegroup",
    event_form_selecttree: function (e) {
        this.add({
            title: "选择数据",
            type: "@tree.treeselect",
            option: e.data.tree,
            parameters: e.target,
            width: 350,
            btns: [
                {type: "treeselectdata", name: "submit", icon: "fa fa-check"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ]
        });
        e.stopPropagation();
    },
    event_form_selecttable: function (e) {
        this.add({
            title: "选择数据",
            type: "@.selecttable",
            option: e.data,
            parameters: e.target,
            width: 800,
            btns: [
                {type: "tableselectdata", name: "submit", icon: "fa fa-check"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ]
        });
        e.stopPropagation();
    },
    event_treeselectdata: function (e) {
        var view = e.data.view;
        view.parameters.setValue(view.getSelectData());
        this.removeLastChouti(e.data.chouti);
        e.stopPropagation();
    },
    event_tableselectdata: function (e) {
        var view = e.data.view;
        view.parameters.setSelectData(view.getSelectData());
        this.removeLastChouti(e.data.chouti);
        e.stopPropagation();
    }
});
Module({
    name: "tablegrouplite",
    extend: ["@.basegroup"],
    className: "tablegroup",
    option: {
        tableType: "@table.doubleTable",
        formType: "@form.listform",
        btns: [
            {name: "save", action: "searchtable", icon: "fa fa-check"},
            {name: "close", action: "close", icon: "fa fa-times"}
        ],
        find: {},
        table: {}
    },
    layout: module.getTemplate("@group", "tablegroup"),
    onbeforeinit: function (option) {
        option[option.formType] = option.find;
        option[option.tableType] = option.table;
    },
    init: function (option) {
        this.close();
    },
    bind_btn: function (dom) {
        this.dispatchEvent(dom.attr("action"));
    },
    bind_bar: function () {
        this.dom.toggleClass("close");
    },
    event_searchtable: function (e) {
        var ths = this;
        this.getFirstChild().getValues().done(function (data) {
            ths.getChildAt(1).gotoPage(1, data);
        });
        e.stopPropagation();
    },
    event_close: function () {
        this.close();
    },
    close: function () {
        this.dom.addClass("close");
    },
    refresh: function (data) {
        this.getChildAt(1).gotoPage(1, data);
    }
});
Module({
    name: "tablegroup",
    extend: ["@.tablegrouplite", "@.extendgroup"],
    className: "tablegroup",
    option: {
    	idrefresh:true,
        tableedit: {},
        tableremove: {},
        tableadd: {}
    },
    layout: module.getTemplate("@group", "tablegroup"),
    init: function (option) {
        this.outerData = null;
        this.close();
    },
    event_table_uploadfile: function (e) {
    },
    btn_checkbtn: function () {
        var ths = this;
        alert(111);
    },
    event_table_multidelete: function (e) {
        var btn = e.data.btn, data = e.data.data, ths = e.target.parentView;
        var control = btn.data("control");
        if (!control) {
            btn.data("control", {});
            control = btn.data("control");
        }
        if (data.length <= 0) {
            btn.html("<i class='fa fa-times'></i> 还未选择任何数据");
            if (!control["timeout"]) {
                control["timeout"] = setTimeout(function () {
                    btn.html("<i class='fa fa-times'></i>");
                    control["timeout"] = null;
                }, 2000);
            }
        } else {
            if (control["isdelete"]) {
                clearTimeout(control["timeout"]);
                var r = "";
                for (var i in data) {
                    r += data[i].id + ",";
                }
                r = r.length >= 1 ? r.substring(0, r.length - 1) : "";
                btn.html("<i class='fa fa-refresh fa-spin'></i>");
                this.postData({
                    url: this.option.tableremove.url,
                    data: {ids: r},
                    back: function () {
                        btn.html("<i class='fa fa-times'></i>");
                        control["isdelete"] = false;
                        control["timeout"] = null;
                        ths.refresh();
                    },
                    dataerror: function () {
                        btn.html("<i class='fa fa-times'></i>");
                        control["isdelete"] = false;
                        control["timeout"] = null;
                    },
                    neterror: function () {
                        btn.html("<i class='fa fa-times'></i>");
                        control["isdelete"] = false;
                        control["timeout"] = null;
                    }
                });
            } else {
                control["isdelete"] = true;
                btn.html("<i class='fa fa-times'></i> 确定删除数据？");
                if (!control["timeout"]) {
                    control["timeout"] = setTimeout(function () {
                        control["isdelete"] = false;
                        btn.html("<i class='fa fa-times'></i>");
                        control["timeout"] = null;
                    }, 4000);
                }
            }
        }
        e.stopPropagation();
    },
    event_table_rowedit: function (e) {
        this.add({
            title: "编辑数据",
            type: "@form.listform",
            option: this.option.tableedit,
            width: this.option.tableedit.width || 350,
            btns: [
                {type: "table_submit", name: "submit", icon: "fa fa-check"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ],
            parameters: e.data.data,
            target: e.target
        });
        e.stopPropagation();
    },
    event_table_tooladd: function (e) {
        this.add({
            title: "添加数据",
            type: "@form.listform",
            option: this.option.tableadd,
            width: this.option.tableadd.width || 350,
            target: e.target,
            btns: [
                {type: "table_submit", name: "submit", icon: "fa fa-check"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ]
        });
        e.stopPropagation();
    },
    event_table_rowdelete: function (e) {
        var btn = e.data.btn, data = e.data.data, ths = e.target.parentView,thss=this;
        var control = btn.data("control");
        if (!control) {
            btn.data("control", {});
            control = btn.data("control");
        }
        if (!control["timeout"]) {
            var b = $("<div class='alert'><div>确定删除？</div></div>").appendTo(btn.parent(3));
            control["alert"] = b;
            b.click(function (e) {
                clearTimeout(control["timeout"]);
                control["alert"].html("<div><i class='fa fa-refresh fa-spin'></i></div>");
                thss.postData({
                    url: thss.option.tableremove.url,
                    data: {ids: data.id},
                    back: function () {
                        control["alert"].remove();
                        control["alert"] = null;
                        control["timeout"] = null;
                        ths.refresh();
                    },
                    dataerror: function () {
                        control["alert"].remove();
                        control["alert"] = null;
                        control["timeout"] = null;
                    },
                    neterror: function () {
                        control["alert"].remove();
                        control["alert"] = null;
                        control["timeout"] = null;
                    }
                });
                e.stopPropagation();
            });
            control["timeout"] = setTimeout(function () {
                control["alert"].remove();
                control["alert"] = null;
                control["timeout"] = null;
            }, 4000);
        }
        e.stopPropagation();
    },
    event_table_toolrefresh: function (e) {
        e.target.parentView.refresh();
        e.stopPropagation();
    },
    event_table_refresh: function (e) {
        e.target.parentView.refresh();
        e.stopPropagation();
    },
    event_table_submit: function (e) {
        var form = e.data.view, ths = this;
        form.submit().delay(2000).done(function () {
            this.target.refresh();
            ths.removeLastChouti();
        });
        e.stopPropagation();
    },
    event_table_search: function (e) {
        e.target.parentView.dom.toggleClass("close");
        e.stopPropagation();
    }
});
Module({
    name: "selecttablelite",
    extend: ["@.basegroup", "@.tablegrouplite"],
    className: "selecttable",
    layout: module.getTemplate("@group", "selecttable"),
    option: {
        tableType: "@table.doubleTable",
        formType: "@form.listform",
        showName: "name",
        idName: "id",
        singleselect:false,
        btns: [
            {name: "save", action: "searchtable", icon: "fa fa-check"},
            {name: "close", action: "close", icon: "fa fa-times"}
        ]
    },
    init: function () {
        this.dom.removeClass("tablegroup");
        this.selectdata = [];
        this.dom.addClass("close");
        this.setSelectData(this.parameters.data);
    },
    onbeforeinit: function (option) {
        option[option.formType] = option.find;
        option[option.tableType] = option.table||{};
        option[option.tableType]["singleselect"]=option.singleselect;
    },
    find_panel: function (dom) {
        this.panel = dom;
    },
    event_removeselect: function (e) {
        e.target.getChildAt(1).unselect(this.selectdata[e.data][this.option.idName]);
        this.selectdata.splice(e.data,1);
        e.stopPropagation();
    },
    event_unselectrow: function (e) {
        var num = -1, ths = e.target.parentView;
        for (var i in ths.selectdata) {
            if (ths.selectdata[i] && ths.selectdata[i][ths.option.idName] === e.data[ths.option.idName]) {
                num = i;
                ths.selectdata[i] = null;
                break;
            }
        }
        if (num !== -1) {
            ths.panel.find("div[num='" + num + "']").remove();
            if (ths.panel.find(".selecttable-tablecon-selectpanl-cell").length === 0) {
                ths.panel.html("<div class='selecttable-tablecon-selectpanl-desc'>勾选上方表格数据以选择</div>");
                ths.selectdata = [];
            }
        }
        e.stopPropagation();
    },
    event_selectrow: function (e) {
        var ths = e.target.parentView;
        if (ths.panel.find(".selecttable-tablecon-selectpanl-cell").length === 0) {
            ths.panel.empty();
        }
        $("<div class='selecttable-tablecon-selectpanl-cell' num='" + ths.selectdata.length + "'><div class='selecttable-tablecon-selecpanl-cell-name'>" + e.data[ths.option.showName] + "</div>" +
                "<div class='selecttable-tablecon-selectpanl-remove'><i class='fa fa-times'></i></div></div>").appendTo(this.panel).children(1).click(function () {
            ths.dispatchEvent("removeselect", $(this).parent().attr("num"));
            $(this).parent().remove();
            if (ths.panel.find(".selecttable-tablecon-selectpanl-cell").length === 0) {
                ths.panel.html("<div class='selecttable-tablecon-selectpanl-desc'>勾选上方表格数据以选择</div>");
                ths.selectdata = [];
            }
        });
        ths.selectdata.push(e.data);
        e.stopPropagation();
    },
    getSelectData: function () {
        var a = [];
        for (var i in this.selectdata) {
            if (this.selectdata[i]) {
                a.push(this.selectdata[i]);
            }
        }
        return a;
    },
    setSelectData: function (data) {
        var ths = this;
        for (var i in data) {
            if (this.panel.find(".selecttable-tablecon-selectpanl-cell").length === 0) {
                this.panel.empty();
            }
            $("<div class='selecttable-tablecon-selectpanl-cell' num='" + this.selectdata.length + "'><div class='selecttable-tablecon-selecpanl-cell-name'>" + data[i][this.option.showName] + "</div>" +
                    "<div class='selecttable-tablecon-selectpanl-remove'><i class='fa fa-times'></i></div></div>").appendTo(this.panel).children(1).click(function () {
                ths.dispatchEvent("removeselect", $(this).parent().attr("num"));
                $(this).parent().remove();
                if (ths.panel.find(".selecttable-tablecon-selectpanl-cell").length === 0) {
                    ths.panel.html("<div class='selecttable-tablecon-selectpanl-desc'>勾选上方表格数据以选择</div>");
                    ths.selectdata = [];
                }
            });
            this.selectdata.push(data[i]);
        }
    }
});
Module({
    name: "selecttable",
    extend: ["@.selecttablelite", "@.tablegroup"],
    className: "selecttable",
    layout: module.getTemplate("@group", "selecttable"),
    option: {
        tableType: "@table.doubleTable",
        formType: "@form.listform",
        showName: "name",
        idName: "id"
    },
    init: function () {
        this.dom.removeClass("tablegroup");
        this.selectdata = [];
        this.dom.addClass("close");
        this.setSelectData(this.parameters.data);
    }
});
Module({
    name: "treetablegroup",
    extend: ["@.extendgroup", "@.tablegroup"],
    className: "treetablegroup",
    option: {
        treeType: "@tree.tree",
        tablegroupType: "@.tablegrouplite",
        tree: {}
    },
    layout: module.getTemplate("@group", "treetablegroup"),
    onbeforeinit: function (option) {
        option[option.tablegroupType] = {
            find: this.option.find,
            table: this.option.table||{}
        };
        option[option.tablegroupType].table["isrefresh"]=true;
        option[option.treeType] = this.option.tree;
        $.extend(option[option.treeType], {
            ischeck: false,
            isadd: false,
            isremove: false,
            ismoveup: false,
            ismovedown: false,
            isedit: false
        });
    },
    init: function (option) {
        this.getChildAt(1).close();
    },
    event_treeclick: function (e) {
        if (e.target.parentView.getLastChild().typeOf("@.tablegrouplite")) {
            e.target.parentView.getLastChild().refresh({aState:e.data.data.id});
        }
        e.stopPropagation();
    }
});

Module({
    name: "treetab",
    extend: ["@.extendgroup", "@.tablegroup"],
    className: "treetablegroup",
    option: {
        treeType: "@tree.tree",
        tablegroupType: "@.tabgroup",
        tree: {}
    },
    layout: module.getTemplate("@group", "treetabgroup"),
    onbeforeinit: function (option) {
    	option[option.tablegroupType] = this.option.tab || {};
        option[option.treeType] = this.option.tree || {};
        $.extend(option[option.treeType], {
            ischeck: false,
            isadd: false,
            isremove: false,
            ismoveup: false,
            ismovedown: false,
            isedit: false
        });
    },
    init: function (option) {
//        this.getChildAt(1).close();
    },
    event_treeclick:function(e){
    	this.getLastChild().parameters=e.data;
    	this.dispatchEvent("parenttreeclick",e.data,false);
    }
});
Module({
    name: "treetableselectgroup",
    extend: ["@.extendgroup", "@.treetablegroup"],
    className: "treetablegroup",
    option: {
        treeType: "@tree.tree",
        tablegroupType: "@.selecttablelite",
        showName: "name",
        idName: "id"
    },
    layout: module.getTemplate("@group", "treetablegroup"),
    onbeforeinit: function (option) {
        option[option.tablegroupType] = {
            find: this.option.find,
            table: this.option.table,
            showName: this.option.showName,
            idName: this.option.idName
        };
        option[option.treeType] = this.option.tree || {};
        $.extend(option[option.treeType], {
            ischeck: true,
            isadd: false,
            isremove: false,
            ismoveup: false,
            ismovedown: false,
            isedit: false
        });
    }
});
Module({
    name: "edittree",
    extend: "@.extendgroup",
    className: "edittree",
    option: {
        treeType: "@tree.tree",
        formType: "@form.listform",
        tree: {},
        treeadd: {},
        treeedit: {}
    },
    layout: module.getTemplate("@group", "edittree"),
    onbeforeinit: function (option) {
        this.option[this.option.treeType] = this.option.tree||{};
//        $.extend(this.option[this.option.treeType], {
//            ischeck: false,
//            isadd: true,
//            isremove: true,
//            ismoveup: true,
//            ismovedown: true,
//            isedit: true
//        });
    },
    event_editnode: function (e) {
        this.add({
            title: "编辑数据",
            type: "@form.listform",
            option: this.option.treeedit,
            parameters: e.data.data,
            target: e.target,
            width: 350,
            btns: [
                {type: "node_edit_submit", name: "submit", icon: "fa fa-check"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ]
        });
        e.stopPropagation();
    },
    event_addnode: function (e) {
        this.add({
            title: "添加数据",
            type: "@form.listform",
            option: this.option.treeadd,
            parameters: e.data.data,
            target: e.target,
            width: 350,
            btns: [
                {type: "node_edit_submit", name: "submit", icon: "fa fa-check"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ]
        });
        e.stopPropagation();
    },
    event_node_edit_submit: function (e) {
        var ths = this;
        var form = e.data.view;
        var c = form.parameters;
        form.submit(function (data) {
            return $.extend(data, c);
        }).delay(2000).done(function () {
            ths.removeLastChouti();
            this.target.build();
        });
        e.stopPropagation();
    },
    event_node_add_submit: function (e) {
        var ths = this;
        var form = e.data.view;
        form.submit().done(function () {
            setTimeout(function () {
                ths.removeLastChouti();
                form.target.build();
            });
        });
        e.stopPropagation();
    }
});
Module({
    name: "tabgroup",
    extend: "@.basegroup",
    className: "tabgroup",
    option: {
        tabs: [
            {name: "tab1", inner: "", option: ""},
            {name: "tab2", inner: "", option: ""}
        ]
    },
    layout: module.getTemplate("@group", "tabgroup"),
    onbeforeinit: function () {
        this.titles = [];
        this.contents = [];
    },
    init: function () {
        this.titles[0].click();
    },
    find_title: function (dom) {
        this.titles.push(dom);
    },
    find_content: function (dom) {
        this.contents.push(dom);
    },
    bind_title: function (dom) {
        for (var i in this.titles) {
            if (this.titles[i].get(0) === dom.get(0)) {
                this.titles[i].addClass("hover");
                this.contents[i].addClass("hover");
            } else {
                this.titles[i].removeClass("hover");
                this.contents[i].removeClass("hover");
            }
        }
    },
    removeTab: function (num) {
        if (num >= 0 && num < this.titles.length) {
            this.titles[num].remove();
            this.contents[num].remove();
        }
    }
});
Module({
    name:"tabstate",
    extend:"@.basegroup",
    className:"tabstate",
    option:{
        states:[
            {name: "tab1", inner: "", option: ""},
            {name: "tab2", inner: "", option: ""}
        ],
        inner:"",
        option:""
    },
    layout: module.getTemplate("@group", "tabstate"),
    onbeforeinit: function () {
        this.titles = [];
    },
    init: function () {
        this.titles[0].click();
        this.dispatchEvent("stateclick",this.option.states[this.titles[0].attr("num")]);
    },
    find_title: function (dom) {
        this.titles.push(dom);
    },
    bind_title: function (dom) {
        for (var i in this.titles) {
            if (this.titles[i].get(0) === dom.get(0)) {
                this.titles[i].addClass("hover");
                this.dispatchEvent("stateclick",this.option.states[this.titles[i].attr("num")]);
            } else {
                this.titles[i].removeClass("hover");
            }
        }
    }
});
Module({
    name: "edittreetablegroup",
    extend: ["@.extendgroup", "@.edittree", "@.tablegroup", "@.treetablegroup"],
    className: "edittreetablegroup",
    option: {
        treeType: "@tree.tree",
        tablegroupType: "@.tablegrouplite",
        tree: {}
    },
    layout: module.getTemplate("@group", "edittreetablegroup"),
    onbeforeinit: function (option) {
        option[option.tablegroupType] = {
            find: this.option.find,
            table: this.option.table
        };
        option[option.treeType] = this.option.tree;
    }
});
Module({
    name: "popup",
    extend: "viewgroup",
    className: "popup",
    layout: module.getTemplate("@group", "popup"),
    option: {
        title: "popup",
        width: "80%",
        height: "400px",
        inner: "@.tablegroup",
        option: "admin.option.test.main",
        btns: [
            {name: "close", action: "close", icon: "fa fa-times"}
        ]
    },
    onbeforeinit: function () {
        var width = this.option.width;
        var height = this.option.height;
        if ($.is.isString(width)) {
            if (width.indexOf("px") !== -1) {
                this.option["width2"] = parseFloat(width) / 2 + "px";
            } else if (width.indexOf("%") !== -1) {
                this.option["width2"] = parseFloat(width) / 2 + "%";
            }
        } else if ($.is.isNumber(width)) {
            this.option["width"] = width + "px";
            this.option["width2"] = width / 2 + "px";
        }
        if ($.is.isString(height)) {
            if (height.indexOf("px") !== -1) {
                this.option["height2"] = parseFloat(height) / 2 + "px";
            } else if (height.indexOf("%") !== -1) {
                this.option["height2"] = parseFloat(height) / 2 + "%";
            }
        } else if ($.is.isNumber(height)) {
            this.option["height"] = height + "px";
            this.option["height2"] = height / 2 + "px";
        }
    },
    bind_btn: function (dom) {
        this.dispatchEvent(dom.attr("action"), {
            btn: dom
        });
    },
    close: function () {
        this.remove();
    },
    event_close: function () {
        this.remove();
    }
});
Module({
    name: "popupgroup",
    extend: "@.basegroup",
    className: "popupgroup",
    option: {
        title: "Title",
        type: "",
        width: 300 + Math.random() * 500,
        option: "",
        parameters: {},
        target: null,
        btns: [{type: "removeChouti", name: "close", icon: "fa fa-times"}]
    },
    init: function () {
        this.add(this.option);
    },
    event_nochouti: function () {
    	this.parentView.getChildAt(1).refresh();
        this.remove();
    }
});