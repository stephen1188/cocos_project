cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
    },
    
    dispatchEvent(event,data){
        if(this.dataEventHandler){
            // cc.log("dataEventHandler = ", this.dataEventHandler);
            this.dataEventHandler.emit(event,data);
            this.dataEventHandler.emit("other",data);
        }else{
            cc.vv.log3.error('---------------------');
        }
    },

    unlink:function(data){
        cc.vv.popMgr.alert(data.errmsg,function(){
            cc.game.end();
        });
    },

    /**
     * 大厅协议
     */
    hall:function(data){ 
        // cc.log('data hall = ', data);
        var self = this;
        switch(data.event){
            //初始化
            case "init":{

                if(cc.director.getScene().name != 'hall'){
                    cc.vv.popMgr.hide();
                }
                
                // ---------- TODO 这个动态可废弃----------
                data.data.sign = 'sd49KylCxsHxK59z'
                cc.SIGN['hall'] = 'sd49KylCxsHxK59z'//data.data.sign;
                cc.NET_KEY['hall'] = 'sd49KylCxsHxK59z'//data.data.sign.substr(2,16);

                self.dispatchEvent(data.event,data);
            }
            break;
            //踢下线
            case "unlink":{
                self.unlink(data);
            }
            break;
            //弹出快讯
            case "new":{
                cc.vv.popMgr.kuaixun(data.errmsg);
            }
            break;
            case "dealer":{             //代理变更
                cc.vv.userMgr.is_dealer = data.data.is_dealer;
                if(cc.vv.userMgr.is_dealer == 1){
                    cc.vv.popMgr.tip('您已经是代理');
                }
                else{
                    cc.vv.popMgr.tip('您已经不是代理');
                }
            }
            break;
            //属性变更
            case "property":{
                if(data.errcode === 0){
                    var ret = data.data;
                    cc.vv.userMgr.lv = ret.lv;
                    cc.vv.userMgr.coins = ret.coins;
                    cc.vv.userMgr.gems = ret.gems;
                    cc.vv.userMgr.daikai = ret.daikai;
                    cc.vv.userMgr.ticket = ret.ticket;
                    cc.vv.userMgr.is_dealer = ret.is_dealer;
                    self.dispatchEvent("hall_property",data);
                }
            }
            break;
            default:{
                self.dispatchEvent(data.event,data);
            }
            break;
        }
    },

    /**
     * 大厅协议
     */
    game:function(data){
        // cc.log('data game = ', data);
        var self = this;

        switch(data.event){
              //震动监听
            case "shake":{  
                if(cc.vv.userMgr.is_shake){
                    cc.vv.g3Plugin.vibrate(1000);
                }
            }
            break;
            //初始化
            case "init":{
                data.data.sign = 'sd49KylCxsHxK59z'
                cc.SIGN['game'] = 'sd49KylCxsHxK59z'//data.data.sign;
                cc.NET_KEY['game'] = 'sd49KylCxsHxK59z'//data.data.sign.substr(8,16);
                var enter = {
                    method:"enter",
                    data:{
                        user_id:cc.vv.userMgr.userid,
                        room_id:cc.vv.roomMgr.roomid,
                        club_id:cc.vv.roomMgr.clubid,
                        token:cc.vv.userMgr.token,
                        location:cc.vv.global.latitude + "," + cc.vv.global.longitude,
                    }
                };

                cc.vv.net2.send(enter);
            }
            break;
            //进入成功
            case "enter":{

                if(data.errcode !=0){
                    cc.vv.popMgr.alert(data.errmsg);
                    cc.vv.popMgr.hide();
                    // if(cc.director.getRunningScene().name != 'hall'){
                        cc.director.loadScene("hall");
                    // }
                    return;
                }
                cc.vv.roomMgr._minmoney = false;
                cc.vv.roomMgr.enter = data.data;
                cc.vv.roomMgr.ren = data.data.ren;
                cc.vv.roomMgr.now = data.data.round;
                cc.vv.roomMgr.max = data.data.max_round;
                cc.vv.roomMgr.clubid = data.data.clubid;

                //不是在回放
                cc.vv.roomMgr.is_replay = false;
                if(cc.vv.club.roomPool != null){
                    cc.vv.club.roomPool.clear();
                }
               
                cc.director.loadScene(cc.vv.roomMgr.room_type);
            }
            break;
            //踢下线
            case "unlink":{
                self.unlink(data);
            }
            break;
            //弹出快讯
            case "new":{
                cc.vv.popMgr.kuixun(data.errmsg);
            }
            break;
            default:{
                self.dispatchEvent(data.event,data);
            }
            break;
        }
    },

    clear:function(){
        this.dataEventHandler = null;
    },

    initHandlers:function(){

        var self = this;
        self.connectNum = 0;
        self.tipTxt = "正在连接服务器"

        /**
         * 监听大厅模块
         */
        cc.vv.net1.addHandler("hall",function(data){
            self.hall(data);
        });

        /**
         * 监听游戏模块
         */
        cc.vv.net2.addHandler("game",function(data){
            self.game(data);
        });
    },
    
    connectGameServer:function(ip){
        cc.log('链接到游戏服务器11122');
        cc.vv.net2.ip = ip;
        cc.vv.net2.type = "game";
        cc.NET_KEY['game'] = cc.DEF_KEY;
        var self = this;

        var onConnectOK = function(){
            var init = {
                method:"init",
                data:{
                }
            };
            cc.vv.net2.send(init);
        };
        
        var onConnectFailed = function(){
            cc.vv.popMgr.alert("服务器连接失败");
        };
        cc.log('链接到游戏服务器111');
       
        cc.vv.net2.close();
        cc.vv.net2.connect(onConnectOK,onConnectFailed);
    },

    //连接大厅服务器
    connectHallServer:function(callback){
        var self = this;
        if(cc.vv.connceNum == 0){
            self.tipTxt = "正在连接服务器";
        }else{
            self.tipTxt = "网络错误 正在重新链接...";
        }
        cc.vv.popMgr.wait2(self.tipTxt,function(node){cc.vv.popMgr.hide();})
        // cc.log("cc.vv.connceNum = ", cc.vv.connceNum);
        // cc.log("cc.vv.hallServerArr = ", cc.vv.hallServerArr);

        var hallserverip = cc.vv.hallServerArr[cc.vv.connceNum];
     
        cc.vv.net1.ip = hallserverip;
        // console.log("连接ip多少：",cc.vv.net1.ip)
        cc.vv.net1.type = "hall";
        cc.NET_KEY['hall'] = cc.DEF_KEY;

        // console.log("多少？",cc.vv.connceNum+" "+ cc.vv.isLoginScene)
        var onConnectOK = function(){
            var init = {
                method:"init",
                data:{
                }
            };
            cc.vv.net1.send(init);
            if(typeof callback === "function") { 
                callback();
            }
        };
        
        var onConnectFailed = function(){
         
        };
       
        cc.vv.net1.close();
        cc.vv.net1.connect(onConnectOK,onConnectFailed);
    },

    getHallServerIndex:function(){
        var hallserverLength = cc.vv.hallServerArr.length;
        var index = 0;
        index = Math.floor(Math.random() * hallserverLength);
        cc.vv.log3.debug("index: " + index);
        return index;
    }
});
