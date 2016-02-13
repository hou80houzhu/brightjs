/*!
 * @packet admin.menu;
 */
Module({
    name: "menulist",
    className: "menulist",
    extend: "view",
    option: {
        url: "",
        value: null,
        level: 1, //1,2
        isLoad: true
    },
    init: function (option) {
        if (option.isLoad) {
            if (option.url !== "") {
                this.getData();
            } else if (option.value) {
                this.setList(option.value);
            }
        }
    },
    getData: function () {
        var ths = this;
        this.postData({
            url: this.option.url,
            back: function (data) {
                ths.setList(data);
            }
        });
    },
    setList: function (data) {
        var str = "", option = this.option, ths = this;
        this.dom.addClass("menulist");
        if (this.option.level === 1) {
            for (var i in data) {
                str += "<div class='menu-item'><div class='head'><div class='icon'><i class='" + data[i].img + "' style='margin-right:5px;'></i></div>" + data[i].name + "</div></div>";
            }
        } else {
            for (var i in data) {
                if (data[i].list.length > 0) {
                    str += "<div class='menu-item'><div class='head'><div class='icon'><i class='" + data[i].img + "' style='margin-right:5px;'></i></div>" + data[i].name + "<div class='menu-dot'><i class='fa fa-chevron-downm'></i></div></div>" +
                            "<ul>";
                    for (var t in data[i].list) {
                        str += "<li><i class='" + data[i].list[t].img + "' style='margin-right:5px;'></i>" + data[i].list[t].name + "</li>";
                    }
                    str += "</ul></div>";
                } else {
                    str += "<div class='menu-item'><div class='head'><div class='icon'><i class='" + data[i].img + "' style='margin-right:5px;'></i></div>" + data[i].name + "</div></div>";
                }
            }
        }
        this.dom.html(str);
        this.dom.children().each(function (num) {
            if ($(this).find("li").length > 0) {
                var k = data[num];
                $(this).find("li").each(function (c, d) {
                    $(this).data("data", k.list[d]);
                    $(this).click(function () {
                        ths.dispatchEvent("menulistclick", {
                            data: $(this).data("data"),
                            title: $(this).html()
                        });
                    });
                });
                $(this).click(function () {
                    ths.dom.children().each(function () {
                        $(this).removeClass("open");
                    });
                    $(this).addClass("open");
                });
            } else {
                $(this).data("data", data[num]);
                $(this).click(function () {
                    ths.dom.children().each(function () {
                        $(this).removeClass("active");
                    });
                    $(this).addClass("active");
                    ths.dispatchEvent("menulistclick", {
                        data: $(this).data("data"),
                        title: $(this).html()
                    });
                });
            }
        });
    },
    activeItem: function (num) {
        var k = this.dom.children().eq(num);
        if (k.length > 0) {
            this.dom.children().each(function () {
                $(this).removeClass("active");
            });
            k.addClass("active");
        }
        return this;
    },
    itemClick: function (id) {
        this.dom.find(".menu-item").each(function () {
            if ($(this).data("data").id === id) {
                var k = $(this);
                k.trigger("click");
                if (k.find("li").length > 0) {
                    k.find("li").eq(0).trigger("click");
                }
                return false;
            }
        });
    },
    firstClick: function () {
        var k = this.dom.children().eq(0);
        k.trigger("click");
        if (k.find("li").length > 0) {
            k.find("li").eq(0).trigger("click");
        }
    }
});