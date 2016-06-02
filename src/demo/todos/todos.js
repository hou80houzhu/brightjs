/*
 * @packet demo.todos.todos;
 * @template demo.todos.template.temp;
 * @css demo.todos.style.todostyle; 
 * @css demo.todos.style.fontawesome;
 */
Module({
    name: "todos",
    extend: "view",
    autoupdate: true,
    className: "todos",
    template: module.getTemplate("@temp", "todos"),
    init: function () {
        this._todos = {
            task: [],
            totalleft: 0,
            complete: false,
            active: false,
            all: true
        };
        this.render(this._todos);
    },
    group_item: function (dom) {
        var ths = this;
        dom.items("check").click(function () {
            var t = $(this).group().cache();
            if (t.checked) {
                t.checked = false;
                ths._todos.totalleft = ths._todos.totalleft + 1;
            } else {
                t.checked = true;
                ths._todos.totalleft = ths._todos.totalleft - 1;
            }
            ths.update();
        });
        dom.items("remove").click(function () {
            var t = $(this).group().cache();
            var q = ths._todos.task.indexOf(t);
            ths._todos.task.splice(q, 1);
            if (!t.checked) {
                ths._todos.totalleft = ths._todos.totalleft - 1;
            }
            ths.update();
        });
    },
    find_input: function (dom) {
        var ths = this;
        dom.bind("keyup", function (e) {
            if (e.keyCode === 13) {
                var t = $(this).val();
                ths._todos.task.push({
                    checked: false,
                    desc: t
                });
                ths._todos.totalleft = ths._todos.totalleft + 1;
                ths.update();
                $(this).val("");
            }
        });
    },
    find_all: function (dom) {
        var ths = this;
        dom.click(function () {
            ths._todos.all = true;
            ths._todos.complete = false;
            ths._todos.active = false;
            ths.update();
        });
    },
    find_active: function (dom) {
        var ths = this;
        dom.click(function () {
            ths._todos.active = true;
            ths._todos.complete = false;
            ths._todos.all = false;
            ths.update();
        });
    },
    find_complete: function (dom) {
        var ths = this;
        dom.click(function () {
            ths._todos.active = false;
            ths._todos.complete = true;
            ths._todos.all = false;
            ths.update();
        });
    },
    find_clear: function (dom) {
        var ths = this;
        dom.click(function () {
            var t = [];
            for (var i = 0; i < ths._todos.task.length; i++) {
                if (!ths._todos.task[i].checked) {
                    t.push(ths._todos.task[i]);
                }
            }
            ths._todos.task = t;
            ths._todos.totalleft = t.length;
            ths.update();
        });
    }
});

Option({
    name: "todosoption",
    option: {
        override_onendinit: function () {
            this.addChild({
                type: "@.todos"
            });
        }
    }
});