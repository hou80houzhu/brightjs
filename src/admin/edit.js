/*!
 * @packet admin.edit; 
 * @require admin.form;
 * @css admin.style.editor;
 * @template admin.template.formtemplate;
 */
Module({
    name: "editor",
    extend: "@form.fieldgroup",
    className: "editor",
    layout: module.getTemplate("@formtemplate", "htmleditor"),
    option: {
        url: basePath + "editor/upload",
        imgurl:"",
        filename: "file",
        autosize: false,
        fontsize: [
            {name: "1号", value: 1},
            {name: "2号", value: 2},
            {name: "3号", value: 3},
            {name: "4号", value: 4},
            {name: "5号", value: 5},
            {name: "6号", value: 6},
            {name: "7号", value: 7}
        ],
        fontfamily: [
            {name: "宋体", value: "宋体"},
            {name: "微软雅黑", value: "微软雅黑"},
            {name: "黑体", value: "黑体"},
            {name: "楷体", value: "楷体"},
            {name: "隶书", value: "隶书"},
            {name: "仿宋", value: "仿宋"},
            {name: "Arial", value: "Arial"},
            {name: "Tahoma", value: "Tahoma"},
            {name: "Helvetica", value: "Helvetica"}
        ],
        color: true,
        basic: [
            {action: "bold", icon: "fa fa-bold", title: ""},
            {action: "italic", icon: "fa fa-italic", title: ""},
            {action: "underline", icon: "fa fa-underline", title: ""}
        ],
        justify: [
            {action: "justifyLeft", icon: "fa fa-align-left", title: ""},
            {action: "justifyCenter", icon: "fa fa-align-center", title: ""},
            {action: "justifyRight", icon: "fa fa-align-right", title: ""}
        ],
        list: [
            {action: "insertOrderedList", icon: "fa fa-th-list", title: ""},
            {action: "insertUnorderedList", icon: "fa fa-list", title: ""}
        ],
        dent: [
            {action: "indent", icon: "fa fa-indent", title: ""},
            {action: "outdent", icon: "fa fa-outdent", title: ""}
        ],
        insert: [
            {action: "insertLink", icon: "fa fa-link", title: ""},
            {action: "insertImg", icon: "fa fa-file-image-o", title: ""},
            {action: "insertVideo", icon: "fa fa-file-movie-o", title: ""}
        ],
        undo: {action: "undo", title: "", icon: "fa fa-repeat"}
    },
    onbeforeinit: function () {
        this.textarea = null;
        this.droplist = [];
        this.basic = [];
    },
    init: function () {
        if (this.option.autosize) {
            this.dom.addClass("autosize");
        }
        this.setValue(this.option.value || "");
        this.disable(this.option.disabled);
    },
    find_droplist: function (dom) {
        this.droplist.push(dom);
    },
    find_basic: function (dom) {
        this.basic.push(dom);
    },
    find_textarea: function (dom) {
        var ths = this;
        this.paper = dom.get(0).contentWindow;
        this.paperdoc = this.paper.document;
        this.paperdoc.designMode = "on";
        this.paperdoc.contentEditable = true;
        this.paperdoc.open();
        this.paperdoc.writeln("<div id='editor' contentEditable='true' style='margin:0 auto;line-height:1.6;overflow:hidden;width:90%;min-height:900px;background:white;padding:10px;outline:none;border:1px solid #DDDDDD;'></div>");
        this.paperdoc.close();
        this.paperdoc.designMode = "Off";
        this.editorDiv = this.paperdoc.getElementById("editor");
        this.editorDiv.focus();
        this.editorDiv.addEventListener("mousedown", function () {
            ths.dispatchEvent("areamousedown");
        }, false);
        this.editorDiv.addEventListener("mouseup", function () {
            ths.dispatchEvent("areamouseup");
        }, false);
    },
    bind_droplist: function (dom) {
        this.closeAllDropList();
        dom.parent().toggleClass("open");
    },
    bind_droplistitem: function (dom) {
        var parent = dom.parent(".editor-droplist");
        parent.removeClass("open").children(0).children(0).html(dom.attr("label"));
        this.doCommand(parent.attr("type"), false, dom.attr("value"));
        this.focus();
    },
    bind_colorpicker: function (dom) {
        var parent = dom.parent(".editor-droplist");
        parent.removeClass("open").children(0).children(0).html("<div style='display:inline-block;vertical-align:sub;width:15px;height:15px;background:" + dom.attr("value") + "'></div>");
        this.doCommand(parent.attr("type"), false, dom.attr("value"));
        this.focus();
    },
    bind_basic: function (dom) {
        this.doCommand(dom.attr("action"));
        this.focus();
    },
    bind_insert: function (dom) {
        this.dispatchEvent(dom.attr("action"));
    },
    event_closealldroplist: function () {
        this.closeAllDropList();
    },
    event_areamousedown: function () {
        this.dispatchEvent("closealldroplist");
    },
    event_areamouseup: function () {
        this.setState();
    },
    event_aftercommand: function () {
        this.setState();
    },
    event_insertImg: function () {
        var ths = this;
        this.addChild({
            type: "@.box",
            option: {
                title: "插入图片",
                inner: "@form.listform",
                btns: [
                    {name: "save", action: "save", icon: "fa fa-check"},
                    {name: "close", action: "close", icon: "fa fa-times"}
                ],
                "@form.listform": {
                    fields: [
                        {name: "img", label: "label", type: "@form.imageupload", filename: ths.option.filename, url: ths.option.url}
                    ]
                },
                override: {
                    event_save: function () {
                        var thss = this;
                        this.getChildAt(0).getValues().done(function (data) {
                            ths.doCommand("insertHTML", false, "<img style='width:100%' src='" +ths.option.imgurl+ data.img + "'/>");
                            thss.close();
                            ths.focus();
                        });
                    }
                }
            },
            container: this.dom
        });
    },
    event_insertVideo: function () {
        var ths = this;
        this.addChild({
            type: "@.box",
            option: {
                title: "插入视频",
                inner: "@form.listform",
                btns: [
                    {name: "save", action: "save", icon: "fa fa-check"},
                    {name: "close", action: "close", icon: "fa fa-times"}
                ],
                "@form.listform": {
                    fields: [
                        {name: "url", label: "url", type: "@form.text", required: true, value: "http://player.youku.com/player.php/sid/XMTI3ODgxMzAzNg==/v.swf"},
                        {name: "width", label: "width", type: "@form.text", required: true, value: "400"},
                        {name: "height", label: "height", type: "@form.text", required: true, value: "300"}
                    ]
                },
                override: {
                    event_save: function () {
                        if (this.getChildAt(0).check()) {
                            var url = this.getChildAt(0).getChildAt(0).getValue();
                            var width = this.getChildAt(0).getChildAt(1).getValue();
                            var height = this.getChildAt(0).getChildAt(2).getValue();
                            var str = "<embed src='" + url + "' allowFullScreen='true' quality='high' width='" + width + "' height='" + height + "' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>";
                            ths.doCommand("insertHTML", false, str);
                            this.close();
                            ths.focus();
                        }
                    }
                }
            },
            container: this.dom
        });
    },
    event_insertLink: function () {
        var ths = this;
        this.addChild({
            type: "@.box",
            option: {
                title: "插入链接",
                inner: "@form.listform",
                btns: [
                    {name: "save", action: "save", icon: "fa fa-check"},
                    {name: "close", action: "close", icon: "fa fa-times"}
                ],
                "@form.listform": {
                    fields: [
                        {name: "url", label: "url", type: "@form.text", required: true},
                        {name: "label", label: "label", type: "@form.text", required: true}
                    ]
                },
                override: {
                    event_save: function () {
                        if (this.getChildAt(0).check()) {
                            var url = this.getChildAt(0).getChildAt(0).getValue();
                            var label = this.getChildAt(0).getChildAt(1).getValue();
                            ths.doCommand("insertHTML", false, "<a href='" + url + "'>" + label + "</a>");
                            this.close();
                            ths.focus();
                        }
                    }
                }
            },
            container: this.dom
        });
    },
    focus: function () {
        this.editorDiv.focus();
    },
    closeAllDropList: function () {
        for (var i in this.droplist) {
            this.droplist[i].removeClass("open");
        }
    },
    doCommand: function (type, isui, pars) {
        this.dispatchEvent("beforecommand");
        this.paperdoc.execCommand(type, isui, pars);
        this.dispatchEvent("aftercommand");
    },
    checkCommand: function (type) {
        return this.paperdoc.queryCommandState(type);
    },
    checkFontFace: function () {
        var t = this.paper.getSelection().getRangeAt(0);
        var parent = t.commonAncestorContainer.parentElement;
        if (parent.nodeName === "FONT") {
            return parent.face;
        } else {
            return null;
        }
    },
    checkFontSize: function () {
        var t = this.paper.getSelection().getRangeAt(0);
        var parent = t.commonAncestorContainer.parentElement;
        if (parent.nodeName === "FONT") {
            return parent.size;
        } else {
            return null;
        }
    },
    checkFontColor: function () {
        var t = this.paper.getSelection().getRangeAt(0);
        var parent = t.commonAncestorContainer.parentElement;
        if (parent.nodeName === "FONT") {
            return parent.color;
        } else {
            return null;
        }
    },
    setState: function () {
        for (var i in this.basic) {
            var a = this.checkCommand(this.basic[i].attr("action"));
            if (a) {
                this.basic[i].addClass("hover");
            } else {
                this.basic[i].removeClass("hover");
            }
        }
        var t = this.checkFontFace();
        var s = this.checkFontSize();
        var c = this.checkFontColor();
        if (!t) {
            t = "宋体";
        }
        this.droplist[1].children(0).children(0).html(t);
        if (!s) {
            s = "1";
        }
        this.droplist[0].children(0).children(0).html(s + "号");
        if (!c) {
            c = "black";
        }
        this.droplist[2].children(0).children(0).html("<div style='display:inline-block;vertical-align:sub;width:15px;height:15px;background:" + c + "'></div>");
    },
    getBox: function (option) {
        var a = $($.template(module.getTemplate("@formtemplate", "htmleditorbox")).render(option)).appendTo(this.dom);
        this.update();
        return a;
    },
    getValue: function () {
        return $(this.editorDiv).html();
    },
    setValue: function (value) {
        this.value = value;
        $(this.editorDiv).html(value);
    },
    check: function () {
        if (this.option.required) {
            var ths = this;
            if (this.getValue().length <= 15) {
                this.showTip("<i class='fa fa-times'></i> 必填选项不能为空");
                setTimeout(function () {
                    ths.hideTip();
                }, 10000);
                return false;
            }
        }
        return true;
    },
    showTip: function (mes) {
        this.dom.find(".editor-tip").show().html(mes);
    },
    hideTip: function () {
        this.dom.find(".editor-tip").hide();
    },
    disable: function (a) {
        this.editorDiv.disabled = a;
    },
    empty: function () {
        this.setValue("");
    }
});
Module({
    name: "box",
    extend: "viewgroup",
    className: "editor-box",
    layout: module.getTemplate("@formtemplate", "htmleditorbox"),
    option: {
        title: "",
        btns: [{name: "close", icon: "fa fa-times", action: "close"}],
        inner: ""
    },
    init: function () {
    },
    bind_btn: function (dom) {
        this.dispatchEvent(dom.attr("action"));
    },
    close: function () {
        this.remove();
    },
    event_close: function () {
        this.close();
    }
});