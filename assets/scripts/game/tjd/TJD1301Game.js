//推九点
cc.Class({
    extends: cc.Component,

    properties: {
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
        bishiAtlas:{
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

        _winPlayer:cc.Node,
        nodeZhuang:cc.Node,
        nodeCard:cc.Node,
        nodeSezi:cc.Node,
        nodeXiazhu:cc.Node,
        nodeLabelscore:cc.Node,
        nodeCuopai:cc.Node,
        nodeKaipai:cc.Node,
        nodeJiesuan:cc.Node,
        nodeReport:cc.Node,
        nodeMsg:cc.Node,
        nodeMingpai:cc.Node,
        nodeAllPai:cc.Node,
        nodeIsQiangZhuang:cc.Node,

        spriteFrameQiangzhuang:cc.SpriteFrame,
        spriteFrameBuqiangzhuang:cc.SpriteFrame,

        sprTip:cc.Sprite,
        sprTipe:cc.Sprite,      //显示第几道下注

        labelRoomwanfa:cc.Label,
        labelMax:cc.Label,
        labelSmall:cc.Label,
        labelFen:cc.Label,
        labelGuofen:cc.Label,
        nodeQie:cc.Node,
        nodeGuo:cc.Node,
        xiazhuSlider:cc.Slider,
        
        prefabYaosezi:cc.Prefab,
        preTJDkaipai:cc.Prefab,
        reportItemPrefab:cc.Prefab,
        prefabTJDMingPai:cc.Prefab,
        PrefabMajiang:cc.Prefab,
        PrefabDianshu:cc.Prefab,
        
        
        _wanfa:0,
        _zhuang:0,
        _zhuang_mode:0,

    },

    editor: {
        executionOrder: -1
    },

    onLoad(){
        var self=this;
        var const_nn = require("TJD1301Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"jtd",
            hide_nothing_seat:false,
            direct_begin:true,
            chat_path:const_nn.chat_path,
            quick_chat:const_nn.quick_chat,
            player_4:const_nn.player4,
            player_6:const_nn.player6,
            xipai_pos:const_nn.xipai_pos,
            not_xipai_pos:const_nn.not_xipai_pos,
            set_bg:true,
            location:false,
            show_watch_btn:false,//是否显示观战按钮
            default_bg:const_nn.default_bg
        }

        cc.log("TJD1300Game:onLoad");

        this._winPlayer = cc.find("Canvas/mgr/players");

        //获取对象
        this.table = this.node.getComponent("Table");
        
        this.isPlay = false;
        
        //明牌数
        this.mingpaiValue = 0;

        //色子点数
        this.dianshu = 0;

        //每次发多少张
        this.paiNumber = 2;

        //是否手动要骰子
        this.isAutoYao = false;

        //下注数组
        this.nodeLabelscoreArr =  this.nodeLabelscore.children;
        
        //色子音效
        this.soundSaizi = -1;

        //监听协议
        this.initEventHandlers();
    },

    start () {

        var self=this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        cc.vv.TJDMgr = this.node.getComponent("TJD1301Mgr");
        //回放
        var ReplayMgr = require("TJD1301ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        //初始化
        this.new_round();
      
        if(cc.vv.roomMgr.is_replay){
            //回放控制器
            cc.vv.popMgr.open('ReplayCtrl',function(obj){
                self._winRealName=obj;
            });
            //初始数据
            cc.vv.TJDMgr.prepareReplay();
            function callback(seatid){
                self.table.seat();
                
                //显示坐的人
                self.table.table(cc.vv.roomMgr.table);
            
                //回放数据
                cc.vv.replayMgr.init(cc.vv.roomMgr.action.action,cc.vv.roomMgr.jiesuan);
            }
            var view_tips = self.node.getChildByName("replay").getChildByName("SView_tips");
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

        cc.game.on(cc.game.EVENT_HIDE, function () {
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay && cc.vv.net2.isConnectd()){
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
        this.node.on('begin',function(data){

        }),

        //开抢
        this.node.on("kaiqiang",function(data){
            // self.kaiqiang(data.data);
            self.begin(data.data);
        }),

        //抢庄
        this.node.on("qiangzhuang",function(data){
            self.qiangzhuang(data.data);
        }),

        //不抢庄
        this.node.on("buqiangzhuang",function(data){
            self.buqiangzhuang(data.data);
        }),

        //定庄
        this.node.on("dingzhuang",function(data){
            self.dingzhuang(data.data);
        }),

        //第一轮发牌
        this.node.on("fapai",function(data){
            self.fapai1Data = data.data;
            self.saizi_animation(self.fapai1Data);
        }),

        //摇色子停止
        this.node.on("getEnd", function(){
            if(self.isAutoYao == 1 || cc.vv.roomMgr.is_replay){
                self.fapai_1();
            }else{
                if(cc.vv.roomMgr.seatid != self._zhuang){
                    self.fapai_1();
                } 
            }
        }),

       //下注
       this.node.on("xiazhu",function(data){
            self.xiazhu(data.data);
       }),

       //下注ok
       this.node.on("xiazhuok",function(){
            self.Received_xiazhuok = true;
            if(self.fapaiok){
                self.xiazhuok();
            }
       }),
       
       //搓牌
       this.node.on("cuopai",function(data){
            self.cuopai(data.data);
       });

       //开牌
       this.node.on("kaipai",function(data){
            self.kaipai(data.data);
       }),
       
         //结算_小结算
       this.node.on("jiesuan",function(data){
            cc.vv.roomMgr.jiesuan = data.data;
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
       });
       
       //显示所有下注
       this.node.on('showAllXiazhu',function(data){
            self.showAllXiazhu(data.data);
       });

       this.node.on('beginXiazhu',function(data){
            self.beginXiazhu(data.data);
        });
       
        this.node.on('waitXiazhu',function(data){
            self.tip('tjd_xiazhu');
        });
    },

    beginXiazhu:function(data){
         
        //自己不是庄家
        if(cc.vv.roomMgr.seatid != this._zhuang){
            this.show_xiazhu();
        }else{
            this.tip("tjd_xiazhu");
        }
        this.labelSmall.string = data.minXiazhu;
        this.labelMax.string = data.maxXiazhu;
        this.labelFen.string = data.minXiazhu;
    },

    initEventSeZi:function(){
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
                var data = this.labelFen.string;
                var power = parseInt(data);
               var power = parseInt(data);
               this.nextxiazhu(power);
            }
            break;
            case "cuopai":{
                this.nodeCuopai.active=false;
                this.nodeKaipai.active=false;
                cc.vv.net2.quick("cuoPai");
            }
            break;
            case "kaipai":{
                cc.vv.audioMgr.playSFX("tjd/shuffle");
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
                }else if(this.isQieGuo != 0 &&  cc.vv.roomMgr.seatid == this._zhuang){
                    //显示切锅按钮
                    this.nodeJiesuan.active = false;
                    this.nodeQie.active = true;
                    this.nodeQie.children[0].scale = 1;
                    this.nodeQie.children[1].scale = 1;
                }else{
                    this.table.node.emit("jgnnready");
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
        if(max == 10 && small == 0){
            if(event.progress > 0){
                value = max;
            }else{
                value = small;
            }
        }

        // if(value == 0){
        //     value = 1;
        // }
        
        this.labelFen.string = value;
    },

    //获取到游戏参数
    param:function(data){

        //1:扣1 2:扣人 3:全扣
        this._desc = data.desc;

        this._roomid=data.roomid;

        // 0:抢庄 1:定庄 2:轮庄
        this._zhuang_mode = data.zhuang;

        //庄
        this._zhuang = data.zhuangSeateid;

        this._ren = data.ren;

        //是否自动摇骰子
        this.isAutoYao = data.auto;

        //总共有几道下注
        this._dao = data.dao;
        
        //0不开 1开
        if(this.real < 4){
            this._yaruan = -1;
            this.__duhong = -1
        }else{
            this._yaruan = data.yaruan;
            this._duhong = data.duhong;
        }
        
        //色子点数
        this.num = data.touZi;
        
        //当前局数
        this.round = data.round;

        this.labelGuofen.string = data.guo;
    },

    init_data:function(data){
        this.labelGuofen.string = data.init_data.guo;
    },

    //游戏开始
    begin:function(data){
        var self = this;
        self.kaiqiang();
    },

    //准备
    ready:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.new_round();
        }
    },

    //开抢
    kaiqiang:function(){
         
        //{"errcode":0,"data":{"mingpai":[9,8,5,4],"ifqiang":0,"stage":2,"now":2,"deal_time":0,"real":2,"zhuang":0},"errmsg":"ok","model":"game","event":"stage"}
        if(this.isStage){
            //已经抢过庄了
            var ifqiang  = cc.vv.roomMgr.stage.ifqiang;
            if(ifqiang != 0 && ifqiang != undefined)return;
        }
        this.nodeZhuang.active = true;
        this.nodeZhuang.children[0].scale = 1;
        this.nodeZhuang.children[1].scale = 1;
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

    saizi_animation:function(data){
         
        var self = this;

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
                if(cc.vv.roomMgr.seatid != self._zhuang){
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

    //摇色子动画
    fapai_1:function(){
         
        //刷新标题
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
                // //自己不是庄家
                // if(cc.vv.roomMgr.seatid != self._zhuang){
                //     self.show_xiazhu();
                // }else{
                //     self.tip("tjd_xiazhu");
                // }
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

    //直接显示色子点数
    showSaizi:function(data){
        this.dianshu = data.num[0] + data.num[1];
        var dianshu = this.dianshu;
        var viewid = cc.vv.roomMgr.viewChairID(dianshu % cc.vv.roomMgr.ren);
        var pos =cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        this._nodeyaosezi.x = pos[viewid].x;
        this._nodeyaosezi.y = pos[viewid].y + 10;
        this._nodeyaosezi.scale = 0.5;
        var sezi1 = this._nodeyaosezi.getChildByName('sezi1');
        var sezi2 = this._nodeyaosezi.getChildByName('sezi2');
        var sezi1Name = "ttz_sezi_" + data.num[0]+"_"+0;
        var sezi2Name = "ttz_sezi_" + data.num[1]+"_"+0;
        sezi1.getComponent(cc.Sprite).spriteFrame = this.typeSeZi.getSpriteFrame(sezi1Name);  
        sezi2.getComponent(cc.Sprite).spriteFrame = this.typeSeZi.getSpriteFrame(sezi2Name);
        this.yao.active = false;
        this.yao1.active = false;
        this.nodeSezi.active = true;
    },

    watch_game:function(){
        var is_watch_game = false;
        for(var i = 0;i < cc.vv.roomMgr.table.list.length;i++){
            if(cc.vv.roomMgr.table.list[i].userid != 0){
                if(cc.vv.roomMgr.table.list[i].sitStatus == 1){
                    var is_viewid = cc.vv.roomMgr.viewChairID(cc.vv.roomMgr.table.list[i].seatid);
                    if(is_viewid == 0){
                        is_watch_game = true;
                    }
                }
            }
        }
        return is_watch_game;
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
        }else if(this._currdao == 4){
            if(this._yaruan == -1){
                tipvalue = null;
            }else{
                tipvalue = "fen_yaruan";
            }
        }else if(this._currdao == 5){
            if(this.__duhong == -1){
                tipvalue = null;
            }else{
                tipvalue = "fen_duhong";
            }
        }else if(this._currdao == 1){
            tipvalue = "text_bet1";
        }else if(this._currdao == 2){
            tipvalue = "text_bet2";
        }else if(this._currdao == 3){
            tipvalue = "text_bet3";
        }
        this.xiazhutip(tipvalue);

        // var item = this.nodeXiazhu.children;
        // if(this._currdao == 1){
        //    item[0].active=false;
        // }else {
        //     item[0].active=true;
        // }

        if((this._currdao == 4 && this._yaruan == -1)||(this._currdao == 5 && this.__duhong == -1)||this._currdao == -1){
            this.nodeXiazhu.active = false;
        }else{
            this.nodeXiazhu.active = true;
            for(var i = 0; i < this.nodeXiazhu.childrenCount; i++){
                this.nodeXiazhu.children[i].scale = 1;
            }
        }
    },

    //显示下注的分数
    xiazhu:function(data){
         
        //{"errcode":0,"data":{"nowDao":1,"nextDao":2,"seatid":0,"power":10,"userid":3099},"errmsg":"ok","model":"game","event":"xiazhu"}
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
       
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        //this.nodeLabelscoreArr[viewid].setPosition(pos[viewid].x + pos[viewid].xiazhuX, pos[viewid].y + pos[viewid].xiazhuH);
        this.nodeLabelscoreArr[viewid].setPosition(pos[viewid].pos.xiazhu.x,pos[viewid].pos.xiazhu.y);
        this.nodeLabelscoreArr[viewid].active = true;
        var label = this.nodeLabelscoreArr[viewid].getComponent(cc.Label);

        this.nodeLabelscore.active = true;

        var nowDao = data.nowDao;
        var nextDao = data.nextDao;
        //power == -1 不能下  
        //power == -2
        var power = data.power;
        if(nowDao <= 3 && nowDao != 0){
            if(power != 0){
                label.string += power + ' ';
            }else{
                label.string += 0 + ' ';
            }
        }else if(nowDao == 4){
            if(power != 0){
                label.string += '\n' + power + ' ';
            }else{
                label.string += '\n' + 0 + ' ';
            }
            this._isfour[viewid] = 1;
        }else if(nowDao == 5){
            if(this._isfour[viewid] == 1){
                if(power != 0){
                    label.string += power + ' ';
                }else{
                    label.string += 0 + ' ';
                }
            }else{
                if(power != 0){
                    label.string += '\n' + power + ' ';
                }else{
                    label.string += '\n' + 0 + ' ';
                }
            }
        }
        if(viewid == 0){
            this._currdao = data.nextDao;
            this.labelSmall.string = data.minXiazhu;
            this.labelMax.string = data.maxXiazhu;
            this.labelFen.string = data.minXiazhu;
            this.xiazhuSlider.progress = 0;
            this.show_xiazhu();
        }
    },

    //显示下注的分数
    xiazhu_stage:function(data){
        //{"errcode":0,"data":{"nowDao":1,"nextDao":2,"seatid":0,"power":10,"userid":3099},"errmsg":"ok","model":"game","event":"xiazhu"}
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
       
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        //this.nodeLabelscoreArr[viewid].setPosition(pos[viewid].x + pos[viewid].xiazhuX, pos[viewid].y + pos[viewid].xiazhuH);
        this.nodeLabelscoreArr[viewid].setPosition(pos[viewid].pos.xiazhu.x,pos[viewid].pos.xiazhu.y);
        this.nodeLabelscoreArr[viewid].active = true;
        var label = this.nodeLabelscoreArr[viewid].getComponent(cc.Label);

        this.nodeLabelscore.active = true;

        var nowDao = data.nowDao;
        var nextDao = data.nextDao;
        //power == -1 不能下  
        //power == -2
        var power = data.power;
        if(power != -1 && power != -2){
            if(nowDao <= 3 && nowDao != 0){
                if(power != 0){
                    label.string += power + ' ';
                }else{
                    label.string += 0 + ' ';
                }
            }else if(nowDao == 4){
                this._isfour[viewid] = 1;
                if(power != 0){
                    label.string += '\n' + power + ' ';
                }else{
                    label.string += '\n' + 0 + ' ';
                }
            }else if(nowDao == 5){
                if(this._isfour[viewid] == 1){
                    if(power != 0){
                        label.string += power + ' ';
                    }else{
                        label.string += 0 + ' ';
                    }
                }else{
                    if(power != 0){
                        label.string += '\n' + power + ' ';
                    }else{
                        label.string += '\n' + 0 + ' ';
                    }
                }
               
            }
        }
    },

    //下注ok就发牌
    xiazhuok:function(){
         
        this.tip(null);
        //开牌和搓牌搓牌
        this.nodeCuopai.active=true;
        this.nodeKaipai.active=true;
        this.nodeCuopai.scale = 1;
        this.nodeKaipai.scale = 1;
    },

    jiesuan:function(data){
         
        this.tip(null);
        this._zhuang = data.zhuang;
        this.nodeCuopai.active = false;
        this.nodeKaipai.active = false;
        
        // this.NodeWaitclock.active = false;
        // this.unschedule(this.otherTimeUpdate);
        var self = this;
        
        if(this._itemkaipai){
            this._itemkaipai.active = false;
        }
        
        if(!this.isStage){
                //所有人开牌
            for(var i=0;i< cc.vv.roomMgr.ren ;++i){
                if(this._kaipai[data.list[i].seatid] != 1){
                    this.kaipai({seatid:data.list[i].seatid,userid:data.list[i].userid,hand:data.list[i].hand,type:data.list[i].type});
                }
            }
        }
        setTimeout(() => {
            //隐藏麻将
            //this.hidePai();
            this.mingpaiValue = data.mingpai.length;
        }, 3000);
    
        this.labelGuofen.string = data.guoFen;
        
        this.isQieGuo = data.isQieGuo;
        
        //所有人结算
        for(var i = 0;i< cc.vv.roomMgr.real ;++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            self.table.seat_emit(viewid,"score",data.list[i].user_score);
            if(data.list[i].round_score > 0){
                self.table.seat_emit(viewid,"win",data.list[i].round_score);
            }else{
                self.table.seat_emit(viewid,"lost",data.list[i].round_score);
            }
        }

        var list = this.nodeJiesuan.getChildByName("viewlist").getChildByName("view").getChildByName("list");
        this.nodeJiesuan.getChildByName("roomID").getComponent(cc.Label).string="房间号："+ cc.vv.roomMgr.enter.room_id;
        this.nodeJiesuan.getChildByName("date").getComponent(cc.Label).string=data.time;
        this.nodeJiesuan.getChildByName('wanfa').getComponent(cc.Label).string = "第" + data.nowRound + "局" + " " + cc.vv.roomMgr.enter.desc;
        //隐藏所有结点
        for(var i = 0; i < list.children.length; ++i){
            list.children[i].active = false;
        }
        this.nodeJiesuan.getChildByName("roomID").active=true;
        this.nodeJiesuan.getChildByName('wanfa').active=true;
        this.nodeJiesuan.getChildByName("date").active=true;
        //所有人结算
        for(var i = 0;i< cc.vv.roomMgr.real ;++i){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var name = cc.vv.roomMgr.table.list[i].nickname;
            var headimg = this.table.seat_img(viewid);
            
            var item = list.getChildByName("item" + viewid);
            item.x = list.children[i].x;
            item.y = list.children[i].y;
            item.active = true;
            item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
            item.getChildByName("name").getComponent(cc.Label).string = name;
            
            if(cc.vv.roomMgr.table.list[i].seatid == this._zhuang){
                item.getChildByName("zhuang").active = true;
            }else{
                item.getChildByName("zhuang").active = false;
            }
            
            //根据正负显示字体
            var score = item.getChildByName("score").getComponent(cc.Label);
            //显示得到的牌
            var pai1 = item.getChildByName("pai1").getChildByName("New Sprite").getComponent(cc.Sprite);
            var pai2 = item.getChildByName("pai2").getChildByName("New Sprite").getComponent(cc.Sprite);
            pai1.spriteFrame = self.typeAtlas.getSpriteFrame("B"+data.list[i].hand[0]);
            pai2.spriteFrame = self.typeAtlas.getSpriteFrame("B"+data.list[i].hand[1]);
            //显示压的分
            var yafen = item.getChildByName('score1').getComponent(cc.Label);
            if(cc.vv.roomMgr.param.dao == 2){
                yafen.string = "两道(" + data.list[i].dao[0]+" " + data.list[i].dao[1] + ")";
            }else if(cc.vv.roomMgr.param.dao == 3){
                yafen.string = "三道(" + data.list[i].dao[0] + " " +data.list[i].dao[1] + " " + data.list[i].dao[2] + ")";
            }

            var dianshu = item.getChildByName("dianshu").getComponent(cc.Sprite);
            if(data.list[i].type == 0){
                dianshu.spriteFrame = self.bishiAtlas.getSpriteFrame("tjd_bi10");
            }else if(data.list[i].hand[0] == data.list[i].hand[1]){
                dianshu.spriteFrame = self.dianshuAtlas.getSpriteFrame("tjd_dui" + data.list[i].hand[1]);
            }else{
                var yushu = (data.list[i].hand[0] + data.list[i].hand[1])%10;
                dianshu.spriteFrame = self.dianshuAtlas.getSpriteFrame("tjd_dian" + yushu);
            }

            var nodetitle = self.nodeJiesuan.getChildByName('title').getComponent(cc.Sprite);
            var nodeplayertext = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_player_text").getComponent(cc.Sprite);
            var nodesocretext = self.nodeJiesuan.getChildByName('end_bg').getChildByName("end_socre_text").getComponent(cc.Sprite);
            if(data.list[i].round_score > 0){
                score.string = "+" + cc.vv.utils.numInt(data.list[i].round_score);
                if( cc.vv.userMgr.userid == data.list[i].userid){
                    //胜利
                    nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_bj1");

                    nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_wanjia1");
                    nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_jifen1");
                }
            }else if(data.list[i].round_score < 0){
                score.string = cc.vv.utils.numInt(data.list[i].round_score);
                if( cc.vv.userMgr.userid == data.list[i].userid){
                    //失败
                    nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_bj2");
                    
                    nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_wanjia2");
                    nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_jifen2");
                }
            }else{
                score.string = cc.vv.utils.numInt(data.list[i].round_score);
                if( cc.vv.userMgr.userid == data.list[i].userid){
                    //胜利
                    nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_bj1");

                    nodeplayertext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_wanjia2");
                    nodesocretext.spriteFrame = self.jiesuanAtlas.getSpriteFrame("tjd_jifen1");
                }
            }
        }
        var mp3File = "nn/chips";
        cc.vv.audioMgr.playSFX(mp3File);
        
        for(var i = 0;i < cc.vv.roomMgr.real ;i++)
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
                var v_to_seat = cc.vv.roomMgr.viewChairID(this._zhuang);
                if(!pos[v_to_seat]){
                    continue;
                }
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, callback);
            }else if(data.list[i].round_score > 0){
                var v_from_seat = cc.vv.roomMgr.viewChairID(this._zhuang);
                var v_to_seat = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
                if(!pos[v_from_seat]){
                    continue;
                }
                this.playBetByXY(this._winPlayer, pos[v_from_seat].x, pos[v_from_seat].y, pos[v_to_seat].x, pos[v_to_seat].y, moneyCount, callback);
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

        //隐藏解散房间
        this.table.hide_dismiss_room();
        var list = this.nodeReport.getChildByName("list1");
        list.removeAllChildren();
         //房间号、日期
        this.nodeReport.getChildByName("roomid").getComponent(cc.Label).string = cc.vv.roomMgr.enter.room_id;
        this.nodeReport.getChildByName("time").getComponent(cc.Label).string = data.time;
        this.nodeReport.getChildByName("roomwanfa").getComponent(cc.Label).string = "玩法:" + cc.vv.roomMgr.enter.desc;
        
        var max_score = 0;
        var max_seat = 0;
        for(var i = 0;i < data.list.length; ++i){
            if(data.list[i].result_score >= max_score){
                max_score = data.list[i].result_score;
                max_seat = i;
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
        for(var i = 0;i< data.list.length; ++i){
            if(data.list[i].userid > 0){
                realPeople++;
            }
        }
        //所有人结算
        for(var i = 0;i < realPeople; ++i){

            var viewid = cc.vv.roomMgr.viewChairID(i);

            var info = {
                zhuang:data.zhuang,
                seatid:data.list[i].seatid,
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
        
    },

    stage:function(data){
        var self = this;
        
          
        this.new_round();
        if(this.nodeAllPai){
            this.nodeAllPai.removeAllChildren();
        }
        if(data.xiazhu != null){
            for(var i = 0;i<data.xiazhu.length;i++){
                var xiazhu_viewid = cc.vv.roomMgr.viewChairID(i);
                if(xiazhu_viewid == 0){
                    if(data.xiazhu[i] == 0){
                        this.Received_xiazhuok = true;
                    }else if(data.xiazhu[i] == -2){
                        this.Received_xiazhuok = false;
                    }
                }
            }
        }

        self.node.getChildByName("pop").removeAllChildren();
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
        switch(data.stage){
            case 1:
            case 2:{
                //抢庄
                this.kaiqiang();
                for(var i = 0; i < cc.vv.roomMgr.real; ++i){
                    var viewid = cc.vv.roomMgr.viewChairID(i);
                    if(data.qiangzhuang[i] != 0){
                        this.showOrHideQiangzhuang(viewid, data.qiangzhuang[i] == 1);
                    }
                }
            }
            break;
            case 6:{
                this._zhuang = data.zhuang;
                //定庄
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                this.yaoShaiziZhuang = true; 
                //显示色子
                this.saizi_animation(data);
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
               //下注
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                // this.showSaizi({num:data.num});
                this.showAllPai();
                this.labelMax.string = data.maxXiazhu;
                this.labelSmall.string = data.minXiazhu;
                this.labelFen.string = data.minXiazhu;
                this.xiazhuSlider.progress = 0;
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
            case 5:{
                this._zhuang = data.zhuang;
                var viewid = cc.vv.roomMgr.viewChairID(data.zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                // this.showSaizi({num:data.num});

                this.showAllPai();

                this.showAllXiazhu(data);
                this.kaipaiAll(data);
                //开牌
                if(self.fapaiok){
                    self.xiazhuok();
                }
                for(var i = 0;i < data.kaipai.length;i++){
                    if(data.kaipai[i] == 1){
                        var viewid = cc.vv.roomMgr.viewChairID(i);
                        if(viewid == 0){
                            this.nodeKaipai.active = false;
                        }
                    }
                }
                this.nodeCuopai.active = false;
                // this.nodeKaipai.active = true;
            }
            break;
            case 97:{
                if(data.zhuang != null){
                    this._zhuang = data.zhuang;
                }
                var viewid = cc.vv.roomMgr.viewChairID(this._zhuang);
                this.table.seat_emit(null,"dingzhuang",{seatid:viewid});
                // for(var i=0;i<cc.vv.roomMgr.real;i++){
                //     var seat = cc.vv.roomMgr.table.list[i];
                //     var status = seat.status;
                //     var viewid = cc.vv.roomMgr.viewChairID(seat.seatid);
                //     var node = this._winPlayer.getChildByTag(viewid);
                //     if (node == null) continue;

                //     node.getComponent("Seat").ready(status == 1);
                // }
            }
            break;
        }
        this.isStage = false;
    },

    cuopai:function(data){
         
        var self=this;
        this._itemkaipai.active = true;
        self._itemkaipai.emit("cuopai",data);
    },
    
    kaipaiAll:function(data){
        //开牌的数组
        this._kaipai = data.kaipai;
        for (var index = 0; index < this._kaipai.length; index++) {
            if(this._kaipai[index] == 1){
                this._kaipai[index] = 0;
                var info = {
                    seatid:index,
                    type:data.type[index],
                    hand:data.hand[index],
                }
                this.kaipai(info);
            }
        }
    },

    //kaipai
    kaipai:function(data){
         
        var self = this;

        //已经开过牌
        if(this._kaipai[data.seatid] == 1)return;
        this._kaipai[data.seatid] = 1;

        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip("tjd_kaipai");
            this.nodeCuopai.active = false;
            this.nodeKaipai.active = false;
        }
        //{"errcode":0,"data":{"seatid":0,"type":90,"userid":3001,"hand":[7,2]},"errmsg":"ok","model":"game","event":"kaipai"}
        
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);

        this.fanpaiAnimation(viewid, data, data.seatid);
    },

    //新局初始化
    new_round:function(){
        var self=this;

        this.tip(null);

        this.nodeZhuang.active = false;
        this.nodeXiazhu.active = false;
        this.nodeReport.active = false;
        this.nodeJiesuan.active = false;
        this.nodeSezi.active = false;
        this.nodeQie.active = false;
        this.Received_xiazhuok = false;
        this.nodeCard.removeAllChildren();
        this.nodeSezi.removeAllChildren();
        this.nodeIsQiangZhuang.removeAllChildren();
        this.fapaiok = false;
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
        this.nodeCuopai.active = false;
        this.nodeKaipai.active = false;
        //清除下注分
        for(var i=0; i < 6; i++){
            this.nodeLabelscoreArr[i].active = false;
            this.nodeLabelscoreArr[i].getComponent(cc.Label).string = "";
        }
        
        this.hidePai();
        if(cc.vv.roomMgr.is_replay){
            this.nodeMingpai.getChildByName('list1').active = false;
        }

        //清除庄家
        //this.table.seat_emit(null,"dingzhuang",{seatid:null});

        //当前下注轮次
        this._currdao = 1;
        //是否开牌
        this._kaipai = [0,0,0,0,0];

        this._isfour = [0,0,0,0,0];

        //对应的行数
        this.hangNumber = [2,3,0,1];
        //对应的列数
        this.lieNumber = [8,7,6,5,4,3,2,1,0];

        this.xiazhuSlider.progress = 0;

        if(cc.vv.roomMgr.ren == 4){
            this.nodeCuopai.y = -250;
            this.nodeKaipai.y = -250;
        }else if(cc.vv.roomMgr.ren == 6){
            this.nodeCuopai.y = -320;
            this.nodeKaipai.y = -320;
        }
    },

    //循环显示下注的画面
    nextxiazhu:function(power){

        var self = this;
        if(this._currdao == 4){
            cc.vv.net2.quick('xiazhu',{dao:4, power:power});
        }else if(this._currdao == 5){
            cc.vv.net2.quick('xiazhu',{dao:5, power:power});
        }else if(this._currdao == 1){
            cc.vv.net2.quick('xiazhu',{dao:this._currdao, power:power});
        }else if(this._currdao == 2){
            cc.vv.net2.quick('xiazhu',{dao:this._currdao, power:power});
        }else if(this._currdao == 3){
            cc.vv.net2.quick('xiazhu',{dao:this._currdao, power:power});
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
        this.sprTip.spriteFrame = this.dianshuAtlas.getSpriteFrame(name);
        this.sprTip.node.active = true;
    },

    //显示已发的牌
    mingpai:function(data){
        this.nodeMingpai.getChildByName("list1").removeAllChildren();
        var nodemingpai=this.nodeMingpai.getChildByName("list1").children;
        for(var i = 0;i < data.mingpai.length;i++){
            var item= cc.instantiate(this.prefabTJDMingPai);
            item.getChildByName("MyMahJongPai").getComponent(cc.Sprite).spriteFrame=this.typeAtlas.getSpriteFrame("B"+data.mingpai[i]);
            this.nodeMingpai.getChildByName("list1").addChild(item);
        }
    },

    //切换提示
    xiazhutip:function(text){

        if(text == null){
            this.sprTipe.node.active = false;
            return;
        }
        var self = this;
        
        var name = text;
        this.sprTipe.spriteFrame = this.xiazhuAtlas.getSpriteFrame(name);
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

    //飞币
    playBetByXY:function(parent, fx, fy, tx, ty, count, callback){
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
                item.runAction(cc.sequence(taction, callback, cc.removeSelf()));
            }else{
                item.runAction(cc.sequence(taction, cc.removeSelf()));
            }
        }
        
    },

    //是否已经下注
    isXiaZhu:function(list){
        var xiazhuNumber = 0;
        for (var index = 0; index < list.length; index++) {
            if(list[index] == -2){
                xiazhuNumber++;
            }
        }
        return xiazhuNumber;
    },

    //洗牌
    dealXipai:function(pos,begin,end,callback){
        var self = this;
        
        for (var index = 0; index < 4; index++) {
            //牌的位置
            for(var k = begin; k < end; k++){
                //生成一张牌
                var node = cc.instantiate(this.PrefabMajiang);
                
                var card = node.getComponent('TJDMajiang');
                var x = pos[index].x + k * pos[index].distance;
                var y = pos[index].y;
                card.node.setPosition(x, y);
                card.node.scale = pos[index].scale;
                this.nodeAllPai.addChild(node);

                //重要，以此来区分是谁的第几张牌
                node.myTag = index + "_" + k;
                if(index == 3 && k == end - 1){
                    if(callback != null){
                        callback();
                    }
                }
            }
        }
    },

    //洗牌
    xipaiAnimation:function(callback){
        var self = this;
        //每行牌的信息
        var pos = cc.vv.game.config["xipai_pos"];
        this.dealXipai(pos, 0, 9, function(){
            var info = {
                indexY:4,
                indexX:9,
                callback:callback
            }
            self.nodeAllPai.emit("xipai", info);
        });
    },

    //不洗牌直接显示牌
    showAllPaiAnimation:function(){
        //每行牌的信息
        var pos = cc.vv.game.config["not_xipai_pos"];
        this.dealXipai(pos, 0, 9, function(){
         
        });
    },

    //播放音效
    play_tjd_mp3(setaid,type){

        var sex = cc.vv.roomMgr.table.list[setaid].sex;

        if(sex !='1' && sex!='2'){
            sex = '1';
        }
        var mp3File = "tjd/" + sex + "/type_" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },
    
    //发牌动画
    fapaiAnimation:function(){
        //2 8
        var self = this;
        var mingpaiValue = this.mingpaiValue;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            var viewid = cc.vv.roomMgr.viewChairID((index + this.dianshu) % cc.vv.roomMgr.ren);
            var valueY = parseInt((mingpaiValue / 2 +  index) / 9) * 2;
            var valueX = (mingpaiValue/ 2 +  index)  % 9;

            var valueY_two = valueY + 1;
            var valueX_two = valueX;

            var myTag = {
                viewid:viewid,
                index:0,
            }

            self.send_card_emit(self.hangNumber[valueY], self.lieNumber[valueX], "setTag", myTag);

            var tagtwo = {
                viewid:viewid,
                index:1,
            }
            self.send_card_emit(self.hangNumber[valueY_two], self.lieNumber[valueX_two], "setTag", tagtwo);


            for (var indexpai = 0; indexpai < this.paiNumber; indexpai++) {
                var callback = null;
                if(indexpai == 1){
                    callback = function(){
                        cc.vv.audioMgr.playSFX("tjd/ttz_card_send");
                    }
                }
                var info = {
                    viewid:viewid,
                    index:indexpai,
                    x:pos[viewid].pos.card.x,
                    y:pos[viewid].pos.card.y + pos[viewid].distanceH * indexpai,
                    scale:pos[viewid].pos.card.scale,
                    delayTime: (100 + index * 500) / 1000,
                    callback:callback
                }
                self.send_card_tag_emit(info.viewid, info.index, "fapai", info);
                if(viewid == 0){
                    self.fapaiok = true;
                    if(self.Received_xiazhuok){
                        self.xiazhuok();
                    }else{
                        self.nodeCuopai.active = false;
                        self.nodeKaipai.active = false;
                    }
                }
            }

            var infothree = {
                viewid:viewid,
                index:1,
                distance:pos[viewid].distance,
                distanceH:pos[viewid].distanceH,
                delayTime: (400 + index * 500) / 1000,
            }
            self.send_card_tag_emit(infothree.viewid, infothree.index, "fapaianimation", infothree);
        }
    },

    //显示牌(不要动画 铺着)
    showAllPai:function(){
        var self = this;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var mingpaiValue = this.mingpaiValue;
        this.fapaiok = true;
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            var viewid = cc.vv.roomMgr.viewChairID((index + this.dianshu) % cc.vv.roomMgr.ren);
            var valueY = parseInt((mingpaiValue / 2 +  index) / 9) * 2;
            var valueX = (mingpaiValue/ 2 +  index)  % 9;

            var valueY_two = valueY + 1;
            var valueX_two = valueX;

            var myTag = {
                viewid:viewid,
                index:0,
            }

            self.send_card_emit(self.hangNumber[valueY], self.lieNumber[valueX], "setTag", myTag);

            var tagtwo = {
                viewid:viewid,
                index:1,
            }
            self.send_card_emit(self.hangNumber[valueY_two], self.lieNumber[valueX_two], "setTag", tagtwo);

            for (var indexpai = 0; indexpai < this.paiNumber; indexpai++) {
                var info = {
                    viewid:viewid,
                    index:indexpai,
                    x:pos[viewid].pos.card.x + pos[viewid].distance * indexpai,
                    y:pos[viewid].pos.card.y,
                    scale:pos[viewid].pos.card.scale,
                }
                self.send_card_tag_emit(info.viewid, info.index, "showPai", info);
            }
        }
    },

    //翻牌动画
    fanpaiAnimation:function(viewid, data, seatid){

        var self = this;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var callback = function(viewid, index, seatid){
            if(index == self.paiNumber - 1){
                var type = 0;
                if(data.type == 0){
                    var PrefabDianshu = cc.instantiate(self.PrefabDianshu);
                    PrefabDianshu.getComponent(cc.Sprite).spriteFrame = self.bishiAtlas.getSpriteFrame("tjd_bi10");
                    PrefabDianshu.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + pos[viewid].dianshuH);
                    self.nodeCard.addChild(PrefabDianshu);
                    type = 0;
                }
                else if(data.hand[0]==data.hand[1]){
                    var PrefabDianshu = cc.instantiate(self.PrefabDianshu);
                    PrefabDianshu.getComponent(cc.Sprite).spriteFrame = self.dianshuAtlas.getSpriteFrame("tjd_dui"+data.hand[1]);
                    PrefabDianshu.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + pos[viewid].dianshuH);
                    self.nodeCard.addChild(PrefabDianshu);
                    type = data.hand[0]+10;
                }
                else {
                    var yushu=(data.hand[0]+data.hand[1])%10;
                    var PrefabDianshu = cc.instantiate(self.PrefabDianshu);
                    PrefabDianshu.getComponent(cc.Sprite).spriteFrame = self.dianshuAtlas.getSpriteFrame("tjd_dian"+yushu);
                    PrefabDianshu.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + pos[viewid].dianshuH);
                    self.nodeCard.addChild(PrefabDianshu);
                    type = yushu;
                }
                if(cc.vv.roomMgr.table.list[seatid].userid != 0){
                    self.play_tjd_mp3(viewid, type);
                }
            }
        }
        if(cc.vv.roomMgr.table.list[seatid].userid != 0){
            cc.vv.audioMgr.playSFX("tjd/shuffle");
        }
        function fanpai(){
            for (var index = 0; index < self.paiNumber; index++) {
                var info = {
                    seatid:seatid,
                    viewid:viewid,
                    index:index,
                    spriteFrame:self.typeAtlas,
                    value:data.hand[index],
                    callback:callback
                }
                self.send_card_tag_emit(viewid, index, "trun", info);
            }
        }
        setTimeout(()=>{
            fanpai();
        },300);
    },

    showfanpai:function(viewid, data){
        var self = this;
        var pos = cc.vv.game.config['player_'+cc.vv.roomMgr.ren];
        var callback = function(viewid, index){
            if(index == self.paiNumber - 1){
                if(data[0] + data[1] == 10){
                    var PrefabDianshu = cc.instantiate(self.PrefabDianshu);
                    PrefabDianshu.getComponent(cc.Sprite).spriteFrame = self.bishiAtlas.getSpriteFrame("tjd_bi10");
                    PrefabDianshu.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + pos[viewid].dianshuH);
                    self.nodeCard.addChild(PrefabDianshu);
                    self.play_tjd_mp3(viewid, 0);
                }
                else if(data[0] == data[1]){
                    var PrefabDianshu = cc.instantiate(self.PrefabDianshu);
                    PrefabDianshu.getComponent(cc.Sprite).spriteFrame = self.dianshuAtlas.getSpriteFrame("tjd_dui" + data[1]);
                    PrefabDianshu.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + pos[viewid].dianshuH);
                    self.nodeCard.addChild(PrefabDianshu);
                    self.play_tjd_mp3(viewid, data[0]+10);
                }
                else {
                    var yushu=(data[0] + data[1])%10;
                    var PrefabDianshu = cc.instantiate(self.PrefabDianshu);
                    PrefabDianshu.getComponent(cc.Sprite).spriteFrame = self.dianshuAtlas.getSpriteFrame("tjd_dian" + yushu);
                    PrefabDianshu.setPosition(pos[viewid].pos.card.x + pos[viewid].dianshuX, pos[viewid].pos.card.y + pos[viewid].dianshuH);
                    self.nodeCard.addChild(PrefabDianshu);
                    self.play_tjd_mp3(viewid, yushu);
                }
            }
        }
        for (var index = 0; index < this.paiNumber; index++) {
            var info = {
                viewid:viewid,
                index:index,
                spriteFrame:this.typeAtlas,
                value:data[index],
                callback:callback
            }
            self.send_card_tag_emit(viewid, index, "show", info);
        }
    },

    //隐藏牌
    hidePai:function(){
        //2 8
        var self = this;
        for (var index = 0; index < cc.vv.roomMgr.ren; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);

            self.send_card_tag_emit(viewid, 0, "hide");
            self.send_card_tag_emit(viewid, 1, "hide");
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
                var valueY = parseInt(i / 9) * 2;
                var valueX = i % 9;
    
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
                item.getChildByName("MyMahJongPai").getComponent(cc.Sprite).spriteFrame=this.typeAtlas.getSpriteFrame("B"+data.mingpai[i]);
                this.nodeMingpai.getChildByName("list1").addChild(item);
            }
    },

    //显示所有下注
    showAllXiazhu:function(data){
         
        var xiazhu = data.xiazhu;
        for (var value = 0; value < cc.vv.roomMgr.real; value++) {
            var bet  = xiazhu[value];
            if(value != this._zhuang){
                this._currdao = data.nextDao;
                for (var index = 0; index < bet.length; index++) {
                    this.xiazhu_stage({seatid:value,nowDao:index + 1,nextDao:index + 2,power:bet[index]});
                }
            }
        }
    },

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

    //==========================================================================
    //测试用接口
    // //配数据
    testData:function(type, data){
        var self = this;

        this.node.emit(type, data);
    },

    onButtonQieGuo:function(){
        cc.vv.roomMgr.real = 5;
        this.testData("cuopai",{"errcode":0,"data":{"seatid":1,"type":90,"userid":3099,"hand":[6,3]},"errmsg":"ok","model":"game","event":"cuopai"});
    }

});
