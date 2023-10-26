cc.Class({
    extends: cc.Component,

    properties: {
        dtjCardType:{
            default:null,
            type:cc.SpriteAtlas
        },
        zpjCards:{
            default:null,
            type:cc.SpriteAtlas
        },
        bg:cc.Node,
        dian:cc.Node,
        _value:255,
        _index:-1,
        _scaleX:1,
        _scaleY:1,
        _select:0,
    },

    onLoad:function(){
        this._y = this.node.y;
        this._x = this.node.x;
        this._scaleX = this.node.scaleY;
        this._scaleY = this.node.scaleY;
        this.initEventHandlers();
    },

    start:function(){

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

        this.node.on('setTag', function(data){
            
            self.setTag(data);
        });

        //无条件翻转
        this.node.on('trun',function(data){
            
            self.trun(data);
        });

        this.node.on('show', function(data){
            
            self.show(data);
        });

        this.node.on('setTop', function(data){
            
            self.setTop(data);
        });

        this.node.on('setDown', function(data){
            
            self.setDown(data);
        });

        this.node.on('hide', function(data){
            
            self.hide(data);
        });

        this.node.on('setEnabled',function(data){
            
            var enabled = data.enabled;
            self.setEnabled(enabled);
        });
    },

    fapai:function(data){
        var self = this;
        var delayTime = 0.1;

        var viewid  = data.viewid;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        this._old_y = pos[viewid].pos.card.y;

        if(data.delayTime != null){
            delayTime = data.delayTime;
        }
        self.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.spawn(cc.scaleTo(0.25,data.scale,data.scale),
                cc.moveTo(0.25, cc.v2(data.x,data.y)),),
                cc.callFunc(function (){
                    self._scaleX = data.scale;
                    self._scaleY = data.scale;
                    self.node.scale = data.scale;
                    if(data.callback != null){
                        data.callback(data.viewid, data.index);
                    }
                })
            )
        )
    },

    showPai:function(data){
        this.node.scale = data.scale;
        this._scaleX = data.scale;
        this._scaleY = data.scale;

        var viewid  = data.viewid;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        this._old_y = pos[viewid].pos.card.y;
        
        this.node.setPosition(cc.v2(data.x,data.y));
        if(data.callback != null){
            data.callback(data.viewid, data.index);
        }
    },
    setTag:function(data){
        var myTag = data.viewid + "_tag_" + data.index;
        this.node.myTag = myTag;
        if(data.callback != null){
            data.callback(data.viewid, data.index);
        }
    },

    fapaianimation:function(data){
        var self = this;
        var delayTime = 0.1;
        if(data.delayTime != null){
            delayTime = data.delayTime;
        }
        self.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.moveBy(0.25,cc.v2(data.distance, 0)),
                cc.delayTime(0.1),
                cc.moveBy(0.25,cc.v2(0, -data.distanceH)),
                cc.callFunc(function (){
                    self._y = self.node.y;
                    if(data.callback != null){
                        data.callback(data.viewid, data.index, data.maxPai, data.maxType);
                    }
                })
            )
        )
    },

    //翻转牌
    trun:function(data){
        var self = this;
        var delayTime = 0.1;
        if(data.delayTime != null){
            delayTime = data.delayTime;
        }
        //已经翻过
        if(self._value != 255)return;
        if(data.value == 0 || !data.value)return;
        self.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.scaleTo(0.25, 0, self._scaleY),
                cc.callFunc(function (){
                    self.bg.getComponent(cc.Sprite).spriteFrame = self.zpjCards.getSpriteFrame("card_back_1");  
                    self.dian.getComponent(cc.Sprite).spriteFrame = self.zpjCards.getSpriteFrame("card" + data.value); 
                    self.dian.active = true;  
                    self._value = data.value;
                }),
                cc.delayTime(0.1),
                cc.scaleTo(0.25, -self._scaleX, self._scaleY),
                cc.callFunc(function (){
                    self.node.scaleX = -self._scaleX;
                    self.node.scaleY = self._scaleY;
                    self._scaleX = -self._scaleX;
                    self.dian.scaleX = 1;
                    if(data.callback != null){
                        data.callback(data.viewid, data.index, data.valuearr, data.maxPai, data.maxType);
                    }
                })
            )
        )
    },

    //0落下状态 1上升状态
    onPaiClicked:function(event, customEventData){
        cc.vv.audioMgr.click();
        if(this._select == 0){
            this._select = 1
            this.node.y = this._old_y + 30;
            cc.vv.game.kaipaiArr.push(this._value);
        }else if(this._select == 1){
            this._select = 0;
            this.node.y = this._old_y;
            var index = cc.vv.game.kaipaiArr.indexOf(this._value); 
            cc.vv.game.kaipaiArr.splice(index, 1);
        }
        if(cc.vv.game.kaipaiArr.length != 2){
            cc.vv.game.nodeKaipai.getComponent(cc.Button).interactable = false;
            var viewid = 0;
            cc.vv.game.hideTypeOnePlay(viewid);
        }else{
            cc.vv.game.nodeKaipai.getComponent(cc.Button).interactable = true;
            cc.vv.game.showSelfDianshu();
        }
    },


    setEnabled:function(enabled){
        var button = this.node.getChildByName("bg").getComponent(cc.Button);
        if(!button){
            button = this.node.getChildByName("bg").addComponent(cc.Button);
        }
        if(enabled){
            button.clickEvents = [];
              var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个node节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "ZPJMajiang";//这个是代码文件名
            clickEventHandler.handler = "onPaiClicked";
            clickEventHandler.customEventData = this.node.myTag;

            button.clickEvents.push(clickEventHandler);
        }else{
            button.clickEvents = [];
        }
    },

    setTop:function(data){
        this._select = 1;
        this.node.y = this._old_y + 30;
    },

    setDown:function(data){
        this._select = 0;
        this.node.y = this._old_y;
    },

    //显示牌
    show:function(data){
        var self = this;
        //已经翻过 
        if(this._value != 255)return;
        self.bg.getComponent(cc.Sprite).spriteFrame = self.zpjCards.getSpriteFrame("card_back_1");  
        self.dian.getComponent(cc.Sprite).spriteFrame = self.zpjCards.getSpriteFrame("card" + data.value);  
        self.dian.node.active = true;  
        self._value = data.value;
        if(data.callback != null){
            data.callback(data.viewid, data.index);
        }
    },

    hide:function(){
        this.node.destroy();
    },
});
