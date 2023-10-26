cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad () {
        //监听协议
        this.initEventHandlers();
    },  

    start () {
      
    },

    initEventHandlers:function(){
        var self = this;

        this.node.on('dingBaopai',function(){
            self.dingBaopai();
        });
    },

    dingBaopai:function(){
	    this.node.getComponent(cc.Animation).play();
    },
});
