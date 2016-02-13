(function ($) {
    $.overrideRoot({
        onimportoptionstart:function(){
            $("body").html("<div style='line-height:50px;width:150px;text-align:cneter;position:absolute;left:50%;top:50%;margin-left:-75px;margin-top:-25px;'><i class='fa fa-refresh fa-spin'></i> Loading...</div>");
        },
        onimportoptionend:function(){
            $("body").empty();
        }
    });
})(brooder);