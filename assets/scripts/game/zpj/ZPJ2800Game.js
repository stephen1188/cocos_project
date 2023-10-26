cc.Class({
    extends: cc.Component,

    properties: {
        tipDianAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        dianshuAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        xiazhuAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        typeSeZi:{
            default:null,
            type:cc.SpriteAtlas
        },
        typeAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        jiesuanAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        moneyGold:{
            default:null,
            type:cc.SpriteAtlas
        },
        tipAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        sprTip:cc.Sprite,
        sprTipe:cc.Sprite,      //显示第几道下注

        labelRoomwanfa:cc.Label,

        prefabYaosezi:cc.Prefab,
        preTJDkaipai:cc.Prefab,
        reportItemPrefab:cc.Prefab,
        prefabTJDMingPai:cc.Prefab,
        PrefabMajiang:cc.Prefab,
        PrefabDianshu:cc.Prefab,

        _wanfa:0,
        _zhuang:0,
        _zhuang_mode:0,
        _hang:4,//牌堆行
        _lie:8,//牌堆列
    },

    editor: {
        executionOrder: -1
    },

    onLoad(){
        //牛牛配置
        var const_zpj = require("ZPJ2800Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"zpj",
            hide_nothing_seat:false,
            direct_begin:true,
            chat_path:const_zpj.chat_path,
            quick_chat:const_zpj.quick_chat,
            player_4:const_zpj.player4,
            xipai_pos:const_zpj.xipai_pos,
            not_xipai_pos:const_zpj.not_xipai_pos,
            set_bg:false,
            location:false,
            show_watch_btn:true,//是否显示观战按钮
        }
        this._winPlayer = cc.find("Canvas/mgr/players");
        //获取对象
        this.table = this.node.getComponent("Table");
        this.nodeMsg = this.node.getChildByName("mgr");
        this.node_watchgame = this.node.getChildByName("watchgame");
        this.nodeZhuang = this.nodeMsg.getChildByName("zhuang");
        this.nodeCard = this.nodeMsg.getChildByName("cards");
        this.nodeSezi = this.nodeMsg.getChildByName("sezi");
        this.nodeXiazhu = this.nodeMsg.getChildByName("xiazhu");
        this.nodeLabelscore = this.nodeMsg.getChildByName("score");
        this.nodeCuopai = this.nodeMsg.getChildByName("cuopai");
        this.nodeKaipai = this.nodeMsg.getChildByName("kaipai");
        this.nodeJiesuan = this.node.getChildByName("report").getChildByName("jiesuan");
        this.nodeReport = this.node.getChildByName("report").getChildByName("report");
        this.nodeMingpai = this.nodeMsg.getChildByName("folds").getChildByName("dibox");
        this.nodeAllPai = this.nodeMsg.getChildByName("folds").getChildByName("dibox").getChildByName("ZPJAllPai");
        this.nodeIsQiangZhuang = this.nodeMsg.getChildByName("isqiangzhuang");
        this.tuoguanNode =  this.node.getChildByName("tuoguan");
        this.btn_tuoguan = this.nodeMsg.getChildByName("hud").getChildByName("oper").getChildByName("btn_tuoguan");
        this.is_click_cuopai = false;//是否可以搓牌
        this.isPlay = false;
        this.is_click_xuanpai = false;//是否可以 选牌型了

        //明牌数
        this.mingpaiValue = 0;

        //色子点数
        this.dianshu = 0;

        //每次发多少张
        this.paiNumber = cc.vv.tempDataMgr.pokerNine==1?2:4;;

        //是否手动要骰子
        this.isAutoYao = false;

        //下注数组
        this.nodeLabelscoreArr =  this.nodeLabelscore.children;

        //色子音效
        this.soundSaizi = -1;

        //显示下注
        this.isBeginXiazhu = false;

        //开牌时选中的牌的数组
        this.kaipaiArr = [];

        //搓牌时，移动的牌数组
        this.cuopaiNodeArr = [];

        this.showcuopai = false;
        
        // this._hang = cc.vv.tempDataMgr.pokerNine==1?2:4;
        
        this.initData();

        //监听协议
        this.initEventHandlers();
    },

    start () {
        var self = this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        cc.vv.ZPJMgr = this.node.getComponent("ZPJ2800Mgr");
        //回放
        var ReplayMgr = require("ZPJ2800ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();
        
        //初始化
        this.new_round();

        if(cc.vv.roomMgr.is_replay){
            //回放控制器
            cc.vv.popMgr.open('ReplayCtrl',function(obj){
                self._winRealName=obj;
            });
            //初始数据
            cc.vv.ZPJMgr.prepareReplay();
            
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

    //观战的人进入游戏 刷新table
    user_status_change:function(data){
        var table_list = cc.vv.roomMgr.table.list;
        var halfwayInGame_realCount = 0;//中途进入房间的人数
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

    watch_game_list:function(){
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                var is_viewid = cc.vv.roomMgr.viewChairID(table_list[i].seatid);
                var seat_node = cc.vv.utils.getChildByTag(this._winPlayer,is_viewid);//刷新人物分数
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
    watch_game:function(){
        var is_watch_game = false;
        var table_list = cc.vv.roomMgr.table.list; 
        if(cc.vv.roomMgr.guanzhan_table){
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

    //监听协议
    initEventHandlers:function(){
        //初始化事件监听器
         //初始化事件监听器
        var self = this;

        // console.log("这是啥3？",cc.vv.tempDataMgr.pokerNine)
        cc.game.on(cc.game.EVENT_HIDE, function () {
            self._itemkaipai.active = false;
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay){
                if(cc.vv.roomMgr.started == 1){
                    cc.vv.audioMgr.stopSFX(self.soundSaizi);
                    cc.vv.popMgr.wait("正在恢复桌面",function(){
                        setTimeout(() => {
                            cc.vv.net2.quick("stage");
                        }, 1000);
                    });
                }
            }
        });
        //观战的人进入游戏 刷新table
        this.node.on('error',function(data){
            self.error(data);
        }),

        //坐入 变成观战
        this.node.on('watch',function(data){
            self.watch(data.data);
        });

        this.node.on('param',function(data){
            self.param(data.data);
        });

        //观战的人进入游戏 刷新table
        this.node.on('user_status_change',function(data){
            self.user_status_change(data.data);
        });

        //准备
        this.node.on("ready",function(data){
            self.ready(data.data);
        });

        //开始
        this.node.on('begin',function(data){
            if(data.errcode == -1){
                return;
            }
            self.btn_tuoguan.active = false;
            var is_watch_game = self.watch_game();
            if(is_watch_game){
                self.btn_tuoguan.active = false;
            }
            self.watch_game_list();
        }),

        //1.定庄
        //开抢
        this.node.on("kaiqiang",function(data){

            self.begin(data.data);
        });

        //抢庄
        this.node.on("qiangzhuang",function(data){
            self.qiangzhuang(data.data);
        });

        //不抢庄
        this.node.on("buqiangzhuang",function(data){
            self.buqiangzhuang(data.data);
        });

        //定庄
        this.node.on("dingzhuang",function(data){
            self.dingzhuang(data.data);
        });
       
        this.node.on('beginXiazhu',function(data){
            self.beginXiazhu(data.data);
        });
        //2.下注
        //下注
        this.node.on("xiazhu",function(data){
            self.xiazhu(data.data);
        });

        this.node.on('bestPk', function(data){
            self.bestPk(data.data);
        });

        //下注ok
        this.node.on("xiazhuok",function(data){
            self.Received_xiazhuok = true;
            self.xiazhuok(data.data);
        });
       
        //3.摇色子
        //摇色子停止
        this.node.on("getEnd", function(){
            // console.log("发牌动画第4部getEnd：")
            if(self.isAutoYao == 1 || cc.vv.roomMgr.is_replay || self.isTuoguan){
                self.fapai_1();
            }else{
                var is_watch_game = this.watch_game();
                if(is_watch_game){
                    self.fapai_1();
                }else{
                    if(cc.vv.roomMgr.seatid != self._zhuang){
                        self.fapai_1();
                    } 
                }
            }
        });
        //4.发牌
        //第一轮发牌
        this.node.on("fapai",function(data){
            self.fapai1Data = data.data;
            self.saizi_animation(self.fapai1Data);
        });
        //5.开牌
         //搓牌
        this.node.on("cuopai",function(data){
            self.cuopai(data.data);
        });

        //开牌
        this.node.on("kaipai",function(data){
            self.kaipai(data.data);
        });

        //6.结算
            //结算_小结算
        this.node.on("jiesuan",function(data){
            self.jiesuan(data.data);
        });

        //大结算
        this.node.on("report",function(data){
            if(data.errcode == -1){
                self.nodeJiesuan.active = false;
                return;
            }
            self.report(data.data);
        });

        //恢复桌面
        this.node.on('stage',function(data){
            cc.vv.popMgr.hide();
            self.stage(data.data);
        });

        //显示所有下注
        this.node.on('showAllXiazhu',function(data){
            self.showAllXiazhu(data.data);
        });

        this.node.on('tuoguan',function(data){
            self.tuoguan(data.data);
        });

        this.node.on('cancleTuoguan',function(data){
            self.cancleTuoguan(data.data);
       });
    },

    //初始化界面
    new_round:function(){
        var self=this;
        this.tip(null);
        this.is_kaipai = false;// 自己是否看过牌
        this.nodeZhuang.active = false;
        this.nodeXiazhu.active = false;
        this.nodeReport.active = false;
        this.is_click_cuopai = false;
        this.nodeJiesuan.active = false;
        this.nodeSezi.active = false;
        this.is_operation = false;
        this.nodeCuopai.active = false;
        this.nodeKaipai.active = false;
        this.nodeKaipai.getComponent(cc.Button).interactable = true;
        this.Received_xiazhuok = false;//是否收到下注ok协议
        this.is_click_xuanpai = false;//是否可以 选牌型了
        this.nodeCard.removeAllChildren();
        this.nodeSezi.removeAllChildren();

        this._nodeyaosezi = cc.instantiate(this.prefabYaosezi);
        this.nodeSezi.addChild(this._nodeyaosezi);
        this.TJDSaiZiAnim = this._nodeyaosezi.getComponent(cc.Animation);
        this.yao = this._nodeyaosezi.getChildByName('yao');
        this.yao1 = this._nodeyaosezi.getChildByName('yao1');
        this.initEventSeZi();
        if(this._itemkaipai != null){
            this._itemkaipai.destroy();
        }
        this._itemkaipai = cc.instantiate(self.preTJDkaipai);
        this.nodeMsg.addChild(self._itemkaipai);
        this._itemkaipai.active = false;
        
        this.node_watchgame.active = false;
        //清除下注分
        for(var i=0; i < 6; i++){
            this.nodeLabelscoreArr[i].active = false;
            this.nodeLabelscoreArr[i].getComponent(cc.Label).string = "";
            this.nodeLabelscoreArr[i].getComponentInChildren(cc.Label).string = "";
        }
        //清除庄家
        if(this._zhuang_mode != 1){
            this.table.seat_emit(null,"dingzhuang",{seatid:null});
        }

        this.hidePai();
        this.hideAllType();

        //当前下注轮次
        this._currdao = 1;

        //是否搓牌
        this._cuopai = [0,0,0,0];
        //是否翻牌
        this._fanpai = [0,0,0,0];
        //是否开牌
        this._kaipai = [0,0,0,0];

        //对应的行数
        this.hangNumber = [0,1,2,3];
        //对应的列数
        this.lieNumber = [7,6,5,4,3,2,1,0];

        this.isBeginXiazhu = false;

        // if(cc.vv.roomMgr.ren == 4){
        //     this.nodeCuopai.y = -250;
        //     this.nodeKaipai.y = -250;
        // }else if(cc.vv.roomMgr.ren == 5){
        //     this.nodeCuopai.y = -320;
        //     this.nodeKaipai.y = -320;
        // } 
        cc.vv.audioMgr.stopSFX(this.soundSaizi);  

        this.is_Kaipaibtn = false;//是否点击开牌
    },

    initData:function(){
        this.kaipaiArr = [];
        this.cuopaiNodeArr = [];
        this.paitype = [];
        this.maxType = [];
        this.pkarr = [];
        this.zhuangpk =[];
        this.is_Kaipaibtn = false;
        this.showcuopai = false;
    },

    //获取到游戏参数
    param:function(data){

        this._desc = data.desc;

        this._roomid=data.roomid;

        // 0:抢庄 1:定庄 2:轮庄
        this._zhuang_mode = data.zhuang;

        this.param = data;

          //庄
        this._zhuang = data.zhuangSeateid;

        this._ren = data.ren;

        //是否自动摇骰子
        this.isAutoYao = data.auto;

        //总共有几道下注
        this._dao = data.dao;

        //是否是固定分
        this._isGD = data.Gdfen;

        //色子点数
        this.num = data.touZi;

        //当前局数
        this.round = data.round;
    },

    //准备
    ready:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.new_round();
            this.initData();
        }
    },

    //开抢
    begin:function(data){
        var self = this;
        self.kaiqiang(data);
        this.is_kaipai = false;// 自己是否看过牌
    },

    //开抢
    kaiqiang:function(data){
        if(data != null){
            this.auto_tips(data.time,"不抢庄");
        }
        if(this.isStage){
            //已经抢过庄了
            var ifqiang  = cc.vv.roomMgr.stage.ifqiang;
            if(ifqiang != 0 && ifqiang != undefined)return;
        }
        this.nodeZhuang.active = true;
        this.nodeZhuang.children[0].scale = 1;
        this.nodeZhuang.children[1].scale = 1;
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.nodeZhuang.active = false;
        }
    },

    //抢庄
    qiangzhuang:function(data){
        //如果是自己抢，关闭抢庄
        if(data.seatid == cc.vv.roomMgr.seatid){ 
            this.tip("tips_zhunbei");         
            this.nodeZhuang.active = false;
        }
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        this.showOrHideQiangzhuang(viewid, true);
        this.table.seat_emit(viewid, "qiangzhuang");
    },

    //不抢庄
    buqiangzhuang:function(data){
        //如果是自己抢，关闭抢庄
        if(data.seatid == cc.vv.roomMgr.seatid){ 
            this.tip("tips_zhunbei");         
            this.nodeZhuang.active = false;
        }
        var viewid = cc.vv.roomMgr.viewChairID(data.seatId);
        this.showOrHideQiangzhuang(viewid, false);
    },

    //定庄
    dingzhuang:function(data){
        var self = this;

        this.tip(null);    

        this.nodeIsQiangZhuang.removeAllChildren();
        
        this._zhuang = data.seatid;

        this.nodeZhuang.active = false;

        var callback = function(){
            var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
            self.table.seat_emit(null,"dingzhuang",{seatid:viewid});
        }

        this.table.dingzhuang(data,callback);
    },

    /*
    * {"errcode":0,"data":{"_zhuangpk":[0,0,0,0],"pk2":12,"pk1":104,"pk4":110,"pk3":7,"type":[[104,12,560],[104,7,170],[104,110,380],[12,7,770],[12,110,280],[7,110,590]],
    "maxType":[2,1,340,104,110,380]},"errmsg":"ok","model":"game","event":"bestPk"}
     */
    bestPk:function(data){
       
        this.zhuangpk = data._zhuangpk;

        //牌型检索表
        this.paitype = data.type;
        var maxType = data.maxType;
        this.maxType = maxType;
        this.kaipaiArr[0] = maxType[0];
        this.kaipaiArr[1] = maxType[1];

        var pkarr = [];
        this.pkarr = [maxType[0],maxType[1],maxType[3],maxType[4]];
    },
    
    //下注
    xiazhu:function(data){
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        this.nodeLabelscoreArr[viewid].setPosition(pos[viewid].pos.xiazhu.x,pos[viewid].pos.xiazhu.y);
        this.nodeLabelscoreArr[viewid].active = true;
        var label = this.nodeLabelscoreArr[viewid].getComponent(cc.Label);
        this.nodeLabelscore.active = true;
        
        var nowDao = data.nowDao;
        var nextDao = data.nextDao;
        var power = data.power;
        if(nowDao <= 3 && nowDao != 0){
            if(power != 0){
                label.string += power + ' ';
            }else{
                label.string += 0 + ' ';
            }
        }
        if(viewid == 0){
            this._currdao = data.nextDao;
            this.show_xiazhu();
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

     //显示下注的分数
     xiazhu_stage:function(data){
        //{"errcode":0,"data":{"nowDao":1,"nextDao":2,"seatid":0,"power":10,"userid":3099},"errmsg":"ok","model":"game","event":"xiazhu"}
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
       
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        this.nodeLabelscoreArr[viewid].setPosition(pos[viewid].pos.xiazhu.x,pos[viewid].pos.xiazhu.y);
        this.nodeLabelscoreArr[viewid].active = true;
        var label = this.nodeLabelscoreArr[viewid].getComponent(cc.Label);
        
        this.nodeLabelscore.active = true;

        var nowDao = data.nowDao;
        var nextDao = data.nextDao;
        //power == -1 不能下  
        //power == 0 没有下注
        var power = data.power;
        if(power != -1 && power != 0){
            if(nowDao <= 3 && nowDao != 0){
                if(power != 0){
                    label.string += power + ' ';
                }else{
                    label.string += 0 + ' ';
                }
            }
        }
    },
    error:function(data){
        if(data.errcode == -99){
            cc.director.loadScene("hall");
            setTimeout(() => {
                cc.vv.popMgr.alert("" + data.errmsg);
            }, 1000);
        }else{
            cc.vv.popMgr.tip("" + data.errmsg);
        }
    },
    //下注ok
    xiazhuok:function(data){
        this.is_click_cuopai = true;
        this.tip(null);
        this.xiazhutip(null);
        if(data != null){
            this.auto_tips(data.time,"开牌");
        }
        var self = this;
        if(this._isGD != 0){
            setTimeout(() => {
                if(!self.showcuopai){
                    //开牌和搓牌搓牌
                    self.nodeXiazhu.active = false;
                    self.nodeCuopai.active = true;
                    self.nodeKaipai.active = true;
                    self.nodeCuopai.scale = 1;
                    self.nodeKaipai.scale = 1;
                }
              
                for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
                    if(index == cc.vv.roomMgr.seatid)continue;
                    var callback = function(){
                    }
                    if(self._zhuang == index){
                        callback = function(){
                            var seatid = self._zhuang;
                            var zhuangpk = self.zhuangpk;
                            if(zhuangpk == null)return;
                            var maxPai = [-1, -1];
                            var paiType = [-1, -1];
                            self.fanpaiAnimation(seatid, zhuangpk, maxPai, paiType, true)
                        }
                    }else{
                        callback = function(){
        
                        }
                    }
                    var viewid = cc.vv.roomMgr.viewChairID(index);
                    if(viewid == 0){
                        self.addTouchPaiNodeMove();
                    }
                    if(self._cuopai[index] == 1){
                        if(self._zhuang == index){
                            var seatid = self._zhuang;
                            var zhuangpk = self.zhuangpk;
                            if(zhuangpk == null)return;
                            var maxPai = [-1, -1];
                            var paiType = [-1, -1];
                            self.fanpaiAnimation(seatid, zhuangpk, maxPai, paiType, true);
                        }
                    }else{
                        self._cuopai[index] = 1;
                        self.cuopaiAnimation(index, callback)
                    };
                }
            }, 4000);
        }else{
            //开牌和搓牌搓牌
            this.nodeXiazhu.active = false;
            this.nodeCuopai.active = true;
            this.nodeKaipai.active = true;
            this.nodeCuopai.scale = 1;
            this.nodeKaipai.scale = 1;
            var self = this;
            for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
                if(index == cc.vv.roomMgr.seatid)continue;
                var callback = function(){
                }
                if(this._zhuang == index){
                    callback = function(){
                        var seatid = self._zhuang;
                        var zhuangpk = self.zhuangpk;
                        if(zhuangpk == null)return;
                        var maxPai = [-1, -1];
                        var paiType = [-1, -1];
                        self.fanpaiAnimation(seatid, zhuangpk, maxPai, paiType, true)
                    }
                }else{
                    callback = function(){
    
                    }
                }
                var viewid = cc.vv.roomMgr.viewChairID(index);
                if(viewid == 0){
                    this.addTouchPaiNodeMove();
                }
                if(this._cuopai[index] == 1){
                    if(this._zhuang == index){
                        var seatid = self._zhuang;
                        var zhuangpk = self.zhuangpk;
                        if(zhuangpk == null)return;
                        var maxPai = [-1, -1];
                        var paiType = [-1, -1];
                        self.fanpaiAnimation(seatid, zhuangpk, maxPai, paiType, true);
                    }
                }else{
                    this._cuopai[index] = 1;
                    this.cuopaiAnimation(index, callback)
                };
            }
        }
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.nodeCuopai.active = false;
            this.nodeKaipai.active = false;
        }
    },

    saizi_animation:function(data){
        var self = this;
        // console.log("发牌动画第1部saizi_animation")
        this.fapai1Data = data;
        this.sprTip.node.active = false;
        
        if(cc.vv.roomMgr.is_replay){
            this.showMingPai(data);
        }

        this.num = data.num;
        var sezi1 = this._nodeyaosezi.getChildByName('sezi1');
        var sezi2 = this._nodeyaosezi.getChildByName('sezi2');
        var sezi1Name = "ttz_sezi_" + data.num[0]+"_"+0;
        var sezi2Name = "ttz_sezi_" + data.num[1]+"_"+0;
        sezi1.getComponent(cc.Sprite).spriteFrame = this.typeSeZi.getSpriteFrame(sezi1Name);  
        sezi2.getComponent(cc.Sprite).spriteFrame = this.typeSeZi.getSpriteFrame(sezi2Name);
        
        function yaoshaizi(){
            //自己是庄家
            // console.log("发牌动画第4部 摇塞子")
            if(self.isAutoYao == 1 || cc.vv.roomMgr.is_replay){
                self.yao.off('touchmove');
                self.yao.off('touchend');
                self.yao.off('touchcancel');
                cc.vv.audioMgr.playSFXRepeat("sezi",function(audioId){
                    cc.vv.audioMgr.stopSFX(self.soundSaizi);   
                    self.soundSaizi = audioId;
                });
                
                self.TJDSaiZiAnim.play("yaosezi");
                self.shaizitip("saiziing");
            }else{
                var is_watch_game = self.watch_game();
                if(cc.vv.roomMgr.seatid != self._zhuang || is_watch_game){
                    self.yao.off('touchmove');
                    self.yao.off('touchend');
                    self.yao.off('touchcancel');
    
                    cc.vv.audioMgr.playSFXRepeat("sezi",function(audioId){
                        cc.vv.audioMgr.stopSFX(self.soundSaizi);   
                        self.soundSaizi = audioId;
                    });
                    self.TJDSaiZiAnim.play("yaosezi");
                    self.shaizitip("saiziing");
                }else{
                    self.shaizitip("plasesaizi");
                }
            }
            self.nodeSezi.active = true;
        }
        if(data.xiPai == 1){
            this.nodeMingpai.getChildByName("list1").removeAllChildren();
            this.nodeAllPai.removeAllChildren();
            this.mingpaiValue = 0;
            var callback = function(){
                yaoshaizi();
            }
            this.xipaiAnimation(callback);
        }else{
            yaoshaizi();
        }
    },

    //搓牌
    cuopai:function(){
        if(!this.is_click_cuopai || this.is_click_xuanpai){
            return;
        }
        var self = this;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var viewid = 0;
        var indefapai = 0;
        this.is_click_xuanpai = true;
        this.is_click_cuopai = false;
        for (var index = 0; index < this.cuopaiNodeArr.length; index++) {
            var node = this.cuopaiNodeArr[index];
            var viewid = 0;
            var indefapai = index * this.paiNumber / 2 + 1;
            var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
            var x = (pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX);
            var y = pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2);
            node.x = x;
            node.y = y;
        }
        
        var callback = function(){
                //牌型检索表
            var maxType = self.maxType;
            var maxPai = [maxType[0], maxType[1]];
            var paiType = [maxType[2], maxType[5]];
            var seatid = cc.vv.roomMgr.realChairID(viewid);
            if(self._fanpai[seatid] == 1)return;
            self._fanpai[seatid] = 1;
            self.fanpaiAnimation(cc.vv.roomMgr.seatid, self.pkarr, maxPai, paiType, true)
        }
        var seatid = cc.vv.roomMgr.realChairID(viewid);
        if(this._cuopai[seatid] == 1){
            var maxType = self.maxType;
            var maxPai = [maxType[0], maxType[1]];
            var paiType = [maxType[2], maxType[5]];
            if(self._fanpai[seatid] == 1)return;
            self._fanpai[seatid] = 1;
            self.fanpaiAnimation(cc.vv.roomMgr.seatid, self.pkarr, maxPai, paiType, true)
        }else{
            this._cuopai[seatid] = 1;
            this.cuopaiAnimation(cc.vv.roomMgr.seatid, callback);
        };
        this.nodeCuopai.active = false;
    },

    //开牌
    kaipai:function(data){
        var self = this;
        //已经开过牌
        if(this._kaipai[data.seatid] == 1)return;
        this._kaipai[data.seatid] = 1;

        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip("tjd_kaipai");
            this.nodeCuopai.active = false;
            this.nodeKaipai.active = false;
            this.is_click_xuanpai = true;
            this.is_click_cuopai = false;
            this.removeTouchPaiNode();
        }
        if(this._cuopai[data.seatid] == 1){
            if(self._fanpai[data.seatid] == 1)return;
            self._fanpai[data.seatid] = 1;
            this.fanpaiAnimation(data.seatid, data.hand, data.maxHand, data.type, false);
        }else{
            this._cuopai[data.seatid] = 1;
            var callback = function(){
                if(self._fanpai[data.seatid] == 1)return;
                self._fanpai[data.seatid] = 1;
                self.fanpaiAnimation(data.seatid, data.hand, data.maxHand, data.type, false)
            }
            this.cuopaiAnimation(data.seatid, callback);
        }
    },
    
    auto_ready:function(){
        this.autoready--;
        this.nodeJiesuan.getChildByName("btn_ready").getChildByName("lbl").getComponent(cc.Label).string = this.autoready;
        if(this.autoready <= 0){
            this.autoready = 0;
            this.unschedule(this.auto_ready);
        }
    },

    //小结算
    jiesuan:function(data){
        this.node.getChildByName("mgr").getChildByName("auto_tips").active = false;
        this.autoready = 10;
        this._zhuang = data.zhuang;
        this.schedule(this.auto_ready,1);
        this.tip(null);
        this.nodeCuopai.active = false;
        this.nodeKaipai.active = false;

        var self = this;
        
        if(this._itemkaipai){
            this._itemkaipai.active = false;
        }
        var jiesuan_count = 0;
        for(var i = 0 ;i < data.list.length;i++){
            if(data.list[i].userid != 0){
                jiesuan_count++;
            }
        }
        if(!this.isStage){
                //所有人开牌
            for(var i=0;i< cc.vv.roomMgr.ren ;++i){
                if(this._kaipai[data.list[i].seatid] != 1){
                    this.kaipai({seatid:data.list[i].seatid,userid:data.list[i].userid,hand:data.list[i].hand,maxHand:[data.list[i].hand[0], data.list[i].hand[1]],type:data.list[i].type});
                }
            }
        }
        setTimeout(() => {
            //隐藏麻将
            if(!self.is_Kaipaibtn){
                self.huifuPai();
            }
        }, 1000);
        setTimeout(() => {
            //隐藏麻将
            //this.hidePai();
            this.mingpaiValue = data.mingpai.length;
        }, 3000);

        //所有人结算
        for(var i = 0;i < jiesuan_count;++i){
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

        var list = this.nodeJiesuan.getChildByName("viewlist").getChildByName("view").getChildByName("list");
        this.nodeJiesuan.getChildByName("roomID").getComponent(cc.Label).string="房间号："+ cc.vv.roomMgr.enter.room_id;
        this.nodeJiesuan.getChildByName("date").getComponent(cc.Label).string =data.time;
        this.nodeJiesuan.getChildByName('wanfa').getComponent(cc.Label).string = "第" + data.nowRound + "局" + " " + cc.vv.roomMgr.enter.desc;
        //隐藏所有结点
        for(var i = 0; i < list.children.length; ++i){
            list.children[i].active = false;
        }
        this.nodeJiesuan.getChildByName("roomID").active=true;
        this.nodeJiesuan.getChildByName('wanfa').active=true;
        this.nodeJiesuan.getChildByName("date").active=true;
        jiesuan_count =  data.list.length;
        //所有人结算
        for(var i = 0;i< jiesuan_count ;++i){
            if(data.list[i].userid == 0) continue;
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var name = data.list[i].nickname;
            var headimg = this.table.seat_img(viewid);
            
            var item = list.getChildByName("item" + viewid);
            item.x = list.children[i].x;
            item.y = list.children[i].y;
            item.active = true;
            item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
            item.getChildByName("name").getComponent(cc.Label).string = name;
            
            if(i == this._zhuang){
                item.getChildByName("zhuang").active = true;
            }else{
                item.getChildByName("zhuang").active = false;
            }
            
            //根据正负显示字体
            var score = item.getChildByName("score").getComponent(cc.Label);
            //显示得到的牌
            var pai1 = item.getChildByName("pai1").getChildByName("New Sprite").getComponent(cc.Sprite);
            var pai2 = item.getChildByName("pai2").getChildByName("New Sprite").getComponent(cc.Sprite);
            pai1.spriteFrame = self.dianshuAtlas.getSpriteFrame("card"+data.list[i].hand[0]);
            pai2.spriteFrame = self.dianshuAtlas.getSpriteFrame("card"+data.list[i].hand[1]);
           
            if(cc.vv.tempDataMgr.pokerNine == 0){
                var pai3 = item.getChildByName("pai3").getChildByName("New Sprite").getComponent(cc.Sprite);
                var pai4 = item.getChildByName("pai4").getChildByName("New Sprite").getComponent(cc.Sprite);
                pai3.spriteFrame = self.dianshuAtlas.getSpriteFrame("card"+data.list[i].hand[2]);
                pai4.spriteFrame = self.dianshuAtlas.getSpriteFrame("card"+data.list[i].hand[3]);
            }
            //显示压的分
            var yafen = item.getChildByName('score1').getComponent(cc.Label);
            var ls_jiesuan_idx = i;
            if(cc.vv.roomMgr.param.dao == 2){
                yafen.string = "两道(" + data.list[ls_jiesuan_idx].dao[0]+" " + data.list[ls_jiesuan_idx].dao[1] + ")";
            }else if(cc.vv.roomMgr.param.dao == 3){
                yafen.string = "三道(" + data.list[ls_jiesuan_idx].dao[0] + " " +data.list[ls_jiesuan_idx].dao[1] + " " + data.list[ls_jiesuan_idx].dao[2] + ")";
            }
            if(yafen.node.height >= 72){
                yafen.fontSize = 22;
            }
      
            var dianshu1 = item.getChildByName("dianshu1").getComponent(cc.Sprite);
            var dianshu2 = item.getChildByName("dianshu2").getComponent(cc.Sprite);

            dianshu1.spriteFrame = self.typeAtlas.getSpriteFrame("cardType" + data.list[i].type[0]);
            dianshu2.spriteFrame = self.typeAtlas.getSpriteFrame("cardType" + data.list[i].type[1]);

            var nodetitle = self.nodeJiesuan.getChildByName('title').getComponent(cc.Sprite);
            var nodeplayertext = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_player_text").getComponent(cc.Sprite);
            var nodesocretext = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_socre_text").getComponent(cc.Sprite);
            if(data.list[ls_jiesuan_idx].round_score > 0){
                score.string = "+" + data.list[ls_jiesuan_idx].round_score
                if( cc.vv.userMgr.userid == data.list[ls_jiesuan_idx].userid){
                    //胜利
                    nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("shengli");

                    nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
                    nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
                }
            }else if(data.list[ls_jiesuan_idx].round_score < 0){
                score.string = data.list[ls_jiesuan_idx].round_score
                if( cc.vv.userMgr.userid == data.list[ls_jiesuan_idx].userid){
                    //失败
                    nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("shibai");
                    
                    nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("hui_wanjia");
                    nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("hui_jifen");
                }
            }else{
                score.string = data.list[ls_jiesuan_idx].round_score
                if( cc.vv.userMgr.userid == data.list[ls_jiesuan_idx].userid){
                    //胜利
                    nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("shengli");

                    nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
                    nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
                }
            }
            if(data.list[i].userSitStatus == 1){
                item.getChildByName("watch").active = true;
                score.string = "-";
                yafen.string = "-";
            }else{
                item.getChildByName("watch").active = false;
            }
            var is_watch_game = this.watch_game();
            if(is_watch_game == true){
                nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("guanzhan");
                nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
                nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
            }
        }
        var mp3File = "nn/chips";
        cc.vv.audioMgr.playSFX(mp3File);
        
        for(var i = 0;i < jiesuan_count ;i++)
        {
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid == 0){
                if(data.list[i].round_score < 0){
                    setTimeout(() => {
                        cc.vv.audioMgr.playSFX("ddz/game_lose");
                    }, 2000);
                }else{
                    setTimeout(() => {
                        cc.vv.audioMgr.playSFX("ddz/game_win");
                    }, 2000);
                }
            }
        }

        function settimefunction(){
            self.nodeJiesuan.active = true;
            self.nodeJiesuan.getChildByName('btn_ready').scale = 1;
            cc.vv.utils.popPanel(self.nodeJiesuan);
        }

        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var moneyCount = 10;//金币数量
        //小结算
        setTimeout(() => {
            settimefunction();
        }, 2000);

        var delayTime = 0.5;
        //小结算
        for(var i=0;i< jiesuan_count ;i++)
        {
            var callback = cc.callFunc(function() {
 
            });
            if(data.list[i].seatid == this._zhuang){
                continue;
            }
            if(data.list[i].round_score < 0){
                var v_from_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                var v_to_seat = cc.vv.roomMgr.viewChairID(this._zhuang);
                if(!pos[v_to_seat]){
                    continue;
                }
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, delayTime, callback);
            }else if(data.list[i].round_score > 0){
                var v_from_seat = cc.vv.roomMgr.viewChairID(this._zhuang);
                var v_to_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                if(!pos[v_from_seat]){
                    continue;
                }
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, delayTime, callback);
            }
        }
        setTimeout(()=>{
            self.nodeJiesuan.active = true;
            if(!cc.vv.roomMgr.is_replay){
                this.mingpai(data);
            }    
        },2500);
        //隐藏回放的准备确定按钮
        if(cc.vv.roomMgr.is_replay){
            var btn_ready = cc.find("Canvas/report/jiesuan/btn_ready");
            btn_ready.active = false;
        }
    },

    //大结算
    report:function(data){
        var self = this;
        self.node.getChildByName("pop").removeAllChildren();
        this.nodeReport.active = true;
        this.nodeJiesuan.active = false;
        var otherScore = this.nodeReport.getChildByName("otherScore");
        otherScore.getComponent(cc.Label).string = "其他:"+data.otherScore;
        //隐藏解散房间
        this.table.hide_dismiss_room();
        var list = this.nodeReport.getChildByName("list1");
        list.removeAllChildren();
         //房间号、日期
        this.nodeReport.getChildByName("roomid").getComponent(cc.Label).string = cc.vv.roomMgr.enter.room_id;
        this.nodeReport.getChildByName("time").getComponent(cc.Label).string = data.time;
        this.nodeReport.getChildByName("roomwanfa").getComponent(cc.Label).string = "玩法:" + cc.vv.roomMgr.enter.desc;

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
        for(var i = 0;i< data.list.length; ++i){
            if(data.list[i].userid > 0){
                realPeople++;
            }
        }
        realPeople = cc.vv.roomMgr.ren;
        //所有人结算
        for(var i = 0;i < realPeople; ++i){
            if(data.list[i].userid == 0){
                continue;
            }
            if(data.list[i].hasJoinedBattle == true){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                var info = {
                    name:data.list[i].name,
                    userid:data.list[i].userid,
                    headimg:data.list[i].headimg,
                    winNum:data.list[i].winNum,
                    Kill:data.list[i].Kill,
                    die:data.list[i].die,
                    EightAndNine:data.list[i].EightAndNine,
                    score:data.list[i].result_score,
                    dayingjia:data.list[i].result_score == data.list[0].result_score && data.list[0].result_score != 0,
                    datuhao:data.list[i].result_score == min_score && data.list[i].result_score != 0,
                    
                }
                var item = cc.instantiate(this.reportItemPrefab);
                list.addChild(item);
                item.emit("info",info);
        
                if(viewid == 0){
                    this.nodeReport.getChildByName('score').getComponentInChildren(cc.Label).string = "+" + data.list[i].coins;
                }
            }
        } 
    },

    //新的人数
    new_real_count:function(data){
      
    },

    //恢复桌面
    stage:function(data){
        cc.vv.net2.is_not_deal = false;
        var self = this;
        this.new_round();
        this.watch_game_list();
        this.is_operation = true;
        
        this.Received_xiazhuok = true;
        self.node.getChildByName("pop").removeAllChildren();
        if(this.nodeAllPai){
            this.nodeAllPai.removeAllChildren();
        }
        
        cc.vv.roomMgr.stage = data;
        this.isStage = true;
        
        //游戏开始
        //public static final int STAGE_STARRT = 1
        //抢庄
        //public static final int STAGE_QIANGZHUANG = 2
        //定庄发牌信息
        //public static final int STAGE_DINGZHUANG = 3
        //下注
        //public static final int STAGE_XIAZHU = 4
        //开牌
        //public static final int STAGE_KAIPAI = 5
        cc.vv.roomMgr.real = data.real;

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

        if(data.mingpai){
            this.showMingPai(data);
        }
        if(data.tuoguan){
            if(data.tuoguan[cc.vv.roomMgr.seatid] == 1){
                this.isTuoguan = true;
                this.tuoguanNode.active = true;
                this.nodeZhuang.active = false;
                this.nodeXiazhu.active = false;
                this.nodeCuopai.active = false;
                this.nodeKaipai.active = false;
            }else if(data.tuoguan[cc.vv.roomMgr.seatid] == 0){
                this.isTuoguan = false;
                this.tuoguanNode.active = false;
            }
        }
        switch(data.stage){
            case 1:
            case 2:{
                this.auto_tips(data.deal_time,"不抢庄");
                //抢庄
                this.kaiqiang();
                for(var i = 0; i < cc.vv.roomMgr.real; ++i){
                    var viewid = cc.vv.roomMgr.viewChairID(i);
                    if(data.qiangZhuang[i] != 0){
                        this.showOrHideQiangzhuang(viewid, data.qiangZhuang[i] == 1);
                    }
                }
            }
            break;
            case 3:{
                this._zhuang = data.zhuang;
                //定庄
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
            }
            break;
            case 4:{
                    //自动摇色子
                    this._zhuang = data.zhuang;
                    //定庄
                    var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                    this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                    this.yaoShaiziZhuang = true; 
                    //显示色子
                    this.saizi_animation(data);
            }
            break;
            case 5:{
                this.auto_tips(data.deal_time,"下注最小注");
               //下注
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.showAllPai();

                var xiazhu = data.xiazhu;
                for (var value = 0; value < cc.vv.roomMgr.real; value++) {
                    var bet  = xiazhu[value];
                    if(value != this._zhuang){
                        this._currdao = data.nextDao;
                        for (var index = 0; index < bet.length; index++) {
                            this.xiazhu_stage({seatid:value,nowDao:index + 1,nextDao:index + 2,power:bet[index]});
                        }
                    }
                    if(value == cc.vv.roomMgr.seatid){
                        if(data.zhuang != cc.vv.roomMgr.seatid){
                            if(this.isXiaZhu(bet) != 0){
                                this.show_xiazhu();
                            }else{
                                this.tip("tjd_xiazhu");
                            }
                        }else{
                            this.tip("tjd_xiazhu");
                        }
                    }
                }
            }
            break;
            case 6:{
                this.auto_tips(data.deal_time,"开牌");
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.showAllPai(true);

                this.showAllXiazhu(data);
                //开牌
                this.xiazhuok();
                this.showcuopai = true;
                for(var i = 0;i < data.kaipai.length;i++){
                    if(data.kaipai[i] == 1){
                        var viewid = cc.vv.roomMgr.viewChairID(i);
                        if(viewid == 0){
                            this.nodeKaipai.active = false;
                            this.nodeCuopai.active = false;
                        }
                    }else{
                        var viewid = cc.vv.roomMgr.viewChairID(i);
                        if(viewid == 0){
                            this.nodeKaipai.active = true;
                            this.nodeCuopai.active = true;
                        }
                    }
                }
                var is_watch_game = this.watch_game();
                if(is_watch_game){
                    this.nodeCuopai.active = false;
                    this.nodeKaipai.active = false;
                }
            }
            break;
            case 97:{
                if(data.ready == 1){
                    this.node.getChildByName("watchgame").active = false;
                }
                if(data.zhuang != null){
                    this._zhuang = data.zhuang;
                }
                var viewid = cc.vv.roomMgr.viewChairID(this._zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.nodeCuopai.active = false;
                this.nodeKaipai.active = false;
            }
            break;
        }
        this.isStage = false;
    },

    //洗牌
    xipaiAnimation:function(callback){
        var self = this;
        // console.log("发牌动画第2部xipaiAnimation：",self._hang)
        //每行牌的信息
        var pos = cc.vv.game.config["xipai_pos"];
        this.dealXipai(pos, 0, this._lie, function(){
            var info = {
                indexY:self._hang,
                indexX:self._lie,
                callback:callback
            }
            self.nodeAllPai.emit("xipai", info);
        });
    },

    //不洗牌直接显示牌
    showAllPaiAnimation:function(){
        //每行牌的信息
        var pos = cc.vv.game.config["not_xipai_pos"];
        this.dealXipai(pos, 0, this._lie, function(){
         
        });
    },

    //显示牌(不要动画 铺着)
    showAllPai:function(isTouch){
        var self = this;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var mingpaiValue = this.mingpaiValue;
        if(mingpaiValue >= 32){
            mingpaiValue = 0;
        }
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            var valueXArr = [];
            var valueYArr = [];

            var valueXArrTwo = [];
            var valueYArrTwo = [];

            var seatid = (index + this.dianshu) % cc.vv.roomMgr.ren;
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            var valueY = parseInt((mingpaiValue / 2 +  index) / this._lie) * 2;
            var valueX = (mingpaiValue/ 2 +  index)  % this._lie;

            for (var indexpai = 0; indexpai < this.paiNumber; indexpai++) {
                var valueY = parseInt((mingpaiValue / 2 +  index * (this.paiNumber / 2) + indexpai) / this._lie) * 2;
                var valueX = (mingpaiValue/ 2 +  index  * (this.paiNumber / 2)  + indexpai)  % this._lie;
                valueYArr[indexpai] = valueY;
                valueXArr[indexpai] = valueX;
                valueYArrTwo[indexpai] = valueY  + 1;
                valueXArrTwo[indexpai] = valueX;
            }

            for (var indetag = 0; indetag < this.paiNumber / 2; indetag++) {
                var pai_tag = this.hangNumber[valueYArr[indetag]] + "_"  + this.lieNumber[valueXArr[indetag]];
                var node = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tag);
                node.myTag = viewid + "_tag_" + (indetag * (this.paiNumber / 2));

                var pai_tagTwo = this.hangNumber[valueYArrTwo[indetag]] + "_"  + this.lieNumber[valueXArrTwo[indetag]];
                var nodeTwo = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tagTwo);
                nodeTwo.myTag = viewid + "_tag_" + (indetag * (this.paiNumber / 2) + 1);
            }
            if(viewid == 0){
                this.addcuopaiNodeArr();
            }
            if(isTouch){
                if(viewid == 0){
                    this.addTouchPaiNodeMove();
                }
            }
            for (var indefapai = 0; indefapai < this.paiNumber; indefapai++) {
                var info = {
                    viewid:viewid,
                    index:indefapai,
                    x:(pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX),
                    y:pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2),
                    scale:pos[viewid].pos.card.scale,
                }
                this.send_card_tag_emit(info.viewid, info.index, "showPai", info);
            }
        }
    },
    
    //隐藏牌
    hidePai:function(){
        //2 8
        var self = this;
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);
            for (var indexpai = 0; indexpai < this.paiNumber; indexpai++) {
                self.send_card_tag_emit(viewid, indexpai, "hide");
            }
         
        }
    },
    
    //隐藏牌型
    hideAllType:function(){
          var self = this;
          for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
              var viewid = cc.vv.roomMgr.viewChairID(index);
              for (var indexpai = 0; indexpai < this.paiNumber / 2; indexpai++) {
                  self.hideType(viewid, indexpai, "hide");
              }
          }
    },

     //显示明牌
    showMingPai:function(data){
        this.mingpaiValue = data.mingpai.length;
        
        this.showAllPaiAnimation();
        var nodeArr = this.nodeAllPai.children;
        var index = nodeArr.length;
        var mingindex = data.mingpai.length;
        for(var i = 0; i < mingindex / 2; i++){
            var valueY = parseInt(i / this._lie) * 2;
            var valueX = i % this._lie;

            var valueY_two = valueY + 1;
            var valueX_two = valueX;

            var myTag = this.hangNumber[valueY] + "_" + this.lieNumber[valueX];
            var node = cc.vv.utils.getChildByTag(this.nodeAllPai,myTag);
            node.destroy();
            var tagTwo = this.hangNumber[valueY_two] + "_" + this.lieNumber[valueX_two];
            var nodeTwo = cc.vv.utils.getChildByTag(this.nodeAllPai,tagTwo);
            nodeTwo.destroy();
        }
        this.nodeMingpai.getChildByName("list1").removeAllChildren();
        for(var i = 0;i < data.mingpai.length; i++){
            var item = cc.instantiate(this.prefabTJDMingPai);
            item.getChildByName("MyMahJongPai").getComponent(cc.Sprite).spriteFrame = this.dianshuAtlas.getSpriteFrame("card"+data.mingpai[i]);
            this.nodeMingpai.getChildByName("list1").addChild(item);
        }
    },


    //显示已发的牌
    mingpai:function(data){
        this.nodeMingpai.getChildByName("list1").removeAllChildren();
        for(var i = 0;i < data.mingpai.length; i++){
            var item = cc.instantiate(this.prefabTJDMingPai);
            item.getChildByName("MyMahJongPai").getComponent(cc.Sprite).spriteFrame = this.dianshuAtlas.getSpriteFrame("card" + data.mingpai[i]);
            this.nodeMingpai.getChildByName("list1").addChild(item);
        }
    },

    //洗牌
    dealXipai:function(pos,begin,end,callback){
        var self = this;
        
        for (var index = 0; index < this._hang; index++) {
            //牌的位置
            for(var k = begin; k < end; k++){
                //生成一张牌
                var node = cc.instantiate(this.PrefabMajiang);
                if(node){
                    var card = node.getComponent('ZPJMajiang');
                    var x = pos[index].x + k * pos[index].distance - 25;
                    var y = pos[index].y;
                    card.node.setPosition(x, y);
                    card.node.scale = pos[index].scale;
                    this.nodeAllPai.addChild(node);
    
                    //重要，以此来区分是谁的第几张牌
                    node.myTag = index + "_" + k;
                }
               
                if(index == (this._hang - 1) && k == end - 1){
                    if(callback != null){
                        callback();
                    }
                }
            }
        }
    },

    //显示所有下注分数
    showAllXiazhu:function(data){
        var xiazhu = data.xiazhu;
        for (var value = 0; value < cc.vv.roomMgr.ren; value++) {
            var bet  = xiazhu[value];
            if(value != this._zhuang){
                this._currdao = data.nextDao;
                for (var index = 0; index < bet.length; index++) {
                    this.xiazhu_stage({seatid:value,nowDao:index + 1,nextDao:index + 2,power:bet[index]});
                }
            }
        }
    },

    //新的人数
    new_real_count:function(){
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        return playuser_count;
    },

     //广播开牌
     kaipaiAll:function(data){
        //开牌的数组
        this._kaipai = data.kaipai;
        for (var index = 0; index < this._kaipai.length; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);
            if(this._kaipai[index] == 1){//是否开牌过
                if(viewid == 0){
                    this.is_kaipai = true;// 自己是否看过牌
                    this.nodeCuopai.active = false;
                    this.nodeKaipai.active = false;
                }
                this._kaipai[index] = 0;
                var info = {
                    seatid:index,
                    type:data.type[index],
                    hand:data.hand[index],
                }
                this.kaipai(info);
            }else if(this._kaipai[index] == 2){//是否搓牌过
                if(viewid == 0){
                    this.nodeCuopai.active = true;
                    this.nodeKaipai.active = true;
                    this.nodeKaipai.scale = 1;
                }
            }else{
                if(viewid == 0){
                    this.is_kaipai = false;// 自己是否看过牌
                    this.nodeCuopai.active = true;
                    this.nodeKaipai.active = true;
                    this.nodeCuopai.scale = 1;
                    this.nodeKaipai.scale = 1;
                }
            }
        }
        var is_watch_game = this.watch_game();
        if(is_watch_game){
            this.nodeCuopai.active = false;
            this.nodeKaipai.active = false;
        };
    },

    //恢复牌序列
    huifuPai:function(){
        var viewid = 0;
        for (var indeturn = 0; indeturn < this.paiNumber; indeturn++) {
            this.send_card_tag_emit(viewid, indeturn, "setDown");
        }
        if(this.maxType == null)return;
        var arr = cc.vv.utils.deepCopy(this.pkarr);
        var indexOne = arr.indexOf(this.maxType[0]);
        arr[indexOne] = -1;
        var indexTwo = arr.indexOf(this.maxType[1]);
        this.send_card_tag_emit(viewid, indexOne, "setTop");
        this.send_card_tag_emit(viewid, indexTwo, "setTop");
        
        this.showSelfDianshuHuiFu();
    },

    //显示隐藏开抢按钮
    showOrHideQiangzhuang:function(viewid, isShow){
        var isQiangzhuang = new cc.Node("isQiangzhuang");
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var nodesprite = isQiangzhuang.addComponent(cc.Sprite);
        if(isShow == true){
            nodesprite.spriteFrame = this.spriteFrameQiangzhuang;
        }else{
            nodesprite.spriteFrame = this.spriteFrameBuqiangzhuang;
        }
        this.nodeIsQiangZhuang.addChild(isQiangzhuang);
        isQiangzhuang.x = pos[viewid].x + pos[viewid].pos.ready.x;
        isQiangzhuang.y = pos[viewid].y;
        
        isQiangzhuang.active = true;
    },

    beginXiazhu:function(data){
        this.auto_tips(data.time,"下注最小注");
        //自己不是庄家
        if(cc.vv.roomMgr.seatid != this._zhuang){
            this.isBeginXiazhu = true;
        }else{
            this.tip("tjd_xiazhu");
        }
    },

    show_xiazhu:function(){
        if(cc.vv.roomMgr.is_replay == true){
            return;
        }
        if(this.watch_game()){
            return;
        }

        var tipvalue = null;
        if(this._currdao == -1){
            tipvalue = null;
        }if(this._currdao == 1){
            tipvalue = "text_bet1";
        }else if(this._currdao == 2){
            tipvalue = "text_bet2";
        }else if(this._currdao == 3){
            tipvalue = "text_bet3";
        }
        
        this.xiazhutip(tipvalue);

        var item = this.nodeXiazhu.children;
        item[0].active=false;

        if(this._currdao == -1){
            this.nodeXiazhu.active = false;
        }else{
            this.nodeXiazhu.active = true;
            for(var i = 0; i < this.nodeXiazhu.childrenCount; i++){
                this.nodeXiazhu.children[i].scale = 1;
            }
        }
    },

    fapai_1:function(){
        var self = this;
        cc.vv.audioMgr.stopSFX(this.soundSaizi);
        this.soundSaizi = -1;
        this.table._winHub.emit("round");
        //让座位到开局状态
        this.table.seat_emit(null,"round");

        this._nodeyaosezi.angle = -0;
        this.TJDSaiZiAnim.stop();
        this.TJDSaiZiAnim.play("kaisezi");
        cc.vv.audioMgr.playSFX("maiding");
        this.isPlay = false; 
        // console.log("发牌动画第5部fapai_1：")
        //发牌动画 不显示牌
        function fapai_1_animation(){
            //发牌
            self.yao.active=false;
            self.yao1.active=false;

            function fapai(){
                self.shaizitip(null);
                self.fapaiAnimation();
                
                setTimeout(() => {
                    self._nodeyaosezi.active = false;
                }, 1000);
                
            }

            //摇色子
            var data = self.fapai1Data;
            self.dianshu = data.num[0] + data.num[1];
            var dianshu = self.dianshu;
            var viewid = cc.vv.roomMgr.viewChairID(dianshu % cc.vv.roomMgr.ren);
            var pos =cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
            self._nodeyaosezi.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5,pos[viewid].x,pos[viewid].y+10),
                                            cc.scaleTo(0.5,0.5,0.5)),cc.callFunc(fapai))); 
        }

        setTimeout(() => {
            fapai_1_animation();
        }, 1000);
    },

    //托管
    tuoguan:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.isTuoguan = true;
            this.tuoguanNode.active = true;
            this.nodeZhuang.active = false;
            this.nodeXiazhu.active = false;
            this.nodeCuopai.active = false;
            this.nodeKaipai.active = false;
        }
    },

    //取消托管
    cancleTuoguan:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.isTuoguan = false;
            this.tuoguanNode.active = false;
        }
    },

    //切换提示
    tip:function(text){

        if(text == null){
            this.sprTip.node.active = false;
            return;
        }
        var self = this;
        
        var name = text;
        this.sprTip.spriteFrame = this.tipDianAtlas.getSpriteFrame(name);
        this.sprTip.node.active = true;
    },

    //切换提示
    xiazhutip:function(text){

        if(text == null){
            this.sprTipe.node.active = false;
            return;
        }
        var self = this;
        
        var name = text;
        if(cc.vv.tempDataMgr.pokerNine == 1){ // 小九只有一道
            this.sprTipe.spriteFrame = this.tipAtlas.getSpriteFrame("tips_xiazhu");
        }else{
            this.sprTipe.spriteFrame = this.xiazhuAtlas.getSpriteFrame(name);
        }
        
        this.sprTipe.node.active = true;
    },

    //色子提示
    shaizitip:function(text){

        if(text == null){
            this.sprTip.node.active = false;
            return;
        }
        var self = this;
        
        var name = text;
        this.sprTip.spriteFrame = this.tipAtlas.getSpriteFrame(name);
        this.sprTip.node.active = true;
    },

    //播放音效
    play_tjd_mp3(setaid,type){

        var sex = cc.vv.roomMgr.table.list[setaid].sex;

        if(sex !='1' && sex!='2'){
            sex = '1';
        }
        var mp3File = "ttz/" + sex + "/type_" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },

    touchstart: function (event) {
        if(!this.is_click_cuopai || this.is_click_xuanpai){
            return;
        }
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        for (var index = 0; index < this.cuopaiNodeArr.length; index++) {
            var viewid = 0;
            var node = this.cuopaiNodeArr[index];
            var indefapai = index * this.paiNumber / 2 + 1;
            var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
            var x = (pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX);
            var y = pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2);
            node.x = x;
            node.y = y;
        }
    },

    touchmove: function (event) {
        if(!this.is_click_cuopai || this.is_click_xuanpai){
            return;
        }
        var touch = event.getTouches(); 
        var delta = touch[0].getDelta();              //获取事件数据: delta
        
        for (var index = 0; index < this.cuopaiNodeArr.length; index++) {
            var node = this.cuopaiNodeArr[index];
            node.x += delta.x;
            node.y += delta.y;    
        }
     
    },

    //搓牌完毕
    touchend: function (event) {
        if(!this.is_click_cuopai || this.is_click_xuanpai){
            return;
        }
        var self = this;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var viewid = 0;
        var indefapai = 0;
        var nodeX = (pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX);
        var nodeY = pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2);
        if(this.cuopaiNodeArr[0].x >= nodeX + 50 || this.cuopaiNodeArr[0].y >= nodeY + 50){
            this.is_click_xuanpai = true;
            this.is_click_cuopai = false;
            for (var index = 0; index < this.cuopaiNodeArr.length; index++) {
                var node = this.cuopaiNodeArr[index];
                var viewid = 0;
                var indefapai = index * this.paiNumber / 2 + 1;
                var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
                var x = (pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX);
                var y = pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2);
                node.x = x;
                node.y = y;
            }
            
            var callback = function(){
                   //牌型检索表
                var maxType = self.maxType;
                var maxPai = [maxType[0], maxType[1]];
                var paiType = [maxType[2], maxType[5]];
                var seatid = cc.vv.roomMgr.realChairID(viewid);
                if(self._fanpai[seatid] == 1)return;
                self._fanpai[seatid] = 1;
                self.fanpaiAnimation(cc.vv.roomMgr.seatid, self.pkarr, maxPai, paiType, true)
            }
            var seatid = cc.vv.roomMgr.realChairID(viewid);
            if(this._cuopai[seatid] == 1){
                var maxType = self.maxType;
                var maxPai = [maxType[0], maxType[1]];
                var paiType = [maxType[2], maxType[5]];
                if(self._fanpai[seatid] == 1)return;
                self._fanpai[seatid] = 1;
                self.fanpaiAnimation(cc.vv.roomMgr.seatid, self.pkarr, maxPai, paiType, true)
            }else{
                this._cuopai[seatid] = 1;
                this.cuopaiAnimation(cc.vv.roomMgr.seatid, callback);
            };
            this.nodeCuopai.active = false;
        }else{
            for (var index = 0; index < this.cuopaiNodeArr.length; index++) {
                var node = this.cuopaiNodeArr[index];
                var viewid = 0;
                var indefapai = index * this.paiNumber / 2 + 1;
                var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
                var x = (pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX);
                var y = pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2);
                node.x = x;
                node.y = y;
            }
        }
    },

    //自己的牌添加点击事件
    addTouchPaiNode:function(){
        for (var indefapai = 0; indefapai < this.paiNumber; indefapai++) {
            var viewid = 0;
            var enabledInfo = {
                enabled:true
            }
            this.send_card_tag_emit(viewid, indefapai, "setEnabled", enabledInfo);
        }
    },

    removeTouchPaiNode:function(){
        for (var indefapai = 0; indefapai < this.paiNumber; indefapai++) {
            var viewid = 0;
            var enabledInfo = {
                enabled:false
            }
            this.send_card_tag_emit(viewid, indefapai, "setEnabled", enabledInfo);
        }
    },

    addcuopaiNodeArr:function(){
        // console.log("发牌动画第7部addcuopaiNodeArr：",this.paiNumber)
        this.cuopaiNodeArr = [];
        for (var indefapai = 0; indefapai < this.paiNumber / 2; indefapai++) {
            var viewid = 0;
            var pai_tag = viewid + "_tag_"  + (indefapai * (this.paiNumber / 2) + 1) ;
            var node = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tag);
            if(viewid == 0){
                this.cuopaiNodeArr.push(node);
            }
        }
    },

    //自己的牌添加点击事件
    addTouchPaiNodeMove:function(){
        // console.log("发牌动画第8部addTouchPaiNodeMove：",this.paiNumber)
        for (var indefapai = 0; indefapai < this.paiNumber / 2; indefapai++) {
            var viewid = 0;
            var pai_tag = viewid + "_tag_"  + (indefapai * (this.paiNumber / 2) + 1);
            var node = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tag);
            if(viewid == 0){
                var bg = node.getChildByName("bg")
                if(bg){
                    bg.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
                    bg.on(cc.Node.EventType.TOUCH_END, this.touchend, this);
                    bg.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
                    bg.on(cc.Node.EventType.TOUCH_CANCEL, this.touchend, this);
                }
            }
        }
    },

    removeTouchPaiNodeMove:function(){
        for (var indefapai = 0; indefapai < this.paiNumber / 2; indefapai++) {
            var viewid = 0;
            var pai_tag = viewid + "_tag_"  + (indefapai * (this.paiNumber / 2) + 1);
            var node = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tag);
            if(viewid == 0){
                var bg = node.getChildByName("bg")
                if(bg){
                    bg.off(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
                    bg.off(cc.Node.EventType.TOUCH_END, this.touchend, this);
                    bg.off(cc.Node.EventType.TOUCH_START, this.touchstart, this);
                    bg.off(cc.Node.EventType.TOUCH_CANCEL, this.touchend, this);
                }
                var index = this.cuopaiNodeArr.indexOf(node); 
                this.cuopaiNodeArr.splice(index, 1);
            }
        }
    },
    
    //发牌动画
    fapaiAnimation:function(){
        var self = this;
        setTimeout(() => {
            self.is_operation = true;
            //self.xiazhuok();
        }, 3000);
        // console.log("发牌动画第6部fapaiAnimation：")
        var mingpaiValue = this.mingpaiValue;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            var valueXArr = [];
            var valueYArr = [];

            var valueXArrTwo = [];
            var valueYArrTwo = [];

            var viewid = cc.vv.roomMgr.viewChairID((index + this.dianshu) % cc.vv.roomMgr.ren);
          
            for (var indexpai = 0; indexpai < this.paiNumber; indexpai++) {
                var valueY = parseInt((mingpaiValue / 2 +  index * (this.paiNumber / 2) + indexpai) / this._lie) * 2;
                var valueX = (mingpaiValue/ 2 +  index  * (this.paiNumber / 2)  + indexpai)  % this._lie;
                valueYArr[indexpai] = valueY;
                valueXArr[indexpai] = valueX;
                valueYArrTwo[indexpai] = valueY  + 1;
                valueXArrTwo[indexpai] = valueX;
            }
            for (var indetag = 0; indetag < this.paiNumber / 2; indetag++) {
                var pai_tag = this.hangNumber[valueYArr[indetag]] + "_"  + this.lieNumber[valueXArr[indetag]];
                var node = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tag);
                if(node == null) return;
                node.myTag = viewid + "_tag_" + (indetag * (this.paiNumber / 2));

                var pai_tagTwo = this.hangNumber[valueYArrTwo[indetag]] + "_"  + this.lieNumber[valueXArrTwo[indetag]];
                var nodeTwo = cc.vv.utils.getChildByTag(this.nodeAllPai,pai_tagTwo);
                nodeTwo.myTag = viewid + "_tag_" + (indetag * (this.paiNumber / 2) + 1);
            }
            if(viewid == 0){
                this.addcuopaiNodeArr();
                this.addTouchPaiNodeMove();
            }

            for (var indefapai = 0; indefapai < this.paiNumber; indefapai++) {
                var callbackOne = null;
                if(indefapai == this.paiNumber - 1){
                    callbackOne = function(viewid, index){
                        cc.vv.audioMgr.playSFX("tjd/ttz_card_send");
                        var lastviewid = cc.vv.roomMgr.viewChairID((self.dianshu + (cc.vv.roomMgr.ren - 1)) % cc.vv.roomMgr.ren);
                        if(viewid == lastviewid){
                            if(self.isBeginXiazhu){
                                self.show_xiazhu();
                            }else{
                                self.tip("tjd_xiazhu");
                            }
                        }
                    }
                }else{
                    callbackOne = function(){
                    }
                }
                var info = {
                    viewid:viewid,
                    index:indefapai,
                    x:(pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX),
                    y:pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2),
                    scale:pos[viewid].pos.card.scale,
                    delayTime: (100 + index * 500) / 1000,
                    callback:callbackOne
                }
                self.send_card_tag_emit(info.viewid, info.index, "fapai", info);
            }
        }
    },

    //翻牌动画
    fanpaiAnimation:function(seatid, valuearr, maxPai, maxType, isTouch){
        var self = this;
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        for (var indeturn = 0; indeturn < self.paiNumber; indeturn++) {
            var callbackTwo = function(viewid, index, valuearr, maxType){

            }
            if(indeturn == self.paiNumber - 1){
                callbackTwo = function(viewid, index, valuearr, maxPai, maxType){
                    if(maxType == null)return;
                    // if(viewid != 0)return;
                    if(cc.vv.tempDataMgr.pokerNine == 0){
                        for (var indeturn = 0; indeturn < self.paiNumber; indeturn++) {
                            self.send_card_tag_emit(viewid, indeturn, "setDown");
                        }
                        var arr = cc.vv.utils.deepCopy(valuearr);
                        var indexOne = arr.indexOf(maxPai[0]);
                        arr[indexOne] = -1;
                        var indexTwo = arr.indexOf(maxPai[1]);
                        
                        self.send_card_tag_emit(viewid, indexOne, "setTop");
                        self.send_card_tag_emit(viewid, indexTwo, "setTop");    
                    }
                  
                 
                    
                    self.showDianshu(viewid, maxType);
                    if(viewid == 0){
                        if(isTouch){
                            self.addTouchPaiNode();
                        }else{
                            self.removeTouchPaiNode();
                        }
                    }
                }
            }
            var infoOne = {
                viewid:viewid,
                index:indeturn,
                value:valuearr[indeturn],
                valuearr:valuearr,
                maxPai:maxPai,
                maxType:maxType,
                callback:callbackTwo
            }
            self.send_card_tag_emit(infoOne.viewid, infoOne.index, "trun", infoOne);
        } 
             
    },

    //移动牌
    cuopaiAnimation:function(seatid, callback){
        var self = this;
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        for (var indefanpai = 0; indefanpai < this.paiNumber; indefanpai++) {
             //还原牌堆
            if(viewid == 0){
                for (var index = 0; index < this.cuopaiNodeArr.length; index++) {
                    var viewid = 0;
                    var node = this.cuopaiNodeArr[index];
                    var indefapai = index * this.paiNumber / 2;
                    var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
                    var x = (pos[viewid].pos.card.x + pos[viewid].distance * parseInt(indefapai/2) + indefapai % 2 * pos[viewid].distanceX);
                    var y = pos[viewid].pos.card.y + pos[viewid].distanceY * (indefapai % 2);
                    node.x = x;
                    node.y = y;
                }
            }
            if(indefanpai % 2 == 0) continue;
            var callbackOne = function(){

            };
            if(indefanpai == this.paiNumber - 1){
                callbackOne = function(){
                    callback();
                }   
            }

            var infoTwo = {
                viewid:viewid,
                index:indefanpai,
                distance:-pos[viewid].distance * (self.paiNumber / 2),
                distanceH:pos[viewid].distanceY,
                callback:callbackOne,
            }
            self.send_card_tag_emit(infoTwo.viewid, infoTwo.index, "fapaianimation", infoTwo);
        }
    },

    //循环显示下注的画面
    nextxiazhu:function(power){
        var self = this;
        if(this._currdao == 1){
            cc.vv.net2.quick('xiazhu',{dao:this._currdao, power:power});
        }else if(this._currdao == 2){
            cc.vv.net2.quick('xiazhu',{dao:this._currdao, power:power});
        }else if(this._currdao == 3){
            cc.vv.net2.quick('xiazhu',{dao:this._currdao, power:power});
        }
       
    },

    showDianshu:function(viewid, maxType){
        this.hideTypeOnePlay(viewid);
        for (var indexpai = 0; indexpai < this.paiNumber / 2; indexpai++) {
            var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
            var PrefabDianshuOne = cc.instantiate(this.PrefabDianshu);
            PrefabDianshuOne.myTag = viewid + "_type_" + indexpai;
            PrefabDianshuOne.getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame("cardType" + maxType[indexpai]);
            PrefabDianshuOne.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + indexpai * 50 + + pos[viewid].dianshuH);
            this.nodeAllPai.addChild(PrefabDianshuOne);
        }

        cc.vv.log3.debug("类型 " + maxType[0]);
        cc.vv.log3.debug("类型 " + maxType[1]);
    },

    showSelfDianshu:function(){
        var viewid = 0;
        this.hideTypeOnePlay();
        var maxType = this.getMaxType();
        var viewid = 0;
        this.showDianshu(viewid, maxType);
    },

    getMaxType:function(){
        var type = []
        var maxType = this.maxType;
        var pkarr = this.pkarr;
        var paitype = this.paitype;
        var kaipaiArr = cc.vv.game.kaipaiArr;

        var kaipaiArrOther = cc.vv.utils.deepCopy(pkarr);
        var indexOne = kaipaiArrOther.indexOf(kaipaiArr[0]);
        kaipaiArrOther.splice(indexOne ,1);
        var indexTwo = kaipaiArrOther.indexOf(kaipaiArr[1]);
        kaipaiArrOther.splice(indexTwo ,1);

        for (var index = 0; index < paitype.length; index++) {
            if((paitype[index][0] == kaipaiArr[0] && paitype[index][1] == kaipaiArr[1]) || (paitype[index][0] == kaipaiArr[1] && paitype[index][1] == kaipaiArr[0])){
                type[0] = paitype[index][2];
            }
            if((paitype[index][0] == kaipaiArrOther[0] && paitype[index][1] == kaipaiArrOther[1]) || (paitype[index][0] == kaipaiArrOther[1] && paitype[index][1] == kaipaiArrOther[0])){
                type[1] = paitype[index][2];
            }
        }
        return type;
    },

    showSelfDianshuHuiFu:function(){
        var viewid = 0;
        this.hideTypeOnePlay();
        var maxType = [this.maxType[2], this.maxType[5]];
        var viewid = 0;
        this.showDianshu(viewid, maxType);
    },

    //飞币
    playBetByXY:function(parent, fx, fy, tx, ty, count, delayTime, callback){
        for (var index = 0; index < count; index++) {	
            var item = new cc.Node("getMoneyNode");
            const money = item.addComponent(cc.Sprite)
            money.spriteFrame= this.moneyGold.getSpriteFrame("common_fen_img");
            item.setPosition(((Math.random() - 0.5) * 2) * 70 + fx, fy + ((Math.random() - 0.5) * 2) * 70);

            var tpos = cc.v2(tx, ty);
            var taction = cc.moveTo(0.1 * index + 1,tpos);
            taction.easing(cc.easeQuinticActionOut());
            
            parent.addChild(item);
            if(index == count - 1){
                item.runAction(cc.sequence(cc.delayTime(delayTime), taction, callback, cc.removeSelf()));
            }else{
                item.runAction(cc.sequence(cc.delayTime(delayTime), taction, cc.removeSelf()));
            }
        }
    },

    hideType:function(viewid, index){
        var myTag = viewid + "_type_" + index;
        var node = cc.vv.utils.getChildByTag(this.nodeAllPai,myTag);
        if(node == null)return;
        node.destroy();
    },

    hideTypeOnePlay:function(viewid){
        for (var indexpai = 0; indexpai < this.paiNumber / 2; indexpai++) {
            this.hideType(viewid, indexpai, "hide");
        }
    },

     //是否已经下注
     isXiaZhu:function(list){
        var xiazhuNumber = 0;
        for (var index = 0; index < list.length; index++) {
            if(list[index] == 0){
                xiazhuNumber++;
            }
        }
        return xiazhuNumber;
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
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        node.getChildByName("Recharge").active = false;
        if(data.userid == cc.vv.userMgr.userid){
            this.tip("zhunbei");
            this.new_round();
            sit.active = true;
        }
    },

    //色子动画监听
    initEventSeZi:function(data){
        var self = this;
        this.yao.on('touchstart',function(event){
            if(self.isAutoYao == 1 || cc.vv.roomMgr.seatid != self._zhuang) return;
            cc.vv.audioMgr.playSFXRepeat("sezi",function(audioId){
                cc.vv.audioMgr.stopSFX(self.soundSaizi);   
                self.soundSaizi = audioId;
            });
        },this);
        this.yao.on('touchmove',function(event){
            if(this.isPlay == false){
                this.isPlay = true;
                this.TJDSaiZiAnim.play("yaosezimove");
            }
            let delta = event.touch.getDelta();// cc.Vec2()
            let deltaX = delta.x;
            let deltaY = delta.y;
            this._nodeyaosezi.setPosition(this._nodeyaosezi.x + deltaX, this._nodeyaosezi.y + deltaY);
        },this);

        this.yao.on('touchend',function(event){
            this.yao.off('touchmove');
            this.yao.off('touchend');
            this.yao.off('touchcancel');
            cc.vv.net2.quick("getEnd");
            this.fapai_1();
            this.shaizitip(null);
        },this);
        
        this.yao.on('touchcancel',function(event){
            this.yao.off('touchmove');
            this.yao.off('touchend');
            this.yao.off('touchcancel');
            cc.vv.net2.quick("getEnd");
            this.fapai_1();
            this.shaizitip(null);
        },this);
    },

    //给所有牌发消息
    send_card_emit:function(viewid,index,name,data){
        var myTag = viewid + "_" + index;
        var node = cc.vv.utils.getChildByTag(this.nodeAllPai,myTag);
        if(node){
            node.emit(name,data);
        }
    },


    //给所有牌发消息
    send_card_tag_emit:function(viewid,index,name,data){
        // console.log("发牌动画第9部send_card_tag_emit：",name)
        var myTag = viewid + "_tag_" + index;
        var node = cc.vv.utils.getChildByTag(this.nodeAllPai,myTag);
        if(node){
            node.emit(name,data);
        }
    },

    //界面关闭时
    onDestroy:function(){
        cc.loader.setAutoRelease(this, true);
        cc.vv.audioMgr.stopSFX(this.soundSaizi);
    },

    //按钮操作
    onBtnClicked:function(event,data){
        switch(event.target.name){
            case "btn_buqiang":{
                this.nodeZhuang.active = false;
                cc.vv.net2.quick("buqiangzhuang",{power:-1});
            }
            break;
            case "btn_qiangzhuang":{
                this.nodeZhuang.active=false;
                cc.vv.net2.quick("qiangzhuang",{power:1});
            }
            break;
            case "btn_xiazhu":{
               var power = parseInt(data);
               this.nextxiazhu(power);
            }
            break;
            case "tishi":{
                cc.vv.net2.quick("tishi");
            }
            break;
            case "kaipai":{
                var kaipaiArr = this.kaipaiArr;
                cc.vv.net2.quick("kaipai",{poker1:kaipaiArr[0],poker2:kaipaiArr[1]});
                this.is_Kaipaibtn = true;
            }
            break;
            case "cuopai":{
                this.cuopai();
            }
            break;
            case "btn_tuoguan":{
                cc.vv.net2.quick('tuoguan');
            }
            break;
            case "btn_quxiaotuoguan":{
                cc.vv.net2.quick('cancleTuoguan');
            }
            break;
        }
        cc.vv.audioMgr.click();
    },

    //按钮操作
    onTestBtnClicked:function(event,data){
        var self = this;
        switch(event.target.name){
            case "test":{
                self.onButtonQieGuo();
            }
            break;
        }
        cc.vv.audioMgr.click();
    },


    //==========================================================================
    //测试用接口
    // //配数据
    testData:function(type, data){
        var self = this;

        this.node.emit(type, data);
    },

    onButtonQieGuo:function(){
        cc.vv.roomMgr.real = 5;
        this.testData("fapai",{"errcode":0,"data":{"auto":1,"round":1,"num":[3,3],"start":2,"max_round":20,"real":2,"xiPai":1},"errmsg":"ok","model":"game","event":"fapai"});
    },
});
