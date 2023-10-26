cc.Class({
    extends: cc.Component,

    properties: {
        card:cc.Sprite,
        _value:255,
        type_three:cc.SpriteFrame
    },

    onLoad:function(){
        this.initEventHandlers();
    },

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

        this.node.on('show', function(data){
            self.show(data);
        });

        //牌上移
        this.node.on('top', function(){
            self.top();
        });

        //牌收缩
        this.node.on('shousuo', function(data){
            self.shousuo(data);
        });

        //设置角标
        this.node.on('setType', function(data){
            self.setType(data);
        });
    },

    //发牌
    fapai:function(data){
        var self = this;
        var time = 0;
        if(data.time){
            time = data.time * 0.05
        }else{
            time = data.index * 0.05
        }
        self.node.runAction(cc.sequence(
            cc.delayTime(time),
            cc.callFunc(function (){
                if(data.value != 0){
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
                    self.card.spriteFrame = spriteFrame; 
                    self._value = data.value;
                }
                //是否是发牌而不是搓牌
                if(!data.iscuopai){
                    cc.vv.audioMgr.playSFX('nn/flop');
                }
               
            }),
            cc.spawn(cc.moveTo(0.05,cc.v2(data.x,data.y)),cc.scaleTo(0.05,data.scale)),
            cc.delayTime(0.05),
            cc.callFunc(function (){
                if(data.callback != null){
                    data.callback(data.viewid,data.index);
                }
            },this)));
    },

    //自己的牌牌收缩
    shousuo:function(data){
        var self = this;
        self.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.spawn(cc.moveTo(0.25,cc.v2(data.x,data.y)),cc.scaleTo(0.25,data.scale)),
            cc.delayTime(0.1),
            cc.callFunc(function (){
                if(data.callback != null){
                    data.callback(data.obj,data.viewid,data.index,data.type,data.rate,data.pai);
                }
            },this)
        ));
    },

    //显示牌
    show:function(data){
        var self = this;

        //已经翻过
        if(this._value != 255)return;

        var scale = self.node.scale;

        var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
        self.card.spriteFrame = spriteFrame;  
        self._value = data.value;
        if(data.callback != null){
            data.callback(data.obj,data.viewid,data.index,data.type);
        }
    },

    //上移牌
    top:function(){
        var self = this;
        this.node.y += 10;
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
                        data.callback(data.obj,data.viewid,data.index,data.type,data.rate,data.pai);
                    }
                })
            )
        ); 
    },

    //type 0不显示 1显示 3th
    setType:function(type){
        if(type == 1){
            this.type.active = true;
            this.type.getComponent(cc.Sprite).spriteFrame = this.type_three;
        }  
        else{
            this.type.active = false;
        }
    }
});
