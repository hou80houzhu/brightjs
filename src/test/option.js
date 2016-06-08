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
    autodom: true,
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
        override_layout: module.getTemplate("@temp", "nodomef")
    }
});

Module({
    name: "qut",
    extend: "view",
    autodom: true,
    template: module.getTemplate("@temp", "qut"),
    init: function () {
        this.total = 0;
        var t = [];
        for (var i = 0; i < 2000; i++) {
            t.push({
                aa: "aa" + i,
                bb: "bb" + i
            });
        }
        this.render(t);
    },
    find_add300: function (dom) {
        dom.click(function () {
            var t = [];
            for (var i = 0; i < 400; i++) {
                t.push({
                    aa: "aa" + i,
                    bb: "bb" + i
                });
            }
            this.update(t);
        }.bind(this));
    },
    find_add900: function (dom) {
        dom.click(function () {
            var t = [];
            for (var i = 0; i < 1000; i++) {
                t.push({
                    aa: "aa" + i,
                    bb: "bb" + i
                });
            }
            this.update(t);
        }.bind(this));
    },
    find_add600: function (dom) {
        dom.click(function () {
            var t = [];
            for (var i = 0; i < 700; i++) {
                t.push({
                    aa: "aa" + i,
                    bb: "bb" + i
                });
            }
            this.update(t);
        }.bind(this));
    },
    find_add100: function (dom) {
        dom.click(function () {
            var t = [];
            for (var i = 0; i < 100; i++) {
                t.push({
                    aa: "aa" + i,
                    bb: "bb" + i
                });
            }
            this.update(t);
        }.bind(this));
    },
    find_add0: function (dom) {
        dom.click(function () {
            var t = [];
            this.update(t);
        }.bind(this));
    },
    find_addadd1000: function (dom) {
        dom.click(function () {
            var t = [];
            this.total += 1000;
            for (var i = 0; i < this.total; i++) {
                t.push({
                    aa: "aa" + i,
                    bb: "bb" + i
                });
            }
            this.update(t);
        }.bind(this));
    }
});
Module({
    name: "tt",
    extend: "view",
    autodom: true,
    template: module.getTemplate("@temp", "testtest"),
    init: function () {
        function _buildData(count) {
            count = count || 1000;
            var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
            var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
            var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
            var data = [];
            for (var i = 0; i < count; i++)
                data.push({id: i + 1, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]});
            return data;
        }
        function _random(max) {
            return Math.round(Math.random() * 1000) % max;
        }
        var data = _buildData();
        console.time("init");
        this.render({
            selected: 0,
            list: data
        });
        console.timeEnd("init");
        var ths = this;
        this.dom.delegate("click", ".row", function (e) {
            ths.autodomcache[0].selected = ths.autodomcache[0].list.indexOf($(this).cache());
            console.time("===>update");
            ths.update();
            console.timeEnd("===>update");
        });
    }
});
Option({
    name: "qu",
    option: {
        override: {
            onendinit: function () {
                this.addChild({
                    type: "@.tt"
                });
            }
        }
    }
});