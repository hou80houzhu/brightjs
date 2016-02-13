/*!
 * @packet admin.option.user; 
 * @include admin.form;
 * @include admin.group;
 */
Option({
    name: "table",
    option: {
        find: {
            colnum: 2,
            fields: [
                {type: "@form.text", label: "username", name: "username"}
            ]
        },
        tableadd: {
            action: basePath + "user/adduser",
            fields: [
                {type: "@form.text", label: "username", name: "username"},
                {type: "@form.text", label: "username", name: "username"}
            ]
        },
        tableremove: {
            url: basePath + "user/removeusers"
        },
        table: {
            dataurl: basePath + "user/userlist",
            checkbox: true,
            num: true,
            tool: ["search", "refresh", "deletemulti", "add"],
            deal: ["delete"],
            rownum: [30, 50, 100, 150],
            cols: [
                {name: "username", key: 'username', ishow: true, width: 200, center: true},
                {name: "role", key: 'role', ishow: true, width: 200, center: true}
            ]
        },
        override: {
            event_table_choutier: function (e) {
                console.log("=====>>");
            }
        }
    }
});


Option({
    name: "user",
    option: {
        find: {
            colnum: 2,
            fields: [
                {type: "@form.text", label: "用户名", name: "username"}
            ]
        },
        tableadd: {
            action: "manageUser/saveManageUser",
            fields: [
//            {type: "@form.imageupload", label: "name", name: "image", url: basePath + "news/newsimage", filename: "file"},
                {type: "@form.text", label: "用户名", name: "username"},
                {type: "@form.text", label: "密码", name: "password", inputType: "password"},
                {type: "@form.text", label: "确认密码", name: "password1", inputType: "password",
                    override: {
                        customCheck: function () {
                            var kouling = this.parentView.getFieldByName("password").getValue();
                            var querenkl = this.getValue();
                            if (kouling !== "" && querenkl !== "") {
                                if (kouling != querenkl) {
                                    this.showTip("两次密码不一致!请重新输入");
                                    return false;
                                } else {
                                    this.hideTip();
                                    return true
                                }
                            } else {
                                this.hideTip();
                                return true;
                            }
                        }
                    }},
                {type: "@form.select", label: "状态", name: "state", defaults: [{key: "启用", value: 0}, {key: "禁用", value: 1}]}
            ], override: {
                customCheck: function () {

                    var kouling = this.getFieldByName("password").getValue();
                    var querenkl = this.getFieldByName("password1").getValue();
                    if (kouling !== "" && querenkl !== "") {
                        if (kouling != querenkl) {
                            this.getFieldByName("password1").showTip("两次密码不一致!请重新输入");
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
            }
        },
        tableedit: {
            action: "manageUser/updateManageUser",
            fields: [
                {type: "@form.hidetext", label: "id", name: "id"},
                {type: "@form.text", label: "用户名", name: "username"},
                {type: "@form.select", label: "状态", name: "state", defaults: [{key: "启用", value: 0}, {key: "禁用", value: 1}]}
            ]
        },
        tableremove: {
            url: "manageUser/deleteManageUser"
        },
        table: {
            dataurl: "manageUser/queryManageUser",
            checkbox: true,
            num: true,
            tool: ["search", "refresh", "deletemulti", "add"],
            deal: ["edit", "delete"],
            rownum: [30, 50, 100, 150],
            cols: [
                {name: "用户名", key: 'username', ishow: true, width: 300, center: true},
                {name: "状态", key: 'state', ishow: true, width: 300, center: true,
                    hook: function (val) {
                        if (val == "0") {
                            return "启用";
                        } else {
                            return "禁用";
                        }
                    }
                }
            ]
        },
        override: {
        }
    }
});