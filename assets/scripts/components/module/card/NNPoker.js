cc.Class({
    extends: cc.Component,

    properties: {
        card:cc.Sprite,
        type:cc.Node,
        _value:255,
        _select:0,
        _scale:1,

        type_four:cc.SpriteFrame,
        type_five:cc.SpriteFrame,
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

        //翻转
        this.node.on('trun',function(data){
            self.trun(data);
        });

        //无条件翻转
        this.node.on('kaipai',function(data){
            self.kaipai(data);
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
        this._scale = data.scale;
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
                self.node.x = data.x;
                self.node.y = data.y;
                self.node.scale = data.scale;
                self.updateTwoBug();
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
            cc.delayTime(0.2),
            cc.callFunc(function (){
                self.node.x = data.x;
                self.node.y = data.y;
                self.node.scale = data.scale;
                if(data.callback != null){
                    data.callback(data.obj,data.viewid,data.index,data.type,data.rate,data.pai);
                }
            },this)
        ));
    },

    //显示牌
    show:function(data){
        var self = this;
        if(this._value != 255)return;
        this.node.x = data.x;
        this.node.y = data.y;
        this.node.scale = data.scale;
        this._scale = data.scale;
        if(data.value != 0){
            var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
            // if(data.atlas,data.value == 95){//大王
            //     spriteFrame = data.atlas.getSpriteFrame("A3");
            // }else if(data.atlas,data.value == 79){
            //     spriteFrame =  data.atlas.getSpriteFrame("A2");
            // }
            self.card.spriteFrame = spriteFrame;  
            self._value = data.value;
        }
        this.updateTwoBug();
        if(data.callback != null){
            data.callback(data.viewid,data.index);
        }
    },

    //上移牌
    top:function(){
        var self = this;
        self.node.runAction(
            cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function (){
                    self.node.y += 10;
                })
            )
        ); 
      
    },
    updateTwoBug(){
        let self = this;
        if(self.node.myTag == "0_4"){
            self.card.node.setContentSize(cc.size(171, 218))
        }
    },
    //翻转牌
    trun:function(data){
        var self = this;

        //已经翻过
        if(this._value != 255)return;
        
        var scale = this._scale;
        self.node.runAction(
            cc.sequence(
                cc.scaleTo(0.15,0,scale),
                cc.callFunc(function () {
                    self.card.interactable = true;
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
                    // if(data.atlas,data.value == 95){//大王
                    //     spriteFrame = data.atlas.getSpriteFrame("A3");
                    // }else if(data.atlas,data.value == 79){
                    //     spriteFrame =  data.atlas.getSpriteFrame("A2");
                    // }
                    self.card.spriteFrame = spriteFrame;  
                    self._value = data.value;
                },self),
                cc.scaleTo(0.15,scale,scale),
                cc.callFunc(function (){
                    self.node.scale = self._scale;
                    if(data.callback != null){
                        data.callback(data.obj,data.viewid,data.index,data.type,data.rate,data.pai);
                    }
                })
            )
        ); 
    },

    //翻转牌
    kaipai:function(data){
        var self = this;
        
        var scale = this._scale;
        self.node.runAction(
            cc.sequence(
                cc.scaleTo(0.15,0,scale),
                cc.callFunc(function () {
                    self.card.interactable = true;
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);
                    // if(data.atlas,data.value == 95){//大王
                    //     spriteFrame = data.atlas.getSpriteFrame("A3");
                    // }else if(data.atlas,data.value == 79){
                    //     spriteFrame =  data.atlas.getSpriteFrame("A2");
                    // }
                    self.card.spriteFrame = spriteFrame;  
                    self._value = data.value;
                },self),
                cc.scaleTo(0.15,scale,scale),
                cc.callFunc(function (){
                    self.node.scale = self._scale;
                    if(data.callback != null){
                        data.callback(data.obj,data.viewid,data.index,data.type,data.rate,data.pai);
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

    setValue:function(value){
        this._value = value;
    }, 

    getValue:function(){
        return this._value;
    },

    //type 0不显示 1显示 4th 2 显示 5th
    setType:function(type){
        if(type == 1){
            this.type.active = true;
            this.type.getComponent(cc.Sprite).spriteFrame = this.type_four;
        }else if(type == 2){
            this.type.active = true;
            this.type.getComponent(cc.Sprite).spriteFrame = this.type_five;
        }else{
            this.type.active = false;
        }
    }
});
