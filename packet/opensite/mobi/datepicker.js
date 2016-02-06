/*!
 * @packet opensite.mobi.datepicker; 
 * @require opensite.mobi.form;
 * @template opensite.mobi.template.formtemplate;
 */
Module({
    name: "datep",
    extend: "@form.fieldgroup",
    className: "datep",
    layout: module.getTemplate("@formtemplate", "datep"),
    option: {
        withTime: true
    },
    onbeforeinit: function () {
        if (!this.option.value || this.option.value === "") {
            this.option.value = $.formatDate();
            this.value = this.option.value;
        }
        if (this.option.withTime) {
            this.value = this.option.value;
        } else {
            this.value = this.value.substring(0, 10);
            this.option.value = this.value;
        }
    },
    find_btn: function (dom) {
        dom.button(function (e, ths) {
            ths.addChild({
                type: "@.datepicker",
                option: ths.option,
                parameters: ths.value
            });
        }, this);
    },
    event_dateselected: function () {
        var a = this.getFirstChild().getValue();
        this.value = a;
        this.finders.get("btn").html(a);
        this.getFirstChild().remove();
    },
    getValue: function () {
        return this.finders.get("btn").html();
    },
    setValue: function (a) {
        if (this.option.withTime) {
            if (a.indexOf(":") !== -1) {
                this.value = a;
            } else {
                this.value = a + " 00:00:00";
            }
        } else {
            if (a.indexOf(":") !== -1) {
                this.value = a.substring(0, 10);
            } else {
                this.value = a;
            }
        }
        this.option.value = this.value;
        this.finders.get("btn").html(this.value);
    }
});
Module({
    name: "datepicker",
    extend: "@form.fieldgroup",
    className: "dpicker",
    layout: module.getTemplate("@formtemplate", "dpicker"),
    option: {},
    init: function () {
        this.addChild({
            type: "@.datepanel",
            option: this.option,
            container: this.dom.children(1)
        }).done(function (a) {
            a.setDateTime(this.parameters);
        });
    },
    find_bg: function (dom) {
        var ths = this;
        dom.bind("touchstart", function (e) {
            ths.remove();
        });
    },
    getValue: function () {
        return this.getFirstChild().getDate();
    },
    setValue: function (a) {
        this.value = a;
    }
});
Module({
    name: "datepanel",
    extend: "view",
    className: "datepanel",
    template: module.getTemplate("@formtemplate", "datepanel"),
    option: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: 1,
        withTime: true,
        format: "yyyy-MM-dd hh:mm:ss"
    },
    init: function () {
        this.Year = this.option.year;
        this.Month = this.option.month;
        this.Dateis = 0;
        this.Hour = 0;
        this.Minite = 0;
        this.Second = 0;
        this.render(this.option).done(function () {
            this.refresh();
        });
    },
    find_prev: function (dom) {
        dom.button(function (e, scope) {
            scope.prvemonth();
        }, this);
    },
    find_next: function (dom) {
        dom.button(function (e, scope) {
            scope.nextmonth();
        }, this);
    },
    find_current: function (dom) {
        this._header = dom;
        dom.button(function (e, scope) {
            scope.yearbody.show();
            scope.currentyears();
        }, this);
    },
    find_day: function (dom) {
        this._day = dom;
        if (!dom.hasClass("disabled")) {
            dom.button(function (e, scope) {
                scope.Dateis = parseInt($(this).children(0).html());
                scope.dom.find(".selected").removeClass("selected");
                $(this).children(0).addClass("selected");
            }, this);
        }
    },
    find_selectdate: function (dom) {
        dom.button(function (e, ths) {
            ths.dispatchEvent("dateselected", {
                year: ths.Year,
                month: ths.Month,
                date: ths.Dateis
            });
        }, this);
    },
    find_databody: function (dom) {
        this.dbody = dom;
    },
    find_yearbody: function (dom) {
        this.yearbody = dom;
        dom.hide();
    },
    find_yleft: function (dom) {
        dom.button(function (e, scope) {
            scope.prevyears();
        }, this);
    },
    find_yright: function (dom) {
        dom.button(function (e, scope) {
            scope.nextyears();
        }, this);
    },
    find_year: function (dom) {
        dom.button(function (e, scope) {
            scope.Year = parseInt($(this).html());
            scope.yearbody.hide();
            scope.monthbody.show();
        }, this);
    },
    find_monthbody: function (dom) {
        this.monthbody = dom;
        dom.hide();
    },
    find_month: function (dom) {
        dom.button(function (e, scope) {
            scope.Month = parseInt($(this).html());
            scope.monthbody.hide();
            scope.refresh();
        }, this);
    },
    find_shour: function (dom) {
        dom.button(function (e, ths) {
            ths.finders.get("phour").show();
        }, this);
    },
    find_stime: function (dom) {
        dom.button(function (e, ths) {
            ths.finders.get("psecond").data("time", "time").show();
        }, this);
    },
    find_ssecond: function (dom) {
        dom.button(function (e, ths) {
            ths.finders.get("psecond").data("time", "second").show();
        }, this);
    },
    find_second: function (dom) {
        dom.button(function (e, ths) {
            var a = ths.finders.get("psecond");
            if (a.data("time") === "time") {
                ths.Minite = parseInt($(this).html());
                ths.finders.get("stime").children(0).html(ths.Minite);
            } else {
                ths.Second = parseInt($(this).html());
                ths.finders.get("ssecond").children(0).html(ths.Second);
            }
            a.hide();
        }, this);
    },
    find_hour: function (dom) {
        dom.button(function (e, ths) {
            ths.Hour = parseInt($(this).html());
            console.log(ths.Hour);
            ths.finders.get("shour").children(0).html(ths.Hour);
            ths.finders.get("phour").hide();
        }, this);
    },
    setDate: function (y, m) {
        this.Year = y;
        this.Month = m;
        this.refresh();
    },
    currentyears: function () {
        var t = [], y = new Date().getFullYear();
        for (var i = 13; i >= 0; i--) {
            t.push(y - i);
        }
        this.yearbody.html($.template(module.getTemplate("@formtemplate", "datepanelyear")).render(t));
    },
    prevyears: function () {
        var t = [], y = parseInt(this.yearbody.children(1).html());
        for (var i = 13; i >= 0; i--) {
            t.push(y - i);
        }
        this.yearbody.html($.template(module.getTemplate("@formtemplate", "datepanelyear")).render(t));
    },
    nextyears: function () {
        var t = [], y = parseInt(this.yearbody.children(14).html());
        for (var i = 0; i < 14; i++) {
            t.push(y + i);
        }
        this.yearbody.html($.template(module.getTemplate("@formtemplate", "datepanelyear")).render(t));
    },
    prvemonth: function () {
        var a = this.Month - 1;
        if (a < 1) {
            a = 12;
            this.Year--;
        }
        this.Month = a;
        this.refresh();
    },
    nextmonth: function () {
        var a = this.Month + 1;
        if (a > 12) {
            a = 1;
            this.Year++;
        }
        this.Month = a;
        this.refresh();
    },
    getMonthDays: function (year, month) {
        var m = [31, ((year % 4 === 0) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return m[month];
    },
    getDaysOfMonth: function (year, month) {
        var _y = year, _m = month - 2;
        if (_m === -1) {
            _m = 11;
            _y = year - 1;
        }
        var begin = new Date(year + "/" + month + "/1").getDay();
        if (begin === 0) {
            begin = 6;
        } else {
            begin--;
        }
        var prev = this.getMonthDays(_y, _m), current = this.getMonthDays(year, month - 1), r = [];
        for (var i = 0; i < 42; i++) {
            if (i < begin && i < current) {
                r.push(prev - begin + i + 1);
            } else if (i >= begin && i < current + begin) {
                r.push(i - begin + 1);
            } else if (i >= current) {
                if (begin === 0) {
                    r.push(i - current - begin);
                } else {
                    r.push(i - current - begin + 1);
                }
            }
        }
        return r;
    },
    getDaysByMonth: function (y, m) {
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var currentDate = new Date().getDate();
        var r = this.getDaysOfMonth(y, m);
        var p = [], t = 0;
        for (var i = 0; i < r.length; i++) {
            var tp = false, tpp = false;
            if (t === 0) {
                if (currentYear === y && currentMonth === m - 1 && r[i] === currentDate) {
                    tp = true;
                }
                if (y === this._selectedYear && m - 1 === this._selectedMonth && r[i] === this._selectedDay) {
                    tpp = true;
                }
            } else if (t === 1) {
                if (currentYear === y && currentMonth === m && r[i] === currentDate) {
                    tp = true;
                }
                if (y === this._selectedYear && m === this._selectedMonth && r[i] === this._selectedDay) {
                    tpp = true;
                }
            } else {
                if (currentYear === y && currentMonth === m + 1 && r[i] === currentDate) {
                    tp = true;
                }
                if (y === this._selectedYear && m + 1 === this._selectedMonth && r[i] === this._selectedDay) {
                    tpp = true;
                }
            }
            if (r[i] === 1) {
                if (t === 0) {
                    t = 1;
                    p.push({
                        current: tp,
                        disabled: false,
                        selected: tpp,
                        value: r[i]
                    });
                } else if (t === 1) {
                    t = 2;
                    p.push({
                        current: tp,
                        selected: tpp,
                        disabled: true,
                        value: r[i]
                    });
                }
            } else {
                if (t === 0) {
                    p.push({
                        current: tp,
                        selected: tpp,
                        disabled: true,
                        value: r[i]
                    });
                } else if (t === 2) {
                    p.push({
                        current: tp,
                        selected: tpp,
                        disabled: true,
                        value: r[i]
                    });
                } else {
                    p.push({
                        current: tp,
                        selected: tpp,
                        disabled: false,
                        value: r[i]
                    });
                }
            }
        }
        return p;
    },
    refresh: function () {
        this._header.html(this.Year + "-" + (this.Month === 0 ? 1 : this.Month));
        var a = this.getDaysByMonth(this.Year, this.Month === 0 ? 1 : this.Month);
        if (this.option.withTime) {
            this.finders.get("stime").children(0).html(this.Minite);
            this.finders.get("shour").children(0).html(this.Hour);
            this.finders.get("ssecond").children(0).html(this.Second);
        }
        this.dbody.html($.template(module.getTemplate("@formtemplate", "datepanelbody")).render(a));
    },
    getDate: function () {
        return this.formate();
    },
    setDateTime: function (data) {
        if (data && data !== "") {
            if (data.indexOf(":") === -1) {
                data = data + " 00:00:00";
            }
            var p = data.split(" ");
            data = p[0].split("-").join("/") + " " + p[1];
            var a = new Date(data);
            this.Year = a.getFullYear();
            this.Month = a.getMonth() + 1;
            this.Dateis = a.getDate();
            this.Second = a.getSeconds();
            this.Minite = a.getMinutes();
            this.Hour = a.getHours();
            this._selectedYear = this.Year;
            this._selectedMonth = this.Month;
            this._selectedDay = this.Dateis;
//            alert(this.Year+"----"+this.Month+"---"+this.Dateis+"----"+this.Hour+"----"+this.Minite+"----"+this.Second);
            this.refresh();
        }
    },
    formate: function (da) {
        var format = this.option.format;
        if (!this.option.withTime) {
            format = "yyyy-MM-dd";
        }
        var hour = this.Hour, minite = this.Minite, sound = this.Second, month = this.Month, day = this.Dateis, year = this.Year;
        format = format.replace("yyyy", year).replace("MM", (month.toString().length <= 1 ? "0" + month : month)).replace("dd", (day.toString().length <= 1 ? "0" + day : day))
                .replace("hh", (hour.toString().length <= 1 ? "0" + hour : hour)).replace("mm", (minite.toString().length <= 1 ? "0" + minite : minite))
                .replace("ss", (sound.toString().length <= 1 ? "0" + sound : sound));
        return format;
    }
});