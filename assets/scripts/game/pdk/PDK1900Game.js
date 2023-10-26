cc.Class({
    extends: cc.Component,

    editor: {
        executionOrder: -1
    },

    properties: {
        _winPlayer:cc.Node,
        nodeCard:cc.Node,
        nodeJiesuan:cc.Node,
        nodeReport:cc.Node,
        pokerPrefab:cc.Prefab,
        othercards:cc.Node,
        tips:cc.Node,
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
        zha:cc.Label,
        difen:cc.Label,
        opts:cc.Node,
        timepos:cc.Node,
        waitclock:cc.Node,
        myfolds:cc.Node,
        othterfolds:cc.Node,
        shadow:cc.Node,
        passNotice:cc.Node,
        beishuRoot:cc.Node,
        spine1:cc.Node,
        spine2:cc.Node,
        warming:cc.Node,
        beishu1:cc.Label,
        beishu2:cc.Label,
        winUI:cc.Node,
        loseUI:cc.Node,
        gamebegin:cc.Node,
        sprTip:cc.Sprite,
        mingPai:cc.Node,

        _tipIndex:0,
        _noChoise:true,
        _senceDestroy:false, // 当前场景是否被销毁

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        var const_pdk = require("PDK1900Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"pdk",
            hide_nothing_seat:false,
            direct_begin:false,
            chat_path:const_pdk.chat_path,
            quick_chat:const_pdk.quick_chat,
            player_3:const_pdk.player3,
            player_2:const_pdk.player2,
            set_bg:true,
            location:true,
            show_watch_btn:false,//是否显示观战按钮
            default_bg:const_pdk.default_bg
        }

        this._winPlayer = cc.find("Canvas/mgr/players");

        //获取对象
        this.table = this.node.getComponent("Table");

        //初始化
        this.new_round();
        //监听协议
        this.initEventHandlers();

        this.btn_buchu = this.opts.getChildByName('btn_buchu');
        this.btn_tishi = this.opts.getChildByName('btn_tishi');
        this.btn_chupai = this.opts.getChildByName('btn_chupai');
        this.btn_yaobuqi = this.opts.getChildByName('btn_yaobuqi');
        this.timepoint = this.opts.getChildByName('timepoint').getComponentInChildren(cc.Label);

        this.ske = this.spine1.getComponent(sp.Skeleton);
        this.ske2 = this.spine2.getComponent(sp.Skeleton);

        this.noMove = true;
        this.tishipai = [];
        this.isMingPai = false;
    },

    start(){
        var self = this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        this.nodeCard.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_END, this.touchend, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_CANCEL , this.touchcancel , this);

        cc.vv.pdkMgr = this.node.getComponent("PDK1900Mgr");

        //回放
        var ReplayMgr = require("PDK1900ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });
            //初始化数据
            cc.vv.pdkMgr.prepareReplay();
            function callback(seatid){
                self.table.seat();
                
                //显示坐的人
                self.table.table(cc.vv.roomMgr.table);

            
                self.timepos.children[0].x = 456;
                self.timepos.children[0].y = 80;
                self.timepos.children[1].x = -456;
                self.timepos.children[1].y = 80;
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

    //判断触摸范围
    isInRect:function(location){
        for (var i = this.nodeCard.childrenCount - 1; i >= 0; --i) {
            var item = this.nodeCard.children[i];
            var rect = item.getBoundingBoxToWorld();
            
            if(rect.contains(location)){
                item.getComponent('DDZPoker').setMove(1);
                item.isChiose = true;
                return item;
            }
        }

        return null;
    },

    //设置所有牌没被选中
    setAllCardUnSelected:function(){
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            var card =  this.nodeCard.children[i].getComponent('DDZPoker');
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
            var card = children.getComponent('DDZPoker');
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
                var card = item.getComponent('DDZPoker');
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
            var xuanPaiList = this.getShunzi(list.reverse());

            if(xuanPaiList != null){
                this.xuanpai(list,xuanPaiList)
            }
        }
    },

    touchcancel: function(event){
        this.touchend(event);
    },

    xuanpai:function(list,pailist){
        for(var j = 0; j < list.length; j++){
            list[j].node.getComponent('DDZPoker').setSelect(0);
        }

        while(pailist.length > 0){
            var key = pailist.pop();
            for(var i = 0; i < list.length; i++){
                if(key == list[i].value){
                    list[i].node.getComponent('DDZPoker').setSelect(1);
                    break;
                }
            }
        }
    },

    getShunzi:function(list){
        if(list.length == 0){
            return null;
        }

        for (var indexout = 0; indexout < list.length; indexout++) {
            var onePai = -1;
            var twoPai = -1;
            var xuanPaiList = [];
            // var xuanpaiIndex = [];
            // xuanpaiIndex.push(indexout);
            xuanPaiList.push(list[indexout].value);  
            for (var index = indexout; index < list.length - 1; index++) {
                onePai = list[index].value;
                twoPai = list[index + 1].value;
                
                if(onePai + 1 == twoPai){
                    xuanPaiList.push(twoPai);
                    if(index == list.length - 2){
                        var isShunzi = this.ifShunZi(xuanPaiList);
                        if(isShunzi){
                            return xuanPaiList;
                        }  
                    }
                }else if(onePai == twoPai){
                    if(index == list.length - 2){
                        var isShunzi = this.ifShunZi(xuanPaiList);
                        if(isShunzi){
                            return xuanPaiList;
                        }  
                    }
                    continue;
                }else{
                    var isShunzi = this.ifShunZi(xuanPaiList);
                    if(isShunzi){
                        return xuanPaiList;
                    }else{
                        break;
                    }
                }
            }
        } 

        return null;
    
    },

    ifShunZi:function(list){
        if(list.length >= 5){
            return true;
        }else{
            return false;
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
            var round = data.data.round;
            self.begin();
            self.fapai(pai);
        }),

        //小结算
        this.node.on("jiesuan",function(data){
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
            if(data.errcode != 0){
                cc.vv.popMgr.tip(data.errmsg);
                return;
            }
            self.chupai(data.data);
        }),

        this.node.on("operate",function(data){
            self.operate(data.data);
        }),

        this.node.on("tip",function(data){
            self.tishipai = data.data.pai;
        }),

        this.node.on("shoupai",function(data){
            //self.refreshHandCards(data.data);
        }),

        this.node.on("chuPaiShiBai",function(data){
            //self.chuPaiShiBai(data);
        }),

        this.node.on("chongxinfapai",function(data){
            
        }),

        this.node.on("beginOpenPai",function(data){
            self.opts.getChildByName('btn_ming').active = true;
        }),

        this.node.on("openPai",function(data){
            var pai = data.data.pai;
            var seatid = data.data.seatid;
            var power = data.data.power;
            self.showMingPai(pai,seatid);
            self.updateBeiShu(power,0);
            self.isMingPai = true;
            self.playSFX(seatid,'mingpai');
            cc.vv.audioMgr.playSFX("ddz/effect/effect_flower");
        }),

        this.node.on("showMing",function(data){
            var pai = data.pai;
            var seatid = data.seatid;
            self.showMingPai(pai,seatid);
        }),

        this.node.on('updateBeiShu',function(data){
            self.updateBeiShu(data.power,0);
        }),

        this.node.on('showClock',function(data){
            self.showClock(data.seatid);
        }),

        this.node.on('error',function(ret){
            cc.vv.popMgr.tip(ret.errmsg);
        }),

        this.node.on('boom',function(data){
            self.boom(data.data.json);
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay){
                self.new_round();
                cc.vv.net2.quick('stage');
            }
        });

    },

    boom:function(json){
        var self = this;
        for(var i = 0; i < json.length; i++){
            var seatid = json[i].seatId;
            var power = json[i].power;
            var getFen = json[i].getFen;
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            self.table.seat_emit(viewid,"score",power);
            if(getFen > 0){
                self.table.seat_emit(viewid,"win",getFen);
            }else{
                self.table.seat_emit(viewid,"lost",getFen);
            }
            
        }
        // var seatid = data.seatId;
        // var power = data.power;
        // var getFen = data.getFen;
        // var viewid = cc.vv.roomMgr.viewChairID(seatid);
        // self.table.seat_emit(viewid,"score",power);
    },

     //新一局，重置桌面
    new_round(){
        var self=this;
        this.nodeReport.active = false;
        this.nodeJiesuan.active = false;
        this.nodeCard.removeAllChildren();
        this.othercards.active = false;
        this.opts.active = false;
        cc.vv.roomMgr.stage = null;
        this.hideTips();
        this.hidePassNotice();
        this.clearPoker();
        this.waitclock.active = false;
        //this.warming.active = false;
        this.hideWarming();
        this.zha.string = 0;
        this.beishu1.string = 'x1';
        this.beishu2.string = 'x1';
        this.winUI.active = false;
        this.loseUI.active = false;
        this.threeCards = [];
        this.gamebegin.active = false;
        this.isMingPai = false;
        this.isBegin = false;
    },

    //隐藏警告
    hideWarming:function(){
        for(var i = 0; i < this.warming.childrenCount; ++i){
            var node =  this.warming.children[i];
            node.getComponent(cc.Animation).stop('warming');
            node.active = false;
        }
    },

    //游戏参数
    param:function(data){

        //0:每局选分 5,10,20,50固定分
        this._feng = data.feng;

        this._zhuang_mode = data.zhuang_mode;

         //房主id
         this._fangzhu = data.fangzhu;

         this.difen.string = data.feng;
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
        // this.gamebegin.active = true;
        // var anim = this.gamebegin.getComponent(cc.Animation);
        // var animState = anim.play('ddz_begin');
        // anim.on('stop',function(){
        //     self.gamebegin.active = false;
        // });
    },

    //清理桌面上出的牌
    clearPoker:function(){
        this.myfolds.removeAllChildren();
        this.othterfolds.children[0].removeAllChildren();
        this.othterfolds.children[1].removeAllChildren();
        this.mingPai.children[0].removeAllChildren();
        this.mingPai.children[1].removeAllChildren();
    },

    //隐藏不出通知
    hidePassNotice:function(){
        for(var i = 0; i < this.passNotice.childrenCount; ++i){
            this.passNotice.children[i].active = false;
        }
    },

    //发牌
    fapai:function(pai){
        this.isBegin = true;
        var self = this;
        
        // cc.vv.roomMgr.now = round;
        this.table._winHub.emit("round");

        //让座位到开局状态
        this.table.seat_emit(null,"round");

        this.othercards.active = cc.vv.roomMgr.param.showPais==1;
        this.othercards.children[1].active = cc.vv.roomMgr.ren == 3;
        if(cc.vv.roomMgr.stage){
            self.othercards.children[0].getComponentInChildren(cc.Label).string = 16;
            self.othercards.children[1].getComponentInChildren(cc.Label).string = 16;
        }

        this.deal_fapai(0,pai.length,pai,function(idx){
            var index = idx;
            if(cc.vv.roomMgr.param.showPais==1){
                self.othercards.children[0].getComponentInChildren(cc.Label).string = ++index;
                self.othercards.children[1].getComponentInChildren(cc.Label).string = index;
            }
            
            if(idx < pai.length - 1) return;
            if(self.jipai){
                self.pushremeberCard(self.jipai);
            }
            var that = self;
            self.showPoker(pai,function(k){
                if(k != pai.length - 1) return;
                that.refreshHandCards();
            });
        });
    },
    
    //显示手牌
    showPoker:function(list,callback){
        for(var i = 0; i <  this.nodeCard.childrenCount; ++i){
            var node = this.nodeCard.children[i];
            var data = {
                index:i,
                atlas:this.poker1Atlas,
                value:list[i],
                callback:callback
            }
            node.emit('flip',data);
        }
    },


    //给玩家发牌
    deal_fapai:function(begin,end,list,callback){
        this.nodeCard.removeAllChildren();

        //发牌
        var xipai = cc.vv.roomMgr.param.xipai;
        
        for(var i = begin ; i < end ;i++){
            //生成一张牌
            var card = cc.instantiate(this.pokerPrefab);
            card.myTag = i;
            this.nodeCard.addChild(card);
            card.y = 300;

            var json = {
                index:i,
                atlas:this.poker1Atlas,
                value:list[i],
                callback:callback,
                xipai:xipai
            }
            if(!cc.vv.roomMgr.stage && !cc.vv.roomMgr.is_replay){
                card.emit("fapai",json);
            }
            else{
                card.y = 0;
                card.x = -570 + i*60;
                if(list[i] != 0){
                    var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,list[i]);
                    card.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
                    card.getComponent('DDZPoker').setValue(list[i]);
                    card.value = list[i];
                    if(i == end -1){
                        this.refreshHandCards();  
                    }
                }  
            }
        }
    },


    //出牌倒计时
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

    //隐藏通知
    hideTips:function(){
        for(var i = 0; i < this.tips.childrenCount; ++i){
            this.tips.children[i].active = false;
        }
    },

    //切换提示
    tip:function(text){
        if(text == null){
            this.sprTip.node.active = false;
            return;
        }

        var spriteFrame = this.tipAltas.getSpriteFrame(text);
        this.sprTip.spriteFrame = spriteFrame;
        this.sprTip.node.active = true;
       
    },

    //播放音效
    playSFX(setaid,type){
        var sex = cc.vv.roomMgr.userSex(setaid);
        if(sex !='1' && sex!='2'){
            sex = '1';
        }
        var mp3File = "ddz/" + sex + "/" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },

    //牌数
    showPais:function(seatid,pais){
        this.othercards.active = cc.vv.roomMgr.param.showPais==1;
        var index = cc.vv.roomMgr.viewChairID(seatid);
        if(index >= 1){
            this.othercards.children[index-1].getComponentInChildren(cc.Label).string = pais;
        }
    },

    //更新倍数
    updateBeiShu:function(beishu,nowZha){
        for(var i = 0; i < beishu.length; ++i){
            if(i == this.beishuRoot.children[0].myTag){
                this.beishu1.string = 'x' + beishu[i];
            }
            if(i == this.beishuRoot.children[1].myTag){
                this.beishu2.string = 'x' + beishu[i];
            }
        }
        this.zha.string = nowZha;
    },

    //牌出完
    onGameOver:function(seatid){
        //cc.vv.audioMgr.pauseAll();
        this.hideWarming();
        this.hidePassNotice();
        this.waitclock.active = false;
        this.unschedule(this.selfTimeUpdate2);
        this.unschedule(this.otherTimeUpdate);
        if(seatid == cc.vv.roomMgr.seatid){
            this.winUI.active = true;
            cc.vv.audioMgr.playSFX("ddz/game_win");
        }
        else{
            cc.vv.audioMgr.playSFX("ddz/game_lose");
            this.loseUI.active = true;
        }
    },

    //出牌信息
    chupai:function(data){
        this.updateBeiShu(data.beishu,data.nowZha);
        var index = cc.vv.roomMgr.viewChairID(data.seatid);
        this.passNotice.children[index].active = false;
        if(data.list.length == 0){        //要不起或者不出
            this.passNotice.children[index].active = true;
            var ary = ['buyao1','buyao2','buyao3','buyao4'];
            var url = ary[Math.floor(Math.random() * ary.length)];
            this.playSFX(data.seatid,url);
        }
        else{
            cc.vv.audioMgr.playSFX('ddz/effect/effect_playcard');
            if(data.shouchu == 1){
                this.hidePassNotice();
            }
            //出牌类型播放音效特效
            this.showChupaiType(data);
            //报警
            if(data.pais == 1){
                cc.vv.audioMgr.playBGM("ddz/bg_music_quick");
                this.playSFX(data.seatid,'baojing' + data.pais);
                var warming = this.warming.children[index];
                warming.active = true;
                warming.getComponent(cc.Animation).play('warming');
            }
        }

        //牌出完了
        if(data.pais == 0){
            this.onGameOver(data.seatid);
        }

        this.showChupai(data.seatid,data.list);
        this.showPais(data.seatid,data.pais);
        //自己出的牌
        if(data.seatid == cc.vv.roomMgr.seatid){
            //关闭手牌触控
            //this.noMove = true;
            //手牌还原
            this.setAllCardUnSelected();
            //隐藏要不起遮罩
            this.shadow.active = false;
            //操作按钮隐藏
            this.opts.active = false;
            //关闭倒计时
            this.unschedule(this.selfTimeUpdate2);
            //提示牌数组标志初始0
            this._tipIndex = 0;
            //删除手牌
            this.removePoker(this.nodeCard,data.list); 
            //刷新手牌
            this.refreshHandCards();
            return;
        }
        else{
            this.waitclock.active = false;
            this.unschedule(this.otherTimeUpdate);
            if(this.isMingPai || cc.vv.roomMgr.is_replay){
                var root = this.mingPai.children[index-1];
                this.removePoker(root,data.list);
            }
        }
    },

    //显示出牌
    showChupai:function(seatid,pai){
        var index = cc.vv.roomMgr.viewChairID(seatid);
        var root = null;
        if(seatid == cc.vv.roomMgr.seatid){
            root = this.myfolds;
        }
        else{
            root = this.othterfolds.children[index-1];
        }
        root.removeAllChildren();
       
        for(var i = 0; i < pai.length; ++i){
            var node = cc.instantiate(this.pokerPrefab);
            node.scale = 0.6;
            var card = node.getComponent('DDZPoker');
            if(pai[i] != 0){
                var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,pai[i]);
                node.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
                root.addChild(node);

            }
        }
    },

    //根据出牌播放声音
    showChupaiType:function(data){
        var self = this;
        var url = '';
        var effect = '';
        var sounds = ['dani1','dani2','dani3'];
        switch(data.type){
            //炸弹
            case 16:{
                url = 'zhadan';
                effect = 'effect_bomb';
                this.playSFX(data.seatid,url);
                cc.vv.audioMgr.playSFX('ddz/effect/' + effect);
                cc.loader.loadRes("game/ddz/animation/bomb/doudizhu_zha_normal", sp.SkeletonData, function (err, skeletonData) {
                    self.ske.node.active = true;
                    self.ske.node.x = 0;
                    self.ske.node.y = -179;
                    self.ske.skeletonData = skeletonData;
                    self.ske.timeScale = 1;
                    self.ske.setAnimation(0, "doudizhu zha", false);
                    self.ske.setCompleteListener(function(){
                        
                    });
                });
                
                cc.loader.loadRes("game/ddz/animation/bomb/doudizhu_zha_add", sp.SkeletonData, function (err, skeletonData) {
                    self.ske2.node.x = 0;
                    self.ske2.node.y = -179;
                    self.ske2.skeletonData = skeletonData;
                    self.ske2.timeScale = 0.8;
                    self.ske2.setAnimation(0, "doudizhu zha", false);
                });
            }
            break;
            //四带三
            case 15:{
                url = 'sidaisan';
           }
           break;
            //四带两队
            case 14:{
                url = 'sidailiangdui';
           }
           break;
            //四带二
            case 13:{
                 url = 'sidaier';
            }
            break;
            case 12:
            case 11:
            case 10:
            //飞机
            case 9:{
                url = 'feiji';
                effect = 'effect_plane';
                cc.loader.loadRes("game/ddz/animation/plane/feiji", sp.SkeletonData, function (err, skeletonData) {
                    self.ske.node.active = true;
                    self.ske.node.x = -184;
                    self.ske.node.y = -384;
                    self.ske.skeletonData = skeletonData;
                    self.ske.timeScale = 1;
                    self.ske.setAnimation(0, "doudizhu_feiji", false);
                    self.ske.setCompleteListener(function(){
                       
                    });         
                });
            }
            break;
            //连队
            case 8:{
                url = 'liandui';
                effect = 'effect_boat';
                cc.loader.loadRes("game/ddz/animation/boat/shunzi", sp.SkeletonData, function (err, skeletonData) {
                    self.ske.node.active = true;
                    self.ske.node.x = -230;
                    self.ske.node.y = -99;
                    self.ske.skeletonData = skeletonData;
                    self.ske.setSkin("lian");
                    self.ske.timeScale = 1;
                    self.ske.setAnimation(0, "animation", false);  
                    self.ske.setCompleteListener(function(){
                       
                    });        
                });
            }
            break;
            //顺子
            case 7:{
                url = 'shunzi';
                effect = 'effect_boat';
                cc.loader.loadRes("game/ddz/animation/boat/shunzi", sp.SkeletonData, function (err, skeletonData) {
                    self.ske.node.active = true;
                    self.ske.node.x = -230;
                    self.ske.node.y = -99;
                    self.ske.skeletonData = skeletonData;
                    self.ske.setSkin("shun");
                    self.ske.timeScale = 1;
                    self.ske.setAnimation(0, "animation", false); 
                    self.ske.setCompleteListener(function(){
                       
                    });            
                });
            }
            break;
            //三带对
            case 6:{
                if(data.shouchu == 1){
                    url = 'sandaiyidui';
                }
                else{
                    url = sounds[Math.floor(Math.random()*sounds.length)];
                }
            }
            break;
            //三带二
            case 5:{
                if(data.shouchu == 1){
                    url = 'sandaier';
                }
                else{
                    url = sounds[Math.floor(Math.random()*sounds.length)];
                }
            }
            break;
            //三带一
            case 4:{
                if(data.shouchu == 1){
                    url = 'sandaiyi';
                }
                else{
                    url = sounds[Math.floor(Math.random()*sounds.length)];
                }
            }
            break;
            //三不带
            case 3:{
                var pai = data.list[0];
                url = 'pai/tuple' + pai % 16;
                if(data.shouchu != 1){
                   sounds.push(url);
                   url = sounds[Math.floor(Math.random()*sounds.length)];
                }
            }
            break;
            //对子
            case 2:{
                var pai = data.list[0];
                url = 'pai/dui' + pai % 16;
                if(data.shouchu != 1){
                    sounds.push(url);
                    url = sounds[Math.floor(Math.random()*sounds.length)];
                }
            }
            break;
            //单
            case 1:{
                var pai = data.list[0];
                if(pai == 95){
                    url = 'pai/16';
                }
                else if(pai == 79){
                    url = 'pai/15';
                }
                else{
                    url = 'pai/' + pai % 16;
                    if(data.shouchu != 1){
                        sounds.push(url);
                        url = sounds[Math.floor(Math.random()*sounds.length)];
                    }
                }
            }
            break;
        }
        if(data.type != 16){
            if(effect != ''){
                cc.vv.audioMgr.playSFX('ddz/effect/' + effect);
            }
            this.playSFX(data.seatid,url);
        }
    },

    //轮到谁操作
    operate:function(data){
        var self = this;
        
        var index = cc.vv.roomMgr.viewChairID(data.seatid);
        this.passNotice.children[index].active = false;
        
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip(null);
            this.myfolds.removeAllChildren();
            this.waitclock.active = false;
            this.opts.active = true;
            this.timepoint.string = 15;
            this.schedule(this.selfTimeUpdate2,1);
            this.btn_yaobuqi.active = data.can == 0;
            this.shadow.active = data.can == 0 || data.can == 4;
            if(data.can == 0 || data.can == 4){
                this.noMove = true;
                this.btn_buchu.active = false;
                this.btn_chupai.active = false;
                this.btn_tishi.active = false;
            }
            else if(data.can == 1){
                this.noMove = false;
                this.btn_buchu.active = data.must == 0;
                this.btn_chupai.active = true;
                this.btn_tishi.active = true;
            }
            else if(data.can == 2){
                this.noMove = false;
                this.btn_buchu.active = false;
                this.btn_chupai.active = true;
                this.btn_tishi.active = false;
            }
        }
        else{
            this.waitclock.active = true;
            this.waitclock.getComponentInChildren(cc.Label).string = 15;
            this.schedule(this.otherTimeUpdate,1);
            this.waitclock.x = this.timepos.children[index - 1].x;
            this.waitclock.y = this.timepos.children[index - 1].y;
            this.othterfolds.children[index-1].removeAllChildren();
        }
    },

    showClock:function(seatid){
        var index = cc.vv.roomMgr.viewChairID(seatid);
        this.waitclock.active = true;
        this.waitclock.getComponentInChildren(cc.Label).string = 15;
        this.waitclock.scale = 0.7;
        if(index >= 1){
            this.waitclock.x = this.timepos.children[index - 1].x;
            this.waitclock.y = this.timepos.children[index - 1].y;
        }
        else{
            this.waitclock.x = -456;
            this.waitclock.y = -56;
        }
    },

    //出牌提示
    pokerTip:function(data){
        this.setAllCardUnSelected();
        var pai = data[this._tipIndex];
        if(this._tipIndex >= data.length){
            this._tipIndex = 0;
            this.setAllCardUnSelected();
            return;
        }

        //var idx = 0;
        pai.sort(function(a,b){
            return a<b;
        });
        for(var j = 0; j < pai.length; ++j){
            for(var i = 0; i < this.nodeCard.childrenCount; ++i){
                var node = this.nodeCard.children[i];
                // var value = card.getValue();
                if(pai[j] == node.value){
                    var card = node.getComponent("DDZPoker");
                    this.selectCard(card,1);
                    //idx = i;
                    break;
                }
            }
        }
        
        this._tipIndex++;    
       
    },

    //小结算
    jiesuan:function(data){
        var self = this;

        //cc.vv.audioMgr.pauseAll();
        cc.vv.audioMgr.playBGM("ddz/bg_music");
        this.hideWarming();
        this.nodeJiesuan.active = true;
        var results = data.list;
        cc.vv.roomMgr.dissroom = data.gameEndFalg;
        if(this.table._winDissroom!=null){
            this.table._winDissroom.active = true;
        }
        //隐藏解散房间
        this.table.hide_dismiss_room();
        //输赢情况
        var hand = results[cc.vv.roomMgr.seatid].hand;
        var bg = this.nodeJiesuan.getChildByName('bg').getComponent(cc.Sprite);
        var title = this.nodeJiesuan.getChildByName('title').getComponent(cc.Sprite);
        var res = 'game/ddz/bg_win';
        var spriteframe_titile = null;
        if(hand.length == 0){
            spriteframe_titile = "win";
        }     
        else{
            res = 'game/ddz/bg_lose';
            spriteframe_titile = "lose";
        }
        cc.vv.utils.loadimg(res,function(spriteFrame){
            bg.spriteFrame = spriteFrame;
        });
        title.spriteFrame = this.jiesuanAltas.getSpriteFrame(spriteframe_titile);

        //房间信息
        var now = this.nodeJiesuan.getChildByName('now').getComponent(cc.Label);
        now.string = "第" + cc.vv.roomMgr.now + "局";
        var roomid = this.nodeJiesuan.getChildByName("roomid").getComponent(cc.Label);
        roomid.string = cc.vv.roomMgr.roomid;
        var wanfa = this.nodeJiesuan.getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.roomMgr.enter.desc;
        this.nodeJiesuan.getChildByName("time").getComponent(cc.Label).string = data.time;
        this.nodeJiesuan.getChildByName("zha").getComponent(cc.Label).string = 'x' + data.zha;
        //每个玩家信息
        var listRoot = this.nodeJiesuan.getChildByName('resutl_list');
        for(var i = 0; i < listRoot.childrenCount; i++){
            listRoot.children[i].active = false;
        }
        for(var i = 0; i < cc.vv.roomMgr.ren; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var sn = listRoot.getChildByName("s" + viewid);
            sn.x = listRoot.children[i].x;
            sn.y = listRoot.children[i].y;
            sn.active = true;
            var username = sn.getChildByName('username').getComponent(cc.Label);
            var userid = sn.getChildByName('userid').getComponent(cc.Label);
            var score = sn.getChildByName('score').getComponent(cc.Label);
            var difen = sn.getChildByName('difen').getComponent(cc.Label);
            var beishu = sn.getChildByName('beishu').getComponent(cc.Label);
            var hand = sn.getChildByName('hand');
            var chupai = sn.getChildByName('chupai');
            var zha = sn.getChildByName('zha').getComponent(cc.Label);
            var zhuaniao = sn.getChildByName('zhuaniao');
            
            if(cc.vv.roomMgr.param.zhuaNiao == 0){
                zhuaniao.active = false;
            }else{
                zhuaniao.active = data.ht10Seatid == i;
            }
            zha.string = 'x' + data.zhadanNum[i];
            username.string = results[i].username;
            userid.string = results[i].userid;
            score.string = results[i].round_score;
            difen.string = results[i].hand.length;
            beishu.string = 'x' + data.power[i];
            var headimg = this.table.seat_img(viewid);
            sn.getChildByName('head').getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
            //img.getComponent("ImageLoader").loadImg(results[i].headimg);
            for(var j = 0 ; j < hand.childrenCount; ++j){
                hand.children[j].active = false;
            }
            for(var k = 0 ; k < chupai.childrenCount; ++k){
                chupai.children[k].active = false;
            }
            for(var m = 0 ; m < results[i].hand.length; ++m){
                hand.children[m].active = true;
                var sprite = hand.children[m].getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker2Atlas,results[i].hand[m]);
            }
           
            // for(var n = results[i].outHand.length - 1 ; n >= 0; --n){
            //     chupai.children[n].active = true;
            //     var sprite = chupai.children[n].getComponent(cc.Sprite);
            //     sprite.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker2Atlas,results[i].outHand[n]);
            // }
        
            var viewid = cc.vv.roomMgr.viewChairID(i);
            this.table.seat_emit(viewid,"score",results[i].user_score);


        }
    },

    //大结算
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
         this.nodeReport.getChildByName('wanfa').getComponent(cc.Label).string = cc.vv.roomMgr.enter.desc;
         var results = data.list;
         var list = this.nodeReport.getChildByName("list");
         for(var i = 0; i < list.childrenCount; i++){
            list.children[i].active = false;
         }

         for(var i = 0; i < cc.vv.roomMgr.ren; ++i){
             var sn = list.children[i];
             sn.active = true;
             if(results[i].userid == 0){
                 sn.active = false;
                 continue;
             }
             var img = sn.getChildByName('head').getChildByName("img");
             var username = sn.getChildByName('username').getComponent(cc.Label);
             var userid = sn.getChildByName('userid').getComponent(cc.Label);
             var fangzhu = sn.getChildByName('fangzhu');
             fangzhu.active = false;
             var score = sn.getChildByName('score').getComponent(cc.Label);
             var bigwin = sn.getChildByName('bigwin');
             var coins = sn.getChildByName('coins').getComponent(cc.Label);

             img.getComponent("ImageLoader").loadImg(results[i].headimg);
             username.string = results[i].name;
             userid.string = results[i].userid;
             score.string = results[i].result_score;
             coins.string = results[i].coins;
             fangzhu.active = this._fangzhu == userid.string;
             bigwin.active = score.string == results[0].result_score && results[0].result_score != 0;
             //bigtuhao.active = score.string == min_score && score.string != 0;
         }
    },

    //重连恢复画面
    stage:function(data){
        if(this._senceDestroy){
            return;
        }
        cc.vv.roomMgr.stage = data;

        switch(data.stage){
            //等待发牌
            case 1:{
                //this.fapai(data.cards);
            }
            break;
            //发牌
            case 2:{
                this.fapai(data.cards);
            }
            break;
            case 4:
            case 5:
            case 6:
            case 3:{
                this.fapai(data.cards);
                this.updateBeiShu(data.power,data.nowZha);
                if(data.pais != null){
                    for(var i = 0; i < data.pais.length; ++i){
                        this.showPais(i,data.pais[i]);
                        //报警
                        if(data.pais[i] == 1){
                            var index = cc.vv.roomMgr.viewChairID(i);
                            cc.vv.audioMgr.playBGM("ddz/bg_music_quick");
                            this.playSFX(i,'baojing' + data.pais[i]);
                            var warming = this.warming.children[index];
                            warming.active = true;
                            warming.getComponent(cc.Animation).play('warming');
                        }
                    }
                }
            
                //出牌
                for(var i = 0; i < data.lastPai.length; ++i){
                    if(data.lastPai[i] == null){
                        continue;
                    }
                    this.showChupai(data.lastPai[i].seatID,data.lastPai[i].pai);
                }

                //轮到其他人出牌
                var viewid = cc.vv.roomMgr.viewChairID(data.chuPaiPeople);
                if(viewid != 0){
                    this.waitclock.active = true;
                    this.waitclock.getComponentInChildren(cc.Label).string = 15;
                    this.schedule(this.otherTimeUpdate,1);
                    this.waitclock.x = this.timepos.children[viewid - 1].x;
                    this.waitclock.y = this.timepos.children[viewid - 1].y;
                    this.othterfolds.children[viewid-1].removeAllChildren();
                }

                for(var i = 0; i < data.userScore.length; i++){
                    var viewid = cc.vv.roomMgr.viewChairID(data.userScore[i].seatid);
                    this.table.seat_emit(viewid,"score",data.userScore[i].score);
                }
            }
            break;
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

    //刷新手牌位置
    refreshHandCards:function(){
        var length = this.nodeCard.childrenCount;
        if(length == 0){
            return;
        }
        var offset = length > 17 ? 60 : 70;
        var pos = length > 17 ? -30 : 0;
        //左右扩展位置
        var mid = parseInt((length - 1) / 2);

        this.nodeCard.children[mid].x = pos;
        for(var i = mid + 1 ; i < length;i++){
            this.nodeCard.children[i].x = pos + (i - mid) * offset;
        }

        for(var i = mid - 1 ; i >= 0; i--){
            this.nodeCard.children[i].x = (i - mid) * offset + pos;
        }
    },

    //出牌失败
    chuPaiShiBai:function(data){
        cc.vv.popMgr.tip(data.errmsg);
    },

    showMingPai:function(pai,seatid){
        var index = cc.vv.roomMgr.viewChairID(seatid);
        if(index >= 1){
            var root = this.mingPai.children[index-1];
            root.active = true;
            root.removeAllChildren();
            var length = 0;
            for(var i = 0; i < pai.length; ++i){
                if(pai[i] != 0){
                    var node = new cc.Node();
                    root.addChild(node);
                    node.value = pai[i];
                    var sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker2Atlas,pai[i]);
                    length++;
                }
                
            }
            this.othercards.children[index-1].getComponentInChildren(cc.Label).string = length;
        }
    },

    //按钮操作
    onBtnClicked:function(event,data){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case "btn_tishi":{
                this.pokerTip(this.tishipai);
            }
            break;
            case "btn_chupai":{
                var pai = [];
                var result = this.getSelectPaiList(1);
                for(var i = 0; i < result.length; ++i){
                    var value = result[i].getComponent('DDZPoker').getValue();
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
            case "btn_buchu":{
                
            }
            case "btn_yaobuqi":{
                var pai = [];
                cc.vv.net2.quick('chupai',{list:pai});
            }
            break;
        }
    },

    
    onDestroy:function(){
        this._senceDestroy = true;
        cc.loader.setAutoRelease(this, true);
    },
    

    // update (dt) {},
});
