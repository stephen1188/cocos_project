
cc.Class({
    extends: cc.Component,

    //赢三张玩法属性
    properties: {
        pokerPrefab:cc.Prefab,
        reportItemPrefab:cc.Prefab,
        reportItemMinPrefab:cc.Prefab,
        chip_count:cc.Prefab,
        club_tip:cc.Prefab,
        user_chip:cc.Prefab,
        bipai_list_item:cc.Prefab,
        baozi_font:cc.Prefab,
        poKerminAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        pokerAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        ysz_Btn:{//赢三张 游戏按钮图集
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
        beishuFont:{
            default:null,
            type:cc.Font,
        },
        hui_beishuFont:{
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
        ysz_Game_Atlas:{//游戏图集
            default:null,
            type:cc.SpriteAtlas
        },
        _winPlayer:cc.Node,
        lookpoker:{//游戏图集
            default:null,
            type:cc.Node,
        },
        nodeCard:cc.Node,
        nodeJiesuan:cc.Node,
        nodeReport:cc.Node,
        labelScore:cc.Label,
        labelRoomwanfa:cc.Label,
        _feng:0,
        _wanfa:0,
        _zhuang:0,
        _zhuang_mode:0,
        _kanpai_list:[],//存储看过牌的玩家
        _qipai_list:[],//存储弃牌的玩家
        _chip_list:[],
        _time:0,
        _tuoguan:false,
        _thisStart:0,
        _endTime:-1,//胜点不足 自动解散房间 剩余时间变量—
        _lookcard_time:true,
        _ischonglian:false,
        _my_isin_game:false,
        _senceDestroy:false, // 当前场景是否被销毁
        _ownPokerType:10, // 自己的牌型
    },
    editor: {
        executionOrder: -1
    },

    onLoad(){
        
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            this.node.getChildByName('bgtop').width  = cc.winSize.width;
        }
        //赢三张配置
        var const_nn = require("YSZ2300Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"ysz",
            hide_nothing_seat:true,
            direct_begin:true,
            chat_path:const_nn.chat_path,
            quick_chat:const_nn.quick_chat,
            player_5:const_nn.player5,
            player_8:const_nn.player8,
            cuopai:const_nn.cuopai,
            selfPoke_5:const_nn.selfPoke5,
            selfPoke_8:const_nn.selfPoke8,
            set_bg:false,
            show_watch_btn:true,//是否显示观战按钮
        }
        this._winPlayer = cc.find("Canvas/mgr/players");
        this.node_watchgame = this.node.getChildByName("watchgame");

        //获取对象
        this.table = this.node.getComponent("Table");

        this.startAnimation = this.node.getChildByName("startAnimation");
        this.animation = this.startAnimation.getComponent(cc.Animation);
        
        //监听协议
        this.initEventHandlers();
        this.onloadinit();
    },
    onloadinit:function(){
        this.node.getChildByName("bgtop").getChildByName("bg_up_5").active = false;
        this.node.getChildByName("bgtop").getChildByName("bg_up_8").active = false;
        this.node.getChildByName("bgtop").getChildByName("bg_up_" + cc.vv.roomMgr.ren).active = true;
    },
    initzhuang:function (seatid) { // 测试待改
        if(this._senceDestroy || !cc.isValid(this._winPlayer)){
            return;
        }
        let count  = this._winPlayer.childrenCount;
        for(var i = 0;i < count;i++){
            let node =  cc.vv.utils.getChildByTag(this._winPlayer,i);
            if(node){
                node.getChildByName("zhuang").active = false;
            }
        }
        
       
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        cc.vv.utils.getChildByTag(this._winPlayer,viewid).getChildByName("zhuang").active = true;
    },
    start(){
        var self = this;
        this.cheat_click = true
        this._chip_list = [1,2,3,4,5,6,8,10,20,50,100,200,500,1000,2000];
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        cc.vv.yszMgr = this.node.getComponent("YSZ2300Mgr");
        // //回放
        var ReplayMgr = require("YSZ2300ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        //初始化
        this.new_round();

        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });

            //初始化数据
            cc.vv.yszMgr.prepareReplay();
            function callback(seatid){
                //创建座位
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
    //初始化没个人的比牌背景框
    bipaibgpos:function(){
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var bipai_bg;
        if(cc.vv.roomMgr.ren == 5){
            bipai_bg = this.node.getChildByName("mgr").getChildByName("desktop").getChildByName("bipai_bg_5");
        }else{
            bipai_bg = this.node.getChildByName("mgr").getChildByName("desktop").getChildByName("bipai_bg");
        }
        for(var i = 0;i < cc.vv.roomMgr.ren;i++){
            if(cc.vv.roomMgr.ren == 5){
                if(i == 1){
                    bipai_bg.getChildByName("bg_" + i).x = pos[i].x - 150;
                    bipai_bg.getChildByName("bg_" + i).y = pos[i].y - 11;
                }else{
                    bipai_bg.getChildByName("bg_" + i).x = pos[i].x + 150;
                    bipai_bg.getChildByName("bg_" + i).y = pos[i].y - 11;
                }
            }else{
                if(i >= 4){
                    bipai_bg.getChildByName("bg_" + i).x = pos[i].x + 110;
                    bipai_bg.getChildByName("bg_" + i).y = pos[i].y - 10;
                }else{
                    bipai_bg.getChildByName("bg_" + i).x = pos[i].x - 110;
                    bipai_bg.getChildByName("bg_" + i).y = pos[i].y - 10;
                }
            }
       
        }
    },
    //游戏选项option
    operate:function(data){
        this._endTime = -1;
        this.bipaibgpos();
        for(var i = 0;i < data.nowKanPai.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            if(viewid == 0 &&  data.nowKanPai[i] == 1){
                this.isFanPai = true;
            }
        }
        var option = this.node.getChildByName("mgr").getChildByName("option");
        var jiazhu_Node = this.node.getChildByName("mgr").getChildByName("jiazhu");
    
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var userbipai = this.node.getChildByName("mgr").getChildByName("bipai");
        userbipai.active = false;
        var bipai = option.getChildByName("bipai");
        var qipai = option.getChildByName("qipai");
        var jiazhu = option.getChildByName("jiazhu");
        var genzhu = option.getChildByName("genzhu");
        var max_beshu = 5;
        var look_card = desktop.getChildByName("look_card");
        option.active = true;
        if(data.canBi == 0){
            bipai.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_hui");
            bipai.getComponent(cc.Button).interactable = false;
            bipai.getChildByName("bp").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("not_bipai");
            bipai.getChildByName("Label").getComponent(cc.Label).font = this.hui_beishuFont;
        }else{
            bipai.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_lv");
            bipai.getComponent(cc.Button).interactable = true;
            bipai.getChildByName("bp").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("yes_bipai");
            bipai.getChildByName("Label").getComponent(cc.Label).font = this.beishuFont;
        }
        if(data.canLook == 0){
            look_card.active = false;
        }else{
            look_card.active = true;
        }if(data.canQi == 0){
            qipai.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_hui");
            qipai.getComponent(cc.Button).interactable = false;
            qipai.getChildByName("qp").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("not_qipai");
        }else{
            qipai.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_hong");
            qipai.getComponent(cc.Button).interactable = true;
            qipai.getChildByName("qp").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("yes_qipai");
        }
        if(this.desc && this.desc.fengKuang == 1){
            max_beshu = 10;
        }
        if(data.beishu >= max_beshu){
            jiazhu.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_hui");
            jiazhu.getComponent(cc.Button).interactable = false;
            jiazhu.getChildByName("jz").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("not_jiazhu");
            jiazhu.getChildByName("Label").getComponent(cc.Label).font = this.hui_beishuFont;
        }else{
            jiazhu.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_lv");
            jiazhu.getComponent(cc.Button).interactable = true;
            jiazhu.getChildByName("jz").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("yes_jiazhu");
            jiazhu.getChildByName("Label").getComponent(cc.Label).font = this.beishuFont;
        }

        if(data.jiazhuview == -1){
            jiazhu.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_hui");
            jiazhu.getComponent(cc.Button).interactable = false;
            jiazhu.getChildByName("jz").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("not_jiazhu");
            jiazhu.getChildByName("Label").getComponent(cc.Label).font = this.hui_beishuFont;
        }
        
        jiazhu.getChildByName("Label").getComponent(cc.Label).string = data.beishu;
        genzhu.getChildByName("Label").getComponent(cc.Label).font = this.beishuFont;
        this.dizhu = data.nowDiZhu;
        this.nowDiZhu = data.nowDiZhu;//当前底注

        if(this.isFanPai == true){
            genzhu.getChildByName("Label").getComponent(cc.Label).string = data.nowDiZhu * 2;
            if(data.nowDiZhu * 2 >= 1000){
              var genzhu_num = (data.nowDiZhu * 2) / 1000;
              genzhu.getChildByName("Label").getComponent(cc.Label).string = genzhu_num + "K";
            }
        }else{
            genzhu.getChildByName("Label").getComponent(cc.Label).string = data.nowDiZhu;
            if(data.nowDiZhu >= 1000){
                var genzhu_num = data.nowDiZhu / 1000;
                genzhu.getChildByName("Label").getComponent(cc.Label).string = genzhu_num + "K";
            }
        }
  
      
        jiazhu_Node.active = false;
        jiazhu_Node.getChildByName("2").getComponent(cc.Button).interactable = data.beishu >= 2 ? false : true;
        jiazhu_Node.getChildByName("3").getComponent(cc.Button).interactable = data.beishu >= 3 ? false : true;
        jiazhu_Node.getChildByName("4").getComponent(cc.Button).interactable = data.beishu >= 4 ? false : true;
        jiazhu_Node.getChildByName("5").getComponent(cc.Button).interactable = data.beishu >= 5 ? false : true;
        jiazhu_Node.getChildByName("8").getComponent(cc.Button).interactable = data.beishu >= 8 ? false : true;
        jiazhu_Node.getChildByName("10").getComponent(cc.Button).interactable = data.beishu >= 10 ? false : true;
        if(this.desc.fengKuang == 0 || this.desc == null){
            jiazhu_Node.getChildByName("8").active = false;
            jiazhu_Node.getChildByName("10").active = false;
            jiazhu_Node.getChildByName("bg").height = 120;
            jiazhu_Node.getChildByName("bg").y = 0;
        }
        // if(){

        // }
    },
    //游戏开始信息初始化
    beginFen:function(data,type){
        this.is_jiesuan = false;
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
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
            // this.new_round();
            this.nodeJiesuan.active = false;
            this.node_watchgame.active = true;
        }
        if(this.isFanPai){
            for(var i = 0;i < data.payFen.length;i++){
                var payid = cc.vv.roomMgr.viewChairID(i);
                if(payid == 0){
                    this.node.getChildByName("btn_tuoguan").getChildByName("tpschip").getComponent(cc.Label).string = data.beishu * data.nowDizhu * 2;
                }
            }
        }else{
            for(var i = 0;i < data.payFen.length;i++){
                var payid = cc.vv.roomMgr.viewChairID(i);
                if(payid == 0){
                    this.node.getChildByName("btn_tuoguan").getChildByName("tpschip").getComponent(cc.Label).string = data.beishu * data.nowDizhu;
                }
            }   
        }
        this.initzhuang(data.zhuang);
        this.is_my_bipai = false;//是否是自己主动比牌
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");

        var thisoption = cc.vv.roomMgr.viewChairID(data.nowOpera);
        var look_card = desktop.getChildByName("look_card");
        
        var chips_count = desktop.getChildByName("chip_count").getChildByName("count");
        var cur_chip = desktop.getChildByName("cur_chip");
        var bipai_list = desktop.getChildByName("bipai_list");
        bipai_list.active = false;
        var user_tips  = desktop.getChildByName("user_tips");
        var qipai_node = this.node.getChildByName("mgr").getChildByName("qipai");

        var btn_tuoguan = this.node.getChildByName("btn_tuoguan");
        if(is_watch_game == true){
            btn_tuoguan.active = false;
        }else{
            btn_tuoguan.active = true;
        }
        this.active_tuoguan();
        qipai_node.removeAllChildren();
        cur_chip.removeAllChildren();
        bipai_list.removeAllChildren();
        user_tips.removeAllChildren();
        var max_lun = desktop.getChildByName("max_lun");
        max_lun.active = true;
        this.guizhe = data.birule;//1为选中
        this.nowLun =  data.nowLun; 
        max_lun.getComponent(cc.Label).string = "当前轮数：" + data.nowLun + "/" + data.maxLun;
        chips_count.getComponent(cc.Label).string = data.nowFen;
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];

        if(type != null){
            for(i = 0;i < data.payFen.length;i++){ 
                var init_viewid = cc.vv.roomMgr.viewChairID(i);
                var _winPlayer_node = cc.vv.utils.getChildByTag(this._winPlayer,init_viewid);//刷新人物分数
                var score = _winPlayer_node.getChildByName("score").getComponent(cc.Label).string;
                _winPlayer_node.getChildByName("score").getComponent(cc.Label).string = cc.vv.utils.numFormat(score);
            }
            for(i = 0;i < data.outFen.length;i++){
                this.userStaticChipFunc(data.outFen[i]);
            }
        }else{
            //var playfen_i = 0;
            var a = -1;
            for(i = 0;i < data.payFen.length;i++){
                if(data.payFen[i] == 0){
                    continue;
                }
                a++;
                var updscore = cc.vv.roomMgr.viewChairID(i);
                var _winPlayer_node = cc.vv.utils.getChildByTag(this._winPlayer,updscore); 
                var table_list = cc.vv.roomMgr.table.list;//刷新人物分数
                _winPlayer_node.getChildByName("score").getComponent(cc.Label).string = cc.vv.utils.numFormat(table_list[i].score - data.outFen[a]);
                this.userChipFunc(data.payFen[i], updscore)
            }   
        }
        this.anLun = data.anLun;
        if(thisoption == 0 && data.nowLun > data.anLun && this.isFanPai == false){
            look_card.active = true;
        }else{
            look_card.active = false;
        }

        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                var user_chip = new cc.Node("user_chip");//显示玩家当前局数 下了多少注
                var user_chip_txt = new cc.Node("user_chip_txt");                 
                var bipai_list_item = new cc.Node("bipai_list_item");//点击比牌 按钮

                user_chip_txt.addComponent(cc.Label).string = data.payFen[i];

                user_chip.myTag = i;

                user_chip_txt.x = 12;
                user_chip_txt.getComponent(cc.Label).fontSize = 26;
                user_chip_txt.color = new cc.color(229,255,249);
                user_chip.addChild(user_chip_txt);
    
                user_chip.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("user_chip");
                cur_chip.addChild(user_chip);
            
                user_chip.x = (viewid >= 4  || viewid == 0) ? user_chip.x = pos[viewid].x - 5 : user_chip.x = pos[viewid].x + 5;
                user_chip.y = pos[viewid].y + 55;
                if(viewid == 0){
                    user_chip.y=user_chip.y + 15;
                    user_chip.x=user_chip.x + 15;
                }
            }
        }
    },
    //新选中比牌
    requestBipai:function(data){
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var mgr = this.node.getChildByName("mgr")
        var desktop = mgr.getChildByName("desktop");
        var bipai_list = desktop.getChildByName("bipai_list");
        bipai_list.active = true;
        bipai_list.removeAllChildren();
        var bipaiList = data.bipaiList;
        mgr.getChildByName("option").active = false;
        var bipai = mgr.getChildByName("bipai");
        bipai.active = true
        var show_bipai;
        var bipai_bg;
        var _tuoguan = this.node.getChildByName("btn_tuoguan");
        _tuoguan.active = false;
        var look_card = desktop.getChildByName("look_card");
        look_card.active = false;
        if(cc.vv.roomMgr.ren == 5){
            bipai_bg = desktop.getChildByName("bipai_bg_5");   
            show_bipai = desktop.getChildByName("show_bipai_5");   
        }else{
            bipai_bg = desktop.getChildByName("bipai_bg");   
            show_bipai = desktop.getChildByName("show_bipai");   
        }
        for(var i = 1;i < bipai_bg.childrenCount;i++){
            bipai_bg.getChildByName("bg_" + i).active = false;
            show_bipai.getChildByName("action_" + i).active = false;
        }
        for(var i = 1;i < bipai_bg.childrenCount;i++){
            var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
            action_animation.play();
        }
        var bipai_chis_tips = this.node.getChildByName("mgr").getChildByName("desktop").getChildByName("bipai_chis_tips");  
        bipai_chis_tips.removeAllChildren();
        bipai_bg.active = true;
        show_bipai.active = true;
        for(var i = 0;i < bipaiList.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(bipaiList[i].seatId);
            if(viewid == 0){
                continue;
            }
            //↓提示 和玩家比牌需要多少筹码
     
            var bipai_chips = new cc.Node("bipai_chips");//比牌需要的筹码
            bipai_chips.addComponent(cc.Label).string = bipaiList[i].power;
            bipai_chips.getComponent(cc.Label).font = this.winFont;
            bipai_chips.getComponent(cc.Label).fontSize = 60;

            
            bipai_chips.myTag = viewid;
            bipai_chis_tips.addChild(bipai_chips);
            bipai_chips.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
            bipai_chips.y = pos[viewid].y + 20;
            if(cc.vv.roomMgr.ren == 5){
                bipai_chips.x =  viewid != 1  ? pos[viewid].x + 150 : pos[viewid].x - 150;
            }
            //↑-----------------------
            bipai_bg.getChildByName("bg_" + viewid).active = true;
            show_bipai.getChildByName("action_" + viewid).active = true;

            var bipai_list_item = cc.instantiate(this.bipai_list_item);//创建一个可以比牌的按钮
            bipai_list.addChild(bipai_list_item);
            bipai_list_item.myTag = bipaiList[i].seatId;
            bipai_list_item.on(cc.Node.EventType.TOUCH_START,function(data){
                //发送比牌协议
                cc.vv.net2.quick("bipai",{seatId : data.currentTarget.myTag});
            });
            bipai_list_item.x = (viewid >= 4  || viewid == 0) ? bipai_list_item.x = pos[viewid].x + 110 :bipai_list_item.x = pos[viewid].x - 110;
            bipai_list_item.y = pos[viewid].y;
            if(cc.vv.roomMgr.ren == 5){
                bipai_list_item.x = (viewid != 1) ?  pos[viewid].x + 150 : pos[viewid].x - 150;
                bipai_list_item.y = pos[viewid].y - 15;
            }
        }
    },
    //筹码动画
    use_chip:function(outFen,v_from_seat){
        if(outFen == 0){
             return;
        }
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var chip_qu = desktop.getChildByName("chip_qu");
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var chips_count =desktop.getChildByName("chip_count").getChildByName("count");
        var chips_count = cc.instantiate(this.chip_count);//创建一个筹码
        chips_count.getChildByName("chip_count").getComponent(cc.Label).string = outFen;
        chips_count.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame(outFen);
        
        chip_qu.addChild(chips_count);
        chips_count.x = pos[v_from_seat].x + 239;
        chips_count.y = pos[v_from_seat].y + 39;
        var seatid =cc.vv.roomMgr.realChairID(v_from_seat);
        if(outFen == 1000){
            chips_count.getChildByName("chip_count").getComponent(cc.Label).string = "1k";
        }
        if(outFen >= 500){
            this.play_ysz_mp3(seatid,"jinzhuang",1);//第三个参数代表是在ysz 根目录不区分性别
            chips_count.getChildByName("chip_count").getComponent(cc.Label).string = "";
        }else{
            this.play_ysz_mp3(seatid,"addChips",1);//第三个参数代表是在ysz 根目录不区分性别 
        }
        chips_count.runAction(cc.sequence(
            cc.moveTo(0.15,cc.v2( Math.round(Math.random() * 500),Math.round(Math.random() * 200))),
            cc.callFunc(function () {
            },this),
        ));
    },

    //断线重连 恢复桌面上的筹码
    static_chip:function(outFen){
        if(outFen == 0){
            return;
       }
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var chip_qu = desktop.getChildByName("chip_qu");
        var chips_count =desktop.getChildByName("chip_count").getChildByName("count");
        var chips_count = cc.instantiate(this.chip_count);//创建一个筹码
        chips_count.getChildByName("chip_count").getComponent(cc.Label).string = outFen;
        chips_count.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame(outFen);
        if(outFen > 100){
            chips_count.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("100");
        }

        chip_qu.addChild(chips_count);

        chips_count.x = Math.round(Math.random() * 500);
        chips_count.y = Math.round(Math.random() * 200);
    },
    //广播动画
    guangbo_action:function(viewid,type){//type = 1 跟注 2 = 加注  3 = 比牌  4 = 弃牌
        var play_node = cc.vv.utils.getChildByTag(this._winPlayer,viewid); 
        var Recharge_node = play_node.getChildByName("Recharge");
        if(Recharge_node != null){
            Recharge_node.active = false;
            var tip_anmin = Recharge_node.getChildByName("tip").getComponent(cc.Animation);
            tip_anmin.stop();
        }

        if(cc.vv.roomMgr.is_replay){
            var _tuoguan = this.node.getChildByName("btn_tuoguan");
            _tuoguan.active = false;
        }
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var card_type = new cc.Node("card_type");// 
        var user_card_type = this.node.getChildByName("mgr").getChildByName("user_card_type");
        user_card_type.active = true;   
        var strurl = "";
        if(type == 1)
            strurl = "public_genzhu";

        else if(type == 2)
            strurl = "publlic_jiazhu";
        else if(type == 3)
            strurl = "public_bipai";
        else if(type == 4)
            strurl = "public_qipai";
        else if(type == 5)
            strurl = "public_auto_qipai";
        card_type.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame(strurl);
        card_type.myTag = viewid;
        user_card_type.addChild(card_type);
        setTimeout(() => {
            card_type.destroy();
        }, 1000);

        card_type.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
        card_type.y = pos[viewid].y + 60;

        if(cc.vv.roomMgr.ren == 5){
            card_type.x = (viewid != 1)  ? pos[viewid].x + 150 : pos[viewid].x - 150;
            card_type.y = pos[viewid].y + 80;
        }

        if(viewid == 0){
            card_type.x = card_type.x + 330;
            card_type.y = card_type.y + 15;
            if(cc.vv.roomMgr.ren == 5){
                card_type.x = card_type.x -45;
                card_type.y = card_type.y - 15;
            }
        }
    },
     //广播跟注   广播加注
    genZhu:function(data,type){//加注 type = 2
        if(this._senceDestroy || !cc.vv.roomMgr.table || !cc.vv.roomMgr.table.list){
            return;
        }
        this._lookcard_time = false;
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var cur_chip  = desktop.getChildByName("cur_chip");
        var chips_count =desktop.getChildByName("chip_count").getChildByName("count");
        var viewid_chip_count = cc.vv.utils.getChildByTag(cur_chip,data.seatId);
        var viewid = cc.vv.roomMgr.viewChairID(data.seatId);
                //var score = _winPlayer_node.getChildByName("score").getComponent(cc.Label).string
        var _winPlayer_node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        var table_list = cc.vv.roomMgr.table.list;
        _winPlayer_node.getChildByName("score").getComponent(cc.Label).string = cc.vv.utils.numFormat(table_list[data.seatId].score - data.payFen);

        if(viewid == 0){
            this.cancel_bipai();//调用 取消比牌按钮事件
            this.node.getChildByName("mgr").getChildByName("jiazhu").active = false;
            this.node.getChildByName("mgr").getChildByName("option").active = false;
        }
        var auto_genzu = this.node.getChildByName("btn_tuoguan").getChildByName("tpschip").getComponent(cc.Label);
 
        this.node.getChildByName("mgr").getChildByName("desktop").getChildByName("look_card").active = false;
        if(type == 1 ){
            if(viewid == 0){
                if(this.isFanPai){
                    auto_genzu.string = data.dizhu * data.beishu * 2;
                }else{
                    auto_genzu.string = data.dizhu * data.beishu;
                }
            }
            var rand_num = Math.round(Math.random() * 2);
            if(this.nowLun < 2){
                rand_num = 0;
            }
            this.play_ysz_mp3(data.seatId,"genzhu" + rand_num);
        }else {
            if(this.isFanPai){
                auto_genzu.string = data.dizhu * data.beishu * 2;
            }else{
                auto_genzu.string = data.dizhu * data.beishu;
            }
         
            
            var jiazhu_Node = this.node.getChildByName("mgr").getChildByName("jiazhu");
            jiazhu_Node.active = false;
            this.node.getChildByName("mgr").getChildByName("option").active = false;
            this.initzhuang(data.zhuang);
            this.play_ysz_mp3(data.seatId,"jiazhu");
        }
       
        this.guangbo_action(viewid,type);
      
        if(viewid_chip_count && viewid_chip_count.active){
            viewid_chip_count.getChildByName("user_chip_txt").getComponent(cc.Label).string = data.payFen;
        }
        

        chips_count.getComponent(cc.Label).string = data.nowFen;
        var v_from_seat = cc.vv.roomMgr.viewChairID(data.seatId);
        //每个人的座位信息
        this.userChipFunc(data.outFen, v_from_seat);
    },
    //更新当前轮数
    pushLun:function(data){
        var desktop= this.node.getChildByName("mgr").getChildByName("desktop");
        var max_lun = desktop.getChildByName("max_lun");
        max_lun.active = true;
        this.nowLun =  data.nowLun;
        this.maxLun = data.maxLun;
        max_lun.getComponent(cc.Label).string = "当前轮数："+data.nowLun+"/" + data.maxLun;
        // if(data.nowLun > data.anLun && this.isFanPai == false){
        //     desktop.getChildByName("look_card").active = true;
        // }
    },
    //广播看牌 type == 1的时候 是重连回来显示 有哪些玩家看过牌
    kanpai_1:function(data,type){
        this._lookcard_time = false;
        //每个人的座位信息 
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var user_tips  = desktop.getChildByName("user_tips");
        user_tips.active = true;
        var watch_game = this.watch_game();
        if(type != null){
            for(var i = 0;i < data.length;i++){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(data[i] == 1){
                    this._kanpai_list.push(i);
                    if(viewid == 0){
                        this.isFanPai = true;
                    } 
                }
                if(viewid == 0){
                    if(!watch_game){
                        continue;
                    }
              
                } 
                var user_look_card = new cc.Node("user_look_card");
                user_look_card.myTag = viewid;
                user_look_card.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("yikanpai");
                if(data[i] == 0){
                    user_look_card.active = false;
                }
                user_tips.addChild(user_look_card);
                user_look_card.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110: pos[viewid].x - 110;
                user_look_card.y = pos[viewid].y - 35;
                if(cc.vv.roomMgr.ren == 5){
                    user_look_card.x = (viewid != 1)  ? pos[viewid].x + 150: pos[viewid].x - 150;
                    user_look_card.y = user_look_card.y - 15;
                }
                if(viewid == 0){
                    user_look_card.x =  user_look_card.x + 290;
                    user_look_card.y = pos[viewid].y - 80;
                }
            
            }   
  
            if(watch_game){
                desktop.getChildByName("card_type").active = false;
            }else{
                desktop.getChildByName("card_type").active = this.isFanPai;
            }
     
        }else{
            var viewid = cc.vv.roomMgr.viewChairID(data.seatId);
            if(viewid != 0){
                this.play_ysz_mp3(data.seatId,"kanpai");
            }
            
            this._kanpai_list.push(data.seatId);
            if(viewid == 0){
                if(cc.vv.roomMgr.is_replay){
                    this.node.getChildByName("mgr").getChildByName("option").active = false;
                }
                if(!watch_game){
                    return;
                }
            }
            var user_look_card = new cc.Node("user_look_card");
            user_look_card.myTag = viewid;
            user_look_card.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("yikanpai");
            
            user_tips.addChild(user_look_card);
            user_look_card.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
            user_look_card.y = pos[viewid].y - 35;
            if(cc.vv.roomMgr.ren == 5){
                user_look_card.x = (viewid != 1)  ? pos[viewid].x + 150: pos[viewid].x - 150;
                user_look_card.y = user_look_card.y - 15;
            }
            if(viewid == 0){
                user_look_card.x =  user_look_card.x + 290;
                user_look_card.y = pos[viewid].y - 80;
            }
        }
    },
   

    bipaiok:function(){
        var mgr = this.node.getChildByName("mgr")
        var option = mgr.getChildByName("option");
        var bipai = mgr.getChildByName("bipai");

        var desktop = mgr.getChildByName("desktop");
        var show_bipai;
        var bipai_bg;

        if(cc.vv.roomMgr.ren == 5){
            show_bipai = desktop.getChildByName("show_bipai_5");
            bipai_bg = desktop.getChildByName("bipai_bg_5");
        }else{
            show_bipai = desktop.getChildByName("show_bipai");
            bipai_bg = desktop.getChildByName("bipai_bg");
        }
        var look_card = desktop.getChildByName("look_card");
        var bipai_list = desktop.getChildByName("bipai_list");
        desktop.getChildByName("bipai_chis_tips").removeAllChildren();
        this.is_my_bipai = true;
        bipai.active = false;
        bipai_list.active = false;
        look_card.active = false;
        option.active = false;
        show_bipai.active = false;
        bipai_bg.active = false;
        for(var i = 1;i < show_bipai.childrenCount;i++){
            var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
            action_animation.stop();
        }
    },
    //停止正在播放的动画
    stopallactions:function(){
        var playuser_count = 0;
       
        if(!cc.vv.roomMgr.table){
            return;
            
        }
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        for(var i = 0;i < playuser_count;i++){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            for(var j = 0 ; j < 3;j++){
                var card = cc.vv.utils.getChildByTag(this.nodeCard,viewid + "_" + j);
                if(card != null){
                    card.stopAllActions();
                }
            }
        }
    },
    //广播比牌，后显示输赢
    bipai:function(data){
        var self = this;
        this._lookcard_time = false;
        if(data.payFen.length==null || self._senceDestroy){
            return;
        }
        this.isfapa_in = false;
        var table_list = cc.vv.roomMgr.table.list;
        this.bipaiok();
        self.yszbipai_info = data;
        this.play_ysz_mp3(data.myseatId,"bipai");
        var tgviewid_win = cc.vv.roomMgr.viewChairID(data.winSeatId); 
        var tgviewid_lost = cc.vv.roomMgr.viewChairID(data.lostSeatId);
        var is_watch_game = this.watch_game();
        if(tgviewid_win == 0 || tgviewid_lost == 0){
            this.node.getChildByName("btn_tuoguan").active = false;
        }
        this.active_tuoguan();
        var desktop= this.node.getChildByName("mgr").getChildByName("desktop");
        var pk_action = desktop.getChildByName("pk_action");
        var user_tips  = desktop.getChildByName("user_tips");
        var bipai_user_tips  = desktop.getChildByName("bipai_user_tips");
        var pk_user  = this.node.getChildByName("mgr").getChildByName("pk_user");
        pk_user.active = true;
        pk_action.active = true;  
        bipai_user_tips.active = true;
        user_tips.active = true;

        var cur_chip = desktop.getChildByName("cur_chip");
        var is_bipai_viewid =cc.vv.roomMgr.viewChairID(data.myseatId);
        var is_notbipai_viewid =cc.vv.roomMgr.viewChairID(data.otherSeatId);

        var pk_user_1 = pk_user.getChildByName("user_1").getChildByName("mask").getChildByName("user_img");
        pk_user_1.getComponent("ImageLoader").loadImg(table_list[data.myseatId].headimg);
        var pk_user_2 = pk_user.getChildByName("user_2").getChildByName("mask").getChildByName("user_img");
        pk_user_2.getComponent("ImageLoader").loadImg(table_list[data.otherSeatId].headimg);
        var pk_username_1 = pk_user.getChildByName("user_1").getChildByName("user_name").getComponent(cc.Label);
        pk_username_1.string = table_list[data.myseatId].nickname;
        var pk_username_2 = pk_user.getChildByName("user_2").getChildByName("user_name").getComponent(cc.Label);        
        pk_username_2.string = table_list[data.otherSeatId].nickname;

        var updscore = cc.vv.roomMgr.viewChairID(data.myseatId);
        var _winPlayer_node = cc.vv.utils.getChildByTag(this._winPlayer,updscore);
        _winPlayer_node.getChildByName("score").getComponent(cc.Label).string = cc.vv.utils.numFormat(table_list[data.myseatId].score - data.payFen[data.myseatId]);
        this.userChipFunc(data.outFen, is_bipai_viewid);
        this.guangbo_action(is_bipai_viewid,3);
        for(var i = 0;i < data.payFen.length;i++){
            if(data.payFen[i] == 0){
                continue;
            }
            if(cc.vv.utils.getChildByTag(cur_chip,i) == null){
                return;
            }
            var user_chip_txt_label = cc.vv.utils.getChildByTag(cur_chip,i).getChildByName("user_chip_txt").getComponent(cc.Label);
            user_chip_txt_label.string = data.payFen[i];
        } 
        var chips_count = desktop.getChildByName("chip_count").getChildByName("count");
        chips_count.getComponent(cc.Label).string = data.nowFen;
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        //option.active = false;
        var playEfxs = pk_action.getComponent(cc.Animation);
        playEfxs.play("pkleft");
        //比牌动画---
        for(var j = 0 ; j < 2;j++){
            var viewid;
            var x;  
            if(j == 0){
                viewid = is_bipai_viewid;
                x = -300;
            }else{
                viewid = is_notbipai_viewid;
                x = 300;
            }
            for(var i = 0 ; i < 3;i++){
                var card = cc.vv.utils.getChildByTag(this.nodeCard,viewid + "_" + i);
                card.runAction(cc.sequence(
                    cc.spawn(
                        cc.moveTo(0.9,cc.v2(x,0)),
                        cc.scaleTo(0.9,1.6,1.6)
                    ),
                    cc.delayTime(1.5),
                    cc.callFunc(function () {
                        pk_action.active = false;
                        pk_user.active = false;
                    }),
                    cc.spawn(
                        cc.moveTo(0.5,cc.v2(pos[viewid].pos.card.x + i * pos[viewid].distance , pos[viewid].pos.card.y)),
                        cc.scaleTo(0.5,pos[viewid].pos.card.scale,pos[viewid].pos.card.scale)
                    ),
                    cc.callFunc(function () {
                        if(j >=1 && i >= 2){
                            var option = self.node.getChildByName("mgr").getChildByName("option");
                            var jiazhu = self.node.getChildByName("mgr").getChildByName("jiazhu");
                            jiazhu.active = false;
                            option.active = false;
                        }
                      
                        for(var j = 0 ; j < 2;j++){
                            var viewid;
                            if(j == 0){
                                viewid = cc.vv.roomMgr.viewChairID(self.yszbipai_info.myseatId);
                            }else{
                                viewid = cc.vv.roomMgr.viewChairID(self.yszbipai_info.otherSeatId);
                            }
                            self.is_moveok = false;
                            if(j >=1 && i >= 2){
                                self.is_moveok = true;
                            }
                            if(self.is_moveok){
                                self.is_moveok = false;
                                if(cc.vv.roomMgr.is_replay){
                                    self.node.getChildByName("btn_tuoguan").active = false;
                                }else{
                                    if(self.isbipaishu_viewid == 0){
                                        self.node.getChildByName("btn_tuoguan").active = false;
                                    }else if(self.isbipaiyin_viewid == 0){
                                        self.node.getChildByName("btn_tuoguan").active = true;
                                    }
                                }
                                if(is_watch_game == true){
                                    self.node.getChildByName("btn_tuoguan").active = false;
                                }
                            }
                        }

                    },)
                ));
                if(j >=1 && i >= 2){
                    setTimeout(() => {
                        if(self._senceDestroy){
                            return;
                        }
                        self.play_ysz_mp3(data.myseatId,"compareCard",1);
                        for(var i = 0;i < 2;i++){
                            var win_lostid = i == 0 ? cc.vv.roomMgr.viewChairID(data.lostSeatId) : cc.vv.roomMgr.viewChairID(data.winSeatId);
                            var bipai_win_lost = new cc.Node("bipai_win_lost");//
                            bipai_win_lost.myTag = win_lostid;
                            let imguri_str = i == 0 ? "bipai_lose" : "bipai_win"
                            bipai_win_lost.addComponent(cc.Sprite).spriteFrame = self.ysz_Game_Atlas.getSpriteFrame(imguri_str);

                            bipai_user_tips.addChild(bipai_win_lost);
                
                            bipai_win_lost.x = (win_lostid >= 4  || win_lostid == 0)  ? pos[win_lostid].x + 110 : pos[win_lostid].x - 110;
                            bipai_win_lost.y = pos[win_lostid].y - 35;
                            
                            if(cc.vv.roomMgr.ren == 5){
                                bipai_win_lost.x = (win_lostid != 1)  ? pos[win_lostid].x + 150 : pos[win_lostid].x - 150;
                                bipai_win_lost.y = pos[win_lostid].y - 50;
                            }

                            if(win_lostid == 0){
                                if(cc.vv.roomMgr.ren == 5){
                                    bipai_win_lost.x = bipai_win_lost.x + 290;
                                }else{
                                    bipai_win_lost.x = bipai_win_lost.x + 330;
                                }
                            }
                        }
                        var viewid = cc.vv.roomMgr.viewChairID(data.lostSeatId);//比牌输的人 座位id

                        if(self._kanpai_list.indexOf(data.lostSeatId) != -1){
                            for(var j = 0;j < self._kanpai_list.length;j++){
                                if(self._kanpai_list[j] == data.lostSeatId){
                                    self._kanpai_list.splice(j,1); 
                                }
                            }
                        }
                        self._qipai_list.push(data.lostSeatId);//比牌输的玩家
                        for(var i = 0 ; i < 3;i++){
                            if(viewid == 0 && self.isFanPai)break;
                            var card = cc.vv.utils.getChildByTag(self.nodeCard,viewid+"_"+i);
                            if(card && cc.isValid(card)){
                                card.getChildByName("card").getComponent(cc.Button).interactable = false;
                            }   
                            
                        }
                        if(viewid == 0){
                            desktop.getChildByName("look_card").active = false;
                            var _tuoguan = self.node.getChildByName("btn_tuoguan");
                            _tuoguan.active = false;
                        }
                        if(viewid == 0 && self.is_my_bipai == true){
                            self.is_my_bipai = false;
                        }
                    }, 6000);
                    
                    var viewid = cc.vv.roomMgr.viewChairID(data.lostSeatId);//比牌输的人 座位id
                    var q_viewid = viewid;
                    var bipailist = self._qipai_list;
                    setTimeout(() => {
                        if(self._senceDestroy){
                            return;
                        }
                        bipai_user_tips.removeAllChildren();
                        var win_lostid = cc.vv.roomMgr.viewChairID(data.lostSeatId) ;
                        if(win_lostid != 0){
                            var bipai_win_lost = new cc.Node("bipai_win_lost");//
                            bipai_win_lost.myTag = win_lostid;
                            let imguri_str = "bipai_lose"
                            bipai_win_lost.addComponent(cc.Sprite).spriteFrame = self.ysz_Game_Atlas.getSpriteFrame(imguri_str);
        
                            user_tips.addChild(bipai_win_lost);
                
                            bipai_win_lost.x = (win_lostid >= 4  || win_lostid == 0)  ? pos[win_lostid].x + 110 : pos[win_lostid].x - 110;
                            bipai_win_lost.y = pos[win_lostid].y - 35;
                            
                            if(cc.vv.roomMgr.ren == 5){
                                bipai_win_lost.x = (win_lostid != 1)  ? pos[win_lostid].x + 150 : pos[win_lostid].x - 150;
                                bipai_win_lost.y = pos[win_lostid].y -50;
                            }
        
                            if(win_lostid == 0){
                                if(cc.vv.roomMgr.ren == 5){
                                    bipai_win_lost.x = bipai_win_lost.x + 290;
                                }else{
                                    bipai_win_lost.x = bipai_win_lost.x + 330;
                                }
                            }  
                        }else{
                            self.node.getChildByName("btn_tuoguan").active = false;
                        }
                        if(q_viewid == 0){
                            setTimeout(()=>{
                                desktop.getChildByName("bipai_lost").active = true;
                            } , 300)
                        }
                        //比牌后，显示已经看牌的玩家
                        for(var i = 0;i < self._kanpai_list.length;i++){
                            var viewid = cc.vv.roomMgr.viewChairID(self._kanpai_list[i]);
                            if(viewid == 0){
                                continue;
                            } 
                            var user_look_card = new cc.Node("user_look_card");
                            user_look_card.myTag = viewid;
                            user_look_card.addComponent(cc.Sprite).spriteFrame = self.ysz_Game_Atlas.getSpriteFrame("yikanpai");
                            if(data[i] == 0){
                                user_look_card.active = false;
                            }
                            user_tips.addChild(user_look_card);
                            user_look_card.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
                            user_look_card.y = pos[viewid].y - 35;
                            if(cc.vv.roomMgr.ren == 5){
                                user_look_card.x = (viewid != 1)  ? pos[viewid].x + 150 : pos[viewid].x - 150;
                                user_look_card.y = user_look_card.y - 10;
                            }
                        }  
                    }, 2000);
                }
            }
        }
    },
    //广播弃牌
    qipai:function(data,type){
        if(this._senceDestroy){
            return;
        }
        this._endTime = -1;
        this.isfapa_in = false;
        this._lookcard_time = false;
        var mgr = this.node.getChildByName("mgr")
        var desktop = mgr.getChildByName("desktop");     
        var look_card = desktop.getChildByName("look_card")
        var qipai_node = mgr.getChildByName("qipai");
        var user_tips  = desktop.getChildByName("user_tips");

        qipai_node.active = true
       
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        if(type != null){
            for(var i = 0;i < data.length;i++){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(data[i] == 1){
                    if(viewid == 0){
                        look_card.active = false;//自己弃牌
                        var _tuoguan = this.node.getChildByName("btn_tuoguan");
                        _tuoguan.active = false;
                        if(cc.vv.popMgr.get_open("Pwb_tips")){
                            var _clubtipnode = this.node.getChildByName("open").getChildByName("Pwb_tips");
                            _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                            //this.node.getChildByName("open").getChildByName("Pwb_tips").destroy();
                        }
                    }
                    this._qipai_list.push(i);
                    for(var j = 0 ; j < 3;j++){
                        var card = cc.vv.utils.getChildByTag(this.nodeCard,viewid+"_"+j);
                        card.getChildByName("card").getComponent(cc.Button).interactable = false;
                    }
                    var tip_qipai = new cc.Node("qipai");// 
                    tip_qipai.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("tip_qipai");
                    tip_qipai.myTag = viewid;
                    qipai_node.addChild(tip_qipai);
        
                    tip_qipai.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
                    tip_qipai.y = pos[viewid].y - 35;
                    if(cc.vv.roomMgr.ren == 5){
                        tip_qipai.x = (viewid != 1)  ? pos[viewid].x + 150 : pos[viewid].x - 150;
                        tip_qipai.y = pos[viewid].y - 50;
                    }
                    if(viewid == 0){
                        if(cc.vv.roomMgr.ren == 5){
                            tip_qipai.x = tip_qipai.x + 290;
                        }else{
                            tip_qipai.x = tip_qipai.x + 330;
                        }
                        tip_qipai.y = pos[viewid].y - 75;
                    }
                }
            }
        }else{
            var viewid = cc.vv.roomMgr.viewChairID(data.seatId);
            this.play_ysz_mp3(data.seatId,"giveUp");
            if(data.timeOutQi == 1){
                this.guangbo_action(viewid,5);
            }else{
                this.guangbo_action(viewid,4);
            }
           
            if(viewid == 0){
                this.node.getChildByName("cuopai").active = false;
                var jiazhu_Node = this.node.getChildByName("mgr").getChildByName("jiazhu");
                jiazhu_Node.active = false;//加注按钮隐藏
                this.cancel_bipai();//调用 取消比牌按钮d事件
                look_card.active = false;//看牌按钮隐藏
                mgr.getChildByName("option").active = false;//游戏 选项 按钮隐藏
                var _tuoguan = this.node.getChildByName("btn_tuoguan");//管管按钮隐藏
                // var card_type = mgr.getChildByName("card_type");
                // card_type.active = false;
                _tuoguan.active = false;// 取消托管变量
                if(cc.vv.popMgr.get_open("Pwb_tips")){
                    var _clubtipnode = this.node.getChildByName("open").getChildByName("Pwb_tips");
                    _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                    this.node.getChildByName("open").getChildByName("Pwb_tips").destroy();
                    cc.vv.roomMgr._minmoney = false;
                }
            }
            this._qipai_list.push(data.seatId);
            for(var i = 0 ; i < 3;i++){
                var card = cc.vv.utils.getChildByTag(this.nodeCard,viewid+"_"+i);
                if(card){
                    card.getChildByName("card").getComponent(cc.Button).interactable = false;
                }
               
            }
            if(user_tips.childrenCount != 0 && viewid != 0){
                //user_tips.getChildByTag(viewid).active = false;
            }
            var tip_qipai = new cc.Node("qipai");// 
            tip_qipai.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("tip_qipai");
            tip_qipai.myTag = viewid;
            qipai_node.addChild(tip_qipai);

            tip_qipai.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
            tip_qipai.y = pos[viewid].y - 35;
            if(cc.vv.roomMgr.ren == 5){
                tip_qipai.x = (viewid != 1)  ? pos[viewid].x + 150 : pos[viewid].x - 150;
                tip_qipai.y = pos[viewid].y - 50;
            }
            if(viewid == 0){
                if(cc.vv.roomMgr.ren == 5){
                    tip_qipai.x = tip_qipai.x + 290;
                }else{
                    tip_qipai.x = tip_qipai.x + 330;
                }
                tip_qipai.y = pos[viewid].y - 75;
            }

        }
    },
    start_tip:function(){
        if(this.start_time == null){
            this.unschedule(this.start_tip);
            return;
        }
        if(this.start_time <= 5){
            this.interval_time = 0.2;
            this.timealarm = cc.vv.audioMgr.playSFX("timeup_alarm");
            var alarm = this.node.getChildByName("mgr").getChildByName("alarm");
            var alarmbg = this.node.getChildByName("mgr").getChildByName("alarmbg");
            alarm.color = new cc.color(255,0,0);
            alarmbg.color = new cc.color(255,0,0);
            this.unschedule(this.start_tip);
            if(this.is_jiesuan == true){
                cc.vv.audioMgr.stopSFX(this.timealarm);
            }
        }else{
            this.start_time -= 1;
        }
    },
    otherTimeCount:function(){
        this.timecount -= 1;
        var time = this.node.getChildByName("mgr").getChildByName("time");
        if(this.timecount <= 0 ){
            this.timecount = 0;
            this.unschedule(this.otherTimeCount);
        }
        time.getComponent(cc.Label).string  = this.timecount;
    },
    //操作时间
    thisStart:function(data,type,time){
        cc.vv.audioMgr.stopSFX(this.timealarm);
        this.unschedule(this.lit_false);
        this.unschedule(this.lit_true);
        this.unschedule(this.start_tip);
        this._time = 1;
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var viewid;
    
        this.timecount = 0;//呼吸灯 数字显示/

        var alarm = this.node.getChildByName("mgr").getChildByName("alarm");
        var alarmbg = this.node.getChildByName("mgr").getChildByName("alarmbg");
        var nodetime = this.node.getChildByName("mgr").getChildByName("time");
        if(type != null){
            if(data == 999){
                nodetime.action = false;
                alarmbg.action = false;
                alarm.action = false;
                return;
            }
        }
        if(type != null){
            this.start_time = time;
            this.interval_time = 0.4;
            viewid  = cc.vv.roomMgr.viewChairID(data);
            this._thisStart = data;
            this.timecount = time;
            this._time = 0;
            if(type == 2){
                this.timecount = time;
            }
        }else{
            this.start_time = data.time;
    
            this.interval_time = 0.4;
            alarm.color = new cc.color(0,255,0);
            alarmbg.color = new cc.color(0,255,0);
            viewid  = cc.vv.roomMgr.viewChairID(data.thisStart);
            this.timecount = data.time;
            if(data.time == 0){
                this.timecount = 10;
            }
            if(this.start_time == null){
                this.timecount = 10;
                this.start_time = 10;
            }
            this._thisStart = data.thisStart;
        }
        nodetime.getComponent(cc.Label).string  = this.timecount;
        if(this.desc && this.desc.tuoguan != 0){
            this.schedule(this.start_tip,1);
        }
        this.schedule(this.otherTimeUpdate,0.01);
        this.schedule(this.otherTimeCount,1);
        alarm.active = true;
        nodetime.active = true
        alarmbg.active = false;
           
        alarm.getComponent(cc.Sprite).fillRange = this._time;
       
        alarm.x = pos[viewid].x
        alarm.y = pos[viewid].y - 9;
        alarmbg.x = alarm.x;
        alarmbg.y = alarm.y;
        nodetime.x = alarm.x;
        nodetime.y =  alarm.y + 7 ;

        alarm.width = 84
        alarmbg.width = alarm.width;
        alarm.height = 103;
        alarmbg.height = alarm.height;
        if(viewid == 0){
            alarm.width = 110
            alarmbg.width = alarm.width;
            alarm.height = 133;
            alarmbg.height = alarm.height;
            alarm.y = alarm.y - 2;
            alarmbg.y = alarm.y - 2;
        }
   
    },
    lit_true:function(){
        var alarmbg = this.node.getChildByName("mgr").getChildByName("alarmbg");
        this.unschedule(this.lit_true);
        this.schedule(this.lit_false,this.interval_time); 
        alarmbg.runAction(
            cc.fadeTo(this.interval_time / 2,0)
        );
    },    
    lit_false:function(){
        var alarmbg = this.node.getChildByName("mgr").getChildByName("alarmbg");
        this.unschedule(this.lit_false);
        this.schedule(this.lit_true,this.interval_time);
        alarmbg.runAction(
            cc.fadeTo(this.interval_time / 2,255)
        );
    },
    update: function (dt) {
        this.auto_dismssroom(dt);
    },
    endTime:function(){
        this._endTime = -1;
    },
    auto_dismssroom:function(dt){
        if(this._endTime > 0){
           // var lastTime = (this._endTime - Date.now()) / 1000;
           this._endTime -= dt;
            if(this._endTime <= 0){
                this._endTime = -1;
                this._surplus_time_lbl.string = '0秒后自动弃牌';
            }
            // var m = Math.floor(lastTime / 60);
            // var s = Math.ceil(lastTime - m*60);
              var m = Math.floor(this._endTime / 60);
             var s = Math.ceil(this._endTime - m*60);
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            this._surplus_time_lbl.string = str + s + '秒后自动弃牌';
        }
    },
    //时间每秒执行
    otherTimeUpdate:function(){
        var alarm = this.node.getChildByName("mgr").getChildByName("alarm"); 
        var alarmbg = this.node.getChildByName("mgr").getChildByName("alarmbg");
        this._time -= 0.001;
        if(this._time <= 0 ){
            this._time = 0;
            alarmbg.active = true
            this.unschedule(this.otherTimeUpdate);
            this.schedule(this.lit_false,0.5); 
            alarmbg.runAction(
                    cc.fadeTo(0.3,0)
            );
        }
        alarm.getComponent(cc.Sprite).fillRange = this._time;
    },
    pwb_limit2:function(info,self){ 
        var datalist = info.data;
        var nodetime = this.node.getChildByName("mgr").getChildByName("time");
        nodetime.active = false;
        var is_true = false;
        var count = 0;
        for(var j = 0;j < datalist.users.length;j++){//循环遍历排位币不足的玩家，并显示充值中提示
            var seatid = cc.vv.roomMgr.getSeatIndexByID(datalist.users[j].userid);
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            var play_node = cc.vv.utils.getChildByTag(self._winPlayer,viewid);
            var Recharge_node = play_node.getChildByName("Recharge");
            Recharge_node.active = true;
            var tip_anmin = Recharge_node.getChildByName("tip").getComponent(cc.Animation);
            tip_anmin.play();
        }
        for(var j = 0;j < datalist.users.length;j++){//循环遍历如果不是自己 就不要弹出 排位币不足提示框，如果不是自己就自己return;
            var seatid = cc.vv.roomMgr.getSeatIndexByID(datalist.users[j].userid);
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            if(datalist.users[j].userid != cc.vv.userMgr.userid){
                count++;
            }
            if(viewid == 0){
                cc.vv.roomMgr._minmoney = true;
                is_true = true;
                
            }
        }
        if(count == datalist.users.length){
            cc.vv.roomMgr._minmoney = false;
            return;
        }else{
            cc.vv.roomMgr._minmoney = true;
        }

        for(var j = 0;j < info.data.users.length;j++){
            var seatid = cc.vv.roomMgr.getSeatIndexByID(info.data.users[j].userid);
            self.thisStart(seatid,2,info.data.time);
        }
        if(!is_true){
            return;
        }

        var self = this;
        this.cancel_bipai();
        if(this._tuoguan){
            var _tuoguan = this.node.getChildByName("btn_tuoguan");
            var bg_actioon = _tuoguan.getChildByName("bg_actioon");
            var btn_tuoguan = _tuoguan.getComponent(cc.Sprite);
            var tips = _tuoguan.getChildByName("tips").getComponent(cc.Sprite);

            btn_tuoguan.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("up");
            bg_actioon.active = false;
     
            tips.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("auto");
            var anmin = bg_actioon.getComponent(cc.Animation);
            anmin.stop();
            this._tuoguan = false;
        }
        this.node.getChildByName("mgr").getChildByName("option").active = true;
        if(cc.vv.popMgr.get_open("Pwb_tips")){
            var _clubtipnode = self.node.getChildByName("open").getChildByName("Pwb_tips");
            self._surplus_time_lbl = _clubtipnode.getChildByName("time").getComponent(cc.Label);
            _clubtipnode.getChildByName("btn_back").active = true;
            _clubtipnode.getChildByName("new_tis").active = true;
            _clubtipnode.active = true;
            this._endTime = info.data.time;
            _clubtipnode.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content").removeAllChildren();
            var btn_apply = _clubtipnode.getChildByName("btn_list").getChildByName("btn_apply");
            var btn_exit = _clubtipnode.getChildByName("btn_list").getChildByName("btn_exit");
            var btn_watch = _clubtipnode.getChildByName("btn_list").getChildByName("btn_watch");
            btn_watch.active = false;
            btn_exit.active = false; 
            for(var j = 0;j < info.data.users.length;j++){
                var tiplbl = cc.instantiate(self.club_tip);
                var tip_name = tiplbl.getChildByName("tip_name");
                var tip_pwb = tiplbl.getChildByName("tip_lbl");
                var btn_qipai = _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai");
                btn_qipai .active = true;

                btn_qipai.on(cc.Node.EventType.TOUCH_START,function(data){
                    self.qipaiSend();
                    cc.vv.popMgr.tip("发送申请成功!");
                    _clubtipnode.active = false;
                });
                tip_name.getComponent(cc.Label).string=info.data.users[j].name;
                tip_pwb.getComponent(cc.Label).string=info.data.users[j].pwb;
                _clubtipnode.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content").addChild(tiplbl);
                if(cc.vv.userMgr.userid == info.data.users[j].userid){
                    btn_apply.active = true;
                }
            }
            return;
        }   
        cc.vv.popMgr.open("Pwb_tips", function (obj,data){
            self._endTime = data.data.time;
            var _clubtipnode = self.node.getChildByName("open").getChildByName("Pwb_tips");
            self._surplus_time_lbl = _clubtipnode.getChildByName("time").getComponent(cc.Label);
            var btn_apply = _clubtipnode.getChildByName("btn_list").getChildByName("btn_apply");
            var btn_qipai = _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai");
            var btn_exit = _clubtipnode.getChildByName("btn_list").getChildByName("btn_exit");
            btn_exit.active = false; 
            _clubtipnode.getChildByName("btn_back").active = true;
            _clubtipnode.getChildByName("new_tis").active = true;
            _clubtipnode.getChildByName("btn_qipai");
            btn_qipai.active = true;
            var btn_watch = _clubtipnode.getChildByName("btn_list").getChildByName("btn_watch");
            btn_watch.active = false;
            btn_qipai.on(cc.Node.EventType.TOUCH_START,function(data){
                self.qipaiSend();
                _clubtipnode.active = false;
            });
            btn_apply.on(cc.Node.EventType.TOUCH_START,function(){
                cc.vv.net2.quick("club_invite_add_pwb",{club_id :cc.vv.roomMgr.clubid});
                btn_apply.active = false;
            });
            _clubtipnode.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content").removeAllChildren();
            for(var j = 0;j < data.data.users.length;j++){
                var tiplbl=cc.instantiate(self.club_tip);
                var tip_name=tiplbl.getChildByName("tip_name");
                var tip_pwb=tiplbl.getChildByName("tip_lbl");
                tip_name.getComponent(cc.Label).string=data.data.users[j].name;
                tip_pwb.getComponent(cc.Label).string=data.data.users[j].pwb;
                if(cc.vv.userMgr.userid == data.data.users[j].userid){
                    btn_apply.active = true;
                }
                _clubtipnode.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content").addChild(tiplbl);
            }
        },info);
    },
    jiazhurange:function(data){
        this.node.getChildByName("btn_tuoguan").getChildByName("tpschip").getComponent(cc.Label).string = data.bei;
    },
    //观战的人进入游戏 刷新table
    user_status_change:function(data){
        if(!cc.vv.roomMgr.table.list){
            return;
            
        }
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
    
    error:function(data){
        if(data.errcode == -99){
            cc.vv.popMgr.alert("" + data.errmsg,function(){
                cc.director.loadScene("hall");
            });
        }else{
            cc.vv.popMgr.tip("" + data.errmsg);
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
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var cur_chip = cc.vv.utils.getChildByTag(desktop.getChildByName("cur_chip"),data.seatid);
        if(cur_chip){
            cur_chip.destroy();
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
    room_pwb_change:function(data){
        var seatid = cc.vv.roomMgr.getSeatIndexByID(data.userid);  
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
    
        node.getChildByName("score").getComponent(cc.Label).string =cc.vv.utils.numFormat( parseFloat(data.pwb) - parseFloat(data.lock));
        cc.vv.roomMgr.table.list[seatid].score =  data.pwb;
    },
    
    buy_success:function(data){
        var nodetime = this.node.getChildByName("mgr").getChildByName("time");
        nodetime.active = true;
        this.timecount = data.time;
        nodetime.getComponent(cc.Label).string  = this.timecount;
    },
    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;
        
        this.node.on('room_pwb_change',function(data){
            if(cc.vv.roomMgr.is_replay){
                self.room_pwb_change(data.data.data.data);
            }
        });
        
        this.node.on('buy_success',function(data){
            self.buy_success(data.data);
        });
        this.node.on('canSit',function(data){
            self.canSit(data.data);
        });
        //坐入 变成观战
        this.node.on('watch',function(data){
            self.watch(data.data);
        });
        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.pauseTime = new Date().getTime();
                //离开后 停止正在播放的 动画
                self.stopallactions();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay && cc.vv.net2.isConnectd()){
                //if(cc.vv.roomMgr.started == 1){
                    cc.vv.popMgr.wait("正在恢复桌面",function(){
                        setTimeout(() => {
                            cc.vv.net2.quick("YSZonline");
                        }, 500);
                    });
               //}
            }
        });

        //观战的人进入游戏 刷新table
        this.node.on('requestBipai',function(data){
            self.requestBipai(data.data);
        }),
        
        //观战的人进入游戏 刷新table
        this.node.on('error',function(data){
            self.error(data);
        }),
        
        //观战的人进入游戏 刷新table
        this.node.on('user_status_change',function(data){
            self.user_status_change(data.data);
        }),
        
        //同步自动跟注
        this.node.on('jiazhurange',function(data){
            self.jiazhurange(data.data);
        }),
        //
        this.node.on('pwb_limit2',function(info){
            self.pwb_limit2(info,self);
        }),
        //开始
        this.node.on('begin',function(){
            
        }),
        //广播玩家操作
        this.node.on('thisStart',function(data){
            self.thisStart(data.data);
        }),
        //广播弃牌
        this.node.on('qipai',function(data){
            self.qipai(data.data);
        }),
        //收到显示牌操作
        this.node.on('cheat',function(data){
            if (self.cheat_click){
                self.cheat_click = false
                self.show_all_poker(data.data.cheatPai)
                setTimeout(() => {
                    self.cheat_click = true
                }, 1500);
            }
        }),
        //广播比牌，后显示输赢
        this.node.on('bipai',function(data){
            self.bipai(data.data);
        }),
        //广播看牌
        this.node.on('kanpai_1',function(data){
            self.kanpai_1(data.data);
        }),
        //点击看牌
        this.node.on('kanpai',function(data){
            if(cc.vv.userMgr.is_cuopai == true){
                self.cuopaiTwoPai(data.data);
            }else{
                self.fanpaiClick(data.data); 
            }
        }),
        //更新当前轮数
        this.node.on('pushLun',function(data){
            self.pushLun(data.data);
        }),
        //跟注
        this.node.on('genZhu',function(data){
            self.genZhu(data.data,1);
        }),
        //加注
        this.node.on('jiaZhu',function(data){
            self.genZhu(data.data,2);
        }),
        //游戏舒初始化
        this.node.on('beginFen',function(data){
            self.beginFen(data.data);
        }),
        //游戏选项
        this.node.on('operate',function(data){
            var info = data;
            if(self._senceDestroy){
                return;
            }
            if(data.data.waitTime == 1){
                setTimeout(() => {
                    self.operate(info.data);
                }, 3000);
            }else{
                if(self._lookcard_time){
                    setTimeout(() => {
                        self.operate(info.data);
                    }, 1000);
                }else{
                    self.operate(info.data);
                }
            }
        }),
        this.node.on('param',function(data){
            self.param(self,data.data);
        }),
        //准备
        this.node.on("ready",function(data){
            self.ready(data.data);
        }),
        //第一轮发牌
        this.node.on("fapai_1",function(data){
            self.fapai1Data = data.data;
            self.start_game();
        }),
        //广播开牌
        this.node.on("kaipai",function(data){
            if(self._senceDestroy){
                return;
            }
            self.is_jiesuan = true;
            //self.jiesuan_cardtyoe(data.data.hand);
            var info = data.data;
            var desktop= self.node.getChildByName("mgr").getChildByName("desktop");
            self.node.getChildByName("btn_tuoguan").active = false;
            desktop.getChildByName("look_card").active = false;
            var time = 3000;
            if(self.nowLun == self.maxLun){
                time = 3000;
            }
            cc.vv.audioMgr.stopSFX(self.timealarm);
            //setTimeout(() => {
            
                self.kaipai(info);
            //}, time,info);
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
        //翻牌
        this.node.on("fanpai",function(data){
            self.fanpai(data.data);
        }),
        //恢复桌面
        this.node.on('stage',function(data){
            self.stage(data.data);
        })
        //回放发牌动画
        this.node.on('replay_deal_fapai',function(data){

            self.replay_deal_fapai(0,3,data.data,function(viewid,idx){
                //另外最后一张，不要翻
                if(viewid != 0 || idx != 2)return;
                //开始抢庄
                // self.kaiqiang();
            });
        })
        
    },
    //搓牌
    cuopaiTwoPai:function(info){
        var self = this;
        var cuopai = this.node.getChildByName("cuopai");
        cuopai.active = true;
        var nodeCardone = cuopai.getChildByName("nodeCardone");
        var pos = cc.vv.game.config["cuopai"];
        var viewid = 0;
        var value = 0;
        var ok = cuopai.getChildByName("ok");
        this.info_list = info;
        ok.on(cc.Node.EventType.TOUCH_START,function(data){
            cuopai.active = false;
            self.fanpaiClick(self.info_list); 
        });
        var callbackout = function(info){
            //翻完牌后，显示开牌按钮
            self.fanpaiClick(info); 
            self.node.getChildByName("cuopai").active = false;
        }

        //横向位移
        var tox = 0;
        var toy = 0;

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
        cardtop.zIndex = 2;
        nodeCardone.addChild(cardtop);
        carditem.setPosition(0,0)
        cardtop.scale = 1;

        //初始化牌信息
        cardtop.emit("fapai",data);

        var callbackdown = function(){

        }

        var datadown= {
            viewid:viewid,
            index:3,
            atlas:self.pokerAtlas,
            value:info.hand[2],
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbackdown,
            puas:1,
        }

        //生成一张牌
        var carddown = cc.instantiate(this.pokerPrefab);
        nodeCardone.addChild(carddown);
        carddown.scale = 1;

        //初始化牌信息
        carddown.emit("fapai",datadown);

        var callbackcenter = function(){

        }
        
        var datacenter = {
            viewid:viewid,
            index:4,
            atlas:self.pokerAtlas,
            value:info.hand[1],
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbackcenter,
            puas:1,
        }
        
        //生成一张牌
        var cardcenter = cc.instantiate(this.pokerPrefab);
        var carditemcenter = cardcenter.getChildByName("card");
     
        nodeCardone.addChild(cardcenter);
        carditemcenter.setPosition(0,0)
        cardcenter.scale = 1;

        //初始化牌信息
        cardcenter.emit("fapai",datacenter);

        var callbackup = function(){

        }
        var dataup = {
            viewid:viewid,
            index:2,
            atlas:self.pokerAtlas,
            value:info.hand[0],
            x:pos[viewid].card.x,
            y:pos[viewid].card.x,
            scale:pos[viewid].card.scale,
            iscuopai:true,
            callback:callbackup,
            puas:1,
        }
        //生成一张牌
        var cardup = cc.instantiate(this.pokerPrefab);
        var carditemup = cardup.getChildByName("card");
     
        nodeCardone.addChild(cardup);
        carditemup.setPosition(0,0)
        cardup.scale = 1;

        //初始化牌信息
        cardup.emit("fapai",dataup);
       
        function upItem(){
            carditemup.on('touchmove',function(event){
                let delta = event.touch.getDelta();// cc.Vec2()
                let deltaX = delta.x / 2;
                let deltaY = delta.y / 2;
                tox += deltaX;
                toy += deltaY;
                carditemup.setPosition(carditemup.x + deltaX, carditemup.y + deltaY);
            },self);
            carditemup.on('touchend',function(event){
                var isEnd = (tox > 0 && cardup.width / 5 < tox) || (tox < 0 && cardup.width / 5 < -tox) ||(toy > 0 && cardup.height / 5 < toy) || (toy < 0 && cardup.height / 5 < -toy); 
                if(isEnd){
                    carditemup.off('touchmove');
                    carditemup.off('touchend');
                    carditemup.off('touchcancel');
                    carditemup.setPosition(0,0);
                    cardup.zIndex = -1;
                    centerItem();
                }else{
                    carditemup.setPosition(0,0);
                }
                tox = 0;
                toy = 0; 
            },self);
            carditemup.on('touchcancel',function(event){
                var isEnd = (tox > 0 && cardup.width / 5 < tox) || (tox < 0 && cardup.width / 5 < -tox) ||(toy > 0 && cardup.height / 5 < toy) || (toy < 0 && cardup.height / 5 < -toy);
                if(isEnd){
                    carditemup.off('touchmove');
                    carditemup.off('touchend');
                    carditemup.off('touchcancel');
                    carditemup.setPosition(0,0);
                    
                    cardup.zIndex = -1;
                    centerItem();
                }else{
                    carditemup.setPosition(0,0);
                }
                tox = 0;
                toy = 0;
            },self);
        }
        
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
                    //upItem();
                    callbackout(info);
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
                    //upItem();
                    callbackout(info);
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
                upItem();
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
                upItem();
            }else{
                carditem.setPosition(0,0);
            }
            tox = 0;
            toy = 0;
        },this);
    },

    //倍数判断
    beishu_judge:function(beishu){
        cc.vv.net2.quick("jiazhu",{dou:beishu});
    },
    //提示玩家比牌需要多少筹码
    need_chips_tips:function(bpviewid,i){
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var need_chips = 0;
        if(this.isFanPai){
            // for(var j = 0;j < this._kanpai_list.length;j++){
            //     if(this._kanpai_list[j] == i){
            //         need_chips = this.dizhu * 2;
            //         break;
            //     }else{
                    need_chips = this.dizhu * 4;
                // }
            // }
        }else{
            need_chips = this.dizhu * 2;
        }
        var bipai_chis_tips = this.node.getChildByName("mgr").getChildByName("desktop").getChildByName("bipai_chis_tips");  
        var bipai_chips = new cc.Node("bipai_chips");//比牌需要的筹码
        bipai_chips.addComponent(cc.Label).string = need_chips;
        bipai_chips.getComponent(cc.Label).font = this.winFont;
        bipai_chips.myTag = bpviewid;
        bipai_chis_tips.addChild(bipai_chips);
        bipai_chips.x = (bpviewid >= 4  || bpviewid == 0)  ? pos[bpviewid].x + 110 : pos[bpviewid].x - 110;
        bipai_chips.y = pos[bpviewid].y;
        if(cc.vv.roomMgr.ren == 5){
            bipai_chips.x =  bpviewid != 1  ? pos[bpviewid].x + 150 : pos[bpviewid].x - 150;
        }
    },
    //选中比牌
    select_bipai:function(){
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        var self = this;
        var mgr = this.node.getChildByName("mgr")
        mgr.getChildByName("option").active = false;
        var bipai = mgr.getChildByName("bipai");
        bipai.active = true
        var bipai_list = mgr.getChildByName("desktop").getChildByName("bipai_list");
        var desktop = mgr.getChildByName("desktop");  
        var bipai_bg;
        var show_bipai;
        if(cc.vv.roomMgr.ren == 5){
            bipai_bg = desktop.getChildByName("bipai_bg_5");   
            show_bipai = desktop.getChildByName("show_bipai_5");   
        }else{
            bipai_bg = desktop.getChildByName("bipai_bg");   
            show_bipai = desktop.getChildByName("show_bipai");   
        }
        var option = mgr.getChildByName("option");
        var look_card = desktop.getChildByName("look_card");

        look_card.active = false;
    
        show_bipai.active = true;
        bipai_bg.active = true;
        bipai_list.active = true;
        var count = 0;
        var seatid = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < bipai_list.childrenCount;i++){
            if(!(table_list[i].sitStatus == 0)){
                cc.vv.utils.getChildByTag(bipai_list,i).active = false;
            }
        }
        for(var i = 1;i < bipai_bg.childrenCount;i++){
            var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
            action_animation.play();
        }
        if(this.guizhe == 0){//如果没有勾选看牌玩家可以和一看牌玩家
            for(var i = 0;i < playuser_count;i++){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                var kaipai_node = cc.vv.utils.getChildByTag(bipai_list,i)
                for(var j = 0;j < this._qipai_list.length;j++){
                    //var qipai_di = cc.vv.roomMgr.viewChairID(this._qipai_list[j]);
                    if(this._qipai_list[j] == i){
                        kaipai_node.active = false;
                    }
                } 
                if(viewid == 0){
                    kaipai_node.active = false;
                }
            }
            for(var i = 0;i<bipai_list.childrenCount;i++){
                if(cc.vv.utils.getChildByTag(bipai_list,i).active == true){
                    count++;
                    seatid = i;
                }
            }
            if(count == 1){
                cc.vv.net2.quick("bipai",{seatId : seatid});
                self.is_my_bipai = true;
                //bipai.active = false;
                bipai_list.active = false;
                look_card.active = false;
                option.active = false;
                show_bipai.active = false;
                bipai_bg.active = false;
                for(var i = 1;i < show_bipai.childrenCount;i++){
                    var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
                    action_animation.stop();
                }  
            }else{
                for(var i = 0;i < bipai_list.childrenCount;i++){
                    var bpviewid = cc.vv.roomMgr.viewChairID(i); 
                    let tagNode = cc.vv.utils.getChildByTag(bipai_list,i);
                    bipai_bg.getChildByName("bg_" + bpviewid).active = tagNode.active;
                    show_bipai.getChildByName("action_" + bpviewid).active = tagNode.active;
                    if(tagNode.active == true){
                        this.need_chips_tips(bpviewid,i);
                    }
                }
            }
        }else if(this.guizhe == 1){
            if(this.isFanPai == true){ //如果自己看牌了 其他人都没有看牌就没有可以比牌选项
                if(this._kanpai_list.length == 0){
                    bipai.active = false;
                    show_bipai.active = false;
                    bipai_bg.active = false;
                }else{
                    for(var i = 0;i < playuser_count;i++){
                        var viewid = cc.vv.roomMgr.viewChairID(i);
                        for(var j = 0;j < this._kanpai_list.length;j++){
                            var kaipai_node = cc.vv.utils.getChildByTag(bipai_list,i);
                            if(this._kanpai_list.indexOf(i) == -1){
                                kaipai_node.active = false;
                                for(var k = 0;k < this._qipai_list.length;k++){
                                    if(this._qipai_list[k] == i){
                                        kaipai_node.active = false; 
                                    }
                                } 
                            }else{
                                kaipai_node.active = true;
                                for(var k = 0;k < this._qipai_list.length;k++){
                                    if(this._qipai_list[k] == i){
                                        kaipai_node.active = false;
                                        break;
                                    }
                                } 
                            }
                            if (viewid == 0){
                                kaipai_node.active = false;
                            }
                        }
                    }
                    for(var i = 0;i<bipai_list.childrenCount;i++){
                        if(cc.vv.utils.getChildByTag(bipai_list,i).active == true){
                            count++;
                            seatid = i;
                        }
                    }
                    if(count == 1){
                        cc.vv.net2.quick("bipai",{seatId : seatid});
                        self.is_my_bipai = true;
                        //bipai.active = false;
                        bipai_list.active = false;
                        look_card.active = false;
                        option.active = false;
                        show_bipai.active = false;
                        bipai_bg.active = false;
                        for(var i = 1;i < show_bipai.childrenCount;i++){
                            var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
                            action_animation.stop();
                        }
                    }else{
                        if(count == 0){
                            cc.vv.popMgr.tip("没有可以比牌的玩家!");
                        }
                        for(var i = 0;i<bipai_list.childrenCount;i++){
                            var bpviewid = cc.vv.roomMgr.viewChairID(i); 
                            let tagNode = cc.vv.utils.getChildByTag(bipai_list,i);
                            bipai_bg.getChildByName("bg_" + bpviewid).active = tagNode.active;
                            show_bipai.getChildByName("action_" + bpviewid).active = tagNode.active;
                            if(tagNode.active == true){
                                this.need_chips_tips(bpviewid,i);
                            }
                        }
                    }
                }
            }else{//如果自己没看牌,那么其他人都可以比。弃牌玩家除外
                for(var i = 0;i < playuser_count;i++){
                    var viewid = cc.vv.roomMgr.viewChairID(i);
                    var kaipai_node = cc.vv.utils.getChildByTag(bipai_list,i);
                    for(var k = 0;k < this._qipai_list.length;k++){
                        kaipai_node.active = true;
                        if(this._qipai_list[k] == i){
                            kaipai_node.active = false;
                            break;
                        }
                    } 
                    if(viewid == 0){
                        kaipai_node.active = false;
                    }
                }
                for(var i = 0;i<bipai_list.childrenCount;i++){
                    if(cc.vv.utils.getChildByTag(bipai_list,i).active == true){
                        count++;
                        seatid = i;
                    }
                }
                if(count == 1){
                    cc.vv.net2.quick("bipai",{seatId : seatid});
                    self.is_my_bipai = true;
                    //bipai.active = false;
                    bipai_list.active = false;
                    look_card.active = false;
                    option.active = false;
                    show_bipai.active = false;
                    bipai_bg.active = false;
                    for(var i = 1;i < show_bipai.childrenCount;i++){
                        var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
                        action_animation.stop();
                    }
                }else{
                    for(var i = 0;i<bipai_list.childrenCount;i++){
                        var bpviewid = cc.vv.roomMgr.viewChairID(i); 
                        let tagNode = cc.vv.utils.getChildByTag(bipai_list,i);
                        bipai_bg.getChildByName("bg_" + bpviewid).active = tagNode.active;
                        show_bipai.getChildByName("action_" + bpviewid).active = tagNode.active;
                        if(tagNode.active == true){
                            this.need_chips_tips(bpviewid,i);
                        }
                    }
                }
            }
        }
    },
    //取消比牌
    cancel_bipai:function(){
        var mgr =this.node.getChildByName("mgr")
        
        var bipai_bg;
        var show_bipai;
        var _tuoguan = this.node.getChildByName("btn_tuoguan");
        _tuoguan.active = true;
        if(cc.vv.roomMgr.ren == 5){
            bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg_5");   
            show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai_5");  

        }else{
            bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg");   
            show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai");  
        }
     
        if(this.nowLun > this.anLun && this.isFanPai == false){
            mgr.getChildByName("desktop").getChildByName("look_card").active = true;
        }
        var _tuoguan = this.node.getChildByName("btn_tuoguan");

        var is_watch_game = this.watch_game();
        if(is_watch_game){
            _tuoguan.active = false;
        }else{
            _tuoguan.active = true;
        }
        mgr.getChildByName("desktop").getChildByName("bipai_chis_tips").removeAllChildren();
        mgr.getChildByName("option").active = true;
        mgr.getChildByName("bipai").active = false;
        mgr.getChildByName("desktop").getChildByName("bipai_list").active = false;

        for(var i = 1;i < show_bipai.childrenCount;i++){
            var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
            action_animation.stop();
        }
        show_bipai.active = false
        bipai_bg.active = false
    },
    tuoguan:function(type){
        var _tuoguan = this.node.getChildByName("btn_tuoguan");
        var bg_actioon = _tuoguan.getChildByName("bg_actioon");
        var btn_tuoguan = _tuoguan.getComponent(cc.Sprite);
        var tips = _tuoguan.getChildByName("tips").getComponent(cc.Sprite);
        if(!this._tuoguan){
            btn_tuoguan.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("down");
            bg_actioon.active = true;
            var anmin = bg_actioon.getComponent(cc.Animation);
            anmin.play();
            var mgr = this.node.getChildByName("mgr");
            mgr.getChildByName("option").active = false;
            mgr.getChildByName("jiazhu").active = false;
            mgr.getChildByName("bipai").active = false;
            if(type == null){
                cc.vv.net2.quick("tuoguan");
            }  
            tips.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("cancelauto");
        }else{
            btn_tuoguan.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("up");
            bg_actioon.active = false;
     
            tips.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("auto");
            var anmin = bg_actioon.getComponent(cc.Animation);
            anmin.stop();
            if(type == null){
                cc.vv.net2.quick("cancleTuoguan",{auto:1});
            }
        }
        this._tuoguan = !this._tuoguan;
    },
    option_active:function(){
        return;
        var  option_mask =  this.node.getChildByName("option_make");
        option_mask.active = true;
        setTimeout(() => {
            option_mask.active = false;
        }, 500);
    },
    //按钮操作
    onBtnClicked:function(event,data){
        var self = this;    
        switch(event.target.name){
            case "btn_tuoguan"://托管
            {
                this.tuoguan();
            }
            break;
            case "look_card":{//自己看牌
                self.node.getChildByName("mgr").getChildByName("desktop").getChildByName("bipai_chis_tips").removeAllChildren();
                var bipai_bg;
                var show_bipai;
                var mgr = self.node.getChildByName("mgr");
                if(cc.vv.roomMgr.ren == 5){
                    bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg_5");   
                    show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai_5");  
                }else{
                    bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg");   
                    show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai");  
                }
                show_bipai.active = false
                bipai_bg.active = false
                cc.vv.net2.quick("kanpai");
                this.option_active();
            }
            break;
            case "2":
            case "3":
            case "4":   
            case "5":
            case "8":
            case "10":{
                this.beishu_judge(event.target.name);//倍数判断
            }
            break;
            case "bipai_cancel":{//取消比牌
                this.cancel_bipai();
                this.option_active();
            }
            break;  
            case "cancel":{//取消
                this.node.getChildByName("mgr").getChildByName("option").active = true;
                this.node.getChildByName("mgr").getChildByName("jiazhu").active = false;
                this.option_active();
            }
            break;
            case "qipai":{//弃牌
                if(self._ownPokerType && self._ownPokerType<60){
                    this.node.getChildByName("mgr").getChildByName("option").active = false;
                }
                this.qipaiSend();
                this.option_active();
            }
            break;
            case "bipai":{//选中比牌
                cc.vv.net2.quick("requestBipai");
                this.option_active();
            }
            break;
            case "showpoker":{//看牌
                cc.vv.net2.quick("cheat",{});
            }
            break;
            case "jiazhu":{//选中加注
                //this.node.getChildByName("mgr").getChildByName("option").active = false;
                this.node.getChildByName("mgr").getChildByName("jiazhu").active = true;
                this.option_active();
            }
            break;
            case "genzhu":{
                cc.vv.net2.quick("genzhu");
                this.option_active();
            }
            break;
        }
        cc.vv.audioMgr.click();
    },
    // 弃牌请求
    qipaiSend(){
        let self = this;
        if(self._ownPokerType && self._ownPokerType>=60){
            let typeTxt = {
                60:"顺子",
                70:"同花",
                80:"同花顺",
                90:"豹子"
            }
            cc.vv.popMgr.alert(`您的手牌是${typeTxt[self._ownPokerType]},是否确认弃牌`,function(){
                cc.vv.net2.quick("sqipai",{
                    type:0,
                    currLun: self.nowLun,
                    currNum: cc.vv.roomMgr.now,
                    version:cc.VERSION
                });
            },true)
        }else{
            cc.vv.net2.quick("qipai",{
                type:0,
                currLun: self.nowLun,
                currNum: cc.vv.roomMgr.now
            })
        };
    },
    //新一局，重置桌面
    new_round(){
        var listnode =  this.nodeJiesuan.getChildByName("list");
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var option = this.node.getChildByName("mgr").getChildByName("option");
        var cardtype = this.node.getChildByName("mgr").getChildByName("cardtype");
        var user_card_type = this.node.getChildByName("mgr").getChildByName("user_card_type");
        var qipai_node = this.node.getChildByName("mgr").getChildByName("qipai");
        var jiazhu = this.node.getChildByName("mgr").getChildByName("jiazhu");
        var bipai_user_tips  = desktop.getChildByName("bipai_user_tips");
        var look_card = desktop.getChildByName("look_card");
        var card_type = desktop.getChildByName("card_type");
        var chip_qu = desktop.getChildByName("chip_qu");
        var user_tips  = desktop.getChildByName("user_tips");
        var nodeCardone = this.node.getChildByName("cuopai").getChildByName("nodeCardone");
        this.unschedule(this.add_baozi_font2);
        var baozi_font_list = this.node.getChildByName("baozi_font_list");
        this.win_score = 0;
        this._ownPokerType = 10;
        baozi_font_list.getChildByName("sum_score").active = false;
        this.node.getChildByName("cuopai").active = false;
        jiazhu.active = false;
        option.active = false;
        this.is_baozi = false;
        this.node_watchgame.active = false;
        desktop.getChildByName("bipai_lost").active = false;
        nodeCardone.removeAllChildren();
        bipai_user_tips.removeAllChildren();
        user_tips.removeAllChildren();
        qipai_node.removeAllChildren();
        user_card_type.removeAllChildren();
        cardtype.removeAllChildren();
        chip_qu.removeAllChildren();
        this.nodeCard.removeAllChildren();//玩家手牌清空
        var alarm = this.node.getChildByName("mgr").getChildByName("alarm");
        var alarmbg = this.node.getChildByName("mgr").getChildByName("alarmbg");
        // for(var i = 0;i < cc.vv.roomMgr.ren;i++)
        // {   
        //     listnode.getChildByName("item"+i).getChildByName("cardtype").active = false;
        // }
        this._ischonglian = false;
        this._lookcard_time = true;
        alarm.active = false;
        alarmbg.active = false;
        this.nodeReport.active = false;//大结算隐藏
        this.nodeJiesuan.active = false;//小结算隐藏
        if(this._tuoguan == true){
            var bg_actioon = this.node.getChildByName("btn_tuoguan").getChildByName("bg_actioon");
            var btn_tuoguan = this.node.getChildByName("btn_tuoguan").getComponent(cc.Sprite);
            btn_tuoguan.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("up");
            bg_actioon.active = false;
            var anmin = bg_actioon.getComponent(cc.Animation);
            anmin.stop();
            var _tuoguan = this.node.getChildByName("btn_tuoguan");
            var tips = _tuoguan.getChildByName("tips").getComponent(cc.Sprite);
            tips.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("auto");
            //cc.vv.net2.quick("cancleTuoguan",{auto:1});
            this._tuoguan = false;     

            var _tuoguan = this.node.getChildByName("btn_tuoguan");
            var tips = _tuoguan.getChildByName("tips").getComponent(cc.Sprite);
            tips.spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("auto");
            //cc.vv.net2.quick("cancleTuoguan",{auto:1});
            this._tuoguan = false;
        }

        var pk_action = desktop.getChildByName("pk_action");
        var pk_user  = this.node.getChildByName("mgr").getChildByName("pk_user");

        pk_user.active = false;
        pk_action.active = false;  
        var playEfxs = pk_action.getComponent(cc.Animation);
        playEfxs.stop();
 
        this._kanpai_list=[];
        this._qipai_list=[]; 
        card_type.getChildByName("card_type").getComponent(cc.Sprite).spriteFrame = null;
        card_type.active = false;
        look_card.active = false;
    
        //是否已经收缩
        this.isShousuo = false;
        //是否已翻牌
        this.isFanPai = false;
        //隐藏庄家图标
        this.table.seat_emit(null,"dingzhuang",{seatid:null});
        //置空
        cc.vv.roomMgr.stage = null;
        //是否开牌
        this._kaipai = [0,0,0];
    },
    //开始游戏
    start_game:function(){
        //播放开始游戏音效
        if(this.node){
            var data = this.fapai1Data;
            this.fapai_1(data);
            this.nodeJiesuan.active = false;
        }
    },
    //获取到游戏参数
    param:function(obj,data){
        //1:扣1 2:扣人 3:全扣
        let self = this;
        this._wanfa = data.desc;
        this.desc = data;
        this.poker_show = data.canCheat
        if (this.lookpoker&&!cc.vv.roomMgr.is_replay){
            if(this.lookpoker.node){
                if (this.poker_show){
                    this.lookpoker.active = true
                }else{
                    this.lookpoker.active = false
                }
            }else{
                setTimeout(() => {
                    if(self._senceDestroy){
                        return;
                    }
                    if (self.poker_show){
                        self.lookpoker.active = true
                    }else{
                        self.lookpoker.active = false
                    }
                }, 1000);
            }
        }

    },
    //准备
    ready:function(data){
        if(data.seatid == cc.vv.roomMgr.seatid){
            this.tip("zhunbei");
            this.new_round();
        }
    },
    //发牌
    fapai_1:function(data){
        
        //刷新标题
        var self = this;
        // cc.vv.roomMgr.now = data.round;
        this.table._winHub.emit("round");

        //让座位到开局状态
        this.table.seat_emit(null,"round");
        if(!cc.vv.roomMgr.is_replay){
            var is_watch_game = this.watch_game();
            if(is_watch_game == true){
                this.node.getChildByName("btn_tuoguan").active = false;
            }else{
                this.node.getChildByName("btn_tuoguan").active = true;
            }
           
        }
        //发牌
        this.deal_fapai(0,3,data,function(viewid,idx){
            //另外最后一张，不要翻
            if(viewid != 0 || idx != 2)return;
            //开始抢庄
            // self.kaiqiang();

        });
    },
    //显示玩家的牌型
    showcard_type:function(data) {
        if (data == null) return;
        this._ownPokerType = parseInt(data);
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var look_card = desktop.getChildByName("look_card");
        var card_type = desktop.getChildByName("card_type");
        card_type.active = true;
        card_type.getChildByName("card_type").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("cardtype_" + data);
        look_card.active = false;
    },
    add_baozi_font:function(){
        this.schedule(this.add_baozi_font2,0.01);
    },
    add_baozi_font2:function(){
        var self = this;
        var font = cc.instantiate(this.baozi_font);
        var win_score =  parseInt(this.win_score);
        win_score = win_score + "";
        font.y = 450;
        var baozi_font_list = this.node.getChildByName("baozi_font_list");
        baozi_font_list.addChild(font);
        var random_min = 1;
        var random_max = 999999;
        var num = "";
        for(var i = 0;i < win_score.length;i++){
            num = num + "9";
        }
        random_max = parseInt(num);
        var score = Math.floor(Math.random()*(random_min - random_max) + random_max);
        var random_score = score; 
        
        font.getComponent(cc.Label).string = random_score;
        var sum_score = baozi_font_list.getChildByName("sum_score");
        sum_score.active = true;
        // if(score < 10){
        //     random_score = "+000000" + score;
        // }else if(score < 100){
        //     random_score = "+00000" + score;
        // }else if(score < 1000){
        //     random_score = "+0000" + score;
        // }else if(score < 10000){
        //     random_score = "+000" + score;
        // }else if(score < 100000){
        //     random_score = "+00" + score;
        // }else if(score < 1000000){
        //     random_score = "+0" + score;
        // }else if(score < 10000000){
        //     random_score = "+" + score;
        // }
        sum_score.getComponent(cc.Label).string = "+" + random_score;
        sum_score.scale = 1;
        // 
        font.runAction(cc.sequence(
            cc.moveTo(0.05,cc.v2(0,-200)),
            cc.callFunc(function () {
                font.destroy();
            },self),
        ));
    },
    //广播开牌
    kaipai:function(data){
        var self = this;
        this.tip("kaipai");
        for(var i = 0;i < data.hand.length;i++){
            if(data.hand[i].type == 90){
                if(data.win[0] == i){
                    var viewid = cc.vv.roomMgr.viewChairID(i);
                    if(viewid == 0){
                        this.is_baozi = true;
                    }
                    
                    var baozi_action = this.node.getChildByName("mgr").getChildByName("baozi");
                    baozi_action.active = true;
                    var action = baozi_action.getComponent(sp.Skeleton);
                    action.animation = "animation";
                    action.setCompleteListener(function(){
                        baozi_action.active = false;
                    }); 
                    this.play_ysz_mp3(i,"huanhu",1);//第三个参数代表是在ysz 根目录不区分性别
                    break;
                }
            }
        }
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var cardtype = this.node.getChildByName("mgr").getChildByName("cardtype");
        cardtype.active = true;
        cardtype.removeAllChildren();
        for(var i = 0;i < data.hand.length;i++){
            if(data.hand[i].type != null){
                var viewid = cc.vv.roomMgr.viewChairID(data.hand[i].seatId);
                var card_type = new cc.Node("card_type");//
                if(cc.vv.roomMgr.param && cc.vv.roomMgr.param.sCompareT == 1){
                    if(data.hand[i].type == 70){
                        card_type.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("kaipai_type_60");
                    }else if(data.hand[i].type == 60){
                        card_type.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("kaipai_type_70");
                    }else{
                        card_type.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("kaipai_type_" + data.hand[i].type);
                    }
                }else{
                    card_type.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("kaipai_type_" + data.hand[i].type);
                }
                card_type.myTag = viewid;
                cardtype.addChild(card_type);
                card_type.x = (viewid >= 4  || viewid == 0)  ? pos[viewid].x + 110 : pos[viewid].x - 110;
                card_type.y = pos[viewid].y + 72;
                if(cc.vv.roomMgr.ren == 5){
                    card_type.x = (viewid != 1)  ? pos[viewid].x + 150 : pos[viewid].x - 150;
                }
                if(viewid == 0){
                    card_type.y = card_type.y + 30;
                    if(cc.vv.roomMgr.ren == 5){
                        card_type.x = card_type.x + 420;
                    }else{
                        card_type.x = card_type.x + 460;
                    }
                }
            }else{
                continue;
            }
        }
        for (var j = 0; j < data.hand.length; ++j) {
            var viewid = cc.vv.roomMgr.viewChairID(data.hand[j].seatId);
        
            //显示角标
            this.show_jiaobiao(viewid);
            //如果时自己
            if(viewid == 0){
                // //翻转自身牌
                for (var i = 0; i < 3; ++i) {
                    var info = {
                        obj:self,
                        viewid:viewid,
                        index:i,
                        value:data.hand[j].pais[i],
                        type:data.type,
                        atlas:self.pokerAtlas,
                        rate:data.rate}

                    self.send_card_emit(viewid,i,"trun",info);
                }
                var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
                for (var i = 0; i < 3; ++i) {
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
                    }
                    self.send_card_emit(viewid,i,"shousuo",info);
                }
                //是否已经收缩
                this.isShousuo = true;
            }else{
                // //翻转自身牌
                for (var i = 0; i < 3; ++i) {
                    var info = {
                        obj:self,
                        viewid:viewid,
                        index:i,
                        value:data.hand[j].pais[i],
                        type:data.type,
                        atlas:self.pokerAtlas,
                        rate:data.rate,
                        pai:data.pai,
                    }

                    self.send_card_emit(viewid,i,"trun",info);
                }
            }
        }
       
    },
    //全场开牌 
    show_all_poker:function(data){
        var self = this
        if(data){}else{return}
        for (var j = 0; j < data.length; ++j) {
            var viewid = cc.vv.roomMgr.viewChairID(j);
            //显示角标
            this.show_jiaobiao(viewid);
            //如果时自己
            if(viewid == 0){
                // //翻转自身牌
                for (var i = 0; i < 3; ++i) {
                    var info = {
                        obj:self,
                        viewid:viewid,
                        index:i,
                        value:data[j][i],
                        atlas:self.pokerAtlas}

                    self.send_card_emit(viewid,i,"trun",info);
                }
            }else{
                for (var i = 0; i < 3; ++i) {
                    var info = {
                        obj:self,
                        viewid:viewid,
                        index:i,
                        value:data[j][i],
                        type:data.type,
                        atlas:self.pokerAtlas,
                    }
                    self.send_card_emit(viewid,i,"trun",info);
                }
            }
        }
    },
    //单独比牌的时候调用 开牌
    solo_kaipai:function(data){
        var self = this;
        //已经开过牌
        // if(this._kaipai[data.seatid] == 1)return;
        // this._kaipai[data.seatid] = 1;
        //音效
        //this.play_ysz_mp3(data.seatid,data.type);
        for (var j = 0; j < data.hand.length; ++j) {
            var viewid = cc.vv.roomMgr.viewChairID(data.hand[j].seatId);
            //显示角标
            this.show_jiaobiao(viewid);
            //如果时自己
            if(viewid == 0){
                // //翻转自身牌
                for (var i = 0; i < 3; ++i) {
                    var info = {
                        obj:self,
                        viewid:viewid,
                        index:i,
                        value:data.hand[j],
                        type:data.type,
                        atlas:self.pokerAtlas,
                        rate:data.rate}
                    self.send_card_emit(viewid,i,"trun",info);
                }
                var card_pos = cc.vv.game.config["selfPoke_" + cc.vv.roomMgr.ren];
                for (var i = 0; i < 3; ++i) {
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
                    }
                    self.send_card_emit(viewid,i,"shousuo",info);
                }
                //是否已经收缩
                this.isShousuo = true;
            }else{
                // //翻转自身牌
                for (var i = 0; i < 3; ++i) {
                    var info = {
                        obj:self,
                        viewid:viewid,
                        index:i,
                        value:data.hand[j],
                        type:data.type,
                        atlas:self.pokerAtlas,
                        rate:data.rate,
                        pai:data.pai,
                    }
                    self.send_card_emit(viewid,i,"trun",info);
                }
            }
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
            var seatid = cc.vv.roomMgr.getSeatIndexByID(table_list[i].userid);
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
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

    //判断自己是否在观战中
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
    auto_ready:function(){
        this.autoready--;
        this.nodeJiesuan.getChildByName("btn_ready").getChildByName("lbl").getComponent(cc.Label).string = this.autoready;
        if(this.autoready <= 0){
            this.autoready = 0;
            this.unschedule(this.auto_ready);
        }
    },
    //豹子的最终奖励
    baozi_jianlgi:function(score){
        let self = this;
        score = parseInt(score);
        this.unschedule(this.add_baozi_font2);
        var baozi_font_list = this.node.getChildByName("baozi_font_list");
        var sum_score = baozi_font_list.getChildByName("sum_score");
        sum_score.active = true;
        var random_score;
        // if(score < 10){
        //     random_score = "+000000" + score;
        // }else if(score < 100){
        //     random_score = "+00000" + score;
        // }else if(score < 1000){
        //     random_score = "+0000" + score;
        // }else if(score < 10000){
        //     random_score = "+000" + score;
        // }else if(score < 100000){
        //     random_score = "+00" + score;
        // }else if(score < 1000000){
        //     random_score = "+0" + score;
        // }else if(score < 10000000){
        //     random_score = "+" + score;
        // }
        sum_score.getComponent(cc.Label).string = "+" + score;
        sum_score.runAction(cc.sequence(
            cc.scaleTo(0.5,1.2,1.2),
            cc.callFunc(function () {
            },self),
        ));
        setTimeout(() => {
            sum_score.active = false;
        }, 1500,);
    },
    //结算_小结算
    jiesuan:function(data){
         
        var info = data;
        this.autoready = 10;
        var is_watch_game = this.watch_game();
        this.schedule(this.auto_ready,1);
        this.unschedule(this.lit_false);
        this.unschedule(this.lit_true);
        this.unschedule(this.start_tip);
        var self = this;
  
        //var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var mgr = this.node.getChildByName("mgr");
        var desktop= mgr.getChildByName("desktop"); 
        mgr.getChildByName("alarmbg").active = false;
        mgr.getChildByName("alarm").active = false;
        mgr.getChildByName("time").active = false;
        desktop.getChildByName("card_type").active = false;
        desktop.getChildByName("look_card").active = false;
        desktop.getChildByName("user_tips").active = false;
        var jiesuan_count = 0;
        this.node.getChildByName("btn_tuoguan").active = false;

        
        if(cc.vv.roomMgr && cc.vv.roomMgr.param.sCompareT == 1){
            if(data.list[data.win[0]].type == 70){
                this.play_ysz_mp3(data.win[0],"cardtype_60");
            }else if(data.list[data.win[0]].type == 60){
                this.play_ysz_mp3(data.win[0],"cardtype_70");
            }else{
                this.play_ysz_mp3(data.win[0],"cardtype_" + data.list[data.win[0]].type);
            }
        }else{
            this.play_ysz_mp3(data.win[0],"cardtype_" + data.list[data.win[0]].type);
        }
        for(var i = 0 ;i < data.list.length;i++){
            if(data.list[i].userid != 0){
                jiesuan_count++;
            }
        }
        var play_game_user =  jiesuan_count;
        jiesuan_count = cc.vv.roomMgr.ren;

        if(this.is_baozi){
            //所有人结算
            for(var i=0;i < jiesuan_count;++i){
                if(data.list[i].userid == 0) continue;
                if(data.list[i].round_score > 0){
                    this.win_score = data.list[i].round_score;
                    this.schedule(this.add_baozi_font2,0.1);
                    break;
                }
            }
        }
        //所有人结算
        for(var i=0;i < jiesuan_count;++i){
            // if(data.list[i].userSitStatus == 3 || data.list[i].userid == 0){
            //     continue;
            // }
            if(!data.list[i].userid){
                continue;
            }
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(data.list[i].userSitStatus == 0){
                self.table.seat_emit(viewid,"score",data.list[i].user_score);
                cc.vv.roomMgr.table.list[i].score = data.list[i].user_score;
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

        var for_list = [];
        var q_id = -1;
        var q_viewid = 0;
        var _i = 0 ;
        var is_true = true;
        //所有人结算
        this.relation = data.relation[0];
        for(var i = 0;i < jiesuan_count;++i){
            // if(data.list[i].userSitStatus == 3 || data.list[i].userid == 0){
            //     continue;
            // }
            if(!data.list[i].userid){
                continue;
            }
            _i++;
            q_id++;
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid == 0){
                this.relation = data.relation[i];
            }
            if(viewid != 0 && is_true){
                for_list.push(q_id);
            }else{
                is_true = false;
                var name = data.list[i].nickname;
                var headimg = this.table.seat_img(viewid);
                var item = list.getChildByName("item" + q_viewid);
                q_viewid++;
                item.active = true;
                item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
                item.getChildByName("name").getComponent(cc.Label).string = name;
                var cardtype = item.getChildByName("cardtype");
                if(this.relation[i] == 0){
                    cardtype.active = false;
                }else{
                    cardtype.active = true;
                }

                if(cc.vv.roomMgr.is_replay){
                    cardtype.active = true;
                }
                
                for(var j = 0;j < 3;j++){
                    cardtype.getChildByName("card_"+ (j + 1)).getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getYSZPokerSpriteFrame(this.poKerminAtlas,data.list[i].hand[j]);
                }
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
 
            if(_i == play_game_user){
                var new_jiesuan_list = [];
                var new_list_idex = 0;
                for(var i = 0;i<data.list.length;i++){
                    if(data.list[i].userid != 0){
                        new_jiesuan_list[new_list_idex++] = data.list[i];
                    }
                }
                var fz_list = data.list;
                data.list = new_jiesuan_list;
                for(var j = 0 ;j <  for_list.length ;++j){

                    var viewjd = cc.vv.roomMgr.viewChairID(data.list[j].seatid);
                    var name = data.list[j].nickname;
                    var headimg = this.table.seat_img(viewjd);
        
                    var item = list.getChildByName("item" + q_viewid);
                    q_viewid++;
                    item.active = true;
                    item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = headimg;
                    item.getChildByName("name").getComponent(cc.Label).string = name;
                    var cardtype = item.getChildByName("cardtype");
                    if(this.relation[j] == 0){
                        cardtype.active = false;
                    }else{
                        cardtype.active = true;
                    }
                    if(cc.vv.roomMgr.is_replay){
                        cardtype.active = true;
                    }
                    for(var k = 0;k < 3;k++){
                        cardtype.getChildByName("card_"+ (k + 1)).getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getYSZPokerSpriteFrame(this.poKerminAtlas,data.list[j].hand[k]);
                    }
                    //根据正负显示字体
                    var score = item.getChildByName("score").getComponent(cc.Label);
                    if(data.list[j].round_score > 0){
                        score.font = self.winFont;
                        score.string = "+" + cc.vv.utils.numInt(data.list[j].round_score);
                    }else if(data.list[j].round_score < 0){
                        score.font = self.lostFont;
                        score.string = cc.vv.utils.numInt(data.list[j].round_score);
                    }else{
                        score.font = self.winFont;
                        score.string = cc.vv.utils.numInt(data.list[j].round_score);
                    }
                    if(data.list[j].userSitStatus == 1){
                        item.getChildByName("watch").active = true;
                        score.string = "-";
                        
                    }else{
                        item.getChildByName("watch").active = false;
                    }
                }
                data.list = fz_list;
            }
            
        }

    
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
            // if(data.list[i].userSitStatus == 3 || data.list[i].userid == 0){
            //     continue;
            // }
            if(!data.list[i].userid){
                continue;
            }
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

        if(is_watch_game == true){
            nodetitle.spriteFrame = self.jiesuanAtlas.getSpriteFrame("guanzhan");
            nodeNameleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
            nodeNameright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("wanjia");
            nodefenleft.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
            nodefenright.spriteFrame = self.jiesuanAtlas.getSpriteFrame("jifen");
        }
        function settimefunction(){
         
            self.unschedule(self.add_baozi_font2);
          
            self.nodeJiesuan.active = true;
        }

        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        var moneyCount = 10;//金币数量
        //小结算
        setTimeout(() => {
            if(self.is_baozi  && !self._senceDestroy){
                self.baozi_jianlgi(self.win_score);//豹子的最终奖励
            }
        }, 1000,self);
        //小结算
        setTimeout(() => {
            if(info.nowRound == cc.vv.roomMgr.now && !self._senceDestroy){
                settimefunction();
            }
        }, 2000,self);
        var desktop = this.node.getChildByName("mgr").getChildByName("desktop");
        var chip_qu = desktop.getChildByName("chip_qu");
        var deuce_chip = 0;
        var mp3File = "nn/chips";
        cc.vv.audioMgr.playSFX(mp3File);
        if(info.nowRound == cc.vv.roomMgr.now){
            for(var i=0;i<chip_qu.childrenCount;i++){
                var win = cc.vv.roomMgr.viewChairID(data.win[deuce_chip]);
                deuce_chip++;
                if(deuce_chip == data.win.length){
                    deuce_chip = 0; 
                }
                chip_qu.children[i].runAction(cc.sequence(
                    cc.moveTo(0.3,cc.v2( pos[win].x + 239,pos[win].y + 39)),
                    cc.callFunc(function () {
                    },self),
                ));
            }
        }

        //隐藏回放的准备确定按钮
        if(cc.vv.roomMgr.is_replay){
            var btn_ready = cc.find("Canvas/report/jiesuan/btn_ready");
            this.node.getChildByName("mgr").getChildByName("option");
            btn_ready.active = false;
            this.node.getChildByName("btn_tuoguan").active = false;
        }
   
    },
    active_tuoguan:function(){
        if(cc.vv.roomMgr.is_replay){
            this.node.getChildByName("btn_tuoguan").active = false;
        }
    },

    hide_jiesuan:function(){
        this.nodeJiesuan.active = false;
    },

    //大结算
    report:function(data){
        var self = this;
        this.nodeReport.active = true;
        var otherScore = this.nodeReport.getChildByName("otherScore");
        otherScore.getComponent(cc.Label).string = "其他:"+data.otherScore;
        this.nodeJiesuan.active = false;
        self.node.getChildByName("pop").removeAllChildren();
        this.labelRoomwanfa.string = "玩法：" + data.desc;
        var desktop= this.node.getChildByName("mgr").getChildByName("desktop");  
        this.node.getChildByName("mgr").getChildByName("alarm").active = false;
        //隐藏解散房间
        this.table.hide_dismiss_room();
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
        var list;
        if(data.list.length - hasJoinedBattle >= 7){
            list = this.nodeReport.getChildByName("list2");
        }else{
            list = this.nodeReport.getChildByName("list1");
        }
        list.removeAllChildren();
        //房间号、日期
        this.nodeReport.getChildByName("roomid").getComponent(cc.Label).string = data.roomid;
        this.nodeReport.getChildByName("time").getComponent(cc.Label).string = data.time;
        if(cc.vv.popMgr.get_open("Pwb_tips")){
            cc.vv.popMgr.del_open("Pwb_tips");//结算删除排位币不足控件 
        }

        var realPeople = 0;
        //所有人结算
        for(var i=0;i< data.list.length ;++i){
            if(data.list[i].userid > 0){
                realPeople++;
            }
        }
        realPeople = cc.vv.roomMgr.ren;
        for(var i=0;i< realPeople ;++i){
            if(data.list[i].userid == 0){
                continue;
            }
           if(data.list[i].hasJoinedBattle == true){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                var cardname;
                if(data.list[i].maxPaiType == 90)
                    cardname = "豹子";
                else if(data.list[i].maxPaiType == 80)
                    cardname = "顺金";
                else if(data.list[i].maxPaiType == 70)
                    cardname = "金花";
                else if(data.list[i].maxPaiType == 60)
                    cardname = "顺子";
                else if(data.list[i].maxPaiType == 50)
                    cardname = "对子";
                else if(data.list[i].maxPaiType == 10)
                    cardname = "高牌";
                else
                    cardname = "";
                if(cc.vv.roomMgr.param.sCompareT == 1){
                    if(data.list[i].maxPaiType == 70){
                        cardname = "顺子";
                    }else if(data.list[i].maxPaiType == 60){
                        cardname = "金花";
                    }
                }
   
                var info = {
                    name:data.list[i].name,
                    userid:data.list[i].userid,
                    headimg:data.list[i].headimg,
                    score:data.list[i].result_score,
                    dayingjia:data.list[i].result_score == data.list[0].result_score && data.list[0].result_score != 0,
                    datuhao:false,
                    sing_max_score:data.list[i].maxGetFen,
                    max_card_type:cardname,
                    sj_count:data.list[i].KeepColorNum,
                    bz_count:data.list[i].BaoNum,
                    win_lost_count:data.list[i].winNum,
                }
                var item;
                if(data.list.length -hasJoinedBattle >= 7){
                    item = cc.instantiate(this.reportItemMinPrefab);
                }else{
                    item = cc.instantiate(this.reportItemPrefab);
                }
                list.addChild(item);
                item.emit("info",info);
                
                if(viewid == 0){
                    this.labelScore.string = "+" + data.list[i].coins;
                }
           }
          
        }
    },
    stage_init(data){
        var self = this;
        this.node.getChildByName("mgr").getChildByName("hud").emit("round");
        for(i = 0;i < data.payFen.length;i++){
            if(data.payFen[i] == 0){
                continue;
            }
            var updscore = cc.vv.roomMgr.viewChairID(i); 
            var _winPlayer_node = cc.vv.utils.getChildByTag(this._winPlayer,updscore);
            var table_list = cc.vv.roomMgr.table.list;//刷新人物分数
            _winPlayer_node.getChildByName("score").getComponent(cc.Label).string = cc.vv.utils.numFormat(table_list[i].score - data.payFen[i]);
            //this.use_chip(data.outFen[i],init_viewid);
        }  

        for(var i = 0;i < data.nowKanPai.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            if(viewid == 0 &&  data.nowKanPai[i] == 1){
                this.isFanPai = true;
            }
        }
        this.playFen = data.payFen;
        
        var bipai_bg;
        var show_bipai;
        var mgr = this.node.getChildByName("mgr");
        if(cc.vv.roomMgr.ren == 5){
            bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg_5");
            show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai_5");  
        }else{
            bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg");   
            show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai");  
        }
        show_bipai.active = false
        bipai_bg.active = false
        this.nodeCard.removeAllChildren();
        var bipai_chis_tips = this.node.getChildByName("mgr").getChildByName("desktop").getChildByName("bipai_chis_tips");  
        bipai_chis_tips.removeAllChildren();
        var desktop= this.node.getChildByName("mgr").getChildByName("desktop");
        var pk_action = desktop.getChildByName("pk_action");
        var pk_user  = this.node.getChildByName("mgr").getChildByName("pk_user");

        pk_user.active = false;
        pk_action.active = false;  
        var playEfxs = pk_action.getComponent(cc.Animation);
        playEfxs.stop();
        this._lookcard_time = true;
        this._ischonglian = true;
        this.node.getChildByName("mgr").getChildByName("ready").active = false;
    },
    
    //恢复桌面
    stage:function(data){
        var self = this;
        /**
         * 自有的游戏阶段
         */
        // public static final int STAGE_FAPAI_1 = 1;
        // public static final int STAGE_QIANGZHUANG = 2;
        // setTimeout(() => {
       
        // }, 800);
        self.node.getChildByName("pop").removeAllChildren();
        if(data.ready == null){
            return;
        }
        if(self._senceDestroy){
            return;
        }
        if(data.ready != 1){
            this.desc = data.stage_param;
            if(this.desc)
                this.desc.fengKuang = data.fengKuang;
            var new_real = this.new_real();
            this._my_isin_game = false;
            this.new_round();
            this.stage_init(data);
            this.beginFen(data,1);
            if(data.stage == 97 && data.ready == 4){
            }else{
                this.deal_fapai(0,3,data,function(viewid,idx){
                    //另外最后一张，不要翻
                    if(viewid != 0 || idx != 2)return;
                    //开始抢庄
                    // self.kaiqiang()
                }); 
            }
     
            if(data.nowFen != (data.nowDizhu * new_real)){
                this.isfapa_in = false;
            }
            for(var i = 0;i < data.tuoGuan.length;i++){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(viewid == 0 && data.tuoGuan[i] == 1){
                    this.tuoguan(1);
                }
            }
            
            this.kanpai_1(data.nowKanPai,1);//显示已看牌的玩家
            if(data.nowOpera != 99){
                this.thisStart(data.nowOpera,1,data.time);//恢复闹钟
            }
            if(data.stage == 97 || data.stage == 4){
                this.node.getChildByName("btn_tuoguan").active = false;//小结算 重连后， 托管按钮继续隐藏。
                if(data.stage == 97 && data.ready == 4){
                }else{
                    this.kaipai(data);//小结算 恢复
                }
                //this.jiesuan_cardtyoe(data.hand);
            }else{
                var watch_game = this.watch_game();
                if(!watch_game){
                    this.showcard_type(data.type);//显示牌型
                }
                //this.solo_kaipai(data);//pk看牌
            }
         
            var bilostlist = data.bi;
            var qilostlist = data.qi;
            this.qipai(data.qi,1);//恢复弃牌
            // if(data.stage != 4){
                if(data.stage != 97 || data.stage != 4){
                    this.qipai_lost(qilostlist);//如果是弃牌  还没有小结算回来 显示灰色牌背
                }
                if(data.stage == 97 || data.stage == 4){
                    // setTimeout(() => {
                    //     this.bipai_lost(bilostlist);//恢复比牌输
                    // }, 100); 
                }else{
                    setTimeout(() => {
                        this.bipai_lost(bilostlist);//恢复比牌输
                    }, 300);
                }
            //}
          this.stage_tuoguan(data);
        }
        cc.vv.roomMgr.started = 1;
        cc.vv.roomMgr.stage = data;

        this.nowLun = data.nowLun
        cc.vv.roomMgr.now = data.nowRound
    },
    stage_tuoguan:function(data){
        for(var i = 0;i < data.bi.length;i++){
            if(data.bi[i] == 1){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(viewid == 0){
                    this.node.getChildByName("btn_tuoguan").active = false;//小结算 重连后， 托管按钮继续隐藏。
                }
            }
        }
        for(var i = 0;i < data.qi.length;i++){
            if(data.qi[i] == 1){
                var viewid = cc.vv.roomMgr.viewChairID(i);
                if(viewid == 0){
                    this.node.getChildByName("btn_tuoguan").active = false;//小结算 重连后， 托管按钮继续隐藏。
                }
            }
        }
    },
    //小结算显示牌   
    jiesuan_cardtyoe:function(data){
        // var is_watch_game = this.watch_game();
        // if(is_watch_game == true){
        //     return;
        // }
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        var listnode =  this.nodeJiesuan.getChildByName("list");
        var s_count = -1;
        var is_true = true;
        var for_list = [];
        var s_index = 0;
        var s_real = 0;
        for(var i = 0;i < data.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(data[i].seatId);
            s_real++;
            if(viewid !=0 && is_true){
                for_list.push(data[i].seatId);
            }else{
                is_true = false;
                s_count++;
                var cardtype = listnode.getChildByName("item" + s_count).getChildByName("cardtype");
               
                cardtype.active = true;
                for(var j = 0;j < data[i].pais.length;j++){
                    cardtype.getChildByName("card_"+ (j + 1)).getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getYSZPokerSpriteFrame(this.poKerminAtlas,data[i].pais[j]);
                }
            }
            if(s_count >= 0){
                for(var a = 0 ;a < playuser_count - 2 ; a++){

                    s_index = data[i].seatId + a + 1;//自己的下家//循环判断是否能知道他的牌
                    var user_count = 0;
                    var is_yse = false;
                    if (s_index >= playuser_count){//如果下家大于最大人数就 减去最大人数。
                        s_index = s_index - playuser_count;
                    }
                    for(var j = 0 ;j < data.length;j++){
                        if(s_index != data[j].seatId){
                            user_count++;
                        }else{
                            is_yse = true;
                        }
                        if(user_count == data.length){
                            s_count++;
                        }
                    }
                    if(is_yse){
                        break;
                    }
                }
            }
            if(s_real == data.length){
                for(var k = 0 ;k < for_list.length;++k){
                    s_count++;
                    var cardtype = listnode.getChildByName("item" + s_count).getChildByName("cardtype");
                    cardtype.active = true;
                    for(var j = 0;j < data[k].pais.length;j++){
                        cardtype.getChildByName("card_"+ (j + 1)).getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getYSZPokerSpriteFrame(this.poKerminAtlas,data[k].pais[j]);
                    }
                }
            }
       
        }
    },
    qipai_lost:function(data){
        if(this.isfapa_in) return;
        var desktop= this.node.getChildByName("mgr").getChildByName("desktop");
        var user_tips  = desktop.getChildByName("user_tips");
        var look_card = desktop.getChildByName("look_card")
        for(var i = 0;i < data.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            if(data[i] == 1){
                if(viewid == 0){
                    look_card.active = false;
                }else{
                    cc.vv.utils.getChildByTag(user_tips,viewid).active = false;
                }
                for(var j = 0 ; j < 3;j++){
                    if(viewid == 0 && this.isFanPai){
                        var card = cc.vv.utils.getChildByTag(this.nodeCard,viewid+"_"+j);
                        card.getChildByName("card").getComponent(cc.Button).interactable = false;
                    }
                }
            }
        }
    },
    //重连恢复比牌输
    bipai_lost:function(data){
        if(this.isfapa_in) return;
        var desktop= this.node.getChildByName("mgr").getChildByName("desktop");
        var user_tips  = desktop.getChildByName("user_tips");
        var look_card = desktop.getChildByName("look_card");
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        for(var i = 0;i < data.length;i++){
            var viewid = cc.vv.roomMgr.viewChairID(i);
            if(data[i] == 1){
                if(viewid == 0){
                    look_card.active = false;
                    desktop.getChildByName("bipai_lost").active = true;
                }else{
                    var win_lostid = cc.vv.roomMgr.viewChairID(i) ;
                    var bipai_win_lost = new cc.Node("bipai_win_lost");//
                    bipai_win_lost.myTag = win_lostid;
                    var imguri_str = "bipai_lose"
                    bipai_win_lost.addComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame(imguri_str);

                    user_tips.addChild(bipai_win_lost);
        
                    bipai_win_lost.x = (win_lostid >= 4  || win_lostid == 0)  ? pos[win_lostid].x + 110 : pos[win_lostid].x - 110;
                    bipai_win_lost.y = pos[win_lostid].y - 35;
                    
                    if(cc.vv.roomMgr.ren == 5){
                        bipai_win_lost.x = (win_lostid != 1)  ? pos[win_lostid].x + 150 : pos[win_lostid].x - 150;
                        bipai_win_lost.y = pos[win_lostid].y -50;
                    }

                    if(win_lostid == 0){
                        if(cc.vv.roomMgr.ren == 5){
                            bipai_win_lost.x = bipai_win_lost.x + 290;
                        }else{
                            bipai_win_lost.x = bipai_win_lost.x + 330;
                        }
                    }  
                }
                this._qipai_list.push(i);
                for(var j = 0 ; j < 3;j++){
                    if(viewid == 0 && this.isFanPai)break;
                    var card = cc.vv.utils.getChildByTag(this.nodeCard,viewid+"_"+j);
                    card.getChildByName("card").getComponent(cc.Button).interactable = false;
                }
            }
        }
    },
    //回放发牌动画
    replay_deal_fapai:function(begin,end,kaipaidata,callback){
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        if(cc.vv.roomMgr.is_replay){
            for(var i = 0;i<playuser_count;i++){
                var init_viewid = cc.vv.roomMgr.viewChairID(i);
                var _winPlayer_node = cc.vv.utils.getChildByTag(this._winPlayer,init_viewid);
                _winPlayer_node.getChildByName("ready").active = false
            }
        }
        var self = this;
    
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];


        var pailist = [];
        //发牌数组(数值为0)
        var fapailist = [];
        var datalist = [];
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0 ;i < kaipaidata.hand.length ;i++){
            var list = kaipaidata.hand[i].pais;
          
            if(!(table_list[i].sitStatus == 0)){
                continue;
            }
            //显示位置
            var viewid = cc.vv.roomMgr.viewChairID(kaipaidata.hand[i].seatId);
            var value = 0;
            //牌的位置
            var card_pos = pos[viewid].pos.card;
            for(var k= begin ;k< end ;k++){
                value = list[k];
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
                
                var card = node.getComponent('YSZPoker');
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
            if(viewid != 0 || idx != 2) return;

            for (let index = 0; index < length; index++) {
                var data = datalist[index];
                var node = pailist[index];
                node.zIndex = index;
                if(data.value != 0){
                    self.send_card_emit(data.viewid,data.index,"show",data);
                }
            }
        }
        for (let index = 0; index < length; index++) {
            var node = pailist[index];
            
            node.zIndex = length - index;
            var fapai = fapailist[index];

            fapai.value = 0;
            if(playuser_count <= 5){
                fapai.time  = index;
            }
            fapai.callback = callback;
            // //初始化牌信息
            node.emit("fapai",fapai);
        }
    },

    //发牌动画  
    deal_fapai:function(begin,end,kaipaidata,callback){
        this.isfapa_in = true;
        var playuser_count = 0;
        var table_list = cc.vv.roomMgr.table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0){
                playuser_count++; 
            }
        }
        playuser_count = cc.vv.roomMgr.ren;
        var self = this;
        var list = kaipaidata.hand;
        var data_list = kaipaidata;
        //每个人的座位信息
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];

        var pailist = [];
        //发牌数组(数值为0)
        var fapailist = [];
        var datalist = [];
        
        var table_list = cc.vv.roomMgr.table.list;
        for(var k= begin ;k< end ;k++){
            for(var i=0;i< playuser_count ;++i){
                if(!(table_list[i].sitStatus == 0)){
                    continue;
                }
            //显示位置
            var viewid = cc.vv.roomMgr.viewChairID(i);
            var value = 0;
           
            //牌的位置
            var card_pos = pos[viewid].pos.card;
            var scale = pos[viewid].scale;

                if(viewid == 0){
                    value = list[k];
                    if(kaipaidata.stage == 4 && list[i]){
                        value = list[i].pais[k];
                    }
                }
                if(kaipaidata.stage == 97){
                    //value = 0;
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
                var watch_game = this.watch_game();
                //生成一张牌
                var node = cc.instantiate(this.pokerPrefab);
                
                var card = node.getComponent('YSZPoker');
                card.zIndex = -begin;
                card.node.scale = 0.8;
                fapailist.push(fadata);
                datalist.push(data);
                pailist.push(node);

                if(viewid == 0 && this.isFanPai && !watch_game){
                    node.getChildByName("card").getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getPokerSpriteFrame(data.atlas,data.value);  
                 
                }
                this.nodeCard.addChild(node);
                //重要，以此来区分是谁的第几张牌
                node.myTag = data.viewid + "_" + data.index;
            }
        }
        var length = datalist.length;           

        var callback = function(viewid, idx){
            //最后一张牌发完后，开牌
            if(viewid != 0 || idx != 2) return;

            for (let index = 0; index < length; index++) {
                var data = datalist[index];
                var node = pailist[index];
                if(data.value != 0){
                    if(data_list.stage == 97 || viewid == 0){
                        self.send_card_emit(data.viewid,data.index,"show",data);
                    }else{
                        self.send_card_emit(data.viewid,data.index,"trun",data);
                    }
                }
            }
        }
        for (let index = 0; index < length; index++) {
            var node = pailist[index];
            var fapai = fapailist[index];

            fapai.value = 0;
            if(playuser_count <= 5 && data_list.stage != 97){
                fapai.time  = index;
            }
            fapai.callback = callback;
            // //初始化牌信息
            if(this._ischonglian){
                node.emit("fapai_zeor",fapai);
            }else{
                node.emit("fapai",fapai);
            }  
        }
    },
    //切换提示
    tip:function(text){
        return;
        if(text == null){
            this.sprTip.node.active = false;
            return;
        }
        var self = this;

        var name = "tips_" + text;
        this.sprTip.node.active = true;
    },
    //播放音效
    play_ysz_mp3(setaid,type,file){//第三个参数表示从游戏音效根目录找。为公共的音效。
        if(!cc.vv.roomMgr.table){
            return;
        }
        var sex = cc.vv.roomMgr.table.list[setaid].sex;
        if(file != null){
            var mp3File = "ysz/" + type;
            cc.vv.audioMgr.playSFX(mp3File);
        }else{
            if(sex !='1' && sex!='2'){
                sex = '1';
            }
            var mp3File = "ysz/" + sex + "/" + type;
            cc.vv.audioMgr.playSFX(mp3File);
        }
    },
    //给所有牌发消息
    send_card_emit:function(viewid,index,name,data){
        var myTag = viewid + "_" + index;
        var node = cc.vv.utils.getChildByTag(this.nodeCard,myTag);
        if(node){
            node.emit(name,data);
        }
    },
    //点击看牌
    fanpaiClick:function(data){
        var self = this;
        if(this.isFanPai || this._senceDestroy){
            return;
        }
        var _tuoguan = this.node.getChildByName("btn_tuoguan");
        _tuoguan.active = true;
        var option = this.node.getChildByName("mgr").getChildByName("option");
        option.active = true;
        var mgr = this.node.getChildByName("mgr")
        var desktop = mgr.getChildByName("desktop");
        var jiazhu = mgr.getChildByName("jiazhu");
        var look_card = desktop.getChildByName("look_card");
        var card_type = desktop.getChildByName("card_type");
        jiazhu.active = false;
        var thisviewid = cc.vv.roomMgr.viewChairID(this._thisStart)
        var bipai = option.getChildByName("bipai");
        if(data.canBi == 0){
            bipai.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_hui");
            bipai.getComponent(cc.Button).interactable = false;
            bipai.getChildByName("bp").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("not_bipai");
            bipai.getChildByName("Label").getComponent(cc.Label).font = this.hui_beishuFont;
        }else{
            bipai.getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("btn_lv");
            bipai.getComponent(cc.Button).interactable = true;
            bipai.getChildByName("bp").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("yes_bipai");
            bipai.getChildByName("Label").getComponent(cc.Label).font = this.beishuFont;
        }
        if(this.nowDiZhu != null){
            var genzhu = mgr.getChildByName("option").getChildByName("genzhu");
            genzhu.getChildByName("Label").getComponent(cc.Label).string = this.nowDiZhu * 2;
            this.node.getChildByName("btn_tuoguan").getChildByName("tpschip").getComponent(cc.Label).string = this.nowDiZhu * 2;
            if(this.nowDiZhu * 2 >= 1000){
                var genzhu_num = (this.nowDiZhu * 2) / 1000;
                genzhu.getChildByName("Label").getComponent(cc.Label).string = genzhu_num + "K";
              }
        }
        if(thisviewid == 0){ 
            var mgr =this.node.getChildByName("mgr")
            
            //回放隐藏按钮
            if(cc.vv.roomMgr.is_replay){
                mgr.getChildByName("option").active = false;
            }
            mgr.getChildByName("bipai").active = false;
            mgr.getChildByName("desktop").getChildByName("bipai_list").active = false;

            var bipai_bg = mgr.getChildByName("desktop").getChildByName("bipai_bg");   
            var show_bipai = mgr.getChildByName("desktop").getChildByName("show_bipai");   

            for(var i = 1;i < show_bipai.childrenCount;i++){
                var action_animation = show_bipai.getChildByName("action_" + i).getComponent(cc.Animation);
                action_animation.stop();
            }

            show_bipai.active = false
            bipai_bg.active = false
        }
        card_type.active = true;

        this._ownPokerType = parseInt(data.type);
        if(cc.vv.roomMgr && cc.vv.roomMgr.param.sCompareT == 1){
            if(data.type == 70){
                card_type.getChildByName("card_type").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("cardtype_60");
                this.play_ysz_mp3(data.seatId,"cardtype_60");
            }else if(data.type == 60){
                card_type.getChildByName("card_type").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("cardtype_70");
                this.play_ysz_mp3(data.seatId,"cardtype_70");
            }else{
                card_type.getChildByName("card_type").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("cardtype_" + data.type);
                if(data.type == 10 && data.is235 == 1){
                    this.play_ysz_mp3(data.seatId,"cardtype_235");
                }else{
                    this.play_ysz_mp3(data.seatId,"cardtype_" + data.type);
                } 
            }
        }else{
            card_type.getChildByName("card_type").getComponent(cc.Sprite).spriteFrame = this.ysz_Game_Atlas.getSpriteFrame("cardtype_" + data.type);
            if(data.type == 10 && data.is235 == 1){
                this.play_ysz_mp3(data.seatId,"cardtype_235");
            }else{
                this.play_ysz_mp3(data.seatId,"cardtype_" + data.type);
            } 
        }
     
        look_card.active = false;
        this.isFanPai = true;

        //翻转自身牌
        for (var i = 0; i < 3; ++i) {
            var info = {
                viewid:0,
                obj:this,
                type:0,
                index:i,
                atlas:self.pokerAtlas,
                value:data.hand[i],
            }
            self.send_card_emit(0,i,"trun",info);
        }
    },
    //玩家自己看牌
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
            self.send_card_emit(0,i,"trun",info);
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

    //飞币
    userChipFunc:function(outFen, viewid){
        var self = this;
        function userChipCallback(outFenVule, viewid, num){
            for (var index = 0; index < num; index++) {
                self.use_chip(outFenVule, viewid);
            }
        }
        
        var indexChip = 0;
        for(var i = this._chip_list.length - 1; i >= 0; i--){
            var numChip =  parseInt(outFen / this._chip_list[i - indexChip]); 
            if(numChip == 0){
                continue;
            }
            var outFen = outFen - numChip * this._chip_list[i - indexChip];
            userChipCallback(this._chip_list[i - indexChip], viewid, numChip);
        }
    },

    //飞币
    userStaticChipFunc:function(outFen){
        var self = this;
        function userChipCallback(outFenVule, num){
            for (var index = 0; index < num; index++) {
                self.static_chip(outFenVule);
            }
        }
        
        var indexChip = 0;
        for(var i = this._chip_list.length - 1; i >= 0; i--){
            var numChip =  parseInt(outFen / this._chip_list[i - indexChip]);
            if(numChip == 0){
                continue;
            }
            var outFen = outFen - numChip * this._chip_list[i - indexChip];
            userChipCallback(this._chip_list[i - indexChip], numChip);
        }
    },

    //界面关闭时
    onDestroy:function(){
        this._senceDestroy = true;
        cc.loader.setAutoRelease(this, true);
    }
});