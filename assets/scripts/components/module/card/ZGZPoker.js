cc.Class({
    extends: cc.Component,

    properties: {
        card:cc.Sprite,
        _value:255,
        _select:0,
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

        this.node.on('flip',function(data){
            self.flip(data);
        });
    },

    fapai:function(data){
        var self = this;
        
        var idx = 0;
        if(data.xipai == 1){
            if(data.index >= 0 && data.index <= 4){
                idx = 0;
            }
            else if(data.index >= 5 && data.index <= 9){
                idx = 4;
            }
            else if(data.index >= 10 && data.index <= 14){
                idx = 8;
            }
            else if(data.index >= 15 && data.index <= 19){
                idx = 12;
            }
        }
        else{
            idx = data.index / 2;
        }
        self.node.runAction(cc.sequence(
                cc.hide(),
                cc.delayTime(idx*0.15),
                cc.show(),
                cc.callFunc(function (){
                    cc.vv.audioMgr.playSFX('nn/flop');
                }),
                cc.sequence(cc.moveTo(0.15,cc.v2(-270 + data.index * 65)),cc.callFunc(function(){
                    // if(data.callback != null){
                    //     data.callback(data.index);
                    // }
                })),
                cc.delayTime(0.15),
                cc.callFunc(function () {
                   if(data.callback){
                       data.callback(data.index);
                   }
                },this)
            )
        );
    },

    flip:function(data){
        var self = this;
        if(this._value != 255)return;

        var scale = self.node.scale;

        self.node.runAction(
            cc.sequence(
                cc.scaleTo(0.25,0,scale),
                cc.callFunc(function () {
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
                    self.card.spriteFrame = spriteFrame;  
                    self._value = data.value;
                    self.node.value = data.value;
                },self),
                cc.scaleTo(0.25,scale,scale),
                cc.callFunc(function (){
                   if(data.callback){
                       data.callback(data.index);
                   }
                })
            )
        ); 
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
    },

    onPaiClicked:function(){
        cc.vv.audioMgr.click();
        this._select = (this._select==1)?0:1;
        this.node.y = (this._select==0)?0:20;
    },

    isSelect:function(){
        return this._select;
    },

    setEnabled:function(enabled){
        var button = this.node.getComponent(cc.Button);
        if(!button){
            button = this.node.addComponent(cc.Button);
        }
        if(enabled){
            button.node.on('click', this.onPaiClicked, this);
        }else{
             this.node.removeComponent(cc.Button);
        }
    },

    setSelect:function(selected){
        this._select = selected;
        this.node.y = (this._select==0)?0:20;
    },

    setMove:function(move){
        var color = new cc.Color(150, 150, 150);
        if(move == 0){
            color = new cc.Color(255, 255, 255);
        }

        this.card.node.color = color;
    },

    setValue:function(value){
        this._value = value;
    }, 

    getValue:function(){
        return this._value;
    },

});
