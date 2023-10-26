cc.Class({
    extends: cc.Component,

    properties: {
        nodeBg:cc.Node,
        nodeZhuang:cc.Node,
        nodeQiang:cc.Node,
        nodeHuangZhuang:cc.Node,
        nodeFangzhu:cc.Node,
        nodeLixian:cc.Node,
        nodeReady:cc.Node,
        nodeBet:cc.Node,
        nodeChat:cc.Node,
        nodeTiren:cc.Node,
        nodeEmoji:cc.Node,//表情
        nodeInteract:cc.Node,
        nodeKuang:cc.Node,
        nodeWatchGame:cc.Node,
        nodeVoice:cc.Node,
        _uid:0,
        _headurl:"",
        _data:null,
        lblName:cc.Label,
        lblWin:cc.Label,
        lblLost:cc.Label,
        lblChat:cc.Label,
        lblScore:cc.Label,
        sprHeadimg:cc.Sprite,
        _emoji_curtime:null
    },

    onLoad:function(){
        this.init();
        this.initEventHandlers();
    },

    start:function(){
      
    },

    //监听协议
    initEventHandlers:function(){
        
        var self = this;

        //开始游戏
        this.node.on('begin',function(data){
            self.nodeReady.active = false;
            self.nodeTiren.active = false;
            self.nodeBet.removeAllChildren();
        });

        this.node.on('round',function(data){
            self.nodeReady.active = false;
            self.nodeTiren.active = false;
            self.nodeBet.removeAllChildren();
        });
        this.node.on('showmg',function(data){
            self.showmg(data);
        });
        this.node.on('out',function(data){
            self.init();
        });

        this.node.on('win',function(data){
            self.win(data);
        });

        this.node.on('lost',function(data){
            self.lost(data);
        });

        this.node.on("bet",function(data){
            self.nodeBet.addChild(data.node);
        }),

        this.node.on('score',function(data){
            self.lblScore.string = data+ "";
        });

        //抢庄
        this.node.on('qiangzhuang',function(data){
            self.nodeZhuang.active = false;
            self.nodeQiang.active = true;
        });

        //定庄
        this.node.on('dingzhuang',function(data){
            self.nodeQiang.active = false;
            if(self.node.myTag == data.seatid){
                self.nodeZhuang.active = true;
            }else{
                self.nodeZhuang.active = false;
            }
        });

        //显示荒庄
        this.node.on('huangzhuang',function(data){
            if(self.node.myTag == data.seatid){
                self.nodeHuangZhuang.active = true;
            }else{
                self.nodeHuangZhuang.active = false;
            }
        });

        //隐藏下注分
        this.node.on('hideBet',function(data){
            self.nodeBet.removeAllChildren();
        });
    },
    dingzhuang:function(seatid,zhuang){
        if(zhuang == seatid){
            this.nodeZhuang.active = true;
        }else{
            this.nodeZhuang.active = false;
        }
    },

    //显示隐藏高亮框框
    liangkuang:function(orshow){
        if(orshow == true){
            this.nodeKuang.active = true;
        }else{
            this.nodeKuang.active = false;
        }
    },

    //赢分
    win:function(data){
        var self = this;
        this.lblWin.node.active = true;
        this.lblWin.node.runAction(
            cc.sequence(
                cc.show(),                
                cc.callFunc(function (){
                    self.lblWin.string  = "+" + data;
                }),                
                cc.moveTo(0.2,cc.v2(0,82)),
                cc.delayTime(1.5),
                cc.hide()
            )
       );
    },

    //赢分
    lost:function(data){
        var self = this;
        this.lblLost.node.active = true;
        this.lblLost.node.runAction(
            cc.sequence(
                // cc.moveTo(0.0,cc.v2(0,72)),
                cc.show(),    
                cc.callFunc(function (){
                    self.lblLost.string  = data;
                }),
                cc.moveTo(0.2,cc.v2(0,82)),
                cc.delayTime(1.5),
                cc.hide()
            )
        );
    },

    init:function(){

        var self = this;

        this._uid = 0;
        this.lblName.node.active = false;
        this.lblScore.node.active = false;
        this.nodeBg.active = false;
        
        this.zhuang(false);
        this.fangzhu(false);
        this.lixian(false);
        this.ready(false);
        this.tiren(false);
        //加载默认头像
        cc.loader.loadRes('public/headimg', function( error, tex )
        {
            if(error){
                return;
            }
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            if(spriteFrame && self.sprHeadimg){
                self.sprHeadimg.spriteFrame = spriteFrame;
            }
           
        });
    },

    //设置位置
    pos:function(data){
        this.node.x = data.x;
        this.node.y = data.y;
        this.node.scale= data.scale;
        this.nodeReady.x = data.pos.ready.x;
        this.nodeReady.y = data.pos.ready.y;
        this.nodeBet.x = data.pos.bet.x;
        this.nodeBet.y = data.pos.bet.y;
        this.nodeChat.x = data.pos.chat.x;
        this.nodeChat.y = data.pos.chat.y;
        this.nodeVoice.scaleX = data.pos.voice.scalex;
        this.nodeVoice.scaleY = data.pos.voice.scaley;
        this.nodeVoice.x = data.pos.voice.x;
        this.nodeVoice.y = data.pos.voice.y;
    },

    //{"score":0,"headimg":"","sex":0,"ip":"","nickname":"","online":0,"seatid":2,"userid":0,"status":0}
    info:function(info){
        
        this._info = info;
        var Canvas = cc.find("Canvas");
        var mgr = Canvas.getChildByName("mgr");
        var is_yszgame = false;//赢三张排位场中途 重新连接需要 减去已经丢掉筹码；
        if(mgr != null){
            var desktop = mgr.getChildByName("desktop");
            if(desktop != null){
                var cur_chip = desktop.getChildByName("cur_chip");
                if(cur_chip != null){
                    var userchip = cc.vv.utils.getChildByTag(cur_chip,info.seatid);
                    if(userchip != null){
                        var user_plyFen =  cc.vv.utils.getChildByTag(cur_chip,this._info.seatid).getChildByName("user_chip_txt").getComponent(cc.Label).string;
                        is_yszgame = true
                    }
                }
            }
        }
        if(info.sitStatus == 1){
            this.nodeWatchGame.active = true;
        }else{
            this.nodeWatchGame.active = false;
        }
        if(is_yszgame){
            this.lblScore.string =  cc.vv.utils.numFormat(info.score - user_plyFen);
        }else{
            this.lblScore.string = info.score;
        }
       

        if(cc.vv.roomMgr.is_replay){
            this.lblScore.string = "-";
        }
        
        this.lblName.string =cc.vv.utils.cutString(info.nickname,6);
        if(info.userid == this._uid)return;

        this.lblName.node.active = true;
        this.lblScore.node.active = true;
        this.nodeBg.active = cc.vv.roomMgr.room_type !=="zgz_3300";
        this.lblScore.node.active = cc.vv.roomMgr.room_type !=="zgz_3300";
        this._uid = info.userid;
        this._headurl = info.headimg;
        this.lixian(info.online==0);
        this.ready(info.status==1)
   
        //循环移动名字
        // this.lblName.node.stopAllActions();
        // if(this.lblName.node.width > 90){
        //     var move = (this.lblName.node.width - 90) / 2;
        //     this.lblName.node.runAction(
        //         cc.repeatForever(
        //             cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,0)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,0)))
        //         )
        //     );
        // }
        
        if(this._uid != cc.vv.userMgr.userid
            && cc.vv.roomMgr.started == 0
            && cc.vv.roomMgr.param != null &&cc.vv.roomMgr.param.creator == cc.vv.userMgr.userid){
                
                this.tiren(true);
        }else{
            this.tiren(false);
        }
        if(cc.vv.roomMgr.room_type =="zgz_3300"){}
        //更新头像
        this.sprHeadimg.getComponent("ImageLoader").loadImg(this._headurl);
    },
    change_pwb:function(pwb){
        this.lblScore.node.active = true;
        this.lblScore.string = pwb;
    },

    getHeadimg:function(){
        return this.sprHeadimg.spriteFrame;
    },

    zhuang:function(show){
        this.nodeZhuang.active = show;
    },

    fangzhu:function(show){
        this.nodeFangzhu.active = show;
    },
    showmg:function(show){
        this.nodeVoice.active = show;
    },
    lixian:function(show){
        this.nodeLixian.active = show;
    },

    ready:function(show){
        this.nodeReady.active = show;
        var watch = this.node.getChildByName("watch_game");
        if(show && watch != null){
            watch.active = false;
        }
    },
    
    tiren:function(show){
        this.nodeTiren.active = show;
    },
    chat:function(text){
        this.lblChat.string = text;
        this.lblChat.getComponent(cc.Label)._forceUpdateRenderData();
        this.nodeChat.active = true;
        this.nodeChat.height = this.lblChat.node.height + 30;
        this.nodeChat.stopAllActions();
        this.nodeChat.runAction(
            cc.sequence(cc.show(),cc.delayTime(4.0),cc.hide())
        )
    },
    
    //表情
    emoji:function(data)
    {
        var self = this;
        this.nodeEmoji.active=true;
        var anim = this.nodeEmoji.getComponent(cc.Animation);
        anim.play('index_'+data.index);
        this._emoji_curtime = 3;
    },
    //互动
    interact:function(data)
    {
        this.nodeInteract.active=true;
        var anim = this.nodeInteract.getComponent(cc.Animation);
        var mp3File = "interact/interact_"+ data.phiz_id;
        cc.vv.audioMgr.playSFX(mp3File);//根据按钮回调的id播放这个特效的音乐。
        anim.play('interact_'+data.phiz_id);//根据这个id；来播放这动画特效。
        anim.on('finished',function()
        {
            this.nodeInteract.active=false;
        },this);
    },
    
    onBtnClicked:function(event,data){
        switch(event.target.name){
            case "head_bg":{
                var self = this;
                cc.vv.popMgr.open("table/UserInfo",function(obj){
                    cc.vv.utils.popPanel(obj);
                    obj.getComponent("UserInfo").show(self.node.myTag);
                });
            }
            break;
            case "btn_tiren":{
                cc.vv.net2.quick("out",{roomid:cc.vv.roomMgr.roomid,userid:this._uid});
            }
            break;
            default:{
                cc.vv.popMgr.alert("你点的啥？");
            }
        }
        
    },//三秒后隐藏表情  
    delemoji:function(dt)
    {
        if (this._emoji_curtime>0) 
        {
            this._emoji_curtime-=dt;
            if (this._emoji_curtime<=0) 
            {
                this.nodeEmoji.active=false;
            }
        }
    },
    update:function(dt)
    {
        this.delemoji(dt);
    },


});
