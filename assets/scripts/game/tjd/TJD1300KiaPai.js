

cc.Class({
    extends: cc.Component,

    properties: {
         pai1:cc.Node,
         pai2:cc.Node,
         type:cc.Sprite,
         typeAtlas:{
            default:null,
             type:cc.SpriteAtlas
         },
         dianshuAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        bishiAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        title1:cc.SpriteFrame,
         _dianshu:0,
         _falg:0
    },
    onLoad () {
        
        //监听协议
        this.initEventHandlers();
    },

    start () {

    },
    initEventHandlers(){
        var self=this;
        //搓牌的事件
        this.pai2.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self._falg == 0){
                self._falg = 1;
            }
        });
       this.pai2.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            var delta = event.touch.getDelta();
            self.pai2.x += delta.x;
            self.pai2.y += delta.y;
           
        });
        this.pai2.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            self.pai2.opacity = 255;
        });

        function setpai1(){
            self.pai1.on(cc.Node.EventType.TOUCH_MOVE,function(event){
                var delta = event.touch.getDelta();
                self.pai1.x += delta.x;
                self.pai1.y += delta.y;
               
            });
            self.pai1.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
                self.pai1.opacity = 255;
            });

            self.pai1.on(cc.Node.EventType.TOUCH_END,function(event){
                self.pai1.opacity = 255;
                self.pai1.setPosition(0, 0);
                self.pai1.zIndex = 0;
                self.pai1.setPosition(50, 0);
                self.pai2.setPosition(-50,0);
                self.pai1.getChildByName("pai").active=true;
                self.showType();
                self.pai1.off(cc.Node.EventType.TOUCH_START);
                self.pai1.off(cc.Node.EventType.TOUCH_MOVE);
                self.pai1.off(cc.Node.EventType.TOUCH_CANCEL);
                self.pai1.off(cc.Node.EventType.TOUCH_END);
            });
        }
        this.pai2.on(cc.Node.EventType.TOUCH_END,function(event){
            self.pai2.opacity = 255;
            self.pai1.setPosition(0, 0);
            self.pai1.zIndex = 1;
            //self.pai2.setPosition(0, -27.4);
            var callfunc = cc.callFunc(function(){
                self.pai2.getChildByName("pai").active = true;
                self.pai2.getComponent(cc.Sprite).spriteFrame=self.typeAtlas.getSpriteFrame("title1");
                // self.pai2.rotation = 180;
                // self.pai2.getChildByName("pai").rotation = 180;
            });
            //self.pai2.getComponent(cc.Sprite).spriteFrame=self.typeAtlas.getSpriteFrame("tilebg_2_0"); 
            //self.pai2.getChildByName("pai").active=true;
            self.pai2.runAction(cc.sequence(cc.moveTo(0.3,cc.v2(0,27.4)),callfunc));
            self.pai2.off(cc.Node.EventType.TOUCH_START);
            self.pai2.off(cc.Node.EventType.TOUCH_MOVE);
            self.pai2.off(cc.Node.EventType.TOUCH_CANCEL);
            self.pai2.off(cc.Node.EventType.TOUCH_END);
            setpai1();
        });

        this.node.on("cuopai",function(data){
            self.type.node.active = false;
            self.pai2.getChildByName("pai").active = false;
            self.pai2.getChildByName("pai").getComponent(cc.Sprite).spriteFrame=self.typeAtlas.getSpriteFrame("B"+data.hand[0]); 
            self.pai1.getComponent(cc.Sprite).spriteFrame=self.typeAtlas.getSpriteFrame("title1"); 
            self.pai1.getChildByName("pai").active = true;
            self.pai1.getChildByName("pai").getComponent(cc.Sprite).spriteFrame=self.typeAtlas.getSpriteFrame("B"+data.hand[1]);  
            self._data = data;
            
        });
    },

    showType:function(){
        this.type.node.active = true;
        if(this._data.type == 0){
            this.type.spriteFrame = this.bishiAtlas.getSpriteFrame("tjd_bi10");
        }
        else if(this._data.hand[0] == this._data.hand[1]){
            this.type.spriteFrame = this.dianshuAtlas.getSpriteFrame("tjd_dui" + this._data.hand[1]);
        }
        else {
            var yushu = (this._data.hand[0] + this._data.hand[1])%10;
            this.type.spriteFrame = this.dianshuAtlas.getSpriteFrame("tjd_dian" + yushu);
        }
    },

    //按钮操作
    onBtnClicked:function(event,data){
        switch(event.target.name){
            case "btn_kaipai":{
                cc.vv.net2.quick("kaipai");
                this.node.destroy();
            }
            break;
         }
     }

});
