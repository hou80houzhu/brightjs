/*!
 * @packet admin.form;
 * @require admin.util.toast;
 * @require admin.util.file;
 * @require admin.tree;
 * @css admin.style.form;
 * @template admin.template.formtemplate;
 */
Module({
    name: "baseform",
    extend: "viewgroup",
    option: {
        action: "",
        fields: []
    },
    onbeforesubmit: null,
    onsubmitback: null,
    onsubmiterror: null,
    onneterror: null,
    getFieldByName: function (name) {
        var a = null;
        this.childEach(function () {
            if (this.typeOf("@.basefield") && this.getFieldName() === name) {
                a = this;
                return false;
            }
        });
        return a;
    },
    check: function () {
        var a = true, field = null;
        this.childEach(function () {
            if (this.typeOf("@.basefield")) {
                a = this.check();
                field = this;
                return a;
            }
        });
        if (a) {
            if (this.customCheck) {
                a = this.customCheck.call(this);
            }
        }
        if (!a) {
            this.oncheckerror && this.oncheckerror(field);
        }
        return a;
    },
    reset: function () {
        this.childEach(function () {
            if (this.typeOf("@.basefield")) {
                this.reset();
            }
        });
    },
    disable: function () {
        this.childEach(function () {
            if (this.typeOf("@.basefield")) {
                this.disable();
            }
        });
    },
    getValues: function () {
        var vals = [], asys = [], promise = $.promise();
        this.childEach(function () {
            if (this.typeOf("@.Aasys")) {
                asys.push(this);
            } else if (this.typeOf("@.basefield")) {
                vals.push({
                    name: this.getFieldName(),
                    value: this.getValue()
                });
            }
        });
        var queue = $.queue();
        for (var i in asys) {
            queue.add(function (result, obj) {
                obj.asys(function (val) {
                    vals.push({
                        name: obj.getFieldName(),
                        value: val
                    });
                    queue.next(val);
                }, result);
            }, null, asys[i]);
        }
        queue.complete(function () {
            var r = {};
            for (var i in vals) {
                r[vals[i].name] = vals[i].value;
            }
            promise.resolve(r);
        });
        queue.run();
        return promise;
    },
    setValues: function (obj) {
        if (obj) {
            this.parameters = obj;
            this.childEach(function () {
                if (this.typeOf("@.basefield")) {
                    var k = obj[this.getFieldName()];
                    if (k !== undefined) {
                        this.setValue(k);
                    }
                }
            });
        }
    },
    submit: function (fn) {
        var ths = this;
        var pros = $.promise();
        pros.scope(this);
        if (this.check()) {
            this.getValues().done(function (data) {
                ths.onbeforesubmit && ths.onbeforesubmit(data);
                ths.postData({
                    url: ths.option.action,
                    data: fn ? fn(data) : data,
                    back: function (da) {
                        ths.onsubmitback && ths.onsubmitback(da);
                        pros.resolve(da);
                    },
                    dataerror: function (e) {
                        ths.onsubmiterror && ths.onsubmiterror(e);
                        pros.reject(e.msg);
                    },
                    neterror: function (e) {
                        ths.onneterror && ths.onneterror();
                        pros.reject(e);
                    }
                });
            });
            return pros;
        } else {
            return pros;
        }
    },
    oninitchild: function (module) {
        var viewid=module.getId();
        var name = viewid.substring(1, viewid.length);
        $.extend(module.option,this.option.fields[name]);
    },
    event_selectchange: function (e) {
        var next = e.data.next, value = e.data.value, ths = this;
        this.childEach(function () {
            if (this.typeOf("@.select") && this.getFieldName() === next) {
                this.loadData(value);
            }
        });
        e.stopPropagation();
    },
    empty: function () {
        this.childEach(function () {
            if (this.typeOf("@.basefield")) {
                this.empty();
            }
        });
    }
});
Module({
    name: "basefield",
    extend: "view",
    option: {
        name: "",
        label: "",
        value: "",
        disabled: false,
        required: false
    },
    value: null,
    customCheck: null,
    check: function () {
        if (this.customCheck) {
            return this.customCheck.call(this);
        } else {
            return true;
        }
    },
    getValue: function () {
        return this.value;
    },
    setValue: function (a) {
        this.value = a;
        return this;
    },
    disable: function (isdisable) {
        return this;
    },
    reset: function () {
        this.setValue(this.value);
        return this;
    },
    getFieldName: function () {
        return this.option.name;
    },
    getLabelName: function () {
        return this.option.label;
    },
    empty: function () {
    },
    showTip: function (mes) {
        if (this.dom.find(".input-alert").length === 0) {
            $("<div class='input-alert'><i class='fa fa-exclamation-circle'></i> " + mes + "</div>").appendTo(this.dom);
        }
    },
    hideTip: function () {
        this.dom.find(".input-alert").remove();
    }
});
Module({
    name: "field",
    extend: "@.basefield",
    className: "field"
});
Module({
    name: "fieldgroup",
    extend: ["viewgroup", "@.basefield"]
});
Module({
    name: "Aasys",
    asys: null,
    getValue: function (fn) {
        this.asys && this.asys(fn);
    }
});
Module({
    name: "asysfield",
    extend: ["@.field", "@.Aasys"],
    asys: function (fn) {
        fn && fn(this.value);
    }
});
Module({
    name: "asysfieldgroup",
    extend: ["@.fieldgroup", "@.Aasys"],
    asys: function (fn) {
        fn && fn(this.value);
    }
});

