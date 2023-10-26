
cc.Class({
    extends: cc.Component,

    //牛牛玩法属性
    properties: {
        pokerPrefab:cc.Prefab,
        reportItemPrefab:cc.Prefab,
        reportItemMinPrefab:cc.Prefab,
       
        pokerAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        typeAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        btnAtlas:{
            default:null,
            type:cc.Font
        },
        jiesuanAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        winFont:{
            default:null,
            type:cc.Font,
        },
        lostFont:{
            default:null,
            type:cc.Font,
        },
        moneyGold:{
            default:null,
            type:cc.SpriteAtlas
        },
        tipAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        _winPlayer:cc.Node,
        btnKaipai:cc.Node,
        btncuopai:cc.Node,
        btnfanpai:cc.Node,
        nodeCard:cc.Node,
        nodezhuang:cc.Node,
        nodeXiazhu:cc.Node,
        nodeJiesuan:cc.Node,
        nodeReport:cc.Node,
        nodeCuopai:cc.Node,
        nodeCardone:cc.Node,
        NodeWaitclock:cc.Node,
        labelScore:cc.Label,
        labelRoomwanfa:cc.Label,
        sprTip:cc.Sprite,
        _feng:0,
        _wanfa:0,
        _zhuang:0,
        _zhuang_mode:0,
    },


    editor: {
        executionOrder: -1
    },

    onLoad(){

        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            this.node.getChildByName('bgtop').width  = cc.winSize.width;
        }

        //牛牛配置
        var const_nn = require("NN1003Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"nn",
            hide_nothing_seat:true,
            direct_begin:true,
            chat_path:const_nn.chat_path,
            quick_chat:const_nn.quick_chat,
            player_5:const_nn.player5,
            player_10:const_nn.player10,
            cuopai:const_nn.cuopai,
            selfPoke_5:const_nn.selfPoke5,
            selfPoke_10:const_nn.selfPoke10,
            set_bg:true,
            location:false,
            show_watch_btn:true,//是否显示观战按钮
            default_bg:const_nn.default_bg
        }
        this._winPlayer = cc.find("Canvas/mgr/players");

        //获取对象
        this.table = this.node.getComponent("Table");

        this.node_watchgame = this.node.getChildByName("watchgame");

        this.startAnimation = this.node.getChildByName("startAnimation");
        this.animation = this.startAnimation.getComponent(cc.Animation);

        //监听协议
        this.initEventHandlers();
        
        //监听动画
        this.initEventAniamtion();

        this.nodeXiazhu.children[0].myTag = 3;
        this.nodeXiazhu.children[1].myTag = 5;
        this.nodeXiazhu.children[2].myTag = 7;
        this.nodeXiazhu.children[3].myTag = 10;
    },

    start(){
        var self = this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        cc.vv.nnMgr = this.node.getComponent("NN1003Mgr");
        // //回放
        var ReplayMgr = require("NN1003ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        //初始化
        this.new_round();

        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });
            //初始化数据
            cc.vv.nnMgr.prepareReplay();

            function callback(seatid){
                self.table.seat();
                
                // //显示坐的人
                self.table.table(cc.vv.roomMgr.table);
                // //回放数据
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
    watch_game_list:function(){
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                var is_viewid = cc.vv.roomMgr.viewChairID(table_list[i].seatid);
                var seat_node = cc.vv.utils.getChildByTag(this._winPlayer,is_viewid);
                if(!(table_list[i].sitStatus == 0)){
                    seat_node.getChildByName("watch_game").active = true;
                }else{
                    seat_node.getChildByName("watch_game").active = false;
                }
            }
        }
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.new_round();
            this.node_watchgame.active = true;
            this.nodeJiesuan.active = false;
        }
    },
    watch:function(data){
        var self = this;
        var watch_game = cc.vv.roomMgr.guanzhan_table.list;
        for(var i = 0;i < watch_game.length; i++){
            if(watch_game[i].userid == cc.vv.userMgr.userid){
                this.node.getChildByName("watchgame").active = true;
                var sit = this.node.getChildByName("sit");
                if(data.canSit.length == 0){
                    sit.active = false;
                }else{
                    sit.active = true;
                }
            }
        }
        if(data.userid == cc.vv.userMgr.userid){
            this.tip("zhunbei");
            this.new_round();
            sit.active = true;
        }
    },
    canSit:function(data){
        var sit = this.node.getChildByName("sit");
        if(data.canSit.length == 0){
            sit.active = false;
        }else{
            cc.vv.popMgr.alert("有空位置了是否坐入",function(){
                cc.vv.net2.quick("sit", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude
                });
                if(this.node.getChildByName("sit")){
                    this.node.getChildByName("sit").active = false;
                }
            },true);
            sit.active = true;
        }
    },
    
    error:function(data){
        if(data.errcode == -99){
            cc.vv.popMgr.alert("" + data.errmsg,function(){
                cc.director.loadScene("hall");
            });
        }else{
            cc.vv.popMgr.tip("" + data.errmsg);
        }
    },
      //显示推注按钮
    tuizhu:function(data,type){
        var list;
        if(type != null){
            list = data;
        }else{
            list = data.tuizhu;
        }
        if(list.length == 0)
        {
            return;
        }
        var tuizhu_btn = this.node.getChildByName("mgr").getChildByName("tuizhu");
        var tuizhu_1 = tuizhu_btn.getChildByName("btn_xiazhu_1").getChildByName("fen").getComponent(cc.Label);
        var tuizhu_2 = tuizhu_btn.getChildByName("btn_xiazhu_2").getChildByName("fen").getComponent(cc.Label);
        for(var i = 0;i < list.length; i++){
            if(list[i].userId == cc.vv.userMgr.userid){
                tuizhu_btn.active = true;
                this.tuizhu_1_str = list[i].power2;
                this.tuizhu_2_str = list[i].power;
                if(list[i].power2 == 0){
                    tuizhu_btn.getChildByName("btn_xiazhu_1").active = false;
                }
                if(list[i].power == 0){
                    tuizhu_btn.getChildByName("btn_xiazhu_2").active = false;
                }
                tuizhu_1.string = "*" + list[i].power2;
                tuizhu_2.string = "*" + list[i].power;
            }
        }
        var button1 = tuizhu_btn.getChildByName("btn_xiazhu_1").getComponent(cc.Button);
        var button2 = tuizhu_btn.getChildByName("btn_xiazhu_2").getComponent(cc.Button);
        button1.interactable = this.tuizhu_1_str <= data.xiaZhuRange;
        button2.interactable = this.tuizhu_2_str <= data.xiaZhuRange;
    },
    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.startAnimation.active = false;
            self.animation.stop();
            //self.animation.off('finished');

        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay && cc.vv.net2.isConnectd()){
                self.new_round();
                cc.vv.net2.quick("stage");
            }
        });
        //观战的玩家显示公牌
        this.node.on('fapai_2_gz',function(data){
            self.pubPoker(data.data.pubPoker);
        }),
        //显示推注按钮
        this.node.on('tuizhu',function(data){
            setTimeout(() => {
                self.tuizhu(data.data);
            }, 300);
        }),
        //观战的人进入游戏 刷新table
        this.node.on('error',function(data){
            self.error(data);
        }),
        this.node.on('canSit',function(data){
            self.canSit(data.data);
        });
        //坐入 变成观战
        this.node.on('watch',function(data){
            self.watch(data.data);
        });
        //开始
        this.node.on('begin',function(){
            self.watch_game_list();
        }),

        //观战的人进入游戏 刷新table
        this.node.on('user_status_change',function(data){
            self.user_status_change(data.data);
        }),
        
        this.node.on('param',function(data){
            self.param(data.data);
        }),

        //准备
        this.node.on("ready",function(data){
            self.ready(data.data);
        }),
        //第一轮发牌
        this.node.on("fapai_1",function(data){
            self.fapai1Data = data.data;
            self.begin();
        }),

        //抢庄
        this.node.on("kaiqiang",function(data){
            self.kaiqiang(data.data);
        }),

        //定庄
        this.node.on("dingzhuang",function(data){
            self.dingzhuang(data.data);
        }),

        //下注
        this.node.on("xiazhu",function(data){
            self.xiazhu(data.data);
        }),

        //第二轮发牌
        this.node.on("fapai_2",function(data){
            self.fapai_2(data.data);
        }),

        //开牌
        this.node.on("kaipai",function(data){
            self.kaipai(data.data);
        }),

        //结算
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

        //抢庄
        this.node.on("qiangzhuang",function(data){
            self.qiangzhuang(data.data);
        }),

        //翻牌
        this.node.on("fanpai",function(data){
            if(data.pubPoker != null){
                self.pubPoker(data.pubPoker);
            }
                self.fanpai(data.data);
         
    
            
        }),
        
        //恢复桌面
        this.node.on('stage',function(data){
            self.stage(data.data);
        })
    },

    
    initEventAniamtion:function(){
        //开始游戏动画结束回调事件
        this.animation.on('finished', function(){
            if(this.node){
                var data = this.fapai1Data;
                this.fapai_1(data);
            }
        }, this);
    },

    //按钮操作
    onBtnClicked:function(event,data){
        var self = this;
        switch(event.target.name){
            case "btn_buqiang":{
                self.nodezhuang.active = false;
                cc.vv.net2.quick("buqiangzhuang");
            }
            break;
            case "btn_qiangzhuang":{
                cc.vv.net2.quick("qiangzhuang",{power:1});
            }
            break;
            case "btn_xiazhu":{
                var power = parseInt(data);
                cc.vv.net2.quick("xiazhu",{power:power,tuizhu:0});
            }
            break;
            case "btn_xiazhu_1":{
                cc.vv.net2.quick("xiazhu",{power:this.tuizhu_1_str,tuizhu:1});
            }
            break;
            case "btn_xiazhu_2":{
                cc.vv.net2.quick("xiazhu",{power:this.tuizhu_2_str,tuizhu:1});
            }
            break;
            case "btn_cuopai":{
                self.cuopaiClick();
            }
            break;
            case "btn_fanpai":{
                self.fanpaiClick();
            }
            break;
            case "btn_kaipai":{
                self.nodeCuopai.active = false;
                self.btncuopai.active = false;
                self.btnfanpai.active = false;
                self.btnKaipai.active = false;
                cc.vv.net2.quick("kaipai");
            }
            break;
           
        }
        cc.vv.audioMgr.click();
    },

    //新一局，重置桌面
    new_round(){
        var self=this;
        this.btnKaipai.active = false;
        this.nodezhuang.active = false;
        this.nodeXiazhu.active = false;
        this.nodeReport.active = false;
        this.nodeJiesuan.active = false;
        this.btncuopai.active = false;
        this.btnfanpai.active = false;
        this.NodeWaitclock.active = false;
        this.nodeCuopai.active = false;
        this.nodeCard.removeAllChildren();
        this.nodeCardone.removeAllChildren();
        this.node.getChildByName("mgr").getChildByName("gongpai").removeAllChildren();
        this.node_watchgame.active = false;
        
        this.NodeWaitclock.getChildByName("time").getComponent(cc.Label).string = 15;
        //是否已翻牌
        this.isFanPai = false;
        //是否已开牌
        this.isCuopai = false;
        //隐藏庄家图标
        if(this._zhuang_mode != 1){
            this.table.seat_emit(null,"dingzhuang",{seatid:null});
        }
        //是否开牌
        this._kaipai = [0,0,0,0,0,0,0,0,0,0];
        if(cc.vv.roomMgr.stage){
            cc.vv.roomMgr.stage.stage = null;
        }
    },

    //开始游戏
    begin:function(){
        this.sprTip.node.active = false;
        
        //播放开始游戏音效
        var mp3File = "nn/round";
        cc.vv.audioMgr.playSFX(mp3File);
        this.startAnimation.active = true;
        this.animation.play("niu_play");
    },

    //获取到游戏参数
    param:function(data){

        //1:扣1 2:扣人 3:全扣
        this._wanfa = data.wanfa;

        //0:每局选分 3,5,7,10固定分
        this._feng = data.feng;

        //庄家模式
        this._zhuang_mode = data.zhuang;

        //庄家位置
        this._zhuang = 0;

        // 0:抢庄 1:定庄 2:轮庄
        this.zhuang_mode = data.zhuang_mode;
    },

    //准备
    ready:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip("zhunbei");
            this.new_round();
            this.table.seat_emit(null,"hideBet");
        }
    },

    fapai_1:function(data){
        
        //刷新标题
        var self = this;
        // cc.vv.roomMgr.now = data.round;
        this.table._winHub.emit("round");

        //让座位到开局状态
        this.table.seat_emit(null,"round");

        //发牌
        this.deal_fapai(0,4,data,function(viewid,idx){
            //另外最后一张，不要翻
            if(viewid != 0 || idx != 3)return;
 
            //开始抢庄
            // self.kaiqiang();

        });
    },

    //第一轮发牌
    fapai_1_stage:function(data, isXiazhu){
        this.hidetip();
        //刷新标题
        var self = this;
        // cc.vv.roomMgr.now = data.round;
        this.table._winHub.emit("round");
        //让座位到开局状态
        this.table.seat_emit(null,"round");
        //下注区间  _xiaZhuRange

        //发牌
        this.show_fapai(0,4,data,isXiazhu,function(viewid,idx){

        });
    },
    //自动功能 倒计时 提示
    auto_tips:function(data,text){
        var auto_tips_node = this.node.getChildByName("mgr").getChildByName("auto_tips");
        if(data <= 0 || data == null){
            auto_tips_node.active = false;
            return;
        }
        this.text = text
        this.auto_time = data;
        this.unschedule(this.upd_auto_time);
        this.schedule(this.upd_auto_time,1);
        auto_tips_node.getComponent(cc.Label).string = this.auto_time + "秒后自动" + this.text;
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = true;
    },
    upd_auto_time:function(){
        var auto_tips_node = this.node.getChildByName("mgr").getChildByName("auto_tips");
        if(this.auto_time <= 0){
            this.unschedule(this.upd_auto_time);
            auto_tips_node.active = false;
        }
        this.auto_time--;
        auto_tips_node.getComponent(cc.Label).string = this.auto_time + "秒后自动" + this.text;
    },
    //开抢
    kaiqiang:function(data){
        if(!data){
            return;
        }
        this.hidetip();
        if(data != null){
            this.auto_tips(data.time,"不抢庄");
        }
        if(this.isStage){
            //已经抢过庄了
            var bet  = cc.vv.roomMgr.stage.bet[cc.vv.roomMgr.seatid];
            if(bet.qiang == 1)return;
        }
        switch(this.zhuang_mode){
            //抢庄
            case 0:{    
                this.nodezhuang.active = true;
            }
            break;
            //房主、霸王庄
            default:{    
                this.nodezhuang.active = false;
            }
            break;
        }
        var is_true = false;
        for(var i = 0;i < data.canSitId.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(data.canSitId[i]);
            if(viewid == 0){
                is_true = true;
            }
        }
        this.nodezhuang.getChildByName("btn_qiangzhuang").active = is_true;
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.nodezhuang.active = false;
        }
    },

    //显示下注
    show_xiazhu(){
        //已经下过注了
        if(this.isStage){
            var bet  = cc.vv.roomMgr.stage.bet[cc.vv.roomMgr.seatid];
            if(bet == null){
                return;
            }
            if(bet.bet != 0){
                // this.xiazhu({seatid:cc.vv.roomMgr.seatid,power:bet.bet});
                this.hidetip();
                return;
            }
        }
       
        
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.nodeXiazhu.active = false;
        }else{
            //如果是固定分，直接下注
            if(this._feng != 0){
                cc.vv.net2.quick("xiazhu",{power:this._feng});
                return;
            }else{
                this.tip("xiazhu");
            }
            this.nodeXiazhu.active = true;
            for(var i = 0; i < this.nodeXiazhu.childrenCount; i++){
                var node = this.nodeXiazhu.children[i];
                var button = node.getComponent(cc.Button);
                button.interactable = true;
                if(node.myTag > this._xiaZhuRange){
                    button.interactable = false;
                }
            }
        }
    },

    //下注
    xiazhu:function(data){

        var self = this;

        if(data.seatid == cc.vv.roomMgr.seatid){
            this.nodeXiazhu.active = false;
            this.node.getChildByName("mgr").getChildByName("tuizhu").active = false;
            this.hidetip();
        }

        //生成一个节点，把节点加到座位的bet节点
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node=new cc.Node('BetNode');
        const label = node.addComponent(cc.Label);
        label.font = this.btnAtlas;
        label.string = data.power;
        node.y = 6;
        self.table.seat_emit(viewid,"bet",{node:node});
    },

    //第二轮发牌
    fapai_2:function(data){
        //{"errcode":0,"data":{"round":1,"pai":[10,26,27,6,25],"max_round":10},"errmsg":"ok","model":"game","event":"fapai_2"}
        this.auto_tips(data.time,"开牌");
        this.hidetip();
        var gongpai = this.node.getChildByName("mgr").getChildByName("gongpai");
        var node = cc.instantiate(this.pokerPrefab);
        node.y = 100;
        node.scale = 1.1;
        var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.pokerAtlas,data.pubPoker);
        // if(data.pubPoker == 95){//大王
        //     spriteFrame = this.pokerAtlas.getSpriteFrame("A3");
        // }else if(data.pubPoker == 79){
        //     spriteFrame =  this.pokerAtlas.getSpriteFrame("A2");
        // }
        node.getChildByName("card").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        gongpai.addChild(node);
        
        this.data = data
        //this.NodeWaitclock.active = true;
        this.schedule(this.otherTimeUpdate,1);
        if(cc.vv.roomMgr.is_replay != true){
            if(this._wanfa != 3){
                this.btncuopai.active = true;
                this.btnfanpai.active = true;
            }else{
                this.btncuopai.active = false;
                this.btnfanpai.active = true;
            }
            var is_watch_game = this.watch_game();
            if(is_watch_game == true){
                this.btncuopai.active = false;
                this.btnfanpai.active = false;
            }
        }else{
            this.btncuopai.active = false;
            this.btnfanpai.active = false;
        }
    },
    watch_game:function(){
        var is_watch_game = false;
        var table_list = cc.vv.roomMgr.table.list; 
        if(!cc.vv.roomMgr.is_replay){
            var watch_list = cc.vv.roomMgr.guanzhan_table.list;
            for(var i = 0;i < watch_list.length;i++){
                if(watch_list[i].userid != 0){
                    if(watch_list[i].userid == cc.vv.userMgr.userid){
                        is_watch_game = true;
                    }
                }
            }
        }
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                if(!(table_list[i].sitStatus == 0)){
                    var is_viewid = cc.vv.roomMgr.viewChairID(table_list[i].seatid);
                    if(is_viewid == 0){
                        is_watch_game = true;
                    }
                }
            }
        }
        return is_watch_game;
    },
    //定庄
    dingzhuang:function(data){
        
          
        var self = this;
        this.auto_tips(data.time,"下注最小注");
        this._zhuang = data.seatid;
        this._xiaZhuRange = data.xiaZhuRange;
        this.nodezhuang.active = false;
        var is_watch_game = this.watch_game();
        var callback = function(){
            var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
            self.table.seat_emit(null,"dingzhuang",{seatid:viewid});
            if(cc.vv.roomMgr.is_replay != true){
                    //自己不是庄家
                if(cc.vv.roomMgr.seatid != data.seatid){
                    if(is_watch_game != true){
                        self.show_xiazhu();
                    }
                }else{
                    self.tip("otherxiazhu");
                }
            }
            
        }
        
        this.table.dingzhuang(data,callback);
    },

    //翻牌完成后的动作，显示牌形
    kaipai_callback:function(obj,viewid,idx,type,rate,pai){

        if(idx != 3)return;

        var self = obj;

        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];

        //牌的位置
        var card_pos = pos[viewid].pos.card;
        //牌型向右偏移
        var toright = pos[viewid].toright;
        var scale = pos[viewid].scale;
        var nodebg = new cc.Node('TypeBg'); 
        var node = new cc.Node('TypeNode');  
        var nodebei = new cc.Node('Typebei');  
        if(type >= 200){
            //更换图片
            nodebg.addComponent(cc.Sprite).spriteFrame = self.typeAtlas.getSpriteFrame("btn_bg3");   
        }else if(type%10 == 5){
            nodebg.addComponent(cc.Sprite).spriteFrame = self.typeAtlas.getSpriteFrame("btn_bg2");
        }else if(type%10 == 0){
            nodebg.addComponent(cc.Sprite).spriteFrame = self.typeAtlas.getSpriteFrame("btn_bg1");
        }else{
            nodebg.addComponent(cc.Sprite).spriteFrame = self.typeAtlas.getSpriteFrame("btn_bg1");
        }
        var url =  "nn_" + type;
        node.addComponent(cc.Sprite).spriteFrame = self.typeAtlas.getSpriteFrame(url);
        
        var urlbei = "x" + rate;
        // var urlbei =  "x1";
        nodebei.addComponent(cc.Sprite).spriteFrame = self.typeAtlas.getSpriteFrame(urlbei);

        nodebg.addChild(node);
        nodebg.addChild(nodebei);
        nodebei.y = -40;
        self.nodeCard.addChild(nodebg);
        nodebg.zIndex = 100;
        nodebg.scale = scale;
        nodebg.x = card_pos.x + toright;
        nodebg.y = card_pos.y - 20;

        if(pai != null){
            var arrTop = [];
            var isYidong = false;
            if(type != null && type >= 150)
            {
                isYidong = false;
            }else if(type != null &&type%10 == 5){
                arrTop = self.isHaveZuo(pai); 
                isYidong = true;
            }else if(type != null && type%10 == 0){
                arrTop = self.isHaveNiu(pai);
                isYidong = true;
            }else{
                isYidong = false;
            } 
            isYidong = false;
            for (var i = 0; i < 5; ++i) {
                if(isYidong == true && self.isInArray(arrTop, i)){
                    self.send_card_emit(viewid,i,"top");
                }
            }
        }
    },

    //开牌
    kaipai:function(data){
  
        var self = this;
        //已经开过牌
        if(this._kaipai[data.seatid] == 1)return;
        this._kaipai[data.seatid] = 1;
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        // if(viewid == 0){
        //     this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
        // }
        //音效
        this.play_nn_mp3(data.seatid,data.type);

        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip("kaipai");
            this.btnKaipai.active = false;
            this.btncuopai.active = false;
            this.btnfanpai.active = false;
            this.NodeWaitclock.active = false;
            this.unschedule(this.otherTimeUpdate);
        }
        //显示角标
        this.show_jiaobiao(viewid);

        //如果时自己
        if(viewid == 0){
            // //翻转自身牌
            for (var i = 0; i < 5; ++i) {
                var info = {
                    obj:self,
                    viewid:viewid,
                    index:i,
                    value:data.pai[i],
                    type:data.type,
                    atlas:self.pokerAtlas,
                    rate:data.rate}

                self.send_card_emit(viewid,i,"kaipai",info);
            }
            var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
            for (var i = 0; i < 5; ++i) {
                var info = {
                    obj:self,
                    viewid:viewid,
                    index:i,
                    type:data.type,
                    rate:data.rate,
                    x:card_pos.x + i * card_pos.distance,
                    y:card_pos.y,
                    scale:card_pos.scale,
                    pai:data.pai,
                    callback:this.kaipai_callback
                }
                self.send_card_emit(viewid,i,"shousuo",info);
            }
        }else{
            // //翻转自身牌
            for (var i = 0; i < 5; ++i) {
                var info = {
                    obj:self,
                    viewid:viewid,
                    index:i,
                    value:data.pai[i],
                    type:data.type,
                    atlas:self.pokerAtlas,
                    rate:data.rate,
                    pai:data.pai,
                    callback:this.kaipai_callback}

                self.send_card_emit(viewid,i,"trun",info);
            }
        }
    },
    //观战的人进入游戏 刷新table
    user_status_change:function(data){
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid == 0){
                continue;
            }
            if(data.change_item[i] == 1){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(viewid == 0){
                    this._my_isin_game = true;
                }
            }
            table_list[i].sitStatus = data.change_item[i];
        } 
    },
    new_real:function(){
        var table_list = cc.vv.roomMgr.table.list;
        var halfwayInGame_realCount = 0;//中途进入房间的人数
        var ingamecount = 0;
        var palygame_ren;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                ingamecount++;
            }
            var viewid = cc.vv.roomMgr.getSeatIndexByID(table_list[i].userid);
            if(!(table_list[i].sitStatus == 0)){
                halfwayInGame_realCount++;
            }else{
                if(viewid == 0){
                    this._my_isin_game = false;
                }
            }
        }
        palygame_ren = ingamecount - halfwayInGame_realCount
        return  palygame_ren ;
    },
    auto_ready:function(){
        this.autoready--;
        this.nodeJiesuan.getChildByName("btn_ready").getChildByName("lbl").getComponent(cc.Label).string = this.autoready;
        if(this.autoready <= 0){
            this.autoready = 0;
            this.unschedule(this.auto_ready);
        }
    },
    //结算_小结算
    jiesuan:function(data){
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
        this.autoready = 10;
        this.schedule(this.auto_ready,1);

        var self = this;
        this.hidetip();

        this.nodeCuopai.active = false;

        this.btnKaipai.active = false;
        this.btncuopai.active = false;
        this.btnfanpai.active = false;
        var table_list = cc.vv.roomMgr.table.list;
      
        if(cc.vv.roomMgr.stage == null || (cc.vv.roomMgr.stage != null && cc.vv.roomMgr.stage.stage != 97)){
            //所有人开牌
            for(var i=0;i< cc.vv.roomMgr.ren ;++i){
                if(!(table_list[i].sitStatus == 0)){
                    continue;
                }
                var viewid = cc.vv.roomMgr.viewChairID(i)
                if(this._kaipai[data.list[i].seatid] != 1){
                    self.show_jiaobiao(viewid);
                    //如果时自己
                    if(data.list[i].seatid == cc.vv.roomMgr.seatid){
                        // //翻转自身牌
                        var j_idx = -1;
                        for (var j = 0; j < 5; ++j) {
                            if(data.list[i].hand[j] == this.pubPoker_val){
                                continue;
                            }
                            j_idx++;
                            var info = {
                                obj:this,
                                viewid:viewid,
                                index:j_idx,
                                value:data.list[i].hand[j_idx],
                                rate:data.list[i].rate,
                                type:data.list[i].type,
                                atlas:this.pokerAtlas,
                            }
                            self.send_card_emit(viewid,j_idx,"kaipai",info);
                        }
                        var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
                        //是否已经
                        j_idx = -1;
                        for (var j = 0; j < 5; ++j) {
                            j_idx++;
                            var info = {
                                obj:self,
                                viewid:viewid,
                                index:j_idx,
                                type:data.list[i].type,
                                rate:data.list[i].rate,
                                x:card_pos.x + j_idx * card_pos.distance,
                                y:card_pos.y,
                                scale:card_pos.scale,
                                pai:data.list[i].hand,
                                callback:this.kaipai_callback
                            }
                            self.send_card_emit(viewid,j_idx,"shousuo",info);
                        }
                    }else{
               
                        for(var j = 0;j <5;j++){
                            if(data.list[i].hand[j] == data.pubPoker && j != 4){
                                var a = data.list[i].hand[4];
                                data.list[i].hand[4] = data.list[i].hand[j];
                                data.list[i].hand[j] = a;
                            }
                        }
                 
                        // //翻转自身牌
                        for (var j = 0; j < 4; ++j) {
                            var info = {
                                obj:self,
                                viewid:viewid,
                                index:j,
                                value:data.list[i].hand[j],
                                type:data.list[i].type,
                                rate:data.list[i].rate,
                                atlas:self.pokerAtlas,
                                pai:data.list[i].hand,
                                callback:this.kaipai_callback
                            }

                            self.send_card_emit(viewid,j,"trun",info);
                        }
                    }
                    this.play_nn_mp3(i,data.list[i].type);
                }
            }
        }else{
            //所有人开牌
            for(var i=0;i< table_list.length ;++i){
                if(table_list[i].userid == 0){
                    continue
                }
                var viewid = cc.vv.roomMgr.viewChairID(i);
                //如果时自己
                if(viewid == 0){
                    if(!(table_list[i].sitStatus == 0)){
                        continue;
                    }
                    // //翻转自身牌
                    var fapaidata = data.list[i].hand;
                    var isXiazhu = false;
                    //发牌
                    this.show_fapai_stage(viewid,0,4,fapaidata,isXiazhu,function(viewid,idx){

                    });
                    var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
                    //是否已经
                    for (var j = 0; j < 4; ++j) {
                        var info = {
                            obj:self,
                            viewid:viewid,
                            index:j,
                            type:data.list[i].type,
                            rate:data.list[i].rate,
                            x:card_pos.x + j * card_pos.distance,
                            y:card_pos.y,
                            scale:card_pos.scale,
                            pai:data.list[i].hand,
                            callback:this.kaipai_callback
                        }
                        self.send_card_emit(viewid,j,"shousuo",info);
                    }
                }else{
                    var fapaidata = data.list[i].hand;
                    var isXiazhu = false;
                    //发牌
                    this.show_fapai_stage(viewid,0,4,fapaidata,isXiazhu,function(viewid,idx){
                        if(idx != 3)return;
                        //是否已经
                        self.kaipai_callback(self,viewid,idx,data.list[i].type,data.list[i].rate,data.list[i].hand);
                    });
                }
            }
        }
        var jiesuan_count = 0;
        for(var i = 0 ;i < data.list.length;i++){
            if(data.list[i].userid != 0){
                jiesuan_count++;
            }
        }
        var jiesuan_userlist = [];
        var table_list = cc.vv.roomMgr.table.list;
        var idx = 0;
        for(var j = 0;j < table_list.length;j++){
            if(table_list[j].userid != 0){
                if(!(table_list[j].sitStatus == 0)){
                    jiesuan_userlist[idx++] = table_list[j];
                }
            }
        }

        //所有人结算
        for(var i=0;i< jiesuan_count ;++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            if(data.list[i].userSitStatus == 0){
                self.table.seat_emit(viewid,"score",data.list[i].user_score);
            }
            if(data.list[i].round_score > 0){
                self.table.seat_emit(viewid,"win",data.list[i].round_score);
            }else{
                self.table.seat_emit(viewid,"lost",data.list[i].round_score);
            }
        }

        //隐藏所有结点
        var list = this.nodeJiesuan.getChildByName("list");
        for(var i = 0; i < list.children.length; ++i){
            list.children[i].active = false;
        }

           
       
        var selfSeatid = -1;
        var isTrue = true;
        var selfLast = 0;
        var new_jiesuan_list = [];
        
        for(var i  =0,j=0;i < data.list.length;++i){
            if(data.list[i].userid != 0){
                new_jiesuan_list[j++] = data.list[i];
            }  
        }
        data.list = new_jiesuan_list;
        jiesuan_count =  data.list.length;

        //所有人结算
        for(var i=0;i< jiesuan_count ;++i){
            if(data.list[i].userid == 0){
                continue;
            }
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid != 0 && isTrue == true){
                selfSeatid = i;
                continue;
            }else{
                isTrue = false;
                selfLast++;
                var name = data.list[i].nickname;
                var headimg = this.table.seat_img(viewid);
                
                var item = list.getChildByName("item" + (i - (selfSeatid + 1)));
                item.active = true;
                item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
                item.getChildByName("name").getComponent(cc.Label).string = name;
                var url =  "nn_" + data.list[i].type;
                item.getChildByName("niutype").getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame(url);
                item.getChildByName('zhuang').active = i==data.zhuang;
                //根据正负显示字体
                var score = item.getChildByName("score").getComponent(cc.Label);
                if(data.list[i].round_score > 0){
                    score.font = self.winFont;
                    score.string = "+" + cc.vv.utils.numInt(data.list[i].round_score);
                }else if(data.list[i].round_score < 0){
                    score.font = self.lostFont;
                    score.string = cc.vv.utils.numInt(data.list[i].round_score);
                }else{
                    score.font = self.winFont;
                    score.string = cc.vv.utils.numInt(data.list[i].round_score);
                }
                if(data.list[i].userSitStatus == 1){
                    item.getChildByName("watch").active = true;
                    score.string = "-";
                }else{
                    item.getChildByName("watch").active = false;
                }
            }
        }
        var pos_idx = -1;
        for(var i=0;i< jiesuan_count ;++i){
            if(data.list[i].userSitStatus != 0){
                continue;
            }else{
                pos_idx++;

            }
        }
        for(var i=0;i< selfSeatid + 1;++i){
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            var name = data.list[i].nickname;
                var headimg = this.table.seat_img(viewid);
                
                var item = list.getChildByName("item" + (i + selfLast));
                item.active = true;
                item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
                item.getChildByName("name").getComponent(cc.Label).string = name;
                var url =  "nn_" + data.list[i].type;
                item.getChildByName("niutype").getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame(url);;
                //根据正负显示字体
                var score = item.getChildByName("score").getComponent(cc.Label);
                if(data.list[i].round_score > 0){
                    score.font = self.winFont;
                    score.string = "+" + cc.vv.utils.numInt(data.list[i].round_score);
                }else if(data.list[i].round_score < 0){
                    score.font = self.lostFont;
                    score.string = cc.vv.utils.numInt(data.list[i].round_score);
                }else{
                    score.font = self.winFont;
                    score.string = cc.vv.utils.numInt(data.list[i].round_score);
                }
                if(data.list[i].userSitStatus == 1){
                    item.getChildByName("watch").active = true;
                    score.string = "-";
                }else{
                    item.getChildByName("watch").active = false;
                }
                item.getChildByName('zhuang').active = i==data.zhuang;
        }

        //变化小结果标题
        // cc.loader.loadRes("public/table/jiesuan",cc.SpriteAtlas,function( error, atlas ){
        //     self.nodeJiesuan.getChildByName('title').getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(title);
        // });

        var mp3File = "nn/chips";
        cc.vv.audioMgr.playSFX(mp3File);
        
        var nodetitle = self.nodeJiesuan.getChildByName('title').getComponent(cc.Sprite);
        var nodeNameleft = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_player_text_left").getComponent(cc.Sprite);
        var nodeNameright = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_player_text_right").getComponent(cc.Sprite);
        var nodefenleft = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_socre_text_left").getComponent(cc.Sprite);
        var nodefenright = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_socre_text_right").getComponent(cc.Sprite);

        function setjiesuanTitle(title){
            if(title == 1){
                //胜利
                nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("shengli");

                nodeNameleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
                nodeNameright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
                nodefenleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
                nodefenright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
            }else{
                //失败
                nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("shibai");
                
                nodeNameleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("hui_wanjia");
                nodeNameright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("hui_wanjia");
                nodefenleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("hui_jifen");
                nodefenright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("hui_jifen");
            }
        }

        for(var i=0;i< jiesuan_count ;i++)
        {
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid == 0){
                if(data.list[i].round_score < 0){
                    setTimeout(() => {
                        cc.vv.audioMgr.playSFX("ddz/game_lose");
                    }, 2000,self);
                    setjiesuanTitle(0);
                }else{
                    setTimeout(() => {
                        cc.vv.audioMgr.playSFX("ddz/game_win");
                    }, 2000,self);
                    setjiesuanTitle(1);
                }
            }
        }
        var is_watch_game = this.watch_game();
        if(is_watch_game == true){
            nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("guanzhan");
            nodeNameleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
            nodeNameright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
            nodefenleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
            nodefenright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
        }
        function settimefunction(){
            self.nodeJiesuan.active = true;
        }

        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var moneyCount = 10;//金币数量
        //小结算
        if(cc.vv.roomMgr.is_replay){
            setTimeout(() => {
                settimefunction();
            }, 5000);
        }else{
            setTimeout(() => {
                settimefunction();
            }, 2000);
        }
        for(var i=0;i < jiesuan_count;i++)
        {
            var callback = cc.callFunc(function() {
 
            });

            if(data.list[i].seatid == this._zhuang){
                continue;
            }
            if(data.list[i].round_score < 0)
            {
                var v_from_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                var v_to_seat = cc.vv.roomMgr.viewChairID(this._zhuang);
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, callback);
            }else if(data.list[i].round_score > 0){
                var v_from_seat = cc.vv.roomMgr.viewChairID(this._zhuang);
                var v_to_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, callback);
            }
        }
        //隐藏回放的准备确定按钮
        if(cc.vv.roomMgr.is_replay){
            var btn_ready = cc.find("Canvas/report/jiesuan/btn_ready");
            btn_ready.active = false;
        }
    },

    //大结算
    report:function(data){
        var self = this;

        this.nodeCuopai.active = false;

        this.nodeReport.active = true;
        this.nodeJiesuan.active = false;
        var otherScore = this.nodeReport.getChildByName("otherScore");
        otherScore.getComponent(cc.Label).string = "其他:"+data.otherScore;
        this.labelRoomwanfa.string = "玩法：" + data.desc;
        var hasJoinedBattle = 0;//没有参战的人数
        for(var i = 0;i < data.list.length ;i++){
            if(data.list[i].hasJoinedBattle == false){
                hasJoinedBattle++;
            }
        }

        var realPeople = 0;
        //所有人结算
        for(var i=0;i< data.list.length ;++i){
            if(data.list[i].userid > 0){
                realPeople++;
            }
        }

        //隐藏解散房间
        this.table.hide_dismiss_room();
        var list;
        if (realPeople - hasJoinedBattle <= 5){
            list = this.nodeReport.getChildByName("list1");
        }else{
            list = this.nodeReport.getChildByName("list2");
        }
        list.removeAllChildren();
        //房间号、日期
        this.nodeReport.getChildByName("roomid").getComponent(cc.Label).string = data.roomid;
        this.nodeReport.getChildByName("time").getComponent(cc.Label).string = data.time;
        if(cc.vv.popMgr.get_open("Pwb_tips")){
            cc.vv.popMgr.del_open("Pwb_tips");//结算删除胜点不足控件 
        }
        var max_score = 0;
        for(var i=0;i< data.list.length ;++i){
            if(data.list[i].result_score > max_score){
                max_score = data.list[i].result_score;
            }
        }

        var min_score = 0;
        var min_seat = -1;
        for(var i=0;i< data.list.length ;++i){
            if(data.list[i].result_score < min_score){
                min_score = data.list[i].result_score;
                min_seat = i;
            }
        }
        
        //realPeople = cc.vv.roomMgr.ren;
        for(var i=0;i< realPeople ;++i){
            if(data.list[i].userid == 0){
                continue;
            }
            if(data.list[i].hasJoinedBattle == true){
                var viewid = cc.vv.roomMgr.viewChairID(i);

                var info = {
                    name:data.list[i].name,
                    userid:data.list[i].userid,
                    headimg:data.list[i].headimg,
                    score:data.list[i].result_score,
                    dayingjia:data.list[i].result_score == data.list[0].result_score && data.list[0].result_score != 0,
                    datuhao:data.list[i].result_score == min_score,
                }
                // if(max_score == 0){
                //     info.dayingjia = false;
                // }
                info.datuhao = false;
                var item;
                if(realPeople - hasJoinedBattle <=5)
                {
                    item= cc.instantiate(this.reportItemPrefab);
                }else{
                    item= cc.instantiate(this.reportItemMinPrefab);
                } 
                   // item.scale = 1.1;
                list.addChild(item);
                item.emit("info",info);
                
                if(viewid == 0){
                    this.labelScore.string = "+" + data.list[i].coins;
                }
            }
        }
    },

    //有人抢庄
    qiangzhuang:function(data){
        //如果是自己抢，关闭抢庄
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.nodezhuang.active = false;
        }

        //抢庄的人，显示抢字
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        this.table.seat_emit(viewid,"qiangzhuang");
    },
    //有人抢庄
    pubPoker:function(data){
        var gongpai = this.node.getChildByName("mgr").getChildByName("gongpai");
        var node = cc.instantiate(this.pokerPrefab);
        node.y = 100;
        node.scale = 1.1;
        var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.pokerAtlas,data);
        // if(data.pubPoker == 95){//大王
        //     spriteFrame = data.atlas.getSpriteFrame("A3");
        // }else if(data.pubPoker == 79){
        //     spriteFrame =  data.atlas.getSpriteFrame("A2");
        // }
        this.pubPoker_val = data.pubPoker;
        node.getChildByName("card").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        gongpai.addChild(node);
    },
    //恢复桌面
    stage:function(data){
          
        if(data.ready == null){
            return;
        }
        /**
         * 自有的游戏阶段
         */
        // public static final int STAGE_FAPAI_1 = 1;
        // public static final int STAGE_QIANGZHUANG = 2;
        // public static final int STAGE_XIAZHU = 3;
        // public static final int STAGE_FAPAI_2 = 4;

        // if (data.stage != 0) {
        //     this.table.begin(data);
        // }
        this.new_round();
        this.watch_game_list();
        cc.vv.roomMgr.stage = data;
        
        if(cc.vv.roomMgr.stage){
            this.isStage = true;
        }

        if(data){
            cc.vv.roomMgr.started = 1;
            cc.vv.roomMgr.real = data.real;
            cc.vv.roomMgr.now = data.round;
            this.node.getChildByName("mgr").getChildByName("hud").emit("round");
        }

        this.table._winReady.emit("begin");
        // //让座位到开局状态
        this.table._winHub.emit("begin");
        
        switch(data.stage){
            case 1:
            case 2:{
                this.auto_tips(data.deal_time,"不抢庄");
                var wamfa = cc.vv.roomMgr.param.wanfa;
                var cards = data.cards;
                if(wamfa == 1){
                    cards[3] = 0; 
                }else if(wamfa == 2){ 
                    cards[2] = 0;
                    cards[3] = 0;
                }else if(wamfa == 3){
                    cards[0] = 0;
                    cards[1] = 0; 
                    cards[2] = 0;
                    cards[3] = 0;
                }
                this.fapai_1_stage({pai:cards});
                this.fapai1Data = data;
                if(data.isqiangzhuang == 0 && data.stage == 2){
                    this.kaiqiang();
                }
            }
            break;
            case 3:{
                this._xiaZhuRange = data.xiaZhuRange;
                if(data.tuizhuArr.length != 0){
                    this.tuizhu({tuizhu:data.tuizhuArr,xiaZhuRange:data.xiaZhuRange});
                }
                this.auto_tips(data.deal_time,"下注最小注");
                //"errcode":0,"data":{"bet":[{"bet":0,"qiang":1},{"bet":7,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0},{"bet":0,"qiang":0}],"cards":[4,5,21,23,0],"stage":3,"round":1,"ready":1,"now":1,"deal_time":0,"power":1,"real":3,"zhuang":0,"xiazhu":[0,7,0,0,0,0,0,0,0,0]},"errmsg":"ok","model":"game","event":"stage"}
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.fapai_1_stage({pai:data.cards});
                this.fapai1Data = data;
                var bet = data.bet;
                for (var index = 0; index < bet.length; index++) {
                    if(bet[index].bet != 0){
                        this.xiazhu({seatid:index,power:bet[index].bet});
                    }
                }
                if(cc.vv.roomMgr.seatid != data.zhuang){
                    this.tip("xiazhu");
                    this.show_xiazhu();
                }else{
                    this.tip("otherxiazhu");
                }
            }
            break;
            case 4:{
                this.auto_tips(data.deal_time,"开牌");
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                var datacopy = cc.vv.utils.deepCopy(data);
                var cards = datacopy.cards;
                this.data = data;
                this.data.pai = data.cards;
                if(data.iskaipai == 0)
                {
                    var wamfa = cc.vv.roomMgr.param.wanfa;
                    if(wamfa == 1){
                        cards[3] = 0;
                    }else if(wamfa == 2){
                        cards[2] = 0;
                        cards[3] = 0;
                    }else if(wamfa == 3){
                        cards[0] = 0;
                        cards[1] = 0;
                        cards[2] = 0;
                        cards[3] = 0;
                    }
                }
                this.pubPoker(data.pubPoker);
                this.fapai_1_stage({pai:cards});
                var bet = data.bet;
                for (var index = 0; index < bet.length; index++) {
                    if(bet[index].bet != 0){
                        this.xiazhu({seatid:index,power:bet[index].bet});
                    }
                }
                if(cc.vv.roomMgr.is_replay != true){
                    if(this._wanfa == 3){
                        if(data.iskaipai == 0)
                        {
                            this.btnKaipai.active = false;
                            this.btnfanpai.active = true;
                            this.btncuopai.active = false;
                        }else{
                            this.btnKaipai.active = false;
                            this.btnfanpai.active = false;
                            this.btncuopai.active = false;
                            var data = {"rate":data.rate,"pai":data.cards,"seatid":cc.vv.roomMgr.seatid,"type":data.type}
                            this.kaipai(data);
                        }
                    }else{
                        if(data.iskaipai == 0)
                        {
                            this.btnKaipai.active = false;
                            this.btnfanpai.active = true;
                            this.btncuopai.active = true;
                        }else{
                            this.btnKaipai.active = false;
                            this.btnfanpai.active = false;
                            this.btncuopai.active = false;
                            var data = {"rate":data.rate,"pai":data.cards,"seatid":cc.vv.roomMgr.seatid,"type":data.type}
                            this.kaipai(data);
                        }
                    } 
                    var is_watch_game = this.watch_game();
                    if(is_watch_game){
                        this.btnKaipai.active = false;
                        this.btnfanpai.active = false;
                        this.btncuopai.active = false;
                    }
                }else{
                    this.btnKaipai.active = false;
                    this.btncuopai.active = false;
                    this.btnfanpai.active = false;
                }
            }
            break;
            case 97:{
                if(data.ready == 1){
                    this.node.getChildByName("watchgame").active = false;
                }
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                // for(var i=0;i<cc.vv.roomMgr.real;i++){
                //     var seat = cc.vv.roomMgr.table.list[i];
                //     var status = seat.status;
                //     var viewid = cc.vv.roomMgr.viewChairID(seat.seatid);
                //     var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
                //     if (node == null) continue;

                //     node.getComponent("Seat").ready(status == 1);
                // }
            }
            break;
        }
        this.isStage = false;
        if(cc.vv.roomMgr.stage){
            cc.vv.roomMgr.stage.stage = null;
        }
    },

    //发牌动画
    deal_fapai:function(begin,end,kaipaidata,callback){

        var self = this;
        var list = kaipaidata.pai;
        if(list == null)return; 
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];

        var pailist = [];
        //发牌数组(数值为0)
        var fapailist = [];
        var datalist = [];
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        playuser_count = cc.vv.roomMgr.ren;
        for(var i=0;i< playuser_count ;++i){

            //显示位置
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var value = 0;
           
            //牌的位置
            var card_pos = pos[viewid].pos.card;
            var scale = pos[viewid].scale;

            for(var k= begin ;k< end ;k++){
                if(!(table_list[i].sitStatus == 0)){
                    continue;
                }
                if(viewid == 0){
                    value = list[k];
                }
                
                var data = {
                    obj:self,
                    viewid:viewid,
                    index:k,
                    time:k,
                    atlas:self.pokerAtlas,
                    value:value,
                    x:card_pos.x + k * pos[viewid].distance,
                    y:card_pos.y,
                    scale:card_pos.scale,
                    callback:callback,
                }

                var fadata = {
                    obj:self,
                    viewid:viewid,
                    index:k,
                    time:k,
                    atlas:self.pokerAtlas,
                    value:value,
                    x:card_pos.x + k * pos[viewid].distance,
                    y:card_pos.y,
                    scale:card_pos.scale,
                    callback:callback,
                }
               
                //生成一张牌
                var node = cc.instantiate(this.pokerPrefab);
                
                var card = node.getComponent('NNPoker');
                card.node.scale = 0.8;
                fapailist.push(fadata);
                datalist.push(data);
                pailist.push(node);

                this.nodeCard.addChild(node);
                
                //重要，以此来区分是谁的第几张牌
                node.myTag = data.viewid + "_" + data.index;
            }
        }
        var length = datalist.length;

        var callback = function(viewid, idx){
            for (let index = 0; index < length; index++) {
                var node = pailist[index];
                node.zIndex = index;
            }
            //最后一张牌发完后，开牌
            if(viewid != 0 || idx != 3) return;

            for (let index = 0; index < length; index++) {
                var data = datalist[index];
                if(data.value != 0){
                    self.send_card_emit(data.viewid,data.index,"trun",data);
                }
            }
        }

        for (let index = 0; index < length; index++) {
            var node = pailist[index];
            
            node.zIndex = length - index;
            var fapai = fapailist[index];

            fapai.value = 0;
            if(cc.vv.roomMgr.ren == 5){
                fapai.time  = index;
            }
            fapai.callback = callback;
            // //初始化牌信息
            node.emit("fapai",fapai);
        }
    },

    
    //发牌(无动画)
    show_fapai:function(begin, end, kaipaidata, isXiazhu, callback){

        var self = this;
        var isStage = this.isStage;
        var list = kaipaidata.pai;
        if(list == null)return;
        //每个人的座位信息
        var playuser_count = 0;
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        playuser_count = cc.vv.roomMgr.ren;
        for(var i=0;i< playuser_count;++i){

            //显示位置
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var value = 0;
           
            //牌的位置
            var card_pos = pos[viewid].pos.card;
            var scale = pos[viewid].scale;

            for(var k= begin ;k< end ;k++){
                if(!(table_list[i].sitStatus == 0)){
                    continue;
                }
                if(viewid == 0){
                    value = list[k];
                }
                
                var data = {
                    obj:self,
                    viewid:viewid,
                    index:k,
                    time:k,
                    atlas:self.pokerAtlas,
                    value:value,
                    x:card_pos.x + k * pos[viewid].distance,
                    y:card_pos.y,
                    scale:card_pos.scale,
                    callback:callback,
                }
                //生成一张牌
                var node = cc.instantiate(this.pokerPrefab);
                
                var card = node.getComponent('NNPoker');

                this.nodeCard.addChild(node);
                
                //重要，以此来区分是谁的第几张牌
                node.myTag = data.viewid + "_" + data.index;
                node.emit("show",data);
            }
        }

        if(isXiazhu){
            if(cc.vv.roomMgr.is_replay != true){
                    //自己不是庄家
                if(cc.vv.roomMgr.seatid != self._zhuang){
                    self.show_xiazhu(isStage);
                }else{
                    self.tip("otherxiazhu");
                }
            }
        }
    },

    //发牌动画
    show_fapai_stage:function(viewid, begin, end, kaipaidata, isXiazhu, callback){
        var self = this;
        //牌的位置
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var card_pos = pos[viewid].pos.card;
        var scale = pos[viewid].scale;
        for(var k= begin ;k< end ;k++){
            var data = {
                obj:self,
                viewid:viewid,
                index:k,
                time:k,
                atlas:self.pokerAtlas,
                value:kaipaidata[k],
                x:card_pos.x + k * pos[viewid].distance,
                y:card_pos.y,
                scale:card_pos.scale,
                callback:callback,
            }
            //生成一张牌
            var node = cc.instantiate(this.pokerPrefab);
            
            var card = node.getComponent('NNPoker');

            this.nodeCard.addChild(node);
            
            //重要，以此来区分是谁的第几张牌
            node.myTag = data.viewid + "_" + data.index;
            node.emit("show",data);
        }
    },

    //切换提示
    tip:function(text){

        if(text == null){
            this.sprTip.node.active = false;
            return;
        }

        var self = this;

        var name = "tips_" + text;
        this.sprTip.spriteFrame = this.tipAtlas.getSpriteFrame(name);
        this.sprTip.node.active = true;
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.sprTip.node.active = false;
        }
    },

    hidetip:function(){
        this.sprTip.node.active = false;
    },

    //播放音效
    play_nn_mp3(setaid,type){

        var sex = cc.vv.roomMgr.table.list[setaid].sex;

        if(sex !='1' && sex!='2'){
            sex = '1';
        }

        var mp3File = "nn/" + sex + "/nn_" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },
    
    //给所有牌发消息
    send_card_emit:function(viewid,index,name,data){
        var myTag = viewid + "_" + index;
        var node = cc.vv.utils.getChildByTag(this.nodeCard,myTag);
        if(node){
            node.emit(name,data);
        }
    },

    //翻牌按钮事件
    fanpaiClick:function(){
        var self = this;
        if(this.isFanPai){
            return;
        }
        this.isFanPai = true;
        //翻完牌后，显示开牌按钮
        var callback = function(obj,viewid,idx,type){
            if(viewid != 0 || idx != 3)return;
            self.btncuopai.active = false;
            self.btnfanpai.active = false;
            self.btnKaipai.active = true;
        };

        //翻转自身牌
        for (var i = 0; i < 4; ++i) {

            var info = {
                viewid:0,
                obj:this,
                type:0,
                index:i,
                atlas:self.pokerAtlas,
                value:self.data.pai[i],
                rate:self.data.rate,
                callback:callback,
            }
            self.send_card_emit(0,i,"kaipai",info);
        }
    },

    fanpai: function(data,pubPoker){
          
        var self = this;
        //翻完牌后，显示开牌按钮
        var callback = function(obj,viewid,idx,type){
            self.show_jiaobiao(viewid);
        };
        //翻转自身牌
        for (var i = 0; i < 4; ++i) {

            var info = {
                viewid:0,
                obj:this,
                type:0,
                index:i,
                atlas:self.pokerAtlas,
                value:data.pai[i],
                // rate:data.rate,
                callback:callback,
            }
            self.send_card_emit(0,i,"kaipai",info);
        }
    },
    
    //搓牌按钮事件
    cuopaiClick:function(){
        //1:扣1 2:扣2 3:全扣
        if(this.isCuopai) 
        {
            return;
        }
        this.isCuopai = true;
        if(this._wanfa == 1){
            this.cuopaiOnePai();
        }else{
            this.cuopaiTwoPai();
        }
    },
    
    //搓牌(1张)
    cuopaiOnePai:function(){
        var self = this;
        
        this.nodeCuopai.active = true;
        this.btncuopai.active = false;
        this.btnfanpai.active = false;
        var pos = cc.vv.game.config["cuopai"];
        var viewid = 0;
        var value = 0;
        var callbackout = function(obj,viewid,idx,type){
            //翻完牌后，显示开牌按钮
            var callback = function(obj,viewid,idx,type){
                if(viewid != 0 || idx != 4)return;
                self.btncuopai.active = false;
                self.btnfanpai.active = false;
                self.btnKaipai.active = false;
            };
        }

        //横向位移
        var tox = 0;
        var toy = 0;
        var callbackdown = function(){

        }
        var datadown= {
            viewid:viewid,
            index:2,
            atlas:self.pokerAtlas,
            value:self.data.pai[3],
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbackdown,
        }
        //生成一张牌
        var carddown = cc.instantiate(this.pokerPrefab);
        this.nodeCardone.addChild(carddown);
        carddown.scale = 1;
        carddown.zIndex = 0;
        //初始化牌信息
        carddown.emit("fapai",datadown);

        var callback = function(){

        }
        var datatop = {
            viewid:viewid,
            index:1,
            atlas:self.pokerAtlas,
            value:value,
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callback,
        }
        //生成一张牌
        var cardtop = cc.instantiate(this.pokerPrefab);
        var carditem = cardtop.getChildByName("card");
        
        this.nodeCardone.addChild(cardtop);
        carditem.setPosition(0, 0)
        cardtop.scale = 1;
        cardtop.zIndex = 0;
        cardtop.getChildByName("card").setContentSize(cc.size(171, 218))
        //初始化牌信息
        cardtop.emit("fapai",datatop);

        carditem.on('touchmove',function(event){
            let delta = event.touch.getDelta();// cc.Vec2()
            let deltaX = delta.x / 2;
            let deltaY = delta.y / 2;
            tox += deltaX;
            toy += deltaY;
            carditem.setPosition(carditem.x + deltaX, carditem.y + deltaY);
        },this);
        carditem.on('touchend',function(event){
            var isEnd = (tox > 0 && cardtop.width / 5 < tox) || (tox < 0 && cardtop.width / 5 < -tox) ||(toy > 0 && cardtop.height / 5 < toy) || (toy < 0 && cardtop.height / 5 < -toy); 
            if(isEnd){
                carditem.off('touchmove');
                carditem.off('touchend');
                carditem.off('touchcancel');
                carditem.setPosition(0,0);
                cardtop.zIndex = -1;
                callbackout();
            }else{
                carditem.setPosition(0,0);
            }
            tox = 0;
            toy = 0;
        },this);
        carditem.on('touchcancel',function(event){
            var isEnd = (tox > 0 && cardtop.width / 5 < tox) || (tox < 0 && cardtop.width / 5 < -tox) ||(toy > 0 && cardtop.height / 5 < toy) || (toy < 0 && cardtop.height / 5 < -toy); 
            if(isEnd) {
                carditem.off('touchmove');
                carditem.off('touchend');
                carditem.off('touchcancel');
                carditem.setPosition(0,0);
                cardtop.zIndex = -1;
                callbackout();
            }else{
                carditem.setPosition(0,0);
            }
            tox = 0;
            toy = 0;
        },this);
    },

    //搓牌2张
    cuopaiTwoPai:function(){
        var self = this;

        this.nodeCuopai.active = true;
        this.btncuopai.active = false;
        this.btnfanpai.active = false;
        this.btnKaipai.active = false;
        var pos = cc.vv.game.config["cuopai"];
        var viewid = 0;
        var value = 0;

        var callbackout = function(obj,viewid,idx,type){
            //翻完牌后，显示开牌按钮
            var callback = function(obj,viewid,idx,type){
                if(viewid != 0 || idx != 3)return;
                self.btncuopai.active = false;
                self.btnfanpai.active = false;
                self.btnKaipai.active = true;
            };
        }

        //横向位移
        var tox = 0;
        var toy = 0;
        var callbackdown = function(){

        }

        var datadown= {
            viewid:viewid,
            index:2,
            atlas:self.pokerAtlas,
            value:self.data.pai[3],
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbackdown,
        }

        //生成一张牌
        var carddown = cc.instantiate(this.pokerPrefab);
        this.nodeCardone.addChild(carddown);
        carddown.scale = 1;

        //初始化牌信息
        carddown.emit("fapai",datadown);

        var callbackcenter = function(){

        }
        
        var datacenter = {
            viewid:viewid,
            index:2,
            atlas:self.pokerAtlas,
            value:self.data.pai[2],
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbackcenter,
        }
        
        //生成一张牌
        var cardcenter = cc.instantiate(this.pokerPrefab);
        var carditemcenter = cardcenter.getChildByName("card");
     
        this.nodeCardone.addChild(cardcenter);
        carditemcenter.setPosition(0,0)
        cardcenter.scale = 1;

        //初始化牌信息
        cardcenter.emit("fapai",datacenter);

        var callbacktop = function(){

        }
        var data = {
            viewid:viewid,
            index:1,
            atlas:self.pokerAtlas,
            value:value,
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbacktop,
        }
        //生成一张牌
        var cardtop = cc.instantiate(this.pokerPrefab);
        var carditem = cardtop.getChildByName("card");
     
        this.nodeCardone.addChild(cardtop);
        carditem.setPosition(0,0)
        cardtop.scale = 1;
        cardtop.getChildByName("card").setContentSize(cc.size(171, 218))
        //初始化牌信息
        cardtop.emit("fapai",data);

        function centerItem(){
            carditemcenter.on('touchmove',function(event){
                let delta = event.touch.getDelta();// cc.Vec2()
                let deltaX = delta.x / 2;
                let deltaY = delta.y / 2;
                tox += deltaX;
                toy += deltaY;
                carditemcenter.setPosition(carditemcenter.x + deltaX, carditemcenter.y + deltaY);
            },self);
            carditemcenter.on('touchend',function(event){
                var isEnd = (tox > 0 && cardcenter.width / 5 < tox) || (tox < 0 && cardcenter.width / 5 < -tox) ||(toy > 0 && cardcenter.height / 5 < toy) || (toy < 0 && cardcenter.height / 5 < -toy); 
                if(isEnd){
                    carditemcenter.off('touchmove');
                    carditemcenter.off('touchend');
                    carditemcenter.off('touchcancel');
                    carditemcenter.setPosition(0,0);
                    cardcenter.zIndex = -1;
                    callbackout();
                }else{
                    carditemcenter.setPosition(0,0);
                }
                tox = 0;
                toy = 0; 
            },self);
            carditemcenter.on('touchcancel',function(event){
                var isEnd = (tox > 0 && cardcenter.width / 5 < tox) || (tox < 0 && cardcenter.width / 5 < -tox) ||(toy > 0 && cardcenter.height / 5 < toy) || (toy < 0 && cardcenter.height / 5 < -toy);
                if(isEnd){
                    carditemcenter.off('touchmove');
                    carditemcenter.off('touchend');
                    carditemcenter.off('touchcancel');
                    carditemcenter.setPosition(0,0);
                    
                    cardcenter.zIndex = -1;
                    callbackout();
                }else{
                    carditemcenter.setPosition(0,0);
                }
                tox = 0;
                toy = 0;
            },self);
        }
        carditem.on('touchmove',function(event){
            let delta = event.touch.getDelta();// cc.Vec2()
            let deltaX = delta.x / 2;
            let deltaY = delta.y / 2;
            tox += deltaX;
            toy += deltaY;
            carditem.setPosition(carditem.x + deltaX, carditem.y + deltaY);
        },this);
        carditem.on('touchend',function(event){
            var isEnd = (tox > 0 && cardtop.width / 5 < tox) || (tox < 0 && cardtop.width / 5 < -tox) ||(toy > 0 && cardtop.height / 5 < toy) || (toy < 0 && cardtop.height / 5 < -toy); 
            if(isEnd){
                carditem.off('touchmove');
                carditem.off('touchend');
                carditem.off('touchcancel');
                carditem.setPosition(0,0);
                cardtop.zIndex = -1;
                centerItem();
            }else{
                carditem.setPosition(0,0);
            }
            tox = 0;
            toy = 0;
        },this);
        carditem.on('touchcancel',function(event){
            var isEnd = (tox > 0 && cardtop.width / 5 < tox) || (tox < 0 && cardtop.width / 5 < -tox) ||(toy > 0 && cardtop.height / 5 < toy) || (toy < 0 && cardtop.height / 5 < -toy); 
            if(isEnd){
                carditem.off('touchmove');
                carditem.off('touchend');
                carditem.off('touchcancel');
                carditem.setPosition(0,0);
                cardtop.zIndex = -1;
                centerItem();
            }else{
                carditem.setPosition(0,0);
            }
            tox = 0;
            toy = 0;
        },this);
    },

    //显示角标
    show_jiaobiao:function(viewid){
         //1:扣1 2:扣2 3:全扣
        if(this._wanfa == 1){
            //第五个个元素
            this.send_card_emit(viewid,4,"setType", 2);
        }else if(this._wanfa == 2){
            //第四个元素
            this.send_card_emit(viewid,3,"setType", 1);

            //第五个个元素
            this.send_card_emit(viewid,4,"setType", 2);
        }
    },

    //其他玩家倒计时
    otherTimeUpdate:function(){
        var time = this.NodeWaitclock.getChildByName("time").getComponent(cc.Label);
        var number = parseInt(time.string);
        number -= 1;
        time.string = number;
        if(number <= 0){
            this.NodeWaitclock.active = false;
            this.unschedule(this.otherTimeUpdate);
        }
    },

    //飞币
    playBetByXY:function(parent, fx, fy, tx, ty, count, callback){
        for (let index = 0; index < count; index++) {	
            var item = new cc.Node("getMoneyNode");
            const money = item.addComponent(cc.Sprite)
            money.spriteFrame= this.moneyGold.getSpriteFrame("common_fen_img");
            item.setPosition(((Math.random() - 0.5) * 2) * 70 + fx, fy + ((Math.random() - 0.5) * 2) * 70);

            var tpos = cc.v2(tx, ty);
            var taction = cc.moveTo(0.1 * index + 1,tpos);
            taction.easing(cc.easeQuinticActionOut());
            
            parent.addChild(item);
            if(index == count - 1){
                item.runAction(cc.sequence(taction, callback, cc.removeSelf()));
            }else{
                item.runAction(cc.sequence(taction, cc.removeSelf()));
            }
        }
        
    },
    //获取tan角度
    getVectorRadians(len_y, len_x)
    {
        let tan_yx = tan_yx = Math.abs(len_y)/Math.abs(len_x);
        let angle = 0;
        if(len_y > 0 && len_x < 0) {
            angle = Math.atan(tan_yx)*180/Math.PI - 90;
        } else if (len_y > 0 && len_x > 0) {
            angle = 90 - Math.atan(tan_yx)*180/Math.PI;
        } else if(len_y < 0 && len_x < 0) {
            angle = -Math.atan(tan_yx)*180/Math.PI - 90;
        } else if(len_y < 0 && len_x > 0) {
            angle = Math.atan(tan_yx)*180/Math.PI + 90;
        }
        return angle;
    },
    // int maxNiu(List<Integer> pg) {
    //     int cardsTotal = 0;
    //     int cow = -1;
    //         for(int i=0;i<pg.size();i++){
    //             cardsTotal +=getLogic(pg.get(i));
    //         }  
    //         for(int i=0;i<pg.size();i++ ){
    //                 if((cardsTotal-getLogic(pg.get(i)))%10==0){
    //                   int cow1 = getLogic(pg.get(i));
    //                   if(cow1 >= cow) {
    //                         cow = cow1; 
    //                   }
    //                 }  
    //         }  
    //         if(cow!=-1) {
    //              return CT_SPECIAL_NIUNIU;
    //         }else {
    //           int cow1 =-1;
    //             for(int i=0;i<pg.size();i++ ){
    //                 for(int j=0;j<pg.size();j++ ){
    //                   if(i==j){
    //                     continue;
    //                   }
    //                     int cow2 = getLogic(pg.get(i)) +getLogic(pg.get(j));
    //                     cow2 = cow2 %10;
    //                     if(cow2 == 0) {
    //                      cow1 = cow2; 
    //                     }else if(cow2 >= cow1&&cow1!=0) {
    //                        cow1 = cow2; 
    //                     }
    //                 }  
    //             } 
    //           return RetType(cow1);
    //         }
    //   }
    //判断是否有牛
    isHaveNiu : function (array) {
        var arr = [];
        var is_no_wang_10 = [];//没有王 的情况下的数组
        var is_no_wang_maxmin = -1;;
        var byTestPai=[0,0,0,0,0];
        var idx = 0;
        var card_list = [];
        var cow1 =-1;
        var card_i;
        var card_j;
        var card_lazi = [];
        var laizicount = 0;
        var max_card = [];
	    for (var i =0;i<5;i++){
	        if(array[i] < 255){
	            byTestPai[i] = array[i];
	        }
        }
        for(var i = 0;i < byTestPai.length;i++){
            if(byTestPai[i] == 95 || byTestPai[i] == 79){
                card_lazi[laizicount] = i;
                laizicount++;
            }else{
                card_list[idx++] = byTestPai[i] 
            }
        }
        if(laizicount == 1){
            cow1 = 11;
            var sum_card = 0;
            for(var i = 0;i < card_list.length;i++ ){
                var val = card_list[i] % 16;
                if(val > 10 ) val = 10;
                sum_card += val;
            }     
            for(var i = 0;i < card_list.length;i++ ){
                var val = card_list[i] % 16;
                if(val > 10 ) val = 10;
                if((sum_card - val) % 10 == 0 ){
                    var cow = val;
                    if(cow < cow1){
                        cow1 = cow;
                        is_no_wang_maxmin = cow1;
                        card_i = card_list[i] % 16;
                    }
                }
            } 
     
            if(cow1 != 11){
                for(var i = 0;i < byTestPai.length;i++ ){
                    if(byTestPai[i] == 95 || byTestPai[i] == 79){
                        continue;
                    }
                    if(card_i != (byTestPai[i] % 16)){
                        is_no_wang_10.push(i);
                    }
                }  
            }
            cow1 = -1;
            for(var i = 0; i < card_list.length;i++){
                for(var j = 0; j < card_list.length;j++){
                    if(i == j){
                        continue;
                    }
                    var _card_i = card_list[i] % 16;
                    if(_card_i > 10) _card_i = 10;
                    var _card_j = card_list[j] % 16;
                    if(_card_j > 10) _card_j = 10;
                    var cow2 = _card_i + _card_j;
                    cow2 = cow2 % 10;
    
                    if(cow2 == 0){
                        cow1 = cow2;
                        card_i =  card_list[i];
                        card_j = card_list[j];
                    }else if(cow2 > cow1 && cow1 != 0){
                        cow1 = cow2;
                        card_i =  card_list[i];
                        card_j = card_list[j];
                    }
                }
            } 
            max_card.push(card_lazi[0]);
            max_card.push(card_i);
            max_card.push(card_j);
            if((card_i + card_j) % 10 == 0 && is_no_wang_maxmin != -1){
                for(var i = 0;i<byTestPai.length;i++){
                    if(byTestPai[i] == 95 || byTestPai[i] == 79){
                        continue;
                    }
                    if((byTestPai[i] % 16) != is_no_wang_maxmin){
                        arr.push(i);
                    }else{
                     
                    }
                }
            }else{
                arr.push(card_lazi[0]);
                for(var i = 0;i<byTestPai.length;i++){
                    if(max_card.indexOf(byTestPai[i]) > -1){
                    }else{
                        arr.push(i);
                    }
                }
            }
        }else if(laizicount== 2){
            return arr;
            cow1 = 10;
            for(var j = 0; j < card_list.length;j++){
                var _card_j = card_list[j] % 16;
                if(_card_j > 10) _card_j = 10;
                if(_card_j < cow1){
                    cow1 = _card_j;
                    card_j =  card_list[j] % 16;
                }
            }
            for(var i = 0;i<byTestPai.length;i++){
                if((byTestPai[i]%16) == card_j)
                    arr.push(i);
            }
            // arr.push(card_lazi[0]);
            // arr.push(card_lazi[1]);
        }
        else{
            for(var i=0;i<byTestPai.length;i++){
                for(var n=i+1;n<byTestPai.length;n++){
                    for(var m=n+1;m<byTestPai.length;m++){
                        var idx1=byTestPai[i]%16;
                        var idx2=byTestPai[n]%16;
                        var idx3=byTestPai[m]%16;
                        if(idx1 > 10)   idx1 = 10;
                        if(idx2 > 10)   idx2 = 10;
                        if(idx3 > 10)   idx3 = 10;
                        if(idx1 != 0 || idx2 != 0 || idx3 != 0){
                            var num=idx1+idx2+idx3;
                            if(num%10==0){
                                arr.push(i);
                                arr.push(n);
                                arr.push(m);
                                return arr;
                            }
                        }
                    }
                }
            }
        }
        if(cow1 == 0){
            return arr;
        }
        if(is_no_wang_maxmin != -1){
            return  is_no_wang_10 
        }
        return arr;
    },
    //判断是否是座子
    isHaveZuo : function (array) {
        var arr = [];
	    var byTestPai=[0,0,0,0];
	    for (var i =0;i<byTestPai.length;i++){
	        if(array[i] < 255){
	            byTestPai[i] = array[i];
	        }
	    }

	    for(var i=0;i<byTestPai.length;i++){
	        for(var n=i+1;n<byTestPai.length;n++){
	            for(var m=n+1;m<byTestPai.length;m++){
	                var idx1=byTestPai[i]%16;
	                var idx2=byTestPai[n]%16;
	                var idx3=byTestPai[m]%16;
	                if(idx1 == idx2 && idx2 == idx3 && idx1 != 0){
                        arr.push(i);
                        arr.push(n);
                        arr.push(m);
                        return arr;
	                }
	            }
	        }
        }
	    return arr;
    },

    //数组包含某个元素
    isInArray:function (arr,value){
        for(var i = 0; i < arr.length; i++){
            if(value === arr[i]){
                return true;
            }
        }
        return false;
    },
    
    //界面关闭时
    onDestroy:function(){
        if(cc.isValid(this.animation)){
            this.animation.off('finished'); 
        }
        cc.loader.setAutoRelease(this, true);
    }
});