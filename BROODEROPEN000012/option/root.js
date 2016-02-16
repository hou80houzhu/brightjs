/*!
 * @packet option.root; 
 * @include opensite.pc.main:pc;
 * @include opensite.mobi.main:mobi;
 */Option({name:"pc",option:{override:{onendinit:function(){this.addChild({type:"@pc.container"})}}}});