var ACTION_ANGANE   = 9;
var ACTION_DIANGANE = 10;
var ACTION_WANGGANE = 11;

var ACTION_ANGAME_SFYG     = 12;
var ACTION_DIANGANE_SFYG   = 13;
var ACTION_WANGGANE_SFYG   = 14;
cc.Class({
    extends: cc.Component,

    properties: {

        pengPrefabSelf:{
            default:null,
            type:cc.Prefab
        },

        _sides:null,
        _pres:null,
        _foldPres:null,
        _fangxiang:null,
        _mahjongSprites:[],

        _turn:-1,       //当前位置
        _last:-1,   //上一次操作者的位置
        _zhuang:-1,     //庄家
        _saizi_1:0,     //色子数1    
        _saizi_2:0,     //色子数2
        _magicPai:-1,    //宝牌
        _magicPai2:-1,   //宝牌2
        _seats:[],      //座位信息
        _numOfMJ:0,     //剩余麻将数
        _liupaiCnt:0,  
        _maxNumOfGames:0,
        _numOfGames:0,
        _isOver:true,
        _button:-1,
        _gamestate:-1,
        _canChui:false,
        _curaction:null,
        _baoting_index:-1,
        _oldholds:[],
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
                this._fangxiang = ["nan", "dong", "bei", "xi"];
            }
            break;
            case 3:{
                this._sides = ["myself","right","left"];
                this._pres = ["M_","R_","L_"];
                this._foldPres = ["B_","R_","L_"];
                this._fangxiang = ["nan", "dong", "xi"];
            }
            break;
            case 2:{
                this._sides = ["myself","up"];
                this._pres = ["M_","B_"];
                this._foldPres = ["B_","B_"];
                this._fangxiang = ["nan", "bei"];
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

        /**
     * 回放预赋值
     */
    prepareReplay:function(baseInfo,userid){

        this._seats = [];
        
        if(baseInfo.zhuang != null){
            this._zhuang = baseInfo.zhuang;
            this._turn = baseInfo.zhuang;
        }
        
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
            s.chipenggang = [];

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

    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;

        this.node.on('login_result',function(data){
            if(data.errcode === 0){
                data = data.data;
                self._seats = data.seats;
                self._isOver = false;
                self.reset();
            }
        });

        //坐入位置
        this.node.on('sit',function(data){
            data = data.data;
            if(self._seats[data.seatid] == null){
                return;
            }
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

        //百搭牌通知
        this.node.on('game_magic_push',function(data){
            data = data.data;
            self._magicPai = data.magic;
            self.dispatchEvent('game_magic',data);
        });

        //动作
        this.node.on('game_action_push',function(data){
            data = data.data;
            self._curaction = data;
            self.dispatchEvent('game_action',data);
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
                //0吃 1碰 2暗杠 3明杠 4弯杠
                if(s.chipenggang == null){
                    s.chipenggang = [];
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

        //通知操作者
        this.node.on('game_chupai_push',function(data){
            data = data.data;
            if(cc.vv.mahjongMgr._turn == cc.vv.roomMgr.seatid){
                if(data.game_action_push != null){
                    self._curaction = data.game_action_push;
                }
                
                if(data.game_action_ting != null && data.game_action_ting.data != null){
                    cc.vv.game.majiangTable._datating = data.game_action_ting.data;
                }
            }
            var si = cc.vv.roomMgr.getSeatIndexByID(data.userId);
            self.doTurnChange(si, data);
        });

        //通知出牌
        this.node.on('game_chupai_notify_push',function(data){
            data = data.data;
            var userId = data.userId;
            var pai = data.pai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            if(si == -1){
                return;
            }
            if(!cc.vv.game.majiangTable._baotingchupai){
                if(si == cc.vv.roomMgr.seatid)return;
            }
            self.doChupai(si, pai,data.baoTing_index,data.baoting,data.index);
        });

        //摸牌
        this.node.on('game_mopai_push',function(data){
            data = data.data;
            //{"errcode":0,"data":{"is_auto":0,"pai":4},"errmsg":"ok","model":"game","event":"game_mopai_push"}
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
            self.doPeng(si, pai);
        });

        //吃牌
        this.node.on('chi_notify_push',function(data){
            data = data.data;
            var userId = data.userid;
            var pai = data.pai; 
            var chiPai = data.chiPai;
            var si = cc.vv.roomMgr.getSeatIndexByID(userId);
            self.doChi(si, pai, chiPai);
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
            data = data.data;
            self.doTing(data);
        });

        //胡牌通知
        this.node.on('hu_push',function(data){
            data = data.data;
            self.doHu(data);
        });

        //显示过胡
        this.node.on('guohu',function(data){
            data = data.data;
            self.doGuoHu(data);
        });
        
        //游戏同步
        this.node.on('game_sync_push',function(data){
            data = data.data;
            self.reset();
            self._liupaiCnt=data.liupaiCnt;
            self._magicPai =  data.magicPai;
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
                seat.m_bBaoTing_index = sd.m_bBaoTing_index;
                seat.chipenggang = [];

                for (var indexangangs = 0; indexangangs < seat.angangs.length; indexangangs++) {
                    var angangs = seat.angangs[indexangangs];
                    seat.chipenggang.push([2, angangs]);
                }
                for (var indexdiangangs = 0; indexdiangangs < seat.diangangs.length; indexdiangangs++) {
                    var diangangs = seat.diangangs[indexdiangangs];
                    seat.chipenggang.push([3, diangangs]);
                }

                for (var indexwangangs = 0; indexwangangs < seat.wangangs.length; indexwangangs++) {
                    var wangangs = seat.wangangs[indexwangangs];
                    seat.chipenggang.push([4, wangangs])
                }
                var pengsLength = seat.pengs.length;
                for (var indexpengs = 0; indexpengs < pengsLength; indexpengs++) {
                    var pengs = seat.pengs[indexpengs];
                    var indexBack = self.arrayReturn(seat.wangangs, pengs);
                    if(indexBack != -1){
                        seat.pengs.splice(indexpengs, 1);
                    }else{
                        seat.chipenggang.push([1, pengs])
                    }
                }

                for (var indexchis = 0; indexchis < seat.chis.length; indexchis++) {
                    var chis = seat.chis[indexchis];
                    seat.chipenggang.push([0, chis])
                }
                if(i == self.seatIndex){
                    self.dingque = sd.que;
                }
           }

           self.dispatchEvent('game_sync',data);
        });
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
    doChupai:function(seatIndex,pai,baoTing_index,baoting,index){
        this._chupai = pai;
        var seatData = this._seats[seatIndex];
        seatData.seatIndex=seatIndex;
        this._seats[seatData.seatIndex].baoTing_index = baoTing_index;
        if(seatData.holds){
            var idx = seatData.holds.indexOf(pai);
            var startIndex = cc.vv.game.getStartIndex(seatData.holds);
            if(cc.vv.roomMgr.is_replay){
                index = startIndex + idx;
            }
            if(seatIndex == cc.vv.roomMgr.seatid){
                this._oldholds = cc.vv.utils.deepCopy(seatData.holds);
            }
            seatData.holds.splice(idx,1);
        }
        this.dispatchEvent('game_chupai_notify',{seatData:seatData,pai:pai,baoTing_index:baoTing_index,baoting:baoting,index:index});    
    },

    //分发剩余麻将数
    doMjCount:function(numOfMJ,liupaiCnt){
        this._numOfMJ = numOfMJ;
        this._liupaiCnt = liupaiCnt;
        this.dispatchEvent('mj_count',null);
    },

    //下个操作的人
    doTurnChange:function(si, data){
        var data = {
            last:this._turn,
            turn:si,
            data:data
        }
        this._last = this._turn;
        this._turn = si;
        this.dispatchEvent('game_chupai',data);
    },

    //分发过
    doGuo:function(seatIndex,pai){
        var seatData = this._seats[seatIndex];
        this.dispatchEvent('guo_notify',seatData);    
    },

    //分发碰牌
    doPeng:function(seatIndex,pai){
        var seatData = this._seats[seatIndex];
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push(pai);
        var chipenggang = seatData.chipenggang;
        chipenggang.push([1, pai]);
        //移除手牌
        if(seatData.holds){
            for(var i = 0; i < 2; ++i){
                var idx = seatData.holds.indexOf(pai[1]);
                seatData.holds.splice(idx,1);
            }                
        }
        this.removeChupai(pai[0]);
        this.dispatchEvent('peng_notify',{seatData:seatData, pengpai:pai});
    },

    //分发吃牌
    doChi:function(seatIndex,pai,chiPai){

        var seatData = this._seats[seatIndex];
        //更新吃牌数据
        seatData.chis.push(chiPai);
        var chipenggang = seatData.chipenggang;
        chipenggang.push([0, pai]);
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
        this.removeChupai(pai[0]);
        this.dispatchEvent('chi_notify',{seatData:seatData, chipai:pai});
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

        if(ACTION_ANGANE == gangtype || gangtype == ACTION_ANGAME_SFYG )
        {
            seatData.angangs.push(gangActPais);
            seatData.chipenggang.push([2, gangActPais]);
        }
        else if(ACTION_DIANGANE == gangtype || gangtype ==ACTION_DIANGANE_SFYG)
        {
            seatData.diangangs.push(gangActPais);
            seatData.chipenggang.push([3, gangActPais]);
            this.removeChupai(gangActPais[0]);
        }
        else if(ACTION_WANGGANE_SFYG == gangtype || ACTION_WANGGANE == gangtype)
        {
            seatData.wangangs.push(gangActPais);
            var chipenggang = seatData.chipenggang;
            for (var index = 0; index < chipenggang.length; index++) {
                if(chipenggang[index][0] == 1 && chipenggang[index][1][1] == pai){
                    chipenggang[index][0] = 4;
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
        this.dispatchEvent('gang_notify',{seatData:seatData,gangtype:gangtype, gangpai:gangActPais});
    },

    //听牌
    doTing:function(data){
        this.dispatchEvent('bao_ting_push',data);
    },

    //胡
    doHu:function(data){
        data.turn = this._turn;
        data.foldslength = -1;
        if(data.turn != -1){
            var seatDataFolds = cc.vv.mahjongMgr._seats[data.turn];
            var folds = seatDataFolds.folds;
            var foldslength = folds.length;
            data.foldslength = foldslength;
        }
        this.dispatchEvent('hupai',data);
    },

    doGuoHu:function(data){
        this.dispatchEvent('guohu_game',data);
    },

    doHujiaozhuanyi:function(data){
        var seatid = data.seatid;
        var seatDataFolds = cc.vv.mahjongMgr._seats[seatid];
        var holds = seatDataFolds.holds;
        holds.pop();
        this.dispatchEvent('hujiaozhuanyi_game',data);
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
    
    //播放音效
    playSFX(setaid,type){

        var sex = cc.vv.roomMgr.userSex(setaid);

        if(sex !='1' && sex!='2'){
            sex = '1';
        }

        var mp3File = "mj/" + sex + "/" + type;
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

    reset:function(){
        this._turn = -1;
        this._last = -1;
        this._zhuang = -1;
        this._chupai = -1,
        this._button = -1;
        this._magicPai = -1;
        this._saizi_1 =-1,
        this._saizi_2 =-1,

        this._gamestate = -1;
        this._curaction = null;
        for(var i = 0; i < this._seats.length; ++i){
            this._seats[i].holds = [];
            this._seats[i].folds = [];
            this._seats[i].pengs = [];
            this._seats[i].chipenggang = [];
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
    
    //服务端的牌改为客户端牌
    getMahjongPai:function(pai){
        if(pai == -3 || pai == -2 || pai ==  -1){
            return pai;
        }
        //筒1-9 条11-19 万121-29  ====》 万 1-9 筒11-19 条21-29 
        if(parseInt(pai / 10) == 0){
            pai += 10;
        }else if(parseInt(pai / 10) == 1){
            pai += 10;
        }else if(parseInt(pai / 10) == 2){
            pai -= 20;
        }
        return pai;
    },

    ////客户端的牌改为服务端牌
    getMahjongPaiReturn:function(pai){
        if(pai == -3 || pai == -2 || pai ==  -1){
            return pai;
        }
        if(parseInt(pai / 10) == 0){
            pai += 20;
        }else if(parseInt(pai / 10) == 1){
            pai -= 10;
        }else if(parseInt(pai / 10) == 2){
            pai -= 10;
        }
        return pai;
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

    //返回音效
    getAudioURLByMJID:function(id){
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
    sortMJ:function(mahjongs,magicpai,magicpai2){
        var self = this;
        if(magicpai2 <= 0){
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
        }else{
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
        }
    },

    //返回位置标识
    getSide:function(localIndex){
        return this._sides[localIndex];
    },

    getFangxiang:function(localIndex){
        return this._fangxiang[localIndex];
    },

    getPre:function(localIndex){
        return this._pres[localIndex];
    },
    
    getFoldPre:function(localIndex){
        return this._foldPres[localIndex];
    },

    getSeatidByFangxiang:function(fangxiang){
        var seatid = 0;
        for (var index = 0; index < this._fangxiang.length; index++) {
            var fang = this._fangxiang[index];
            if(fangxiang == fang){
                seatid = index;
            }
        }
        return seatid;
    },

    getViewidBySide:function(side){
        var _sides = this._sides;
        for (var index = 0; index < _sides.length; index++) {
           if(_sides[index] == side){
                return index;
           }
        }
    },

    //返回碰杠所占牌数
    getNumberPai:function(seatid){
        var seatData = this._seats[seatid];
        var num = 0;
        if(seatData.pengs != null){   
            num += seatData.pengs.length;
        }
        if(seatData.angangs != null){
            num += seatData.angangs.length;
        }
        if(seatData.diangangs != null){
             num += seatData.diangangs.length;
        }
        if(seatData.wangangs != null){
            num += seatData.wangangs.length;
        }
        if(seatData.chis != null){
            num += seatData.chis.length;
        }
        num = num * 3;
        return num;
    },
    
    //出掉已加入出牌堆的牌
    removeChupai:function(seatid){
        var foldsSeatid = seatid;
        if(foldsSeatid){
            var foldsSeatid = cc.vv.mahjongMgr._turn;
        }
        var foldsSeatData = this._seats[foldsSeatid];
        //移除出牌堆的牌
        if(foldsSeatData && foldsSeatData.folds){
            foldsSeatData.folds.pop();
        }
    },  

    //获取牌堆中弯杠的顺序号
    getWangIndex:function(seatData, pai){
        var chipenggang = seatData.chipenggang;
        for (var index = 0; index < chipenggang.length; index++) {
            if(chipenggang[index][0] == 4 && chipenggang[index][1][1] == pai){
                return index;
            }
        }
    },
    //2d
    //返回空底图
    getBgSpriteFrame:function(side){
        if(side == "up"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("Frame_ziji_dachupai_4");      
       }   
       else if(side == "myself"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("Frame_ziji_dachupai_4");
       }
       else if(side == "left"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("Frame_ziji_dachupai_4");
       }
       else if(side == "right"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("Frame_ziji_dachupai_4");
       }
   },

    //返回麻将图
    getSpriteFrameByMJID:function(pre,mjid){
        var altas = cc.vv.game.majiangTable.selfhandAtlasThreeD;
        var altasName = "img_cardvalue";
        var pai = cc.vv.mahjongMgr.getMahjongPai(mjid);
        var sprite = altas.getSpriteFrame(altasName + pai);
        return sprite;
    },

    
    //返回盖下牌图
    getEmptySpriteFrame:function(side){
        if(side == "up"){            
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("zhengmian");
        }   
        else if(side == "myself"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("zhengmian");
        }
        else if(side == "left"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("zhengmian");
        }
        else if(side == "right"){
            var altas =  cc.vv.game.majiangTable.selfhandAtlasThreeD;
            return altas.getSpriteFrame("zhengmian");
        }
    },

    //数组查询(只用于查询碰杠)
    arrayReturn:function(array, item){
        var returnIndex = -1;
        for (var index = 0; index < array.length; index++) {
            if(item[1] == array[index][1]){
                returnIndex = index;
            }
        }
        return returnIndex;
    }
});
