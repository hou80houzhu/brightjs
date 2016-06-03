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
    bind_input: function (dom,e) {
        if (e.keyCode === 13) {
            var t = dom.val();
            if(t){
                this._todos.task.push({
                    checked: false,
                    desc: t
                });
                this._todos.totalleft = this._todos.totalleft + 1;
                this.update();
                dom.val("");
            }
        }
    },
    bind_all: function () {
        this._todos.all = true;
        this._todos.complete = false;
        this._todos.active = false;
        this.update();
    },
    bind_active: function () {
        this._todos.active = true;
        this._todos.complete = false;
        this._todos.all = false;
        this.update();
    },
    bind_complete: function () {
        this._todos.active = false;
        this._todos.complete = true;
        this._todos.all = false;
        this.update();
    },
    bind_clear: function () {
        var t = [];
        for (var i = 0; i < this._todos.task.length; i++) {
            if (!this._todos.task[i].checked) {
                t.push(this._todos.task[i]);
            }
        }
        this._todos.task = t;
        this._todos.totalleft = t.length;
        this.update();
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