/*!
 * @packet admin.option.root;
 * @include admin.form;
 * @include admin.main;
 * @css admin.style.base;
 * @css admin.style.font-awesome-min;
 * @css admin.style.default;
 */
Option({
    name: "root",
    option: {
        session: basePath + "data/data.json",
        logout: basePath + "data/dataok.json",
        userinfo: basePath + "data/user.json",
        "@main.login": {
            form: {
                action: basePath + "data/dataok.json",
                fields: [
                    {type: "@form.text", label: "用户名", name: "username", required: true, value: ""},
                    {type: "@form.text", label: "密码", name: "password", required: true, inputType: "password", value: ""}
                ]
            }
        },
        "@main.mainpage": {
            menu: {
//            url: basePath+"manageUser/queryMenumapping"
                url: "data/menumapping.json"
            }
        },
        "@main.choutier": {
            inner: "@form.listform",
            label: "修改密码",
            "@form.listform": {
                action: basePath + "manageUser/updatePassword",
                fields: [
                    {type: "@form.text", label: "用户名", name: "username", disabled: true},
                    {type: "@form.text", label: "原密码", name: "oldpwd", inputType: "password"},
                    {type: "@form.text", label: "新密码", name: "newpwd", inputType: "password"},
                    {type: "@form.text", label: "确认密码", name: "confpwd", inputType: "password",
                        override: {customCheck: function () {
                                if (this.parentView.getChildAt(2).getValue() === this.getValue()) {
                                    this.hideTip();
                                    return true;
                                } else {
                                    this.showTip("两次密码输入不同");
                                    return false;
                                }
                            }}}
                ]
            },
            btns: [
                {name: "submit", icon: "fa fa-check", action: "submit"},
                {name: "close", icon: "fa fa-times", action: "close"}
            ],
            override: {
                event_submit: function (e) {
                    var ths = this;
                    var btn = e.data.btn;
                    this.getFirstChild().submit().done(function () {
                        setTimeout(function () {
                            ths.remove();
                        }, 2000);
                    });
                }
            }
        },
        override: {
            onendinit: function () {
                this.postData({
                    url: this.option.session,
                    back: function () {
                        this.dispatchEvent("loginEnd");
                    },
                    dataerror: function () {
                        this.addChild({
                            type: "@main.login"
                        });
                    }
                });
            },
            oninitimportstart: function () {
                console.log("----start");
            },
            oninitimportprogress: function (e) {
                console.log("------progress--%o", e);
            },
            oninitimportend: function () {
                console.log("-------end");
            },
            onimportstart: function (a) {
                console.log("-------->>import:%o", a.module);
            },
            onimportoptionstart: function (a) {
                console.log("-----<" + a.option);
            },
            onimportoptionend: function (a) {
                console.log("-----<" + a.option);
            },
            oninitchild: function (e) {
                console.log("-------->>%o---%o", e.id, e.type);
            },
            event_quitApp: function () {
                this.postData({
                    url: this.option.logout,
                    back: function () {
                        this.getFirstChild().remove();
                        this.addChild({
                            type: "@main.login"
                        });
                    }
                });
            },
            event_loginEnd: function () {
                if (this.children.length > 0) {
                    this.getFirstChild().remove();
                }
                this.addChild({
                    type: "@main.mainpage"
                });
            },
            event_userInfo: function () {
                this.addChild({
                    type: "@main.choutier"
                }).done(function () {
                    this.postData({
                        url: this.option.userinfo,
                        back: function (data) {
                            this.getLastChild().getFirstChild().setValues(data);
                        }
                    });
                });
            }
        }
    }
});