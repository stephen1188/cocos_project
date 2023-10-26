//加锅牛牛

cc.Class({
    extends: cc.Component,

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
            type:cc.SpriteAtlas
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
        fontBet:{
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
        nodeKaipai:cc.Node,
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
        nodeQie:cc.Node,
        nodeGuo:cc.Node,
        labelScore:cc.Label,
        labelRoomwanfa:cc.Label,
        labelMax:cc.Label,
        labelSmall:cc.Label,
        labelFen:cc.Label,
        labelGuofen:cc.Label,
        sprTip:cc.Sprite,
        xiazhuSli:cc.Slider,
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
        var const_nn = require("NN1001Const");
        cc.vv.game = this;
        cc.vv.game.config={
            type:"jgnn",
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
            show_watch_btn:false,//是否显示观战按钮
            default_bg:const_nn.default_bg
        }

        this._winPlayer = cc.find("Canvas/mgr/players");

        //获取对象
        this.table = this.node.getComponent("Table");

        this.startAnimation = this.node.getChildByName("startAnimation");
        this.animation = this.startAnimation.getComponent(cc.Animation);

        //监听协议
        this.initEventHandlers();
        // //监听测试数据
        // this.testinitEventHandlers();
        //动画监听
        this.initEventAniamtion();
    },

    start () {
        var self = this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        
        cc.vv.jgnnMgr = this.node.getComponent("NN1001Mgr");
        // //回放
        var ReplayMgr = require("NN1001ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();
         //初始化
        this.new_round();
        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });
            //初始化数据
            cc.vv.jgnnMgr.prepareReplay(cc.vv.roomMgr.jiesuan);
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

    //监听协议
    initEventHandlers:function(){
        //初始化事件监听器
        var self = this;
        /** 初始化->准备->开始->抢庄->第一轮发牌->下注->第二轮翻牌->小结->是否可切->切->大结算
		 *								                                       不切->已准备 
         * 
         */

        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.startAnimation.active = false;
            self.animation.stop();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay && cc.vv.net2.isConnectd()){
                self.new_round();
                cc.vv.net2.quick("stage");
            }
        });

        this.node.on('param',function(data){
            self.param(data.data);
        }),

        this.node.on('init_data', function(data){
            self.init_data(data.data);
        }),

        //准备
        this.node.on("ready",function(data){
            self.ready(data.data);
        }),

        //开始
        this.node.on('begin',function(){
        }),
        
        //开抢
        this.node.on("kaiqiang",function(data){
            //显示抢庄按钮
            self.kaiqiang(data.data);
        }),

        //抢庄
        this.node.on("qiangzhuang",function(data){
            //如果时自己抢庄关闭抢庄按钮
            self.qiangzhuang(data.data);
        }),

        //定庄
        this.node.on("dingzhuang",function(data){
            //播放定庄动画,显示庄家
            self.dingzhuang(data.data);
        }),

        //第一轮发牌
        this.node.on("fapai_1",function(data){
             //显示发的牌 显示下注按钮
            self.fapai1Data = data.data;
            self.fapai_1_animation();
        }),

        //下注完
        this.node.on("xiazhu",function(data){
            //如果是自己隐藏下注按钮 不管是不是自己都显示下注分
            self.xiazhu(data.data);
        }),

        //第二轮发牌
        this.node.on("fapai_2",function(data){
            //显示搓牌和发牌按钮
            self.fapai_2(data.data);
        }),

        //翻牌
        this.node.on("fanpai",function(data){
            //显示发的牌
            self.fanpai(data.data);
        }),

        //开牌
        this.node.on("kaipai",function(data){
            //隐藏翻牌和搓牌按钮 显示开牌按钮
            self.kaipai(data.data);
        }),

        //结算
        this.node.on("jiesuan",function(data){
            cc.vv.roomMgr.jiesuan = data.data;
            //关闭开牌按钮 隐藏开牌按钮 显示未开牌的玩家的牌 显示小结算
            self.jiesuan(data.data);
        }),

        //大结算
        this.node.on("report",function(data){
            if(data.errcode == -1){
                self.nodeJiesuan.active = false;
                return;
            }
            //显示大结算
            self.report(data.data);
            
        }),

        //恢复桌面
        this.node.on('stage',function(data){
            //恢复数据 。。
            self.stage(data.data);
          
        })
    },

    initEventAniamtion:function(){
        //开始游戏动画结束回调事件
        this.animation.on('finished', function(){
            if(this.node){
                var data = this.fapai1Data;
                this.fapai_1(data, true);
            }
        }, this);
    },
    
    //获取到游戏参数
    param:function(data){
        //1:扣1 2:扣人 3:全扣
        this._wanfa = data.wanfa;

        //0:每局选分 3,5,7,10固定分
        this._feng = 0;

        //庄家位置
        this._zhuang_mode = data.zhuang;

        this._zhuang = 0;

        if(!cc.vv.roomMgr.is_replay){
            //锅底
            this.labelGuofen.string = data.guo;
        }
        
    },

    //获取锅分
    init_data:function(data){
        //锅底
        this.labelGuofen.string = data.init_data.guo;
     },

    //准备
    ready:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip("zhunbei");
            this.new_round();
            this.table.seat_emit(null,"hideBet");
        }
    },
    
    //开抢
    kaiqiang:function(data){
        if(!data){
            return;
        }
        this.hidetip();
        
        if(this.isStage){
            //已经抢过庄了
            var bet  = cc.vv.roomMgr.stage.bet[cc.vv.roomMgr.seatid];
            if(bet.qiang == 1)return;
        }
        this.nodezhuang.active = true;

    },

    //抢庄
    qiangzhuang:function(data){
          
        //如果是自己抢，关闭抢庄
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.nodezhuang.active = false;
        }
        //抢庄的人，显示抢字
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        this.table.seat_emit(viewid,"qiangzhuang");
    },

    //定庄  
    dingzhuang:function(data){
          
        var self = this;

        this._zhuang = data.seatid;

        this.nodezhuang.active = false;

        var callback = function(){
            var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
            self.table.seat_emit(null,"dingzhuang",{seatid:viewid});
            
        }
        
        this.table.dingzhuang(data,callback);
    },

    fapai_1_animation:function(){
          
        this.sprTip.node.active = false;
        //播放开始游戏音效
        var mp3File = "nn/round";
        cc.vv.audioMgr.playSFX(mp3File);
        this.startAnimation.active = true;
        this.animation.play("niu_play");
    },

    //第一轮发牌
    fapai_1:function(data, isXiazhu){
          
        this.hidetip();
        //刷新标题
        var self = this;
        // cc.vv.roomMgr.now = data.round;
        this.table._winHub.emit("round");
        //让座位到开局状态
        this.table.seat_emit(null,"round");
        //下注区间  _xiaZhuRange

        //发牌
        this.deal_fapai(0,5,data,isXiazhu,function(viewid,idx){

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
        this.show_fapai(0,5,data,isXiazhu,function(viewid,idx){

        });
    },

    //发牌动画
    deal_fapai:function(begin, end, kaipaidata, isXiazhu, callback){

        var self = this;
        var isStage = this.isStage;
        var list = kaipaidata.pai;
        if(list == null)return;
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];

        var pailist = [];
        //发牌数组(数值为0)
        var fapailist = [];
        var datalist = [];
        for(var i=0;i< cc.vv.roomMgr.real ;++i){

            //显示位置
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var value = 0;
           
            //牌的位置
            var card_pos = pos[viewid].pos.card;
            var scale = pos[viewid].scale;

            for(var k= begin ;k< end ;k++){
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
            //最后一张牌发完后，开牌
            if(viewid != 0 || idx != 4) return;

            for (let index = 0; index < length; index++) {
                var data = datalist[index];
                var node = pailist[index];
                node.zIndex = index;
                if(data.value != 0){
                    self.send_card_emit(data.viewid,data.index,"trun",data);
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

    //发牌动画
    show_fapai:function(begin, end, kaipaidata, isXiazhu, callback){

        var self = this;
        var isStage = this.isStage;
        var list = kaipaidata.pai;
        if(list == null)return;
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        for(var i=0;i< cc.vv.roomMgr.real ;++i){

            //显示位置
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var value = 0;
           
            //牌的位置
            var card_pos = pos[viewid].pos.card;
            var scale = pos[viewid].scale;

            for(var k= begin ;k< end ;k++){
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

    //显示下注
    show_xiazhu(isStage){
        
        //已经下过注了
        if(isStage){
            var bet  = cc.vv.roomMgr.stage.bet[cc.vv.roomMgr.seatid];
            if(bet.bet != 0){
                // this.xiazhu({seatid:cc.vv.roomMgr.seatid,power:bet.bet});
                this.hidetip();
                return;
            }
        }
       
        //如果是固定分，直接下注
        if(this._feng != 0){
            cc.vv.net2.quick("xiazhu",{power:this._feng});
            return;
        }else{
            this.tip("xiazhu");
            var max = this.fapai1Data._xiaZhuRange[1];
            var small = this.fapai1Data._xiaZhuRange[0];
            this.labelSmall.string = small;
            this.labelMax.string = max;
            this.labelFen.string = small;
            this.nodeXiazhu.active = true;
        }
    },

    //下注
    xiazhu:function(data){
        this.hidetip();

        var self = this;

        if(data.seatid == cc.vv.roomMgr.seatid){
            this.nodeXiazhu.active = false;
            this.hidetip();
        }
        
        //生成一个节点，把节点加到座位的bet节点
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);

        var node = new cc.Node('BetNode')  
        var BetLabel = node.addComponent(cc.Label);
        node.getComponent(cc.Label).string =  data.power + "分";
        node.getComponent(cc.Label).font = self.fontBet;

        self.table.seat_emit(viewid,"bet",{node:node});
    },

    //第二轮发牌
    fapai_2:function(data){
          
        this.hidetip();
        this.data = data

        this.NodeWaitclock.active = true;
        this.schedule(this.otherTimeUpdate,1);
        
        if(cc.vv.roomMgr.is_replay != true){
            if(this._wanfa != 3){
                this.btncuopai.active = true;
                this.btnfanpai.active = true;
            }else{
                this.btncuopai.active = false;
                this.btnfanpai.active = true;
            }
        }else{
            this.btncuopai.active = false;
            this.btnfanpai.active = false;
        }
    },

    //翻牌
    fanpai: function(data){
          
        var self = this;

        //翻完牌后，显示开牌按钮
        var callback = function(obj,viewid,idx,type){
            self.show_jiaobiao(viewid);
        };
        //翻转自身牌
        for (var i = 0; i < 5; ++i) {

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

    //翻牌完成后的动作，显示牌形
    kaipai_callback:function(obj,viewid,idx,type,rate,pai){

        if(idx != 4)return;

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
            if(type != null && type >= 200)
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
            for (var i = 0; i < 5; ++i) {
                if(isYidong == true && self.isInArray(arrTop, i)){
                    self.send_card_emit(viewid,i,"top");
                }
            }
        }
    },

    //开牌
    kaipai:function(data){
          
        this.tip("kaipai");
        
        var self = this;

        //已经开过牌
        if(this._kaipai[data.seatid] == 1)return;
        this._kaipai[data.seatid] = 1;

        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);

        //音效
        this.play_nn_mp3(data.seatid,data.type);

        if(data.seatid == cc.vv.roomMgr.seatid){
            this.nodeKaipai.active = false;
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
                    value:data.hand[i],
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
                    pai:data.hand,
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
                    value:data.hand[i],
                    type:data.type,
                    atlas:self.pokerAtlas,
                    rate:data.rate,
                    pai:data.hand,
                    callback:this.kaipai_callback}

                self.send_card_emit(viewid,i,"trun",info);
            }
        }
    },

    //结算_小结算
    jiesuan:function(data){
          
        var self = this;
        
        this.nodeCuopai.active = false;

        this.nodeKaipai.active = false;
        this.btncuopai.active = false;
        this.btnfanpai.active = false;

        if(cc.vv.roomMgr.stage == null || cc.vv.roomMgr.stage.stage != 97){
            //所有人开牌
            for(var i=0;i< cc.vv.roomMgr.real ;++i){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(this._kaipai[data.list[i].seatid] != 1){
                    self.show_jiaobiao(viewid);
                    //如果时自己
                    if(viewid == 0){
                        // //翻转自身牌
                        for (var j = 0; j < 5; ++j) {
                            var info = {
                                obj:this,
                                viewid:viewid,
                                index:i,
                                value:data.list[i].hand[j],
                                type:data.list[i].type,
                                atlas:this.pokerAtlas,
                                rate:data.rate
                            }
                            self.send_card_emit(viewid,j,"kaipai",info);
                        }
                        var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
                        //是否已经
                        for (var j = 0; j < 5; ++j) {
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
                        // //翻转自身牌
                        for (var j = 0; j < 5; ++j) {
                            var info = {
                                obj:self,
                                viewid:viewid,
                                index:j,
                                value:data.list[i].hand[j],
                                type:data.list[i].type,
                                atlas:self.pokerAtlas,
                                rate:data.rate,
                                pai:data.list[i].hand,
                                callback:this.kaipai_callback}

                            self.send_card_emit(viewid,j,"trun",info);
                        }
                    }
                    this.play_nn_mp3(i,data.list[i].type);
                }
            }
        }else{
            //所有人开牌
            for(var i=0;i< cc.vv.roomMgr.real ;++i){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                //如果时自己
                if(viewid == 0){
                    // //翻转自身牌
                    var fapaidata = data.list[i].hand;
                    var isXiazhu = false;
                    //发牌
                    this.show_fapai_stage(viewid,0,5,fapaidata,isXiazhu,function(viewid,idx){

                    });
                    var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
                    //是否已经
                    for (var j = 0; j < 5; ++j) {
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
                    this.show_fapai_stage(viewid,0,5,fapaidata,isXiazhu,function(viewid,idx){
                        if(idx != 4)return;
                        //是否已经
                        self.kaipai_callback(self,viewid,idx,data.list[i].type,data.list[i].rate,data.list[i].hand);
                    });
                }
            }
        }
     
        this.labelGuofen.string = data.guo;
        this.isQieguo = data.qieguo;

        //所有人结算
        for(var i=0;i< cc.vv.roomMgr.real ;++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            self.table.seat_emit(viewid,"score",data.list[i].user_score);
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
        //所有人结算
        for(var i=0;i< cc.vv.roomMgr.real ;++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            if(viewid != 0 && isTrue == true){
                selfSeatid = i;
                continue;
            }else{
                isTrue = false;
                selfLast++;
                var viewid = cc.vv.roomMgr.viewChairID(i);
                var name = cc.vv.roomMgr.table.list[i].nickname;
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
            }
        }

        for(var i=0;i< selfSeatid + 1;++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var name = cc.vv.roomMgr.table.list[i].nickname;
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
        
        for(var i=0;i< cc.vv.roomMgr.real ;i++)
        {
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid == 0){
                if(data.list[i].round_score < 0){
                    setTimeout(() => {
                        cc.vv.audioMgr.playSFX("ddz/game_lose");
                    }, 2000);
                    setjiesuanTitle(0);
                }else{
                    setTimeout(() => {
                        cc.vv.audioMgr.playSFX("ddz/game_win");
                    }, 2000);
                    setjiesuanTitle(1);
                }
            }
        }

        function settimefunction(){
            self.nodeJiesuan.active = true;
        }

        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var moneyCount = 10;//金币数量
        if(cc.vv.roomMgr.is_replay){
            setTimeout(() => {
                settimefunction();
            }, 5000);
        }else{
            setTimeout(() => {
                settimefunction();
            }, 2000);
        }
        //小结算
        for(var i=0;i< cc.vv.roomMgr.real ;i++)
        {
            var callback = cc.callFunc(function() {
 
            });
            if(data.list[i].seatid == this._zhuang){
                continue;
            }
            if(data.list[i].round_score < 0){
                var v_from_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, this.nodeGuo.x, this.nodeGuo.y, moneyCount, callback);
            }else if(data.list[i].round_score > 0){
                var v_to_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                this.playBetByXY(this._winPlayer, this.nodeGuo.x, this.nodeGuo.y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, callback);
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

        this.labelRoomwanfa.string = "玩法：" + data.desc;

        //隐藏解散房间
        this.table.hide_dismiss_room();
        var list;
        if (cc.vv.roomMgr.real <=5){
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
            if(data.list[i].result_score >= max_score){
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

        var realPeople = 0;
        //所有人结算
        for(var i=0;i< data.list.length ;++i){
            if(data.list[i].userid > 0){
                realPeople++;
            }
        }
        //所有人结算
        for(var i=0;i< realPeople ;++i){

            var viewid = cc.vv.roomMgr.viewChairID(i);

            var info = {
                zhuang:data.zhuang,
                seatid:data.list[i].seatid,
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
            if(realPeople<=5)
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
    },

    //恢复桌面
    stage:function(data){
          
        this.new_round();
        /**
         * 自有的游戏阶段
         */
        // public static final int STAGE_QIANGZHUANG = 1;
        // public static final int STAGE_FAPAI_1 = 2;
        // public static final int STAGE_XIAZHU = 3;
        // public static final int STAGE_FAPAI_2 = 4;
        cc.vv.roomMgr.stage = data;
        if(cc.vv.roomMgr.stage){
            this.isStage = true;;
        }

        if(data){
            cc.vv.roomMgr.started = 1;
            cc.vv.roomMgr.real = data.real;
            cc.vv.roomMgr.now = data.round;
        }

        this.table._winReady.emit("begin");
        // //让座位到开局状态
        this.table._winHub.emit("begin");

        switch(data.stage){
            case 1:{
                this.kaiqiang();
            }
            break;
            case 2:{
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.fapai1Data = data;
                this.fapai_1_stage({pai:data.cards}, true);
            }
            break;
            case 3:{
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.fapai1Data = data;
                this.fapai_1_stage({pai:data.cards}, true);
                var bet = data.bet;
                for (var index = 0; index < bet.length; index++) {
                    if(bet[index].bet != 0){
                        this.xiazhu({seatid:index,power:bet[index].bet});
                    }
                }
            }
            break;
            case 4:{
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                var datacopy = cc.vv.utils.deepCopy(data);
                var cards = datacopy.cards;
                this.data = data;
                this.data.hand = data.cards;
                this.data.pai = data.cards;
                if(data.iskaipai == 0)
                {
                    var wamfa = cc.vv.roomMgr.param.wanfa;
                    if(wamfa == 1){
                        cards[4] = 0;
                    }else if(wamfa == 2){
                        cards[3] = 0;
                        cards[4] = 0;
                    }else if(wamfa == 3){
                        cards[0] = 0;
                        cards[1] = 0;
                        cards[2] = 0;
                        cards[3] = 0;
                        cards[4] = 0;
                    }
                }
                this.fapai_1_stage({pai:cards}, false);
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
                            this.nodeKaipai.active = false;
                            this.btncuopai.active = false;
                            this.btnfanpai.active = true;
                        }else{
                            this.nodeKaipai.active = false;
                            this.btnfanpai.active = false;
                            this.btncuopai.active = false;
                            var data = {"rate":data.rate,"hand":data.cards,"pai":data.cards,"seatid":cc.vv.roomMgr.seatid,"type":data.type}
                            this.kaipai(data);
                        }
                    }else{
                        if(data.iskaipai == 0)
                        {
                            this.nodeKaipai.active = false;
                            this.btncuopai.active = true;
                            this.btnfanpai.active = true;
                        }else{
                            this.nodeKaipai.active = false;
                            this.btnfanpai.active = false;
                            this.btncuopai.active = false;
                            var data = {"rate":data.rate,"hand":data.cards,"pai":data.cards,"seatid":cc.vv.roomMgr.seatid,"type":data.type}
                            this.kaipai(data);
                        }
                    } 
                }else{
                    this.btnKaipai.active = false;
                    this.btncuopai.active = false;
                    this.btnfanpai.active = false;
                }
            }
            break;
            case 97:{
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

    //新一局，重置桌面
    new_round:function(){
        var self=this;
        this.nodeKaipai.active = false;
        this.nodezhuang.active = false;
        this.nodeXiazhu.active = false;
        this.nodeReport.active = false;
        this.nodeJiesuan.active = false;
        this.btncuopai.active = false;
        this.btnfanpai.active = false;
        this.nodeQie.active = false;
        this.NodeWaitclock.active = false;
        this.nodeCuopai.active = false;
        this.nodeCard.removeAllChildren();
        this.nodeCardone.removeAllChildren();

        this.NodeWaitclock.getChildByName("time").getComponent(cc.Label).string = 15;
        
        //是否已翻牌
        this.isFanPai = false;
        //是否已开牌
        this.isCuopai = false;
        
        //是否开牌
        this._kaipai = [0,0,0,0,0,0,0,0,0,0];

        //是否切锅
        this.isQieguo = 0;

        this.xiazhuSli.progress = 0;

        this.hidetip();
        if(cc.vv.roomMgr.stage){
            cc.vv.roomMgr.stage.stage = null;
        }
       
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
                var data = this.labelFen.string;
                var power = parseInt(data);
                cc.vv.net2.quick("xiazhu",{power:power});
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
                self.nodeKaipai.active = false;
                cc.vv.net2.quick("kaipai");
            }
            break;
            case "btn_qie":{
                cc.vv.net2.quick("qieguo");
            }
            break;
            case "btn_ready":{
                //小结按钮
                if(cc.vv.roomMgr.jiesuan.isEnd == 1){
                    cc.vv.net2.quick("report");
                }else if(self.isQieguo != 0 &&  cc.vv.roomMgr.seatid == self._zhuang){
                    //显示切锅按钮
                    self.nodeJiesuan.active = false;
                    self.nodeQie.active = true;
                }else{
                    self.table.node.emit("jgnnready");
                }
            }
            break;
           
        }
        cc.vv.audioMgr.click();
    },
    
    //选择分数
    onChangeClick:function(event){
        var small = parseInt(this.labelSmall.string);
        var max =  parseInt(this.labelMax.string);
        var cha = max - small;
        var value = Math.floor((event.progress * cha + small) / 10) * 10;
        if(max <= 10){
            value = Math.floor(event.progress * cha + small);
        }

        if(value == 0){
            value = 1;
        }
        
        this.labelFen.string = value;
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
                self.nodeKaipai.active = true;
            }
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
            value:self.data.pai[4],
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
        carditem.setPosition(0,0)
        cardtop.scale = 1;
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
        var pos = cc.vv.game.config["cuopai"];
        var viewid = 0;
        var value = 0;

        var callbackout = function(obj,viewid,idx,type){
            //翻完牌后，显示开牌按钮
            var callback = function(obj,viewid,idx,type){
                if(viewid != 0 || idx != 4)return;
                self.btncuopai.active = false;
                self.btnfanpai.active = false;
                self.nodeKaipai.active = true;
            }
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
            value:self.data.pai[4],
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

        var callbackcenter = function(){

        }
        
        var datacenter = {
            viewid:viewid,
            index:2,
            atlas:self.pokerAtlas,
            value:self.data.pai[3],
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
        cardcenter.zIndex = 0;
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
        cardtop.zIndex = 0;
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

    //翻牌按钮事件
    fanpaiClick:function(){
        var self = this;
        if(this.isFanPai){
            return;
        }
        this.isFanPai = true;
        //翻完牌后，显示开牌按钮
        var callback = function(obj,viewid,idx,type){
            if(viewid != 0 || idx != 4)return;
            self.btncuopai.active = false;
            self.btnfanpai.active = false;
            self.nodeKaipai.active = true;
        };

        //翻转自身牌
        for (var i = 0; i < 5; ++i) {

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

    //切换提示
    tip:function(text){

        if(text == null){
            this.sprTip.node.active = false;
            return;
        }

        var name = "tips_" + text;
        this.sprTip.spriteFrame = this.tipAtlas.getSpriteFrame(name);
        this.sprTip.node.active = true;
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

    //其他玩家倒计时
    otherTimeUpdate:function(){
        var time = this.NodeWaitclock.getChildByName("time").getComponent(cc.Label);
        var number = parseInt(time.string);
        number -= 1;
        time.string = number;
        if(number == 0){
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

    //判断是否有牛
    isHaveNiu : function (array) {
        var arr = [];
        var byTestPai=[0,0,0,0,0];
        for (var i =0;i<5;i++){
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
        
        return arr;
    },

    //判断是否是座子
    isHaveZuo : function (array) {
        var arr = [];
        var byTestPai=[0,0,0,0,0];
        for (var i =0;i<5;i++){
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
    },

    //==========================================================================
    //测试用接口
    // //配数据
    // testData:function(type, data){
    //     var self = this;

    //     this.node.emit(type, data);
    // },
    // onButtonQieGuo:function(){
    //     cc.vv.roomMgr.real = 5;
    //     this.testData("jiesuan",{"errcode":0,"data":{"guo":60,"min":30,"max":30,"list":[{"user_score":-20,"round_score":-20,"real_score":-20,"seatid":0,"real":4,"type":1,"userid":3001,"hand":[29,12,8,51,35]},{"user_score":0,"round_score":0,"real_score":0,"seatid":1,"real":4,"type":20,"userid":3028,"hand":[60,25,54,5,50]},{"user_score":-20,"round_score":-20,"real_score":-20,"seatid":2,"real":4,"type":1,"userid":3015,"hand":[13,36,20,17,1]},{"user_score":40,"round_score":40,"real_score":0,"seatid":3,"real":4,"type":90,"userid":3016,"hand":[56,24,23,21,33]},{"user_score":0,"round_score":0,"real_score":0,"seatid":4,"real":4,"type":0,"userid":0,"hand":[0,0,0,0,0]}],"isEnd":0,"qieguo":0},"errmsg":"ok","model":"game","event":"jiesuan"});
    // }
});
