/*!
 * @packet opensite.mobi.form;
 * @require opensite.mobi.util.toast;
 * @require opensite.mobi.util.file;
 * @require opensite.mobi.util.base64;
 * @css opensite.mobi.style.form;
 * @template opensite.mobi.template.formtemplate;
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
    onoption: function (option, view, viewid) {
        var name = viewid.substring(1, viewid.length);
        return this.option.fields[name];
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
        disabled: false,
        desc: "",
        hook: null,
        encode:false,
        placeholder:"",
        focus:false
    },
    template: module.getTemplate("@formtemplate", "text"),
    init: function (option) {
        this.value = option.value;
        this.render(option);
        if (option.isflex) {
            this.dom.addClass("flex").width("100%");
        }
        var input=this.finders.get("input");
        input.get(0).disabled = option.disabled;
        if (!option.ishow) {
            this.dom.hide();
        }
        if(this.option.focus){
            input.get(0).focus();
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
        phone: [/(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^14[0-9]{9}$)|(^17[0-9]{9}$)|(^18[0-9]{9}$)|^((\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/, "请输入正确的电话号码"],
        en: [/^[A-Za-z]+$/, "26个英文字母组成的字符串"],
        enupper: [/^[A-Z]+$/, "26个大写英文字母组成的字符串"],
        enlower: [/^[a-z]+$/, "26个小写英文字母组成的字符串"],
        words: [/^[A-Za-z0-9]+$/, "数字和26个英文字母组成的字符串"],
        simplewords: [/^\w+$/, "数字、26个英文字母或者下划线"],
        username: [/^[\一\?-Za-z0-9-_]*$/, "中英文，数字，下划线，减号"],
        password: [/^[a-zA-Z]\w{5,17}$/, "以字母开头，长度在6-18之间，只能包含字符、数字和下划线"],
        nospecial: [/^([\u4e00-\u9fa5-a-zA-Z0-9]+)$/, "不能输入特殊字符！"],
        any: [/^.*$/, ""]
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
        var result = false;
        if (!this.customCheck) {
            result = this.checkLength();
            if (!result) {
                console.log(result);
                this.showTip("长度应该大于" + this.option.min + "小于" + this.option.max);
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
            result = this.checkRegular();
            if (!result) {
                this.showTip(this.reg[this.option.reg][1] || "格式不正确");
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
        var result = this.checkLength();
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
        var value = this.value;
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
        if(reg===""){
             return true;
        }
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
    getValue:function(){
        if(this.option.encode){
            return require("@base64").encode(this.input.val());
        }else{
            return this.input.val();
        }
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
    getValue:function(){
        return this.option.value;
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
        paraname: "12",
        isload: false,
        next: "",
        keyname: "name",
        valuename: "value",
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
                    ths.delegateEvent();
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
                        ths.delegateEvent();
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
    name:"textarea",
    extend:"@.text",
    template:module.getTemplate("@formtemplate","textarea"),
    init:function(){
        this.superClass("init",this.option);
    },
    bind_keyup: function (dom) {
        this.value = dom.text();
        this.check();
    },
    setValue: function (a) {
        if (this.option.hook) {
            this.value = this.option.hook(a);
            this.input.text(this.value);
        } else {
            this.value = a;
            this.input.text(a);
        }
    },
    getValue:function(){
        if(this.option.encode){
            return require("@base64").encode(this.input.text());
        }else{
            return this.input.text();
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
        fields: [
            {type: "@.text", label: "type", name: "type"},
            {type: "@.text", label: "label", name: "label"},
            {type: "@.text", label: "name", name: "name"}
        ]
    },
    layout: module.getTemplate("@formtemplate", "extendform"),
    init: function () {
    },
    find_add: function (dom) {
        dom.button(function(e,ths){
            var t = $(module.getTemplate("@formtemplate", "extendformcell")).appendTo(ths.dom.find(".extendform-con"));
            ths.addChild({
                type: "@.simpleform",
                option: {
                    fields: ths.option.fields
                },
                container: t.find(".extendform-form")
            });
        },this);
    },
    find_remove: function (dom) {
        dom.button(function(e,ths){
            if(!$(this).hasClass("check")){
                var thss=$(this);
                $(this).html("<i class='fa fa-circle-cross'></i>").addClass("check");
                setTimeout(function(){
                    if(thss.nodes&&thss.nodes.length>0){
                        thss.html("<i class='fa fa-cross'></i>").removeClass("check");
                    }
                },2000);
            }else{
                $(this).parent(".extendform-cell").remove();
            }
        },this);
    },
    asys: function (fn) {
        var t = [], p = this.children.length, ths = this;
        if(this.children.length>0){
            this.childEach(function () {
                this.getValues().done(function (a) {
                    t.push(a);
                    p--;
                    if (p === 0) {
                        fn && fn(t);
                    }
                });
            });
        }else{
            fn && fn(t);
        }
    },
    getValue: function () {
        var t = [], p = this.children.length;
        var promise = $.promise();
        if(this.children.length>0){
            this.childEach(function () {
                this.getValues().done(function (a) {
                    t.push(a);
                    p--;
                    if (p === 0) {
                        promise.resolve(window.JSON.stringify(t));
                    }
                });
            });
        }else{
            promise.resolve(t);
        }
        return promise;
    },
    setValue: function (val) {
        this.dom.find(".extendform-con").empty();
        if ($.is.isString(val)) {
            val = window.JSON.parse(val);
        }
        for (var i in val) {
            var t = $(module.getTemplate("@formtemplate", "extendformcell")).appendTo(this.dom.find(".extendform-con"));
            this.addChild({
                type: "@.simpleform",
                option: {
                    fields: this.option.fields
                },
                parameters: val[i],
                container: t.find(".extendform-form")
            })
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
        url: basePath + "file/upload",
        filename: "file"
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
                    fn && fn("file/view?fid=" + data.data);
                }
            });
        } else {
            fn && fn(this.value);
        }
    },
    setValue: function (str) {
        this.value = str;
        this.dom.children(0).css("background-image", "url(" + (str.indexOf("http") === -1 ? (basePath + str) : str) + ")");
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
        this.mask.html("<div class='form-mask-loading'><i class='fa fa-check'></i></div><div class='form-mask-mes'>success</div>");
        setTimeout(function () {
            ths.dom && ths.dom.find(".form-mask").remove();
        }, 2000);
    },
    onsubmiterror: function () {
        var ths = this;
        this.mask.html("<div class='form-mask-loading'><i class='fa fa-times'></i></div><div class='form-mask-mes'>error</div>");
        setTimeout(function () {
            ths.dom && ths.dom.find(".form-mask").remove();
        }, 2000);
    },
    onneterror: function () {
        this.mask.html("<div class='form-mask-loading'><i class='fa fa-times'></i></div><div class='form-mask-mes'>net error</div>");
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
        this.tips.html("<i class='fa fa-check'></i> deal ok");
        setTimeout(function () {
            if (ths.dom)
                ths.dom.removeClass("checked");
        }, 2000);
    },
    onsubmiterror: function () {
        var ths = this;
        this.tips.html("<i class='fa fa-times'></i> deal error");
        setTimeout(function () {
            if (ths.dom)
                ths.dom.removeClass("checked");
        }, 2000);
    },
    onneterror: function () {
        var ths = this;
        this.tips.html("<i class='fa fa-times'></i> deal net error");
        setTimeout(function () {
            if (ths.dom)
                ths.dom.removeClass("checked");
        }, 2000);
    }
});
Module({
    name: "martform",
    extend: "@.baseform",
    className: "martform",
    layout: module.getTemplate("@formtemplate", "martform"),
    btn_submit: function () {
        this.submit();
    },
    onbeforesubmit: function (data) {
        this.dom.toastlite().setStart();
    },
    onsubmitback: function (e) {
        this.dom.toastlite().setSuccess("处理成功");
    },
    onsubmiterror: function (e) {
        this.dom.toastlite().setDataError(e.msg);
    },
    onneterror: function () {
        this.dom.toastlite().setNetError();
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
        console.log(a);
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
        console.log(a);
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
    name: "imagesuploaderasys",
    className: "imagesuploaderasys",
    extend: "@.asysfield",
    option: {
        url: basePath + "task/saveAttach",
        filename: "file"
    },
    template: module.getTemplate("@formtemplate", "imagesuploaderasys"),
    init: function () {
        this.files = [];
        this.result = [];
        this.render(this.option);
    },
    setFile: function (files) {
        files = window.JSON.parse(files);
        for (var i in files) {
            var str = "<div class='imagesuploader-image' rid='" + this.result.length + "'>" +
                    "<div class='imagesuploader-image-bg' style='background-image:url(" + files[i] + ")'></div>" +
                    "<div class='imageuploader-remove' data-bind='click:remove'><i class='fa fa-times'></i></div>" +
                    "<div class='imageuploader-progress'></div>" +
                    "</div>";
            $(str).insertBefore(this.dom.find(".imagesuploader-container").children(0));
            this.result.push(files[i]);
        }
        this.delegateEvent();
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
                        ths.delegateEvent();
                    });
                })(_file);
                this.files.push(_file);
            }
        }
    },
    bind_remove: function (dom) {
        if (dom.parent().attr("fid")) {
            this.files.splice(dom.parent().attr("fid"), 1);
        }
        if (dom.parent().attr("rid")) {
            this.result.splice(dom.parent().attr("rid"), 1);
        }
        dom.parent().remove();
    },
    setValue: function (data) {
        this.setFile(data);
    },
    asys: function (fn) {
        var ths = this;
        if (this.files.length > 0) {
            for (var i in this.files) {
                this.files[i].upload({
                    url: this.option.url,
                    name: this.option.filename,
                    dataType: "json",
                    start: function () {
                        this._dom.find(".imageuploader-remove").hide();
                    },
                    progress: function (a) {
                        this._dom.find(".imageuploader-progress").width(a.percent + "%");
                    },
                    success: function (data) {
                        console.log(data);
                        this._dom.attr("rid", ths.result.length);
                        this._dom.removeAttr("fid");
                        this._dom.find(".imageuploader-progress").width(0);
                        this._dom.find(".imageuploader-remove").show();
                        ths.result.push(data.data);
                        for (var i in ths.files) {
                            if (ths.files[i] === this) {
                                ths.files.splice(i, 1);
                            }
                        }
                        fn && fn(ths.result);
                    },
                    error: function () {
                    }
                });
            }
        } else {
            fn && fn(this.result);
        }
    }
});

Module({
    name: "stars",
    extend: "@.field",
    className: "stars",
    template: module.getTemplate("@formtemplate", "stars"),
    init: function () {
        this.render();
    },
    find_star: function (dom) {
        if (!this.stars) {
            this.stars = [];
        }
        this.stars.push(dom);
        var ths = this;
        dom.button(function () {
            var isn = false;
            for (var i = 0; i < ths.stars.length; i++) {
                if (ths.stars[i].get(0) !== $(this).get(0)) {
                    if (isn === false) {
                        ths.stars[i].addClass("select");
                    } else {
                        ths.stars[i].removeClass("select");
                    }
                } else {
                    isn = true;
                    ths.stars[i].addClass("select");
                }
            }
        });
    },
    getValue: function () {
        var r = 0;
        for (var i = 0; i < this.stars.length; i++) {
            if (this.stars[i].hasClass("select")) {
                r++;
            }
        }
        return r;
    },
    setValue: function (num) {
        if ($.is.isNumber(num) && num <= 5 && num > 0) {
            for (var i = 0; i < num; i++) {
                this.stars[i].addClass("select");
            }
        }
    },
    reset: function () {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].removeClass("select");
        }
        return this;
    },
    check: function () {
        return true;
    }
});

Module({
    name: "duanxin",
    extend: "@.text",
    className: "duanxin",
    template: module.getTemplate("@formtemplate", "duanxin"),
    option: {
        url: basePath + "data/dataok.json",
        reg:"phone",
        required:true
    },
    init: function () {
        this.option.reg = "phone";
        this.option.required = true;
        this.render(this.option);
    },
    find_get: function (dom) {
        dom.button(function (e, scope) {
            if (scope.check()) {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                    var q = $(this);
                    scope.postData({
                        url: scope.option.url,
                        back: function () {
                            $.toast("验证码已成功发送到手机");
                            q.html("60s");
                            for (var i = 1; i <= 60; i++) {
                                setTimeout(function () {
                                    var v = parseInt(q.html());
                                    q.html((v - 1) + "s");
                                    if (v === 1) {
                                        q.removeClass("active").html("重新获取");
                                    }
                                }, i * 1000);
                            }
                        },
                        dataerror: function () {
                            $.toast("网络错误，请稍后重试");
                        },
                        neterror: function () {
                            $.toast("网络错误，稍后重试");
                        }
                    });
                }
            }
        }, this);
    }
});
Module({
    name:"picode",
    extend:"@.text",
    className:"picode",
    option:{
        url:basePath+"user/picCode"
    },
    template:module.getTemplate("@formtemplate","picode"),
    find_pic:function(dom){
        dom.button(function(e,scope){
            $(this).children(0).attr("src",scope.option.url+"?t="+(new Date().getTime()));
        },this);
    }
});
Module({
    name:"codebtn",
    extend:"view",
    className:"codebtn",
    option:{
        url:basePath+"data/dataok.json"
    },
    template:module.getTemplate("@formtemplate","codebtn"),
    init:function(){
        this.render();
    },
    check:function(){
        return true;
    },
    setData:function(data){
        this._data=data;
        return this;
    },
    find_get:function(dom){
        dom.button(function (e, scope) {
            var tpp=$(this);
            scope.check().done(function(){
                if (!tpp.hasClass("active")) {
                    tpp.addClass("active");
                    var q = tpp;
                    scope.postData({
                        url: scope.option.url,
                        data:scope._data,
                        back: function () {
                            $.toast("验证码已成功发送到手机");
                            q.html("60秒后重新获取");
                            for (var i = 1; i <= 60; i++) {
                                setTimeout(function () {
                                    var v = parseInt(q.html());
                                    q.html((v - 1) + "秒后重新获取");
                                    if (v === 1) {
                                        q.removeClass("active").html("重新获取");
                                    }
                                }, i * 1000);
                            }
                        },
                        dataerror: function () {
                            $.toast("网络错误，请稍后重试");
                        },
                        neterror: function () {
                            $.toast("网络错误，稍后重试");
                        }
                    });
                }
            });
        },this);
    }
});
Module({
    name:"multiselect",
    extend:"@.field",
    className:"multiselect",
    template:module.getTemplate("@formtemplate","multiselect"),
    option:{
        name: "",
        url: "",
        label: "",
        keyname: "name",
        valuename: "value",
        defaults: [],
        remoteData:[],
        value:""
    },
    init:function(option){
        this.render(this.option);
        this.value = this.option.value;
        if (option.url && option.url !== "") {
            this.loadData();
        }
    },
    find_item:function(dom){
        dom.button(function(){
            $(this).toggleClass("selected");
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
                var r=ths.value.split(",");
                for(var i in r){
                    var m=r[i];
                    ths.finders.getItems("item").forEach(function(a){
                        if(a.dom().attr("value")===m){
                            a.dom().addClass("selected");
                        }
                    });
                }
            }
        });
    },
    getValue:function(){
        var r=[];
        this.finders.getItems("item").forEach(function(a){
            if(a.dom().hasClass("selected")){
                r.push(a.dom().attr("value"));
            }
        });
        return r.join(",");
    },
    setValue: function (val) {
        this.value = val;
        this.option.value = val;
        if(r!==""&&this.finders.getItems("item")){
            var r=val.split(",");
            for(var i in r){
                this.finders.getItems("item").forEach(function(a){
                    if(a.dom().attr("value")===r[i]){
                        a.dom().addClass("selected");
                    }
                });
            }
        }
    },
    reset: function () {
        this.render(this.option);
    }
});