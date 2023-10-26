const alarmpos=[{x:-520,y:-140},{x:360,y:46},{x:225,y:132},{x:-225,y:132},{x:-360,y:46}]
const tipSpadeLeft = { //显示的左边
    1:"wh",
    2:"gu1",
    3:"h3"
}
const tipSpadeRight = { //显示的右边
    3:"s4",
    19:"s2",
    35:"s1",
    51:"s3"
}
const tipOpts = { //显示tip
    1:"meihua",
    2:"zhagu",
}
const SuitTxt = {
    "Diamond" : 3,
    "Heart" : 19,
    "Club": 35,
    "Spade" :51

}

cc.Class({
    extends: cc.Component,

    editor: {
        executionOrder: -1
    },

    properties:{
        _winPlayer:cc.Node,
        nodeCard:cc.Node,
        nodeJiesuan:cc.Node,
        nodeReport:cc.Node,
        pokerPrefab:cc.Prefab,
        othercards:cc.Node,
        showSuit:cc.Node,
        zhaGu:cc.Node,
        zhaGuToggle:[cc.Node],
        opts:cc.Node,
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
        shadow:cc.Node,
        zhuafenNode:cc.Node,
        pokerDoneNode:cc.Node,
        tablefen:cc.Node,
        difen:cc.Label,
        gameType:cc.Label,
        spine1:cc.Node,
        spine2:cc.Node,
        tips:cc.Node,
        bignumlos:cc.BitmapFont,
        bignumwin:cc.BitmapFont,
        animationNode:cc.Node,
        reportItemPrefab:cc.Prefab,
        _senceDestroy:false, // 当前场景是否被销毁
        _tipIndex:0,
        _noChoise:true,
        _turn:1,
        _idx:0
    },

    onLoad () {
        
        
        var const_nn= require("ZGZ3300Const");
        cc.vv.game = this;
        cc.vv.game.config = {
            type:"zgz",
            hide_nothing_seat:false,
            direct_begin:false,
            chat_path:const_nn.chat_path,
            quick_chat:const_nn.quick_chat,
            player_5:const_nn.player5,
            selfPoke_5:const_nn.selfPoke5,
            set_bg:true,
            location:false,
            show_watch_btn:false,//是否显示观战按钮
            default_bg:const_nn.default_bg
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
        this.btn_buchu = this.opts.getChildByName('btn_buchu');

        this.ske = this.spine1.getComponent(sp.Skeleton);
        this.ske2 = this.spine2.getComponent(sp.Skeleton);

        this.noMove = true;
        this.tishipai = []; //提示的牌
       

        this.anim = this.animationNode.getComponent(cc.Animation);
        this.anim.on('finished',this.onFinished,this);
    },

    onFinished:function(){
        this.animationNode.active = false;
    },

    start(){
        var self = this;
        //播放背景音乐
        cc.vv.audioMgr.playBGM("ddz/bg_music");

        this.nodeCard.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
        this.nodeCard.on(cc.Node.EventType.TOUCH_END, this.touchend, this);

        cc.vv.zgzMgr = this.node.getComponent("ZGZ3300Mgr");

        //回放
        var ReplayMgr = require("ZGZ3300ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        if(cc.vv.roomMgr.is_replay){

            //回放控制器
            cc.vv.popMgr.open("ReplayCtrl",function(obj){
                self._winRealName = obj;
            });

            //初始化数据
            cc.vv.zgzMgr.prepareReplay();
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
            self.jiesuan(data.data);
        }),

         //大结算
         this.node.on("report",function(data){
            if(data.errcode == -1){
                self.nodeJiesuan.active = false;
                return;
            }
            cc.vv.popMgr.hide();
            self.report(data.data);
        }),

         //恢复桌面
         this.node.on('stage',function(data){
            self.stage(data.data);
        }),

        //出牌
        this.node.on("chupai",function(data){
            if(data.errcode == -1){
                cc.vv.popMgr.tip(data.errmsg);
                return;
            }
            self.chupai(data.data);
        }),

        this.node.on("operate",function(data){
            self.operate(data.data);
        }),

        this.node.on("action",function(data){
            self.robMain(data.data); 
        })
        this.node.on("sanAction",function(data){
            self.sanAction(data.data); 
        })
        this.node.on("userHand",function(data){ //手牌更新
            self.userHand(data.data); 
        })

        
        // this.node.on('getZhungPoker',function(data){
        //     self.getZhungPoker(data.data);
        // })


        this.node.on('error',function(data){
            cc.vv.popMgr.tip(data.errmsg);
        })

        this.node.on('tip',function(data){
            self.tishipai = data.data.pai;
        })


        this.node.on('showClock',function(data){
            self.showClock(data.seatid);
        }),
        this.node.on('setZhuaFen',function(data){
            self.setZhuaFen(data);
        }),



        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(!cc.vv.roomMgr.is_replay && cc.vv.net2.isConnectd()){
                cc.vv.popMgr.wait("正在恢复桌面",function(){
                    setTimeout(() => {
                        cc.vv.net2.quick("stage");
                        self.new_round();
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
                item.getComponent('ZGZPoker').setMove(1);
                item.isChiose = true;
                return item;
            }
        }

        return null;
    },

    //设置所有牌没被选中
    setAllCardUnSelected:function(){
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            var card =  this.nodeCard.children[i].getComponent('ZGZPoker');
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
            var card = children.getComponent('ZGZPoker');
            if(card.isSelect() == selected){
                result.push(children);
            }
        }
        return result;
    },

    touchstart:function(event){

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
        event.stopPropagation();
        var location = event.getLocation();
        var item = this.isInRect(location);

        if(item){
            return;
        }
    },

    touchend:function(event){

        var count = 0;
        var list = [];
        for (var i = 0; i < this.nodeCard.childrenCount; ++i) {
            var item = this.nodeCard.children[i];
            if(item.isChiose){
                count++;
                var card = item.getComponent('ZGZPoker');
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
        if(this._senceDestroy){
            return;
        }
        this.nodeReport.active = false;
        this.nodeJiesuan.active = false;
        this.nodeCard.removeAllChildren();
        this.othercards.active = false;
        this.opts.active = false;
        this.hideTips();
        this.clearAllPoker();
        this.clearZhaGu();
        this.hidePokerDone();
        this.clearShowSuit();
        this.clearShowPais();

        this.waitclock.active = false;
        this.gamebegin.active = false;
        this.isBegin = false;
        cc.vv.roomMgr.stage = null;;
     
        this.difen.string = 0;
        this._turn = 1;
        this.sprTip.node.active = false;
  
        this.mainValue = -1;
        this.gamestate = "";
        // this.mainArr = [];
        this._idx = 0;
        this.mainColor = 99;
        this.gaipaiTip.active = false;
        this.tishipai = [];
        this.hand = null;
    },

    // hideZhuafen:function(){
    //     for(var i = 0; i < this.zhuafenNode.childrenCount; i++){
    //         this.zhuafenNode.children[i].active = false; 
    //     }
    // },

    hideTips:function(){
        for(var i = 0; i < this.tips.childrenCount; i++){
            var node = this.tips.children[i];
            node.active = false;
        }
    },


    begin:function(){

    },

    //游戏参数
    param:function(data){
        this._fangzhu = data.fangzhu;
        // this.difen.string = data.difen;  // 待删
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
 //发牌
 fapai:function(pai){
    // let pai = [30,13,45,44,43,10,42,58,25,9]
    this.isBegin = true;
    var self = this;
    this.tip(null);
    this.hideTips();
    // cc.vv.roomMgr.now = round;
    this.table._winHub.emit("round");

    //让座位到开局状态
    this.table.seat_emit(null,"round");

    
  
    this.deal_fapai(0,pai.length,pai,function(idx){
        if(idx < pai.length - 1) return;
       
        var that = self;
        self.showPoker(pai,function(k){
            if(k != pai.length - 1) return;
            that.refreshHandCards();
        });
     
    });
    
    this.zhuafenNode.active = true;
    this.othercards.active = true;
    this.showSuit.active = true;
    if(cc.vv.roomMgr.stage){
        return;
    }
    for(let i=0; i<4; i++){
        let node=this.othercards.children[i];
        if(!node){
            continue;
        }
        node.getComponent(cc.Label).string =`剩余牌10`;
    }
    
},

    //刷新手牌位置
    refreshHandCards:function(){
        var length = this.nodeCard.childrenCount;
        if(length == 0){
            return;
        }
        var offset = 65;
        var pos = 0;
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
        if(!cc.vv.roomMgr.stage){
            card.emit("fapai",json);
        }else{
            card.y = 0;
            card.x = -290 + i*55;
            if(list[i] != 0){
                var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,list[i]);
                card.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
                card.getComponent('ZGZPoker').setValue(list[i]);
                card.value = list[i];
                if(i == end -1){
                    this.refreshHandCards();
                }
            }  
        }
    }
   
    //this.refreshHandCards();
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

        // this.mainArr = [];
        this.unschedule(this.newPoker);
        this.nodeCard.removeAllChildren();
        this.nodeCard.width = 2000;
        this.nodeCard.getComponent(cc.Layout).enabled = false;
        this.deal_fapai(pai);
   
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
     
        this.nodeCard.addChild(node);
        var array = [];
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            var node = this.nodeCard.children[i];
            array.push(node.value);
        }
        // this.sortCardNode(array);
    },

  



    tip:function(text){
        if(text == null){
            this.sprTip.node.active = false;
            return;
        }
        this.sprTip.spriteFrame = this.tipAltas.getSpriteFrame(text);
        this.sprTip.node.active = true;
    },

    tip2:function(viewid,text){
        var node = this.tips.children[viewid];
        if(text == null){
            node.active = false;
            return;
        }
        node.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame(text);
        node.active = true;
    },

 
    robMain:function(data){
        let index = cc.vv.roomMgr.viewChairID(data.seatid);
        this.unschedule(this.otherTimeUpdate);
        this.waitclock.active = true;
        this.waitclock.getComponentInChildren(cc.Label).string = 12;
        this.schedule(this.otherTimeUpdate,1);
        this.waitclock.x = alarmpos[index].x;
        this.waitclock.y = alarmpos[index].y;
        let tip =  this.sanHong?"waitLiang3":"waitLiang32"
        if(cc.vv.roomMgr.seatid == data.seatid){
            this.clearZhaGu();
            this.tip(null);
            this.actionData = data.list;
            //按钮显示 (1.没话 2.扎股 3.亮三 4.认输)
            this.zhaGu.active = true;
            for(let i of data.button){
                let node = this.zhaGu.getChildByName('btn_'+i);
                if(!node){
                    continue;
                }
                node.active = true;
            }
            if(data.list.length == 0){
                return;
            }
            for(let j of data.list){
                let pokerNode = this.zhaGu.getChildByName(j+"");
                if(!pokerNode){
                    continue;
                }
                if(j==3 || j==19){//红三
                    var toggle =  pokerNode.getComponent(cc.Toggle);
                    toggle.isChecked = true
                }
                pokerNode.zIndex=2;
                if(this.sanHong && j==3){
                    pokerNode.zIndex=0;
                }
                
            }
        }else{
            this.tip(tip);//waitLiang3  这是红三
        }
    },
    clearZhaGu(){
        let minPoker = {
            1:"3",
            2:"35",
            3:"19",
            4:"51",
        }
        this.zhaGu.active = false;
        for(let i=1; i<5; i++){
            let btnNode = this.zhaGu.getChildByName('btn_'+i);
            btnNode.active = false;
            let pokerNode = this.zhaGu.getChildByName(minPoker[i]);
            var toggle =  pokerNode.getComponent(cc.Toggle);
            toggle.isChecked = false;
            pokerNode.zIndex=0;
        }
        this.zhaGu.getChildByName('tan1').zIndex=1;
    },
    userHand(data){
        if(!data.hand){
            return;
        }
   
        for(let i = 0; i< this.nodeCard.childrenCount; i++){
            var card = this.nodeCard.children[i];
            if(!card){
                return;
            }
            var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,data.hand[i]);
            card.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
            card.getComponent('ZGZPoker').setValue(data.hand[i]);
            card.value = data.hand[i];
        }
    },
    sanActionStage(zhaguStatus){//断线重连的
        for(let i of zhaguStatus){
            this.sanAction(i);
        }

    },
    sanAction(data){
        this.zhaGu.active = false;
        
        let index = cc.vv.roomMgr.viewChairID(data.seatid);
        if(!cc.vv.roomMgr.stage){
            this.difen.string = data.difen;
        }
      
        let node = this.showSuit.children[index];
        if(!node){
            return;
        }
        let left = node.getChildByName("wh");
        let leftSpr = tipSpadeLeft[data.type]
        left.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame(leftSpr);
        if(!cc.vv.roomMgr.stage){
            this.tip2(index,tipOpts[data.type]);
        }
        if(cc.vv.roomMgr.stage && (cc.vv.roomMgr.stage.stage ==3 || cc.vv.roomMgr.stage.stage ==2) && data.hasAction){
            this.tip2(index,tipOpts[data.type]);
        }
       
        if(data.sanlist.length==0){//data.type!=3 || 
            return;
        }
        for(let i of data.sanlist){
            let rightSpr = tipSpadeRight[i];
            let right = node.getChildByName(i+"");
            right.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame(rightSpr);

        }
        

        if(cc.vv.roomMgr.stage && cc.vv.roomMgr.stage.stage > 3){
            return;
        }
        
        if(cc.vv.roomMgr.is_replay){
            return
        }
        this.showSanHong(index,data.sanlist)
      
    },
    showSanHong:function(index,pai){
        if(pai.length == 0){
            return;
        }
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
    },
    clearShowSuit(){ //重置亮三栏
        let txtSpr = {
            0:"wh",
            1:"h44",
            2:"h11",
            3:"h22",
            4:"h33",
        }
        for(let i=0; i<this.showSuit.childrenCount; i++){
            let node = this.showSuit.children[i];
            if(!node){
                return;
            }
            for(let j=0; j<node.childrenCount; j++){
                let childnode = node.children[j]
                if(!childnode){
                    return;
                }
                let spritefra = txtSpr[j];
                childnode.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame(spritefra);
    
            }
        }
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


    getlist:function(){
        var list = [];
        for(var i = 0; i < this.nodeCard.childrenCount; i++){
            list.push(this.nodeCard.children[i].value);
        }
        return list;
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
                var com = node.getComponent('ZGZPoker');
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
                //         var card = node.getComponent('ZGZPoker');
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
        var index = cc.vv.roomMgr.viewChairID(data.seatid);
        this.hideTips();
        if(data.list.length == 0){        //要不起或者不出
            // this.passNotice.children[index].active = true;
            // var ary = ['buyao1','buyao2','buyao3','buyao4'];
            // var url = ary[Math.floor(Math.random() * ary.length)];
            this.tip2(index,"txt_buchu");
            this.playSFX(data.seatid,"buyao1");
        }else{
            let node = this.showSuit.children[index];
            if(!node){
                return;
            }
            for(let i of data.list){
                let rightSpr = tipSpadeRight[i];
                let right = node.getChildByName(i+"");
                if(!right){
                    continue;
                }
                right.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame(rightSpr);
    
            }
            cc.vv.audioMgr.playSFX('ddz/effect/effect_playcard');
        }
        if(index == 0){
            this.unschedule(this.otherCanPai);
            //手牌还原
            this.setAllCardUnSelected();
            //隐藏要不起遮罩
            this.shadow.active = false;
            //操作按钮隐藏
            this.opts.active = false;
            //提示牌数组标志初始0
            this._tipIndex = 0;
            //关闭倒计时
            this.unschedule(this.selfTimeUpdate2);
            this.removePoker(this.nodeCard,data.list);
            this.refreshHandCards();
            this.initPoker();
        }else{
            this.waitclock.active = false;
            this.unschedule(this.otherTimeUpdate);
        }
        this.showPokerDone(index,data.you);
        this.showPais(data.seatid,data.pais);
        this.showChupai(index,data.list);
        this.showChupaiType(data);
        this._turn++;
    },
    showPokerDone(index,you){ //显示头游
        let node = this.pokerDoneNode.children[index];
        if(!node || !you){
            return;
        }
        node.active = true;
        let childNode = node.getChildByName("typespr");
        if(!childNode){
            return;
        }
        childNode.getComponent(cc.Sprite).spriteFrame = this.tipAltas.getSpriteFrame(`txt_you${you}`);
    },
    hidePokerDone(){//隐藏头游
        for(let i=0; i<this.pokerDoneNode.childrenCount; i++){
            let node = this.pokerDoneNode.children[i];
            if(!node){
                return;
            }
            node.active = false;
        }
    },
    showPaiStage(pais){ //断线重连重置牌
        for(let i=0; i<5; i++){
            var index = cc.vv.roomMgr.viewChairID(i);
            if(!index){
                continue;
            }
            let node = this.othercards.children[index-1];
            let card = pais[i]
            if(!node || !card){
                continue;
            }
            node.getComponent(cc.Label).string =`剩余牌${card}`;
        }
    },
    showPais:function(seatid,pais){
        this.othercards.active = true;
        var index = cc.vv.roomMgr.viewChairID(seatid);
        if(!index){
            return;
        }
        this.othercards.children[index-1].getComponent(cc.Label).string =`剩余牌${pais}`;
        
    },
    clearShowPais(){
        for(let i=0; i<this.othercards.childrenCount; i++){
            let node = this.othercards.children[i];
            if(!node){
                return;
            }
            node.getComponent(cc.Label).string =`剩余牌0`;
        }
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
        // this.showMainPoker(this.mainColor,root);
    },

  

    showChupaiType:function(data){
       
        var self = this;
        var url = '';
        var effect = '';
        var sounds = ['dani1','dani2','dani3'];

        // //拖拉机
        // if(data.type == 4){
        //     this.playSFX(data.seatid,"tuolaji");
        //     this.tip2(viewid,"tuolaji");
        // }
        // //杀
        // else if(data.sha == 1){
        //     var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        //     this.animationNode.x = pos[viewid].pos.tip.x;
        //     this.animationNode.y = pos[viewid].pos.tip.y;
        //     this.playSFX(data.seatid,"sha");
        //     cc.vv.audioMgr.playSFX('dq/effect/game_sha');
        //     this.animationNode.active = true;
        //     this.anim.play('kill');
        // }
        // //打住
        // else if(data.daZhu == 1 ){
        //     this.playSFX(data.seatid,"dazhu");
        //     this.tip2(viewid,"dazhu");
        // }
        // //调主
        // else if(data.diaozhu == 1 ){
        //     this.playSFX(data.seatid,"diaozhu");
        //     this.tip2(viewid,"diaozhu");
        // }
        //垫牌
        // else if(this._turn != 1){
        //     this.playSFX(data.seatid,"dianpai");
        //     this.tip2(viewid,"dianpai");
        // }
        //首出单张
        if(data.type == 1){
            var pai = data.list[0];
            if(pai == 95){
                url = 'pai/16';
            }
            else if(pai == 79){
                url = 'pai/15';
            }
            else{
                url = 'pai/' + pai % 16;
         
            }
        }
        //首出对子
        else if(data.type == 2){
            var pai = data.list[0];
            url = 'pai/dui' + pai % 16 + '';
         
        }else if(data.type == 16){
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
        }else if(data.type == 17){
            // wangzha
            url = 'wangzha';
            effect = 'effect_rocket';
            cc.loader.loadRes("game/ddz/animation/rocket/doudizhu_huojian", sp.SkeletonData, function (err, skeletonData) {
                self.ske.node.active = true;
                self.ske.node.x = 0;
                self.ske.node.y = -234;
                self.ske.skeletonData = skeletonData;
                self.ske.timeScale = 1;
                self.ske.setAnimation(0, "doudizhu_huojian", false);  
                self.ske.setCompleteListener(function(){
                   
                });  
            });
        }else if(data.type == 18){
            url = 'pai/dui3';
            // 双三
        }
        if(data.type != 16){
            if(effect != ''){
                cc.vv.audioMgr.playSFX('ddz/effect/' + effect);
            }
            this.playSFX(data.seatid,url);
        }
    },

    //叫主时间倒计时 // 待删
    // selfTimeUpdate:function(){
    //     var timepoint = this.nodeXiazhu.getChildByName('timepoint').getComponentInChildren(cc.Label);
    //     var number = parseInt(timepoint.string);
    //     number -= 1;
    //     timepoint.string = number;
    //     if(number <= 0){
    //         cc.vv.audioMgr.playSFX('timeup_alarm');
    //         this.unschedule(this.selfTimeUpdate);
    //     }
    // },

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


  
    operate:function(data){
        this.tip(null);
      
        if(data.can == 2){
            this._turn=1
            this.hideTips();
            this.clearAllPoker();
        }

        var index = cc.vv.roomMgr.viewChairID(data.seatid);
        this.clearPoker(index);
        if(cc.vv.roomMgr.seatid == data.seatid){
            if(data.can == 3|| data.can==4){
                data.can =0
            }
            this.opts.active = true;
            this.waitclock.active = false;
            this.timepoint.string = 15;
            this.schedule(this.selfTimeUpdate2,1);
            this.shadow.active = data.can == 0
            this.btn_buchu.active = true;
            this.btn_chupai.active = true;
            this.btn_tishi.active = true;
            if(data.can == 0){// 0不出 1可以 2首出
                this.btn_buchu.active = true;
                this.btn_chupai.active = false;
                this.btn_tishi.active = false;
            }else if(data.can == 2){
             
                this.btn_buchu.active = false;
                this.btn_chupai.active = true;
                this.btn_tishi.active = false;
            }
        }else{
            this.waitclock.active = true;
            this.waitclock.getComponentInChildren(cc.Label).string = 15;
            this.schedule(this.otherTimeUpdate,1);
            this.waitclock.x = alarmpos[index].x;
            this.waitclock.y = alarmpos[index].y;
        }
    },

    showClock:function(seatid){
        if(this._turn == 1){
            this.hideTips();
            this.clearAllPoker();
        }
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        this.waitclock.active = true;
        this.waitclock.getComponentInChildren(cc.Label).string = 15;
        this.waitclock.scale = 0.7;
        if(viewid >= 1){
            this.waitclock.x = alarmpos[viewid].x;
            this.waitclock.y = alarmpos[viewid].y;
        }
        else{
            this.waitclock.x = 0;
            this.waitclock.y = 0;
        }
    },

    //  //刷新手牌位置
    // refreshHandCards:function(){
    //     var length = this.nodeCard.childrenCount;
    //     if(length == 0){
    //         return;
    //     }
    //     var offset = length > 20 ? 55 : 60;
    //     var pos = length > 20 ? -27.5 : -30;
    //     if(length == 20){
    //         offset = 58;
    //         pos = -29;
    //     }else if(length == 28){
    //         offset = 58;
    //         pos = -29;
    //     }
    //     else if(length == 25 || length == 24 || length == 23){
    //         offset = 48;
    //         pos = 0;
    //     }else if(length == 33){
    //         offset = 48;
    //         pos = 0;
    //     }
    //     //左右扩展位置
    //     var mid = parseInt((length - 1) / 2);

    //     this.nodeCard.children[mid].x = pos;
    //     for(var i = mid + 1 ; i < length;i++){
    //         this.nodeCard.children[i].x = pos + (i - mid) * offset;
    //     }

    //     for(var i = mid - 1 ; i >= 0; i--){
    //         this.nodeCard.children[i].x = pos + (i - mid) * offset;
    //     }
    //     // var node = this.nodeCard.children[length - 1];
    //     // var card = node.getComponent('ZGZPoker');
    //     // card.setType(cc.vv.roomMgr.seatid == this._dizhu?1:0);
    // },
    //出牌提示
    pokerTip:function(data){
        this.setAllCardUnSelected();
        var pai = data[this._tipIndex];
        if(this._tipIndex >= data.length){
            this._tipIndex = 0;
            this.setAllCardUnSelected();
            return;
        }

        pai.sort(function(a,b){
            return a<b;
        });
        for(var j = 0; j < pai.length; ++j){
            for(var i = 0; i < this.nodeCard.childrenCount; ++i){
                var node = this.nodeCard.children[i];
                if(pai[j] == node.value){
                    var card = node.getComponent("ZGZPoker");
                    this.selectCard(card,1);
                    break;
                }
            }
        }
        
        this._tipIndex++;    
       
    },
    setZhuaFen(data){
        for(var i = 0; i < this.zhuafenNode.childrenCount; i++){
            var index = cc.vv.roomMgr.viewChairID(i);
            let node = this.zhuafenNode.children[index];
            let userScore = data[i]
            if(!node || !userScore){
                continue;
            }
            node.getComponent(cc.Label).string = parseInt(userScore.score);
        }
    },
    jiesuan:function(data){
        this.unschedule(this.selfTimeUpdate);
        this.unschedule(this.otherTimeUpdate);
        this.zhaGu.active=false;
        this.nodeJiesuan.active = true;
        this.difen.string = data.difen;
        let typeTxt = {
            1:"没话",
            2:"扎股",
            3:"亮",
            4:"认输"
        }
        let huaseTxt = {
            3:"方",
            19:"红",
            35:"梅",
            51:"黑"
        }
  
        let result = data.list;
        var list = this.nodeJiesuan.getChildByName("list");
        for(var i = 0; i < list.childrenCount; i++){
            var viewid = cc.vv.roomMgr.viewChairID(result[i].seatid);
            var node = list.children[viewid];
            let zhuaNode = this.zhuafenNode.children[viewid];
            if(!node || !result[i] || !zhuaNode){
                return;
            }
            zhuaNode.getComponent(cc.Label).string = result[i].user_score;
            let chlidNunNode = node.getChildByName("num");
            let chlidTxtNode = node.getChildByName("text");
            let sumFlower = "";
            if(result[i].type == 3){
                for(let j of result[i].sanlist){
                    sumFlower += huaseTxt[j]
                }
                sumFlower = sumFlower +"三";
            }
            let txt = `[${typeTxt[result[i].type]}${sumFlower}][${result[i].bei}倍]`
            chlidNunNode.getComponent(cc.Label).string = result[i].round_score;
            chlidTxtNode.getComponent(cc.Label).string = txt;
          
            this.showSanHong(viewid,result[i].hand)
        }
        this.nodeCard.removeAllChildren();
        // for(var i = 0; i < this.gaipaiArr.length; i++){
        //     var node = dipai.children[i];
        //     node.getComponent(cc.Sprite).spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,this.gaipaiArr[i]);
        //     node.active = true;
        // }
        // var results = this.nodeJiesuan.getChildByName('results');
        // for(var i = 0; i < data.list.length; i++){
        //     var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
        //     var item = results.children[viewid].getComponent(cc.Label);
        //     var score = cc.vv.utils.numInt(data.list[i].round_score);
        //     if(score >= 0){
        //         item.string = "+" + data.list[i].round_score;
        //         item.font = this.bignumwin;
        //     }else{
        //         item.string = data.list[i].round_score;
        //         item.font = this.bignumlos;
        //     }

        //     // this.table.seat_emit(viewid,"score",data.list[i].user_score);
        // }
   
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
        let bestHandNode =  this.nodeReport.getChildByName('bestHand');
        let noneNode =  this.nodeReport.getChildByName('nonetxt');
        this.nodeReport.getChildByName('time').getComponent(cc.Label).string = data.time;
        this.nodeReport.getChildByName('roomid').getComponent(cc.Label).string = data.roomid;
        this.nodeReport.getChildByName('round').getComponent(cc.Label).string = `局数：${data.nowRound}/${data.maxRound}`;
        this.nodeReport.getChildByName('wanfa').getComponent(cc.Label).string = "玩法：" + cc.vv.roomMgr.enter.desc;
         
        let bestHand = [];
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
            if(cc.vv.roomMgr.seatid  == data.list[i].seatid){
                bestHand = data.list[i].bestHand;
            }
            var viewid = cc.vv.roomMgr.viewChairID(data.list[i].seatid);
            if(viewid == 0){
                this.nodeReport.getChildByName('socre').getComponentInChildren(cc.Label).string = '+' + data.list[i].coins;
            }
        }
        bestHandNode.active = !bestHand.length==0;
        noneNode.active = bestHand.length==0;
        if(bestHand.length==0){
            return;
        }
        for(var j = 0; j < bestHandNode.childrenCount; j++){
            let node = bestHandNode.children[j];
            if(!node || !bestHand[j]){
                return;
            }
            var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,bestHand[j]);
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame

        }
    },

    stage:function(data){
        this.sanHong = data.sanHong;
    
        this.gameType.string = this.sanHong?"[捉三红]":"[扎股子]"
        this.node.getChildByName("pop").removeAllChildren();
        if(!data.stage){ 
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
       
       
        switch(data.stage){
            case 1:
            case 2:{
                this.mainColor = data.mainColor;
                this.fapai(data.cards);
          
                // this.showMainPoker(data.mainColor,this.nodeCard);
            }
            break;
            case 3:{
                this.mainColor = data.mainColor;
                this.fapai(data.cards);
               
                // this.zhaGu.active = true;
                // if(cc.vv.roomMgr.seatid == data.zhuang){
                //     this.opts.active = true;
                //     this.btn_chupai.active = false;
                //     this.btn_tishi.active = false;
                //     // this.btn_gaipai.active = true;
                //     this.timepoint.string = 15;
                //     this.schedule(this.selfTimeUpdate2,1);
                // }
               
            }
            break;
            case 5:
            case 4:{
                this.mainColor = data.mainColor;
                //出牌
               for(var i = 0; i < data.lastPai.length; ++i){
                    if(data.lastPai[i] == null){
                        continue;
                    }
                    var index = cc.vv.roomMgr.viewChairID(data.lastPai[i].seatID);
                    this.showChupai(index,data.lastPai[i].pai);
                    this._turn++;
                }
                this.fapai(data.cards);
            
          
              
                var viewid = cc.vv.roomMgr.viewChairID(data.chuPaiPeople);
                if(viewid != 0){
                    this.waitclock.active = true;
                    this.waitclock.getComponentInChildren(cc.Label).string = 15;
                    this.schedule(this.otherTimeUpdate,1);
                    this.waitclock.x = alarmpos[viewid].x;
                    this.waitclock.y = alarmpos[viewid].y;
                    this.clearPoker(viewid);
                }
            }
            // this.showMainPoker(data.mainColor,this.nodeCard);
            break;
            case 97:{

            }
            break;
        }
        this.showPaiStage(data.pais)
        this.setZhuaFen(data.userScore)
        this.sanActionStage(data.zhaguStatus);
    },

    // isMain:function(value){
    //     var list = [];
    //     if(value == 0) return;
    //     for(var i = 0; i < this.mainArr.length; i++){
    //         if(value == this.mainArr[i]){
    //              list.push(value);
    //         }
    //     }
    //     return list;
    // },

    //播放音效
    playSFX(setaid,type){
        var sex = cc.vv.roomMgr.userSex(setaid);
        if(sex !='1' && sex!='2'){
            sex = '1';
        }
        var mp3File = "ddz/" + sex + "/" + type;
        cc.vv.audioMgr.playSFX(mp3File);
    },

 
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            
            case "btn_tishi":{
                this.pokerTip(this.tishipai);
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
            case "btn_buchu":{
                var pai = [];
                cc.vv.net2.quick('chupai',{list:pai});
            }
            break;
            case 'btn_1':{ // 没话
                cc.vv.net2.quick('meihua',{"userid":cc.vv.userMgr.userid});
            }
            break;
            case 'btn_2':{ //zhagu
                cc.vv.net2.quick('zhagu',{"userid":cc.vv.userMgr.userid});
            }
            break;
            case 'btn_3':{ // liangsan
                let list = this.getSelectToggle();
                cc.vv.net2.quick('liangsan',{"userid":cc.vv.userMgr.userid,"list":list});
            }
            break;
            case 'btn_4':{ // renshu
                cc.vv.net2.quick('touxiang',{"userid":cc.vv.userMgr.userid});
            }
            break;
        }
    },
    onBtnToggle(event){
        if(!this.actionData && this.actionData.length ==0){
            return;
        }
        let self = this;
        // meihua
        let btn_meihua = this.zhaGu.getChildByName('btn_1')
        let btn_zhagu = this.zhaGu.getChildByName('btn_2')
        let btn_liangsan = this.zhaGu.getChildByName('btn_3');
        btn_meihua.active = true;
        var check = event.isChecked;
        let selectlist = this.getSelectToggle();
        let filterHongSan = function(val){
            btn_zhagu.active = false;
            btn_liangsan.active = check; 
            if(selectlist.length == 0){
                return;
            }
            for(let i of selectlist){ //查选中的是否有其他红三
                if(i == val){
                    btn_liangsan.active = true;
                }
                if(self.sanHong && i== 3){
                    btn_meihua.active = false;
                }
            }
        }
        let filterHeiSan = function(){
            for(let j of self.actionData){
                if(j == 3 || j==19){
                    return
                }
            }
            btn_zhagu.active = !check;
            btn_liangsan.active = check;
           if(selectlist.length == 0){
                return;
            }
           
            for(let i of selectlist){ //查选中的是否有其他红三
                btn_liangsan.active = true;
                btn_zhagu.active = false;
                
            }
        }
        switch(event.node.name){
            case "3":{//方片
                filterHongSan(19);
            }
            break;
            //红桃
            case "19":{
                filterHongSan(3);  
            }
            break;
            //梅花
            case "35":
            //黑桃
            case "51":{
                filterHeiSan()
            }
            break;
        }
    },
    // 选中的3
    getSelectToggle(){
        let list = [];
        for(let node of this.zhaGuToggle){
            if(!node){
                return;
            }
            var toggle =  node.getComponent(cc.Toggle);
            if(toggle && toggle.isChecked){
                list.push(parseInt(node.name));
            }
        }
        return list;
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
        // this.mainArr = [];
        this.nodeCard.removeAllChildren();
        for(var i = 0; i < list.length; i++){
            var card = cc.instantiate(this.pokerPrefab);
            card.myTag = i;
            this.nodeCard.addChild(card);
            card.x = -570 + i*60;
            var spriteFrame = cc.vv.utils.getPokerSpriteFrame(this.poker1Atlas,list[i]);
            card.getChildByName('card').getComponent(cc.Sprite).spriteFrame = spriteFrame; 
            card.value = list[i];
            // if(list[i]%16 == 7){
            //     this.mainArr.push(list[i]);
            // }
            if(i == list.length -1){
                this.refreshHandCards();
            }
        }
        // this.showMainPoker(this.mainColor,this.nodeCard);
    },
    //界面关闭时
    onDestroy:function(){
        this._senceDestroy = true;
        cc.loader.setAutoRelease(this, true);
    }
});