Module({
    name: "text",
    extend: "@.field",
    option: {
        label: "text-label",
        isflex: false,
        isblock: true,
        ishow: true,
        inputType: "text", //text|textarea|password
        reg: "",
        max: 2000,
        min: 0,
        readonly: false,
        disabled: false,
        required: false,
        desc: "",
        hook: null
    },
    template: module.getTemplate("@formtemplate", "text"),
    init: function (option) {
        this.value = option.value;
        this.render(option);
        if (option.isflex) {
            this.dom.addClass("flex").width("100%");
        }
        this.input.get(0).disabled = option.disabled;
        if (!option.ishow) {
            this.dom.hide();
        }
    },
    find_input: function (dom) {
        this.input = dom;
    },
    bind_keyup: function (dom) {
        this.value = dom.val();
        this.check();
    },
    reg: {
        email: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, "请输入正确的email地址"],
        number: [/^[0-9]*$/, "请输入数字"],
        int: [/^\+?[1-9][0-9]*$/, "非零正整数"],
        unint: [/^\-[1-9][0-9]*$/, "非零负整数"],
        intwith: [/^\d+$/, "正整数 + 0"],
        unintwith: [/^((-\d+)|(0+))$/, "负整数 + 0"],
        en: [/^[A-Za-z]+$/, "26个英文字母组成的字符串"],
        amount: [/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/, "请输入正确的金额"],
        enupper: [/^[A-Z]+$/, "26个大写英文字母组成的字符串"],
        enlower: [/^[a-z]+$/, "26个小写英文字母组成的字符串"],
        words: [/^[A-Za-z0-9]+$/, "数字和26个英文字母组成的字符串"],
        simplewords: [/^\w+$/, "数字、26个英文字母或者下划线"],
        username: [/^[\一\?-Za-z0-9-_]*$/, "中英文，数字，下划线，减号"],
        password: [/^[a-zA-Z]\w{5,17}$/, "以字母开头，长度在6-18之间，只能包含字符、数字和下划线"],
        nospecial: [/^([\u4e00-\u9fa5-a-zA-Z0-9]+)$/, "不能输入特殊字符！"],
        any: [/^.*$/, ""]
    },
    check: function () {
        this.getValue();
        var result = false;
        if (!this.customCheck) {
            result = this.checkLength();
            if (!result) {
                
                this.showTip("长度应该大于" + this.option.min + "小于" + this.option.max);
                return false;
            } else {
                this.hideTip();
            }
            result = this.checkRegular();
            if (!result) {
                this.showTip(this.reg[this.option.reg][1] || "格式不正确");
                return false;
            } else {
                this.hideTip();
            }
            result = this.checkRequired();
            if (!result) {
                this.showTip("必填选项");
                return false;
            } else {
                this.hideTip();
            }
            return true;
        } else {
            return this.customCheck.call(this);
        }
    },
    checkDefault: function () {
        result = this.checkLength();
        if (!result) {
            this.showTip("长度应该大于" + this.option.min + "小于" + this.option.max);
            return false;
        }
        result = this.checkRegular();
        if (!result) {
            this.showTip(this.reg[this.option.reg][1] || "格式不正确");
            return false;
        }
        result = this.checkRequired();
        if (!result) {
            this.showTip("必填选项");
            return false;
        }
        return true;
    },
    checkRequired: function () {
        var value = this.value + "";
        if (this.option.required) {
            if (value.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    },
    checkRemote: function (url, paraName) {
        var data = {}, result = false;
        data[paraName] = this.value;
        $.ajax({
            url: url,
            data: data,
            dataType: "json",
            asysn: false,
            success: function (e) {
                if (e.code === "1") {
                    result = true;
                } else {
                    result = false;
                }
            },
            error: function () {
                result = false;
            }
        });
        return result;
    },
    checkLength: function (a, b) {
        var value = this.value + "";
        if (arguments.length === 0) {
            return value.length >= this.option.min && value.length <= this.option.max;
        } else if (arguments.length === 2) {
            return value.length >= a && value.length <= b;
        } else {
            return false;
        }
    },
    checkRegular: function (reg) {
        var value = this.value;
        if (arguments.length === 0) {
            reg = this.option.reg;
        }
        if (reg) {
            if ($.is.isString(reg)) {
                var regx = this.reg[reg][0];
                if (regx) {
                    return regx.test(value);
                } else {
                    return false;
                }
            } else if (reg instanceof RegExp) {
                return reg.test(value);
            } else {
                return false;
            }
        } else {
            return true;
        }

    },
    setValue: function (a) {
        if (this.option.hook) {
            this.value = this.option.hook(a);
            this.input.val(this.value);
        } else {
            this.value = a;
            this.input.val(a);
        }
    },
    getValue: function () {
        this.value=this.input.val();
        return  this.value;
    },
    disable: function (isdisable) {
        if (isdisable) {
            this.input.get(0).disabled = true;
        } else {
            this.input.get(0).disabled = false;
        }
        return this;
    },
    reset: function () {
        this.wrap.removeClass("error");
        this.setValue(this.value);
    },
    empty: function () {
        this.input.val("");
    }
});
Module({
    name: "hidetext",
    extend: "@.field",
    init: function () {
        this.value = this.option.value;
    }
});
Module({
    name: "statictext",
    extend: "@.text",
    init: function (option) {
        this.value = option.value;
        this.template = this.dom.html();
        this.render(option);
    }
});
Module({
    name: "select",
    extend: "@.field",
    option: {
        name: "",
        url: "",
        label: "",
        paraname: "",
        isload: false,
        next: "",
        keykey: "key",
        keyvalue: "value",
        defaults: [],
        remoteData: []
    },
    template: module.getTemplate("@formtemplate", "select"),
    init: function (option) {
        this.render(option);
        this.value = this.option.value || this.dom.find("select").val();
        if (option.url && option.url !== "") {
            this.loadData();
        }
    },
    bind_select: function (dom) {
        this.value = dom.val();
        this.dispatchEvent("selectchange", {
            value: this.value,
            next: this.option.next
        });
    },
    loadData: function (para) {
        var par = {}, ths = this;
        par[this.option.paraname] = para;
        this.postData({
            url: this.option.url,
            data: par,
            back: function (data) {
                ths.option.remoteData = data;
                ths.render(ths.option);
                ths.value = ths.dom.find("select").val();
                ths.dispatchEvent("selectchange", {
                    value: ths.value,
                    next: ths.option.next
                });
            }
        });
    },
    setValue: function (val) {
        this.value = val;
        this.option.value = val;
        this.dom.find("select").children().each(function () {
            if ($(this).attr("value") === val + "") {
                $(this).get(0).selected = "selected";
                return false;
            }
        });
    },
    reset: function () {
        this.render(this.option);
    }
});
Module({
    name: "radiogroup",
    extend: "@.field",
    option: {
        label: "radio",
        radios: [
            {key: "xxxx", value: "xx"}
        ]
    },
    template: module.getTemplate("@formtemplate", "radiogroup"),
    init: function (option) {
        this.render(option);
        this.value = this.option.value;
        if (option.value === "") {
            this.dom.find("input[type='radio']").get(0).checked = true;
        }
    },
    getValue: function () {
        var k = null;
        this.dom.find("input").each(function () {
            if ($(this).get(0).checked) {
                k = $(this).attr("value");
                return false;
            }
        });
        return k;
    },
    setValue: function (a) {
        this.value = a;
        this.dom.find("input").each(function () {
            if ($(this).attr("value") === a + "") {
                $(this).get(0).checked = true;
            } else {
                $(this).get(0).checked = false;
            }
        });
    },
    reset: function () {
        var a = this.value;
        if (a === null || a + "" === "") {
            this.dom.find("input").get(0).checked = true;
        } else {
            this.dom.find("input").each(function () {
                if ($(this).attr("value") === a + "") {
                    $(this).get(0).checked = true;
                } else {
                    $(this).get(0).checked = false;
                }
            });

        }
    }
});
Module({
    name: "checkboxgroup",
    extend: "@.field",
    option: {
        label: "checkboxgroup",
        checkboxs: [
            {key: "xxxx", value: "xx"}
        ]
    },
    template: module.getTemplate("@formtemplate", "checkboxgroup"),
    init: function (option) {
        this.render(option);
        if (this.option.value !== "") {
            var values = this.option.value.split(",");
            for (var i in values) {
                var k = this.dom.find("input[value='" + values[i] + "']");
                if (k.length > 0) {
                    k.get(0).checked = true;
                }
            }
        }
    },
    getValue: function () {
        var val = "";
        this.dom.find("input[type='checkbox']").each(function () {
            if ($(this).get(0).checked) {
                val += $(this).attr("value") + ",";
            }
        });
        if (val.length > 0) {
            val = val.substring(0, val.length - 1);
        }
        return val;
    },
    setValue: function (a) {
        this.value = a;
        var values = a.split(",");
        for (var i in values) {
            var k = this.dom.find("input[value='" + values[i] + "']");
            if (k.length > 0) {
                k.get(0).checked = true;
            }
        }
        return this;
    },
    reset: function () {
        var a = this.value;
        var values = a.split(",");
        for (var i in values) {
            var k = this.dom.find("input[value='" + values[i] + "']");
            if (k.length > 0) {
                k.get(0).checked = true;
            }
        }
    }
});
Module({
    name: "timmerfield",
    extend: "@.asysfield",
    template: "<div>timmer</div>",
    init: function () {
        this.render();
    },
    asys: function (fn) {
        var k = "111";
        setTimeout(function () {
            fn && fn(k);
        }, 3000);
    }
});
Module({
    name: "imagesuploader",
    className: "imagesuploader",
    extend: "@.asysfield",
    option: {
        url: "upload.php",
        deleteurl: "data/dataok.json",
        editurl: "data/images.json",
        filename: "file",
        title: "图片上传"
    },
    template: module.getTemplate("@formtemplate", "imagesuploader"),
    init: function () {
        this.files = [];
        this.result = [];
        this.render(this.option);
        this.getData();
    },
    bind_file: function (dom, e) {
        var ths = this;
        var file = e.target.files || e.dataTransfer.files;
        for (var m = 0; m < file.length; m++) {
            var _file = require("@file").set(file[m]), has = false;
            for (var i in this.files) {
                if (this.files[i].fileName === _file.fileName()) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                _file.getImage(function (image) {
                    var _w = image.width / image.height * 150;
                    var _x = 0, _y = 0;
                    if (_w <= 150) {
                        _x = (150 - _w) / 2;
                    } else {
                        _h = image.height / image.width * 150;
                        if (_h <= 150) {
                            _y = (150 - _h) / 2;
                        }
                    }
                    t = _file.fileName().split("/");
                    var str = "<div class='imagesuploader-image' fid='" + ths.files.length + "'>" +
                            "<div class='imagesuploader-image-bg' style='background-image:url(" + image.src + ")'></div>" +
                            "<div class='imageuploader-remove' data-bind='click:remove'><i class='fa fa-times'></i></div>" +
                            "<div class='imageuploader-name' title='" + t[t.length - 1] + "'>" + t[t.length - 1] + "</div>" +
                            "<div class='imageuploader-progress'></div>" +
                            "</div>";
                    var p = $(str).insertBefore(ths.dom.find(".imagesuploader-container").children(0));
                    this._dom = p;
                    ths.update();
                });
                this.files.push(_file);
            }
        }
    },
    bind_remove: function (dom) {
        var mid = dom.parent().attr("mid");
        if (mid) {
            this.postData({
                url: this.option.deleteurl,
                data: this.result[mid],
                back: function () {
                    dom.parent().remove();
                }
            });
        } else {
            this.files.splice(dom.parent().attr("fid"), 1);
            dom.parent().remove();
        }
    },
    bind_upload: function () {
        var ths = this;
        for (var i in this.files) {
            this.files[i].upload({
                url: this.option.url,
                name: this.option.filename,
                start: function () {
                    this._dom.find(".imageuploader-remove").hide();
                },
                progress: function (a) {
                    this._dom.find(".imageuploader-progress").width(a.percent + "%");
                },
                success: function (data) {
                    this._dom.find(".imageuploader-progress").width(0);
                    this._dom.find(".imageuploader-remove").show();
                    this._dom.attr("mid", ths.result.length);
                    ths.result.push(data);
                    for (var i in ths.files) {
                        if (ths.files[i] === this) {
                            ths.files.splice(i, 1);
                        }
                    }
                },
                error: function () {
                }
            });
        }
    },
    getData: function () {
        var ths = this;
        this.postData({
            url: this.option.editurl,
            back: function (data) {
                for (var i in data) {
                    $.loader().image(data[i].url, function () {
                        var image = this;
                        var t = image.src.split("/");
                        var str = "<div class='imagesuploader-image' mid='" + ths.result.length + "'>" +
                                "<div class='imagesuploader-image-bg' style='background-image:url(" + image.src + ")'></div>" +
                                "<div class='imageuploader-remove' data-bind='click:remove'><i class='fa fa-times'></i></div>" +
                                "<div class='imageuploader-name' title='" + t[t.length - 1] + "'>" + t[t.length - 1] + "</div>" +
                                "<div class='imageuploader-progress'></div>" +
                                "</div>";
                        $(str).insertBefore(ths.dom.find(".imagesuploader-container").children(0));
                        ths.result.push(data[i]);
                        ths.update();
                    });
                }
            }
        });
    },
    asys: function (fn) {
        var ths = this;
        this.dom.addClass("hover");
        this._file.upload({
            url: "upload.php",
            name: "file",
            asysn: true,
            out: 6000000,
            progress: function (e) {
                ths.dom.find(".loadingbar-color").width(e.percent + "%");
            },
            error: function () {
            },
            success: function (data) {
                ths.dom.removeClass("hover");
                fn && fn(data.data);
            }
        });
    }
});
Module({
    name: "treeform",
    extend: "@.fieldgroup",
    className: "treeform",
    layout: "<div class='label-block'><%=data.option.label;%></div>" +
            "<div class='treeform-con'>" +
            "<div class='treeis'><%=module('@tree.treelite');%></div>" +
            "<div class='tableiscon'>" +
            "<div class='tableis' style='width:<%=option.formwidth;%>'></div>" +
            "<%if(option.hasbtn){%>" +
            "<div class='pbtns'><div class='pbtn' data-btn='checkbtn'><i class='fa fa-check'></i></div></div>" +
            "<%}%>" +
            "<div class='ts-con'><div class='ts'><i class='fa fa-compass'></i> 单击左侧菜单项进行编辑</div></div>" +
            "</div>" +
            "</div>",
    option: {
        removeurl: "data/dataok.json",
        pid: "pid",
        formwidth: "370px",
        hasbtn: true
    },
    init: function () {
    },
    setValue: function (data) {
        if (!data || data === "") {
            data = {name: "ROOT", id: "root", list: []};
        }
        this.getFirstChild().setValue(data).firstClick();
    },
    getValue: function () {
        var str = window.JSON.stringify(this.getFirstChild().getValue());
        return str;
    },
    btn_checkbtn: function () {
        var ths = this;
        this.getLastChild().getValues().done(function (data) {
            var xid = ths.getUUID();
            if (data) {
                var p = $.extend({}, ths.getLastChild().parameters, data);
                if (!p.id) {
                    p.id = xid;
                }
                if (ths.getLastChild().getFieldByName("xid"))
                    ths.getLastChild().getFieldByName("xid").setValue(xid);
                ths.getLastChild().submit().done(function () {
                    if (ths.getLastChild().parameters) {
                        ths.getFirstChild().editNode(p);
                    } else {
                        ths.getFirstChild().addNode(p);
                        ths.dom.find(".ts-con").show();
                    }
                });
            }
        });
    },
    event_treelite_click: function (e) {
        if (e.data.level != "1") {
            this.dom.find(".ts-con").hide();
            var t = this.getChildrenByType("@.listform");
            for (var i in t) {
                t[i].remove();
            }
            this.addChild({
                type: "@.listform",
                option: {
                    fields: this.option.fields
                },
                parameters: e.data.data,
                container: this.dom.find(".tableis")
            });
        }
    },
    event_treelite_add: function (e) {
        var id = e.data.data.id;
        var t = this.getChildrenByType("@.listform");
        for (var i in t) {
            t[i].remove();
        }
        this.dom.find(".ts-con").hide();
        this.addChild({
            type: "@.listform",
            option: {
                fields: this.option.fields
            },
            container: this.dom.find(".tableis")
        });

        this.getLastChild().getFieldByName(this.option.pid).setValue(id);
    },
    event_treelite_remove: function (e) {
        if (e.data.level !== "2") {
            if (!e.data.btn.children(0).hasClass("fa-question")) {
                e.data.btn.data("inner", e.data.btn.html());
                e.data.btn.html("<i class='fa fa-question'></i>");
                setTimeout(function () {
                    e.data.btn.html(e.data.btn.data("inner"));
                }, 2000);
            } else {
                var ths = this;
                var id = e.data.data.id;
                ths.dom.find(".ts-con").show();
                e.data.btn.html("<i class='fa fa-refresh fa-spin'></i>");
                this.postData({
                    url: ths.option.removeurl,
                    data: {id: id},
                    back: function () {
                        ths.getFirstChild().removeNode();
                    },
                    dataerror: function () {
                        e.data.btn.html(e.data.btn.data("inner"));
                        $.toast("删除失败！");
                    }
                });
            }
        } else {
            this.dispatchEvent("treenodecannotremove");
        }
    }
});

Module({
    name: "pagelist",
    extend: "@.select",
    init: function (option) {
        this.option.url = basePath + "contenter/getallpagemapping";
        this.value = this.option.value;
        this.render(option);
        if (option.url && option.url !== "") {
            this.loadData();
        }
    }
});
Module({
    name: "extendform",
    extend: "@.asysfieldgroup",
    className: "extendform",
    option: {
        add:true,//extendform-tools
        delete:true,//extendform-no-tools
        fields: [
            {type: "@.text", label: "type", name: "type"},
            {type: "@.text", label: "label", name: "label"},
            {type: "@.text", label: "name", name: "name"}
        ]
    },
    layout: module.getTemplate("@formtemplate", "extendform"),
    init: function () {
    },
    btn_add: function () {
        if(this.option.delete){
            var t = $(module.getTemplate("@formtemplate", "extendformcell")).appendTo(this.dom.find(".extendform-con"));
        }else{
            var t = $(module.getTemplate("@formtemplate", "extendformcell2")).appendTo(this.dom.find(".extendform-con"));
        }
        this.addChild({
            type: "@.simpleform",
            option: {
                fields: this.option.fields
            },
            container: t.find(".extendform-form")
        }).done(function () {
            this.update();
        });
    },
    btn_remove: function (dom) {
        dom.parent(".extendform-cell").remove();
    },
    asys: function (fn) {
        var t = [], p = this.children.length, ths = this;
        this.childEach(function () {
            this.getValues().done(function (a) {
                t.push(a);
                p--;
                if (p === 0) {
                    fn && fn(window.JSON.stringify(t));
                }
            });
        });
    },
    getValue: function () {
        var t = [], p = this.children.length;
        var promise = $.promise();
        this.childEach(function () {
            this.getValues().done(function (a) {
                t.push(a);
                p--;
                if (p === 0) {
                    promise.resolve(window.JSON.stringify(t));
                }
            });
        });
        return promise;
    },
    setValue: function (val) {
        console.log(val);
        this.dom.find(".extendform-con").empty();
//        var val = window.JSON.stringify(val);
        for (var i in val) {
           if(this.option.delete){
                     var t = $(module.getTemplate("@formtemplate", "extendformcell")).appendTo(this.dom.find(".extendform-con"));
            }else{
                var t = $(module.getTemplate("@formtemplate", "extendformcell2")).appendTo(this.dom.find(".extendform-con"));
            }
            this.addChild({
                type: "@.simpleform",
                option: {
                    fields: this.option.fields
                },
                parameters: val[i],
                container: t.find(".extendform-form")
            }).done(function () {
                this.update();
            });
        }
    },
    empty: function () {
        this.dom.find(".extendform-con").empty();
    }
});
Module({
    name: "imageupload",
    className: "imageupload",
    extend: "@.asysfield",
    option: {
        url: basePath + "contenter/upload",
        filename: "file",
        imgurl: ""
    },
    template: module.getTemplate("@formtemplate", "imageupload"),
    init: function () {
        this._file = null;
        this.render(this.value);
    },
    bind_input: function (dom, e) {
        var ths = this;
        var file = e.target.files || e.dataTransfer.files;
        this._file = require("@file").set(file[0]);
        this._file.getImage(function (image) {
            ths.dom.children(0).css("background-image", "url(" + image.src + ")");
        });
    },
    asys: function (fn) {
        var ths = this;
        this.dom.addClass("hover");
        if (this._file) {
            this._file.upload({
                url: ths.option.url,
                name: ths.option.filename,
                dataType: "json",
                progress: function (e) {
                    ths.dom.find(".loadingbar-color").width(e.percent + "%");
                },
                error: function () {
                    fn && fn("");
                },
                success: function (data) {
                    ths.dom.removeClass("hover");
                    fn && fn(data.data);
                }
            });
        } else {
            fn && fn(this.value);
        }
    },
    setValue: function (str) {
        this.value = str;
        var str = this.option.imgurl + str;
        this.dom.children(0).css("background-image", "url(" + (str.indexOf("http://") !== -1 ? str : (basePath + str)) + ")");
    }
});
Module({
    name: "selecttree",
    extend: "@.field",
    template: module.getTemplate("@formtemplate", "selecttree"),
    option: {
        url: "data/menumapping.json",
        showName: "name",
        idName: "id",
        selectType: "autosingle"//auto,autosingle,simple
    },
    init: function () {
        this.render(this.option);
        this.data = [];
    },
    find_container: function (dom) {
        this.container = dom;
    },
    bind_btn: function () {
        this.dispatchEvent("form_selecttree", {
            tree: {
                url: this.option.url,
                listname: "list",
                showname: "name",
                iconname: "imgx",
                xxid: this.option.idName,
                level: 2,
                async: false,
                ischeck: true,
                isadd: false,
                isremove: false,
                ismoveup: false,
                ismovedown: false,
                isedit: false,
                tools: [],
                selectType: this.option.selectType,
                value: this.ids
            }
        });
    },
    setSelectData: function (data) {
        if (data) {
            this.data = [];
            this.container.empty();
            if (data.length > 0) {
                for (var i in data) {
                    this.data.push(data[i]);
                    $("<div class='selecttree-cell'>" + data[i][this.option.showName] + "</div>").appendTo(this.container);
                }
            } else {
                this.data = [];
                this.container.html("<div class='select-desc'>点击选择数据</div>");
            }
            this.check();
        }
    },
    setValue: function (data) {
        var m = "";
        for (var i in data) {
            m += data[i][this.option.idName] + ",";
        }
        this.ids = m.length > 0 ? m.substring(0, m.length - 1) : "";
        this.setSelectData(data);
    },
    getValue: function () {
        var t = "";
        for (var i in this.data) {
            var b = this.data[i][this.option.idName];
            if (b) {
                t += b + ",";
            }
        }
        return t.length > 0 ? t.substring(0, t.length - 1) : "";
    },
    showTip: function (mes) {
        if (this.dom.find(".input-alert").length === 0) {
            $("<div class='input-alert'><i class='fa fa-exclamation-circle'></i> " + mes + "</div>").appendTo(this.dom);
        }
    },
    hideTip: function () {
        this.dom.find(".input-alert").remove();
    },
    check: function () {
        if (this.option.required) {
            if (this.getValue() === "") {
                this.showTip("此信息为必填项！");
                return false;
            }
        }
        return true;
    }
});
Module({
    name: "selecttable",
    extend: "@.selecttree",
    option: {
        tableoption: "admin.option.frontuser.frontuser"
    },
    bind_btn: function () {
        this.dispatchEvent("form_selecttable", this.option.tableoption);
    }
});
//form
Module({
    name: "staticform",
    extend: "@.baseform"
});
Module({
    name: "simpleform",
    className: "simpleform",
    extend: "@.baseform",
    layout: module.getTemplate("@formtemplate", "simpleform"),
    init: function () {
        this.setValues(this.parameters);
    },
    onbeforesubmit: function (data) {
        var t = this.dom.parent();
        if (t.length > 0) {
            t.scrollingTop(0);
        }
        if (this.dom.find(".form-mask").length === 0)
            this.mask = $("<div class='form-mask'><div class='form-mask-loading'><i class='fa fa-refresh fa-spin'></i></div><div class='form-mask-mes'>Loading...</div></div>").insertBefore(this.getChildAt(0).dom);
    },
    onsubmitback: function () {
        var ths = this;
        this.mask.html("<div class='form-mask-loading'><i class='fa fa-check'></i></div><div class='form-mask-mes'>成功</div>");
        setTimeout(function () {
            ths.dom && ths.dom.find(".form-mask").remove();
        }, 2000);
    },
    onsubmiterror: function (e) {
        var ths = this;
        var msg = e.msg || "失败";
        this.mask.html("<div class='form-mask-loading'><i class='fa fa-times'></i></div><div class='form-mask-mes'>" + msg + "</div>");
        setTimeout(function () {
            ths.dom && ths.dom.find(".form-mask").remove();
        }, 2000);
    },
    onneterror: function () {
        this.mask.html("<div class='form-mask-loading'><i class='fa fa-times'></i></div><div class='form-mask-mes'>网络异常</div>");
    }
});
Module({
    name: "listform",
    className: "listform",
    extend: "@.baseform",
    layout: module.getTemplate("@formtemplate", "listform"),
    init: function () {
        this.setValues(this.parameters);
    },
    find_tips: function (dom) {
        this.tips = dom;
    },
    onbeforesubmit: function (data) {
        this.dom.addClass("checked");
        this.tips.html("<i class='fa fa-refresh fa-spin'></i> loading...");
    },
    onsubmitback: function () {
        var ths = this;
        this.tips.html("<i class='fa fa-check'></i> 处理成功");
        this.dispatchEvent("listformend");
        setTimeout(function () {
            if (ths.dom)
                ths.dom.removeClass("checked");
        }, 2000);
    },
    onsubmiterror: function (e) {
        var ths = this;
        var msg = e.msg || "处理失败";
        this.tips.html("<i class='fa fa-times'></i>" + msg);
        setTimeout(function () {
            if (ths.dom)
                ths.dom.removeClass("checked");
        }, 2000);
    },
    onneterror: function () {
        var ths = this;
        this.tips.html("<i class='fa fa-times'></i> 网络异常");
        setTimeout(function () {
            if (ths.dom)
                ths.dom.removeClass("checked");
        }, 2000);
    }
});
Module({
    name: "singleform",
    extend: "@.baseform",
    className: "singleform",
    option: {
        btns: [{action: "submit", name: "submit", icon: "fa fa-times"}]
    },
    layout: module.getTemplate("@formtemplate", "singleform"),
    init: function () {
    },
    btn_submit: function () {
        this.submit();
    },
    onbeforesubmit: function (data) {
        this.dom.toastlite().setStart();
    },
    onsubmitback: function () {
        this.dom.toastlite().setSuccess();
    },
    onsubmiterror: function () {
        this.dom.toastlite().setDataError();
    },
    onneterror: function () {
        this.dom.toastlite().setNetError();
    }
});
Module({
    name: "gridform",
    extend: "@.baseform",
    option: {
        cols: 6
    },
    layout: module.getTemplate("@formtemplate", "gridform"),
    init: function () {
        this.setValues(this.parameters);
    }
});
Module({
    name: "freeform",
    extend: "@.baseform",
    option: {
        btns: []
    },
    layout: module.getTemplate("@formtemplate", "freeform"),
    init: function () {
        this.setValues(this.parameters);
        this.dom.find(".btn").each(function () {
            $(this).click(function () {
                var type = $(this).attr("type");
                ths.dispatchEvent("freeform_" + type, ths.getValues());
            });
        });
    },
    onbeforeinit: function (a) {
        
    },
    onsetlayout: function (layout) {
        if (this.option.btns.length > 0) {
            var t = "<div style='position:absolute;left:0;top:0;right:0;bottom:50px;overflow:auto;padding:10px;'>" +
                    layout +
                    "</div>" +
                    "<div style='position:absolute;left:0;right:0;bottom:0;padding:10px 10px 0 10px;border-top:1px solid #D7D7D7;'>" +
                    "<div class='btn-group'>" +
                    "<%for(var i in data.option.btns){%>" +
                    "<div class='btn' type='<%=data.option.btns[i].type;%>'><%=data.option.btns[i].name;%></div>" +
                    "<%}%>" +
                    "</div>" +
                    "</div>";
            return t;
        } else {
            return layout;
        }
    },
    ondomready: function (a) {
        
        var id = this.getId();
        var ths = this;
        this.dom.find("div[viewid]").each(function () {
            var num = $(this).attr("viewid");
            var data = ths.option.fields[num];
            $(this).attr("view-" + id, data._type);
        });
    },
    onoption: function (option, view, viewid) {
        return this.option.fields[viewid];
    },
    event_freeform_submit: function (e) {
        if (this.check()) {
            this.submit();
        }
        e.stop();
    },
    event_freeform_reset: function (e) {
        this.reset();
        e.stop();
    }
});
Module({
    name: "treeselect",
    extend: ["@tree.treeselect", "@.fieldgroup"],
    init: function (option) {
        this.option.ischeck = true;
        this.current = null;
        this.build(null, function () {
            this.setValue(this.option.value);
        });
    }
});
Module({
    name: "imagesuploaderasys",
    className: "imagesuploaderasys",
    extend: "@.asysfield",
    option: {
        url: basePath + "task/saveAttach",
        filename: "file",
        imgurl: "",
        hiddenremoveadd: false
    },
    template: module.getTemplate("@formtemplate", "imagesuploaderasys"),
    init: function () {
        this.files = [];
        this.result = [];
        this.render(this.option);
    },
    setFile: function (files) {
        var ths = this;
        if ($.is.isString(files)) {
            try {
                files = window.JSON.parse(files);
            } catch (e) {
                file = [];
            }
        }
        for (var i in files) {
            var str = "<div class='imagesuploader-image' rid='" + this.result.length + "'>" +
                    "<div class='imagesuploader-image-bg' style='background-image:url(" + ths.option.imgurl + files[i] + ")'></div>" +
                    "<div class='imageuploader-remove' data-bind='click:remove'><i class='fa fa-times'></i></div>" +
                    "<div class='imageuploader-progress'></div>" +
                    "</div>";
            $(str).insertBefore(this.dom.find(".imagesuploader-container").children(0));
            this.result.push(files[i]);
        }
        this.update();
        if (this.option.hiddenremoveadd) {
            this.dom.find(".imageuploader-remove").hide();
            this.dom.find(".imagesuploader-filebtnplus").hide();
        }
    },
    getValue: function () {
        
        return this.value;
    },
    bind_file: function (dom, e) {
        var ths = this;
        var file = e.target.files || e.dataTransfer.files;
        for (var m = 0; m < file.length; m++) {
            var _file = require("@file").set(file[m]), has = false;
            for (var i in this.files) {
                if (this.files[i] && this.files[i].fileName === _file.fileName()) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                (function (file) {
                    var str = "<div class='imagesuploader-image' fid='" + ths.files.length + "'>" +
                            "<div class='imagesuploader-image-bg'>loading...</div>" +
                            "<div class='imageuploader-remove' data-bind='click:remove'><i class='fa fa-times'></i></div>" +
                            "<div class='imageuploader-progress'></div>" +
                            "</div>";
                    var p = $(str).insertBefore(ths.dom.find(".imagesuploader-container").children(0));
                    file.getImage(function (image) {
                        p.find(".imagesuploader-image-bg").css("background-image", "url(" + image.src + ")").empty();
                        file._dom = p;
                        ths.update();
                    });
                })(_file);
                this.files.push(_file);
            }
        }
    },
    bind_remove: function (dom) {
        if (dom.parent().attr("fid")) {
            this.files[dom.parent().attr("fid")] = null;
        }
        if (dom.parent().attr("rid")) {
            this.result[dom.parent().attr("rid")] = null;
            this.result.splice(dom.parent().attr("rid"), 1);
        }
        dom.parent().remove();
    },
    setValue: function (data) {
        var ths = this;
        var datax = [];
        if (data.length > 0)
            datax = data.split(",");
        if (datax.length > 0) {
            var adata = [];
            for (var i in datax) {
                adata.push(datax[i]);
            }
            this.setFile(adata);
        }
    },
    asys: function (fn) {
        var ths = this, total = 0;
        if (this.files.length > 0) {
            var tp = [];
            for (var i in this.files) {
                if (this.files[i]) {
                    tp.push(this.files[i]);
                }
            }
            for (var i in tp) {
                tp[i].upload({
                    url: this.option.url,
                    name: this.option.filename,
                    dataType: "json",
                    start: function () {
                        this._dom.find(".imageuploader-remove").hide();
                    },
                    progress: function (a) {
                        this._dom.find(".imageuploader-progress").width(a.percent + "%");
                        if (a.percent === 100) {
                            this._dom.find(".imageuploader-progress").hide();
                            $("<div class='imageuploader-loadinger'><div><i class='fa fa-spin fa-spinner'></i></div></div>").appendTo(this._dom);
                        }
                    },
                    success: function (data) {
                        
                        total += 1;
                        this._dom.attr("rid", ths.result.length);
                        this._dom.removeAttr("fid");
                        
                        this._dom.find(".imageuploader-loadinger").children(0).html("<i class='fa fa-check'></i>");
                        ths.result.push(data.data);
                        for (var i in ths.files) {
                            if (ths.files[i] === this) {
                                ths.files[i] = null;
                            }
                        }
                        if (total === tp.length) {
                            var t = [];
                            for (var i in ths.result) {
                                if (ths.result[i]) {
                                    t.push(ths.result[i]);
                                }
                            }
                            ths.files.length = 0;
                            fn && fn(t.join(","));
                        }
                    },
                    error: function () {
                    }
                });
            }
        } else {
            fn && fn(this.result.join(","));
        }
    }
});



$.Module({
    name: "dynamiclist",
    extend: "@.fieldgroup",
    option: {
        name: "xxx",
        dataurl: "",
        deleteurl: "",
        isFirst: false,
        keyneed: "id",
        required: true,
        width: "1000px",
//        form:{
        fields: [
            {type: "@.text", label: "xxxx", name: "xx"},
            {type: "@.text", label: "xxxx", name: "xx"},
            {type: "@.text", label: "xxxx", name: "xx"}
        ]
//        }
    },
    layout: "<div class='btn-group'>" +
            "<div class='btn add'><i class='fa fa-plus'></i></div>" +
            "</div>" +
            "<div class='xlabel'><%=data.option.label;%></div>" +
            "<div class='rows'>" +
            "</div>",
    init: function (option) {
        var ths = this;
        this.idd = 0;
        this.dom.width(option.width);
        this.dom.find(".add").click(function () {
            ths.addCell();
        });
        this.dom.find(".closebox").click(function () {
            $(this).parent().parent().find(".row-cell").each(function () {
                $(this).addClass("close");
            });
        });
        this.reduct();
        if (option.isFirst) {
            ths.addCell();
        }
    },
    addCell: function (data, isnew) {
        var ths = this;
        ths.idd++;
        var xxx = "<div class='row-cell horizion" + (isnew ? " old" : "") + "'>" +
                "<div class='tools '>" +
//        	"<%for(var i in data.option.fields){%>" +
//            "<%=module(data.option.fields[i].type,'','t'+i);%>" +
//            "<%}%>" +
                "物品名称：<input type='text' value=''style='width: 40%;' class='incache'>" +
                "个数：<input type='text' value=''style='width: 40%;' class='incache'>" +
                "<div class='btn removex'><i class='fa fa-times'></i></div>" +
                "</div>" +
                "</div>";
        var k = ths.dom.find(".rows").append(xxx);
//        var k=ths.addChild(ths.dom.find(".rows"), 
//                    "<div class='row-cell horizion"+(isnew?" old":"")+"'>"+
//                        "<div class='inner' view-<%=data.id;%>='listform' viewid='cell<%=data.data;%>'></div>" +
//                        "<div class='btn-group tools'>"+
//                            "<div class='btn removex' num='<%=data.data;%>'><i class='fa fa-times'></i></div>"+
//                            "<div class='btn addx'><i class='fa fa-plus'></i></div>"+
//                            "<div class='btn xclosebox'><i class='fa fa-caret-up'></i></div>"+
//                        "</div>"+
//                    "</div>",
//            {listform:ths.option.form},ths.idd,null,data);
        k.find(".tools .removex").click(function () {
            var parent = $(this).parent().parent();
            parent.remove();
        });
    },
    reduct: function () {
        if (this.option.dataurl && this.option.dataurl !== "") {
            var ths = this;
            var result = {};
            if (this.option.keyneed) {
                var keys = ths.option.keyneed.split(",");
                for (var i in keys) {
                    result[keys[i]] = ths.parentView.parameters[keys[i]] || "";
                }
            } else {
                result = ths.parentView.parameters;
            }
            this.getData({
                url: this.option.dataurl,
                data: result,
                back: function (e) {
                    for (var i in e) {
                        ths.addCell(e[i], true);
                    }
                }
            });
        }
    },
    reset: function () {
        this.dom.find(".rows").empty();
        this.reduct();
    },
    getValue: function () {
        var a = [];
        
        this.viewEach(function () {
            a.push(this.getValues());
        });
        return [{
                name: this.option.name,
                value: window.JSON.stringify(a)
            }];
    }
});
Module({
    name: "fileupload",
    className: "fileupload",
    extend: "@.asysfield",
    option: {
        url: basePath + "file/upload",
        filename: "file",
        single: true
    },
    template: module.getTemplate("@formtemplate", "fileupload"),
    init: function () {
        this.files = [];
        this.result = [];
        this.render(this.option);
    },
    find_files: function (dom) {
        this._files = dom;
    },
    find_removeall: function (dom) {
        this._removeall = dom;
    },
    bind_file: function (dom, e) {
        var file = e.target.files || e.dataTransfer.files;
        for (var m = 0; m < file.length; m++) {
            var _file = require("@file").set(file[m]), has = false;
            for (var i in this.files) {
                if (this.files[i] && this.files[i].fileName === _file.fileName()) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                if (!this.option.single) {
                    _file._id = this.files.length;
                    _file._dom = this._files.append($.template(module.getTemplate("@formtemplate", "fileuploadrow")).render({
                        filename: _file.fileName(),
                        fid: this.files.length
                    }));
                    this.files.push(_file);
                    this.dispatchEvent("uploadfileselected", _file);
                    this.update();
                } else {
                    if (this.getFileSize() <= 0) {
                        _file._id = this.files.length;
                        _file._dom = this._files.append($.template(module.getTemplate("@formtemplate", "fileuploadrow")).render({
                            filename: _file.fileName(),
                            fid: this.files.length
                        }));
                        this.files.push(_file);
                        this.dispatchEvent("uploadfileselected", _file);
                        this.update();
                    }
                }
            }
        }
    },
    bind_remove: function (dom) {
        if (!dom.hasClass("disabled")) {
            var id = dom.parent().attr("fid");
            for (var i in this.files) {
                if (this.files[i] && this.files[i]._id === id / 1) {
                    this.files[i] = null;
                    dom.parent().remove();
                }
            }
        }
    },
    bind_removeall: function () {
        this.files = [];
        this._files.empty();
    },
    getFileSize: function () {
        var r = 0;
        for (var i in this.files) {
            if (this.files[i]) {
                r++;
            }
        }
        return r;
    },
    asys: function (fn) {
        var ths = this, total = 0;
        if (this.files.length > 0) {
            var tp = [];
            for (var i in this.files) {
                if (this.files[i]) {
                    tp.push(this.files[i]);
                }
            }
            for (var i in tp) {
                this._removeall.hide();
                tp[i].upload({
                    url: this.option.url,
                    name: this.option.filename,
                    dataType: "json",
                    start: function () {
                        this._dom.find(".fileupload-file-remove").addClass("disabled").html("");
                    },
                    progress: function (a) {
                        this._dom.find(".fileupload-progress").width(a.percent + "%");
                        if (a.percent === 100) {
                            this._dom.find(".fileupload-progress").hide();
                            this._dom.find(".fileupload-file-remove").html("<i class='fa fa-refresh fa-spin'></i>");
                        }
                    },
                    success: function (data) {
                        total += 1;
                        this._dom.find(".fileupload-file-remove").html("<i class='fa fa-check'></i>");
                        ths.result.push(data.data);
                        for (var i in ths.files) {
                            if (ths.files[i] === this) {
                                ths.files[i] = null;
                            }
                        }
                        if (total === tp.length) {
                            var t = [];
                            for (var i in ths.result) {
                                if (ths.result[i]) {
                                    t.push(ths.result[i]);
                                }
                            }
                            ths.files.length = 0;
                            fn && fn(t.join(","));
                        }
                    },
                    error: function () {
                    }
                });
            }
        } else {
            fn && fn(this.result.join(","));
        }
    },
    check:function(){
        if(this.getFileSize()===0&&this._files.children().length===0){
            this.showTip("请选择文件");
            return false;
        }
        return true;
    }
});