cc.Class({
    extends: cc.Component,

    properties: {
        spriteHeadimg:cc.Sprite,
        lblName:cc.Label,
        lblStatus:cc.Label,
    },

    onLoad(){
        //监听
        this.initEventHandlers();
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;

        //拒绝解散
        this.node.on('show',function(ret){
            var data = ret;

            self.spriteHeadimg.spriteFrame = data.headimg;
            self.lblName.string = data.name;
            self.lblStatus.string = (data.status == 1)?"同意":"待确认";  
        });
    },
});
