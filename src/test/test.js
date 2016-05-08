/* 
 * @packet test.test;
 * @template test.template.tet;
 * @css test.style.tcss;
 * @require test.svg;
 */
Option({
    name: "root",
    option: {
        override: {
            onendinit: function () {
                this.addChild({
                    type: "@.test"
                });
            }
        }
    }
});
Module({
    name: "test",
    extend: "view",
    className: "test",
    template: module.getTemplate("@tet", "test"),
    init: function () {
        this.render();
    },
    bind_getdata:function(){
//        this.postRequest("data/test.json").done(function(a){
//            console.log(a);
//        }).fail(function(a,isnet){
//            console.log(isnet);
//            if(!isnet){
//                console.log(a);
//            }else{
//                console.log("net error");
//            }
//        });
        this.postRequest("data/test.json").then(function(){
            return this.postRequest("data/test2.json");
        }).done(function(data){
            console.log(data);
        }).fail(function(data){
            console.log("error");
        });
    }
});
Option({
    name:"svg",
    option:{
        override:{
            onendinit:function(){
                this.addChild({
                    type:"@svg.svgposition"
                });
            }
        }
    }
});
