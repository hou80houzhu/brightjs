/*!
 * @packet admin.util.media;
 */
var audio = function (ops) {
    this.option = ops;
    var audio = new Audio();
    var ths = this;
    for (var i in ops) {
        if (/^on/.test(i) && ops[i]) {
            audio.addEventListener(i.substring(2, i.length), function (e) {
                var fn = ths.option["on" + e.type];
                if (fn) {
                    if (e.type === "progress") {
                        e.percent = ths.getLoadedPercent();
                    }
                    if (e.type === "timeupdate") {
                        e.percent = ths.getPlayedPercent();
                    }
                    fn.call(ths, e);
                }
            });
        }
    }
    this.audio = audio;
};
audio.prototype.src = function (url) {
    if (arguments.length === 1) {
        this.audio.src = url;
        return this;
    } else {
        return this.audio.src;
    }
};
audio.prototype.preload = function (a) {
    if (arguments.length === 1) {
        this.audio.preload = a;
        return this;
    } else {
        return this.audio.preload;
    }
};
audio.prototype.seeking = function () {
    return this.audio.seeking;
};
audio.prototype.readyState = function () {
    return this.audio.readyState();
};
audio.prototype.toggle = function () {
    if (this.audio.paused) {
        this.audio.play();
    } else {
        this.audio.pause();
    }
    return this;
};
audio.prototype.load = function () {
    this.audio.load();
    return this;
};
audio.prototype.play = function () {
    this.audio.play();
    return this;
};
audio.prototype.pause = function () {
    this.audio.pause();
    return this;
};
audio.prototype.volume = function (volume) {
    if (arguments.length === 1) {
        this.audio.volume = volume;
        return this;
    } else {
        return this.audio.volume;
    }
};
audio.prototype.mute = function (ismute) {
    if (arguments.length === 1) {
        this.audio.muted = ismute;
        return this;
    } else {
        return this.audio.muted;
    }
};
audio.prototype.isEnd = function () {
    return this.audio.ended;
};
audio.prototype.loop = function (isa) {
    if (arguments.length === 1) {
        this.audio.loop = isa;
        return this;
    } else {
        return this.audio.loop;
    }
};
audio.prototype.defaultPlayRate = function () {
    return this.audio.defaultPlaybackRate;
};
audio.prototype.playRate = function (a) {
    if (arguments.length === 1) {
        this.audio.playbackRate = a;
        return this;
    } else {
        return this.audio.playbackRate;
    }
};
audio.prototype.autoPlay = function (isa) {
    if (arguments.length === 1) {
        this.audio.autoPlay = isa;
        return this;
    } else {
        return this.audio.autoPlay;
    }
};
audio.prototype.currentTime = function (time) {
    if (arguments.length === 1 && typeof time === "number") {
        this.audio.currentTime = time;
        return this;
    } else {
        if (arguments.length === 1) {
            return audio.formatTime(this.audio.currentTime, time);
        } else {
            return this.audio.currentTime;
        }
    }
};
audio.prototype.startTime = function (format) {
    if (arguments.length === 1) {
        return audio.formatTime(this.audio.currentTime, format);
    } else {
        return this.audio.currentTime;
    }
};
audio.prototype.error = function () {
    return this.audio.error;
};
audio.prototype.canPlayType = function (type) {
    return this.audio.canPlayType(type);
};
audio.prototype.getLoadedPercent = function () {
    try {
        return Math.round(this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration * 100);
    } catch (e) {
        return 0;
    }
};
audio.prototype.getPlayedPercent = function () {
    try {
        return Math.round(this.audio.currentTime / this.audio.duration * 100);
    } catch (e) {
        return 0;
    }
};
audio.prototype.getAudio = function () {
    return this.audio;
};
audio.formatTime = function (secs, format) {
    if (!format) {
        format = "hh:mm:ss";
    }
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs - h * 3600) / 60);
    var s = Math.round(secs - h * 3600 - m * 60);
    format = format.replace(/h*/, function (a, b, c) {
        if (a !== "") {
            h = h + "";
            if (a.length <= h.length) {
                return h;
            } else {
                var m = "";
                for (var i = 0; i < (a.length - h.length); i++) {
                    m += "0";
                }
                m += h;
                return m;
            }
        } else {
            return "";
        }
    }).replace(/m+/, function (a, b, c) {
        if (a !== "") {
            m = m + "";
            if (a.length <= m.length) {
                return m;
            } else {
                var mm = "";
                for (var i = 0; i < (a.length - m.length); i++) {
                    mm += "0";
                }
                mm += m;
                return mm;
            }
        } else {
            return "";
        }
    });
    format = format.replace(/s+/g, function (a, b, c) {
        if (a !== "") {
            s = s + "";
            if (a.length <= s.length) {
                return s;
            } else {
                var m = "";
                for (var i = 0; i < (a.length - s.length); i++) {
                    m += "0";
                }
                m += s;
                return m;
            }
        } else {
            return "";
        }
    });
    return format;
};
audio.prototype.getTotalTime = function (format) {
    if (arguments.length === 1) {
        return audio.formatTime(this.audio.duration, format);
    } else {
        return this.audio.duration;
    }
};

var videowapper = function (option) {
    var ops = {
        src: ""
    };
    this.option = $.extend(ops, option);
    this.video = new video();
};


module.exports = {
    audio: function (option) {
        var ops = {
            onloadstart: null,
            onprogress: null,
            onplay: null,
            onpause: null,
            onended: null,
            ontimeupdate: null,
            oncanplaythrough: null,
            oncanplay: null,
            onsuspend: null,
            onabort: null,
            onerror: null,
            onstalled: null,
            onloadedmetadata: null,
            onwaiting: null,
            onplaying: null,
            onseeking: null
        };
        $.extend(ops, option);
        return new audio(ops);
    },
    video: function () {
    }
};