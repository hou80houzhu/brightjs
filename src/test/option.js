/* 
 * @packet test.option;
 * @template test.template.temp;
 */
Module({
    name: "autoview",
    extend: "view",
    template: module.getTemplate("@temp", "nodome"),
    autodom: true,
    init: function () {
        this.c = [
            {name: 1, name2: 1, name3: 10, list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: "a1", name2: "b1", name3: "c1", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: "a2", name2: "b2", name3: "c2", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: 1, name2: "b3", name3: "c3", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: 1, name2: "b4", name3: "c4", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]}
        ];
        this.render(this.c);
    },
    find_change: function (dom) {
        dom.click(function () {
            this.c[0].name = this.c[0].name + 1;
            this.c[0].name2 = this.c[0].name2 + 1;
            this.c[0].name3 = this.c[0].name3 + 1;
            this.c[3].name = this.c[3].name + 1;
            this.c[4].name = this.c[4].name + 1;

            this.c[0].list[0].aa = this.c[0].list[0].aa + "-a";
            this.c[0].list[1].aa = this.c[0].list[1].aa + "-a";
            this.update(this.c);
        }.bind(this));
    },
    find_add: function (dom) {
        dom.click(function () {
            this.c.push({
                name: "aa",
                name2: "aa2",
                name3: "aa3"
            });
            this.c[0].list.push({
                aa: "aaerer",
                bb: "ersdfsdf"
            });
            this.c[2].list.push({
                aa: "aaerer",
                bb: "ersdfsdf"
            });
            this.update(this.c);
        }.bind(this));
    },
    find_remove: function (dom) {
        dom.click(function () {
            this.c.pop();
            this.c[0].list.pop();
            this.c[1].list.pop();
            this.update(this.c);
        }.bind(this));
    },
    find_removeAll: function (dom) {
        dom.click(function () {
            this.c.length = 0;
            this.update(this.c);
        }.bind(this));
    }
});
Module({
    name: "autoviewgroup",
    extend: "viewgroup",
    option:{
        type: "@.autoview",
        data: [
            {name: 1, name2: 1, name3: 10, list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: "a1", name2: "b1", name3: "c1", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: "a2", name2: "b2", name3: "c2", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: 1, name2: "b3", name3: "c3", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: 1, name2: "b4", name3: "c4", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]}
        ]
    },
    layout: module.getTemplate("@temp", "nodomef"),
    find_change: function (dom) {
        dom.click(function () {
            this.option.data[0].name = this.option.data[0].name + 1;
            this.option.data[0].name2 = this.option.data[0].name2 + 1;
            this.option.data[0].name3 = this.option.data[0].name3 + 1;
            this.option.data[3].name = this.option.data[3].name + 1;
            this.option.data[4].name = this.option.data[4].name + 1;

            this.option.data[0].list[0].aa = this.option.data[0].list[0].aa + "-a";
            this.option.data[0].list[1].aa = this.option.data[0].list[1].aa + "-a";
            this.update();
        }.bind(this));
    },
    find_add: function (dom) {
        dom.click(function () {
            this.option.data.push({
                name: "aa",
                name2: "aa2",
                name3: "aa3"
            });
            this.option.data[0].list.push({
                aa: "aaerer",
                bb: "ersdfsdf"
            });
            this.option.data[2].list.push({
                aa: "aaerer",
                bb: "ersdfsdf"
            });
            this.update();
        }.bind(this));
    },
    find_remove: function (dom) {
        dom.click(function () {
            this.option.data.pop();
            this.option.data[0].list.pop();
            this.option.data[1].list.pop();
            this.update();
        }.bind(this));
    },
    find_removeAll: function (dom) {
        dom.click(function () {
            this.option.data.length = 0;
            this.update();
        }.bind(this));
    }
});

Option({
    name: "nodom",
    option: {
        override_layout: module.getTemplate("@temp", "nodomc"),
        override_find_change: function (dom) {
            dom.click(function () {
                this.c[0].name = this.c[0].name + 1;
                this.c[0].name2 = this.c[0].name2 + 1;
                this.c[0].name3 = this.c[0].name3 + 1;
                this.c[3].name = this.c[3].name + 1;
                this.c[4].name = this.c[4].name + 1;

                this.c[0].list[0].aa = this.c[0].list[0].aa + "-a";
                this.c[0].list[1].aa = this.c[0].list[1].aa + "-a";
                this.cpt.refresh(this.c);
            }.bind(this));
        },
        override_find_add: function (dom) {
            dom.click(function () {
                this.c.push({
                    name: "aa",
                    name2: "aa2",
                    name3: "aa3"
                });
                this.c[0].list.push({
                    aa: "aaerer",
                    bb: "ersdfsdf"
                });
                this.c[2].list.push({
                    aa: "aaerer",
                    bb: "ersdfsdf"
                });
                this.cpt.refresh(this.c);
            }.bind(this));
        },
        override_find_remove: function (dom) {
            dom.click(function () {
                this.c.pop();
                this.c[0].list.pop();
                this.c[1].list.pop();
                this.cpt.refresh(this.c);
            }.bind(this));
        },
        override_find_removeAll: function (dom) {
            dom.click(function () {
                this.c.length = 0;
                this.cpt.refresh(this.c);
            }.bind(this));
        },
        override_onendinit: function () {
            this.c = [
                {name: 1, name2: 1, name3: 10, list: [
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"}
                    ]},
                {name: "a1", name2: "b1", name3: "c1", list: [
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"}
                    ]},
                {name: "a2", name2: "b2", name3: "c2", list: [
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"}
                    ]},
                {name: 1, name2: "b3", name3: "c3", list: [
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"}
                    ]},
                {name: 1, name2: "b4", name3: "c4", list: [
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"},
                        {aa: "aa", bb: "bb"}
                    ]}
            ];
            this.cpt = this.finders("content").autodom(module.getTemplate("@temp", "nodom"), this.c);
        }
    }
});

Option({
    name: "testview",
    option: {
        override_onendinit: function () {
            this.addChild({
                type: "@.autoview"
            });
        }
    }
});
Option({
    name: "testviewgroup",
    option: {
        override_onendinit: function () {
            this.addChild({
                type: "@.autoviewgroup"
            });
        }
    }
});
Option({
    name: "testviewgrouproot",
    option: {
        type: "@.autoview",
        data: [
            {name: 1, name2: 1, name3: 10, list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: "a1", name2: "b1", name3: "c1", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: "a2", name2: "b2", name3: "c2", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: 1, name2: "b3", name3: "c3", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]},
            {name: 1, name2: "b4", name3: "c4", list: [
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"},
                    {aa: "aa", bb: "bb"}
                ]}
        ],
        override_layout:module.getTemplate("@temp", "nodomef")
    }
});