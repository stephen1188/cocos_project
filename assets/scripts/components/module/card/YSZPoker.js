cc.Class({
    extends: cc.Component,

    properties: {
        card:cc.Sprite,
        type:cc.Node,
        _value:255,
        _select:0,

        type_four:cc.SpriteFrame,
        type_five:cc.SpriteFrame,
    },

    onLoad:function(){
        this.initEventHandlers();
        // this.type.active = false;
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;
        
        //初始化
        this.node.on('fapai',function(data){
            self.fapai(data);
        });

        this.node.on('fapai_zeor',function(data){
            self.fapai_zeor(data);
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
            if(cc.vv.roomMgr.real <= 5){
                time = data.time * 0.1;
            }else{
                time = data.time * 0.2;
            }
         
        }else{
            time = data.index * 0.1;
        }
        if(data.puas != null){
            time = time + 0.1;
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
            cc.spawn(cc.moveTo(0.15,cc.v2(data.x,data.y)),cc.scaleTo(0.15,data.scale)),
            cc.delayTime(0.1),
            cc.callFunc(function (){
                if(data.callback != null){
                    data.callback(data.viewid,data.index);
                }
            },this)));
    },
    //发牌
    fapai_zeor:function(data){
        var self = this;
        var time = 0;
        self.node.runAction(cc.sequence(
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
            cc.spawn(cc.moveTo(0,cc.v2(data.x,data.y)),cc.scaleTo(0,data.scale)),
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
        self.card.interactable = true;
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
        //if(this._value != 255)return;

        var scale = self.node.scale;
        self.node.runAction(
            cc.sequence(
                cc.scaleTo(0.15,0,scale),
                cc.callFunc(function () {
                    self.card.interactable = true;
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
