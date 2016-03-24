/*!
 * @packet admin.table;
 * @css admin.style.table;
 */
Module({
    name: "tablebase",
    extend: "view"
});
Module({
    name: "doubleTable",
    extend: "@.tablebase",
    className: "table",
    option: {
        dataurl: "table.json",
        id: "id",
        rowHeight: 40,
        cols: [],
        checkbox: true,
        isrefresh: true,
        num: true,
        singleselect: false,
        tool: ["search", "refresh", "deletemulti", "add", "uploadfile"],
        deal: ["edit", "delete"],
        rownum: [30, 50, 100, 150]
    },
    onbeforeinit: function () {
        this.data = {};
    },
    init: function (option) {
        this.dom.addClass("table");
        var fns = {
            edit: {title: "编辑数据", img: "fa fa-eye", type: "table_rowedit"},
            search: {title: "查询数据", img: "fa fa-search", type: "table_search"},
            delete: {title: "删除数据", img: "fa fa-times", type: "table_rowdelete"},
            refresh: {title: "刷新", img: "fa fa-refresh", type: "table_toolrefresh"},
            deletemulti: {title: "批量删除", img: "fa fa-times", type: "table_multidelete"},
            uploadfile: {title: "上传文件", img: "fa fa-upload", type: "table_uploadfile"},
            add: {title: "添加数据", img: "fa fa-plus", type: "table_tooladd"}
        };
        var tools = [];
        for (var i in option.tool) {
            if ($.is.isString(option.tool[i])) {
                var ca = fns[option.tool[i]];
                var n = $.extend({}, ca, option.tool[i]);
                tools.push(n);
            } else {
                tools.push(option.tool[i]);
            }
        }
        var deals = [];
        for (var i in option.deal) {
            if ($.is.isString(option.deal[i])) {
                var ca = fns[option.deal[i]];
                var n = $.extend(ca, option.deal[i]);
                deals.push(n);
            } else {
                deals.push(option.deal[i]);
            }
        }
        option.deal = deals;
        option.tool = tools;
        var cols = [], colss = option.cols;
        for (var i in option.cols) {
            if (option.cols[i].cols) {
                for (var t in option.cols[i].cols) {
                    cols.push(option.cols[i].cols[t]);
                }
            } else {
                cols.push(option.cols[i]);
            }
        }
        option.cols = cols;
        option.colss = colss;
        this.rowHeight = option.rowHeight ? option.rowHeight : 30;
        this.rowSize = option.rownum[0] ? option.rownum[0] : 10;
        this.currentPage = 1;
        this.sort = {};
        this.drawTable();
        if (this.option.isrefresh) {
            this.refresh();
        }
    },
    drawTable: function () {
        var str = "";
        str += this.drawToolbar();
        str += this.drawFootbar();
        str += this.drawBody();
        this.dom.html(str);
        var ths = this;
        this.dom.find(".tablebody-rightbody").bind("scroll", function (e) {
            ths.dom.find(".tablebody-righthead").scrollLeft($(this).scrollLeft());
            ths.dom.find(".tablebody-leftcon").scrollTop($(this).scrollTop());
        });
        this.dom.find(".page").each(function () {
            $(this).click(function () {
                ths.gotoPage(parseInt($(this).html()));
            });
        });
        this.dom.find(".prev").click(function () {
            ths.prevPage();
        });
        this.dom.find(".next").click(function () {
            ths.nextPage();
        });
        this.dom.find("select").bind("change", function () {
            ths.rowSize = parseInt($(this).val());
            ths.gotoPage(1);
        });
        this.dom.find(".gotopagex").click(function () {
            var a = $(this).parent().find("input").val();
            if (/^[0-9]*$/.test(a)) {
                ths.gotoPage(parseInt(a));
            }
        }).parent().find("input").bind("keyup", function (e) {
            if (e.keyCode === 13) {
                var a = $(this).val();
                if (/^[0-9]*$/.test(a)) {
                    ths.gotoPage(parseInt(a));
                }
            }
        });
        this.dom.find(".toolbtn").click(function () {
            var num = $(this).attr("toolnum");
            var k = ths.option.tool[num];
            ths.dispatchEvent(k.type, {
                btn: $(this),
                data: ths.getSelectRows()
            });
        });
        this.dom.find(".selectall").click(function () {
            if ($(this).get(0).checked) {
                ths.dom.find(".tablebody-leftcon input[type='checkbox']").each(function () {
                    $(this).get(0).checked = true;
                });
                ths.dom.find(".tablebody-leftcon .table-row").each(function () {
                    $(this).addClass("active");
                    ths.dispatchEvent("selectrow", ths.tableData.rows[$(this).attr("num")]);
                });
                ths.dom.find(".tablebody-rightbody .table-row").each(function () {
                    $(this).addClass("active");
                });
            } else {
                ths.dom.find(".tablebody-leftcon input[type='checkbox']").each(function () {
                    $(this).get(0).checked = false;
                });
                ths.dom.find(".tablebody-leftcon .table-row").each(function () {
                    $(this).removeClass("active");
                    ths.dispatchEvent("unselectrow", ths.tableData.rows[$(this).attr("num")]);
                });
                ths.dom.find(".tablebody-rightbody .table-row").each(function () {
                    $(this).removeClass("active");
                });
            }
        });
        this.dom.find(".tsort").each(function () {
            $(this).click(function () {
                if ($(this).hasClass("desc")) {
                    $(this).removeClass("desc").removeClass("asc");
                    ths.sort[$(this).attr("sort")] = "";
                } else if ($(this).hasClass("asc")) {
                    $(this).removeClass("asc").addClass("desc");
                    ths.sort[$(this).attr("sort")] = "desc";
                } else {
                    $(this).removeClass("desc").addClass("asc");
                    ths.sort[$(this).attr("sort")] = "asc";
                }
                ths.refresh();
            });
        });
    },
    drawToolbar: function () {
        var ops = this.option, str = "";
        if (ops.tool.length > 0) {
            str = "<div class='table-head group'>";
            for (var i in ops.tool) {
                str += "<div class='table-foot-btn toolbtn' toolnum='" + i + "' title='" + (ops.tool[i].title ? ops.tool[i].title : "") + "'>" +
                        (ops.tool[i].name ? ops.tool[i].name : "<i class='" + ops.tool[i].img + "'></i>") +
                        "</div>";
            }
            str += "</div>";
        }
        return str;
    },
    drawFootbar: function () {
        var str = "<div class='table-foot'>" +
                "<div class='table-foot-btn-group'>" +
                "<div class='table-foot-btn prev' title='上一页'><i class='fa fa-chevron-left'></i></div>" +
                "<div class='table-foot-btn page page0'>1</div>" +
                "<div class='table-foot-btn dot1 disabled'>...</div>" +
                "<div class='table-foot-btn page page1'>2</div>" +
                "<div class='table-foot-btn page page2'>3</div>" +
                "<div class='table-foot-btn page page3'>4</div>" +
                "<div class='table-foot-btn dot2 disabled'>...</div>" +
                "<div class='table-foot-btn page page4'>5</div>" +
                "<div class='table-foot-btn next' title='下一页'><i class='fa fa-chevron-right'></i></div>" +
                "</div>" +
                "<select class='table-foot-select'>";
        for (var i in this.option.rownum) {
            str += "<option value='" + this.option.rownum[i] + "'>" + this.option.rownum[i] + "</option>";
        }
        str += "</select>" +
                "<input type='text' class='table-foot-input'placeholder='1'/>" +
                "<div class='table-foot-btn gotopagex' title='跳转'><i class='fa fa-long-arrow-right'></i></div>" +
                "<div class='table-info'></div>" +
                "</div>";
        return str;
    },
    drawBody: function () {
        var str = "<div class='table-body'>";
        str += this.drawRight();
        str += this.drawLeft();
        str += "</div>";
        return str;
    },
    drawLeft: function () {
        var wid = 0, wid2 = 0;
        if (this.option.num) {
            wid += 30;
        }
        if (this.option.checkbox) {
            wid += 30;
        }
        for (var i in this.option.deal) {
            wid += 31;
            wid2 += 31;
        }
        if (wid !== 0) {
            var str = "<div class='tablebody-left' style='width:" + wid + "px;'>";
            str += this.drawLeftHead();
            str += "<div class='tablebody-leftcon'>";
            str += "</div>";
            str += "</div>";
        } else {
            str = "";
        }
        return str;
    },
    drawLeftHead: function () {
        var wid = 0, wid2 = 0;
        if (this.option.num) {
            wid += 30;
        }
        if (this.option.checkbox) {
            wid += 30;
        }
        for (var i in this.option.deal) {
            wid += 31;
            wid2 += 31;
        }
        var str = "";
        str += "<div class='table-row' style='height:40px'>";
        if (this.option.num) {
            str += "<div class='table-cell' style='height:40px;width:30px;'></div>";
        }
        if (this.option.checkbox) {
            if (this.option.singleselect) {
                str += "<div class='table-cell' style='40px;width:30px;'>" +
                        "<div class='cell-inner' style='line-height:30px;'><input type='checkbox' class='selectall' disabled='disabled'/></div>" +
                        "</div>";
            } else {
                str += "<div class='table-cell' style='40px;width:30px;'>" +
                        "<div class='cell-inner' style='line-height:30px;'><input type='checkbox' class='selectall'/></div>" +
                        "</div>";
            }
        }
        if (this.option.deal.length > 0) {
            str += "<div class='table-cell' style='40px;width:" + (wid2 - 1) + "px;background:white;'>" +
                    "<div class='cell-inner' style='line-height:30px;text-align:center;'><i class='fa fa-gear'></i></div>" +
                    "</div>";
        }
        str += "</div>";
        return str;
    },
    drawLeftBody: function () {
        var str = "";
        for (var i = 0; i < this.rowCount; i++) {
            str += "<div class='table-row" + (i !== 0 && i % 2 ? "" : " color") + "' style='height:" + this.rowHeight + "px' num='" + i + "'>";
            if (this.option.num) {
                str += "<div class='table-cell' style='width:30px;height:" + this.rowHeight + "px'>" +
                        "<div class='cell-inner' style='text-align:center;line-height:" + (this.rowHeight - 10) + "px'>" + (i + 1) + "</div>" +
                        "</div>";
            }
            if (this.option.checkbox) {
                str += "<div class='table-cell' style='width:30px;height:" + this.rowHeight + "px'>" +
                        "<div class='cell-inner' style='text-align:center;line-height:" + (this.rowHeight - 10) + "px'><input type='checkbox'/></div>" +
                        "</div>";
            }
            for (var q in this.option.deal) {
                str += "<div class='table-cell table-deal' style='height:" + this.rowHeight + "px;width:30px;'>" +
                        "<div class='cell-inner' style='line-height:" + (this.rowHeight - 10) + "px;'>" +
                        "<div class='btnx' title='" + this.option.deal[q].title + "' type='" + this.option.deal[q].type + "'><i class='" + this.option.deal[q].img + "'></i></div>" +
                        "</div>" +
                        "</div>";
            }
            str += "</div>";
        }
        if (str !== "") {
            str += "<div class='table-row' style='visibility:hidden'>" +
                    "<div class='table-cell' style='height:40px;width:30px;'></div>" +
                    "</div>";
        }
        return str;
    },
    drawRight: function () {
        var wid = 0;
        if (this.option.num) {
            wid += 30;
        }
        if (this.option.checkbox) {
            wid += 30;
        }
        for (var i in this.option.deal) {
            wid += 31;
        }
        var str = "<div class='tablebody-right' style='left:" + wid + "px'>";
        str += this.drawRightHead();
        str += "<div class='tablebody-rightbody'>";
        str += "</div>";
        str += "</div>";
        return str;
    },
    drawRightHead: function () {
        var str = "<div class='tablebody-righthead'>";
        for (var i in this.option.colss) {
            if (!this.option.colss[i].cols) {
                str += "<div" + (this.option.colss[i].sort ? " sort='" + this.option.colss[i].key + "'" : "") + " class='table-cell" + (this.option.colss[i].sort ? " tsort" : "") + "' style='width:" + (this.option.colss[i].width ? this.option.colss[i].width : 340) + "px;height:40px'>" +
                        "<div class='cell-inner' style='text-align:center;font-weight:boldx;line-height:30px'>" +
                        this.option.colss[i].name +
                        (this.option.colss[i].sort ? "<div class='table-sort'><i class='fa fa-chevron-circle-down'></i></div>" : "") +
                        "</div>" +
                        "</div>";
                if (this.option.colss[i].sort) {
                    this.sort[this.option.colss[i].key] = "";
                }
            } else {
                str += "<div class='table-cell' style='width:px;height:40px;border-right:0;font-weight:boldx;'>";
                str += "<div style='border-bottom:1px solid #D7D7D7;border-right:1px solid #D7D7D7;text-align:center;line-height:20px;'>" + this.option.colss[i].name + "</div>";
                for (var t in this.option.colss[i].cols) {
                    str += "<div" + (this.option.colss[i].cols[t].sort ? " sort='" + this.option.colss[i].cols[t].key + "'" : "") + " class='table-subcell" + (this.option.colss[i].cols[t].sort ? " tsort" : "") + "' style='width:" + (this.option.colss[i].cols[t].width ? this.option.colss[i].cols[t].width : 340) + "px;'>" +
                            "<div class='subcell-inner' style='line-height:19px;text-align:center'>" +
                            this.option.colss[i].cols[t].name +
                            (this.option.colss[i].cols[t].sort ? "<div class='table-sort'><i class='fa fa-chevron-circle-down'></i></div>" : "") +
                            "</div>" +
                            "</div>";
                    if (this.option.colss[i].cols[t].sort) {
                        this.sort[this.option.colss[i].cols[t].key] = "asc";
                    }
                }
                str += "</div>";
            }
        }
        str += "<div class='table-cell' style='border-right:0;'><div style='width:200px;height:39px;'></div></div>" +
                "</div>";
        return str;
    },
    drawRightBody: function () {
        var str = "", widt = 0;
        for (var i in this.option.cols) {
            widt += this.option.cols[i].width + 1;
        }
        str += "<div style='width:" + widt + "px'>";
        for (var i in this.tableData.rows) {
            str += "<div class='table-row" + (i !== 0 && i % 2 ? "" : " color") + "' style='height:" + this.rowHeight + "px' num='" + i + "'>";
            for (var t in this.option.cols) {
                var val = this.tableData.rows[i][this.option.cols[t].key];
                if (this.option.cols[t].hook) {
                    val = this.option.cols[t].hook(this.tableData.rows[i][this.option.cols[t].key]);
                    if (!val) {
                        val = this.tableData.rows[i][this.option.cols[t].key];
                    }
                }
                if (!val) {
                    val = "";
                }
                val = val + "";
                str += "<div class='table-cell' style='width:" + (this.option.cols[t].width ? this.option.cols[t].width : 340) + "px;height:" + this.rowHeight + "px'>" +
                        "<div class='cell-inner'" + (this.option.cols[t].fn ? " fn=" + t : "") + " style='" + (this.option.cols[t].center ? "text-align:center;" : "") + "line-height:" + (this.rowHeight - 10) + "px' title='" + (val[0] === "<" ? "" : val) + "'>" + val + "</div>" +
                        "</div>";
            }
            str += "</div>";
        }
        if (this.tableData.rows.length === 0) {
            this.shownodata();
        } else {
            this.hidenodata();
        }
        str += "</div>";
        return str;
    },
    setPageControl: function () {
        var c = this.dom.find(".table-foot");
        var prevpage = c.find(".prev"),
                nextpage = c.find(".next"),
                dots1 = c.find(".dot1"),
                dots2 = c.find(".dot2");
        var btns = {
            page0: c.find(".page0"),
            page1: c.find(".page1"),
            page2: c.find(".page2"),
            page3: c.find(".page3"),
            page4: c.find(".page4")
        };
        var num = this.currentPage, total = this.pageCount;
        if (total <= 5) {
            dots1.css("display", "none");
            dots2.css("display", "none");
            for (var i = 0; i < 5; i++) {
                if (i < total) {
                    btns["page" + i].css("display", "inline-block");
                    btns["page" + i].html(i + 1);
                } else {
                    btns["page" + i].css("display", "none");
                }
            }
        } else {
            btns.page4.html(total);
        }
        for (var i = 0; i < 5; i++) {
            btns["page" + i].removeClass("success");
        }
        if (num < 4) {
            if (total > 5) {
                dots1.css("display", "none");
                dots2.css("display", "inline-block");
            }
            btns["page" + (num - 1)].addClass("success");
            btns.page1.html(2);
            btns.page2.html(3);
            btns.page3.html(4);
        } else {
            if (num <= this.pageCount - 3) {
                dots1.css("display", "inline-block");
                dots2.css("display", "inline-block");
                btns.page1.html(num - 1);
                btns.page2.html(num);
                btns.page3.html(num + 1);
                btns.page2.addClass("success");
            } else {
                if (total > 5) {
                    dots1.css("display", "inline-block");
                    dots2.css("display", "none");
                }
                btns.page1.html(this.pageCount - 3);
                btns.page2.html(this.pageCount - 2);
                btns.page3.html(this.pageCount - 1);
                btns["page" + (4 - (this.pageCount - num))].addClass("success");
            }
        }
        if (num === 1) {
            if (this.pageCount === 1) {
                prevpage.addClass("disabled");
                nextpage.addClass("disabled");
            } else {
                prevpage.addClass("disabled");
                nextpage.removeClass("disabled");
            }
        } else if (num === this.pageCount) {
            prevpage.removeClass("disabled");
            nextpage.addClass("disabled");
        } else {
            prevpage.removeClass("disabled");
            nextpage.removeClass("disabled");
        }
        this.dom.find(".table-info").html("显示从 " + ((this.currentPage - 1) * this.rowSize + 1) + " 到 " +
                (this.rowCount === this.rowSize ? this.currentPage * this.rowSize : (this.totalCount)) +
                " 条•总 " + this.totalCount + " 条•每页显示 " + this.rowSize + " 条");
    },
    refresh: function (data) {
        var sort = "";
        for (var i in this.sort) {
            if (this.sort[i] !== "") {
                sort += i + ":" + this.sort[i] + ",";
            }
        }
        sort = sort.length > 1 ? sort.substring(0, sort.length - 1) : "";
        var x = {
            page: this.currentPage,
            pageSize: this.rowSize,
            sort: sort
        };
        $.extend(this.data, data);
        $.extend(x, this.data);
        var ths = this;
        this.loadingx("加载数据中");
        this.postData({
            url: this.option.dataurl,
            data: x,
            back: function (e) {
                ths.closeloadingx();
                ths.tableData = e;
                ths.rowCount = e.rows.length;
                ths.pageCount = e.total % ths.rowSize === 0 ? (e.total / ths.rowSize) : (parseInt(e.total / ths.rowSize) + 1);
                ths.totalCount = e.total;
                var left = null;
                if (ths.dom.find(".tablebody-leftcon").length > 0) {
                    left = ths.dom.find(".tablebody-leftcon").html(ths.drawLeftBody());
                }
                var str = ths.drawRightBody();
                var right = ths.dom.find(".tablebody-rightbody").html(str);
                right.find(".table-row").each(function () {
                    $(this).bind("click", function (e) {
                        if (ths.option.singleselect) {
                            ths.dom.find(".tablebody-leftcon input[type='checkbox']").each(function () {
                                if ($(this).get(0).checked) {
                                    ths.dispatchEvent("unselectrow", ths.tableData.rows[$(this).parent(3).attr("num")]);
                                }
                                $(this).get(0).checked = false;
                            });
                            ths.dom.find(".tablebody-leftcon .table-row").each(function () {
                                $(this).removeClass("active");
                            });
                            ths.dom.find(".tablebody-rightbody .table-row").each(function () {
                                $(this).removeClass("active");
                            });
                        }
                        var num = $(this).attr("num"), isn = false;
                        $(this).toggleClass("active");
                        var a = left.find(".table-row").eq(parseInt(num));
                        a.toggleClass("active");
                        if (a.find("input").length > 0) {
                            if (a.find("input").get(0).checked) {
                                a.find("input").get(0).checked = false;
                                ths.dispatchEvent("unselectrow", ths.tableData.rows[num]);
                            } else {
                                a.find("input").get(0).checked = true;
                                ths.dispatchEvent("selectrow", ths.tableData.rows[num]);
                            }
                        }
                        e.stopPropagation();
                    });
                });
                if (left) {
                    left.children().each(function () {
                        $(this).bind("click", function (e) {
                            var num = $(this).attr("num");
                            if (ths.option.singleselect) {
                                ths.dom.find(".tablebody-leftcon input[type='checkbox']").each(function () {
                                    if ($(this).get(0) !== e.target) {
                                        ths.dispatchEvent("unselectrow", ths.tableData.rows[$(this).parent(3).attr("num")]);
                                        $(this).get(0).checked = false;
                                    }
                                });
                                ths.dom.find(".tablebody-leftcon .table-row").each(function () {
                                    $(this).removeClass("active");
                                });
                                ths.dom.find(".tablebody-rightbody .table-row").each(function () {
                                    $(this).removeClass("active");
                                });
                            }
                            if (e.target.nodeName !== "INPUT") {
                                $(this).toggleClass("active");
                                right.find(".table-row").eq(parseInt(num)).toggleClass("active");
                                var a = $(this);
                                if (a.find("input").length > 0) {
                                    if (a.find("input").get(0).checked) {
                                        a.find("input").get(0).checked = false;
                                    } else {
                                        a.find("input").get(0).checked = true;
                                    }
                                }
                            } else {
                                if (e.target.checked) {
                                    $(this).addClass("active");
                                    right.find(".table-row").eq(parseInt(num)).addClass("active");
                                    ths.dispatchEvent("selectrow", ths.tableData.rows[num]);
                                } else {
                                    $(this).removeClass("active");
                                    right.find(".table-row").eq(parseInt(num)).removeClass("active");
                                    ths.dispatchEvent("unselectrow", ths.tableData.rows[num]);
                                }
                            }
                            e.stopPropagation();
                        });
                    });
                    left.find(".btnx").each(function () {
                        $(this).click(function (e) {
                            var type = $(this).attr("type");
                            for (var i in ths.option.deal) {
                                if (ths.option.deal[i].type === type) {
                                    var num = $(this).parent().parent().parent().attr("num");
                                    var data = ths.tableData.rows[num];
                                    ths.dispatchEvent(type, {
                                        btn: $(this),
                                        data: data
                                    });
                                    break;
                                }
                            }
                            e.stopPropagation();
                        });
                    });
                }
                right.find("div[fn]").each(function () {
                    $(this).click(function (e) {
                        var index = $(this).attr("fn"), num = $(this).parent().parent().attr("num");
                        var fn = ths.option.cols[index].fn;
                        if (fn && $.util.isFunction(fn)) {
                            fn.call(ths, e, ths.tableData.rows[num]);
                        } else {
                            ths.dispatchEvent(fn, {
                                btn: $(this),
                                data: ths.tableData.rows[num]
                            });
                        }
                    });
                });
                ths.setPageControl();
            },
            dataerror: function () {
                ths.loadingx("加载数据失败");
                setTimeout(function () {
                    ths.closeloadingx();
                }, 2000);
            },
            neterror: function () {
                ths.loadingx("加载数据失败");
                setTimeout(function () {
                    ths.closeloadingx();
                }, 2000);
            }
        });
    },
    loadingx: function (txt) {
        if (this.dom.find(".table-loading").length <= 0) {
            $("<div class='table-loading'><div class='table-loading-con'><i class='fa fa-refresh fa-spin'></i>" + txt + "</div></div>").appendTo(this.dom);
        } else {
            this.dom.find(".table-loading").children().eq(0).html(txt);
        }
    },
    closeloadingx: function () {
        if (this.dom) {
            var a = this.dom.find(".table-loading");
            if (a.length > 0) {
                a.remove();
            }
        }
    },
    gotoPage: function (num, data) {
        if (num === 1 || num > 0 && this.pageCount && num <= this.pageCount) {
            this.currentPage = num;
            this.refresh(data);
        }
    },
    nextPage: function () {
        var a = this.currentPage;
        a++;
        if (this.pageCount && a <= this.pageCount) {
            this.gotoPage(a);
        }
    },
    prevPage: function () {
        var a = this.currentPage;
        a--;
        if (a > 0) {
            this.gotoPage(a);
        }
    },
    unselect: function (id) {

        var k = this.tableData.rows, num = -1;
        for (var i in k) {
            if (k[i].id === id) {
                num = i;
                break;
            }
        }
        if (num !== -1) {
            this.dom.find(".tablebody-leftcon .table-row").eq(num).removeClass("active").find("input").get(0).checked = false;
            this.dom.find(".tablebody-rightbody .table-row").eq(num).removeClass("active");
        }
    },
    selectRow: function (num, isactive) {
        if (arguments.length === 1) {
            isactive = true;
        }
        var k = this.dom.find(".tablebody-rightbody ,table-row").eq(parseInt(num));
        if (k.length > 0) {
            if (isactive) {
                k.addClass("active");
            } else {
                k.removeClass("active");
            }
        }
        var b = this.dom.find(".tablebody-leftcon .table-row").eq(parseInt(num));
        if (b.length > 0) {
            if (isactive) {
                b.addClass("active");
            } else {
                b.removeClass("active");
            }
        }
    },
    getSelectRows: function () {
        var result = [], ths = this;
        this.dom.find(".tablebody-leftcon input[type='checkbox']").each(function () {
            if ($(this).get(0).checked) {
                var num = $(this).parent().parent().parent().attr("num");
                result.push(ths.tableData.rows[num]);
            }
        });
        return result;
    },
    getSelectData: function () {
        return this.getSelectRows();
    },
    shownodata: function () {
        this.dom.append("<div class='table-nodata'><div class='table-nodata-desc'><i class='fa fa-book'></i> 没有用于显示的数据</div></div>");
    },
    hidenodata: function () {
        this.dom.find(".table-nodata").remove();
    }
});