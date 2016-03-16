/*!
 * @packet admin.datepicker;
 * @require admin.form;
 */
Module({
    name: "datepicker",
    extend: "@form.text",
    option: {
        time: false,
        format: "yyyy-MM-dd hh:mm:ss"
    },
    init: function (option) {
        this.superClass("init", option);
        this.isdate = false;
        var ths = this;
        this.ishow = false;
        this.focushow = false;
        this.Days = ["日", "一", "二", "三", "四", "五", "六"];
        this.boxshow = false;
        this.Year = new Date().getFullYear();
        this.Month = new Date().getMonth() + 1;
        this.input.bind("focus", function () {
            ths.createpanel();
        });
        this.input.bind("keydown", function (e) {
            e.preventDefault();
        });
    },
    createpanel: function () {
        if (!this.isdate) {
            this.dom.css("overflow", "visible");
            var b = "<div class='datepicker'>" +
                    "<div class='datapicker-picker'>"+
                    "<div class='datepicker-header'>" +
                    "<div class='datepicker-cellc prevyear'><i class='fa fa-angle-double-left'></i></div>" +
                    "<div class='datepicker-cellc prevmonth'><i class='fa fa-angle-left'></i></div>" +
                    "<div class='datepicker-cellc datepicker-now' style='width:95px'>2013-12-14</div>" +
                    "<div class='datepicker-cellc nextmonth'><i class='fa fa-angle-right'></i></div>" +
                    "<div class='datepicker-cellc nextyear'><i class='fa fa-angle-double-right'></i></div>" +
                    "</div>" +
                    "<div class='datepicker-tool'>" +
                    "<div class='datepicker-clean' title='清空内容'><i class='fa fa-eraser'></i></div>" +
                    "<div class='datepicker-close' title='关闭小窗口'><i class='fa fa-times'></i></div>" +
                    "</div>" +
                    "<div class='datepicker-row-head'>";
            for (var j = 0; j < 7; j++) {
                b += "<div class='datepicker-cell disabled'>" + this.Days[j] + "</div>";
            }
            b += "</div>";
            b += "<div class='datepicker-body'>";
            for (var i = 0; i < 6; i++) {
                if (i === 5 || i === 4) {
                    b += "<div class='datepicker-row datepicker-row-end'>";
                } else {
                    b += "<div class='datepicker-row'>";
                }
                for (var j = 0; j < 7; j++) {
                    b += "<div class='datepicker-cell'></div>";
                }
                b += "</div>";
            }
            if (this.option.time) {
                b += "</div>" +
                        "<div class='time-bar'>" +
                        "<div class='pick-hour'>" +
                        "<select></select>" +
                        "</div><div class='pick-minite'>" +
                        "<select></select>" +
                        "</div><div class='pick-sound'>" +
                        "<select></select>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
            } else {
                b+="</div><div class='time-bar' style='height:30px;'></div>";
                b += "</div></div>";
            }
            b+="</div>";
            var ths = this;
            this.box = $(b).appendTo(this.dom);
            if (this.option.time) {
                var hourstr = "";
                for (var i = 0; i <= 23; i++) {
                    hourstr += "<option value='" + i + "'>" + i + " 时</option>";
                }
                this.box.find(".pick-hour select").html(hourstr);
                var minitestr = "";
                for (var i = 0; i < 60; i++) {
                    minitestr += "<option value='" + i + "'>" + i + " 分</option>";
                }
                this.box.find(".pick-minite select").html(minitestr);
                var soundstr = "";
                for (var i = 0; i < 60; i++) {
                    soundstr += "<option value='" + i + "'>" + i + " 秒</option>";
                }
                this.box.find(".pick-sound select").html(soundstr);
            }
//            this.box.find(".datepicker-clean").click(function () {
//                ths.cleanValue();
//            });
//            this.box.find(".datepicker-close").click(function () {
//                ths.hide();
//            });
            this.box.find(".prevmonth").click(function (e) {
                ths.prvemonth();
            });
            this.box.find(".nextmonth").click(function (e) {
                ths.nextmonth();
            });
            this.box.find(".nextyear").click(function () {
                ths.nextyear();
            });
            this.box.find(".prevyear").click(function () {
                ths.prevyear();
            });
            this.box.find(".datepicker-now").click(function () {
                ths.selectPanl();
            });
            this.btns = [];
            this.box.find(".datepicker-body").find(".datepicker-row").each(function () {
                var c = [];
                $(this).find(".datepicker-cell").each(function () {
                    c.push($(this));
                    $(this).click(function (e) {
                        ths.hide();
                        ths.input.val(ths.formate(new Date(ths.Year, ths.Month - 1, $(this).html())));
                        ths.value=ths.formate(new Date(ths.Year, ths.Month - 1, $(this).html()));
                        ths.check();
                    });
                });
                ths.btns.push(c);
            });
            ths.refresh();
            this.isdate = true;
            this.windowclickback = function (e) {
                if (ths.input&&e.target !== ths.input.get(0)) {
                    ths.hide();
                }
            };
            $(window).bind("click", this.windowclickback);
            this.box.bind("click", function (e) {
                e.stopPropagation();
            });
            this.boxshow = true;
        }
        this.show();
    },
    unonload: function () {
        $(window).unbind("click", this.windowclickback);
        this.super("clean");
    },
    cleanValue: function () {
        this.input.val("");
    },
    isame: function (d1, d2) {
        return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate());
    },
    formate: function (da) {
        var year = da.getFullYear(), month = da.getMonth() + 1, day = da.getDate();
        var format = this.option.format;
        if (this.option.time) {
            var hour = this.box.find(".pick-hour select").val(), minite = this.box.find(".pick-minite select").val(), sound = this.box.find(".pick-sound select").val();
            format = format.replace("yyyy", year).replace("MM", (month.toString().length <= 1 ? "0" + month : month)).replace("dd", (day.toString().length <= 1 ? "0" + day : day))
                    .replace("hh", (hour.length <= 1 ? "0" + hour : hour)).replace("mm", (minite.length <= 1 ? "0" + minite : minite))
                    .replace("ss", (sound.length <= 1 ? "0" + sound : sound));
        } else {
            format = format.replace("yyyy", year).replace("MM", (month.toString().length <= 1 ? "0" + month : month))
                    .replace("dd", (day.toString().length <= 1 ? "0" + day : day)).replace("hh", "").replace("mm", "").replace("ss", "").replace(":", "").replace(":", "").trim();
        }
        return format;
    },
    now: function () {
        var da = new Date();
        var c = da.getFullYear() + "-" + (da.getMonth() + 1) + "-" + da.getDate() + " " + da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
        return c;
    },
    refresh: function () {
        var ths = this, cct = 0, ct = false, arr = [];
        for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
            arr.push("");
        }
        for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
            arr.push(i);
        }
        for (var i in this.btns) {
            for (var j in this.btns[i]) {
                var n = arr[cct], p = this.btns[i][j];
                if (n && n !== "") {
                    p.html(n);
                    p.css("display", "inline-block");
                } else {
                    p.css("display", "none");
                }
                if (ths.isame(new Date(ths.Year, ths.Month - 1, n), new Date())) {
                    p.addClass("current");
                } else {
                    p.removeClass("current");
                }
                cct++;
            }
        }
        ct = false;
        this.box.find(".datepicker-row").eq(5).find(".datepicker-cell").each(function () {
            if ($(this).css("display") === "block" || $(this).css("display") === "inline-block") {
                ct = true;
                return false;
            }
        });
        if (ct) {
            this.box.find(".datepicker-row").eq(5).css("display", "block");
        } else {
            this.box.find(".datepicker-row").eq(5).css("display", "none");
        }

        ct = false;
        this.box.find(".datepicker-row").eq(6).find(".datepicker-cell").each(function () {
            if ($(this).css("display") === "block" || $(this).css("display") === "inline-block") {
                ct = true;
                return false;
            }
        });
        if (ct) {
            this.box.find(".datepicker-row").eq(6).css("display", "block");
        } else {
            this.box.find(".datepicker-row").eq(6).css("display", "none");
        }
        var cpt = this.dom.find(".datepicker-now");
        cpt.html(this.Year + "年 " + this.Month + "月");
        cpt.data("txt", this.Year + "年 " + this.Month + "月");
        return this;
    },
    prvemonth: function () {
        var d = new Date(this.Year, this.Month - 2, 1);
        this.Year = d.getFullYear();
        this.Month = d.getMonth() + 1;
        this.refresh();
    },
    nextmonth: function () {
        var d = new Date(this.Year, this.Month, 1);
        this.Year = d.getFullYear();
        this.Month = d.getMonth() + 1;
        this.refresh();
    },
    nextyear: function () {
        var d = new Date(this.Year, this.Month, 1);
        this.Year = d.getFullYear() + 1;
        var month = d.getMonth();
        if (month === 0) {
            this.Year = d.getFullYear();
            this.Month = 12;
        }
        this.refresh();
    },
    prevyear: function () {
        var d = new Date(this.Year, this.Month, 1);
        this.Year = d.getFullYear() - 1;
        var month = d.getMonth();
        if (month === 0) {
            this.Year = d.getFullYear() - 2;
            this.Month = 12;
        }
        this.refresh();
    },
    show: function () {
        if (!this.boxshow) {
            this.box.show();
            this.boxshow = true;
            this.box.children(0).removeClass("hide");
            this.dom.find(".selectpanl").remove();
        }
    },
    hide: function () {
        if (this.boxshow) {
            this.box.hide();
            this.boxshow = false;
//            this.hideError();
        }
    },
    getCurrentFullYear: function () {
        return new Date().getFullYear();
    },
    selectPanl: function () {
        var ths = this;
        var t = this.getCurrentFullYear();
        var str = "<div class='selectpanl'>";
        str += "<div class='select-year' current='" + t + "'>";
        str += "<div class='select-year-year prev'><i class='fa fa-chevron-left'></i></div>";
        for (var i = 1; i <= 18; i++) {
            str += "<div class='select-year-year yearis-" + i + " yearbtn'>" + (t + i) + "</div>";
        }
        str += "<div class='select-year-year next'><i class='fa fa-chevron-right'></i></div>";
        str += "</div>";
        str += "<div class='select-month'>";
        for (var i = 1; i <= 12; i++) {
            str += "<div class='select-month-month'>" + i + "</div>";
        }
        str += "</div>";
        str += "</div>";
        var panl = $(str).appendTo(this.box);
        this.box.children(0).addClass("hide");
        panl.find(".prev").click(function () {
            $(this).parent().children().each(function () {
                $(this).removeClass("hover");
            });
            var current = $(this).parent().attr("current") / 1;
            for (var i = 1; i <= 18; i++) {
                $(this).parent().find(".yearis-" + i).html(current - (18 - i));
            }
            $(this).parent().attr("current", current - 18);
            $(this).parent().attr("year", 0);
        });
        panl.find(".next").click(function () {
            $(this).parent().children().each(function () {
                $(this).removeClass("hover");
            });
            var current = $(this).parent().attr("current") / 1;
            for (var i = 1; i <= 18; i++) {
                $(this).parent().find(".yearis-" + i).html(current + i);
            }
            $(this).parent().attr("current", current + 18);
            $(this).parent().attr("year", 0);
        });
        panl.find(".yearbtn").each(function () {
            $(this).click(function () {
                $(this).parent().children().each(function () {
                    $(this).removeClass("hover");
                });
                $(this).addClass("hover");
                $(this).parent().attr("year", $(this).html());
                var month = panl.find(".select-month").attr("month");
                if (month && month !== "") {
                    ths.Year = $(this).html() / 1;
                    ths.Month = month / 1;
                    ths.refresh();
                    panl.remove();
                    ths.box.children(0).removeClass("hide");
                }
            });
        });
        panl.find(".select-month-month").each(function () {
            $(this).click(function () {
                $(this).parent().children().each(function () {
                    $(this).removeClass("hover");
                });
                $(this).addClass("hover");
                $(this).parent().attr("month", $(this).html());
                var year = panl.find(".select-year").attr("year");
                if (year && year !== "") {
                    ths.Month = $(this).html() / 1;
                    ths.Year = year / 1;
                    ths.refresh();
                    panl.remove();
                    ths.box.children(0).removeClass("hide");
                }
            });
        });
    }
});