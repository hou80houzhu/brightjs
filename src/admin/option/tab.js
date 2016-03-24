/*!
 * @packet admin.option.tab;
 * @include admin.group;
 * @include admin.form;
 * @include admin.photo;
 * @include admin.datepicker;
 */
Option({
    name: "tab",
    option: {
        tabs: [
            {name: "超时已执行业务", inner: "@group.tablegroup", option: "admin.option.tab.table1"},
            {name: "超时未执行业务", inner: "@group.tablegroup", option: "admin.option.tab.table2"}
        ]
    }
});
Option({
    name: "table1",
    option: {
        find: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.select", label: "查询类型", name: "xx",
                    defaults: [{key: "机构", value: 1}, {key: "人员", value: 2}, {key: "本人", value: 0}]}
            ]
        },
        table: {
            dataurl: "data/tab1.json",
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
            dataurl: "data/tab2.json",
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