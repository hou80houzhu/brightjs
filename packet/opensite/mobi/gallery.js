/*!
 * @packet opensite.mobi.gallery; 
 * @require opensite.mobi.util.file;
 * @template opensite.mobi.template.gallery:temp;
 * @css opensite.mobi.style.gallery;
 */
Module({
    name: "singlepicwrapper",
    extend: "viewgroup",
    className: "singlepicwrapper",
    option: {
        thumb: "",
        pic: ""
    },
    init: function () {
        this.dom.append("<div class='singlepicwrapper-thumb'><img src='" + this.option.thumb + "'></div>");
        this.dom.append("<div class='singlepicwrapper-loading'><i class='fa fa-repeat fa-spin'></i> loading...</div>");
        var ths = this;
        $.loader().image(this.option.pic, function () {
            ths.addChild({
                type: "@.singlepic",
                option: {
                    pic: ths.option.pic
                },
                container: ths.dom
            });
            ths.dom.children(0).remove();
            ths.dom.children(0).remove();
        }, function () {
            ths.remove();
            $.toast("图片加载出错");
        });
    }
});
Module({
    name: "singlepic",
    extend: "view",
    className: "singlepic",
    option: {
        pic: basePath + "packet/mobi/style/images/test.jpg"
    },
    init: function () {
        this.isfit = false;
        var canvas = document.createElement("canvas");
        canvas.width = this.dom.width();
        canvas.height = this.dom.height();
        this.width = this.dom.width();
        this.height = this.dom.height();
        this.ctx = canvas.getContext("2d");
        this.dom.append(canvas);
        this.loadPic().scope(this).done(function (a) {
            this.image = a;
            this.drawPicDefault();
            this.drawToolbar();
        });
        var a = 0, ths = this, offset = 0, isc = false, ismove = false, touchis = false, timelast = new Date().getTime(), firstclick = 0;
        var _offsetX = 0, _offsetY = 0;
        this.dom.bind("touchstart", function (e) {
            if (e.touches.length === 2) {
                isc = true;
                ismove = false;
                touchis = false;
                offset = Math.sqrt(Math.pow((e.touches[0].pageX - e.touches[1].pageX), 2) + Math.pow((e.touches[0].pageY - e.touches[1].pageY), 2));
                firstclick = 0;
            } else if (e.touches.length === 1) {
                ismove = true;
                isc = false;
                touchis = true;
                timelast = new Date().getTime();
                _offsetX = e.touches[0].pageX - ths.__x;
                _offsetY = e.touches[0].pageY - ths.__y;
            }
            ths.render();
            e.stopPropagation();
            e.preventDefault();
        }).bind("touchmove", function (e) {
            touchis = false;
            if (e.touches.length === 2 && isc) {
                var d = Math.sqrt(Math.pow((e.touches[0].pageX - e.touches[1].pageX), 2) + Math.pow((e.touches[0].pageY - e.touches[1].pageY), 2)) - offset;
                var w = ths.__width + d / 5;
                var h = ths._oheight / ths._owidth * w;
                var _mx = ths.__x + ths.__width / 2 - ths.width / 2;
                var _my = ths.__y + ths.__height / 2 - ths.height / 2;
                var x = ths.__x - (w - ths.__width) / 2 + _mx * (w - ths.__width) / w;
                var y = ths.__y - (h - ths.__height) / 2 + _my * (h - ths.__height) / h;
                ths.__x = x;
                ths.__y = y;
                ths.__width = w;
                ths.__height = h;
            } else if (e.touches.length === 1 && ismove) {
                if (ths.__width > ths.width) {
                    var _n = e.touches[0].pageX - _offsetX;
                    if (_n > 0) {
                        _n = 0;
                    }
                    if (_n < ths.width - ths.__width) {
                        _n = ths.width - ths.__width;
                    }
                    ths.__x = _n;
                }
                if (ths.__height > ths.height) {
                    var _m = e.touches[0].pageY - _offsetY;
                    if (_m > 0) {
                        _m = 0;
                    }
                    if (_m < ths.height - ths.__height) {
                        _m = ths.height - ths.__height;
                    }
                    ths.__y = _m;
                }
            }
            ths.render();
            e.stopPropagation();
            e.preventDefault();
        }).bind("touchend", function (e) {
            ismove = false;
            isc = false;
            var x = ths.__x, y = ths.__y, w = ths.__width, h = ths.__height;

            if (ths.__width < ths.width || ths.__height < ths.height) {
                if (ths.__width < ths.width && ths.__height > ths.height) {
                    x = (ths.width - ths.__width) / 2;
                    if (ths.__y > 0) {
                        y = 0;
                    }
                    if (ths.__y < ths.height - ths.__height) {
                        y = ths.height - ths.__height;
                    }
                } else if (ths.__width > ths.width && ths.__height < ths.height) {
                    y = (ths.height - ths.__height) / 2;
                    if (ths.__x > 0) {
                        x = 0;
                    }
                    if (ths.__x < ths.width - ths.__width) {
                        x = ths.width - ths.__width;
                    }
                } else {
                    h = ths.height;
                    w = this._owidth / this._oheight * ths.height;
                    if (w <= ths.width) {
                        h = ths._oheight / ths._owidth * w;
                        if (h > ths.height) {
                            h = ths.height;
                            w = ths._owidth / ths._oheight * h;
                        }
                    } else {
                        w = ths.width;
                        h = ths._oheight / ths._owidth * w;
                        if (h > ths.height) {
                            h = ths.height;
                            w = ths._owidth / ths._oheight * h;
                        }
                    }
                    x = (ths.width - w) / 2;
                    y = (ths.height - h) / 2;
                }
            } else {
                if (ths.__y > 0) {
                    y = 0;
                }
                if (ths.__x > 0) {
                    x = 0;
                }
            }
            ths.__x = x;
            ths.__y = y;
            ths.__width = w;
            ths.__height = h;
            ths.render();
            if (e.changedTouches.length === 1) {
                var p = new Date().getTime() - timelast;
                if (touchis && (p) < 90) {
                    firstclick++;
                    var npp = setTimeout(function () {
                        if (firstclick >= 2) {
                            ths.dispatchEvent("doubleclick");
                        }
                        firstclick = 0;
                        clearTimeout(npp);
                    }, 180);
                }
            }
            touchis = false;
            e.stopPropagation();
            e.preventDefault();
        });
    },
    find_back: function (dom) {
        dom.button(function (e, ths) {
            ths.parentView.remove();
        }, this);
    },
    find_download: function (dom) {
        dom.button(function (e, ths) {
            var a = $("iframe");
            if (a.length === 0) {
                $("<iframe src='" + (ths.option.pic) + "' style='position:absolute;left:-99999px;top:-999999'></iframe>").appendTo("body");
            } else {
                a.attr("src", ths.option.pic);
            }
        }, this);
    },
    drawToolbar: function () {
        var str = "<div class='singlepic-toolbar'>";
        str += "<div class='singlepic-toolbar-btn' data-find='back'><i class='fa fa-arrow-left'></i></div>";
        str += "<div class='singlepic-toolbar-btne'>" +
                "<div class='singlepic-toolbar-btn' data-find='download'><i class='fa fa-download'></i></div>" +
                "</div>";
        str += "</div>";
        this.dom.append(str);
    },
    loadPic: function () {
        var ps = $.promise(), ths = this;
        $.loader().image(this.option.pic, function () {
            ths._owidth = this.width;
            ths._oheight = this.height;
            ps.resolve(this);
        });
        return ps;
    },
    drawPicDefault: function () {
        this.isfit = true;
        var _x, _y, _w, _h, width = this.width, height = this.height;
        _w = this.image.width / this.image.height * height;
        if (_w <= width) {
            _h = height;
            _x = (width - _w) / 2;
            _y = 0;
        } else {
            _h = this.image.height / this.image.width * width;
            if (_h <= height) {
                _w = width;
                _x = 0;
                _y = (height - _h) / 2;
            } else {
                _w = this.image.width;
                _h = this.image.height;
                _x = (width - this.image.width) / 2;
                _y = (height - this.image.height) / 2;
            }
        }
        this.__x = _x;
        this.__y = _y;
        this.__width = _w;
        this.__height = _h;
        this.render();
    },
    render: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.image, this.__x, this.__y, this.__width, this.__height);
    },
    drawPicOriginal: function () {
        this.isfit = false;
        var _x, _y, _w, _h;
        _w = this.image.width;
        _h = this.image.height;
        if (_w > this.width) {
            _x = (this.width - _w) / 2;
        } else {
            _x = -(_w - this.width) / 2;
        }
        if (_y > this.height) {
            _y = (this.height - _h) / 2;
        } else {
            _y = -(_h - this.height) / 2;
        }
        this.__x = _x;
        this.__y = _y;
        this.__width = _w;
        this.__height = _h;
        this.render();
    },
    event_doubleclick: function () {
        if (this.isfit) {
            this.drawPicOriginal();
        } else {
            this.drawPicDefault();
        }
    }
});
Module({
    name: "photocutter",
    extend: "view",
    className: "photocutter",
    option: {
        width: 300,
        height: 300,
        name: "file",
        imagefile: null
    },
    init: function () {
        this.isfit = false;
        var canvas = document.createElement("canvas");
        canvas.width = this.dom.width();
        canvas.height = this.dom.height();
        this.width = this.dom.width();
        this.height = this.dom.height();
        this.ctx = canvas.getContext("2d");
        this.dom.append(canvas);
        this.drawMask();
        this.loadPic().scope(this).done(function (a) {
            this.image = a;
            this.drawToolbar();
            this.drawPicDefault();
        });
        var a = 0, ths = this, offset = 0, isc = false, ismove = false, touchis = false, timelast = new Date().getTime(), firstclick = 0;
        var _offsetX = 0, _offsetY = 0;
        this.dom.bind("touchstart", function (e) {
            if (e.touches.length === 2) {
                isc = true;
                ismove = false;
                touchis = false;
                offset = Math.sqrt(Math.pow((e.touches[0].pageX - e.touches[1].pageX), 2) + Math.pow((e.touches[0].pageY - e.touches[1].pageY), 2));
            } else if (e.touches.length === 1) {
                ismove = true;
                isc = false;
                touchis = true;
                timelast = new Date().getTime();
                _offsetX = e.touches[0].pageX - ths.__x;
                _offsetY = e.touches[0].pageY - ths.__y;
            }
            ths.render();
            e.stopPropagation();
            e.preventDefault();
        }).bind("touchmove", function (e) {
            touchis = false;
            if (e.touches.length === 2 && isc) {
                var d = Math.sqrt(Math.pow((e.touches[0].pageX - e.touches[1].pageX), 2) + Math.pow((e.touches[0].pageY - e.touches[1].pageY), 2)) - offset;
                var w = ths.__width + d / 5;
                var h = ths._oheight / ths._owidth * w;
                var _mx = ths.__x + ths.__width / 2 - ths.width / 2;
                var _my = ths.__y + ths.__height / 2 - ths.height / 2;
                var x = ths.__x - (w - ths.__width) / 2 + _mx * (w - ths.__width) / w;
                var y = ths.__y - (h - ths.__height) / 2 + _my * (h - ths.__height) / h;
                ths.__x = x;
                ths.__y = y;
                ths.__width = w;
                ths.__height = h;
            } else if (e.touches.length === 1 && ismove) {
                if (ths.__width > ths.option.width) {
                    var _n = e.touches[0].pageX - _offsetX;
                    if (_n > (ths.width - ths.option.width) / 2) {
                        _n = (ths.width - ths.option.width) / 2;
                    }
                    if (_n < ths.width - ths.__width - (ths.width - ths.option.width) / 2) {
                        _n = ths.width - ths.__width - (ths.width - ths.option.width) / 2;
                    }
                    ths.__x = _n;
                }
                if (ths.__height > ths.option.height) {
                    var _m = e.touches[0].pageY - _offsetY;
                    if (_m > (ths.height - ths.option.height) / 2) {
                        _m = (ths.height - ths.option.height) / 2;
                    }
                    if (_m < ths.height - ths.__height - (ths.height - ths.option.height) / 2) {
                        _m = ths.height - ths.__height - (ths.height - ths.option.height) / 2;
                    }
                    ths.__y = _m;
                }
            }
            ths.render();
            e.stopPropagation();
            e.preventDefault();
        }).bind("touchend", function (e) {
            ismove = false;
            isc = false;
            var x = ths.__x, y = ths.__y, w = ths.__width, h = ths.__height;
            if (ths.__width < ths.option.width || ths.__height < ths.option.height) {
                if (w < ths.option.width) {
                    w = ths.option.width;
                    h = ths.image.height / ths.image.width * w;
                    if (h < ths.option.height) {
                        h = ths.option.height;
                        w = ths.image.width / ths.image.height * h;
                    }
                }
                if (h < ths.option.height) {
                    h = ths.option.height;
                    w = ths.image.width / ths.image.height * h;
                    if (w < ths.option.width) {
                        w = ths.option.width;
                        h = ths.image.height / ths.image.width * w;
                    }
                }
                x = (ths.width - w) / 2;
                y = (ths.height - h) / 2;
            }
            ths.__x = x;
            ths.__y = y;
            ths.__width = w;
            ths.__height = h;
            ths.render();
            touchis = false;
            e.stopPropagation();
            e.preventDefault();
        });
    },
    find_back: function (dom) {
        dom.button(function (e, ths) {
            ths.remove();
        }, this);
    },
    find_check: function (dom) {
        dom.button(function (e, ths) {
            ths.upload();
        }, this);
    },
    loadPic: function () {
        var ps = $.promise(), ths = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            $.loader().image(e.target.result, function () {
                ths._owidth = this.width;
                ths._oheight = this.height;
                ps.resolve(this);
            });
        };
        reader.readAsDataURL(this.option.imagefile);
        return ps;
    },
    drawPicDefault: function () {
        this.isfit = true;
        var _x, _y, _w, _h, width = this.width, height = this.height;
        _w = this.image.width / this.image.height * height;
        if (_w <= width) {
            _h = height;
            _x = (width - _w) / 2;
            _y = 0;
        } else {
            _h = this.image.height / this.image.width * width;
            if (_h <= height) {
                _w = width;
                _x = 0;
                _y = (height - _h) / 2;
            } else {
                _w = this.image.width;
                _h = this.image.height;
                _x = (width - this.image.width) / 2;
                _y = (height - this.image.height) / 2;
            }
        }
        if (_w < this.option.width) {
            _w = this.option.width;
            _h = this.image.height / this.image.width * _w;
            if (_h < this.option.height) {
                _h = this.option.height;
                _w = this.image.width / this.image.height * _h;
            }
        }
        if (_h < this.option.height) {
            _h = this.option.height;
            _w = this.image.width / this.image.height * _h;
            if (_w < this.option.width) {
                _w = this.option.width;
                _h = this.image.height / this.image.width * _w;
            }
        }
        _x = (width - _w) / 2;
        _y = (height - _h) / 2;
        this.__x = _x;
        this.__y = _y;
        this.__width = _w;
        this.__height = _h;
        this.render();
    },
    render: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.image, this.__x, this.__y, this.__width, this.__height);
    },
    drawMask: function () {
        var maskwidth = (this.width - this.option.width) / 2;
        var maskheight = (this.height - this.option.height) / 2;
        var str = "<div class='photocutter-mask'>";
        str += "<div class='phototcutter-mask-bg' style='left:0;top:0;width:" + maskwidth + "px;bottom:0'></div>";
        str += "<div class='phototcutter-mask-bg' style='left:" + maskwidth + "px;top:0;right:" + maskwidth + "px;height:" + maskheight + "px'></div>";
        str += "<div class='phototcutter-mask-bg' style='right:0;top:0;bottom:0;width:" + maskwidth + "px'></div>";
        str += "<div class='phototcutter-mask-bg' style='left:" + maskwidth + "px;bottom:0;right:" + maskwidth + "px;height:" + maskheight + "px'></div>";
        str += "<div class='phototcutter-mask-squrt' style='left:" + maskwidth + "px;top:" + maskheight + "px;right:" + maskwidth + "px;bottom:" + maskheight + "px'></div>";
        str += "</div>";
        $(str).appendTo(this.dom);
    },
    drawToolbar: function () {
        var str = "<div class='photocutter-toolbar'>";
        str += "<div class='photocutter-toolbar-btn' data-find='back'><i class='fa fa-arrow-left'></i></div>";
        str += "<div class='photocutter-toolbar-btne'>" +
                "<div class='photocutter-toolbar-btn' data-find='check'><i class='fa fa-check'></i></div>" +
                "</div>";
        str += "</div>";
        this.dom.append(str);
    },
    getImageDate: function (x, y, width, height) {
        var xis = x || 0, yis = y || 0, widthis = width || this.width, heightis = height || this.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = widthis;
        canvas.height = heightis;
        ctx.drawImage(this.ctx.canvas, xis, yis, widthis, heightis, 0, 0, widthis, heightis);
        return canvas.toDataURL("image/png");
    },
    download: function () {
        var option = this.option;
        var uri = this.getImageDate((this.width - this.option.width) / 2, (this.height - this.option.height) / 2, this.option.width, this.option.height);
        var file = require("@file");
        var blob = file.getBlobFromURI(uri);
        file.saveAs(blob, "photocutter.png");
    },
    upload: function () {
        $.loadingbar().showLoading();
        var option = this.option;
        var uri = this.getImageDate((this.width - this.option.width) / 2, (this.height - this.option.height) / 2, this.option.width, this.option.height);
        var file = require("@file");
        var blob = file.getBlobFromURI(uri);
        var ths = this;
        var formdata = new FormData();
        formdata.append(option.name, blob);
        formdata.append("type", "pic");
        formdata.append("filename", "pic.png");
        $.ajax({
            url: basePath + "file/upload",
            data: formdata,
            method: "post",
            dataType: "json",
            headers: {},
            events: {
                load: function (e) {
                    var a = this.response.responseText;
                    try {
                        a = window.JSON.parse(a);
                    } catch (e) {
                        a = {};
                    }
                    ths.dispatchEvent("uploaddone", a.data);
                    ths.remove();
                },
                progress: function (e) {
                },
                error: function (e) {
                    $.toast("上传失败");
                }
            }
        });
    }
});