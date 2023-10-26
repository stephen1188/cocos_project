var ACTION_ANGANE   = 9;
var ACTION_DIANGANE = 10;
var ACTION_WANGGANE = 11;
cc.Class({
    extends: cc.Component,

    properties: {
        spriteMagic:cc.Sprite,
        spriteMagic2:cc.Sprite,

        nodeGameRoot:cc.Node,
        nodeAnimationKaiju:cc.Node,
        nodeAnimationBuhua:cc.Node,
        nodeAnimationArrow:cc.Node,
        nodeAnimationYaoshaizi:cc.Node,
        nodeAnimationBaopai:cc.Node,
        nodeTuodong:cc.Node,
        nodeReport:cc.Node,
        nodeJiesuan:cc.Node,

        PrefabMajiang:cc.Prefab,
        prefabPengganghuTexiao:cc.Prefab,
        prefabBuhua:cc.Prefab,
        prefabKaiju:cc.Prefab,
        prefabArrow:cc.Prefab,          
        prefabYaoshaizi:cc.Prefab,
        prefabBaopaione:cc.Prefab,
        prefabBaopaitwo:cc.Prefab,
        prefabBaopaithree:cc.Prefab,
        prefabPlayEfxAnim:cc.Prefab,
        reportItemPrefab:cc.Prefab,
        tingpaiMJpre:cc.Prefab,
        tingpaiMJpreMin:cc.Prefab,
        tingPaiList_min:cc.Prefab,

        jiesuanhuAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        wallcardAtlasThreeD:{
            default:null,
            type:cc.SpriteAtlas
        },
        selfhandAtlasThreeD:{
            default:null,
            type:cc.SpriteAtlas
        },
        lefthandAtlasThreeD:{
            default:null,
            type:cc.SpriteAtlas
        },
        righthandAtlasThreeD:{
            default:null,
            type:cc.SpriteAtlas
        },
        uphandAtlasThreeD:{
            default:null,
            type:cc.SpriteAtlas
        },
        majiangbtnAtlasThreeD:{
            default:null,
            type:cc.SpriteAtlas
        },
        jiesuanAtlasThreeD:{
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
        
        _autoOutCrad:false,//自动出牌标示
        _baoting:0,//存储是否已经听牌 0=没有听牌，1=已经听牌
        _baotingchupai:false,//报听后自动出牌，默认不自动出牌，报听后自动出牌，在报听后设为true 游戏重开时设为false 断线重连时 接收服务器的值
        _myMJArr:[],
        _playEfxs:null,
        _prefabPlayEfxAnim:null,
        _opts:[],
        _ting_chupai:[],//报听后可以出的牌
        _ting_tingpai:[],//存储听牌的集合
        _ting_need:[],
        _tingpai:[],//报听牌的集合
        _tingpaifan:[],//存放听牌之后 所有需要的牌剩余的牌和牌数
        _yiting:false, //报听的 变量只发一次一 之后都发零
        _guo_pai:null,//报听之后 后续可以 碰杠吃 点过 继续自动出牌的牌值
        _ting_hupai:0,//听牌的时候 自摸可以胡牌 点是否胡牌后自动出牌判断true 代表可以自动出牌。false 反之
        _tinghuhoupai:0,//报听之后，点过继续出牌
        _showActoin_yse_not:false,//判断是否有显示动作，变量在showaction里面设为true，
        _select_crad:null,//记录上一次点击的麻将
        _isfrist:false,//是否已经经过第一次定庄
        _isfristAction:false,//第一次显示动作
        _isfristTingAction:false,
        _isfristTing1Action:false,
        _chupaiArr:[],//出牌列表
        _stage97:false,
        _datating:null,//听牌数据
        _datating1:null,//听牌数据
        _oldseatid:0,
        isShowAutoTip:false,
    },
   
    onLoad () {
        cc.vv.log3.debug("majiangTable:onLoad");
        cc.vv.majiangTable = this;
    },

    start () {
        cc.vv.log3.debug("majiangTable:start");
        //监听事件
        this.initEventHandlers();
        this.initEventHandlersBtn();
    },

    //初始化界面
    initView:function(){
        if(this._prefabArrow == null){
            this._prefabArrow = cc.instantiate(this.prefabArrow);
            this.nodeAnimationArrow.addChild(this._prefabArrow);
        }

        if(this._prefabBaopai1 == null){
            this._prefabBaopai1 = cc.instantiate(this.prefabBaopaione);
            this.nodeAnimationBaopai.addChild(this._prefabBaopai1);
        }

        if(this._prefabBaopai2 == null){
            this._prefabBaopai2 = cc.instantiate(this.prefabBaopaitwo);
            this.nodeAnimationBaopai.addChild(this._prefabBaopai2);
        }

        if(this._prefabBaopai3 == null){
            this._prefabBaopai3 = cc.instantiate(this.prefabBaopaithree);
            this.nodeAnimationBaopai.addChild(this._prefabBaopai3);
        }

        if(this._prefabYaoshaizi == null){
            this._prefabYaoshaizi = cc.instantiate(this.prefabYaoshaizi);
            this.nodeAnimationYaoshaizi.addChild(this._prefabYaoshaizi);
        }

        this._prefabPlayEfxAnim = {};
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var side = sides[viewid];            
            var sideChild = this.nodeGameRoot.getChildByName(side);
            var prefabPlayEfxAnim = sideChild.getChildByName("playEfxAnim").getChildByName("prefabPlayEfxAnim");
            if(prefabPlayEfxAnim == null){
                prefabPlayEfxAnim = cc.instantiate(this.prefabPlayEfxAnim);
                var parent = sideChild.getChildByName("playEfxAnim");
                parent.addChild(prefabPlayEfxAnim);
            }
            this._prefabPlayEfxAnim[side] = prefabPlayEfxAnim.getComponent(cc.Animation);
            this._prefabPlayEfxAnim[side].node.active = false;
        }

        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var side = sides[viewid];            
            var sideChild = this.nodeGameRoot.getChildByName(side);
            var hupaiNode = sideChild.getChildByName("hupai").getChildByName("KDMajiang");
            hupaiNode.active = true;
            hupaiNode.myTag = viewid + "_hupai";
        }

        this.nodeReport.active = false;
        this.nodeJiesuan.active = false; 

        
        var size = this.node.getContentSize();//此宽高为你设置的原始宽高比
        var width  = size.width;
        var windowSize = this.node.getComponent(cc.Canvas).designResolution;
        var holds = this.nodeGameRoot.getChildByName("myself").getChildByName("holds");
        var holds_chupai = this.nodeGameRoot.getChildByName("myself").getChildByName("holds_chu");
        var holdsreplay = this.nodeGameRoot.getChildByName("myself").getChildByName("holdsreplay");
        var penggangs = this.nodeGameRoot.getChildByName("myself").getChildByName("penggangs");
        var scaleNum = width/windowSize.width;
        this.scaleNum = scaleNum;

        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var selfViewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var posSelfHolds = cc.vv.utils.deepCopy(posall[selfViewid].holds);
        var node = cc.instantiate(this.PrefabMajiang);
        var height = node.getChildByName("bg").height;

        var yTo = (height * (scaleNum - 1)) / (posSelfHolds.scale); 
        holds.y = yTo;
        holds_chupai.y = yTo;
        holdsreplay.y = yTo;
        penggangs.y = yTo;

        holds.scale = scaleNum;
        holds_chupai.scale = scaleNum;
        holdsreplay.scale = scaleNum;
        penggangs.scale = scaleNum;

        this.mgr = this.node.getChildByName("mgr");
        this.mgr.getChildByName("ready").opacity = 0;
        this.mgr.getChildByName("ready").scale = 0;
    },

    //每局初始化
    new_round:function(){

        var sides = cc.vv.mahjongMgr._sides;
        
        this._playEfxs = {};

        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var side = sides[viewid];            
            var sideChild = this.nodeGameRoot.getChildByName(side);
            this._playEfxs[side] = sideChild.getChildByName("play_efx").getComponent(cc.Animation);
            var opt = sideChild.getChildByName("opt");
            opt.active = false;
            var sprite = opt.getChildByName("pai").children[0].getComponent(cc.Sprite);
            var data = {
                node:opt,
                sprite:sprite
            };
            this._opts.push(data);
            this._playEfxs[side].node.active = false;
        }
        
        this.mgr = this.node.getChildByName("mgr");
        this.game = this.mgr.getChildByName("game");
        this.opts = this.game.getChildByName("ops");
        this.chiopts = this.game.getChildByName("chipaiOps");
        this.gangopts = this.game.getChildByName("gangpaiOps");
        this.tingopts = this.game.getChildByName("baotingops");
        this.hideOptions();
        this.hideChipaiOpts();
        this.hideGangPaiOpts();
        this.hideTingOpts();
        this.hideAllHolds();
        this.hideAllChupai();
        this.hideAllChiPengGang();
        this.showAllLight();
        this.hideMagic();
        this.hideHupai();
        var data = {
            data:{
                count:"00",
            }
        }
        this.game_changeMajiangNum(data)
        cc.vv.folds.hideAllFolds();
        cc.vv.folds.initView();
        this.hideGuohu();
        if(cc.vv.game.config.isGuoPeng){
            this.hideGuoPeng();
        }
        this.spriteMagic.node.parent.active = false;
        this.spriteMagic2.node.parent.active = false;
        this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi").active = false;
        this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi2").active = false;
        this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 65;
        //还原提示牌
        var nodeTuodongy = -500;
        var nodeTuodongx = -1000;
        var position = cc.v2(nodeTuodongx, nodeTuodongy);
        cc.vv.game.majiangTable.setTuodong(position);
    },

    initEventHandlers:function(){
        var self = this;
        this.node.on('ready',function(data){
            data = data.data;
            if(data.seatid == cc.vv.roomMgr.seatid){
                cc.vv.mahjongMgr.reset();
                self.reset();
                self.nodeJiesuan.active = false;
            }
        });

        //摇色子
        this.node.on('game_saizi_table',function(data){
            self.game_saizi(data)
        });
        //动作
        this.node.on('showAction',function(data){
            self.showAction(data);
        });
        this.node.on('game_magic_table',function(){
            self.game_magic();
        });

        this.node.on('game_begin_table',function(){;
            // self.onGameBeign();
        });
        //判断是否有看牌参数
        this.node.on('param',function(data){
            var canCheat = data.data.canCheat
            var btnshowall = cc.find("Canvas/mgr/btnshowall");
            if (btnshowall&&!cc.vv.roomMgr.is_replay){}else{return}
            if (canCheat){
                btnshowall.active =true
            }else{
                btnshowall.active =false
            }
        });
        //判断是否有看牌参数
        this.node.on('stage',function(data){
            var canCheat = data.data.canCheat
            var btnshowall = cc.find("Canvas/mgr/btnshowall");
            if (btnshowall&&!cc.vv.roomMgr.is_replay){}else{return}
            if (canCheat){
                btnshowall.active =true
            }else{
                btnshowall.active =false
            }
        });
        //更新手牌
        this.node.on('game_holds_table',function(){
            if(cc.vv.game.config.is_no_fapaiAnimation){
                self.game_no_fapai();
            }else{
                self.game_fapai();
            }
        });

        //剩余麻将数
        this.node.on('mj_count_table',function(data){
            self.game_changeMajiangNum(data);
        });

        //隐藏色子
        this.node.on('game_hideSaizi_table',function(){
            self.game_hideSaizi();
        });

        //开局
        this.node.on('game_kaiju_table',function(){
            self.new_round();
            if(cc.vv.roomMgr.now == "1" && !cc.vv.game.config.is_kaiju){
                self.game_kaiju();
            }
        });

        //定庄
        this.node.on('game_dingzhuang_table',function(data){
            data = data.data;
            var seatid = data.seatid
            self.game_dingzhuang(seatid);
        });

        //第一次显示操作者
        this.node.on('game_fristTurnChange_table',function(){
            self.game_fristTurnChange();
        });

        //第一次显示动作
        this.node.on('game_fristShowAction_table',function(){
            self.game_fristShowAction();
        });

        //第一次听动作
        this.node.on('game_fristShowTingAction_table',function(){
            self.game_fristShowTingAction();
        });

         //第一次听动作
         this.node.on('game_fristShowTing1Action_table',function(){
            self.game_fristShowTing1Action();
        });
        
        //游戏进行中
        this.node.on('game_playing_table',function(data){
        });

        //广播下一个玩家操作
        this.node.on('game_chupai_table',function(data){
            self.game_turnChange(data);
        });

        //广播出牌
        this.node.on('game_chupai_notify_table',function(data){
            self.game_chupai(data);
        });

        //摸牌
        this.node.on('game_mopai_table',function(data){
            self.game_mopai(data);
        });
        
        //显示动作
        this.node.on('game_showaction_table',function(data){
            self.showAction(data);
        });

        //过
        this.node.on('guo_notify_table',function(data){
            self.game_guo(data);
        });

        //碰
        this.node.on('peng_notify_table',function(data){
            self.game_peng(data);
        });

        //吃
        this.node.on('chi_notify_table',function(data){
            self.game_chi(data);
        });

        //杠
        this.node.on('gang_notify_table',function(data){
            self.game_gang(data);
        });

        //胡
        this.node.on('hupai_table',function(data){
            self.game_hu(data);
        });

        //出牌限制
        this.node.on('chupai_limit_notify_table',function(data){
            self.game_chupaiLimit(data);
        });

        //报听
        this.node.on('bao_ting_push_table',function(data){
            self.game_baoTing(data);
        });

        //补花
        this.node.on('buhua_notify_table',function(data){
            self.game_buhua(data);
        });

        this.node.on('game_action_ting_table', function(data){
            var _data = data.data;
            self._datating = _data;
            self.showTingOption(_data);
        });

        this.node.on('game_action_ting1_table', function(data){
            var _data = data.data;
            self._datating1 = _data;
            self.game_actionting1(_data);
        });

        //游戏结束
        this.node.on('game_jiesuan_table',function(data){
            self.game_jiesuan(data);
        });

        //大结算
        this.node.on('game_report_table',function(data){
            self.game_report(data);
        });

        //游戏同步
        this.node.on('game_sync_table',function(data){
            if(data.state == 97)
            {
                self._stage97 = true;
            }
            self.new_round();
            self.onGameBeign(data);
            self.game_magicshow();
            var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
            if (seatData.baoting == true){
                self._baoting = 1;//断行重连后，报听赋值
                cc.find("Canvas/mgr/hud/oper/btn_ting").active = true;//断线重连后，如果是在报听状态就显示看听牌按钮
                if(cc.vv.game.config.is_showtingdown){
                    cc.vv.net2.quick('query');
                    self.onclick_see_ting_hs();
                }
                self._baotingchupai = true;//报听后游戏重连自动出牌赋值
                self.setBaoting();
            }else{
                self._baoting = 0;
                cc.find("Canvas/mgr/hud/oper/btn_ting").active = false;//断线重连后，如果是不在报听状态就不显示看听牌按钮
                if(cc.vv.game.config.is_showtingdown){
                    cc.find("Canvas/open/see_ting_Pai_hs").active = false;
                    cc.find("Canvas/open/huSprite").active = false;
                }
            }
        });

        //桌面恢复
        this.node.on('stage_table',function(data){
            self.stage(data.data);
        });

        this.node.on('query_tingpai',function(data){
            var data =data.data;
            self._tingpai = [];
            self._tingpaifan = [];
            self._tingpaifannew = [];
            for(var i=0;i<data.list.length;++i){//需要显示在屏幕中间，循环遍历听牌的长度，如果添加预制件
                self._tingpai[i] = data.list[i].pai;
                self._tingpaifan[i] = data.list[i].left;
                if(cc.vv.game.config.is_tingfan){
                    self._tingpaifannew[i] = data.list[i].fan;
                }
            }
            self.onclick_see_ting();
        });

        this.node.on('guo_result_table', function(){
            self.hideGangPaiOpts();
            self.hideChipaiOpts();
            self.hideOptions();
        });
        //显示听牌
        this.node.on('view_ting',function(data){
            self.view_ting(data.data);
        });

        //显示过胡
        this.node.on("guohu_table", function(data){
            var seatid = data.seatid;
            self.guohu(seatid);
        });

        //显示过胡
        this.node.on("guopeng_table", function(data){
            var seatid = data.seatid;
            self.guopeng(seatid);
        });

        //显示呼叫转移
        this.node.on("hujiaozhuanyi_table", function(data){
            self.hujiaozhuanyi(data);
        });

        //坐到位置
        this.node.on('sit', function (ret) {
            var data = ret.data;
            self.sit(data);
        });
        //坐到位置
        this.node.on('table',function(data){
            data = data.data;
            if(typeof(self.table) == "function"){
                self.table(data);
            }
        });

        this.node.on('wait_hu',function(data){
            data = data.data;
            self.wait_hu(data);
        });

        this.node.on('huangzhuang_table', function(){
            self.game_huangZhuang();
        });
    },

    initEventHandlersBtn:function(){
        //初始化事件监听器
        var btnTing = cc.find("Canvas/mgr/hud/oper/btn_ting");
        var see_ting_Pai = cc.find("Canvas/open/see_ting_Pai");
        btnTing.on(cc.Node.EventType.TOUCH_START,function(){
            see_ting_Pai.removeAllChildren()
            cc.vv.net2.quick('query');
            see_ting_Pai.active = true;
        });
        btnTing.on(cc.Node.EventType.TOUCH_END,function(){
            see_ting_Pai.active = false;
        });
        btnTing.on(cc.Node.EventType.TOUCH_CANCEL,function(){
            see_ting_Pai.active = false;
        });
    },

    //开局
    game_kaiju:function(){
        cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_begin");
        this._prefabKaiju = cc.instantiate(this.prefabKaiju);
        this.nodeAnimationKaiju.addChild(this._prefabKaiju);
        var animation = this._prefabKaiju.getComponent(cc.Animation);
        animation.play("kaiju");
    },

    //摇色子
    game_saizi:function(data){
        cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_touzi");
        this._prefabYaoshaizi.emit("yaoshaizi", {data:{num1:data.saizi_1,num2:data.saizi_2}});
    },

    game_hideSaizi:function(){
        this._prefabYaoshaizi.emit("hideshaizi");
    },

    //定癞子
    game_magic:function(){
        var self = this;
        if(cc.vv.mahjongMgr._magicPai != -1 && cc.vv.mahjongMgr._magicPai2 != -1  && cc.vv.mahjongMgr._magicPai > cc.vv.mahjongMgr._magicPai2){
            var magicpai = cc.vv.mahjongMgr._magicPai;
            cc.vv.mahjongMgr._magicPai = cc.vv.mahjongMgr._magicPai2;
            cc.vv.mahjongMgr._magicPai2 = magicpai;
        }
        var paisprite1 = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai));
        var paisprite2 = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai2));
        this.spriteMagic.spriteFrame = paisprite1;
        this.spriteMagic2.spriteFrame = paisprite2; 
        if(this._prefabBaopai1 != null){
            var dian =  this._prefabBaopai1.getChildByName("majiang").getChildByName("dian")
            dian.getComponent(cc.Sprite).spriteFrame = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai));
            this._prefabBaopai1.active = false;
        }
        if(this._prefabBaopai2 != null){
            var dian = this._prefabBaopai2.getChildByName("majiang").getChildByName("dian")
            dian.getComponent(cc.Sprite).spriteFrame = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai2));
            this._prefabBaopai2.active = false;
        }
        if(this._prefabBaopai3 != null){
            var dian =  this._prefabBaopai3.getChildByName("majiang").getChildByName("dian")
            dian.getComponent(cc.Sprite).spriteFrame = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai));
            this._prefabBaopai3.active = false;
        }
        if(cc.vv.mahjongMgr._magicPai == -1){
            this.spriteMagic.node.parent.active = false;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi").active = false;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 65;
        }else{
            if(cc.vv.mahjongMgr._magicPai2 != -1){
                if(this._prefabBaopai1 != null){
                    this._prefabBaopai1.active = true;
                    this._prefabBaopai1.emit("dingBaopai");
                }
            }else if(cc.vv.mahjongMgr._magicPai2 == -1){
                if(this._prefabBaopai3 != null){
                    this._prefabBaopai3.active = true;
                    this._prefabBaopai3.emit("dingBaopai");
                }
            }
            setTimeout(() => {
                self.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi").active = true;
                self.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 130;
                self.spriteMagic.node.parent.active = true;
            }, 2300);
        }

        if(cc.vv.mahjongMgr._magicPai2 == -1){
            this.spriteMagic2.node.parent.active = false;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi2").active = false;
        }else{
            if(this._prefabBaopai2 != null){
                this._prefabBaopai2.active = true;
                this._prefabBaopai2.emit("dingBaopai");
            }
            setTimeout(() => {
                self.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi2").active = true;
                self.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 180;
                self.spriteMagic2.node.parent.active = true;
            }, 2300);
        }
    },

    game_magicshow:function(){
        var self = this;
        this.spriteMagic.spriteFrame = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai));
        this.spriteMagic2.spriteFrame = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(cc.vv.mahjongMgr._magicPai2));
        if(cc.vv.mahjongMgr._magicPai == -1){
            this.spriteMagic.node.parent.active = false;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi").active = false;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 65;
        }else{
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi").active = true;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 130;
            this.spriteMagic.node.parent.active = true;
        }

        if(cc.vv.mahjongMgr._magicPai2 == -1){
            this.spriteMagic2.node.parent.active = false;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi2").active = false;
        }else{
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").getChildByName("haozi2").active = true;
            this.node.getChildByName("mgr").getChildByName("game").getChildByName("bg").width = 180;
            this.spriteMagic2.node.parent.active = true;
        }
    },

    //定庄
    game_dingzhuang:function(seatid){
        var self = this;
        var sides = cc.vv.mahjongMgr._sides;
        var sidesLength = sides.length;
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var num = sidesLength * 3 + viewid;
        function showLight(index){
            setTimeout(() => {
                cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/qiangzhuang");
                var position = sides[index % sidesLength];
                var data = {data:{position:position}};
                self._prefabArrow.emit("showLight", data);
            }, index * 100);
        }

        function lastLight(index){
            setTimeout(() => {
                cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_pickBanker");
                var position = sides[index % sidesLength];
                var data = {data:{position:position}};
                self._prefabArrow.emit("lastLight", data);
                self.setZhuang();
            }, index * 100 + 100);
        }

        for (var index = 0; index < num + 1; index++) {
            showLight(index);
            if(index == num){
                lastLight(index);
            }
        }
    },
  
    //第一次操作的人
    game_fristTurnChange:function(){
        var isClick = true;
        this.setPaiClick(isClick);
        this.startArrowNum();

        if(cc.vv.mahjongMgr._turn != -1){
            this.game_showLight(cc.vv.mahjongMgr._turn);
            if(cc.vv.mahjongMgr._turn == cc.vv.roomMgr.seatid){
                if(cc.vv.mahjongMgr._curaction != null){
                    this.showAction(cc.vv.mahjongMgr._curaction);
                }
                
                if(this._datating != null){
                    this.showTingOption(this._datating);
                }
                this.setSelectDown(null);
                cc.vv.mahjongMgr._canChui = true;
            }else{
                var data = {
                    seatIndex:cc.vv.mahjongMgr._turn,
                }
                this.game_mopai(data);
            }
        }
        this._isfrist = true;
    },

    //重连的操作的人
    game_syncTurnChange:function(){
        var isClick = true;
        this.setPaiClick(isClick);
        if(cc.vv.mahjongMgr._turn != -1){
            this.game_showLight(cc.vv.mahjongMgr._turn);
            this.startArrowNum();
            if(cc.vv.mahjongMgr._turn == cc.vv.roomMgr.seatid){
                if(cc.vv.mahjongMgr._curaction != null){
                    this.showAction(cc.vv.mahjongMgr._curaction);
                }
                
                if(this._datating != null){
                    this.showTingOption(this._datating);
                }
                this.setSelectDown(null);
                cc.vv.mahjongMgr._canChui = true;
            }else{
                if(cc.vv.mahjongMgr._chupai != null){
                    return;
                }
                var data = {
                    seatIndex:cc.vv.mahjongMgr._turn,
                }
                this.game_mopai(data);
            }
        }
        this._isfrist = true;
    },

    //第一次操作的人
    game_fristShowAction:function(){
        this._isfristAction = true;
        var data = cc.vv.mahjongMgr._curaction;
        if(data == null)return;
        // this.showAction(data);
    },

    //重连的操作的人
    game_syncShowAction:function(){
        this._isfristAction = true;
        var data = cc.vv.mahjongMgr._curaction;
        if(data == null)return;
        // this.showAction(data);
    },
    
    //第一次ting的人
    game_fristShowTingAction:function(){
        this._isfristTingAction = true;
        var _data = this._datating;
        if(_data == null)return;
        // this.showTingOption(_data);
    },

    //第一次ting的信息
    game_fristShowTing1Action:function(){
        this._isfristTing1Action = true;
        var _data = this._datating1;
        if(_data == null)return;
        this.game_actionting1(_data);
    },
    
    //直接显示牌
    game_no_fapai:function(){
        var self = this;
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var sideName = sides[viewid]; 
            switch(sideName){
                case "myself":
                        //自己的牌
                        var selfViewid = cc.vv.mahjongMgr.getViewidBySide("myself");
                        var selfParent = this.getHoldParent(selfViewid, "holds");
                        selfParent.removeAllChildren();
                        //自己手牌
                        var selfSeatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
                        var pai =  cc.vv.game.sortHolds(selfSeatData);
                        var selfStartIndex = cc.vv.game.getStartIndex(pai);
                        var selfLength = pai.length;
                        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
                        var parent = this.getHoldParent(viewid, "holds");
                        parent.removeAllChildren();
                        //排序麻将
                        var selfPai = cc.vv.game.sortHolds(selfSeatData);
                        var selfStartIndex = cc.vv.game.getStartIndex(selfPai);
                        var selfLength = selfPai.length;
                        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
                            self.showSelfHold(index, selfPai[index - selfStartIndex], selfStartIndex + selfLength - 1);
                        }
                    break;
                case "right":
                        //下家
                        var rightViewid = cc.vv.mahjongMgr.getViewidBySide("right");
                        var rightParent = this.getHoldParent(rightViewid, "holds");
                        rightParent.removeAllChildren();
                        var rightSeatid = cc.vv.roomMgr.realChairID(rightViewid);
                        //下家手牌
                        var rightGangPaiNum = cc.vv.mahjongMgr.getNumberPai(rightSeatid);
                        var rightLength = 13 - rightGangPaiNum;
                        var rightStartIndex = cc.vv.game.getStartIndexByNum(rightLength);
                        var rightPai = -3;
                        for (var index = rightStartIndex; index < rightLength + rightStartIndex; index++) {
                            self.showRightHold(index, rightPai, rightLength + rightStartIndex + 1);
                        }
                break;
                case "up":
                        //对家
                        var topViewid = cc.vv.mahjongMgr.getViewidBySide("up");
                        var topParent = this.getHoldParent(topViewid, "holds");
                        topParent.removeAllChildren();
                        var topSeatid = cc.vv.roomMgr.realChairID(topViewid);
                        //对家手牌
                        var topGangPaiNum = cc.vv.mahjongMgr.getNumberPai(topSeatid);
                        var topLength = 13 - topGangPaiNum;
                        var topStartIndex = cc.vv.game.getStartIndexByNum(topLength);
                        var topPai = -3;
                        for (var index = topStartIndex; index <topStartIndex + topLength; index++) {
                            self.showTopHold(index, topPai, topLength + topStartIndex + 1);
                        }
                break;
                case "left":
                        //上家
                        var leftViewid = cc.vv.mahjongMgr.getViewidBySide("left");
                        var leftParent = this.getHoldParent(leftViewid, "holds");
                        leftParent.removeAllChildren();
                        var leftSeatid = cc.vv.roomMgr.realChairID(leftViewid);
                        //上家手牌
                        var leftGangPaiNum = cc.vv.mahjongMgr.getNumberPai(leftSeatid);
                        var leftLength = 13 - leftGangPaiNum;
                        var leftStartIndex = cc.vv.game.getStartIndexByNum(leftLength);
                        var leftPai = -3;
                        for (var index = leftStartIndex; index < leftStartIndex + leftLength; index++) {
                            self.showLeftHold(index, leftPai, leftLength + leftStartIndex + 1);
                        }
                break;
            }
        }
    },

    //发牌
    game_fapai:function(){
        var self = this;
        //每张牌间隔时间
        var TIME_ITEM = cc.vv.game.config.TIME_ITEM;
        //每3张牌间隔时间
        var TIME_THREE = cc.vv.game.config.TIME_THREE;

        function showSelfHoldTime(index, pai, length){
            var time = index * TIME_ITEM + TIME_THREE * parseInt(index / 4);
            setTimeout(() => {
                self.showSelfHold(index, pai, length);
                if(index % 4 == 0){
                    cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_fapai");
                }
            }, time); 
        }
        function showLefHoldTime(index, pai, length){
            var time = index * TIME_ITEM + TIME_THREE * parseInt(index / 4);
            setTimeout(() => {
                self.showLeftHold(index, pai, length);
            }, time); 
        }
        function showTopHoldTime(index, pai, length){
            var time = 0;
            var time = index * TIME_ITEM + TIME_THREE * parseInt(index / 4);
            setTimeout(() => {
                self.showTopHold(index, pai, length);
            }, time); 
        }
        function showRightHoldTime(index, pai, length){
            var time = index * TIME_ITEM + TIME_THREE * parseInt(index / 4);
            setTimeout(() => {
                self.showRightHold(index, pai, length);
            }, time); 
        }
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var sideName = sides[viewid]; 
            switch(sideName){
                case "myself":
                        //自己的牌
                        var selfViewid = cc.vv.mahjongMgr.getViewidBySide("myself");
                        var selfParent = this.getHoldParent(selfViewid, "holds");
                        selfParent.removeAllChildren();

                        //自己手牌
                        var selfSeatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
                        var pai =  cc.vv.game.sortHolds(selfSeatData);
                        var selfStartIndex = cc.vv.game.getStartIndex(pai);
                        var selfLength = pai.length;
                        for (var index = selfStartIndex; index < selfLength + selfStartIndex; index++) {
                            showSelfHoldTime(index, pai[index - selfStartIndex], selfLength + selfStartIndex);
                            if(index == selfLength + selfStartIndex - 1){
                                var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
                                var parent = this.getHoldParent(viewid, "holds");
                                var time = index * TIME_ITEM + TIME_THREE * parseInt(index / 4) + TIME_THREE;
                                setTimeout(() => {
                                    cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_lipai");
                                    parent.removeAllChildren();
                                    var selfPaihide = -2;
                                    var selfPai = pai;
                                    var selfLength = selfPai.length;
                                    var selfStartIndex = cc.vv.game.getStartIndex(selfPai);
                                    for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
                                        self.showSelfHold(index, selfPaihide, selfStartIndex + selfLength - 1);
                                    }
                                }, time);
                        
                                setTimeout(() => {
                                    parent.removeAllChildren();
                                    //排序麻将
                                    var selfPai = cc.vv.game.sortHolds(selfSeatData);
                                    var selfStartIndex = cc.vv.game.getStartIndex(selfPai);
                                    var selfLength = selfPai.length;
                                    for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
                                        self.showSelfHold(index, selfPai[index - selfStartIndex], selfStartIndex + selfLength - 1);
                                    }
                                }, time + TIME_ITEM * 2);
                            }
                        }
                    break;
                case "right":
                        //下家
                        var rightViewid = cc.vv.mahjongMgr.getViewidBySide("right");
                        var rightParent = this.getHoldParent(rightViewid, "holds");
                        rightParent.removeAllChildren();
                        var rightSeatid = cc.vv.roomMgr.realChairID(rightViewid);
                        //下家手牌
                        var rightGangPaiNum = cc.vv.mahjongMgr.getNumberPai(rightSeatid);
                        var rightLength = 13 - rightGangPaiNum;
                        var rightStartIndex = cc.vv.game.getStartIndexByNum(rightLength);
                        var rightPai = -3;
                        for (var index = rightStartIndex; index < rightLength + rightStartIndex; index++) {
                            showRightHoldTime(index, rightPai, rightLength + rightStartIndex + 1);
                        }
                break;
                case "up":
                    //对家
                    var topViewid = cc.vv.mahjongMgr.getViewidBySide("up");
                    var topParent = this.getHoldParent(topViewid, "holds");
                    topParent.removeAllChildren();
                    var topSeatid = cc.vv.roomMgr.realChairID(topViewid);
                    //对家手牌
                    var topGangPaiNum = cc.vv.mahjongMgr.getNumberPai(topSeatid);
                    var topLength = 13 - topGangPaiNum;
                    var topStartIndex = cc.vv.game.getStartIndexByNum(topLength);
                    var topPai = -3;
                    for (var index = topStartIndex; index <topStartIndex + topLength; index++) {
                        showTopHoldTime(index, topPai, topLength + topStartIndex + 1);
                    }
                break;
                case "left":
                   //上家
                    var leftViewid = cc.vv.mahjongMgr.getViewidBySide("left");
                    var leftParent = this.getHoldParent(leftViewid, "holds");
                    leftParent.removeAllChildren();
                    var leftSeatid = cc.vv.roomMgr.realChairID(leftViewid);
                    //上家手牌
                    var leftGangPaiNum = cc.vv.mahjongMgr.getNumberPai(leftSeatid);
                    var leftLength = 13 - leftGangPaiNum;
                    var leftStartIndex = cc.vv.game.getStartIndexByNum(leftLength);
                    var leftPai = -3;
                    for (var index = leftStartIndex; index < leftStartIndex + leftLength; index++) {
                        showLefHoldTime(index, leftPai, leftLength + leftStartIndex + 1);
                    }
                break;
            }
        }
    },

    //剩余牌数
    game_changeMajiangNum:function(data){
        var count = data.data.count;
        var game = cc.find("Canvas/mgr/game");
        var majiangNum = game.getChildByName("majiangNum").getChildByName("num");
        majiangNum.getComponent(cc.Label).string = count;
    },

    //初始化摸牌
    initMopai:function(seatIndex,pai){
        var viewid = cc.vv.roomMgr.viewChairID(seatIndex);
        var side = cc.vv.mahjongMgr.getSide(viewid);
        
        var sideChild = this.nodeGameRoot.getChildByName(side);
        var lastIndex = cc.vv.game.getMJIndex(side,13);
        var holds = this.getHoldParent(viewid, "holds");

        var seatDataFolds = cc.vv.mahjongMgr._seats[seatIndex];
        var folds = seatDataFolds.folds;
        var foldslength = folds.length;

        if(cc.vv.roomMgr.is_replay){
            switch (side) {
                case "myself":
                        this.showSelfHold(lastIndex, pai);
                    break
                case "right":
                        this.showRightHoldsreplay(lastIndex, pai);
                    break;
                case "up":
                        this.showTopHoldsreplay(lastIndex, pai);
                    break;
                case "left":
                        this.showLeftHoldsreplay(lastIndex, pai);
                    break;
            }
        }else{
            switch (side) {
                case "myself":
                        this.showSelfHold(lastIndex, pai);
                    break
                case "right":
                        this.showRightHold(lastIndex, pai, foldslength);
                    break;
                case "up":
                        this.showTopHold(lastIndex, pai, foldslength);
                    break;
                case "left":
                        this.showLeftHold(lastIndex, pai, foldslength);
                    break;
            }
        }
    },

    //补花
    game_buhua:function(seatData){
        if(seatData.seatIndex == cc.vv.roomMgr.seatid){
            this.initSelfHold();   
            // cc.vv.mahjongMgr._canChui = true;             
        }
        else{
            this.initOtherHold(seatData.seatIndex); 
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
        this.playBuHua(cc.vv.roomMgr.seatid);
        this.playSFX(viewid,"buhua");
        var selfViewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        if (viewid == selfViewid){
            this.hideOptions();
        }
    },

    showTingOption:function(_data){
        if(!this._isfristTingAction)return;
        var self = this;
        self._ting_chupai=[];//报听后可以出的牌
        self.initTingList(_data);//听牌之后存储听牌的集合
        for(var i = 0;i < _data.length;i++)//循环可以出牌的长度
        {
            self._ting_chupai[i] = _data[i].chupai;//循环赋值可以出的牌
            for(var j = 0;j < _data[i].tingpai.length;j++)//循环听牌的长度
            {
                self._ting_tingpai[self._ting_tingpai.length] = _data[i].tingpai[j].pai;//循环赋值听牌集合
            }
        }
        self.addOption("btnTing",0,null);
        self.opts.active = true;
        for(var i = 0; i < self.opts.childrenCount; ++i){
            var child = self.opts.children[i]; 
            if(child.name == "btnGuo"){
                if(data.guo){
                    child.active = true;
                }else{
                    child.active = false;
                }
            }
        }
    },

    game_actionting1:function(_data){
        var self = this;
        if(!this._isfristTing1Action)return;
        self._ting_chupai=[];//报听后可以出的牌
        self.initTingList(_data);//听牌之后存储听牌的集合
        for(var i = 0;i < _data.length;i++)//循环可以出牌的长度
        {
            self._ting_chupai[i] = _data[i].chupai;//循环赋值可以出的牌
            //显示箭头
            for(var j = 0;j < _data[i].tingpai.length;j++)//循环听牌的长度
            {
               self._ting_tingpai[self._ting_tingpai.length] = _data[i].tingpai[j].pai;//循环赋值听牌集合
            }
        }
        self.showTing(self._ting_chupai);
    },

    //广播下一个操作者
    game_turnChange:function(data){
        var self = this;
        if(this._isfrist){
            if(data.last != -1){
                self.setSelectDown(null);
                cc.vv.mahjongMgr._canChui = false;
                //出的牌飞入牌堆
                self.game_chupaiLast();
            }
            if(data.turn != -1){
                self.game_showLight(data.turn);
                self.startArrowNum();
                if(data.turn == cc.vv.roomMgr.seatid){
                    var selfdata = data.data;
                    if(selfdata != null){
                        if(selfdata.game_action_push != null){
                            self.showAction(selfdata.game_action_push);
                        }
                        
                        if(selfdata.game_action_ting != null && selfdata.game_action_ting.data != null){
                            self.showTingOption(selfdata.game_action_ting.data);
                        }
                    }
                    setTimeout(() => {
                        var isClick = true;
                        self.setPaiClick(isClick);
                        cc.vv.mahjongMgr._canChui = true;
                    }, 100);
                }else{
                    var data = {
                        seatIndex:data.turn,
                    }
                    self.game_mopai(data);
                }
            }
        }
    },

    //出牌
    game_chupai:function(data){
        var self = this;
        var seatData = data.seatData;
        if(data.baoting == undefined || data.baoting == 0){
            var pai = data.pai;
            var index = data.index;
            var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
            var seatDataFolds = cc.vv.mahjongMgr._seats[seatData.seatIndex];
            var folds = seatDataFolds.folds;
            folds.push(pai);
            var foldslength = folds.length - 1;

            var callback = function(seatid, chuPaiindex){
                //如果是自己，则整理手牌
                if(seatData.seatIndex == cc.vv.roomMgr.seatid){
                    // if(!cc.vv.roomMgr.is_replay){
                        // self.initMahjongs(seatid, chuPaiindex);
                        self.initSelfHold();
                        if (self._baoting == 1){
                            self.onclick_see_ting();
                        } 
                        self.game_chupaiLast(); 
                    // }else{
                        // self.initSelfHold();
                    // } 
                }else{
                    self.initOtherHold(seatid);
                }
                if(!cc.vv.roomMgr.param.too_hu_must_zimo){//2  3 耗子玩法 //过胡后只能自摸胡
                    self.hideGuohuOne(seatData.seatIndex);      
                }
            }
            this.chupaiShow(viewid, index, pai, seatData.seatIndex, foldslength, callback);
        }else{
            var pai = -2;
            var index = 13;
            if(cc.vv.roomMgr.is_replay){
                var index = data.index;
            }
            var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);    
            var seatDataFolds = cc.vv.mahjongMgr._seats[seatData.seatIndex];
            var folds = seatDataFolds.folds;
            //如果是自己，则整理手牌
            if(seatData.seatIndex == cc.vv.roomMgr.seatid){
                self.initSelfHold();
                if (self._baoting == 1){
                    self.onclick_see_ting();
                } 
            }else{
                
                self.initOtherHold(seatData.seatIndex, true);
            }
            folds.push(pai);
             
            var paiReturn = cc.vv.mahjongMgr.getMahjongPai(pai);
            var indexK = folds.length - 1;
            var end = indexK + 1;
            var callbackFunc = function(){
                var seatid = cc.vv.roomMgr.realChairID(viewid);
                cc.vv.folds.setSpritePointer(seatid,index,true);
            }
            self.showFolds(viewid, indexK, paiReturn, end, callbackFunc);

            if(!cc.vv.roomMgr.param.too_hu_must_zimo){//2  3 耗子玩法 //过胡后只能自摸胡
                self.hideGuohuOne(seatData.seatIndex);      
            }
        }
        if(cc.vv.roomMgr.is_replay && seatData.seatIndex == cc.vv.roomMgr.seatid){
            if(!cc.vv.roomMgr.param.too_hu_must_zimo){
                this.hideGuohu();
            }
            if(cc.vv.game.config.isGuoPeng){
                this.hideGuoPeng();
            }
            this.hideting();
            this.hideOptions();
            this.hideChipaiOpts();
            this.hideGangPaiOpts();
            this.hideTingOpts();
        }
        cc.vv.mahjongMgr._curaction = data.baoTing_index;
        var audioUrl = cc.vv.mahjongMgr.getAudioURLByMJID(cc.vv.mahjongMgr.getMahjongPaiThree(data.pai));
        if(data.baoting == undefined || data.baoting == 0){
            this.playSFX(viewid,audioUrl);
        }else{
            if(cc.vv.game.config.isBaoting){
                setTimeout(() => {
                    self.playSFX(viewid,audioUrl);
                }, 300);
            }
        }
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    game_chupai_advance:function(data){
        var self = this;
        var seatData = data.seatData;
        if(data.baoting == undefined || data.baoting == 0){
            var pai = data.pai;
            var index = data.index;
            var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
            var seatDataFolds = cc.vv.mahjongMgr._seats[seatData.seatIndex];
            var folds = seatDataFolds.folds;
            folds.push(pai);
            var foldslength = folds.length - 1;

            var callback = function(seatid, chuPaiindex){
                //如果是自己，则整理手牌
                if(seatData.seatIndex == cc.vv.roomMgr.seatid){
                    // if(!cc.vv.roomMgr.is_replay){
                        // self.initMahjongs(seatid, chuPaiindex);
                        self.initSelfHold();
                        if (self._baoting == 1){
                            self.onclick_see_ting();
                        } 
                        self.game_chupaiLast(); 
                    // }else{
                        // self.initSelfHold();
                    // } 
                }else{
                    self.initOtherHold(seatid);
                }
                if(!cc.vv.roomMgr.param.too_hu_must_zimo){//2  3 耗子玩法 //过胡后只能自摸胡
                    self.hideGuohuOne(seatData.seatIndex);      
                }
            }
            this.chupaiShow(viewid, index, pai, seatData.seatIndex, foldslength, callback);
        }else{
            var pai = -2;
            var index = 13;
            if(cc.vv.roomMgr.is_replay){
                var index = data.index;
            }
            var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);    
            var seatDataFolds = cc.vv.mahjongMgr._seats[seatData.seatIndex];
            var folds = seatDataFolds.folds;
            //如果是自己，则整理手牌
            if(seatData.seatIndex == cc.vv.roomMgr.seatid){
                self.initSelfHold();
                if (self._baoting == 1){
                    self.onclick_see_ting();
                } 
            }else{
                
                self.initOtherHold(seatData.seatIndex, true);
            }
            folds.push(pai);
             
            var paiReturn = cc.vv.mahjongMgr.getMahjongPai(pai);
            var indexK = folds.length - 1;
            var end = indexK + 1;
            var callbackFunc = function(){
                var seatid = cc.vv.roomMgr.realChairID(viewid);
                cc.vv.folds.setSpritePointer(seatid,index,true);
            }
            self.showFolds(viewid, indexK, paiReturn, end, callbackFunc);

            if(!cc.vv.roomMgr.param.too_hu_must_zimo){//2  3 耗子玩法 //过胡后只能自摸胡
                self.hideGuohuOne(seatData.seatIndex);      
            }
        }
        cc.vv.mahjongMgr._curaction = data.baoTing_index;
        var audioUrl = cc.vv.mahjongMgr.getAudioURLByMJID(cc.vv.mahjongMgr.getMahjongPaiThree(data.pai));
        if(data.baoting == undefined || data.baoting == 0){
            this.playSFX(viewid,audioUrl);
        }else{
            if(cc.vv.game.config.isBaoting){
                setTimeout(() => {
                    self.playSFX(viewid,audioUrl);
                }, 300);
            }
        }
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    //摸牌
    game_mopai:function(data){
        var self = this;
        //{seatIndex:seatIndex,pai:pai,is_auto:is_auto}
        if(data.seatIndex == cc.vv.roomMgr.seatid){
            var pai = data.pai;
            this._guo_pai=pai;
            this._tinghuhoupai = data.is_auto;
            // cc.vv.mahjongMgr._canChui = true;
           
            this.initMopai(data.seatIndex,pai);

            if(this._baoting== 1){
                self._baotingchupai=true//报听后自动出牌
            }
            // if (self._baoting == 1 && data.is_auto == 0)
            // {
            //     var fn = function(){
            //         cc.vv.net2.quick('chupai',{pai:pai,baoting:0,index:13});
            //         if (self._baoting == 1){
            //             self.onclick_see_ting();
            //         }
            //     }
            //     setTimeout(fn,500);//包听后自动出牌，延迟0.5秒。
            //  }
        }else{
            if(cc.vv.replayMgr.isReplay()){
                this.initMopai(data.seatIndex, data.pai);
            }else{
                this.initMopai(data.seatIndex, -3);
            }
        }
    },

    //过
    game_guo:function(){
        this.hideOptions();
        this.hideChipaiOpts();
        this.hideGangPaiOpts();
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    //碰
    game_peng:function(data){
        var self = this;
        cc.vv.folds.hideChupai();
        cc.vv.folds.initPointer();
        var seatData = data.seatData;
        if(seatData.seatIndex == cc.vv.roomMgr.seatid){ 
            //更新手牌
            this.initSelfHold();   
            // cc.vv.mahjongMgr._canChui = true;
        }else{
             //更新手牌
            this.initOtherHold(seatData.seatIndex); 
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
        //播放动画
        var isgang = false;
       
        
        this.PlayEfxAnim(viewid, "play_peng", function(){
           
        });
        
        function callback(callbackdata) {
            var seatData = callbackdata.seatData;
            var pengpai = callbackdata.pengpai;
            var paiItem = pengpai[1];
            var pai = [pengpai[0], paiItem, paiItem, paiItem, paiItem];
            //播放动画
            var isgang = false;
            self.playChipeng(seatData.seatIndex, pai, isgang);
            if(cc.vv.mahjongMgr._canChui){
                var isClick = true;
                self.setPaiClick(isClick);
            }
        }

        setTimeout(callback(data) , 500);
        this.playSFX(viewid, "peng");
        this.hideOptions();
        this.hideChipaiOpts();
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    //吃
    game_chi:function(data){
        var self = this;
        cc.vv.folds.hideChupai();
        cc.vv.folds.initPointer();
        var seatData = data.seatData;
        if(seatData.seatIndex == cc.vv.roomMgr.seatid){ 
             //更新手牌 
            this.initSelfHold(); 
            // cc.vv.mahjongMgr._canChui = true;
        }else{
             //更新手牌 
            this.initOtherHold(seatData.seatIndex); 
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);

        this.PlayEfxAnim(viewid, "play_chi", function(){
            
        });

        function callback(callbackdata) {
            var seatData = callbackdata.seatData;
            var chipai = callbackdata.chipai;
            var pai = [chipai[0], chipai[1], chipai[2], chipai[3], chipai[2]];
            //播放动画
            var isgang = false;
            self.playChipeng(seatData.seatIndex, pai, isgang);
            if(cc.vv.mahjongMgr._canChui){
                var isClick = true;
                self.setPaiClick(isClick);
            }
        }
        setTimeout(callback(data) , 500);
        this.playSFX(viewid, "chi");
        this.hideOptions();
        this.hideChipaiOpts();
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    //杠
    game_gang:function(data){
        var self = this;
        cc.vv.folds.initPointer();
        cc.vv.folds.hideChupai();
        var seatData = data.seatData;
        if(seatData.seatIndex == cc.vv.roomMgr.seatid){
            //更新手牌 
            this.initSelfHold(); 
            // cc.vv.mahjongMgr._canChui = true;             
        }else{
            //更新手牌 
            this.initOtherHold(seatData.seatIndex); 
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
        this.PlayEfxAnim(viewid, "play_gang", function(){
            
        });
        function callback(callbackdata) {
            var seatData = callbackdata.seatData;
            var gangtype = callbackdata.gangtype;
            var gangpai = callbackdata.gangpai;
            if(gangtype == ACTION_WANGGANE){
                var paiItem = gangpai[1];
                var index = cc.vv.mahjongMgr.getWangIndex(seatData, paiItem);
                var parent = self.getHoldParent(viewid, "penggangs");
                var myTag = viewid + "_nodeChipenggang_" + index;
                var nodeParent = cc.vv.utils.getChildByTag(parent,myTag);
                var tagfour = viewid + "_chipenggang_" + index + "_"  + 3;
                self.gangAnimation(nodeParent, tagfour, viewid);
                self.guafengAnimation(viewid);
            }else if(gangtype == ACTION_ANGANE){
                //播放动画
                var isgang = true;
                var paiItem = gangpai[1];
                var pai = [gangpai[0], -2, -2, -2, paiItem];
                self.playChipeng(seatData.seatIndex, pai, isgang);
                self.xiayuAnimation(viewid);
            }else{
                //播放动画
                var isgang = true;
                var paiItem = gangpai[1];
                var pai = [gangpai[0], paiItem, paiItem, paiItem, paiItem];
                self.playChipeng(seatData.seatIndex, pai, isgang);
                self.guafengAnimation(viewid);
            }
            if(cc.vv.mahjongMgr._canChui){
                var isClick = true;
                self.setPaiClick(isClick);
            }
        }

        setTimeout(callback(data) , 500);
        this.playSFX(viewid, "gang");
        this.hideChipaiOpts();
        this.hideGangPaiOpts();
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    //胡
    game_hu:function(data){
        var self = this;
        //如果不是玩家自己，则将玩家的牌都放倒
        var seatIndex = data.seatIndex;
        var viewid = cc.vv.roomMgr.viewChairID(seatIndex);
        var viewSelf = cc.vv.mahjongMgr.getViewidBySide("myself");
        if(viewid == viewSelf){
            this.hideOptions();
            this.hideChipaiOpts();
            this.hideGangPaiOpts();
        }

        var seatData = cc.vv.mahjongMgr._seats[seatIndex];
        seatData.hued = true;
        if(data.isqiangganghu){
            var isqiangganghuSeatIndex = data.dianpao_seatIndex;
            var isqiangganghuViewid = cc.vv.roomMgr.viewChairID(isqiangganghuSeatIndex);
            var seatDataFolds = cc.vv.mahjongMgr._seats[isqiangganghuSeatIndex];
            var folds = seatDataFolds.folds;
            var foldslength = folds.length;

            var myTag = isqiangganghuViewid  + "_chupai_" + foldslength;
            //出的牌飞入牌堆
            var info = {
                
            }
            var parentchupai = this.getHoldParent(isqiangganghuViewid, "holdschupai");
            this.send_card_emit(parentchupai, "nodeDestroy", info, myTag);
        }
        if(data.iszimo){
            if(seatData.seatIndex == cc.vv.roomMgr.seatid){
                seatData.holds.pop();
                this.initSelfHold();                
            }else{
                //更新手牌
                this.initOtherHold(seatData.seatIndex, true);
            }
            if(data.pattern == "平胡"){
                cc.vv.mahjongMgr.switchHuMp3(viewid,"自摸");     
            }else{
                cc.vv.mahjongMgr.switchHuMp3(viewid,data.pattern);    
            }          
            this.PlayEfxAnim(viewid,"play_zimo",function(){
                //显示胡牌
                self.initHupai(viewid, data.hupai, data.turn, data.foldslength);
            });
        }else{
            var seatDataFoldsTurn = cc.vv.mahjongMgr._seats[cc.vv.mahjongMgr._turn];
            var foldsTurn = seatDataFoldsTurn.folds;
            foldsTurn.pop();
            cc.vv.folds.initPointer();
            cc.vv.folds.hideChupai();
            cc.vv.mahjongMgr.switchHuMp3(viewid,data.pattern);           
            this.PlayEfxAnim(viewid,"play_hu",function(){
                //显示胡牌
                self.initHupai(viewid, data.hupai, data.turn, data.foldslength);
            });
        }
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
    },

    //出牌限制
    game_chupaiLimit:function(data){

    },

    //报听
    game_baoTing:function(data){
        var localSeat = data.userid;
        var localIndex = cc.vv.roomMgr.getSeatIndexByID(localSeat);
        var viewid = cc.vv.roomMgr.viewChairID(localIndex);
        this.PlayEfxAnim(viewid,"play_ting",function(){

        });
        this.playSFX(viewid,"ting");
        var viewSelf = cc.vv.mahjongMgr.getViewidBySide("myself");
        if (viewid == viewSelf){
            this.hideGangPaiOpts();
            this.hideOptions();
            this.hideChipaiOpts();
        }
    },

    //倒牌
    game_daopai:function(data){
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            //1.删除手牌
            var viewid = cc.vv.roomMgr.viewChairID(index);
            var parent = this.getHoldParent(viewid, "holds");
            parent.removeAllChildren();
            //2.根据小结算中每个人的手牌做出倒牌动作
            var holdsPai = data[index].holds;
            cc.vv.mahjongMgr.sortMJ(holdsPai, cc.vv.mahjongMgr._magicPai, cc.vv.mahjongMgr._magicPai2);
            var startIndex = cc.vv.game.getStartIndex(holdsPai);
            var length = holdsPai.length;
            for (var indexk = startIndex; indexk < length + startIndex; indexk++) {
                this.showHoldHoldsreplay(viewid, indexk, holdsPai[indexk - startIndex], startIndex + length - 1);
            }
        }
        cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_lipai");
    },  

    //小结算
    game_jiesuan:function(data){
        var self = this;
        this.hideTingOpts();
        this.table = cc.vv.game.table;
        cc.vv.roomMgr.dissroom = data.dissroom;
        if(this.table._winDissroom!=null){
            this.table._winDissroom.active = true;
        }
        //隐藏解散房间
        this.table.hide_dismiss_room();
        self._baoting = 0;//重新开始后听牌变量取消
        self._baotingchupai = false;//报听后自动出牌重置
        var FlowBureau = false; //是否是流局
        cc.find("Canvas/mgr/hud/oper/btn_ting").active = false;
        if(cc.vv.game.config.is_showtingdown){
            cc.find("Canvas/open/see_ting_Pai_hs").active = false;
            cc.find("Canvas/open/huSprite").active = false;
        }
        cc.find("Canvas/open/see_ting_Pai").active = false;
        cc.find("Canvas/open/tingPaiList").active = false;
        self._showActoin_yse_not = false;
        var results = data.results;
        for(var i = 0; i <  cc.vv.mahjongMgr._seats.length; ++i){
            cc.vv.mahjongMgr._seats[i].score = results.length == 0? 0:results[i].totalscore;
        }

        for(var i = 0; i < results.length; ++i){
            for(var j = 0; j < results[i].huinfo.length; ++j){
                if(results[i].huinfo[j].ishupai){
                    FlowBureau = true;//有人胡牌就不算流局
                }
            }
        }

        if (FlowBureau==true){
            self.nodeJiesuan.getChildByName("helpbg").getChildByName("result_flow").active = false;
        }else{
            self.nodeJiesuan.getChildByName("helpbg").getChildByName("result_flow").active = true;
        }

        //隐藏庄家图标
        this.table.seat_emit(null,"dingzhuang",{seatid:null});
     
        if(!this._stage97 && FlowBureau){
            this.game_daopai(data.results);
            if(cc.vv.game.config.is_time_jiesuan){
                if(self.nodeJiesuan){
                    self.nodeJiesuan.active = true; 
                }
            }else{
                setTimeout(() => {
                    if(self.nodeJiesuan){
                        self.nodeJiesuan.active = true; 
                    }
                }, 2500);
            }
        }else{
            this.nodeJiesuan.active = true;
            this._stage97 = false;
        }
       
        //如果是回放 就隐藏 分享和确定按钮  
        if(cc.vv.roomMgr.is_replay){
            var selt=self;
            selt.nodeJiesuan.getChildByName("btn_ready").active=false;
            selt.nodeJiesuan.getChildByName("btn_share").active=false;
            selt.nodeJiesuan.active=true;
        }
        self.nodeJiesuan.getChildByName("roomid").getComponent(cc.Label).string = cc.vv.roomMgr.roomid;

        var wanfa = this.nodeJiesuan.getChildByName("wanfaninfo").getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.roomMgr.enter.desc;

        this.nodeJiesuan.getChildByName("time").getComponent(cc.Label).string = data.time;
        var jushu = this.nodeJiesuan.getChildByName("top").getChildByName("left").getChildByName("juNum").getChildByName("bg").getChildByName("label");
        jushu.getComponent(cc.Label).string = data.round;
        //输赢情况
        var myscore = results[cc.vv.roomMgr.seatid].score;
        if(myscore >= 0){
            var bglos = this.nodeJiesuan.getChildByName("top").getChildByName("bglos");
            bglos.getComponent(cc.Sprite).spriteFrame = this.jiesuanAtlasThreeD.getSpriteFrame("bgwin");
            cc.vv.audioMgr.playSFX("win");
            var label = this.nodeJiesuan.getChildByName("top").getChildByName("right").getChildByName("light").getChildByName("label");
            label.getComponent(cc.Sprite).spriteFrame = this.jiesuanAtlasThreeD.getSpriteFrame("isheng_0");
            var light = this.nodeJiesuan.getChildByName("top").getChildByName("right").getChildByName("light");
            light.getComponent(cc.Sprite).spriteFrame = this.jiesuanAtlasThreeD.getSpriteFrame("ishengeff_0");
        }     
        else if(myscore < 0){
            var bglos = this.nodeJiesuan.getChildByName("top").getChildByName("bglos");
            bglos.getComponent(cc.Sprite).spriteFrame = this.jiesuanAtlasThreeD.getSpriteFrame("bglos");
            cc.vv.audioMgr.playSFX("lose");
            var label = this.nodeJiesuan.getChildByName("top").getChildByName("right").getChildByName("light").getChildByName("label");
            label.getComponent(cc.Sprite).spriteFrame = this.jiesuanAtlasThreeD.getSpriteFrame("isheng_1");
            var light = this.nodeJiesuan.getChildByName("top").getChildByName("right").getChildByName("light");
            light.getComponent(cc.Sprite).spriteFrame = this.jiesuanAtlasThreeD.getSpriteFrame("ishengeff_1");
        }
        
        var seat = [];
        var seatself = [];
        var listRoot = this.nodeJiesuan.getChildByName("result_list");
        for(var i = 1; i <= 4; ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);

            //隐藏少人场牌
            if(i>cc.vv.roomMgr.ren){
                sn.active = false;
                continue;
            }

            var viewdata = {};
            var f = sn.getChildByName('fan');
            if(f != null){
                viewdata.fan = f.getComponent(cc.Label);    
            }

            viewdata.username = sn.getChildByName("left").getChildByName('username').getComponent(cc.Label);
            viewdata.userid = sn.getChildByName("left").getChildByName('userid').getComponent(cc.Label);
            viewdata.zhuang = sn.getChildByName("left").getChildByName('zhuang');
            viewdata.img = sn.getChildByName("left").getChildByName('head').getChildByName("img");
            viewdata.guohu = sn.getChildByName("left").getChildByName('head').getChildByName("guohu");
            viewdata.ting = sn.getChildByName("left").getChildByName('ting');

            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.hupai = sn.getChildByName('hupai');
            viewdata.reason = sn.getChildByName('reason').getComponent(cc.Label);

            viewdata.win = sn.getChildByName("right").getChildByName('win');
            viewdata.score = sn.getChildByName("right").getChildByName('score').getComponent(cc.Label);
            viewdata.winNum = sn.getChildByName("right").getChildByName('winNum').getComponent(cc.Label);

            if(cc.vv.game.config.is_showgangfen){
                viewdata.gangscore = sn.getChildByName("right").getChildByName('gangscore').getComponent(cc.Label);
            }

            if(cc.vv.game.config.is_showzimo){
                viewdata.zimo = sn.getChildByName("right").getChildByName('zimo');
            }
            
            viewdata.checkmark = sn.getChildByName('checkmark');
            viewdata._pengandgang = [];
            seat.push(viewdata);

            var selfn = this.nodeJiesuan.getChildByName("top").getChildByName("right").getChildByName("self");

            var viewdataself = {};
            viewdataself.username = selfn.getChildByName('username').getComponent(cc.Label);
            viewdataself.userid = selfn.getChildByName('userid').getComponent(cc.Label);
            
            viewdataself.score = selfn.getChildByName('score').getComponent(cc.Label);
            viewdataself.zhuang = selfn.getChildByName('zhuang');
            viewdataself.img = selfn.getChildByName('head').getChildByName("img");
            viewdataself.ting = selfn.getChildByName('ting');
            
            seatself.push(viewdataself);
        }
        var indexself = 0;
        //显示玩家信息
        for(var i = 0; i < cc.vv.mahjongMgr._seats.length; ++i){
            var seatid = cc.vv.roomMgr.getSeatIndexByID(cc.vv.roomMgr.table.list[i].userid);
            if(seatid == cc.vv.roomMgr.seatid){
                indexself = i;
            }
        }
        //显示玩家信息
        for(var i = 0; i < cc.vv.mahjongMgr._seats.length; ++i){
            var uiIndex = 0;
            if(i == indexself){
                uiIndex = 0;
            }else if(i < indexself){
                uiIndex = i + 1;
            }else if(i > indexself){
                uiIndex = i;
            }
            var seatView = seat[uiIndex];
            var userData = results[i];
            var hued = false;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            var hupaiRoot = seatView.hupai;
            seatView.img.getComponent("ImageLoader").loadImg(userData.headimg);
            hupaiRoot.active = false;
            var viewid = cc.vv.roomMgr.viewChairID(i);
            self.table.seat_emit(viewid,"score",results[i].totalscore);
            seatView.ting.active = userData.baoting == 1;
            var isSanguiyi = userData.isThreePaoOne;
            //显示牌
            var hi = 0;
            if(userData.huinfo.length == 0){
                var str = ""
                if(cc.vv.game.config.isGangfen && !cc.vv.game.config.is_showgangfen){
                    str += " 杠分:" + userData.gangfen_tq;
                }
                if(cc.vv.game.config.isTinghougang)
                {
                    str += " 听前杠:" + userData.gangfen_tq;
                    str += " 听后杠:" + userData.gangfen_th;   
                }
                if(cc.vv.game.config.is_lastGenZhuangSuccess){
                    if(userData.lastGenZhuangSuccess){
                        str += " 上局跟庄";
                    }
                }
                if(cc.vv.game.config.is_lastLiuJuSuccess){
                    if(userData.lastLiuJuTag){
                        str += " 上局流局:" + userData.lastLiuJuScore;
                    }
                }
                if(cc.vv.game.config.isLianzhuang){
                    str += " 庄分:" + userData.lianZhuangFen;
                }
                if(cc.vv.game.config.isXiayu){
                    if(userData.fish != 0){
                        str += " 下鱼:" + userData.fish;
                    }
                }
                if(userData.ganghua){
                    str += " 杠上开花";
                }
                if(userData.genZhuang && userData.genZhuang != 0){
                    str += " 跟庄:" + userData.genZhuang;
                }
                str += " 胡分:"  + userData.hufen;
                actionArr.push(str);
            }
            if(cc.vv.game.config.is_showzimo){
                seatView.zimo.active = false;
            }
            seatView.win.active = false;
            for(var j = 0; j < userData.huinfo.length; ++j){
                var dataseat = userData;
                if(j >= 1)continue;
                var info = userData.huinfo[j];
                hued = hued || info.ishupai;
                if(info.ishupai){
                    hupaiRoot.active = true;
                    var sprite = hupaiRoot.getChildByName("MyMahJongPai").getComponent(cc.Sprite);    
                    sprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("M_",info.pai);
                    var mask = hupaiRoot.getChildByName("magic_mash");    
                    if(info.pai == cc.vv.mahjongMgr._magicPai || info.pai == cc.vv.mahjongMgr._magicPai2){
                        mask.active = true;
                    }else{
                        mask.active = false;
                    }                                    
                }
    
                var str = ""
                if(!info.ishupai){
                    str =info.action;
                    if(cc.vv.game.config.isGangfen && !cc.vv.game.config.is_showgangfen){
                        str += " 杠分:" + dataseat.gangfen_tq;
                    }
                    if(cc.vv.game.config.isTinghougang)
                    {
                        str += " 听前杠:" + dataseat.gangfen_tq;
                        str += " 听后杠:" + dataseat.gangfen_th;   
                    }
                    if(cc.vv.game.config.is_lastGenZhuangSuccess){
                        if(dataseat.lastGenZhuangSuccess){
                            str += " 上局跟庄";
                        }
                    }
                    if(cc.vv.game.config.is_lastLiuJuSuccess){
                        if(dataseat.lastLiuJuTag){
                            str += " 上局流局:" + dataseat.lastLiuJuScore;
                        }
                    }
                    if(cc.vv.game.config.isLianzhuang){
                        str += " 庄分:" + dataseat.lianZhuangFen;
                    }
                    if(dataseat.ganghua){
                        str += " 杠上开花";
                    }
                    if(dataseat.genZhuang && dataseat.genZhuang != 0){
                        str += " 跟庄:" + dataseat.genZhuang;
                    }
                    if(cc.vv.game.config.isXiayu){
                        if(dataseat.fish != 0){
                            str += " 下鱼:" + dataseat.fish;
                        }
                    }
                    if(info.isQiangGangHu){
                        str += " 抢杠胡";
                    }
                    str += " 胡分:" + dataseat.hufen;
                    
                    dataseat = results[info.target]; 
                    info = dataseat.huinfo[info.index];
                  
                }else{
                    str = info.action;
                    if(info.isKanHu){
                        if(cc.vv.game.config.is_kanhu){
                            str += " 砍胡";
                        }
                    }
                    if(info.iszimo){
                        str += " 自摸";
                    }
                    if(cc.vv.game.config.isGangfen && !cc.vv.game.config.is_showgangfen){
                        str += " 杠分:" + dataseat.gangfen_tq;
                    }
                    if(cc.vv.game.config.isTinghougang)
                    {
                        str += " 听前杠:" + dataseat.gangfen_tq;
                        str += " 听后杠:" + dataseat.gangfen_th;   
                    }
                    if(cc.vv.game.config.is_lastGenZhuangSuccess){
                        if(dataseat.lastGenZhuangSuccess){
                            str += " 上局跟庄";
                        }
                    }
                    if(cc.vv.game.config.is_lastLiuJuSuccess){
                        if(dataseat.lastLiuJuTag){
                            str += " 上局流局:" + dataseat.lastLiuJuScore;
                        }
                    }
                    if(cc.vv.game.config.isLianzhuang){
                        str += " 庄分:" + dataseat.lianZhuangFen;
                    }
                    if(dataseat.ganghua){
                        str += " 杠上开花";
                    }
                    if(dataseat.genZhuang && dataseat.genZhuang != 0){
                        str += " 跟庄:" + dataseat.genZhuang;
                    }
                    if(cc.vv.game.config.isXiayu){
                        if(dataseat.fish != 0){
                            str += " 下鱼:" + dataseat.fish;
                        }
                    }  
                    if(info.isQiangGangHu){
                        str += " 抢杠胡";
                    }
                    str += " 胡分:" + dataseat.hufen;                                        
                }
                actionArr.push(str);

                if(cc.vv.game.config.is_showzimo){
                    if(info.ishupai && info.iszimo){
                        seatView.zimo.active = hued;    
                    }else{
                        seatView.win.active = hued;    
                    }
                }
            }
            if(!cc.vv.game.config.is_showzimo){
                seatView.win.active = hued;
            }

            if(userData.lianZhuangNum > 0  && FlowBureau){
                seatView.winNum.string = "*" + userData.lianZhuangNum;
                seatView.winNum.node.active = true;
            }else{
                seatView.winNum.node.active = false;
            }
            seatView.guohu.active = userData.isguohu;
            //是否是一炮三响
            if(cc.vv.game.config.is_sanguiyi && isSanguiyi){
                seatView.win.active = !hued;  
            }
            seatView.username.string = cc.vv.roomMgr.table.list[i].nickname;
            seatView.userid.string = cc.vv.roomMgr.table.list[i].userid;
            seatView.zhuang.active = cc.vv.mahjongMgr._button == i;
            if(uiIndex == 0){
                var seatViewself = seatself[uiIndex];
                seatViewself.username.string = cc.vv.roomMgr.table.list[i].nickname;
                seatViewself.userid.string = cc.vv.roomMgr.table.list[i].userid;
                seatViewself.zhuang.active = cc.vv.mahjongMgr._button == i;
                seatViewself.img.getComponent("ImageLoader").loadImg(userData.headimg);
                seatViewself.ting.active = userData.baoting == 1;
                if(userData.score >= 0){
                    seatViewself.score.font = self.winFont;
                    seatViewself.score.string = "+" + userData.score;  
                }else{
                    seatViewself.score.font = self.lostFont;
                    seatViewself.score.string = userData.score;
                }
            }
            if(cc.vv.game.config.is_showgangfen){
                seatView.gangscore.string = userData.gangfen_tq;
                seatView.score.string = userData.score;
                seatView.reason.node.color = new cc.Color(66, 21, 0);
                seatView.reason.string = actionArr.join(" ");
            }else{
                if(userData.score >= 0){
                    seatView.score.font = self.winFont;
                    seatView.score.string = "+" + userData.score;  
                    seatView.reason.node.color = new cc.Color(255, 73, 73);
                    seatView.reason.string = actionArr.join(" ");
                }else{
                    seatView.score.font = self.lostFont;
                    seatView.score.string = userData.score;
                    seatView.reason.node.color = new cc.Color(132, 255, 75);
                    seatView.reason.string = actionArr.join(" ");
                }
            }
               
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
    
            var magicPai = cc.vv.mahjongMgr._magicPai;
            var magicPai2 = cc.vv.mahjongMgr._magicPai2;
            cc.vv.mahjongMgr.sortMJ(userData.holds,magicPai,magicPai2);
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var lackingNum = (userData.pengs.length + numOfGangs)*3;

            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;

                var sprite = n.getChildByName("MyMahJongPai").getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("M_",pai);

                var mask = n.getChildByName("magic_mash");    
                if(pai ==  cc.vv.mahjongMgr._magicPai || pai == cc.vv.mahjongMgr._magicPai2){
                    mask.active = true;
                }else{
                    mask.active = false;
                }                
            }
                
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var targetSide = -1; 
            var index = 0;
            var gangs = userData.angangs;
            var localIndex = cc.vv.roomMgr.viewChairID(userData.seatIndex);
            var side = cc.vv.mahjongMgr.getSide(localIndex);
            for(var k = 0; k < gangs.length; ++k){
                targetSide = cc.vv.mahjongMgr.getTargetSide(userData,gangs[k][0]);
                var mjid = [gangs[k][1],gangs[k][2],gangs[k][3],gangs[k][4]];
                this.initPengAndGangsAndChi(seatView,side,targetSide,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                targetSide = cc.vv.mahjongMgr.getTargetSide(userData,gangs[k][0]); 
                var mjid = [gangs[k][1],gangs[k][2],gangs[k][3],gangs[k][4]];
                this.initPengAndGangsAndChi(seatView,side,targetSide,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                targetSide = cc.vv.mahjongMgr.getTargetSide(userData,gangs[k][0]);   
                var mjid = [gangs[k][1],gangs[k][2],gangs[k][3],gangs[k][4]];
                this.initPengAndGangsAndChi(seatView,side,targetSide,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    targetSide = cc.vv.mahjongMgr.getTargetSide(userData,pengs[k][0]);  
                    var mjid = [pengs[k][1],pengs[k][1],pengs[k][1]];
                    this.initPengAndGangsAndChi(seatView,side,targetSide,index,mjid,"peng");
                    index++;    
                } 
            }
        }
        this.unschedule(this.otherTimeUpdate);
        cc.vv.mahjongMgr.reset(); 
        this.reset();
    },

     //大结算
    game_report:function(data){
        var self = this;
        this.table = cc.vv.game.table;
        this.nodeReport.active = true;
        this.nodeJiesuan.active = false;
        if(this.table._winDissroom!=null){
            this.table._winDissroom.active = true;
        }
        //隐藏解散房间
        this.table.hide_dismiss_room();
        var list = this.nodeReport.getChildByName("list1");
        // list.removeAllChildren();
        for (var index = 0; index < list.childrenCount; index++) {
            var item = list.getChildByName("s" + (index + 1));
            item.active = false;
        }
        //房间号、日期
        this.nodeReport.getChildByName("roomid").getComponent(cc.Label).string = data.roomid;
        this.nodeReport.getChildByName("time").getComponent(cc.Label).string = data.time;
        cc.find("Canvas/open/see_ting_Pai").active = false;
        if(cc.vv.popMgr.get_open("Pwb_tips")){
            cc.vv.popMgr.del_open("Pwb_tips");//结算删除排位币不足控件 
        }
        this.nodeReport.getChildByName("roomwanfa").getComponent(cc.Label).string = cc.vv.roomMgr.enter.desc;
        var max_score = 0;
        var max_seat = -1;
        
        for(var i=0;i< data.list.length ;++i){
           if(cc.vv.userMgr.userid == data.list[i].userid){
                this.nodeReport.getChildByName("score").getChildByName("score").getComponent(cc.Label).string ="+" +  data.list[i].coins;
           }
        }

        for(var i=0;i< data.list.length ;++i){
            if(parseFloat(data.list[i].result_score) > parseFloat(max_score)){
                max_score = data.list[i].result_score;
                max_seat = i;
            }
        }
        var min_score = 0;
        var min_seat = -1;
        for(var i=0;i< data.list.length ;++i){
            if(parseFloat(data.list[i].result_score) < parseFloat(min_score)){
                min_score = data.list[i].result_score;
                min_seat = i;
            }
        }
        var indexself = 0;
        //所有人结算
        for(var i=0;i< data.list.length ;++i){
            var seatid = cc.vv.roomMgr.getSeatIndexByID(data.list[i].userid);
            if(seatid == cc.vv.roomMgr.seatid){
                indexself = i;
            }
        }
        //所有人结算
        for(var i=0;i< data.list.length ;++i){
            if(data.list[i].userid == 0){
                continue;
            }
            var uiIndex = 0;
            if(i == indexself){
                uiIndex = 0;
            }else if(i < indexself){
                uiIndex = i + 1;
            }else if(i > indexself){
                uiIndex = i;
            }
            var info = {
                name:data.list[i].name,//用户名称
                userid:data.list[i].userid,//用户id
                headimg:data.list[i].headimg,//图片
                score:data.list[i].result_score,//总分
                lose_count:data.list[i].shupai,//输牌数量
                win_count:data.list[i].hupai,//胡牌数量
                crad_maxtype:data.list[i].paixing,//最大牌型
                dayingjia:data.list[i].result_score == max_score,
                tuhao:data.list[i].result_score == min_score,
            }
            if(max_score == 0){
                info.dayingjia = false;
            }
            if(min_score == 0){
                info.tuhao = false;
            }
            var item = list.getChildByName("s" + (uiIndex + 1));
            item.active = true;
            item.getChildByName("MJReportItem").emit("info",info);
        }
    },

    stage:function(data){
        this.isStage = true;
    },

    //出牌的飞入牌堆
    game_chupaiLast:function(){
        var self = this;
        var time = 0.1;
        var delayTime = 0.5;
        if(cc.vv.roomMgr.is_replay){
            time = 0.05;
            delayTime = 0;
        }
        var chupaiArr = this._chupaiArr;
        var chupaiArrlength = chupaiArr.length;
        for(var index = 0; index < chupaiArrlength; index++) {
            var myTag = chupaiArr[index];
            var viewidArr = myTag.split("_");
            var viewid = parseInt(viewidArr[0]);
            var seatid = cc.vv.roomMgr.realChairID(viewid);
            var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
            var pos = cc.vv.utils.deepCopy(posall[viewid].folds);
            var nodeFolds = this.getHoldParent(viewid, "folds");
            var nodeFoldsList = nodeFolds.getChildByName("list");
            var nodeHolds = this.getHoldParent(viewid, "holds");
            //牌的位置
            var distanceAll = 0;
            var distanceHAll = 0;
            if(cc.vv.mahjongMgr._seats.length == 0){
                return;
            }
            var folds = cc.vv.mahjongMgr._seats[seatid].folds;
            var indexK = folds.length - 1;
            var pai = folds[indexK];
            for (var indexPos = 0; indexPos <= indexK; indexPos++) {
                distanceAll += pos.distance[indexPos] * pos.scale;
                distanceHAll += pos.distanceH[indexPos] * pos.scale;
            }
            var callbackOne = function(data){
                cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_dapai");
                var end = data.index + 1;
                var paiReturn = cc.vv.mahjongMgr.getMahjongPai(data.pai);
                var callbackFunc = function(){
                    var seatid = cc.vv.roomMgr.realChairID(data.viewid);
                    cc.vv.folds.setSpritePointer(seatid,data.index,true);
                }
                self.showFolds(data.viewid, data.index, paiReturn, end, callbackFunc);
            }
            var x = (pos.x + distanceAll) * nodeFolds.scaleX * nodeFoldsList.scaleX / nodeHolds.scaleX;
            var y = (pos.y + distanceHAll) * nodeFolds.scaleY * nodeFoldsList.scaleY / nodeHolds.scaleY;
            var scaleTo = 0;
            var end = 0;
            var info = {
                viewid:viewid,
                pai:pai,
                index:indexK,
                callback:callbackOne,
            } 
            var Parent = this.getHoldParent(viewid, "holdschupai");
            this.send_card_emit(Parent, "nodeDestroy", info, myTag);
        }
        for(var index = 0; index < chupaiArrlength; index++) {
            var myTag = chupaiArr[index];
            chupaiArr.splice(index, 1)
        }
       
    },

    //吃碰杠 3
    game_chipeng:function(viewid, startIndex, pai, isgang){
        var self = this;
        var parent = this.getHoldParent(viewid, "penggangs");
        var nodeChipenggang = new cc.Node("nodeChipenggang" + viewid);
        nodeChipenggang.myTag = viewid + "_nodeChipenggang_" + (startIndex / 3);
        parent.addChild(nodeChipenggang);
        var viewSelf = cc.vv.mahjongMgr.getViewidBySide("myself");
        if(viewid != viewSelf){
            var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
            var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
            var toChiPengGangX = chiPeng.destination[startIndex / 3].x;
            var toChiPengGangY = chiPeng.destination[startIndex / 3].y;
            nodeChipenggang.x = toChiPengGangX;
            nodeChipenggang.y = toChiPengGangY;
        }
        var end = 4;
        for (var index = startIndex; index < end + startIndex; index++) {
            this.showChiPeng(startIndex, nodeChipenggang, viewid, index, pai, end + startIndex, isgang);
        }
    },

    playBuHua:function(seatid){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var side = cc.vv.mahjongMgr.getSide(viewid);
        switch (side) {
            case "myself":
                    if(this._prefabBuhuaSelf){
                        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
                        var buhua = cc.vv.utils.deepCopy(posall[viewid].buhua);
                        var sideChild = this.nodeGameRoot.getChildByName(side);
                        var parent =  sideChild.getChildByName("play_efx");
                        this._prefabBuhuaSelf = cc.instantiate(this.prefabBuhua);
                        var parent = this._playEfxs[side].getChildByName("prefabBuhua");
                        parent.addChild(this._prefabBuhuaSelf);
                    }
                    var animation = this._prefabBuhuaSelf.getComponent(cc.Animation);
                    animation.play("buhua");
                break
            case "right":
                    if(this._prefabBuhuaRight){
                        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
                        var buhua = cc.vv.utils.deepCopy(posall[viewid].buhua);
                        var sideChild = this.nodeGameRoot.getChildByName(side);
                        var parent =  sideChild.getChildByName("play_efx");
                        this._prefabBuhuaRight = cc.instantiate(this.prefabBuhua);
                        var parent = this._playEfxs[side].getChildByName("prefabBuhua");
                        parent.addChild(this._prefabBuhuaRight);
                    }
                    var animation = this._prefabBuhuaRight.getComponent(cc.Animation);
                    animation.play("buhua");
                break;
            case "up":
                    if(this._prefabBuhuaUp){
                        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
                        var buhua = cc.vv.utils.deepCopy(posall[viewid].buhua);
                        var sideChild = this.nodeGameRoot.getChildByName(side);
                        var parent =  sideChild.getChildByName("play_efx");
                        this._prefabBuhuaUp = cc.instantiate(this.prefabBuhua);
                        var parent = this._playEfxs[side].getChildByName("prefabBuhua");
                        parent.addChild(this._prefabBuhuaUp);
                    }
                    var animation = this._prefabBuhuaUp.getComponent(cc.Animation);
                    animation.play("buhua");
                break;
            case "left":
                    if(this._prefabBuhuaLeft){
                        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
                        var buhua = cc.vv.utils.deepCopy(posall[viewid].buhua);
                        var sideChild = this.nodeGameRoot.getChildByName(side);
                        var parent =  sideChild.getChildByName("play_efx");
                        this._prefabBuhuaLeft = cc.instantiate(this.prefabBuhua);
                        var parent = this._playEfxs[side].getChildByName("prefabBuhua");
                        parent.addChild(this._prefabBuhuaLeft);
                    }
                    var animation = this._prefabBuhuaLeft.getComponent(cc.Animation);
                    animation.play("buhua");
                break;
        }
    },

    //吃碰杠 4
    showChiPeng:function(startIndex, parent, viewid, indexK, paiAll, end, isgang){
        var isgangdata = isgang
        var pai = paiAll[indexK - startIndex + 1]
        var seatidForm = paiAll[0];
        var self = this;
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];     
        switch(sideName){
            case "myself":
                    var atlas = this.selfhandAtlasThreeD;
                break;
            case "right":
                var dianAtlas = this.righthandAtlasThreeD;
                var atlas = this.lefthandAtlasThreeD;
            break;
            case "up":
                var atlas = this.uphandAtlasThreeD;
                var dianAtlas = this.selfhandAtlasThreeD;
            break;
            case "left":
                var dianAtlas = this.lefthandAtlasThreeD;
                var atlas = this.lefthandAtlasThreeD;
            break;
        }
        var prefab = this.PrefabMajiang;
        var scriptsName = 'KDMajiang';
        var paiName = "img_cardvalue";
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
        pos.x =  - chiPeng.spacingX + (indexK - startIndex) * chiPeng.spacingX;
        pos.y =  - chiPeng.spacingY + (indexK - startIndex) * chiPeng.spacingY;
        pos.scale = pos.scalehide;
        pos.xhide =  - chiPeng.spacingX + (indexK - startIndex) * chiPeng.spacingX;
        pos.yhide =  - chiPeng.spacingY + (indexK - startIndex) * chiPeng.spacingY;
        if(indexK == end - 1){
            pos.x =  chiPeng.fourPai.x  * pos.scalehide;
            pos.y =  (chiPeng.fourPai.y + 200)  * pos.scalehide;
            pos.xhide = chiPeng.fourPai.x  * pos.scalehide;
            pos.yhide = (chiPeng.fourPai.y + 200) * pos.scalehide;
        }
        pos.distance = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distanceH = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distancehide = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distanceHhide = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.img = pos.imgshow;
        pos.size = pos.sizehide;
        pos.dian = pos.dianhide;
        pos.dianScaleAll = pos.dianScalehideAll;
        if(pos.scaleItemhide){
            pos.scaleItemhidescale = pos.scaleItemhide;
        }
        if(chiPeng.paiIndex){
            parent.zIndex = chiPeng.paiIndex[startIndex / 3];
        }
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_chipenggang_";
        var tagall = viewid + "_chipenggang_" + (startIndex / 3) + "_" + (indexK - startIndex);
        function callback(){ 
            self.AnimationChipeng(parent, viewid, indexK, startIndex, isgangdata);
            var tagfour = viewid + "_chipenggang_" + (startIndex / 3) + "_"  + 3;
            var selfSeatid = cc.vv.roomMgr.realChairID(viewid);
            var info = {
                seatid:seatidForm,
                selfSeatid:selfSeatid,
            }
            // self.send_card_emit(parent, "setArrow", info, tagfour)
            var tagTwo = viewid + "_chipenggang_" + (startIndex / 3) + "_"  + 1;
            self.send_card_emit(parent, "setArrow", info, tagTwo)
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            dianAtlas:dianAtlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            tagall:tagall,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示手牌
    showHoldHoldsreplay:function(viewid, index, pai, end, callbackFunc){
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];     
        switch(sideName){
            case "myself":
                this.showSelfHoldsreplay(index, pai, end, callbackFunc);
            break;
            case "right":
                this.showRightHoldsreplay(index, pai, end, callbackFunc);
            break;
            case "up":
                this.showTopHoldsreplay(index, pai, end, callbackFunc);
            break;
            case "left":
                this.showLeftHoldsreplay(index, pai, end, callbackFunc);
            break;
        }
    },

    //显示自己的牌(扑)
    showSelfHoldsreplay:function(indexK, pai, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var atlas = this.selfhandAtlasThreeD;
        var prefab = this.PrefabMajiang;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        pos.scale = pos.scalehide;
        pos.distance = pos.distancehide;
        pos.distanceH = pos.distanceHhide;
        pos.img = pos.imgshow;
        pos.size = pos.sizehide;
        pos.dian = pos.dianhide;
        pos.dianScaleAll = pos.dianScalehideAll;
        if(pos.scaleItemhide){
            pos.scaleItemhidescale = pos.scaleItemhide;
        }
        var parent = this.getHoldParent(viewid, "holds");
        var paiName = "img_cardvalue";
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_holds_";
        function callback(){
            
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示右边的牌(扑)
    showLeftHoldsreplay:function(indexK, pai, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("left");
        var prefab = this.PrefabMajiang;
        var atlas = this.lefthandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        pos.scale = pos.scalehide;
        pos.distance = pos.distancehide;
        pos.distanceH = pos.distanceHhide;
        pos.img = pos.imgshow;
        pos.size = pos.sizehide;
        pos.dian = pos.dianhide;
        pos.dianScaleAll = pos.dianScalehideAll;
        var parent = this.getHoldParent(viewid, "holds");
        var paiName = "ing_zuojia_z_";
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_holds_";
        if(pos.scaleItemhide){
            pos.scaleItemhidescale = pos.scaleItemhide;
        }
        function callback(){

        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示左边的牌(扑)
    showRightHoldsreplay:function(indexK, pai, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("right");
        var prefab = this.PrefabMajiang;
        var atlas = this.lefthandAtlasThreeD;
        var dianAtlas = this.righthandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        pos.scale = pos.scalehide;
        pos.distance = pos.distancehide;
        pos.distanceH = pos.distanceHhide;
        pos.img = pos.imgshow;
        pos.size = pos.sizehide;
        pos.dian = pos.dianhide;
        pos.dianScaleAll = pos.dianScalehideAll;
        var parent = this.getHoldParent(viewid, "holds");
        var paiName = "ing_zuojia_z_";
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_holds_";
        if(pos.scaleItemhide){
            pos.scaleItemhidescale = pos.scaleItemhide;
        }
        function callback(){

        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            dianAtlas:dianAtlas,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示对面的牌(扑)
    showTopHoldsreplay:function(indexK, pai, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("up");
        var prefab = this.PrefabMajiang;
        var atlas = this.uphandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        pos.scale = pos.scalehide;
        pos.distance = pos.distancehide;
        pos.distanceH = pos.distanceHhide;
        pos.img = pos.imgshow;
        pos.size = pos.sizehide;
        pos.dian = pos.dianhide;
        pos.dianScaleAll = pos.dianScalehideAll;
        var parent = this.getHoldParent(viewid, "holds");
        var paiName = "img_upcardvalue";
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_holds_";
        if(pos.scaleItemhide){
            pos.scaleItemhidescale = pos.scaleItemhide;
        }
        function callback(){

        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示自己的牌
    showSelfHold:function(indexK, pai, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var atlas = this.selfhandAtlasThreeD;
        var prefab = this.PrefabMajiang;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var parent = this.getHoldParent(viewid, "holds");
        var paiName = "img_cardvalue";
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_holds_";
        function callback(){

        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示左边的牌
    showLeftHold:function(indexK, pai, foldslength, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("left");
        var prefab = this.PrefabMajiang;
        var atlas = this.lefthandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var parent = this.getHoldParent(viewid, "holds");
        var parentchupai = this.getHoldParent(viewid, "holdschupai");
        var paiName = "ing_zuojia_z_";
        var pai = pai;
        var myTag = "_holds_";
        if(foldslength && indexK == 13){
            var tagall = viewid + "_chupai_" + foldslength;
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parentchupai,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                tagall:tagall,
                callback:callback,
            }
            this.showFapai(data);
        }else if(!foldslength && indexK == 13){
            var tagall = viewid + "_chupai_" + 0;
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parentchupai,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                tagall:tagall,
                callback:callback,
            }
            this.showFapai(data);
        }else{
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parent,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                callback:callback,
            }
            this.showFapai(data);
        }
    },

    //显示上面的牌
    showTopHold:function(indexK, pai, foldslength, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("up");
        var prefab = this.PrefabMajiang;
        var atlas = this.uphandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var parent = this.getHoldParent(viewid, "holds");
        var parentchupai = this.getHoldParent(viewid, "holdschupai");
        var paiName = "img_upcardvalue";
        var pai = pai;
        var myTag = "_holds_";
        if(foldslength && indexK == 13){
            var tagall = viewid + "_chupai_" + foldslength;
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parentchupai,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                tagall:tagall,
                callback:callback,
            }
            this.showFapai(data);
        }else if(!foldslength && indexK == 13){
            var tagall = viewid + "_chupai_" + 0;
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parentchupai,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                tagall:tagall,
                callback:callback,
            }
            this.showFapai(data);
        }else{
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parent,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                callback:callback,
            }
            this.showFapai(data);
        }
    },

    //显示右边的牌
    showRightHold:function(indexK, pai, foldslength, end){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("right");
        var prefab = this.PrefabMajiang;
        var atlas = this.lefthandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var parent = this.getHoldParent(viewid, "holds");
        var parentchupai = this.getHoldParent(viewid, "holdschupai");
        var paiName = "ing_zuojia_z_";
        var pai = pai;
        var myTag = "_holds_";
        if(foldslength && indexK == 13){
            var tagall = viewid + "_chupai_" + foldslength;
            
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parentchupai,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                tagall:tagall,
                callback:callback,
            }
            this.showFapai(data);
        }else if(!foldslength && indexK == 13){
            var tagall = viewid + "_chupai_" + 0;
            
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parentchupai,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                tagall:tagall,
                callback:callback,
            }
            this.showFapai(data);
        }else{
            function callback(){

            }
            var data = {
                prefab:prefab,
                atlas:atlas,
                scriptsName:scriptsName,
                pos:pos,
                viewid:viewid,
                end:end,
                parent:parent,
                paiName:paiName,
                indexK:indexK,
                pai:pai,
                myTag:myTag,
                callback:callback,
            }
            this.showFapai(data);
        }
    },

    chupaiShow:function(viewid, index, pai, seatid, foldslength, callback){
        var self = this;
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var side = cc.vv.mahjongMgr.getSide(viewid);
        var pos =  cc.vv.utils.deepCopy(posall[viewid].chupaiShow);
        var viewSelf = cc.vv.mahjongMgr.getViewidBySide("myself");
        if(!cc.vv.roomMgr.is_replay){
            if(viewid != viewSelf){
                index = 13;
            }
        }

        var setTag = viewid + "_chupai_" + foldslength;
        var parent = this.getHoldParent(viewid, "holds");
        var parentchupai = this.getHoldParent(viewid, "holdschupai");

        var selfViewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var posSelf = cc.vv.utils.deepCopy(posall[selfViewid].chupaiShow);
        var posSelfHolds = cc.vv.utils.deepCopy(posall[selfViewid].holds);
        var bgSize =  posSelf.size;
        var position = posSelf.dian.position;
        var dianSize =  posSelf.dian.size;
        var img = posSelf.dian.img;
        var skew = posSelf.dian.skew;
        if(viewid == viewSelf){
            var myTag = viewid + "_holds_" + index;
            var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
            var pos = cc.vv.utils.deepCopy(posall[viewid].folds);
            var nodeFolds = this.getHoldParent(viewid, "folds");
            var nodeFoldsList = nodeFolds.getChildByName("list");
            var nodeHolds = this.getHoldParent(viewid, "holds");
            //牌的位置
            var distanceAll = 0;
            var distanceHAll = 0;
            var indexK = foldslength;
            for (var indexPos = 0; indexPos <= indexK; indexPos++) {
                distanceAll += pos.distance[indexPos] * pos.scale;
                distanceHAll += pos.distanceH[indexPos] * pos.scale;
            }
            var callbackOne = function(data){
                cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_dapai");
                var end = data.index + 1;
                var paiReturn = cc.vv.mahjongMgr.getMahjongPai(data.pai);
                var callbackFunc = function(){
                    var seatid = cc.vv.roomMgr.realChairID(data.viewid);
                    cc.vv.folds.setSpritePointer(seatid,data.index,true);
                }
                self.showFolds(data.viewid, data.index, paiReturn, end, callbackFunc);
                var seatid = cc.vv.roomMgr.realChairID(data.viewid);
                callback(seatid, data.indexself);
            }
            var x = (pos.x + distanceAll) * nodeFolds.scaleX * nodeFoldsList.scaleX / nodeHolds.scaleX;
            var y = (pos.y + distanceHAll) * nodeFolds.scaleY * nodeFoldsList.scaleY / nodeHolds.scaleY;
            function callbackTag(){
                var time = 0.1;
                var delayTime = 0;
                var scaleTo = 0;
                var info = {
                    viewid:viewid,
                    pai:pai,
                    index:indexK,
                    indexself:index,
                    callback:callbackOne,
                } 
                self.send_card_emit(parentchupai, "nodeDestroy", info, setTag);
                var enabledInfo = {
                    enabled:false,
                }
                self.send_card_emit(parentchupai, "setEnabled", enabledInfo, setTag);
            }
            var tagInfo = {
                myTag:setTag,
                callback:callbackTag,
            }
            this.send_card_emit(parent, "setTag", tagInfo, myTag);
        }else if(cc.vv.roomMgr.is_replay){
            var myTag = viewid + "_holds_" + index;
            function callbackTag(){
                var info = {
                    time:0.2,
                    x:pos.x,
                    y:pos.y,
                    scaleFrom:pos.scaleFrom,
                    scaleTo:pos.scaleTo,
                    spriteBgFrame:self.selfhandAtlasThreeD,
                    spriteBgName:img,
                    spriteBgWidth:bgSize.width,
                    spriteBgHeight:bgSize.height,
                    spriteDianFrame:self.selfhandAtlasThreeD,
                    dianX:position.x,
                    dianY:position.y,
                    dianWidth:dianSize.width,
                    dianHeight:dianSize.height,
                    dianScaleX:pos.dianScaleAll,
                    dianScaleAll:posSelf.dianScaleAll,
                    spriteDianName:"img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(pai),
                    seatid:seatid,
                    index:index,
                    skew:skew,
                    callback:callback,
                } 
                self.send_card_emit(parentchupai, "chupaiShow", info, setTag);
                var isShowInfo = {
                    isShow:true,
                }
                self.send_card_emit(parentchupai, "setLight", isShowInfo, setTag);
                var lightInfo = {
        
                }
                self.send_card_emit(parentchupai, "setChuLight", lightInfo, setTag);
                var enabledInfo = {
                    enabled:false,
                }
                self.send_card_emit(parentchupai, "setEnabled", enabledInfo, setTag);
            }
            var tagInfo = {
                myTag:setTag,
                callback:callbackTag,
            }
            this.send_card_emit(parent, "setTag", tagInfo, myTag);
            this._chupaiArr.push(setTag);
        }else{
            var node = cc.vv.utils.getChildByTag(parentchupai,setTag);
            if(!node){
                var seatid = cc.vv.roomMgr.realChairID(viewid);
                this.chupaiShowStage(seatid, pai);
            }else{
                var info = {
                    time:0.2,
                    x:pos.x,
                    y:pos.y,
                    scaleFrom:pos.scaleFrom,
                    scaleTo:pos.scaleTo,
                    spriteBgFrame:self.selfhandAtlasThreeD,
                    spriteBgName:img,
                    spriteBgWidth:bgSize.width,
                    spriteBgHeight:bgSize.height,
                    spriteDianFrame:self.selfhandAtlasThreeD,
                    dianX:position.x,
                    dianY:position.y,
                    dianWidth:dianSize.width,
                    dianHeight:dianSize.height,
                    dianScaleX:pos.dianScaleAll,
                    dianScaleAll:posSelf.dianScaleAll,
                    spriteDianName:"img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(pai),
                    seatid:seatid,
                    index:index,
                    skew:skew,
                    callback:callback,
                } 
                self.send_card_emit(parentchupai, "chupaiShow", info, setTag);
                var isShowInfo = {
                    isShow:true,
                }
                self.send_card_emit(parentchupai, "setLight", isShowInfo, setTag);
                var lightInfo = {
        
                }
                self.send_card_emit(parentchupai, "setChuLight", lightInfo, setTag);
                
                this._chupaiArr.push(setTag);
            }
        }
    },

    showFolds:function(viewid, index, pai, end, callbackFunc){
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];     
        switch(sideName){
            case "myself":
                this.showSelfFolds(index, pai, end, callbackFunc);
            break;
            case "right":
                this.showRightFolds(index, pai, end, callbackFunc);
            break;
            case "up":
                this.showUpFolds(index, pai, end, callbackFunc);
            break;
            case "left":
                this.showLeftFolds(index, pai, end, callbackFunc);
            break;
        }
    },

    //显示自己出牌堆
    showSelfFolds:function(indexK,pai,end,callbackFunc){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var prefab = this.PrefabMajiang;
        var atlas = this.selfhandAtlasThreeD;
        var dianAtlas = this.selfhandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].folds);
        var parent = this.getHoldParent(viewid, "folds").getChildByName("list");
        var paiName = "img_cardvalue";
        var myTag = "_folds_";
        function callback(){
            //放入牌
            callbackFunc();
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            indexK:indexK,
            parent:parent,
            paiName:paiName,
            pai:pai,
            myTag:myTag,
            end:end,
            dianAtlas:dianAtlas,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示左边出牌堆
    showLeftFolds:function(indexK,pai,end,callbackFunc){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("left");
        var prefab = this.PrefabMajiang;
        var atlas = this.lefthandAtlasThreeD;
        var dianAtlas = this.lefthandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].folds);
        var parent = this.getHoldParent(viewid, "folds").getChildByName("list");
        var paiName = "img_cardvalue";
        var myTag = "_folds_";
        function callback(){
            callbackFunc();
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            indexK:indexK,
            parent:parent,
            paiName:paiName,
            pai:pai,
            myTag:myTag,
            end:end,
            dianAtlas:dianAtlas,
            callback:callback,
        }
        this.showFapai(data);
    },

    //显示上面出牌堆
    showUpFolds:function(indexK,pai,end,callbackFunc){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("up");
        var prefab = this.PrefabMajiang;
        var atlas = this.selfhandAtlasThreeD;
        var dianAtlas = this.selfhandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].folds);
        var parent = this.getHoldParent(viewid, "folds").getChildByName("list");
        var paiName = "img_cardvalue";
        var myTag = "_folds_";
        function callback(){
            callbackFunc();
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            indexK:indexK,
            parent:parent,
            paiName:paiName,
            pai:pai,
            myTag:myTag,
            end:end,
            dianAtlas:dianAtlas,
            callback:callback,
        }
        this.showFapai(data);
    },

    //隐藏上家的出牌
    hideFolds:function(viewid,index){
        var parent = this.getHoldParent(viewid, "folds").getChildByName("list");
        var myTag = viewid + "_folds_" + index;
        var info = {

        }
        this.send_card_emit(parent, "nodeDestroy", info, myTag)
    },  

    //显示右边出牌堆
    showRightFolds:function(indexK,pai,end,callbackFunc){
        var self = this;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("right");
        var prefab = this.PrefabMajiang;
        var atlas = this.righthandAtlasThreeD;
        var dianAtlas = this.righthandAtlasThreeD;
        var scriptsName = "KDMajiang"
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].folds);
        var parent = this.getHoldParent(viewid, "folds").getChildByName("list");
        var paiName = "img_cardvalue";
        var myTag = "_folds_";
        function callback(){
            callbackFunc();
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            indexK:indexK,
            parent:parent,
            paiName:paiName,
            pai:pai,
            myTag:myTag,
            end:end,
            dianAtlas:dianAtlas,
            callback:callback,
        }
        this.showFapai(data);
    },
    
    //发牌
    showFapai:function(data){
        var self = this;
        var prefab = data.prefab;
        var atlas = data.atlas;
        var scriptsName = data.scriptsName;
        var pos = cc.vv.utils.deepCopy(data.pos);
        var viewid = data.viewid;
        var indexK = data.indexK;
        var parent = data.parent;
        var paiName = data.paiName;
        var paik = data.pai;
        var myTag = data.myTag;
        var callback = data.callback
        var paiBgName = pos.img;
        var end = data.end;
        //牌的位置
        var distanceAll = 0;
        var distanceHAll = 0;
        var distanceAllhide = 0;
        var distanceHAllhide = 0;
        if(pos.distance[indexK] == null){
            return;
        }
        for (var  index = 0; index <= indexK; index++) {
            distanceAll += pos.distance[index] * pos.scale;
            distanceHAll += pos.distanceH[index] * pos.scale;
            distanceAllhide += pos.distancehide[index] * pos.scalehide;
            distanceHAllhide += pos.distanceHhide[index] * pos.scalehide;
        }
        var paiIndex = pos.paiIndex;
        var size = pos.size;
        //生成一张牌
        var node = cc.instantiate(prefab);
        var bg = node.getChildByName("bg");
        var dian = bg.getChildByName("dian");
        var type = bg.getChildByName("type");
        //-2铺着（背面） -1 不显示 -3不是自己显示立着的
        if(paik == -3 && viewid != 0){
            paiIndex = pos.paiIndex;
            size = pos.size;
            paiBgName = pos.img;
            dian.active = false;

            var card = node.getComponent(scriptsName);
            var x = pos.x + distanceAll;
            var y = pos.y + distanceHAll;
            node.setPosition(x, y);
            node.scale = pos.scale;
            node.zIndex = paiIndex[indexK];
        }else if(paik == null || paik == -1){ 
            node.active = false;
            if(indexK == end - 1){
                if(callback != null){
                    callback();
                }
            }
            return;
        }else if(paik == -2){
            if(myTag == "_folds_"){
                paiIndex = pos.paiIndex;
                size = pos.size;
                paiBgName = pos.imghide;
                dian.active = false;
    
                var card = node.getComponent(scriptsName);
                var x = pos.x + distanceAll;
                var y = pos.y + distanceHAll;
                node.setPosition(x, y);
                pos.scale = pos.scale;
                if(pos.scaleItemhide){
                    pos.scale = pos.scaleItemhide[indexK] * pos.scale;
                }
                node.scale = pos.scale;
                node.zIndex = paiIndex[indexK];
            }else{
                paiIndex = pos.paiIndexhide;
                size = pos.sizehide;
                paiBgName = pos.imghide;
                dian.active = false;
    
                var card = node.getComponent(scriptsName);
                var x = pos.xhide + distanceAllhide;
                var y = pos.yhide + distanceHAllhide;
                node.setPosition(x, y);
                pos.scale = pos.scalehide;
                if(pos.scaleItemhide){
                    pos.scale = pos.scaleItemhide[indexK] * pos.scale;
                }
                node.scale = pos.scale;
                node.zIndex = paiIndex[indexK];
            }
         
        }else{
            paiIndex = pos.paiIndex;
            size = pos.size;
            paiBgName = pos.img;
            var dianPos= pos.dian;
            if(data.dianAtlas){
                atlas = data.dianAtlas;
            }
            var paiNamepaik = paiName + paik;
            if(pos.dianScaleAll){
                dian.scale = pos.dianScaleAll;
            }
            if(dianPos){
                if(dianPos.img){
                    paiNamepaik = dianPos.img[indexK] + paik;
                }
                var paiFrame =  atlas.getSpriteFrame(paiNamepaik);
                dian.getComponent(cc.Sprite).spriteFrame = paiFrame;
                
                if(dianPos.position[indexK] != null && dianPos.position != null){
                    dian.x = dianPos.position[indexK].x;
                    dian.y = dianPos.position[indexK].y;
                }

                if(dianPos.size[indexK] != null){
                    dian.width = dianPos.size[indexK].width;
                    dian.height = dianPos.size[indexK].height;
                }
 
                if(dianPos.skew){
                    dian.skewX = dianPos.skew[indexK].x;
                    dian.skewY = dianPos.skew[indexK].y;
                }
                // if(dianPos.dianrota){
                //     dian.rotation = dianPos.dianrota[indexK];
                // }
                dian.active = true;
                if(dianPos.dianRotation){
                    dian.rotation = dianPos.dianRotation[indexK];
                }
                if(dianPos.dianScale){
                    dian.scaleX = dianPos.dianScale[indexK].scaleX;
                    dian.scaleY = dianPos.dianScale[indexK].scaleY;
                }
                if(dianPos.hao){
                    type.x = dianPos.hao[indexK].x;
                    type.y = dianPos.hao[indexK].y;
                    type.skewX = dianPos.hao[indexK].skewX;
                    type.skewY = dianPos.hao[indexK].skewY;
                    type.rotation = dianPos.hao[indexK].rotation;
                    if(dianPos.haoScale){
                        type.scale = dianPos.haoScale;
                    }
                    if(dianPos.dianScale){
                        type.scaleX = type.scaleX * dianPos.dianScale[indexK].scaleX;
                        type.scaleY = type.scaleY * dianPos.dianScale[indexK].scaleY;
                    }
                }
            }
            var card = node.getComponent(scriptsName);
            var x = pos.x + distanceAll;
            var y = pos.y + distanceHAll;
            node.setPosition(x, y);
            if(pos.scaleItemhidescale){
                pos.scale = pos.scaleItemhidescale[indexK] * pos.scale;
            }
            node.scale = pos.scale;
            node.zIndex = paiIndex[indexK];
            if(paik != -2 && paik != -3){
                if(dianPos && dianPos.hao){
                    var setPai = cc.vv.mahjongMgr.getMahjongPaiReturn(paik);
                    if((cc.vv.mahjongMgr._magicPai != -1 && setPai == cc.vv.mahjongMgr._magicPai) || (cc.vv.mahjongMgr._magicPai2 != -1 && setPai == cc.vv.mahjongMgr._magicPai2)){
                        type.active = true;
                    }else{
                        type.active = false;
                    }
                }
            }
        }
        atlas = data.atlas;
        bg.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(paiBgName[indexK]);
        if(pos.bgScale){
            bg.scaleX = pos.bgScale[indexK].scaleX;
            bg.scaleY = pos.bgScale[indexK].scaleY;
        }
        if(size){
            var width = size[indexK].width;
            var height = size[indexK].height;
            bg.width = width;
            bg.height = height;
        }

        parent.addChild(node);

        //重要，以此来区分是谁的第几张牌
        var paiTag = viewid + myTag + indexK;
        node.myTag = paiTag;
        if(data.tagall){
            node.myTag = data.tagall;
        }
        if(paik != -2 && paik != -3){
            var setPai = cc.vv.mahjongMgr.getMahjongPaiReturn(paik);
            var paiData = {
                pai:setPai,
                index:indexK,
            }
            node.emit("setValue", paiData);
            var ismagic = (cc.vv.mahjongMgr._magicPai != -1 && setPai == cc.vv.mahjongMgr._magicPai) || (cc.vv.mahjongMgr._magicPai2 != -1 && setPai == cc.vv.mahjongMgr._magicPai2);
            if(myTag == null){
                if(ismagic){
                    var info = {
                        isAn:true,
                    }
                    node.emit("setColor",info);
                }
            }else{
                if(myTag != "_folds_" && ismagic){
                    var info = {
                        isAn:true,
                    }
                    node.emit("setColor",info);
                }
            }
        }
        if(pos.dianScaleY != null){
            if(pos.dianScaleY <0){
                dian.scaleY = - dian.scaleY;
            } 
        }
        if(end){
            if(indexK == end - 1){
                if(callback != null){
                    callback(data.callbackdata);
                }
            }
        }
    },

    //显示停牌
    view_ting:function(data){
        if(data.is_view == 1){
            cc.find("Canvas/mgr/hud/oper/btn_ting").active = true; 
            if(cc.vv.game.config.is_showtingdown){
                cc.vv.net2.quick('query');
                this.onclick_see_ting_hs();
            }
        }else{
            cc.find("Canvas/mgr/hud/oper/btn_ting").active = false;
            if(cc.vv.game.config.is_showtingdown){
                cc.find("Canvas/open/see_ting_Pai_hs").active = false;
                cc.find("Canvas/open/huSprite").active = false;
            }
        }
    },

    guohu:function(seatid){
        if(cc.vv.roomMgr.is_replay){
            var sides = cc.vv.mahjongMgr._sides;
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            var nodeGuohu = this.getHoldParent(viewid, "guohubg");
            nodeGuohu.active = true;
        }else{
            if(seatid == cc.vv.roomMgr.seatid){
                var sides = cc.vv.mahjongMgr._sides;
                var viewid = cc.vv.roomMgr.viewChairID(seatid);
                var nodeGuohu = this.getHoldParent(viewid, "guohubg");
                nodeGuohu.active = true;
            }
        }
    },

    guopeng:function(seatid){
        if(cc.vv.roomMgr.is_replay){
            var sides = cc.vv.mahjongMgr._sides;
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            var nodePenghu = this.getHoldParent(viewid, "guopengbg");
            nodePenghu.active = true;
        }else{
            if(seatid == cc.vv.roomMgr.seatid){
                var sides = cc.vv.mahjongMgr._sides;
                var viewid = cc.vv.roomMgr.viewChairID(seatid);
                var nodePenghu = this.getHoldParent(viewid, "guopengbg");
                nodePenghu.active = true;
            }
        }
    },

    hujiaozhuanyi:function(data){
        var seatid = data.seatid;
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var selfViewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        if(viewid ==  selfViewid){
            this.initSelfHold();
        }else{
            this.initOtherHold(seatid);
        }
      
    },

    //一炮多响等待胡
    wait_hu:function(data){
        if(data.userid == cc.vv.userMgr.userid){
            this.hideOptions();
            this.hideChipaiOpts();
            this.hideGangPaiOpts();
            this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
        }
    },

    hideGuohuOne:function(seatid){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var nodeGuohu = this.getHoldParent(viewid, "guohubg");
        nodeGuohu.active = false;
    },
    
    hideGuohu:function(){
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var nodeGuohu = this.getHoldParent(viewid, "guohubg");
            nodeGuohu.active = false;
        }
    },

    hideGuoPengOne:function(seatid){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var nodeGuohu = this.getHoldParent(viewid, "guopengbg");
        nodeGuohu.active = false;
    },
    
    hideGuoPeng:function(){
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var nodeGuohu = this.getHoldParent(viewid, "guopengbg");
            nodeGuohu.active = false;
        }
    },

    //设置自己的牌是否可以点击
    setPaiClick:function(isClick){
        var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var selfPai = cc.vv.game.sortHolds(seatData);
        var selfLength = selfPai.length;
        var selfStartIndex = cc.vv.game.getStartIndex(selfPai);
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var parent = this.getHoldParent(viewid, "holds");
        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
            var data = {
                enabled:isClick
            }
            var myTag = viewid + "_holds_" + index;
            this.send_card_emit(parent, "setEnabled", data, myTag);
        }
    },
    
    //隐藏宝牌
    hideMagic:function(){
        this.spriteMagic.node.parent.active = false;
    },

    //隐藏胡牌
    hideHupai:function(){
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var side = sides[viewid];            
            var sideChild = this.nodeGameRoot.getChildByName(side);
            var hupaiNode = sideChild.getChildByName("hupai").getChildByName("KDMajiang")
            hupaiNode.active = false;
        }
    },

    //显示所有的灯
    showAllLight:function(){
        this._prefabArrow.emit("allLight");
    },

    //修改方位
    setDirection:function(){
        this._prefabArrow.emit("setDirection");
    },

    //显示动作
    showAction:function(data){
        var self=this;
        if(!this._isfristAction)return;
        if(this.opts.active){
            this.hideOptions();
        }
        cc.vv.folds.change_color_outcrad(-4);
        if(data && (data.hu || data.gang || data.peng|| data.chi || data.buhua)){
            self._showActoin_yse_not = true;
            this.opts.active = true;
            if(data.chi){
                this.addOption("btnChi",data.pai,data.paiWik);
            }

            if(data.peng){
                this.addOption("btnPeng",data.pai,null);
            }
                        
            if(data.gang){
                var gp = data.wik[0];
                this.addOptionTmp("btnGang",gp[1],data.wik,data.ActPai);
            }

            if(data.hu){
                if(cc.vv.game.config.isyipaoduoxiang){
                    this.auto_tips(10,"过");
                }
                this.addOption("btnHu",data.pai,null);
            }

            let op = this.opts.getChildByName("op");
            if (op) {
                for(var i = 0; i < op.childrenCount; ++i){
                    var child = op.children[i]; 
                    if(child.name == "btnGuo"){
                        if(data.guo){
                            child.active = true;
                        }else{
                            child.active = false;
                        }
                    }
                }    
            }
        }else{
            self._showActoin_yse_not = false;
        }
    },

    //显示指示灯
    game_showLight:function(seatid){
        if(seatid == -1){
            return;
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var index = viewid;
        var sides = cc.vv.mahjongMgr._sides;
        var sidesLength = sides.length;
        var position = sides[index % sidesLength];
        var data = {data:{position:position}};
        this._prefabArrow.emit("showLight", data);
    }, 

    //报听
    onclick_see_ting:function(){
        var see_ting_Pai = cc.find("Canvas/open/see_ting_Pai");
        cc.find("Canvas/mgr/hud/oper/btn_ting").active = true;
        see_ting_Pai.removeAllChildren()
        
        for(var i=0;i<this._tingpai.length;++i)
        {
            var tingpailist = cc.instantiate(this.tingpaiMJpre);
            tingpailist.getComponent("ThreeListenCard").show(this._tingpai[i],this._tingpaifan[i]);
            if(cc.vv.game.config.is_tingfan){
                tingpailist.getComponent("ThreeListenCard").fan(this._tingpaifannew[i]);
            }
            see_ting_Pai.addChild(tingpailist);
        }
        this.onclick_see_ting_hs();
        if(this._tingpai.length <= 5){
            see_ting_Pai.width = 20 + 200  * this._tingpai.length;
        }else{
            see_ting_Pai.width = 1200;
        }
        this.setBaoting();
    },

    onclick_see_ting_hs:function(){
        if(cc.vv.game.config.is_showtingdown){
            var see_ting_Pai_down = cc.find("Canvas/open/see_ting_Pai_hs");
            see_ting_Pai_down.removeAllChildren()
            for(var i=0;i<this._tingpai.length;++i)
            {
                var prefabMajiang = cc.instantiate(this.PrefabMajiang);
                var paiSprite = this.selfhandAtlasThreeD.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(this._tingpai[i]));
                prefabMajiang.getChildByName("bg").getChildByName("dian").getComponent(cc.Sprite).spriteFrame = paiSprite;
                see_ting_Pai_down.addChild(prefabMajiang);
                
            }
            see_ting_Pai_down.active = true;
            cc.find("Canvas/open/huSprite").active = true;
        }
    },

    //取消报听
    cencelbaoting:function(){
        this._baoting = 0;
        this._yiting=false;
        var tingPaiListNode = cc.find("Canvas/open/tingPaiList");
        tingPaiListNode.active = false;
        this.nodeGameRoot.getChildByName("baotingops").active = false;
        this.initBaotingHoldCan();
    },

    //报听后初始化变量
    initbnaoting:function(){
        this._baoting = 1;
        this._autoOutCrad=false;
        this._yiting=true;
        this.opts.active = false;
        this.nodeGameRoot.getChildByName("baotingops").active = true;
        this.initBaotingHold(); 
    },

    //更新自己手牌
    initMahjongs:function(seatid, chuPaiindex){
        var self = this;
        if(chuPaiindex == 13){
            return;
        }
        var magicpai = cc.vv.mahjongMgr._magicPai;
        var magicpai2 = cc.vv.mahjongMgr._magicPai2;
        var moPaiindex = cc.vv.game.getFourteenTo(magicpai, magicpai2);
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");

        var seatData = cc.vv.mahjongMgr._seats[seatid];
        var Pai = cc.vv.game.sortHolds(seatData);
        var startIndex = cc.vv.game.getStartIndex(Pai);

        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);

        //第三步：移动摸的牌
        var callbackThree = function(index) {
            var distanceAll = 0;
            var distanceHAll = 0;
            for (var  indexDistance = 0; indexDistance <= index; indexDistance++) {
                distanceAll += pos.distance[indexDistance] * pos.scale;
                distanceHAll += pos.distanceH[indexDistance] * pos.scale;
            }
            var x = pos.x + distanceAll;
            var y = pos.y + distanceHAll;

            var distanceAllself = 0;
            var distanceHAllself = 0;
            var indexSelf = 13;
            for (var  indexDistance = 0; indexDistance <= indexSelf; indexDistance++) {
                distanceAllself += pos.distance[indexDistance] * pos.scale;
                distanceHAllself += pos.distanceH[indexDistance] * pos.scale;
            }
            var xSelf = pos.x + distanceAllself;
            var ySelf = pos.y + distanceHAllself;
            var scale = pos.scale;

            var myTag = viewid + "_holds_" + indexSelf;

            var info = {
                delayTime:0.1,
                time:0.1,
                x:xSelf,
                y:ySelf + 130,
                scale:scale,
            } 
            self.send_card_emit(parent, "moveTo", info, myTag);

            var info = {
                delayTime:0.2,
                time:0.1,
                x:x,
                y:ySelf + 130,
                scale:scale,
                rotation:10,
            } 
            self.send_card_emit(parent, "moveTo", info, myTag);

            var callbackFunc = function(index) {
                cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_xuanpai");
                cc.vv.game.sortHolds(seatData);
                //报听
            }
            var setTag = viewid + "_holds_" + index;
            var info = {
                delayTime:0.3,
                time:0.1,
                x:x,
                y:y,
                scale:scale,
                moPaiindex:moPaiindex,
                index:index,
                myTag:setTag,
                rotation:0,
                callback:callbackFunc,
            } 
            self.send_card_emit(parent, "chuPaiMoveTo", info, myTag);
            if(cc.vv.mahjongMgr._canChui){
                var isClick = true;
                self.setPaiClick(isClick);
            }
        }
        if(moPaiindex < chuPaiindex){
            moPaiindex += 1;
        }
        if(moPaiindex > chuPaiindex){
            //左移
            for (var index = chuPaiindex; index <= moPaiindex; index++) {
                var distanceAll = 0;
                var distanceHAll = 0;
                var indexK = index - 1;
                for (var indexDistance = 0; indexDistance <= indexK; indexDistance++) {
                    distanceAll += pos.distance[indexDistance] * pos.scale;
                    distanceHAll += pos.distanceH[indexDistance] * pos.scale;
                }
                var x = pos.x + distanceAll;
                var y = pos.y + distanceHAll;
                var scale = pos.scale;
                var setTag = viewid + "_holds_" + indexK;
                var call = null;
                if(index == moPaiindex){
                    call = callbackThree;
                }else{
                    call = null;
                }
                var info = {
                    time:0.1,
                    x:x,
                    y:y,
                    scale:scale,
                    moPaiindex:moPaiindex,
                    index:indexK,
                    myTag:setTag,
                    callback:call,
                } 
                var myTag = viewid + "_holds_" + index;
                self.send_card_emit(parent, "chuPaiMoveTo", info, myTag);
            }
        }else if(moPaiindex < chuPaiindex){
            //右移
            for (var index = chuPaiindex; index >= moPaiindex; index--) {
                var distanceAll = 0;
                var distanceHAll = 0;
                var indexK = index + 1;
                for (var indexDistance = 0; indexDistance <= indexK; indexDistance++) {
                    distanceAll += pos.distance[indexDistance] * pos.scale;
                    distanceHAll += pos.distanceH[indexDistance] * pos.scale;
                }
                var x = pos.x + distanceAll;
                var y = pos.y + distanceHAll;
                var scale = pos.scale;
                var setTag = viewid + "_holds_" + indexK;
                var call = null;
                if(index == moPaiindex){
                    call = callbackThree;
                }else{
                    call = null;
                }
                var info = {
                    time:0.1,
                    x:x,
                    y:y,
                    scale:scale,
                    moPaiindex:moPaiindex,
                    index:indexK,
                    myTag:setTag,
                    callback:call,
                } 
                var myTag = viewid + "_holds_" + index;
                self.send_card_emit(parent, "chuPaiMoveTo", info, myTag);
            }
        }else{
            //不移
            callbackThree(moPaiindex);
        }
    },

    //洗牌动画（别人的）
    initOtherMahjongs:function(seatData){
        
    },

    //报听之后的手牌操作
    initBaotingHold:function(){
        var self = this;

        var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var pai = cc.vv.game.sortHolds(seatData);
        var selfStartIndex = cc.vv.game.getStartIndex(pai);
        var selfLength = pai.length;
        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(cc.vv.roomMgr.seatid);
            var myTag = viewid + "_holds_" + index;
            var holds = pai[index - selfStartIndex];
            if(this._baotingchupai == true){ //报听后自动出牌
                var data = {
                    keda:0
                }
                this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);

                var data = {
                    isAn:true,
                }
                this.send_card_item_emit("holds", viewid, "setColor", data, myTag);
                // if(index == selfStartIndex + selfLength - 1){
                //     self._guo_pai = holds;//存取手牌中最后一个牌，自动出牌后打出
                //     if(self._showActoin_yse_not == false && self._baoting == 1){//如果没有动作，且是自己出牌   
                //         cc.vv.folds.change_color_outcrad(-4);//出牌后隐藏变为绿色的麻将
                //         cc.vv.net2.quick('chupai',{pai:self._guo_pai,baoting:0,index:index});//就自动打出这张牌
                //         self._showActoin_yse_not = true;
                //     }
                //     var data = {
                //         keda:1
                //     }
                //     this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);
                // }
            }else if(this._baoting==1)//报听后
            {
                var data = {
                    isAn:true,
                }
                this.send_card_item_emit("holds", viewid, "setColor", data, myTag);
                var data = {
                    keda:0
                }
                this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);
                for(var k = 0; k < this._ting_chupai.length; ++k)//循环遍历可以出的牌
                {
                    //从第一张牌开始和在报听后可以出的牌集合里进行比较，如果这张牌 在集合里面 且autooutcrad为false 则这张牌亮起
                    if(holds == this._ting_chupai[k] && this._autoOutCrad == false){
                        var data = {
                            isAn:false,
                        }
                        this.send_card_item_emit("holds", viewid, "setColor", data, myTag);
                        var data = {
                            keda:1
                        }
                        this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);
                    }
                }
            }else{
                var data = {
                    isAn:false,
                }
                this.send_card_item_emit("holds", viewid, "setColor", data, myTag);
                var data = {
                    keda:1
                }
                this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);
            }
        }
    },

    //取消报听之后的手牌操作
    initBaotingHoldCan:function(){
        var self = this;
        
        var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var pai = cc.vv.game.sortHolds(seatData);
        var selfStartIndex = cc.vv.game.getStartIndex(pai);
        var selfLength = pai.length;
        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(cc.vv.roomMgr.seatid);
            var myTag = viewid + "_holds_" + index;
            var data = {
                isAn:false,
            }
            this.send_card_item_emit("holds", viewid, "setColor", data, myTag);
            var data = {
                keda:1
            }
            this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);
        }
    },

    //出牌后清空报听的列表
    initBaoting:function(){
        this._ting_chupai=[];
        this._ting_need=[];
        cc.find("Canvas/mgr/hud/oper/btn_ting").active = false;
        if(cc.vv.game.config.is_showtingdown){
            cc.find("Canvas/open/see_ting_Pai_hs").active = false;
            cc.find("Canvas/open/huSprite").active = false;
        }
    },

    initSelfHold:function(){
        //自己
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        var selfParent = this.getHoldParent(viewid, "holds");
        selfParent.removeAllChildren();

        //自己手牌
        var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var selfPai = cc.vv.game.sortHolds(seatData);
        var selfStartIndex = cc.vv.game.getStartIndex(selfPai);
        var selfLength = selfPai.length;
        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
            this.showSelfHold(index, selfPai[index - selfStartIndex], selfStartIndex + selfLength - 1);
        }
        this.initBaotingHold();
    },

    initRightHold:function(seatid, isFourth){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");
        parent.removeAllChildren();
        
        var seatDataFolds = cc.vv.mahjongMgr._seats[seatid];
        var folds = seatDataFolds.folds;
        var foldslength = folds.length;

        var gangPaiNum = cc.vv.mahjongMgr.getNumberPai(seatid);
        var length = 13 - gangPaiNum;
        if(isFourth){
            var myTag = viewid  + "_chupai_" + foldslength;
            //出的牌飞入牌堆
            var data = {
    
            }
            var parentchupai = this.getHoldParent(viewid, "holdschupai");
            this.send_card_emit(parentchupai, "nodeDestroy", data, myTag);
        }
        var startIndex = cc.vv.game.getStartIndexByNum(length);
        var pai = -3;
        for (var index = startIndex; index < startIndex + length; index++) {
            this.showRightHold(index, pai, foldslength, length + startIndex + 1);
        }
    },

    initUpHold:function(seatid, isFourth){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");
        parent.removeAllChildren();
        
        var seatDataFolds = cc.vv.mahjongMgr._seats[seatid];
        var folds = seatDataFolds.folds;
        var foldslength = folds.length;

        var gangPaiNum = cc.vv.mahjongMgr.getNumberPai(seatid);
        var length = 13 - gangPaiNum;
        if(isFourth){
            var myTag = viewid  + "_chupai_" + foldslength;
            //出的牌飞入牌堆
            var data = {
    
            }
            var parentchupai = this.getHoldParent(viewid, "holdschupai");
            this.send_card_emit(parentchupai, "nodeDestroy", data, myTag);
        }
        var startIndex = cc.vv.game.getStartIndexByNum(length);
        var pai = -3;
        for (var index = startIndex; index < startIndex + length; index++) {
            this.showTopHold(index, pai, foldslength, length + startIndex + 1);
        }
    },
            
    initLeftHold:function(seatid, isFourth){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");
        parent.removeAllChildren();
        
        var seatDataFolds = cc.vv.mahjongMgr._seats[seatid];
        var folds = seatDataFolds.folds;
        var foldslength = folds.length;

        var gangPaiNum = cc.vv.mahjongMgr.getNumberPai(seatid);
        var length = 13 - gangPaiNum;
        if(isFourth){
            var myTag = viewid  + "_chupai_" + foldslength;
            //出的牌飞入牌堆
            var data = {
    
            }
            var parentchupai = this.getHoldParent(viewid, "holdschupai");
            this.send_card_emit(parentchupai, "nodeDestroy", data, myTag);
        }
        var startIndex = cc.vv.game.getStartIndexByNum(length);
        var pai = -3;
        for (var index = startIndex; index < startIndex + length; index++) {
            this.showLeftHold(index, pai, foldslength, length + startIndex + 1);
        }
    },

    initRightHoldsreplay:function(seatid){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");
        parent.removeAllChildren();
        
        var seatData = cc.vv.mahjongMgr._seats[seatid];
        var pai = cc.vv.game.sortHolds(seatData);
        var length = pai.length;
        var startIndex = cc.vv.game.getStartIndex(pai);
        for (var index = startIndex; index < startIndex + length; index++) {
            this.showRightHoldsreplay(index, pai[index - startIndex], length + startIndex + 1);
        }
    },

    initUpHoldsreplay:function(seatid){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");
        parent.removeAllChildren();
        
        var seatData = cc.vv.mahjongMgr._seats[seatid];
        var pai = cc.vv.game.sortHolds(seatData);
        var length = pai.length;
        var startIndex = cc.vv.game.getStartIndex(pai);
        for (var index = startIndex; index < startIndex + length; index++) {
            this.showTopHoldsreplay(index, pai[index - startIndex], length + startIndex + 1);
        }
    },
            
    initLeftHoldsreplay:function(seatid){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "holds");
        parent.removeAllChildren();
        
        var seatData = cc.vv.mahjongMgr._seats[seatid];
        var pai = cc.vv.game.sortHolds(seatData);
        var length = pai.length;
        var startIndex = cc.vv.game.getStartIndex(pai);
        for (var index = startIndex; index < startIndex + length; index++) {
            this.showLeftHoldsreplay(index, pai[index - startIndex], length + startIndex + 1);
        }
    },

    initOtherHold:function(seatid, isFourth){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid]; 
        if(cc.vv.roomMgr.is_replay){
            switch(sideName){
                case "right":
                    this.initRightHoldsreplay(seatid);
                break;
                case "up":
                    this.initUpHoldsreplay(seatid);
                break;
                case "left":
                    this.initLeftHoldsreplay(seatid);
                break;
            }
        }else{
            switch(sideName){
                case "right":
                    this.initRightHold(seatid, isFourth);
                break;
                case "up":
                    this.initUpHold(seatid, isFourth);
                break;
                case "left":
                    this.initLeftHold(seatid, isFourth);
                break;
            }
        } 
    },  

    //听牌
    initTingPai:function(){
        
    },  
    
    //隐藏操作按钮
    hideOptions:function(data){
        this.opts.active = false;
        var child = this.opts.getChildByName("op"); 
        child.active = false;
        child.getChildByName("btnPeng").active = false;
        child.getChildByName("btnGang").active = false;
        child.getChildByName("btnTing").active = false;
        child.getChildByName("btnHu").active = false;
        child.getChildByName("btnChi").active = false;
    },

    //隐藏吃牌操作按钮
    hideChipaiOpts:function(data){
        this.chiopts.active = false;
        for(var i=0;i<this.chiopts.childrenCount;++i){
            var child = this.chiopts.children[i];
            if(child.name == "op"){
                child.active = false;                                
            }
        }
    },

    //隐藏杠牌操作按钮
    hideGangPaiOpts:function(data){
        this.gangopts.active = false;
        for(var i=0;i<this.gangopts.childrenCount;++i){
            var child = this.gangopts.children[i];
            if(child.name == "op"){
                child.active = false;                                
            }
        }
    },
    //隐藏报听
    hideTingOpts:function(){
        this.tingopts.active = false;
    },

    initHupai:function(viewid, pai, turn, foldslength){
        var self = this;
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];            
        var sideChild = this.nodeGameRoot.getChildByName(sideName);
        var hupaiNode = sideChild.getChildByName("hupai")
        var myTag = viewid + "_hupai";
        var dianAtlas = this.selfhandAtlasThreeD;
        var paiName = "img_cardvalue";
        switch(sideName){
            case "right":
                dianAtlas = this.righthandAtlasThreeD;
                paiName = "ing_youjia_1_";
            break;
            case "left":
                dianAtlas = this.lefthandAtlasThreeD;
                paiName = "ing_zuojia_1_";
            break;
        }
        var callbackFunc = function(){
            var sprite =  dianAtlas.getSpriteFrame(paiName + cc.vv.mahjongMgr.getMahjongPai(pai));
            var info = {
                pai:pai,
                sprite:sprite,
            } 
            self.send_card_emit(hupaiNode, "sethu", info, myTag);
            
            if((cc.vv.mahjongMgr._magicPai != -1 && pai == cc.vv.mahjongMgr._magicPai) || (cc.vv.mahjongMgr._magicPai2 != -1 && pai == cc.vv.mahjongMgr._magicPai2)){
                var isActiveInfo = {
                    isActive:true,
                }
                self.send_card_emit(hupaiNode, "setType", isActiveInfo ,myTag);
            }else{
                var isActiveInfo = {
                    isActive:false,
                }
                self.send_card_emit(hupaiNode, "setType", isActiveInfo ,myTag);
            }

            var seatid = turn;
            if(seatid == -1)return;
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            var setTag = viewid + "_chupai_" + (foldslength - 1);
            var parentchupai = self.getHoldParent(viewid, "holdschupai");
            var callbacktwo = function(){
                setTimeout(() => {
                    var infofour = {
                        isActive:false
                    } 
                    self.pengGangIsActive(parentchupai, infofour, setTag);
                }, 800);
            }
            var lightInfo = {
                callback:callbacktwo
            }
            self.send_card_emit(parentchupai, "sethuLight", lightInfo, setTag);
            //耗子
        }
        var infoActive = {
            isActive:true,
            callback:callbackFunc
        }
        self.pengGangIsActive(hupaiNode, infoActive, myTag);
    },  

    //隐藏显示
    baotingopsUi:function(isShow){
        var tingPaiListNode = cc.find("Canvas/open/tingPaiList");
        tingPaiListNode.active = isShow;
        this.nodeGameRoot.getChildByName("baotingops").active = isShow;
    },

    //增加操作
    addOption:function(btnName,pai,paiWik){
        var child = this.opts.getChildByName("op"); 
        //修改，切换后台后，一轮过后，还是这个动作时，数据没有变化（特别是吃的情况！会导致出现5张相同的牌）
        child.active = true;
        var btn = child.getChildByName(btnName); 
        btn.active = true;
        btn.pai = pai;      
        btn.paiWik = paiWik;
        return;
    },

    //临时操作
    addOptionTmp:function(btnName,pai,paiWik,actpai){
            var child = this.opts.getChildByName("op"); 
            //修改同上一個函數
            child.active = true;
            var btn = child.getChildByName(btnName); 
            btn.active = true;
            btn.pai = pai;      
            btn.paiWik = paiWik;
            btn.actpai = actpai;
            return;
    },

    onGameBeign:function(data){
        //如果没有开局，或者不是回放，后面不做了
        if(cc.vv.mahjongMgr._gamestate == -1 || cc.vv.mahjongMgr._gamestate ==97){
            return;
        }
        //显示牌
        this.nodeGameRoot.active = true;
        this._isfrist = true;
        this._isfristAction = true;
        this._isfristTingAction = true;
        this._isfristTing1Action = true;
        //设置庄
        this.setZhuang();
        if(cc.vv.game.config.is_showHuangZhuang){
            //设置庄
            this.game_huangZhuang();
        }
        //更新牌数
        var count =cc.vv.mahjongMgr._numOfMJ;
        var info = {data:{count:count}};
        cc.vv.game.dispatchEvent('mj_count_table',info);

        this.chupaiShowStage(cc.vv.mahjongMgr._turn, cc.vv.mahjongMgr._chupai);

         //当前动作
        if(cc.vv.mahjongMgr._curaction != null){
            this.showAction(cc.vv.mahjongMgr._curaction);
            cc.vv.mahjongMgr._curaction = null;
        }
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var seatid = cc.vv.roomMgr.realChairID(viewid);
            var seatData = cc.vv.mahjongMgr._seats[seatid];
            var chipenggang = seatData.chipenggang;
            //0吃 1碰 2暗杠 3明杠 4弯杠
            for (var indexchipenggang = 0; indexchipenggang < chipenggang.length; indexchipenggang++) {
                var pengGangpai = chipenggang[indexchipenggang];
                var pengGangType = pengGangpai[0];
                switch(pengGangType){
                    case 0:
                        var isgang = false;
                        var iswangang = false;
                        var pai = [pengGangpai[1][0], pengGangpai[1][1], pengGangpai[1][2], pengGangpai[1][3], pengGangpai[1][2]];
                        this.showPengGangAll(indexchipenggang, seatid, pai, isgang, iswangang);
                    break;
                    case 1:
                        var isgang = false;
                        var iswangang = false;
                        var paiItem = pengGangpai[1][1];
                        var pai = [pengGangpai[1][0], paiItem, paiItem, paiItem, paiItem];
                        this.showPengGangAll(indexchipenggang, seatid, pai, isgang, iswangang);
                    break;
                    case 2:
                        var isgang = true;
                        var iswangang = false;
                        var paiItem = pengGangpai[1][1];
                        var pai = [pengGangpai[1][0], -2, -2, -2, paiItem];
                        this.showPengGangAll(indexchipenggang, seatid, pai, isgang, iswangang);
                    break;
                    case 3:
                        var isgang = true;
                        var iswangang = false;
                        var paiItem = pengGangpai[1][1];
                        var pai = [pengGangpai[1][0], paiItem, paiItem, paiItem, paiItem];
                        this.showPengGangAll(indexchipenggang, seatid, pai, isgang, iswangang);
                    break;
                    case 4:
                        var isgang = true;
                        var iswangang = true;
                        var paiItem = pengGangpai[1][1];
                        var pai = [pengGangpai[1][0], paiItem, paiItem, paiItem, paiItem];
                        this.showPengGangAll(indexchipenggang, seatid, pai, isgang, iswangang);
                    break;
                }

                if(data.seats[i].guohu == true){
                    this.guohu(i);
                }else{
                    this.hideGuohuOne(i);
                }
                if(cc.vv.game.config.isGuoPeng){
                    if(data.seats[i].guopeng == true){
                        this.guopeng(i);
                    }else{
                        this.hideGuoPengOne(i);
                    }
                }
            }

            if(seatid == cc.vv.roomMgr.seatid){ 
                //更新手牌
                this.initSelfHold();
                this.initBaotingHold(); 
            }else{
                //更新手牌
                this.initOtherHold(seatid); 
            }

            var folds = seatData.folds;
            var length =  folds.length;
        
            //报听处理
            var m_bBaoTing_index = seatData.m_bBaoTing_index;
            if(m_bBaoTing_index != null && m_bBaoTing_index != -1){
                folds[m_bBaoTing_index] = -2; 
            }

            for (var index = 0; index < length; index++) {
                var end =  length;
                var pai = folds[index]
                var paiReturn = cc.vv.mahjongMgr.getMahjongPai(pai);
                var callbackFunc = function(){
                    if(seatid == cc.vv.mahjongMgr._turn){
                        var seatidTurn = cc.vv.mahjongMgr._turn;
                        // cc.vv.folds.setSpritePointer(seatidTurn, index, true);
                    }
                }
                this.showFolds(viewid, index, paiReturn, end, callbackFunc)
            }
        }

        if(data != null && data.myTag != null && data.myTag != -1 && cc.vv.mahjongMgr._turn != cc.vv.roomMgr.seatid){
            this.initMopai(cc.vv.mahjongMgr._turn, -3);
        }
        
        //显示出牌
        this.game_syncTurnChange();
        this.game_syncShowAction();

        //是否可以出牌
        cc.vv.mahjongMgr._canChui = (cc.vv.mahjongMgr._turn == cc.vv.roomMgr.seatid);
    },

    showChipai:function(pai,paiWik){
        if(paiWik == 0x01 || paiWik ==  0x02 || paiWik == 0x04){
            //单一吃型 发送，不用选择
             var sdata = {
                pai:pai,
                Wik:paiWik
            };
			cc.vv.net2.quick("chi",sdata);  
            return;
        }
        this.hideOptions();
        this.chiopts.active = true;
        if(paiWik & 0x01) { //左吃
            this.addChipai("pai_bottom",0x01,pai);
        }
        if(paiWik & 0x02){
            this.addChipai("pai_bottom",0x02,pai);
        }
        if(paiWik & 0x04){
            this.addChipai("pai_bottom",0x04,pai);
        }        
    },

    //显示多个吃牌
    addChipai:function(btnName,paiWik,pai){
        var paiL =0;
        var paiC =0;
        var paiR =0;
        if(paiWik == 0x01){
            paiL =pai;
            paiC =pai+1;
            paiR =pai+2;
        }else if(paiWik == 0x02){
            paiL =pai-1;
            paiC =pai;
            paiR =pai+1;
        }else if(paiWik == 0x04){
            paiL =pai-2;
            paiC =pai-1;
            paiR =pai;
        }
        for(var i = 0; i < this.chiopts.childrenCount; ++i){
            var child = this.chiopts.children[i]; 
            if(child.name == "op" && child.active == false){
                child.active = true;   
                var atlas = this.selfhandAtlasThreeD;
                var paiName = "img_cardvalue";
                var paik0 = cc.vv.mahjongMgr.getMahjongPai(paiL);
                var paiNamepaik0 = paiName + paik0;
                var spriteL = child.getChildByName("opTarget0").children[0].getComponent(cc.Sprite);
                spriteL.spriteFrame = atlas.getSpriteFrame(paiNamepaik0);

                var paik1 = cc.vv.mahjongMgr.getMahjongPai(paiC);
                var paiNamepaik1 = paiName + paik1;
                var spriteC = child.getChildByName("opTarget1").children[0].getComponent(cc.Sprite);
                spriteC.spriteFrame = atlas.getSpriteFrame(paiNamepaik1);

                var paik2 = cc.vv.mahjongMgr.getMahjongPai(paiR);
                var paiNamepaik2 = paiName + paik2;
                var spriteR = child.getChildByName("opTarget2").children[0].getComponent(cc.Sprite);
                spriteR.spriteFrame = atlas.getSpriteFrame(paiNamepaik2);
                var btn = child.getChildByName(btnName); 
                
                btn.active = true;
                btn.pai = actpai;
                btn.paiWik = paiWik;
                return;
            }
        }
    }, 

    showGang:function(pai,paiWik,actpai){
        if(paiWik.length == 1)
        {
			var sdata = {
				pai:actpai[0],
                wik:paiWik[0]
            }
			cc.vv.net2.quick("gang",sdata); 
            return;
        }
        this.hideOptions();
        this.gangopts.active = true;
        for(var i =0; i<paiWik.length;++i)
        {
            this.addGangpai('pai_bottom',paiWik[i],pai,actpai[i]);
        }           
    },

     //增加杠选项
     addGangpai:function(btnName,paiWik,pai,actpai){
        for(var i = 0; i < this.gangopts.childrenCount; ++i){
            var child = this.gangopts.children[i]; 
            if(child.name == "op" && child.active == false){
                child.active = true;   
                var atlas = this.selfhandAtlasThreeD;
                var paiName = "img_cardvalue";
                var paik0 = cc.vv.mahjongMgr.getMahjongPai(actpai[0]);
                var paiNamepaik0 = paiName + paik0;
                var spriteL = child.getChildByName("opTarget0").children[0].getComponent(cc.Sprite);
                spriteL.spriteFrame = atlas.getSpriteFrame(paiNamepaik0);

                var paik1 = cc.vv.mahjongMgr.getMahjongPai(actpai[1]);
                var paiNamepaik1 = paiName + paik1;
                var spriteC = child.getChildByName("opTarget1").children[0].getComponent(cc.Sprite);
                spriteC.spriteFrame = atlas.getSpriteFrame(paiNamepaik1);

                var paik2 = cc.vv.mahjongMgr.getMahjongPai(actpai[2]);
                var paiNamepaik2 = paiName + paik2;
                var spriteR = child.getChildByName("opTarget2").children[0].getComponent(cc.Sprite);
                spriteR.spriteFrame = atlas.getSpriteFrame(paiNamepaik2);

                var paik3 = cc.vv.mahjongMgr.getMahjongPai(actpai[3]);
                var paiNamepaik3 = paiName + paik3;
                var spriteR = child.getChildByName("opTarget3").children[0].getComponent(cc.Sprite);
                spriteR.spriteFrame = atlas.getSpriteFrame(paiNamepaik3);

                var btn = child.getChildByName(btnName); 
                
                btn.active = true;
                btn.pai = actpai;
                btn.paiWik = paiWik;
                return;
            }
        }
    },

    //隐藏所有手牌
    hideAllHolds:function(){
        var game = cc.find("Canvas/mgr/game");
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var holds = sideRoot.getChildByName("holds");
            holds.removeAllChildren();
        }
    },  

    hideAllChupai:function(){
        var game = cc.find("Canvas/mgr/game");
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var holds = sideRoot.getChildByName("holdschupai");
            holds.removeAllChildren();
        }
    },

    //隐藏所有吃碰杠的牌
    hideAllChiPengGang:function(){
        var game = cc.find("Canvas/mgr/game");
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var penggangs = sideRoot.getChildByName("penggangs");
            penggangs.removeAllChildren();
        }
    },  


    //下移所有自己的牌
    setSelectDown:function(selfData){
        var isClick = 0;
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        //自己手牌
        var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var selfPai = cc.vv.game.sortHolds(seatData);
        var selfLength = selfPai.length;
        var selfStartIndex = cc.vv.game.getStartIndex(selfPai);
        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
            var parent = this.getHoldParent(viewid, "holds");
            var data = {
                enabled:isClick
            }
            var myTag = viewid + "_holds_" + index;
            if(myTag != selfData){
                this.send_card_emit(parent, "setSelect", data, myTag);
            }
        }
    },

    //设置庄家
    setZhuang:function(){
        var zhuangIndex = cc.vv.roomMgr.viewChairID(cc.vv.mahjongMgr._zhuang);
        //庄家
        for(var i = 0; i < cc.vv.mahjongMgr._seats.length; ++i){
            //庄家
            cc.vv.game.table.seat_emit(i,"dingzhuang",{seatid:zhuangIndex});
        }
    },

    game_huangZhuang:function(){
        if(cc.vv.mahjongMgr._lastLiuJu){
            var zhuangIndex = cc.vv.roomMgr.viewChairID(cc.vv.mahjongMgr._lastZhuang);
            //庄家
            for(var i = 0; i < cc.vv.mahjongMgr._seats.length; ++i){
               //庄家
               cc.vv.game.table.seat_emit(i,"huangzhuang",{seatid:zhuangIndex});
           }
        }else{
            cc.vv.game.table.seat_emit(null,"huangzhuang",{seatid:null});
        }
    },

    //吃碰杠 2
    playChipeng:function(seatid, pai, isgang){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var startIndex = cc.vv.mahjongMgr.getNumberPai(seatid) - 3;
        if(startIndex < 0){
            return;
        }
        this.game_chipeng(viewid, startIndex, pai, isgang);
    },

    //碰杠胡动画
    AnimationChipeng:function(parent, viewid, index, startIndex, isgang){
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
        var onePaiX =  - pos.distancehide[index - 1] * pos.scalehide;
        var threePaiX = pos.distancehide[index] * pos.scalehide;
        var onePaiY =  - pos.distanceHhide[index - 1] * pos.scalehide;
        var threePaiY = pos.distanceHhide[index] * pos.scalehide;
        var scale = chiPeng.scale;
        var toChiPengGangX = chiPeng.destination[startIndex / 3].x;
        var toChiPengGangY = chiPeng.destination[startIndex / 3].y;
        var viewSelf = cc.vv.mahjongMgr.getViewidBySide("myself");
        var self = this;
        var callback = function(){
            cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_dapai");
            var node = cc.instantiate(self.prefabPengganghuTexiao);
            parent.addChild(node);
            var animation = node.getComponent(cc.Animation);
            animation.play("pengganghutexiao");
            if(viewid == viewSelf){
                parent.runAction(cc.sequence(cc.delayTime(0.3) ,cc.spawn(cc.scaleTo(0.2, scale, scale), cc.moveTo(0.2, toChiPengGangX, toChiPengGangY))), cc.callFunc(function(){
                    cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_dapai");
                }, this));   
            }else{
                parent.scale = scale;
            }
        }
        var myTag = viewid + "_chipenggang_"  + (startIndex / 3) + "_"  + 0;
        var info = {
            time:0.1,
            x:onePaiX,
            y:onePaiY,
        } 
        this.send_card_emit(parent, "moveTo", info, myTag);
        
        var tagthree = viewid + "_chipenggang_"  + (startIndex / 3) + "_"  +  2;
        var infothree = {
            time:0.1,
            x:threePaiX,
            y:threePaiY,
            callback:callback
        } 
        this.send_card_emit(parent, "moveTo", infothree ,tagthree);

        var tagfour = viewid + "_chipenggang_" + (startIndex / 3) + "_"  + 3;
        var infofour = {
           isActive:isgang,
        } 
        this.pengGangIsActive(parent, infofour, tagfour);
        var infofourzindex = {
           zIndex:15,
        } 
        this.send_card_emit(parent, "setZIndex", infofourzindex ,tagfour);
        if(isgang){
            this.gangAnimation(parent, tagfour, viewid);
        }
    },

    //杠牌动画
    gangAnimation:function(parent, myTag, viewid){
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
        var holds = cc.vv.utils.deepCopy(posall[viewid].holds);
        var fourPai = chiPeng.fourPai;
        var self = this;
        var callback = function(){
            cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_dapai");
            var info = {
                time:0.1,
                x:fourPai.x * holds.scalehide,
                y:fourPai.y * holds.scalehide,
            } 
            self.send_card_emit(parent, "moveTo", info, myTag);
        }

        var isgang = true;

        var infofour = {
            isActive:isgang,
            callback:callback
         } 
        this.pengGangIsActive(parent, infofour, myTag);
        // var infoQuantou = {

        // }
        // this.send_card_emit(parent, "setQuantou", infoQuantou ,myTag);
    },

    //刮风
    guafengAnimation:function(viewid){
        var Parent = this.getHoldParent(viewid, "guafengxiayu");
        var prefabGuangfengxiayu = Parent.getChildByName("prefabGuangfengxiayu");
        var guafeng = prefabGuangfengxiayu.getChildByName("guangfeng");
        var guafengAnim  = guafeng.getComponent(cc.Animation);
        guafengAnim.play("guangfengAttribute");
        var feng = guafeng.getChildByName("feng");
        var fengAnim  = feng.getComponent(cc.Animation);
        fengAnim.play("guangfeng");
    },

    //下雨
    xiayuAnimation:function(viewid){
        var Parent = this.getHoldParent(viewid, "guafengxiayu");
        var prefabGuangfengxiayu = Parent.getChildByName("prefabGuangfengxiayu");
        var xiayu = prefabGuangfengxiayu.getChildByName("xiayu");
        var xiayuAnim = xiayu.getComponent(cc.Animation);
        xiayuAnim.play("xiayuAttribute");
        var yu = xiayu.getChildByName("yu");
        var yuAnim = yu.getComponent(cc.Animation);
        yuAnim.play("xiayu");
    },

    //重连显示牌
    chupaiShowStage:function(trun, pai){
        var self = this;
        if(pai == -1 || pai == null) return;
        if(trun == -1) return;
        
        var indexK = 9;
        var end = 10;
        
        var prefab = this.PrefabMajiang;
        var atlas = self.selfhandAtlasThreeD;
        var scriptsName = "KDMajiang";
        var viewidpos = cc.vv.mahjongMgr.getViewidBySide("myself");
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewidpos].holds);
        var viewid = cc.vv.roomMgr.viewChairID(trun);
        var posSelf =  cc.vv.utils.deepCopy(posall[viewid].chupaiShow);
        pos.distance = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distanceH = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distancehide = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distanceHhide = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.x = posSelf.x;
        pos.y = posSelf.y;
        pos.scale = posSelf.scaleTo;
        pos.img = pos.imgshow;
        pos.img[indexK] = "Frame_ziji_dachupai_4";
        pos.size = pos.sizehide;
        pos.size[indexK] = posSelf.size;
        pos.dian = pos.dianhide;
        pos.dianScaleAll = posSelf.dianScaleAll;
        pos.dian.position[indexK] = posSelf.dian.position;
        pos.dianScaleY = posSelf.dianScaleAll;
       
        var parent = this.getHoldParent(viewid, "holdschupai");
        var paiName = "img_cardvalue";
        var seatDataFolds = cc.vv.mahjongMgr._seats[trun];
        var folds = seatDataFolds.folds;
        if(trun == cc.vv.roomMgr.seatid){
            folds.push(pai);
            return;
        }
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var foldslength = folds.length - 1;
        var tagall = viewid + "_chupai_" + foldslength;
        var myTag = "_chupai_";
        var dianAtlas = self.selfhandAtlasThreeD;

        var callback = function(){
            var isShowInfo = {
                isShow:true,
            }
            self.send_card_emit(parent, "setLight", isShowInfo, tagall);
            var lightInfo = {
    
            }
            self.send_card_emit(parent, "setChuLight", lightInfo, tagall);
        }

        var info = {
            prefab:prefab,
            atlas:atlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            indexK:indexK,
            parent:parent,
            paiName:paiName,
            pai:pai,
            myTag:myTag,
            end:end,
            tagall:tagall,
            dianAtlas:dianAtlas,
            callback:callback,
        } 
        self.showFapai(info);
        this._chupaiArr.push(tagall);
    },

    //重连碰杠 1
    showPengGangAll:function(indexPengGang, seatid, pai, isgang, iswangang){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var parent = this.getHoldParent(viewid, "penggangs");
        var nodeChipenggang = new cc.Node("nodeChipenggang" + viewid);
        nodeChipenggang.myTag = viewid + "_nodeChipenggang_" + indexPengGang;
        parent.addChild(nodeChipenggang);
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
        var toChiPengGangX = chiPeng.destination[indexPengGang].x;
        var toChiPengGangY = chiPeng.destination[indexPengGang].y;
        nodeChipenggang.x = toChiPengGangX;
        nodeChipenggang.y = toChiPengGangY;
        nodeChipenggang.scale = chiPeng.scale;
        var startIndex = indexPengGang * 3;
        var end = 4;
        for (var index = startIndex; index < end + startIndex; index++) {
            this.showPengGang(startIndex, nodeChipenggang, viewid, index, pai, end + startIndex, isgang, iswangang);
        }
    },

    //重连碰杠 2
    showPengGang:function(startIndex, parent, viewid, indexK, paiAll, end, isgang, iswangang){
        var self = this;
        var pai = paiAll[indexK - startIndex + 1];
        var seatidForm = paiAll[0];
        var isgangData = isgang;
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid]; 
        switch(sideName){
            case "myself":
                    var atlas = this.selfhandAtlasThreeD;
                break;
            case "right":
                var dianAtlas = this.righthandAtlasThreeD;
                var atlas = this.lefthandAtlasThreeD;
            break;
            case "up":
                var atlas = this.uphandAtlasThreeD;
                var dianAtlas = this.selfhandAtlasThreeD;
            break;
            case "left":
                var dianAtlas = this.lefthandAtlasThreeD;
                var atlas = this.lefthandAtlasThreeD;
            break;
        }
        var prefab = this.PrefabMajiang;
        var scriptsName = 'KDMajiang';
        var paiName = "img_cardvalue";
        var posall = cc.vv.game.config["card_" + cc.vv.roomMgr.ren];
        var pos = cc.vv.utils.deepCopy(posall[viewid].holds);
        var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
        if(indexK == startIndex){
            pos.x = -pos.distancehide[indexK + 1] * pos.scalehide;
            pos.y = -pos.distanceHhide[indexK + 1] * pos.scalehide;
            pos.xhide = -pos.distancehide[indexK + 1] * pos.scalehide;
            pos.yhide = -pos.distanceHhide[indexK + 1] * pos.scalehide;
        }else if(indexK == (startIndex + 1)){
            pos.x = 0;
            pos.y = 0;
            pos.xhide = 0;
            pos.yhide = 0;
        }else if(indexK == (startIndex + 2)){
            pos.x = pos.distancehide[indexK + 1] * pos.scalehide;
            pos.y = pos.distanceHhide[indexK + 1] * pos.scalehide;
            pos.xhide = pos.distancehide[indexK + 1] * pos.scalehide;
            pos.yhide = pos.distanceHhide[indexK + 1] * pos.scalehide;
        }else if(indexK == (startIndex + 3)){
            var chiPeng = cc.vv.utils.deepCopy(posall[viewid].chiPeng);
            var fourPai = chiPeng.fourPai;
            if(isgangData){
                pos.x = fourPai.x * pos.scalehide;
                pos.y = fourPai.y * pos.scalehide;
                pos.xhide = fourPai.x * pos.scalehide;
                pos.yhide = fourPai.y * pos.scalehide;
            }else{
                pos.x = fourPai.x * pos.scalehide;
                pos.y = fourPai.y * pos.scalehide + 200;
                pos.xhide = fourPai.x * pos.scalehide;
                pos.yhide = fourPai.y * pos.scalehide + 200;
            }
        }
        pos.scale = pos.scalehide;
        pos.distance = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distanceH = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distancehide = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.distanceHhide = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pos.img = pos.imgshow;
        pos.size = pos.sizehide
        pos.dian = pos.dianhide;
        pos.dianScaleAll = pos.dianScalehideAll;
        if(pos.scaleItemhide){
            pos.scaleItemhidescale = pos.scaleItemhide;
        }
        if(chiPeng.paiIndex){
            parent.zIndex = chiPeng.paiIndex[startIndex / 3];
        }
        var pai = cc.vv.mahjongMgr.getMahjongPai(pai);
        var myTag = "_chipenggang_";
        var tagall = viewid + "_chipenggang_" + (startIndex / 3) + "_" + (indexK - startIndex);
        function callback(){
            var tagfour = viewid + "_chipenggang_" + (startIndex / 3) + "_"  + 3;
            var infofour = {
                isActive:isgang
            } 
            self.pengGangIsActive(parent, infofour, tagfour);
            var selfSeatid = cc.vv.roomMgr.realChairID(viewid);
            var info = {
                seatid:seatidForm,
                selfSeatid:selfSeatid,
            }
            // self.send_card_emit(parent, "setArrow", info, tagfour)
            var tagTwo = viewid + "_chipenggang_" + (startIndex / 3) + "_"  + 1;
            self.send_card_emit(parent, "setArrow", info, tagTwo)
            // if(iswangang){
            //     var setQuantouInfo = {

            //     } 
            //     self.send_card_emit(parent, "setQuantou", setQuantouInfo, tagfour)
            // }
            var infofourzindex = {
                zIndex:15,
             } 
             self.send_card_emit(parent, "setZIndex", infofourzindex ,tagfour);
        }
        var data = {
            prefab:prefab,
            atlas:atlas,
            dianAtlas:dianAtlas,
            scriptsName:scriptsName,
            pos:pos,
            viewid:viewid,
            end:end,
            parent:parent,
            paiName:paiName,
            indexK:indexK,
            pai:pai,
            myTag:myTag,
            tagall:tagall,
            callback:callback,
        }
        this.showFapai(data);
    },

    // 获取是否有出牌可听列表
    getisHasTingChupai(){
        return this._ting_chupai && this._ting_chupai.length;
    },

    //显示听牌表
    showTingPaiList:function(keda, pai){
        var tingPaiListNode = cc.find("Canvas/open/tingPaiList");
        tingPaiListNode.removeAllChildren();
    
        //如果不是自己的轮次，则忽略
        if(cc.vv.mahjongMgr._turn != cc.vv.roomMgr.seatid){
            return false;
        }
        this._tingpai=[];
        this._tingpaifan=[];
        this._tingpaifannew =[];
        //已经有状态不能拖
        var _ting_yes_no = false;
        for(var i=0;i<this._ting_chupai.length;++i)
        {
            if(pai == this._ting_chupai[i])
            {
                _ting_yes_no=true
                break;
            }
        }
        if (!_ting_yes_no)
        {
            tingPaiListNode.active = false;
        }else
        {
            var Choose_outcrad;
            for(var i = 0;i<this._ting_need.length;++i)
            {
                if(pai == this._ting_need[i].chupai)
                {
                    Choose_outcrad = i;
                    break;
                }
            }
            for(var i = 0;i<this._ting_need[Choose_outcrad].tingpai.length;++i)
            {
                this._tingpai[this._tingpai.length] = this._ting_need[Choose_outcrad].tingpai[i].pai;
                this._tingpaifan[this._tingpaifan.length]=this._ting_need[Choose_outcrad].tingpai[i].left; //本来是番数，现在已改成 剩余牌数，存取所有牌的剩余牌数
                if(cc.vv.game.config.is_tingfan){
                    this._tingpaifannew[this._tingpaifannew.length]=this._ting_need[Choose_outcrad].tingpai[i].fan;
                }
            }
            tingPaiListNode.active = true;
            for(var i=0;i<this._tingpai.length;++i)
            {
                var tingpailist = cc.instantiate(this.tingpaiMJpre);
                tingpailist.getComponent("ThreeListenCard").show(this._tingpai[i],this._tingpaifan[i]);
                if(cc.vv.game.config.is_tingfan){
                    tingpailist.getComponent("ThreeListenCard").fan(this._tingpaifannew[i]);
                }
                tingPaiListNode.addChild(tingpailist);
            }
            if(this._tingpai.length <= 5){
                tingPaiListNode.width = 20 + 200  * this._tingpai.length;
            }else{
                tingPaiListNode.width = 1200;
            }
        }
    },

    showTing:function(pai){
        //自己手牌
        var selfSeatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var holds =  cc.vv.game.sortHolds(selfSeatData);
        var length = holds.length;
        var startIndex = cc.vv.game.getStartIndex(holds);
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        for (var index = startIndex; index < length + startIndex; index++) {
            for (var indexPai = 0; indexPai < pai.length; indexPai++) {
                if(pai[indexPai] == holds[index - startIndex]){
                    var myTag = viewid + "_holds_" + index;
                    var data = {
                        isActive:true,
                    }
                    this.send_card_item_emit("holds", viewid, "setTing", data, myTag);
                }
            }
        }
    },

    hideting:function(){
        var selfSeatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        var holds = cc.vv.game.sortHolds(selfSeatData);
        var length = holds.length;
        var startIndex = cc.vv.game.getStartIndex(holds);
        var viewid = cc.vv.mahjongMgr.getViewidBySide("myself");
        for (var index = startIndex; index <length + startIndex; index++) {
            var myTag = viewid + "_holds_" + index;
            var data = {
                isActive:false,
            }
            this.send_card_item_emit("holds", viewid, "setTing", data, myTag);
        }
    },

    //碰杠胡之后隐藏出牌
    pengGangIsActive:function(parent, infofour, tagfour){
        this.send_card_emit(parent, "setActive", infofour ,tagfour);
    },

    //设置报听之后
    setBaoting:function(){
        if(this._baoting == 1){
            //报听后所有的牌都不可点击(除了出的牌)
            var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
            var pai = cc.vv.game.sortHolds(seatData);
            var selfStartIndex = cc.vv.game.getStartIndex(pai);
            var selfLength = pai.length;
            for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
                    if((selfLength == 2 || selfLength == 5 || selfLength == 8 || selfLength == 11 || selfLength == 14) && index == selfStartIndex + selfLength -1){
                        return;
                    }
                    var viewid = cc.vv.roomMgr.viewChairID(cc.vv.roomMgr.seatid);
                    var myTag = viewid + "_holds_" + index;
                    var holds = pai[index - selfStartIndex];
                    var data = {
                        keda:0
                    }
                    this.send_card_item_emit("holds", viewid, "setKeda", data, myTag);

                    var data = {
                        isAn:true,
                    }
                    this.send_card_item_emit("holds", viewid, "setColor", data, myTag);
            }
        }
    },

    //设置倒计时时间
    setArrowNum:function(num){
        var data = {
            data:{
                count:num,
            }
        }
        this._prefabArrow.emit("changeNum", data);
    },

    //开始倒计时
    startArrowNum:function(){
        this._prefabArrow.getComponent("arrow").labelLblTime.string = 10;
        this.schedule(this.otherTimeUpdate,1);
    },

    //其他玩家倒计时
    otherTimeUpdate:function(){
        var time =  this._prefabArrow.getComponent("arrow").labelLblTime;
        var number = parseInt(time.string);
        number -= 1;
        this.setArrowNum("0" + number);
        if(number <= 0){
            cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_daojishi");
            this.unschedule(this.otherTimeUpdate);
        }
    },

    //给牌发消息
    send_card_emit:function(parent, name, data, myTag){
        if(!parent){
            return;
        }
        var node = cc.vv.utils.getChildByTag(parent,myTag);
        if(node){
            node.emit(name,data);
        }
    },

    //给牌发消息(根据种类)
    send_card_item_emit:function(type, viewid, name, data, myTag){
        switch (type) {
            case "holds":
                var parent = this.getHoldParent(viewid, "holds");
                this.send_card_emit(parent, name, data, myTag);
                break;
            case "folds":
                var parent = this.getHoldParent(viewid, "folds").getChildByName("list");
                this.send_card_emit(parent, name, data, myTag);
                break;
        }
    },

    reset:function(){
        this._autoOutCrad = false;
        this._baoting = 0;
        this._baotingchupai = false;
        this._myMJArr = [];
        this._playEfxs = null;
        this._opts = [];
        this._ting_chupai = [];
        this._ting_tingpai = [];
        this._ting_need = [];
        this._tingpai = [];
        this._tingpaifan = [];
        this._tingpaifannew = [];
        this._yiting = false; 
        this._guo_pai = null;
        this._ting_hupai = 0;
        this._tinghuhoupai = 0;
        this._showActoin_yse_not = false;
        this._select_crad = null;
        this._isfrist = false;
        this._isfristAction = false;
        this._isfristTingAction = false;
        this._isfristTing1Action = false;
        this._chupaiArr = [];
        this._datating = null;//听牌数据
        this._datating1 = null;
    },

    initTingList:function(data)
    {
        this._ting_need = data;
    },

    initPengAndGangsAndChi:function(seatView,side,targetSide,index,mjid,flag){
        var pgroot = null;
        if(seatView._pengandgang.length <= index){
            pgroot = cc.instantiate(cc.vv.mahjongMgr.pengPrefabSelf);
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot);    
        }else{
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
        }

        var  sprites = pgroot.children;
        for(var s = 0; s < sprites.length-2; ++s){
            var sprite   = sprites[s].getComponent(cc.Sprite);
            var mjSprite = sprites[s].children[0].getComponent(cc.Sprite);
            var penggang_tip   = pgroot.getChildByName("peng_gang_tip");//获得 预制件的 吃碰杠 指示控件
            sprite.node.color = cc.color(255, 255, 255);
            sprite.node.opacity = 255;
            mjSprite.node.color = cc.color(255, 255, 255);

            if(sprite.node.name == "gang"){
                var isGang =((flag != "peng") && (flag != "chi"));
                sprite.node.active = isGang;
                sprite.spriteFrame   = cc.vv.mahjongMgr.getBgSpriteFrame("myself");
                mjSprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("B_",mjid[s]);
            }
            else{
                if(flag == "angang" || flag == "wangang"){
                    sprites[5].active = true
                }
                if(flag == "angang"){
                    sprite.spriteFrame = cc.vv.mahjongMgr.getEmptySpriteFrame("myself");   
                    mjSprite.spriteFrame = null;     
                    if(side == "myself"){
                        penggang_tip.rotation = 270;
                    }else if(side == "up"){
                        penggang_tip.rotation = 90;
                    }else if(side == "left"){
                        penggang_tip.rotation = 0;
                    }else if(side == "right"){
                        penggang_tip.rotation = 180;
                    }
                }
                else{      
                    var mjIdx = s;//碰杠吃指示          
                    var empty = false;
                    if(flag!= "chi"){
                        if(targetSide == s){
                            if(mjIdx == 2){     //下家
                                if(cc.vv.roomMgr.ren == 2){
                                    if(side == "myself")
                                        penggang_tip.rotation = 90;
                                    else if(side == "up")
                                        penggang_tip.rotation = 270;
                                }
                                else if(cc.vv.roomMgr.ren == 3){
                                    if(side == "myself")
                                        penggang_tip.rotation = 180;
                                    else if(side == "left")
                                        penggang_tip.rotation = 270;
                                    else if(side == "right")
                                        penggang_tip.rotation = 0;
                                }else{
                                    if(side == "myself")
                                        penggang_tip.rotation = 180;
                                    else if(side == "left")
                                        penggang_tip.rotation = 270;
                                    else if(side == "right")
                                        penggang_tip.rotation = 90;
                                    else if(side == "up")
                                        penggang_tip.rotation = 0;
                                }
                                empty = true;
                            }
                            else if(mjIdx == 1){ //对家    
                                if (cc.vv.roomMgr.ren == 3){
                                    if (side == "myself")
                                        penggang_tip.rotation = 0;
                                    else if (side == "right")
                                        penggang_tip.rotation = 270;
                                    else if (side == "left")
                                        penggang_tip.rotation = 180;
                                }else{
                                    if (side == "myself")
                                        penggang_tip.rotation = 90;
                                    else if (side == "left")
                                        penggang_tip.rotation = 180;
                                    else if (side == "right")
                                        penggang_tip.rotation = 0;
                                    else if (side == "up")
                                        penggang_tip.rotation = 270;
                                }              
                                empty = true;                       
                            }
                            else if(mjIdx == 0){  //上家
                                if(cc.vv.roomMgr.ren == 2){
                                    if(side == "myself")
                                        penggang_tip.rotation = 90;
                                    else if(side == "up")
                                        penggang_tip.rotation = 270;
                                }
                                else if(cc.vv.roomMgr.ren == 3){
                                    if(side == "myself")
                                        penggang_tip.rotation = 0;
                                    else if(side == "left")
                                        penggang_tip.rotation = 180;
                                    else if(side == "right")
                                        penggang_tip.rotation = 270;
                                }else{
                                    if(side == "myself")
                                        penggang_tip.rotation = 0;
                                    else if(side == "left")
                                        penggang_tip.rotation = 90;
                                    else if(side == "right")
                                        penggang_tip.rotation = 270;
                                    else if(side == "up")
                                        penggang_tip.rotation = 180;
                                }
                                empty = true;
                            }
                        }
                    }
                    else{
                        if(targetSide == mjid[s]){
                            empty = true;
                        }
                    }
                    sprite.spriteFrame  =  cc.vv.mahjongMgr.getBgSpriteFrame("myself");                                 
                    mjSprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("B_",mjid[s]);
                }
            }
        }
        pgroot.x = index * 55 * 3 + index * 30 + 100;
    },

    //给牌发消息
    getNodeByTag:function(parent, myTag){
        var node = cc.vv.utils.getChildByTag(parent,myTag);
        return node;
    },

    
    //指定位置播放动画
    playEfx:function(index,name){
        var side = cc.vv.mahjongMgr.getSide(index);
        this._playEfxs[side].node.active = true;
        this._playEfxs[side].play(name);
        this._playEfxs[side].node.scaleX = 0.8;
        this._playEfxs[side].node.scaleY = 0.8;
    },

    //指定位置播放动画
    PlayEfxAnim:function(index,name,callbackFunc){
        var side = cc.vv.mahjongMgr.getSide(index);
        var node = this._prefabPlayEfxAnim[side].node;
        node.active = true;
        node.scaleX = 0.8;
        node.scaleY = 0.8;
        var label = node.getChildByName("label").getComponent(cc.Sprite);
        var labelLight = node.getChildByName("labelLight").getComponent(cc.Sprite);
        switch(name){
            case "play_chi":
                label.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_0");   
                labelLight.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_glow_0");     
            break;
            case "play_peng":
                label.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_1");   
                labelLight.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_glow_1");    
            break;
            case "play_gang":
                label.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_2");   
                labelLight.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_glow_2");    
            break;
            case "play_ting":
                label.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_3");   
                labelLight.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_glow_3");  
            break;
            case "play_hu":
                label.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_4");   
                labelLight.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_glow_4"); 
            break;
            case "play_zimo":
                label.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_5");   
                labelLight.spriteFrame = this.majiangbtnAtlasThreeD.getSpriteFrame("ani_special_real_glow_5"); 
            break;
        }
        this._prefabPlayEfxAnim[side].off('finished');
        this._prefabPlayEfxAnim[side].on('finished',  function(){
            callbackFunc();
        }, this);
        this._prefabPlayEfxAnim[side].play("chipengganghu");
    },


    //播放音效
    playSFX(setaid,type){
        var sex = cc.vv.roomMgr.userSex(setaid);
        if(sex !='1' && sex!='2'){
            sex = '1';
        }
        var mp3File = "mj/" + sex + "/" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },

    //获取麻将父节点
    getHoldParent:function(viewid, name){
        var side = cc.vv.mahjongMgr.getSide(viewid);
        var sideChild = this.nodeGameRoot.getChildByName(side);
        if(!sideChild){
            return;
        }
        var chaildName = sideChild.getChildByName(name);
        return chaildName;
    },
    
    //初始化牌
    initTuodong:function(position, pai){
        this.nodeTuodong.setPosition(position);
        var altas = this.selfhandAtlasThreeD;
        var myMahJongPai = this.nodeTuodong.getChildByName("MyMahJongPai"); 
        var spriteFrame = altas.getSpriteFrame("img_cardvalue" + cc.vv.mahjongMgr.getMahjongPai(pai));
        myMahJongPai.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        var mask = this.nodeTuodong.getChildByName("magic_mash");    
        if(pai ==  cc.vv.mahjongMgr._magicPai || pai == cc.vv.mahjongMgr._magicPai2){
            mask.active = true;
        }else{
            mask.active = false;
        }        
    },

    //初始化牌
    setTuodong:function(position){
        if(this.nodeTuodong.isValid){
            this.nodeTuodong.setPosition(position);
        }
    },

    sit:function(data){
        if (data.userid == cc.vv.userMgr.userid) {
            cc.vv.roomMgr.seatid = data.seatid;
            if(data.seatid != this._oldseatid){
                this.setDirection();
                this.isChoose_sit = true;
                this._oldseatid = data.seatid;
            }
        }
    },

    table:function(data){
        var list = data.list;
        var isFangXiang = cc.vv.mahjongMgr._fangxiang;
        var issitSelf = -1;
        for (var index = 0; index < list.length; index++) {
            var item = list[index];
            var seatid = item.seatid;
            var userid = item.userid;
            if(userid == cc.vv.userMgr.userid){
                issitSelf = seatid;
            }
        }
        var isSitSelf = (issitSelf == -1);
        cc.vv.zuowei.hideBtn();
        if(isSitSelf){
            for (var index = 0; index < list.length; index++) {
                if(list[index].userid != 0){   
                    cc.vv.zuowei.isActiveBtnone(isFangXiang[index], false);
                }else{
                    cc.vv.zuowei.isActiveBtnone(isFangXiang[index], true);
                }
            }
            if(!this.isShowAutoTip){
                this.isShowAutoTip = true;
                this.auto_tips(15,"入座");
            }
        }else{
            this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
            cc.vv.roomMgr.seatid = issitSelf;
            cc.vv.zuowei.hideBtn();
            this.mgr = this.node.getChildByName("mgr");
            this.mgr.getChildByName("ready").opacity = 255;
            this.mgr.getChildByName("ready").scale = 1;
            if(!this.isChoose_sit){
                if(issitSelf != -1 && this._oldseatid != issitSelf){
                    this.setDirection();
                    this._oldseatid = issitSelf;
                }
            }
        }
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

});
