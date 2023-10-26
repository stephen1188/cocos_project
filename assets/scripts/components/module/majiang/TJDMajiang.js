cc.Class({
    extends: cc.Component,

    properties: {
        bg:cc.Sprite,
        dian:cc.Sprite,
        _value:255,
        _select:0,
        
    },

    onLoad:function(){
        // this.type.active = false;
        this.initEventHandlers();
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;

        //发牌
        this.node.on('fapai',function(data){
            
            self.fapai(data);
        });

        //显示牌
        this.node.on('showPai',function(data){
            
            self.showPai(data);
        });

        //发牌动画
        this.node.on('fapaianimation',function(data){
            
            self.fapaianimation(data);
        });

        //无条件翻转
        this.node.on('trun',function(data){
            
            self.trun(data);
        });

        this.node.on('show', function(data){
            
            self.show(data);
        });

        this.node.on('hide', function(data){
            
            self.hide(data);
        });

        this.node.on('setTag', function(data){
            
            self.setTag(data);
        });
    },

    fapai:function(data){
        var self = this;
        var delayTime = 0.1;
        if(delayTime != null){
            delayTime = data.delayTime;
        }
        self.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.spawn(cc.scaleTo(0.25,data.scale,data.scale),
                cc.moveTo(0.25, cc.v2(data.x,data.y)),),
                cc.callFunc(function (){
                    if(data.callback != null){
                        data.callback(data.viewid, data.index);
                    }
                })
            )
        )
    },

    showPai:function(data){
        this.node.scale = data.scale;
        this.node.setPosition(cc.v2(data.x,data.y));
        if(data.callback != null){
            data.callback(data.viewid, data.index);
        }
    },

    fapaianimation:function(data){
        var self = this;
        var delayTime = 0.1;
        if(delayTime != null){
            delayTime = data.delayTime;
        }
        self.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.moveBy(0.25,cc.v2(data.distance, 0)),
                cc.delayTime(0.1),
                cc.moveBy(0.25,cc.v2(0, -data.distanceH)),
                cc.callFunc(function (){
                    if(data.callback != null){
                        data.callback(data.viewid, data.index);
                    }
                })
            )
        )
    },

    //显示牌
    show:function(data){
        var self = this;
        //已经翻过 

        if(this._value != 255)return;
        self.bg.spriteFrame = data.spriteFrame.getSpriteFrame("tilebg_2_0");
        self.dian.spriteFrame = data.spriteFrame.getSpriteFrame("B" + data.value);
        self.dian.node.active = true;  
        self._value = data.value;
        if(data.callback != null){
            data.callback(data.viewid, data.index);
        }
    },

    hide:function(){
        this.node.destroy();
    },

    //翻转牌
    trun:function(data){

        var self = this;

        //已经翻过
        if(self._value != 255)return;

        self.node.runAction(
            cc.sequence(
                cc.callFunc(function (){
                    var animation = self.node.getComponent(cc.Animation);
                    animation.play("tjd_cardAnim");
                }),
                cc.delayTime(0.2),
                cc.callFunc(function (){
                    
                     self.dian.spriteFrame = data.spriteFrame.getSpriteFrame("B" + data.value);
                     if(data.value == 33){
                        self.dian.spriteFrame = data.spriteFrame.getSpriteFrame("F7");
                     }
                     self.dian.node.active = true;  
                     self._value = data.value;
                     
                     if(data.callback != null){
                        data.callback(data.viewid, data.index, data.seatid);
                    }
                })
            )
        )
    },

    setTag:function(data){
        var myTag = data.viewid + "_tag_" + data.index;
        this.node.myTag = myTag;
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

    setValue:function(value){
        this._value = value;
    }, 

    getValue:function(){
        return this._value;
    },
});
