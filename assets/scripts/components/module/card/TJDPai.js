cc.Class({
    extends: cc.Component,

    properties: {
        card:cc.Sprite,
        _value:255,
    },

    onLoad:function(){
        this.initEventHandlers();
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;
        
        //初始化
        this.node.on('fapai',function(data){
            self.fapai(data);
        });

        //无条件翻转
        this.node.on('trun',function(data){
            self.trun(data);
        });

        //开牌
        this.node.on('kaipai',function(data){
            self._value = data.value;
            self.trun(data);
        });
    },

    //发牌
    fapai:function(data){
        var self = this;
        self.node.runAction(cc.sequence(
            cc.hide(),
            cc.delayTime(1 * 0.05),
            cc.show(),
            cc.callFunc(function (){
                if(data.value != 0){
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
                    self.card.spriteFrame = spriteFrame; 
                    self._value = data.value;
                }
                cc.vv.audioMgr.playSFX('nn/flop');
            }),
            cc.spawn(cc.moveTo(0.05,cc.v2(1,1)),cc.scaleTo(0.05,1+ 0.1)),
            cc.scaleTo(0.05,1),
            cc.delayTime(0.1),
            cc.callFunc(function (){
                if(data.callback != null){
                    data.callback(data.viewid,data.index);
                }
            },this)));
    },

    //翻转牌
    trun:function(data){

        var self = this;

        //已经翻过
        if(this._value != 255)return;

        var scale = self.node.scale;

        self.node.runAction(
            cc.sequence(
                cc.scaleTo(0.15,0,scale),
                cc.callFunc(function () {
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
                    self.card.spriteFrame = spriteFrame;  
                    self._value = data.value;
                },self),
                cc.scaleTo(0.15,scale,scale),
                cc.callFunc(function (){
                    if(data.callback != null){
                        data.callback(data.obj,data.viewid,data.index,data.type);
                    }
                })
            )
        ); 
    }
});
