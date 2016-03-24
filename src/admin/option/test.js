/*!
 * @packet admin.option.test;
 * @include admin.group;
 * @include admin.form;
 * @include admin.photo;
 * @include admin.datepicker;
 */
Option({
    name: "main",
    option: {
        tree: {
            url: "data/menumapping.json",
            override: {
                event_parenttreeclick: function (e) {
                    console.log("-----tree");
                    console.log(e.data);
                }
            }
        },
        find: {
            fields: [
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"}
            ]
        },
        tableremove: {
            url: basePath + "data/dataok.json"
        },
        tableadd: {
            action: basePath + "data/dataok.json",
            width: 400,
            btns: [
                {type: "cutter", name: "cutter", icon: "fa fa-crop"},
                {type: "gallery", name: "gallery", icon: "fa fa-picture-o"},
                {type: "removeChouti", name: "close", icon: "fa fa-times"}
            ],
            fields: [
                {type: "@form.text", label: "输入框", name: "xx"},
                {type: "@form.select", label: "下拉框", name: "state",
                    defaults: [{key: "启用", value: 0}, {key: "禁用", value: 1}]},
                {type: "@datepicker.datepicker", label: "时间", name: "xx"},
                {type: "@form.selecttree", label: "选择树", name: "xx"},
                {type: "@form.selecttable", label: "列表选择", name: "xx"},
                {type: "@form.extendform", label: "二维数据", name: "xx",
                    fields: [
                        {type: "@form.text", label: "物品名称", name: "name1"},
                        {type: "@form.text", label: "个数", name: "name2"}
                    ]}
            ]
        },
        tableedit: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.text", label: "输入框", name: "xx"},
                {type: "@form.select", label: "下拉框", name: "state",
                    defaults: [{key: "启用", value: 0}, {key: "禁用", value: 1}]},
                {type: "@datepicker.datepicker", label: "时间", name: "xx"},
                {type: "@form.selecttree", label: "选择树", name: "xx"},
                {type: "@form.selecttable", label: "列表选择", name: "xx"},
                {type: "@form.extendform", label: "二维数据", name: "xx",
                    fields: [
                        {type: "@form.text", label: "物品名称", name: "name1"},
                        {type: "@form.text", label: "个数", name: "name2"}
                    ]}
            ]
        },
        table: {
            dataurl: "data/table.json",
            cols: [
                {name: "keywords", key: 'keywords', ishow: true, width: 200},
                {name: "goods_no", key: 'goods_no', ishow: true, width: 200},
                {name: "状态", key: 'state', ishow: true, width: 200, center: true,
                    hook: function (val) {
                        if (val == "0") {
                            return "启用";
                        } else {
                            return "禁用";
                        }
                    }},
                {name: "content", key: 'bName', ishow: true, width: 200}
            ],
            tool: ["search", "refresh", "deletemulti", "add"],
            override: {
                event_parenttreeclick: function (e) {
                    console.log("-----table");
                    console.log(e.data);
                }
            }
        },
        override: {
            event_popup: function () {
                this.addChild({
                    type: "@group.popup"
                });
            },
            event_popup2: function () {
                this.addChild({
                    type: "@group.popupgroup",
                    option: {
                        type: "@group.tablegroup",
                        option: "admin.option.test.main",
                        width: 800
                    }
                });
            },
            event_parenttreeclick: function (e) {
                console.log(e.data);
            },
            event_cutter: function (e) {
                this.add({
                    width: 500,
                    title: "photocutter",
                    type: "@photo.photocutter"
                });
                e.stopPropagation();
            },
            event_gallery: function (e) {
                this.add({
                    width: 800,
                    title: "gallery",
                    type: "@photo.gallery",
                    option: {
                        url: "data/gallery_1.json"
                    }
                });
                e.stopPropagation();
            }
        }
    }
});


Option({
    name: "quickmenu",
    option: {
        mapping: {
            0: "admin.main.quicklink",
            1: "admin.main.quicklink",
            8: "admin.main.quicklink",
            14: "admin.main.quicklink",
            18: "admin.main.quicklink",
            23: "admin.main.quicklink",
            28: "admin.main.quicklink"
        }
    }
});
Option({
    name: "site",
    option: {
        mapping: {name: "kk"}
    }
});
Option({
    name: "site-root",
    option: {
        override: {
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
            oninitchild: function (e) {
                console.log("-------->>%o---%o", e.id, e.type);
            }
        }
    }
});
Option({
    name: "gallery",
    option: {
        url: "data/gallery_1.json"
    }
});

Option({
    name: "table2",
    option: {
        treeadd: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.selecttree", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"}
            ]
        },
        treeedit: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.selecttree", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"}
            ]
        },
        find: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.selecttree", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"}
            ]
        },
        tableedit: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.selecttree", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"}
            ]
        },
        tableadd: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.selecttree", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "xxxx", name: "xx"}
            ]
        },
        tree: {
            override: {
                event_parenttreeclick: function (e) {
                    console.log(e.data);
                },
                event_treeclick: function (e) {
                    e.stopPropagation();
                }
            }
        },
        table: {
            dataurl: "data/table.json",
            cols: [
                {name: "keywords", key: 'keywords', ishow: true, width: 200},
                {name: "goods_no", key: 'goods_no', ishow: true, width: 200},
                {name: "状态", key: 'state', ishow: true, width: 200, center: true},
                {name: "content", key: 'bName', ishow: true, width: 200}
            ],
            tool: ["search", "refresh", "deletemulti", "add"]
        }
    }
});
Option({
    name: "tab",
    option: {
        tabs: [
            {name: "tab1", inner: "@group.tablegroup", option: "admin.option.test.main"},
            {name: "tab2", inner: "@group.treetablegroup", option: "admin.option.test.table2"}
        ]
    }
});