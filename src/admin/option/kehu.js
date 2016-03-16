/*!
 * @packet admin.option.kehu;
 * @include admin.group;
 * @include admin.form;
 * @include admin.photo;
 * @include admin.datepicker;
 */
Option({
    name: "table",
    option: {
        find: {
            action: basePath + "data/dataok.json",
            fields: [
                {type: "@form.text", label: "客户号", name: "xx", value: "660048533"},
                {type: "@form.text", label: "客户名称", name: "xx"}
            ]
        },
        table: {
            dataurl: "data/kehu.json",
            cols: [
                {name: "地区代码", key: 'xx1', ishow: true, width: 100, center: true},
                {name: "支行代码", key: 'xx2', ishow: true, width: 100, center: true},
                {name: "机构名称", key: 'xx3', ishow: true, width: 100, center: true},
                {name: "客户代码", key: 'xx4', ishow: true, width: 100, center: true},
                {name: "客户名称", key: 'xx5', ishow: true, width: 200, center: true},
                {name: "贷款余额(万元)", key: 'xx6', ishow: true, width: 200, center: true},
                {name: "操作", key: 'xx7', ishow: true, width: 60, center: true}
            ],
            checkbox: false,
            tool: ["search"],
            deal: []
        },
        override: {
        }
    }
});
