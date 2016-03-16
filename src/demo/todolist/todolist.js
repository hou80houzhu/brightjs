/*!
 * @packet demo.todolist.todolist;
 * @css demo.todolist.style.main;
 * @css demo.todolist.style.font;
 * @template demo.todolist.template.todolist;
 */
Module({
    name: "todolist",
    extend: "view",
    className: "todolist",
    template: module.getTemplate("@todolist", "todolist"),
    init: function () {
        this.data = {
            template: module.getTemplate("@todolist", "todolistlist"),
            list: []
        };
        this.observe("data", this.data);
        this.render(this.data);
    },
    find_btn: function (dom) {
        var ths = this;
        dom.click(function () {
            var val = ths.finders("input").val();
            if (val !== "") {
                ths.data.list.push({
                    name: val
                });
            }
        });
    },
    group_item: function (dom) {
        dom.items("btn").click(function () {
            $(this).group().cache().remove();
        });
    },
    data_list_add: function (e) {
        $.template(this.data.template).renderAppendTo(this.finders("body"), [e.value]);
        this.delegate();
    },
    data_list_remove: function (e) {
        this.groups().eq(e.value[0].getIndex()).remove();
        this.delegate();
    }
});
Module({
    name:"todolistcontainer",
    extend:"viewgroup",
    className:"todolistcontainer",
    layout:module.getTemplate("@todolist","todolistcontainer"),
    option:{
        innerType:"@.todolist"
    }
});
Option({
    name: "root",
    option: {
        override_onendinit: function () {
            this.addChild({
                type: "@.todolistcontainer"
            });
        }
    }
});