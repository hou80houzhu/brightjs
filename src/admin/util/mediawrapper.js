/*!
 * @packet admin.util.mediawrapper;
 * @require admin.util.media;
 * @css admin.style.audio;
 */
Module({
    name: "audio",
    extend: "view",
    className: "audio",
    option: {
        music: ""
    },
    init: function (option) {
        var ths = this;
        this.dom.html("<div class='abtn'><i class='fa fa-play'></i></div>" +
                "<div class='progress'>" +
                "<div class='bar load'></div>" +
                "<div class='bar play'></div>" +
                "</div>" +
                "<div class='time'>00:00</div>");
        var a = require("brooder.util.media");
        this.audio = a.audio({
            onloadstart: function (e) {
                console.log("onloadstart");
            },
            onprogress: function (e) {
                console.log("onprogress");
                ths.dom.find(".load").width(e.percent + "%");
            },
            ontimeupdate: function (e) {
                ths.dom.find(".play").width(e.percent + "%");
            },
            onloadedmetadata: function () {
                ths.dom.find(".time").html(this.getTotalTime("mm:ss"));
            }
        }).src(option.music);
        this.dom.find(".abtn").click(function () {
            ths.audio.toggle();
        });
    }
});