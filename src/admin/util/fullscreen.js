/*!
 * @packet admin.util.fullscreen;
 */
$.fullScreen=function(){
    $("body").fullScreen();
};
$.exitFullScreen=function(){
    $("body").exitFullScreen();
};
$.fn.fullScreen = function () {
    var element = this.get(0);
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
    return this;
};
$.fn.exitFullScreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};