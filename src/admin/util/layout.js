/*!
 * @packet admin.util.layout;
 */
(function($) {
    var factory = $.adapt();
    factory.def({
        name: "layout",
        option: {
            items: []
        },
        init: function() {
            var items = [];
            for (var i = 0; i < this.option.items.length; i++) {
                var obj = this.option.items[i];
                if (obj.typeOf && obj.typeOf("item") && obj.inner) {
                    items.push(factory.create("item", this.option.items[i]));
                }
            }
            this.option.items = items;
        },
        render: function() {
            var t = "<div>";
            for (var i = 0; i < this.option.items.length; i++) {
                t += this.option.items[i].inner.render(i);
            }
            t += "</div>";
            return t;
        }
    }).def({
        name: "region",
        option: {
            id: "",
            view: "",
            option: ""
        },
        init: function() {
        },
        render: function(num) {
            return "<div data-parent-view='<%=data.id;%>' data-view='" + this.option.view +
                    "' data-view-id='" + (this.option.id && this.option.id !== "" ? this.option.id : this.option.view + "-" + (num || (Math.random() * 10))) +
                    "' data-option='" + this.option.option + "'></div>";
        }
    }).def({
        name: "item",
        option: {
            inner: null
        },
        init: function() {
            $.extend(this, this.option);
            if (this.option.inner.typeOf && (this.option.inner.typeOf("layout") || this.option.inner.typeOf("region"))) {
                this.inner = this.option.inner;
                this.inner.init();
            } else {
                this.inner = null;
            }
        }
    });
    $.layout = function(obj) {
        if (obj.type && obj.type !== "") {
            return factory.create(obj.type, obj);
        } else {
            throw Error("[brooder]has no layout with type of " + obj.type);
        }
    };
    $.region = function(obj) {
        if (obj.type && obj.type !== "") {
            return factory.create(obj.type, obj);
        } else {
            throw Error("[brooder]has no region with type of " + obj.type);
        }
    };
    $.item = function(obj) {
        return factory.create("item", obj);
    };
    $.deflayout = function(obj) {
        factory.def(obj);
    };
    $.defregion = function(obj) {
        factory.def(obj);
    };
})(brooder);
(function($) {
    $.deflayout({
        name: "gridlayout",
        extend: "layout",
        option: {
            colm: 4,
            items: []
        },
        render: function() {
            var t = "<div class='row'>";
            for (var i = 0; i < this.option.items.length; i++) {
                var obj = this.option.items[i];
                t += "<div class='span1-" + this.option.colm + "'>";
                t += obj.inner.render(i);
                t += "</div>";
            }
            t += "</div>";
            return t;
        }
    });
    $.defregion({
        name: "htmlregion",
        extend: "region",
        option: {
            html: ""
        },
        render: function() {
            return this.option.html;
        }
    });
    var c = $.layout({
        type: "gridlayout",
        items: [
            $.item({inner: $.region({type: "region", id: "aa", view: "aa", option: "aa"})}),
            $.item({inner: $.layout({
                    type: "gridlayout",
                    items: [
                        $.item({inner: $.region({type: "region", id: "aa", view: "aa", option: "aa"})}),
                        $.item({inner: $.region({type: "region", id: "aa", view: "aa", option: "aa"})})
                    ]
                })})
        ]
    });
})(brooder);