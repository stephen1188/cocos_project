cc.Class({
    extends: cc.Component,
    editor: {
        executionOrder: 99
    },
    properties: {
        seatPrefab:cc.Prefab,
        club_tip:cc.Prefab,
        interactAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
  
        //以下
        _lastTouchTime:null,
        _voice:null,
        _volume:null,
        _voice_failed:null,
        _lastCheckTime:-1,
        _timeBar:null,
        _MAX_TIME:15000,
        _voiceMsgQueue:[],
        //以上是语音变量
        _winHub:cc.Node,
        _winReady:cc.Node,
        _winPlayer:cc.Node,
        _winDissroom:cc.Node,
        _clubtipnode:cc.Node,
        _dissroom_plase:false,
        _endTime:-1,//胜点不足 自动解散房间 剩余时间变量—
        _surplus_time_lbl:cc.Label,
        gamebg:cc.Sprite,
        _senceTableDestroy:false, // 当前场景是否被销毁
    },
    onLoad() {
        this.is_disssroom_show = false;
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        if (!cc.vv) {
            cc.director.loadScene("splash");
            return;
        }

        this.addComponent("IphoneX");
        this._winHub = cc.find("Canvas/mgr/hud");
        this._winReady = cc.find("Canvas/mgr/ready");
        this._winPlayer = cc.find("Canvas/mgr/players");
        this.onloadyuyin();

        var scene = cc.director.getScene();
        var usedbg = cc.sys.localStorage.getItem(scene.name + 'usedbg');
        // if(usedbg == null){
        //     usedbg = 'tablecloth_1';
        //     cc.sys.localStorage.setItem('usedbg',usedbg);
        // }

        var self = this;
        this.node.on('changebg',function(ret){
            var data = ret;
            self.getBg(data.bg);
        });
        
        this.node.on('jgnnready',function(){
            //
            var event = {};
            event.target = {};
            event.target.name = "btn_ready";
            self.onBtnClicked(event);
        });

        if(cc.vv.game != null){

            if(cc.vv.game.config.set_bg && usedbg != null){
                this.getBg(usedbg);
            }
            
            if(cc.vv.game.config.location){
                this._winHub._Location = cc.find("Canvas/open/Location");
            }
        }
        
        cc.director.preloadScene("hall");
    },

    getBg:function(usedbg){
        var self = this;
        var url = cc.vv.game.config.default_bg;
        if(usedbg != "tablecloth_moren"){
            url = "public/table/" + usedbg;
        }
        cc.loader.loadRes(url, function (err, tex) {
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            self.gamebg.spriteFrame = spriteFrame;
            self.gamebg.node.width = self.node.width;
        });
    },

    //监听发送语音按钮
    onloadyuyin:function()
    {
        this._voice = cc.find("Canvas/mgr/hud/oper/Voice");
        this._voice.active = false;
        
        this._voice_failed = cc.find("Canvas/mgr/hud/oper/Voice/voice_failed");
        this._voice_failed.active = false;
        
        this._timeBar = cc.find("Canvas/mgr/hud/oper/Voice/time");
        this._timeBar.scaleX = 0.0;

        this._volume = cc.find("Canvas/mgr/hud/oper/Voice/volume");
        for(var i = 1; i < this._volume.children.length; ++i){
            this._volume.children[i].active = false;
        }
        
        var btn_Voice = cc.find("Canvas/mgr/hud/oper/Voice/voice_failed/btn_ok");
        if(btn_Voice){
            cc.vv.utils.addClickEvent(btn_Voice,this.node,"Table","onBtnOKClicked");
        }
        var self = this;

        var btnVoice = cc.find("Canvas/mgr/hud/oper/btn_yuyin");
        if (btnVoice)
        {
            btnVoice.on(cc.Node.EventType.TOUCH_START,function(){
               // cc.vv.log3.debug("cc.Node.EventType.TOUCH_START");
                cc.vv.voiceMgr.prepare("record.amr");
                self._lastTouchTime = Date.now();
                self._voice.active = true;
                self._voice_failed.active = false;
            });
            btnVoice.on(cc.Node.EventType.TOUCH_MOVE,function(){
               // cc.vv.log3.debug("cc.Node.EventType.TOUCH_MOVE");
            });
            btnVoice.on(cc.Node.EventType.TOUCH_END,function(){
                //cc.vv.log3.debug("cc.Node.EventType.TOUCH_END");
                if(Date.now() - self._lastTouchTime < 1000){
                    self._voice_failed.active = true;
                    cc.vv.voiceMgr.cancel();
                }
                else{
                    self.onVoiceOK();
                }
                self._lastTouchTime = null;
            });
            btnVoice.on(cc.Node.EventType.TOUCH_CANCEL,function(){
               // cc.vv.log3.debug("cc.Node.EventType.TOUCH_CANCEL");
                cc.vv.voiceMgr.cancel();
                self._lastTouchTime = null;
                self._voice.active = false;
            });

        }
    },
    onVoiceOK:function(){
        if(this._lastTouchTime != null){
            cc.vv.voiceMgr.release();
            var time = Date.now() - this._lastTouchTime;
            var msg = cc.vv.voiceMgr.getVoiceData("record.amr");
            cc.vv.net2.quick("voice",{msg:msg,time:time});
        }
        this._voice.active = false;
    },
    
    onBtnOKClicked:function(){
        this._voice.active = false;
    },
    onVoiceTimeAction:function()
    {
        if(this._voice.active == true && this._voice_failed.active == false){
            if(Date.now() - this._lastCheckTime > 300){
                for(var i = 0; i < this._volume.children.length; ++i){
                    this._volume.children[i].active = false;
                }
                var v = cc.vv.voiceMgr.getVoiceLevel(7);
                if(v >= 1 && v <= 7){
                    this._volume.children[v-1].active = true;   
                }
                this._lastCheckTime = Date.now();
            }
        }
        
        if(this._lastTouchTime){
            var time = Date.now() - this._lastTouchTime;
            if(time >= this._MAX_TIME){
                this.onVoiceOK();
                this._lastTouchTime = null;
            }
            else{
                var percent = time / this._MAX_TIME;
                this._timeBar.scaleX = 1 - percent;
            }
        }
    },
    update: function (dt) {
        this.onVoiceTimeAction();
        this.onVoice();
        //this.auto_dismssroom();
    },
    auto_dismssroom:function(){
        if(this._endTime > 0){
            var lastTime = (this._endTime - Date.now()) / 1000;
            if(lastTime <= 0){
                this._endTime = -1;
                this._surplus_time_lbl.string = '0秒后自动解散房间';
            }
            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);
            
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            
            this._surplus_time_lbl.string = str + s + '秒后自动解散房间';
        }
    },
    onVoice:function()
    {
        var minutes = Math.floor(Date.now()/1000/60);
        if(this._lastMinute != minutes){
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10? "0"+h:h;
            
            var m = date.getMinutes();
            m = m < 10? "0"+m:m;
           // this._timeLabel.string = "" + h + ":" + m;             
        }
        
        
        if(this._lastPlayTime != null){
            if(Date.now() > this._lastPlayTime + 200){
                this.onPlayerOver();
                this._lastPlayTime = null;    
            }
        }
        else{
            this.playVoice();
        }

    },
    
    start() {

        this.initEventHandlers();
        
        if(!cc.vv.roomMgr.is_replay){
            //创建座位
            this.seat();
        }
        //让显示层初始化
        this._winHub.emit("enter", cc.vv.roomMgr.enter);
        //如果是回放
        if(cc.vv.roomMgr.is_replay){
            this._winReady.active = false;
        }
        //如果是回放
        if(!cc.vv.roomMgr.is_replay){
            if(cc.vv.roomMgr.room_type == "ysz_2300" || cc.vv.roomMgr.room_type == "nn_1000" || cc.vv.roomMgr.room_type == "tjd_1300"
            || cc.vv.roomMgr.room_type == "ttz_1400" || cc.vv.roomMgr.room_type == "ttz_1401"|| cc.vv.roomMgr.room_type == "dsg_2100"|| cc.vv.roomMgr.room_type == "zpj_2800"
            || cc.vv.roomMgr.room_type == "ttz_1402" || cc.vv.roomMgr.room_type == "nn_1002" || cc.vv.roomMgr.room_type == "nn_1003"){
                //进入房间后，即发送进入命令
                cc.vv.net2.quick("joinRoom", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude
                });
            }else if(cc.vv.game.config.isSelectSit){
                cc.vv.net2.quick("table");
            }else{
                //进入房间后，即发送进入命令
                cc.vv.net2.quick("sit", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude
                });
            }
        }
    },
    needSit:function(){
        //进入房间后，即发送进入命令
        cc.vv.net2.quick("sit", {
            room_id: cc.vv.roomMgr.roomid,
            location:cc.vv.global.latitude + "," + cc.vv.global.longitude
        });
        this.node.getChildByName("sit").active = false;
    },
    join_rooom:function(){
        //进入房间后，即发送进入命令
        console.log('join_rooom...................')
        cc.vv.net2.quick("sit", {
            room_id: cc.vv.roomMgr.roomid,
            location:cc.vv.global.latitude + "," + cc.vv.global.longitude
        });
        //this.node.getChildByName("sit").active = false;
    },
    //创建座位
    seat: function () {
        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];
        for (var i = 0; i < cc.vv.roomMgr.ren; ++i) {
            var node = cc.instantiate(this.seatPrefab);
            this._winPlayer.addChild(node);

            //使用配置，对子部件位置修改
            node.myTag = i;
            node.getComponent("Seat").pos(pos[i]);

            //如果禁止显示未坐人的坐位
            if (cc.vv.game.config.hide_nothing_seat) {
                node.active = false;
            }
        }
    },

    //IP相同检查
    ip_check() {

        if (!cc.vv.roomMgr.table)return;
        if(cc.vv.roomMgr.started == 1)return;
        
        //如果是回放
        if(cc.vv.roomMgr.is_replay)return;

        var seats = cc.vv.roomMgr.table.list;

        var list = [];

        for (var i = 0; i < seats.length; i++) {

            var seatDataA = seats[i];
            if (!seatDataA.ip) continue;
            var item = {
                ip: seatDataA.ip,
                names: [seatDataA.nickname]
            }

            for (var j = i + 1; j < seats.length; j++) {
                var seatDataB = seats[j];
                if (seatDataB.userid == 0) continue;
                if (seatDataA.ip == seatDataB.ip) {
                    item.names.push(seatDataB.nickname);
                    i = j;
                }
            }

            if (item.names.length > 1) {
                list.push(item);
            }
        }

        if (list.length > 0) {

            var str = "";
            for (var i in list) {
                var ip = list[i].ip;
                if (ip.indexOf("::ffff:") != -1) {
                    ip = ip.substr(7);
                }
                str += "[" + ip + "] :" + "\n";
                for (var j in list[i].names) {
                    str += list[i].names[j] + "\n";
                }
                str += "ip相同";
            }
            if(cc.vv.roomMgr.ip_repeat == false)
            // cc.vv.popMgr.alertip_repeat(str);
            cc.vv.popMgr.alertip_repeat(list);
        }
    },

    location:function(type){

        if (!cc.vv.roomMgr.table)return;
        if(cc.vv.roomMgr.started == 1)return;
        if(cc.vv.roomMgr.is_replay)return;

        if(cc.vv.game.config.location){
            this._winHub._Location.getComponent('Location').show(type);
        }
    },

    //坐入，显示
    sit: function (data) {

        var self = this;
           
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        node.getChildByName("Recharge").active = false;
        var tip_anmin = node.getChildByName("Recharge").getChildByName("tip").getComponent(cc.Animation);
        tip_anmin.stop();
        //自己的座位号
        if (data.userid == cc.vv.userMgr.userid) {
            cc.vv.roomMgr.seatid = data.seatid;
            //控制准备按钮隐显
            this._winReady.getComponent("Ready").show(data.status);
        }
        if(cc.vv.roomMgr.param && cc.vv.roomMgr.param.fangzhu == cc.vv.userMgr.userid && data.real == cc.vv.roomMgr.param.start_mode){
            this._winReady.getComponent("Ready").show(data.status,1);
        }
        //更新到table数据
        if (cc.vv.roomMgr.table) {
            cc.vv.roomMgr.table.list[data.seatid] = data;
        }
        if (node == null) return;
        if(viewid == 0){
            node.zIndex = 1;
        }
        node.active = true;
        node.getComponent("Seat").info(data);

        //别人坐入，检查IP
        if (data.userid != cc.vv.userMgr.userid) {
            this.ip_check();
            this.location(true);
        }    
    },

    //给座位发消息
    seat_emit(viewid, name, data) {

        //单发
        if (viewid != null) {
            var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
            if (node == null) return;
            node.emit(name, data);
            return;
        }

        //群发
        for (var i = 0; i < cc.vv.roomMgr.ren; ++i) {
            var node = cc.vv.utils.getChildByTag(this._winPlayer,i);
            if (node == null) continue;
            node.emit(name, data);
        }
    },
    
    //给座位发消息
    seat_img(viewid) {
        var node =  cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        return node.getComponent("Seat").getHeadimg();
    },

    //收取param协议，保存
    param: function (data) {

        cc.vv.roomMgr.real = data.real;
        cc.vv.roomMgr.param = data;

        // 是否允许聊天
        let chatNode = cc.find("mgr/hud/oper/btn_chat",this.node);
        if(chatNode){
            if(!data.hasOwnProperty('is_mute') || data.is_mute ==1){
                chatNode.active = false;
            }
        }
    },

    //桌面信息
    table: function (data) {
        var self = this;
        //数据保存共用
        cc.vv.roomMgr.table = data;

        for (var i = 0; i < cc.vv.roomMgr.ren; ++i) {

            var seat = data.list[i];
            // if (seat.userid == 0) continue;

            var viewid = cc.vv.roomMgr.viewChairID(seat.seatid);
            var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
            if (node == null) continue;

            node.active = true;
            node.getComponent("Seat").info(seat);

            if (seat.userid == 0){
                //如果禁止显示未坐人的坐位
                if (cc.vv.game.config.hide_nothing_seat) {
                    node.active = false;
                }else{
                    node.emit("out", data);
                }
            }
        }

        if(data.stage == 0){
            this.ip_check();
            this.location(true);
        }
    },

    //准备
    ready: function (data) {

        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        if (node == null) return;

        node.getComponent("Seat").ready(true);

        //控制准备按钮隐显
        if (data.userid == cc.vv.userMgr.userid) {
            var status = (data.userid == cc.vv.userMgr.userid) ? 1 : 0;
            this._winReady.getComponent("Ready").show(status);
        }
    },
    //提前开局
    begin: function (data) {

        //房间踢人、准备状态
        if(data){
            cc.vv.roomMgr.started = 1;
            cc.vv.roomMgr.real = data.real;
            cc.vv.roomMgr.now = data.round;
        }

        this._winReady.emit("begin");
        this._winHub.emit("begin");

        //隐藏 kh
        for (var i = 0; i < cc.vv.roomMgr.ren; ++i) {
            var node = cc.vv.utils.getChildByTag(this._winPlayer,i);
            node.emit("begin");
        }
    },

    //在线
    online: function (data) {
        var viewid = cc.vv.roomMgr.viewChairID(data.seat);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        if (node.active) {
            node.getComponent("Seat").lixian(false);
            cc.vv.popMgr.tip(data.name + "回来了");
        }
    },

    //离线
    offline: function (data) {
        var viewid = cc.vv.roomMgr.viewChairID(data.seat);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        if (node.active) {
            node.getComponent("Seat").lixian(true);
            cc.vv.popMgr.tip(data.name + "离线了");
        }
    },

    //收到结算时，隐藏解散房间
    hide_dismiss_room:function(){
        var self = this;
        if (self._winDissroom != null) {
            self._winDissroom.removeFromParent();
            self._winDissroom = null;
            var DismissRoom = this.node.getChildByName("open").getChildByName("DismissRoom");
            if(DismissRoom != null){
                DismissRoom.removeFromParent();
            }
        }else{
        }
        self._dissroom_plase = false;//玩家拒绝解散房间的时候重置
    },

    //解散房间
    dismissroom: function (data) {
        var self = this;
        if (self._winDissroom != null) {
            self._winDissroom.removeFromParent();
        }
    },

    //请求解散房间
    try_dismiss_room: function (data) {
        this.is_disssroom_show = true;
        var self = this;
        if(cc.vv.popMgr.get_open("DismissRoom")){
            this.setClubtipNodeVisible(false);
            return;
        }   

        if(self._winDissroom != null){
            return;
        }

        cc.vv.popMgr.open("DismissRoom", function (obj) {
            self._dissroom_plase=true
            self._winDissroom = obj;
            self._winDissroom.emit("try_dismiss_room", data);
        });
    },

    setClubtipNodeVisible:function(flag){
        var _clubtipnode = this.node.getChildByName("open").getChildByName("Pwb_tips");
        if(_clubtipnode){
            _clubtipnode.active = flag;
        }
    },

    //拒绝解散房间
    refuse_dismiss_room: function (data) {
        var self = this;
        if (self._winDissroom != null) {
            self._winDissroom.removeFromParent();
            self._winDissroom = null;
            var DismissRoom = this.node.getChildByName("open").getChildByName("DismissRoom");
            if(DismissRoom != null){
                DismissRoom.removeFromParent();
            }
        }else{
        }
        self._dissroom_plase = false;//玩家拒绝解散房间的时候重置
        cc.vv.popMgr.alert("玩家 "+data.nickname+ " 拒绝解散房间");
    },

    //同意解散房间
    agree_dismiss_room: function (data) {
        var self = this;
        if (self._winDissroom != null) {
            self._winDissroom.emit("agree_dismiss_room", data);
        }
    },

    playVoice:function(){

        var self = this;
        if(this._playingSeat == null && this._voiceMsgQueue.length){

            cc.vv.audioMgr.pauseAll();

            var data = this._voiceMsgQueue.shift();
            var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
            this._playingSeat = viewid;
            
            this.seat_emit(viewid,"showmg",true);

            var msgfile = "voicemsg.amr";
            cc.vv.voiceMgr.writeVoice(msgfile,data.content);
            cc.vv.voiceMgr.play(msgfile);
            var lastPlayTime = data.time; 

            setTimeout(() => {
                cc.vv.audioMgr.resumeAll();
                this.seat_emit(viewid,"showmg",false);
                self.playVoice();
                self._playingSeat = null;
            }, lastPlayTime + 500);
        }
    },

    //语音
    voice: function (data) {
        this._voiceMsgQueue.push(data);
        this.playVoice();
    },

    //语音文字
    chat: function (data) {
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        node.getComponent("Seat").chat(data.content);
    },
    
    onDestroy:function(){
        cc.vv.voiceMgr.stop();
//      cc.vv.voiceMgr.onPlayCallback = null;
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);
    },
    //快捷语音
    yuyin: function (data) {
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        node.getComponent("Seat").chat(data.content);

        var sex = cc.vv.roomMgr.userSex(data.seatid);
        var sound = cc.vv.game.config.chat_path + "/effect/" + sex + "/chat_" + data.index;
        cc.vv.audioMgr.playSFX(sound);
    },

    //表情
    biaoqing:function(data){
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        node.getComponent("Seat").emoji(data);
    },

    //互动
    interact:function(data){
        var self=this;
        var from_seat = data.seatid;
        var to_seat = data.receiver_seatid;
        var interaction=new cc.Node("interactionNode");
        const emoji = interaction.addComponent(cc.Sprite)  
        emoji.spriteFrame= this.interactAtlas.getSpriteFrame("interact_" +data.phiz_id );
        this._winPlayer.addChild(interaction);

        var pos = cc.vv.game.config["player_" + cc.vv.roomMgr.ren];

        var v_from_seat = cc.vv.roomMgr.viewChairID(from_seat);
        var v_to_seat = cc.vv.roomMgr.viewChairID(to_seat);

        interaction.x = pos[v_from_seat].x;
        interaction.y = pos[v_from_seat].y;
        interaction.runAction(cc.sequence(
            cc.moveTo(0.5,cc.v2(pos[v_to_seat].x, pos[v_to_seat].y)),
            cc.callFunc(function () {
                interaction.removeFromParent();
                var node = cc.vv.utils.getChildByTag(self._winPlayer,v_to_seat);
                node.getComponent("Seat").interact(data);
            },self),
        ));

        
    },
    //房间状态
    //不为0，说明已经开局，置为开局状态
    stage: function (data) {
        // if (data.stage != 0) {
        //     this.begin(data);
        // }
        var self = this;
        if(!this.is_disssroom_show){
            if (self._winDissroom != null) {
                self._winDissroom.removeFromParent();
                self._winDissroom = null;
                var DismissRoom = this.node.getChildByName("open").getChildByName("DismissRoom");
                if(DismissRoom != null){
                    DismissRoom.removeFromParent();
                }
            }
        }
    },

    //房间状态 对应麻将
    game_sync_push: function (data) {
        // if (data.stage != 0) {
        //     this.begin(data);
        // }
    },

    //根据选择分享不同内容
    share: function (type) {
        var platform = parseInt(type);
        cc.vv.log3.info("----------------"+type)
        switch(platform){
            case 1:
            case 3:
            case 4:
            { 
                //截图分享
                cc.vv.g3Plugin.screenShare(platform,function(code,msg){
                })
            }
            break;  
        }
    },
    watch_game:function(){
        var is_watch = false;
        if(cc.vv.roomMgr.guanzhan_table==null){
            return false;
        }
        var table_list = cc.vv.roomMgr.guanzhan_table.list;
        for(var i = 0;i < table_list.length;i++){
            if(table_list[i].userid != 0 && table_list[i].userid == cc.vv.userMgr.userid){
                is_watch = true;
                return is_watch;
            }
        }
        
        return is_watch;
    },
    look_watch:function(flag){
        cc.vv.log3.info("观战")
        if(this.node.getChildByName("open").getChildByName("watch_list_view")){
            cc.vv.log3.info("有观战！！！")
            this.node.getChildByName("open").getChildByName("watch_list_view").active = flag;
        }
    },
    //公共按钮
    onBtnClicked: function (event, data) {
        cc.vv.audioMgr.click();
        var self = this;
        switch (event.target.name) {
            case "look_watch":
            {
                this.look_watch(true);
            }
            break;
            case "btn_watch":
            {
                cc.vv.net2.quick("watch");
            }
            case "btn_onMore":
            {
                cc.vv.net2.quick("leave");
                cc.vv.roomMgr.is_return = true;
            }
            break;
            case "btn_ready":
                { 
                    if (cc.vv.roomMgr.is_end()) {
                        cc.vv.net2.quick("report");
                        cc.vv.roomMgr.isend = true;
                    } else {
                        if(cc.vv.roomMgr.dissroom != null){
                            if(cc.vv.roomMgr.dissroom == 1){
                                cc.vv.net2.quick("report");
                                this.node.getChildByName("report").getChildByName("jiesuan").active = false;
                                if(cc.vv.roomMgr._minmoney == true){
                                    this.setClubtipNodeVisible(true);
                                    var _clubtipnode = self.node.getChildByName("open").getChildByName("Pwb_tips");
                                    if(_clubtipnode == null){
                                        cc.vv.net2.quick("ready");
                                        return;
                                    }
                                    _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                                    return;
                                }
                            }else{
                                var is_watch = this.watch_game();
                                if(is_watch){
                                    this.node.getChildByName("report").getChildByName("jiesuan").active = false;
                                    return;
                                }
                                if(cc.vv.roomMgr._minmoney == true){
                                    this.setClubtipNodeVisible(true);
                                    var _clubtipnode = self.node.getChildByName("open").getChildByName("Pwb_tips");
                                    if(_clubtipnode == null){
                                        cc.vv.net2.quick("ready");
                                        return;
                                    }
                                    _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                                    return;
                                }
                                cc.vv.net2.quick("ready");
                                if(cc.vv.roomMgr.started == 1){
                                    this.node.getChildByName("report").getChildByName("jiesuan").active = false;
                                }
    
                            }
                        }else{
                            var is_watch = this.watch_game();
                            if(is_watch){
                                this.node.getChildByName("report").getChildByName("jiesuan").active = false;
                                return;
                            }
                            if(cc.vv.roomMgr._minmoney == true){
                                this.setClubtipNodeVisible(true);
                                var _clubtipnode = self.node.getChildByName("open").getChildByName("Pwb_tips");
                                if(_clubtipnode == null){
                                    cc.vv.net2.quick("ready");
                                    return;
                                }
                                _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                                return; 
                            }
                            cc.vv.net2.quick("ready");
                            if(cc.vv.roomMgr.started == 1){
                                this.node.getChildByName("report").getChildByName("jiesuan").active = false;
                            }

                        }
                        
                    }
                }
                break;
            case "btn_exit":
                {
                    cc.vv.net2.quick("leave",{
                        room_id: cc.vv.roomMgr.roomid
                    });
                }
                break;
            case "btn_share":
                {
                    cc.vv.popMgr.open("ShareReport", function (obj) {
                        obj.getComponent("Share").share(self.share);
                    });
                }
                break;
                case "btn_rule":{
                    var type = cc.vv.roomMgr.room_type.replace('_','');
                    cc.vv.popMgr.open("table/gameWanfa", function (obj) {
                        obj.getComponent("gameWanfa").onLoadHelp(type);
                    });
                }
                break;
            default:
                {
                    cc.vv.popMgr.alert("你点的啥，我啥不知道呢");
                }
        }
    },
    guanZhanTable:function(data){
        cc.vv.roomMgr.guanzhan_table = data;
        var table_list =cc.vv.roomMgr.guanzhan_table.list;
        cc.vv.popMgr.del_open("watch_list_view");
        cc.vv.popMgr.open("table_public/watch_list_view", function (obj) {
            obj.getComponent("watch_list_view").show_list(table_list);
        });
    },
    //离开房间
    leave: function (data) {
        if(data.userid == cc.vv.userMgr.userid){
            this.backhall();
            return;
        }
        if(data.seatid == 255){
            return;
        }
        if(!cc.vv.roomMgr.table){
            return;
        }
        if(data.seatid == -1)return;
        cc.vv.roomMgr.table.list[data.seatid].userid = 0;
        cc.vv.roomMgr.table.list[data.seatid].sitStatus = -1;
        this.location(false);
        var viewid = cc.vv.roomMgr.viewChairID(data.seatid);
        var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
        node.emit("out", data);

        //如果禁止显示未坐人的坐位
        if (cc.vv.game.config.hide_nothing_seat) {
            node.active = false;
        }
    },

    //房主踢人
    out: function (data) {
        cc.vv.popMgr.tip(data.name + " 被房主移出");
    },

    //返回大厅
    backhall: function () {
        if(cc.vv.roomMgr.guanzhan_table){
            cc.vv.roomMgr.guanzhan_table.list = [];  
        }
        if(!this.is_replay){
            cc.vv.net2.close();
        }
        
        cc.director.loadScene("hall");
    },
    joinRoom:function(data){
        if(data.userid == cc.vv.userMgr.userid){
            var sit = this.node.getChildByName("sit");
            if(data.canSit.length == 0){
                sit.active = false;
            }else{
                sit.active = true;
            }
        }
    },
    Lack_pwb:function(){
        cc.vv.popMgr.alert("胜点不足请联系圈主加胜点，是否申请加胜点？",function(){
            cc.vv.net2.quick("club_invite_add_pwb",{club_id :cc.vv.roomMgr.clubid});
        },true)
    },
    //监听协议
    initEventHandlers: function () {
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        //初始化事件监听器
        var self = this;
        //收到消息代表代表 游戏桌的四人 排位币胜点足够。
        this.node.on('joinRoom',function(data){
            self.joinRoom(data.data);
        });

        //收到消息代表代表 游戏桌的四人 排位币胜点足够。
        this.node.on('needSit',function(data){
            //self.needSit(data.data);
        });

        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.is_disssroom_show = false;
        });
        //俱乐部的时候提示 玩家 胜点不足 
        this.node.on('pwb_limit',function(info){
            var datalist = info.data;
            var is_true = false;
            var count = 0;
            for(var j = 0;j < datalist.users.length;j++){//循环遍历排位币不足的玩家，并显示充值中提示
                var seatid = cc.vv.roomMgr.getSeatIndexByID(datalist.users[j].userid);
                var viewid = cc.vv.roomMgr.viewChairID(seatid);
                var play_node = cc.vv.utils.getChildByTag(self._winPlayer,viewid);
                var Recharge_node =  play_node.getChildByName("Recharge")
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
            if(!is_true){
                return;
            }
            if(cc.vv.popMgr.get_open("Pwb_tips")){
                self._endTime = info.data.time;
                var _clubtipnode = self.node.getChildByName("open").getChildByName("Pwb_tips");
                self._surplus_time_lbl = _clubtipnode.getChildByName("time").getComponent(cc.Label);
                _clubtipnode.active = true;
                _clubtipnode.getChildByName("btn_back").active = true;
                _clubtipnode.getChildByName("new_tis").active = false;
                
                _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                _clubtipnode.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content").removeAllChildren();
                var btn_apply = _clubtipnode.getChildByName("btn_list").getChildByName("btn_apply");
                var btn_exit= _clubtipnode.getChildByName("btn_list").getChildByName("btn_exit");
                var btn_watch = _clubtipnode.getChildByName("btn_list").getChildByName("btn_watch");
                btn_watch.active = cc.vv.game.config.show_watch_btn;
                btn_exit.active = false; 
                btn_apply.active = true;
                for(var j = 0;j < info.data.users.length;j++){
                    var seatid = cc.vv.roomMgr.getSeatIndexByID(datalist.users[j].userid);
                    var viewid = cc.vv.roomMgr.viewChairID(seatid);
                    if(datalist.users[j].userid != cc.vv.userMgr.userid){
                        continue;
                    }
                    var tiplbl = cc.instantiate(self.club_tip);
                    var tip_name = tiplbl.getChildByName("tip_name");
                    var tip_pwb = tiplbl.getChildByName("tip_lbl");
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
                _clubtipnode.getChildByName("btn_list").getChildByName("btn_qipai").active = false;
                _clubtipnode.getChildByName("new_tis").active = false;
                self._surplus_time_lbl = _clubtipnode.getChildByName("time").getComponent(cc.Label);
                if(cc.vv.roomMgr.started == 0){
                    _clubtipnode.active = true;
                }else{
                    _clubtipnode.active = false; 
                }
                _clubtipnode.getChildByName("btn_back").active = true;
                var btn_apply= _clubtipnode.getChildByName("btn_list").getChildByName("btn_apply");
                var btn_exit= _clubtipnode.getChildByName("btn_list").getChildByName("btn_exit");
                btn_exit.active = false; 
                btn_apply.active = true;

                var btn_watch = _clubtipnode.getChildByName("btn_list").getChildByName("btn_watch");
                btn_watch.active = cc.vv.game.config.show_watch_btn;;
                btn_apply.on(cc.Node.EventType.TOUCH_START,function(){          
                    cc.vv.net2.quick("club_invite_add_pwb",{club_id :cc.vv.roomMgr.clubid});
                    cc.vv.popMgr.tip("发送申请成功!");
                    btn_apply.active = false;
                });
                btn_watch.on(cc.Node.EventType.TOUCH_START,function(){          
                    cc.vv.net2.quick("watch");
                    _clubtipnode.active = false;
                });
                btn_exit.on(cc.Node.EventType.TOUCH_START,function(){          
                    cc.vv.popMgr.alert("房间已开局,是否确认要申请解散？",function(){
                        cc.vv.net2.quick("try_dismiss_room");
                    },true)
                });
                _clubtipnode.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content").removeAllChildren();
                for(var j = 0;j < data.data.users.length;j++){
                    var seatid = cc.vv.roomMgr.getSeatIndexByID(datalist.users[j].userid);
                    var viewid = cc.vv.roomMgr.viewChairID(seatid);
                    if(datalist.users[j].userid != cc.vv.userMgr.userid){
                        continue;
                    }
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
        });
        //收到消息代表代表 游戏桌的四人 排位币胜点足够。
        this.node.on('club_user_up_pwb',function(data){  
            cc.vv.roomMgr._minmoney = false;
            self._endTime = -1;
            if(self.node.getComponent('YSZ2300Game') != null){
                self.node.getComponent('YSZ2300Game').endTime();  
            }
            self.setClubtipNodeVisible(false);
        });
        //收到消息代表代表 游戏桌的四人 排位币胜点足够。
        this.node.on('Lack_pwb',function(data){  
            self.Lack_pwb(data.data);
        });
        //管理员收到申请加币的消息弹出加币框
        this.node.on('invite_notice_add_pwb',function(info){
            if(info.model=="hall")return;
            cc.vv.popMgr.open("hall/GameAddPwb", function (obj,data){
                obj.getComponent("GameInAddPwb").info(data);
                obj.myTag = data.data.club_id + "-" + data.data.playerid;
            },info);
        });
        this.node.on('club_user_pwb', function (ret) {
            var open = self.node.getChildByName("open");
            var data = ret.data;
            cc.vv.popMgr.hide();
            if(data.errcode < 0){
                cc.vv.popMgr.tip(data.errmsg);
            }
          
            if(cc.vv.popMgr.get_open("GameAddPwb")){
                for (var i = open.children.length -1; i >0 ; --i) {
                    if(open.children[i].myTag == data.clubid + "-" + data.userid){
                        open.children[i].removeFromParent();
                    }
                }
            }
        });
        //在游戏收到 添加排位币消息
        this.node.on('room_pwb_change',function(data){ 
            var seatid = cc.vv.roomMgr.getSeatIndexByID(data.data.userid);
            if(seatid == -1){
                return;
            }
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            var node = cc.vv.utils.getChildByTag(self._winPlayer,viewid);
            if (node == null) return;
            if(cc.vv.popMgr.get_open("Pwb_tips")){
               self.node.getChildByName("open").getChildByName("Pwb_tips").active = false;
            }

            var table_list = cc.vv.roomMgr.table.list;
            table_list[seatid].score = cc.vv.utils.numFormat(parseFloat(data.data.pwb));
            var Recharge = node.getChildByName("Recharge");
            if(Recharge != null){
                Recharge.active = false;
                var tip_anmin = Recharge.getChildByName("tip").getComponent(cc.Animation);
                tip_anmin.stop();
            }
            node.getComponent("Seat").change_pwb(cc.vv.utils.numFormat(parseFloat(data.data.pwb) - parseFloat(data.data.lock)));
        });
        
        //游戏进入后台
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.vv.net2.quick("enter_back",{type:1});
        }); 
        //离线重连 房间不在了 离开房间
        this.node.on('noRoom',function(data){
            cc.vv.popMgr.hide();
            cc.vv.popMgr.alert("房间已经不存在了",function(){
                self.backhall();
            });
        }),
        //游戏进入前台
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.vv.net2.quick("enter_back",{type:0});

            var viewid = 0;
            var node = cc.vv.utils.getChildByTag(self._winPlayer,viewid);
            if (node && node.active) {
                node.getComponent("Seat").lixian(false);
            }
        });

        //坐到位置
        this.node.on('sit', function (ret) {
            var data = ret.data;
            if(self.node.getChildByName("sit")){
                if(data.userid == cc.vv.userMgr.userid){
                    self.node.getChildByName("sit").active = false;
                } 
            } 
       
            cc.vv.roomMgr.real = data.real;
            //进房失败，返回大厅
           if(ret.errcode == -99){
                cc.vv.popMgr.alert("" + ret.errmsg,function(){
                    cc.director.loadScene("hall");
                });
                return
            }else  if (ret.errcode != 0) {
                cc.vv.popMgr.alert(ret.errmsg, function () {
                    // self.backhall();
                });
                return;
            }
            self.sit(data);
        });

        //桌面信息
        this.node.on('fangzhu', function (ret) {
            var data = ret.data;
            self._winReady.getComponent("Ready").fangzhu(data);
        });

        //桌面信息
        this.node.on('power', function (ret) {
            self._winHub.emit("power");
        });

        //桌面信息
        this.node.on('network', function (ret) {
            self._winHub.emit("network");
        });

        //桌面信息
        this.node.on('param', function (ret) {
            self.param(ret.data);
        });

        //桌面信息
        this.node.on('table', function (ret) {
            self.table(ret.data);
        });
        //观战信息
        this.node.on('guanZhanTable', function (ret) {
            self.guanZhanTable(ret.data);
        });

        
        //当局信息
        this.node.on('stage', function (ret) {
            self.stage(ret.data);
        });

        //房间结束
        this.node.on('report', function (ret) {
            if(cc.vv.roomMgr.guanzhan_table){
                cc.vv.roomMgr.guanzhan_table.list = [];  
            }
            cc.vv.roomMgr.started = 0;
        });

        //当局信息 麻将
        this.node.on('game_sync_push', function (ret) {
            self.game_sync_push(ret.data);
        });

        //准备
        this.node.on('ready', function (ret) {
            self.ready(ret.data);
        });
        this.node.on('game_num_push',function(data){
            data = data.data;
            cc.vv.roomMgr.now = data.numOfGames;
            self._winHub.emit("round");
        });

        this.node.on("leave", function (ret) {
            var data = ret.data;
            cc.vv.roomMgr.real = data.real;
            //进房失败，返回大厅
            if (ret.errcode != 0) {
                cc.vv.popMgr.alert(ret.errmsg, function () {
                    self.backhall();
                });
                return;
            }
            self.leave(data);
        });

        //准备
        this.node.on('out', function (ret) {

            //进房失败，返回大厅
            if (ret.errcode != 0) {
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            self.out(ret.data);
        });

        //开局
        this.node.on('begin', function (ret) {

            var data = ret;

            if (data.errcode != 0) {
                cc.vv.popMgr.alert(data.errmsg);
                return;
            }

            self.begin(ret.data);
        });

        //拒绝解散房间
        this.node.on('refuse_dismiss_room', function (ret) {
            self.refuse_dismiss_room(ret.data);
        });

        //同意解散房间
        this.node.on('agree_dismiss_room', function (ret) {
            self.agree_dismiss_room(ret.data);
        });

        //发起解散房间
        this.node.on('try_dismiss_room', function (ret) {
            self.try_dismiss_room(ret.data);
        });

        this.node.on('dismissroom', function t(ret) {
            self.dismissroom(ret.data);
        });

        //快捷语音
        this.node.on('voice', function (ret) {
            self.voice(ret.data);
        });

        //聊天
        this.node.on('chat', function (ret) {
            self.chat(ret.data);
        });

        //语音
        this.node.on('yuyin', function (ret) {
            self.yuyin(ret.data);
        });

        //表情
        this.node.on('biaoqing', function (ret) {
            self.biaoqing(ret.data);
        });

        //玩家离线
        this.node.on('offline', function (ret) {
            self.offline(ret.data);
        });

        //玩家上线
        this.node.on('online', function (ret) {
            self.online(ret.data);
        });

        //互动
        this.node.on('interact', function (ret) {
            self.interact(ret.data);
        });
    },
    //抢庄
    dingzhuang:function(data, callback){
        var self = this;

        //{"errcode":0,"data":{"seatid":1,"power":0,"list":{"0":1,"1":1,"2":0,"3":0,"4":0},"userid":12193},"errmsg":"ok","model":"game","event":"dingzhuang"}
        //抢庄动画
        var listall = [];
        var list = data.list;
        var seatid = data.seatid;
        var lastindex = 0;
        for (const key in list) {
            if(list[key] == 1){
                var viewid = cc.vv.roomMgr.viewChairID(parseInt(key));
                var node = cc.vv.utils.getChildByTag(this._winPlayer,viewid);
                listall.push(node);
            }
        }
        
        var lengthone = listall.length;
        if(lengthone == 0){
            callback();
            return;
        }
        lengthone = listall.length;
        for (var index = 0; index < lengthone; index++) {
            if(listall[index] == seatid + "")
            {
                lastindex = index;
            }
            
        }
        //动画播放次数
        var lengthtwo = lengthone * 2 + lastindex;
        this.dingzhuangAnimation(listall, lengthtwo, callback);
    },

    //抢庄动画 list:控件数组 count:动画播放多少次
    dingzhuangAnimation:function(list, count, callback){
      
        var self = this;
        var time = 50;
        function animation(index,indextwo){
            setTimeout(() => {
                if(self._senceTableDestroy){
                    return;
                }
                //音效
                list[indextwo].getComponent("Seat").liangkuang(true);
                self.soundDingzhuang();
            }, time * index * 4);

            setTimeout(() => {
                if(self._senceTableDestroy){
                    return;
                }
                list[indextwo].getComponent("Seat").liangkuang(false);
            }, time * (index * 4 + 2));
        }
        //控件长度
        var length = list.length;
        for (var index = 0; index < count; index++) {
            var value = index % length;
            for (var indextwo = 0; indextwo < length; indextwo++) {
                if(value == indextwo){
                    animation(index,indextwo)
                }
                if(index == count - 1 && indextwo == length - 1){
                    setTimeout(() => {
                        callback();
                    }, time * (index * 4 + 3));
                }
            }
        }
    },
    //按钮点击音效
    soundDingzhuang:function(){
        var mp3File = "nn/qiangzhuang";
        cc.vv.audioMgr.playSFX(mp3File);
    },
    //界面关闭时
    onDestroy:function(){
        this._senceTableDestroy = true;
    }
});