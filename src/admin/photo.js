/*!
 * @packet admin.photo;
 * @require admin.util.canvas;
 * @require admin.util.file;
 * @css admin.style.photocutter;
 */
Module({
    name: "photocutter",
    className: "photocutter",
    extend: "view",
    option: {
        filename: "file",
        url: "",
        picWidth: 100,
        picHeight: 100,
        type: ".png,.gif,.jpg,.jpeg",
        rotateoffset: 10,
        zoomoffset: 0.2,
        tools: [
            {type: "zoomin", icon: "fa-search-plus"},
            {type: "zoomout", icon: "fa-search-minus"},
            {type: "rotateleft", icon: "fa-undo"},
            {type: "rotateright", icon: "fa-repeat"},
            {type: "download", icon: "fa-download"},
            {type: "reset", icon: "fa-refresh"}
        ]
    },
    init: function (option) {
        var ths = this;
        var canvas = require("@canvas");
        option.sceneWidth = this.dom.width();
        option.sceneHeight = this.dom.height() - 30;
        var scene = this.dom.display();
        var baseContainer = canvas.create("DisplayObjectContainer", {
            id: "aa",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: 0,
            y: 0
        });
        var r = Math.sqrt(option.sceneWidth * option.sceneWidth + option.sceneHeight * option.sceneHeight);
        var imageContainer = canvas.create("DisplayObjectContainer", {
            id: "imageContainer",
            width: r,
            height: r,
            x: -(r - option.sceneWidth) / 2,
            y: -(r - option.sceneHeight) / 2,
            init: function () {
                this.ismove = false;
                this.cleft = 0;
                this.ctop = 0;
            },
            onmousedown: function (e) {
                var b = this.getChildAt(0);
                var a = b.getLocalRelativeRootPoint(e.pageX, e.pageY);
                this.cleft = a.x - b.x();
                this.ctop = a.y - b.y();
            },
            onmousemove: function (e) {
                if (this.ismove) {
                    var b = this.getChildAt(0);
                    var a = b.getLocalRelativeRootPoint(e.pageX, e.pageY);
                    var _x = a.x - this.cleft;
                    var _y = a.y - this.ctop;
                    if (this.getChildAt(0).width() > this.getChildAt(1).width() || this.getChildAt(0).height() > this.getChildAt(1).height()) {
                        if (_x < this.getChildAt(1).x()) {
                            if (_x > this.getChildAt(1).x() - (this.getChildAt(0).width() - this.getChildAt(1).width())) {
                                b.x(a.x - this.cleft);
                            } else {
                                b.x(this.getChildAt(1).x() - (this.getChildAt(0).width() - this.getChildAt(1).width()));
                            }
                        } else {
                            b.x(this.getChildAt(1).x());
                        }
                        if (_y < this.getChildAt(1).y()) {
                            if (_y > this.getChildAt(1).y() - (this.getChildAt(0).height() - this.getChildAt(1).height())) {
                                b.y(a.y - this.ctop);
                            } else {
                                b.y(this.getChildAt(1).y() - (this.getChildAt(0).height() - this.getChildAt(1).height()));
                            }
                        } else {
                            b.y(this.getChildAt(1).y());
                        }
                    }
                }
            },
            onmouseup: function () {
                this.ismove = false;
            }
        });
        imageContainer.rotatePoint(option.sceneWidth / 2, option.sceneHeight / 2);
        var image = canvas.create("ImageDisplay", {
            id: "image",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: (r - option.sceneWidth) / 2,
            y: (r - option.sceneHeight) / 2,
            rotate: 0,
            onmousedown: function () {
                this.parent().ismove = true;
            }
        });
        image.rotatePoint((r - option.sceneWidth) / 2, (r - option.sceneHeight) / 2);
        var squart = canvas.create("SquartDisplay", {
            id: "squart",
            width: option.picWidth,
            height: option.picHeight,
            x: (r - option.picWidth) / 2,
            y: (r - option.picHeight) / 2,
            onmousedown: function () {
                this.parent().ismove = true;
            }
        });

        var mask = canvas.create("DisplayObjectContainer", {
            id: "squart",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: 0,
            y: 0,
            alpha: 0.6,
            event: false,
            backgroundColor: "rgba(36,33,33,1)"
        });
        var m1 = canvas.create("SquartDisplay", {
            id: "squart",
            width: (option.sceneWidth - option.picWidth) / 2,
            height: option.sceneHeight,
            x: 0,
            y: 0,
            backgroundColor: "rgba(36,33,33,1)"
        });
        var m2 = canvas.create("SquartDisplay", {
            id: "squart",
            width: option.picWidth,
            height: (option.sceneHeight - option.picHeight) / 2,
            x: (option.sceneWidth - option.picWidth) / 2,
            y: 0,
            backgroundColor: "rgba(36,33,33,1)"
        });
        var m3 = canvas.create("SquartDisplay", {
            id: "squart",
            width: (option.sceneWidth - option.picWidth) / 2,
            height: option.sceneHeight,
            x: (option.sceneWidth - option.picWidth) / 2 + option.picWidth,
            y: 0,
            backgroundColor: "rgba(36,33,33,1)"
        });
        var m4 = canvas.create("SquartDisplay", {
            id: "squart",
            width: option.picWidth,
            height: (option.sceneHeight - option.picHeight) / 2,
            x: (option.sceneWidth - option.picWidth) / 2,
            y: (option.sceneHeight - option.picHeight) / 2 + option.picHeight,
            backgroundColor: "rgba(36,33,33,1)"
        });
        var m5 = canvas.create("SquartDisplay", {
            id: "squart",
            width: option.picWidth,
            height: option.picHeight,
            x: (option.sceneWidth - option.picWidth) / 2,
            y: (option.sceneHeight - option.picHeight) / 2,
            borderSize: 3,
            borderColor: "white"
        });
        mask.addChild(m1).addChild(m2).addChild(m3).addChild(m4).addChild(m5);
        imageContainer.addChild(image).addChild(squart);
        baseContainer.addChild(imageContainer);
        scene.addChild(baseContainer);
        scene.addChild(mask);
        this.image = image;
        this.imageContainer = imageContainer;
        this.baseContainer = baseContainer;
        this.r = r;
        var str = "<div class='tools'>";
        for (var i in option.tools) {
            str += "<div class='tbtn' type='" + option.tools[i].type + "'><i class='fa " + option.tools[i].icon + "'></i></div>";
        }
        str += "<div class='fbtn'><i class='fa fa-folder-open'></i><input type='file' accept='" + option.type + "'></div>";
        str += "</div>";
        var b = $(str).appendTo(this.dom);
        b.find(".tbtn").each(function () {
            $(this).click(function () {
                var type = $(this).attr("type");
                ths.dispatchEvent(type, {
                    btn: $(this)
                });
            });
        });
        b.find("input").bind("change", function (e) {
            var file = e.target.files || e.dataTransfer.files;
            ths.setImage(file);
        });
        $("<div class='mask'>" +
                "<div class='openfile'>打开图片<input type='file' accept='" + option.type + "'></div>" +
                "</div>").appendTo(this.dom).find("input").bind("change", function (e) {
            var file = e.target.files || e.dataTransfer.files;
            if (file.length > 0) {
                ths.dom.find(".mask").remove();
                ths.setImage(file);
            }
        });
    },
    setImage: function (files) {
        var image = this.image, ths = this;
        if (files.length > 0) {
            var file = require("@file");
            var filex = file.set(files[0]);
            filex.getImage(function (pimage) {
                var ximage = pimage, _w = ximage.width, _h = ximage.height;
                image.canvas.width = _w;
                image.canvas.height = _h;
                image.props({
                    width: _w,
                    height: _h,
                    x: (ths.r - _w) / 2,
                    y: (ths.r - _h) / 2,
                    rotate: 0
                });
                image.setImage(this, "fit");
                ths.imageContainer.rotate(0);
            });
        }
    },
    zoomIn: function () {
        var image = this.image, offset = this.option.zoomoffset;
        var _w = image.width() + image.width() * offset;
        if (_w / image.image.width <= 5) {
            image.props({
                width: _w,
                height: image.height() + image.height() * offset,
                x: image.x() - image.width() * offset / 2,
                y: image.y() - image.height() * offset / 2
            });
        }
    },
    zoomOut: function () {
        var image = this.image, offset = this.option.zoomoffset;
        var _w = image.width() - image.width() * offset;
        var _h = image.height() - image.height() * offset;
        if (_w < this.option.picWidth) {
            _w = this.option.picWidth;
            _h = image.height() / image.width() * _w;
            if (_h < this.option.picHeight) {
                _h = this.option.picHeight;
                _w = image.width() / image.height() * _h;
            }
        }
        if (_h < this.option.picHeight) {
            _h = this.option.picHeight;
            _w = image.width() / image.height() * _h;
            if (_w < this.option.picWidth) {
                _w = this.option.picWidth;
                _h = image.height() / image.width() * _w;
            }
        }
        var _x = image.x() + image.width() * offset / 2;
        var _y = image.y() + image.height() * offset / 2;
        var container = this.imageContainer;
        if (_x < container.getChildAt(1).x()) {
            if (_x > container.getChildAt(1).x() - (container.getChildAt(0).width() - container.getChildAt(1).width())) {
            } else {
                _x = container.getChildAt(1).x() - (container.getChildAt(0).width() - container.getChildAt(1).width());
            }
        } else {
            _x = container.getChildAt(1).x();
        }
        if (_y < container.getChildAt(1).y()) {
            if (_y > container.getChildAt(1).y() - (container.getChildAt(0).height() - container.getChildAt(1).height())) {
            } else {
                _y = container.getChildAt(1).y() - (container.getChildAt(0).height() - container.getChildAt(1).height());
            }
        } else {
            _y = container.getChildAt(1).y();
        }
        if (_w + _x < container.getChildAt(1).x() + container.getChildAt(1).width()) {
            _x = container.getChildAt(1).x() + container.getChildAt(1).width() - _w;
        }
        if (_h + _y < container.getChildAt(1).y() + container.getChildAt(1).height()) {
            _y = container.getChildAt(1).y() + container.getChildAt(1).height() - _h;
        }
        image.props({
            width: _w,
            height: _h,
            x: _x,
            y: _y
        });
    },
    rotateRight: function () {
        this.imageContainer.rotate(this.imageContainer.rotate() + this.option.rotateoffset);
    },
    rotateLeft: function () {
        this.imageContainer.rotate(this.imageContainer.rotate() - this.option.rotateoffset);
    },
    download: function () {
        var option = this.option;
        var uri = this.baseContainer.getImageDate((option.sceneWidth - option.picWidth) / 2, (option.sceneHeight - option.picHeight) / 2, option.picWidth, option.picHeight);
        var file = require("@file");
        var blob = file.getBlobFromURI(uri);
        file.saveAs(blob, "photocutter.png");
    },
    reset: function () {
        var ximage = this.image.image, _w = ximage.width, _h = ximage.height;
        this.image.props({
            width: _w,
            height: _h,
            x: (this.r - _w) / 2,
            y: (this.r - _h) / 2,
            rotate: 0
        });
        this.imageContainer.rotate(0);
    },
    upload: function () {
        var option = this.option;
        var uri = this.baseContainer.getImageDate((option.sceneWidth - option.picWidth) / 2, (option.sceneHeight - option.picHeight) / 2, option.picWidth, option.picHeight);
        var file = require("@file");
        var blob = file.getBlobFromURI(uri);
        var ths = this;
        var formdata = new FormData();
        formdata.append(option.name, blob);
        $.ajax({
            url: option.url || null,
            data: formdata,
            method: "post",
            dataType: "json",
            handlers: {
                load: function (e) {
                },
                progress: function (e) {
                },
                error: function (e) {
                }
            }
        });
    },
    event_zoomin: function () {
        this.zoomIn();
    },
    event_zoomout: function () {
        this.zoomOut();
    },
    event_rotateleft: function () {
        this.rotateLeft();
    },
    event_rotateright: function () {
        this.rotateRight();
    },
    event_download: function () {
        this.download();
    },
    event_reset: function () {
        this.reset();
    }
});
Module({
    name: "gallery",
    className: "gallery",
    extend: "view",
    option: {
        url: "gallery.json",
        rotateoffset: 10,
        zoomoffset: 0.2,
        showList: false,
        tools: [
            {type: "zoomin", icon: "fa-search-plus"},
            {type: "zoomout", icon: "fa-search-minus"},
            {type: "rotateleft", icon: "fa-undo"},
            {type: "rotateright", icon: "fa-repeat"},
            {type: "download", icon: "fa-download"},
            {type: "reset", icon: "fa-refresh"},
            {type: "previmage", icon: "fa-chevron-left"},
            {type: "nextimage", icon: "fa-chevron-right"}
        ]
    },
    init: function (option) {
        option.sceneWidth = this.dom.width();
        option.sceneHeight = this.dom.height();
        var canvas = require("@canvas");
        this.dom.width(option.sceneWidth).height(option.sceneHeight);
        var scene = this.dom.display();
        var baseContainer = canvas.create("DisplayObjectContainer", {
            id: "aa",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: 0,
            y: 0
        });
        var r = Math.sqrt(option.sceneWidth * option.sceneWidth + option.sceneHeight * option.sceneHeight);
        var imageContainer = canvas.create("DisplayObjectContainer", {
            id: "imageContainer",
            width: r,
            height: r,
            x: -(r - option.sceneWidth) / 2,
            y: -(r - option.sceneHeight) / 2,
            init: function () {
                this.ismove = false;
                this.cleft = 0;
                this.ctop = 0;
            },
            onmousedown: function (e) {
                var b = this.getChildAt(0);
                var a = b.getLocalRelativeRootPoint(e.pageX, e.pageY);
                this.cleft = a.x - b.x();
                this.ctop = a.y - b.y();
            },
            onmousemove: function (e) {
                if (this.ismove) {
                    if (this.getChildAt(0).width() > this.getChildAt(1).width() || this.getChildAt(0).height() > this.getChildAt(1).height()) {
                        var b = this.getChildAt(0);
                        var a = b.getLocalRelativeRootPoint(e.pageX, e.pageY);
                        var _x = a.x - this.cleft;
                        var _y = a.y - this.ctop;
                        if (_x < this.getChildAt(1).x()) {
                            if (_x > this.getChildAt(1).x() - (this.getChildAt(0).width() - this.getChildAt(1).width())) {
                                b.x(a.x - this.cleft);
                            } else {
                                b.x(this.getChildAt(1).x() - (this.getChildAt(0).width() - this.getChildAt(1).width()));
                            }
                        } else {
                            b.x(this.getChildAt(1).x());
                        }
                        if (_y < this.getChildAt(1).y()) {
                            if (_y > this.getChildAt(1).y() - (this.getChildAt(0).height() - this.getChildAt(1).height())) {
                                b.y(a.y - this.ctop);
                            } else {
                                b.y(this.getChildAt(1).y() - (this.getChildAt(0).height() - this.getChildAt(1).height()));
                            }
                        } else {
                            b.y(this.getChildAt(1).y());
                        }
                    }
                }
            },
            onmouseup: function () {
                this.ismove = false;
            }
        });
        imageContainer.rotatePoint(option.sceneWidth / 2, option.sceneHeight / 2);
        var image = canvas.create("ImageDisplay", {
            id: "image",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: (r - option.sceneWidth) / 2,
            y: (r - option.sceneHeight) / 2,
            rotate: 0
        });
        image.rotatePoint((r - option.sceneWidth) / 2, (r - option.sceneHeight) / 2);
        var squart = canvas.create("SquartDisplay", {
            id: "squart",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: (r - option.sceneWidth) / 2,
            y: (r - option.sceneHeight) / 2,
            onmousedown: function () {
                this.parent().ismove = true;
            }
        });
        imageContainer.addChild(image).addChild(squart);
        baseContainer.addChild(imageContainer);
        scene.addChild(baseContainer);
        this.image = image;
        this.imageContainer = imageContainer;
        this.baseContainer = baseContainer;
        this.r = r;

        $("<div class='desccon'></div>").appendTo(this.dom);
        $("<div class='thumbs'>" +
                "<div class='bar'><i class='fa fa-chevron-right'></i></div>" +
                "<div class='listcon'>" +
                "<div class='list'></div>" +
                "</div>" +
                "</div>").appendTo(this.dom).find(".bar").click(function () {
            ths.dom.toggleClass("close");
        });
        var str = "<div class='tools'>";
        for (var i in option.tools) {
            str += "<div class='tbtn' type='" + option.tools[i].type + "'><i class='fa " + option.tools[i].icon + "'></i></div>";
        }
        str += "</div>";
        var b = $(str).appendTo(this.dom), ths = this;
        b.find(".tbtn").each(function () {
            $(this).click(function () {
                var type = $(this).attr("type");
                ths.dispatchEvent(type, {
                    btn: $(this)
                });
            });
        });
        if (!option.showList) {
            this.dom.addClass("close");
        }
        this.current = 0;
        this.loading.ths = this;
        this.getData();
    },
    loading: {
        ths: null,
        create: function () {
            if (this.ths.dom.find(".mask").length === 0) {
                $("<div class='mask'><div class='con'><i class='fa fa-refresh fa-spin'></i></div></div>").appendTo(this.ths.dom);
            }
        },
        remove: function () {
            this.ths.dom.find(".mask").remove();
        },
        icon: function (name) {
            this.ths.dom.find(".mask i").attr(name);
        },
        mask: function () {
            return this.ths.dom.find(".mask");
        }
    },
    closeList: function () {
        this.dom.addClass("close");
    },
    openList: function () {
        this.dom.removeClass("close");
    },
    getData: function () {
        var ths = this;
        this.postData({
            url: this.option.url,
            back: function (data) {
                ths.setImageList(data);
            }
        });
    },
    setImage: function (url) {
        var ths = this;
        this.loading.create();
        $.loader().image(url, function () {
            ths.loading.remove();
            var ximage = this, _w = ximage.width, _h = ximage.height, image = ths.image;
            image.canvas.width = _w;
            image.canvas.height = _h;
            image.props({
                width: _w,
                height: _h,
                x: (ths.r - _w) / 2,
                y: (ths.r - _h) / 2,
                rotate: 0
            });
            image.setImage(this, "fit");
            ths.imageContainer.rotate(0);
        }, function () {
            ths.loading.icon("fa fa-refresh");
            ths.loading.mask().click(function () {
                ths.setImage(url);
            });
        });
    },
    _resize: function () {
        if (this.dom.find(".list").height() > this.dom.find(".listcon").height()) {
            this.dom.find(".listcon").bind("mousemove", function (e) {
                var offset = $(this).children(0).height() - $(this).height();
                var a = offset * (e.pageY - $(this).offset().top) / $(this).height();
                $(this).scrollTop(a);
            });
        } else {
            this.dom.find(".listcon").unbind("mousemove");
        }
    },
    setImageList: function (data) {
        this.data = data;
        var str = "", ths = this;
        for (var i in data) {
            str += "<div class='img' num='" + i + "'><div class='mg' style='background-image:url(" + data[i].thumb + ")'></div></div>";
        }
        this.dom.find(".list").html(str).find(".img").each(function (a,i) {
            $(this).click(function () {
                $(this).parent().children().each(function () {
                    $(this).removeClass("hover");
                });
                var num = $(this).attr("num");
                $(this).addClass("hover");
                ths.setImage(ths.data[num].big);
                ths.dom.find(".desccon").html((ths.data[num].desc || ""));
            });
            if (i === 0) {
                $(this).click();
            }
        });
        this.privator("resize");
    },
    zoomIn: function () {
        var image = this.image, offset = this.option.zoomoffset;
        var _w = image.width() + image.width() * offset;
        if (_w / image.image.width <= 5) {
            image.props({
                width: _w,
                height: image.height() + image.height() * offset,
                x: image.x() - image.width() * offset / 2,
                y: image.y() - image.height() * offset / 2
            });
        }
    },
    zoomOut: function () {
        var image = this.image, offset = this.option.zoomoffset;
        var container = this.imageContainer;
        if (container.getChildAt(0).width() > container.getChildAt(1).width() || container.getChildAt(0).height() > container.getChildAt(1).height()) {
            var _w = image.width() - image.width() * offset;
            var _h = image.height() - image.height() * offset;
            if (_w < this.option.sceneWidth) {
                _w = this.option.sceneWidth;
                _h = image.height() / image.width() * _w;
                if (_h < this.option.sceneHeight) {
                    _h = this.option.sceneHeight;
                    _w = image.width() / image.height() * _h;
                }
            }
            if (_h < this.option.sceneHeight) {
                _h = this.option.sceneHeight;
                _w = image.width() / image.height() * _h;
                if (_w < this.option.sceneWidth) {
                    _w = this.option.sceneWidth;
                    _h = image.height() / image.width() * _w;
                }
            }
            var _x = image.x() + image.width() * offset / 2;
            var _y = image.y() + image.height() * offset / 2;
            if (_x < container.getChildAt(1).x()) {
                if (_x > container.getChildAt(1).x() - (container.getChildAt(0).width() - container.getChildAt(1).width())) {
                } else {
                    _x = container.getChildAt(1).x() - (container.getChildAt(0).width() - container.getChildAt(1).width());
                }
            } else {
                _x = container.getChildAt(1).x();
            }
            if (_y < container.getChildAt(1).y()) {
                if (_y > container.getChildAt(1).y() - (container.getChildAt(0).height() - container.getChildAt(1).height())) {
                } else {
                    _y = container.getChildAt(1).y() - (container.getChildAt(0).height() - container.getChildAt(1).height());
                }
            } else {
                _y = container.getChildAt(1).y();
            }
            if (_w + _x < container.getChildAt(1).x() + container.getChildAt(1).width()) {
                _x = container.getChildAt(1).x() + container.getChildAt(1).width() - _w;
            }
            if (_h + _y < container.getChildAt(1).y() + container.getChildAt(1).height()) {
                _y = container.getChildAt(1).y() + container.getChildAt(1).height() - _h;
            }
            image.props({
                width: _w,
                height: _h,
                x: _x,
                y: _y
            });
        }
    },
    rotateRight: function () {
        this.imageContainer.rotate(this.imageContainer.rotate() + this.option.rotateoffset);
    },
    rotateLeft: function () {
        this.imageContainer.rotate(this.imageContainer.rotate() - this.option.rotateoffset);
    },
    download: function () {
        var option = this.option;
        try {
            var uri = this.image.getImageDate(0, 0, this.image.image.width, this.image.image.height);
            var file = require("@file");
            var blob = file.getBlobFromURI(uri);
            file.saveAs(blob, "photocutter.png");
        } catch (e) {
            console.info("download error");
        }
    },
    reset: function () {
        var ximage = this.image.image, _w = ximage.width, _h = ximage.height;
        this.image.props({
            width: _w,
            height: _h,
            x: (this.r - _w) / 2,
            y: (this.r - _h) / 2,
            rotate: 0
        });
        this.imageContainer.rotate(0);
    },
    gotoImage: function (num) {
        var a = this.dom.find(".img").eq(parseInt(num));
        if (a.length > 0) {
            this.current = num;
            a.click();
        }
    },
    nextImage: function () {
        var a = this.current + 1;
        this.gotoImage(a);
    },
    prevImage: function () {
        var a = this.current - 1;
        this.gotoImage(a);
    },
    event_zoomin: function () {
        this.zoomIn();
    },
    event_zoomout: function () {
        this.zoomOut();
    },
    event_rotateleft: function () {
        this.rotateLeft();
    },
    event_rotateright: function () {
        this.rotateRight();
    },
    event_reset: function () {
        this.reset();
    },
    event_download: function () {
        this.download();
    },
    event_nextimage: function () {
        this.nextImage();
    },
    event_previmage: function () {
        this.prevImage();
    }
});