cc.Class({
    extends: cc.Component,

    editor: {
        executionOrder: -1
    },

    properties:{
        _winPlayer:cc.Node,
        nodeCard:cc.Node,
        nodeXiazhu:cc.Node,
        nodeJiesuan:cc.Node,
        nodeReport:cc.Node,
        pokerPrefab:cc.Prefab,
        othercards:cc.Node,
        opts:cc.Node,
        timepos:cc.Node,
        poker1Atlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        poker2Atlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        jiesuanAltas:{
            default:null,
            type:cc.SpriteAtlas
        },
        btnAltas:{
            default:null,
            type:cc.SpriteAtlas
        },
        tipAltas:{
            default:null,
            type:cc.SpriteAtlas
        },
        gamebegin:cc.Node,
        sprTip:cc.Sprite,
        waitclock:cc.Node,
        othterfolds:cc.Node,
        gaipaiTip:cc.Node,
        zhuafenNode:cc.Node,
        mainPoker:cc.Sprite,
        tablefen:cc.Node,
        gaipaiNode:cc.Node,
        difen:cc.Label,
        robNum:cc.Sprite,
        btn_lookgaipai:cc.Node,
        spine1:cc.Node,
        spine2:cc.Node,
        tips:cc.Node,
        sprTip:cc.Sprite,
        totalZhuafen:cc.Label,
        bignumlos:cc.BitmapFont,
        bignumwin:cc.BitmapFont,
        animationNode:cc.Node,
        btn_fanzhu:cc.Node,
        reportItemPrefab:cc.Prefab,

        _tipIndex:0,
        _noChoise:true,
        _turn:1,
        _idx:0
    },

    onLoad () {
        
        
        var const_dq = require("DQ2700Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"dq",
            hide_nothing_seat:false,
            direct_begin:false,
            chat_path:const_dq.chat_path,
            quick_chat:const_dq.quick_chat,
            player_4:const_dq.player4,
            player_5:const_dq.player5,
            set_bg:true,
            location:false,
            show_watch_btn:false,//是否显示观战按钮
            default_bg:const_dq.default_bg
        }

        this._winPlayer = cc.find("Canvas/mgr/players");

        //获取对象
        this.table = this.node.getComponent("Table");

        //初始化
        this.new_round();
        //监听协议
        this.initEventHandlers();

      
        this.btn_tishi = this.opts.getChildByName('btn_tishi');
        this.btn_chupai = this.opts.getChildByName('btn_chupai');
        this.timepoint = this.opts.getChildByName('timepoint').getComponentInChildren(cc.Label);
        this.btn_gaipai = this.opts.getChildByName('btn_gaipai');
        this.btn_touxiang = this.opts.getChildByName('btn_touxiang');

        this.ske = this.spine1.getComponent(sp.Skeleton);
        this.ske2 = this.spine2.getComponent(sp.Skeleton);

        this.noMove = true;
       
        this.initPos();
       

        this.anim = this.animationNode.getComponent(cc.Animation);
        this.anim.on('finished',this.onFinished,this);
    },

    onFinished:function(){
        this.animationNode.active = false;
    },

    initPos:function(){
        var results = this.nodeJiesuan.getChildByName('results');
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            this.othterfolds.children[i].x = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.fold.x;
            this.othterfolds.children[i].y = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.fold.y;
            this.timepos.children[i].x = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.time.x;
            this.timepos.children[i].y = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.time.y;
            this.zhuafenNode.children[i].x = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.zhuafen.x;
            this.zhuafenNode.children[i].y = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.zhuafen.y;
            this.tips.children[i].x = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.tip.x;
            this.tips.children[i].y = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.tip.y;
            results.children[i].active = true;
            results.children[i].x = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.score.x;
            results.children[i].y = cc.vv.game.config["player_" + cc.vv.roomMgr.ren][i].pos.score.y;
        }
    },

    start(){
        var self = this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        this.nodeCard.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_END, this.touchend, this);

        cc.vv.dqMgr = this.node.getComponent("DQ2700Mgr");

        //回放
        var ReplayMgr = require("DQ2700ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });

            //初始化数据
            cc.vv.dqMgr.prepareReplay();
            function callback(seatid){
                self.table.seat();
                
                //显示坐的人
                self.table.table(cc.vv.roomMgr.table);

                //回放数据
                cc.vv.replayMgr.init(cc.vv.roomMgr.action.action,cc.vv.roomMgr.jiesuan);
            }
            var view_tips = this.node.getChildByName("replay").getChildByName("SView_tips");
            view_tips.active = true;
            var info = {

                callback:callback
            }
            view_tips.emit("get_open", info);
        }
    },

    initEventHandlers:function(){
         //初始化事件监听器
         var self = this;

         //游戏参数
         this.node.on('param',function(data){
             self.param(data.data);
         }),
 
         //准备
         this.node.on("ready",function(data){
             self.ready(data.data);
         }),
 
         //开始
         this.node.on("begin",function(data){
             //self.begin();
         }),
 
          //发牌
          this.node.on("fapai",function(data){
             //self.fapai(data.data);
             var pai = data.data.pai;
             self.begin();
             self.fapai(pai);
         }),

         this.node.on("paiXu",function(data){
             self.sortCard(data.data.list);
         })

         //小结算
        this.node.on("jiesuan",function(data){
            self.gaipaiArr = data.data.gaipai;
            self.jiesuan(data.data);
        }),

         //大结算
         this.node.on("report",function(data){
            if(data.errcode == -1){
                self.nodeJiesuan.active = false;
                return;
            }
            self.report(data.data);
        }),

         //恢复桌面
         this.node.on('stage',function(data){
            self.stage(data.data);
        }),

        //出牌
        this.node.on("chupai",function(data){
            self.chupai(data.data);
        }),

        this.node.on("opera",function(data){
            self.operate(data.data);
        }),

        this.node.on("robMain",function(data){
            //var jiaozhu = data.data.jiaozhu;
            // if(cc.vv.roomMgr.stage != null){
            //     self.robMain(data.data);
            // }
        })

        this.node.on("getMain",function(data){
            self.getMain(data.data);
        })

        this.node.on('getZhungPoker',function(data){
            self.getZhungPoker(data.data);
        })

        this.node.on('gaipai',function(data){
            self.gaipai(data.data);
        })

        this.node.on('error',function(data){
            cc.vv.popMgr.tip(data.errmsg);
        })

        this.node.on('tip',function(data){
            self.tishipai = data.data;
        })

        this.node.on('pushLun',function(data){
            self.pushLun(data.data);
        })

        this.node.on('showFriend',function(data){
            self.totalZhuafen.string = data.data.AllFen;
            var seatid = data.data.seatId;
            if(seatid != self._gongtou){
                self.showGongYou(data.data.seatId);
            }
        })

        this.node.on('chaoDi',function(data){
            self._level = data.data.level;
            self._power = data.data.power;
        })

        this.node.on('showClock',function(data){
            self.showClock(data.seatid);
        }),

        this.node.on('showMiners',function(data){
            self.showMiners(data.data);
        }),

        this.node.on('beaginTouxiang',function(data){
            self.Touxiang(data.data);
        }),


        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay){
                self.new_round();
                //cc.vv.net2.quick('stage');
                cc.vv.popMgr.wait("正在恢复桌面",function(){
                    setTimeout(() => {
                        cc.vv.net2.quick("stage");
                    }, 500);
                });
            }
        });
    },

    //判断触摸范围
    isInRect:function(location){
        for (var i = this.nodeCard.childrenCount - 1; i >= 0; --i) {
            var item = this.nodeCard.children[i];
            var rect = item.getBoundingBoxToWorld();
            var button = item.getChildByName('button');

            if(rect.contains(location) && !button.active){
                item.getComponent('DQPoker').setMove(1);
                item.isChiose = true;
                return item;
            }
        }

        return null;
    },

    //设置所有牌没被选中
    setAllCardUnSelected:function(){
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            var card =  this.nodeCard.children[i].getComponent('DQPoker');
            this.selectCard(card,0);
        }
    },

    //设置牌状态
    selectCard:function(card,myTag){
        card.setSelect(myTag);
    },

    //得到选中的牌
    getSelectPaiList:function(selected){
        var result = [];
        for (var i = 0; i < this.nodeCard.childrenCount; ++i) {
            var children = this.nodeCard.children[i];
            var card = children.getComponent('DQPoker');
            if(card.isSelect() == selected){
                result.push(children);
            }
        }
        return result;
    },

    touchstart:function(event){
        //if(this.noMove)return false;

        event.stopPropagation();
        var location = event.getLocation();
        var item = this.isInRect(location);

        if(item){
            return true;
        }

        
        if(this.getSelectPaiList(1).length > 0){
            this._noChoise = !this._noChoise;
            if(this._noChoise){
                this.setAllCardUnSelected();
            }
        }
        return false;
    },

    touchmove:function(event){
        //if(this.noMove)return;

        event.stopPropagation();
        var location = event.getLocation();
        var item = this.isInRect(location);

        if(item){
            return;
        }
    },

    touchend:function(event){
        //if(this.noMove)return;

        var count = 0;
        var list = [];
        for (var i = 0; i < this.nodeCard.childrenCount; ++i) {
            var item = this.nodeCard.children[i];
            if(item.isChiose){
                count++;
                var card = item.getComponent('DQPoker');
                card.setMove(0);
                this.selectCard(card,card.isSelect()?0:1);
                item.isChiose = false;
                if(card.isSelect() == 1){
                    list.push({value:item.value%16,node:item});
                }
            }
        }
        
        if(count>0){
            cc.vv.audioMgr.click();
        }
    },

    new_round:function(){
        this.nodeXiazhu.active = false;
        this.disableButtons();
        this.nodeReport.active = false;
        this.nodeJiesuan.active = false;
        this.nodeCard.removeAllChildren();
        this.othercards.active = false;
        this.opts.active = false;
        cc.vv.roomMgr.stage = null;
        this.hideTips();
        this.clearAllPoker();
        this.waitclock.active = false;
        this.gamebegin.active = false;
        this.isBegin = false;
        cc.vv.roomMgr.stage = null;
        this.is_jiaozhu = false;
        this.is_fanzhu = false;
        this.hideZhuafen();
        this.mainPoker.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,255);
        this.tablefen.active = false;
        this.tablefen.getChildByName('fen').getComponent(cc.Label).string = 0;
        this.clearPlayerMark();
        this.gaipaiNode.active = false;
        this._turn = 1;
        this.robNum.spriteFrame = this.tipAltas.getSpriteFrame("x0");
        this.btn_lookgaipai.active = false;
        this.sprTip.node.active = false;
        this.totalZhuafen.string = 0;
        this._gongyou = 99;
        this._gongtou = 99;
        this.mainValue = -1;
        this.gamestate = "";
        this.mainArr = [];
        this._idx = 0;
        this.mainColor = 99;
        this.btn_fanzhu.active = false;
        this.gaipaiTip.active = false;
        this._kuangzhu = 0;
        this.canTouxiang = false;
        this.mainSize = 0;
        this.robPoke = 99;
        this.tishipai = null;
        this.gaipaiArr = null;
        this.hand = null;
    },

    hideZhuafen:function(){
        for(var i = 0; i < this.zhuafenNode.childrenCount; i++){
            this.zhuafenNode.children[i].active = false; 
        }
    },

    hideTips:function(){
        for(var i = 0; i < this.tips.childrenCount; i++){
            var node = this.tips.children[i];
            node.active = false;
        }
    },

    disableButtons:function(){
        var mainbtns = this.nodeXiazhu.getChildByName('mainbtns');
        for(var i = 0; i < mainbtns.childrenCount; i++){
            var node = mainbtns.children[i];
            var button = node.getComponent(cc.Button);
            button.interactable = false;
            var select = node.getChildByName('select');
            var num = node.getChildByName('num');
            select.active = false;
            num.active = false;
        }
        this.nodeXiazhu.getChildByName('btn_main1').active = false;
        this.nodeXiazhu.getChildByName('btn_main2').active = false;
    },

    begin:function(){

    },

    //游戏参数
    param:function(data){
        this._fangzhu = data.fangzhu;
        this.difen.string = data.difen;
    },

    //准备
    ready:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.new_round();
        }
    },

    begin:function(){
        if(this.isBegin) return;
        cc.vv.audioMgr.playSFX('ddz/game_begin');
    },

    //清理桌面上出的牌
    clearAllPoker:function(){
        for(var i = 0; i < this.othterfolds.childrenCount; i++){
            this.othterfolds.children[i].removeAllChildren();
        }
    },

    //清理出过的牌
    clearPoker:function(index){
        this.othterfolds.children[index].removeAllChildren();
    },

    fapai:function(pai){
        this.isBegin = true;
        var self = this;
        this.hand = pai;

        this.table._winHub.emit("round");

        //让座位到开局状态
        this.table.seat_emit(null,"round");

        this.nodeXiazhu.active = false;
        this.disableButtons();
        this.mainArr = [];
        this.is_jiaozhu = false;
        this.nodeCard.removeAllChildren();

        if(!cc.vv.roomMgr.is_replay){
            this.unschedule(this.otherTimeUpdate);
            this.tip('waitjiaozhu');
            this.waitclock.x = 0;
            this.waitclock.y = 25;
            this.waitclock.active = true;
            this.waitclock.getComponentInChildren(cc.Label).string = 20; // pai.length == 20 ? 19 : 24
            this.schedule(this.otherTimeUpdate,1);
            this.unschedule(this.newPoker);
            this.is_jiaozhu = false;
            this.gamestate = "fapai";
            this.nodeCard.getComponent(cc.Layout).enabled = true;
            this.nodeCard.getComponent(cc.Layout).spacingX = pai.length == 20 ? -104 : -114;

            let onetime = (20 - 5) / pai.length;
            this.schedule(this.newPoker,onetime,pai.length);
        }else{
            this.nodeCard.getComponent(cc.Layout).enabled = false;
            this.deal_fapai(pai);
        }
       
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            var node = this.zhuafenNode.children[i];
            node.active = true;
            node.getChildByName('fen').getComponent(cc.Label).string = 0;
        }
    },

    fapai2:function(pai){
        this.isBegin = true;
        var self = this;
        if(pai.length == 20 || pai.length == 25){
            this.hand = pai;
        }

        this.table._winHub.emit("round");

        //让座位到开局状态
        this.table.seat_emit(null,"round");

        this.nodeXiazhu.active = false;
        this.disableButtons();
        this.mainArr = [];
        this.unschedule(this.newPoker);
        this.nodeCard.removeAllChildren();
        this.nodeCard.width = 2000;
        this.nodeCard.getComponent(cc.Layout).enabled = false;
        this.deal_fapai(pai);
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            var node = this.zhuafenNode.children[i];
            node.active = true;
            node.getChildByName('fen').getComponent(cc.Label).string = 0;
        }
    },

    //发牌效果
    newPoker:function(){
        var self = this;
        if(this.nodeCard.childrenCount >= this.hand.length){
            this.nodeCard.getComponent(cc.Layout).enabled = false;
            this.nodeCard.width = 2000;
            this._idx = 0;
            return;
        }
       
        var value = this.hand[this._idx++];
        var node = cc.instantiate(this.pokerPrefab);
        var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,value);
        node.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
        node.value = value;
        if(this.gamestate == 'fapai' || this.gamestate == 'getMain'){
            if(value%16 == 7){
                this.mainArr.push(value);
                if(!this.is_jiaozhu){
                    this.refreshJiaozhu();
                }else if(!this.is_fanzhu){
                    var canfan = false;
                    for(var k = 7; k <= 55; k++){
                        var zhu = this.isMain(k);
                        if(zhu.length == 2 && zhu[0] != this.robPoke){
                            this.nodeXiazhu.active = false;
                            this.btn_fanzhu.active = true;
                            this.tip(null);
                            canfan = true;
                        }
                    }
                    if(!canfan){
                        this.btn_fanzhu.active = false;
                        this.tip('waitfanzhu');
                    }
                }
            }
        }
        this.nodeCard.addChild(node);
        var array = [];
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            var node = this.nodeCard.children[i];
            array.push(node.value);
        }
        this.sortCardNode(array);
    },

    Touxiang:function(){
        this.canTouxiang = true;
        this.btn_touxiang.active = true;
    },

    //可以叫主的状态
    refreshJiaozhu:function(){
        this.nodeXiazhu.active = true;
        var mainbtns = this.nodeXiazhu.getChildByName('mainbtns');
        var a = 0, b = 0, c = 0, d = 0;
        for(var i = 0; i < this.mainArr.length; i++){
            var count = 0;
            var value = this.mainArr[i];
            var btn = mainbtns.getChildByName('main' + value);
            if(value == 7){
                count = ++a;
            }else if(value == 23){
                count = ++b;
            }else if(value == 39){
                count = ++c;
            }else if(value == 55){
                count = ++d;
            }
            btn.getComponent(cc.Button).interactable = true;
            btn.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.btnAltas.getSpriteFrame(count + 'zhang');
            btn.getChildByName('num').active = true;
        }
    },

    //给玩家发牌
    deal_fapai:function(pai){
        var list = this.SortCardList(pai);
        var self = this;
        this.mainArr = [];
        for(var i = 0; i < list.length; i++){
            var card = cc.instantiate(self.pokerPrefab);
            card.myTag = i;
            self.nodeCard.addChild(card);
            card.x = -570 + i*60;
            var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,list[i]);
            card.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
            card.value = list[i];
            if(list[i]%16 == 7){
                this.mainArr.push(list[i]);
            }
            if(i == list.length -1){
                this.refreshHandCards();
            }
        }
        if(cc.vv.roomMgr.stage){
            if(cc.vv.roomMgr.stage.stage == 1 || cc.vv.roomMgr.stage.stage == 2){
                this.selectZhu2();
            }else if(cc.vv.roomMgr.stage.stage == 4){
                this.getTip(this.tishipai);
            }
        }
        if(pai.length == 28 || pai.length == 33){
            this.nodeCard.getComponent(cc.Layout).enabled = true;
            this.nodeCard.getComponent(cc.Layout).spacingX = pai.length == 28 ? -104 : -114;
            this.nodeCard.scale = 0.75;
        }
    },

    clearPlayerMark:function(){
        for(var i = 0; i < this._winPlayer.childrenCount; i++){
            var node = this._winPlayer.children[i];
            var gongtou = node.getChildByName("gongtou");
            var gongyou = node.getChildByName("gongyou");
            if(gongtou != null){
                gongtou.removeFromParent();
            }
            if(gongyou != null){
                gongyou.removeFromParent();
            }
        }
    },

    showMiners:function(data){
        //大矿主
        this._kuangzhu = 1;
        this.showGongTou(data.seatId);
    },

    //显示工头
    showGongTou:function(seatid){
        if(seatid == 99) return;
        var spriteframe = null;
        spriteframe = "icon_gongtou";
        if(this._kuangzhu == 1){
            spriteframe = "icon_kuangzhu";
        }
        var name = "gongtou";
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        this._gongtou = seatid;
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            var node = cc.vv.utils.getChildByTag(this._winPlayer,i)
            var zhuafen = this.zhuafenNode.children[i];
            var fen = zhuafen.getChildByName('fen').getComponent(cc.Label);
            var mark = node.getChildByName(name);
            if(mark != null){
                mark.removeFromParent();
            }
            if(node.myTag == viewid){
                mark = new cc.Node(name);
                var sprite = mark.addComponent(cc.Sprite);
                sprite.spriteFrame = this.btnAltas.getSpriteFrame(spriteframe);
                node.addChild(mark);
                var endpos = cc.v2(0,50);
                if(this._kuangzhu == 1 || cc.vv.roomMgr.stage || cc.vv.roomMgr.is_replay){
                    mark.x = 0;
                    mark.y = 50;
                }else{
                    mark.x = 0-node.x;
                    mark.y = 0-node.y;
                    var time = 1.5;
                    var move = cc.moveTo(time,endpos).easing(cc.easeElasticInOut(time));
                    var effect =  cc.callFunc(function(){
                        cc.vv.audioMgr.playSFX('ddz/effect/effect_dizhuRole');
                    });
                    mark.runAction(cc.spawn(move,effect));
                }
                
                zhuafen.active = false;
            }else{
                zhuafen.active = true;
            }
        }
    },

    //显示工友
    showGongYou:function(seatid){
        if(seatid == 99) return;
        var spriteframe = "icon_gongyou";
        var name = "gongyou";
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        this._gongyou = seatid;
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            var node = cc.vv.utils.getChildByTag(this._winPlayer,i)
            var zhuafen = this.zhuafenNode.children[i];
            var fen = zhuafen.getChildByName('fen').getComponent(cc.Label);
            var mark = node.getChildByName(name);
            if(mark != null){
                mark.removeFromParent();
            }
            if(node.myTag == viewid){
                fen.string = 0;
                mark = new cc.Node(name);
                var sprite = mark.addComponent(cc.Sprite);
                sprite.spriteFrame = this.btnAltas.getSpriteFrame(spriteframe);
                node.addChild(mark);
                var endpos = cc.v2(0,50);
                if(cc.vv.roomMgr.stage || cc.vv.roomMgr.is_replay){
                    mark.x = 0;
                    mark.y = 50;
                }else{
                    mark.x = 0-node.x;
                    mark.y = 0-node.y;
                    var time = 1.5;
                    var move = cc.moveTo(time,endpos).easing(cc.easeElasticInOut(time));
                    var effect =  cc.callFunc(function(){
                        cc.vv.audioMgr.playSFX('ddz/effect/effect_dizhuRole');
                    });
                    mark.runAction(cc.spawn(move,effect));
                }
                // var total = parseInt(this.totalZhuafen.string) - parseInt(fen.string);
                // this.totalZhuafen.string = total;
            }
        }
    },

    tip:function(text){
        if(text == null){
            this.sprTip.node.active = false;
            return;
        }
        this.sprTip.spriteFrame = this.tipAltas.getSpriteFrame("tip_" + text);
        this.sprTip.node.active = true;
    },

    tip2:function(viewid,text){
        var node = this.tips.children[viewid];
        if(text == null){
            node.active = false;
            return;
        }
        node.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame("tip_" + text);
        node.active = true;
    },

    //可以叫主的人
    robMain:function(data){
        if(!data.jiaozhu){
            this.tip("waitjiaozhu");
        }else{
            this.tip("waitfanzhu");
        }
        this.nodeXiazhu.active = false;
        this.disableButtons();
        this.is_jiaozhu = data.jiaozhu;
        for(var i = 0; i < data.robPeople.length; i++){
            if(cc.vv.roomMgr.seatid == data.robPeople[i].seatId){
                this.robSelect();
                this.tip(null);
            }
        }
    },

    getRobPoker:function(mainColor){
        var main7 = 99;
        switch(mainColor){
            //方片
            case 0:{
                main7 = 7;
            }
            break;
            //红桃
            case 1:{
                main7 = 23;
            }
            break;
            //梅花
            case 2:{
                main7 = 39
            }
            break;
            //黑桃
            case 3:{
                main7 = 55;
            }
            break;
        }
        this.robPoke = main7;
    },

    getMain:function(data){
        this.btn_fanzhu.active = false;
        this.nodeXiazhu.active = false;
        this.unschedule(this.otherTimeUpdate);
        this.waitclock.active = false;
        this.unschedule(this.selfTimeUpdate2);
        
        this.gamestate = "getMain";
        var self = this;
        this.robPoke = data.pais[0];
        if(data.pais[0] == 7){
            this.mainColor = 0;
        }else if(data.pais[0] == 23){
            this.mainColor = 1;
        }else if(data.pais[0] == 39){
            this.mainColor = 2;
        }else if(data.pais[0] == 55){
            this.mainColor = 3;
        }
        this.tip(null);
        this.hideTips();
        var viewid = cc.vv.roomMgr.viewChairID(data.seatId);
        this.mainSize = data.pais.length;
        if(data.pais.length == 1){
            this.showGongTou(data.seatId);
            this.is_jiaozhu = true;
            this.tip2(viewid,"jiaozhu");
            this.playSFX(data.seatId,"jiaozhu");
            if(!cc.vv.roomMgr.is_replay){
                var canfan = false;
                for(var k = 7; k <= 55; k++){
                    var zhu = this.isMain(k);
                    if(zhu.length == 2 && zhu[0] != this.robPoke){
                        this.nodeXiazhu.active = false;
                        this.btn_fanzhu.active = true;
                        canfan = true;
                    }
                }
                if(!canfan){
                    this.btn_fanzhu.active = false;
                    this.tip('waitfanzhu');
                }
            }
        }else if(data.pais.length == 2){
            this.is_fanzhu = true;
            this.btn_fanzhu.active = false;
            if(this.is_jiaozhu){
                this.tip2(viewid,"fanzhu");
                this.playSFX(data.seatId,"fanzhu");
            }else{
                this.is_jiaozhu = true;
                this.tip2(viewid,"jiaozhu");
                this.playSFX(data.seatId,"jiaozhu");
            }
            this._kuangzhu = 1;
        }
        
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            var node = this.zhuafenNode.children[i];
            if(i == viewid){
                node.active = false;
            }else{
                node.active = true;
            }
        }

        var list = this.getlist();
        // cc.vv.net2.quick('paixu',{list,list});
        this.sortCardNode(list);

        var card = new cc.Node();
        var sprite = card.addComponent(cc.Sprite);
        sprite.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,data.pais[0]);
        this.node.getChildByName("mgr").addChild(card);
        card.y = 100;
        card.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.spawn(
                cc.moveTo(0.5,cc.v2(-494,292)),
                cc.scaleTo(0.5,0.4),
            ),
            cc.callFunc(function(){
                self.showMainPoker(self.mainColor,self.nodeCard);
                //self.mainPoker.spriteFrame = cc.vv.utils.getPokerSpriteFrame(self.poker1Atlas,data.pais[0]);
                self.robNum.spriteFrame = self.tipAltas.getSpriteFrame("x" + data.pais.length);
            }),
            cc.hide(),
            cc.removeSelf()
        ));
    },

    showMainPoker:function(mainColor,root){
        if(mainColor == 99){
            return;
        }
        var min = 0;
        var max = 0;
        var main7 = 0;
        var main2 = 0;
        switch(mainColor){
            //方片
            case 0:{
                min = 2;
                max = 14;
                main7 = 7;
                main2 = 2;
            }
            break;
            //红桃
            case 1:{
                min = 18;
                max = 30;
                main7 = 23;
                main2 = 18;
            }
            break;
            //梅花
            case 2:{
                min = 34;
                max = 46;
                main7 = 39;
                main2 = 34;
            }
            break;
            //黑桃
            case 3:{
                min = 50;
                max = 62;
                main7 = 55;
                main2 = 50;
            }
            break;
        }
        if(main7 != 0){
            this.mainPoker.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,main7);
        }
        
        for(var i = 0; i < root.childrenCount; i++){
            var node = root.children[i];
            var type = node.getChildByName('type');
            var sprite = type.getComponent(cc.Sprite);
            if((node.value >= min && node.value <= max) || node.value%16==2 || node.value%16==7){
                if(node.value == main2 || node.value == main7){
                    sprite.spriteFrame = this.tipAltas.getSpriteFrame("typ_zhu");
                }
                else if(node.value%16==2 || node.value%16==7){
                    sprite.spriteFrame = this.tipAltas.getSpriteFrame("typ_fu");
                }else{
                    sprite.spriteFrame = this.tipAltas.getSpriteFrame("typ_nomal");
                }
                type.active = true;
            }else{
                type.active = false;
            }
        }
    },

    robSelect:function(){
        if(this.is_jiaozhu){
            this.btn_fanzhu.active = true;
            return;
        }
        this.selectZhu();
        
    },

    selectZhu2:function(){
        this.disableButtons();
        for(var i = 7; i <= 55; i+=16){
            var list = this.isMain(i);
            var node = this.nodeXiazhu.getChildByName('mainbtns').getChildByName('main' + i);
            var num = node.getChildByName('num').getComponent(cc.Sprite);
            if(list.length > 0){
                if(this.is_jiaozhu){
                    if(!this.is_fanzhu && list.length == 2 && list[0] != this.robPoke){
                        this.btn_fanzhu.active = true;
                    }
                }else{
                    this.nodeXiazhu.active = true;
                    node.getComponent(cc.Button).interactable = true;
                    num.node.active = true;
                    num.spriteFrame = this.btnAltas.getSpriteFrame(list.length + 'zhang');
                }
                
            }
        }
    },

    selectZhu:function(){
        this.disableButtons();
        for(var i = 7; i <= 55; i+=16){
            var list = this.isMain(i);
            var node = this.nodeXiazhu.getChildByName('mainbtns').getChildByName('main' + i);
            var num = node.getChildByName('num').getComponent(cc.Sprite);
            if(list.length > 0){
                if(this.is_jiaozhu){
                    if(!this.is_fanzhu && list.length == 2 && list[0] != this.robPoke){
                        this.nodeXiazhu.active = true;
                        node.getComponent(cc.Button).interactable = true;
                        num.node.active = true;
                        num.spriteFrame = this.btnAltas.getSpriteFrame(list.length + 'zhang');
                    }
                }else{
                    this.nodeXiazhu.active = true;
                    node.getComponent(cc.Button).interactable = true;
                    num.node.active = true;
                    num.spriteFrame = this.btnAltas.getSpriteFrame(list.length + 'zhang');
                }
                
            }
        }
    },

    getZhungPoker:function(data){
        this.gamestate = 'getZhungPoker';
        var self = this;
        var index = cc.vv.roomMgr.viewChairID(data.seatId);
        this.tip2(index,null);
        this.clearPoker(index);
        this.btn_fanzhu.active = false;
        this.unschedule(this.newPoker);
        if(cc.vv.roomMgr.seatid != data.seatId){
            if(this.hand != null){
                this.sortCardNode(this.hand);
            }
            this.nodeXiazhu.active = false;
            this.tip("waitkoupai");
            this.waitclock.active = true;
            this.waitclock.getComponentInChildren(cc.Label).string = 15;
            this.schedule(this.otherTimeUpdate,1);
            this.waitclock.x = this.timepos.children[index].x;
            this.waitclock.y = this.timepos.children[index].y;
            return;
        }
        this.zhuangPoker = data.pai;
        this.gaipaiTip.active = true;
        this.gaipaiTip.getComponentInChildren(cc.Label).string = 0;
        this.tip(null);
        this.nodeXiazhu.active = false;
        if(cc.vv.roomMgr.is_replay){
            this.opts.active = false;
        }else{
            this.opts.active = true;
            this.btn_chupai.active = false;
            this.btn_tishi.active = false;
            this.btn_touxiang.active = false;
            this.btn_gaipai.active = true;
            this.timepoint.string = 15;
            this.schedule(this.selfTimeUpdate2,1);
            this.btn_gaipai.getComponent(cc.Button).interactable = false;
            this.btn_gaipai.getComponentInChildren(cc.Button).interactable = false;
            this.schedule(this.gaipaiState,1/60);
        }
        
        if(this.hand != null){
            //this.unschedule(this.newPoker);
            var array = [];
            for(var i = 0; i < data.pai.length; i++){
                array.push(data.pai[i]);
            }
            for(var j = 0; j < this.hand.length; j++){
                array.push(this.hand[j]);
            }
            this.sortCardNode(array);
            this.nodeCard.getComponent(cc.Layout).enabled = true;
            this.nodeCard.scale = 0.75;
        }
        
    },

    gaipaiState:function(){
        var list = this.getSelectPaiList(1);
        this.gaipaiTip.active = true;
        this.btn_gaipai.getComponent(cc.Button).interactable = list.length == 8; 
        this.btn_gaipai.getComponentInChildren(cc.Button).interactable = list.length == 8;
        this.gaipaiTip.getComponentInChildren(cc.Label).string = list.length;
    },

    getlist:function(){
        var list = [];
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            list.push(this.nodeCard.children[i].value);
        }
        return list;
    },

    gaipai:function(data){
        this.gamestate = 'gaipai';
        this.tip(null);
        this.gaipaiArr = data.hand;
        this.tmpGaiPaiArr = this.gaipaiArr;
        if(cc.vv.roomMgr.seatid == data.seatId){
            this.initPoker();
            this.unschedule(this.gaipaiState);
            this.removePoker(this.nodeCard,data.hand);
            this.hand = this.getlist();
            this.nodeCard.getComponent(cc.Layout).enabled = false;
            this.nodeCard.scale = 1;
            this.nodeCard.width = 2000;
            this.opts.active = false;
            this.unschedule(this.selfTimeUpdate2);
            this.btn_gaipai.active = false;
            this.gaipaiTip.active = false;
            this.nodeXiazhu.active = false;
            this.refreshHandCards();
            this.setAllCardUnSelected();
        }else{
            this.waitclock.active = false;
            this.unschedule(this.otherTimeUpdate);
            var list = this.getlist();
            this.sortCardNode(list);
        }

        if(!cc.vv.roomMgr.is_replay){
            if(!this.is_fanzhu){
                var canfan = false;
                for(var i = 7; i <= 55; i++){
                    var zhu = this.isMain(i);
                    if(zhu.length == 2 && zhu[0] != this.robPoke){
                        this.nodeXiazhu.active = false;
                        this.btn_fanzhu.active = true;
                        canfan = true;
                    }
                }
                if(!canfan){
                    this.btn_fanzhu.active = false;
                    this.tip('waitfanzhu');
                }
            }
        }
    },

    showChupaiTip:function(canPai){
        var color = new cc.Color(150,150,150);
        var list = this.getlist();
        for(var i = 0; i < canPai.length; i++){
            for(var j = 0; j < list.length; j++){
                if(canPai[i] == list[j]){
                    list.splice(j,1);
                    break;
                }
            }
        }

        for(var k = 0; k < list.length; k++){
            for(var h = 0; h < this.nodeCard.childrenCount; h++){
                var node = this.nodeCard.children[h];
                var card = node.getChildByName('card');
                var button = node.getChildByName('button');
                button.width = cc.vv.roomMgr.ren == 4?50:60;
                var com = node.getComponent('DQPoker');
                if(node.value == list[k]){
                    card.color = color;
                    button.active = true;
                    if(h == this.nodeCard.childrenCount-1){
                        //button.x = 0;
                        button.width = 162;
                    }
                    if(com.isSelect() == 1){
                        //this.selectCard(com,0);
                        this.setAllCardUnSelected();
                    }
                }
            }
        }
    },

    getTip:function(data){
        if(data == null) return;
        var canPai = data.canPai;
        var canPai2 = data.canPai2;
        this.canPai = data.canPai;
        this.canPai2 = data.canPai2;
        var fold = this.othterfolds.children[cc.vv.roomMgr.ren-1];
        if(fold.childrenCount == 0){
            return;
        }
        if(canPai.length > 0){
            if(fold.childrenCount < 4){
                this.showChupaiTip(canPai);
            }else{
                // for(var i = 0; i < canPai.length; i++){
                //     for(var j = 0; j < this.nodeCard.childrenCount; j++){
                //         var node = this.nodeCard.children[j];
                //         var card = node.getComponent('DQPoker');
                //         if(node.value == canPai[i]){
                //             node.getChildByName('button').active = true;
                //             this.selectCard(card,1);
                //         }
                //     }
                // }

                if(canPai2.length > 0){
                    if(canPai2.length >= fold.childrenCount){
                        this.showChupaiTip(canPai2);
                    }
                }
            }
        }else if(canPai2.length > 0){
            this.showChupaiTip(canPai2);
            if(canPai2.length < fold.childrenCount){
                this.schedule(this.otherCanPai,1/60);
            }
        }
    },

    otherCanPai2:function(){
        var list1 = [];
        var list2 = [];
        for(var p = 0; p < this.canPai.length; p++){
            for(var q = 0; q < this.canPai2.length; q++){
                if(this.canPai[p] == this.canPai2[q]){
                    this.canPai2.splice(q,1);
                    break;
                }
            }
        }

        for(var i = 0; i < this.canPai.length; i++){
            for(var j = 0; j < this.nodeCard.childrenCount; j++){
                var node = this.nodeCard.children[j];
                if(node.value == this.canPai[i]){
                    list1.push(node);
                }
            }
        }

        for(var e = 0; e < this.canPai2.length; e++){
            for(var f = 0; f < this.nodeCard.childrenCount; f++){
                var node = this.nodeCard.children[f];
                if(node.value == this.canPai2[e]){
                    list2.push(node);
                }
            }
        }
       
        var flag = true;
        for(var k = 0; k < list1.length; k++){
            if(list1[k].y == 0){
                flag = false;
                break;;
            }
        }
        if(flag){
            for(var m = 0; m < this.canPai2.length; m++){
                for(var n = 0; n < list2.length; n++){
                    var node = list2[n];
                    var card = node.getChildByName('card');
                    var button = node.getChildByName('button');
                    if(node.value == this.canPai2[m]){
                        card.color = new cc.Color(255,255,255);
                        button.active = false;
                    }
                }
            }
        }
    },

    otherCanPai:function(){
        var list1 = [];
        var list = this.getlist();
        for(var p = 0; p < this.canPai2.length; p++){
            for(var q = 0; q < list.length; q++){
                if(this.canPai2[p] == list[q]){
                    list.splice(q,1);
                    break;
                }
            }
        }
        for(var i = 0; i < this.canPai2.length; i++){
            for(var j = 0; j < this.nodeCard.childrenCount; j++){
                var node = this.nodeCard.children[j];
                if(node.value == this.canPai2[i]){
                    list1.push(node);
                }
            }
        }
        var flag = true;
        for(var k = 0; k < list1.length; k++){
            if(list1[k].y == 0){
                flag = false;
                break;;
            }
        }
        if(flag){
            for(var m = 0; m < list.length; m++){
                for(var n = 0; n < this.nodeCard.childrenCount; n++){
                    var node = this.nodeCard.children[n];
                    var card = node.getChildByName('card');
                    var button = node.getChildByName('button');
                    if(node.value == list[m]){
                        card.color = new cc.Color(255,255,255);
                        button.active = false;
                    }
                }
            }
        }
    },

    //删除手牌中出过的牌
    removePoker:function(root,list){
        for(var j = 0; j < list.length; ++j){
            for(var i = 0; i < root.childrenCount; ++i){
                var node = root.children[i];
                if(list[j] == node.value){
                    node.removeFromParent();
                    break;
                }
            }
        }
    },

    initPoker:function(){
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            var node = this.nodeCard.children[i];
            node.getChildByName("card").color = new cc.Color(255, 255, 255);
            node.getChildByName("button").active = false;
        }
    },

    chupai:function(data){
        this.canTouxiang = false;
        var index = cc.vv.roomMgr.viewChairID(data.seatid);
        if(index == 0){
            this.tishipai = null;
            this.unschedule(this.otherCanPai);
            //手牌还原
            this.setAllCardUnSelected();
            //操作按钮隐藏
            this.opts.active = false;
            //关闭倒计时
            this.unschedule(this.selfTimeUpdate2);
            this.removePoker(this.nodeCard,data.list);
            this.refreshHandCards();
            this.initPoker();
        }else{
            this.waitclock.active = false;
            this.unschedule(this.otherTimeUpdate);
        }
        this.showChupai(index,data.list);
        this.showChupaiType(data);
        this.showTableFen(data.list);
        this._turn++;
    },

    showTableFen:function(list){
        this.tablefen.active = true;
        var currenfen = parseInt(this.tablefen.getChildByName('fen').getComponent(cc.Label).string);
        var fen = 0;
        for(var i = 0; i < list.length; i++){
            if(list[i]%16 == 5){
                fen += 5;
            }else if(list[i]%16 == 10){
                fen += 10;
            }else if(list[i]%16 == 13){
                fen += 10;
            }
        }
        this.tablefen.getChildByName('fen').getComponent(cc.Label).string = currenfen+fen;
    },

    showChupai:function(index,pai){
        this.clearPoker(index);
        var root = this.othterfolds.children[index];
        for(var i = 0; i < pai.length; ++i){
            var node = cc.instantiate(this.pokerPrefab);
            node.scale = 0.6;
            if(pai[i] != 0){
                var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,pai[i]);
                node.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
                root.addChild(node);
                node.value = pai[i];
            }
        }
        this.showMainPoker(this.mainColor,root);
    },

    showChupaiMax:function(data){
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var curFold = this.othterfolds.children[viewid]; 
        if(this._turn == 1 || data.sha == 1 || data.daZhu == 1){
            for(var k = 0; k < curFold.childrenCount; k++){
                var node = curFold.children[k];
                var max = node.getChildByName('max');
                max.active = true;
            }
            for(var i = 0; i < this.othterfolds.childrenCount; i++){
                var fold = this.othterfolds.children[i]; 
                if(i == viewid) continue;
                for(var j = 0; j < fold.childrenCount; j++){
                    var node = fold.children[j];
                    var max = node.getChildByName('max');
                    max.active = false;
                }
            }
        }
    },

    showChupaiType:function(data){
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
       
        this.showChupaiMax(data);

        //拖拉机
        if(data.type == 4){
            this.playSFX(data.seatid,"tuolaji");
            this.tip2(viewid,"tuolaji");
        }
        //杀
        else if(data.sha == 1){
            var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
            this.animationNode.x = pos[viewid].pos.tip.x;
            this.animationNode.y = pos[viewid].pos.tip.y;
            this.playSFX(data.seatid,"sha");
            cc.vv.audioMgr.playSFX('dq/effect/game_sha');
            this.animationNode.active = true;
            this.anim.play('kill');
        }
        //打住
        else if(data.daZhu == 1 ){
            this.playSFX(data.seatid,"dazhu");
            this.tip2(viewid,"dazhu");
        }
        //调主
        else if(data.diaozhu == 1 ){
            this.playSFX(data.seatid,"diaozhu");
            this.tip2(viewid,"diaozhu");
        }
        //垫牌
        else if(this._turn != 1){
            this.playSFX(data.seatid,"dianpai");
            this.tip2(viewid,"dianpai");
        }
        //首出单张
        else if(data.type == 2){
            this.playSFX(data.seatid,"yizhang");
        }
        //首出对子
        else if(data.type == 3){
            this.playSFX(data.seatid,"duizi");
        }
    },

    //叫主时间倒计时
    selfTimeUpdate:function(){
        var timepoint = this.nodeXiazhu.getChildByName('timepoint').getComponentInChildren(cc.Label);
        var number = parseInt(timepoint.string);
        number -= 1;
        timepoint.string = number;
        if(number <= 0){
            cc.vv.audioMgr.playSFX('timeup_alarm');
            this.unschedule(this.selfTimeUpdate);
        }
    },

    selfTimeUpdate2:function(){
        var number = parseInt(this.timepoint.string);
        number -= 1;
        this.timepoint.string = number;
        if(number <= 0){
            cc.vv.audioMgr.playSFX('timeup_alarm');
            this.unschedule(this.selfTimeUpdate2);
        }
    },

    //其他玩家倒计时
    otherTimeUpdate:function(){
        var time = this.waitclock.getComponentInChildren(cc.Label);
        var number = parseInt(time.string);
        number -= 1;
        time.string = number;
        if(number <= 0){
            cc.vv.audioMgr.playSFX('timeup_alarm');
            this.unschedule(this.otherTimeUpdate);
        }
    },

    pushLun:function(data){
        this.unschedule(this.selfTimeUpdate2);
        this.unschedule(this.otherTimeUpdate);
        this.waitclock.active = false;
        this.opts.active = false;
        this._turn = 1;
       
        var viewid = cc.vv.roomMgr.viewChairID(data.maxPeople);
        var fen = this.zhuafenNode.children[viewid].getChildByName('fen');
        // var old = parseInt(fen.getComponent(cc.Label).string);
        var tablefen = parseInt(this.tablefen.getChildByName('fen').getComponent(cc.Label).string);
        // fen.getComponent(cc.Label).string = old + tablefen;
        if(tablefen > 0 && data.maxPeople != this._gongtou){
            this.table.seat_emit(viewid,'win',tablefen);
        }
        // this.showTotalZhuafen();
        fen.getComponent(cc.Label).string = data.zhuafen;
        if(data.AllFen != null){
            if(data.maxPeople != this._gongtou){
                // if(this._gongyou == 99){
                //     this.totalZhuafen.string = data.AllFen;
                // }else{
                //     var gongyouid = cc.vv.roomMgr.viewChairID(this._gongyou);
                //     var gongyoufen = this.zhuafenNode.children[gongyouid].getChildByName('fen');
                //     var fen = parseInt(gongyoufen.getComponent(cc.Label).string);
                //     this.totalZhuafen.string = data.AllFen - fen;
                // }
                this.totalZhuafen.string = data.AllFen;
            }
        }
    },

    showTotalZhuafen:function(){
        var sum = 0;
        for(var i = 0; i < cc.vv.roomMgr.ren; i++){
            var node = this.zhuafenNode.children[i];
            if(i != cc.vv.roomMgr.viewChairID(this._gongtou)){
                if(this._gongyou == 99){
                    var item = parseInt(node.getChildByName('fen').getComponent(cc.Label).string);
                    sum += item;
                }else{
                    if(i != cc.vv.roomMgr.viewChairID(this._gongyou)){
                        var item = parseInt(node.getChildByName('fen').getComponent(cc.Label).string);
                        sum += item;
                    }
                }
            }
        }
        this.totalZhuafen.string = sum;
    },

    getDiPokerFen:function(){
        var fen = 0;
        for(var i = 0; i < this.gaipaiArr.length; i++){
            if(this.gaipaiArr[i]%16 == 5){
                fen += 5;
            }else if(this.gaipaiArr[i]%16 == 10){
                fen += 10;
            }else if(this.gaipaiArr[i]%16 == 13){
                fen += 10;
            }
        }
        return fen;
    },

    operate:function(data){
        this.tip(null);
        
        if(this._turn == 1){
            this.hideTips();
            this.clearAllPoker();
            this.tablefen.getChildByName('fen').getComponent(cc.Label).string = 0;
        }

        this.btn_fanzhu.active = false;
        var index = cc.vv.roomMgr.viewChairID(data.seatId);
        this.clearPoker(index);
        this.nodeXiazhu.active = false;
        if(cc.vv.roomMgr.seatid == data.seatId){
            //this.setAllCardUnSelected();
            this.getTip(this.tishipai);
            this.opts.active = true;
            this.btn_chupai.active = true;
            //this.btn_tishi.active = true;
            this.btn_gaipai.active = false;
            this.waitclock.active = false;
            this.timepoint.string = 15;
            this.schedule(this.selfTimeUpdate2,1);
            this.btn_lookgaipai.active = data.seatId == this._gongtou;
            this.btn_touxiang.active = this.canTouxiang;
        }else{
            this.nodeXiazhu.active = false;
            this.waitclock.active = true;
            this.waitclock.getComponentInChildren(cc.Label).string = 15;
            this.schedule(this.otherTimeUpdate,1);
            this.waitclock.x = this.timepos.children[index].x;
            this.waitclock.y = this.timepos.children[index].y;
        }
    },

    showClock:function(seatid){
        if(this._turn == 1){
            this.hideTips();
            this.clearAllPoker();
            this.tablefen.getChildByName('fen').getComponent(cc.Label).string = 0;
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        this.waitclock.active = true;
        this.waitclock.getComponentInChildren(cc.Label).string = 15;
        this.waitclock.scale = 0.7;
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        if(viewid >= 1){
            this.waitclock.x = pos[viewid].pos.tip.x + 10;
            this.waitclock.y = pos[viewid].pos.tip.y + 50;
        }
        else{
            this.waitclock.x = -330;
            this.waitclock.y = -56;
        }
    },

     //刷新手牌位置
    refreshHandCards:function(){
        var length = this.nodeCard.childrenCount;
        if(length == 0){
            return;
        }
        var offset = length > 20 ? 55 : 60;
        var pos = length > 20 ? -27.5 : -30;
        if(length == 20){
            offset = 58;
            pos = -29;
        }else if(length == 28){
            offset = 58;
            pos = -29;
        }
        else if(length == 25 || length == 24 || length == 23){
            offset = 48;
            pos = 0;
        }else if(length == 33){
            offset = 48;
            pos = 0;
        }
        //左右扩展位置
        var mid = parseInt((length - 1) / 2);

        this.nodeCard.children[mid].x = pos;
        for(var i = mid + 1 ; i < length;i++){
            this.nodeCard.children[i].x = pos + (i - mid) * offset;
        }

        for(var i = mid - 1 ; i >= 0; i--){
            this.nodeCard.children[i].x = pos + (i - mid) * offset;
        }
        // var node = this.nodeCard.children[length - 1];
        // var card = node.getComponent('DDZPoker');
        // card.setType(cc.vv.roomMgr.seatid == this._dizhu?1:0);
    },

    jiesuan:function(data){
        this.unschedule(this.selfTimeUpdate);
        this.unschedule(this.otherTimeUpdate);
        this.nodeJiesuan.active = true;
        var results = data.list;

        //输赢情况
        var myscore = results[cc.vv.roomMgr.seatid].round_score;
        var bg = this.nodeJiesuan.getChildByName('bg').getComponent(cc.Sprite);
        var title = this.nodeJiesuan.getChildByName('title').getComponent(cc.Sprite);
        var res = null;
        var spriteframe_titile = null;
        if(myscore > 0){
            res = "bg_win";
            spriteframe_titile = "txt_win";
        }     
        else if(myscore < 0){
            res = 'bg_lose';
            spriteframe_titile = "txt_lose";
        }
        bg.spriteFrame = this.jiesuanAltas.getSpriteFrame(res);
        title.spriteFrame = this.jiesuanAltas.getSpriteFrame(spriteframe_titile);

        var now = this.nodeJiesuan.getChildByName('now').getComponent(cc.Label);
        now.string = "第" + cc.vv.roomMgr.now + "局";
        var roomid = this.nodeJiesuan.getChildByName("roomid").getComponent(cc.Label);
        roomid.string = cc.vv.roomMgr.roomid;
        var wanfa = this.nodeJiesuan.getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.roomMgr.enter.desc;
        this.nodeJiesuan.getChildByName("time").getComponent(cc.Label).string = data.time;

        var sum = 0;
        for(var k = 0; k < data.zhuaFenArr.length; k++){
            if(k != this._gongtou && k != this._gongyou){
                sum += data.zhuaFenArr[k];
            }
        }
        this.nodeJiesuan.getChildByName("zhuafen").getComponent(cc.Label).string = sum;
        this.nodeJiesuan.getChildByName("koudifen").getComponent(cc.Label).string = data.kdFen;
        this.nodeJiesuan.getChildByName("totalscore").getComponent(cc.Label).string = data.zhuafen;
        this.nodeJiesuan.getChildByName("koudifan").getComponent(cc.Label).string = this._power;
        this.nodeJiesuan.getChildByName("koudijishu").getComponent(cc.Label).string = data.level;
        this.nodeJiesuan.getChildByName("suanfen").getComponent(cc.Label).string = data.suanfen;
        var dipai = this.nodeJiesuan.getChildByName("dipai");
        for(var i = 0; i < dipai.childrenCount; i++){
            var node = dipai.children[i];
            node.active = false;
        }
        for(var i = 0; i < this.gaipaiArr.length; i++){
            var node = dipai.children[i];
            node.getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,this.gaipaiArr[i]);
            node.active = true;
        }
        var results = this.nodeJiesuan.getChildByName('results');
        for(var i = 0; i < data.list.length; i++){
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            var item = results.children[viewid].getComponent(cc.Label);
            var score = cc.vv.utils.numInt(data.list[i].round_score);
            if(score >= 0){
                item.string = "+" + data.list[i].round_score;
                item.font = this.bignumwin;
            }else{
                item.string = data.list[i].round_score;
                item.font = this.bignumlos;
            }

            this.table.seat_emit(viewid,"score",data.list[i].user_score);
        }
         //每个玩家信息
        //  var listRoot = this.nodeJiesuan.getChildByName('viewlist').getComponent(cc.ScrollView).content;
        //  for(var i = 0; i < listRoot.childrenCount; i++){
        //     listRoot.children[i].active = false;
        //  }
        //  for(var i = 0; i < data.list.length; i++){
        //     var viewid = cc.vv.roomMgr.viewChairID(i);
        //     var sn = listRoot.getChildByName("s" + viewid);
        //     sn.x = listRoot.children[i].x;
        //     sn.y = listRoot.children[i].y;
        //     sn.active = true;
        //     var username = sn.getChildByName('username').getComponent(cc.Label);
        //     var userid = sn.getChildByName('userid').getComponent(cc.Label);
        //     var score = sn.getChildByName('score').getComponent(cc.Label);
        //     var difen = sn.getChildByName('difen').getComponent(cc.Label);
        //     username.string = results[i].nickname;
        //     userid.string = "ID: " + results[i].userid;
        //     score.string = results[i].round_score;
        //     difen.string = cc.vv.roomMgr.param.difen;
        //     var headimg = this.table.seat_img(viewid);
        //     sn.getChildByName('head').getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
        //     this.table.seat_emit(viewid,"score",results[i].user_score);
        //  }
    },

    report:function(data){
        this.nodeReport.active = true;
        this.nodeJiesuan.active = false;
        if(this.table._winDissroom!=null){
            this.table._winDissroom.active = true;
        }
        if(cc.vv.popMgr.get_open("Pwb_tips")){
            cc.vv.popMgr.del_open("Pwb_tips");//结算删除胜点不足控件 
        }
         //隐藏解散房间
         this.table.hide_dismiss_room();

         this.nodeReport.getChildByName('time').getComponent(cc.Label).string = data.time;
         this.nodeReport.getChildByName('roomid').getComponent(cc.Label).string = data.roomid;
         this.nodeReport.getChildByName('wanfa').getComponent(cc.Label).string = "玩法：" + cc.vv.roomMgr.enter.desc;
         
         var results = data.list;
         //var list = this.nodeReport.getChildByName("viewlist").getComponent(cc.ScrollView).content;
         var list = this.nodeReport.getChildByName("list");
         list.removeAllChildren();
         for(var i = 0; i < data.list.length; ++i){
            var info = {
                name:data.list[i].name,
                userid:data.list[i].userid,
                headimg:data.list[i].headimg,
                score:data.list[i].result_score,
                dayingjia:data.list[i].result_score == data.list[0].result_score && data.list[0].result_score != 0,
                datuhao:false,
            }
            var item = cc.instantiate(this.reportItemPrefab);
            list.addChild(item);
            item.emit("info",info);
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid == 0){
                this.nodeReport.getChildByName('socre').getComponentInChildren(cc.Label).string = '+' + data.list[i].coins;
            }
        }
    },

    stage:function(data){
        this.node.getChildByName("pop").removeAllChildren();
        if(data.ready == null){ 
            return;
        }
        cc.vv.roomMgr.stage = data;
        if(data){
            cc.vv.roomMgr.started = 1;
            cc.vv.roomMgr.real = data.real;
            cc.vv.roomMgr.now = data.round;
            if(data.round == null){
                cc.vv.roomMgr.now = data.now;
            }
        }
        this.table._winReady.emit("begin");
        // //让座位到开局状态
        this.table._winHub.emit("begin");
       
        if(data.mainColor != undefined){
            this.getRobPoker(data.mainColor);
            this.is_fanzhu = data.mainSize == 2;
        }
        switch(data.stage){
            case 1:
            case 2:{
                this.mainColor = data.mainColor;
                this.is_jiaozhu = data.jiaozhu;
                this._kuangzhu = data.ShowKuangZhu;
                this.robNum.spriteFrame = this.tipAltas.getSpriteFrame("x" + data.mainSize);
                this.mainSize = data.mainSize;
                this.fapai2(data.cards);
                if(data.jiaozhu){
                    this.showGongTou(data.zhuang);
                }
                this.showMainPoker(data.mainColor,this.nodeCard);
            }
            break;
            case 3:{
                this.mainColor = data.mainColor;
                this.is_jiaozhu = data.jiaozhu;
                this._kuangzhu = data.ShowKuangZhu;
                this.robNum.spriteFrame = this.tipAltas.getSpriteFrame("x" + data.mainSize);
                this.mainSize = data.mainSize;
                this.showGongTou(data.zhuang);
                this.fapai2(data.cards);
                this.showMainPoker(data.mainColor,this.nodeCard);
               
                if(cc.vv.roomMgr.seatid == data.zhuang){
                    this.opts.active = true;
                    this.btn_chupai.active = false;
                    this.btn_tishi.active = false;
                    this.btn_gaipai.active = true;
                    this.timepoint.string = 15;
                    this.schedule(this.selfTimeUpdate2,1);
                }
               
            }
            break;
            case 5:
            case 4:{
                this.mainColor = data.mainColor;
                this.is_jiaozhu = data.jiaozhu;
                this.gaipaiArr = data.eightPai;
                this._kuangzhu = data.ShowKuangZhu;
                this.robNum.spriteFrame = this.tipAltas.getSpriteFrame("x" + data.mainSize);
                this.mainSize = data.mainSize;
                this.tablefen.active = true;
                this.tablefen.getChildByName('fen').getComponent(cc.Label).string = 0;
                //出牌
               for(var i = 0; i < data.lastPai.length; ++i){
                    if(data.lastPai[i] == null){
                        continue;
                    }
                    var index = cc.vv.roomMgr.viewChairID(data.lastPai[i].seatID);
                    this.showChupai(index,data.lastPai[i].pai);
                    this.showTableFen(data.lastPai[i].pai);
                    this._turn++;
                }
                this.fapai2(data.cards);
                this.showGongYou(data.zhuangFriend);
                this.showGongTou(data.zhuang);
            
                //每个人抓分数
                for(var i = 0; i < data.zhuafen.length; i++){
                    var viewid = cc.vv.roomMgr.viewChairID(i);
                    var node = this.zhuafenNode.children[viewid];
                    node.active = i != data.zhuang;
                    node.getChildByName('fen').getComponent(cc.Label).string = data.zhuafen[i];
                }
                //this.showTotalZhuafen();
                // if(this._gongyou == 99){
                //     this.totalZhuafen.string = data.AllFen;
                // }else{
                //     var id = cc.vv.roomMgr.viewChairID(this._gongyou);
                //     var fen = parseInt(this.zhuafenNode.children[id].getChildByName('fen').getComponent(cc.Label).string);
                //     this.totalZhuafen.string = data.AllFen - fen;
                // }
                this.totalZhuafen.string = data.AllFen;
               
                var viewid = cc.vv.roomMgr.viewChairID(data.chuPaiPeople);
                if(viewid != 0){
                    this.waitclock.active = true;
                    this.waitclock.getComponentInChildren(cc.Label).string = 15;
                    this.schedule(this.otherTimeUpdate,1);
                    this.waitclock.x = this.timepos.children[viewid].x;
                    this.waitclock.y = this.timepos.children[viewid].y;
                    this.clearPoker(viewid);
                }
            }
            this.btn_lookgaipai.active = cc.vv.roomMgr.seatid == data.zhuang;
            this.showMainPoker(data.mainColor,this.nodeCard);
            break;
            case 97:{

            }
            break;
        }
    },

    isMain:function(value){
        var list = [];
        if(value == 0) return;
        for(var i = 0; i < this.mainArr.length; i++){
            if(value == this.mainArr[i]){
                 list.push(value);
            }
        }
        return list;
    },

    //播放音效
    playSFX(setaid,type){
        var sex = cc.vv.roomMgr.userSex(setaid);
        if(sex !='1' && sex!='2'){
            sex = '1';
        }
        var mp3File = "dq/" + sex + "/" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },

    selectMain:function(value){
        var list = this.isMain(value);
        if(list.length == 1){
            var touwu = 0;
            if(cc.vv.roomMgr.stage == null && this._idx <= 5 && cc.vv.roomMgr.param.touwu == 1){
                touwu = 1;
            }
            this.nodeXiazhu.getChildByName('btn_main1').active = false;
            this.nodeXiazhu.getChildByName('btn_main2').active = false;
            //this.playSFX(cc.vv.roomMgr.seatid,"jiaozhu");
            cc.vv.net2.quick("getMain",{list:list,touwu:touwu});
        }else if(list.length == 2){
            if(!this.is_jiaozhu){
                this.nodeXiazhu.getChildByName('btn_main1').active = true;
                this.nodeXiazhu.getChildByName('btn_main2').active = true;
            }else{
                this.nodeXiazhu.getChildByName('btn_main1').active = false;
                this.nodeXiazhu.getChildByName('btn_main2').active = false;
                //this.playSFX(cc.vv.roomMgr.seatid,"fanzhu");
                cc.vv.net2.quick("getMain",{list:list});
            }
        }
    },

    MainClickd:function(event,detail){
        for(var i = 0; i < 4; i++){
            var node = event.target.parent.children[i];
            var select = node.getChildByName('select');
            select.acitve = node.name == event.target.name;
        }
        this.mainValue = parseInt(detail);
        this.selectMain(this.mainValue);
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case 'btn_main1':{
                var touwu = 0;
                if(cc.vv.roomMgr.stage == null && this._idx <= 5 && cc.vv.roomMgr.param.touwu == 1){
                    touwu = 1;
                }
                var list = [];
                list.push(this.mainValue);
                //this.playSFX(cc.vv.roomMgr.seatid,"jiaozhu");
                cc.vv.net2.quick("getMain",{list:list,touwu:touwu});
            }
            break;
            case 'btn_main2':{
                var list = [];
                list.push(this.mainValue);
                list.push(this.mainValue);
                //this.playSFX(cc.vv.roomMgr.seatid,"jiaozhu");
                cc.vv.net2.quick("getMain",{list:list});
            }
            break;
            case "btn_gaipai":{
                var pai = [];
                var result = this.getSelectPaiList(1);
                if(result.length == 8){
                    for(var i = 0; i < result.length; ++i){
                        var value = result[i].value;
                        pai.push(value);
                    }
                    //event.target.active = false;
                    cc.vv.net2.quick("gaipai",{list:pai});
                    this.btn_gaipai.active = false;
                    this.gaipaiTip.active = false;
                }else{
                    cc.vv.popMgr.tip("请选择八张牌");
                }
               
            }
            break;
            case 'btn_chupai':{
                var pai = [];
                var result = this.getSelectPaiList(1);
                for(var i = 0; i < result.length; ++i){
                    var value = result[i].value;
                    pai.push(value);
                }
                if(pai.length == 0){
                    cc.vv.popMgr.tip('您必须要打出一张牌');
                }
                else{
                    cc.vv.net2.quick('chupai',{list:pai});
                }
            }
            break;
            case 'btn_lookgaipai':{
                this.gaipaiNode.active = true;
                for(i = 0; i < this.gaipaiArr.length; i++){
                    var node = this.gaipaiNode.children[i+1];
                    var sprite = node.getComponent(cc.Sprite);
                    sprite.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,this.gaipaiArr[i]);
                }
            }
            break;
            case 'bg_gaipai':{
                this.gaipaiNode.active = false;
            }
            break;
            case 'btn_fanzhu':{
               
                var count = 0;
                var json = {};
                for(var i = 7; i <= 55; i+=16){
                    var zhu = this.isMain(i);
                    if(zhu.length == 2 && zhu[0] != this.robPoke){
                        count++;
                        json[i] = zhu;
                    }
                }
                if(count == 1){
                    this.nodeXiazhu.active = false;
                    var objKeys = Object.keys(json);
                    cc.vv.net2.quick('getMain',{list:json[objKeys[0]]});
                }else if(count > 1){
                    this.nodeXiazhu.active = true;
                    this.selectZhu();
                }
                //this.playSFX(cc.vv.roomMgr.seatid,"fanzhu");
                event.target.active = false;
            }
            break;
            case 'btn_touxiang':{
                cc.vv.net2.quick('touXiang');
            }
            break;
        }
    },

    SortCardList:function(pai){
        for(var i = 0; i < pai.length; i++) {
            for(var j = 0; j < pai.length - i - 1; j++) {
                var a = pai[j] % 16 * 10 + parseInt(pai[j]/16) * 1000;
                var b = pai[j + 1] % 16 * 10 + parseInt(pai[j + 1]/16) * 1000;

                if(pai[j] == 2){
                    a = (2 * 10) + 900;
                }
                if(pai[j + 1] == 2){
                    b = (2 * 10) + 900;
                }
                
                if(pai[j] % 16 == 2){
                   
                    if(this.mainColor == parseInt(pai[j]/16)){
                        a = (20 + 3000)*100 + 100;
                    }else{
                        a = a * 100;
                    }
                }
                if(pai[j + 1] % 16 == 2){
                   
                    if(this.mainColor == parseInt(pai[j+1]/16)){
                        b = (20 + 3000)*100 + 100;
                    }else{
                        b = b * 100;
                    }
                }
                if(pai[j] % 16 == 7){
                    
                    if(this.mainColor == parseInt(pai[j]/16)){
                        a = (70 + 3000)*10000 + 100;
                    }else{
                        a = a * 10000;
                    }
                }
                if(pai[j + 1] % 16 == 7){
                    
                    if(this.mainColor == parseInt(pai[j+1]/16)){
                        b = (70 + 3000)*10000 + 100;
                    }else{
                        b = b * 10000;
                    }
                }
                if(pai[j] % 16 == 15){
                    a = a * 100000 + 100;
                }
                if(pai[j + 1] % 16 == 15){
                    b = b * 100000;
                }
                if(this.mainColor == parseInt(pai[j]/16)) {
                    a += 5000;
                }
                if(this.mainColor == parseInt(pai[j + 1]/16)) {
                    b += 5000;
                }
                if(a < b) {
                    var poker = pai[j];
                    var poker1 = pai[j + 1];
                    pai[j] = poker1;
                    pai[j + 1] = poker;
                }
            }
        }
        return pai;
    },

    sortCardNode:function(pai){
        if(pai == null) return;
        var list = this.SortCardList(pai);
        this.mainArr = [];
        this.nodeCard.removeAllChildren();
        for(var i = 0; i < list.length; i++){
            var card = cc.instantiate(this.pokerPrefab);
            card.myTag = i;
            this.nodeCard.addChild(card);
            card.x = -570 + i*60;
            var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,list[i]);
            card.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
            card.value = list[i];
            if(list[i]%16 == 7){
                this.mainArr.push(list[i]);
            }
            if(i == list.length -1){
                this.refreshHandCards();
            }
        }
        this.showMainPoker(this.mainColor,this.nodeCard);
    },
   
});