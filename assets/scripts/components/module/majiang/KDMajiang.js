cc.Class({
    extends: cc.Component,

    properties: {
        bg:cc.Node,
        dian:cc.Node,
        jiantou:cc.Node,
        arrow:cc.Node,
        quantou:cc.Node,
        shandian:cc.Node,
        light:cc.Node,
        hu:cc.Node,
        huLight:cc.Node,
        chupaiLight:cc.Node,
        ting:cc.Node,
        _value:255,
        _index:-1,
        _select:0,
        _y:0,
        _x:0,
        _formTime:0,
        _isChupai:0, //0未出牌 1已出牌
        _keda:0,
        _enable:false,
    },

    onLoad:function(){
        this._y = this.node.y;
        this._x = this.node.x;
        this.initEventHandlers();
    },

    start:function(){
        this._nodeTuodongy = -500;
        this._nodeTuodongx = -1000;
        this.tox = this.node.x;
        this.toy = this.node.y;
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;

        this.node.on('moveBy', function(data){
            self.moveBy(data);
        });

        this.node.on('moveTo', function(data){
            self.moveTo(data);
        });
        this.node.on('chupaiShow', function(data){
            self.chupaiShow(data);
        });
        this.node.on('setTag', function(data){
            self.setTag(data);
        });
        this.node.on('setBg', function(data){
            self.setBg(data);
        });
        this.node.on('setDian', function(data){
            self.setDian(data);
        });
        this.node.on('nodeDestroy',function(data){
            self.nodeDestroy(data);
        });
        this.node.on('setEnabled',function(data){
            var enabled = data.enabled;
            self.setEnabled(enabled);
        });
        this.node.on('setSelect',function(data){
            var enabled = data.enabled;
            self.setSelect(enabled);
        });
        this.node.on('setValue',function(data){
            self.setValue(data);
        });
        //出牌移动牌 修改tag
        this.node.on('chuPaiMoveTo', function(data){
            self.chuPaiMoveTo(data);
        });
        //出牌进入牌堆
        this.node.on('comeChu', function(data){
            self.comeChu(data);
        });
        //设置牌色
        this.node.on('setColor', function(data){
            self.setColor(data);
        });
        //设置出牌堆中，牌值等于选中的牌
        this.node.on('setOutcrad', function(data){
            self.setOutcrad(data);
        }),
        //设置是否可见
        this.node.on('setActive', function(data){
            self.setActive(data);
        });
         //设置层级
         this.node.on('setZIndex', function(data){
            self.setZIndex(data);
        });
        //设置是否可以打出标示
        this.node.on('setKeda', function(data){
            self.setKeda(data);
        });
        //设置出牌箭头是否显示
        this.node.on('setPointer', function(data){
            self.setPointer(data);
        });
        //设置被碰杠胡的箭头
        this.node.on('setArrow', function(data){
            self.setArrow(data);
        });
        //设置被碰杠胡的箭头
        this.node.on('setQuantou', function(){
            self.setQuantou();
        });
        //设置出牌闪电
        this.node.on('setShandian', function(){
            self.setShandian();
        });
        //设置出牌背景框
        this.node.on('setLight', function(data){
            self.setLight(data);
        });
        //设置胡牌闪电
        this.node.on('sethu', function(data){
            self.sethu(data);
        });
        //设置胡牌时出牌的光效
        this.node.on('sethuLight', function(data){
            self.sethuLight(data);
        });
        //设置出牌的光效
        this.node.on('setChuLight', function(data){
            self.setChuLight(data);
        });
        //设置位置
        this.node.on('setPosition', function(data){
            self.setPosition();
        });
        //设置ScaleX
        this.node.on('setScaleX', function(data){
            var scaleX = self.node.scaleX;
            self.setScaleX(data, scaleX);
        });
        //设置听牌标示
        this.node.on('setTing', function(data){
            self.setTing(data);
        });

        //设置癞子标识
        this.node.on('setType', function(data){
            self.setType(data);
        });
    },

    moveBy:function(data){
        var self = this;
        if(data.scale){
            this.node.scale = data.scale;
        }
        var time = 0;
        if(data.delayTime != null){
            time = data.delayTime;
        }
        this.node.runAction(
            cc.sequence(
                cc.delayTime(time),
                cc.moveBy(data.time, cc.v2(data.x, data.y)),
                cc.callFunc(function (){
                    if(data.callback != null){
                        data.callback();
                    }
                })
            )
        )
    },

    moveTo:function(data){
        var self = this;
        if(data.scale){
            this.node.scale = data.scale;
        }
        var time = 0;
        if(data.delayTime != null){
            time = data.delayTime;
        }
        this.node.runAction(
            cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function (){
                    if(data.rotation != null){
                        self.node.rotation = data.rotation;
                    }
                }),
                cc.moveTo(data.time, cc.v2(data.x, data.y)),
                cc.callFunc(function (){
                    self.node.x = data.x;
                    self.node.y = data.y;
                    if(data.callback != null){
                        data.callback();
                    }
                })
            )
        )
    },

    chuPaiMoveTo:function(data){
        var self = this;
        this.node.scale = data.scale;
        this.node.myTag = data.myTag;
        var moPaiindex = data.moPaiindex;
        this._index = data.index;
        var time = 0;
        if(data.delayTime != null){
            time = data.delayTime;
        }
        this.node.runAction(
            cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function (){
                    if(data.rotation != null){
                        self.node.rotation = data.rotation;
                    }
                }),
                cc.moveTo(data.time, cc.v2(data.x, data.y)),
                cc.callFunc(function (){
                    self.node.x = data.x;
                    self.node.y = data.y;
                    if(data.callback != null){
                        data.callback(moPaiindex);
                    }
                })
            )
        )
    },

    //出牌 显示
    chupaiShow:function(data){
        var self = this;
        this.node.scale = data.scaleFrom;
        this.dian.getComponent(cc.Sprite).spriteFrame = data.spriteDianFrame.getSpriteFrame(data.spriteDianName);  
        this.dian.width = data.spriteBgWidth;  
        this.dian.height = data.spriteBgHeight; 
        this.dian.width = data.spriteBgWidth;  
        this.dian.x = data.dianX; 
        this.dian.x = data.dianY;
        this.dian.dianScale = data.dianScaleAll;

        if(data.skew != null){
            this.dian.skewX = data.skew.skewX;
            this.dian.skewY = data.skew.skewY;
        }else{
            this.dian.skewX = 0;
            this.dian.skewY = 0;
        }
        this.setBg(data);
        this.setDian(data);
        var time = 0;
        if(data.delayTime != null){
            time = data.delayTime;
        }
        this.node.runAction(
            cc.sequence(
                cc.delayTime(time),
                cc.spawn(cc.scaleTo(data.time, data.scaleTo, data.scaleTo) ,cc.moveTo(data.time, cc.v2(data.x, data.y))),
                cc.callFunc(function (){
                    self.node.x = data.x;
                    self.node.y = data.y;
                    self.node.scale = data.scaleTo;
                    if(data.callback != null){
                        data.callback(data.seatid, data.index);
                    }
                }),
            )
        )
    },

    //出牌 进入出牌堆
    comeChu:function(data){
        var self = this;
        var time = 0;
        if(data.delayTime != null){
            time = data.delayTime;
        }
        this.node.runAction(
            cc.sequence(
                cc.delayTime(time),
                cc.spawn(cc.scaleTo(data.time, data.scaleTo, data.scaleTo) ,cc.moveTo(data.time, cc.v2(data.x, data.y))),
                cc.callFunc(function (){
                    self.node.x = data.x;
                    self.node.y = data.y;
                    self.node.scale = data.scaleTo;
                    self.node.destroy();
                    if(data.callback != null){
                        var viewid = data.viewid;
                        var index = data.index;
                        var pai = data.pai;
                        var indexself = data.indexself;
                        data.callback(viewid,index,pai,indexself);
                    }
                })
            )
        )
    },  

    //设置tag
    setTag:function(data){
        this.node.myTag = data.myTag;
        var viewidArr = data.myTag.split("_");
        var viewid = parseInt(viewidArr[0]);
        this.node.parent = cc.vv.game.majiangTable.getHoldParent(viewid, "holdschupai");
        if(data.callback != null){
            data.callback(data.myTag);
        }
    },

    //设置背景
    setBg:function(data){
        this.bg.width = data.spriteBgWidth;
        this.bg.height = data.spriteBgHeight;
        var spriteName = data.spriteBgName; 
        var bgSprite = this.bg.getComponent(cc.Sprite);
        bgSprite.spriteFrame = data.spriteBgFrame.getSpriteFrame(spriteName);
    },

    setDian:function(data){
        this.dian.x = data.dianX;
        this.dian.y = data.dianY;
        this.dian.width = data.dianWidth;
        this.dian.height = data.dianHeight;
        this.dian.scaleX = data.dianScaleX * data.dianScaleAll;
        this.dian.scaleY = data.dianScaleAll;
        var spriteName = data.spriteDianName; 
        var dianSprite = this.dian.getComponent(cc.Sprite);
        dianSprite.spriteFrame = data.spriteDianFrame.getSpriteFrame(spriteName);
        this.dian.active = true;
    },
    
    setPointer:function(data){
        var isShow = data.isShow;
        if(isShow){
            this.jiantou.getChildByName("bg").getComponent(cc.Animation).play("jiantou");
        }else{
            this.jiantou.getChildByName("bg").getComponent(cc.Animation).stop();
        }
        this.jiantou.active = isShow;
    },

    setArrow:function(data){
        //右边所有牌都是左右相反，添加偏移量改变箭头的位置
        var deviation = 1;
        var selfSeatid = data.selfSeatid;
        var selfViewid = cc.vv.roomMgr.viewChairID(selfSeatid);
        var sides = cc.vv.mahjongMgr._sides;
        var sideSelfName = sides[selfViewid];
        switch(sideSelfName){
            case "myself":
                deviation = 0;
            break;
            case "right":
                deviation = 1;
            break;
            case "up":
                deviation = 0;
            break;
            case "left":
                deviation = 0;
            break;
        }
        var seatid = data.seatid;
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var sideName = sides[viewid];
        switch(sideName){
            case "myself":
                this.arrow.rotation = 90;
            break;
            case "right":
                this.arrow.rotation = 0  + deviation * 180;
            break;
            case "up":
                this.arrow.rotation = -90;
            break;
            case "left":
                this.arrow.rotation = 180  + deviation * 180;
            break;
        }
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var tingpos = cc.vv.utils.deepCopy(posall[selfViewid].ting);
        if(tingpos){
            this.arrow.parent.x = tingpos.scale * tingpos.x;
            this.arrow.parent.y = tingpos.scale * tingpos.y;
        }
        
        this.arrow.active = true;
    },

    setQuantou:function(){
        this.quantou.active = true;
    },

    setShandian:function(){
        this.shandian.active = true;
        // this.shandian.getComponent(cc.Animation).play("shandian");
    },

    setLight:function(data){
        var isShow = data.isShow;
        this.light.active = isShow;
    },

    sethu:function(data){
        var sprite = data.sprite;
        this.dian.getComponent(cc.Sprite).spriteFrame = sprite;
        this.hu.active = true;
        this.hu.getComponent(cc.Animation).play("huShandian");
        // cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_shandian");
    },

    sethuLight:function(data){
        this.huLight.active = true;
        this.huLight.getComponent(cc.Animation).play("chuhupaihu");
        if(data.callback != null){
            data.callback();
        }
    },

    setChuLight:function(){
        this.chupaiLight.active = true;
        this.chupaiLight.getComponent(cc.Animation).play("chuLight");
    },

    nodeDestroy:function(data){
        this.node.destroy();
        if(data.callback != null){
            data.callback(data);
        }
    },

    //0落下状态 1上升状态
    onPaiClicked:function(event, customEventData){
        if(this._keda == 1){
            if (cc.vv.userMgr.is_singletouch && !cc.vv.majiangTable.getisHasTingChupai()) {
                this._select = 1;
            }

            cc.vv.audioMgr.click();
            if(this._select == 1 && this._isChupai != 1 && cc.vv.mahjongMgr._canChui){
                //出牌 _value
                if(this._value != 255){
                    this._isChupai = 1;
                    this._select = 1
                    this.node.y = this._y + 20;
                    cc.vv.majiangTable.initBaoting();
                    cc.vv.game.shoot(this._value, this._index);
                }else{
                    cc.vv.log3.debug("出牌出错");
                }
            }else{
                if(this._select == 0){
                    cc.vv.majiangTable.setSelectDown(customEventData);
                    this._isChupai = 0;
                    this._select = 1
                    this.node.y = this._y + 20;
                    cc.vv.majiangTable.showTingPaiList(this._keda, this._value);
                    cc.vv.folds.change_color_outcrad(this._value);
                }else if(this._select == 1){
                    this._isChupai = 0;
                    this._select = 0;
                    this.node.y = this._y;
                    cc.vv.majiangTable.baotingopsUi(false);
                    cc.vv.folds.change_color_outcrad(-4);
                }
            }
            this._formTime = new Date().getTime();
        }
    },

    setColor:function(data){
        var isAn = data.isAn;
        if(isAn){
            this.node.getChildByName("bg").color=new cc.color(170,170,170);//麻将牌的花色也暗掉
        }else{
            this.node.getChildByName("bg").color=new cc.color(255,255,255);//麻将牌的花色也暗掉
        }

        if((cc.vv.mahjongMgr._magicPai != -1 && this._value == cc.vv.mahjongMgr._magicPai) || (cc.vv.mahjongMgr._magicPai2 != -1 && this._value == cc.vv.mahjongMgr._magicPai2)){
            this.node.getChildByName("bg").color=new cc.color(170,170,170);//麻将牌的花色也暗掉
        }
    },  

    setOutcrad:function(data){
        var isColor = data.isColor;
        if(isColor){
            this.node.getChildByName("bg").color = new cc.color(0,255,0);;//麻将牌的花色也暗掉
        }else{
            this.node.getChildByName("bg").color = new cc.color(255,255,255);//麻将牌的花色也暗掉
        }
    },

    setTing:function(data){
        var isActive = data.isActive;
        if(isActive){
            this.ting.active = true;
        }else{
            this.ting.active = false;
        }
    },

    isSelect:function(){
        return this._select;
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
            clickEventHandler.component = "KDMajiang";//这个是代码文件名
            clickEventHandler.handler = "onPaiClicked";
            clickEventHandler.customEventData = this.node.myTag;

            button.clickEvents.push(clickEventHandler);
            if(!this._enable){
                this._enable = true;
                this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,this.touchstart,this);
                this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
                this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_END, this.touchend, this);
                this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_CANCEL, this.touchcancel, this);
            }
        }else{
            button.clickEvents = [];
            this.node.getChildByName("bg").off(cc.Node.EventType.TOUCH_START);
            this.node.getChildByName("bg").off(cc.Node.EventType.TOUCH_MOVE);
            this.node.getChildByName("bg").off(cc.Node.EventType.TOUCH_END);
            this.node.getChildByName("bg").off(cc.Node.EventType.TOUCH_CANCEL);
            this._enable = false;
            var position = cc.v2(this._nodeTuodongx, this._nodeTuodongy);
            cc.vv.game.majiangTable.setTuodong(position);
        }
    },

    setSelect:function(selected){
        this._select = selected;
        this.node.y = (this._select==0)?this._y : this._y + 20;
    },

    setValue:function(data){
        var value = data.pai;
        var index = data.index;
        if(value != -2 && value != -3){
            this._value = value;
            this._index = index;
        }
    },

    setActive:function(data){
        var active = data.isActive;
        this.node.active = active;
        if(data.callback != null){
            data.callback();
        }
    },

    setZIndex:function(data){
        var zIndex = data.zIndex;
        this.node.zIndex = zIndex; 
        if(data.callback != null){
            data.callback();
        }
    },
    
    setKeda:function(data){
        var keda = data.keda;
        this._keda = keda; 
        if(data.callback != null){
            data.callback();
        }
    },

    setPosition:function(data){
        var x = data.x;
        var y = data.y;
        this.node.setPosition(x, y);
        if(data.callback != null){
            data.callback();
        }
    },

    setScaleX:function(data, scale){
        var scaleX = data.scaleX * scale;
        this.node.scaleX = scaleX;
        if(data.callback != null){
            data.callback();
        }
    },

    setType:function(data){
        var isActive = data.isActive;
        var type = this.node.getChildByName("bg").getChildByName("type");
        type.active = isActive;
    },

    getValue:function(){
        return this._value;
    },

    getIndex:function(){
        return this._index;
    },

    //触控
    touchstart: function (event) {
        if(cc.vv.mahjongMgr._canChui && this._keda == 1){
            this._isChupai = 0;
            var position = cc.v2(this.node.x, this.node.y);
            cc.vv.game.majiangTable.initTuodong(position, this._value);
            this.node.opacity = 155;
            this.tox = this.node.x;
            this.toy = this.node.y;
            this._nodeTuodong = cc.vv.game.majiangTable.nodeTuodong;
        }
    },

    touchmove: function (event) {
        if(cc.vv.mahjongMgr._canChui &&this._index != -1 && this._keda == 1){
            let delta = event.touch.getDelta();// cc.Vec2()
            let deltaX = delta.x;
            let deltaY = delta.y;
            if(cc.vv.game.majiangTable.scaleNum){
                deltaX = deltaX / cc.vv.game.majiangTable.scaleNum;
                deltaY = deltaY / cc.vv.game.majiangTable.scaleNum;
            }
            this.tox += deltaX;
            this.toy += deltaY;
            var position = cc.v2(this.tox, this.toy);
            cc.vv.game.majiangTable.setTuodong(position)
        }
    },

    touchend: function (event) {
        var nodeTuodongy = this._nodeTuodongy;
        var nodeTuodongx = this._nodeTuodongx;
        if(cc.vv.mahjongMgr._canChui && this._keda == 1){
            this.node.opacity = 255;
            this._nodeTuodong = cc.vv.game.majiangTable.nodeTuodong;
            var y = this._nodeTuodong.y;
            if(y >= this.node.y + 100){
                //出牌 _value
                if(this._value != 255 && this._isChupai != -1){
                    this._isChupai = 1;
                    cc.vv.game.shoot(this._value, this._index);
                }else{
                    this._isChupai = 0;
                    cc.vv.log3.debug("出牌出错");
                }
            }else{
                this._isChupai = 0;
            }
        }
        if(nodeTuodongy == 0 || nodeTuodongx == 0 || nodeTuodongy == null || nodeTuodongx == null){
            nodeTuodongy = -500;
            nodeTuodongx = -1000;
        }
        var position = cc.v2(nodeTuodongx, nodeTuodongy);
        cc.vv.game.majiangTable.setTuodong(position);
    },

    touchcancel: function (event) {
        var nodeTuodongy = this._nodeTuodongy;
        var nodeTuodongx = this._nodeTuodongx;
        if(cc.vv.mahjongMgr._canChui && this._keda == 1){
            this.node.opacity = 255;
            this._nodeTuodong = cc.vv.game.majiangTable.nodeTuodong;
            var y = this._nodeTuodong.y;
            if(y >= this.node.y + 100){
                //出牌 _value
                if(this._value != 255){
                    this._isChupai = 1;
                    cc.vv.game.shoot(this._value, this._index);
                }else{
                    this._isChupai = 0;
                    cc.vv.log3.debug("出牌出错");
                }
            }else{
                this._isChupai = 0;
              
            }
        }
        if(nodeTuodongy == 0 || nodeTuodongx == 0 || nodeTuodongy == null || nodeTuodongx == null){
            nodeTuodongy = -500;
            nodeTuodongx = -1000;
        }
        var position = cc.v2(nodeTuodongx, nodeTuodongy);
        cc.vv.game.majiangTable.setTuodong(position);
    },
    onDestroy:function(){
        var nodeTuodongy = this._nodeTuodongy;
        var nodeTuodongx = this._nodeTuodongx;
        if(nodeTuodongy == 0 || nodeTuodongx == 0 || nodeTuodongy == null || nodeTuodongx == null){
            nodeTuodongy = -500;
            nodeTuodongx = -1000;
        }
        var position = cc.v2(nodeTuodongx, nodeTuodongy);
        cc.vv.game.majiangTable.setTuodong(position);
    }
});
