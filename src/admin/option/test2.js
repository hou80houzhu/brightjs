/*!
 * @packet admin.option.test2;
 * @include admin.group;
 * @include admin.form;
 * @include admin.photo;
 * @include admin.datepicker;
 */
Option({
    name: "table1",
    option: {
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
                {type: "@form.text", label: "客户代码", name: "xx"},
                {type: "@form.text", label: "客户名称", name: "xx"},
                {type: "@form.text", label: "检查机构", name: "xx"},
                {type: "@datepicker.datepicker", label: "检查日期", name: "xx"},
                {type: "@form.text", label: "检查人", name: "xx"},
                {type: "@form.text", label: "检查岗位", name: "xx"},
                {type: "@form.text", label: "对方联系人", name: "xx"},
                {type: "@form.text", label: "对方联系电话", name: "xx"},
                {type: "@datepicker.datepicker", label: "xxxx", name: "xx"},
                {type: "@form.text", label: "检查内容", inputType: "textarea", name: "xx"},
                {type: "@form.text", label: "存在问题", inputType: "textarea", name: "xx"},
                {type: "@form.text", label: "需要说明问题", inputType: "textarea", name: "xx"},
                {type: "@form.text", label: "对方客户状况的评价", inputType: "textarea", name: "xx"},
                {type: "@form.text", label: "建议及措施", inputType: "textarea", name: "xx"},
                {type: "@form.select", label: "状态", name: "state",
                    defaults: [{key: "无影响", value: 0}, {key: "有影响", value: 1}]},
            ]
        },
        table: {
            dataurl: "data/table1.json",
            cols: [
                {name: "机构名称", key: 'xx1', ishow: true, width: 600, center: true},
                {name: "代办任务", key: 'xx2', ishow: true, width: 300, center: true},
                {name: "查询明细", key: 'xx3', ishow: true, width: 300, center: true}
            ],
            checkbox: false,
            tool: ["search", "add"],
            deal: [{title: "业务详情查看", img: "fa fa-eye", type: "popup"},
                {title: "人员查看", img: "fa fa-female", type: "popup2"}]
        },
        override: {
            event_popup: function () {
                this.addChild({
                    type: "@group.popup",
                    option: {
                        title: "业务详情查看",
                        type: "@group.tablegroup",
                        option: "admin.option.test2.table2",
                        width: 1200
                    }
                });
            },
            event_popup2: function () {
                this.addChild({
                    type: "@group.popupgroup",
                    option: {
                        title: "人员查看",
                        type: "@group.tablegroup",
                        option: "admin.option.test2.table3",
                        width: 1000
                    }
                });
            }
        }
    }
});
Option({
    name: "table2",
    option: {
        find: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.select", label: "查询类型", name: "xx",
                    defaults: [{key: "机构", value: 1}, {key: "人员", value: 2}, {key: "本人", value: 0}]}
            ]
        },
        table: {
            dataurl: "data/table2.json",
            cols: [
                {name: "业务编码", key: 'xx1', ishow: true, width: 200, center: true},
                {name: "客户代码", key: 'xx2', ishow: true, width: 100, center: true},
                {name: "客户", key: 'xx3', ishow: true, width: 200, center: true},
                {name: "客户经理编码", key: 'xx4', ishow: true, width: 100, center: true},
                {name: "客户经理", key: 'xx5', ishow: true, width: 100, center: true},
                {name: "所属机构", key: 'xx6', ishow: true, width: 80, center: true},
                {name: "业务类型", key: 'xx7', ishow: true, width: 160, center: true},
                {name: "截止时间", key: 'xx8', ishow: true, width: 100, center: true},
                {name: "剩余天数", key: 'xx9', ishow: true, width: 100, center: true}
            ],
            checkbox: false,
            tool: ["search"],
            deal: []
        }
    }
});
Option({
    name: "table3",
    option: {
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
        table: {
            dataurl: "data/table3.json",
            cols: [
                {name: "人员编号", key: 'xx1', ishow: true, width: 250, center: true},
                {name: "人员名称", key: 'xx2', ishow: true, width: 250, center: true},
                {name: "办理业务", key: 'xx3', ishow: true, width: 250, center: true},
                {name: "查看明细", key: 'xx4', ishow: true, width: 250, center: true}
            ],
            checkbox: false,
            tool: ["search"],
            deal: []
        }
    }
});