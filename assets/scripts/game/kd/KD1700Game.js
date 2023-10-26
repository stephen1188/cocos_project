cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        cc.vv.log3.debug("KD1700Game:onLoad");

        //播放背景音乐
        cc.vv.audioMgr.playBGM("mj_bg_01");

        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }

        cc.vv.game = this;
        //推倒胡配置
        var const_tdh = require("KD1700Const");
        cc.vv.game.config = {
             type:"3dmj",
             name:"kd1700",
             hide_nothing_seat:false,
             direct_begin:false,
             chat_path:const_tdh.chat_path,
             quick_chat:const_tdh.quick_chat,
             player_4:const_tdh.player4,
             player_3:const_tdh.player3,
             player_2:const_tdh.player2,
             card_4:const_tdh.threeD.card4,
             card_3:const_tdh.threeD.card3,
             card_2:const_tdh.threeD.card2,
             TIME_ITEM:const_tdh.TIME_ITEM,
             TIME_THREE:const_tdh.TIME_THREE,
             TIME_SAIZI:const_tdh.TIME_SAIZI,
             TIME_HOLDS:const_tdh.TIME_HOLDS,
             TIME_HIDE_SAIZI:const_tdh.TIME_HIDE_SAIZI,
             TIME_DING_ZHUANG:const_tdh.TIME_DING_ZHUANG,
             TIME_FRIST_TURE_CHANGE:const_tdh.TIME_FRIST_TURE_CHANGE,
             TIME_FRIST_ACTION:const_tdh.TIME_FRIST_ACTION,
             TIME_START:const_tdh.TIME_START,
             isTinghougang:true,//听后杠
             isLianzhuang:true,//庄分
             isBaoting:false,//是否播放报听的牌
             isGangfen:false,//杠分
             set_bg:false,
             location:true,
             isSelectSit:true, //是否选座
             show_watch_btn:false,//是否显示观战按钮
         };
    },

    start () {
        var self = this;
        cc.vv.log3.debug("KD1700Game:start");

        this.majiangTable = this.node.getComponent("majiangTable");
        //获取对象
        this.table = this.node.getComponent("Table");
        cc.vv.mahjongMgr = this.node.getComponent("KD1700Mgr");
        cc.vv.folds = this.node.getComponent("KD1700Folds");

        this._winPlayer = cc.find("Canvas/mgr/players");
        //画面初始化
        this.majiangTable.initView();

        //每局开始初始化
        this.majiangTable.new_round();

        //监听事件
        this.initEventHandlers();
        if(cc.vv.roomMgr.is_replay){
            cc.vv.mahjongMgr._magicPai = cc.vv.roomMgr.action.init.magicPai;
        }
        
        //回放
        var ReplayMgr = require("KD1700ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });
            
            //初始化数据
            cc.vv.mahjongMgr.prepareReplay(cc.vv.roomMgr.action.init, cc.vv.roomMgr.seatid);
            function callback(seatid){
                self.table.seat();
                
                //显示坐的人
                self.table.table(cc.vv.roomMgr.table);  

                //恢复分数
                var list = cc.vv.roomMgr.table.list;
                var score = cc.vv.roomMgr.action.init.score;
                for(var i = 0; i < list.length; ++i){
                    var seatid = cc.vv.roomMgr.getSeatIndexByID(score[i].user_id);
                    var viewid = cc.vv.roomMgr.viewChairID(seatid);
                    self.table.seat_emit(viewid,'score',score[i].score);

                    var node = cc.vv.utils.getChildByTag(self._winPlayer,seatid);
                    node.getComponent("Seat").ready(false);
                }

                //回放数据
                cc.vv.replayMgr.init(cc.vv.roomMgr.action.action,cc.vv.roomMgr.jiesuan);

                //开始回放
                self.majiangTable.onGameBeign();
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
        var self = this;
        //游戏同步
        this.node.on('game_saizi',function(data){
            self.dispatchEvent('game_kaiju_table');
            setTimeout(() => {
                self.dispatchEvent('game_saizi_table',data);
            }, cc.vv.game.config.TIME_SAIZI);
        });

        //宝牌
        this.node.on('game_magic',function(data){
            self.dispatchEvent('game_magic_table',data);
        });
        //动作
        this.node.on('game_action',function(data){
            self.dispatchEvent('showAction',data);
        });
        //更新手牌
        this.node.on('game_holds',function(){
            setTimeout(() => {
                self.dispatchEvent('game_holds_table');
            }, cc.vv.game.config.TIME_HOLDS);
        });

        //剩余麻将数
        this.node.on('mj_count',function(){
            var count = cc.vv.mahjongMgr._numOfMJ;
            var data = {data:{count:count}};
            self.dispatchEvent('mj_count_table',data);
        });

        //进入房间成功
        this.node.on('login_finished',function(data){
            self.dispatchEvent('game_begin_table');
        });

        //游戏开局
        this.node.on('game_begin',function(){
            self.dispatchEvent('game_begin_table');
            setTimeout(() => {
                self.dispatchEvent('game_hideSaizi_table');
            }, cc.vv.game.config.TIME_HIDE_SAIZI);
            setTimeout(() => {
                var seatid = cc.vv.mahjongMgr._zhuang;
                var data = {data:{seatid:seatid}};
                self.dispatchEvent('game_dingzhuang_table',data);
            }, cc.vv.game.config.TIME_DING_ZHUANG);
            setTimeout(() => {
                self.dispatchEvent('game_fristTurnChange_table');
            }, cc.vv.game.config.TIME_FRIST_TURE_CHANGE);
            setTimeout(() => {
                self.dispatchEvent('game_fristShowAction_table');
            }, cc.vv.game.config.TIME_FRIST_ACTION);
            setTimeout(() => {
                self.dispatchEvent('game_fristShowTingAction_table');
            }, cc.vv.game.config.TIME_FRIST_ACTION + 100);
            setTimeout(() => {
                self.dispatchEvent('game_fristShowTing1Action_table');
            }, cc.vv.game.config.TIME_FRIST_ACTION + 200);
        });

        //游戏进行中
        this.node.on('game_playing',function(data){
            self.dispatchEvent('game_playing_table',data);
        });

        //广播下一个玩家操作
        this.node.on('game_chupai',function(data){
            self.dispatchEvent('game_chupai_table',data);
        });

        //广播出牌
        this.node.on('game_chupai_notify',function(data){
            self.dispatchEvent('game_chupai_notify_table',data);
        });

        //广播摸牌
        this.node.on('game_mopai',function(data){
            self.dispatchEvent('game_mopai_table',data);
        });

        //动作
        this.node.on('game_action',function(data){
            self.dispatchEvent('game_showaction_table',data);
        });

        this.node.on('jiesuan', function(data){
            data = data.data;
            self.dispatchEvent('game_jiesuan_table',data);
        });
        
        this.node.on('report', function(data){
            data = data.data;
            self.dispatchEvent('game_report_table',data);
        });
        
        //过
        this.node.on('guo_notify',function(data){
            self.dispatchEvent('guo_notify_table',data);
        });

        //碰
        this.node.on('peng_notify',function(data){
            self.dispatchEvent('peng_notify_table',data);
        });

        //吃
        this.node.on('chi_notify',function(data){
            self.dispatchEvent('chi_notify_table',data);
        });

        //杠
        this.node.on('gang_notify',function(data){
            self.dispatchEvent('gang_notify_table',data);
        });

        //胡
        this.node.on('hupai',function(data){
            self.dispatchEvent('hupai_table',data);
        });
        
        //出牌限制
        this.node.on('chupai_limit_notify',function(data){
            self.dispatchEvent('chupai_limit_notify_table',data);
        });

        //报听
        this.node.on('bao_ting_push',function(data){
            self.dispatchEvent('bao_ting_push_table',data);
        });

        //补花
        this.node.on('buhua_notify',function(data){
            self.dispatchEvent('buhua_notify_table',data);
        });

         //弯杠
         this.node.on("hangang_notify",function(data){
            var localIndex = cc.vv.roomMgr.viewChairID(data);
            self.majiangTable.playEfx(localIndex,"play_gang");
            self.majiangTable.playSFX(data,"gang");
            self.majiangTable.hideOptions();
            self.majiangTable.hideGangPaiOpts();
            self.majiangTable.hideChipaiOpts();
        });

         //同步
         this.node.on('game_sync',function(data){
            self.dispatchEvent('game_sync_table',data);
        });

        //听牌
        this.node.on('game_action_ting',function(data){
            var data = data.data;
            self.dispatchEvent("game_action_ting_table", data);
        });

        //听牌(摸牌)
        this.node.on('game_action_ting1',function(data){
            var data = data.data;
            self.dispatchEvent("game_action_ting1_table", data);
        });

        //过
        this.node.on('guo_result',function(){
            self.dispatchEvent("guo_result_table");
        });
        //显示听牌
        this.node.on('view_ting',function(data){
            self.dispatchEvent("view_ting_table", data);
        });

        //显示过胡
        this.node.on('guohu_game',function(data){
            self.dispatchEvent("guohu_table", data);
        });

        //显示呼叫转移
        this.node.on('hujiaozhuanyi_game',function(data){
            self.dispatchEvent("hujiaozhuanyi_table", data);
        });
        //显示剩余牌 
        this.node.on('cheat',function(data){
            data = data.data;
            //去显示所有剩余的牌 
            cc.vv.popMgr.open("ShowPai",function(obj){
                self.ViewShowPai = obj;
                self.ViewShowPai.getComponent("ShowPai").show_card(data.list.pai)
            });
        });
    },  
    
    
    onBtnClick:function(event, data){
        var self = this;
        switch(event.target.name){
            case "jiesuan":{
                var data ={"errcode":0,"data":{"liupaiCnt":0,"button":0,"numofmj":104,"round":1,"chuPai":-1,"state":3,"turn":1,"zhuang":0,"seats":[{"que":0,"chis":[],"huinfo":[],"iszimo":false,"folds":[35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],"baoting":false,"wangangs":[],"guohu":false,"userid":3015,"huas":[],"piaonum":0,"huanpais":[],"diangangs":[],"m_bBaoTing_index":-1,"angangs":[],"holds":[16,3,4,5,6,7,16,17,19,25,27,32,35],"pengs":[],"hued":false},
                {"que":0,"chis":[],"huinfo":[],"iszimo":false,"folds":[35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],"baoting":false,"wangangs":[],"userid":3028,"huas":[],"piaonum":0,"huanpais":[],"diangangs":[],"m_bBaoTing_index":-1,"angangs":[],"pengs":[],"hued":false}],"magicPai":15,"saizi_2":3,"saizi_1":4},"errmsg":"ok","model":"game","event":"game_sync_push"};
                self.onButtonQieGuo("game_sync_push",data);
            }
            break;
        }
    },

    onGangChecked:function(event){
        cc.vv.audioMgr.click();
        cc.vv.net2.quick("gang",{pai:event.target.pai,wik:event.target.paiWik});
    },

    //操作
    onOptionClicked:function(event){
        cc.vv.audioMgr.click();
        var self=this;
        switch(event.target.name){
            case "btnPeng":{
                cc.vv.net2.quick("peng"); 
                cc.vv.folds.initPointer();
            }
            break;
            case "btnTing":{
                cc.vv.net2.quick("baoting"); 
                this.majiangTable.initbnaoting();//报听后初始化变量
            }
            break;
            case "btnHu":{
                cc.vv.net2.quick("hu"); 
            }
            break;
            case "btnGuo":{
                this.ops_bgclick_guo();
            }
            break;
            case "cancelbtnGuo":{
                if(this.majiangTable._baoting == 1)this.majiangTable.cencelbaoting();//取消报听
                cc.vv.net2.quick("guo"); 
            }
            break;
            case "btnGang":{
                this.majiangTable.showGang(event.target.pai,event.target.paiWik,event.target.actpai);
                cc.vv.folds.initPointer();
            }
            break;
            
            case "btnChi":{
                this.majiangTable.showChipai(event.target.pai,event.target.paiWik);
                cc.vv.folds.initPointer();
            }
            break;
            case "btnshowall":{//获取剩余的牌 
                cc.vv.net2.quick("cheat"); 
            }
            break;
        }
        cc.vv.audioMgr.playSFX(cc.vv.game.config.type + "/mj_button_01");
    },

    //点击过
    ops_bgclick_guo:function(){
        cc.vv.net2.quick("guo"); 
        this.majiangTable.hideOptions();
        if (this.majiangTable._baoting==1 && this.majiangTable._tinghuhoupai == 1){
            // cc.vv.net2.quick('chupai',{pai:this.majiangTable._guo_pai,baoting:0,index:13});
            if (this.majiangTable._baoting == 1){
                this.majiangTable.onclick_see_ting();
            }
        }  
    },

    //出牌
    shoot:function(mjId, index){
        this.majiangTable.baotingopsUi(false);
        if(mjId == null){
            return;
        }
        if (this.majiangTable._baoting == 1){
            this.majiangTable._autoOutCrad = true;
        }
        if(!cc.vv.mahjongMgr._canChui)return;
        var seatData = cc.vv.mahjongMgr._seats[cc.vv.roomMgr.seatid];
        cc.vv.mahjongMgr._canChui = false;
        cc.vv.folds.change_color_outcrad(-4)
        if(this.majiangTable._yiting==true){
            cc.vv.net2.quick('chupai',{pai:mjId,baoting:1,index:index});
            this.majiangTable._yiting=false;
            var folds_folds = seatData.folds;
            var foldslength =  folds_folds.length;
            var startIndex = cc.vv.game.getStartIndex(seatData.holds);
            seatData.holds.splice(index - startIndex,1)
            this.majiangTable.game_chupai_advance({seatData:seatData,baoTing_index:foldslength,pai:mjId,baoting:1,index:index});
        }else{
            cc.vv.net2.quick('chupai',{pai:mjId,baoting:0,index:index});
            if(!cc.vv.game.majiangTable._baotingchupai){
                var startIndex = cc.vv.game.getStartIndex(seatData.holds);
                seatData.holds.splice(index - startIndex,1)
                this.majiangTable.game_chupai_advance({seatData:seatData,baoTing_index:-1,pai:mjId,baoting:0,index:index});
            }
               
        }
           
        cc.vv.folds.initAllFolds();
        if (this.majiangTable._baoting == 1){
            this.majiangTable.onclick_see_ting();
        }
        if(!cc.vv.roomMgr.param.too_hu_must_zimo){
            this.majiangTable.hideGuohu();
        }
        this.majiangTable.hideting();
        this.majiangTable.hideOptions();
        this.majiangTable.hideChipaiOpts();
        this.majiangTable.hideGangPaiOpts();
        this.majiangTable.hideTingOpts();
        cc.find("Canvas/open/tingPaiList").active = false;
    },

    //排序
    sortHolds:function(seatData){

        var holds = seatData.holds;
        if(holds == null){
            return null;
        }
        
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length;
        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            mopai = holds.pop();
        }
                
        var magicPai = cc.vv.mahjongMgr._magicPai;
        var magicPai2 = cc.vv.mahjongMgr._magicPai2;
        cc.vv.mahjongMgr.sortMJ(holds,magicPai,magicPai2);
        
        //将摸牌添加到最后
        if(mopai != null){
            holds.push(mopai);
        }

        return holds;
    },

     //排序
     sortHoldsByPai:function(holds){
        if(holds == null){
            return null;
        }
        
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length;
        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            mopai = holds.pop();
        }
                
        var magicPai = cc.vv.mahjongMgr._magicPai;
        var magicPai2 = cc.vv.mahjongMgr._magicPai2;
        cc.vv.mahjongMgr.sortMJ(holds,magicPai,magicPai2);
        
        //将摸牌添加到最后
        if(mopai != null){
            holds.push(mopai);
        }

        return holds;
    },

    //获取麻将的位置号
    getMJIndex:function(side,index){
        // if(side == "right" || side == "up"){
        //     return 13 - index;
        // }
        return index;
    },

    getStartIndex:function(pai){
        if(pai == null){
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = pai.length;
        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            var startIndex = 14 - l;
            return startIndex;
        }else{
            var startIndex = 13 - l;
            return startIndex;
        }
    },

    getStartIndexByNum:function(pai){
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var l = pai;
        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            var startIndex = 14 - l;
            return startIndex;
        }else{
            var startIndex = 13 - l;
            return startIndex;
        }
    },

    //获取第14张牌放入的位置
    getFourteenTo:function(magicpai, magicpai2){
        var paiIndex = 13;
        //自己手牌
        var pai = cc.vv.game.sortHoldsByPai(cc.vv.mahjongMgr._oldholds);
        var selfStartIndex = cc.vv.game.getStartIndex(pai);
        var selfLength = pai.length;
        var fourteenPai = pai[13 - selfStartIndex];
        for (var index = selfStartIndex; index < selfStartIndex + selfLength; index++) {
            if(fourteenPai == magicpai){
                return selfStartIndex - 1;
            }
            if((fourteenPai == magicpai2 && fourteenPai == pai[index - selfStartIndex])|| (fourteenPai == magicpai2 && pai[index - selfStartIndex] != magicpai)){
                return index - 1;
            }
            if(pai[index - selfStartIndex] == magicpai || pai[index - selfStartIndex] == magicpai2){
                continue;
            }
            if(fourteenPai < pai[index - selfStartIndex]){
                return index - 1;
            }
        }
        return paiIndex;
    },
   
    dispatchEvent(event,data){
        if(this.node){
            this.node.emit(event,data);
        }    
    },

    //==========================================================================
    //测试用接口
    //配数据
    testData:function(dataName,data){
        var self = this;

        cc.vv.mahjongMgr.node.emit(dataName,data);
    },
    onButtonQieGuo:function(dataName,data){
        this.testData(dataName,data);
    },
});
