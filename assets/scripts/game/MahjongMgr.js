
var ACTION_ = 1;
var ACTION_MOPAI  = 2;
var ACTION_PENG   = 3;
var ACTION_GANG   = 4;
var ACTION_HU     = 5;
var ACTION_ZIMO   = 6;
var ACTION_CHI    = 7;
var ACTION_BUHUA  = 8;

var ACTION_ANGANE   = 9;
var ACTION_DIANGANE = 10;
var ACTION_WANGGANE = 11;

var ACTION_ANGAME_SFYG     = 12;
var ACTION_DIANGANE_SFYG   = 13;
var ACTION_WANGGANE_SFYG   = 14;

cc.Class({
    extends: cc.Component,

    properties: {

        mahjongAltas:{
            default:null,
            type:cc.SpriteAtlas
        },

        pengPrefabSelf:{
            default:null,
            type:cc.Prefab
        },
        
        pengPrefabLeft:{
            default:null,
            type:cc.Prefab
        },
        
        pengPrefabRight:{
            default:null,
            type:cc.Prefab
        },
  
        saiziAltas:{
            default:null,
            type:cc.SpriteAtlas
        },

        holdsEmpty:{
            default:[],
            type:[cc.SpriteFrame]
        },

        _sides:null,
        _pres:null,
        _foldPres:null,
        _mahjongSprites:[],

        _turn:-1,       //当前位置
        _zhuang:-1,     //庄家
        _saizi_1:0,
        _saizi_2:0,
        _magicPai:-1,
        _magicPai2:-1,
        _seats:[],
        _numOfMJ:0,
        _liupaiCnt:0,
        _maxNumOfGames:0,
        _numOfGames:0,
        _isOver:true,
        _button:-1,
        _gamestate:-1,
        _canChui:false,
        _curaction:null,
        _baoting_index:-1,
    },

        /**
     * 回放预赋值
     */
    prepareReplay:function(baseInfo,userid){

        this._seats = [];

        //手牌
        for(var i = 0; i < cc.vv.roomMgr.table.list.length; ++i){
            var s = {};
            s.seatIndex = i;
            s.score = null;
            s.holds = baseInfo.game_seats[i];
            s.pengs = [];
            s.chis = [];
            s.huas =[];
            s.piaonum = 0;
            s.angangs = [];
            s.diangangs = [];
            s.wangangs = [];
            s.folds = [];

            if(userid == cc.vv.roomMgr.table.list[i].userid){
                cc.vv.roomMgr.seatid = i;
            }

            this._seats[i] = s;
        }
        
        //补充余牌
        if(baseInfo.numofmj){
            this._numOfMJ = baseInfo.numofmj;
            this._liupaiCnt = baseInfo.liupaiCnt;
        }

        this._gamestate = 3;
    },
     ////3d的牌改为2d牌
     getMahjongPaiThree:function(pai){
        if(pai == -3 || pai == -2 || pai ==  -1){
            return pai;
        }
        if(parseInt(pai / 10) == 0){
            pai -= 1;
        }else if(parseInt(pai / 10) == 1){
            pai -= 2;
        }else if(parseInt(pai / 10) == 2){
            pai -= 3;
        }else if(parseInt(pai / 10) == 3){
            pai -= 4;
        }
        return pai;
    },
    //播放音效
    playSFX(setaid,type){

        var sex = cc.vv.roomMgr.userSex(setaid);

        if(sex !='1' && sex!='2'){
            sex = '1';
        }

        var mp3File = "mj/" + sex + "/" + this.getMahjongPaiThree(type);
        cc.vv.audioMgr.playSFX(mp3File);
    },

    switchHuMp3:function(localIndex,name){
        
        switch(name){
            case "平胡":{
                this.playSFX(localIndex,"hu");
            }
            break;
            case "自摸":{
                this.playSFX(localIndex,"zimo");
            }
            break;
            case "七小对":
            case "七对":{
                this.playSFX(localIndex,"qidui");
            }
            break;
            case "清一色七小对":
            case "清一色七对":
            case "豪华七对":
            case "豪华七小对":{
                this.playSFX(localIndex,"haohuaqidui");
            }
            break;
            case "清一色":{
                this.playSFX(localIndex,"qinyise");
            }
            break;
            case "十三幺":{
                this.playSFX(localIndex,"shisanyao");
            }
            break;
            case "清一色一条龙":
            case "一条龙":{
                this.playSFX(localIndex,"yitaolong");
            }
            break;
            default:{
                this.playSFX(localIndex,"hu");
            }
        }
    },

    
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;
        
        //色子点数
        this.node.on('login_result',function(data){
            if(data.errcode === 0){
                data = data.data;
                self._seats = data.seats;
                self._isOver = false;
            }
        });

        //坐入位置
        this.node.on('sit',function(data){
           

                //进房失败，返回大厅
                if (data.errcode != 0) {
                    return;
                }

                data = data.data;

            // if(data.userid == cc.vv.userMgr.userid){
                self._seats[data.seatid].seatIndex = data.seatid;
                self._seats[data.seatid].userid = data.userid;
                self._seats[data.seatid].headimg = data.headimg;
            // }
        });

        //色子点数
        this.node.on('game_saizi_push',function(data){
            data = data.data;
            self._saizi_1 = data.saizi_1;
            self._saizi_2 = data.saizi_2;
            self.dispatchEvent('game_saizi',data);
        });

        //游戏同步
        this.node.on('game_sync_push',function(data){
            data = data.data;
            
            self._liupaiCnt=data.liupaiCnt;
            self._magicPai =  data.magicPai;
            self._magicPai2 =  data.magicPai2;
            self._saizi_1 = data.saizi_1;
            self._saizi_2 = data.saizi_2;
            self._gamestate = data.state;
            self._turn = data.turn;
            self._zhuang = data.zhuang;
            self._button = data.button;
            self._chupai = data.chuPai;
            self._numOfMJ = data.numofmj;

            for(var i = 0; i < cc.vv.roomMgr.ren; ++i){
                self._seats[i].baoTing_index=data.seats[i].m_bBaoTing_index;
                self._seats[i].status=data.seats[i].status;
                var seat = self._seats[i];
                var sd = data.seats[i];
                seat.baoting = sd.baoting;
                seat.holds = sd.holds;
                seat.folds = sd.folds;
                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                seat.pengs = sd.pengs;
                seat.chis  = sd.chis;
                seat.huas  = sd.huas;
                seat.hued = sd.hued; 
                seat.iszimo = sd.iszimo;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;
                if(i == self.seatIndex){
                    self.dingque = sd.que;
                }
           }

           self.dispatchEvent('game_sync',data);
        });
        
        //百搭牌通知
        this.node.on('game_magic_push',function(data){
            data = data.data;
            self._magicPai = data.magic;
            self._magicPai2 = data.magic2;
            self.dispatchEvent('game_magic',data);
        });

        //手牌
        this.node.on('game_holds_push',function(data){

            data = data.data;
            var seat = self._seats[cc.vv.roomMgr.seatid];
            seat.holds = data.holds;

            for (var i = 0; i < self._seats.length; ++i) {
                var s = self._seats[i];
                if (s.folds == null) {
                    s.folds = [];
                }
                if (s.pengs == null) {
                    s.pengs = [];
                }
                if (s.chis == null) {
                    s.chis = [];
                }
                if (s.huas == null) {
                    s.huas = [];
                }
                s.piaonum = 0;

                if (s.angangs == null) {
                    s.angangs = [];
                }
                if (s.diangangs == null) {
                    s.diangangs = [];
                }
                if (s.wangangs == null) {
                    s.wangangs = [];
                }
                s.ready = false;
            }

            self.dispatchEvent('game_holds');
        });

        //剩余麻将数
        this.node.on('mj_count_push',function(data){
            data = data.data;
            self.doMjCount(data.numOfMJ,data.liupaiCnt);
        });

        //游戏开始
        this.node.on('game_begin_push',function(data){
            data = data.data;
            self._button = data.button;
            self._turn = data.button;
            self._zhuang = data.zhuang;
            self._gamestate = 2;
            self.dispatchEvent('game_begin');
        });

        //游戏进行中
        this.node.on('game_playing_push',function(data){
            data = data.data;
            self._gamestate = 3;
            self.dispatchEvent('game_playing');
        });

        //通知出牌
        this.node.on('game_chupai_push',function(data){
            data = data.data;
            var si = cc.vv.roomMgr.getSeatIndexByID(data.userId);
            self.doTurnChange(si);
        });

        //通知谁出牌
        this.node.on('game_chupai_notify_push',function(data){
            data = data.data;
            var userId = data.userId;
            var pai = data.pai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            self.doChupai(si, pai,data.baoTing_index,data.baoting);
        });
        
        //动作
        this.node.on('game_action_push',function(data){
            data = data.data;
            self._curaction = data;
            self.dispatchEvent('game_action',data);
        });
        
        //胡牌通知
        this.node.on('hu_push',function(data){
            data = data.data;
            self.doHu(data);
        });

        //摸牌
        this.node.on('game_mopai_push',function(data){
            data = data.data;
            self.doMopai(cc.vv.roomMgr.seatid,data.pai,data.is_auto);
        });

        //过牌
        this.node.on('guo_notify_push',function(data){
            data = data.data;
            var userId = data.userId;
            var pai = data.pai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            self.doGuo(si, pai)
        });

        //碰牌
        this.node.on('peng_notify_push',function(data){
            data = data.data;
            var userId = data.userid;
            var pai = data.pai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            self.doPeng(si, data.pai);
        });

        //吃牌
        this.node.on('chi_notify_push',function(data){
            data = data.data;
            var userId = data.userid;
            var pai = data.pai; 
            var chiPai = data.chiPai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            self.doChi(si, data.pai, chiPai);
        });

        //杠牌
        this.node.on('gang_notify_push',function(data){
            data = data.data;
            var userId = data.userid;
            var pai = data.pai;
            var gangpai = data.gangpai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            self.doGang(si, pai, gangpai, data.gangtype);
        });
        
        //限制出牌
        this.node.on('chupai_limit_notify_push',function(data){
            self.dispatchEvent('chupai_limit_notify');
        });

        //报听动画+mp3
        this.node.on('baoting_notify_push',function(data){
            self.doTing(data.data);
        });
    },

    reset:function(){
        this._turn = -1;
        this._zhuang = -1;
        this._chupai = -1,
        this._button = -1;
        this._magicPai = -1;
        this._magicPai2 = -1;
        this._saizi_1 =-1,
        this._saizi_2 =-1,

        this._gamestate = -1;
        this._curaction = null;
        for(var i = 0; i < this._seats.length; ++i){
            this._seats[i].holds = [];
            this._seats[i].folds = [];
            this._seats[i].pengs = [];
            this._seats[i].chis  = [];
            this._seats[i].huas  = [];
            this._seats[i].piaonum = 0;
            this._seats[i].angangs = [];
            this._seats[i].diangangs = [];
            this._seats[i].wangangs = [];
            this._seats[i].dingque = -1;
            this._seats[i].ready = false;
            this._seats[i].hued = false;
            this._seats[i].huanpais = null;
            this._seats[i].baoting = true;
        }
    },
    
    dispatchEvent(event,data){
        if(this.node){
            this.node.emit(event,data);
        }    
    },

    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this._seats = null;
        }
    },

    //分发过
    doGuo:function(seatIndex,pai){
        var seatData = this._seats[seatIndex];
        var folds = seatData.folds;
        folds.push(pai);
        this.dispatchEvent('guo_notify',seatData);    
    },
    
    //分发摸牌
    doMopai:function(seatIndex,pai,is_auto){
        var seatData = this._seats[seatIndex];
        if(seatData.holds){
            seatData.holds.push(pai);
            this.dispatchEvent('game_mopai',{seatIndex:seatIndex,pai:pai,is_auto:is_auto});            
        }
    },
    
    //分发出牌
    doChupai:function(seatIndex,pai,baoTing_index,baoting){
        this._chupai = pai;
        var seatData = this._seats[seatIndex];
        seatData.seatIndex=seatIndex;
        this._seats[seatData.seatIndex].baoTing_index = baoTing_index;
        if(seatData.holds){             
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx,1);
        }
        this.dispatchEvent('game_chupai_notify',{seatData:seatData,pai:pai,baoTing_index:baoTing_index,baoting:baoting});    
    },

    //分发碰牌
    doMjCount:function(numOfMJ,liupaiCnt){
        this._numOfMJ = numOfMJ;
        this._liupaiCnt = liupaiCnt;
        this.dispatchEvent('mj_count',null);
    },
    
    //分发碰牌
    doPeng:function(seatIndex,pai){
        var seatData = this._seats[seatIndex];
        //移除手牌
        if(seatData.holds){
            for(var i = 0; i < 2; ++i){
                var idx = seatData.holds.indexOf(pai[1]);
                seatData.holds.splice(idx,1);
            }                
        }
            
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push(pai);
        this.dispatchEvent('peng_notify',seatData);
    },
    
    //分发吃牌
    doChi:function(seatIndex,pai,chiPai){

        var seatData = this._seats[seatIndex];
        //移除手牌
        if(seatData.holds){
            for(var i=1;i<chiPai.length;++i){
                if(chiPai[i] == pai){
                    continue;
                }

                var idx = seatData.holds.indexOf(chiPai[i]);
                if(idx == -1){  
                    continue;
                }
                seatData.holds.splice(idx,1);
            }       
        }

        //更新吃牌数据
        seatData.chis.push(chiPai);
       
        this.dispatchEvent('chi_notify',seatData);
    },

    //分发补花
    doBuhua:function(seatIndex,pai,piaonum) {
        var seatData = this._seats[seatIndex];
        //更新补花牌数据
        if(seatData.holds){
            var idx = seatData.holds.indexOf(pai);
            if(idx != -1){  
                seatData.holds.splice(idx,1);
            }
        }

        if(seatData.huas){
            seatData.huas.push(pai);
        }

        seatData.piaonum = piaonum;
        this.dispatchEvent('buhua_notify',seatData);
    },

    //杠类型
    getGangType:function(seatData,pai){
        if(seatData.pengs.indexOf(pai) != -1){
            return "wangang";
        }
        else{
            var cnt = 0;
            for(var i = 0; i < seatData.holds.length; ++i){
                if(seatData.holds[i] == pai){
                    cnt++;
                }
            }
            if(cnt == 3){
                return "diangang";
            }
            else{
                return "angang";
            }
        }
    },

    //听牌
    doTing:function(data){
        this.dispatchEvent('bao_ting_push',data);
    },
    
    //分发杠牌
    doGang:function(seatIndex,pai,gangActPais,gangtype){
        var seatData = this._seats[seatIndex];
        if(gangtype == ACTION_WANGGANE){
            for(var idx =0;idx < seatData.pengs.length;++idx){
                if(seatData.pengs[idx][1] == pai){
                    seatData.pengs.splice(idx,1);
                    break;
                }
            }
        }

        if(seatData.holds){
            if(gangtype == ACTION_ANGANE 
                || gangtype == ACTION_ANGAME_SFYG 
                || gangtype == ACTION_DIANGANE 
                || gangtype == ACTION_WANGGANE){
                for(var i = 1; i <= gangActPais.length; ++i){
                    var idx = seatData.holds.indexOf(gangActPais[i]);
                    if(idx == -1){
                       continue;
                    }
                    seatData.holds.splice(idx,1);
                }
            }

            if(gangtype == ACTION_DIANGANE_SFYG){
                for(var i = 1; i <= gangActPais.length; ++i){

                    if(gangActPais[i] == pai)
                    {
                        continue;
                    }

                    var idx = seatData.holds.indexOf(gangActPais[i]);
                    if(idx == -1)
                    {   
                        continue;
                    }
                    seatData.holds.splice(idx,1);
                }
            }
        }

        if(ACTION_ANGANE == gangtype || gangtype == ACTION_ANGAME_SFYG )
        {
            seatData.angangs.push(gangActPais);
        }
        else if(ACTION_DIANGANE == gangtype || gangtype ==ACTION_DIANGANE_SFYG)
        {
            seatData.diangangs.push(gangActPais);
        }
        else if(ACTION_WANGGANE_SFYG == gangtype || ACTION_WANGGANE == gangtype)
        {
            seatData.wangangs.push(gangActPais);
        }
        
        this.dispatchEvent('gang_notify',{seatData:seatData,gangtype:gangtype});
    },

    //胡
    doHu:function(data){
        this.dispatchEvent('hupai',data);
    },
    
    //下个操作
    doTurnChange:function(si){
        var data = {
            last:this._turn,
            turn:si,
        }
        this._turn = si;
        this.dispatchEvent('game_chupai',data);
    },

    onLoad:function(){

        if(cc.vv == null){
            return;
        }

        switch(cc.vv.roomMgr.ren){
            case 4:{
                this._sides = ["myself","right","up","left"];
                this._pres = ["M_","R_","B_","L_"];
                this._foldPres = ["B_","R_","B_","L_"];
            }
            break;
            case 3:{
                this._sides = ["myself","right","left"];
                this._pres = ["M_","R_","L_"];
                this._foldPres = ["B_","R_","L_"];
            }
            break;
            case 2:{
                this._sides = ["myself","up"];
                this._pres = ["M_","B_"];
                this._foldPres = ["B_","B_"];
            }
            break;
        }

        
        //筒
        for(var i = 1; i < 10; ++i){
            this._mahjongSprites.push("B" + i);        
        }
        
        //条
        for(var i = 1; i < 10; ++i){
            this._mahjongSprites.push("T" + i);
        }
        
        //万
        for(var i = 1; i < 10; ++i){
            this._mahjongSprites.push("W" + i);
        }
        

        //东南西北风
        this._mahjongSprites.push("F2");
        this._mahjongSprites.push("F3");
        this._mahjongSprites.push("F4");
        this._mahjongSprites.push("F5");

        //中、发、白
        this._mahjongSprites.push("F1");
        this._mahjongSprites.push("F6");
        this._mahjongSprites.push("F7");

        //春夏秋冬
        this._mahjongSprites.push("J1");
        this._mahjongSprites.push("J2");
        this._mahjongSprites.push("J3");
        this._mahjongSprites.push("J4");
        //菊兰梅竹
        this._mahjongSprites.push("H3");
        this._mahjongSprites.push("H2");
        this._mahjongSprites.push("H1");
        this._mahjongSprites.push("H4");

        //监听事件
        this.initEventHandlers();
    },
    
    getMahjongSpriteByID:function(id){
        return this._mahjongSprites[id];
    },
    
    //返回麻将类型
    getMahjongType:function(id){
      if(id >= 0 && id < 9){
          return 0;
      }
      else if(id >= 9 && id < 18){
          return 1;
      }
      else if(id >= 18 && id < 27){
          return 2;
      }
    },
    
    //返回麻将图
    getSpriteFrameByMJID:function(pre,mjid){
        var spriteFrameName = this.getMahjongSpriteByID(this.getMahjongPaiThree(mjid));
        return this.mahjongAltas.getSpriteFrame(spriteFrameName);
    },
    
    //返回色子图
    getSpriteFrameBySaiZiID:function(saiziId){
        var spriteFrameName = "shaizi"+saiziId;
        return this.saiziAltas.getSpriteFrame(spriteFrameName);
    },

    //返回音效
    getAudioURLByMJID:function(id){
        var id = this.getMahjongPaiThree(id);
        var realId = 0;
        if(id >= 0 && id < 9){
            realId = id + 21;
        }
        else if(id >= 9 && id < 18){
            realId = id - 8;
        }
        else if(id >= 18 && id < 27){
            realId = id - 7;
        }else if(id >= 27 && id < 34){
            realId = id + 4;
        }
        return realId;
    },
    
    //返回盖下牌图
    getEmptySpriteFrame:function(side){
        if(side == "up"){            
            return this.mahjongAltas.getSpriteFrame("tilebg_2_2");
        }   
        else if(side == "myself"){
            return this.mahjongAltas.getSpriteFrame("tilebg_2_2");
        }
        else if(side == "left"){
            return this.mahjongAltas.getSpriteFrame("tilebg_1_2");
        }
        else if(side == "right"){
            return this.mahjongAltas.getSpriteFrame("tilebg_1_2");
        }
    },
    
    //返回空底图
    getBgSpriteFrame:function(side){
         if(side == "up"){            
            return this.mahjongAltas.getSpriteFrame("tilebg_2_0");            
        }   
        else if(side == "myself"){
            return this.mahjongAltas.getSpriteFrame("tilebg_2_0");
        }
        else if(side == "left"){
            return this.mahjongAltas.getSpriteFrame("tilebg_1_0");
        }
        else if(side == "right"){
            return this.mahjongAltas.getSpriteFrame("tilebg_1_0");
        }
    },

    //返回空白图
    getHoldsEmptySpriteFrame:function(side){
        if(side == "up"){
            return this.mahjongAltas.getSpriteFrame("tilebg_2_1");
        }   
        else if(side == "myself"){
            return null;
        }
        else if(side == "left"){
            return this.mahjongAltas.getSpriteFrame("tilebg_1_1");
        }
        else if(side == "right"){
            return this.mahjongAltas.getSpriteFrame("tilebg_1_1");
        }
    },
    //返回倒扣底图
    getBackSpriteFrame:function(side){
        if(side == "up" || side == "myself"){            
        return this.mahjongAltas.getSpriteFrame("tilebg_0_2");            
    }   
    else if(side == "left" || side == "right"){
        return this.mahjongAltas.getSpriteFrame("tilebg_1_2");
    }else if(side == "defaultum"){
        return this.mahjongAltas.getSpriteFrame("tilebg_2_0");
    }else if(side == "defaultlr"){
        return this.mahjongAltas.getSpriteFrame("tilebg_1_0");
    }
    },
    //吃上家位置
    getTargetSide:function(seatData,targetIndex){

        var targetSide = -1;
            //下家
        var nextIs = (seatData.seatIndex + 1) % cc.vv.roomMgr.ren; 
        //对家
        var faceIs = (seatData.seatIndex + 2) % cc.vv.roomMgr.ren;
        //上家 
        var lastIs = (seatData.seatIndex + 3) % cc.vv.roomMgr.ren;
        
        if(targetIndex == nextIs){
            targetSide = 2;
        }
        else if(targetIndex == faceIs){
            targetSide = 1;
        }
        else if(targetIndex == lastIs){
            targetSide = 0;
        }
        else{
            targetSide = -1;
        }
        return targetSide;
    },
    
    //排序麻将
    sortMJ:function(mahjongs,magicpai){
        var self = this;
        mahjongs.sort(function(a,b){
            if(magicpai >= 0){
	        if(magicpai == a){
	            return -1;
                }
                else if(magicpai == b){
                    return 1;
                }
            }

            return a - b;
        });
    },
    sort_Double_MJ:function(mahjongs,magicpai,magicpai2){
        var self = this;
        mahjongs.sort(function(a,b){
            if(magicpai >= 0 || magicpai2>=0){
                if((magicpai == a && magicpai2 == b) || (magicpai == b && magicpai2 == a)){
                    return a - b;
                }
                if(magicpai == a || magicpai2 == a){
                    return -1;
                }
                else if(magicpai == b || magicpai2 == b){
                    return 1;
                }
            }

            return a - b;
        });
    },
    //返回位置标识
    getSide:function(localIndex){
        return this._sides[localIndex];
    },
    
    getPre:function(localIndex){
        return this._pres[localIndex];
    },
    
    getFoldPre:function(localIndex){
        return this._foldPres[localIndex];
    }
});
